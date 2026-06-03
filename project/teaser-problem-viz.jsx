/* teaser-problem-viz.jsx — three small animated illustrations for the problem
   section, grounded in tax-season operations. Each visualizes one failure
   mode using a quiet monoline / mono-label vocabulary so it stays editorial.
   Pure scalable SVG + CSS (no SMIL) so they honor the "motion" tweak,
   prefers-reduced-motion, and per-section in-view gating. viewBox 0 0 320 168.
   Exports to window: VizChannels, VizDocs, VizVisibility, MiniGlyph. */

/* tiny schematic glyphs, centered at the local origin (use inside a translate) */
function MiniGlyph({ kind }) {
  switch (kind) {
    case 'sms': return (<g className="pviz__g"><rect x="-7" y="-5.5" width="14" height="10" rx="2.6" /><path d="M-3.5,4.5 v3 l3,-3" /><circle cx="-3" cy="-0.6" r="0.7" /><circle cx="0" cy="-0.6" r="0.7" /><circle cx="3" cy="-0.6" r="0.7" /></g>);
    case 'email': return (<g className="pviz__g"><rect x="-7" y="-5" width="14" height="10" rx="1.4" /><path d="M-7,-4 L0,1.4 L7,-4" /></g>);
    case 'voice': return (<g className="pviz__g"><path d="M-5,-1.4 L-5,1.4 M-2,-4.2 L-2,4.2 M1,-2.6 L1,2.6 M4,-1.2 L4,1.2" /></g>);
    case 'portal': return (<g className="pviz__g"><rect x="-7" y="-5.5" width="14" height="11" rx="1.4" /><path d="M-7,-2 H7" /><circle cx="-4.7" cy="-3.8" r="0.5" /></g>);
    case 'bell': return (<g className="pviz__g"><path d="M-3.6,2 a3.6,3.6 0 0 1 7.2,0 z" /><path d="M-4.4,2 H4.4" /><path d="M-1,3.6 a1,1 0 0 0 2,0" /></g>);
    case 'doc': return (<g className="pviz__g"><path d="M-5,-7 h7 l3,3 v11 h-10 z" /><path d="M2,-7 v3 h3" /><path d="M-3,-1 h6 M-3,2 h6 M-3,5 h4" /></g>);
    case 'miss': return (<g className="pviz__g"><path d="M-6,-2.4 a8.5,8.5 0 0 0 11,5.6" /><path d="M2.2,-6 l4.8,4.8 M7,-6 l-4.8,4.8" /></g>);
    default: return null;
  }
}

function Chip({ kind, x, y, alert, dl = 0 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <g className={'pviz__chip' + (alert ? ' pviz__chip--alert' : '')} style={{ '--dl': dl + 's' }}>
        <rect className="pviz__chip-plate" x="-13" y="-10" width="26" height="20" rx="5.5" />
        <MiniGlyph kind={kind} />
      </g>
    </g>
  );
}

/* 1 · Communication breaking down — email, SMS, calls, portals fire across
   tangled, crossing paths; two fade before they land. Artifacts ride the
   lines and the thread never resolves into one place. */
function VizChannels() {
  const sources = [
    { y: 26, g: 'email' }, { y: 64, g: 'sms' }, { y: 104, g: 'voice' }, { y: 142, g: 'portal' },
  ];
  const paths = [
    { d: 'M42,26 C118,44 92,126 246,118', dur: 3.6, delay: 0.0 },
    { d: 'M42,64 C126,152 158,28 286,54', dur: 4.4, delay: 0.9, drop: true },
    { d: 'M42,104 C120,70 190,150 240,146', dur: 3.2, delay: 0.4 },
    { d: 'M42,142 C134,152 168,40 282,92', dur: 4.8, delay: 1.4, drop: true },
  ];
  return (
    <svg className="pviz" viewBox="0 0 320 168" fill="none" aria-hidden="true">
      {paths.map((p, i) => <path key={'b' + i} className="pviz__base" d={p.d} />)}
      {paths.map((p, i) => (
        <path key={'f' + i} className={'pviz__flow' + (p.drop ? ' is-drop' : '')} d={p.d}
          style={{ '--d': p.dur + 's', '--dl': p.delay + 's' }} />
      ))}
      {sources.map((s, i) => (
        <g key={'s' + i} transform={`translate(28,${s.y})`}>
          <circle className="pviz__src" cx="0" cy="0" r="11" style={{ '--dl': (i * 0.3) + 's' }} />
          <MiniGlyph kind={s.g} />
        </g>
      ))}
      <Chip kind="sms" x={150} y={74} dl={0.2} />
      <Chip kind="email" x={190} y={56} dl={1.1} />
      <Chip kind="doc" x={196} y={120} dl={0.6} />
      <Chip kind="miss" x={118} y={120} alert dl={1.6} />
      {/* the thread never lands in one place */}
      <g className="pviz__frag">
        <path className="pviz__bracket" d="M302,56 h-11 v56 h11" />
        <text className="pviz__q" x="296" y="88">?</text>
      </g>
    </svg>
  );
}

