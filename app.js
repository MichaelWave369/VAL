const MS_PER_DAY = 86_400_000;

const CYCLES = {
  tropicalYear: 365.2422,
  siderealMonth: 27.321661,
  synodicMonth: 29.530588853,
  draconicMonth: 27.212220817,
  metonicMonths: 235,
  sarosMonths: 223,
};

const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);
const zodiacNames = ["AR", "TA", "GE", "CN", "LE", "VI", "LI", "SC", "SA", "CP", "AQ", "PI"];

let latestReceipt = null;

const modelModes = {
  conservative: {
    id: "conservative",
    name: "Conservative teaching model",
    confidence: "preserved",
    label: "grounded",
    use:
      "Shows the strongest educational layer: date input, Sun/Moon pointers, Moon phase, Metonic, Saros, Exeligmos, and explicit approximation boundaries.",
    denied: "Does not claim exact preserved gear layout, complete reconstruction, or precision astronomy.",
    outputs: [
      "Sun pointer approximation",
      "Moon pointer approximation",
      "Moon phase display",
      "Metonic cycle position",
      "Saros cycle position",
      "Exportable JSON receipt",
    ],
  },
  cycle: {
    id: "cycle",
    name: "Cycle-forward reconstruction",
    confidence: "inferred",
    label: "inferred",
    use:
      "Emphasizes how known cycle ideas can be interpreted as dial behavior while keeping the visible gear train as a labeled teaching scaffold.",
    denied: "Does not claim the SVG spirals or CSS gears are the final ancient mechanical arrangement.",
    outputs: [
      "All conservative outputs",
      "Back-dial interpretation emphasis",
      "Gear-ratio teaching table",
      "Source confidence receipts",
      "Model lane recorded in JSON",
    ],
  },
  "cosmos-preview": {
    id: "cosmos-preview",
    name: "Cosmos preview / locked lane",
    confidence: "future",
    label: "future",
    use:
      "Documents the future planet/cosmos direction without activating planet pointers or presenting disputed reconstructions as fact.",
    denied: "Does not display planet outputs yet and does not claim planetary reconstruction certainty.",
    outputs: [
      "All conservative outputs",
      "Future planet lane marker",
      "Cosmos-model receipt boundary",
      "Explicit locked-lane status",
    ],
  },
};

const gearModel = [
  {
    output: "Drive crank",
    cycle: "User date + lunar-month offset",
    status: "Educational control input",
  },
  {
    output: "Sun pointer",
    cycle: "Tropical year approximation · 365.2422 days",
    status: "Grounded concept, simplified browser math",
  },
  {
    output: "Moon pointer",
    cycle: "Sidereal month approximation · 27.321661 days",
    status: "Grounded concept, simplified browser math",
  },
  {
    output: "Moon phase",
    cycle: "Synodic month approximation · 29.530588853 days",
    status: "Grounded concept, simplified browser math",
  },
  {
    output: "Metonic dial",
    cycle: "235 synodic months · 19-year lunar calendar cycle",
    status: "Historically grounded cycle, visualized as an educational spiral",
  },
  {
    output: "Saros dial",
    cycle: "223 synodic months · eclipse-cycle position",
    status: "Historically grounded cycle, not a guaranteed eclipse event by itself",
  },
  {
    output: "Exeligmos remainder",
    cycle: "3 Saros cycles · tracks one-third-day offset compensation",
    status: "Cycle receipt only in v0.3",
  },
];

