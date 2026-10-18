# KEDIT-CODE Motion Engine

A reusable, code-driven motion-graphics studio for Sovereign Emperor short-form content. React renders a 9:16 composition, GSAP drives a replayable sequence, CSS defines the visual system, and the `CONTENT` object supplies the story.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL and use the animation timeline to play, pause, reset, or scrub through the preview.

## Customize and reuse the template

Choose a preset from **Scene Packs** in the studio to instantly swap the complete story and accent color. The library includes:

- **Compound** — wealth, assets, and long-term growth.
- **Founder Mode** — product-building, customers, and traction.
- **Creator Economy** — content, audience, and community trust.
- **Deep Focus** — attention, focus blocks, and meaningful work.
- **Fitness Mindset** — training, habits, and consistency.
- **Future Systems** — emerging technology and human-centered ideas.
- **Mindset Shift** — perspective, personal growth, and new choices.

Every preset reuses the same five scene layouts and animation engine. To add one, add an entry to `SCENE_PACKS` in `src/main.jsx`; `createScenePack` fills unspecified fields from the base content, so a preset only needs to override the parts it changes.

For a fully custom edit, change the commented base `CONTENT` edit pack near the top of `src/main.jsx`. Leave the reusable React components, GSAP timeline, and CSS engine alone.

- **`project`** — project name, output width/height, aspect-ratio label, frame rate, and target timeline length. When changing frame dimensions, update `aspectRatio` too.
- **`theme`** — accent color, dark background, and display font. The accent is reused across the scene highlights and transition details.
- **`effects`** — which glow, grain, and camera effects start enabled. They can still be toggled in the studio.
- **`brand` / `footer`** — recurring brand and composition footer.
- **`scenes.intro`** — hook, title, supporting line, and scene label.
- **`scenes.code`** — code lines, filename, headline, stamp, and supporting caption.
- **`scenes.impact`** — the big single-word moment and supporting copy.
- **`scenes.data`** — metric label/start/end/prefix, graph, chart labels, and takeaway. Graph values are percentages from 0 to 100.
- **`scenes.outro`** — final headline, background word, supporting line, and call to action.
- **`motion`** — transition/type/counter/chart timings, camera scale, and flash strength. `project.duration` is the total timeline target; increase it if slower animation exceeds that length.

Use `\n` in the multi-line `kicker`, `headline`, `bottom`, `sideNote`, or data headline fields to control line breaks. Keep scene titles concise for legibility on a phone.

The five scene components share the same visual system and animation engine, so the built-in presets and custom edits can be remixed without rebuilding the scenes.

## Motion-design controls

- **Timeline:** Play, pause, restart, and scrub the GSAP animation.
- **Scene design:** Five distinct, full-frame portrait scenes replace the stacked dashboard-like layout: a cinematic title, kinetic code card, oversized impact typography, an animated growth chart, and a typographic closing card.
- **Typography:** Headline and closing text reveal letter-by-letter. Scene transitions include a clipped code-editor wipe, blur/scale focus transitions, a restrained flash impact, and directional push-ins.
- **Effects:** Toggle glow, film grain, and camera movement from the Effects panel.
- **Composition:** Preview the design at the configured aspect ratio and output dimensions.

This is a template-based motion-graphics preview, not a full nonlinear editor. It does not provide After Effects project files, arbitrary layer/keyframe editing, masks, tracking, audio editing, third-party effect plugins, or native video encoding.

## Export

The default composition is 1080 × 1920 / 9:16. The browser preview does not encode a video file. For a quick capture, record the composition in Chromium at the configured target viewport size. For automated rendering, use browser automation to capture the composition and encode the frames using a video-rendering workflow such as Playwright plus FFmpeg.

## Architecture

```text
CONTENT
   ↓
React Composition
   ↓
Reusable Visual Components
   ↓
GSAP Timeline + Scene Transitions
   ↓
9:16 Motion Graphics Preview
```
