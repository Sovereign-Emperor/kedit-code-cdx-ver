// Edit packs are plain data: add or remix content here without touching React or GSAP.
// BASE_CONTENT documents every field; createScenePack keeps partial pack overrides reusable.

// ============================================================
// EDIT PACK: customize this object to create a new video.
// BASE_CONTENT changes the story; THEME changes its colors/type;
// MOTION changes pacing and transitions. Keep the engine below.
// Use short headlines so they fit the portrait-safe area.
// ============================================================
export const BASE_CONTENT = {
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
  effects: { glow: true, grain: true, camera: true, vignette: true, chromatic: false, lightLeak: false, scanlines: false },
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

function mergeScene(scene, overrides = {}) {
  const merged = { ...scene, ...overrides };
  for (const [field, value] of Object.entries(merged)) {
    if (Array.isArray(value)) merged[field] = [...value];
  }
  if (scene.metric) merged.metric = { ...scene.metric, ...(overrides.metric || {}) };
  return merged;
}

// Scene packs reuse the base structure. Nested project, theme, effect, motion,
// and metric values are merged separately so a pack only needs to specify changes.
export function createScenePack({
  id,
  name,
  description,
  accent,
  project = {},
  theme = {},
  effects = {},
  motion = {},
  scenes = {},
  brand = BASE_CONTENT.brand,
  footer = BASE_CONTENT.footer
}) {
  return {
    id,
    name,
    description,
    content: {
      ...BASE_CONTENT,
      project: { ...BASE_CONTENT.project, ...project, name: project.name || name.toUpperCase() },
      theme: { ...BASE_CONTENT.theme, ...theme, accent: accent || theme.accent || BASE_CONTENT.theme.accent },
      effects: { ...BASE_CONTENT.effects, ...effects },
      motion: { ...BASE_CONTENT.motion, ...motion },
      brand,
      footer,
      scenes: Object.fromEntries(Object.entries(BASE_CONTENT.scenes).map(([key, scene]) => [
        key,
        mergeScene(scene, scenes[key])
      ]))
    }
  };
}

export const SCENE_PACKS = [
  { id: 'wealth', name: 'Compound', description: 'Wealth & ownership', content: BASE_CONTENT },
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
  }),
  createScenePack({
    id: 'product-launch', name: 'Product Launch', description: 'Design & launch', accent: '#71d7c0',
    scenes: {
      intro: { eyebrow: '// PRODUCT_LAUNCH.v1', kicker: 'A BETTER WAY\nSTARTS HERE', title: 'MADE FOR THE MOMENT', subtitle: 'Thoughtful design turns everyday friction into a better flow.', label: 'MEET THE PRODUCT' },
      code: { label: 'THE EXPERIENCE', inputLabel: 'FRICTION → FLOW', headline: 'LESS FRICTION.\nMORE\nPOSSIBILITY.', fileName: 'product-experience.ts', code: ['const need = listenToPeople();', 'design(removeFriction);', 'prototype(theFlow);', 'test(withRealUsers);', 'experience = clarity + care;'], stamp: 'DESIGNED', footnote: 'USEFUL BY DESIGN. SIMPLE BY DEFAULT.' },
      impact: { label: 'THE PRODUCT PROMISE', eyebrow: 'THE BEST FEATURE IS HOW IT FEELS', overline: 'MAKE THE COMPLEX FEEL', word: 'SIMPLE', bottom: 'BUILT AROUND\nREAL LIFE.', sideNote: 'DESIGN FOR\nTHE HUMAN' },
      data: { label: 'THE ADOPTION LOOP', sideLabel: 'VALUE / 01', headline: 'A BETTER\nDAILY FLOW.', metric: { label: 'MOMENTS SAVED', from: 0, to: 2400, prefix: '' }, metricTrend: 'EVERY WEEK', graph: [10, 19, 27, 39, 53, 69, 83, 100], captions: ['DISCOVER', 'MAKE IT EASY', 'COME BACK'], footnote: 'VALUE IS WHAT PEOPLE NOTICE AFTER THE FIRST USE.' },
      outro: { label: 'THE NEXT RELEASE', backdrop: 'FLOW', kicker: 'GOOD IDEAS DESERVE GREAT EXECUTION', title: 'DESIGN FOR PEOPLE.', subtitle: 'Listen closely. Ship thoughtfully. Keep improving.', callToAction: 'EXPLORE THE IDEA' }
    }
  }),
  createScenePack({
    id: 'creative-craft', name: 'Creative Craft', description: 'Ideas into impact', accent: '#f2a66f',
    scenes: {
      intro: { eyebrow: '// CREATIVE_PRACTICE()', kicker: 'FOLLOW THE\nCURIOSITY', title: 'MAKE ROOM FOR IDEAS', subtitle: 'Original work grows where attention meets a little experimentation.', label: 'THE CREATIVE PROCESS' },
      code: { label: 'THE PRACTICE', inputLabel: 'NOTICE → MAKE → REFINE', headline: 'START\nBEFORE\nIT IS PERFECT.', fileName: 'creative-practice.txt', code: ['collect(theSmallDetails);', 'follow(theQuestion);', 'make(aRoughVersion);', 'edit(withIntention);', 'finish = courage + craft;'], stamp: 'MAKE MORE', footnote: 'THE FIRST DRAFT IS A DOOR, NOT A VERDICT.' },
      impact: { label: 'THE CREATIVE SHIFT', eyebrow: 'CURIOSITY IS A CREATIVE COMPASS', overline: 'MAKE THE THING ONLY', word: 'YOU CAN', bottom: 'THEN MAKE\nIT BETTER.', sideNote: 'STAY OPEN\nSTAY CURIOUS' },
      data: { label: 'THE ITERATION ARC', sideLabel: 'DRAFT TO DONE', headline: 'IDEAS GET\nCLEARER IN MOTION.', metric: { label: 'ITERATIONS', from: 1, to: 32, prefix: '' }, metricTrend: 'REFINED', graph: [12, 20, 30, 39, 55, 68, 84, 100], captions: ['GATHER', 'MAKE', 'REFINE'], footnote: 'A LITTLE PROGRESS MAKES THE NEXT IDEA POSSIBLE.' },
      outro: { label: 'YOUR NEXT IDEA', backdrop: 'MAKE', kicker: 'YOUR POINT OF VIEW IS THE INGREDIENT', title: 'MAKE IT REAL.', subtitle: 'Stay playful. Trust the process. Finish the work.', callToAction: 'MAKE A FIRST DRAFT' }
    }
  }),
  createScenePack({
    id: 'resilience', name: 'Resilient by Design', description: 'Adapt & keep going', accent: '#8bb8f4',
    scenes: {
      intro: { eyebrow: '// RESILIENCE.build()', kicker: 'WHEN THE PLAN\nCHANGES', title: 'ADAPT WITHOUT LOSING THE WHY', subtitle: 'A setback can change the route without changing what matters.', label: 'THE RESILIENT MINDSET' },
      code: { label: 'THE ADAPTIVE LOOP', inputLabel: 'PAUSE → LEARN → ADAPT', headline: 'RESET.\nREFOCUS.\nRETURN.', fileName: 'adaptive-loop.js', code: ['notice(the obstacle);', 'separate(fact, fear);', 'choose(the next step);', 'adjust(the approach);', 'keep(what still matters);'], stamp: 'KEEP GOING', footnote: 'FLEXIBILITY IS A FORM OF STRENGTH.' },
      impact: { label: 'THE TURNING POINT', eyebrow: 'YOU CAN CHANGE YOUR APPROACH', overline: 'WITHOUT GIVING UP THE', word: 'VISION', bottom: 'BEND THE\nROUTE.', sideNote: 'LEARN THEN\nMOVE FORWARD' },
      data: { label: 'THE RECOVERY CURVE', sideLabel: 'STEP BY STEP', headline: 'THE RETURN\nIS THE PROGRESS.', metric: { label: 'SMALL RESETS', from: 0, to: 100, prefix: '' }, metricTrend: 'BUILDING TRUST', graph: [7, 15, 12, 29, 43, 59, 78, 100], captions: ['PAUSE', 'ADAPT', 'REBUILD'], footnote: 'PROGRESS IS NOT ALWAYS A STRAIGHT LINE.' },
      outro: { label: 'THE NEXT STEP', backdrop: 'RISE', kicker: 'START AGAIN WITH WHAT YOU KNOW NOW', title: 'RETURN WITH PURPOSE.', subtitle: 'Take a breath. Find the next workable step.', callToAction: 'MOVE FORWARD' }
    }
  })
];



// Timeline clip widths are visual proportions; keep the scene keys aligned with BASE_CONTENT.scenes.
export const TIMELINE_CLIPS = [
  { key: 'intro', width: 19 },
  { key: 'code', width: 23 },
  { key: 'impact', width: 19 },
  { key: 'data', width: 22 },
  { key: 'outro', width: 17 }
];
