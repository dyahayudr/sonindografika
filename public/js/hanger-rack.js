/* Hero visual: rak gantung 7 pakaian dalam plastik PP hanger bersablon.
   - Pakaian berayun seperti bandul dan saling bertabrakan (efek domino)
   - Tarik pakaian untuk mengayun, ketuk untuk melepas/memasang plastiknya
   - Gerakan mouse cepat melintasi rak "menyibak" pakaian
   Markup statis (rak, defs, hotspot) ada di views/partials/hanger-rack.ejs */
(function () {
  'use strict';
  var root = document.querySelector('[data-rack]');
  if (!root) return;

  var NS = 'http://www.w3.org/2000/svg';
  var svg = root.querySelector('svg');
  var layer = svg.querySelector('[data-garments]');
  var phone = root.dataset.phone || '';
  var RAIL_Y = 50;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Garment shapes (local coords: pivot = rail point at 0,0) ----------
  var HOOK = 'M0 26 V18 C0 12 7 10 7 3 A7 7 0 1 0 -7 3';
  var HANGER_TOP = 'M0 26 L-40 49 Q-45 54 -38 54 H38 Q45 54 40 49 Z';
  var HANGER_PANTS = 'M0 26 L-36 42 H36 Z';

  var SHAPES = {
    kaos: {
      hanger: HANGER_TOP, bottom: 200, w: 52,
      body: 'M-14 32 Q0 46 14 32 L38 42 Q44 45 46 52 L56 80 L38 88 L32 74 V194 Q32 200 26 200 H-26 Q-32 200 -32 194 V74 L-38 88 L-56 80 L-46 52 Q-44 45 -38 42 Z',
      detail: '<path d="M-14 32 Q0 50 14 32" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="3"/>'
    },
    kemeja: {
      hanger: HANGER_TOP, bottom: 210, w: 52,
      body: 'M-12 32 L0 46 L12 32 L36 41 Q44 45 46 55 L54 176 L41 178 L33 82 V204 Q33 210 27 210 H-27 Q-33 210 -33 204 V82 L-41 178 L-54 176 L-46 55 Q-44 45 -36 41 Z',
      detail: '<path d="M-12 32 L0 50 L-4 56 L-16 40 Z M12 32 L0 50 L4 56 L16 40 Z" fill="#fff" fill-opacity=".9"/><path d="M0 52 V206" stroke="rgba(0,0,0,.28)" stroke-width="1.5"/><g fill="#fff" fill-opacity=".8"><circle cx="3" cy="74" r="1.8"/><circle cx="3" cy="104" r="1.8"/><circle cx="3" cy="134" r="1.8"/><circle cx="3" cy="164" r="1.8"/></g>'
    },
    gaun: {
      hanger: HANGER_TOP, bottom: 262, w: 58,
      body: 'M-18 36 L-21 54 Q-28 76 -24 104 L-56 254 Q0 268 56 254 L24 104 Q28 76 21 54 L18 36 Q0 52 -18 36 Z',
      detail: '<path d="M-24 104 Q0 112 24 104" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4"/><path d="M-10 112 L-22 250 M10 112 L22 250 M0 114 V258" stroke="rgba(0,0,0,.18)" stroke-width="3" fill="none"/>'
    },
    gaunPanjang: {
      hanger: HANGER_TOP, bottom: 300, w: 54,
      body: 'M-16 34 L-34 44 Q-40 48 -40 56 L-44 92 L-32 96 L-26 78 Q-28 100 -24 118 L-50 292 Q0 306 50 292 L24 118 Q28 100 26 78 L32 96 L44 92 L40 56 Q40 48 34 44 L16 34 Q0 50 -16 34 Z',
      detail: '<path d="M-24 118 Q0 126 24 118" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="3"/><path d="M-8 126 L-18 290 M8 126 L18 290" stroke="#fff" stroke-opacity=".1" stroke-width="4" fill="none"/>'
    },
    jaket: {
      hanger: HANGER_TOP, bottom: 196, w: 56,
      body: 'M-14 30 Q-20 22 -10 18 Q0 30 10 18 Q20 22 14 30 L38 40 Q48 44 50 56 L58 168 L44 170 L36 80 V190 Q36 196 30 196 H-30 Q-36 196 -36 190 V80 L-44 170 L-58 168 L-50 56 Q-48 44 -38 40 Z',
      detail: '<path d="M0 30 V196" stroke="#e6e0f2" stroke-width="2" stroke-dasharray="2 2"/><rect x="-28" y="132" width="16" height="20" rx="3" fill="none" stroke="rgba(0,0,0,.3)"/><rect x="12" y="132" width="16" height="20" rx="3" fill="none" stroke="rgba(0,0,0,.3)"/><path d="M-36 186 H36" stroke="rgba(0,0,0,.3)" stroke-width="4"/>'
    },
    celana: {
      hanger: HANGER_PANTS, bottom: 240, w: 44, pants: true,
      body: 'M-31 44 H31 L37 236 Q37 240 33 240 H10 Q6 240 6 236 L1 96 H-1 L-6 236 Q-6 240 -10 240 H-33 Q-37 240 -37 236 Z',
      detail: '<rect x="-31" y="44" width="62" height="9" fill="rgba(0,0,0,.28)"/><path d="M0 53 V92" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/><path d="M-20 60 L-20 236 M20 60 L20 236" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>'
    }
  };

  // 7 garments along the rail
  var ITEMS = [
    { type: 'kaos', color: '#7b5cff' },
    { type: 'gaun', color: '#e06bd8' },
    { type: 'celana', color: '#2f3a8f' },
    { type: 'kemeja', color: '#7fd3ff' },
    { type: 'gaunPanjang', color: '#ff8a5b' },
    { type: 'jaket', color: '#3ccfb4' },
    { type: 'celana', color: '#f1e3c8' }
  ];
  var X0 = 86, GAP = 61.3;
  var INK = '#5b2fd6';

  function el(tag, attrs, html) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html) n.innerHTML = html;
    return n;
  }

  var printLayer = [];
  var state = ITEMS.map(function (it, i) {
    var s = SHAPES[it.type];
    var x = X0 + i * GAP;
    var bagH = s.bottom + 12, W = s.w, top = s.pants ? 40 : 44;
    var bagPath = 'M0 16 L' + -W + ' ' + top + ' V' + (bagH - 6) + ' Q' + -W + ' ' + bagH + ' ' + (-W + 6) + ' ' + bagH +
      ' H' + (W - 6) + ' Q' + W + ' ' + bagH + ' ' + W + ' ' + (bagH - 6) + ' V' + top + ' Z';
    var delay = 'transition-delay:' + (i * 0.09).toFixed(2) + 's';

    var outer = el('g', { transform: 'translate(' + x + ' ' + RAIL_Y + ')' });
    var g = el('g', { class: 'garment', 'data-i': i },
      '<path d="' + s.hanger + '" fill="none" stroke="url(#metal)" stroke-width="3.2" stroke-linejoin="round"/>' +
      (s.pants ? '<rect x="-30" y="39" width="6" height="10" rx="1.5" fill="url(#metal)"/><rect x="24" y="39" width="6" height="10" rx="1.5" fill="url(#metal)"/>' : '') +
      '<path d="' + s.body + '" fill="' + it.color + '"/>' +
      '<path d="' + s.body + '" fill="url(#shade)"/>' + s.detail +
      '<clipPath id="rackClip' + i + '"><path d="' + bagPath + '"/></clipPath>' +
      '<g class="bag" style="' + delay + '">' +
        '<path d="' + bagPath + '" fill="url(#bagFill)" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>' +
        '<g stroke="#fff" fill="none" stroke-linecap="round" stroke-opacity=".22" stroke-width="1.4">' +
          '<path d="M' + (-W + 6) + ' 70 Q' + (-W + 10) + ' ' + bagH * 0.55 + ' ' + (-W + 5) + ' ' + (bagH - 14) + '"/>' +
          '<path d="M' + (W - 6) + ' 80 Q' + (W - 12) + ' ' + bagH * 0.6 + ' ' + (W - 5) + ' ' + (bagH - 14) + '"/>' +
        '</g>' +
        '<ellipse cx="0" cy="22" rx="5" ry="3" fill="#0a0611" fill-opacity=".55" stroke="#fff" stroke-opacity=".6"/>' +
        '<path d="M' + (-W + 4) + ' ' + (bagH - 7) + ' H' + (W - 4) + '" stroke="#fff" stroke-opacity=".45" stroke-dasharray="3 3"/>' +
        '<g clip-path="url(#rackClip' + i + ')"><rect class="sheen" x="-70" y="0" width="46" height="' + (bagH + 10) + '" fill="url(#sheenGrad)"/></g>' +
      '</g>' +
      '<path d="' + HOOK + '" fill="none" stroke="url(#metal)" stroke-width="3.2" stroke-linecap="round"/>');
    outer.appendChild(g);
    layer.appendChild(outer);

    // One-colour screen print on the plastic. Drawn on a top layer so a neighbouring
    // garment never covers it, but rotated together with its own garment.
    var printOuter = el('g', { transform: 'translate(' + x + ' ' + RAIL_Y + ')' });
    var lg = el('g', { class: 'garment', 'data-i': i },
      '<g class="bag" style="' + delay + '">' +
        '<g transform="translate(0 ' + Math.round(bagH * 0.5) + ')" color="' + INK + '" fill="currentColor">' +
          '<circle cy="-18" r="17" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
          '<path d="M-6 -36 Q-6 -40 -2 -40 Q2 -40 2 -37" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
          '<use href="#logoInk" x="-11" y="-29" width="22" height="22"/>' +
          '<g font-family="Plus Jakarta Sans, sans-serif" font-weight="800" text-anchor="middle">' +
            '<text y="11" font-size="10.5" textLength="48" lengthAdjust="spacingAndGlyphs">SONINDO</text>' +
            '<text y="22" font-size="10.5" textLength="48" lengthAdjust="spacingAndGlyphs">GRAFIKA</text>' +
            (phone ? '<circle cx="-20" cy="28.6" r="2.4"/><text x="3" y="30.6" font-size="5.4" font-weight="700" textLength="40" lengthAdjust="spacingAndGlyphs"></text>' : '') +
            '<text y="37" font-size="3.6" font-weight="600" textLength="46" lengthAdjust="spacingAndGlyphs">PLASTIK HD &amp; PP · JABODETABEK</text>' +
          '</g>' +
        '</g>' +
      '</g>');
    if (phone) lg.querySelector('text[x="3"]').textContent = phone;  // set as text, never as markup
    printOuter.appendChild(lg);
    printLayer.push(printOuter);
    return { g: g, lg: lg, x: x, len: s.bottom, a: 0, v: 0 };
  });
  printLayer.forEach(function (n) { layer.appendChild(n); });
  layer.appendChild(el('path', { d: 'M88 47.5 H452', stroke: '#fff8e6', 'stroke-opacity': '.55', 'stroke-width': 1.6 }));

  // ---------- Physics: pendulums that bump into each other ----------
  var K = 0.016, DAMP = 0.972, MAX = 40, CONTACT = 6; // CONTACT = min angle gap (deg) before neighbours collide
  var drag = null, running = false, rafId = 0;

  function step() {
    var t = performance.now();
    state.forEach(function (s, i) {
      if (drag && drag.i === i) return;
      s.v += -K * s.a;
      s.v *= DAMP;
      if (!reduce) s.v += Math.sin(t / 1300 + i * 1.7) * 0.004; // idle breeze
      s.a += s.v;
    });
    // SVG rotate(+) swings the hem to the LEFT, so A (left) hits B (right) when B.a - A.a grows
    for (var i = 0; i < state.length - 1; i++) {
      var A = state[i], B = state[i + 1];
      var overlap = (B.a - A.a) - CONTACT;
      if (overlap > 0) {
        var dv = (B.v - A.v) * 0.95; // near-elastic: momentum travels down the rack like a Newton's cradle
        if (dv > 0) { A.v += dv; B.v -= dv; }
        if (!(drag && drag.i === i)) A.a += overlap / 2;
        if (!(drag && drag.i === i + 1)) B.a -= overlap / 2;
      }
    }
    state.forEach(function (s) {
      s.a = Math.max(-MAX, Math.min(MAX, s.a));
      var r = 'rotate(' + s.a.toFixed(2) + ')';
      s.g.setAttribute('transform', r);
      s.lg.setAttribute('transform', r);
    });
    rafId = running ? requestAnimationFrame(step) : 0;
  }
  function start() { if (!running) { running = true; rafId = requestAnimationFrame(step); } }
  function stop() { running = false; cancelAnimationFrame(rafId); }

  // Start right away (the rack is in the hero), then pause whenever it scrolls off screen
  start();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }).observe(root);
  }

  function toSvg(e) {
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  // Drag a garment to swing it
  svg.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('.garment'); if (!g) return;
    drag = { i: +g.dataset.i, moved: false };
    svg.setPointerCapture(e.pointerId);
    root.classList.add('is-dragging', 'touched');
  });
  svg.addEventListener('pointermove', function (e) {
    var p = toSvg(e);
    if (drag) {
      var s = state[drag.i];
      var target = Math.max(-MAX, Math.min(MAX, -Math.atan2(p.x - s.x, p.y - RAIL_Y) * 180 / Math.PI));
      s.v = target - s.a; s.a = target;
      if (Math.abs(s.v) > 0.3) drag.moved = true;
      return;
    }
    // "Run a hand through the rack": the garment under the mouse gets brushed
    if (e.pointerType === 'mouse' && e.movementX) {
      state.forEach(function (s) {
        var dx = Math.abs(p.x - s.x + Math.sin(s.a * Math.PI / 180) * (p.y - RAIL_Y));
        if (dx < 30 && p.y > RAIL_Y + 20 && p.y < RAIL_Y + s.len) s.v -= Math.max(-0.6, Math.min(0.6, e.movementX * 0.06));
      });
    }
  });
  function end() {
    if (!drag) return;
    var s = state[drag.i];
    if (!drag.moved) { // tap = take off / put on this garment's plastic
      var off = s.g.classList.toggle('off');
      s.lg.classList.toggle('off', off);
    }
    s.v = Math.max(-5, Math.min(5, s.v));
    drag = null;
    root.classList.remove('is-dragging');
  }
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  // ---------- Intro: swing the first garment into the rest, then drop the plastic over all ----------
  function bagAll() {
    root.classList.add('bag-on');
    state.forEach(function (s, i) { setTimeout(function () { s.v += 0.9; }, i * 90 + 500); });
  }
  if (reduce) {
    root.classList.add('bag-on');
  } else {
    setTimeout(function () { state[0].a = MAX * 0.85; state[0].v = -2.5; }, 200);
    setTimeout(bagAll, 600);
  }
})();
