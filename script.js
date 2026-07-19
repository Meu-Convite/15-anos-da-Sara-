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

  // IMPORTANTE — cache do navegador / CDN do GitHub Pages:
  // Sempre que você substituir qualquer arquivo em /assets (convite,
  // personagem, música, envelope), MUDE este valor (ex.: para a data
  // de hoje). Isso força o celular/navegador a baixar os arquivos
  // novos em vez de mostrar a versão antiga guardada em cache — é
  // o mesmo motivo de às vezes só funcionar "trocando de navegador".
  CACHE_VERSION: "20260720a",

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

  // WhatsApp do desenvolvedor (LéoTech) — usado pela assinatura no
  // rodapé do convite. Formato: DDI+DDD+NÚMERO, só dígitos.
  developerWhatsapp: "5524998694118",
  developerWhatsappMessage: "Olá! Vi seu convite digital e quero um também.",

  // =========================================================
  // TEXTOS DO CONVITE — 100% editável aqui, sem precisar mexer
  // em imagem/Canva. Troque qualquer valor abaixo e suba só o
  // script.js pro GitHub.
  // =========================================================
  text: {
    nome: "Sophia Micaelle",
    tituloAniversario: "XV Anos",         // aparece como "XV ANOS"
    subtitulo: "Venha participar\nde uma noite\ninesquecível",
    diaSemana: "Sábado",
    dia: "26",
    mes: "Julho",
    ano: "2026",
    hora: "19\n00\nH",
  },

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
      x: 16.6,
      y: 83.6,
      width: 30.4,
      height: 7.5,
      action: "maps",
      icon: "pin",
      label: "Local da festa",
    },
    confirmacao: {
      x: 51.0,
      y: 83.6,
      width: 30.4,
      height: 7.5,
      action: "whatsapp",
      icon: "check",
      label: "Confirme sua presença",
    },
  },

  // Recorte da personagem (assets/personagem.png) — em PORCENTAGEM (0–100)
  // da imagem do convite, indicando onde esse recorte deve ser encaixado
  // por cima da arte original para animá-lo (respiração/balanço) sem
  // nunca se desalinhar. Se trocar de arte/personagem, ajuste estes
  // números e a imagem em assets/personagem.png.
  characterLayer: {
    src: "assets/personagem.png",
    x: 22,
    y: 46,
    width: 56,
    height: 44,
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
const textLayer = document.getElementById("text-layer");
const crownGlow = document.getElementById("crown-glow");
const frog = document.getElementById("frog");
const frogTapLayer = document.getElementById("frog-tap-layer");
const studioSignature = document.getElementById("studio-signature");

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

/* Junta o caminho do arquivo com a versão de cache (veja
   CACHE_VERSION no topo do arquivo) — garante que, ao trocar
   qualquer imagem/áudio, o navegador baixe a versão nova. */
function withCacheBust(path) {
  if (!path) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${encodeURIComponent(config.CACHE_VERSION || "1")}`;
}

/* Aplica config à imagem e ao áudio.
   O "backdrop" repete a mesma imagem desfocada atrás da versão
   nítida, preenchendo a tela sem cortar nada do design nem
   deixar barras pretas nas laterais/topo. */
const bgImageUrl = withCacheBust(config.backgroundImage);
inviteImage.src = bgImageUrl;
inviteBackdrop.style.backgroundImage = `url(${bgImageUrl})`;
letterArt.style.backgroundImage = `url(${bgImageUrl})`;
letterBackdrop.style.backgroundImage = `url(${bgImageUrl})`;
if (characterLayer && config.characterLayer && config.characterLayer.src) {
  characterLayer.addEventListener("error", () => {
    characterFrame.style.display = "none";
  });
  characterLayer.src = withCacheBust(config.characterLayer.src);
}

bgAudio.src = withCacheBust(config.music);
bgAudio.preload = "auto";
bgAudio.volume = parseFloat(musicVolume.value);
bgAudio.load();

/* =========================================================
   TRANSIÇÃO CINEMATOGRÁFICA: ENVELOPE -> CONVITE
   ========================================================= */
enterBtn.addEventListener("click", enterInvite);

let inviteOpened = false;

function enterInvite() {
  if (inviteOpened) return;
  inviteOpened = true;
  enterBtn.disabled = true;

  if (navigator.vibrate) {
    navigator.vibrate(25);
  }

  attemptPlayMusic();

  envelopeScene.classList.add("opening");
  envelopeVisual.classList.add("opening");

  window.setTimeout(() => {
    letterSparkles.classList.add("active");
    letterCard.classList.add("rising");
  }, 650);

  window.setTimeout(() => {
    envelopeVisual.classList.remove("opening");
    envelopeVisual.classList.add("receding");
  }, 1450);

  window.setTimeout(() => {
    letterCard.classList.add("at-peak");
  }, 1600);

  window.setTimeout(() => {
    letterCard.classList.add("expanding");
  }, 1950);

  window.setTimeout(() => {
    splashScreen.setAttribute("hidden", "");
    splashScreen.style.display = "none";
    splashScreen.style.pointerEvents = "none";
    inviteScreen.removeAttribute("hidden");
    positionOverlays();
  }, 2000);
}

/* =========================================================
   TEXTOS — preenche a camada de texto editável a partir de
   config.text. Nada disso está desenhado na imagem.
   ========================================================= */
function renderText() {
  const t = config.text;
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  set("txt-name", t.nome);
  set("txt-xvanos", t.tituloAniversario);
  set("txt-subtitle", t.subtitulo);
  set("txt-weekday", t.diaSemana);
  set("txt-day", t.dia);
  set("txt-month", t.mes);
  set("txt-year", t.ano);
  set("txt-time", t.hora);
}

/* Ícones simples em SVG (contorno), no mesmo estilo fino e
   dourado/oliva do resto do convite */
const HOTSPOT_ICONS = {
  pin: '<svg class="hotspot-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  check: '<svg class="hotspot-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>',
};

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

    const content = document.createElement("span");
    content.className = "hotspot-content";
    content.innerHTML = (HOTSPOT_ICONS[spot.icon] || "") + "<span>" + (spot.label || "") + "</span>";
    btn.appendChild(content);

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
      btn.classList.remove("is-pressed");
      void btn.offsetWidth;
      btn.classList.add("is-pressed");
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

/* =========================================================
   PREENCHIMENTO DE TELA
   ========================================================= */
const MAX_CROP = 0.07;

function updateImageScale() {
  const frameRect = inviteFrame.getBoundingClientRect();
  const iw = inviteImage.naturalWidth;
  const ih = inviteImage.naturalHeight;
  if (!iw || !ih || !frameRect.width || !frameRect.height) return;

  const containScale = Math.min(frameRect.width / iw, frameRect.height / ih);
  const coverScale = Math.max(frameRect.width / iw, frameRect.height / ih);
  const cappedScale = containScale / (1 - 2 * MAX_CROP);
  const finalScale = Math.min(coverScale, cappedScale);

  inviteImage.style.width = Math.round(iw * finalScale) + "px";
  inviteImage.style.height = Math.round(ih * finalScale) + "px";
}

function positionHotspots() {
  const frameRect = inviteFrame.getBoundingClientRect();
  const imgRect = inviteImage.getBoundingClientRect();

  hotspotsLayer.style.left = imgRect.left - frameRect.left + "px";
  hotspotsLayer.style.top = imgRect.top - frameRect.top + "px";
  hotspotsLayer.style.width = imgRect.width + "px";
  hotspotsLayer.style.height = imgRect.height + "px";
}

function positionTextLayer() {
  if (!textLayer) return;
  const frameRect = inviteFrame.getBoundingClientRect();
  const imgRect = inviteImage.getBoundingClientRect();

  textLayer.style.left = imgRect.left - frameRect.left + "px";
  textLayer.style.top = imgRect.top - frameRect.top + "px";
  textLayer.style.width = imgRect.width + "px";
  textLayer.style.height = imgRect.height + "px";
}

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

function positionCrownGlow() {
  const glow = document.getElementById("crown-glow");
  if (!glow) return;
  const frameRect = inviteFrame.getBoundingClientRect();
  const imgRect = inviteImage.getBoundingClientRect();

  glow.style.left = imgRect.left - frameRect.left + imgRect.width * 0.5 + "px";
  glow.style.top = imgRect.top - frameRect.top + imgRect.height * 0.115 + "px";
  glow.style.width = imgRect.width * 0.34 + "px";
  glow.style.height = imgRect.width * 0.34 + "px";
}

function positionOverlays() {
  updateImageScale();
  positionHotspots();
  positionCharacterLayer();
  positionTextLayer();
  positionCrownGlow();
}

renderText();
buildHotspots();

if (inviteImage.complete) {
  positionOverlays();
} else {
  inviteImage.addEventListener("load", positionOverlays);
}
window.addEventListener("resize", positionOverlays);
window.addEventListener("orientationchange", positionOverlays);

if (window.ResizeObserver) {
  const inviteImageObserver = new ResizeObserver(() => positionOverlays());
  inviteImageObserver.observe(inviteImage);
}

/* =========================================================
   SAPINHO — toque interativo
   ========================================================= */
(function setupFrogTap() {
  const frog = document.getElementById("frog");
  const tapLayer = document.getElementById("frog-tap-layer");
  if (!frog || !tapLayer) return;

  frog.style.pointerEvents = "auto";
  frog.style.cursor = "pointer";
  frog.setAttribute("role", "button");
  frog.setAttribute("aria-label", "Sapinho");

  frog.addEventListener("click", () => {
    if (tapLayer.classList.contains("frog-tap")) return;
    tapLayer.classList.add("frog-tap");
    if (navigator.vibrate) navigator.vibrate(10);
  });
  tapLayer.addEventListener("animationend", () => {
    tapLayer.classList.remove("frog-tap");
  });
})();

/* =========================================================
   ASSINATURA — "Desenvolvido por LéoTech"
   ========================================================= */
(function setupStudioSignature() {
  const sig = document.getElementById("studio-signature");
  if (!sig) return;
  sig.addEventListener("click", () => {
    const text = encodeURIComponent(config.developerWhatsappMessage || "");
    const url = `https://wa.me/${config.developerWhatsapp}?text=${text}`;
    window.open(url, "_blank", "noopener");
  });
})();

/* =========================================================
   PARALLAX SUTIL
   ========================================================= */
(function setupParallaxTilt() {
  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const maxTilt = 5;
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
   PLAYER DE MÚSICA — expande ao tocar
   ========================================================= */
(function setupMusicExpand() {
  const control = document.getElementById("music-control");
  if (!control) return;

  musicToggle.addEventListener("click", () => {
    control.classList.add("is-expanded");
  });

  document.addEventListener("pointerdown", (e) => {
    if (!control.contains(e.target)) {
      control.classList.remove("is-expanded");
    }
  });
})();

/* =========================================================
   PARTÍCULAS DOURADAS
   ========================================================= */
function createParticleField(canvasEl, options = {}) {
  const ctx = canvasEl.getContext("2d");
  const density = options.density || 0.00009;
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

createParticleField(document.getElementById("particles-canvas"), {
  density: 0.00012,
  maxSpeed: 0.18,
});

createParticleField(document.getElementById("particles-canvas-invite"), {
  density: 0.00005,
  maxSpeed: 0.1,
});
