# BBC Sound Effects — Setup & Install

## What you need first

- **Node.js** installed on your Mac — download from [nodejs.org](https://nodejs.org) (get the LTS version)
- **Ableton Live 12.4.5 Beta** running
- A **Terminal** window (search "Terminal" in Spotlight)

---

## One-time setup

### 1. Open the project folder in Terminal

Drag the `bbc-sound-effects` folder into your Terminal window after typing `cd ` (with a space), then hit Return.

```
cd /Users/leehoward/Documents/Claude/Projects/Ableton\ Live\ Extensions\ SDK\ -\ dev/bbc-sound-effects
```

### 2. Install dependencies

```
npm install
```

This downloads the Ableton SDK files the extension needs. Only need to do this once.

---

## Development mode (for testing)

### 3. Enable Developer Mode in Live

Live → Preferences → **Extensions** tab → turn on **Developer Mode**

### 4. Start the extension

Back in Terminal:

```
npm start
```

You should see a message confirming it connected to Live.

### 5. Test it

Right-click any **Audio Track** in Live. You should see **"BBC Sound Effects…"** in the menu.

---

## When you're happy with it — permanent install

### 6. Package it

```
npm run package
```

This creates a `.ablx` file in the project folder.

### 7. Install the .ablx file

- Turn **off** Developer Mode in Live (Preferences → Extensions)
- Drag the `.ablx` file into the Extensions preferences panel
- Live will ask you to restart — do it
- After restart, right-click an Audio Track to confirm it's there

---

## Troubleshooting

**"BBC Sound Effects…" doesn't appear in the menu**
→ Make sure you're right-clicking an *Audio* track, not a MIDI track

**npm install fails**
→ Check that the SDK `.tgz` files are still in `~/Downloads/Live Extension SDK/extensions-sdk-1.0.0-beta.0/`

**Extension connects but does nothing when clicked**
→ Check the log file at `~/Library/Preferences/Ableton/Live 12.4.5/ExtensionHost.txt` for errors

**Sounds not downloading**
→ You need an internet connection — the BBC archive is online only

---

## Where downloaded sounds are saved

`~/Library/Application Support/Ableton/Extensions/bbc-sound-effects/sounds/`

Files are cached by ID — if you search for the same sound twice, it reuses the local copy.
