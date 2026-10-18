# KEDIT-CODE Motion Engine

A reusable, code-driven motion-graphics studio for Sovereign Emperor short-form content. React renders a 9:16 composition, GSAP drives a replayable sequence, CSS defines the visual system, and the `CONTENT` object supplies the story.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL and use the animation timeline to play, pause, reset, or scrub through the preview.

## Make another edit

Edit the `CONTENT` object near the top of `src/main.jsx`:

- `title`, `subtitle`, and `eyebrow`
- `code`, `keyword`, and `final`
- `metric`, `graph`, `accent`, and footer/brand text

The animation sequence and composition are reusable; ordinary content changes do not require changes to the engine.

## Motion-design controls

- **Timeline:** Play, pause, restart, and scrub the GSAP animation.
- **Scene transitions:** The sequence uses a code-editor wipe, a focus-pull title reveal, a flash cut into the impact word, and a camera punch.
- **Effects:** Toggle glow, film grain, and camera movement from the Effects panel.
- **Composition:** Preview the design at a 9:16 aspect ratio for portrait social video.

This is a template-based motion-graphics preview, not a full nonlinear editor. It does not provide After Effects project files, arbitrary layer/keyframe editing, masks, tracking, audio editing, third-party effect plugins, or native video encoding.

## Export

The composition is designed for a 1080 × 1920 / 9:16 output. The browser preview does not encode a video file. For a quick capture, record the composition in Chromium at the target viewport size. For automated rendering, use browser automation to capture the composition and encode the frames using a video-rendering workflow such as Playwright plus FFmpeg.

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
