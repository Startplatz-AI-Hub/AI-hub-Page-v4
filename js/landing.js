gsap.registerPlugin(ScrollTrigger);

// Video Background Smart Behavior
const videoBg = document.querySelector('.video-bg');

// Reduce motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (videoBg) videoBg.pause();
}

// Pause video when scrolled far down (performance)
function handleVideoVisibility() {
  if (!videoBg) return;
  const scrollY = window.scrollY;
  const shouldPlay = scrollY < window.innerHeight * 3;

  if (shouldPlay && videoBg.paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videoBg.play();
  } else if (!shouldPlay && !videoBg.paused) {
    videoBg.pause();
  }
}

// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    // Trigger initial animations after preloader
    setTimeout(initAnimations, 300);
  }, 2000);
});

function initAnimations() {
  // Hero text animation (updated for new structure)
  gsap.from('.scramble-badge', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
  gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6, delay: 0.8, ease: 'power2.out' });
  gsap.from('.hero-ctas', { opacity: 0, y: 30, duration: 0.6, delay: 1, ease: 'power2.out' });
  gsap.from('.hero-card', { opacity: 0, x: 50, duration: 0.8, delay: 0.5, ease: 'power2.out' });
}

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  const currentScroll = window.scrollY;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;

  // Scroll progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.min((currentScroll / docHeight) * 100, 100);
  document.getElementById('scrollProgress').style.width = scrollPercent + '%';

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (currentScroll > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Handle video visibility
  handleVideoVisibility();
});

// Back to top click
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FAQ Toggle
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');

  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
}

// KPI Counter Animation with Intersection Observer (more reliable)
function animateKPIs() {
  const kpiNumbers = document.querySelectorAll('.kpi-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';

        const duration = 2500;
        const startTime = Date.now();

        function updateNumber() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(easeProgress * target);

          el.textContent = prefix + currentValue.toLocaleString('de-DE') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = prefix + target.toLocaleString('de-DE') + suffix;
          }
        }

        updateNumber();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  kpiNumbers.forEach(el => observer.observe(el));
}

// MOBILE MENU LOGIC
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');
  const icon = toggle ? toggle.querySelector('i') : null;

  if (!toggle || !overlay) return;

  function toggleMenu() {
    const isActive = toggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';

    // Icon animation
    if (icon) {
      if (isActive) {
        icon.classList.replace('ph-list', 'ph-x');
      } else {
        icon.classList.replace('ph-x', 'ph-list');
      }
    }
  }

  toggle.addEventListener('click', toggleMenu);

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });
}

// Initialize KPIs after DOM and GSAP are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    animateKPIs();
    initMobileMenu();
  });
} else {
  animateKPIs();
  initMobileMenu();
}

