/* =========================================================
   JUSTECH CONVITES PREMIUM — script.js
   Vanilla JS. Sem dependências, sem frameworks.
   ========================================================= */

/* =========================================================
   ⚙️  PAINEL DE CONFIGURAÇÃO
   -----------------------------------------------------------
   Para reutilizar este convite em outro evento, edite APENAS
   os valores abaixo. Nada mais no código precisa ser tocado.
   ========================================================= */
const config = {

  // Imagem única que representa o convite inteiro
  backgroundImage: "assets/convite.jpg",

  // Música ambiente (mp3)
  music: "assets/music.mp3",

  // Link do Google Maps do local da festa
  mapsLink: "https://maps.google.com/?q=Local+da+Festa",

  // Número de WhatsApp que receberá a confirmação (formato: DDI+DDD+NÚMERO, só dígitos)
  whatsappNumber: "5524999999999",

  // Mensagem automática de confirmação de presença
  whatsappMessage:
    "Olá! Confirmo minha presença na festa de 15 anos.\nMeu nome é: ",

  // Áreas clicáveis invisíveis sobre a imagem do convite.
  // Cada hotspot é definido em PORCENTAGEM (0–100) em relação
  // à própria imagem — assim funciona em qualquer resolução
  // e pode ser reaproveitado trocando só os números ao criar
  // uma nova arte de convite.
  //   x, y      -> canto superior esquerdo da área clicável
  //   width, ht -> largura/altura da área clicável
  //   action    -> "maps" ou "whatsapp"
  hotspots: {
    localizacao: {
      x: 8,
      y: 78,
      width: 38,
      height: 12,
      action: "maps",
    },
    confirmacao: {
      x: 54,
      y: 78,
      width: 38,
      height: 12,
      action: "whatsapp",
    },
  },
};

/* =========================================================
   ELEMENTOS
   ========================================================= */
const splashScreen = document.getElementById("splash-screen");
const inviteScreen = document.getElementById("invite-screen");
const enterBtn = document.getElementById("enter-btn");

const inviteImage = document.getElementById("invite-image");
const hotspotsLayer = document.getElementById("hotspots-layer");
const inviteFrame = document.querySelector(".invite-frame");

const bgAudio = document.getElementById("bg-audio");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicVolume = document.getElementById("music-volume");

/* Elementos da abertura cinematográfica (envelope) */
const envelopeScene = document.getElementById("envelope-scene");
const envelopeVisual = document.getElementById("envelope-visual");
const letterCard = document.getElementById("letter-card");
const letterArt = document.getElementById("letter-art");
const letterSparkles = document.getElementById("letter-sparkles");

/* Aplica config à imagem e ao áudio */
inviteImage.src = config.backgroundImage;
letterArt.style.backgroundImage = `url(${config.backgroundImage})`;
bgAudio.src = config.music;
bgAudio.volume = parseFloat(musicVolume.value);

/* =========================================================
   TRANSIÇÃO CINEMATOGRÁFICA: ENVELOPE -> CONVITE
   -----------------------------------------------------------
   A imagem do envelope (assets/envelope.jpg) nunca é redesenhada —
   ela só é movida/escalada/desvanecida como um todo. O "abrir"
   é sugerido pelo brilho que passa sobre o laço, pela leve reação
   do envelope e pela carta que emerge e se transforma no convite.

   Sequência, disparada por um único clique:
   1) vibração leve + efeito sonoro suave (sintetizado, sem arquivo)
   2) música ambiente inicia
   3) envelope reage (aumenta levemente)
   4) carta branca sobe com brilho e glitter dourado
   5) carta ganha um leve realce ao se aproximar do topo (~70%)
   6) carta funde (fade) com a arte do convite e se expande (zoom)
      até preencher a tela — "a carta virou o convite"
   ========================================================= */
enterBtn.addEventListener("click", enterInvite);

let inviteOpened = false;

function enterInvite() {
  if (inviteOpened) return;
  inviteOpened = true;
  enterBtn.disabled = true;

  // 1) vibração leve (silenciosamente ignorada onde não houver suporte, ex.: iOS)
  if (navigator.vibrate) {
    navigator.vibrate(25);
  }
  playOpenSfx();

  // 2) música ambiente inicia junto com o gesto de abrir
  attemptPlayMusic();

  // 3) o envelope reage suavemente ao toque
  envelopeScene.classList.add("opening");
  envelopeVisual.classList.add("opening");

  // 4) carta sobe do envelope, com brilho e glitter dourado
  window.setTimeout(() => {
    letterSparkles.classList.add("active");
    letterCard.classList.add("rising");
  }, 650);

  // o envelope recua suavemente, cedendo lugar à carta
  window.setTimeout(() => {
    envelopeVisual.classList.remove("opening");
    envelopeVisual.classList.add("receding");
  }, 1450);

  // 5) leve realce ao se aproximar do topo da tela (~70%)
  window.setTimeout(() => {
    letterCard.classList.add("at-peak");
  }, 2000);

  // 6) a carta funde com o convite e se expande até tela cheia
  window.setTimeout(() => {
    letterCard.classList.add("expanding");
  }, 2450);

  // troca para a tela real do convite assim que a carta cobre a tela
  window.setTimeout(() => {
    splashScreen.setAttribute("hidden", "");
    inviteScreen.removeAttribute("hidden");
    positionHotspots();
  }, 3650);
}

