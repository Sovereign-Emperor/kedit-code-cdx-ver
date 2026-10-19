// Timeline tracks are editable per project and stay independent of scene-pack data.
export function createEditTracks(clips, duration = 13) {
  if (!Array.isArray(clips) || !clips.length) throw new Error('An edit needs at least one timeline clip.');
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('The edit duration must be a positive number.');
  if (clips.some(clip => !clip.key || !Number.isFinite(clip.width) || clip.width <= 0)) {
    throw new Error('Every timeline clip needs a key and a positive width.');
  }
  if (new Set(clips.map(clip => clip.key)).size !== clips.length) throw new Error('Timeline clip keys must be unique.');

  const widthTotal = clips.reduce((total, clip) => total + clip.width, 0);
  if (!Number.isFinite(widthTotal) || widthTotal <= 0) throw new Error('Timeline clip widths must add up to a positive value.');

  return clips.map((clip, index) => ({
    key: clip.key,
    label: clip.label || clip.key,
    duration: Number((duration * clip.width / widthTotal).toFixed(2)),
    enabled: true,
    index
  }));
}

export function getEditDuration(tracks) {
  return Number(tracks.reduce((total, track) => total + track.duration, 0).toFixed(2));
}

export function moveEditTrack(tracks, key, direction) {
  const index = tracks.findIndex(track => track.key === key);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= tracks.length) return tracks;

  const reordered = [...tracks];
  [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
  return reordered;
}
