import React, { useEffect } from 'react';

// Shared studio framing components accept project data or children so they can
// wrap other compositions without coupling layout to the animation engine.
export function StudioHeader({ project, engineVersion = '01', toolsOpen, onToolsToggle }) {
  return <header className="studio-header">
    <div className="studio-brand"><span className="brand-mark">K</span><span>KEDIT<span className="brand-muted"> / MOTION</span></span></div>
    <div className="project-name"><span className="live-dot" />{project.name} <span className="project-separator">/</span> {project.format}</div>
    <div className="header-actions">
      <div className="header-version">MOTION ENGINE <span>{engineVersion}</span></div>
      <button className={`tools-trigger ${toolsOpen ? 'is-open' : ''}`} type="button" aria-expanded={toolsOpen} aria-controls="studio-tools-drawer" onClick={onToolsToggle}>
        <span aria-hidden="true">☷</span> TOOLS
      </button>
    </div>
  </header>;
}

// Sidebar keeps the composition summary and any caller-provided editor controls
// together; pass children to add, remove, or reorder tools for another workflow.
export function StudioSidebar({ project, children, contentPath = 'src/scenePacks.js' }) {
  return <aside className="side-panel">
    <div className="panel-heading"><span>COMPOSITION</span><span className="panel-menu">•••</span></div>
    <div className="composition-card">
      <div className="composition-thumb"><span>{project.aspectRatio}</span><i /></div>
      <div><strong>Portrait {project.width}</strong><small>{project.width} × {project.height} · {project.fps} FPS</small></div>
      <span className="active-indicator" />
    </div>
    {children}
    <div className="panel-note"><span>✦</span> EDIT CONTENT IN <b>{contentPath}</b></div>
  </aside>;
}

const TOOL_SECTIONS = [
  { id: 'edits', label: 'Edits', icon: '◈' },
  { id: 'packs', label: 'Scene packs', icon: '▦' },
  { id: 'effects', label: 'Effects', icon: '✳' },
  { id: 'transitions', label: 'Transitions', icon: '↗' },
  { id: 'project', label: 'Project', icon: '▤' }
];

// Drawer tabs keep editing tools organized without permanently reducing canvas space.
export function StudioToolDrawer({ open, activeSection, onSelectSection, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  return <>
    {open && <button className="drawer-backdrop" type="button" aria-label="Close tools drawer" onClick={onClose} />}
    <aside
      className={`studio-tool-drawer ${open ? 'is-open' : ''}`}
      id="studio-tools-drawer"
      aria-label="Studio tools"
      aria-hidden={!open}
    >
      <nav className="drawer-rail" aria-label="Tool sections">
        {TOOL_SECTIONS.map(section => <button
          className={`drawer-nav-button ${activeSection === section.id ? 'is-active' : ''}`}
          type="button"
          key={section.id}
          aria-current={activeSection === section.id ? 'page' : undefined}
          tabIndex={open ? 0 : -1}
          onClick={() => onSelectSection(section.id)}
        >
          <span aria-hidden="true">{section.icon}</span><small>{section.label}</small>
        </button>)}
      </nav>
      <div className="drawer-main">
        <div className="drawer-heading">
          <div><span>STUDIO TOOLKIT</span><h2>{TOOL_SECTIONS.find(section => section.id === activeSection)?.label || 'Edits'}</h2></div>
          <button type="button" className="drawer-close" aria-label="Close tools drawer" tabIndex={open ? 0 : -1} onClick={onClose}>×</button>
        </div>
        <div className="drawer-content">{children}</div>
      </div>
    </aside>
  </>;
}

// Preview chrome is independent from the preview itself; children can be a
// different renderer while retaining the same toolbar and live-preview cues.
export function PreviewColumn({ children }) {
  return <section className="preview-column" aria-label="Composition preview">
    <div className="preview-toolbar"><span><i className="toolbar-dot" />COMPOSITION VIEW</span><span>FIT <b>100%</b></span></div>
    {children}
    <div className="preview-caption"><span><i className="caption-dot" />LIVE PREVIEW</span><span>DRAG PLAYHEAD TO SCRUB</span></div>
  </section>;
}

// Project inspector receives its export action instead of owning a renderer,
// so the same project panel can be connected to a future export implementation.
export function ProjectInspector({ project, onExport }) {
  return <section className="inspector inspector-panel">
    <div className="panel-heading"><span>PROJECT</span><button className="inspector-action" aria-label="Project options">•••</button></div>
    <div className="inspector-block"><label>PROJECT NAME</label><div className="inspector-value">{project.name} <span>✎</span></div></div>
    <div className="inspector-block"><label>FRAME SIZE</label><div className="inspector-value">{project.width} × {project.height} <span className="value-badge">{project.aspectRatio}</span></div></div>
    <div className="inspector-block"><label>FRAME RATE</label><div className="inspector-value">{project.fps} fps <span className="inspector-chevron">⌄</span></div></div>
    <div className="panel-divider" />
    <div className="panel-heading"><span>RENDER</span><span className="ready-badge">READY</span></div>
    <div className="render-card"><div className="render-icon">↗</div><strong>Browser preview</strong><small>Capture the composition in Chromium.</small><div className="render-spec">H.264 <span>·</span> {project.width} × {project.height} <span>·</span> {project.fps} fps</div></div>
    <button className="render-button" onClick={onExport}>EXPORT WORKFLOW <span>↗</span></button>
    <p className="export-note">Automated video export requires a browser-capture workflow. This preview does not encode video by itself.</p>
  </section>;
}

// Footer labels are props so a host application can white-label the studio.
export function StudioFooter({ engineName = 'KEDIT MOTION ENGINE', version = '01.0', tagline = 'CONTENT-DRIVEN MOTION GRAPHICS' }) {
  return <footer className="studio-footer">
    <span>{engineName} <b>{version}</b></span>
    <span>{tagline}</span>
    <span className="footer-status"><i /> ALL CHANGES SAVED</span>
  </footer>;
}
