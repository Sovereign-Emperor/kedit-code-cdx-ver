// Keep effect and transition definitions separate from their UI so another
// studio layout can reuse the same options without duplicating animation data.
export const EFFECTS = [
  { key: 'glow', icon: '✳', title: 'Bloom / Glow', description: 'Highlight emission' },
  { key: 'grain', icon: '▦', title: 'Film Grain', description: 'Fine texture overlay' },
  { key: 'camera', icon: '◉', title: 'Camera Punch', description: 'Subtle push-in move' },
  { key: 'vignette', icon: '◉', title: 'Lens Vignette', description: 'Edge-focused contrast' },
  { key: 'chromatic', icon: '⌁', title: 'Chromatic Split', description: 'Subtle RGB edge fringing' },
  { key: 'lightLeak', icon: '☼', title: 'Light Leak', description: 'Warm animated film flare' },
  { key: 'scanlines', icon: '▤', title: 'Scanlines', description: 'Fine analog texture' }
];

// Each treatment describes its visual states. The timeline hook supplies pack
// timing, while these states define how scenes enter, settle, and leave.
export const TRANSITION_STYLES = [
  {
    id: 'cinematic',
    label: 'Cinematic blur',
    detail: 'Depth + soft focus',
    enter: { autoAlpha: 1, scale: 1.07, filter: 'blur(5px)' },
    settle: { scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' },
    exit: { autoAlpha: 0, scale: 1.08, filter: 'blur(8px)', ease: 'power2.in' }
  },
  {
    id: 'whip',
    label: 'Whip pan',
    detail: 'Fast directional movement',
    enter: { autoAlpha: 1, x: 75, rotation: 2, filter: 'blur(6px)' },
    settle: { x: 0, rotation: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' },
    exit: { autoAlpha: 0, x: -75, rotation: -2, filter: 'blur(5px)', ease: 'power3.in' }
  },
  {
    id: 'glitch',
    label: 'Signal glitch',
    detail: 'Digital split + snap',
    enter: { autoAlpha: 0, x: 8, skewX: 5, filter: 'contrast(2)' },
    settle: { autoAlpha: 1, x: 0, skewX: 0, filter: 'contrast(1)', duration: 0.32, ease: 'steps(4)' },
    exit: { autoAlpha: 0, x: -10, skewX: -6, filter: 'contrast(2)', ease: 'steps(3)', durationScale: 0.7 }
  },
  {
    id: 'wipe',
    label: 'Film wipe',
    detail: 'Directional matte reveal',
    enter: { autoAlpha: 1, clipPath: 'inset(100% 0 0 0)' },
    settle: { clipPath: 'inset(0 0 0 0)', duration: 0.48, ease: 'power3.inOut' },
    exit: { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)', ease: 'power3.inOut' }
  }
];

// Throw for unknown ids rather than silently selecting a different treatment;
// callers should keep the selector value aligned with TRANSITION_STYLES.
export function getTransitionStyle(id, styles = TRANSITION_STYLES) {
  const style = styles.find(item => item.id === id);
  if (!style) throw new Error(`Unknown transition style: ${id}`);
  return style;
}
