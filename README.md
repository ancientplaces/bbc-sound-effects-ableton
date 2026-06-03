# BBC Sound Effects — Ableton Live Extension

Search the BBC's archive of 33,000+ field recordings and drop sounds directly into Ableton Live — as audio clips or into a Simpler instrument.

![BBC Sound Effects Extension](https://sound-effects.bbcrewind.co.uk/bbc-blocks-logo.svg)

---

## What it does

- **Search** 33,000+ BBC archive recordings by keyword, category, duration, and sort order
- **Audition** any sound with the built-in preview player before downloading
- **Drop as audio clip** — right-click any Audio Track → BBC Sound Effects… → sound lands in your arrangement or session view
- **Load into Simpler** — right-click any Simpler device → BBC Sound Effects… → sound loads directly into the sample slot, ready to play chromatically

No API key required. The BBC Sound Effects archive is free for personal and educational use.

---

## Install

1. Download `bbc-sound-effects-0.1.0.ablx` from the [Releases](../../releases) page
2. Open Ableton Live (Suite, version 12.4 Beta or later)
3. Go to **Live → Preferences → Extensions**
4. Drag the `.ablx` file into the "Drag and drop to install" area
5. Restart Live when prompted
6. Right-click any Audio Track or Simpler device — you should see **BBC Sound Effects…** under Extensions

---

## Usage

### Dropping a sound onto an Audio Track

Right-click any **Audio Track** in Session or Arrangement View → **BBC Sound Effects…**

A search dialog opens. Type a keyword, optionally filter by category, duration, and sort order, then click **Search**. Results show the sound's subject, location, recordist, duration, and tags.

Click the **▶** button on any result to preview it as a streaming MP3 before committing. When you find the right sound, **click anywhere on the result card** to download it and drop it into your track:

- In Session View: placed in the first empty clip slot
- In Arrangement View: placed at your playhead position

### Loading a sound into Simpler

Right-click any **Simpler** device in a MIDI track's device chain → **BBC Sound Effects…**

The same search and audition workflow applies. When you click a result, the sound downloads and loads directly into Simpler's sample slot — ready to play chromatically, pitch-shift, chop, or slice. WAV format is always used for Simpler for maximum quality.

### Format toggle

Each result shows a **WAV / MP3** toggle. WAV is the default and recommended — it's 44.1kHz/16-bit from the BBC archive. MP3 is available for smaller file sizes.

Downloaded sounds are cached locally and reused on subsequent searches, so you won't re-download the same file twice.

---

## Categories

The BBC archive is organised into: Animals, Applause, Atmosphere, Bells, Birds, Comedy, Crowds, Daily Life, Destruction, Electronics, Events, Fire, Footsteps, Industry, Machines, Medical, Nature, Sport, Toys, Transport — and more.

---

## Requirements

- Ableton Live **Suite** (the Extensions SDK requires Suite)
- Live version **12.4 Beta** or later
- macOS (Windows support not tested)
- Internet connection for searching and downloading

---

## Building from source

Requires Node.js v20+.

```bash
git clone https://github.com/YOUR_USERNAME/bbc-sound-effects-ableton
cd bbc-sound-effects-ableton

# Update package.json to point to your local SDK tarballs, then:
npm install
npm run package
```

The `.ablx` file will appear in the project root.

---

## About the BBC Sound Effects archive

The BBC Sound Effects archive contains over 33,000 recordings made by BBC Natural History Unit recordists and sound designers over several decades. Recordings include field recordings from around the world, wildlife, transport, industry, crowds, and much more.

Sounds are free for personal and educational use under the [RemArc licence](https://sound-effects.bbcrewind.co.uk/licensing).

---

## Licence

MIT — do what you like with the code. Note that the BBC Sound Effects content itself has its own separate licence terms.
