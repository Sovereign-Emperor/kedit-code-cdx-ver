import React from 'react';
import { EFFECTS, TRANSITION_STYLES } from '../motionPresets.js';

export const EDIT_FORMATS = [
  { id: 'motion', name: 'Motion Edit', detail: 'Five-scene sequence', icon: '▶' },
  { id: 'carousel', name: 'Carousel', detail: 'Flat editorial cards', icon: '▤' },
  { id: '3d-carousel', name: '3D Scenes', detail: 'Perspective carousel', icon: '◈' }
];

// Edit format changes the visual treatment; the independently selected pack
// continues to supply the story and theme for every format.
export function EditFormatSelector({ value, onChange, formats = EDIT_FORMATS }) {
  return <>
    <div className="panel-divider" />
    <div className="pack-heading"><span>EDITS</span><span>{String(formats.length).padStart(2, '0')}</span></div>
    <p className="panel-caption">Choose how this pack is presented.</p>
    <div className="edit-format-list" role="group" aria-label="Edit format">
      {formats.map(format => <button
        className={`edit-format-card ${value === format.id ? 'is-selected' : ''}`}
        type="button"
        key={format.id}
        aria-pressed={value === format.id}
        onClick={() => onChange(format.id)}
      >
        <span className="edit-format-icon" aria-hidden="true">{format.icon}</span>
        <span className="edit-format-copy"><strong>{format.name}</strong><small>{format.detail}</small></span>
        <i className="edit-format-check" />
      </button>)}
    </div>
  </>;
}

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

// Effect rows are data-driven, so new toggles do not duplicate panel markup.
export function EffectControls({
  value,
  onChange,
  effects = EFFECTS,
  description = 'Most effects apply live; camera movement is applied on playback.'
}) {
  return <>
    <div className="panel-divider" />
    <div className="panel-heading"><span>EFFECTS</span><span className="effect-count">{String(effects.length).padStart(2, '0')}</span></div>
    <p className="panel-caption">{description}</p>
    <div className="effect-list">
      {effects.map(effect => <button
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

export function TransitionList({ motion, value, onChange, styles = TRANSITION_STYLES }) {
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
    <label className="transition-style-label" htmlFor="transition-style">EDIT TREATMENT</label>
    <select id="transition-style" className="transition-style-select" value={value} onChange={event => onChange(event.target.value)}>
      {styles.map(style => <option value={style.id} key={style.id}>{style.label} — {style.detail}</option>)}
    </select>
  </>;
}

// Transport and scrub controls are shared by every selected scene pack.
export function TimelinePanel({ clips, packName, progress, duration, playing, hasTimeline, transportEnabled = true, onPlayPause, onReset, onSeek }) {
  const elapsed = progress === 1 ? Math.ceil(duration) : Math.floor(progress * duration);
  const formatTime = (seconds) => `00:${String(seconds).padStart(2, '0')}`;

  return <section className="timeline-panel" aria-label="Animation timeline">
    <div className="timeline-top">
      <div className="timeline-title"><span className="timeline-icon">◷</span><strong>ANIMATION TIMELINE</strong><span className="timeline-duration">{formatTime(Math.ceil(duration))}</span></div>
      <div className="timeline-actions">
        <button className="transport-button" onClick={onPlayPause} disabled={!transportEnabled} aria-label={playing ? 'Pause animation' : 'Play animation'}>{playing ? 'Ⅱ' : '▶'}</button>
        <button className="transport-button reset-button" onClick={onReset} disabled={!transportEnabled} aria-label="Reset animation">↺</button>
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
          disabled={!hasTimeline || !transportEnabled}
          onChange={event => onSeek(Number(event.target.value))}
        />
      </div>
    </div>
    <div className="timeline-bottom"><span>ACTIVE PACK <i>{packName.toUpperCase()}</i> <i>TYPE</i> <i>WIPE</i> <i>FLASH</i></span><span>{transportEnabled ? 'GSAP · REUSABLE SCENE ENGINE' : 'EDIT PREVIEW · SELECT MOTION EDIT TO PLAY'}</span></div>
  </section>;
}
