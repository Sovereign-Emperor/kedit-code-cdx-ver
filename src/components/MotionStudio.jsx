import { useLayoutEffect, useState } from 'react';
import { MotionScenes } from './MotionScenes.jsx';
import { SceneCarousel } from './SceneCarousel.jsx';
import { EditFormatSelector, EffectControls, ScenePackSelector, TimelinePanel, TransitionList } from './StudioControls.jsx';
import { PreviewColumn, ProjectInspector, StudioFooter, StudioHeader, StudioToolDrawer } from './StudioChrome.jsx';
import { SCENE_PACKS, TIMELINE_CLIPS } from '../scenePacks.js';
import { createCarouselSlides } from '../carouselContent.js';
import { createEditTracks, moveEditTrack } from '../editTimeline.js';
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeToolSection, setActiveToolSection] = useState('edits');
  const [transitionStyle, setTransitionStyle] = useState(initialTransition);
  const createTracksFor = packContent => createEditTracks(
    clips.map(clip => ({ ...clip, ...packContent.scenes[clip.key] })),
    packContent.project.duration
  );
  const [tracks, setTracks] = useState(() => createTracksFor(packs[0].content));
  const [motionSettings, setMotionSettings] = useState(() => ({ ...packs[0].content.motion }));
  const { root, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline } = useMotionTimeline(
    content,
    transitionStyle,
    transitionOptions,
    tracks,
    motionSettings
  );
  const [effects, setEffects] = useState(content.effects);
  const effectClass = Object.entries(effects).filter(([, enabled]) => enabled).map(([name]) => `fx-${name}`).join(' ');
  const project = content.project;
  const carouselSlides = createCarouselSlides(content);

  const toggleEffect = (effect) => {
    setEffects(current => ({ ...current, [effect]: !current[effect] }));
  };

  const selectPack = (pack) => {
    reset();
    setSelectedPackId(pack.id);
    setEffects(pack.content.effects);
    setTracks(createTracksFor(pack.content));
    setMotionSettings({ ...pack.content.motion });
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

  const reorderTrack = (key, direction) => {
    const reordered = moveEditTrack(tracks, key, direction);
    reset(reordered);
    setTracks(reordered);
  };

  const changeTrackDuration = (key, value) => {
    reset();
    setTracks(current => current.map(track => track.key === key ? { ...track, duration: value } : track));
  };

  const toggleTrack = (key) => {
    if (tracks.filter(track => track.enabled).length === 1 && tracks.find(track => track.key === key)?.enabled) return;
    const updated = tracks.map(track => track.key === key ? { ...track, enabled: !track.enabled } : track);
    reset(updated);
    setTracks(updated);
  };

  const changeMotionSetting = (key, value) => {
    reset();
    setMotionSettings(current => ({ ...current, [key]: value }));
  };

  const selectToolSection = section => {
    setActiveToolSection(section);
    setToolsOpen(true);
  };

  const handleToolClose = () => setToolsOpen(false);

  useLayoutEffect(() => {
    if (editFormat === 'motion') reset();
  }, [editFormat, tracks]);

  return <main className="studio" style={{ '--accent': content.theme.accent }}>
    <StudioHeader
      project={project}
      engineVersion={engineVersion}
      toolsOpen={toolsOpen}
      onToolsToggle={() => setToolsOpen(open => !open)}
    />
    <div className="workspace">
      <PreviewColumn>
        {editFormat === 'motion'
          ? <MotionScenes content={content} status={status} stageRef={root} effectClass={effectClass} />
          : <SceneCarousel slides={carouselSlides} content={content} mode={editFormat} />}
      </PreviewColumn>
      <StudioToolDrawer
        open={toolsOpen}
        activeSection={activeToolSection}
        onSelectSection={selectToolSection}
        onClose={handleToolClose}
      >
        {activeToolSection === 'edits' && <EditFormatSelector value={editFormat} onChange={selectEditFormat} />}
        {activeToolSection === 'packs' && <ScenePackSelector packs={packs} selectedId={selectedPack.id} onSelect={selectPack} />}
        {activeToolSection === 'effects' && <EffectControls value={effects} onChange={toggleEffect} effects={effectOptions} />}
        {activeToolSection === 'transitions' && <TransitionList motion={motionSettings} value={transitionStyle} onChange={selectTransitionStyle} styles={transitionOptions} />}
        {activeToolSection === 'project' && <ProjectInspector project={project} onExport={() => window.open('https://playwright.dev/docs/videos', '_blank', 'noopener,noreferrer')} />}
      </StudioToolDrawer>
    </div>
    <TimelinePanel
      tracks={tracks}
      packName={selectedPack.name}
      progress={progress}
      duration={duration}
      playing={playing}
      hasTimeline={hasTimeline && editFormat === 'motion'}
      transportEnabled={editFormat === 'motion'}
      motionSettings={motionSettings}
      onPlayPause={togglePlayback}
      onReset={reset}
      onSeek={seek}
      onTrackMove={reorderTrack}
      onTrackDuration={changeTrackDuration}
      onTrackToggle={toggleTrack}
      onMotionSetting={changeMotionSetting}
    />
    <StudioFooter version={engineVersion} />
  </main>;
}
