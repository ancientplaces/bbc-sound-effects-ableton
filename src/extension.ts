import * as fs from "fs/promises";
import * as path from "path";
import * as https from "https";
import * as os from "os";
import { createWriteStream } from "fs";
import {
  initialize,
  AudioTrack,
  ClipSlot,
  Simpler,
  type ActivationContext,
  type Handle,
} from "@ableton-extensions/sdk";
import dialogHtml from "./dialog.html";

// ── Types ──────────────────────────────────────────────────────────────────────

type ExtensionContext = ReturnType<typeof initialize<"1.0.0">>;

interface DialogResult {
  id: string;
  description: string;
  duration: number;
  format: "wav" | "mp3";
  mode?: "clip" | "simpler"; // injected before showing dialog
}

interface ArrangementSelectionArg {
  time_selection_start: number;
  time_selection_end: number;
  selected_lanes: Handle[];
}

function isArrangementSelection(arg: unknown): arg is ArrangementSelectionArg {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "selected_lanes" in arg &&
    Array.isArray((arg as ArrangementSelectionArg).selected_lanes)
  );
}

// ── Filename helpers ───────────────────────────────────────────────────────────

function sanitizeFilename(input: string, maxLength = 80): string {
  return (
    input
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^[._]+|[._]+$/g, "")
      .slice(0, maxLength) || "bbc_sound"
  );
}

async function findExistingDownload(
  dir: string,
  id: string,
): Promise<string | null> {
  try {
    const entries = await fs.readdir(dir);
    const match = entries.find((e) => e.startsWith(id + "."));
    return match ? path.join(dir, match) : null;
  } catch {
    return null;
  }
}

// ── HTTPS download ─────────────────────────────────────────────────────────────

async function downloadFile(
  url: string,
  dest: string,
  signal: AbortSignal,
): Promise<void> {
  await fs.mkdir(path.dirname(dest), { recursive: true });

  return new Promise<void>((resolve, reject) => {
    const file = createWriteStream(dest);

    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.destroy();
        reject(new Error(`HTTP ${res.statusCode} downloading from BBC`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", reject);
    });

    req.on("error", reject);

    signal.addEventListener("abort", () => {
      req.destroy();
      file.destroy();
      reject(new DOMException("AbortError", "AbortError"));
    }, { once: true });
  });
}

// ── Clip placement helpers ─────────────────────────────────────────────────────

function findFirstEmptySlot(track: AudioTrack<"1.0.0">): ClipSlot<"1.0.0"> | null {
  return track.clipSlots.find((s) => s.clip === null) ?? null;
}

function findArrangementEnd(track: AudioTrack<"1.0.0">): number {
  const clips = track.arrangementClips;
  if (clips.length === 0) return 0;
  return Math.max(...clips.map((c) => c.endTime));
}

// ── Shared dialog launcher ─────────────────────────────────────────────────────

async function showSearchDialog(
  context: ExtensionContext,
  mode: "clip" | "simpler",
): Promise<DialogResult | null> {
  // Prepend a unique comment to bust WebView caching, then inject mode
  const modeScript = `<script>window.BBC_MODE=${JSON.stringify(mode)};<\/script>`;
  const html = `<!-- ${Date.now()} -->` + dialogHtml.replace("</head>", modeScript + "</head>");

  let raw: string;
  try {
    raw = await context.ui.showModalDialog(
      `data:text/html,${encodeURIComponent(html)}`,
      600,
      460,
    );
  } catch {
    return null; // cancelled
  }

  try {
    return JSON.parse(raw) as DialogResult | null;
  } catch {
    return null;
  }
}

// ── Shared download helper ─────────────────────────────────────────────────────

async function downloadSound(
  result: DialogResult,
  soundsDir: string,
  signal: AbortSignal,
  update: (msg: string, pct: number) => Promise<void>,
): Promise<string> {
  const ext = result.format === "wav" ? "wav" : "mp3";
  const url = `https://sound-effects-media.bbcrewind.co.uk/${ext}/${result.id}.${ext}`;
  const destPath = path.join(soundsDir, `${result.id}.${ext}`);

  const existing = await findExistingDownload(soundsDir, result.id);
  if (existing) {
    await update("File already downloaded, reusing…", 50);
    return existing;
  }

  await update(`Downloading ${ext.toUpperCase()}…`, 15);
  signal.throwIfAborted();
  await downloadFile(url, destPath, signal);
  await update("Download complete…", 60);
  return destPath;
}

// ── Error dialog ───────────────────────────────────────────────────────────────

