/* ═══════════════════════════════════════
   CLINICFLOW PRO — script.js
   Ocean Breeze Theme
═══════════════════════════════════════════ */

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", function() {
  const gsaplElements = [
    ".line-1", ".line-2", ".hero-sub", ".hero-btns", ".hero-stats",
    ".feat-card", ".arch-node", ".tech-card", ".team-card",
    ".screen-card", ".story-scene", ".dl-inner > *",
    ".section-label", ".section-title", ".section-sub"
  ].join(",");
  
  document.querySelectorAll(gsaplElements).forEach(function (el) {
    el.dataset.gsapReady = "true";
  });
});

var emergencyTimer = setTimeout(function () {
  if (typeof gsap === "undefined") {
    forceShowAll();
  }
}, 3000);

function forceShowAll() {
  var sel = [
    ".line-1", ".line-2", ".hero-sub", ".hero-btns", ".hero-stats",
    ".reveal-left", ".reveal-right", ".reveal-up",
    ".feat-card", ".arch-node", ".tech-card", ".team-card",
    ".screen-card", ".story-scene", ".dl-inner > *"
  ].join(",");

  document.querySelectorAll(sel).forEach(function (el) {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });
  
  document.querySelectorAll(".hero-headline span, .hero-sub, .hero-btns, .hero-stats").forEach(function(el) {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initParticles();
  initNavbar();
  initParallax();
  initCounters();
  initCardTilt();
  initSmoothScroll();
  initSimpleReveal();
  initChartAnimation();
  initComingSoonModal();
  initMobileMenu();
});

window.addEventListener("load", function () {
  clearTimeout(emergencyTimer);

  if (typeof gsap === "undefined") {
    forceShowAll();
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initGSAP();
});

function initParticles() {
  var canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;
  var COUNT = 70;
  var particles = [];

  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.45 + 0.08,
      color: Math.random() > 0.5 ? "0,119,182" : "0,180,216"
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.color + "," + p.opacity + ")";
      ctx.fill();
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(0,119,182," + (0.1 * (1 - dist / 100)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener("resize", function () {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });
}

function initNavbar() {
  var nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

function initParallax() {
  var panels = document.querySelectorAll(".float-panel");
  if (!panels.length) return;

  window.addEventListener("mousemove", function (e) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var rx = (e.clientX - cx) / cx;
    var ry = (e.clientY - cy) / cy;

    panels.forEach(function (panel) {
      var d = parseFloat(panel.dataset.depth) || 0.2;
      var mx = rx * 25 * d;
      var my = ry * 15 * d;
      panel.style.transform =
        "translate(" + mx + "px," + my + "px) " +
        "rotateY(" + (-rx * 4 * d) + "deg) " +
        "rotateX(" + (ry * 4 * d) + "deg)";
    });
  }, { passive: true });
}

function initCounters() {
  var cards = document.querySelectorAll(".stat-card[data-target]");
  if (!cards.length) return;

  var done = new Set();
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || done.has(entry.target)) return;
      done.add(entry.target);

      var card = entry.target;
      var target = parseInt(card.dataset.target, 10);
      var suffix = card.dataset.suffix || "";
      var counter = card.querySelector(".stat-counter");
      if (!counter) return;

      var duration = 1800;
      var startTime = null;

      (function tick(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }, { threshold: 0.3 });

  cards.forEach(function (c) { obs.observe(c); });
}

function initCardTilt() {
  document.querySelectorAll(".feat-card, .team-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(900px) rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 10) + "deg) translateZ(8px) translateY(-5px)";
      card.style.transition = "transform 0.05s linear";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
      card.style.transform = "";
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(this.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initSimpleReveal() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      
      if (!el.classList.contains('gsap-animated')) {
        el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
        el.style.opacity = "1";
        el.style.transform = "translateX(0) translateY(0)";
      }
      
      obs.unobserve(el);
    });
  }, { threshold: 0.07 });

  document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up").forEach(function (el) {
    obs.observe(el);
  });
}