/* Efeito sonoro suave de abertura, sintetizado via Web Audio API —
   evita depender de um arquivo de áudio extra. Toca dois tons
   curtos e delicados, como um leve tilintar. */
function playOpenSfx() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    [880, 1320].forEach((freq, i) => {
      const start = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.05, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });

    window.setTimeout(() => ctx.close(), 900);
  } catch (err) {
    // Se o navegador bloquear o áudio sintetizado, seguimos sem som
  }
}

/* =========================================================
   HOTSPOTS — posicionamento e ações
   ========================================================= */
function buildHotspots() {
  hotspotsLayer.innerHTML = "";

  Object.entries(config.hotspots).forEach(([name, spot]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hotspot";
    btn.dataset.name = name;
    btn.setAttribute("aria-label", hotspotLabel(name, spot.action));

    btn.style.left = spot.x + "%";
    btn.style.top = spot.y + "%";
    btn.style.width = spot.width + "%";
    btn.style.height = spot.height + "%";

    btn.addEventListener("click", () => handleHotspotAction(spot.action));
    hotspotsLayer.appendChild(btn);
  });
}

function hotspotLabel(name, action) {
  if (action === "maps") return "Ver localização no mapa";
  if (action === "whatsapp") return "Confirmar presença via WhatsApp";
  return name;
}

function handleHotspotAction(action) {
  if (action === "maps") {
    window.open(config.mapsLink, "_blank", "noopener");
  } else if (action === "whatsapp") {
    const text = encodeURIComponent(config.whatsappMessage);
    const url = `https://wa.me/${config.whatsappNumber}?text=${text}`;
    window.open(url, "_blank", "noopener");
  }
}

/* A camada de hotspots é alinhada exatamente sobre o retângulo
   real da imagem renderizada (object-fit: contain pode deixar
   espaços vazios nas laterais/topo, e cliques ali não podem
   contar). Recalculado no load da imagem e no resize. */
function positionHotspots() {
  const frameRect = inviteFrame.getBoundingClientRect();
  const imgRect = inviteImage.getBoundingClientRect();

  hotspotsLayer.style.left = imgRect.left - frameRect.left + "px";
  hotspotsLayer.style.top = imgRect.top - frameRect.top + "px";
  hotspotsLayer.style.width = imgRect.width + "px";
  hotspotsLayer.style.height = imgRect.height + "px";
}

buildHotspots();

if (inviteImage.complete) {
  positionHotspots();
} else {
  inviteImage.addEventListener("load", positionHotspots);
}
window.addEventListener("resize", positionHotspots);
window.addEventListener("orientationchange", positionHotspots);

/* =========================================================
   MÚSICA AMBIENTE
   ========================================================= */
let musicStarted = false;

function attemptPlayMusic() {
  if (musicStarted) return;
  bgAudio
    .play()
    .then(() => {
      musicStarted = true;
      musicIcon.textContent = "⏸";
      musicToggle.setAttribute("aria-label", "Pausar música");
    })
    .catch(() => {
      // Autoplay bloqueado pelo navegador — usuário poderá tocar manualmente
      musicIcon.textContent = "▶";
    });
}

musicToggle.addEventListener("click", () => {
  if (bgAudio.paused) {
    bgAudio.play();
    musicIcon.textContent = "⏸";
    musicToggle.setAttribute("aria-label", "Pausar música");
    musicStarted = true;
  } else {
    bgAudio.pause();
    musicIcon.textContent = "▶";
    musicToggle.setAttribute("aria-label", "Tocar música");
  }
});

musicVolume.addEventListener("input", (e) => {
  bgAudio.volume = parseFloat(e.target.value);
});

/* =========================================================
   PARTÍCULAS DOURADAS + LUZES (canvas, 60fps, leve)
   ========================================================= */
function createParticleField(canvasEl, options = {}) {
  const ctx = canvasEl.getContext("2d");
  const density = options.density || 0.00009; // partículas por pixel²
  const maxSpeed = options.maxSpeed || 0.15;
  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, particles, rafId;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = canvasEl.clientWidth;
    height = canvasEl.clientHeight;
    canvasEl.width = width * dpr;
    canvasEl.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.floor(width * height * density));
    particles = Array.from({ length: count }, () => spawnParticle());
  }

  function spawnParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      speed: (Math.random() * maxSpeed + 0.02),
      drift: (Math.random() - 0.5) * 0.06,
      alpha: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      // sobe lentamente, com leve deriva lateral (como pólen/folhas suaves)
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -4) {
        p.y = height + 4;
        p.x = Math.random() * width;
      }
      const tw = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(228, 196, 128, ${p.alpha * tw})`;
      ctx.shadowColor = "rgba(228, 196, 128, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  if (!reduced) {
    rafId = requestAnimationFrame(draw);
  } else {
    // Ainda desenha um frame estático, respeitando preferência de menos movimento
    draw(0);
    cancelAnimationFrame(rafId);
  }

  return {
    stop() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    },
  };
}

/* Campo de partículas da tela inicial (mais denso) */
createParticleField(document.getElementById("particles-canvas"), {
  density: 0.00012,
  maxSpeed: 0.18,
});

/* Campo de partículas ambiente da tela do convite (mais discreto) */
createParticleField(document.getElementById("particles-canvas-invite"), {
  density: 0.00005,
  maxSpeed: 0.1,
});
