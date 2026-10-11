# Little Champion — AI Agent Handover & Project Guide

## 1. Project Overview
**Little Champion** (`little-champion-game`) is an interactive, zero-latency educational speed-tapping PWA built with **Astro 5/7 + React 19 + Tailwind CSS v4** for kindergarten/toddler kids (ages 3–6) to learn **Numbers, Letters, Shapes, and Colors**.

- **Repository**: `https://github.com/dendyaziz/little-champion-game`
- **Target Audience**: Non-reading young children (3–6 years old) and parents tracking their child's recognition speed over time.

---

## 2. CRITICAL UI/UX DESIGN RULES (MUST FOLLOW STRICTLY)

The user has very specific, non-negotiable UI/UX standards tailored for non-reading kindergarten children. **Never violate these rules when adding or modifying UI:**

1. **KIDS DO NOT READ — ZERO UNNECESSARY TEXT**:
   - **Never add paragraphs, instructions, subtitles, or celebratory text banners** like *"Super Job!"*, *"Pick Number Completed!"*, *"Awesome Try! You scored X points"*, or *"Find 7"* in the game UI, modals, or prompts.
   - Communication with the child happens through **large unboxed visual icons** + **instant voice narration**.
   - On the **Homepage** ([`src/components/HomeMenu.tsx`](src/components/HomeMenu.tsx)): Do **NOT** add a top app logo, app title (`<h1>`), or subtitle description. The toolbar contains only **Records** and **Sound Mute**, matching the in-game control size (52px phone, 64px tablet). Center the menu grid vertically when it fits, balancing toolbar space below it; tall mobile menus scroll.
   - **Home scenery**: Simple flat 2D, solid balanced colors, mostly white negative space. A small complete playground scene belongs below the menu, not enlarged/cropped behind the cards. More objects must not mean more texture, shading, 3D detail, or center clutter.

2. **UNBOXED, EDGE-TO-EDGE IMMERSIVE ELEMENTS (NO INNER BOXES / CONTAINERS)**:
   - **Playfield**: Items float directly on the full-screen sky gradient playfield (`w-screen h-screen`). Never wrap the playfield or items inside a bordered card or box.
   - **Playable Items** ([`src/components/items/PlayItem.tsx`](src/components/items/PlayItem.tsx)): Numbers, letters, shapes, and colors must be **pure flat, crisp glyphs/SVGs** with **NO background cards/tiles, NO drop-shadows on the items, and NO text-shadows**.
   - **Target Prompt** ([`src/components/TargetPrompt.tsx`](src/components/TargetPrompt.tsx)): When a "Find" round starts, show **ONLY** the giant unboxed target item (`3x` scale) floating on a blurred backdrop—no enclosing card, no title text, no "Start" button (it auto-transitions after the voice finishes, or skips on tap).
   - **Champion (Victory) & Lose Modals** ([`src/components/VictoryModal.tsx`](src/components/VictoryModal.tsx), [`src/components/GameOverModal.tsx`](src/components/GameOverModal.tsx)):
     - Do **NOT** put the 5 stars or 5 empty hearts inside a gray/colored inner box—they float directly inside the modal card.
     - Keep the large, detailed 3D SVG assets floating out of the top edge (`-mt-16 sm:-mt-20`): [`ChampionTrophy.tsx`](src/components/ui/ChampionTrophy.tsx) for victory and [`EncouragementHeart.tsx`](src/components/ui/EncouragementHeart.tsx) (3D kawaii heart with a bandaid) for game over.
     - Use the custom puffy 3D kawaii smiling stars in [`StarRating.tsx`](src/components/ui/StarRating.tsx)—never replace them with cheap basic Lucide star icons.