const sourceCards = [
  {
    title: "Decoding the Antikythera Mechanism",
    meta: "Nature · 2006",
    confidence: "preserved",
    label: "grounded",
    summary:
      "Foundational modern decoding work for the mechanism's inscriptions, gearing evidence, and astronomical cycle architecture.",
    use:
      "VAL uses this as a high-confidence receipt for cycle-level framing, not as permission to claim a complete machine layout.",
    tags: ["AMRP", "X-ray CT", "cycle evidence"],
    url: "https://www.nature.com/articles/nature05357",
  },
  {
    title: "Calendars, games, and eclipse prediction",
    meta: "Nature · 2008",
    confidence: "preserved",
    label: "grounded",
    summary:
      "Supports the back-dial calendar/eclipses/games context, including Metonic and Saros-style public explanations.",
    use:
      "VAL uses this for the back-dial confidence layer while still labeling the SVG spirals as educational visualization.",
    tags: ["Metonic", "Saros", "Games dial"],
    url: "https://www.nature.com/articles/nature07130",
  },
  {
    title: "A Model of the Cosmos",
    meta: "Scientific Reports · 2021",
    confidence: "inferred",
    label: "inferred",
    summary:
      "A modern reconstruction model for the front display and broader cosmos display, useful but not identical to preserved certainty.",
    use:
      "VAL keeps planet pointers and alternate cosmos layouts in the future/speculative lane until model toggles exist.",
    tags: ["reconstruction", "planet lane", "model toggle"],
    url: "https://www.nature.com/articles/s41598-021-84310-w",
  },
  {
    title: "VAL educational model boundary",
    meta: "Internal ledger · v0.3",
    confidence: "approximate",
    label: "approx",
    summary:
      "The browser math uses simplified cycles so the app can be transparent, playable, exportable, and easy to inspect.",
    use:
      "VAL receipts deny precision astronomy claims and treat eclipse windows as learning flags requiring outside verification.",
    tags: ["browser math", "receipt", "claim boundary"],
    url: "#ledger",
  },
  {
    title: "MIT License",
    meta: "Open-source release · v0.3",
    confidence: "future",
    label: "MIT",
    summary:
      "VAL is licensed so builders can fork, remix, teach, and extend the project while preserving the license notice.",
    use:
      "The license is for code reuse. It does not change the scholarly confidence boundaries of the mechanism model.",
    tags: ["open source", "forkable", "builder friendly"],
    url: "LICENSE",
  },
];

const els = {
  dateInput: document.getElementById("dateInput"),
  crankInput: document.getElementById("crankInput"),
  crankLabel: document.getElementById("crankLabel"),
  modelSelect: document.getElementById("modelSelect"),
  todayButton: document.getElementById("todayButton"),
  zodiacTicks: document.getElementById("zodiacTicks"),
  zodiacLabels: document.getElementById("zodiacLabels"),
  sunPointer: document.getElementById("sunPointer"),
  moonPointer: document.getElementById("moonPointer"),
  sunReadout: document.getElementById("sunReadout"),
  moonReadout: document.getElementById("moonReadout"),
  phaseReadout: document.getElementById("phaseReadout"),
  metonicSpiral: document.getElementById("metonicSpiral"),
  sarosSpiral: document.getElementById("sarosSpiral"),
  metonicMarker: document.getElementById("metonicMarker"),
  sarosMarker: document.getElementById("sarosMarker"),
  metonicReadout: document.getElementById("metonicReadout"),
  sarosReadout: document.getElementById("sarosReadout"),
  moonPhaseBall: document.getElementById("moonPhaseBall"),
  phaseName: document.getElementById("phaseName"),
  eclipseWindow: document.getElementById("eclipseWindow"),
  moonAge: document.getElementById("moonAge"),
  exeligmosReadout: document.getElementById("exeligmosReadout"),
  nodeReadout: document.getElementById("nodeReadout"),
  modelModeStatus: document.getElementById("modelModeStatus"),
  modelModeName: document.getElementById("modelModeName"),
  modelModeUse: document.getElementById("modelModeUse"),
  modelModeDenied: document.getElementById("modelModeDenied"),
  modelModeOutputList: document.getElementById("modelModeOutputList"),
  receiptOutput: document.getElementById("receiptOutput"),
  copyReceiptButton: document.getElementById("copyReceiptButton"),
  downloadReceiptButton: document.getElementById("downloadReceiptButton"),
  receiptActionStatus: document.getElementById("receiptActionStatus"),
  gearRows: document.getElementById("gearRows"),
  sourceCards: document.getElementById("sourceCards"),
  gears: Array.from(document.querySelectorAll(".gear")),
};

