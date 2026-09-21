/* =======================================================
   EL CÁNTICO DE LAS CRIATURAS — SCRIPT PRINCIPAL
   Secuencia Scroll-Driven en Canvas, Preloader y Animaciones GSAP
   ======================================================= */

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   CONFIGURACIÓN DE SECUENCIA DE FOTOGRAMAS
   Fotogramas de alta definición del atardecer dorado ("Hermano Sol")
══════════════════════════════════════ */
const FRAME_COUNT = 192;
const FRAME_BASE = "https://rassweiler-it.de/images/codepen/frames/frame_";
const FRAME_EXT = ".jpg";

function framePath(n) {
    return FRAME_BASE + String(n).padStart(4, "0") + FRAME_EXT;
}

/* ══════════════════════════════════════
   CONFIGURACIÓN DEL LIENZO (CANVAS)
══════════════════════════════════════ */
const canvas = document.getElementById("hv");
const ctx = canvas ? canvas.getContext("2d") : null;
const frames = new Array(FRAME_COUNT);
let framesLoaded = 0;
let canvasReady = false;
let currentFrameIdx = 0;
let fallbackMode = false;
let fallbackImage = null;

// Precarga de imagen de respaldo local ("santo.jpg") para garantizar que nunca se quede en negro
const localBackup = new Image();
localBackup.src = "ima/santo.jpg";
localBackup.onload = () => { fallbackImage = localBackup; };

function resizeCanvas() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (canvasReady) {
        drawFrame(currentFrameIdx);
    }
}
window.addEventListener("resize", resizeCanvas);

/* Dibujo con ajuste de relación de aspecto tipo COVER */
function drawFrame(idx) {
    if (!canvas || !ctx) return;
    const img = frames[idx] || fallbackImage;
    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || cw;
    const ih = img.naturalHeight || ch;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
}

/* ══════════════════════════════════════
   PRECARGADOR INTELIGENTE EN DOS PASOS
   Paso 1: Carga 32 fotogramas clave para inicio ultra-rápido
   Paso 2: Carga silenciosa del resto en segundo plano
══════════════════════════════════════ */
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderPct = document.getElementById("loader-pct");
const loaderSt = document.getElementById("loader-status");

const sacredStatuses = [
    "Invocando la bendición del Hermano Sol…",
    "Afinando los ecos sagrados de Asís…",
    "Despertando la alabanza de las criaturas…",
    "El cielo y la tierra proclaman Su gloria…"
];

function setProgress(pct, msg) {
    if (!loaderBar || !loaderPct) return;
    const clamped = Math.min(100, Math.max(0, pct));
    loaderBar.style.width = clamped + "%";
    loaderPct.textContent = Math.round(clamped) + "%";
    if (msg !== undefined && loaderSt) {
        loaderSt.textContent = msg;
    }
}

function dismissLoader() {
    if (!loader) return;
    loader.classList.add("hidden");
    document.body.classList.add("loaded");
    canvasReady = true;
    resizeCanvas();
    drawFrame(0);
    setTimeout(startHeroEntrance, 300);
    loadRemainingFrames();
}

const PASS1_STEP = 6;
let pass1Done = 0;
const pass1Count = Math.ceil(FRAME_COUNT / PASS1_STEP);

function loadPass1() {
    if (!canvas) {
        // En páginas sin canvas, desvanecer loader de inmediato
        if (loader) dismissLoader();
        return;
    }

    for (let i = 1; i <= FRAME_COUNT; i += PASS1_STEP) {
        const idx = i - 1;
        const img = new Image();
        img.onload = () => {
            frames[idx] = img;
            pass1Done++;
            framesLoaded++;
            const pct = (pass1Done / pass1Count) * 90;
            const statusIdx = pct < 28 ? 0 : pct < 58 ? 1 : pct < 85 ? 2 : 3;
            setProgress(pct, sacredStatuses[statusIdx]);

            if (idx === 0 && !canvasReady) {
                drawFrame(0);
            }

            if (pass1Done >= pass1Count) {
                setProgress(100, sacredStatuses[3]);
                setTimeout(dismissLoader, 350);
            }
        };
        img.onerror = () => {
            pass1Done++;
            framesLoaded++;
            fallbackMode = true;
            if (pass1Done >= pass1Count) {
                setProgress(100, sacredStatuses[3]);
                setTimeout(dismissLoader, 350);
            }
        };
        img.src = framePath(i);
    }
}

function loadRemainingFrames() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const idx = i - 1;
        if (frames[idx]) continue;
        const img = new Image();
        img.onload = () => {
            frames[idx] = img;
            framesLoaded++;
        };
        img.onerror = () => {
            framesLoaded++;
        };
        img.src = framePath(i);
    }
}

// Progreso dinámico inicial
let fakeProgress = 0;
const fakeTimer = setInterval(() => {
    if (pass1Done < pass1Count) {
        fakeProgress = Math.min(fakeProgress + Math.random() * 3, 24);
        setProgress(Math.max(fakeProgress, (pass1Done / pass1Count) * 90));
    } else {
        clearInterval(fakeTimer);
    }
}, 180);

