# KEDIT-CODE Motion Engine

A reusable, code-driven motion-graphics studio for Sovereign Emperor short-form content. React renders a 9:16 composition, GSAP drives a replayable sequence, CSS defines the visual system, and `BASE_CONTENT` supplies the default story.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL and use the animation timeline to play, pause, reset, or scrub through the preview.

## Customize and reuse the template

Choose an **Edit** format and then choose a **Scene Pack**. The format changes how the selected story is presented; the pack continues to provide the content and theme in every format:

- **Motion Edit** — the original five-scene animated sequence and full GSAP timeline.
- **Carousel** — a flat, navigable editorial carousel in the composition frame.
- **3D Scenes** — the same reusable content arranged as a perspective 3D carousel.

The library includes ten reusable scene packs:

- **Compound** — wealth, assets, and long-term growth.
- **Founder Mode** — product-building, customers, and traction.
- **Creator Economy** — content, audience, and community trust.
- **Deep Focus** — attention, focus blocks, and meaningful work.
- **Fitness Mindset** — training, habits, and consistency.
- **Future Systems** — emerging technology and human-centered ideas.
- **Mindset Shift** — perspective, personal growth, and new choices.
- **Product Launch** — product design, user experience, and adoption.
- **Creative Craft** — curiosity, iteration, and finishing the work.
- **Resilient by Design** — adapting to setbacks while keeping the purpose.

Each format reuses the same selected pack content. The carousel formats adapt the five scenes into cards through `createCarouselSlides`; they are edit formats inside the composition workflow, not a separate showcase. Pack data lives in `src/scenePacks.js`, separate from the React app. `createScenePack` fills unspecified fields from the base edit pack, so a preset only needs to override the parts it changes.

For a fully custom edit, change the commented `BASE_CONTENT` edit pack near the top of `src/scenePacks.js`. Leave the reusable React components, GSAP timeline, and CSS engine alone.

- **`project`** — project name, output width/height, aspect-ratio label, frame rate, and target timeline length. When changing frame dimensions, update `aspectRatio` too.
- **`theme`** — accent color, dark background, and display font. The accent is reused across the scene highlights and transition details.
- **`effects`** — which available effects start enabled. They can still be toggled in the studio.
- **`brand` / `footer`** — recurring brand and composition footer.
- **`scenes.intro`** — hook, title, supporting line, and scene label.
- **`scenes.code`** — code lines, filename, headline, stamp, and supporting caption.
- **`scenes.impact`** — the big single-word moment and supporting copy.
- **`scenes.data`** — metric label/start/end/prefix, graph, chart labels, and takeaway. Graph values are percentages from 0 to 100.
- **`scenes.outro`** — final headline, background word, supporting line, and call to action.
- **`motion`** — transition/type/counter/chart timings, camera scale, and flash strength. `project.duration` is the total timeline target; increase it if slower animation exceeds that length.

Use `\n` in the multi-line `kicker`, `headline`, `bottom`, `sideNote`, or data headline fields to control line breaks. Keep scene titles concise for legibility on a phone.

The five scene components share the same visual system and animation engine, so the built-in presets and custom edits can be remixed without rebuilding the scenes. To change the shared visual structure, edit the matching component in `src/components/MotionScenes.jsx`; to change studio panels or timeline controls, use `src/components/StudioControls.jsx`.

### Create a custom scene pack

Import and call `createScenePack` in `src/scenePacks.js`. The example below overrides only the fields that differ; missing scene fields inherit from `BASE_CONTENT`:

```js
createScenePack({
  id: 'my-pack',
  name: 'My Pack',
  description: 'A short pack description',
  accent: '#77c9b8',
  effects: { glow: false, grain: true },
  motion: { transition: 0.5, typeDuration: 0.7 },
  scenes: {
    intro: { title: 'A NEW STORY', subtitle: 'Your opening promise.' },
    impact: { word: 'CREATE' },
    data: { metric: { label: 'PROJECTS', from: 0, to: 24 } }
  }
})
```

`project`, `theme`, `effects`, `motion`, `brand`, and `footer` may also be overridden. Scene objects are merged; nested metrics are merged too, while arrays such as `code`, `graph`, and `captions` are replaced by the pack's values. Add the resulting pack to `SCENE_PACKS` to make it selectable.

### Customize effects and transitions

- Effect selector metadata is in `EFFECTS` in `src/motionPresets.js`; default effect values are in `BASE_CONTENT.effects`. For a new effect, define the CSS class/layer in `src/styles.css` and `MotionScenes.jsx`, then add the same key to the effect options and default pack values.
- Transition selectors and GSAP enter/settle/exit states are together in `TRANSITION_STYLES` in `src/motionPresets.js`. Each treatment needs an `id`, display `label`/`detail`, and GSAP property objects for `enter`, `settle`, and `exit`. Motion duration for scene exits comes from `motion.transition` unless the preset supplies an explicit exit duration.
- Scene timing and motion values remain in each pack's `motion` object. Keep the total `project.duration` long enough for the timeline to finish naturally.

## Motion-design controls

