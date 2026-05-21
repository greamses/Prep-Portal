// Settings Modal functionality
const settingsModal = document.getElementById("settings-modal");

// Visualizer state and functions in global scope
window.vizState = {
  mode: "multiply",
  leftNum: 2,
  leftDen: 5,
  scalarTop: 1,
  scalarBot: 1,
  verify: 0,
  opacity: 100,
};

window.vizEl = {};

// Define vizSetMode globally
window.vizSetMode = function (mode) {
  window.vizState.mode = mode;

  const modeBtns = document.querySelectorAll(".mode-btn");
  const badge = document.getElementById("mode-badge");

  modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const modeNames = {
    multiply: "Multiply",
    divide: "Divide",
    add: "Add",
    subtract: "Subtract",
  };
  if (badge) badge.textContent = modeNames[mode] || "Multiply";

  window.vizState.verify = 0;
  window.vizState.opacity = 100;
  if (window.vizEl.sVerify) window.vizEl.sVerify.value = 0;
  if (window.vizEl.sOpacity) window.vizEl.sOpacity.value = 100;
  if (window.vizEl.vOpacity) window.vizEl.vOpacity.textContent = "100%";

  if (typeof window.vizUpdate === "function") {
    window.vizUpdate();
  }
};

// Helper function for SVG paths
window.getSlicePath = function (cx, cy, r, startAngle, endAngle) {
  if (Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.001) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  }
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};

// Check if drawing is possible
window.canDraw = function (num, den) {
  if (den <= 0) return { can: false, reason: "impossible" };
  if (num < 0) return { can: false, reason: "impossible" };
  if (!Number.isInteger(num) || !Number.isInteger(den))
    return { can: false, reason: "impossible" };
  if (den > 100) return { can: false, reason: "too big" };
  if (num / den > 12) return { can: false, reason: "too big" };
  return { can: true, reason: null };
};

// Draw visual function
window.drawVisual = function (container, num, den, colorType) {
  if (!container) return;
  container.innerHTML = "";

  const drawCheck = window.canDraw(num, den);
  const isBlue = colorType === "blue";
  const colorFill = isBlue
    ? "rgba(0, 85, 255, 0.15)"
    : "rgba(0, 165, 80, 0.15)";
  const colorStroke = isBlue ? "#0055ff" : "#00a550";

  if (!drawCheck.can) {
    const message =
      drawCheck.reason === "impossible" ? "impossible" : "too big";
    const pw = document.createElement("div");
    pw.className = "pie-wrapper";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 200 200");

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bg.setAttribute("cx", "100");
    bg.setAttribute("cy", "100");
    bg.setAttribute("r", "95");
    bg.setAttribute("fill", "white");
    bg.setAttribute("stroke", colorStroke);
    bg.setAttribute("stroke-width", "2");
    svg.appendChild(bg);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "100");
    text.setAttribute("y", "105");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute(
      "font-family",
      "'Cambria Math', 'JetBrains Mono', monospace",
    );
    text.setAttribute("font-size", message === "impossible" ? "22" : "18");
    text.setAttribute("fill", colorStroke);
    text.setAttribute("font-style", "italic");
    text.textContent = message;
    svg.appendChild(text);

    pw.appendChild(svg);
    container.appendChild(pw);
    return;
  }

  let wholes = 0,
    pieNum = 0;

  if (num > 0 && den > 0) {
    wholes = Math.min(Math.floor(num / den), 12);
    pieNum = num - wholes * den;
  }

  // Whole units as circles
  if (wholes > 0) {
    const wc = document.createElement("div");
    wc.className = "wholes-container";
    for (let i = 0; i < wholes; i++) {
      const circle = document.createElement("div");
      circle.className = `whole-circle whole-${colorType}`;
      wc.appendChild(circle);
    }
    container.appendChild(wc);
  }

  // Pie chart
  const pw = document.createElement("div");
  pw.className = "pie-wrapper";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 200 200");
  if (isBlue) svg.id = "blue-pie-svg";
  else svg.id = "green-pie-svg";

  const cx = 100,
    cy = 100,
    r = 95;

  // Background
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bg.setAttribute("cx", cx);
  bg.setAttribute("cy", cy);
  bg.setAttribute("r", r);
  bg.setAttribute("fill", "white");
  bg.setAttribute("stroke", colorStroke);
  bg.setAttribute("stroke-width", "2");
  svg.appendChild(bg);

  // Filled portion
  if (pieNum > 0 && den > 0) {
    const sa = -Math.PI / 2;
    const ea = sa + (pieNum / den) * 2 * Math.PI;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", window.getSlicePath(cx, cy, r, sa, ea));
    path.setAttribute("fill", colorFill);
    path.setAttribute("stroke", colorStroke);
    path.setAttribute("stroke-width", "1.5");
    if (isBlue) path.id = "blue-filled-path";
    svg.appendChild(path);
  }

  // Division lines
  const maxLines = isBlue ? 50 : 100;

  if (den <= maxLines) {
    for (let i = 0; i < den; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / den;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", cx + r * Math.cos(angle));
      line.setAttribute("y2", cy + r * Math.sin(angle));
      line.setAttribute("stroke", colorStroke);
      line.setAttribute("stroke-width", "1.5");
      svg.appendChild(line);
    }
  }

  pw.appendChild(svg);
  container.appendChild(pw);
};

