/* landing-ui.jsx — shared primitives for the Agent Zoe landing page.
   Reuses the editorial system established in the hero exploration:
   Newsreader headlines, warm neutrals, deep-sage accent, monoline glyphs.
   Exports to window: useSize, Glyph, Wordmark, Eyebrow, SectionHead,
   PrimaryCta, Stage. */

const { useState, useRef, useEffect, useLayoutEffect, useMemo } = React;

/* measure a container so canvas backgrounds get real px and stay responsive */
function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize(prev => {
        const w = Math.round(r.width), h = Math.round(r.height);
        return (prev.w === w && prev.h === h) ? prev : { w, h };
      });
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure);
    }
    return () => { if (ro) ro.disconnect(); else window.removeEventListener('resize', measure); };
  }, []);
  return size;
}

/* minimal monoline glyphs — channels, firm systems, capabilities */
function Glyph({ kind, size = 18 }) {
  const s = { width: size, height: size, display: 'block' };
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.15, strokeLinejoin: 'round', strokeLinecap: 'round' };
  switch (kind) {
    case 'sms': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M2.5 3.5h11v7H6.5l-3 2.4V10.5h-1z" /></svg>);
    case 'email': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="2.3" y="4" width="11.4" height="8" rx="1" /><path d="M2.8 4.7 8 8.4l5.2-3.7" /></svg>);
    case 'voice': return (<svg viewBox="0 0 16 16" style={s} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"><line x1="4" y1="6" x2="4" y2="10" /><line x1="8" y1="3.5" x2="8" y2="12.5" /><line x1="12" y1="6.5" x2="12" y2="9.5" /></svg>);
    case 'crm': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="6" r="2.1" /><path d="M3.8 12.6a4.2 4.2 0 0 1 8.4 0" /></svg>);
    case 'filing': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M4.6 2.7h4.1l2.7 2.7v7.9H4.6z" /><path d="M8.5 2.8v2.8h2.6" /><path d="M6.2 9h3.6M6.2 11h3.6" /></svg>);
    case 'sheet': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="3" y="3" width="10" height="10" rx="1" /><path d="M3 7h10M3 10h10M7.6 3v10" /></svg>);
    case 'route': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="3.5" cy="8" r="1.4" /><circle cx="12.5" cy="4" r="1.4" /><circle cx="12.5" cy="12" r="1.4" /><path d="M4.9 8h3l2.4-3.6M7.9 8l2.4 3.6" /></svg>);
    case 'pen': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M11.2 2.8 13.2 4.8 5.4 12.6 2.8 13.2 3.4 10.6z" /><path d="M9.8 4.2 11.8 6.2" /></svg>);
    case 'bell': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M4 11.5c.9-.7 1.3-1.7 1.3-3v-1a2.7 2.7 0 0 1 5.4 0v1c0 1.3.4 2.3 1.3 3z" /><path d="M6.9 13.4a1.3 1.3 0 0 0 2.2 0" /></svg>);
    case 'clock': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="8" r="5.4" /><path d="M8 5v3.2l2.1 1.3" /></svg>);
    case 'lock': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="3.6" y="7" width="8.8" height="6.2" rx="1" /><path d="M5.4 7V5.4a2.6 2.6 0 0 1 5.2 0V7" /></svg>);
    case 'shield': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M8 2.4 12.6 4v3.6c0 3-2 5-4.6 6-2.6-1-4.6-3-4.6-6V4z" /><path d="M6 8.1 7.5 9.6 10.3 6.4" /></svg>);
    case 'key': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="5.4" cy="8" r="2.6" /><path d="M7.9 7.4h5.1M11.2 7.4v2M13 7.4v2.4" /></svg>);
    case 'eye': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M2.2 8s2.3-3.8 5.8-3.8S13.8 8 13.8 8s-2.3 3.8-5.8 3.8S2.2 8 2.2 8z" /><circle cx="8" cy="8" r="1.6" /></svg>);
    case 'layers': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M8 2.5 14 5.6 8 8.7 2 5.6z" /><path d="M2 8.4 8 11.5l6-3.1" /></svg>);
    case 'portal': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="2.4" y="3.2" width="11.2" height="9.6" rx="1" /><path d="M2.4 6h11.2" /><circle cx="4.3" cy="4.6" r="0.4" fill="currentColor" /></svg>);
    case 'vault': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="2.6" y="3" width="10.8" height="10" rx="1" /><circle cx="8" cy="8" r="2.2" /><path d="M8 8h2.4" /></svg>);
    case 'check': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="8" r="5.6" /><path d="M5.5 8.2 7.2 9.9 10.6 6.3" /></svg>);
    case 'user': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="5.4" r="2.5" /><path d="M3.4 13a4.6 4.6 0 0 1 9.2 0" /></svg>);
    case 'accountant': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="6.8" cy="5.2" r="2.4" /><path d="M2.6 12.8a4.4 4.4 0 0 1 7.7 -2.9" /><path d="M10 11.4 11.5 12.9 14 10" /></svg>);
    case 'hub': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="8" r="2.1" /><circle cx="8" cy="2.5" r="0.95" /><circle cx="8" cy="13.5" r="0.95" /><circle cx="2.5" cy="8" r="0.95" /><circle cx="13.5" cy="8" r="0.95" /><path d="M8 5.9V3.5M8 10.1v2.4M5.9 8H3.5M10.1 8h2.4" /></svg>);
    case 'calendar': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="2.8" y="3.4" width="10.4" height="9.6" rx="1" /><path d="M2.8 6.2h10.4M5.4 2.4v2M10.6 2.4v2" /></svg>);
    default: return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="8" r="3.4" /></svg>);
  }
}