function svgEl(name, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

function normalize(value, modulo) {
  return ((value % modulo) + modulo) % modulo;
}

function normalizeDegrees(value) {
  return normalize(value, 360);
}

function fraction(value) {
  return normalize(value, 1);
}

function round(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function formatDegrees(value) {
  return `${round(normalizeDegrees(value), 2)}°`;
}

function toDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseInputDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day, 12, 0, 0);
}

function getSelectedModelMode() {
  const key = els.modelSelect?.value ?? "conservative";
  return modelModes[key] ?? modelModes.conservative;
}

function drawZodiac() {
  for (let i = 0; i < 120; i += 1) {
    const angle = (i / 120) * 360 - 90;
    const major = i % 10 === 0;
    const inner = major ? 190 : 202;
    const outer = 220;
    const a = (angle * Math.PI) / 180;
    const x1 = 250 + Math.cos(a) * inner;
    const y1 = 250 + Math.sin(a) * inner;
    const x2 = 250 + Math.cos(a) * outer;
    const y2 = 250 + Math.sin(a) * outer;
    els.zodiacTicks.appendChild(
      svgEl("line", {
        x1,
        y1,
        x2,
        y2,
        class: major ? "tick major" : "tick minor",
      }),
    );
  }

  zodiacNames.forEach((name, index) => {
    const angle = index * 30 + 15 - 90;
    const a = (angle * Math.PI) / 180;
    const x = 250 + Math.cos(a) * 164;
    const y = 250 + Math.sin(a) * 164;
    const label = svgEl("text", {
      x,
      y,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      class: "zodiac-label",
    });
    label.textContent = name;
    els.zodiacLabels.appendChild(label);
  });
}

function spiralPath(turns, startRadius, endRadius, steps = 420) {
  let path = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = (-90 + turns * 360 * t) * (Math.PI / 180);
    const radius = startRadius + (endRadius - startRadius) * t;
    const x = 160 + Math.cos(angle) * radius;
    const y = 160 + Math.sin(angle) * radius;
    path += `${i === 0 ? "M" : "L"} ${round(x, 3)} ${round(y, 3)} `;
  }
  return path;
}

function spiralPoint(turns, startRadius, endRadius, t) {
  const angle = (-90 + turns * 360 * t) * (Math.PI / 180);
  const radius = startRadius + (endRadius - startRadius) * t;
  return {
    x: 160 + Math.cos(angle) * radius,
    y: 160 + Math.sin(angle) * radius,
  };
}

function phaseLabel(phase) {
  const bands = [
    [0.03, "New Moon"],
    [0.22, "Waxing Crescent"],
    [0.28, "First Quarter"],
    [0.47, "Waxing Gibbous"],
    [0.53, "Full Moon"],
    [0.72, "Waning Gibbous"],
    [0.78, "Last Quarter"],
    [0.97, "Waning Crescent"],
    [1.01, "New Moon"],
  ];

  return bands.find(([limit]) => phase < limit)?.[1] ?? "Moon Phase";
}

function moonIllumination(phase) {
  return (1 - Math.cos(2 * Math.PI * phase)) / 2;
}