function makeErrorHtml(message: string): string {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<script>
  function close() {
    var msg = { method: "close_and_send", params: [JSON.stringify(null)] };
    if (window.webkit?.messageHandlers?.live) window.webkit.messageHandlers.live.postMessage(msg);
    else if (window.chrome?.webview) window.chrome.webview.postMessage(msg);
  }
<\/script>
<style>
  :root { --bg: #292929; --text: #c8c8c8; --accent: #cc3333; }
  html,body { background:var(--bg); color:var(--text); font-family:'Lucida Grande',sans-serif;
    font-size:12px; margin:0; height:100vh; display:flex; align-items:center; justify-content:center; }
  .wrap { padding:24px; max-width:420px; }
  p { margin:0 0 18px; line-height:1.6; white-space:pre-wrap; }
  button { background:var(--accent); color:#fff; border:none; padding:6px 16px;
    font-family:inherit; font-size:12px; cursor:pointer; border-radius:2px; }
</style></head><body>
  <div class="wrap"><p>${escaped}</p><div style="text-align:right"><button onclick="close()">OK</button></div></div>
</body></html>`;
}

async function showError(context: ExtensionContext, message: string) {
  try {
    await context.ui.showModalDialog(
      `data:text/html,${encodeURIComponent(makeErrorHtml(message))}`,
      480, 200,
    );
  } catch { /* dismissed */ }
}

// ── Extension entry point ──────────────────────────────────────────────────────

export async function activate(activation: ActivationContext) {
  const context: ExtensionContext = initialize(activation, "1.0.0");

  // ── Audio Track: drop as clip ──────────────────────────────────────────────

  for (const scope of ["AudioTrack", "AudioTrack.ArrangementSelection"] as const) {
    context.ui.registerContextMenuAction(scope, "BBC Sound Effects…", "bbc.open-clip");
  }

  context.commands.registerCommand("bbc.open-clip", async (arg: unknown) => {
    console.log("[bbc-sound-effects] Audio track mode triggered");

    let track: AudioTrack<"1.0.0">;
    let arrangementStartTime: number | null = null;

    if (isArrangementSelection(arg)) {
      if (!arg.selected_lanes?.length) {
        await showError(context, "No track lane selected.");
        return;
      }
      try {
        track = context.getObjectFromHandle(arg.selected_lanes[0], AudioTrack);
        arrangementStartTime = arg.time_selection_start;
      } catch {
        await showError(context, "Could not resolve track. Right-click an Audio Track lane.");
        return;
      }
    } else {
      try {
        track = context.getObjectFromHandle(arg as Handle, AudioTrack);
      } catch {
        await showError(context, "Could not resolve track. Right-click an Audio Track.");
        return;
      }
    }

    const soundsDir = path.join(
      context.environment.storageDirectory ?? path.join(os.homedir(), ".bbc-sound-effects"),
      "sounds",
    );

    const result = await showSearchDialog(context, "clip");
    if (!result) return;

    try {
      await context.ui.withinProgressDialog(
        "BBC Sound Effects",
        { progress: 0 },
        async (update, signal) => {
          signal.throwIfAborted();
          await update("Preparing download…", 10);

          const filePath = await downloadSound(result, soundsDir, signal, update);

          signal.throwIfAborted();
          await update("Creating audio clip…", 85);

          const clipName = sanitizeFilename(result.description, 64);
          let clip;

          if (arrangementStartTime !== null) {
            clip = await context.withinTransaction(() =>
              track.createAudioClip({ filePath, startTime: arrangementStartTime!, isWarped: true }),
            );
          } else {
            const slot = findFirstEmptySlot(track);
            clip = slot
              ? await context.withinTransaction(() =>
                  slot.createAudioClip({ filePath, isWarped: true }),
                )
              : await context.withinTransaction(() =>
                  track.createAudioClip({
                    filePath,
                    startTime: findArrangementEnd(track),
                    isWarped: true,
                  }),
                );
          }

          context.withinTransaction(() => { clip.name = clipName.slice(0, 64); });
          await update("Done!", 100);
          console.log(`[bbc-sound-effects] Clip created: ${clip.name}`);
        },
      );
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error("[bbc-sound-effects] Clip error:", err);
      await showError(context, String(err instanceof Error ? err.message : err));
    }
  });

  // ── Simpler: load into sample slot ────────────────────────────────────────

  context.ui.registerContextMenuAction("Simpler", "BBC Sound Effects…", "bbc.open-simpler");

  context.commands.registerCommand("bbc.open-simpler", async (arg: unknown) => {
    console.log("[bbc-sound-effects] Simpler mode triggered");

    let simpler: Simpler<"1.0.0">;
    try {
      simpler = context.getObjectFromHandle(arg as Handle, Simpler);
    } catch {
      await showError(context, "Could not resolve Simpler device.");
      return;
    }

    const soundsDir = path.join(
      context.environment.storageDirectory ?? path.join(os.homedir(), ".bbc-sound-effects"),
      "sounds",
    );

    const result = await showSearchDialog(context, "simpler");
    if (!result) return;

    try {
      await context.ui.withinProgressDialog(
        "BBC Sound Effects",
        { progress: 0 },
        async (update, signal) => {
          signal.throwIfAborted();
          await update("Preparing download…", 10);

          // Simpler works best with WAV — override format if MP3 was selected
          const wavResult = { ...result, format: "wav" as const };
          const filePath = await downloadSound(wavResult, soundsDir, signal, update);

          signal.throwIfAborted();
          await update("Loading into Simpler…", 85);

          await context.withinTransaction(() => simpler.replaceSample(filePath));

          await update("Done!", 100);
          console.log(`[bbc-sound-effects] Loaded into Simpler: ${filePath}`);
        },
      );
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error("[bbc-sound-effects] Simpler error:", err);
      await showError(context, String(err instanceof Error ? err.message : err));
    }
  });
}
