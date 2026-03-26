const music = document.getElementById("bgMusic");
let canProceed = false;
let heartRainInterval = null;

/* TOAST */
function showToast(msg, duration = 3000) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("show")));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

/* MUSIC */
function playOnce(file, onEnd) {
  music.src = file;
  music.loop = false;
  music.play().catch(() => {});
  music.onended = onEnd || null;
}
function playLoop(file) {
  music.src = file;
  music.loop = true;
  music.play().catch(() => {});
}
function stopMusic() {
  music.pause();
  music.src = "";
  music.onended = null;
}

/* HELPERS */
function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }

/* START */
function startJourney() {
  hide("start");
  show("scene1");
}

/* SCENE 2 */
function scene2() {
  hide("scene1");
  show("scene2");
  canProceed = false;

  const btn = document.getElementById("nextBtn");
  btn.classList.add("locked");

  setTimeout(() => {
    const msg = document.getElementById("waitMsg");
    if (msg) msg.style.display = "block";
  }, 1200);

  playOnce("intro.mp3", () => {
    canProceed = true;
    btn.classList.remove("locked");
    showToast("🎵 The moment is yours now... Go closer ❤️", 3500);
  });
}

/* NEXT BUTTON */
function handleNextClick() {
  if (!canProceed) {
    showToast("🎵 Listen to the song till the end... 🎶", 3000);
    return;
  }
  goToPuzzle();
}

/* PUZZLE */
function goToPuzzle() {
  hide("scene2");
  show("puzzle");
  playLoop("suspense.mp3");
}

function checkAnswer() {
  const ans = document.getElementById("answer1").value.toLowerCase().trim();
  if (ans === "love") {
    stopMusic();
    hide("puzzle");
    finalScene();
  } else {
    const input = document.getElementById("answer1");
    input.style.animation = "none";
    input.offsetHeight;
    input.style.animation = "shake 0.4s ease";
    showToast("😔 Not quite... Try again! 💭", 2500);
    setTimeout(() => { input.style.animation = ""; }, 500);
  }
}

const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform: translateX(0); }
    20%    { transform: translateX(-8px); }
    40%    { transform: translateX(8px); }
    60%    { transform: translateX(-6px); }
    80%    { transform: translateX(6px); }
  }`;
document.head.appendChild(shakeStyle);

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("answer1");
  if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });
});

/* FINAL SCENE */
function finalScene() {
  show("final");
  playLoop("love.mp3");

  const boy   = document.getElementById("boyFinal");
  const girl  = document.getElementById("girlFinal");
  const burst = document.getElementById("heartBurst");

  // Walk toward each other
  setTimeout(() => {
    boy.classList.add("move-to-center-boy");
    girl.classList.add("move-to-center-girl");
  }, 600);

  // Hug + burst + rain
  setTimeout(() => {
    boy.classList.add("hug");
    girl.classList.add("girl-hug");

    burst.innerHTML = "💖";
    burst.classList.add("burst-animate");
    setTimeout(() => {
      burst.classList.remove("burst-animate");
      burst.innerHTML = "";
    }, 1000);

    createParticles();
    startHeartRain();
    showToast("🎶 Listen to the song till the end 🎵", 4000);
  }, 2800);

  // Glow
  setTimeout(() => {
    boy.classList.add("glow-boy");
    girl.classList.add("glow-girl");
  }, 4000);

  music.onended = () => stopHeartRain();
}

/* HEART RAIN */
function startHeartRain() {
  const container = document.getElementById("heartRain");
  const hearts = ["💖","💕","💗","💓","🌹","✨","💝","💞"];

  function spawnHeart() {
    const h = document.createElement("div");
    h.className = "rain-heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const dur   = (Math.random() * 3 + 2.5).toFixed(2) + "s";
    const delay = (Math.random() * 0.5).toFixed(2) + "s";
    h.style.setProperty("--size",  (Math.random() * 1.4 + 0.8).toFixed(2) + "rem");
    h.style.setProperty("--dur",   dur);
    h.style.setProperty("--delay", delay);
    h.style.setProperty("--rot1",  (Math.random() * 30 - 15).toFixed(0) + "deg");
    h.style.setProperty("--rot2",  (Math.random() * 60 - 30).toFixed(0) + "deg");
    h.style.left   = (Math.random() * 100).toFixed(1) + "%";
    h.style.bottom = "-40px";
    container.appendChild(h);
    setTimeout(() => h.remove(), (parseFloat(dur) + parseFloat(delay)) * 1000 + 300);
  }

  heartRainInterval = setInterval(spawnHeart, 220);

  let burstCount = 0;
  const burstInterval = setInterval(() => {
    createParticles();
    if (++burstCount >= 10) clearInterval(burstInterval);
  }, 3000);
}

function stopHeartRain() {
  if (heartRainInterval) {
    clearInterval(heartRainInterval);
    heartRainInterval = null;
  }
}

/* PARTICLES */
function createParticles() {
  const symbols = ["💖","💕","✨","💫","🌸","💗"];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = "50%";
    p.style.top  = "50%";
    const angle = (i / 24) * 2 * Math.PI + (Math.random() * 0.5);
    const dist  = 120 + Math.random() * 180;
    p.style.setProperty("--px", (Math.cos(angle) * dist).toFixed(1) + "px");
    p.style.setProperty("--py", (Math.sin(angle) * dist).toFixed(1) + "px");
    p.style.animationDelay = (Math.random() * 0.2).toFixed(2) + "s";
    document.getElementById("final").appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
}