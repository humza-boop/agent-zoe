/* landing-sections.jsx — upper half of the Agent Zoe landing page:
   Hero (dark) · The Problem · How it works · Capabilities.
   Reuses backgrounds.jsx (ConstellationBg, OrchestrationBg, SignalLinesBg)
   and landing-ui.jsx primitives. Exports: LHero, LProblem, LHowItWorks,
   LCapabilities. */

/* ---------------- HERO · centered text over a full-bleed constellation field
   (the same system that carries the manifesto, final CTA and footer) ---------------- */
function LHero({ accent, accent2, speed }) {
  return (
    <Stage className="lhero theme-dark" data-screen-label="Hero"
    render={({ w, h }) => {
      // sparse firm/client anchors spread across the whole frame so the
      // field fills the window rather than clustering centrally
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
        <Eyebrow center>The client experience agent for modern tax firms</Eyebrow>
        <h1 className="lhero__title">Every Client Guided. Every Filing Coordinated.</h1>
        <p className="lhero__support">Zoe orchestrates the client side of tax preparation - connecting intake, document workflows, reminders, SMS, email, and voice communication into one organized system that saves accountants hours while making clients feel supported throughout the filing process.</p>
        <PrimaryCta withField={false} align="center" />
      </div>
      <p className="lhero__foot">Currently working with a select group of firms.</p>
    </Stage>);

}

/* ---------------- THE PROBLEM · warm white ---------------- */
function LProblem() {
  const modes = [
  { n: '01', t: 'Conversations scatter across channels', d: 'A text here, an email there, a voicemail no one returns. The thread of a relationship lives in five places at once.' },
  { n: '02', t: 'Clients wait, and notice the wait', d: 'Replies stall behind busy season and back-to-back calls. The silence reads as indifference — even when it isn’t.' },
  { n: '03', t: 'Context is lost between systems', d: 'What a client said rarely makes it into the CRM, the filing software, or the next person who picks up the file.' }];

  return (
    <section className="section" id="problem" data-screen-label="The Problem">
      <div className="wrap problem">
        <div className="problem__head">
          <div className="problem__title">
            <SectionHead eyebrow="The problem"
            title="Client communication is where good firms quietly lose time." />
          </div>
          <div className="problem__copy">
            <p className="s-lead problem__lead">Modern tax firms don’t usually lose clients because of bad tax work. They lose them in the gaps between communication — the follow-up that never happened, the document request buried in an inbox, the client question that sat unanswered for days. Teams spend hours chasing forms, signatures, and missing information, while clients are left unsure of what’s happening next.</p>
            <p className="s-lead problem__lead">That back-and-forth slows filings down, creates unnecessary stress during tax season, and makes the entire experience feel harder than it should.</p>
          </div>
        </div>
        <ol className="problem__list">
          {modes.map((m) => <li className="fmode" key={m.n}>
              <span className="fmode__n">{m.n}</span>
              <div className="fmode__body">
                <h3 className="fmode__t">{m.t}</h3>
                <p className="fmode__d">{m.d}</p>
              </div>
            </li>)}
        </ol>
      </div>
    </section>);

}

/* ---------------- HOW IT WORKS · intake → filing pipeline ---------------- */
function LHowItWorks() {
  const steps = [
  { t: 'Intake & triage', d: 'Every inbound message — SMS, email, voice, portal — lands in one place, understood and prioritized, around the clock.' },
  { t: 'Collect & coordinate', d: 'Zoe requests documents, chases signatures, sends reminders, and keeps every client informed of exactly what happens next.' },
  { t: 'Review, sign & file', d: 'Completed work is written back to your CRM and tax platform — reviewed, signed, and filed, with nothing left sitting in an inbox.' }];


  return (
    <section className="section section--tint" id="how" data-screen-label="How it works">
      <div className="wrap">
        <SectionHead center eyebrow="How it works"
        title="From first message to filed return — quietly coordinated."
        lead="Zoe runs the whole pipeline between your clients and your stack: taking in every channel, collecting documents, routing signatures, and writing results back to the tax platforms and CRMs you already use." />

        <PipelineScene theme="light" />

        <ol className="steps">
          {steps.map((s, i) =>
          <li className="step" key={s.t}>
              <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="step__t">{s.t}</h3>
              <p className="step__d">{s.d}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}

/* ---------------- CAPABILITIES · warm white grid ---------------- */
function LCapabilities() {
  const caps = [
  { g: 'layers', t: 'Unified across channels', d: 'SMS, email, and voice resolve into one continuous conversation per client.' },
  { g: 'route', t: 'Intelligent triage & routing', d: 'Every message is understood, prioritized, and sent to the right person or workflow.' },
  { g: 'pen', t: 'Replies in your firm’s voice', d: 'Drafted responses that sound like you — reviewed and sent in a click, or sent on your rules.' },
  { g: 'bell', t: 'Proactive reminders', d: 'Document requests, deadlines, and follow-ups go out on time, every time, without nudging.' },
  { g: 'sheet', t: 'Reads & writes your stack', d: 'Two-way sync with your CRM, filing software, and spreadsheets — no copy-paste.' },
  { g: 'clock', t: 'Always-on coverage', d: 'Clients get a thoughtful, accurate first response at 9am or 11pm — and during busy season.' }];

  return (
    <section className="section" id="capabilities" data-screen-label="Capabilities">
      <div className="wrap">
        <SectionHead eyebrow="Capabilities"
        title="Quietly capable, end to end." narrow />
        <div className="capgrid">
          {caps.map((c) =>
          <div className="cap" key={c.t}>
              <span className="cap__glyph"><Glyph kind={c.g} size={20} /></span>
              <h3 className="cap__t">{c.t}</h3>
              <p className="cap__d">{c.d}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, { LHero, LProblem, LHowItWorks, LCapabilities });