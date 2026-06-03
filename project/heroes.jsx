/* heroes.jsx — the Agent Zoe hero, evolved into a calm, editorial,
   concierge-grade system. Three compositions share one vocabulary:
     A · Signal     — light, asymmetric editorial; hairline signal lines.
     B · Orchestration — light; a quiet left→right routing diagram.
     C · Field      — the single cinematic dark stage; a coordination field.
   The orchestration metaphor (channels → Zoe → firm systems) is preserved
   but refined; the old spycraft chrome (status pills, readouts) is gone.
   Exports: HeroSignal, HeroOrchestration, HeroField. */

const { useState, useMemo } = React;

const HEADLINES = [
  'White-glove communication for modern tax firms and their clients.',
  'An elite communications layer for modern tax firms.',
  'Concierge communication, quietly orchestrated.',
];

const COPY = {
  eyebrow: 'The client experience layer for modern tax firms',
  support: 'Agent Zoe brings together SMS, email, voice, intake, reminders, and document workflows into one coordinated client experience — helping firms operate more efficiently while making every client interaction feel more thoughtful and responsive.',
  placeholder: 'Work email',
  primary: 'Book a discovery call',
  secondary: 'Request early access',
  footer: 'Currently working with a select group of firms.',
};

/* minimal monoline glyphs — channels, firm systems */
function Glyph({ kind }) {
  const s = { width: 14, height: 14, display: 'block' };
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round' };
  switch (kind) {
    case 'sms': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M2.5 3.5h11v7H6.5l-3 2.4V10.5h-1z" /></svg>);
    case 'email': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="2.3" y="4" width="11.4" height="8" rx="1" /><path d="M2.8 4.7 8 8.4l5.2-3.7" /></svg>);
    case 'voice': return (<svg viewBox="0 0 16 16" style={s} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"><line x1="4" y1="6" x2="4" y2="10" /><line x1="8" y1="3.5" x2="8" y2="12.5" /><line x1="12" y1="6.5" x2="12" y2="9.5" /></svg>);
    case 'crm': return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="6" r="2.1" /><path d="M3.8 12.6a4.2 4.2 0 0 1 8.4 0" /></svg>);
    case 'filing': return (<svg viewBox="0 0 16 16" style={s} {...P}><path d="M4.6 2.7h4.1l2.7 2.7v7.9H4.6z" /><path d="M8.5 2.8v2.8h2.6" /><path d="M6.2 9h3.6M6.2 11h3.6" /></svg>);
    case 'sheet': return (<svg viewBox="0 0 16 16" style={s} {...P}><rect x="3" y="3" width="10" height="10" rx="1" /><path d="M3 7h10M3 10h10M7.6 3v10" /></svg>);
    default: return (<svg viewBox="0 0 16 16" style={s} {...P}><circle cx="8" cy="8" r="3.4" /></svg>);
  }
}

function Wordmark() {
  return (
    <div className="wordmark">
      <span className="wordmark__mark" aria-hidden="true" />
      <span className="wordmark__name">Agent Zoe</span>
    </div>
  );
}

function NavLink() {
  return <a className="navlink" href="#">{COPY.secondary}<span className="navlink__arrow">→</span></a>;
}

function Eyebrow({ text }) {
  return (
    <p className="eyebrow"><span className="eyebrow__tick" />{text || COPY.eyebrow}</p>
  );
}

function Chip({ s, hub, i }) {
  return (
    <div className={'chip' + (hub ? ' chip--hub' : '')}
      style={{ left: s.x, top: s.y, animationDelay: (i * 0.45) + 's' }}>
      {!hub && <span className="chip__glyph"><Glyph kind={s.g} /></span>}
      <span className="chip__label">{s.key}</span>
    </div>
  );
}

/* CTA — refined. Optional inline email field; primary button + ghost link. */
function Cta({ headlineIdx, withField = true, align = 'left' }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); if (!withField || email.trim()) setSent(true); };

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
          <input className="cta__field" type="email" placeholder={COPY.placeholder}
            value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Work email" />
        )}
        <button className="btn btn--primary" type="submit">{COPY.primary}<span className="btn__arrow">→</span></button>
      </div>
      <button className="btn btn--ghost" type="button" onClick={() => setSent(true)}>{COPY.secondary}</button>
    </form>
  );
}

