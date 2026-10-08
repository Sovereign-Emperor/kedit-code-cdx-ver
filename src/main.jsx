import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import './styles.css';

// ============================================================
// KEDIT-CODE CONTENT: change this object for the next edit.
// Keep the animation engine below unchanged whenever possible.
// ============================================================
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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function useTimeline() {
  const root = useRef(null);
  const timeline = useRef(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('READY');

  const reset = () => {
    timeline.current?.kill();
    if (root.current) gsap.set(root.current.querySelectorAll('[data-anim]'), { clearProps: 'all' });
    setRunning(false);
    setStatus('READY');
  };

  const run = () => {
    timeline.current?.kill();
    setRunning(true);
    setStatus('BOOTING');
    const q = (s) => root.current?.querySelectorAll(s);
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => { setRunning(false); setStatus('COMPILED'); }
    });
    timeline.current = tl;

    gsap.set(q('[data-anim]'), { clearProps: 'all' });
    gsap.set(q('.boot'), { opacity: 0, y: 10 });
    gsap.set(q('.code-line'), { opacity: 0, x: -18 });
    gsap.set(q('.keyword'), { opacity: 0, scale: 0.75, y: 12 });
    gsap.set(q('.metric'), { opacity: 0, scale: 0.8 });
    gsap.set(q('.graph-bar'), { scaleY: 0 });
    gsap.set(q('.final'), { opacity: 0, y: 25, scale: 0.96 });
    gsap.set(q('.scan'), { xPercent: -100 });

    tl.to(q('.boot'), { opacity: 1, y: 0, duration: .35, stagger: .12 })
      .call(() => setStatus('PARSING'))
      .to(q('.code-line'), { opacity: 1, x: 0, duration: .42, stagger: .16 })
      .call(() => setStatus('EXECUTING'))
      .to(q('.scan'), { xPercent: 100, duration: .9 })
      .to(q('.keyword'), { opacity: 1, scale: 1, y: 0, duration: .55 })
      .call(() => setStatus('CALCULATING'))
      .to(q('.metric'), { opacity: 1, scale: 1, duration: .5 })
      .call(() => animateCounter(root.current?.querySelector('.metric-value'), CONTENT.metric.from, CONTENT.metric.to, 1400))
      .call(() => setStatus('VISUALIZING'))
      .to(q('.graph-bar'), { scaleY: 1, duration: .5, stagger: .08, transformOrigin: 'bottom' })
      .call(() => setStatus('FINALIZING'))
      .to(q('.final'), { opacity: 1, y: 0, scale: 1, duration: .7 })
      .to(q('.pulse-dot'), { scale: 1.5, opacity: .3, duration: .25, yoyo: true, repeat: 3 }, '<');
  };

  useLayoutEffect(() => reset, []);
  return { root, run, reset, running, status };
}

function animateCounter(node, from, to, duration) {
  if (!node) return;
  const state = { value: from };
  gsap.to(state, {
    value: to,
    duration: duration / 1000,
    ease: 'power2.out',
    onUpdate: () => { node.textContent = `${CONTENT.metric.prefix}${Math.round(state.value).toLocaleString()}`; }
  });
}

function CodeLine({ children, index }) {
  return <div className="code-line" data-anim><span className="line-no">{String(index + 1).padStart(2, '0')}</span><span>{children}</span></div>;
}

function Graph({ values }) {
  return <div className="graph" aria-label="animated growth graph">
    {values.map((v, i) => <div className="graph-col" key={i}><div className="graph-bar" data-anim style={{ height: `${v}%` }} /><span>{i + 1}</span></div>)}
  </div>;
}

function App() {
  const { root, run, reset, running, status } = useTimeline();
  return <main className="stage-shell">
    <section className="stage" ref={root} style={{ '--accent': CONTENT.accent }}>
      <div className="grain" />
      <div className="scan" data-anim />
      <header className="topbar">
        <div><span className="brand-dot pulse-dot" />{CONTENT.brand}</div>
        <div className="status"><span className="status-dot" />{status}</div>
      </header>

      <div className="content">
        <div className="boot" data-anim><span className="muted">$</span> init {CONTENT.eyebrow.replace('// ', '')}</div>
        <div className="boot tiny" data-anim>→ loading animation modules...</div>
        <div className="boot tiny" data-anim>→ runtime ready</div>

        <div className="title-block">
          <div className="eyebrow">{CONTENT.eyebrow}</div>
          <h1>{CONTENT.title}</h1>
          <p>{CONTENT.subtitle}</p>
        </div>

        <div className="editor">
          <div className="editor-head"><span>main.js</span><span>● ● ●</span></div>
          <div className="code-body">
            {CONTENT.code.map((line, i) => <CodeLine key={i} index={i}>{highlightCode(line)}</CodeLine>)}
          </div>
        </div>

        <div className="keyword" data-anim>{CONTENT.keyword}</div>

        <div className="data-grid">
          <div className="metric" data-anim><div className="label">{CONTENT.metric.label}</div><div className="metric-value">{CONTENT.metric.prefix}{CONTENT.metric.from.toLocaleString()}</div><div className="delta">EXECUTING → COMPOUND</div></div>
          <Graph values={CONTENT.graph} />
        </div>

        <div className="final" data-anim>{CONTENT.final}</div>
      </div>

      <footer><span>{CONTENT.footer}</span><span>1080 × 1920 / 9:16</span></footer>
    </section>
    <div className="controls"><button onClick={run} disabled={running}>▶ RUN CODE</button><button onClick={reset}>↻ RESET</button></div>
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
