import assert from 'node:assert/strict';
import test from 'node:test';
import { BASE_CONTENT, createScenePack, SCENE_PACKS, TIMELINE_CLIPS } from '../src/scenePacks.js';
import { EFFECTS, getTransitionStyle, TRANSITION_STYLES } from '../src/motionPresets.js';

test('all scene packs satisfy the five-scene content contract', () => {
  assert.equal(SCENE_PACKS.length, 10);
  assert.equal(new Set(SCENE_PACKS.map(pack => pack.id)).size, SCENE_PACKS.length);

  for (const pack of SCENE_PACKS) {
    assert.ok(pack.name, `${pack.id} needs a display name`);
    assert.ok(pack.description, `${pack.id} needs a description`);

    for (const sceneName of ['intro', 'code', 'impact', 'data', 'outro']) {
      assert.ok(pack.content.scenes[sceneName], `${pack.id} is missing ${sceneName}`);
    }

    const { metric, graph } = pack.content.scenes.data;
    assert.ok(Number.isFinite(metric.from), `${pack.id} metric start must be numeric`);
    assert.ok(Number.isFinite(metric.to), `${pack.id} metric end must be numeric`);
    assert.ok(graph.length > 0, `${pack.id} needs chart values`);
    assert.ok(graph.every(value => Number.isFinite(value) && value >= 0 && value <= 100), `${pack.id} graph values must be percentages`);
  }
});

test('scene-pack factory merges nested data without mutating its base', () => {
  const baseCode = [...BASE_CONTENT.scenes.code.code];
  const pack = createScenePack({
    id: 'test-pack',
    name: 'Test Pack',
    description: 'Factory regression case',
    theme: { background: '#101010' },
    effects: { glow: false },
    motion: { transition: 0.8 },
    scenes: {
      intro: { title: 'A CUSTOM TITLE' },
      code: { code: ['first line'] },
      data: { metric: { to: 42 } }
    }
  });

  assert.equal(pack.content.scenes.intro.title, 'A CUSTOM TITLE');
  assert.equal(pack.content.scenes.intro.subtitle, BASE_CONTENT.scenes.intro.subtitle);
  assert.deepEqual(pack.content.scenes.code.code, ['first line']);
  assert.deepEqual(BASE_CONTENT.scenes.code.code, baseCode);
  assert.equal(pack.content.scenes.data.metric.label, BASE_CONTENT.scenes.data.metric.label);
  assert.equal(pack.content.scenes.data.metric.to, 42);
  assert.equal(pack.content.theme.background, '#101010');
  assert.equal(pack.content.effects.glow, false);
  assert.equal(pack.content.effects.grain, BASE_CONTENT.effects.grain);
  assert.equal(pack.content.motion.transition, 0.8);
});

test('effects and transitions have the definitions required by the studio', () => {
  assert.equal(new Set(EFFECTS.map(effect => effect.key)).size, EFFECTS.length);
  for (const effect of EFFECTS) {
    assert.ok(effect.title);
    assert.ok(effect.description);
    assert.ok(Object.hasOwn(BASE_CONTENT.effects, effect.key), `${effect.key} needs a pack default`);
  }

  assert.equal(new Set(TRANSITION_STYLES.map(style => style.id)).size, TRANSITION_STYLES.length);
  for (const style of TRANSITION_STYLES) {
    assert.ok(style.label);
    assert.ok(style.enter && style.settle && style.exit, `${style.id} needs enter, settle, and exit states`);
    assert.equal(getTransitionStyle(style.id), style);
  }
  assert.throws(() => getTransitionStyle('missing'), /Unknown transition style/);
});

test('timeline clips cover each scene exactly once and fill the full edit', () => {
  const sceneNames = Object.keys(BASE_CONTENT.scenes);
  assert.deepEqual(TIMELINE_CLIPS.map(clip => clip.key), sceneNames);
  assert.equal(TIMELINE_CLIPS.reduce((total, clip) => total + clip.width, 0), 100);
  assert.ok(TIMELINE_CLIPS.every(clip => clip.width > 0));
});