function Wordmark({ as = 'div' }) {
  const Tag = as;
  return (
    <Tag className="wordmark" href={as === 'a' ? '#top' : undefined}>
      <span className="wordmark__mark" aria-hidden="true" />
      <span className="wordmark__name">Agent Zoe</span>
    </Tag>
  );
}

function Eyebrow({ children, center }) {
  return (
    <p className={'eyebrow' + (center ? ' eyebrow--center' : '')}>
      <span className="eyebrow__tick" />{children}
    </p>
  );
}

function SectionHead({ eyebrow, title, lead, center, narrow }) {
  return (
    <div className={'s-head' + (center ? ' s-head--center' : '')}>
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      {title && <h2 className={'s-title' + (narrow ? ' s-title--narrow' : '')}>{title}</h2>}
      {lead && <p className="s-lead">{lead}</p>}
    </div>
  );
}

function PrimaryCta({ withField = true, align = 'left', primary = 'Book a discovery call', placeholder = 'Work email' }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  if (sent) {
    return (
      <div className={`cta-done cta-done--${align}`}>
        <span className="cta-done__mark" aria-hidden="true" />
        <span>Thank you — a member of the desk will be in touch shortly.</span>
      </div>
    );
  }
  return (
    <form className={`cta cta--${align}`} onSubmit={submit}>
      <div className="cta__row">
        {withField && (
          <input className="cta__field" type="email" placeholder={placeholder}
            value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Work email" />
        )}
        <button className="btn btn--primary" type="submit">{primary}<span className="btn__arrow">→</span></button>
      </div>
    </form>
  );
}

/* a measured, full-bleed canvas stage — passes real px to a background system */
function Stage({ className = '', children, render, ...rest }) {
  const ref = useRef(null);
  const { w, h } = useSize(ref);
  return (
    <div ref={ref} className={'stage ' + className} {...rest}>
      {w > 0 && h > 0 && render({ w, h })}
      {children}
    </div>
  );
}

Object.assign(window, { useSize, Glyph, Wordmark, Eyebrow, SectionHead, PrimaryCta, Stage });