/* 2 · Documents stall, follow-ups repeat — a queue of tax artifacts piles up
   behind one missing item; many returns wait in the stack; a reminder pings
   on a loop. The queue nudges forward, then stalls. */
function VizDocs() {
  const cards = [
    { x: 150, label: 'W-2' },
    { x: 182, label: '1099' },
    { x: 214, label: '1099' },
    { x: 246, label: 'SIGN' },
  ];
  return (
    <svg className="pviz" viewBox="0 0 320 168" fill="none" aria-hidden="true">
      <path className="pviz__base" d="M18,134 H302" />
      {/* the desk / processing point */}
      <g className="pviz__tray">
        <path d="M30,120 h26 v14 h-26 z" />
        <path d="M30,120 l5,-8 h16 l5,8" />
      </g>
      <text className="pviz__lab pviz__lab--accent" x="43" y="150" textAnchor="middle">TO FILE</text>

      {/* many returns waiting — faint stack behind */}
      <g className="pviz__ghosts">
        {[0, 1, 2].map((i) => <rect key={i} className="pviz__ghost" x={224 + i * 7} y={92 - i * 5} width="24" height="30" rx="2" />)}
      </g>

      {/* the queue — nudges toward the desk, then stalls */}
      <g className="pviz__queue">
        {cards.map((c, i) => (
          <g key={i} transform={`translate(${c.x},96)`}>
            <rect className="pviz__card" x="0" y="0" width="24" height="30" rx="2" />
            <path className="pviz__card-fold" d="M18,0 v6 h6" />
            <text className="pviz__lab" x="11" y="21" textAnchor="middle">{c.label}</text>
          </g>
        ))}
      </g>

      {/* one missing item, blocking everything */}
      <g transform="translate(110,96)">
        <rect className="pviz__card pviz__card--missing" x="0" y="0" width="24" height="30" rx="2" />
        <text className="pviz__qmark" x="12" y="20" textAnchor="middle">?</text>
        <text className="pviz__lab pviz__lab--alert" x="12" y="-9" textAnchor="middle">MISSING</text>
      </g>

      {/* reminder — sent again, and again */}
      <g transform="translate(122,62)">
        <circle className="pviz__ping" cx="0" cy="0" r="6" />
        <circle className="pviz__ping pviz__ping--2" cx="0" cy="0" r="6" />
      </g>
      <text className="pviz__lab pviz__lab--alert" x="150" y="58" textAnchor="start">REMINDER ×3</text>
    </svg>
  );
}

/* 3 · No one sees the whole picture — the same return, viewed by three people,
   each holding a different and incomplete version. Where no two agree is the
   operational blind spot. */
function VizVisibility() {
  const colX = [150, 198, 246, 294];
  const stages = ['INTAKE', 'DOCS', 'REVIEW', 'FILED'];
  const rows = [
    { role: 'CLIENT', y: 62, st: ['done', 'done', 'unknown', 'wait'] },
    { role: 'PREPARER', y: 104, st: ['done', 'unknown', 'done', 'wait'] },
    { role: 'REVIEWER', y: 146, st: ['done', 'done', 'wait', 'unknown'] },
  ];
  return (
    <svg className="pviz" viewBox="0 0 320 168" fill="none" aria-hidden="true">
      {/* the blind spot — the column where no two views agree */}
      <rect className="pviz__band" x={colX[2] - 15} y="42" width="30" height="120" rx="5" />
      {stages.map((s, i) => (
        <text key={i} className={'pviz__lab' + (i === 2 ? ' pviz__lab--alert' : ' pviz__lab--accent')} x={colX[i]} y="32" textAnchor="middle">{s}</text>
      ))}
      {rows.map((r, ri) => (
        <g key={ri}>
          <text className="pviz__lab pviz__role" x="14" y={r.y + 3} textAnchor="start">{r.role}</text>
          {r.st.map((st, ci) => (
            <g key={ci} className={'pviz__pip pviz__pip--' + st}>
              <circle className="pviz__pip-ring" cx={colX[ci]} cy={r.y} r="7" />
              {st === 'done' && <circle className="pviz__pip-dot" cx={colX[ci]} cy={r.y} r="3.4" />}
              {st === 'unknown' && <text className="pviz__pip-q" x={colX[ci]} y={r.y + 3.2} textAnchor="middle">?</text>}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { VizChannels, VizDocs, VizVisibility, MiniGlyph });