// Hero Grid Animation (Pulsating Grid)
class HeroGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.time = 0;
    this.init();
  }

  init() {
    this.resize();
    this.createPoints();
    this.bindEvents();
    this.animate();
    // Trigger pulse every 8 seconds
    this.pulseInterval = setInterval(() => this.triggerPulse(), 8000);
    // Initial pulse after 2 seconds
    setTimeout(() => this.triggerPulse(), 2000);
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    this.createPoints();
  }

  createPoints() {
    this.points = [];
    const spacing = 40;
    const cols = Math.ceil(this.canvas.width / spacing) + 1;
    const rows = Math.ceil(this.canvas.height / spacing) + 1;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.points.push({
          x: j * spacing,
          y: i * spacing,
          baseX: j * spacing,
          baseY: i * spacing,
          pulse: 0,
          row: i,
          col: j
        });
      }
    }
    this.cols = cols;
    this.rows = rows;
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    window.addEventListener('resize', () => this.resize());
  }

  triggerPulse() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.points.forEach((p, i) => {
      const dist = Math.hypot(p.x - centerX, p.y - centerY);
      const delay = dist * 1.5;
      setTimeout(() => {
        p.pulse = 1.2;
      }, delay);
    });
  }

  animate() {
    this.time += 0.01;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid lines
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      point.pulse *= 0.96;

      const nextPoint = this.points[i + 1];
      const belowPoint = this.points[i + this.cols];

      // Mouse distance for glow effect
      const mouseDist = Math.hypot(point.x - this.mouseX, point.y - this.mouseY);
      const mouseGlow = Math.max(0, 1 - mouseDist / 180);

      // Ambient wave
      const wave = Math.sin(this.time * 2 + point.row * 0.3 + point.col * 0.3) * 0.15 + 0.15;

      const intensity = Math.max(mouseGlow, point.pulse, wave);

      // Draw horizontal line
      if (nextPoint && (i + 1) % this.cols !== 0) {
        this.ctx.beginPath();
        this.ctx.setLineDash([3, 6]);
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(nextPoint.x, nextPoint.y);

        if (intensity > 0.3) {
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 + intensity * 0.6})`;
          this.ctx.shadowBlur = intensity * 8;
          this.ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        } else {
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 + intensity * 0.15})`;
          this.ctx.shadowBlur = 0;
        }
        this.ctx.lineWidth = 1 + intensity * 0.5;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.shadowBlur = 0;
      }

      // Draw vertical line
      if (belowPoint) {
        this.ctx.beginPath();
        this.ctx.setLineDash([3, 6]);
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(belowPoint.x, belowPoint.y);

        if (intensity > 0.3) {
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 + intensity * 0.6})`;
          this.ctx.shadowBlur = intensity * 8;
          this.ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        } else {
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 + intensity * 0.15})`;
          this.ctx.shadowBlur = 0;
        }
        this.ctx.lineWidth = 1 + intensity * 0.5;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.shadowBlur = 0;
      }

      // Draw node point
      const size = 2 + intensity * 3;
      if (intensity > 0.3) {
        this.ctx.fillStyle = `rgba(99, 102, 241, ${0.6 + intensity * 0.4})`;
        this.ctx.shadowBlur = intensity * 10;
        this.ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
      } else {
        this.ctx.fillStyle = `rgba(99, 102, 241, ${0.15 + intensity * 0.3})`;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize hero grid
new HeroGrid('heroGridCanvas');

// ==========================================
// VELOCITY MARQUEE - Scroll-responsive speed (from Design System)
// ==========================================
function initVelocityMarquee() {
  const marqueeInner = document.querySelector('.velocity-marquee-inner');
  if (!marqueeInner || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Base animation - infinite loop
  const tl = gsap.to(marqueeInner, {
    xPercent: -50,
    ease: "none",
    duration: 15,
    repeat: -1
  });

  let timer;

  // Velocity response
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity() / 300;
      let targetScale = 1;

      if (v > 0) {
        targetScale = 1 + v;
      } else if (v < 0) {
        targetScale = -1 + v;
      }

      targetScale = gsap.utils.clamp(-5, 5, targetScale);

      gsap.to(tl, {
        timeScale: targetScale,
        duration: 0.2,
        overwrite: true
      });

      clearTimeout(timer);
      timer = setTimeout(() => {
        gsap.to(tl, {
          timeScale: 1,
          duration: 0.8,
          ease: "power2.out"
        });
      }, 100);
    }
  });

  console.log("Velocity Marquee initialized");
}

// Initialize award-winning components
initVelocityMarquee();

// Carousel Navigation
document.querySelectorAll('.events-carousel-wrap').forEach(wrap => {
  const carousel = wrap.querySelector('.events-carousel');
  const prevBtn = wrap.querySelector('.carousel-btn.prev');
  const nextBtn = wrap.querySelector('.carousel-btn.next');

  if (prevBtn && nextBtn && carousel) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }
});

// Stories & Insights animations
gsap.from('.story-featured', {
  opacity: 0,
  x: -30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.stories-grid',
    start: 'top 80%'
  }
});
gsap.from('.story-small', {
  opacity: 0,
  x: 30,
  duration: 0.6,
  stagger: 0.15,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.stories-sidebar',
    start: 'top 80%'
  }
});

// Scroll reveal animations
gsap.utils.toArray('.section-header').forEach(el => {
  gsap.from(el, {
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true
    }
  });
});

gsap.utils.toArray('.audience-card, .event-card, .video-item').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0,
    y: 50,
    duration: 0.7,
    delay: (i % 3) * 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true
    }
  });
});

// Parallax slider section intro animation
gsap.from('.mentors-intro-text', {
  opacity: 0,
  x: -50,
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.parallax-slider-section',
    start: 'top 80%',
    once: true
  }
});

// Location cards stagger
gsap.from('.location-card', {
  opacity: 0,
  y: 40,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.location-cards',
    start: 'top 90%',
    once: true
  }
});

// Vision boxes
gsap.from('.vision-box, .certs-box', {
  opacity: 0,
  y: 40,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.vision-certs-grid',
    start: 'top 80%',
    once: true
  }
});

