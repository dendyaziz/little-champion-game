# Little Champion UI improvement plan

## Scope and evidence

This is a design and implementation plan, not a gameplay change. Preserve scoring, three rounds, five hearts, target selection, distractor pools, mixed letter cases, local voice playback, narration sequencing, tap feedback, records storage, and instant client-side navigation.

Inspected the handover and current source, plus live home, number gameplay, shape gameplay, retry modal, and empty records screens. Verified content viewports of 390 × 844 and 1024 × 768. The browser viewport control initially produced smaller content dimensions; the verified sizes above are the basis for this plan. Victory was inspected in source, not reached in a live completed game. Populated records and native installed-PWA safe areas still need validation. Development toolbar visible in captures is a development artifact, not a product control.

## What needs improvement

1. **Phone gameplay is crowded horizontally.** Placement uses 4 columns for 12 items and 5 for 14 at every viewport size. At 390 px, a four-column cell is about 86 px wide, but item buttons are about 144 px wide. Live shape gameplay shows overlapping shapes and offscreen edges. Transparent hit areas overlap too, making visible items unreliable tap targets.
2. **Home choices take too much scrolling.** Phone home uses one tall card per row; about two full choices fit before scrolling. Large internal padding, title, and a separate arrow consume space without improving recognition. Children see later modes much less readily.
3. **The visual language is inconsistent.** Pastel cards with thick white outlines and colored bottom shadows, plain outline controls, saturated floating glyphs, blurred clouds, and detailed reward illustrations feel like separate systems. Keep the reward assets and bring supporting UI into their rounded, friendly visual family.
4. **Motion competes for attention.** All live hearts pulse; the target wiggles continuously; background clouds float; the new-record badge bounces. Preserve the required target wiggle, but make it subtle and calm the other idle elements.
5. **Sizing is not based on actual available space.** Fixed item dimensions and independent random scales do not account for cell bounds. Giant two-digit prompts can exceed narrow phones. Existing viewport-fit/PWA settings are not matched by safe-area spacing in the HUD or playfield.
6. **Parent screens inherit oversized child styling.** Records overview takes a long scroll on phones. Its chart has a 420 px minimum width, implying horizontal scrolling in narrow detail views; verify with real records before changing chart behavior.

## Visual direction: a soft illustrated playroom

A warm, polished toy-like menu, with a quiet sky playground during games. The child should recognize the game picture first and the action icon second. Text is supplementary for parents.

- **Background:** Retain the sky-to-warm-light gradient, tuned to a restrained pale blue and cream. Replace blurred moving cloud blobs with crisp, low-contrast vector cloud silhouettes at the outer edges. Gameplay has an almost-empty center. Decorative shapes must not look like tappable answers; no hearts, stars, letters, numbers, or colored target circles sprinkled behind gameplay.
- **Color:** Retain all educational item colors and distractor behavior. Use a smaller supporting UI palette: pale sky, warm cream, soft mint, and dark navy for controls/text. Gold remains the reward accent. Category identity also comes from pictures and composition, never color alone.
- **Typography:** Keep the rounded learning typeface, with stable weights and comfortable spacing. Game glyphs remain large, flat, crisp, and familiar. Labels become a consistent secondary size; avoid oversized multi-line titles that dominate the preview. Check lowercase recognition and two-digit widths before selecting any font replacement.
- **Buttons:** One rounded button family, with consistent radius, restrained bottom depth, stroke weight, press distance, and clear primary/secondary hierarchy. Home cards and modal buttons may have depth; playable items remain unboxed and shadow-free. Floating HUD controls stay unboxed.
- **Icons:** Consistent rounded Home, Sound, Replay, Records, and action icons. Aim for 48–56 px utility touch areas and 64–72 px result actions. Keep accessible names even where visible labels are removed.
- **Images and illustration:** Preserve ChampionTrophy, EncouragementHeart, and the custom puffy stars. Use lightweight SVG for decorative clouds and card scenes so they remain sharp on tablets. No photographic backgrounds. No new hero mascot/header that pushes game choices down. Additional raster illustration is optional only after the vector design is reviewed; it is not needed to fix layout.

## Responsive composition

Grid dimensions below are starting layouts, chosen from measured width AND height after safe areas/HUD. Fit glyphs and non-overlapping hit areas to cell geometry; do not select layouts from width breakpoints alone.

| Surface | Phone portrait | Tablet landscape | Tablet portrait / short landscape |
| --- | --- | --- | --- |
| Home | Two columns of compact picture-led choices; natural vertical scroll | Four columns × two rows when height allows | Two or three columns according to usable width; natural scroll |
| 12 gameplay items | Three columns × four rows; more vertical | Four columns × three rows | Choose the arrangement with sufficient cell width and height |
| 14 gameplay items | Three columns × five rows; one empty slot | Five columns × three rows; one empty slot | Four × four or three × five according to available space |
| Result actions | Large Replay above smaller Home | Replay and Home alongside | Stack when horizontal fit is inadequate |

For very narrow phones, evaluate two columns only when the resulting six/seven rows still accommodate the agreed touch minimum without gameplay scrolling. Otherwise keep three columns and reduce decorative padding, not the educational content. Short landscape phones need a wider grid and reduced HUD height.

### Home

- Keep the compact top-right Records/Sound controls and no title, logo, or subtitle header.
- Replace the huge card interior with one large, readable game preview and a smaller caption. The entire card is one touch target; the arrow is a visual cue, not a nested button.
- Order previews show a short recognizable sequence with a restrained progression cue. Find previews use a magnifier with a prominent target. Shapes and colors retain their recognizable examples.
- Two-column phone cards must simplify the preview composition: no forced five-circle row or four oversized numbers that squeeze the card. Keep glyphs upright enough to read quickly.
- Stable game ordering and visual identities; no carousel, hidden swipe gesture, or extra category step.