function updateMoonBall(phase) {
  const illumination = moonIllumination(phase);
  const lightStop = Math.max(8, Math.min(92, illumination * 100));
  const waxing = phase <= 0.5;
  const litSide = waxing ? "right" : "left";
  const shadowSide = waxing ? "left" : "right";

  els.moonPhaseBall.style.background = `
    radial-gradient(circle at 35% 30%, rgba(255,255,255,0.92), rgba(216,231,255,0.72) 32%, rgba(79,91,112,0.72) 68%),
    linear-gradient(90deg, ${shadowSide === "left" ? "#10141f" : "#d8e7ff"} 0 ${100 - lightStop}%, ${litSide === "right" ? "#d8e7ff" : "#10141f"} ${100 - lightStop}% 100%)
  `;
  els.moonPhaseBall.style.boxShadow = `inset ${waxing ? "-" : ""}${round(48 - illumination * 36, 1)}px 0 48px rgba(0,0,0,0.58), 0 0 ${round(22 + illumination * 42, 1)}px rgba(216,231,255,0.22)`;
}

function getModelState() {
  const baseUtc = parseInputDate(els.dateInput.value);
  const crankMonths = Number(els.crankInput.value);
  const adjustedUtc = baseUtc + crankMonths * CYCLES.synodicMonth * MS_PER_DAY;
  const days = (adjustedUtc - NEW_MOON_EPOCH) / MS_PER_DAY;
  const synodicMonths = days / CYCLES.synodicMonth;

  const sunLongitude = normalizeDegrees((days / CYCLES.tropicalYear) * 360 + 280.466);
  const moonLongitude = normalizeDegrees((days / CYCLES.siderealMonth) * 360 + 218.316);
  const phase = fraction(synodicMonths);
  const moonAge = phase * CYCLES.synodicMonth;
  const metonicIndex = Math.floor(normalize(synodicMonths, CYCLES.metonicMonths));
  const sarosIndex = Math.floor(normalize(synodicMonths, CYCLES.sarosMonths));
  const exeligmos = Math.floor(normalize(synodicMonths / CYCLES.sarosMonths, 3));
  const nodePhase = fraction(days / CYCLES.draconicMonth);
  const nodeDistance = Math.min(
    Math.abs(nodePhase - 0),
    Math.abs(nodePhase - 0.5),
    Math.abs(nodePhase - 1),
  ) * 360;
  const nearNew = phase < 0.035 || phase > 0.965;
  const nearFull = Math.abs(phase - 0.5) < 0.035;
  const nearNode = nodeDistance < 13.5;

  let eclipseMessage = "No v0.3 eclipse window flag. Saros position is still shown as cycle context.";
  if (nearNew && nearNode) {
    eclipseMessage = "Possible solar eclipse window by simplified phase + node check. Requires modern verification.";
  } else if (nearFull && nearNode) {
    eclipseMessage = "Possible lunar eclipse window by simplified phase + node check. Requires modern verification.";
  } else if (nearNew || nearFull) {
    eclipseMessage = "Strong lunar phase alignment, but node check does not pass the v0.3 eclipse-window gate.";
  } else if (nearNode) {
    eclipseMessage = "Near nodal alignment, but Moon phase is not close enough for the v0.3 eclipse-window gate.";
  }

  return {
    baseUtc,
    adjustedUtc,
    days,
    crankMonths,
    sunLongitude,
    moonLongitude,
    phase,
    moonAge,
    illumination: moonIllumination(phase),
    metonicIndex,
    sarosIndex,
    exeligmos,
    nodePhase,
    nodeDistance,
    nearNew,
    nearFull,
    nearNode,
    eclipseMessage,
  };
}

function updatePointers(state) {
  els.sunPointer.setAttribute("transform", `rotate(${state.sunLongitude} 250 250)`);
  els.moonPointer.setAttribute("transform", `rotate(${state.moonLongitude} 250 250)`);
}

function updateSpiralMarkers(state) {
  const metonicPoint = spiralPoint(5, 32, 132, state.metonicIndex / (CYCLES.metonicMonths - 1));
  const sarosPoint = spiralPoint(4, 34, 132, state.sarosIndex / (CYCLES.sarosMonths - 1));

  els.metonicMarker.setAttribute("cx", metonicPoint.x);
  els.metonicMarker.setAttribute("cy", metonicPoint.y);
  els.sarosMarker.setAttribute("cx", sarosPoint.x);
  els.sarosMarker.setAttribute("cy", sarosPoint.y);
}