- **Timeline:** Play, pause, restart, and scrub the GSAP animation.
- **Scene design:** Five distinct, full-frame portrait scenes replace the stacked dashboard-like layout: a cinematic title, kinetic code card, oversized impact typography, an animated growth chart, and a typographic closing card.
- **Typography:** Headline and closing text reveal letter-by-letter. Choose cinematic blur, whip pan, signal glitch, or film wipe treatments from the Transitions panel.
- **Effects:** Toggle bloom/glow, film grain, camera punch, lens vignette, chromatic split, light leak, and scanlines independently.
- **Composition:** Preview the design at the configured aspect ratio and output dimensions.
- **Scene carousel:** Choose **Carousel** or **3D Scenes** under Edits to make it the composition output. Both formats use the selected scene pack and support arrow, pagination, and keyboard navigation.
- **CSS 3D scene accent:** The intro uses a layered, theme-colored 3D orb that can be reused in other scenes and respects reduced-motion preferences. This adds lightweight CSS perspective; it is not a WebGL renderer.
- **Typography components:** `EditorialTypography` provides configurable animated display headlines for carousel cards; `KineticWords` and `LineBreaks` are reusable building blocks for scene and brand typography.

### Reuse the carousel and typography

`SceneCarousel` accepts content cards independently from the editor and renders inside the standard project-sized composition frame. The built-in `createCarouselSlides(content)` adapter maps the selected scene pack into five cards; provide your own `slides` array to use different content or a different brand:

```jsx
import { SceneCarousel } from './components/SceneCarousel.jsx';

const slides = [
  {
    id: 'launch',
    eyebrow: 'PRODUCT / 01',
    title: 'MAKE IT MATTER',
    caption: 'A sharp promise, told in motion.',
    label: 'THE LAUNCH',
    motif: 'type',
    accent: '#9de2cc',
    accentIndex: 2
  }
];

<SceneCarousel slides={slides} content={content} mode="3d-carousel" />
```

Each card needs a unique `id`, `title`, `caption`, and `label`; `eyebrow`, `motif`, `accent`, and `accentIndex` customize its editorial treatment. Supported motifs are `orbit`, `code`, `type`, `metric`, and `outro`. The final-word accent index is zero-based. `mode` accepts `carousel` or `3d-carousel`; the **Edits** selector changes between formats, and the built-in accessible controls navigate the active composition.

This is a template-based motion-graphics preview, not a full nonlinear editor or a replacement for After Effects or Premiere Pro. Treatments are implemented in the browser with GSAP and CSS. The app does not provide native Adobe project files, arbitrary layer/keyframe editing, masks, tracking, audio editing, third-party effect plugins, or native video encoding.

## Export

The default composition is 1080 × 1920 / 9:16. The browser preview does not encode a video file. For a quick capture, record the composition in Chromium at the configured target viewport size. For automated rendering, use browser automation to capture the composition and encode the frames using a video-rendering workflow such as Playwright plus FFmpeg.

## Architecture

```text
src/
├── main.jsx                    # Small browser mount point
├── scenePacks.js               # Base edit pack, pack factory, presets, clip proportions
├── motionPresets.js            # Reusable effect metadata and transition choreography
├── carouselContent.js          # Adapts selected scene-pack content to carousel slides
├── hooks/
│   └── useMotionTimeline.js    # GSAP timeline state, playback, scrubbing, and cleanup
├── components/
│   ├── MotionStudio.jsx        # Reusable editor composition and injectable options
│   ├── MotionScenes.jsx        # Reusable scenes, typography, chart, and 3D accent components
│   ├── SceneCarousel.jsx       # Reusable accessible carousel and 3D composition formats
│   ├── StudioChrome.jsx        # Reusable header, sidebar, preview, inspector, and footer
│   └── StudioControls.jsx      # Reusable preset, effect, transition, and timeline controls
└── styles.css                  # Shared composition and studio styling
```

`MotionStudio` is exported independently so another React app can embed it and pass custom packs, clip widths, effects, transition styles, or a starting transition. It composes the layout and controls; `useMotionTimeline` owns playback and GSAP cleanup; `MotionScenes` owns the visual scene markup. The small `main.jsx` file only mounts the editor in the Vite page.

```jsx
import { MotionStudio } from './components/MotionStudio.jsx';
import { SCENE_PACKS, TIMELINE_CLIPS } from './scenePacks.js';
import { EFFECTS, TRANSITION_STYLES } from './motionPresets.js';

<MotionStudio
  packs={SCENE_PACKS}
  clips={TIMELINE_CLIPS}
  effectOptions={EFFECTS}
  transitionOptions={TRANSITION_STYLES}
  initialTransition="whip"
  engineVersion="02.0"
/>
```

High-level customization notes are kept next to the edit-pack configuration, public component props, and animation contracts. Keep scene selectors and GSAP targets in sync when changing scene markup, since the timeline animates those elements by class.

```text
CONTENT
   ↓
React Composition
   ├── MotionScenes
   └── StudioControls
   ↓
GSAP Timeline + Scene Transitions
   ↓
9:16 Motion Graphics Preview
```
