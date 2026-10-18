import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { MotionScenes } from './components/MotionScenes.jsx';
import { EffectControls, ScenePackSelector, TimelinePanel, TransitionList } from './components/StudioControls.jsx';
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

// Scene packs are complete story presets that reuse the same five scene layouts
// and GSAP engine. Add a pack by overriding only the copy/data/theme you need.
function createScenePack({ id, name, description, accent, scenes }) {
  return {
    id,
    name,
    description,
    content: {
      ...CONTENT,
      project: { ...CONTENT.project, name: name.toUpperCase() },
      theme: { ...CONTENT.theme, accent },
      scenes: Object.fromEntries(Object.entries(CONTENT.scenes).map(([key, scene]) => [
        key,
        { ...scene, ...(scenes[key] || {}) }
      ]))
    }
  };
}

const SCENE_PACKS = [
  { id: 'wealth', name: 'Compound', description: 'Wealth & ownership', content: CONTENT },
  createScenePack({
    id: 'founder', name: 'Founder Mode', description: 'Build a business', accent: '#e28d55',
    scenes: {
      intro: { eyebrow: '// FOUNDER_MODE.exe', kicker: 'FROM IDEA TO\nINDUSTRY', title: 'BUILD THE THING', subtitle: 'A small idea. An unreasonable amount of belief.', label: 'THE FOUNDER MINDSET' },
      code: { label: 'THE PLAYBOOK', inputLabel: 'IDEA → IMPACT', headline: 'MAKE IT\nREAL.\nTHEN BETTER.', fileName: 'startup-playbook.js', code: ['const idea = solve(realProblem);', 'let users = 1;', 'product.listen(users);', 'product.improve();', 'impact *= consistency;'], stamp: 'SHIP IT', footnote: 'BUILD. LEARN. REPEAT.' },
      impact: { label: 'THE COMMITMENT', eyebrow: 'EVERY GREAT COMPANY STARTS SOMEWHERE', overline: 'STOP WAITING FOR PERMISSION.', word: 'BUILD', bottom: 'MAKE IT\nMATTER.', sideNote: 'START SMALL\nTHINK BIG' },
      data: { label: 'THE TRACTION LOOP', sideLabel: 'MOMENTUM / 01', headline: 'PROGRESS\nBEATS PERFECT.', metric: { label: 'CUSTOMERS', from: 1, to: 10000, prefix: '' }, metricTrend: 'GROWING', graph: [6, 12, 16, 28, 39, 60, 77, 100], captions: ['FIRST USER', 'PRODUCT FIT', 'REAL SCALE'], footnote: 'LISTEN CLOSELY. IMPROVE CONSTANTLY.' },
      outro: { label: 'YOUR FIRST MOVE', backdrop: 'MAKE', kicker: 'THE MARKET IS WAITING', title: 'START BEFORE YOU FEEL READY.', subtitle: 'Make the first version. Make it better tomorrow.', callToAction: 'BUILD SOMETHING' }
    }
  }),
  createScenePack({
    id: 'creator', name: 'Creator Economy', description: 'Audience & creativity', accent: '#c187f2',
    scenes: {
      intro: { eyebrow: '// CREATOR_ECONOMY.js', kicker: 'MAKE WHAT\nONLY YOU CAN', title: 'ATTENTION IS AN ASSET', subtitle: 'Turn your point of view into something people return to.', label: 'THE CREATOR EDGE' },
      code: { label: 'THE CONTENT LOOP', inputLabel: 'CREATE → CONNECT', headline: 'MAKE IT\nWORTH\nA PAUSE.', fileName: 'audience-loop.js', code: ['const idea = yourPerspective;', 'publish(idea);', 'listenTo(community);', 'makeSomethingBetter();', 'trust += consistency;'], stamp: 'CONNECT', footnote: 'GREAT CONTENT EARNS THE NEXT VIEW.' },
      impact: { label: 'THE DIFFERENCE', eyebrow: 'THE ALGORITHM IS NOT YOUR BRAND', overline: 'BE REMEMBERED FOR YOUR', word: 'VOICE', bottom: 'CREATE WITH\nINTENTION.', sideNote: 'MAKE IT\nMEAN SOMETHING' },
      data: { label: 'THE AUDIENCE FLYWHEEL', sideLabel: 'TRUST / 01', headline: 'TRUST\nCOMPOUNDS.', metric: { label: 'COMMUNITY', from: 100, to: 50000, prefix: '' }, metricTrend: 'CONNECTED', graph: [7, 15, 18, 31, 46, 63, 80, 100], captions: ['SHOW UP', 'EARN TRUST', 'GROW TOGETHER'], footnote: 'CONSISTENCY BUILDS WHAT VIRALITY CANNOT.' },
      outro: { label: 'YOUR NEXT POST', backdrop: 'CREATE', kicker: 'THE WORLD NEEDS YOUR PERSPECTIVE', title: 'MAKE SOMETHING THAT MATTERS.', subtitle: 'Create with purpose. Publish with courage.', callToAction: 'MAKE YOUR NEXT MOVE' }
    }
  }),
  createScenePack({
    id: 'focus', name: 'Deep Focus', description: 'Focus & productivity', accent: '#68c6bb',
    scenes: {
      intro: { eyebrow: '// DEEP_FOCUS.protocol', kicker: 'LESS NOISE.\nMORE SIGNAL.', title: 'FOCUS IS A SUPERPOWER', subtitle: 'The quality of your attention shapes the quality of your work.', label: 'RECLAIM YOUR ATTENTION' },
      code: { label: 'THE FOCUS PROTOCOL', inputLabel: 'INTERRUPTION → INTENTION', headline: 'PROTECT\nTHE WORK\nTHAT MATTERS.', fileName: 'focus-protocol.js', code: ['remove(distractions);', 'choose(onePriority);', 'start(focusedBlock);', 'repeat(withRest);', 'progress = attention * time;'], stamp: 'IN THE ZONE', footnote: 'ONE THING. FULL ATTENTION.' },
      impact: { label: 'THE RESET', eyebrow: 'YOU DO NOT NEED MORE HOURS', overline: 'YOU NEED MORE', word: 'FOCUS', bottom: 'ONE THING.\nDONE WELL.', sideNote: 'MAKE SPACE\nFOR DEEP WORK' },
      data: { label: 'THE FOCUS EFFECT', sideLabel: 'DEEP WORK / 01', headline: 'SMALL BLOCKS.\nBIG MOMENTUM.', metric: { label: 'FOCUSED MINUTES', from: 0, to: 240, prefix: '' }, metricTrend: 'IN THE ZONE', graph: [10, 18, 29, 37, 52, 70, 84, 100], captions: ['BEGIN', 'GET IN FLOW', 'MAKE PROGRESS'], footnote: 'PROTECT THE PROCESS. RESULTS FOLLOW.' },
      outro: { label: 'YOUR NEXT BLOCK', backdrop: 'FOCUS', kicker: 'CLOSE THE EXTRA TABS', title: 'GIVE YOUR BEST WORK YOUR BEST ATTENTION.', subtitle: 'Set one priority. Start one focused block.', callToAction: 'START FOCUSING' }
    }
  }),
  createScenePack({
    id: 'fitness', name: 'Fitness Mindset', description: 'Training & consistency', accent: '#e56f77',
    scenes: {
      intro: { eyebrow: '// TRAINING_CYCLE.active', kicker: 'SHOW UP\nFOR YOURSELF', title: 'CONSISTENCY GETS STRONGER', subtitle: 'The small reps you repeat become the strength you keep.', label: 'THE LONG GAME' },
      code: { label: 'THE TRAINING LOOP', inputLabel: 'EFFORT → ADAPTATION', headline: 'ONE MORE\nREP.\nONE MORE DAY.', fileName: 'training-cycle.js', code: ['const goal = getStronger;', 'train(withIntent);', 'recover(withPatience);', 'repeat(theBasics);', 'strength += consistency;'], stamp: 'KEEP GOING', footnote: 'TRAIN SMART. RECOVER. RETURN.' },
      impact: { label: 'THE MINDSET', eyebrow: 'MOTIVATION COMES AND GOES', overline: 'LET THE HABIT DO THE WORK.', word: 'SHOW UP', bottom: 'THE REP\nIS THE REWARD.', sideNote: 'STRONGER\nBY DESIGN' },
      data: { label: 'THE TRAINING EFFECT', sideLabel: 'WEEK BY WEEK / 01', headline: 'YOUR BODY\nKEEPS SCORE.', metric: { label: 'SESSIONS DONE', from: 0, to: 100, prefix: '' }, metricTrend: 'BUILT DAILY', graph: [9, 16, 24, 36, 48, 65, 82, 100], captions: ['FIRST REP', 'NEW RHYTHM', 'NEW BASELINE'], footnote: 'PROGRESS FAVORS THE CONSISTENT.' },
      outro: { label: 'NEXT SESSION', backdrop: 'MOVE', kicker: 'YOU HAVE ALREADY STARTED', title: 'KEEP THE PROMISE YOU MADE TO YOURSELF.', subtitle: 'One good session at a time.', callToAction: 'GET AFTER IT' }
    }
  }),
  createScenePack({
    id: 'future-tech', name: 'Future Systems', description: 'Technology & AI', accent: '#5da9f4',
    scenes: {
      intro: { eyebrow: '// FUTURE_SYSTEMS.init()', kicker: 'THE FUTURE\nIS A DESIGN CHOICE', title: 'BUILD FOR WHAT IS NEXT', subtitle: 'Technology matters most when it gives people new possibilities.', label: 'DESIGN THE FUTURE' },
      code: { label: 'THE SYSTEM SHIFT', inputLabel: 'SIGNAL → POSSIBILITY', headline: 'TURN NEW\nTOOLS INTO\nNEW WORLDS.', fileName: 'future-systems.ts', code: ['const signal = emergingTech;', 'ask(betterQuestions);', 'prototype(realNeeds);', 'measure(humanImpact);', 'possibility = tools + intent;'], stamp: 'ITERATE', footnote: 'THE TOOL IS ONLY THE BEGINNING.' },
      impact: { label: 'THE HUMAN ADVANTAGE', eyebrow: 'AUTOMATION CHANGES THE TASK', overline: 'IMAGINATION CHANGES', word: 'EVERYTHING', bottom: 'BUILD FOR\nPEOPLE.', sideNote: 'TECH WITH\nPURPOSE' },
      data: { label: 'THE POSSIBILITY CURVE', sideLabel: 'NEXT / NOW', headline: 'BETTER TOOLS.\nBOLDER IDEAS.', metric: { label: 'IDEAS TESTED', from: 1, to: 1000, prefix: '' }, metricTrend: 'IN MOTION', graph: [8, 14, 23, 35, 51, 69, 86, 100], captions: ['QUESTION', 'PROTOTYPE', 'TRANSFORM'], footnote: 'MAKE THE FUTURE USEFUL TO SOMEONE.' },
      outro: { label: 'NEXT ITERATION', backdrop: 'NEXT', kicker: 'THE FUTURE IS NOT A SPECTATOR SPORT', title: 'MAKE THE NEXT THING MORE HUMAN.', subtitle: 'Stay curious. Experiment boldly. Build responsibly.', callToAction: 'START EXPLORING' }
    }
  }),
  createScenePack({
    id: 'mindset', name: 'Mindset Shift', description: 'Personal growth', accent: '#d9a9ff',
    scenes: {
      intro: { eyebrow: '// MINDSET.shift()', kicker: 'CHANGE THE\nQUESTION', title: 'YOUR NEXT CHAPTER STARTS HERE', subtitle: 'A new perspective can change what you believe is possible.', label: 'THE INNER SHIFT' },
      code: { label: 'THE REFRAME', inputLabel: 'OLD STORY → NEW CHOICE', headline: 'NOTICE\nTHE STORY.\nCHOOSE AGAIN.', fileName: 'perspective.js', code: ['const thought = notice(pattern);', 'question(the assumption);', 'choose(a useful belief);', 'practice(the next step);', 'growth = courage + repetition;'], stamp: 'REFRAME', footnote: 'A THOUGHT IS NOT A DESTINATION.' },
      impact: { label: 'THE PIVOT', eyebrow: 'YOU CAN HONOR THE PAST', overline: 'WITHOUT LIVING INSIDE IT.', word: 'BEGIN', bottom: 'ONE CHOICE\nAT A TIME.', sideNote: 'GIVE YOURSELF\nROOM TO GROW' },
      data: { label: 'THE PRACTICE OF CHANGE', sideLabel: 'DAY BY DAY / 01', headline: 'SMALL SHIFTS.\nNEW DIRECTION.', metric: { label: 'NEW REPS', from: 0, to: 365, prefix: '' }, metricTrend: 'PRACTICED', graph: [9, 18, 22, 37, 50, 66, 81, 100], captions: ['NOTICE', 'PRACTICE', 'BECOME'], footnote: 'GROWTH IS BUILT IN THE RETURNING.' },
      outro: { label: 'YOUR NEXT CHOICE', backdrop: 'BEGIN', kicker: 'YOU ARE ALLOWED TO CHANGE', title: 'YOUR STORY IS STILL BEING WRITTEN.', subtitle: 'Take the next kind, brave step.', callToAction: 'TURN THE PAGE' }
    }
  })
];