/* ---- A · SIGNAL — light, asymmetric editorial ---- */
function HeroSignal(props) {
  const { accent, accent2, speed, width, height, headlineIdx } = props;
  return (
    <div className="hero hero--light hero--signal" data-screen-label="Signal">
      <SignalLinesBg accent={accent} accent2={accent2} speed={speed} width={width} height={height} theme="light" />
      <div className="hero__veil hero__veil--clear-left" />
      <header className="hero__top">
        <Wordmark />
        <NavLink />
      </header>
      <div className="hero__block hero__block--left">
        <Eyebrow />
        <h1 className="headline">{HEADLINES[headlineIdx]}</h1>
        <p className="support">{COPY.support}</p>
        <Cta headlineIdx={headlineIdx} withField align="left" />
      </div>
      <p className="footnote footnote--bl">{COPY.footer}</p>
    </div>
  );
}

/* ---- B · ORCHESTRATION — light; channels → Zoe → firm systems ---- */
function HeroOrchestration(props) {
  const { accent, accent2, speed, width, height, headlineIdx } = props;
  const stations = useMemo(() => ({
    channels: [
      { x: 600, y: 252, key: 'SMS', g: 'sms', isStation: true },
      { x: 600, y: 400, key: 'EMAIL', g: 'email', isStation: true },
      { x: 600, y: 548, key: 'VOICE', g: 'voice', isStation: true },
    ],
    hub: { x: 858, y: 400, key: 'AGENT ZOE', isStation: true },
    systems: [
      { x: 1126, y: 252, key: 'CRM', g: 'crm', isStation: true },
      { x: 1126, y: 400, key: 'TAX FILING', g: 'filing', isStation: true },
      { x: 1126, y: 548, key: 'SPREADSHEETS', g: 'sheet', isStation: true },
    ],
  }), []);

  return (
    <div className="hero hero--light hero--orch" data-screen-label="Orchestration">
      <OrchestrationBg accent={accent} accent2={accent2} speed={speed} width={width} height={height} theme="light" stations={stations} />
      <header className="hero__top">
        <Wordmark />
        <NavLink />
      </header>

      {stations.channels.map((s, i) => <Chip key={s.key} s={s} i={i} />)}
      {stations.systems.map((s, i) => <Chip key={s.key} s={s} i={i + 3} />)}
      <Chip s={stations.hub} hub i={6} />
      <div className="orch-cap" style={{ left: stations.hub.x, top: stations.hub.y + 34 }}>
        <span>Intake</span><span className="orch-cap__sep" />
        <span>Documents</span><span className="orch-cap__sep" />
        <span>Answers, 24/7</span>
      </div>
      <p className="orch-note" style={{ left: 1126, top: 622 }}>Zoe reads and writes to your existing&nbsp;stack.</p>

      <div className="hero__block hero__block--col">
        <Eyebrow />
        <h1 className="headline headline--sm">{HEADLINES[headlineIdx]}</h1>
        <p className="support support--narrow">{COPY.support}</p>
        <Cta headlineIdx={headlineIdx} withField align="left" />
      </div>
    </div>
  );
}

/* ---- C · FIELD — cinematic dark stage, centered ---- */
function HeroField(props) {
  const { accent, accent2, speed, width, height, headlineIdx } = props;
  const stations = useMemo(() => ([
    { x: 360, y: 250, key: 'SMS', g: 'sms', isStation: true },
    { x: 980, y: 224, key: 'EMAIL', g: 'email', isStation: true },
    { x: 1066, y: 470, key: 'CRM', g: 'crm', isStation: true },
    { x: 286, y: 560, key: 'VOICE', g: 'voice', isStation: true },
  ]), []);

  return (
    <div className="hero hero--dark hero--field" data-screen-label="Field">
      <ConstellationBg accent={accent} accent2={accent2} speed={speed} width={width} height={height} theme="dark" stations={stations} />
      <div className="hero__veil hero__veil--vignette" />
      <header className="hero__top">
        <Wordmark />
        <NavLink />
      </header>
      {stations.map((s, i) => <Chip key={s.key} s={s} i={i} />)}
      <div className="hero__block hero__block--center">
        <Eyebrow />
        <h1 className="headline headline--center">{HEADLINES[headlineIdx]}</h1>
        <p className="support support--center">{COPY.support}</p>
        <Cta headlineIdx={headlineIdx} withField={false} align="center" />
      </div>
      <p className="footnote footnote--center">{COPY.footer}</p>
    </div>
  );
}

Object.assign(window, { HeroSignal, HeroOrchestration, HeroField });
