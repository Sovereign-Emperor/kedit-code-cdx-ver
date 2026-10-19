import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getEditDuration } from '../editTimeline.js';
import { getTransitionStyle, TRANSITION_STYLES } from '../motionPresets.js';

function resetMetric(root, content) {
  const value = root?.querySelector('.metric-value');
  const metric = content.scenes.data.metric;
  if (value) value.textContent = `${metric.prefix}${metric.from.toLocaleString()}`;
}

// One timeline hook owns GSAP playback and turns editable scene tracks into a
// sequential composition. Every track duration scales its matching choreography.
export function useMotionTimeline(
  content,
  transitionStyle,
  transitionOptions = TRANSITION_STYLES,
  tracks,
  motionSettings = content.motion
) {
  const root = useRef(null);
  const timeline = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('READY');
  const duration = getEditDuration(tracks);
  const transition = getTransitionStyle(transitionStyle, transitionOptions);
  const enterState = () => ({ ...transition.enter });
  const settleState = () => ({ ...transition.settle });
  const exitState = () => {
    const { durationScale = 1, ...state } = transition.exit;
    return { ...state, duration: state.duration ?? motionSettings.transition * durationScale };
  };

  const reset = (trackList = tracks) => {
    timeline.current?.kill();
    timeline.current = null;
    if (root.current) {
      gsap.set(root.current.querySelectorAll('[data-anim], .intro-words .kinetic-letter, .intro-kicker, .intro-subtitle, .editor, .code-line, .impact-words .kinetic-letter, .metric-value, .data-kicker, .data-caption, .outro-words .kinetic-letter, .outro-subtitle, .motion-rule, .orbit'), { clearProps: 'all' });
      // Graph bar heights are content data; clear only the animated transform.
      gsap.set(root.current.querySelectorAll('.graph-bar'), { clearProps: 'transform' });
      gsap.set(root.current.querySelectorAll('.motion-scene'), { autoAlpha: 0, x: 0, y: 0, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' });
      const firstTrack = trackList.find(track => track.enabled);
      if (firstTrack) gsap.set(root.current.querySelector(`.scene-${firstTrack.key}`), { autoAlpha: 1 });
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

    const activeTracks = tracks.filter(track => track.enabled);
    if (!activeTracks.length) throw new Error('The edit needs at least one enabled scene track.');
    setPlaying(true);
    setProgress(0);
    setStatus('BOOTING');
    resetMetric(root.current, content);
    const q = selector => root.current.querySelectorAll(selector);
    const camera = root.current.querySelector('.camera-layer');

    gsap.set(q('[data-anim]'), { clearProps: 'all' });
    gsap.set(q('.motion-scene'), { autoAlpha: 0, x: 0, y: 0, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)', clipPath: 'inset(0 0 0 0)' });
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

    const makeScene = (key, isLast) => {
      const scene = q(`.scene-${key}`);
      const segment = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const animateType = (selector, options = {}) => segment.to(q(selector), {
        yPercent: 0,
        rotation: 0,
        opacity: 1,
        duration: motionSettings.typeDuration,
        stagger: { each: motionSettings.typeStagger, from: 'start' },
        ...options
      });

      if (key === 'intro') {
        segment.set(scene, { autoAlpha: 1 })
          .call(() => setStatus('INTRO'));
        animateType('.intro-words .kinetic-letter', { ease: 'back.out(1.4)' });
        segment.to(q('.intro-kicker, .intro-subtitle'), { opacity: 1, y: 0, duration: 0.42, stagger: 0.12 }, '-=0.35')
          .to(q('.intro-rule'), { scaleX: 1, duration: 0.55 }, '-=0.3');
      } else if (key === 'code') {
        segment.set(scene, enterState())
          .call(() => setStatus('CODE'))
          .to(scene, settleState())
          .to(q('.editor'), { clipPath: 'inset(0 0 0 0)', duration: motionSettings.transition, ease: 'power3.inOut' })
          .to(q('.code-line'), { opacity: 1, x: 0, duration: 0.32, stagger: 0.12 }, '-=0.15')
          .to(q('.scan'), { xPercent: 140, duration: 0.8, ease: 'power2.inOut' }, '-=0.12');
      } else if (key === 'impact') {
        segment.set(scene, enterState())
          .call(() => setStatus('IMPACT'))
          .to(scene, settleState())
          .to(q('.flash'), { opacity: motionSettings.flashOpacity, duration: 0.055, yoyo: true, repeat: 1, ease: 'none' }, '<');
        animateType('.impact-words .kinetic-letter', { scale: 1, ease: 'back.out(1.7)' });
        segment.to(q('.orbit'), { scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.48');
      } else if (key === 'data') {
        segment.set(scene, enterState())
          .call(() => setStatus('DATA'))
          .to(scene, settleState())
          .to(q('.data-kicker, .data-caption'), { opacity: 1, y: 0, duration: 0.38, stagger: 0.12 }, '-=0.24')
          .to(q('.metric-value'), { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.48, ease: 'back.out(1.5)' }, '-=0.2')
          .to(counter, {
            value: content.scenes.data.metric.to,
            duration: motionSettings.metricDuration,
            ease: 'power2.out',
            onUpdate: () => {
              const value = root.current?.querySelector('.metric-value');
              const metric = content.scenes.data.metric;
              if (value) value.textContent = `${metric.prefix}${Math.round(counter.value).toLocaleString()}`;
            }
          }, '-=0.05')
          .to(q('.graph-bar'), { scaleY: 1, duration: motionSettings.chartDuration, stagger: motionSettings.typeStagger * 2, ease: 'back.out(1.5)' }, '-=0.85');
      } else if (key === 'outro') {
        segment.set(scene, enterState())
          .call(() => setStatus('OUTRO'))
          .to(scene, settleState());
        animateType('.outro-words .kinetic-letter');
        segment.to(q('.outro-subtitle'), { opacity: 1, x: 0, duration: 0.4 }, '-=0.25')
          .to(q('.outro-rule'), { scaleX: 1, duration: 0.45 }, '-=0.28');
      } else {
        throw new Error(`Unknown scene track: ${key}`);
      }

      if (!isLast) segment.to(scene, exitState(), '+=0.3');
      return segment;
    };

    const lastActiveIndex = tracks.reduce((lastIndex, track, index) => track.enabled ? index : lastIndex, -1);
    tracks.forEach((track, index) => {
      if (!track.enabled) {
        tl.addLabel(track.key);
        tl.to({}, { duration: track.duration });
        return;
      }

      const segment = makeScene(track.key, index === lastActiveIndex);
      if (index === lastActiveIndex) {
        if (root.current.classList.contains('fx-camera')) {
          segment.to(camera, { scale: motionSettings.cameraScale, duration: motionSettings.cameraDuration, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '<');
        }
        segment.to(q('.pulse-dot'), { scale: 1.5, opacity: 0.3, duration: 0.25, yoyo: true, repeat: 3 }, '<');
      }
      const nativeDuration = segment.duration();
      if (nativeDuration > 0) segment.timeScale(nativeDuration / track.duration);
      tl.addLabel(track.key);
      tl.add(segment);
    });
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

  const seek = value => {
    if (!timeline.current) run();
    if (!timeline.current) return;
    timeline.current.pause();
    timeline.current.progress(value);
    setPlaying(false);
    setStatus(value === 1 ? 'COMPLETE' : 'PAUSED');
  };

  useLayoutEffect(() => () => timeline.current?.kill(), []);
  return { root, run, reset, togglePlayback, seek, playing, progress, duration, status, hasTimeline: true };
}
