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
  whatsappNumber: "5524998694118",

  // Mensagem automática de confirmação de presença
  whatsappMessage:
    "Olá! Confirmo minha presença na festa de 15 anos.\nMeu nome é: ",

  // Áreas clicáveis invisíveis sobre a imagem do convite.
  // Cada hotspot é definido em PORCENTAGEM (0–100) em relação
  // à própria imagem — assim funciona em qualquer resolução.
  hotspots: {
    localizacao: {
      x: 18,          // ← AJUSTE ESTES VALORES conforme a posição dos botões na sua imagem
      y: 75,
      width: 26,
      height: 6,
      action: "maps",
      icon: "📍",
      label: "LOCALIZAÇÃO",
    },
    confirmacao: {
      x: 58,          // ← AJUSTE ESTES VALORES
      y: 79,
      width: 26,
      height: 6,
      action: "whatsapp",
      icon: "✅",
      label: "CONFIRMAR PRESENÇA",
    },
  },

  // Recorte da personagem (assets/personagem.png) — em PORCENTAGEM (0–100)
  // da imagem do convite. Se a personagem não estiver na nova imagem,
  // você pode remover este bloco ou deixar com valores que a coloquem
  // em um canto discreto.
  characterLayer: {
    src: "assets/personagem.png",
    x: 60,   // ← AJUSTE para posicionar a personagem sobre o fundo claro
    y: 20,
    width: 30,
    height: 60,
  },
};

/* =========================================================
   ELEMENTOS
   ========================================================= */
const splashScreen = document.getElementById("splash-screen");
const inviteScreen = document.getElementById("invite-screen");
const enterBtn = document.getElementById("enter-btn");

const inviteImage = document.getElementById("invite-image");
const inviteBackdrop = document.getElementById("invite-backdrop");
const hotspotsLayer = document.getElementById("hotspots-layer");
const inviteFrame = document.querySelector(".invite-frame");
const characterFrame = document.getElementById("character-frame");
const characterLayer = document.getElementById("character-layer");

const bgAudio = document.getElementById("bg-audio");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicVolume = document.getElementById("music-volume");

/* Elementos da abertura cinematográfica (envelope) */
const envelopeScene = document.getElementById("envelope-scene");
const envelopeVisual = document.getElementById("envelope-visual");
const letterCard = document.getElementById("letter-card");
const letterArt = document.getElementById("letter-art");
const letterBackdrop = document.getElementById("letter-backdrop");
const letterSparkles = document.getElementById("letter-sparkles");

/* Aplica config à imagem e ao áudio.
   O "backdrop" repete a mesma imagem desfocada atrás da versão
   nítida, preenchendo a tela sem cortar nada do design nem
   deixar barras pretas nas laterais/topo. */
inviteImage.src = config.backgroundImage;
inviteBackdrop.style.backgroundImage = `url(${config.backgroundImage})`;
letterArt.style.backgroundImage = `url(${config.backgroundImage})`;
letterBackdrop.style.backgroundImage = `url(${config.backgroundImage})`;
if (characterLayer && config.characterLayer && config.characterLayer.src) {
  characterLayer.addEventListener("error", () => {
    // Se o novo evento não tiver um recorte de personagem, some
    // silenciosamente em vez de mostrar um ícone de imagem quebrada.
    characterFrame.style.display = "none";
  });
  characterLayer.src = config.characterLayer.src;
}

bgAudio.src = config.music;
bgAudio.preload = "auto";
bgAudio.volume = parseFloat(musicVolume.value);
bgAudio.load();

/* =========================================================
   TRANSIÇÃO CINEMATOGRÁFICA: ENVELOPE -> CONVITE
   -----------------------------------------------------------
   A imagem do envelope (assets/envelope.jpg) nunca é redesenhada —
   ela só é movida/escalada/desvanecida como um todo. O "abrir"
   é sugerido pelo brilho que passa sobre o laço, pela leve reação
   do envelope e pela carta que emerge e se transforma no convite.

   Sequência, disparada por um único clique:
   1) vibração leve (quando suportado)
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
    splashScreen.style.display = "none";
    splashScreen.style.pointerEvents = "none";
    inviteScreen.removeAttribute("hidden");
    positionOverlays();
  }, 3650);
}

/* =========================================================
   HOTSPOTS — posicionamento e ações
   ========================================================= */
