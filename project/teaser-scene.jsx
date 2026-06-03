/* teaser-scene.jsx — the "A better way" flow for the better-way section.
   A left→right journey through six tax milestones (Intake → Filed). It begins
   wavy and scattered, with disconnected channels above and below, and
   gradually converges into a single calm thread — a "line of best fit." The
   scattered communications are drawn into that one coordinated thread.
   Fixed-viewBox SVG + CSS animation (scales to any width, honors the motion
   tweak, reduced-motion, and per-section in-view gating).
   Exports to window: OrchestrationScene. */

/* smooth path (Catmull-Rom → cubic bezier) through points */
function fsmooth(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function fquad(a, b, bend) {
  const cx = (a[0] + b[0]) / 2 + (bend || 0), cy = (a[1] + b[1]) / 2;
  return `M ${a[0]} ${a[1]} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0]} ${b[1]}`;
}

const OS_BASE_Y = 200;
/* milestones, with swing amplitude decaying left→right so the thread
   settles into a calm straight line by the time it reaches Filed */
const OS_MILES = [
  { x: 60, y: 200, label: 'Intake' },
  { x: 236, y: 96, label: 'Document collection' },
  { x: 412, y: 270, label: 'Review' },
  { x: 588, y: 166, label: 'Follow-up' },
  { x: 764, y: 212, label: 'Signature' },
  { x: 940, y: 200, label: 'Filed' },
];
const OS_THREAD_D = fsmooth(OS_MILES.map((m) => [m.x, m.y]));

/* scattered channels — only in the early, unsettled stretch — each merging
   into the thread. Past the midpoint there is nothing but the calm line. */
const OS_TOKENS = [
  { kind: 'email', x: 150, y: 46, to: [214, 120], dur: 5.4, dl: 0.0 },
  { kind: 'sms', x: 120, y: 320, to: [180, 176], dur: 6.0, dl: 1.1 },
  { kind: 'voice', x: 300, y: 40, to: [350, 150], dur: 5.6, dl: 0.5 },
  { kind: 'bell', x: 332, y: 332, to: [388, 234], dur: 6.4, dl: 1.9 },
  { kind: 'doc', x: 476, y: 50, to: [466, 240], dur: 5.2, dl: 0.8 },
  { kind: 'status', x: 520, y: 330, to: [540, 252], dur: 6.2, dl: 2.5 },
];

/* slightly larger scene glyphs (own set so the file is self-contained) */
function SceneGlyph({ kind }) {
  switch (kind) {
    case 'email': return (<g className="os-g"><rect x="-8" y="-6" width="16" height="12" rx="1.6" /><path d="M-8,-5 L0,1.6 L8,-5" /></g>);
    case 'sms': return (<g className="os-g"><rect x="-8" y="-6.5" width="16" height="12" rx="3" /><path d="M-4,5.5 v3.5 l3.4,-3.5" /><circle cx="-3.4" cy="-0.6" r="0.8" /><circle cx="0" cy="-0.6" r="0.8" /><circle cx="3.4" cy="-0.6" r="0.8" /></g>);
    case 'voice': return (<g className="os-g"><path d="M-6,-1.6 L-6,1.6 M-2.6,-5 L-2.6,5 M0.8,-3 L0.8,3 M4.2,-1.4 L4.2,1.4 M7,-2.4 L7,2.4" /></g>);
    case 'bell': return (<g className="os-g"><path d="M-4.2,2.4 a4.2,4.2 0 0 1 8.4,0 z" /><path d="M-5,2.4 H5" /><path d="M-1.2,4.2 a1.2,1.2 0 0 0 2.4,0" /></g>);
    case 'doc': return (<g className="os-g"><path d="M-5.5,-8 h8 l3.5,3.5 v12.5 h-11.5 z" /><path d="M2.5,-8 v3.5 h3.5" /><path d="M-3,-1 h6.5 M-3,2.4 h6.5 M-3,5.8 h4.5" /></g>);
    case 'status': return (<g className="os-g"><circle cx="0" cy="0" r="6.4" /><path d="M-3,0.2 l2.2,2.2 l4.2,-4.6" /></g>);
    default: return null;
  }
}

function OrchestrationScene() {
  const wavy = OS_THREAD_D;
  const straight = fsmooth(OS_MILES.map((m) => [m.x, OS_BASE_Y]));
  /* the path `d` morph (wavy → straight → wavy) must be injected because CSS
     keyframes can't read JS values; everything else rides shared timeline vars */
  const morphCss = `@keyframes os-morph {
    0%, 16% { d: path('${wavy}'); }
    34%, 64% { d: path('${straight}'); }
    84%, 100% { d: path('${wavy}'); }
  }`;
  return (
    <svg className="os-svg" viewBox="0 0 1000 380" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <style>{morphCss}</style>

      {/* scattered-channel connectors — fade out as the thread unifies */}
      {OS_TOKENS.map((tk, i) => (
        <path key={'m' + i} className="os-merge-base" d={fquad([tk.x, tk.y], tk.to, 0)} />
      ))}

      {/* the converging thread */}
      <path className="os-thread-base" d={wavy} />
      <path className="os-thread-flow" d={wavy} pathLength="100" />

      {/* milestone axis + ticks */}
      <line className="os-axis" x1="48" y1="330" x2="952" y2="330" />
      {OS_MILES.map((m, i) => (
        <g key={'d' + i}>
          <line className="os-drop" x1={m.x} y1="320" x2={m.x} y2="326" />
          <circle className={'os-tick' + (i === OS_MILES.length - 1 ? ' os-tick--filed' : '')} cx={m.x} cy="330" r="2.4" />
        </g>
      ))}

      {/* channel tokens — pulled into the thread on the snap */}
      {OS_TOKENS.map((tk, i) => (
        <g key={'t' + i} transform={`translate(${tk.x},${tk.y})`}>
          <g className="os-pull" style={{ '--tx': (tk.to[0] - tk.x) + 'px', '--ty': (tk.to[1] - tk.y) + 'px' }}>
            <g className="os-token" style={{ '--dl': tk.dl + 's' }}>
              <rect className="os-token-plate" x="-15" y="-12" width="30" height="24" rx="6.5" />
              <SceneGlyph kind={tk.kind} />
            </g>
          </g>
        </g>
      ))}

      {/* milestone nodes — settle onto the straight line, then release */}
      {OS_MILES.map((m, i) => {
        const filed = i === OS_MILES.length - 1;
        return (
          <g key={'n' + i} className={'os-node' + (filed ? ' os-node--filed' : '')} style={{ '--dy': (OS_BASE_Y - m.y) + 'px' }}>
            <circle className="os-node-ring" cx={m.x} cy={m.y} r={filed ? 12 : 6} style={{ '--dl': (i * 0.55) + 's' }} />
            {filed
              ? <path className="os-check" d={`M ${m.x - 5} ${m.y} l 3.6 3.8 l 7 -8`} />
              : <circle className="os-node-dot" cx={m.x} cy={m.y} r="2.6" />}
          </g>
        );
      })}

      {/* milestone labels along the axis */}
      {OS_MILES.map((m, i) => {
        const filed = i === OS_MILES.length - 1;
        return (
          <text key={'l' + i} className={'os-lab' + (filed ? ' os-lab--accent' : '')} x={m.x} y="351" textAnchor="middle">
            {m.label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

Object.assign(window, { OrchestrationScene });