const CLIPS = [
  { key: 'intro', width: 19 },
  { key: 'code', width: 23 },
  { key: 'impact', width: 19 },
  { key: 'data', width: 22 },
  { key: 'outro', width: 17 }
];

function resetMetric(root, content) {
  const value = root?.querySelector('.metric-value');
  const metric = content.scenes.data.metric;
  if (value) value.textContent = `${metric.prefix}${metric.from.toLocaleString()}`;
}

function useTimeline(content) {
  const root = useRef(null);
  const timeline = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(content.project.duration);
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
      resetMetric(root.current, content);
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
    resetMetric(root.current, content);
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

    const counter = { value: content.scenes.data.metric.from };
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
      .to(q('.intro-words .kinetic-letter'), { yPercent: 0, rotation: 0, opacity: 1, duration: content.motion.typeDuration, stagger: { each: content.motion.typeStagger, from: 'start' }, ease: 'back.out(1.4)' })
      .to(q('.intro-kicker, .intro-subtitle'), { opacity: 1, y: 0, duration: 0.42, stagger: 0.12 }, '-=0.35')
      .to(q('.intro-rule'), { scaleX: 1, duration: 0.55, ease: 'power3.out' }, '-=0.3')
      .to(q('.scene-intro'), { autoAlpha: 0, scale: 1.08, filter: 'blur(8px)', duration: content.motion.transition, ease: 'power2.in' }, '+=0.35')
      .addLabel('code')
      .set(q('.scene-code'), { autoAlpha: 1 })
      .call(() => setStatus('CODE'))
      .to(q('.editor'), { clipPath: 'inset(0 0 0 0)', duration: content.motion.transition, ease: 'power3.inOut' })
      .to(q('.code-line'), { opacity: 1, x: 0, duration: 0.32, stagger: 0.12 }, '-=0.15')
      .to(q('.scan'), { xPercent: 140, duration: 0.8, ease: 'power2.inOut' }, '-=0.12')
      .to(q('.scene-code'), { autoAlpha: 0, x: -45, filter: 'blur(6px)', duration: content.motion.transition, ease: 'power2.in' }, '+=0.38')
      .addLabel('impact')
      .set(q('.scene-impact'), { autoAlpha: 1, x: 55, filter: 'blur(5px)' })
      .call(() => setStatus('IMPACT'))
      .to(q('.scene-impact'), { x: 0, filter: 'blur(0px)', duration: 0.38, ease: 'power3.out' })
      .to(q('.flash'), { opacity: content.motion.flashOpacity, duration: 0.055, yoyo: true, repeat: 1, ease: 'none' }, '<')
      .to(q('.impact-words .kinetic-letter'), { yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: content.motion.typeDuration, stagger: { each: content.motion.typeStagger, from: 'start' }, ease: 'back.out(1.7)' }, '-=0.16')
      .to(q('.orbit'), { scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.48')
      .to(q('.scene-impact'), { autoAlpha: 0, scale: 0.92, rotation: 2, filter: 'blur(7px)', duration: content.motion.transition, ease: 'power2.in' }, '+=0.42')
      .addLabel('data')
      .set(q('.scene-data'), { autoAlpha: 1, scale: 1.07, filter: 'blur(5px)' })
      .call(() => setStatus('DATA'))
      .to(q('.scene-data'), { scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' })
      .to(q('.data-kicker, .data-caption'), { opacity: 1, y: 0, duration: 0.38, stagger: 0.12 }, '-=0.24')
      .to(q('.metric-value'), { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.48, ease: 'back.out(1.5)' }, '-=0.2')
      .to(counter, {
        value: content.scenes.data.metric.to,
        duration: content.motion.metricDuration,
        ease: 'power2.out',
        onUpdate: () => {
          const value = root.current?.querySelector('.metric-value');
          const metric = content.scenes.data.metric;
          if (value) value.textContent = `${metric.prefix}${Math.round(counter.value).toLocaleString()}`;
        }
      }, '-=0.05')
      .to(q('.graph-bar'), { scaleY: 1, duration: content.motion.chartDuration, stagger: content.motion.typeStagger * 2, ease: 'back.out(1.5)' }, '-=0.85')
      .to(q('.scene-data'), { autoAlpha: 0, y: -35, filter: 'blur(6px)', duration: content.motion.transition, ease: 'power2.in' }, '+=0.32')
      .addLabel('outro')
      .set(q('.scene-outro'), { autoAlpha: 1, y: 35 })
      .call(() => setStatus('OUTRO'))
      .to(q('.scene-outro'), { y: 0, duration: 0.38, ease: 'power3.out' })
      .to(q('.outro-words .kinetic-letter'), { yPercent: 0, opacity: 1, duration: content.motion.typeDuration, stagger: { each: content.motion.typeStagger, from: 'start' }, ease: 'power3.out' }, '-=0.18')
      .to(q('.outro-subtitle'), { opacity: 1, x: 0, duration: 0.4 }, '-=0.25')
      .to(q('.outro-rule'), { scaleX: 1, duration: 0.45 }, '-=0.28');

    if (root.current.classList.contains('fx-camera')) {
      tl.to(camera, { scale: content.motion.cameraScale, duration: content.motion.cameraDuration, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '-=0.35');
    }

    tl.to(q('.pulse-dot'), { scale: 1.5, opacity: 0.3, duration: 0.25, yoyo: true, repeat: 3 }, '<');
    tl.to({}, { duration: Math.max(0, content.project.duration - tl.duration()) });
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

function App() {
  const [selectedPackId, setSelectedPackId] = useState(SCENE_PACKS[0].id);
  const selectedPack = SCENE_PACKS.find(pack => pack.id === selectedPackId) || SCENE_PACKS[0];
  const content = selectedPack.content;
  const { root, run, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline } = useTimeline(content);
  const [effects, setEffects] = useState(content.effects);
  const effectClass = Object.entries(effects).filter(([, enabled]) => enabled).map(([name]) => `fx-${name}`).join(' ');
  const project = content.project;
  const timelineClips = CLIPS.map(clip => ({ ...clip, ...content.scenes[clip.key] }));

  const toggleEffect = (effect) => {
    setEffects(current => ({ ...current, [effect]: !current[effect] }));
  };

  const selectPack = (pack) => {
    reset();
    setSelectedPackId(pack.id);
    setEffects(pack.content.effects);
  };

  return <main className="studio" style={{ '--accent': content.theme.accent }}>
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
        <ScenePackSelector packs={SCENE_PACKS} selectedId={selectedPack.id} onSelect={selectPack} />
        <EffectControls value={effects} onChange={toggleEffect} />
        <TransitionList motion={content.motion} />
        <div className="panel-note"><span>✦</span> EDIT CONTENT IN <b>src/main.jsx</b></div>
      </aside>

      <section className="preview-column" aria-label="Composition preview">
        <div className="preview-toolbar"><span><i className="toolbar-dot" />COMPOSITION VIEW</span><span>FIT <b>100%</b></span></div>
        <MotionScenes content={content} status={status} stageRef={root} effectClass={effectClass} />
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

    <TimelinePanel
      clips={timelineClips}
      packName={selectedPack.name}
      progress={progress}
      duration={duration}
      playing={playing}
      hasTimeline={hasTimeline}
      onPlayPause={togglePlayback}
      onReset={reset}
      onSeek={seek}
    />
    <footer className="studio-footer"><span>KEDIT MOTION ENGINE <b>01.0</b></span><span>CONTENT-DRIVEN MOTION GRAPHICS</span><span className="footer-status"><i /> ALL CHANGES SAVED</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
