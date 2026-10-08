# KEDIT-CODE Motion Engine v1.0

A reusable, code-driven motion-graphics template for Sovereign Emperor short-form content.

## Core idea

**Code is the animation engine.** React renders the scene, JavaScript controls state, GSAP controls the timeline, CSS controls the visual system, and the CONTENT object supplies the story.

## Stack

- React
- JavaScript
- GSAP
- CSS
- Vite

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL. Use **RUN CODE** to replay the animation and **RESET** to return to the initial state.

## Create another edit

Open `src/main.jsx` and change only the `CONTENT` object near the top:

- `title`
- `subtitle`
- `code`
- `keyword`
- `metric`
- `graph`
- `final`
- `accent`

The animation engine should not need to change for normal edits.

## 9:16 export

The composition is designed around a 9:16 stage and displays its target as `1080 × 1920 / 9:16`. For final video capture, run the page in Chromium at a 1080×1920 viewport and record the stage with your preferred screen/video capture workflow. For automated rendering, add a browser automation layer such as Playwright and capture the stage frame-by-frame or as a video according to your production pipeline.

## Architecture

```text
CONTENT
   ↓
React Scene
   ↓
Reusable Components
   ↓
GSAP Timeline
   ↓
Code / UI / Counter / Graph / Transitions
   ↓
9:16 Motion Graphics
```

## KEDIT workflow

1. Write the source script.
2. Convert it into KEDIT-CODE scenes.
3. Put the editable words/numbers into `CONTENT`.
4. Run the project.
5. Tune timings only when the narration needs a different rhythm.
6. Capture/export at 1080×1920.

## Design rule

Do not make every video look like a generic hacker terminal. Use the code aesthetic as a visual language for business, finance, technology, systems, psychology, and entrepreneurship.
