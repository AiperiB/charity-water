const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const oxygenFill = document.getElementById("oxygenFill");
const oxygenValue = document.getElementById("oxygenValue");
const livesValue = document.getElementById("livesValue");
const litersValue = document.getElementById("litersValue");
const levelValue = document.getElementById("levelValue");
const canFill = document.getElementById("canFill");
const levelFact = document.getElementById("levelFact");
const titleScreen = document.getElementById("titleScreen");
const transitionScreen = document.getElementById("transitionScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winScreen = document.getElementById("winScreen");
const transitionTitle = document.getElementById("transitionTitle");
const transitionBody = document.getElementById("transitionBody");
const gameOverText = document.getElementById("gameOverText");
const winText = document.getElementById("winText");

const playBtn = document.getElementById("playBtn");
const learnBtn = document.getElementById("learnBtn");
const continueBtn = document.getElementById("continueBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const donateBtn = document.getElementById("donateBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const shareBtn = document.getElementById("shareBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const facts = [
  {
    contaminant: "Sediment",
    text: "Dirt makes water cloudy but is easy to filter.",
    color: "#bf6c46",
  },
  {
    contaminant: "Chlorine",
    text: "Too much chlorine can irritate skin and stomachs.",
    color: "#ffc907",
  },
  {
    contaminant: "Lead",
    text: "Lead can damage children's brains and nervous systems.",
    color: "#1a1a1a",
  },
  {
    contaminant: "Microplastics",
    text: "Tiny plastics can travel through entire water systems.",
    color: "#77a8bb",
  },
  {
    contaminant: "Arsenic",
    text: "Arsenic has no taste, smell, or color, but it is poisonous.",
    color: "#c05d35",
  },
  {
    contaminant: "E. coli",
    text: "E. coli can cause dangerous diarrhea and dehydration.",
    color: "#77a8bb",
  },
  {
    contaminant: "Nitrates",
    text: "Runoff from farms can send nitrates into rivers and wells.",
    color: "#003366",
  },
  {
    contaminant: "Mercury",
    text: "Mercury harms the nervous system and builds up over time.",
    color: "#cbccd1",
  },
  {
    contaminant: "Pesticides",
    text: "Pesticides can linger in water long after they are sprayed.",
    color: "#fed8c1",
  },
  {
    contaminant: "Contamination",
    text: "Clean water is a human right, not a luxury.",
    color: "#ffc907",
  },
];

const levelConfig = [
  { ratio: 0.22, spawnMin: 1300, spawnMax: 2100, speed: 0.9, fill: [5, 6] },
  { ratio: 0.27, spawnMin: 1150, spawnMax: 2000, speed: 1.05, fill: [5, 6] },
  { ratio: 0.32, spawnMin: 1050, spawnMax: 1850, speed: 1.18, fill: [5, 6] },
  { ratio: 0.33, spawnMin: 1000, spawnMax: 1750, speed: 1.3, fill: [5, 7] },
  { ratio: 0.38, spawnMin: 900, spawnMax: 1650, speed: 1.42, fill: [5, 7] },
  { ratio: 0.44, spawnMin: 850, spawnMax: 1500, speed: 1.55, fill: [6, 7] },
  { ratio: 0.48, spawnMin: 780, spawnMax: 1400, speed: 1.7, fill: [6, 8] },
  { ratio: 0.5, spawnMin: 720, spawnMax: 1300, speed: 1.85, fill: [6, 8] },
  { ratio: 0.58, spawnMin: 660, spawnMax: 1200, speed: 2.0, fill: [6, 8] },
  { ratio: 0.65, spawnMin: 600, spawnMax: 1100, speed: 2.2, fill: [7, 9] },
];

const state = {
  mode: "title",
  paused: false,
  running: false,
  width: 0,
  height: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  objects: [],
  effects: [],
  path: [],
  lastSpawnAt: 0,
  nextSpawnDelay: 1600,
  oxygen: 100,
  lives: 3,
  liters: 0,
  canFillPct: 0,
  level: 1,
  levelSlices: 0,
  levelTarget: 11,
  lastTime: 0,
  flash: 0,
  scoreEffects: [],
};

let frameId = 0;

function startLoop() {
  if (!frameId) {
    frameId = window.requestAnimationFrame(tick);
  }
}

function stopLoop() {
  if (frameId) {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  }
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  state.width = rect.width;
  state.height = rect.height;
  canvas.width = Math.round(rect.width * state.dpr);
  canvas.height = Math.round(rect.height * state.dpr);
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function currentConfig() {
  return levelConfig[Math.min(state.level - 1, levelConfig.length - 1)];
}

function setScreen(which) {
  for (const screen of [titleScreen, transitionScreen, gameOverScreen, winScreen]) {
    screen.classList.remove("screen-visible");
  }
  if (which) {
    which.classList.add("screen-visible");
  }
}

function updateHud() {
  const oxygen = Math.max(0, Math.min(100, state.oxygen));
  oxygenFill.style.width = `${oxygen}%`;
  oxygenValue.textContent = `${Math.round(oxygen)}%`;
  livesValue.textContent = `${state.lives}`;
  litersValue.textContent = `${state.liters}`;
  levelValue.textContent = `${state.level}`;
  const fill = Math.max(0, Math.min(100, state.canFillPct));
  canFill.style.height = `${fill}%`;
  canFill.style.width = `100%`;
}

function setFact() {
  const fact = facts[Math.min(state.level - 1, facts.length - 1)];
  levelFact.textContent = fact.text;
}

function resetLevelProgress() {
  state.objects = [];
  state.effects = [];
  state.path = [];
  state.levelSlices = 0;
  state.canFillPct = 0;
  state.lastSpawnAt = 0;
  state.nextSpawnDelay = rand(currentConfig().spawnMin, currentConfig().spawnMax);
  setFact();
  updateHud();
}

function startGame() {
  state.mode = "playing";
  state.running = true;
  state.paused = false;
  state.oxygen = 100;
  state.lives = 3;
  state.liters = 0;
  state.level = 1;
  state.lastTime = performance.now();
  resetLevelProgress();
  setScreen(null);
  pauseBtn.textContent = "Pause";
  startLoop();
}

function restartGame() {
  state.mode = "playing";
  state.running = true;
  state.paused = false;
  state.oxygen = 100;
  state.lives = 3;
  state.liters = 0;
  state.level = 1;
  state.lastTime = performance.now();
  resetLevelProgress();
  setScreen(null);
  pauseBtn.textContent = "Pause";
  startLoop();
}

function pauseGame() {
  if (state.mode !== "playing") {
    return;
  }
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
}

function openLearnMore() {
  window.open("https://www.charitywater.org/", "_blank", "noopener,noreferrer");
}

function openDonate() {
  window.open("https://www.charitywater.org/donate", "_blank", "noopener,noreferrer");
}

function shareScore() {
  const message = `I saved ${state.liters} liters in Captain H2O.`;
  if (navigator.share) {
    navigator.share({ title: "Captain H2O", text: message, url: window.location.href }).catch(() => {});
    return;
  }
  navigator.clipboard?.writeText(message).catch(() => {});
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickType() {
  const config = currentConfig();
  return Math.random() < config.ratio ? "toxin" : "h2o";
}

function makeObject() {
  const type = pickType();
  const config = currentConfig();
  const radius = type === "h2o" ? rand(20, 28) : rand(22, 32);
  const startX = rand(radius + 20, state.width - radius - 20);
  const travel = rand(state.height * 0.72, state.height * 1.02);
  const baseSpeed = travel / 1000 * config.speed;
  const drift = rand(-0.45, 0.45);
  const vx = drift * rand(0.4, 1.1);
  const vy = -baseSpeed * rand(0.9, 1.15);
  const wobble = rand(0, Math.PI * 2);
  const life = Math.max(6000, travel / Math.abs(vy) * 1000 + 1600);
  return {
    type,
    x: startX,
    y: state.height + radius + 10,
    vx,
    vy,
    radius,
    age: 0,
    life,
    wobble,
    sliced: false,
    color: type === "h2o" ? "#ffc907" : facts[Math.min(state.level - 1, facts.length - 1)].color,
  };
}

function spawnObject(now) {
  const config = currentConfig();
  if (state.lastSpawnAt && now - state.lastSpawnAt < state.nextSpawnDelay) {
    return;
  }
  state.lastSpawnAt = now;
  state.nextSpawnDelay = rand(config.spawnMin, config.spawnMax);
  state.objects.push(makeObject());
}

function addEffect(x, y, color, size = 18) {
  state.effects.push({ x, y, color, size, age: 0, life: 450 });
}

function addScoreEffect(amount, x, y) {
  state.scoreEffects.push({ x, y, amount, age: 0, life: 800 });
}

function sliceObject(object) {
  object.sliced = true;
  state.flash = Math.max(state.flash, object.type === "h2o" ? 0.16 : 0.32);
  if (object.type === "h2o") {
    state.liters += 1;
    state.oxygen = Math.min(100, state.oxygen + 2);
    const config = currentConfig();
    const fillAmount = rand(config.fill[0], config.fill[1]);
    state.canFillPct = Math.min(100, state.canFillPct + fillAmount);
    state.levelSlices += 1;
    addEffect(object.x, object.y, "#ffc907", 24);
    addScoreEffect(1, object.x, object.y - 10);
    // HUD pulse
    const el = document.getElementById("litersValue");
    el.classList.add("bump");
    const glow = document.querySelector(".can-glow");
    glow.classList.add("pulse");
    setTimeout(() => {
      el.classList.remove("bump");
      glow.classList.remove("pulse");
    }, 520);
    if (state.canFillPct >= 100) {
      completeLevel();
    }
  } else {
    state.lives -= 1;
    state.oxygen = Math.max(0, state.oxygen - 7);
    state.canFillPct = Math.max(0, state.canFillPct - 10);
    addEffect(object.x, object.y, "#bf6c46", 28);
    if (state.lives <= 0 || state.oxygen <= 0) {
      gameOver();
    }
  }
  updateHud();
}

function drawScoreEffects(now) {
  const toKeep = [];
  for (const s of state.scoreEffects) {
    s.age += now - (s._last || now);
    s._last = now;
    const p = s.age / s.life;
    if (p >= 1) continue;
    const alpha = 1 - p;
    const y = s.y - p * 46;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffc907';
    ctx.font = `${18 + p * 8}px "Gill Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`+${s.amount}`, s.x, y);
    ctx.restore();
    toKeep.push(s);
  }
  state.scoreEffects = toKeep;
}

function completeLevel() {
  if (state.mode !== "playing") {
    return;
  }
  state.mode = "transition";
  state.running = false;
  const fact = facts[Math.min(state.level - 1, facts.length - 1)];
  transitionTitle.textContent = `Level ${state.level} complete`;
  transitionBody.textContent = `You removed ${fact.contaminant.toLowerCase()} and learned how it affects water quality.`;
  setScreen(transitionScreen);
}

function gameOver() {
  if (state.mode !== "playing") {
    return;
  }
  state.mode = "gameover";
  state.running = false;
  gameOverText.textContent = `You saved ${state.liters} liters before running out of oxygen or lives.`;
  setScreen(gameOverScreen);
}

function winGame() {
  state.mode = "win";
  state.running = false;
  winText.textContent = `You saved ${state.liters} liters across all 10 levels and helped deliver clean water.`;
  setScreen(winScreen);
}

function advanceLevel() {
  if (state.level >= 10) {
    winGame();
    return;
  }
  state.level += 1;
  state.mode = "playing";
  state.running = true;
  state.paused = false;
  state.canFillPct = 0;
  state.levelSlices = 0;
  pauseBtn.textContent = "Pause";
  setScreen(null);
  resetLevelProgress();
  updateHud();
  startLoop();
}

function update(dt, now) {
  if (state.mode !== "playing" || state.paused) {
    return;
  }

  state.oxygen = Math.max(0, state.oxygen - dt * 0.05);
  if (state.oxygen <= 0) {
    gameOver();
    return;
  }

  spawnObject(now);

  const nextObjects = [];
  for (const object of state.objects) {
    object.age += dt;
    object.x += object.vx * dt;
    object.y += object.vy * dt;
    object.x += Math.sin((object.age + object.wobble) / 260) * 0.16;

    if (!object.sliced && object.y + object.radius < 0) {
      if (object.type === "toxin") {
        state.lives -= 1;
        state.oxygen = Math.max(0, state.oxygen - 8);
        addEffect(object.x, 18, "#bf6c46", 24);
        if (state.lives <= 0 || state.oxygen <= 0) {
          gameOver();
          return;
        }
      }
      updateHud();
      continue;
    }

    if (!object.sliced) {
      nextObjects.push(object);
    }
  }
  state.objects = nextObjects;

  state.effects = state.effects.filter((effect) => {
    effect.age += dt;
    return effect.age < effect.life;
  });

  if (state.flash > 0) {
    state.flash = Math.max(0, state.flash - dt * 0.0009);
  }

  updateHud();
}

function drawBackground(time) {
  const width = state.width;
  const height = state.height;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#003366");
  gradient.addColorStop(0.55, "#77a8bb");
  gradient.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const skyline = height * 0.66;
  ctx.fillStyle = "rgba(255,255,255,0.02)";
  ctx.fillRect(0, skyline, width, height - skyline);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const waveY = height * 0.72 + Math.sin(time / 1200) * 8;
  const wave = ctx.createLinearGradient(0, waveY, 0, height);
  wave.addColorStop(0, "rgba(119, 168, 187, 0.1)");
  wave.addColorStop(1, "rgba(119, 168, 187, 0.03)");
  ctx.fillStyle = wave;
  ctx.fillRect(0, waveY, width, height - waveY);

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = "#ffc907";
  ctx.beginPath();
  ctx.arc(width * 0.18, height * 0.18, 70 + Math.sin(time / 1500) * 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.14, 90 + Math.cos(time / 1400) * 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawObject(object) {
  ctx.save();
  ctx.translate(object.x, object.y);

  if (object.type === "h2o") {
    ctx.shadowColor = "rgba(255, 201, 7, 0.5)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffc907";
    ctx.beginPath();
    ctx.arc(0, 0, object.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(-object.radius * 0.32, -object.radius * 0.18, object.radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(object.radius * 0.24, -object.radius * 0.05, object.radius * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(7, 19, 31, 0.7)";
    ctx.beginPath();
    ctx.arc(0, 0, object.radius * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = object.color;
    ctx.beginPath();
    ctx.moveTo(0, -object.radius);
    ctx.lineTo(object.radius * 0.8, -object.radius * 0.2);
    ctx.lineTo(object.radius * 0.5, object.radius * 0.9);
    ctx.lineTo(-object.radius * 0.7, object.radius * 0.8);
    ctx.lineTo(-object.radius, -object.radius * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(-object.radius * 0.25, -object.radius * 0.15, object.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawEffect(effect) {
  const progress = effect.age / effect.life;
  const radius = effect.size + progress * 42;
  ctx.save();
  ctx.globalAlpha = 1 - progress;
  ctx.strokeStyle = effect.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = effect.color;
  ctx.beginPath();
  ctx.arc(effect.x, effect.y, Math.max(2, 6 - progress * 5), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPath() {
  if (state.path.length < 2) {
    return;
  }
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(244, 197, 66, 0.7)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(state.path[0].x, state.path[0].y);
  for (let i = 1; i < state.path.length; i += 1) {
    ctx.lineTo(state.path[i].x, state.path[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

function render(now) {
  drawBackground(now);
  drawPath();

  for (const object of state.objects) {
    drawObject(object);
  }

  for (const effect of state.effects) {
    drawEffect(effect);
  }

  drawScoreEffects(now);

  if (state.flash > 0) {
    ctx.save();
    ctx.fillStyle = state.flash > 0.24 ? "rgba(251, 109, 88, 0.18)" : "rgba(244, 197, 66, 0.1)";
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.restore();
  }
}

function intersectSegment(ax, ay, bx, by, object) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((object.x - ax) * dx + (object.y - ay) * dy) / lengthSquared));
  const closestX = ax + dx * t;
  const closestY = ay + dy * t;
  const distance = Math.hypot(object.x - closestX, object.y - closestY);
  return distance <= object.radius + 8;
}

function processSlice(point) {
  if (state.mode !== "playing" || state.paused) {
    return;
  }

  const lastPoint = state.path[state.path.length - 1];
  state.path.push(point);
  if (state.path.length > 8) {
    state.path.shift();
  }

  const segments = [];
  if (lastPoint) {
    segments.push([lastPoint, point]);
  }

  for (const [from, to] of segments) {
    for (const object of state.objects) {
      if (object.sliced) {
        continue;
      }
      if (intersectSegment(from.x, from.y, to.x, to.y, object)) {
        object.sliced = true;
        sliceObject(object);
      }
    }
  }

  state.objects = state.objects.filter((object) => !object.sliced);
}

function pointerPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left),
    y: (event.clientY - rect.top),
  };
}

let pointerActive = false;

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode !== "playing") {
    return;
  }
  pointerActive = true;
  canvas.setPointerCapture(event.pointerId);
  state.path = [pointerPoint(event)];
});

canvas.addEventListener("pointermove", (event) => {
  if (!pointerActive) {
    return;
  }
  processSlice(pointerPoint(event));
});

canvas.addEventListener("pointerup", () => {
  pointerActive = false;
  state.path = [];
});

canvas.addEventListener("pointercancel", () => {
  pointerActive = false;
  state.path = [];
});

playBtn.addEventListener("click", startGame);
learnBtn.addEventListener("click", openLearnMore);
continueBtn.addEventListener("click", advanceLevel);
tryAgainBtn.addEventListener("click", restartGame);
donateBtn.addEventListener("click", openDonate);
playAgainBtn.addEventListener("click", restartGame);
shareBtn.addEventListener("click", shareScore);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    pauseGame();
  }
  if (event.key.toLowerCase() === "r") {
    restartGame();
  }
  if (event.key === "Escape" && state.mode === "playing") {
    state.mode = "title";
    state.running = false;
    setScreen(titleScreen);
  }
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

function tick(now) {
  if (!state.lastTime) {
    state.lastTime = now;
  }
  const dt = Math.min(48, now - state.lastTime);
  state.lastTime = now;

  if (state.mode === "playing") {
    update(dt, now);
  }
  render(now);
  if (state.mode === "playing") {
    frameId = window.requestAnimationFrame(tick);
  } else {
    frameId = 0;
  }
}

resizeCanvas();
updateHud();
setFact();
setScreen(titleScreen);
render(performance.now());

// Keep a visible call to action from the title screen.
setTimeout(() => {
  if (state.mode === "title") {
    levelFact.textContent = "Swipe to purify, then share the liters you saved.";
  }
}, 1500);