function updateGears(state) {
  const rotations = {
    drive: state.days * 0.9856,
    sun: -state.sunLongitude,
    moon: state.moonLongitude * 1.35,
    saros: -(state.sarosIndex / CYCLES.sarosMonths) * 360,
    metonic: (state.metonicIndex / CYCLES.metonicMonths) * 360,
  };

  els.gears.forEach((gear) => {
    const key = gear.dataset.gear;
    gear.style.setProperty("--rotation", `${rotations[key] ?? 0}deg`);
  });
}

function updateReadouts(state) {
  const phaseName = phaseLabel(state.phase);

  els.sunReadout.textContent = formatDegrees(state.sunLongitude);
  els.moonReadout.textContent = formatDegrees(state.moonLongitude);
  els.phaseReadout.textContent = `${phaseName} · ${round(state.illumination * 100, 1)}% lit`;
  els.metonicReadout.textContent = `Month ${state.metonicIndex + 1} / ${CYCLES.metonicMonths}`;
  els.sarosReadout.textContent = `Month ${state.sarosIndex + 1} / ${CYCLES.sarosMonths}`;
  els.phaseName.textContent = phaseName;
  els.eclipseWindow.textContent = state.eclipseMessage;
  els.moonAge.textContent = `${round(state.moonAge, 2)} days`;
  els.exeligmosReadout.textContent = `Remainder ${state.exeligmos + 1} / 3`;
  els.nodeReadout.textContent = `${round(state.nodeDistance, 2)}° from node gate`;
  els.crankLabel.textContent = String(state.crankMonths);

  updateMoonBall(state.phase);
}

function updateModelLab(mode) {
  if (!els.modelModeName) return;

  els.modelModeStatus.className = `confidence ${mode.confidence}`;
  els.modelModeStatus.textContent = mode.label;
  els.modelModeName.textContent = mode.name;
  els.modelModeUse.textContent = mode.use;
  els.modelModeDenied.textContent = mode.denied;
  els.modelModeOutputList.innerHTML = mode.outputs.map((output) => `<li>${output}</li>`).join("");
}

function buildReceipt(state, mode) {
  const adjustedDate = new Date(state.adjustedUtc).toISOString().slice(0, 10);
  const inputDate = new Date(state.baseUtc).toISOString().slice(0, 10);

  return {
    project: "VAL — Virtual Antikythera Ledger",
    version: "0.3 model-lane export build",
    generated_at_utc: new Date().toISOString(),
    input_date: inputDate,
    crank_offset_lunar_months: state.crankMonths,
    effective_model_date: adjustedDate,
    active_model_lane: {
      id: mode.id,
      name: mode.name,
      confidence: mode.label,
      use: mode.use,
      denied_claim: mode.denied,
      active_outputs: mode.outputs,
    },
    outputs: {
      sun_longitude_approx_deg: Number(round(state.sunLongitude, 3)),
      moon_longitude_approx_deg: Number(round(state.moonLongitude, 3)),
      moon_phase_fraction: Number(round(state.phase, 5)),
      moon_age_days: Number(round(state.moonAge, 3)),
      metonic_position_month: `${state.metonicIndex + 1}/${CYCLES.metonicMonths}`,
      saros_position_month: `${state.sarosIndex + 1}/${CYCLES.sarosMonths}`,
      exeligmos_remainder: `${state.exeligmos + 1}/3`,
      node_distance_deg: Number(round(state.nodeDistance, 3)),
      eclipse_window_flag: state.nearNode && (state.nearNew || state.nearFull),
    },
    confidence_layer: {
      grounded: ["Metonic cycle", "Saros cycle", "lunar phase concept", "analog computation framing"],
      inferred: ["dial layout interpretation", "missing component relationships", "reconstruction model references"],
      approximate: ["browser cycle math", "SVG spiral positions", "CSS gear animation", "simplified eclipse-window check"],
      future: ["planet pointers", "alternate cosmos models", "per-source reconstruction toggles"],
    },
    sources: sourceCards.map((source) => ({
      title: source.title,
      confidence: source.label,
      use: source.use,
      url: source.url,
    })),
    license: {
      name: "MIT License",
      file: "LICENSE",
      note: "License applies to VAL project code. It does not alter the historical or scholarly confidence boundaries.",
    },
    denied_claims: ["complete preserved gear layout", "precision astronomy", "final Antikythera reconstruction", "planetary model certainty"],
  };
}