// Update visualizer
window.vizUpdate = function () {
  const state = window.vizState;
  const el = window.vizEl;

  if (!el.leftVis || !el.rightVis) return;

  let rightNum, rightDen;
  let isEqual = false;

  // Operation symbols for display
  const opSymbols = {
    multiply: "×",
    divide: "÷",
    add: "+",
    subtract: "−",
  };
  const opSymbol = opSymbols[state.mode] || "×";

  // Calculate right fraction based on operation
  if (state.mode === "multiply") {
    rightNum = state.leftNum * state.scalarTop;
    rightDen = state.leftDen * state.scalarBot;
  } else if (state.mode === "divide") {
    rightNum = state.leftNum / state.scalarTop;
    rightDen = state.leftDen / state.scalarBot;
  } else if (state.mode === "add") {
    rightNum = state.leftNum + state.scalarTop;
    rightDen = state.leftDen + state.scalarBot;
  } else if (state.mode === "subtract") {
    rightNum = state.leftNum - state.scalarTop;
    rightDen = state.leftDen - state.scalarBot;
  }

  // Check equivalence
  const leftValue = state.leftNum / state.leftDen;
  const rightValue = rightNum / rightDen;
  isEqual = Math.abs(leftValue - rightValue) < 0.0001;

  // Update expression preview
  const previewLeftNum = document.getElementById("preview-left-num");
  const previewLeftDen = document.getElementById("preview-left-den");
  const previewMidTop = document.getElementById("preview-mid-top");
  const previewMidBot = document.getElementById("preview-mid-bot");
  const previewOp = document.getElementById("preview-op");
  const previewSign = document.getElementById("preview-sign");
  const resultNum = document.getElementById("result-num");
  const resultDen = document.getElementById("result-den");
  const settingsLeftNum = document.getElementById("settings-left-num");
  const settingsLeftDen = document.getElementById("settings-left-den");
  const settingsMidTop = document.getElementById("settings-mid-top");
  const settingsMidBot = document.getElementById("settings-mid-bot");

  // Update operation symbol
  if (previewOp) previewOp.textContent = opSymbol;

  // Update sign
  if (previewSign) {
    previewSign.textContent = isEqual ? "=" : "≠";
    previewSign.style.color = isEqual
      ? "var(--green, #059669)"
      : "var(--purple, #7c3aed)";
  }

  // Update number values
  if (previewLeftNum) previewLeftNum.textContent = state.leftNum;
  if (previewLeftDen) previewLeftDen.textContent = state.leftDen;
  if (previewMidTop) previewMidTop.textContent = state.scalarTop;
  if (previewMidBot) previewMidBot.textContent = state.scalarBot;
  if (settingsLeftNum) settingsLeftNum.textContent = state.leftNum;
  if (settingsLeftDen) settingsLeftDen.textContent = state.leftDen;
  if (settingsMidTop) settingsMidTop.textContent = state.scalarTop;
  if (settingsMidBot) settingsMidBot.textContent = state.scalarBot;

  const formatNum = (n) => {
    if (!Number.isInteger(n)) return "?";
    return Math.round(n);
  };

  // Update result
  if (resultNum) resultNum.textContent = formatNum(rightNum);
  if (resultDen) resultDen.textContent = formatNum(rightDen);

  window.drawVisual(el.leftVis, state.leftNum, state.leftDen, "blue");

  const rightDrawCheck = window.canDraw(rightNum, rightDen);
  if (!rightDrawCheck.can) {
    window.drawVisual(el.rightVis, rightNum, rightDen, "green");
    el.sVerify.disabled = true;
    el.sOpacity.disabled = true;
  } else {
    window.drawVisual(el.rightVis, rightNum, rightDen, "green");
    el.sVerify.disabled = false;
    el.sOpacity.disabled = false;
  }

  window.vizState.verify = 0;
  if (el.sVerify) el.sVerify.value = 0;
  window.vizUpdateVerify();
};

