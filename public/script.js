
const DFAS = {
  dfa1: {
    label: "DFA 1: aba/bab",
    regex: "(aba+bab)(a+b)*(bab)(a+b)*(a+b+ab+ba)(a+b)*",
    alphabet: ["a","b"],
    states: ["q0","q1","q2","q3","q4","q5","q6","q7","q8","q9","T"],
    start: "q0", accepts: new Set(["q9"]),
    placeholder: "e.g. abababa",
    examples: [
      {s:"abababa", ok:true}, {s:"ababbabba", ok:true}, {s:"babbabab", ok:true},
      {s:"ababab", ok:false}, {s:"abab", ok:false}, {s:"aaa", ok:false},
    ],
    delta: {
      q0:{a:"q1",b:"q2"}, q1:{a:"T", b:"q3"}, q2:{a:"q4",b:"T"},
      q3:{a:"q5",b:"T"},  q4:{a:"T", b:"q5"}, q5:{a:"q5",b:"q6"},
      q6:{a:"q7",b:"q6"}, q7:{a:"q5",b:"q8"}, q8:{a:"q9",b:"q9"},
      q9:{a:"q9",b:"q9"}, T:{a:"T", b:"T"},
    },
    positions: {
      q0:{x:80,y:120},  q1:{x:220,y:60},  q2:{x:220,y:180},
      q3:{x:360,y:60},  q4:{x:360,y:180}, q5:{x:520,y:320},
      q6:{x:660,y:320}, q7:{x:800,y:320}, q8:{x:940,y:320},
      q9:{x:1040,y:200}, T:{x:80,y:380},
    },
    viewBox: "0 0 1100 460",
    grammar: {
      start: "S",
      rules: {
        S: [["a","b","a","X"], ["b","a","b","X"]],
        X: [["b","a","b","Y"], ["a","X"], ["b","X"]],
        Y: [["a","Z"], ["b","Z"]],
        Z: [["a","a","Z"], ["a","Z"], ["b","Z"], []],
      },
      display: [
        { lhs: "S", rhs: ["abaX", "babX"] },
        { lhs: "X", rhs: ["aX", "bX", "babY"] },
        { lhs: "Y", rhs: ["aZ", "bZ"] },
        { lhs: "Z", rhs: ["aZ", "bZ", "aaZ", "ε"] },
      ],
      note: "ε denotes the empty string. Capital letters are non-terminals; lowercase are terminals.",
    },
    pda: {
      states: ["q0","q1","q2","q3","q4","q5","q6","q7","q8","q9","T"],
      start: "q0", startStack: "Δ", accepts: new Set(["q9"]),
      acceptMode: "finalState",
      stackAlphabet: ["Δ","a","b"],
      delta: {
        "q0|a|Δ":{next:"q1",op:"push"}, "q0|b|Δ":{next:"q2",op:"push"},
        "q1|a|*":{next:"T", op:"none"}, "q1|b|*":{next:"q3",op:"push"},
        "q2|a|*":{next:"q4",op:"push"}, "q2|b|*":{next:"T", op:"none"},
        "q3|a|*":{next:"q5",op:"push"}, "q3|b|*":{next:"T", op:"none"},
        "q4|a|*":{next:"T", op:"none"}, "q4|b|*":{next:"q5",op:"push"},
        "q5|a|*":{next:"q5",op:"none"}, "q5|b|*":{next:"q6",op:"none"},
        "q6|a|*":{next:"q7",op:"none"}, "q6|b|*":{next:"q6",op:"none"},
        "q7|a|*":{next:"q5",op:"none"}, "q7|b|*":{next:"q8",op:"push"},
        "q8|a|*":{next:"q9",op:"pop"},  "q8|b|*":{next:"q9",op:"pop"},
        "q9|a|*":{next:"q9",op:"none"}, "q9|b|*":{next:"q9",op:"none"},
        "T|a|*":{next:"T",op:"none"}, "T|b|*":{next:"T",op:"none"},
        "T|a|Δ":{next:"T",op:"none"}, "T|b|Δ":{next:"T",op:"none"},
      },
      legend: "Stack vocabulary: <b>Δ</b> = bottom marker. PUSH stores the symbol read while consuming the mandatory prefix; POP fires when the second 'bab' is confirmed (the required next character). Acceptance is by final state (q9)."
    },
  },
  dfa2: {
    label: "DFA 2: 101/111 binary",
    regex: "((101+111+101)+(1+0+11))(1+0+01)*(111+000+101)(1+0)*",
    alphabet: ["0","1"],
    states: ["q1","q2","q3","q4","q5","q6","q7","q8"],
    start: "q1", accepts: new Set(["q8"]),
    placeholder: "e.g. 0110101",
    examples: [
      {s:"0000", ok:true}, {s:"1101", ok:true}, {s:"0110101", ok:true},
      {s:"1111", ok:true}, {s:"010", ok:false}, {s:"11", ok:false},
    ],
    delta: {
      q1:{"0":"q2","1":"q2"}, q2:{"0":"q4","1":"q3"},
      q3:{"0":"q7","1":"q5"}, q4:{"0":"q6","1":"q3"},
      q5:{"0":"q7","1":"q8"}, q6:{"0":"q8","1":"q3"},
      q7:{"0":"q6","1":"q8"}, q8:{"0":"q8","1":"q8"},
    },
    positions: {
      q1:{x:80,y:240}, q2:{x:240,y:240},
      q3:{x:430,y:240}, q4:{x:430,y:380},
      q5:{x:600,y:100}, q6:{x:600,y:380},
      q7:{x:600,y:240}, q8:{x:780,y:240},
    },
    viewBox: "0 0 880 480",
    grammar: {
      start: "S",
      rules: {
        S: [["1","X"], ["0","X"]],
        X: [["1","1","1","Y"], ["0","0","0","Y"], ["1","0","1","Y"], ["1","X"], ["0","X"]],
        Y: [["1","Y"], ["0","Y"], []],
      },
      display: [
        { lhs: "S", rhs: ["1X", "0X"] },
        { lhs: "X", rhs: ["1X", "0X", "111Y", "000Y", "101Y"] },
        { lhs: "Y", rhs: ["1Y", "0Y", "ε"] },
      ],
      note: "ε denotes the empty string. Note: Y → 0Y is adjusted from the original Y → 0X so the grammar derives every string the regex accepts.",
    },
    pda: {
      states: ["q1","q2","q3","q4","q5","q6","q7","q8","T"],
      start: "q1", startStack: "Δ", accepts: new Set(["q8"]),
      acceptMode: "finalState",
      stackAlphabet: ["Δ","0","1"],
      delta: {
        "q1|0|Δ":{next:"q2",op:"push"}, "q1|1|Δ":{next:"q2",op:"push"},
        "q2|0|*":{next:"q4",op:"none"}, "q2|1|*":{next:"q3",op:"none"},
        "q3|0|*":{next:"q7",op:"push"}, "q3|1|*":{next:"q5",op:"push"},
        "q4|0|*":{next:"q6",op:"push"}, "q4|1|*":{next:"q3",op:"none"},
        "q5|0|*":{next:"q7",op:"none"}, "q5|1|*":{next:"q8",op:"pop"},
        "q6|0|*":{next:"q8",op:"pop"},  "q6|1|*":{next:"q3",op:"pop"},
        "q7|0|*":{next:"q6",op:"none"}, "q7|1|*":{next:"q8",op:"pop"},
        "q8|0|*":{next:"q8",op:"none"}, "q8|1|*":{next:"q8",op:"none"},
        "T|0|*":{next:"T",op:"none"}, "T|1|*":{next:"T",op:"none"},
        "T|0|Δ":{next:"T",op:"none"}, "T|1|Δ":{next:"T",op:"none"},
      },
      legend: "Stack vocabulary: <b>Δ</b> = bottom marker. PUSH stores the symbol read while scanning toward a 111/000/101 pattern; POP fires when a triple completes or a partial breaks. Acceptance is by final state (q8)."
    },
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("diagram");
const inputRowsEl = document.getElementById("input-rows");
const resultsWrap = document.getElementById("results-wrap");
const resultsBody = document.getElementById("results-body");
const tapeEl = document.getElementById("tape");
const statusEl = document.getElementById("status");
const regexEl = document.getElementById("regex");
const alphabetEl = document.getElementById("alphabet");
const switchBtn = document.getElementById("switch");
const examplesEl = document.getElementById("examples");

// active input value used by CFG/PDA modals (the last-focused or first row)
let activeInputValue = "";

let currentKey = "dfa1";
let DFA = DFAS[currentKey];
let sim = null;
const R = 26;
let nodeEls = {}, edgeMap = new Map();

function el(name, attrs = {}, parent = svg) {
  const n = document.createElementNS(SVG_NS, name);
  for (const [k,v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent.appendChild(n);
  return n;
}
function pointOnCircle(cx,cy,tx,ty,r) {
  const dx=tx-cx, dy=ty-cy, d=Math.hypot(dx,dy)||1;
  return {x:cx+dx/d*r, y:cy+dy/d*r};
}

function drawDiagram(targetSvg, cfg, options = {}) {
  while (targetSvg.firstChild) targetSvg.removeChild(targetSvg.firstChild);
  targetSvg.setAttribute("viewBox", cfg.viewBox);
  const localNodes = {}, localEdges = new Map();

  const defs = document.createElementNS(SVG_NS, "defs");
  targetSvg.appendChild(defs);
  for (const [id, color] of [["arr-"+options.id,"#2a342d"],["arrA-"+options.id,"#d4ff3a"]]) {
    const m = document.createElementNS(SVG_NS, "marker");
    Object.entries({id, viewBox:"0 0 10 10", refX:9, refY:5, markerWidth:7, markerHeight:7, orient:"auto-start-reverse"}).forEach(([k,v])=>m.setAttribute(k,v));
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d","M0,0 L10,5 L0,10 z"); p.setAttribute("fill", color);
    m.appendChild(p); defs.appendChild(m);
  }

  const groups = new Map();
  const symbolsList = options.pda
    ? cfg.alphabet.flatMap(sym => cfg.pda.stackAlphabet.map(top => ({sym, top})))
    : cfg.alphabet.map(sym => ({sym, top: null}));

  if (options.pda) {
    // Build edges from PDA delta
    for (const key of Object.keys(cfg.pda.delta)) {
      const [from, sym, top] = key.split("|");
      const t = cfg.pda.delta[key];
      const lbl = `${sym},${top}/${t.push.length === 0 ? "ε" : t.push.join("")}`;
      const k = `${from}->${t.next}`;
      if (!groups.has(k)) groups.set(k, {from, to: t.next, labels: []});
      groups.get(k).labels.push(lbl);
    }
  } else {
    for (const s of cfg.states) for (const sym of cfg.alphabet) {
      const t = cfg.delta[s][sym];
      const k = `${s}->${t}`;
      if (!groups.has(k)) groups.set(k, {from:s, to:t, labels:[]});
      groups.get(k).labels.push(sym);
    }
  }
  const reverseSet = new Set([...groups.values()].map(e => `${e.to}->${e.from}`));

  for (const e of groups.values()) {
    const a = cfg.positions[e.from], b = cfg.positions[e.to];
    let path, label;
    if (e.from === e.to) {
      const cx=a.x, cy=a.y - R - 18;
      const d = `M ${a.x-8},${a.y-R+2} C ${cx-30},${cy-5} ${cx+30},${cy-5} ${a.x+8},${a.y-R+2}`;
      path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d); path.setAttribute("class","edge");
      path.setAttribute("marker-end", `url(#arr-${options.id})`);
      targetSvg.appendChild(path);
      label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", cx); label.setAttribute("y", cy-12);
      label.setAttribute("class", "edge-label" + (options.pda ? " pda-edge-label" : ""));
    } else {
      const p1 = pointOnCircle(a.x,a.y,b.x,b.y,R);
      const p2 = pointOnCircle(b.x,b.y,a.x,a.y,R);
      const reverse = reverseSet.has(`${e.from}->${e.to}`);
      path = document.createElementNS(SVG_NS, "path");
      if (reverse) {
        const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
        const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1;
        const nx=-dy/len, ny=dx/len, off=22;
        const cx=mx+nx*off, cy=my+ny*off;
        path.setAttribute("d", `M ${p1.x},${p1.y} Q ${cx},${cy} ${p2.x},${p2.y}`);
        label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("x", cx+nx*8); label.setAttribute("y", cy+ny*8);
        label.setAttribute("class","edge-label" + (options.pda ? " pda-edge-label" : ""));
      } else {
        path.setAttribute("d", `M ${p1.x},${p1.y} L ${p2.x},${p2.y}`);
        const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
        const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1;
        label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("x", mx-dy/len*12); label.setAttribute("y", my+dx/len*12);
        label.setAttribute("class","edge-label" + (options.pda ? " pda-edge-label" : ""));
      }
      path.setAttribute("class","edge");
      path.setAttribute("marker-end", `url(#arr-${options.id})`);
      targetSvg.appendChild(path);
    }
    label.textContent = e.labels.join(options.pda ? "  " : ",");
    targetSvg.appendChild(label);
    localEdges.set(`${e.from}->${e.to}`, {path, label});
  }

  const sp = cfg.positions[cfg.start];
  const startPath = document.createElementNS(SVG_NS, "path");
  startPath.setAttribute("d", `M ${sp.x-R-28},${sp.y} L ${sp.x-R-2},${sp.y}`);
  startPath.setAttribute("class","edge");
  startPath.setAttribute("marker-end", `url(#arr-${options.id})`);
  targetSvg.appendChild(startPath);
  const startLbl = document.createElementNS(SVG_NS, "text");
  startLbl.setAttribute("x", sp.x-R-32); startLbl.setAttribute("y", sp.y-6);
  startLbl.setAttribute("class","edge-label"); startLbl.setAttribute("text-anchor","end");
  startLbl.textContent = "start";
  targetSvg.appendChild(startLbl);

  const acceptSet = options.pda ? cfg.pda.accepts : cfg.accepts;
  for (const s of cfg.states) {
    const {x,y} = cfg.positions[s];
    const cls = [
      s === cfg.start ? "start" : "",
      acceptSet.has(s) ? "accept" : "",
      s === "T" ? "trap" : "",
    ].filter(Boolean).join(" ");
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", `node ${cls}`);
    if (acceptSet.has(s)) {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx",x); c.setAttribute("cy",y); c.setAttribute("r",R+4); c.setAttribute("class","outer");
      g.appendChild(c);
    }
    const c2 = document.createElementNS(SVG_NS, "circle");
    c2.setAttribute("cx",x); c2.setAttribute("cy",y); c2.setAttribute("r",R);
    g.appendChild(c2);
    const t = document.createElementNS(SVG_NS, "text");
    t.setAttribute("x",x); t.setAttribute("y",y);
    t.textContent = s;
    g.appendChild(t);
    targetSvg.appendChild(g);
    localNodes[s] = g;
  }
  return { nodes: localNodes, edges: localEdges };
}

function renderDiagram() {
  const r = drawDiagram(svg, DFA, {id: "dfa"});
  nodeEls = r.nodes; edgeMap = r.edges;
}

function runDFA(input) {
  const trace = [];
  let cur = DFA.start;
  for (let i = 0; i < input.length; i++) {
    const sym = input[i];
    const nxt = DFA.delta[cur][sym];
    trace.push({i, from: cur, sym, to: nxt});
    cur = nxt;
  }
  return {final: cur, accepted: DFA.accepts.has(cur), trace};
}

function highlightState(s) {
  for (const k in nodeEls) nodeEls[k].classList.remove("active");
  if (s) nodeEls[s].classList.add("active");
}
function highlightEdge(from, to) {
  for (const e of edgeMap.values()) {
    e.path.classList.remove("active");
    e.label.classList.remove("active");
    e.path.setAttribute("marker-end","url(#arr-dfa)");
  }
  if (from && to) {
    const e = edgeMap.get(`${from}->${to}`);
    if (e) {
      e.path.classList.add("active");
      e.label.classList.add("active");
      e.path.setAttribute("marker-end","url(#arrA-dfa)");
    }
  }
}
function renderTape(input, pos, running) {
  tapeEl.innerHTML = "";
  for (let i = 0; i < input.length; i++) {
    const c = document.createElement("div");
    c.className = "cell";
    c.textContent = input[i];
    if (i < pos) c.classList.add("consumed");
    if (i === pos && running) c.classList.add("current");
    tapeEl.appendChild(c);
  }
}
function setStatus(kind, text) {
  statusEl.className = "status " + kind;
  statusEl.textContent = text;
}
function alphabetRegex() {
  const chars = DFA.alphabet.map(c => c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("");
  return new RegExp(`^[${chars}]*$`);
}

// ───────────────────────── Multi-input rows ─────────────────────────
function clearDiagramHighlights() {
  for (const k in nodeEls) nodeEls[k].classList.remove("active");
  for (const e of edgeMap.values()) {
    e.path.classList.remove("active");
    e.label.classList.remove("active");
    e.path.setAttribute("marker-end", "url(#arr-dfa)");
  }
}

function makeInputRow(value = "") {
  const row = document.createElement("div");
  row.className = "input-row";
  const num = document.createElement("span");
  num.className = "row-num";
  const inp = document.createElement("input");
  inp.type = "text"; inp.maxLength = 500; inp.autocomplete = "off"; inp.spellcheck = false;
  inp.placeholder = DFA.placeholder;
  inp.value = value;
  inp.addEventListener("focus", () => { activeInputValue = inp.value; });
  inp.addEventListener("input", () => { activeInputValue = inp.value; });
  inp.addEventListener("keydown", e => { if (e.key === "Enter") runAll(); });
  const rm = document.createElement("button");
  rm.className = "remove-row"; rm.textContent = "✕"; rm.title = "Remove this string";
  rm.onclick = () => { row.remove(); renumberRows(); };
  row.appendChild(num); row.appendChild(inp); row.appendChild(rm);
  inputRowsEl.appendChild(row);
  renumberRows();
  inp.focus();
  return inp;
}

function renumberRows() {
  const rows = [...inputRowsEl.querySelectorAll(".input-row")];
  rows.forEach((r, i) => { r.querySelector(".row-num").textContent = (i + 1) + "."; });
  // never allow zero rows
  if (rows.length === 0) makeInputRow("");
  // disable remove button if only one row
  rows.forEach(r => {
    const rm = r.querySelector(".remove-row");
    rm.style.visibility = rows.length === 1 ? "hidden" : "visible";
  });
}

function getInputValues() {
  return [...inputRowsEl.querySelectorAll(".input-row input")].map(i => i.value);
}

// ───────────────────────── Batch run + results table ─────────────────────────
function runAll() {
  const values = getInputValues();
  const re = alphabetRegex();
  const results = values.map((s, idx) => {
    if (!re.test(s)) return {idx, s, verdict: "invalid", cfg: "invalid", final: "—"};
    const r = runDFA(s);
    // CFG check: a string is CFG-derivable iff a derivation exists
    const derivable = deriveString(DFA.grammar, s) !== null;
    return {
      idx, s,
      verdict: r.accepted ? "accept" : "reject",
      cfg: derivable ? "accept" : "reject",
      final: r.final,
    };
  });
  renderResults(results);
  const firstValid = results.find(r => r.verdict !== "invalid");
  if (firstValid) animateString(firstValid.s, firstValid.idx);
  else { clearDiagramHighlights(); highlightState(DFA.start); setStatus("reject", "No valid strings to simulate"); }
}

function renderResults(results) {
  resultsBody.innerHTML = "";
  for (const r of results) {
    const tr = document.createElement("tr");
    tr.dataset.idx = r.idx;
    const dfaClass = r.verdict === "accept" ? "v-accept" : r.verdict === "reject" ? "v-reject" : "v-invalid";
    const dfaText = r.verdict === "accept" ? "✓ ACCEPT" : r.verdict === "reject" ? "✗ REJECT" : "⚠ INVALID";
    const cfgClass = r.cfg === "accept" ? "v-accept" : r.cfg === "reject" ? "v-reject" : "v-invalid";
    const cfgText = r.cfg === "accept" ? "✓ DERIVABLE" : r.cfg === "reject" ? "✗ NO DERIV." : "⚠ —";
    const strDisplay = r.s === "" ? '<span class="str-cell empty">(empty)</span>' : `<span class="str-cell">${escapeHtml(r.s)}</span>`;
    tr.innerHTML =
      `<td>${r.idx + 1}</td>` +
      `<td>${strDisplay}</td>` +
      `<td class="${dfaClass}">${dfaText}</td>` +
      `<td class="${cfgClass}">${cfgText}</td>` +
      `<td>${r.final}</td>` +
      `<td>${r.verdict !== "invalid" ? '<button class="play-btn">Play ▶</button>' : ""}</td>`;
    if (r.verdict !== "invalid") {
      tr.onclick = () => animateString(r.s, r.idx);
    }
    resultsBody.appendChild(tr);
  }
  resultsWrap.style.display = results.length ? "block" : "none";
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ───────────────────────── Single-string animation ─────────────────────────
function animateString(s, idx) {
  if (sim?.timer) clearTimeout(sim.timer);
  clearDiagramHighlights();
  // mark which row is playing
  [...resultsBody.querySelectorAll("tr")].forEach(tr => {
    tr.classList.toggle("playing", Number(tr.dataset.idx) === idx);
  });
  const result = runDFA(s);
  sim = {input: s, pos: 0, result};
  setStatus("running", s.length === 0 ? "Empty string" : `Running "${s}"...`);
  highlightState(DFA.start);
  renderTape(s, 0, true);
  if (s.length === 0) { finishSim(); return; }
  tick();
}
function tick() {
  if (!sim) return;
  if (sim.pos >= sim.input.length) { finishSim(); return; }
  const step = sim.result.trace[sim.pos];
  highlightEdge(step.from, step.to);
  highlightState(step.to);
  sim.pos++;
  renderTape(sim.input, sim.pos, sim.pos < sim.input.length);
  if (sim.pos >= sim.input.length) { setTimeout(finishSim, 300); return; }
  sim.timer = setTimeout(tick, 500);
}
function finishSim() {
  if (!sim) return;
  const label = sim.input === "" ? "(empty)" : `"${sim.input}"`;
  if (sim.result.accepted) setStatus("accept", `✓ ${label} Accepted — ended in ${sim.result.final}`);
  else setStatus("reject", `✗ ${label} Rejected — ended in ${sim.result.final}`);
  renderTape(sim.input, sim.input.length, false);
}

function reset() {
  if (sim?.timer) clearTimeout(sim.timer);
  sim = null;
  inputRowsEl.innerHTML = "";
  makeInputRow("");
  resultsBody.innerHTML = "";
  resultsWrap.style.display = "none";
  clearDiagramHighlights();
  highlightState(DFA.start);
  renderTape("", 0, false);
  setStatus("", "Idle");
}

function loadDFA(key) {
  currentKey = key; DFA = DFAS[key];
  inputRowsEl.innerHTML = "";
  makeInputRow("");
  resultsBody.innerHTML = "";
  resultsWrap.style.display = "none";
  regexEl.textContent = DFA.regex;
  alphabetEl.textContent = `Σ = { ${DFA.alphabet.join(", ")} }   ·   ${DFA.label}`;
  switchBtn.textContent = `Switch RegEx ⇄ (now: ${DFA.label})`;
  examplesEl.innerHTML = "";
  for (const ex of DFA.examples) {
    const b = document.createElement("button");
    b.textContent = ex.s + (ex.ok ? " ✓" : " ✗");
    b.style.color = ex.ok ? "var(--accept)" : "var(--reject)";
    b.onclick = () => {
      // fill the first empty row, else add a new one, then run all
      const inputs = [...inputRowsEl.querySelectorAll(".input-row input")];
      const empty = inputs.find(i => i.value === "");
      if (empty) empty.value = ex.s;
      else makeInputRow(ex.s);
      runAll();
    };
    examplesEl.appendChild(b);
  }
  renderDiagram();
  clearDiagramHighlights();
  highlightState(DFA.start);
  renderTape("", 0, false);
  setStatus("", "Idle");
  renderGrammarModal();
  renderPdaPanel();
  document.getElementById("deriv-input").placeholder = DFA.placeholder;
  document.getElementById("deriv-trace").innerHTML = '<span style="color:var(--dim); font-style:italic">type a string above and click Derive</span>';
  document.getElementById("deriv-trace").className = "derivation-trace";
  document.getElementById("pda-input").placeholder = DFA.placeholder;
  resetPdaSim();
}
function toggleDFA() { loadDFA(currentKey === "dfa1" ? "dfa2" : "dfa1"); }

// ───────────────────────── Modals ─────────────────────────
const cfgModal = document.getElementById("cfg-modal");
const pdaModal = document.getElementById("pda-modal");
const devsModal = document.getElementById("devs-modal");

function openModal(m) { m.classList.add("open"); }
function closeModal(m) { m.classList.remove("open"); }

document.getElementById("show-cfg").onclick = () => { renderGrammarModal(); openModal(cfgModal); if (activeInputValue) document.getElementById("deriv-input").value = activeInputValue; };
document.getElementById("cfg-close").onclick = () => closeModal(cfgModal);
cfgModal.addEventListener("click", e => { if (e.target === cfgModal) closeModal(cfgModal); });

document.getElementById("show-pda").onclick = () => { renderPdaPanel(); openModal(pdaModal); if (activeInputValue) document.getElementById("pda-input").value = activeInputValue; };
document.getElementById("pda-close").onclick = () => closeModal(pdaModal);
pdaModal.addEventListener("click", e => { if (e.target === pdaModal) closeModal(pdaModal); });

document.getElementById("show-devs").onclick = () => openModal(devsModal);
document.getElementById("devs-close").onclick = () => closeModal(devsModal);
devsModal.addEventListener("click", e => { if (e.target === devsModal) closeModal(devsModal); });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal(cfgModal); closeModal(pdaModal); closeModal(devsModal); }
});

// ───────────────────────── CFG ─────────────────────────
const grammarRulesEl = document.getElementById("grammar-rules");
const grammarNoteEl = document.getElementById("grammar-note");
const derivInput = document.getElementById("deriv-input");
const derivBtn = document.getElementById("deriv-btn");
const derivTrace = document.getElementById("deriv-trace");

function renderGrammarModal() {
  const g = DFA.grammar;
  grammarRulesEl.innerHTML = "";
  for (const rule of g.display) {
    const line = document.createElement("div");
    line.innerHTML =
      `<span class="lhs">${rule.lhs}</span>` +
      `<span class="arrow">→</span>` +
      rule.rhs.map(r => formatRhs(r)).join('<span class="pipe">|</span>');
    grammarRulesEl.appendChild(line);
  }
  grammarNoteEl.textContent = g.note;
}
function formatRhs(rhs) {
  if (rhs === "ε") return `<span class="epsilon">ε</span>`;
  let out = "";
  for (const ch of rhs) {
    if (/[A-Z]/.test(ch)) out += `<span class="nonterm">${ch}</span>`;
    else out += `<span class="terminal">${ch}</span>`;
  }
  return out;
}
function isTerminal(tok) { return tok === "" || /^[a-z0-9]$/.test(tok); }
function deriveString(grammar, input) {
  let steps = 0; const MAX = 50000; const trace = [];
  function expand(prefix, remaining, consumed) {
    if (++steps > MAX) return false;
    if (remaining.length === 0) return consumed === input.length;
    const NT = remaining[0];
    if (!grammar.rules[NT]) return false;
    for (const expansion of grammar.rules[NT]) {
      const newTail = [...expansion, ...remaining.slice(1)];
      let i=0, c=consumed, ok=true; const newPrefix=[...prefix];
      while (i < newTail.length && isTerminal(newTail[i])) {
        if (newTail[i]==="") { i++; continue; }
        if (c >= input.length || newTail[i] !== input[c]) { ok=false; break; }
        newPrefix.push(newTail[i]); c++; i++;
      }
      if (!ok) continue;
      const newRemaining = newTail.slice(i);
      trace.push([...newPrefix, ...newRemaining]);
      if (expand(newPrefix, newRemaining, c)) return true;
      trace.pop();
    }
    return false;
  }
  trace.push([grammar.start]);
  return expand([], [grammar.start], 0) ? trace : null;
}
function renderDerivation(input) {
  if (!alphabetRegex().test(input)) {
    derivTrace.className = "derivation-trace fail";
    derivTrace.textContent = `Invalid input — use only ${DFA.alphabet.join(" and ")}.`;
    return;
  }
  const result = runDFA(input);
  if (!result.accepted) {
    derivTrace.className = "derivation-trace fail";
    derivTrace.innerHTML = `<div>✗ String <b>"${input || "ε"}"</b> is rejected.</div>` +
      `<div style="margin-top:8px; color:var(--dim); font-style:italic">No derivation exists.</div>`;
    return;
  }
  const trace = deriveString(DFA.grammar, input);
  if (!trace) { derivTrace.className = "derivation-trace fail"; derivTrace.textContent = "Derivation failed."; return; }
  derivTrace.className = "derivation-trace success";
  derivTrace.innerHTML = "";
  trace.forEach((form, idx) => {
    const row = document.createElement("div");
    row.className = "step" + (idx === trace.length - 1 ? " final" : "");
    const num = `<span class="step-num">${idx}</span>`;
    const arrow = idx === 0 ? "" : `<span class="arrow-d">⇒</span>`;
    let body = "";
    if (form.length === 0) body = `<span class="epsilon">ε</span>`;
    else for (const tok of form) {
      if (tok === "") body += `<span class="epsilon">ε</span>`;
      else if (/[A-Z]/.test(tok)) body += `<span class="nonterm">${tok}</span>`;
      else body += `<span class="terminal">${tok}</span>`;
    }
    row.innerHTML = num + arrow + body;
    derivTrace.appendChild(row);
  });
}
derivBtn.onclick = () => renderDerivation(derivInput.value);
derivInput.addEventListener("keydown", e => { if (e.key === "Enter") renderDerivation(derivInput.value); });

// ───────────────────────── PDA ─────────────────────────
const pdaSvg = document.getElementById("pda-diagram");
const pdaInput = document.getElementById("pda-input");
const pdaTape = document.getElementById("pda-tape");
const pdaStatus = document.getElementById("pda-status");
const stackTower = document.getElementById("stack-tower");
const stackLegend = document.getElementById("stack-legend");
const pdaTrace = document.getElementById("pda-trace");

let pdaSim = null;

function renderPdaPanel() {
  buildFlowchartLayout();
  drawPdaFlowchart();
  stackLegend.innerHTML = DFA.pda.legend;
  resetPdaSim();
}

// Auto-generate a flowchart layout from the PDA delta.
// Each DFA state becomes a "Read" diamond. We add Start, Accept, Reject terminals.
// Edges are labeled "sym : op" where op is push/pop/— derived from the transition.
let currentFlowchart = null;
let transitionPath = {};

function stackOpLabel(top, push) {
  if (push.length > 1) return "push " + push[push.length - 1];
  if (push.length === 0) return "pop " + top;
  return "—";
}

function buildFlowchartLayout() {
  const pda = DFA.pda;
  // Only states that have a layout position become READ diamonds.
  // 'T' -> REJECT terminal; 'qf' (empty-stack final) -> ACCEPT terminal.
  const states = pda.states.filter(s => s !== "T" && s !== "qf" && DFA.positions[s]);
  const nodes = {};
  const edges = [];
  transitionPath = {};

  const basePos = DFA.positions;
  const DIAMOND_W = 96, DIAMOND_H = 66;
  const BOX_W = 70, BOX_H = 38;

  // Spread the base positions out so there's room for PUSH/POP boxes on edges
  const SCALE = 1.55;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const s of states) {
    const p = basePos[s];
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const padTop = 110, padBottom = 130, padLeft = 130, padRight = 150;
  const sx = x => (x - minX) * SCALE + padLeft;
  const sy = y => (y - minY) * SCALE + padTop;

  for (const s of states) {
    const p = basePos[s];
    nodes[s] = { type: "diamond", label: "READ\n" + s, x: sx(p.x), y: sy(p.y), w: DIAMOND_W, h: DIAMOND_H };
  }

  const spanW = (maxX - minX) * SCALE;
  const spanH = (maxY - minY) * SCALE;

  // Terminals
  const startNode = nodes[pda.start];
  nodes["__start"] = { type: "term", label: "START", x: startNode.x, y: startNode.y - 84, w: 84, h: BOX_H };
  edges.push({ from: "__start", to: pda.start, fromSide: "bottom", toSide: "top", path: "straight" });

  nodes["__accept"] = { type: "term", label: "ACCEPT", x: padLeft + spanW + padRight - 40, y: padTop + spanH + padBottom - 30, w: 92, h: BOX_H };
  nodes["__reject"] = { type: "term", label: "REJECT", x: padLeft - 60, y: padTop + spanH + padBottom - 30, w: 92, h: BOX_H };

  // Build transitions, inserting PUSH/POP op boxes mid-edge.
  // Skip epsilon (drain-phase) moves — those aren't part of the READ flow.
  let opCounter = 0;
  const grouped = new Map();
  for (const key of Object.keys(pda.delta)) {
    const [from, sym, cat] = key.split("|");
    if (from === "T" || sym === "ε") continue;
    const t = pda.delta[key];
    const to = (t.next === "T") ? "__reject" : (t.next === "qf" ? "__accept" : t.next);
    const op = t.op === "push" ? "push" : (t.op === "pop" ? "pop" : "plain");
    const gk = `${from}|${to}|${op}`;
    if (!grouped.has(gk)) grouped.set(gk, { from, to, op, syms: [] });
    grouped.get(gk).syms.push(sym);
  }

  for (const g of grouped.values()) {
    const fromN = nodes[g.from], toN = nodes[g.to];
    const symLabel = g.syms.join(",");
    if (g.op === "plain") {
      // direct edge, labeled with the read symbol
      const sides = pickSides(fromN, toN);
      edges.push({ from: g.from, to: g.to, fromSide: sides.from, toSide: sides.to, label: symLabel });
      for (const sym of g.syms) transitionPath[`${g.from}|${sym}`] = { from: g.from, to: g.to, opBox: null };
    } else {
      // insert a PUSH or POP box on the midpoint of the edge
      const opKey = `__op${opCounter++}`;
      const mx = (fromN.x + toN.x) / 2;
      const my = (fromN.y + toN.y) / 2;
      nodes[opKey] = {
        type: g.op === "push" ? "push" : "pop",
        label: g.op === "push" ? "PUSH" : "POP",
        x: mx, y: my, w: BOX_W, h: BOX_H,
      };
      const s1 = pickSides(fromN, nodes[opKey]);
      const s2 = pickSides(nodes[opKey], toN);
      edges.push({ from: g.from, to: opKey, fromSide: s1.from, toSide: s1.to, label: symLabel });
      edges.push({ from: opKey, to: g.to, fromSide: s2.from, toSide: s2.to });
      for (const sym of g.syms) transitionPath[`${g.from}|${sym}`] = { from: g.from, to: g.to, opBox: opKey };
    }
  }

  // End-of-input (Δ) branch for every READ state.
  // Determine which states are "accepting" for the diagram:
  //   - emptyStack mode: states that begin the ε-drain
  //   - finalState mode: states in pda.accepts
  const acceptingStates = new Set();
  if (pda.acceptMode === "emptyStack") {
    for (const key of Object.keys(pda.delta)) {
      const [from, sym] = key.split("|");
      if (sym === "ε") acceptingStates.add(from);
    }
  } else {
    for (const s of pda.accepts) acceptingStates.add(s);
  }

  for (const s of states) {
    if (acceptingStates.has(s)) {
      const sides = pickSides(nodes[s], nodes["__accept"]);
      const lbl = pda.acceptMode === "emptyStack" ? "Δ, ε-pop all" : "end / Δ";
      edges.push({ from: s, to: "__accept", fromSide: sides.from, toSide: sides.to, label: lbl, dashed: true });
    } else {
      const sides = pickSides(nodes[s], nodes["__reject"]);
      edges.push({ from: s, to: "__reject", fromSide: sides.from, toSide: sides.to, label: "Δ", dashed: true });
    }
  }

  const vbW = padLeft + spanW + padRight + 60;
  const vbH = padTop + spanH + padBottom + 40;
  currentFlowchart = { nodes, edges, viewBox: `0 0 ${vbW} ${vbH}` };
}

function pickSides(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { from: "right", to: "left" } : { from: "left", to: "right" };
  } else {
    return dy >= 0 ? { from: "bottom", to: "top" } : { from: "top", to: "bottom" };
  }
}

let pdaFlowNodes = {};
let pdaFlowEdges = new Map();

function drawPdaFlowchart() {
  const fc = currentFlowchart;
  while (pdaSvg.firstChild) pdaSvg.removeChild(pdaSvg.firstChild);
  pdaSvg.setAttribute("viewBox", fc.viewBox);
  pdaFlowNodes = {};
  pdaFlowEdges = new Map();

  const NS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(NS, "defs");
  pdaSvg.appendChild(defs);
  for (const [id, color] of [["fc-arr","#2a342d"],["fc-arrA","#d4ff3a"]]) {
    const m = document.createElementNS(NS, "marker");
    Object.entries({id, viewBox:"0 0 10 10", refX:9, refY:5, markerWidth:8, markerHeight:8, orient:"auto-start-reverse"}).forEach(([k,v])=>m.setAttribute(k,v));
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d","M0,0 L10,5 L0,10 z"); p.setAttribute("fill", color);
    m.appendChild(p); defs.appendChild(m);
  }

  for (const e of fc.edges) {
    const from = fc.nodes[e.from], to = fc.nodes[e.to];
    const a = anchorPoint(from, e.fromSide);
    const b = anchorPoint(to, e.toSide);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M ${a.x},${a.y} L ${b.x},${b.y}`);
    path.setAttribute("class", "fc-edge" + (e.dashed ? " dashed" : ""));
    path.setAttribute("marker-end", "url(#fc-arr)");
    pdaSvg.appendChild(path);
    if (e.label) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const txt = document.createElementNS(NS, "text");
      txt.setAttribute("x", mx); txt.setAttribute("y", my - 4);
      txt.setAttribute("class", "fc-edge-label");
      txt.textContent = e.label;
      pdaSvg.appendChild(txt);
    }
    pdaFlowEdges.set(`${e.from}->${e.to}`, { path });
  }

  for (const [key, n] of Object.entries(fc.nodes)) {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", `fc-node fc-${n.type}` + (key === "__accept" ? " fc-accept" : key === "__reject" ? " fc-reject" : key === "__start" ? " fc-start" : ""));
    if (n.type === "diamond") {
      const poly = document.createElementNS(NS, "polygon");
      const hw = n.w/2, hh = n.h/2;
      poly.setAttribute("points", `${n.x},${n.y-hh} ${n.x+hw},${n.y} ${n.x},${n.y+hh} ${n.x-hw},${n.y}`);
      g.appendChild(poly);
    } else {
      const rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", n.x - n.w/2); rect.setAttribute("y", n.y - n.h/2);
      rect.setAttribute("width", n.w); rect.setAttribute("height", n.h);
      rect.setAttribute("rx", 4);
      g.appendChild(rect);
    }
    // multi-line label support
    const lines = n.label.split("\n");
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", n.x); t.setAttribute("y", n.y);
    t.setAttribute("class", "fc-node-label");
    lines.forEach((ln, i) => {
      const ts = document.createElementNS(NS, "tspan");
      ts.setAttribute("x", n.x);
      ts.setAttribute("dy", i === 0 ? `${-(lines.length-1)*0.55}em` : "1.1em");
      ts.textContent = ln;
      t.appendChild(ts);
    });
    g.appendChild(t);
    pdaSvg.appendChild(g);
    pdaFlowNodes[key] = { el: g, node: n };
  }
}

function anchorPoint(node, side) {
  const hw = node.w/2, hh = node.h/2;
  switch (side) {
    case "top": return { x: node.x, y: node.y - hh };
    case "bottom": return { x: node.x, y: node.y + hh };
    case "left": return { x: node.x - hw, y: node.y };
    case "right": return { x: node.x + hw, y: node.y };
    default: return { x: node.x, y: node.y };
  }
}

function pdaFlowHighlight(nodeKey) {
  for (const k in pdaFlowNodes) pdaFlowNodes[k].el.classList.remove("active");
  if (nodeKey && pdaFlowNodes[nodeKey]) pdaFlowNodes[nodeKey].el.classList.add("active");
}

function renderStack(stack) {
  stackTower.innerHTML = "";
  stack.forEach((sym, idx) => {
    const cell = document.createElement("div");
    cell.className = "stack-cell";
    if (idx === 0) cell.classList.add("bottom");
    if (idx === stack.length - 1 && stack.length > 1) cell.classList.add("top");
    cell.textContent = sym;
    stackTower.appendChild(cell);
  });
}

function pdaHighlightState(s) {
  if (s === "T") { pdaFlowHighlight("__reject"); return; }
  pdaFlowHighlight(s);
}
function pdaHighlightEdge(from, to, sym) {
  for (const e of pdaFlowEdges.values()) {
    e.path.classList.remove("active");
    e.path.setAttribute("marker-end","url(#fc-arr)");
  }
  const tgt = to === "T" ? "__reject" : to;
  const tp = (sym !== undefined) ? transitionPath[`${from}|${sym}`] : null;
  const keys = (tp && tp.opBox)
    ? [`${from}->${tp.opBox}`, `${tp.opBox}->${tgt}`]
    : [`${from}->${tgt}`];
  for (const key of keys) {
    const e = pdaFlowEdges.get(key);
    if (e) {
      e.path.classList.add("active");
      e.path.setAttribute("marker-end","url(#fc-arrA)");
    }
  }
}
function renderPdaTape(input, pos, running) {
  pdaTape.innerHTML = "";
  if (!input.length) { pdaTape.style.minHeight = "44px"; return; }
  for (let i = 0; i < input.length; i++) {
    const c = document.createElement("div");
    c.className = "cell";
    c.textContent = input[i];
    if (i < pos) c.classList.add("consumed");
    if (i === pos && running) c.classList.add("current");
    pdaTape.appendChild(c);
  }
}
function setPdaStatus(kind, text) {
  pdaStatus.className = "pda-status " + kind;
  pdaStatus.textContent = text;
}

function resetPdaSim() {
  if (pdaSim?.timer) clearTimeout(pdaSim.timer);
  pdaSim = null;
  pdaInput.value = "";
  pdaHighlightState(DFA.pda.start);
  pdaHighlightEdge(null, null);
  renderStack([DFA.pda.startStack]);
  renderPdaTape("", 0, false);
  setPdaStatus("", "Idle");
  if (pdaTrace) pdaTrace.innerHTML = '<span style="color:var(--dim); font-style:italic">run a string to see each step</span>';
  if (pdaTrace) pdaTrace.className = "pda-trace";
}

function runPDA(input) {
  const pda = DFA.pda;
  let state = pda.start;
  let stack = [pda.startStack];
  const trace = [];
  for (let i = 0; i < input.length; i++) {
    const sym = input[i];
    const top = stack[stack.length - 1];
    const cat = top === "Δ" ? "Δ" : "*";
    const t = pda.delta[`${state}|${sym}|${cat}`];
    if (!t) {
      trace.push({i, from: state, sym, top, stuck: true, stack: [...stack]});
      return {finalState: state, finalStack: stack, trace, accepted: false, stuck: true};
    }
    if (t.op === "push") stack = [...stack, sym];
    else if (t.op === "pop") { stack = stack.slice(0, -1); }
    // op "none": stack unchanged
    trace.push({i, from: state, sym, top, to: t.next, op: t.op, stack: [...stack]});
    state = t.next;
  }
  // Epsilon-drain phase (for empty-stack acceptance): run ε-moves after input ends.
  if (pda.acceptMode === "emptyStack") {
    let guard = 0;
    while (guard++ < 500) {
      const top = stack[stack.length - 1];
      const cat = top === "Δ" ? "Δ" : "*";
      const t = pda.delta[`${state}|ε|${cat}`];
      if (!t) break;
      if (t.op === "pop") stack = stack.slice(0, -1);
      else if (t.op === "popΔ") { if (top === "Δ") stack = stack.slice(0, -1); else break; }
      trace.push({i: input.length, from: state, sym: "ε", top, to: t.next, op: t.op, stack: [...stack], epsilon: true});
      state = t.next;
    }
    return {finalState: state, finalStack: stack, trace, accepted: stack.length === 0, stuck: false};
  }
  return {finalState: state, finalStack: stack, trace, accepted: pda.accepts.has(state), stuck: false};
}

function startPdaSim() {
  const s = pdaInput.value;
  if (!alphabetRegex().test(s)) { setPdaStatus("reject", `Invalid input — use only ${DFA.alphabet.join(" and ")}`); return; }
  if (pdaSim?.timer) clearTimeout(pdaSim.timer);
  pdaHighlightEdge(null, null);
  const result = runPDA(s);
  pdaSim = {input: s, pos: 0, result};
  setPdaStatus("running", s.length === 0 ? "Empty string" : "Running...");
  pdaHighlightState(DFA.pda.start);
  renderStack([DFA.pda.startStack]);
  renderPdaTape(s, 0, true);
  renderPdaTrace(result, -1);
  if (s.length === 0) { finishPdaSim(); return; }
  pdaTick();
}
function pdaTick() {
  if (!pdaSim) return;
  if (pdaSim.pos >= pdaSim.result.trace.length) { finishPdaSim(); return; }
  const step = pdaSim.result.trace[pdaSim.pos];
  if (step.stuck) {
    pdaHighlightState(step.from);
    setPdaStatus("reject", `✗ No transition from ${step.from} on (${step.sym}, ${step.top}) — stuck.`);
    renderPdaTrace(pdaSim.result, pdaSim.pos);
    return;
  }
  if (step.epsilon) {
    // epsilon-drain step: no input consumed, stack pops; show the op box / state
    setPdaStatus("running", "Draining stack (ε-moves)...");
    renderStack(step.stack);
    renderPdaTrace(pdaSim.result, pdaSim.pos);
    pdaHighlightState(step.to === "qf" ? "__accept" : step.from);
    pdaSim.pos++;
    pdaSim.timer = setTimeout(pdaTick, 450);
    return;
  }
  // Find the flow path for this transition (may pass through a PUSH/POP box)
  const tp = transitionPath[`${step.from}|${step.sym}`];
  pdaHighlightEdge(step.from, step.to, step.sym);
  renderStack(step.stack);
  renderPdaTrace(pdaSim.result, pdaSim.pos);
  pdaSim.pos++;
  // tape position = how many real symbols consumed so far
  const consumed = pdaSim.result.trace.slice(0, pdaSim.pos).filter(s => !s.epsilon && !s.stuck).length;
  renderPdaTape(pdaSim.input, consumed, consumed < pdaSim.input.length);
  if (tp && tp.opBox) {
    pdaFlowHighlight(tp.opBox);
    setTimeout(() => { if (pdaSim) pdaHighlightState(step.to); }, 280);
  } else {
    pdaHighlightState(step.to);
  }
  pdaSim.timer = setTimeout(pdaTick, 650);
}
function finishPdaSim() {
  if (!pdaSim) return;
  if (pdaSim.result.stuck) return;
  renderPdaTrace(pdaSim.result, pdaSim.result.trace.length);
  const terminal = pdaSim.result.accepted ? "__accept" : "__reject";
  for (const e of pdaFlowEdges.values()) { e.path.classList.remove("active"); e.path.setAttribute("marker-end","url(#fc-arr)"); }
  pdaFlowHighlight(terminal);
  const stackStr = pdaSim.result.finalStack.length ? `[${pdaSim.result.finalStack.join(", ")}]` : "empty";
  if (pdaSim.result.accepted) setPdaStatus("accept", `✓ Accepted — stack emptied (${stackStr})`);
  else setPdaStatus("reject", `✗ Rejected — final stack ${stackStr}, not empty / not in accepting path`);
  renderPdaTape(pdaSim.input, pdaSim.input.length, false);
}

function renderPdaTrace(result, currentIdx) {
  pdaTrace.className = "pda-trace" + (result.accepted ? " success" : (currentIdx >= result.trace.length ? " fail" : ""));
  if (!result.trace.length) {
    pdaTrace.innerHTML = '<span style="color:var(--dim); font-style:italic">empty string — no symbols to read</span>';
    return;
  }
  pdaTrace.innerHTML = "";
  result.trace.forEach((step, i) => {
    const row = document.createElement("div");
    row.className = "tstep" + (i === currentIdx ? " current" : "");
    if (step.stuck) {
      row.innerHTML =
        `<span class="tnum">${i}</span>` +
        `<span class="tmove">read '${step.sym}', top ${step.top} — no rule, REJECT</span>`;
    } else if (step.epsilon) {
      const op = step.op === "popΔ" ? "pop Δ (empty!)" : `pop '${step.top}'`;
      row.innerHTML =
        `<span class="tnum">${i}</span>` +
        `<span class="tmove" style="color:var(--stack)">ε-move: ${op} → ${step.to}</span>` +
        `<span class="tstack">[${step.stack.join(" ") || "∅"}]</span>`;
    } else {
      const op = step.op === "push" ? `push '${step.sym}'`
               : step.op === "pop" ? `pop '${step.top}'` : "no change";
      const tgt = step.to === "T" ? "Reject" : step.to;
      row.innerHTML =
        `<span class="tnum">${i}</span>` +
        `<span class="tmove">${step.from} —read '${step.sym}', ${op}→ ${tgt}</span>` +
        `<span class="tstack">[${step.stack.join(" ")}]</span>`;
    }
    pdaTrace.appendChild(row);
  });
}

document.getElementById("pda-run").onclick = startPdaSim;
document.getElementById("pda-reset").onclick = resetPdaSim;
pdaInput.addEventListener("keydown", e => { if (e.key === "Enter") startPdaSim(); });

// ───────────────────────── Wire up ─────────────────────────
document.getElementById("add-row").onclick = () => makeInputRow("");
document.getElementById("run-all").onclick = runAll;
document.getElementById("reset").onclick = reset;
switchBtn.onclick = toggleDFA;

loadDFA("dfa1");

// ───────────────────────── Theme toggle ─────────────────────────
const themeToggle = document.getElementById("theme-toggle");
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  if (themeToggle) themeToggle.textContent = theme === "light" ? "☀️ Light" : "🌙 Dark";
}
if (themeToggle) {
  themeToggle.onclick = () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  };
}
applyTheme("dark");