// ==========================================
// CHARACTER APPEAR - Data Waterfall Effect
// From Design System - Award-Winning Animation
// ==========================================
function initCharAppear() {
  const targets = document.querySelectorAll('[data-char-appear]');
  targets.forEach(target => {
    if (target.dataset.processed) return;
    target.dataset.processed = 'true';

    const text = target.innerText;
    const lines = text.split('\n');
    target.innerHTML = '';

    lines.forEach((line, lineIndex) => {
      const lineDiv = document.createElement('div');
      lineDiv.style.display = 'block';

      const chars = line.split('');
      chars.forEach(char => {
        const wrap = document.createElement('span');
        wrap.className = 'char-appear-wrap';
        wrap.innerHTML = `<span class="char-appear-inner">${char === ' ' ? '&nbsp;' : char}</span>`;
        lineDiv.appendChild(wrap);
      });

      if (lineIndex < lines.length - 1) {
        lineDiv.appendChild(document.createElement('br'));
      }
      target.appendChild(lineDiv);
    });

    // Animate immediately for hero (not on scroll)
    gsap.to(target.querySelectorAll('.char-appear-inner'), {
      y: '0%',
      duration: 0.8,
      stagger: 0.03,
      ease: 'expo.out',
      delay: 0.5
    });
  });
}

// ==========================================
// TEXT REVEAL - Scroll-Triggered Word Animation
// From Design System - Award-Winning Component
// ==========================================
function initTextReveal() {
  const elements = document.querySelectorAll('[data-anm-scroll-text-reveal]');

  elements.forEach(el => {
    const html = el.innerHTML;
    const strongWords = [];

    // Extract words inside <strong> tags
    html.replace(/<strong>([^<]+)<\/strong>/g, (match, word) => {
      strongWords.push(...word.trim().split(' '));
      return match;
    });

    // Get all words
    const textOnly = el.textContent;
    const words = textOnly.split(/\s+/).filter(w => w.length > 0);

    // Build new HTML with word wrappers
    el.innerHTML = words.map(word => {
      const isStrong = strongWords.some(sw => word.includes(sw) || sw.includes(word));
      const inner = `<span class="reveal-word"><span class="reveal-word-inner">${word}</span></span>`;
      return isStrong ? `<strong>${inner}</strong>` : inner;
    }).join(' ');

    el.style.visibility = 'visible';

    gsap.to(el.querySelectorAll('.reveal-word-inner'), {
      y: '0%',
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });
}

// ==========================================
// TEXT SCRAMBLE - Cyber Decode Effect
// From Design System - Matrix-style animation
// ==========================================
function initTextScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_';

  function scrambleText(el) {
    const original = el.dataset.original || el.innerText;
    el.dataset.original = original;

    let iterations = 0;
    const interval = setInterval(() => {
      el.innerText = original.split('').map((letter, index) => {
        if (letter === ' ' || letter === '_') return letter;
        if (index < iterations) return original[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iterations >= original.length) {
        clearInterval(interval);
        el.innerText = original;
      }
      iterations += 1 / 3;
    }, 30);
  }

  // Trigger on scroll into view
  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-scramble]').forEach(el => {
    scrambleObserver.observe(el);
  });
}

