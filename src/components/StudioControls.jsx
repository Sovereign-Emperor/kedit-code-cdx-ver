import React from 'react';

// Preset selector: parent owns selection so it can reset the matching timeline.
export function ScenePackSelector({ packs, selectedId, onSelect }) {
  const selected = packs.find(pack => pack.id === selectedId) || packs[0];

  return <>
    <div className="panel-divider" />
    <div className="pack-heading"><span>SCENE PACKS</span><span>{String(packs.length).padStart(2, '0')}</span></div>
    <p className="panel-caption">Swap the full story and visual theme.</p>
    <div className="pack-grid">
      {packs.map(pack => <button
        className={`pack-card ${selected.id === pack.id ? 'is-selected' : ''}`}
        key={pack.id}
        aria-pressed={selected.id === pack.id}
        onClick={() => onSelect(pack)}
        style={{ '--pack-accent': pack.content.theme.accent }}
      >
        <span className="pack-swatch" />
        <span className="pack-copy"><strong>{pack.name}</strong><small>{pack.description}</small></span>
      </button>)}
    </div>
  </>;
}

const EFFECTS = [
  { key: 'glow', icon: '✳', title: 'Bloom / Glow', description: 'Highlight emission' },
  { key: 'grain', icon: '▦', title: 'Film Grain', description: 'Fine texture overlay' },
  { key: 'camera', icon: '◉', title: 'Camera Punch', description: 'Subtle push-in move' }
];

// Effect rows are data-driven, so new toggles do not duplicate panel markup.
export function EffectControls({ value, onChange }) {
  return <>
    <div className="panel-divider" />
    <div className="panel-heading"><span>EFFECTS</span><span className="effect-count">{String(EFFECTS.length).padStart(2, '0')}</span></div>
    <p className="panel-caption">Glow and grain apply live; camera applies on play.</p>
    <div className="effect-list">
      {EFFECTS.map(effect => <button
        className={`effect-row ${value[effect.key] ? 'is-enabled' : ''}`}
        key={effect.key}
        aria-pressed={Boolean(value[effect.key])}
        onClick={() => onChange(effect.key)}
      >
        <span className={`effect-icon ${effect.key}-icon`}>{effect.icon}</span>
        <span><strong>{effect.title}</strong><small>{effect.description}</small></span>
        <i className="toggle-switch" />
      </button>)}
    </div>
  </>;
}

export function TransitionList({ motion }) {
  const transitions = [
    { icon: '↗', className: 'wipe-glyph', label: 'Kinetic type', duration: motion.typeDuration },
    { icon: '◧', className: 'blur-glyph', label: 'Editor wipe', duration: motion.transition },
    { icon: '✦', className: 'flash-glyph', label: 'Flash impact', duration: 0.1 },
    { icon: '◎', className: 'zoom-glyph', label: 'Camera punch', duration: motion.cameraDuration }
  ];

  return <>
    <div className="panel-divider" />
    <div className="panel-heading"><span>TRANSITIONS</span><span className="effect-count">{String(transitions.length).padStart(2, '0')}</span></div>
    <div className="transition-list">
      {transitions.map(item => <div key={item.label}>
        <span className={`transition-glyph ${item.className}`}>{item.icon}</span>
        <span>{item.label}</span>
        <small>{item.duration.toFixed(1)}s</small>
      </div>)}
    </div>
  </>;
}

// Transport and scrub controls are shared by every selected scene pack.
export function TimelinePanel({ clips, packName, progress, duration, playing, hasTimeline, onPlayPause, onReset, onSeek }) {
  const elapsed = progress === 1 ? Math.ceil(duration) : Math.floor(progress * duration);
  const formatTime = (seconds) => `00:${String(seconds).padStart(2, '0')}`;

  return <section className="timeline-panel" aria-label="Animation timeline">
    <div className="timeline-top">
      <div className="timeline-title"><span className="timeline-icon">◷</span><strong>ANIMATION TIMELINE</strong><span className="timeline-duration">{formatTime(Math.ceil(duration))}</span></div>
      <div className="timeline-actions">
        <button className="transport-button" onClick={onPlayPause} aria-label={playing ? 'Pause animation' : 'Play animation'}>{playing ? 'Ⅱ' : '▶'}</button>
        <button className="transport-button reset-button" onClick={onReset} aria-label="Reset animation">↺</button>
        <span className="time-readout">{formatTime(elapsed)} <i>/</i> {formatTime(Math.ceil(duration))}</span>
      </div>
    </div>
    <div className={`timeline-track ${hasTimeline ? 'has-timeline' : ''}`}>
      <div className="track-label">MASTER</div>
      <div className="track-content">
        <div className="clip-row">{clips.map((clip, index) => <div className={`timeline-clip clip-${index + 1}`} key={clip.key} style={{ width: `${clip.width}%` }}>{clip.index} &nbsp; {clip.label}</div>)}</div>
        <div className="playhead" style={{ left: `${progress * 100}%` }} />
        <input
          className="scrubber"
          aria-label="Scrub animation timeline"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          disabled={!hasTimeline}
          onChange={event => onSeek(Number(event.target.value))}
        />
      </div>
    </div>
    <div className="timeline-bottom"><span>ACTIVE PACK <i>{packName.toUpperCase()}</i> <i>TYPE</i> <i>WIPE</i> <i>FLASH</i></span><span>GSAP · REUSABLE SCENE ENGINE</span></div>
  </section>;
}