3. **IN-GAME HUD & TOP PROGRESS BAR** ([`src/components/HUD.tsx`](src/components/HUD.tsx)):
   - **Top Progress Bar**: Fixed at the very top edge of the screen (`fixed top-0 left-0 right-0 z-[60]`), using a **single soft green color (`bg-emerald-400`)**—do **NOT** use a multi-color gradient, and do **NOT** show a `"1/3"` text pill.
   - **Progress Bar Math (Completed Rounds)**:
     - Round 1 (0 completed): **`0%`** (at the very left)
     - Round 2 (1 completed): **`33.33%`** (`1/3`)
     - Round 3 (2 completed): **`66.67%`** (`2/3`)
     - All 3 Rounds Completed (`isCompleted = true`): Animates smoothly to **`100%`** concurrently while the Champion modal pops up (`z-[60]` keeps the bar visible above the `z-50` modal backdrop).
   - **HUD Center**: Show **ONLY** the target item to find in the middle with a continuous wiggle animation (`animate-wiggle`). **Never** show a badge telling how many target items remain.
   - **HUD Left & Right**: Left has large tactile Home & Mute buttons (the user's updated preference); Right has the 5 Hearts. Answer items and the center target remain unboxed.

4. **SHAPES, COLORS & SPATIAL LAYOUT** ([`src/utils/gameModes.ts`](src/utils/gameModes.ts), [`src/utils/roundGenerator.ts`](src/utils/roundGenerator.ts), [`src/components/items/ShapeSVG.tsx`](src/components/items/ShapeSVG.tsx)):
   - **Allowed 8 Shapes ONLY**: `square`, `rectangle` (wide long square), `triangle` (sharp clean corners, not overly rounded), `rhombus`, `heart`, `star`, `circle`, `oval`.
   - **Find Color Target Display**: When prompting or showing the target color in the HUD/Prompt for **Find Color**, **ALWAYS render the target color as a `circle`**, never as a star or random shape, so kids focus purely on the color rather than the shape.
   - **10 Distinct High-Contrast Colors**: Defined in `COLORS` and `ITEM_COLORS` (Yellow is darkened to `#EAB308` / `#CA8A04` so it always has high contrast against the bright sky background).
   - **No Duplicate Distractor Colors/Items Before Exhaustion**: Every round shuffles the full pool of distinct colors/distractors before repeating any color.
   - **Responsive Jittered Grid + Varied Scales**: The generator retains its random slots; the presentation layer fits them to measured usable space. Prefer 3 columns on portrait phones and 4/5 on landscape tablets, adapting to available height. Keep visible glyphs and disjoint touch areas inside cells, with bounded jitter/tilt/size variety. Do not repack remaining items after a pop or regenerate game content during resize.
   - **Animation Layer Isolation**: In [`PlayItem.tsx`](src/components/items/PlayItem.tsx), `animate-pop-in` MUST remain on its own persistent outer wrapper `<div>`, while `animate-shake` and `animate-pop-out` live on an inner `<div>`. Never put `animate-pop-in` and `animate-shake` on the same element (otherwise finishing a shake re-triggers the entrance fade-in).

5. **ZERO PAGE RELOADS (SPA ARCHITECTURE)**:
   - Navigation between Home (`/`), Games (`/play/:gameId`), and Records (`/parents/records`) is handled client-side via [`src/components/KidsApp.tsx`](src/components/KidsApp.tsx) using `window.history.pushState`. Never use full-page reload links that cause a freeze or cut off audio playback.
   - All parent-area pages must render through `KidsApp` and its shared `/parents` route boundary. `ParentGate` asks for three digits displayed as English words (no spoken challenge). Access is memory-only and resets on leaving the parent area or refreshing. `/records` is a compatibility alias for the gated route. This is a child deterrent, not authentication or protection for sensitive data.

---

## 3. Game Modes (8 Total)
Defined in [`src/utils/gameModes.ts`](src/utils/gameModes.ts) and generated in [`src/utils/roundGenerator.ts`](src/utils/roundGenerator.ts) (3 rounds per game, 5 hearts max):

1. **`order-numbers` (Order Numbers)**: Tap `0` to `11` in sequential order.
2. **`pick-number` (Find Number)**: Find all instances (3–5) of the target number (`0`–`11`). Each of the 3 rounds targets a **unique** number (`usedTargetsRef`).
3. **`order-letters-al` (Order Letters A–L)**: Tap `A` to `L` in order.
   - **Round 1**: All **Uppercase** (`A`–`L`)
   - **Round 2**: All **Lowercase** (`a`–`l`)
   - **Round 3**: **Equal Mixed Case** (6 uppercase, 6 lowercase)
4. **`order-letters-mz` (Order Letters M–Z)**: Tap `M` to `Z` in order (Round 1 Uppercase, Round 2 Lowercase, Round 3 Equal Mixed Case: 7 upper, 7 lower).
5. **`pick-letter-al` (Find Letter A–L)**: Find all instances of the target letter from `A`–`L` (unique target per round).
6. **`pick-letter-mz` (Find Letter M–Z)**: Find all instances of the target letter from `M`–`Z` (unique target per round).
7. **`pick-shape` (Find Shape)**: Find all instances of the target shape (unique target per round).
8. **`pick-color` (Find Color)**: Find all items matching the target color (unique target per round; target prompt is always a circle).

---

## 4. Audio & Voice Engine (Zero Chrome TTS)

**IMPORTANT**: Chrome/Web Speech API `speechSynthesis` is **completely banned**. All voices are pre-generated local MP3 files in `public/audio/` using Google **Gemini 3.8 Flash TTS** (`model: gemini-3.8-flash-tts`, custom voice ID: `voice_bdfty8z69dyd`, fast/energetic/clear young woman style with zero whispering).

### A. Silence Trimming (`scripts/trim_voice.py`)
- Every audio file in `public/audio/{numbers,letters,shapes,colors,narrations}/*.mp3` is processed with [`scripts/trim_voice.py`](scripts/trim_voice.py), which uses 5ms RMS Voice Activity Detection (`ffmpeg` 24kHz PCM) to strip all leading/trailing silence down to `<10ms` with micro-fades.
- Always run `python3 scripts/trim_voice.py` on any newly generated audio files.

### B. Web Audio API Pre-Decoded Voice Player (`src/audio/speechAnnouncer.ts`)
- Pre-fetches and decodes all MP3s into uncompressed in-memory `AudioBuffer`s on startup for **`0ms` tap-to-voice latency**.
- **No Queue System**: When a new voice is triggered, any currently playing voice softly fades out over `60ms` concurrently while the new voice starts immediately.
- **Sequential Composite Sentences (`speakSequence`)**:
  - For "Find" games, plays `"Let's find the {number|letter|shape|color}..."` $\rightarrow$ waits **`500ms` (`0.5s`)** $\rightarrow$ plays the target item (`"Seven!"`, `"A!"`, `"Star!"`, `"Red!"`).
- **Tap Feedback Differences**:
  - In **Order** games (`order-numbers`, `order-letters-*`): Tapping a correct item speaks the item (`"Zero"`, `"One"`, `"A"`, `"B"`).
  - In **Find** games (`pick-*`): Tapping a correct item does **NOT** repeat the spoken word (to avoid annoying *"Seven—Seven—Seven"*); instead it plays a gentle crystal bell sound (`sound.playCorrectBell()`).
- **Victory & Lose Voices**:
  - Regular Victory (`announcer.cheer()`): Rotates through `victory-hooray.mp3` (*"Hooray!"*), `victory-great-job.mp3` (*"Great job!"*), and `victory-good-job.mp3` (*"Good job!"*).
  - New Speed Record Victory (`announcer.speakNewRecord()`): Plays `victory-new-record.mp3` (*"Hooray! A new fastest time record!"*).
  - Game Over (`announcer.speakLose()`): Plays `lose-try-again.mp3` (*"No worries, we can try again!"*) alongside `sound.playGameOver()`.

### C. Procedural Sound Effects (`src/audio/soundEngine.ts`)
- `playPop()`: Bubbly upward sine sweep on UI taps.
- `playCorrectBell()`: Gentle low-volume dual-harmonic crystal bell for correct taps in Find mode.
- `playWobble()`: Distinct, audible low-pass filtered dual-triangle cartoon "uh-oh / bonk" for wrong taps.
- `playGameOver()`: 4-note chromatic descending cartoon *"wah-wah-wah-waaah"* when all 5 hearts are lost.
- `playFanfare()` & `playStarDing()`: Celebratory arpeggio and staggered star chimes on Victory.

---

## 5. Speed Record Tracking & Progress Graph (`src/utils/recordsStore.ts` & `src/components/RecordsView.tsx`)
- Every completed 3-round game saves a `SpeedRecordEntry` (`id`, `gameId`, `durationMs`, `durationSeconds`, `timestamp` ISO string, `stars`) to `localStorage` (`kids_speed_records_v1`).
- Durations are formatted naturally: e.g., **`56 seconds`** or **`1 minute 24 seconds`**.
- **Records Dashboard (`/records`)**:
  - **Overview**: Shows the 8 large unboxed game illustrations, names, best completion times, and open-history arrows. Keep dates, trophy badges, record counts, and empty-record messages off this selector; show full record data in the detail view.
  - **Game Detail View**: Clicking any game displays an **SVG Historical Speed Graph** (chronological runs `#1..#N`, highlighting the fastest run in gold) and a **History Log** where each entry has a **Delete (Trash) button** so parents can remove accidental adult entries (which immediately recalculates the game's Best Time).

---

## 6. Development Commands
When starting the Astro dev server, use background mode:
```bash
astro dev --background
```
Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
