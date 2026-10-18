import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import './styles.css';

// ============================================================
// EDIT PACK: customize this object to create a new video.
// CONTENT changes the story; THEME changes its colors/type;
// MOTION changes pacing and transitions. Keep the engine below.
// Use short headlines so they fit the portrait-safe area.
// ============================================================
const CONTENT = {
  // Output canvas and project labels. Change the dimensions together to switch format.
  project: {
    name: 'UNTITLED PROJECT',
    format: '9:16 SOCIAL',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    duration: 13
  },
  // Brand colors and typeface. Accent is reused for highlight text and motion accents.
  theme: {
    accent: '#c7a34b',
    background: '#08080b',
    displayFont: 'Inter, ui-sans-serif, system-ui, sans-serif'
  },
  // Starting state for the live effect switches in the left panel.
  effects: { glow: true, grain: true, camera: true },
  brand: 'SOVEREIGN EMPEROR',
  footer: 'KEDIT-CODE / 001',
  // Edit the copy in each scene. Use \n in headline fields to choose line breaks.
  scenes: {
    // Intro: the primary hook and first on-screen promise.
    intro: {
      index: '01',
      eyebrow: '// WEALTH_ENGINE.js',
      kicker: 'IDEAS THAT\nMOVE THE WORLD',
      title: 'THE WEALTH EQUATION',
      subtitle: 'Income starts the game. Ownership changes the game.',
      label: 'THE BIG IDEA'
    },
    // Code: the visual metaphor or steps that support the hook.
    code: {
      index: '02',
      label: 'THE SYSTEM',
      inputLabel: 'INPUT → OUTPUT',
      headline: 'MAKE THE\nNUMBERS\nMOVE.',
      fileName: 'wealth-engine.js',
      code: [
        'const income = 1000;',
        'let assets = 0;',
        'assets += skills;',
        'assets *= time;',
        'wealth = assets + cashflow;'
      ],
      stamp: 'COMPOUND',
      footnote: 'A SMALL INPUT. A DIFFERENT OUTCOME.'
    },
    // Impact: one short word/phrase gets the strongest kinetic reveal.
    impact: {
      index: '03',
      label: 'THE SHIFT',
      eyebrow: 'THE DIFFERENCE IS OWNERSHIP',
      overline: "DON'T JUST EARN IT.",
      word: 'OWNERSHIP',
      bottom: 'BUILD WHAT\nBUILDS YOU.',
      sideNote: 'SHIFT YOUR\nPERSPECTIVE'
    },
    // Data: the counter and 0-100 graph make the idea measurable.
    data: {
      index: '04',
      label: 'THE COMPOUND EFFECT',
      sideLabel: 'LONG GAME / 01',
      headline: 'TIME IS\nTHE MULTIPLIER.',
      metric: { label: 'ASSET VALUE', from: 1000, to: 100000, prefix: '$' },
      metricTrend: 'COMPOUNDED',
      graph: [8, 13, 17, 29, 42, 58, 78, 100],
      captions: ['THE EARLY DAYS', 'THE BREAKTHROUGH', 'THE PAYOFF'],
      footnote: 'CONSISTENCY TURNS TIME INTO LEVERAGE.'
    },
    // Outro: short call-to-action for the final frame.
    outro: {
      index: '05',
      label: 'YOUR MOVE',
      backdrop: 'BUILD',
      kicker: 'THE NEXT CHAPTER IS YOURS',
      title: 'BUILD ASSETS. COMPOUND VALUE.',
      subtitle: 'Think long. Build boldly. Let it compound.',
      callToAction: 'START NOW'
    }
  },
  // Values are seconds. Change the total duration when you change pacing.
  motion: {
    transition: 0.4,
    typeDuration: 0.65,
    typeStagger: 0.025,
    metricDuration: 1.2,
    chartDuration: 0.48,
    flashOpacity: 0.16,
    cameraScale: 1.045,
    cameraDuration: 0.5
  },
};

const CLIPS = [
  { key: 'intro', width: 19 },
  { key: 'code', width: 23 },
  { key: 'impact', width: 19 },
  { key: 'data', width: 22 },
  { key: 'outro', width: 17 }
];

function resetMetric(root) {
  const value = root?.querySelector('.metric-value');
  const metric = CONTENT.scenes.data.metric;
  if (value) value.textContent = `${metric.prefix}${metric.from.toLocaleString()}`;
}

function formatTime(seconds) {
  return `00:${String(seconds).padStart(2, '0')}`;
}