// ==========================================
// PARALLAX SLIDER - Infinite with nav controls
// From Design System - Award-Winning Component
// ==========================================
function initParallaxSlider() {
  const track = document.querySelector('.parallax-track');
  const wrap = document.querySelector('.mentors-slider-wrap');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const indicatorsContainer = document.getElementById('sliderIndicators');

  if (!track || typeof gsap === 'undefined') return;

  const originalItems = gsap.utils.toArray('.parallax-item');
  if (originalItems.length === 0) return;

  // Clone items for infinite loop (clone at start and end)
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  });

  const allItems = gsap.utils.toArray('.parallax-item');
  const itemWidth = 280 + 24; // width + gap
  const totalOriginal = originalItems.length;
  let currentIndex = totalOriginal; // Start at first real item (after clones)

  // Set initial position
  gsap.set(track, { x: -currentIndex * itemWidth });

  // Create indicators
  for (let i = 0; i < totalOriginal; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i + totalOriginal));
    indicatorsContainer.appendChild(dot);
  }

  const dots = indicatorsContainer.querySelectorAll('.slider-dot');

  function updateIndicators() {
    const realIndex = ((currentIndex - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === realIndex);
    });
  }

  function goToSlide(index, instant = false) {
    currentIndex = index;
    gsap.to(track, {
      x: -currentIndex * itemWidth,
      duration: instant ? 0 : 0.6,
      ease: "power2.out",
      onUpdate: updateParallax,
      onComplete: checkBounds
    });
    updateIndicators();
  }

  function checkBounds() {
    // If we've gone past the clones, jump back seamlessly
    if (currentIndex >= totalOriginal * 2) {
      currentIndex = totalOriginal;
      gsap.set(track, { x: -currentIndex * itemWidth });
    } else if (currentIndex < totalOriginal) {
      currentIndex = totalOriginal * 2 - 1;
      gsap.set(track, { x: -currentIndex * itemWidth });
    }
  }

  function updateParallax() {
    const wrapRect = wrap.getBoundingClientRect();
    allItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      const dist = (center - wrapCenter) / wrapRect.width;

      const img = item.querySelector('img');
      if (img) {
        gsap.set(img, {
          scale: 1 + Math.abs(dist) * 0.08,
          y: dist * 15
        });
      }
    });
  }

  // Button events
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Draggable
  let dragStartX = 0;
  let trackStartX = 0;

  if (typeof Draggable !== 'undefined') {
    Draggable.create(track, {
      type: "x",
      trigger: wrap,
      inertia: true,
      onPress: function () {
        dragStartX = this.x;
        trackStartX = gsap.getProperty(track, "x");
      },
      onDrag: updateParallax,
      onThrowUpdate: updateParallax,
      onRelease: function () {
        const moved = this.x - dragStartX;
        const threshold = itemWidth / 3;

        if (Math.abs(moved) > threshold) {
          if (moved > 0) {
            goToSlide(currentIndex - Math.round(Math.abs(moved) / itemWidth));
          } else {
            goToSlide(currentIndex + Math.round(Math.abs(moved) / itemWidth));
          }
        } else {
          goToSlide(currentIndex);
        }
      }
    });
  }

  // Initial parallax
  updateParallax();

  console.log("Parallax Slider initialized");
}

// ==========================================
// IMAGE TRAIL - Cursor Trail Effect
// From Design System - Premium Interaction
// ==========================================
function initImageTrail() {
  const areas = document.querySelectorAll('.trail-area');

  areas.forEach(area => {
    const images = [
      'https://res.cloudinary.com/startplatz/image/upload/v1767714994/ai-hub/website/website_stock_images/Jakow_website_portait.png',
      'https://res.cloudinary.com/startplatz/image/upload/v1767714990/ai-hub/website/website_stock_images/Lukas_website_portrait.png',
      'https://res.cloudinary.com/startplatz/image/upload/v1767714988/ai-hub/website/website_stock_images/Lorenz_website_portrait.png',
      'https://res.cloudinary.com/startplatz/image/upload/v1767714992/ai-hub/website/website_stock_images/Martin_website_portrait.png',
      'https://res.cloudinary.com/startplatz/image/upload/v1767662292/ai-hub/website/website_stock_images/MENTOR-04.png',
      'https://res.cloudinary.com/startplatz/image/upload/v1767662238/ai-hub/website/website_stock_images/MENTOR-05.png',
    ];

    let lastTime = 0;
    let imgIndex = 0;

    area.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 100) return; // Throttle
      lastTime = now;

      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const img = document.createElement('img');
      img.src = images[imgIndex % images.length];
      img.className = 'trail-image';
      img.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: 80px;
            height: 100px;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
          `;
      area.appendChild(img);
      imgIndex++;

      // Animate with GSAP
      const rotation = Math.random() * 30 - 15;
      gsap.timeline({ onComplete: () => img.remove() })
        .to(img, { scale: 1, rotation: rotation, duration: 0.3, ease: 'back.out(1.7)' })
        .to(img, { scale: 0.5, opacity: 0, y: y + 30, duration: 0.4 }, '+=0.2');
    });
  });
}

// ==========================================
// PROGRAM CARDS ANIMATIONS
// ==========================================
gsap.utils.toArray('.program-card').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: i * 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true
    }
  });
});

// Program filter tabs interaction
document.querySelectorAll('.program-filter-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    this.closest('.programs-filter-tabs').querySelectorAll('.program-filter-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ==========================================
// INITIALIZE ALL PREMIUM EFFECTS
// ==========================================
// Run after preloader or immediately if loaded
function initAllPremiumEffects() {
  initCharAppear();
  initTextReveal();
  initTextScramble();
  initParallaxSlider();
  initImageTrail();
}

// Initialize after preloader hides
setTimeout(initAllPremiumEffects, 2300);

console.log("All premium effects initialized");



// Re-init parallax slider after Draggable loads
if (typeof Draggable !== 'undefined') {
  initParallaxSlider();
}


// Global Cursor Glow
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  document.documentElement.style.setProperty('--mouse-x', x + 'px');
  document.documentElement.style.setProperty('--mouse-y', y + 'px');
});