/* teaser-sections.jsx — "The Signal" expanded into a master-structured,
   problem-first teaser page. The product name (Zoe) is withheld the whole
   way down and revealed only at the closing CTA. Tax copy is adapted from
   the master landing page, recast in a quieter, more atmospheric voice.
   Reuses landing-ui.jsx (Stage, Eyebrow, SectionHead, Glyph) and
   backgrounds.jsx (ConstellationBg, SignalLinesBg).
   Exports to window: TNav, THero, TProblem, THowGlimpse, TCapHint,
   TManifesto, TFinalCta, TFooter, TeaserMark, TeaserCapture. */

const { useState: useStateS, useRef: useRefS, useEffect: useEffectS } = React;

/* ---- the quiet mark: a diamond. The name stays withheld until the CTA. ---- */
function TeaserMark({ size = 8 }) {
  return <span className="tmark" style={{ width: size, height: size }} aria-hidden="true" />;
}

/* ---- understated capture: email · name · firm (firm optional) ---- */
function TeaserCapture({ theme = 'dark', cta = 'Request an introduction', note, align = 'left' }) {
  const [v, setV] = useStateS({ email: '', name: '', firm: '' });
  const [sent, setSent] = useStateS(false);
  const on = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {e.preventDefault();setSent(true);};

  if (sent) {
    return (
      <div className={'tcap tcap--' + theme + ' tcap--done tcap--' + align}>
        <span className="tcap__dot" aria-hidden="true" />
        <p className="tcap__thanks">Received. If it’s a fit, someone from the desk will reach out — quietly, and soon.</p>
      </div>);

  }
  return (
    <form className={'tcap tcap--' + theme + ' tcap--' + align} onSubmit={submit}>
      <div className="tcap__fields">
        <input className="tcap__field" type="email" required placeholder="Work email"
        value={v.email} onChange={on('email')} aria-label="Work email" />
        <div className="tcap__row2">
          <input className="tcap__field" type="text" placeholder="Your name"
          value={v.name} onChange={on('name')} aria-label="Your name" />
          <input className="tcap__field" type="text" placeholder="Firm (optional)"
          value={v.firm} onChange={on('firm')} aria-label="Firm (optional)" />
        </div>
      </div>
      <button className="tcap__btn" type="submit">{cta}<span className="tcap__arrow">→</span></button>
      {note && <p className="tcap__note">{note}</p>}
    </form>);

}

/* ---- sticky nav · mark only, name withheld; links track active section ---- */
function TNav() {
  const [solid, setSolid] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'nav' + (solid ? ' solid' : '')}>
      <a className="nav__brand" href="#top"><TeaserMark size={9} /><span className="nav__tag">Private preview</span></a>
      <div className="nav__links">
        <a className="nav__link" href="#problem">The problem</a>
        <a className="nav__link" href="#how">A better way</a>
        <a className="nav__link" href="#belief">Our vision</a>
      </div>
      <a className="nav__cta" href="#contact">Request an intro</a>
    </nav>);

}

/* ---- HERO · The Signal — full-viewport constellation, name withheld ---- */
function THero({ accent, accent2, speed }) {
  return (
    <Stage className="lhero theme-dark" id="top" data-screen-label="Hero"
    render={({ w, h }) => {
      const stations = [
      { x: w * 0.13, y: h * 0.30, isStation: true },
      { x: w * 0.20, y: h * 0.74, isStation: true },
      { x: w * 0.86, y: h * 0.24, isStation: true },
      { x: w * 0.90, y: h * 0.66, isStation: true },
      { x: w * 0.62, y: h * 0.84, isStation: true }];

      return <ConstellationBg accent={accent} accent2={accent2} speed={speed} width={w} height={h} theme="dark" stations={stations} />;
    }}>
      <div className="lhero__veil" />
      <div className="lhero__inner">
        <Eyebrow center>For the firms who feel it</Eyebrow>
        <h1 className="lhero__title">From endless chasing to effortless filing.
        </h1>
        <p className="lhero__support">Missing documents hide in inboxes. Follow-ups scatter across email, SMS, calls, and portals. Clients feel uncertain while firms spend the season chasing information instead of preparing returns. We’re building a quieter way — and opening it, by introduction, to a select few.</p>
        <a className="lhero__cta" href="#contact">Request an intro<span className="lhero__cta-arrow">→</span></a>
      </div>
      <p className="lhero__foot">Briefing a select group of firms · by introduction only.</p>
      <span className="lhero__live"><span className="lhero__live-dot" />Active · not yet public</span>
      <a className="scrollcue" href="#problem" aria-label="Read on">
        <span className="scrollcue__label">Read on</span>
        <span className="scrollcue__line" />
      </a>
    </Stage>);
}