// Tiempo máximo de espera de seguridad (3.5 segundos)
setTimeout(() => {
    if (!canvasReady) {
        setProgress(100, sacredStatuses[3]);
        dismissLoader();
    }
}, 3500);

// Iniciar precarga si existe el canvas
if (canvas) {
    loadPass1();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("loaded");
    });
}

/* ══════════════════════════════════════
   ENTRADA CINEMATOGRÁFICA DEL HERO (GSAP)
══════════════════════════════════════ */
function startHeroEntrance() {
    if (!document.getElementById("hero-scroll")) return;

    gsap.fromTo(".h-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" }
    );
    gsap.fromTo(".h-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.25, ease: "power3.out" }
    );
    gsap.fromTo(".h-sub",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power3.out" }
    );
    gsap.fromTo(".h-cta-row",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: "power3.out" }
    );
    gsap.fromTo("#sind",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1, ease: "power2.out" }
    );
    gsap.fromTo(".side-label",
        { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.9, ease: "power2.out" }
    );

    setTimeout(initHeroScrollTrigger, 400);
}

/* ══════════════════════════════════════
   MAPEADO SCROLL → FOTOGRAMAS (LERP RAF)
══════════════════════════════════════ */
function initHeroScrollTrigger() {
    const heroScroll = document.getElementById("hero-scroll");
    if (!heroScroll) return;

    const heroText = document.getElementById("hero-text");
    const scrubBar = document.getElementById("scrub-bar");
    const scrollInd = document.getElementById("sind");
    const grad = document.getElementById("hv-grad");

    let targetFrame = 0;
    let displayFrame = 0;
    let rafRunning = false;

    function renderLoop() {
        if (!rafRunning) return;
        const diff = targetFrame - displayFrame;
        if (Math.abs(diff) > 0.4) {
            displayFrame += diff * 0.18; // Suavizado de inercia
        } else {
            displayFrame = targetFrame;
        }

        const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(displayFrame)));
        if (idx !== currentFrameIdx) {
            currentFrameIdx = idx;
            const nearest = findNearestFrame(idx);
            if (nearest !== null) drawFrame(nearest);
        }
        requestAnimationFrame(renderLoop);
    }

    function findNearestFrame(idx) {
        if (frames[idx] && frames[idx].complete) return idx;
        for (let offset = 1; offset < 15; offset++) {
            if (idx - offset >= 0 && frames[idx - offset] && frames[idx - offset].complete) return idx - offset;
            if (idx + offset < FRAME_COUNT && frames[idx + offset] && frames[idx + offset].complete) return idx + offset;
        }
        return fallbackImage ? 0 : null;
    }

    ScrollTrigger.create({
        trigger: "#hero-scroll",
        start: "top top",
        end: "bottom bottom",
        onEnter() {
            rafRunning = true;
            renderLoop();
        },
        onLeave() {
            rafRunning = false;
        },
        onEnterBack() {
            rafRunning = true;
            renderLoop();
        },
        onUpdate(self) {
            const p = self.progress;
            targetFrame = p * (FRAME_COUNT - 1);

            if (scrubBar) {
                scrubBar.style.width = (p * 100) + "%";
            }

            if (heroText) {
                // Desvanecimiento gradual elegante del texto al scrollear
                const textP = Math.max(0, Math.min(1, (p - 0.06) / 0.34));
                heroText.style.opacity = 1 - textP;
                heroText.style.transform = `translateY(${textP * -80}px)`;
            }

            if (scrollInd) {
                scrollInd.style.opacity = Math.max(0, 1 - p * 12);
            }

            if (grad) {
                grad.style.opacity = Math.min(1, 0.85 + p * 0.15);
            }
        }
    });
}

/* ══════════════════════════════════════
   NAVEGACIÓN SOLID STATE ON SCROLL
══════════════════════════════════════ */
const headerNav = document.querySelector("header") || document.querySelector("nav.main-nav");
if (headerNav) {
    ScrollTrigger.create({
        start: "top -60",
        onEnter: () => headerNav.classList.add("solid"),
        onLeaveBack: () => headerNav.classList.remove("solid")
    });
}

/* ══════════════════════════════════════
   REVELADO DE ELEMENTOS (.rv)
══════════════════════════════════════ */
document.querySelectorAll(".rv").forEach((el) => {
    ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("in")
    });
});

/* ══════════════════════════════════════
   POPUP MODAL DE INFORMACIÓN Y CRÉDITOS
══════════════════════════════════════ */
function openP() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.classList.add("on");
        document.body.style.overflow = "hidden";
    }
}

function closeP() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.classList.remove("on");
        document.body.style.overflow = document.body.classList.contains("loaded") ? "" : "hidden";
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeP();
});

window.openP = openP;
window.closeP = closeP;
