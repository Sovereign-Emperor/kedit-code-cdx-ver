import { useState } from 'react';
import { MotionScenes } from './MotionScenes.jsx';
import { SceneCarousel } from './SceneCarousel.jsx';
import { EditFormatSelector, EffectControls, ScenePackSelector, TimelinePanel, TransitionList } from './StudioControls.jsx';
import { PreviewColumn, ProjectInspector, StudioFooter, StudioHeader, StudioSidebar } from './StudioChrome.jsx';
import { SCENE_PACKS, TIMELINE_CLIPS } from '../scenePacks.js';
import { createCarouselSlides } from '../carouselContent.js';
import { useMotionTimeline } from '../hooks/useMotionTimeline.js';
import { EFFECTS, TRANSITION_STYLES } from '../motionPresets.js';
import '../styles.css';

// The studio is reusable as a component: a host can inject packs, clip widths,
// effect options, transition treatments, and its own version label.
export function MotionStudio({
  packs = SCENE_PACKS,
  clips = TIMELINE_CLIPS,
  effectOptions = EFFECTS,
  transitionOptions = TRANSITION_STYLES,
  initialTransition = transitionOptions[0]?.id || TRANSITION_STYLES[0].id,
  engineVersion = '01.0'
}) {
  if (!packs.length) throw new Error('MotionStudio requires at least one scene pack.');
  if (!transitionOptions.some(option => option.id === initialTransition)) {
    throw new Error(`Initial transition "${initialTransition}" is missing from transitionOptions.`);
  }

  const [selectedPackId, setSelectedPackId] = useState(packs[0].id);
  const selectedPack = packs.find(pack => pack.id === selectedPackId) || packs[0];
  const content = selectedPack.content;
  const [editFormat, setEditFormat] = useState('motion');
  const [transitionStyle, setTransitionStyle] = useState(initialTransition);
  const { root, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline } = useMotionTimeline(content, transitionStyle, transitionOptions);
  const [effects, setEffects] = useState(content.effects);
  const effectClass = Object.entries(effects).filter(([, enabled]) => enabled).map(([name]) => `fx-${name}`).join(' ');
  const project = content.project;
  const timelineClips = clips.map(clip => ({ ...clip, ...content.scenes[clip.key] }));
  const carouselSlides = createCarouselSlides(content);

  const toggleEffect = (effect) => {
    setEffects(current => ({ ...current, [effect]: !current[effect] }));
  };

  const selectPack = (pack) => {
    reset();
    setSelectedPackId(pack.id);
    setEffects(pack.content.effects);
  };

  const selectTransitionStyle = (style) => {
    reset();
    setTransitionStyle(style);
  };

  const selectEditFormat = (format) => {
    if (format === editFormat) return;
    reset();
    setEditFormat(format);
  };

  return <main className="studio" style={{ '--accent': content.theme.accent }}>
    <StudioHeader project={project} engineVersion={engineVersion} />
    <div className="workspace">
      <StudioSidebar project={project}>
        <EditFormatSelector value={editFormat} onChange={selectEditFormat} />
        <ScenePackSelector packs={packs} selectedId={selectedPack.id} onSelect={selectPack} />
        <EffectControls value={effects} onChange={toggleEffect} effects={effectOptions} />
        <TransitionList motion={content.motion} value={transitionStyle} onChange={selectTransitionStyle} styles={transitionOptions} />
      </StudioSidebar>
      <PreviewColumn>
        {editFormat === 'motion'
          ? <MotionScenes content={content} status={status} stageRef={root} effectClass={effectClass} />
          : <SceneCarousel slides={carouselSlides} content={content} mode={editFormat} />}
      </PreviewColumn>
      <ProjectInspector
        project={project}
        onExport={() => window.open('https://playwright.dev/docs/videos', '_blank', 'noopener,noreferrer')}
      />
    </div>
    <TimelinePanel
      clips={timelineClips}
      packName={selectedPack.name}
      progress={progress}
      duration={duration}
      playing={playing}
      hasTimeline={hasTimeline && editFormat === 'motion'}
      transportEnabled={editFormat === 'motion'}
      onPlayPause={togglePlayback}
      onReset={reset}
      onSeek={seek}
    />
    <StudioFooter version={engineVersion} />
  </main>;
}
