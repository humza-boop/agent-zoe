/* coordination.jsx — Agent Zoe's "quiet operator" animation system.
   Choreographs Zoe coordinating work across channels and firm systems, and
   driving the intake → filing pipeline. Everything is declarative CSS:
   routing lines are SVG hairlines with a soft travelling dash, glyph tokens
   ride offset-path motion routes, and status cards confirm on long staggered
   cycles ("Docs received", "Return filed"). No rAF, no per-frame React state —
   calm, crisp, and pausable via the motion tweak.
   Exports: CoordScene (hero, channels → Zoe → systems), PipelineScene
   (intake → file), Marker247. */

const { useRef: useRefC, useMemo: useMemoC } = React;

/* build an svg path string between two points, optional quadratic bend */
function seg(a, b, bend) {
  if (!bend) return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  const mx = (a.x + b.x) / 2 + (bend.x || 0), my = (a.y + b.y) / 2 + (bend.y || 0);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/* a glyph token riding a motion path */
function Tok({ a, b, bend, glyph, dur = 7, delay = 0, kind = 'in' }) {
  const d = seg(a, b, bend);
  return (
    <div className={'tok tok--' + kind} style={{ offsetPath: `path('${d}')`, '--dur': dur + 's', '--delay': delay + 's' }}>
      <span className="tok__g"><Glyph kind={glyph} size={12} /></span>
    </div>
  );
}

/* static hairline route + soft travelling dash */
function Route({ a, b, bend }) {
  const d = seg(a, b, bend);
  return (
    <g>
      <path className="az-route az-route--base" d={d} />
      <path className="az-route az-route--flow" d={d} />
    </g>
  );
}

/* a node chip placed at absolute px (label + glyph) */
function NodeChip({ x, y, label, g, hub }) {
  return (
    <div className={'chip scene-chip' + (hub ? ' chip--hub scene-core' : '')} style={{ left: x, top: y }}>
      {hub && <span className="scene-core__halo" aria-hidden="true" />}
      {!hub && g && <span className="chip__glyph"><Glyph kind={g} size={13} /></span>}
      <span className="chip__label">{label}</span>
    </div>
  );
}

/* an auto-confirming status card on a long staggered cycle */
function StatusCard({ x, y, glyph, label, cdur = 15, delay = 0, anchor = 'c' }) {
  return (
    <div className={'status-card sc-' + anchor} style={{ left: x, top: y, '--cdur': cdur + 's', '--delay': delay + 's' }}>
      <span className="status-card__tick"><Glyph kind={glyph} size={12} /></span>
      <span className="status-card__label">{label}</span>
    </div>
  );
}

/* the always-on marker */
function Marker247({ x, y }) {
  return (
    <div className="marker247" style={x != null ? { left: x, top: y } : undefined}>
      <span className="marker247__dot" aria-hidden="true" />
      <span className="marker247__text">Operating · 24/7</span>
    </div>
  );
}

/* ============================================================
   CoordScene — channels → Zoe → systems. Used as the hero's
   lower coordination band. Inbound channels feed Zoe on the
   left; Zoe writes back out to firm systems on the right.
   ============================================================ */
function CoordScene({ theme = 'dark', variant = 'panel' }) {
  const ref = useRefC(null);
  const { w, h } = useSize(ref);
  const ambient = variant === 'ambient';

  const channels = [
    { l: 'SMS', g: 'sms' },
    { l: 'VOICE', g: 'voice' },
    { l: 'EMAIL', g: 'email' },
    { l: 'CLIENT PORTAL', g: 'portal' },
  ];
  const systems = [
    { l: 'YOUR CRM', g: 'crm' },
    { l: 'TAX PLATFORM', g: 'filing' },
    { l: 'E-SIGNATURE', g: 'pen' },
    { l: 'DOCUMENT VAULT', g: 'vault' },
  ];
  const outGlyphs = ['route', 'filing', 'pen', 'check'];

  const M = useMemoC(() => {
    if (!w || !h) return null;
    const rows = [0.16, 0.39, 0.61, 0.84];
    const chX = w * 0.10, syX = w * 0.90;
    const core = { x: w * 0.5, y: h * 0.5 };
    const ch = channels.map((c, i) => ({ ...c, x: chX, y: rows[i] * h }));
    const sy = systems.map((s, i) => ({ ...s, x: syX, y: rows[i] * h }));
    return { core, ch, sy };
  }, [w, h]);

  return (
    <div className={'coordscene' + (ambient ? ' coordscene--ambient' : '')} ref={ref}>
      {M && (
        <React.Fragment>
          <svg className="scene-svg" width={w} height={h}>
            {M.ch.map((c, i) => <Route key={'ri' + i} a={c} b={M.core} bend={{ x: (M.core.x - c.x) * -0.12, y: 0 }} />)}
            {M.sy.map((s, i) => <Route key={'ro' + i} a={M.core} b={s} bend={{ x: (s.x - M.core.x) * 0.12, y: 0 }} />)}
          </svg>

          {/* inbound glyph tokens: channel → Zoe */}
          {M.ch.map((c, i) => (
            <Tok key={'ti' + i} a={c} b={M.core} bend={{ x: (M.core.x - c.x) * -0.12, y: 0 }}
              glyph={c.g} kind="in" dur={6.4} delay={i * 1.5} />
          ))}
          {/* outbound work tokens: Zoe → systems */}
          {M.sy.map((s, i) => (
            <Tok key={'to' + i} a={M.core} b={s} bend={{ x: (s.x - M.core.x) * 0.12, y: 0 }}
              glyph={outGlyphs[i]} kind="out" dur={6.4} delay={3 + i * 1.5} />
          ))}

          {/* nodes */}
          {M.ch.map((c, i) => <NodeChip key={'nc' + i} {...c} />)}
          {M.sy.map((s, i) => <NodeChip key={'ns' + i} {...s} />)}
          {!ambient && <NodeChip x={M.core.x} y={M.core.y} label="AGENT ZOE" hub />}
          {!ambient && <Marker247 x={M.core.x} y={M.core.y + h * 0.16} />}

          {/* confirmations in safe zones (panel only) */}
          {!ambient && (
            <React.Fragment>
              <StatusCard x={M.core.x - w * 0.205} y={h * 0.5} glyph="route" label="Intake received" cdur={16} delay={1.5} anchor="r" />
              <StatusCard x={M.core.x + w * 0.205} y={h * 0.27} glyph="pen" label="E-signature complete" cdur={16} delay={8} anchor="l" />
              <StatusCard x={M.core.x + w * 0.205} y={h * 0.73} glyph="check" label="Return filed" cdur={16} delay={12.5} anchor="l" />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

/* ============================================================
   PipelineScene — the "How it works" diagram. A clear switchboard:
   Agent Zoe sits at the centre, coordinating three parties — the
   Client (left), the Accountant (top-right) and the Tax platform
   (bottom-right). Each leg is labelled with the part of the process
   it carries, and glyph tokens travel the routes so it reads as a
   live coordination, not a static org chart.
   ============================================================ */
function PipelineScene({ theme = 'light' }) {
  const ref = useRefC(null);
  const { w, h } = useSize(ref);

  const M = useMemoC(() => {
    if (!w || !h) return null;
    const y = h * 0.46;
    const client = { x: w * 0.05,  y };
    const zoe    = { x: w * 0.275, y };
    const soft   = { x: w * 0.525, y };
    const acct   = { x: w * 0.75,  y };
    const file   = { x: w * 0.915, y }; // short final hop from the accountant
    const mid = (a, b, oy = 0) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + oy });
    return {
      client, zoe, soft, acct, file,
      mClient: mid(client, zoe, -30),
      mSoft: mid(zoe, soft, -30),
      mAcct: mid(soft, acct, -30),
      mFile: mid(acct, file, -30),
    };
  }, [w, h]);

  return (
    <div className="coordscene pipeline pipeline--hub" ref={ref}>
      {M && (
        <React.Fragment>
          <svg className="scene-svg" width={w} height={h}>
            <Route a={M.client} b={M.zoe} />
            <Route a={M.zoe} b={M.soft} />
            <Route a={M.soft} b={M.acct} />
            <Route a={M.acct} b={M.file} />
          </svg>

          {/* client → Zoe : intake & documents */}
          <Tok a={M.client} b={M.zoe} glyph="filing" kind="in" dur={5.4} delay={0} />
          <Tok a={M.client} b={M.zoe} glyph="email" kind="in" dur={5.4} delay={2.7} />
          {/* Zoe ↔ tax software : automatic read & write */}
          <Tok a={M.zoe} b={M.soft} glyph="sheet" kind="out" dur={5} delay={1} />
          <Tok a={M.soft} b={M.zoe} glyph="check" kind="relay" dur={5} delay={3.5} />
          {/* tax software → accountant : review & approve */}
          <Tok a={M.soft} b={M.acct} glyph="eye" kind="out" dur={5} delay={2.2} />
          {/* accountant → tax filing : the final submission (short hop) */}
          <Tok a={M.acct} b={M.file} glyph="check" kind="out" dur={3.4} delay={1.4} />

          {/* leg labels — what part of the process each connection carries */}
          <span className="leg-label" style={{ left: M.mClient.x, top: M.mClient.y }}>Intake · Documents</span>
          <span className="leg-label" style={{ left: M.mSoft.x, top: M.mSoft.y }}>Auto read &amp; write</span>
          <span className="leg-label" style={{ left: M.mAcct.x, top: M.mAcct.y }}>Review &amp; approve</span>
          <span className="leg-label" style={{ left: M.mFile.x, top: M.mFile.y }}>Files</span>

          {/* the actors */}
          <ActorNode x={M.client.x} y={M.client.y} glyph="user" name="Client" caption="Shares info & signs" />
          <ActorNode x={M.soft.x} y={M.soft.y} glyph="sheet" name="Tax Software" caption="CRM · Zoe reads & writes" />
          <ActorNode x={M.acct.x} y={M.acct.y} glyph="accountant" name="Accountant" caption="Reviews & files" />
          <ActorNode x={M.file.x} y={M.file.y} glyph="filing" name="Tax Filing" caption="The final submission" />
          <ActorNode x={M.zoe.x} y={M.zoe.y} glyph="hub" name="Agent Zoe" caption="Coordinates every step" hub />
        </React.Fragment>
      )}
    </div>
  );
}

/* an actor in the How-it-works diagram: icon centred on (x,y), label + caption below */
function ActorNode({ x, y, glyph, name, caption, hub }) {
  return (
    <div className={'actor' + (hub ? ' actor--hub' : '')} style={{ left: x, top: y }}>
      <span className="actor__icon">
        {hub && <span className="actor__halo" aria-hidden="true" />}
        <Glyph kind={glyph} size={hub ? 26 : 20} />
      </span>
      <span className="actor__label">
        <span className="actor__name">{name}</span>
        {caption && <span className="actor__caption">{caption}</span>}
      </span>
    </div>
  );
}

Object.assign(window, { CoordScene, PipelineScene, Marker247, Tok, Route, NodeChip, StatusCard });
