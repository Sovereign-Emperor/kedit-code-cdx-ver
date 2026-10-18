// Adapt the same editable pack content into carousel cards so the showcase
// always previews the selected story instead of maintaining duplicate copy.
export function createCarouselSlides(content) {
  const { scenes, theme } = content;
  const accent = theme.accent;

  return [
    {
      id: 'intro',
      eyebrow: scenes.intro.eyebrow,
      title: scenes.intro.title,
      accentIndex: scenes.intro.title.trim().split(/\s+/).length - 1,
      caption: scenes.intro.subtitle,
      label: 'OPENING FRAME',
      motif: 'orbit',
      accent
    },
    {
      id: 'code',
      eyebrow: scenes.code.fileName,
      title: scenes.code.stamp,
      accentIndex: scenes.code.stamp.trim().split(/\s+/).length - 1,
      caption: scenes.code.headline.replaceAll('\n', ' '),
      label: 'KINETIC EDIT',
      motif: 'code',
      accent
    },
    {
      id: 'impact',
      eyebrow: scenes.impact.overline,
      title: scenes.impact.word,
      accentIndex: scenes.impact.word.trim().split(/\s+/).length - 1,
      caption: scenes.impact.bottom.replaceAll('\n', ' '),
      label: 'TYPE MOMENT',
      motif: 'type',
      accent
    },
    {
      id: 'data',
      eyebrow: scenes.data.metric.label,
      title: `${scenes.data.metric.prefix}${scenes.data.metric.to.toLocaleString()}`,
      accentIndex: 0,
      caption: scenes.data.headline.replaceAll('\n', ' '),
      label: 'DATA STORY',
      motif: 'metric',
      accent
    },
    {
      id: 'outro',
      eyebrow: scenes.outro.kicker,
      title: scenes.outro.title,
      accentIndex: scenes.outro.title.trim().split(/\s+/).length - 1,
      caption: scenes.outro.subtitle,
      label: scenes.outro.callToAction,
      motif: 'outro',
      accent
    }
  ];
}
