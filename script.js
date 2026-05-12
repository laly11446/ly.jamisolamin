
// Dark/Light Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggle.checked = true;
}
themeToggle.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// Typing animation loop for "Jamisolamin"

const surname = "Jamisolamin";
const typedSpan = document.getElementById("typedSurname");

let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedSpan) return;

  if (!isDeleting) {
    // Typing
    typedSpan.textContent = surname.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === surname.length) {
      isDeleting = true;

      // Pause before deleting
      setTimeout(typeLoop, 1200);
      return;
    }
  }

  const speed = isDeleting ? 70 : 120;

  setTimeout(typeLoop, speed);
}

// Start typing
setTimeout(typeLoop, 600);

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
}
function closeMobile() {
  if (hamburger) hamburger.classList.remove("open");
  if (mobileMenu) mobileMenu.classList.remove("open");
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((el) => observer.observe(el));

// Project scroll
const trackEl = document.getElementById("projectsTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
if (prevBtn && nextBtn && trackEl) {
  prevBtn.addEventListener("click", () => {
    trackEl.scrollBy({ left: -424, behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    trackEl.scrollBy({ left: 424, behavior: "smooth" });
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".form-submit");
  btn.textContent = "Sent ✓";
  btn.style.background = "#2a7a5a";
  setTimeout(() => {
    btn.textContent = "Submit";
    btn.style.background = "";
  }, 3000);
}

// Trail & Flashlight Animation
const imgContainer = document.getElementById("profileImage");
const glowRing = document.getElementById("glowRing");
const spotlight = document.getElementById("spotlightLayer");
const canvas = document.getElementById("trailCanvas");
let ctx = canvas ? canvas.getContext("2d") : null;
let trails = [];
let animationId = null;
let mouseInside = false;

function resizeCanvas() {
  if (!imgContainer || !canvas) return;
  const rect = imgContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateSpotlightAndRing(e) {
  if (!imgContainer) return;
  const rect = imgContainer.getBoundingClientRect();
  let relX = e.clientX - rect.left;
  let relY = e.clientY - rect.top;
  relX = Math.min(Math.max(relX, 0), rect.width);
  relY = Math.min(Math.max(relY, 0), rect.height);
  if (spotlight)
    spotlight.style.background = `radial-gradient(circle at ${relX}px ${relY}px, rgba(255,220,180,0.25) 0%, rgba(147,81,123,0.55) 40%, rgba(0,0,0,0.6) 90%)`;
  if (glowRing) {
    glowRing.style.left = `${e.clientX}px`;
    glowRing.style.top = `${e.clientY}px`;
  }
  if (mouseInside)
    trails.push({
      x: relX,
      y: relY,
      alpha: 0.9,
      size: 8 + Math.random() * 10,
    });
}

function drawTrails() {
  if (!ctx || !canvas || canvas.width === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < trails.length; i++) {
    const t = trails[i];
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      t.x,
      t.y,
      2,
      t.x,
      t.y,
      t.size * 0.8,
    );
    gradient.addColorStop(0, `rgba(209, 110, 155, ${t.alpha * 0.9})`);
    gradient.addColorStop(1, `rgba(119, 66, 94, ${t.alpha * 0.3})`);
    ctx.fillStyle = gradient;
    ctx.arc(t.x, t.y, t.size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    t.alpha -= 0.02;
    t.size *= 0.98;
  }
  trails = trails.filter((t) => t.alpha > 0.02 && t.size > 0.8);
  if (mouseInside) animationId = requestAnimationFrame(drawTrails);
  else if (trails.length === 0 && animationId)
    cancelAnimationFrame(animationId);
}

function startTrailLoop() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(drawTrails);
}

function onMouseMove(e) {
  if (!imgContainer) return;
  const rect = imgContainer.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;
  if (inside !== mouseInside) {
    mouseInside = inside;
    if (mouseInside) {
      startTrailLoop();
      if (glowRing) glowRing.style.opacity = "1";
      if (spotlight) spotlight.style.opacity = "1";
    } else {
      if (glowRing) glowRing.style.opacity = "0";
      if (spotlight) spotlight.style.opacity = "0";
    }
  }
  if (mouseInside) updateSpotlightAndRing(e);
}

function initHoverEffects() {
  if (!imgContainer) return;
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const parentWrap = document.querySelector(".hero-image-wrap");
  if (parentWrap) {
    parentWrap.addEventListener("mousemove", onMouseMove);
    parentWrap.addEventListener("mouseleave", () => {
      mouseInside = false;
      if (glowRing) glowRing.style.opacity = "0";
      if (spotlight) spotlight.style.opacity = "0";
    });
  }
  if (glowRing) {
    glowRing.style.transition = "opacity 0.2s";
    glowRing.style.position = "fixed";
    glowRing.style.pointerEvents = "none";
  }
  if (spotlight) spotlight.style.transition = "opacity 0.2s";
}
initHoverEffects();

const introScreen = document.getElementById("introScreen");
const enterBtn = document.getElementById("enterBtn");

if (enterBtn && introScreen) {
  enterBtn.addEventListener("click", () => {
    introScreen.classList.add("hide");

    setTimeout(() => {
      introScreen.style.display = "none";
    }, 1000);
  });
}

function handleSubmit(e) {
  e.preventDefault();

  // 1. Reference the form and the button
  const form = e.target;
  const btn = form.querySelector(".form-submit");

  // 2. This is the new line that deletes all inputs immediately
  form.reset();

  // 3. Provide visual feedback
  btn.textContent = "Sent ";
  btn.style.background = "#2a7a5a";

  // 4. Reset the button look after a delay
  setTimeout(() => {
    btn.textContent = "Submit";
    btn.style.background = "";
  }, 3000);
}

const img = document.querySelector(".hero-image-inner");

img.addEventListener("mousemove", (e) => {
  const rect = img.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  img.style.setProperty("--x", `${x}%`);
  img.style.setProperty("--y", `${y}%`);
});
const cards = document.querySelectorAll(".soft-card");

cards.forEach(card => {

  let rect;

  card.addEventListener("mousemove", (e) => {
    rect = card.getBoundingClientRect();

    // cursor glow position
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);

  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
      scale(1)
    `;
  });

});