function initChartAnimation() {
  document.querySelectorAll(".mock-chart").forEach(function (chart) {
    var bars = chart.querySelectorAll(".chart-bar");
    bars.forEach(function (b) {
      b.style.transition = "height 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    });
    var card = chart.closest(".screen-card");
    if (!card) return;
    card.addEventListener("mouseenter", function () {
      bars.forEach(function (b) {
        b.style.height = (Math.random() * 60 + 30).toFixed(0) + "%";
      });
    });
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

function initComingSoonModal() {
  if (!document.getElementById('comingSoonModal')) {
    const modalHTML = `
      <div class="modal-overlay" id="comingSoonModal">
        <div class="modal-container">
          <button class="modal-close" id="closeModal">&times;</button>
          <div class="modal-content">
            <div class="modal-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="url(#modalGradient)" stroke-width="3" stroke-dasharray="8 8"/>
                <path d="M40 20V40L52 52" stroke="url(#modalGradient)" stroke-width="4" stroke-linecap="round"/>
                <circle cx="40" cy="40" r="4" fill="url(#modalGradient)"/>
                <defs>
                  <linearGradient id="modalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0077B6"/>
                    <stop offset="100%" stop-color="#00B4D8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 class="modal-title">Coming Soon!</h2>
            <p class="modal-subtitle">We're crafting something extraordinary</p>
            <div class="modal-features">
              <div class="modal-feature"><span class="modal-feature-icon">🚀</span><span>Full Dashboard Suite</span></div>
              <div class="modal-feature"><span class="modal-feature-icon">⚡</span><span>Real-time Analytics</span></div>
              <div class="modal-feature"><span class="modal-feature-icon">🔒</span><span>Enterprise Security</span></div>
              <div class="modal-feature"><span class="modal-feature-icon">📱</span><span>Mobile App</span></div>
            </div>
            <div class="modal-progress"><div class="modal-progress-bar" style="width: 75%"></div><span class="modal-progress-text">75% Ready</span></div>
            <p class="modal-notify">Want to know when it launches?</p>
            <form class="modal-form" id="notifyForm"><input type="email" placeholder="Enter your email" class="modal-input" required><button type="submit" class="modal-notify-btn">Notify Me</button></form>
            <p class="modal-small">No spam, only launch updates</p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const downloadBtn = document.getElementById('headerDownloadBtn');
  const modal = document.getElementById('comingSoonModal');
  const closeBtn = document.getElementById('closeModal');
  const notifyForm = document.getElementById('notifyForm');
  
  if (!downloadBtn || !modal || !closeBtn) return;
  
  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (typeof gsap !== "undefined") {
      gsap.fromTo('.modal-container', 
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  });
  
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
  
  if (notifyForm) {
    notifyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      const btn = this.querySelector('button');
      const originalText = btn.textContent;
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation:spin 1s linear infinite"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="25 50" stroke-linecap="round"/></svg> Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = '✓ Thank You!';
        btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
        const input = this.querySelector('input');
        input.style.display = 'none';
        
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            input.style.display = '';
            input.value = '';
          }, 300);
        }, 2000);
      }, 1500);
      
      console.log('Email submitted:', email);
    });
  }
}

function initGSAP() {
  gsap.set(".line-1, .line-2, .hero-sub, .hero-btns, .hero-stats", { opacity: 0, y: 20 });
  gsap.set(".float-panel", { opacity: 0, y: 30 });

  gsap.timeline({ delay: 0.1 })
    .to(".line-1", { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" })
    .to(".line-2", { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" }, "-=0.55")
    .to(".hero-sub", { opacity: 1, duration: 0.65, ease: "power2.out" }, "-=0.4")
    .to(".hero-btns", { opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.3")
    .to(".hero-stats", { opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.2")
    .to(".float-panel", { opacity: 1, y: 0, stagger: 0.12, duration: 1, ease: "power3.out" }, "-=0.6");

  if (typeof ScrollTrigger === "undefined") return;

  function st(el, start) { return { trigger: el, start: start || "top 82%", toggleActions: "play none none none" }; }

  gsap.from("#scene-paper", { scrollTrigger: st("#scene-paper"), opacity: 0, y: 50, duration: 0.75, ease: "power3.out" });
  gsap.from("#scene-digital", { scrollTrigger: st("#scene-digital"), opacity: 0, y: 50, duration: 0.75, ease: "power3.out" });
  gsap.from(".feat-card", { scrollTrigger: st(".feature-grid"), opacity: 0, y: 40, stagger: { each: 0.05, from: "start" }, duration: 0.55, ease: "power2.out" });
  gsap.from(".arch-node", { scrollTrigger: st(".arch-diagram"), opacity: 0, scale: 0.75, stagger: 0.12, duration: 0.6, ease: "back.out(1.5)" });
  gsap.from(".screen-card", { scrollTrigger: st(".screens-grid"), opacity: 0, y: 40, stagger: 0.1, duration: 0.75, ease: "power3.out" });
  gsap.from(".tech-card", { scrollTrigger: st(".tech-grid"), opacity: 0, y: 28, stagger: 0.13, duration: 0.6, ease: "power2.out" });
  gsap.from(".team-card", { scrollTrigger: st(".team-grid"), opacity: 0, y: 45, stagger: 0.18, duration: 0.8, ease: "power3.out" });
  gsap.from(".dl-inner > *", { scrollTrigger: st("#download", "top 78%"), opacity: 0, y: 28, stagger: 0.08, duration: 0.65, ease: "power2.out" });
  gsap.from(".section-label", { scrollTrigger: { trigger: ".section-label", start: "top 88%", toggleActions: "play none none none" }, opacity: 0, y: 18, duration: 0.55, ease: "power2.out" });
  gsap.from(".section-title", { scrollTrigger: { trigger: ".section-title", start: "top 88%", toggleActions: "play none none none" }, opacity: 0, y: 18, duration: 0.55, ease: "power2.out" });
  gsap.from(".section-sub", { scrollTrigger: { trigger: ".section-sub", start: "top 88%", toggleActions: "play none none none" }, opacity: 0, y: 18, duration: 0.55, ease: "power2.out" });
}