// Verify animation
window.vizUpdateVerify = function () {
  const leftSvg = document.getElementById("blue-pie-svg");
  const rightSvg = document.getElementById("green-pie-svg");
  const leftPieWrapper = leftSvg ? leftSvg.closest(".pie-wrapper") : null;
  const rightPieWrapper = rightSvg ? rightSvg.closest(".pie-wrapper") : null;

  if (!leftSvg || !rightSvg || !leftPieWrapper || !rightPieWrapper) return;

  const leftHasText = leftSvg.querySelector("text") !== null;
  const rightHasText = rightSvg.querySelector("text") !== null;

  if (leftHasText || rightHasText) return;

  const progress = window.vizState.verify / 100;
  const opacityProgress = window.vizState.opacity / 100;

  const leftRect = leftPieWrapper.getBoundingClientRect();
  const rightRect = rightPieWrapper.getBoundingClientRect();

  const distX = rightRect.left - leftRect.left;
  const distY = rightRect.top - leftRect.top;

  leftSvg.style.position = "relative";
  leftSvg.style.zIndex = progress > 0 ? "100" : "1";
  leftSvg.style.pointerEvents = "none";
  leftSvg.style.transform = `translate(${distX * progress}px, ${distY * progress}px)`;

  const blueBg = leftSvg.querySelector(
    'circle[fill="white"], circle[fill^="rgba"]',
  );
  const bluePath = leftSvg.querySelector("path");
  const blueLines = leftSvg.querySelectorAll("line");

  if (progress > 0) {
    if (blueBg) {
      const bgOpacity = 1 - opacityProgress;
      blueBg.setAttribute(
        "fill",
        bgOpacity <= 0.01 ? "transparent" : `rgba(255, 255, 255, ${bgOpacity})`,
      );
    }

    if (bluePath) {
      const fillOpacity = (1 - opacityProgress) * 0.15;
      bluePath.setAttribute(
        "fill",
        fillOpacity <= 0.01
          ? "transparent"
          : `rgba(0, 85, 255, ${fillOpacity})`,
      );
    }

    const lineOpacity = Math.max(0.3, 1 - opacityProgress * 0.7);
    blueLines.forEach((line) => {
      line.style.opacity = lineOpacity;
    });
  }

  rightSvg.style.position = "relative";
  rightSvg.style.zIndex = "1";
  rightSvg.style.opacity = "1";

  const rightPaths = rightSvg.querySelectorAll("path, line, circle");
  rightPaths.forEach((el) => {
    el.style.opacity = "1";
    el.style.visibility = "visible";
  });

  if (progress === 0) {
    leftSvg.style.transform = "translate(0px, 0px)";
    leftSvg.style.opacity = "1";
    leftSvg.style.zIndex = "1";
    leftSvg.style.pointerEvents = "auto";

    if (blueBg) blueBg.setAttribute("fill", "white");
    if (bluePath) bluePath.setAttribute("fill", "rgba(0, 85, 255, 0.15)");
    blueLines.forEach((line) => (line.style.opacity = "1"));
  }
};

// Update opacity only
window.vizUpdateOpacity = function () {
  const leftSvg = document.getElementById("blue-pie-svg");
  if (!leftSvg) return;

  const leftHasText = leftSvg.querySelector("text") !== null;
  if (leftHasText) return;

  const opacityProgress = window.vizState.opacity / 100;

  const blueBg = leftSvg.querySelector(
    'circle[fill="white"], circle[fill^="rgba"]',
  );
  const bluePath = leftSvg.querySelector("path");
  const blueLines = leftSvg.querySelectorAll("line");

  if (blueBg) {
    const bgOpacity = 1 - opacityProgress;
    blueBg.setAttribute(
      "fill",
      bgOpacity <= 0.01 ? "transparent" : `rgba(255, 255, 255, ${bgOpacity})`,
    );
  }

  if (bluePath) {
    const fillOpacity = (1 - opacityProgress) * 0.15;
    bluePath.setAttribute(
      "fill",
      fillOpacity <= 0.01 ? "transparent" : `rgba(0, 85, 255, ${fillOpacity})`,
    );
  }

  const lineOpacity = Math.max(0.3, 1 - opacityProgress * 0.7);
  blueLines.forEach((line) => (line.style.opacity = lineOpacity));
};

