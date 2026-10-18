import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import './styles.css';

const CONTENT = {
  brand: 'SOVEREIGN EMPEROR',
  eyebrow: '// WEALTH_ENGINE.js',
  title: 'THE WEALTH EQUATION',
  subtitle: 'Income starts the game. Ownership changes the game.',
  code: [
    'const income = 1000;',
    'let assets = 0;',
    'assets += skills;',
    'assets *= time;',
    'wealth = assets + cashflow;'
  ],
  keyword: 'OWNERSHIP',
  metric: { label: 'ASSET VALUE', from: 1000, to: 100000, prefix: '$' },
  graph: [8, 13, 17, 29, 42, 58, 78, 100],
  final: 'BUILD ASSETS. COMPOUND VALUE.',
  footer: 'KEDIT-CODE / 001',
  accent: '#c7a34b'
};

const TIMELINE_DURATION = 8;

const CLIPS = [
  { label: '01  INTRO', width: 19 },
  { label: '02  CODE', width: 23 },
  { label: '03  IMPACT', width: 19 },
  { label: '04  DATA', width: 22 },
  { label: '05  OUTRO', width: 17 }
];

function resetMetric(root) {
  const value = root?.querySelector('.metric-value');
  if (value) value.textContent = `${CONTENT.metric.prefix}${CONTENT.metric.from.toLocaleString()}`;
}

function formatTime(seconds) {
  return `00:${String(seconds).padStart(2, '0')}`;
}

