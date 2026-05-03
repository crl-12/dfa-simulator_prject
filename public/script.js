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
      q1:{x:80,y:240},  q2:{x:240,y:240},
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
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("diagram");
const inputEl = document.getElementById("input");
const tapeEl = document.getElementById("tape");
const statusEl = document.getElementById("status");
const regexEl = document.getElementById("regex");
const alphabetEl = document.getElementById("alphabet");
const switchBtn = document.getElementById("switch");
const examplesEl = document.getElementById("examples");

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

function renderDiagram() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute("viewBox", DFA.viewBox);
  nodeEls = {}; edgeMap = new Map();

  const defs = el("defs");
  for (const [id, color] of [["arr","#2a342d"],["arrA","#d4ff3a"]]) {
    const m = el("marker",{id, viewBox:"0 0 10 10", refX:9, refY:5, markerWidth:7, markerHeight:7, orient:"auto-start-reverse"}, defs);
    el("path",{d:"M0,0 L10,5 L0,10 z", fill:color}, m);
  }

  const groups = new Map();
  for (const s of DFA.states) for (const sym of DFA.alphabet) {
    const t = DFA.delta[s][sym], k = `${s}->${t}`;
    if (!groups.has(k)) groups.set(k, {from:s, to:t, syms:[]});
    groups.get(k).syms.push(sym);
  }
  const reverseSet = new Set([...groups.values()].map(e => `${e.to}->${e.from}`));

  for (const e of groups.values()) {
    const a = DFA.positions[e.from], b = DFA.positions[e.to];
    let path, label;
    if (e.from === e.to) {
      const cx=a.x, cy=a.y - R - 18;
      const d = `M ${a.x-8},${a.y-R+2} C ${cx-30},${cy-5} ${cx+30},${cy-5} ${a.x+8},${a.y-R+2}`;
      path = el("path",{d, class:"edge","marker-end":"url(#arr)"});
      label = el("text",{x:cx, y:cy-12, class:"edge-label"});
    } else {
      const p1 = pointOnCircle(a.x,a.y,b.x,b.y,R);
      const p2 = pointOnCircle(b.x,b.y,a.x,a.y,R);
      const reverse = reverseSet.has(`${e.from}->${e.to}`);
      if (reverse) {
        const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
        const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1;
        const nx=-dy/len, ny=dx/len, off=22;
        const cx=mx+nx*off, cy=my+ny*off;
        path = el("path",{d:`M ${p1.x},${p1.y} Q ${cx},${cy} ${p2.x},${p2.y}`, class:"edge","marker-end":"url(#arr)"});
        label = el("text",{x:cx+nx*8, y:cy+ny*8, class:"edge-label"});
      } else {
        path = el("path",{d:`M ${p1.x},${p1.y} L ${p2.x},${p2.y}`, class:"edge","marker-end":"url(#arr)"});
        const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
        const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1;
        label = el("text",{x:mx-dy/len*12, y:my+dx/len*12, class:"edge-label"});
      }
    }
    label.textContent = e.syms.join(",");
    edgeMap.set(`${e.from}->${e.to}`, {path, label});
  }

  const sp = DFA.positions[DFA.start];
  el("path",{d:`M ${sp.x-R-28},${sp.y} L ${sp.x-R-2},${sp.y}`, class:"edge","marker-end":"url(#arr)"});
  el("text",{x:sp.x-R-32, y:sp.y-6, class:"edge-label","text-anchor":"end"}).textContent = "start";

  for (const s of DFA.states) {
    const {x,y} = DFA.positions[s];
    const cls = [
      s === DFA.start ? "start" : "",
      DFA.accepts.has(s) ? "accept" : "",
      s === "T" ? "trap" : "",
    ].filter(Boolean).join(" ");
    const g = el("g",{class:`node ${cls}`});
    if (DFA.accepts.has(s)) el("circle",{cx:x, cy:y, r:R+4, class:"outer"}, g);
    el("circle",{cx:x, cy:y, r:R}, g);
    el("text",{x, y}, g).textContent = s;
    nodeEls[s] = g;
  }
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
    e.path.setAttribute("marker-end","url(#arr)");
  }
  if (from && to) {
    const e = edgeMap.get(`${from}->${to}`);
    if (e) {
      e.path.classList.add("active");
      e.label.classList.add("active");
      e.path.setAttribute("marker-end","url(#arrA)");
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

function reset() {
  if (sim?.timer) { clearTimeout(sim.timer); }
  sim = null;
  inputEl.value = "";
  for (const k in nodeEls) nodeEls[k].classList.remove("active");
  for (const e of edgeMap.values()) {
    e.path.classList.remove("active");
    e.label.classList.remove("active");
    e.path.setAttribute("marker-end", "url(#arr)");
  }
  highlightState(DFA.start);
  renderTape("", 0, false);
  setStatus("", "Idle");
}

function startAnimated() {
  const s = inputEl.value;
  if (!alphabetRegex().test(s)) {
    setStatus("reject", `Invalid input — use only ${DFA.alphabet.join(" and ")}`);
    return;
  }
  if (sim?.timer) clearTimeout(sim.timer);
  for (const k in nodeEls) nodeEls[k].classList.remove("active");
  for (const e of edgeMap.values()) {
    e.path.classList.remove("active");
    e.label.classList.remove("active");
    e.path.setAttribute("marker-end", "url(#arr)");
  }
  const result = runDFA(s);
  sim = {input: s, pos: 0, result};
  setStatus("running", s.length === 0 ? "Empty string" : "Running...");
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
  if (sim.pos >= sim.input.length) {
    setTimeout(finishSim, 300);
    return;
  }
  sim.timer = setTimeout(tick, 500);
}

function finishSim() {
  if (!sim) return;
  if (sim.result.accepted) setStatus("accept", `✓ Accepted — ended in ${sim.result.final}`);
  else setStatus("reject", `✗ Rejected — ended in ${sim.result.final}`);
  renderTape(sim.input, sim.input.length, false);
}

function validateInstant() {
  const s = inputEl.value;
  if (!alphabetRegex().test(s)) {
    setStatus("reject", `Invalid input — use only ${DFA.alphabet.join(" and ")}`);
    return;
  }
  if (sim?.timer) clearTimeout(sim.timer);
  sim = null;
  for (const k in nodeEls) nodeEls[k].classList.remove("active");
  for (const e of edgeMap.values()) {
    e.path.classList.remove("active");
    e.label.classList.remove("active");
    e.path.setAttribute("marker-end", "url(#arr)");
  }
  const result = runDFA(s);
  highlightState(result.final);
  renderTape(s, s.length, false);
  if (result.accepted) setStatus("accept", `✓ Accepted — ended in ${result.final}`);
  else setStatus("reject", `✗ Rejected — ended in ${result.final}`);
}

function loadDFA(key) {
  currentKey = key;
  DFA = DFAS[key];
  inputEl.value = "";
  inputEl.placeholder = DFA.placeholder;
  regexEl.textContent = DFA.regex;
  alphabetEl.textContent = `Σ = { ${DFA.alphabet.join(", ")} }   ·   ${DFA.label}`;
  switchBtn.textContent = `Switch RegEx ⇄ (now: ${DFA.label})`;
  examplesEl.innerHTML = "";
  for (const ex of DFA.examples) {
    const b = document.createElement("button");
    b.textContent = ex.s + (ex.ok ? " ✓" : " ✗");
    b.style.color = ex.ok ? "var(--accept)" : "var(--reject)";
    b.onclick = () => { inputEl.value = ex.s; startAnimated(); };
    examplesEl.appendChild(b);
  }
  renderDiagram();
  reset();
  renderGrammarModal();
  document.getElementById("deriv-input").placeholder = DFA.placeholder;
  document.getElementById("deriv-trace").innerHTML = '<span style="color:var(--dim); font-style:italic">type a string above and click Derive</span>';
  document.getElementById("deriv-trace").className = "derivation-trace";
}

function toggleDFA() {
  loadDFA(currentKey === "dfa1" ? "dfa2" : "dfa1");
}

const cfgModal = document.getElementById("cfg-modal");
const devsModal = document.getElementById("devs-modal");
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

function openCfgModal() {
  renderGrammarModal();
  cfgModal.classList.add("open");
  if (inputEl.value) derivInput.value = inputEl.value;
}
function closeCfgModal() { cfgModal.classList.remove("open"); }

function openDevsModal() { devsModal.classList.add("open"); }
function closeDevsModal() { devsModal.classList.remove("open"); }

document.getElementById("show-cfg").onclick = openCfgModal;
document.getElementById("modal-close").onclick = closeCfgModal;
cfgModal.addEventListener("click", (e) => { if (e.target === cfgModal) closeCfgModal(); });

document.getElementById("show-devs").onclick = openDevsModal;
document.getElementById("devs-close").onclick = closeDevsModal;
devsModal.addEventListener("click", (e) => { if (e.target === devsModal) closeDevsModal(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCfgModal(); closeDevsModal(); }
});

function isTerminal(tok) { return tok === "" || /^[a-z0-9]$/.test(tok); }

function deriveString(grammar, input) {
  let steps = 0;
  const MAX = 50000;
  const trace = [];

  function expand(prefix, remaining, consumed) {
    if (++steps > MAX) return false;
    if (remaining.length === 0) return consumed === input.length;
    const NT = remaining[0];
    if (!grammar.rules[NT]) return false;
    for (const expansion of grammar.rules[NT]) {
      const newTail = [...expansion, ...remaining.slice(1)];
      let i = 0, c = consumed, ok = true;
      const newPrefix = [...prefix];
      while (i < newTail.length && isTerminal(newTail[i])) {
        if (newTail[i] === "") { i++; continue; }
        if (c >= input.length || newTail[i] !== input[c]) { ok = false; break; }
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
    derivTrace.innerHTML = `<div>✗ String <b>"${input || "ε"}"</b> is rejected by the DFA.</div>` +
      `<div style="margin-top:8px; color:var(--dim); font-style:italic">No derivation exists in this grammar.</div>`;
    return;
  }

  const trace = deriveString(DFA.grammar, input);
  if (!trace) {
    derivTrace.className = "derivation-trace fail";
    derivTrace.textContent = "Derivation search failed.";
    return;
  }

  derivTrace.className = "derivation-trace success";
  derivTrace.innerHTML = "";
  trace.forEach((form, idx) => {
    const row = document.createElement("div");
    row.className = "step" + (idx === trace.length - 1 ? " final" : "");
    const num = `<span class="step-num">${idx}</span>`;
    const arrow = idx === 0 ? "" : `<span class="arrow-d">⇒</span>`;
    let body = "";
    if (form.length === 0) {
      body = `<span class="epsilon">ε</span>`;
    } else {
      for (const tok of form) {
        if (tok === "") body += `<span class="epsilon">ε</span>`;
        else if (/[A-Z]/.test(tok)) body += `<span class="nonterm">${tok}</span>`;
        else body += `<span class="terminal">${tok}</span>`;
      }
    }
    row.innerHTML = num + arrow + body;
    derivTrace.appendChild(row);
  });
}

derivBtn.onclick = () => renderDerivation(derivInput.value);
derivInput.addEventListener("keydown", (e) => { if (e.key === "Enter") renderDerivation(derivInput.value); });

document.getElementById("validate").onclick = validateInstant;
document.getElementById("simulate").onclick = startAnimated;
document.getElementById("reset").onclick = reset;
inputEl.addEventListener("input", () => {
  if (sim) {
    if (sim.timer) clearTimeout(sim.timer);
    sim = null;
    for (const k in nodeEls) nodeEls[k].classList.remove("active");
    for (const e of edgeMap.values()) {
      e.path.classList.remove("active");
      e.label.classList.remove("active");
      e.path.setAttribute("marker-end", "url(#arr)");
    }
    highlightState(DFA.start);
    setStatus("", "Idle");
  }
  renderTape(inputEl.value, 0, false);
});
switchBtn.onclick = toggleDFA;

loadDFA("dfa1");