### Gameplay and HUD

- Preserve the edge-to-edge background and unboxed items. Layout bounds are invisible; never add a frame.
- Derive cells from the measured playable region. The largest tilted/scaled glyph and its tap region must fit within its cell, with a visible gap to neighboring items. Include width of 10/11, wide rectangles, and W/M in fit calculations.
- Keep randomized slot assignment, jitter, tilt, and size variety, but bound them by geometry. Never reshuffle the answers when an item disappears. Reflow on rotation with stable slot identity, preserving game state and timing.
- Make the target geometrically centered independently of the unequal left controls and right hearts. All five hearts remain visible. Keep the required continuous wiggle, but lower its amplitude. Hearts are still at rest and react once when a heart is lost.
- Preserve the single soft-green top-edge progress bar, completed-round formula, and visibility above result overlays. Put controls below the top safe area and keep answers clear of the bottom gesture area.
- Use the actual visible viewport height for gameplay; account for browser chrome and installed-app safe areas. No gameplay scrolling or answers behind system UI.

### Target prompt and result screens

- Prompt remains a single huge floating target over a blurred backdrop, with the same voice timing, automatic dismissal, and tap-to-skip. Size by available width/height and the complete glyph width, so 10/11 cannot crop. Color target remains a circle in both prompt and HUD.
- Keep the reward illustrations floating above the result card and the stars/hearts floating directly inside it, without inner boxes.
- Make Replay the visually dominant large icon; Home is secondary. Short visible labels may remain if useful, but recognition must not require reading. No celebratory headings or instructions.
- Time/new-record information stays secondary to the reward and actions. Preserve its meaning. Replace perpetual badge bouncing with one arrival accent.
- On short screens, reduce illustration/padding first and allow the result overlay content to scroll if needed, with actions reachable and the floating illustration included in its bounds.

### Records

- Treat this as the parent surface: readable text, dates, and chart labels are appropriate.
- Use compact rows on phones, a consistent game thumbnail, clear best time, and quieter metadata. Reduce empty-state repetition.
- Retain history, graph, delete actions, and best-time recalculation. Keep deletion controls visually distinct from selecting a record/game.
- Validate populated chart labels and data points at phone width. Avoid hiding values just to fit; if horizontal scrolling remains, make it evident.

## Micro-interactions

- Home/action press: small immediate compression/depression, approximately 100–150 ms; navigation is not delayed for animation.
- Item press: subtle visual compression inside the existing transform layers; hit region stays stable. Correct pop and wrong shake remain distinct and synchronized with existing audio/timers.
- Entrance: short soft appearance; keep the persistent entrance wrapper separate from shake/pop-out to prevent entrance replay.
- Wrong tap: short local wobble and one lost-heart reaction; no full-screen alarming flash.
- Round progress: retain existing fill transition and timings. No new countdown or written round badge.
- Rewards: preserve star sequence and voice, with brief restrained confetti rather than continuous attention-seeking movement.
- Reduced motion: provide static/short opacity alternatives for idle motion and decorative effects. Preserve callback/timer behavior and game outcomes when motion is disabled.

## Implementation order

1. **Responsive gameplay geometry:** Fix clipping and hit-area overlap first in placement/presentation, PlayItem, and GameRoom. Measure visible regions and keep generator content, targets, colors, scoring, and audio unchanged. Update the old fixed-grid documentation to reflect the user's requested responsive layout.
2. **Shared visual system and home:** Define spacing, controls, typography, radius, depth, backgrounds, and consistent category previews in global styles/HomeMenu. Keep the compact header.
3. **HUD, prompts, results:** Apply safe areas, real centering, fitted target/reward sizes, calmer motion, and consistent result actions.
4. **Parent records polish:** Apply the supporting visual system and phone-friendly density without changing stored data.
5. **Review and iterate:** After each candidate completion, run the requested read-only review-agent against the complete change, fix actionable introduced defects, and repeat review. Separately perform visual/touch QA; a code review alone cannot certify mobile usability.

## Acceptance checks

- Inspect 320 × 568, 390 × 844, 430 × 932, 844 × 390, 768 × 1024, and 1024 × 768; verify actual content dimensions. Test installed PWA on a real phone/tablet for safe areas and touch handling.
- Exercise all eight modes, all three rounds, 12- and 14-item fields, mixed cases, maximum scale/tilt, wide glyphs/shapes, and every target color. Validate multiple random placements plus worst-case geometry.
- No clipped visuals or overlapping answer hit regions; no gameplay scrolling; utility controls remain reachable. Target prompt and HUD always agree and color targets are circles.
- Preserve the known tap tolerance. Agree a practical minimum of 48 px for answer hit areas, aiming larger where space permits; each hit area contains the entire visible glyph with tolerance while remaining disjoint from neighboring targets. If a viewport cannot meet this, revise composition before calling it done.
- A vanished item leaves the remaining answers stationary. Rotation/resizing does not reset a round, target history, score, hearts, audio, or time tracking.
- Verify prompt skip, repeated wrong/correct taps, round transitions, replay/home, mute, victory/retry, records creation/deletion, and back navigation against the existing behavior.
- Check maximum-duration/new-record victory and retry layouts on small/short screens. Verify reduced motion without broken completion or hidden items.
- Verify fast response on real mobile hardware, including backdrop effects and celebration animation. Build passes and no new console errors.
- Record before/after screen captures and review-agent findings for each completed iteration. Live victory/populated records were not inspected in this planning audit and must be included during implementation validation.
