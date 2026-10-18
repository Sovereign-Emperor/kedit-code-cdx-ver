import React, { useLayoutEffect, useRef } from 'react';

// Shared text animator keeps words accessible while exposing letters to GSAP.
export function KineticWords({ text, className = '' }) {
  return <span className={`kinetic-words ${className}`} aria-label={text}>
    {text.split(' ').map((word, wordIndex) => <span className="kinetic-word" key={`${word}-${wordIndex}`} aria-hidden="true">
      {Array.from(word).map((letter, index) => <span className="kinetic-letter" key={`${letter}-${index}`}>{letter}</span>)}
    </span>)}
  </span>;
}

function LineBreaks({ text, accentLine = -1, className = '' }) {
  return <span className={className}>{text.split('\n').map((line, index) => <React.Fragment key={`${index}-${line}`}>
    {index > 0 && <br />}
    {index === accentLine ? <em>{line}</em> : line}
  </React.Fragment>)}</span>;
}

function highlightCode(line) {
  const escaped = line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return <span dangerouslySetInnerHTML={{ __html: escaped
    .replace(/\b(const|let|var|if|else|return)\b/g, '<i>$1</i>')
    .replace(/\b(assets|income|skills|time|wealth|cashflow)\b/g, '<b>$1</b>')
    .replace(/(\d+)/g, '<em>$1</em>') }} />;
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

function MetricValue({ metric }) {
  const value = useRef(null);
  useLayoutEffect(() => {
    if (value.current) value.current.textContent = `${metric.prefix}${metric.from.toLocaleString()}`;
  }, [metric.from, metric.prefix]);
  return <div className="metric-value" ref={value} />;
}

// Each scene is an independent component; the pack supplies its content.
function IntroScene({ scene }) {
  return <section className="motion-scene scene-intro">
    <div className="intro-side-note">{scene.eyebrow}</div>
    <div className="intro-orb" />
    <div className="intro-copy">
      <div className="intro-kicker"><span className="kicker-line" /><LineBreaks text={scene.kicker} /></div>
      <h1 className="intro-title"><KineticWords text={scene.title} className="intro-words" /></h1>
      <div className="motion-rule intro-rule" />
      <p className="intro-subtitle">{scene.subtitle}</p>
    </div>
    <div className="intro-index"><span>{scene.index}</span><i />{scene.label}</div>
  </section>;
}

function CodeScene({ scene }) {
  return <section className="motion-scene scene-code">
    <div className="scene-meta"><span>{scene.index} / {scene.label}</span><span>{scene.inputLabel}</span></div>
    <div className="code-headline"><LineBreaks text={scene.headline} accentLine={1} /></div>
    <div className="editor">
      <div className="editor-head"><span>◈ &nbsp; {scene.fileName}</span><span>● ● ●</span></div>
      <div className="code-body">{scene.code.map((line, index) => <CodeLine key={`${index}-${line}`} index={index}>{highlightCode(line)}</CodeLine>)}</div>
    </div>
    <div className="code-stamp"><span>{scene.stamp}</span><b>↗</b></div>
    <div className="scene-footnote">{scene.footnote}</div>
  </section>;
}

function ImpactScene({ scene }) {
  return <section className="motion-scene scene-impact">
    <div className="impact-top"><span>{scene.eyebrow}</span><span>{scene.index} / {scene.label}</span></div>
    <div className="impact-orbit orbit" />
    <div className="impact-copy">
      <div className="impact-overline">{scene.overline}</div>
      <div className="impact-word"><KineticWords text={scene.word} className="impact-words" /></div>
      <div className="impact-underline" />
      <div className="impact-bottom"><LineBreaks text={scene.bottom} accentLine={1} /></div>
    </div>
    <div className="impact-side"><LineBreaks text={scene.sideNote} /> <span>✳</span></div>
  </section>;
}

function DataScene({ scene }) {
  return <section className="motion-scene scene-data">
    <div className="data-topline"><span>{scene.index} / {scene.label}</span><span>{scene.sideLabel}</span></div>
    <div className="data-title"><LineBreaks text={scene.headline} accentLine={1} /></div>
    <div className="metric">
      <div className="data-kicker">{scene.metric.label} <span>↗ {scene.metricTrend}</span></div>
      <MetricValue metric={scene.metric} />
      <Graph values={scene.graph} />
      <div className="data-caption">{scene.captions.map(caption => <span key={caption}>{caption}</span>)}</div>
    </div>
    <div className="data-footnote">{scene.footnote}</div>
  </section>;
}

function OutroScene({ scene }) {
  return <section className="motion-scene scene-outro">
    <div className="outro-backdrop">{scene.backdrop}</div>
    <div className="outro-index">{scene.index} / {scene.label}</div>
    <div className="outro-copy">
      <div className="outro-kicker">{scene.kicker}</div>
      <div className="outro-title"><KineticWords text={scene.title} className="outro-words" /></div>
      <div className="motion-rule outro-rule" />
      <p className="outro-subtitle">{scene.subtitle}</p>
    </div>
    <div className="outro-cta"><span>{scene.callToAction}</span><b>↗</b></div>
  </section>;
}

export function MotionScenes({ content, status, stageRef, effectClass }) {
  const { project, scenes, theme } = content;
  return <section
    className={`stage ${effectClass}`}
    ref={stageRef}
    style={{
      '--accent': theme.accent,
      '--scene-background': theme.background,
      '--display-font': theme.displayFont,
      '--frame-width': project.width,
      '--frame-height': project.height
    }}
  >
    <div className="camera-layer">
      <div className="grain" />
      <div className="stage-grid" />
      <div className="vignette" />
      <div className="chromatic-overlay" />
      <div className="light-leak" />
      <div className="scanlines" />
      <div className="scan" data-anim />
      <div className="flash" data-anim />
      <header className="topbar">
        <div><span className="brand-dot pulse-dot" />{content.brand}</div>
        <div className="status">{status}<span className="status-dot" /></div>
      </header>
      <div className="scene-stage">
        <IntroScene scene={scenes.intro} />
        <CodeScene scene={scenes.code} />
        <ImpactScene scene={scenes.impact} />
        <DataScene scene={scenes.data} />
        <OutroScene scene={scenes.outro} />
      </div>
      <div className="frame-corner corner-tl" /><div className="frame-corner corner-tr" />
      <footer><span>{content.footer}</span><span>{project.width} × {project.height} <i>·</i> {project.aspectRatio}</span></footer>
    </div>
  </section>;
}