function buildHotspots() {
  hotspotsLayer.innerHTML = "";

  Object.entries(config.hotspots).forEach(([name, spot], index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hotspot";
    btn.dataset.name = name;
    btn.style.animationDelay = index * 0.4 + "s";
    btn.setAttribute("aria-label", hotspotLabel(name, spot));

    btn.style.left = spot.x + "%";
    btn.style.top = spot.y + "%";
    btn.style.width = spot.width + "%";
    btn.style.height = spot.height + "%";

    // Ripple dourado ao toque/clique — reforça a sensação de botão "de verdade"
    btn.addEventListener("pointerdown", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "hotspot-ripple";
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });

    btn.addEventListener("click", () => {
      if (navigator.vibrate) navigator.vibrate(15);
      handleHotspotAction(spot.action);
    });
    hotspotsLayer.appendChild(btn);
  });
}

function hotspotLabel(name, spot) {
  if (spot.label) return spot.label;
  if (spot.action === "maps") return "Ver localização no mapa";
  if (spot.action === "whatsapp") return "Confirmar presença via WhatsApp";
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

/* Posiciona o recorte animado da personagem exatamente sobre a mesma
   figura na arte do convite, usando o mesmo retângulo real da imagem
   renderizada (mesma lógica de positionHotspots). */
function positionCharacterLayer() {
  if (!characterFrame || !config.characterLayer) return;
  const frameRect = inviteFrame.getBoundingClientRect();
  const imgRect = inviteImage.getBoundingClientRect();
  const c = config.characterLayer;

  const left = imgRect.left - frameRect.left + (c.x / 100) * imgRect.width;
  const top = imgRect.top - frameRect.top + (c.y / 100) * imgRect.height;
  const width = (c.width / 100) * imgRect.width;
  const height = (c.height / 100) * imgRect.height;

  characterFrame.style.left = left + "px";
  characterFrame.style.top = top + "px";
  characterFrame.style.width = width + "px";
  characterFrame.style.height = height + "px";
}

function positionOverlays() {
  positionHotspots();
  positionCharacterLayer();
}

buildHotspots();

if (inviteImage.complete) {
  positionOverlays();
} else {
  inviteImage.addEventListener("load", positionOverlays);
}
window.addEventListener("resize", positionOverlays);
window.addEventListener("orientationchange", positionOverlays);

/* =========================================================
   PARALAXE SUTIL — o convite reage ao ponteiro (desktop) e à
   inclinação do aparelho (celular), dando profundidade e vida
   à cena, sem nunca desalinhar hotspots ou a personagem (o tilt
   é aplicado ao .invite-frame inteiro, como um único plano rígido).
   ========================================================= */
(function setupParallaxTilt() {
  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const maxTilt = 5; // graus
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  let rafId = null;

  function applyTilt() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    inviteFrame.style.transform =
      `rotateX(${curY}deg) rotateY(${curX}deg)`;
    rafId = requestAnimationFrame(applyTilt);
  }

  window.addEventListener("pointermove", (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = nx * maxTilt;
    targetY = -ny * maxTilt;
  });

  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma === null || e.beta === null) return;
      targetX = Math.max(-maxTilt, Math.min(maxTilt, e.gamma / 4));
      targetY = Math.max(-maxTilt, Math.min(maxTilt, (e.beta - 45) / 6));
    });
  }

  rafId = requestAnimationFrame(applyTilt);
})();

/* =========================================================
   MÚSICA AMBIENTE
   ========================================================= */
let musicStarted = false;

bgAudio.addEventListener("error", () => {
  console.warn(
    "Não foi possível carregar assets/music.mp3 — confira se o arquivo foi enviado ao repositório com esse nome exato."
  );
});

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