function KineticWords({ text, className = '' }) {
  return <span className={`kinetic-words ${className}`} aria-label={text}>
    {text.split(' ').map((word, wordIndex) => <span className="kinetic-word" key={`${word}-${wordIndex}`} aria-hidden="true">
      {Array.from(word).map((letter, index) => <span className="kinetic-letter" key={`${letter}-${index}`}>{letter}</span>)}
    </span>)}
  </span>;
}

function useTimeline() {
  const root = useRef(null);
  const timeline = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(CONTENT.project.duration);
  const [status, setStatus] = useState('READY');

  const reset = () => {
    timeline.current?.kill();
    timeline.current = null;
    if (root.current) {
      gsap.set(root.current.querySelectorAll('[data-anim], .intro-words .kinetic-letter, .intro-kicker, .intro-subtitle, .editor, .code-line, .impact-words .kinetic-letter, .metric-value, .data-kicker, .data-caption, .graph-bar, .outro-words .kinetic-letter, .outro-subtitle, .motion-rule, .orbit'), { clearProps: 'all' });
      gsap.set(root.current.querySelectorAll('.motion-scene'), { autoAlpha: 0, x: 0, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)' });
      gsap.set(root.current.querySelector('.scene-intro'), { autoAlpha: 1 });
      gsap.set(root.current.querySelector('.flash'), { opacity: 0 });
      gsap.set(root.current.querySelector('.camera-layer'), { clearProps: 'all' });
      resetMetric(root.current);
    }
    setPlaying(false);
    setProgress(0);
    setStatus('READY');
  };

  const run = () => {
    timeline.current?.kill();
    if (!root.current) return;

    setPlaying(true);
    setProgress(0);
    setStatus('BOOTING');
    resetMetric(root.current);
    const q = (selector) => root.current.querySelectorAll(selector);
    const camera = root.current.querySelector('.camera-layer');

    gsap.set(q('[data-anim]'), { clearProps: 'all' });
    gsap.set(q('.motion-scene'), { autoAlpha: 0, x: 0, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' });
    gsap.set(camera, { clearProps: 'all', scale: 1 });
    gsap.set(q('.intro-words .kinetic-letter'), { yPercent: 125, rotation: 8, opacity: 0 });
    gsap.set(q('.intro-kicker, .intro-subtitle'), { opacity: 0, y: 16 });
    gsap.set(q('.editor'), { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(q('.code-line'), { opacity: 0, x: -18 });
    gsap.set(q('.impact-words .kinetic-letter'), { yPercent: 110, rotation: -8, opacity: 0, scale: 0.8 });
    gsap.set(q('.metric-value'), { opacity: 0, scale: 0.78, filter: 'blur(10px)' });
    gsap.set(q('.data-kicker, .data-caption'), { opacity: 0, y: 12 });
    gsap.set(q('.graph-bar'), { scaleY: 0, transformOrigin: 'bottom' });
    gsap.set(q('.outro-words .kinetic-letter'), { yPercent: 120, opacity: 0 });
    gsap.set(q('.outro-subtitle'), { opacity: 0, x: -20 });
    gsap.set(q('.scan'), { xPercent: -140 });
    gsap.set(q('.flash'), { opacity: 0 });
    gsap.set(q('.motion-rule, .orbit'), { scaleX: 0, scaleY: 0, transformOrigin: 'center' });

    const counter = { value: CONTENT.scenes.data.metric.from };
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onUpdate: () => setProgress(tl.progress()),
      onComplete: () => {
        setPlaying(false);
        setStatus('COMPLETE');
      }
    });
    timeline.current = tl;

    tl.addLabel('intro')
      .set(q('.scene-intro'), { autoAlpha: 1 })
      .call(() => setStatus('INTRO'))
      .to(q('.intro-words .kinetic-letter'), { yPercent: 0, rotation: 0, opacity: 1, duration: CONTENT.motion.typeDuration, stagger: { each: CONTENT.motion.typeStagger, from: 'start' }, ease: 'back.out(1.4)' })
      .to(q('.intro-kicker, .intro-subtitle'), { opacity: 1, y: 0, duration: 0.42, stagger: 0.12 }, '-=0.35')
      .to(q('.intro-rule'), { scaleX: 1, duration: 0.55, ease: 'power3.out' }, '-=0.3')
      .to(q('.scene-intro'), { autoAlpha: 0, scale: 1.08, filter: 'blur(8px)', duration: CONTENT.motion.transition, ease: 'power2.in' }, '+=0.35')
      .addLabel('code')
      .set(q('.scene-code'), { autoAlpha: 1 })
      .call(() => setStatus('CODE'))
      .to(q('.editor'), { clipPath: 'inset(0 0 0 0)', duration: CONTENT.motion.transition, ease: 'power3.inOut' })
      .to(q('.code-line'), { opacity: 1, x: 0, duration: 0.32, stagger: 0.12 }, '-=0.15')
      .to(q('.scan'), { xPercent: 140, duration: 0.8, ease: 'power2.inOut' }, '-=0.12')
      .to(q('.scene-code'), { autoAlpha: 0, x: -45, filter: 'blur(6px)', duration: CONTENT.motion.transition, ease: 'power2.in' }, '+=0.38')
      .addLabel('impact')
      .set(q('.scene-impact'), { autoAlpha: 1, x: 55, filter: 'blur(5px)' })
      .call(() => setStatus('IMPACT'))
      .to(q('.scene-impact'), { x: 0, filter: 'blur(0px)', duration: 0.38, ease: 'power3.out' })
      .to(q('.flash'), { opacity: CONTENT.motion.flashOpacity, duration: 0.055, yoyo: true, repeat: 1, ease: 'none' }, '<')
      .to(q('.impact-words .kinetic-letter'), { yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: CONTENT.motion.typeDuration, stagger: { each: CONTENT.motion.typeStagger, from: 'start' }, ease: 'back.out(1.7)' }, '-=0.16')
      .to(q('.orbit'), { scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.48')
      .to(q('.scene-impact'), { autoAlpha: 0, scale: 0.92, rotation: 2, filter: 'blur(7px)', duration: CONTENT.motion.transition, ease: 'power2.in' }, '+=0.42')
      .addLabel('data')
      .set(q('.scene-data'), { autoAlpha: 1, scale: 1.07, filter: 'blur(5px)' })
      .call(() => setStatus('DATA'))
      .to(q('.scene-data'), { scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' })
      .to(q('.data-kicker, .data-caption'), { opacity: 1, y: 0, duration: 0.38, stagger: 0.12 }, '-=0.24')
      .to(q('.metric-value'), { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.48, ease: 'back.out(1.5)' }, '-=0.2')
      .to(counter, {
        value: CONTENT.scenes.data.metric.to,
        duration: CONTENT.motion.metricDuration,
        ease: 'power2.out',
        onUpdate: () => {
          const value = root.current?.querySelector('.metric-value');
          const metric = CONTENT.scenes.data.metric;
          if (value) value.textContent = `${metric.prefix}${Math.round(counter.value).toLocaleString()}`;
        }
      }, '-=0.05')
      .to(q('.graph-bar'), { scaleY: 1, duration: CONTENT.motion.chartDuration, stagger: CONTENT.motion.typeStagger * 2, ease: 'back.out(1.5)' }, '-=0.85')
      .to(q('.scene-data'), { autoAlpha: 0, y: -35, filter: 'blur(6px)', duration: CONTENT.motion.transition, ease: 'power2.in' }, '+=0.32')
      .addLabel('outro')
      .set(q('.scene-outro'), { autoAlpha: 1, y: 35 })
      .call(() => setStatus('OUTRO'))
      .to(q('.scene-outro'), { y: 0, duration: 0.38, ease: 'power3.out' })
      .to(q('.outro-words .kinetic-letter'), { yPercent: 0, opacity: 1, duration: CONTENT.motion.typeDuration, stagger: { each: CONTENT.motion.typeStagger, from: 'start' }, ease: 'power3.out' }, '-=0.18')
      .to(q('.outro-subtitle'), { opacity: 1, x: 0, duration: 0.4 }, '-=0.25')
      .to(q('.outro-rule'), { scaleX: 1, duration: 0.45 }, '-=0.28');

    if (root.current.classList.contains('fx-camera')) {
      tl.to(camera, { scale: CONTENT.motion.cameraScale, duration: CONTENT.motion.cameraDuration, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '-=0.35');
    }

    tl.to(q('.pulse-dot'), { scale: 1.5, opacity: 0.3, duration: 0.25, yoyo: true, repeat: 3 }, '<');
    tl.to({}, { duration: Math.max(0, CONTENT.project.duration - tl.duration()) });
    setDuration(tl.duration());
  };

  const togglePlayback = () => {
    if (!timeline.current || timeline.current.progress() === 1) {
      run();
      return;
    }
    if (timeline.current.paused()) {
      timeline.current.play();
      setPlaying(true);
      setStatus('PLAYING');
    } else {
      timeline.current.pause();
      setPlaying(false);
      setStatus('PAUSED');
    }
  };

  const seek = (value) => {
    if (!timeline.current) return;
    timeline.current.pause();
    timeline.current.progress(value);
    setPlaying(false);
    setStatus(value === 1 ? 'COMPLETE' : 'PAUSED');
  };

  useLayoutEffect(() => () => timeline.current?.kill(), []);
  return { root, run, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline: Boolean(timeline.current) };
}

function CodeLine({ children, index }) {
  return <div className="code-line" data-anim><span className="line-no">{String(index + 1).padStart(2, '0')}</span><span>{children}</span></div>;
}

function Graph({ values }) {
  return <div className="graph" aria-label="animated growth graph">
    {values.map((value, index) => <div className="graph-col" key={index}>
      <div className="graph-bar" style={{ height: `${value}%` }} />
      <span>{index + 1}</span>
    </div>)}
  </div>;
}

function App() {
  const { root, run, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline } = useTimeline();
  const [effects, setEffects] = useState(CONTENT.effects);
  const effectClass = Object.entries(effects).filter(([, enabled]) => enabled).map(([name]) => `fx-${name}`).join(' ');
  const playhead = `${progress * 100}%`;
  const elapsed = progress === 1 ? Math.ceil(duration) : Math.floor(progress * duration);
  const project = CONTENT.project;
  const scenes = CONTENT.scenes;

  const toggleEffect = (effect) => {
    setEffects(current => ({ ...current, [effect]: !current[effect] }));
  };

  return <main className="studio" style={{ '--accent': CONTENT.theme.accent }}>
    <header className="studio-header">
      <div className="studio-brand"><span className="brand-mark">K</span><span>KEDIT<span className="brand-muted"> / MOTION</span></span></div>
      <div className="project-name"><span className="live-dot" />{project.name} <span className="project-separator">/</span> {project.format}</div>
      <div className="header-version">MOTION ENGINE <span>01</span></div>
    </header>

    <div className="workspace">
      <aside className="side-panel">
        <div className="panel-heading"><span>COMPOSITION</span><span className="panel-menu">•••</span></div>
        <div className="composition-card">
          <div className="composition-thumb"><span>{project.aspectRatio}</span><i /></div>
          <div><strong>Portrait {project.width}</strong><small>{project.width} × {project.height} · {project.fps} FPS</small></div>
          <span className="active-indicator" />
        </div>
        <div className="panel-divider" />
        <div className="panel-heading"><span>EFFECTS</span><span className="effect-count">03</span></div>
        <p className="panel-caption">Glow and grain apply live; camera applies on play.</p>
        <div className="effect-list">
          <button className={`effect-row ${effects.glow ? 'is-enabled' : ''}`} aria-pressed={effects.glow} onClick={() => toggleEffect('glow')}>
            <span className="effect-icon glow-icon">✳</span><span><strong>Bloom / Glow</strong><small>Highlight emission</small></span><i className="toggle-switch" />
          </button>
          <button className={`effect-row ${effects.grain ? 'is-enabled' : ''}`} aria-pressed={effects.grain} onClick={() => toggleEffect('grain')}>
            <span className="effect-icon grain-icon">▦</span><span><strong>Film Grain</strong><small>Fine texture overlay</small></span><i className="toggle-switch" />
          </button>
          <button className={`effect-row ${effects.camera ? 'is-enabled' : ''}`} aria-pressed={effects.camera} onClick={() => toggleEffect('camera')}>
            <span className="effect-icon camera-icon">◉</span><span><strong>Camera Punch</strong><small>Subtle push-in move</small></span><i className="toggle-switch" />
          </button>
        </div>
        <div className="panel-divider" />
        <div className="panel-heading"><span>TRANSITIONS</span><span className="effect-count">04</span></div>
        <div className="transition-list">
          <div><span className="transition-glyph wipe-glyph">↗</span><span>Kinetic type</span><small>{CONTENT.motion.typeDuration.toFixed(1)}s</small></div>
          <div><span className="transition-glyph blur-glyph">◧</span><span>Editor wipe</span><small>{CONTENT.motion.transition.toFixed(1)}s</small></div>
          <div><span className="transition-glyph flash-glyph">✦</span><span>Flash impact</span><small>0.1s</small></div>
          <div><span className="transition-glyph zoom-glyph">◎</span><span>Camera punch</span><small>{CONTENT.motion.cameraDuration.toFixed(1)}s</small></div>
        </div>
        <div className="panel-note"><span>✦</span> EDIT CONTENT IN <b>src/main.jsx</b></div>
      </aside>

      <section className="preview-column" aria-label="Composition preview">
        <div className="preview-toolbar"><span><i className="toolbar-dot" />COMPOSITION VIEW</span><span>FIT <b>100%</b></span></div>
        <section className={`stage ${effectClass}`} ref={root} style={{ '--accent': CONTENT.theme.accent, '--scene-background': CONTENT.theme.background, '--display-font': CONTENT.theme.displayFont, '--frame-width': project.width, '--frame-height': project.height }}>
          <div className="camera-layer">
            <div className="grain" />
            <div className="stage-grid" />
            <div className="scan" data-anim />
            <div className="flash" data-anim />
            <header className="topbar">
              <div><span className="brand-dot pulse-dot" />{CONTENT.brand}</div>
              <div className="status">{status}<span className="status-dot" /></div>
            </header>
            <div className="scene-stage">
              <section className="motion-scene scene-intro">
                <div className="intro-side-note">{scenes.intro.eyebrow}</div>
                <div className="intro-orb" />
                <div className="intro-copy">
                  <div className="intro-kicker"><span className="kicker-line" />{scenes.intro.kicker.split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}</div>
                  <h1 className="intro-title"><KineticWords text={scenes.intro.title} className="intro-words" /></h1>
                  <div className="motion-rule intro-rule" />
                  <p className="intro-subtitle">{scenes.intro.subtitle}</p>
                </div>
                <div className="intro-index"><span>{scenes.intro.index}</span><i />{scenes.intro.label}</div>
              </section>

              <section className="motion-scene scene-code">
                <div className="scene-meta"><span>{scenes.code.index} / {scenes.code.label}</span><span>{scenes.code.inputLabel}</span></div>
                <div className="code-headline">{scenes.code.headline.split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <em>{line}</em> : line}</React.Fragment>)}</div>
                <div className="editor">
                  <div className="editor-head"><span>◈ &nbsp; {scenes.code.fileName}</span><span>● ● ●</span></div>
                  <div className="code-body">{scenes.code.code.map((line, index) => <CodeLine key={index} index={index}>{highlightCode(line)}</CodeLine>)}</div>
                </div>
                <div className="code-stamp"><span>{scenes.code.stamp}</span><b>↗</b></div>
                <div className="scene-footnote">{scenes.code.footnote}</div>
              </section>

              <section className="motion-scene scene-impact">
                <div className="impact-top"><span>{scenes.impact.eyebrow}</span><span>{scenes.impact.index} / {scenes.impact.label}</span></div>
                <div className="impact-orbit orbit" />
                <div className="impact-copy">
                  <div className="impact-overline">{scenes.impact.overline}</div>
                  <div className="impact-word"><KineticWords text={scenes.impact.word} className="impact-words" /></div>
                  <div className="impact-underline" />
                  <div className="impact-bottom">{scenes.impact.bottom.split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <b>{line}</b> : line}</React.Fragment>)}</div>
                </div>
                <div className="impact-side">{scenes.impact.sideNote.split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)} <span>✳</span></div>
              </section>

              <section className="motion-scene scene-data">
                <div className="data-topline"><span>{scenes.data.index} / {scenes.data.label}</span><span>{scenes.data.sideLabel}</span></div>
                <div className="data-title">{scenes.data.headline.split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{index === 1 ? <em>{line}</em> : line}</React.Fragment>)}</div>
                <div className="metric">
                  <div className="data-kicker">{scenes.data.metric.label} <span>↗ {scenes.data.metricTrend}</span></div>
                  <div className="metric-value">{scenes.data.metric.prefix}{scenes.data.metric.from.toLocaleString()}</div>
                  <Graph values={scenes.data.graph} />
                  <div className="data-caption">{scenes.data.captions.map(caption => <span key={caption}>{caption}</span>)}</div>
                </div>
                <div className="data-footnote">{scenes.data.footnote}</div>
              </section>

              <section className="motion-scene scene-outro">
                <div className="outro-backdrop">{scenes.outro.backdrop}</div>
                <div className="outro-index">{scenes.outro.index} / {scenes.outro.label}</div>
                <div className="outro-copy">
                  <div className="outro-kicker">{scenes.outro.kicker}</div>
                  <div className="outro-title"><KineticWords text={scenes.outro.title} className="outro-words" /></div>
                  <div className="motion-rule outro-rule" />
                  <p className="outro-subtitle">{scenes.outro.subtitle}</p>
                </div>
                <div className="outro-cta"><span>{scenes.outro.callToAction}</span><b>↗</b></div>
              </section>
            </div>
            <div className="frame-corner corner-tl" /><div className="frame-corner corner-tr" />
            <footer><span>{CONTENT.footer}</span><span>{project.width} × {project.height} <i>·</i> {project.aspectRatio}</span></footer>
          </div>
        </section>
        <div className="preview-caption"><span><i className="caption-dot" />LIVE PREVIEW</span><span>DRAG PLAYHEAD TO SCRUB</span></div>
      </section>

      <aside className="inspector">
        <div className="panel-heading"><span>PROJECT</span><button className="inspector-action" aria-label="Project options">•••</button></div>
        <div className="inspector-block"><label>PROJECT NAME</label><div className="inspector-value">{project.name} <span>✎</span></div></div>
        <div className="inspector-block"><label>FRAME SIZE</label><div className="inspector-value">{project.width} × {project.height} <span className="value-badge">{project.aspectRatio}</span></div></div>
        <div className="inspector-block"><label>FRAME RATE</label><div className="inspector-value">{project.fps} fps <span className="inspector-chevron">⌄</span></div></div>
        <div className="panel-divider" />
        <div className="panel-heading"><span>RENDER</span><span className="ready-badge">READY</span></div>
        <div className="render-card"><div className="render-icon">↗</div><strong>Browser preview</strong><small>Capture the composition in Chromium.</small><div className="render-spec">H.264 <span>·</span> {project.width} × {project.height} <span>·</span> {project.fps} fps</div></div>
        <button className="render-button" onClick={() => window.open('https://playwright.dev/docs/videos', '_blank', 'noopener,noreferrer')}>EXPORT WORKFLOW <span>↗</span></button>
        <p className="export-note">Automated video export requires a browser-capture workflow. This preview does not encode video by itself.</p>
      </aside>
    </div>

    <section className="timeline-panel" aria-label="Animation timeline">
      <div className="timeline-top">
        <div className="timeline-title"><span className="timeline-icon">◷</span><strong>ANIMATION TIMELINE</strong><span className="timeline-duration">{formatTime(Math.ceil(duration))}</span></div>
        <div className="timeline-actions">
          <button className="transport-button" onClick={togglePlayback} aria-label={playing ? 'Pause animation' : 'Play animation'}>{playing ? 'Ⅱ' : '▶'}</button>
          <button className="transport-button reset-button" onClick={reset} aria-label="Reset animation">↺</button>
          <span className="time-readout">{formatTime(elapsed)} <i>/</i> {formatTime(Math.ceil(duration))}</span>
        </div>
      </div>
      <div className={`timeline-track ${hasTimeline ? 'has-timeline' : ''}`}>
        <div className="track-label">MASTER</div>
        <div className="track-content">
          <div className="clip-row">{CLIPS.map((clip, index) => {
            const scene = scenes[clip.key];
            return <div className={`timeline-clip clip-${index + 1}`} key={clip.key} style={{ width: `${clip.width}%` }}>{scene.index} &nbsp; {scene.label}</div>;
          })}</div>
          <div className="playhead" style={{ left: playhead }} />
          <input
            className="scrubber"
            aria-label="Scrub animation timeline"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            disabled={!hasTimeline}
            onChange={(event) => seek(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="timeline-bottom"><span>SCENE TRANSITIONS <i>TYPE</i> <i>WIPE</i> <i>FLASH</i> <i>PUSH</i></span><span>GSAP · NON-DESTRUCTIVE PREVIEW</span></div>
    </section>
    <footer className="studio-footer"><span>KEDIT MOTION ENGINE <b>01.0</b></span><span>CONTENT-DRIVEN MOTION GRAPHICS</span><span className="footer-status"><i /> ALL CHANGES SAVED</span></footer>
  </main>;
}

function highlightCode(line) {
  const escaped = line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return <span dangerouslySetInnerHTML={{ __html: escaped
    .replace(/\b(const|let|var|if|else|return)\b/g, '<i>$1</i>')
    .replace(/\b(assets|income|skills|time|wealth|cashflow)\b/g, '<b>$1</b>')
    .replace(/(\d+)/g, '<em>$1</em>') }} />;
}

createRoot(document.getElementById('root')).render(<App />);
