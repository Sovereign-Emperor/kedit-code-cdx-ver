import { useId, useState } from 'react';

// Small display-type component for reusable, animated editorial headlines.
export function EditorialTypography({ as: Tag = 'span', text, accentIndex = -1, className = '' }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return <Tag className={`editorial-type ${className}`} aria-label={text}>
    <span aria-hidden="true">{words.map((word, index) => <span
      className={`editorial-word ${index === accentIndex ? 'is-accent' : ''}`}
      key={`${word}-${index}`}
      style={{ '--word-index': index }}
    >{word}</span>)}</span>
  </Tag>;
}

// Supply any array of { id, eyebrow, title, caption, label, motif, accent }
// cards to reuse this renderer inside the studio's standard output frame.
export function SceneCarousel({ slides, content, mode = '3d-carousel' }) {
  if (!Array.isArray(slides) || !slides.length) throw new Error('SceneCarousel requires at least one slide.');
  if (!['carousel', '3d-carousel'].includes(mode)) throw new Error(`Unknown carousel edit format: ${mode}`);

  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const move = (step) => {
    setActiveIndex(index => (index + step + slides.length) % slides.length);
  };

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  return <section
    className={`stage carousel-stage ${mode === '3d-carousel' ? 'is-3d' : 'is-flat'}`}
    style={{
      '--accent': content.theme.accent,
      '--scene-background': content.theme.background,
      '--display-font': content.theme.displayFont,
      '--frame-width': content.project.width,
      '--frame-height': content.project.height,
      '--carousel-accent': activeSlide.accent || content.theme.accent
    }}
    aria-labelledby={titleId}
  >
    <div className="camera-layer">
      <div className="stage-grid" />
      <header className="topbar">
        <div><span className="brand-dot pulse-dot" />{content.brand}</div>
        <div className="status">{mode === 'carousel' ? 'CAROUSEL EDIT' : '3D SCENES'}<span className="status-dot" /></div>
      </header>
      <div className="carousel-edit" role="region" aria-labelledby={titleId}>
        <h2 className="sr-only" id={titleId}>{mode === 'carousel' ? 'Carousel edit' : '3D scene edit'}</h2>
        <div
          className="carousel-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label={mode === 'carousel' ? 'Carousel edit scenes' : '3D scene edit'}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {slides.map((slide, index) => {
            let offset = index - activeIndex;
            if (offset > Math.floor(slides.length / 2)) offset -= slides.length;
            if (offset < -Math.floor(slides.length / 2)) offset += slides.length;
            const distance = Math.abs(offset);
            const cardStyle = {
              '--card-x': `${offset * 38}%`,
              '--card-z': `${-distance * 54}px`,
              '--card-rotation': `${-offset * 17}deg`,
              '--card-scale': 1 - distance * 0.075,
              '--card-opacity': Math.max(0.08, 1 - distance * 0.24),
              '--card-accent': slide.accent || content.theme.accent
            };

            return <article
              className={`carousel-card carousel-card--${slide.motif}`}
              key={slide.id}
              style={cardStyle}
              aria-hidden={offset !== 0}
              aria-label={`${slide.label}: ${slide.title}`}
            >
              <div className="carousel-card-top"><span>{slide.eyebrow}</span><i>{String(index + 1).padStart(2, '0')}</i></div>
              <div className="carousel-card-art" aria-hidden="true"><span>{slide.label}</span></div>
              <div className="carousel-card-copy">
                <EditorialTypography as="h3" text={slide.title} accentIndex={slide.accentIndex} className="carousel-card-title" />
                <p>{slide.caption}</p>
              </div>
              <span className="carousel-card-bottom">{slide.id.toUpperCase()} <i>·</i> KEDIT MOTION</span>
            </article>;
          })}
        </div>
        <div className="carousel-transport">
          <button type="button" className="carousel-arrow" aria-label="Previous scene" onClick={() => move(-1)}>←</button>
          <div className="carousel-pagination" aria-label="Choose a scene">
            {slides.map((slide, index) => <button
              type="button"
              key={slide.id}
              aria-label={`Show scene ${index + 1}: ${slide.label}`}
              aria-current={index === activeIndex ? 'step' : undefined}
              onClick={() => setActiveIndex(index)}
            />)}
          </div>
          <span className="carousel-position">{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(slides.length).padStart(2, '0')}</span>
          <button type="button" className="carousel-arrow" aria-label="Next scene" onClick={() => move(1)}>→</button>
        </div>
      </div>
      <div className="frame-corner corner-tl" /><div className="frame-corner corner-tr" />
      <footer><span>{content.footer}</span><span>{content.project.width} × {content.project.height} <i>·</i> {content.project.aspectRatio}</span></footer>
    </div>
  </section>;
}
