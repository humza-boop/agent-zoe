/* landing-sections2.jsx — lower half of the Agent Zoe landing page:
   Product showcase · Outcomes · Manifesto (dark) · Security · Final CTA
   (dark) · Footer. Reuses backgrounds.jsx + landing-ui.jsx primitives.
   Image slots are user-fillable placeholders. Exports: LShowcase,
   LOutcomes, LManifesto, LSecurity, LFinalCta, LFooter. */

/* ---------------- PRODUCT SHOWCASE · warm white + image slots ---------------- */
function LShowcase() {
  return (
    <section className="section section--tint" id="product" data-screen-label="Product showcase">
      <div className="wrap">
        <SectionHead center eyebrow="In practice"
        title="Designed to feel like your most reliable team member."
        lead="A single, quiet workspace where every client conversation is understood, drafted, and resolved — without the noise of another dashboard." />

        <div className="showcase">
          <div className="browserframe browserframe--lg">
            <div className="browserframe__bar">
              <span className="dot" /><span className="dot" /><span className="dot" />
              <span className="browserframe__addr">app.agentzoe.com</span>
            </div>
            <image-slot id="az-showcase-main" class="browserframe__slot"
            shape="rect" placeholder="Drop the primary product screen"></image-slot>
          </div>
          <div className="showcase__pair">
            <div className="browserframe">
              <div className="browserframe__bar browserframe__bar--sm">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
              <image-slot id="az-showcase-a" class="browserframe__slot"
              shape="rect" placeholder="Drop a secondary screen"></image-slot>
            </div>
            <div className="browserframe">
              <div className="browserframe__bar browserframe__bar--sm">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
              <image-slot id="az-showcase-b" class="browserframe__slot"
              shape="rect" placeholder="Drop a secondary screen"></image-slot>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ---------------- OUTCOMES · warm white editorial metrics ---------------- */
function LOutcomes() {
  const metrics = [
  { v: '< 1', u: 'min', l: 'Median first response, day or night' },
  { v: '3', u: '×', l: 'Faster client turnaround in busy season' },
  { v: '24/7', u: '', l: 'Coverage, without adding headcount' },
  { v: '100', u: '%', l: 'Of conversations logged to your systems' }];

  return (
    <section className="section" id="outcomes" data-screen-label="Outcomes">
      <div className="wrap">
        <SectionHead eyebrow="Outcomes"
        title="The quiet compounding of getting back to people." narrow />
        <div className="metrics">
          {metrics.map((m, i) =>
          <div className="metric" key={i}>
              <div className="metric__num">{m.v}<span className="metric__unit">{m.u}</span></div>
              <p className="metric__label">{m.l}</p>
            </div>
          )}
        </div>
        <p className="metrics__note">Figures shown are placeholders — we’ll set these from your own results.</p>
      </div>
    </section>);

}

/* ---------------- MANIFESTO · dark punctuation over constellation ---------------- */
function LManifesto({ accent, accent2, speed }) {
  return (
    <Stage className="manifesto theme-dark" data-screen-label="Manifesto"
    render={({ w, h }) =>
    <ConstellationBg accent={accent} accent2={accent2} speed={speed * 0.7} width={w} height={h} theme="dark" stations={[]} />
    }>
      <div className="manifesto__veil" />
      <div className="wrap manifesto__inner">
        <Eyebrow>Our manifesto</Eyebrow>
        <p className="manifesto__lead">We believe the future of tax firms will be defined by how they make clients feel.</p>
        <div className="manifesto__copy">
          <p>Not just by the accuracy of a return, but by the clarity of the process, the responsiveness of the communication, and the confidence that nothing is slipping through the cracks.</p>
          <p>Because clients experience a firm through the moments in between: the reminder that arrived on time, the follow-up that never had to be chased, the feeling that someone was paying attention.</p>
          <p>Zoe is the quiet operational layer behind modern tax firms — coordinating intake, reminders, document collection, and client communication with consistency and care, so firms can scale without losing the human experience that builds trust.</p>
        </div>
        <p className="manifesto__kicker">Less chasing. More clarity. More completed returns.</p>
        <div className="manifesto__sign">
          <span className="manifesto__rule" />
          <span className="manifesto__by">The Agent Zoe team</span>
        </div>
      </div>
    </Stage>);

}

/* ---------------- SECURITY & TRUST · warm white ---------------- */
function LSecurity() {
  const items = [
  { g: 'lock', t: 'Encrypted, in transit and at rest', d: 'Every message and document is protected with industry-standard encryption end to end.' },
  { g: 'shield', t: 'Built for compliance', d: 'Architected to support SOC 2 and the privacy expectations of firms handling sensitive financial data.' },
  { g: 'key', t: 'Your data stays yours', d: 'We never train on your clients’ information. Your data is never sold, shared, or repurposed.' },
  { g: 'eye', t: 'Granular access & full audit', d: 'Role-based permissions and a complete, exportable record of every action Zoe takes.' }];

  return (
    <section className="section section--tint" id="security" data-screen-label="Security & trust">
      <div className="wrap security">
        <div className="security__head">
          <SectionHead eyebrow="Security & trust"
          title="Built for the firms that hold the most sensitive data." />
          <p className="s-lead">Trust is the product. Zoe is designed from the ground up to meet the standards of regulated financial practices — quietly, and by default.</p>
        </div>
        <div className="security__grid">
          {items.map((it) =>
          <div className="trust" key={it.t}>
              <span className="trust__glyph"><Glyph kind={it.g} size={20} /></span>
              <div>
                <h3 className="trust__t">{it.t}</h3>
                <p className="trust__d">{it.d}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------------- FINAL CTA · dark closing stage ---------------- */
function LFinalCta({ accent, accent2, speed }) {
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
        <Eyebrow center>Book a discovery call</Eyebrow>
        <h2 className="finalcta__title">Bring white-glove client service to every tax season.</h2>
        <p className="finalcta__support">A quick introduction to see whether Zoe is right for your firm - and what a calmer, more responsive tax season could look like for your team and clients.</p>
        <PrimaryCta withField align="center" primary="Book a discovery call" />
        <p className="finalcta__foot">Currently working with a select group of firms · by introduction.</p>
      </div>
    </Stage>);

}

/* ---------------- FOOTER · dark, continuous with the CTA ---------------- */
function LFooter() {
  const cols = [
  { h: 'Product', links: ['How it works', 'Capabilities', 'Security'] },
  { h: 'Company', links: ['Manifesto', 'Redacted', 'Contact'] },
  { h: 'Legal', links: ['Privacy', 'Terms', 'Data processing'] }];

  return (
    <footer className="footer theme-dark" data-screen-label="Footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Wordmark />
          <p className="footer__line">The client experience agent for modern tax firms.</p>
        </div>
        <div className="footer__cols">
          {cols.map((c) =>
          <div className="footer__col" key={c.h}>
              <p className="footer__h">{c.h}</p>
              <ul>{c.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          )}
        </div>
      </div>
      <div className="wrap footer__base">
        <span>© {new Date().getFullYear()} Agent Zoe</span>
        <span className="footer__base-note">By introduction · working with a select group of firms</span>
      </div>
    </footer>);

}

Object.assign(window, { LShowcase, LOutcomes, LManifesto, LSecurity, LFinalCta, LFooter });