// Initialize visualizer
function initVisualizer() {
  window.vizEl = {
    sLeftNum: document.getElementById("s-left-num"),
    sLeftDen: document.getElementById("s-left-den"),
    sScalarTop: document.getElementById("s-mid-top"),
    sScalarBot: document.getElementById("s-mid-bot"),
    sVerify: document.getElementById("verify-slider"),
    sOpacity: document.getElementById("opacity-slider"),
    vOpacity: document.getElementById("val-opacity"),
    leftVis: document.getElementById("left-vis"),
    rightVis: document.getElementById("right-vis"),
  };

  const sliders = [
    window.vizEl.sLeftNum,
    window.vizEl.sLeftDen,
    window.vizEl.sScalarTop,
    window.vizEl.sScalarBot,
  ];

  sliders.forEach((s) => {
    if (!s) return;
    s.addEventListener("input", (e) => {
      const id = e.target.id;
      if (id === "s-left-num")
        window.vizState.leftNum = parseInt(e.target.value);
      if (id === "s-left-den")
        window.vizState.leftDen = parseInt(e.target.value);
      if (id === "s-mid-top")
        window.vizState.scalarTop = parseInt(e.target.value);
      if (id === "s-mid-bot")
        window.vizState.scalarBot = parseInt(e.target.value);
      window.vizState.verify = 0;
      window.vizState.opacity = 100;
      if (window.vizEl.sVerify) window.vizEl.sVerify.value = 0;
      if (window.vizEl.sOpacity) window.vizEl.sOpacity.value = 100;
      if (window.vizEl.vOpacity) window.vizEl.vOpacity.textContent = "100%";
      window.vizUpdate();
    });
  });

  if (window.vizEl.sVerify) {
    window.vizEl.sVerify.addEventListener("input", (e) => {
      window.vizState.verify = parseInt(e.target.value);
      window.vizUpdateVerify();
    });
  }

  if (window.vizEl.sOpacity) {
    window.vizEl.sOpacity.addEventListener("input", (e) => {
      window.vizState.opacity = parseInt(e.target.value);
      if (window.vizEl.vOpacity) {
        window.vizEl.vOpacity.textContent = window.vizState.opacity + "%";
      }
      if (window.vizState.verify > 0) {
        window.vizUpdateVerify();
      } else {
        window.vizUpdateOpacity();
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.vizState.verify > 0) window.vizUpdateVerify();
  });

  window.vizUpdate();
}

// Settings Modal functions
function openSettings() {
  document.querySelector(".site-nav").classList.add("hidden");
  settingsModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Update settings values to match current state
  const settingsLeftNum = document.getElementById("settings-left-num");
  const settingsLeftDen = document.getElementById("settings-left-den");
  const settingsMidTop = document.getElementById("settings-mid-top");
  const settingsMidBot = document.getElementById("settings-mid-bot");
  const previewLeftNum = document.getElementById("preview-left-num");
  const previewLeftDen = document.getElementById("preview-left-den");
  const previewMidTop = document.getElementById("preview-mid-top");
  const previewMidBot = document.getElementById("preview-mid-bot");
  const previewOp = document.getElementById("preview-op");

  if (settingsLeftNum) settingsLeftNum.textContent = window.vizState.leftNum;
  if (settingsLeftDen) settingsLeftDen.textContent = window.vizState.leftDen;
  if (settingsMidTop) settingsMidTop.textContent = window.vizState.scalarTop;
  if (settingsMidBot) settingsMidBot.textContent = window.vizState.scalarBot;
  if (previewLeftNum) previewLeftNum.textContent = window.vizState.leftNum;
  if (previewLeftDen) previewLeftDen.textContent = window.vizState.leftDen;
  if (previewMidTop) previewMidTop.textContent = window.vizState.scalarTop;
  if (previewMidBot) previewMidBot.textContent = window.vizState.scalarBot;

  // Update operation symbol
  const opSymbols = {
    multiply: "×",
    divide: "÷",
    add: "+",
    subtract: "−",
  };
  const opSymbol = opSymbols[window.vizState.mode] || "×";
  if (previewOp) previewOp.textContent = opSymbol;
}

function closeSettings() {
  document.querySelector(".site-nav").classList.remove("hidden");
  settingsModal.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && settingsModal.classList.contains("active")) {
    closeSettings();
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initVisualizer();

  // Ticker setup
  const track = document.getElementById("ticker-track");
  if (track) {
    const items = [
      "FRACTION MULTIPLICATION",
      "FRACTION DIVISION",
      "FRACTION ADDITION",
      "FRACTION SUBTRACTION",
      "VISUAL LEARNING",
      "INTERACTIVE PIE CHARTS",
    ];
    const html = items
      .map((item) => `<span class="ticker-item">${item}</span>`)
      .join("");
    track.innerHTML = html + html;
  }

  // Loader
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => (loader.style.display = "none"), 300);
    }
  });
});
