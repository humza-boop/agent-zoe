/* backgrounds.jsx — refined ambient orchestration systems for the Agent Zoe
   hero. The metaphor is preserved from the original — communication routing
   across a firm and its clients — but rendered as quiet, editorial line-work
   rather than neon spycraft. Each system is theme-aware (light | dark) and
   reads live tweak values (accent, speed) from a ref so colour/motion changes
   never force a restart. speed === 0 freezes the composition (the "Still"
   motion tweak).
   Exports to window: SignalLinesBg, OrchestrationBg, ConstellationBg, hexToRgb, mix. */

const { useRef, useEffect } = React;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t].map(Math.round); }
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function setupCanvas(canvas, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
const inkFor = (theme) => theme === 'dark' ? [237, 234, 226] : [35, 34, 32];

/* ============================================================
   A · SIGNAL LINES — three overlapping channel waveforms drawn
   as hairline strokes (email / voice / SMS). Soft "packets" of
   light ride each crest left→right, implying signals propagating
   across channels that operate together beneath the surface.
   Whisper-quiet on warm white; an editorial seismograph rather
   than a neon equaliser.
   ============================================================ */
function SignalLinesBg({ accent, accent2, speed, width, height, theme }) {
  const ref = useRef(null);
  const cfg = useRef({});
  cfg.current = { accent, accent2, speed, theme };

  useEffect(() => {
    const canvas = ref.current;
    const w = width, h = height;
    const ctx = setupCanvas(canvas, w, h);
    let raf;

    const lines = [
      { base: 0.50,  amp: 24, freq: 1.55, phase: 0.0, mixT: 0.0, a: 0.28, pkN: 1, pkSpd: 0.050 },
      { base: 0.565, amp: 36, freq: 1.10, phase: 1.4, mixT: 0.5, a: 0.34, pkN: 2, pkSpd: 0.072 },
      { base: 0.625, amp: 50, freq: 0.82, phase: 2.7, mixT: 1.0, a: 0.42, pkN: 2, pkSpd: 0.092 },
    ];
    lines.forEach(l => { l.packets = Array.from({ length: l.pkN }, (_, i) => ({ x: (i + 0.35) / l.pkN, w: 0.05 + Math.random() * 0.04 })); });

    const envAt = (px) => Math.max(0, Math.min(1, (px - 0.06) / 0.46)) * Math.exp(-Math.pow((px - 0.74) / 0.52, 2));
    const yAt = (l, px, t) => h * l.base + Math.sin(px * Math.PI * 2 * l.freq * 3 + l.phase + t * 0.9) * l.amp * envAt(px);

    let t0 = performance.now();
    function frame(now) {
      const { accent, accent2, speed, theme } = cfg.current;
      const t = (now - t0) / 1000 * speed;
      ctx.clearRect(0, 0, w, h);
      const ink = inkFor(theme), cA = hexToRgb(accent), cB = hexToRgb(accent2);
      const step = 6;

      const aBoost = theme === 'dark' ? 1 : 1.7;
      for (const l of lines) {
        const lineCol = mix(ink, mix(cB, cA, l.mixT), theme === 'dark' ? 0.85 : 0.55);
        if (speed > 0) for (const p of l.packets) { p.x += p.w * 0 + l.pkSpd * 0.016 * (speed * 2.4); if (p.x > 1.15) { p.x = -0.15; p.w = 0.05 + Math.random() * 0.04; } }

        ctx.beginPath();
        for (let i = 0; i <= w; i += step) {
          const px = i / w, y = yAt(l, px, t);
          if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
        }
        ctx.strokeStyle = rgba(lineCol, Math.min(l.a * aBoost, 0.85));
        ctx.lineWidth = 1.1;
        ctx.stroke();

        for (const p of l.packets) {
          if (p.x < 0 || p.x > 1) continue;
          const i = p.x * w, y = yAt(l, p.x, t), e = envAt(p.x);
          const aP = 0.62 * Math.min(1, e * 1.7);
          const g = ctx.createRadialGradient(i, y, 0, i, y, 18);
          g.addColorStop(0, rgba(cA, aP)); g.addColorStop(1, rgba(cA, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(i, y, 18, 0, 7); ctx.fill();
          ctx.fillStyle = rgba(cA, aP); ctx.beginPath(); ctx.arc(i, y, 2, 0, 7); ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  return <canvas ref={ref} className="bg-canvas" />;
}

/* ============================================================
   B · ORCHESTRATION — a calm left→right diagram. Inbound client
   channels converge on Agent Zoe; Zoe routes back out to the
   firm's systems. Hairline rails, a slow cadence of single pulses
   walking the full path, and nodes that warm briefly on arrival.
   Inbound legs read in the accent; the write-back leg reads in the
   secondary hue. Stations come from the hero so DOM labels register
   exactly on the canvas nodes.
   ============================================================ */
function OrchestrationBg({ accent, accent2, speed, width, height, theme, stations }) {
  const ref = useRef(null);
  const cfg = useRef({});
  cfg.current = { accent, accent2, speed, theme, stations };

  useEffect(() => {
    const canvas = ref.current;
    const w = width, h = height;
    const ctx = setupCanvas(canvas, w, h);
    let raf;
    const journeys = [];
    let lastSpawn = 0, seq = 0;

    function frame(now) {
      const { accent, accent2, speed, theme, stations } = cfg.current;
      const dt = Math.min((now - (frame._last || now)) / 16.67, 3); frame._last = now;
      ctx.clearRect(0, 0, w, h);
      const ink = inkFor(theme), cA = hexToRgb(accent), cB = hexToRgb(accent2);
      const { channels, hub, systems } = stations;
      const all = [...channels, ...systems, hub];

      all.forEach(s => { s.glow = Math.max(0, (s.glow || 0) - 0.012 * dt * Math.max(speed, 0.4)); });

      // static hairline rails
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(ink, theme === 'dark' ? 0.14 : 0.16);
      channels.forEach(c => { ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(hub.x, hub.y); ctx.stroke(); });
      systems.forEach(s => { ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(s.x, s.y); ctx.stroke(); });

      if (speed > 0 && now - lastSpawn > 1700 / speed && journeys.length < 3) {
        const c = channels[seq % channels.length];
        const s = systems[(seq * 2 + 1) % systems.length];
        journeys.push({ path: [c, hub, s], seg: 0, p: 0 });
        seq++; lastSpawn = now;
      }

      for (let k = journeys.length - 1; k >= 0; k--) {
        const j = journeys[k];
        j.p += 0.012 * dt * speed;
        const a = j.path[j.seg], b = j.path[j.seg + 1];
        const x = a.x + (b.x - a.x) * j.p, y = a.y + (b.y - a.y) * j.p;
        const col = j.seg >= 1 ? cB : cA;
        const g = ctx.createLinearGradient(a.x, a.y, x, y);
        g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, 0.55));
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = rgba(col, 0.9); ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
        if (j.seg === 0 && j.p < 0.05) a.glow = Math.max(a.glow || 0, 0.85);
        if (j.p >= 1) { b.glow = 1; j.seg++; j.p = 0; if (j.seg >= j.path.length - 1) journeys.splice(k, 1); }
      }

      const dot = (s, big) => {
        const g = s.glow || 0;
        if (g > 0.02) { ctx.fillStyle = rgba(cA, g * 0.12); ctx.beginPath(); ctx.arc(s.x, s.y, (big ? 11 : 6) + 9 * g, 0, 7); ctx.fill(); }
        ctx.fillStyle = rgba(big ? cA : ink, big ? Math.min(0.55 + g * 0.45, 1) : (theme === 'dark' ? 0.36 : 0.42) + g * 0.6);
        ctx.beginPath(); ctx.arc(s.x, s.y, big ? 3.2 : 2, 0, 7); ctx.fill();
        if (big) { ctx.strokeStyle = rgba(cA, 0.4); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, 7); ctx.stroke(); }
      };
      channels.forEach(c => dot(c, false));
      systems.forEach(s => dot(s, false));
      dot(hub, true);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  return <canvas ref={ref} className="bg-canvas" />;
}

/* ============================================================
   C · CONSTELLATION — a cinematic coordination field for the dark
   stage. A firm anchor quietly coordinates a sparse field of client
   endpoints; a slow sweep pings them as it passes, and occasional
   routed pulses resolve into soft rings. Far calmer and sparser than
   the original radar — warm-white points, accent routing, deep space.
   ============================================================ */
function ConstellationBg({ accent, accent2, speed, width, height, theme, stations }) {
  const ref = useRef(null);
  const cfg = useRef({});
  cfg.current = { accent, accent2, speed, theme, stations };

  useEffect(() => {
    const canvas = ref.current;
    const w = width, h = height;
    const ctx = setupCanvas(canvas, w, h);
    let raf;
    const rnd = (() => { let s = 7723; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();

    const anchor = { x: w * 0.30, y: h * 0.44 };
    const anchor2 = { x: w * 0.76, y: h * 0.30 };
    const R = Math.max(w, h) * 0.6;

    const N = 130;
    const pts = [];
    for (let i = 0; i < N; i++) {
      let x, y; const m = rnd();
      if (m < 0.5) { const a = rnd() * 7, d = 70 + rnd() * (R * 0.92); x = anchor.x + Math.cos(a) * d; y = anchor.y + Math.sin(a) * d; }
      else if (m < 0.8) { const a = rnd() * 7, d = 50 + rnd() * 250; x = anchor2.x + Math.cos(a) * d; y = anchor2.y + Math.sin(a) * d; }
      else { x = rnd() * w; y = rnd() * h; }
      const ang = Math.atan2(y - anchor.y, x - anchor.x);
      const dist = Math.hypot(x - anchor.x, y - anchor.y);
      pts.push({ x, y, ang: (ang + Math.PI * 2) % (Math.PI * 2), dist, ping: 0, resolved: 0, tw: rnd() * 7 });
    }
    const edges = [];
    for (let i = 0; i < N; i++) {
      let best = -1, bestD = 78;
      for (let j = 0; j < N; j++) { if (i === j) continue; const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < bestD) { bestD = d; best = j; } }
      if (best >= 0 && best > i) edges.push([i, best]);
    }

    const pulses = [];
    let lastSpawn = 0, sweep = 0;
    function pickTarget() {
      const st = cfg.current.stations || [];
      if (st.length && Math.random() < 0.55) return st[Math.floor(Math.random() * st.length)];
      const right = pts.filter(p => p.x > anchor.x - 40);
      const pool = right.length ? right : pts;
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const spawn = (from, depth) => pulses.push({ ax: from.x, ay: from.y, tgt: pickTarget(), p: 0, depth });

    let t0 = performance.now();
    function frame(now) {
      const { accent, accent2, speed, theme } = cfg.current;
      const dt = Math.min((now - (frame._last || now)) / 16.67, 3); frame._last = now;
      const t = (now - t0) / 1000 * speed;
      ctx.clearRect(0, 0, w, h);
      const ink = inkFor(theme), cA = hexToRgb(accent), cB = hexToRgb(accent2);

      ctx.strokeStyle = rgba(ink, 0.035); ctx.lineWidth = 1;
      for (let rr = 1; rr <= 4; rr++) { ctx.beginPath(); ctx.arc(anchor.x, anchor.y, (R / 4.2) * rr, 0, 7); ctx.stroke(); }

      ctx.strokeStyle = rgba(ink, 0.06); ctx.beginPath();
      for (const [i, j] of edges) { ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); }
      ctx.stroke();

      sweep += 0.0048 * dt * speed;
      const sa = sweep % (Math.PI * 2);
      const segs = 20, span = 0.55;
      for (let s = 0; s < segs; s++) {
        const a0 = sa - (s / segs) * span, a1 = sa - ((s + 1) / segs) * span;
        ctx.fillStyle = rgba(cA, 0.03 * (1 - s / segs));
        ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.arc(anchor.x, anchor.y, R, a0, a1, true); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = rgba(cA, 0.12); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(anchor.x + Math.cos(sa) * R, anchor.y + Math.sin(sa) * R); ctx.stroke();

      for (const p of pts) {
        let dAng = Math.abs(((p.ang - sa + Math.PI * 3) % (Math.PI * 2)) - Math.PI); dAng = Math.PI - dAng;
        if (dAng < 0.03 && p.dist < R && p.ping <= 0.02) p.ping = 1;
        p.ping = Math.max(0, p.ping - 0.012 * dt); p.resolved = Math.max(0, p.resolved - 0.009 * dt);
        const tw = 0.17 + 0.07 * Math.sin(t * 1.1 + p.tw);
        const lvl = Math.min(tw + p.ping * 0.7 + p.resolved * 0.5, 1);
        if (p.ping > 0.02) { ctx.strokeStyle = rgba(cA, p.ping * 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 2 + 9 * (1 - p.ping), 0, 7); ctx.stroke(); }
        if (p.resolved > 0.02) { ctx.strokeStyle = rgba(cA, p.resolved * 0.45); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.stroke(); }
        ctx.fillStyle = rgba(ink, lvl); ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, 7); ctx.fill();
      }

      if (speed > 0 && now - lastSpawn > 1100 / speed && pulses.length < 6) { spawn(Math.random() < 0.7 ? anchor : anchor2, 0); lastSpawn = now; }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pu = pulses[k]; pu.p += 0.018 * dt * speed;
        const x = pu.ax + (pu.tgt.x - pu.ax) * pu.p, y = pu.ay + (pu.tgt.y - pu.ay) * pu.p;
        ctx.strokeStyle = rgba(cA, 0.18); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pu.ax, pu.ay); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = rgba(cA, 0.9); ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill();
        if (pu.p >= 1) {
          pulses.splice(k, 1); pu.tgt.resolved = 1; pu.tgt.ping = Math.max(pu.tgt.ping, 0.6);
          if (pu.tgt.isStation) pu.tgt.glow = 1;
          if (pu.depth < 1 && pulses.length < 6 && Math.random() < 0.35) spawn(pu.tgt, pu.depth + 1);
        }
      }

      const st = cfg.current.stations || [];
      for (const s of st) {
        s.glow = Math.max(0, (s.glow || 0) - 0.012 * dt * Math.max(speed, 0.4));
        if (s.glow > 0.02) { ctx.fillStyle = rgba(cA, s.glow * 0.13); ctx.beginPath(); ctx.arc(s.x, s.y, 6 + 11 * s.glow, 0, 7); ctx.fill(); }
        ctx.fillStyle = rgba(cA, 0.42 + s.glow * 0.58); ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, 7); ctx.fill();
      }

      for (const an of [anchor, anchor2]) {
        const main = an === anchor;
        ctx.fillStyle = rgba(cA, 0.07); ctx.beginPath(); ctx.arc(an.x, an.y, main ? 13 : 9, 0, 7); ctx.fill();
        ctx.fillStyle = rgba(cA, 0.9); ctx.beginPath(); ctx.arc(an.x, an.y, main ? 3 : 2.2, 0, 7); ctx.fill();
        ctx.strokeStyle = rgba(cA, 0.36); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(an.x, an.y, main ? 6.5 : 5, 0, 7); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  return <canvas ref={ref} className="bg-canvas" />;
}

Object.assign(window, { SignalLinesBg, OrchestrationBg, ConstellationBg, hexToRgb, mix });