/* ---- THE PROBLEM · warm white, three animated failure modes ---- */
function TProblem() {
  const modes = [
  { n: '01', t: 'Communication breaks down', d: 'Email, SMS, calls, portals, internal handoffs. The thread of a relationship lives in five places at once — and no one holds all of it.', Viz: VizChannels },
  { n: '02', t: 'Documents stall, follow-ups repeat', d: 'A request buried in an inbox, a filing waiting on one missing form, the same reminder sent for the third time.', Viz: VizDocs },
  { n: '03', t: 'No one can see the whole picture', d: 'Where a return actually stands is anyone’s guess. Coordination slips, and the client’s confidence slips with it.', Viz: VizVisibility }];

  return (
    <section className="section" id="problem" data-screen-label="The problem">
      <div className="wrap problem">
        <div className="problem__head">
          <div className="problem__title">
            <SectionHead eyebrow="The problem"
            title="Client communication is where good firms quietly lose time." />
          </div>
          <div className="problem__copy">
            <p className="s-lead problem__lead">Firms rarely lose clients because the tax work was wrong — they lose them in the gaps between. The follow-up that never happened, the document buried in an inbox, the question left unanswered for days. It quietly slows filings down and drains the season of its calm.</p>
          </div>
        </div>
        <ol className="problem__list">
          {modes.map((m) =>
          <li className="fmode" key={m.n}>
              <div className="fmode__viz"><m.Viz /></div>
              <div className="fmode__head">
                <span className="fmode__n">{m.n}</span>
                <h3 className="fmode__t">{m.t}</h3>
              </div>
              <p className="fmode__d">{m.d}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}

/* ---- HOW IT WORKS · a light, 3-beat glimpse — hints, not a spec ---- */
function THowGlimpse({ accent, accent2, speed }) {
  const beats = [
  { n: '01', t: 'Nothing should land in the dark', d: 'Every message, on every channel, seen and understood the moment it arrives — day or night.' },
  { n: '02', t: 'Nothing should wait to be chased', d: 'Documents, signatures, reminders, follow-ups — moving on a quiet schedule of their own.' },
  { n: '03', t: 'Nothing should be lost in the handoff', d: 'What the client said is still there when the work is reviewed, signed, and filed.' }];

  return (
    <section className="section section--tint how" id="how" data-screen-label="How it works">
      <div className="wrap how__wrap">
        <SectionHead center eyebrow="A better way"
        title="From first message to filed return — quietly held together."
        lead="Today, every message finds its own way through the firm. Tomorrow, every interaction follows a guided path - one calm, coordinated thread that supports clients from intake to filing. A quiet, reliable team member that never clocks out, never drops a detail, and always sounds like your firm." />

        <div className="how__scene" aria-hidden="true">
          <OrchestrationScene />
          <span className="how__scene-cap"></span>
        </div>

        <ol className="steps">
          {beats.map((b) =>
          <li className="step" key={b.n}>
              <span className="step__n">{b.n}</span>
              <h3 className="step__t">{b.t}</h3>
              <p className="step__d">{b.d}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}

/* ---- MANIFESTO · dark belief statement, name still withheld ---- */
function TManifesto({ accent, accent2, speed }) {
  return (
    <Stage className="manifesto theme-dark" id="belief" data-screen-label="Belief"
    render={({ w, h }) =>
    <ConstellationBg accent={accent} accent2={accent2} speed={speed * 0.7} width={w} height={h} theme="dark" stations={[]} />}>
      <div className="manifesto__veil" />
      <div className="wrap manifesto__inner">
        <Eyebrow>The brief</Eyebrow>
        <p className="manifesto__lead">The future of tax firms will be defined by how clients experience the process.</p>
        <div className="manifesto__copy">
          <p>A return can be technically flawless and still feel like a failure. Slow responses, misplaced documents, weeks of uncertainty about what comes next — these are the moments that quietly erode trust, even when the work itself is right.</p>
          <p>The firms that endure will feel different. Responsive before the client asks. Composed when complexity peaks. Calm when the season is anything but. Clients will know what's happening without sending a second email. Teams will stop chasing and start advising — building the kind of relationships that stay well past April.</p>
          <p>We’re building the operational layer that makes that possible. A quiet system active in the background, keeping intake, documents, reminders, and communication moving in perfect sync — so that every interaction, from first contact to filed return, feels like someone was paying close attention.</p>
        </div>
        <p className="manifesto__kicker">The mission: less friction, more trust, more returns filed — every season.</p>
        <div className="manifesto__sign">
          <span className="manifesto__rule" />
          <span className="manifesto__by">The team behind it</span>
        </div>
      </div>
    </Stage>);

}

/* ---- FINAL CTA · dark close — the name is finally revealed ---- */
function TFinalCta({ accent, accent2, speed }) {
  return (
    <Stage className="finalcta theme-dark" id="contact" data-screen-label="Final CTA"
    render={({ w, h }) => {
      const stations = [
      { x: w * 0.2, y: h * 0.34, isStation: true },
      { x: w * 0.82, y: h * 0.28, isStation: true },
      { x: w * 0.74, y: h * 0.72, isStation: true }];

      return <ConstellationBg accent={accent} accent2={accent2} speed={speed} width={w} height={h} theme="dark" stations={stations} />;
    }}>
      <div className="finalcta__veil" />
      <div className="finalcta__inner">
        <Eyebrow center>The codename.</Eyebrow>
        <h2 className="finalcta__name">Zoe.</h2>
        <p className="finalcta__support">A quiet operator for modern tax firms. Always active in the background. Introduced selectively. Request a brief introduction to see whether Zoe is a fit for your firm and what a more coordinated tax season could feel like.</p>
        <div className="finalcta__cta">
          <TeaserCapture theme="dark" align="center" cta="Request an introduction"
          note="By introduction · working with a select group of firms." />
        </div>
      </div>
    </Stage>);

}

/* ---- FOOTER · dark; the name may show now that it’s been revealed ---- */
function TFooter() {
  const navLinks = [
    { label: 'The problem', href: '#problem' },
    { label: 'A better way', href: '#how' },
    { label: 'Our vision', href: '#belief' },
    { label: 'Request an intro', href: '#contact' },
  ];

  return (
    <footer className="footer theme-dark" data-screen-label="Footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <span className="wordmark"><span className="wordmark__mark" /><span className="wordmark__name">Zoe</span></span>
          <p className="footer__line">A quiet operative for the client side of tax work. Deployed by introduction.</p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__h">Navigate</p>
            <ul>{navLinks.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
          </div>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>© {new Date().getFullYear()}</span>
        <span className="footer__base-note">Currently in quiet development</span>
      </div>
    </footer>);

}

Object.assign(window, { TNav, THero, TProblem, THowGlimpse, TManifesto, TFinalCta, TFooter, TeaserMark, TeaserCapture });