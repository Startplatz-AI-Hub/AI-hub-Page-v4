    /**
     * STARTPLATZ AI Hub - Enterprise Design System
     * Interactive Documentation with Mesh Animation
     */
    
    // ========================================
    // STITCH GRID ANIMATION - AI Hub Brand Style
    // Sharp 2px corners, dashed lines, zigzag accents
    // ========================================
    class MeshGrid {
      constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.glowRadius = options.glowRadius || 150;
        this.spacing = options.spacing || 40;
        this.dotSize = options.dotSize || 2; // Now represents square half-size
        this.lineColor = options.lineColor || 'rgba(156, 163, 175, 0.25)';
        this.dotColor = options.dotColor || 'rgba(156, 163, 175, 0.4)';
        this.glowColor = options.glowColor || 'rgba(139, 92, 246, 0.8)'; // Primary purple
        this.dashPattern = options.dashPattern || [4, 4]; // Stitch pattern
        this.showZigzag = options.showZigzag !== false; // Zigzag accents
        
        this.init();
      }
      
      init() {
        this.resize();
        this.createPoints();
        this.bindEvents();
        this.animate();
      }
      
      resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createPoints();
      }
      
      createPoints() {
        this.points = [];
        const cols = Math.ceil(this.canvas.width / this.spacing) + 1;
        const rows = Math.ceil(this.canvas.height / this.spacing) + 1;
        
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            this.points.push({
              x: j * this.spacing,
              y: i * this.spacing,
              baseX: j * this.spacing,
              baseY: i * this.spacing,
              row: i,
              col: j
            });
          }
        }
        this.cols = cols;
        this.rows = rows;
      }
      
      bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = e.clientX - rect.left;
          this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
          this.mouseX = -1000;
          this.mouseY = -1000;
        });
        
        window.addEventListener('resize', () => this.resize());
      }
      
      // Draw a dashed line (stitch style)
      drawStitchLine(x1, y1, x2, y2, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.setLineDash(this.dashPattern);
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset
      }
      
      // Draw zigzag accent at intersection
      drawZigzag(x, y, size, color, intensity) {
        if (!this.showZigzag) return;
        
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        const z = size * (0.5 + intensity * 0.5);
        
        // Small zigzag corner accent
        this.ctx.moveTo(x - z, y);
        this.ctx.lineTo(x, y - z);
        this.ctx.lineTo(x + z, y);
        this.ctx.lineTo(x, y + z);
        this.ctx.closePath();
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
      
      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw dashed grid lines
        for (let i = 0; i < this.points.length; i++) {
          const point = this.points[i];
          const nextPoint = this.points[i + 1];
          
          // Horizontal stitch line
          if (nextPoint && (i + 1) % this.cols !== 0) {
            const midX = (point.x + nextPoint.x) / 2;
            const midY = (point.y + nextPoint.y) / 2;
            const dist = Math.hypot(midX - this.mouseX, midY - this.mouseY);
            
            if (dist < this.glowRadius) {
              const intensity = 1 - (dist / this.glowRadius);
              this.drawStitchLine(
                point.x, point.y, nextPoint.x, nextPoint.y,
                this.glowColor.replace('0.8', (0.4 + intensity * 0.4).toFixed(2)),
                1 + intensity * 0.5
              );
            } else {
              this.drawStitchLine(point.x, point.y, nextPoint.x, nextPoint.y, this.lineColor, 1);
            }
          }
          
          // Vertical stitch line
          const belowPoint = this.points[i + this.cols];
          if (belowPoint) {
            const midX = (point.x + belowPoint.x) / 2;
            const midY = (point.y + belowPoint.y) / 2;
            const dist = Math.hypot(midX - this.mouseX, midY - this.mouseY);
            
            if (dist < this.glowRadius) {
              const intensity = 1 - (dist / this.glowRadius);
              this.drawStitchLine(
                point.x, point.y, belowPoint.x, belowPoint.y,
                this.glowColor.replace('0.8', (0.4 + intensity * 0.4).toFixed(2)),
                1 + intensity * 0.5
              );
            } else {
              this.drawStitchLine(point.x, point.y, belowPoint.x, belowPoint.y, this.lineColor, 1);
            }
          }
        }
        
        // Draw square nodes (2px corners - brand style)
        this.points.forEach(point => {
          const dist = Math.hypot(point.x - this.mouseX, point.y - this.mouseY);
          const size = this.dotSize;
          
          if (dist < this.glowRadius) {
            const intensity = 1 - (dist / this.glowRadius);
            const glowSize = size + intensity * 2;
            
            // Glow square with rounded corners (2px)
            this.ctx.fillStyle = this.glowColor;
            this.ctx.beginPath();
            this.roundRect(point.x - glowSize, point.y - glowSize, glowSize * 2, glowSize * 2, 1);
            this.ctx.fill();
            
            // Zigzag accent on hover
            if (intensity > 0.5) {
              this.drawZigzag(point.x, point.y, 8, this.glowColor, intensity);
            }
          } else {
            // Regular square node
            this.ctx.fillStyle = this.dotColor;
            this.ctx.fillRect(point.x - size, point.y - size, size * 2, size * 2);
          }
        });
        
        requestAnimationFrame(() => this.animate());
      }
      
      // Helper: rounded rectangle (2px corners)
      roundRect(x, y, w, h, r) {
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
      }
    }
    
    // ========================================
    // DYNAMIC STITCH GRID (Animated Moving Points)
    // AI Hub Brand Style - Dashed lines, square nodes, zigzag accents
    // Used in Hero Section
    // ========================================
    class DynamicMeshGrid {
      constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.glowRadius = options.glowRadius || 150;
        this.spacing = options.spacing || 50;
        this.dotSize = options.dotSize || 3;
        this.lineColor = options.lineColor || 'rgba(156, 163, 175, 0.3)';
        this.dotColor = options.dotColor || 'rgba(156, 163, 175, 0.5)';
        this.glowColor = options.glowColor || 'rgba(139, 92, 246, 0.8)'; // Primary purple
        this.maxDrift = options.maxDrift || 25;
        this.dashPattern = options.dashPattern || [5, 5]; // Stitch pattern
        this.showZigzag = options.showZigzag !== false;
        this.zigzagPhase = 0; // Animation phase for zigzags
        
        this.init();
      }
      
      init() {
        this.resize();
        this.createPoints();
        this.bindEvents();
        this.animate();
      }
      
      resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createPoints();
      }
      
      createPoints() {
        this.points = [];
        const cols = Math.ceil(this.canvas.width / this.spacing) + 2;
        const rows = Math.ceil(this.canvas.height / this.spacing) + 2;
        
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            this.points.push({
              x: i * this.spacing,
              y: j * this.spacing,
              baseX: i * this.spacing,
              baseY: j * this.spacing,
              vx: Math.random() * 0.4 - 0.2,
              vy: Math.random() * 0.4 - 0.2,
              col: i,
              row: j
            });
          }
        }
        this.cols = cols;
        this.rows = rows;
      }
      
      bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = e.clientX - rect.left;
          this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
          this.mouseX = -1000;
          this.mouseY = -1000;
        });
        
        window.addEventListener('resize', () => this.resize());
      }
      
      // Draw dashed line (stitch style)
      drawStitchLine(x1, y1, x2, y2, color, lineWidth) {
        this.ctx.beginPath();
        this.ctx.setLineDash(this.dashPattern);
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
      
      // Draw animated zigzag corner accent
      drawZigzagAccent(x, y, size, color, intensity) {
        if (!this.showZigzag || intensity < 0.3) return;
        
        const z = size * intensity;
        const phase = this.zigzagPhase;
        
        // Animated rotating zigzag
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(phase * 0.02);
        
        this.ctx.beginPath();
        this.ctx.moveTo(-z, 0);
        this.ctx.lineTo(-z * 0.3, -z * 0.5);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(z * 0.3, -z * 0.5);
        this.ctx.lineTo(z, 0);
        this.ctx.lineTo(z * 0.3, z * 0.5);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(-z * 0.3, z * 0.5);
        this.ctx.closePath();
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.restore();
      }
      
      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.zigzagPhase++; // Animate zigzags
        
        // Update points - they drift and bounce back
        this.points.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          
          const dx = p.x - p.baseX;
          const dy = p.y - p.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > this.maxDrift) {
            p.vx *= -0.9;
            p.vy *= -0.9;
          }
        });
        
        // Draw dashed grid lines
        for (let i = 0; i < this.cols - 1; i++) {
          for (let j = 0; j < this.rows - 1; j++) {
            const idx = i * this.rows + j;
            const p1 = this.points[idx];
            const p2 = this.points[idx + 1];
            const p3 = this.points[(i + 1) * this.rows + j];
            
            // Horizontal stitch line
            if (p1 && p2) {
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const mouseDist = Math.hypot(midX - this.mouseX, midY - this.mouseY);
              const glow = Math.max(0, 1 - mouseDist / this.glowRadius);
              
              if (glow > 0) {
                this.drawStitchLine(
                  p1.x, p1.y, p2.x, p2.y,
                  `rgba(139, 92, 246, ${0.3 + glow * 0.5})`,
                  1 + glow
                );
              } else {
                this.drawStitchLine(p1.x, p1.y, p2.x, p2.y, this.lineColor, 1);
              }
            }
            
            // Vertical stitch line
            if (p1 && p3) {
              const midX = (p1.x + p3.x) / 2;
              const midY = (p1.y + p3.y) / 2;
              const mouseDist = Math.hypot(midX - this.mouseX, midY - this.mouseY);
              const glow = Math.max(0, 1 - mouseDist / this.glowRadius);
              
              if (glow > 0) {
                this.drawStitchLine(
                  p1.x, p1.y, p3.x, p3.y,
                  `rgba(139, 92, 246, ${0.3 + glow * 0.5})`,
                  1 + glow
                );
              } else {
                this.drawStitchLine(p1.x, p1.y, p3.x, p3.y, this.lineColor, 1);
              }
            }
          }
        }
        
        // Draw square nodes with zigzag accents
        this.points.forEach(p => {
          const mouseDist = Math.hypot(p.x - this.mouseX, p.y - this.mouseY);
          const glow = Math.max(0, 1 - mouseDist / this.glowRadius);
          const size = this.dotSize;
          
          if (glow > 0) {
            const glowSize = size + glow * 2;
            
            // Glowing square node
            this.ctx.fillStyle = `rgba(139, 92, 246, ${0.5 + glow * 0.5})`;
            this.ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2);
            
            // Zigzag accent on strong hover
            this.drawZigzagAccent(p.x, p.y, 10, `rgba(139, 92, 246, ${glow})`, glow);
          } else {
            // Regular square node (2px style)
            this.ctx.fillStyle = this.dotColor;
            this.ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
          }
        });
        
        requestAnimationFrame(() => this.animate());
      }
    }
    
    // Initialize stitch grids when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      // Static stitch grid - dashed lines, square nodes
      new MeshGrid('meshDemoCanvas', {
        spacing: 40,
        dotSize: 2,
        glowRadius: 130,
        lineColor: 'rgba(156, 163, 175, 0.25)',
        dotColor: 'rgba(156, 163, 175, 0.4)',
        glowColor: 'rgba(139, 92, 246, 0.8)',
        dashPattern: [4, 4],
        showZigzag: true
      });
      
      // Dynamic stitch grid - animated points with zigzag accents
      new DynamicMeshGrid('dynamicMeshCanvas', {
        spacing: 50,
        dotSize: 3,
        glowRadius: 150,
        maxDrift: 20,
        lineColor: 'rgba(156, 163, 175, 0.3)',
        dotColor: 'rgba(156, 163, 175, 0.5)',
        glowColor: 'rgba(139, 92, 246, 0.8)',
        dashPattern: [5, 5],
        showZigzag: true
      });
      
      // Overlay mesh (on video)
      new MeshGrid('meshOverlayCanvas', {
        spacing: 50,
        dotSize: 1.5,
        glowRadius: 100,
        lineColor: 'rgba(255, 255, 255, 0.15)',
        dotColor: 'rgba(255, 255, 255, 0.25)',
        glowColor: 'rgba(108, 92, 231, 0.7)'
      });
      
      // ========================================
      // SCROLL REVEAL - Section Entrance Animations
      // Inspired by award-winning animations
      // ========================================
      const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Don't unobserve if we want to re-trigger on scroll back
          }
        });
      }, { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });
      
      // Apply to all section headers
      document.querySelectorAll('.ds-section-header').forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${index * 0.05}s`;
        scrollRevealObserver.observe(el);
      });
      
      // Apply section entrance to all sections
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.ds-section').forEach(el => {
        el.classList.add('section-entrance');
        sectionObserver.observe(el);
      });
    });
    
    // ========================================
    // ACCORDION COMPONENT
    // ========================================
    function toggleAccordion(trigger) {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = trigger.classList.contains('active');
      
      // Close all accordions in the same group
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion-trigger').forEach(t => {
        t.classList.remove('active');
        t.closest('.accordion-item').querySelector('.accordion-content').style.maxHeight = '0';
      });
      
      // Open clicked one if it was closed
      if (!isOpen) {
        trigger.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }
    
    // ========================================
    // TABS COMPONENT
    // ========================================
    function switchTab(btn, panelId) {
      const tabs = btn.closest('.tabs');
      
      // Update buttons
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update panels
      tabs.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(panelId).classList.add('active');
    }
    
    // ========================================
    // MOBILE SIDEBAR
    // ========================================
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }
    
    // Close sidebar on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('open')) {
          toggleSidebar();
        }
      }
    });
    
    // ========================================
    // NAVIGATION
    // ========================================
    document.querySelectorAll('.ds-nav-links a').forEach(link => {
      link.addEventListener('click', function(e) {
        document.querySelectorAll('.ds-nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        if (window.innerWidth < 1024) {
          toggleSidebar();
        }
      });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('.ds-section');
    const navLinks = document.querySelectorAll('.ds-nav-links a');
    
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });
    
    sections.forEach(section => navObserver.observe(section));
    
    // ========================================
    // SCROLL PROGRESS
    // ========================================
    window.addEventListener('scroll', () => {
      const scrollProgress = document.querySelector('.scroll-progress-bar');
      if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        scrollProgress.style.width = scrollPercent + '%';
      }
    });
    
    // ========================================
    // COPY TO CLIPBOARD
    // ========================================
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const code = swatch.querySelector('.color-preview code');
        if (code) {
          navigator.clipboard.writeText(code.textContent);
          showToast('Color copied!');
        }
      });
    });
    
    document.querySelectorAll('.icon-item').forEach(item => {
      item.addEventListener('click', () => {
        const iconClass = item.querySelector('span').textContent;
        navigator.clipboard.writeText(`<i class="${iconClass}"></i>`);
        showToast('Icon copied!');
      });
    });
    
    // ========================================
    // FAQ DEMO TOGGLE
    // ========================================
    function toggleFaqDemo(btn) {
      const item = btn.closest('.faq-item-demo');
      const allItems = document.querySelectorAll('.faq-item-demo');
      const answer = item.querySelector('.faq-answer-demo');
      const icon = btn.querySelector('i');
      const isActive = item.classList.contains('active');
      
      // Close all items
      allItems.forEach(i => {
        i.classList.remove('active');
        i.style.borderColor = 'var(--color-black)';
        const q = i.querySelector('.faq-question-demo');
        q.style.background = 'var(--color-white)';
        q.style.color = 'var(--color-black)';
        i.querySelector('.faq-answer-demo').style.maxHeight = '0';
        i.querySelector('i').style.transform = 'rotate(0deg)';
      });
      
      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
        item.style.borderColor = 'var(--color-primary)';
        btn.style.background = 'var(--color-primary)';
        btn.style.color = 'white';
        answer.style.maxHeight = '200px';
        icon.style.transform = 'rotate(180deg)';
      }
    }
    
    // ========================================
    // COUNT-UP ANIMATION
    // ========================================
    function animateCountUp(element) {
      const target = parseInt(element.dataset.target);
      const prefix = element.dataset.prefix || '';
      const suffix = element.dataset.suffix || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }, 16);
    }
    
    function triggerCountUp() {
      document.querySelectorAll('.countup-demo').forEach(el => {
        el.textContent = '0';
        animateCountUp(el);
      });
    }
    
    // Auto-trigger count-up when section is in view
    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          countUpObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.countup-demo').forEach(el => countUpObserver.observe(el));
    });
    
    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    function showToast(message) {
      const existingToast = document.querySelector('.ds-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.className = 'ds-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--color-black);
        color: white;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      toast.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${message}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'fadeInUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }
    
    // ========================================
    // CIRCULAR SLIDER - Award-Winning from Annnimate.com
    // https://www.annnimate.com/try/circular-slider
    // Circular carousel using MotionPath + Draggable
    // ========================================
    
    if (typeof gsap !== "undefined") {
      const plugins = [MotionPathPlugin, Draggable].filter(
        (p) => typeof p !== "undefined"
      );
      if (plugins.length) {
        gsap.registerPlugin(...plugins);
      }
    }

    function initCircularSlider() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const sliders = document.querySelectorAll("[data-anm-circular-slider]");
      if (!sliders.length) return;

      const defaults = {
        type: "snap",
        autoplay: 0,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
      };

      const getConfig = (el, attr, defaultValue) => {
        let value = el.getAttribute(`data-anm-${attr}`);
        if (value === null) {
          value = el.getAttribute(`data-anm-circular-slider-${attr}`);
        }
        if (value === null) return defaultValue;
        if (value === "true") return true;
        if (value === "false") return false;
        return isNaN(value) ? value : parseFloat(value);
      };

      const getConfigValue = (el, cssVarName, attrName, defaultValue) => {
        const cssValue = getComputedStyle(el).getPropertyValue(cssVarName)?.trim();
        if (cssValue && cssValue !== '') return cssValue;
        const attrValue = getConfig(el, attrName, null);
        if (attrValue !== null) return attrValue;
        return defaultValue;
      };

      const isDisabled = (el) => {
        const disable = el.dataset.anmDisable;
        if (!disable) return false;

        const breakpoints = {
          mobile: "(max-width: 479px)",
          tablet: "(max-width: 991px)",
          desktop: "(min-width: 992px)",
        };

        return disable
          .split(",")
          .some(
            (v) =>
              breakpoints[v.trim()] &&
              window.matchMedia(breakpoints[v.trim()]).matches
          );
      };

      sliders.forEach((slider) => {
        if (isDisabled(slider)) return;

        const container = slider.querySelector("[data-anm-circular-slider-container]");
        const circle = slider.querySelector("[data-anm-circular-slider-path]");
        const svg = slider.querySelector("svg");
        const items = container
          ? Array.from(container.querySelectorAll("[data-anm-circular-slider-item]"))
          : [];

        if (!container || !circle || !svg || !items.length) {
          console.warn("Circular Slider: Missing container, circle, svg, or items");
          return;
        }

        const sliderType = getConfig(slider, "type", defaults.type);
        const snapEnabled = sliderType === "snap";
        const autoplayInterval = getConfig(slider, "autoplay", defaults.autoplay);
        const duration = getConfig(slider, "duration", defaults.duration);
        const ease = getConfig(slider, "ease", defaults.ease);

        const wrapper = slider.closest(".circular_slider_demo_wrap") || slider.parentElement;
        const prevBtn =
          slider.querySelector("[data-anm-circular-slider-prev]") ||
          wrapper?.querySelector("[data-anm-circular-slider-prev]");
        const nextBtn =
          slider.querySelector("[data-anm-circular-slider-next]") ||
          wrapper?.querySelector("[data-anm-circular-slider-next]");

        const numItems = items.length;
        const sliceAngle = 360 / numItems;

        let isDragging = false;
        let autoplayTimer = null;
        let autoplayTween = null;
        let draggableInstance = null;
        let resizeTimeout = null;
        let circlePath = null;

        const calculateDimensions = () => {
          const viewportWidth = window.innerWidth;
          const sampleCard = items[0]?.querySelector('.circular_slider_image');
          const cardWidth = sampleCard ? sampleCard.offsetWidth : 360;
          const spacingMultiplier = parseFloat(
            getConfigValue(slider, '--anm-circle-multiplier', 'circle-multiplier', 5)
          );
          
          // Check if we're inside a demo wrapper (design system) or full-page context
          const demoWrapper = slider.closest('.circular_slider_demo_wrap');
          let circleSize;
          
          if (demoWrapper) {
            // For demo context: use tight spacing based on card width only
            // This creates the desired fan-like arrangement where cards overlap
            circleSize = cardWidth * spacingMultiplier;
          } else {
            // For full-page context: use viewport-based sizing
            circleSize = Math.max(
              cardWidth * spacingMultiplier,
              viewportWidth * 2
            );
          }
          
          return { circleSize, cardWidth, viewportWidth };
        };

        const setupLayout = (preserveRotation = false) => {
          const { circleSize } = calculateDimensions();
          const currentRotation = preserveRotation && draggableInstance
            ? gsap.getProperty(container, "rotation")
            : 0;

          gsap.set(container, {
            position: "absolute",
            width: circleSize,
            height: circleSize,
            left: "50%",
            top: "50%",
            xPercent: -50,
            display: "block",
            overflow: "visible",
            padding: 0,
            gap: 0,
            rotation: currentRotation
          });

          gsap.set(svg, {
            display: "block",
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none"
          });

          gsap.set(items, {
            position: "absolute",
            flex: "none"
          });

          if (!circlePath) {
            circlePath = MotionPathPlugin.convertToPath(circle, false)[0];
            circlePath.id = "circular-slider-path-" + Math.random().toString(36).substr(2, 9);
            svg.prepend(circlePath);
          }

          gsap.set(items, {
            motionPath: {
              path: circlePath,
              align: circlePath,
              alignOrigin: [0.5, 0.5],
              start: -0.25,
              end: (i) => i / numItems - 0.25,
              autoRotate: true,
            },
          });
        };

        const setupDraggable = () => {
          if (draggableInstance) {
            draggableInstance.kill();
          }

          draggableInstance = Draggable.create(container, {
            type: "rotation",
            inertia: typeof InertiaPlugin !== "undefined",
            cursor: "grab",
            activeCursor: "grabbing",
            allowNativeTouchScrolling: true,
            snap: snapEnabled ? (endVal) => gsap.utils.snap(sliceAngle, endVal) : false,
            onDragStart: function () {
              isDragging = true;
              stopAutoplay();
            },
            onDragEnd: function () {
              isDragging = false;
              startAutoplay();
            },
          })[0];
        };

        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            stopAutoplay();
            setupLayout(true);
            setupDraggable();
            if (!isDragging) {
              startAutoplay();
            }
          }, 250);
        };

        const startAutoplay = () => {
          if (autoplayInterval > 0 && !isDragging) {
            if (snapEnabled) {
              if (!autoplayTimer) {
                autoplayTimer = setInterval(() => {
                  if (!isDragging) {
                    nextSlide();
                  }
                }, autoplayInterval);
              }
            } else {
              const currentRotation = gsap.getProperty(container, "rotation");
              autoplayTween = gsap.to(container, {
                rotation: currentRotation - 360,
                duration: (autoplayInterval / 1000) * 10,
                ease: "none",
                repeat: -1,
              });
            }
          }
        };

        const stopAutoplay = () => {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
          if (autoplayTween) {
            autoplayTween.kill();
            autoplayTween = null;
          }
        };

        const nextSlide = () => {
          if (draggableInstance) {
            const currentRotation = gsap.getProperty(container, "rotation");
            const targetRotation = currentRotation - sliceAngle;
            gsap.to(container, {
              rotation: snapEnabled
                ? gsap.utils.snap(sliceAngle, targetRotation)
                : targetRotation,
              duration: duration,
              ease: ease,
            });
          }
        };

        const prevSlide = () => {
          if (draggableInstance) {
            const currentRotation = gsap.getProperty(container, "rotation");
            const targetRotation = currentRotation + sliceAngle;
            gsap.to(container, {
              rotation: snapEnabled
                ? gsap.utils.snap(sliceAngle, targetRotation)
                : targetRotation,
              duration: duration,
              ease: ease,
            });
          }
        };

        setupLayout();
        setupDraggable();

        window.addEventListener("resize", handleResize);

        if (prevBtn) {
          prevBtn.addEventListener("click", () => {
            stopAutoplay();
            prevSlide();
            startAutoplay();
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener("click", () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
          });
        }

        startAutoplay();

        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            stopAutoplay();
          } else if (!isDragging) {
            startAutoplay();
          }
        });

        slider.dispatchEvent(
          new CustomEvent("anm-circular-slider-init", {
            detail: {
              slider,
              container,
              items,
              numItems,
              nextSlide,
              prevSlide,
              startAutoplay,
              stopAutoplay,
            },
          })
        );
      });
    }

    function waitForGSAP(callback, attempts = 0) {
      if (
        typeof gsap !== "undefined" &&
        typeof MotionPathPlugin !== "undefined" &&
        typeof Draggable !== "undefined"
      ) {
        callback();
      } else if (attempts < 50) {
        setTimeout(() => waitForGSAP(callback, attempts + 1), 100);
      } else {
        console.warn("Circular Slider: GSAP plugins not found");
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        waitForGSAP(initCircularSlider)
      );
    } else {
      waitForGSAP(initCircularSlider);
    }

    window.Anm = window.Anm || {};
    window.Anm.CircularSlider = {
      refresh: initCircularSlider,
    };

    // ========================================
    // TEXT REVEAL - Award-Winning Scroll Animation
    // From Annnimate.com - https://www.annnimate.com/try/text-reveal
    // Professional text reveal using GSAP SplitText with masking
    // ========================================
    
    function initScrollTextReveal() {
      // Skip if reduced motion is preferred
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
      const elements = document.querySelectorAll("[data-anm-scroll-text-reveal]");
      if (!elements.length) return;
    
      // Split configuration for different types
      const textSplitConfig = {
        lines: { duration: 0.8, stagger: 0.08 },
        words: { duration: 0.6, stagger: 0.06 },
        chars: { duration: 0.4, stagger: 0.01 },
      };
    
      // Default configuration
      const defaults = {
        type: "lines",
        start: "top 80%",
        end: null,
        scrub: false,
        ease: "expo.out",
        yPercent: 110,
        markers: false,
      };
    
      // Helper: Get config from element attributes
      const getConfig = (el) => {
        const type = el.dataset.anmType || defaults.type;
        const config = textSplitConfig[type] || textSplitConfig.lines;
    
        const hasDuration = el.hasAttribute("data-anm-duration");
        const hasStagger = el.hasAttribute("data-anm-stagger");
        const hasYPercent = el.hasAttribute("data-anm-y-percent");
    
        return {
          type: type,
          start: el.dataset.anmStart || defaults.start,
          end: el.dataset.anmEnd || defaults.end,
          scrub:
            el.dataset.anmScrub === "true" ||
            parseFloat(el.dataset.anmScrub) ||
            defaults.scrub,
          duration: hasDuration
            ? parseFloat(el.dataset.anmDuration)
            : config.duration,
          ease: el.dataset.anmEase || defaults.ease,
          stagger: hasStagger ? parseFloat(el.dataset.anmStagger) : config.stagger,
          yPercent: hasYPercent
            ? parseFloat(el.dataset.anmYPercent)
            : defaults.yPercent,
          markers: el.dataset.anmMarkers === "true" || defaults.markers,
        };
      };
    
      // Helper: Check if disabled on current viewport
      const isDisabled = (el) => {
        const disable = el.dataset.anmDisable;
        if (!disable) return false;
    
        const breakpoints = {
          mobile: "(max-width: 479px)",
          tablet: "(max-width: 991px)",
          desktop: "(min-width: 992px)",
        };
    
        return disable
          .split(",")
          .some(
            (v) =>
              breakpoints[v.trim()] &&
              window.matchMedia(breakpoints[v.trim()]).matches
          );
      };
    
      // Wait for fonts to load before splitting
      document.fonts.ready.then(() => {
        elements.forEach((element) => {
          if (isDisabled(element)) return;
    
          const config = getConfig(element);
    
          const targetSelector = element.dataset.anmTarget;
          let textTargets;
    
          if (targetSelector) {
            textTargets = Array.from(element.querySelectorAll(targetSelector));
            if (textTargets.length === 0) {
              console.warn(
                `[Text Reveal] No elements found for selector: ${targetSelector}`
              );
              textTargets = [element];
            }
          } else {
            textTargets = [element];
          }
    
          textTargets.forEach((textElement) => {
            animateTextElement(textElement, element, config);
          });
        });
      });
    
      function animateTextElement(textElement, triggerElement, config) {
        const typesToSplit =
          config.type === "lines"
            ? ["lines"]
            : config.type === "words"
              ? ["lines", "words"]
              : ["lines", "words", "chars"];
    
        // Check if SplitText is available
        if (typeof SplitText === "undefined") {
          console.warn("[Text Reveal] SplitText plugin not loaded. Falling back to basic animation.");
          // Fallback: Just make visible without split animation
          gsap.set(textElement, { autoAlpha: 1 });
          return;
        }
    
        SplitText.create(textElement, {
          type: typesToSplit.join(","),
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          onSplit: function (instance) {
            const targets = instance[config.type];
    
            gsap.set(targets, {
              yPercent: config.yPercent,
              force3D: true,
            });
    
            gsap.set(textElement, { autoAlpha: 1 });
    
            return gsap.to(targets, {
              yPercent: 0,
              duration: config.duration,
              stagger: config.stagger,
              ease: config.ease,
              force3D: true,
              scrollTrigger: {
                trigger: triggerElement,
                start: () => `clamp(${config.start})`,
                end: () => config.end || "bottom 20%",
                scrub: config.scrub || 0.8, // Enable smooth scrub for bidirectional
                invalidateOnRefresh: true,
                markers: config.markers,
                // Bidirectional: play forward on scroll down, reverse on scroll up
                toggleActions: "play reverse play reverse",
                onEnter: () => {
                  triggerElement.dispatchEvent(
                    new CustomEvent("anm-scroll-text-reveal-enter", {
                      detail: { element: textElement },
                    })
                  );
                },
                onLeaveBack: () => {
                  triggerElement.dispatchEvent(
                    new CustomEvent("anm-scroll-text-reveal-leave-back", {
                      detail: { element: textElement },
                    })
                  );
                },
              },
              onComplete: () => {
                triggerElement.dispatchEvent(
                  new CustomEvent("anm-scroll-text-reveal-complete", {
                    detail: { element: textElement },
                  })
                );
              },
            });
          },
        });
      }
    
      let resizeTimer,
        lastW = window.innerWidth;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (
            window.matchMedia("(hover: none)").matches &&
            window.innerWidth === lastW
          )
            return;
          lastW = window.innerWidth;
          ScrollTrigger.refresh();
        }, 250);
      });
    }
    
    // Wait for GSAP, ScrollTrigger, and SplitText to load for Text Reveal
    function waitForTextRevealGSAP(callback, attempts = 0) {
      if (
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
      ) {
        // SplitText is optional - animation has fallback
        callback();
      } else if (attempts < 50) {
        setTimeout(() => waitForTextRevealGSAP(callback, attempts + 1), 100);
      } else {
        console.warn("GSAP or ScrollTrigger not found for Text Reveal");
      }
    }
    
    // Initialize Text Reveal when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        waitForTextRevealGSAP(initScrollTextReveal)
      );
    } else {
      waitForTextRevealGSAP(initScrollTextReveal);
    }
    
    // Public API for Text Reveal
    window.Anm.ScrollTextReveal = {
      refresh: () => {
        if (window.Anm.ScrollTextReveal._cleanup) {
          window.Anm.ScrollTextReveal._cleanup();
        }
        waitForTextRevealGSAP(initScrollTextReveal);
      },
    };
    
    // ========================================
    // PREMIUM EFFECTS - Award-Winning Components
    // Adapted to AI Hub Brand Design
    // ========================================
    
    // CHARACTER APPEAR - Data Waterfall Effect
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
        
        // Animate on scroll
        if (typeof gsap !== 'undefined') {
          gsap.to(target.querySelectorAll('.char-appear-inner'), {
            y: '0%',
            duration: 0.8,
            stagger: 0.025,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 85%'
            }
          });
        }
      });
    }
    
    // Replay character animation
    document.addEventListener('DOMContentLoaded', () => {
      const replayBtn = document.getElementById('replayCharAppear');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          document.querySelectorAll('.char-appear-inner').forEach(el => {
            el.style.transform = 'translateY(110%)';
          });
          setTimeout(() => {
            if (typeof gsap !== 'undefined') {
              gsap.to('.char-appear-inner', {
                y: '0%',
                duration: 0.8,
                stagger: 0.025,
                ease: 'expo.out'
              });
            }
          }, 100);
        });
      }
    });
    
    // CURSOR TOOLTIP - Frosted Glass Following Tooltip
    function initCursorTooltip() {
      // Create tooltip element
      let tooltip = document.getElementById('premium-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'premium-tooltip';
        tooltip.className = 'cursor-tooltip';
        document.body.appendChild(tooltip);
      }
      
      let mouseX = 0, mouseY = 0;
      let tooltipX = 0, tooltipY = 0;
      
      // Smooth follow
      function updateTooltipPosition() {
        tooltipX += (mouseX - tooltipX) * 0.15;
        tooltipY += (mouseY - tooltipY) * 0.15;
        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
        requestAnimationFrame(updateTooltipPosition);
      }
      updateTooltipPosition();
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX + 15;
        mouseY = e.clientY + 15;
      });
      
      // Attach to elements with data-tooltip
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          tooltip.textContent = el.dataset.tooltip;
          tooltip.classList.add('visible');
        });
        el.addEventListener('mouseleave', () => {
          tooltip.classList.remove('visible');
        });
      });
    }
    
    // IMAGE TRAIL - Cursor Trail Effect
    function initImageTrail() {
      const area = document.getElementById('imageTrailArea');
      if (!area) return;
      
      const images = [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=200&fit=crop',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&h=200&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=200&fit=crop',
        'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=150&h=200&fit=crop'
      ];
      
      let lastTime = 0;
      let imgIndex = 0;
      
      area.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 80) return; // Throttle
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
          width: 120px;
          height: 160px;
          transform: translate(-50%, -50%) scale(0) rotate(0deg);
        `;
        area.appendChild(img);
        imgIndex++;
        
        // Animate with GSAP or CSS
        if (typeof gsap !== 'undefined') {
          const rotation = Math.random() * 30 - 15;
          gsap.timeline({ onComplete: () => img.remove() })
            .to(img, { scale: 1, rotation: rotation, duration: 0.4, ease: 'back.out(1.7)' })
            .to(img, { scale: 0.5, opacity: 0, y: y + 50, duration: 0.5 }, '+=0.1');
        } else {
          // Fallback CSS animation
          img.style.transition = 'all 0.4s ease';
          setTimeout(() => {
            img.style.transform = `translate(-50%, -50%) scale(1) rotate(${Math.random() * 30 - 15}deg)`;
          }, 10);
          setTimeout(() => {
            img.style.opacity = '0';
            img.style.transform = `translate(-50%, calc(-50% + 50px)) scale(0.5)`;
          }, 500);
          setTimeout(() => img.remove(), 1000);
        }
      });
    }
    
    // TEXT SCRAMBLE - Cyber Decode Effect
    function initTextScramble() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_';
      
      function scrambleText(el) {
        const original = el.dataset.original || el.innerText;
        el.dataset.original = original;
        
        let iterations = 0;
        const interval = setInterval(() => {
          el.innerText = original.split('').map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iterations) return original[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          
          if (iterations >= original.length) {
            clearInterval(interval);
            el.innerText = original;
          }
          iterations += 1/3;
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
      
      // Replay button
      const replayBtn = document.getElementById('replayScramble');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          document.querySelectorAll('[data-scramble]').forEach(el => {
            scrambleText(el);
          });
        });
      }
    }
    
    // VELOCITY SKEW GRID
    function initVelocitySkew() {
      const grid = document.getElementById('velocityGrid');
      if (!grid || typeof gsap === 'undefined') return;
      
      let proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(grid, 'skewY', 'deg');
      const clamp = gsap.utils.clamp(-12, 12);
      
      ScrollTrigger.create({
        trigger: grid,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -250);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew)
            });
          }
        }
      });
    }
    
    // Initialize all premium effects
    document.addEventListener('DOMContentLoaded', () => {
      initCharAppear();
      initCursorTooltip();
      initImageTrail();
      initTextScramble();
      
      // Wait for GSAP to load for velocity skew
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initVelocitySkew();
      } else {
        // Retry after GSAP loads
        setTimeout(() => {
          if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initVelocitySkew();
          }
        }, 1000);
      }
      
      // Program filter tabs
      document.querySelectorAll('.program-filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
          // Only toggle within the same filter group
          const group = this.closest('.programs-filter-group');
          if (group) {
            group.querySelectorAll('.program-filter-tab').forEach(t => t.classList.remove('active'));
          }
          this.classList.add('active');
        });
      });
      
      // Initialize award-winning components
      initFlipZone();
      initVelocityMarquee();
      initParallaxSlider();
    });
    
    // ==========================================
    // FLIP ZONE - Scroll-triggered 3D flip
    // ==========================================
    function initFlipZone() {
      const section = document.querySelector('.flip-zone-section');
      const card = document.querySelector('.flip-card-3d');
      
      if (!section || !card || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      })
      .fromTo(card,
        { rotationX: 0, scale: 0.85 },
        { rotationX: 180, scale: 1, ease: "none" }
      )
      .to(card,
        { scale: 0.85, duration: 0.3, ease: "none" }
      );
      
      console.log("Flip Zone initialized");
    }
    
    // ==========================================
    // VELOCITY MARQUEE - Scroll-responsive speed
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
    
    // ==========================================
    // PARALLAX SLIDER - Infinite draggable with parallax
    // ==========================================
    function initParallaxSlider() {
      const track = document.querySelector('.parallax-track');
      if (!track || typeof gsap === 'undefined') return;
      
      const items = gsap.utils.toArray('.parallax-item');
      if (items.length === 0) return;
      
      // Clone items for seamless loop
      items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
      
      const allItems = gsap.utils.toArray('.parallax-item');
      const itemWidth = allItems[0].offsetWidth + 32; // width + gap
      const totalWidth = itemWidth * allItems.length;
      
      gsap.set(track, { width: totalWidth });
      
      // Auto-scroll animation
      const autoScroll = gsap.to(track, {
        x: -totalWidth / 2,
        duration: 30,
        ease: "none",
        repeat: -1,
        onUpdate: updateParallax
      });
      
      // Draggable
      if (typeof Draggable !== 'undefined') {
        Draggable.create(track, {
          type: "x",
          trigger: ".parallax-slider-wrap",
          inertia: true,
          onPress: () => autoScroll.pause(),
          onRelease: () => {
            autoScroll.play();
            gsap.fromTo(autoScroll, { timeScale: 0 }, { timeScale: 1, duration: 1 });
          },
          onDrag: updateParallax,
          onThrowUpdate: updateParallax
        });
      }
      
      function updateParallax() {
        allItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const viewCenter = window.innerWidth / 2;
          const dist = (center - viewCenter) / window.innerWidth;
          
          const img = item.querySelector('img');
          if (img && rect.right > 0 && rect.left < window.innerWidth) {
            gsap.set(img, { xPercent: dist * 25 - 10 });
          }
        });
      }
      
      // Initial parallax
      updateParallax();
      
      console.log("Parallax Slider initialized");
    }