function useTimeline() {
  const root = useRef(null);
  const timeline = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(TIMELINE_DURATION);
  const [status, setStatus] = useState('READY');

  const reset = () => {
    timeline.current?.kill();
    timeline.current = null;
    if (root.current) {
      gsap.set(root.current.querySelectorAll('[data-anim]'), { clearProps: 'all' });
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
    gsap.set(camera, { clearProps: 'all', scale: 1 });
    gsap.set(q('.boot'), { opacity: 0, y: 10 });
    gsap.set(q('.title-block'), { opacity: 0, y: 24, filter: 'blur(8px)' });
    gsap.set(q('.editor'), { opacity: 0, y: 18, clipPath: 'inset(0 100% 0 0 round 12px)' });
    gsap.set(q('.code-line'), { opacity: 0, x: -18 });
    gsap.set(q('.keyword'), { opacity: 0, scale: 0.72, rotationX: 45, filter: 'blur(10px)' });
    gsap.set(q('.metric'), { opacity: 0, scale: 0.82, y: 12 });
    gsap.set(q('.graph-bar'), { scaleY: 0, transformOrigin: 'bottom' });
    gsap.set(q('.final'), { opacity: 0, y: 25, scale: 0.96, filter: 'blur(8px)' });
    gsap.set(q('.scan'), { xPercent: -140 });
    gsap.set(q('.flash'), { opacity: 0 });

    const counter = { value: CONTENT.metric.from };
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
      .to(q('.boot'), { opacity: 1, y: 0, duration: 0.35, stagger: 0.12 })
      .call(() => setStatus('INTRO'))
      .to(q('.title-block'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 })
      .addLabel('code')
      .call(() => setStatus('CODE'))
      .to(q('.editor'), { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0 round 12px)', duration: 0.55 })
      .to(q('.code-line'), { opacity: 1, x: 0, duration: 0.32, stagger: 0.12 }, '-=0.18')
      .to(q('.scan'), { xPercent: 140, duration: 0.8, ease: 'power2.inOut' }, '-=0.15')
      .addLabel('impact')
      .call(() => setStatus('IMPACT'))
      .to(q('.flash'), { opacity: 0.45, duration: 0.06, yoyo: true, repeat: 1 }, '-=0.18')
      .to(q('.keyword'), { opacity: 1, scale: 1, rotationX: 0, filter: 'blur(0px)', duration: 0.65 })
      .addLabel('data')
      .call(() => setStatus('DATA'))
      .to(q('.metric'), { opacity: 1, scale: 1, y: 0, duration: 0.5 })
      .to(counter, {
        value: CONTENT.metric.to,
        duration: 1.25,
        ease: 'power2.out',
        onUpdate: () => {
          const value = root.current?.querySelector('.metric-value');
          if (value) value.textContent = `${CONTENT.metric.prefix}${Math.round(counter.value).toLocaleString()}`;
        }
      }, '-=0.1')
      .to(q('.graph-bar'), { scaleY: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.5)' }, '-=0.85');

    if (root.current.classList.contains('fx-camera')) {
      tl.to(camera, { scale: 1.045, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '-=0.35');
    }

    tl.addLabel('outro')
      .call(() => setStatus('OUTRO'))
      .to(q('.final'), { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.7 })
      .to(q('.pulse-dot'), { scale: 1.5, opacity: 0.3, duration: 0.25, yoyo: true, repeat: 3 }, '<');
    tl.to({}, { duration: Math.max(0, TIMELINE_DURATION - tl.duration()) });
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
      <div className="graph-bar" data-anim style={{ height: `${value}%` }} />
      <span>{index + 1}</span>
    </div>)}
  </div>;
}

function App() {
  const { root, run, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline } = useTimeline();
  const [effects, setEffects] = useState({ glow: true, grain: true, camera: true });
  const effectClass = Object.entries(effects).filter(([, enabled]) => enabled).map(([name]) => `fx-${name}`).join(' ');
  const playhead = `${progress * 100}%`;
  const elapsed = progress === 1 ? Math.ceil(duration) : Math.floor(progress * duration);

  const toggleEffect = (effect) => {
    setEffects(current => ({ ...current, [effect]: !current[effect] }));
  };

  return <main className="studio">
    <header className="studio-header">
      <div className="studio-brand"><span className="brand-mark">K</span><span>KEDIT<span className="brand-muted"> / MOTION</span></span></div>
      <div className="project-name"><span className="live-dot" />UNTITLED PROJECT <span className="project-separator">/</span> 9:16 SOCIAL</div>
      <div className="header-version">MOTION ENGINE <span>01</span></div>
    </header>

    <div className="workspace">
      <aside className="side-panel">
        <div className="panel-heading"><span>COMPOSITION</span><span className="panel-menu">•••</span></div>
        <div className="composition-card">
          <div className="composition-thumb"><span>9:16</span><i /></div>
          <div><strong>Portrait 1080</strong><small>1080 × 1920 · 30 FPS</small></div>
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
          <div><span className="transition-glyph wipe-glyph">◧</span><span>Wipe reveal</span><small>0.8s</small></div>
          <div><span className="transition-glyph blur-glyph">◌</span><span>Focus pull</span><small>0.8s</small></div>
          <div><span className="transition-glyph flash-glyph">✦</span><span>Flash cut</span><small>0.1s</small></div>
          <div><span className="transition-glyph zoom-glyph">◎</span><span>Camera punch</span><small>0.5s</small></div>
        </div>
        <div className="panel-note"><span>✦</span> EDIT CONTENT IN <b>src/main.jsx</b></div>
      </aside>

      <section className="preview-column" aria-label="Composition preview">
        <div className="preview-toolbar"><span><i className="toolbar-dot" />COMPOSITION VIEW</span><span>FIT <b>100%</b></span></div>
        <section className={`stage ${effectClass}`} ref={root} style={{ '--accent': CONTENT.accent }}>
          <div className="camera-layer">
            <div className="grain" />
            <div className="scan" data-anim />
            <div className="flash" data-anim />
            <header className="topbar">
              <div><span className="brand-dot pulse-dot" />{CONTENT.brand}</div>
              <div className="status"><span className="status-dot" />{status}</div>
            </header>
            <div className="content">
              <div className="boot" data-anim><span className="muted">$</span> init {CONTENT.eyebrow.replace('// ', '')}</div>
              <div className="boot tiny" data-anim>→ loading animation modules...</div>
              <div className="boot tiny" data-anim>→ runtime ready</div>
              <div className="title-block" data-anim>
                <div className="eyebrow">{CONTENT.eyebrow}</div>
                <h1>{CONTENT.title}</h1>
                <p>{CONTENT.subtitle}</p>
              </div>
              <div className="editor" data-anim>
                <div className="editor-head"><span>main.js</span><span>● ● ●</span></div>
                <div className="code-body">{CONTENT.code.map((line, index) => <CodeLine key={index} index={index}>{highlightCode(line)}</CodeLine>)}</div>
              </div>
              <div className="keyword" data-anim>{CONTENT.keyword}</div>
              <div className="data-grid">
                <div className="metric" data-anim><div className="label">{CONTENT.metric.label}</div><div className="metric-value">{CONTENT.metric.prefix}{CONTENT.metric.from.toLocaleString()}</div><div className="delta">EXECUTING → COMPOUND</div></div>
                <Graph values={CONTENT.graph} />
              </div>
              <div className="final" data-anim>{CONTENT.final}</div>
            </div>
            <footer><span>{CONTENT.footer}</span><span>1080 × 1920 / 9:16</span></footer>
          </div>
        </section>
        <div className="preview-caption"><span><i className="caption-dot" />LIVE PREVIEW</span><span>DRAG PLAYHEAD TO SCRUB</span></div>
      </section>

      <aside className="inspector">
        <div className="panel-heading"><span>PROJECT</span><button className="inspector-action" aria-label="Project options">•••</button></div>
        <div className="inspector-block"><label>PROJECT NAME</label><div className="inspector-value">Untitled Project <span>✎</span></div></div>
        <div className="inspector-block"><label>FRAME SIZE</label><div className="inspector-value">1080 × 1920 <span className="value-badge">9:16</span></div></div>
        <div className="inspector-block"><label>FRAME RATE</label><div className="inspector-value">30 fps <span className="inspector-chevron">⌄</span></div></div>
        <div className="panel-divider" />
        <div className="panel-heading"><span>RENDER</span><span className="ready-badge">READY</span></div>
        <div className="render-card"><div className="render-icon">↗</div><strong>Browser preview</strong><small>Capture the composition in Chromium.</small><div className="render-spec">H.264 <span>·</span> 1080 × 1920 <span>·</span> 30 fps</div></div>
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
          <div className="clip-row">{CLIPS.map((clip, index) => <div className={`timeline-clip clip-${index + 1}`} key={clip.label} style={{ width: `${clip.width}%` }}>{clip.label}</div>)}</div>
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
      <div className="timeline-bottom"><span>SCENE TRANSITIONS <i>WIPE</i> <i>FOCUS</i> <i>FLASH</i></span><span>GSAP · NON-DESTRUCTIVE PREVIEW</span></div>
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