function updateReceipt(state, mode) {
  latestReceipt = buildReceipt(state, mode);
  els.receiptOutput.textContent = JSON.stringify(latestReceipt, null, 2);
}

function update() {
  const state = getModelState();
  const mode = getSelectedModelMode();
  updatePointers(state);
  updateSpiralMarkers(state);
  updateGears(state);
  updateReadouts(state);
  updateModelLab(mode);
  updateReceipt(state, mode);
}

function renderGearRows() {
  els.gearRows.innerHTML = gearModel
    .map(
      (row) => `
        <tr>
          <td><strong>${row.output}</strong></td>
          <td>${row.cycle}</td>
          <td>${row.status}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSourceCards() {
  if (!els.sourceCards) return;

  els.sourceCards.innerHTML = sourceCards
    .map(
      (source) => `
        <article class="source-card">
          <span class="confidence ${source.confidence}">${source.label}</span>
          <div>
            <h3>${source.title}</h3>
            <p><strong>${source.meta}</strong></p>
            <p>${source.summary}</p>
            <p>${source.use}</p>
          </div>
          <div class="source-chip-list">
            ${source.tags.map((tag) => `<span class="source-chip">${tag}</span>`).join("")}
          </div>
          <footer>
            <a href="${source.url}" ${source.url.startsWith("#") || source.url === "LICENSE" ? "" : 'target="_blank" rel="noopener noreferrer"'}>Open receipt</a>
          </footer>
        </article>
      `,
    )
    .join("");
}

function setActionStatus(message) {
  if (!els.receiptActionStatus) return;
  els.receiptActionStatus.textContent = message;
  window.clearTimeout(setActionStatus.timeoutId);
  setActionStatus.timeoutId = window.setTimeout(() => {
    els.receiptActionStatus.textContent = "";
  }, 3600);
}

async function copyReceipt() {
  if (!latestReceipt) return;
  const text = JSON.stringify(latestReceipt, null, 2);

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setActionStatus("Receipt JSON copied to clipboard.");
  } catch (error) {
    console.error(error);
    setActionStatus("Copy failed. You can still select the JSON manually.");
  }
}

function downloadReceipt() {
  if (!latestReceipt) return;
  const text = JSON.stringify(latestReceipt, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = latestReceipt.effective_model_date ?? "snapshot";
  const mode = latestReceipt.active_model_lane?.id ?? "model";
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `VAL_receipt_${date}_${mode}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  setActionStatus("Receipt JSON download started.");
}

function init() {
  els.dateInput.value = toDateInputValue();
  els.metonicSpiral.setAttribute("d", spiralPath(5, 32, 132));
  els.sarosSpiral.setAttribute("d", spiralPath(4, 34, 132));
  drawZodiac();
  renderGearRows();
  renderSourceCards();
  update();

  els.dateInput.addEventListener("input", update);
  els.crankInput.addEventListener("input", update);
  els.modelSelect?.addEventListener("change", update);
  els.copyReceiptButton?.addEventListener("click", copyReceipt);
  els.downloadReceiptButton?.addEventListener("click", downloadReceipt);
  els.todayButton.addEventListener("click", () => {
    els.dateInput.value = toDateInputValue();
    els.crankInput.value = "0";
    update();
  });
}

init();
