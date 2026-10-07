/**
 * PHOTOGRAPHY BY FARZI ENGINEER
 * Interactive Engine: Gallery, Lightbox, Price Calculator, WhatsApp Engine
 * Contacts:
 * - Farzi Engineer (Founder): +91 7491800797
 * - Abhimanyu Kumar (Co-Founder): +91 8709270084
 * Email: farziengineer1.0@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPortfolio();
  initPortfolioBackgroundAnimation();
  initAboutBackgroundAnimation();
  initAllSectionSpotlights();
  initCalculator();
  initEnquiryForm();
  initAccordion();
  initParticles();
  initCounters();
  initScrollAnimations();
  initCardTilt();
  initCameraFlash();
});

/* ==========================================================================
   1. NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  // Sticky header blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   2. PORTFOLIO FILTERING & LIGHTBOX
   ========================================================================== */
const galleryData = [
  {
    src: 'hero.jpg',
    tag: 'Udaipur Palace',
    title: 'Kabir & Ananya',
    desc: 'Royal courtyard vows bathed in thousands of glowing candles and golden palace lanterns.',
    category: 'vows'
  },
  {
    src: 'bride.jpg',
    tag: 'Bridal Candid',
    title: 'Tears of Pure Joy',
    desc: "Simran's quiet emotional moment during the family blessings, preserved with unobtrusive sensitivity.",
    category: 'portraits'
  },
  {
    src: 'haldi.jpg',
    tag: 'Haldi Ceremony',
    title: 'The Marigold Splash',
    desc: 'Explosive laughter, flying turmeric flower petals, and unfiltered family euphoria in sunlit gardens.',
    category: 'haldi'
  },
  {
    src: 'prewedding.jpg',
    tag: 'Pre-Wedding',
    title: 'Sunset by the Pavilion',
    desc: 'Golden hour sunburst casting cinematic silhouettes on the tranquil marble waters of Lake Pichola.',
    category: 'prewedding'
  },
  {
    src: 'sangeet.jpg',
    tag: 'Sangeet Night',
    title: 'Dancing in Cold Pyros',
    desc: 'Electric dance floor energy, sparkling cold fire, and 500 guests roaring with celebratory rhythm.',
    category: 'haldi'
  },
  {
    src: 'varmala.jpg',
    tag: 'The Big Day',
    title: 'The Grand Varmala',
    desc: 'Showering thousand fresh red rose petals under royal spotlights in the heritage palace ballroom.',
    category: 'vows'
  },
  {
    src: 'groom.jpg',
    tag: 'Groom Editorial',
    title: 'The Royal Groom',
    desc: 'Ivory zardozi sherwani, emerald kalgi brooch, and the regal solemn poise of an ancient royal fort.',
    category: 'portraits'
  },
  {
    src: 'mandap.jpg',
    tag: 'Destination Decor',
    title: 'Fairytale Lake Mandap',
    desc: 'Overlooking serene waters, glowing floral chandeliers, and twilight vows in Udaipur.',
    category: 'decor'
  },
  {
    src: 'details.jpg',
    tag: 'Macro Details',
    title: 'Heirloom Elegance',
    desc: 'Fine art macro shot capturing intricate bridal henna, fresh jasmine blooms, and the diamond solitaire.',
    category: 'decor'
  }
];

let currentLightboxIndex = 0;
let filteredIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      filteredIndices = [];

      cards.forEach((card, idx) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          filteredIndices.push(idx);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox on card click
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Lightbox Close
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close on backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Lightbox Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxContent();
  const modal = document.getElementById('lightbox-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  const currentPos = filteredIndices.indexOf(currentLightboxIndex);
  let nextPos;

  if (currentPos === -1) {
    nextPos = 0;
  } else {
    nextPos = currentPos + direction;
    if (nextPos < 0) nextPos = filteredIndices.length - 1;
    if (nextPos >= filteredIndices.length) nextPos = 0;
  }

  currentLightboxIndex = filteredIndices[nextPos];
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = galleryData[currentLightboxIndex];
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  const tag = document.getElementById('lightbox-tag');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');

  img.src = item.src;
  img.alt = item.title;
  tag.textContent = item.tag;
  title.textContent = item.title;
  desc.textContent = item.desc;
}

/* ==========================================================================
   3. INTERACTIVE PACKAGE CALCULATOR
   ========================================================================== */
function initCalculator() {
  const dayBtns = document.querySelectorAll('.day-btn');
  const preweddingCheckbox = document.getElementById('addon-prewedding');
  const droneCheckbox = document.getElementById('addon-drone');
  const albumCheckbox = document.getElementById('addon-album');
  const sdeCheckbox = document.getElementById('addon-sde');
  const totalDisplay = document.getElementById('summary-total-display');
  const calcWhatsAppBtn = document.getElementById('btn-calc-whatsapp');
  const calcWhatsAppCoBtn = document.getElementById('btn-calc-whatsapp-co');

  const baseRates = {
    '1': 60000,
    '2': 115000,
    '3': 165000,
    '4': 210000
  };

  let selectedDays = '2';

  function calculateTotal() {
    let base = baseRates[selectedDays] || 115000;
    let addonsCost = 0;
    const selectedAddonList = [];

    if (preweddingCheckbox && preweddingCheckbox.checked) {
      addonsCost += parseInt(preweddingCheckbox.value, 10);
      selectedAddonList.push('Pre-Wedding Shoot (₹25k)');
    }
    if (droneCheckbox && droneCheckbox.checked) {
      addonsCost += parseInt(droneCheckbox.value, 10);
      selectedAddonList.push('4K Drone Cinema (₹18k)');
    }
    if (albumCheckbox && albumCheckbox.checked) {
      addonsCost += parseInt(albumCheckbox.value, 10);
      selectedAddonList.push('Leather Heirloom Album (₹15k)');
    }
    if (sdeCheckbox && sdeCheckbox.checked) {
      addonsCost += parseInt(sdeCheckbox.value, 10);
      selectedAddonList.push('Same-Day Edit Reel (₹20k)');
    }

    const grandTotal = base + addonsCost;
    totalDisplay.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // WhatsApp Message - Founder Farzi Engineer
    const waMessageFarzi = encodeURIComponent(
      `Hello Farzi Engineer! 📸\n\n` +
      `I used your Website Custom Package Calculator:\n` +
      `• Event Days: ${selectedDays} Days\n` +
      `• Selected Add-ons: ${selectedAddonList.length > 0 ? selectedAddonList.join(', ') : 'None'}\n` +
      `• Estimated Investment: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
      `Can you please confirm your date availability and share detailed deliverables?`
    );

    if (calcWhatsAppBtn) {
      calcWhatsAppBtn.onclick = () => {
        window.open(`https://wa.me/917491800797?text=${waMessageFarzi}`, '_blank');
      };
    }

    // WhatsApp Message - Co-Founder Abhimanyu Kumar
    const waMessageAbhimanyu = encodeURIComponent(
      `Hello Abhimanyu! (Co-Founder, Farzi Engineer) 🎬\n\n` +
      `I used your Website Custom Package Calculator:\n` +
      `• Event Days: ${selectedDays} Days\n` +
      `• Selected Add-ons: ${selectedAddonList.length > 0 ? selectedAddonList.join(', ') : 'None'}\n` +
      `• Estimated Investment: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
      `Can you please confirm your cinematography & photography crew availability for my wedding dates?`
    );

    if (calcWhatsAppCoBtn) {
      calcWhatsAppCoBtn.onclick = () => {
        window.open(`https://wa.me/918709270084?text=${waMessageAbhimanyu}`, '_blank');
      };
    }
  }

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDays = btn.getAttribute('data-days');
      calculateTotal();
    });
  });

  [preweddingCheckbox, droneCheckbox, albumCheckbox, sdeCheckbox].forEach(cb => {
    if (cb) cb.addEventListener('change', calculateTotal);
  });

  calculateTotal();
}

/* ==========================================================================
   4. WEDDING ENQUIRY & BOOKING FORM
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('wedding-enquiry-form');
  const btnEmail = document.getElementById('btn-submit-email');
  const successBanner = document.getElementById('form-success-banner');

  if (!form) return;

  // Set default minimum date to today
  const dateInput = document.getElementById('wedding-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Handle WhatsApp Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const names = document.getElementById('couple-names').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const date = document.getElementById('wedding-date').value;
    const city = document.getElementById('wedding-city').value.trim();
    const eventType = document.getElementById('event-type').value;
    const message = document.getElementById('wedding-message').value.trim();

    const waText = encodeURIComponent(
      `✨ NEW WEDDING INQUIRY FOR FARZI ENGINEER ✨\n\n` +
      `👤 Couple: ${names}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email}\n` +
      `📅 Wedding Date: ${date}\n` +
      `📍 City/Venue: ${city}\n` +
      `💍 Coverage: ${eventType}\n` +
      `📝 Vision: ${message || 'Looking forward to discussing our wedding film!'}\n\n` +
      `Please let us know your team availability!`
    );

    successBanner.style.display = 'flex';
    setTimeout(() => {
      window.open(`https://wa.me/917491800797?text=${waText}`, '_blank');
    }, 400);
  });

  // Handle WhatsApp Submission to Co-Founder Abhimanyu Kumar
  const btnAbhimanyu = document.getElementById('btn-submit-abhimanyu');
  if (btnAbhimanyu) {
    btnAbhimanyu.addEventListener('click', () => {
      if (!form.reportValidity()) return;

      const names = document.getElementById('couple-names').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const date = document.getElementById('wedding-date').value;
      const city = document.getElementById('wedding-city').value.trim();
      const eventType = document.getElementById('event-type').value;
      const message = document.getElementById('wedding-message').value.trim();

      const waTextCo = encodeURIComponent(
        `✨ NEW WEDDING INQUIRY FOR CO-FOUNDER ABHIMANYU KUMAR ✨\n\n` +
        `👤 Couple: ${names}\n` +
        `📞 Phone: ${phone}\n` +
        `📧 Email: ${email}\n` +
        `📅 Wedding Date: ${date}\n` +
        `📍 City/Venue: ${city}\n` +
        `💍 Coverage: ${eventType}\n` +
        `📝 Vision: ${message || 'Looking forward to discussing our wedding film!'}\n\n` +
        `Please confirm your cinematography & photography availability!`
      );

      successBanner.style.display = 'flex';
      setTimeout(() => {
        window.open(`https://wa.me/918709270084?text=${waTextCo}`, '_blank');
      }, 400);
    });
  }

  // Handle Email Submission fallback
  if (btnEmail) {
    btnEmail.addEventListener('click', () => {
      const names = document.getElementById('couple-names').value.trim() || 'Prospective Couple';
      const phone = document.getElementById('contact-phone').value.trim() || 'Not specified';
      const date = document.getElementById('wedding-date').value || 'TBD';
      const city = document.getElementById('wedding-city').value.trim() || 'TBD';
      const eventType = document.getElementById('event-type').value;
      const message = document.getElementById('wedding-message').value.trim();

      const subject = encodeURIComponent(`Wedding Photography Booking Enquiry - ${names} (${date})`);
      const body = encodeURIComponent(
        `Dear Farzi Engineer Team,\n\n` +
        `We would love to check your availability for our wedding celebrations!\n\n` +
        `Couple Names: ${names}\n` +
        `Contact Phone: ${phone}\n` +
        `Wedding Date: ${date}\n` +
        `Venue / City: ${city}\n` +
        `Event Coverage: ${eventType}\n` +
        `Additional Notes:\n${message}\n\n` +
        `Warm regards,\n${names}`
      );

      window.location.href = `mailto:farziengineer1.0@gmail.com?subject=${subject}&body=${body}`;
    });
  }
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other accordions
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. FILM MODAL CONTROLS
   ========================================================================== */
function openFilmModal(title, sub, url) {
  const modal = document.getElementById('film-modal');
  const titleEl = document.getElementById('film-modal-title');
  const subEl = document.getElementById('film-modal-sub');

  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFilmModal() {
  const modal = document.getElementById('film-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ==========================================================================
   7. FLOATING GOLDEN BOKEH PARTICLES (CANVAS)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('golden-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 42;

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = (height || window.innerHeight) + Math.random() * 40;
      this.size = Math.random() * 2.8 + 1;
      this.speedY = Math.random() * 0.65 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.opacity = Math.random() * 0.55 + 0.25;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.color = Math.random() > 0.35 ? 'rgba(212, 175, 55,' : 'rgba(243, 229, 171,';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.opacity += Math.sin(this.y * this.pulseSpeed) * 0.01;
      if (this.y < -15) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${Math.max(0.1, Math.min(0.85, this.opacity))})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d4af37';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * (height || window.innerHeight);
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   8. ANIMATED STATS COUNTER
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 2200;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            if (decimals > 0) {
              counter.textContent = current.toFixed(decimals) + suffix;
            } else {
              counter.textContent = Math.round(current) + suffix;
            }

            if (frame >= totalFrames) {
              clearInterval(timer);
              if (decimals > 0) {
                counter.textContent = target.toFixed(decimals) + suffix;
              } else {
                counter.textContent = target + suffix;
              }
            }
          }, frameDuration);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* ==========================================================================
   9. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.section-header, .about-grid, .portfolio-card, .film-card, .service-box, .package-card, .calculator-card, .review-card, .step-card, .accordion-item, .contact-card-wrapper, .channel-card'
  );

  elements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(index % 3) * 0.12}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. 3D INTERACTIVE CARD TILT
   ========================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('.portfolio-card, .film-card, .service-box, .package-card, .review-card, .step-card, .addon-card, .founder-card');

  tiltCards.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   11. CAMERA SHUTTER FLASH EFFECT
   ========================================================================== */
function initCameraFlash() {
  const flash = document.getElementById('camera-flash');
  const triggerEls = document.querySelectorAll('.brand-logo, .hero-brand-emblem-wrap, .card-btn-view');

  function triggerFlash() {
    if (!flash) return;
    flash.classList.add('active');
    setTimeout(() => {
      flash.classList.remove('active');
    }, 150);
  }

  triggerEls.forEach(el => {
    el.addEventListener('click', () => {
      triggerFlash();
    });
  });
}

/* ==========================================================================
   12. PORTFOLIO ANIMATED BACKGROUND (BOKEH, SPARKS & MOUSE SPOTLIGHT)
   ========================================================================== */
function initPortfolioBackgroundAnimation() {
  const section = document.getElementById('portfolio');
  const canvas = document.getElementById('portfolio-particles');
  const spotlight = document.getElementById('portfolio-spotlight');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let isVisible = true;
  let mouse = { x: -1000, y: -1000, isHovering: false };

  // Setup dimensions
  function handleResize() {
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  // Mouse tracker for interactive spotlight & particle reaction
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x;
    mouse.y = y;
    mouse.isHovering = true;
    section.style.setProperty('--portfolio-mouse-x', `${x}px`);
    section.style.setProperty('--portfolio-mouse-y', `${y}px`);
    if (spotlight) spotlight.style.opacity = '1';
  });

  section.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
    if (spotlight) spotlight.style.opacity = '0.5';
  });

  // IntersectionObserver to only animate when in or near viewport (preserves 60fps)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { rootMargin: '100px' });
  observer.observe(section);

  // Particle Class: Supports Bokeh Orbs, Twinkling Sparks & Floating Petals
  class PortfolioParticle {
    constructor(isInitial = false) {
      this.reset(isInitial);
    }

    reset(isInitial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = isInitial ? Math.random() * (height || 800) : (height || 800) + Math.random() * 30;
      
      // 3 types: 'spark' (60%), 'bokeh' (25%), 'petal' (15%)
      const rand = Math.random();
      if (rand < 0.6) {
        this.type = 'spark';
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.6 + 0.3;
        this.speedY = Math.random() * 0.7 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.twinkleSpeed = Math.random() * 0.04 + 0.02;
        this.angle = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.4 ? '212, 175, 55' : '243, 229, 171';
      } else if (rand < 0.85) {
        this.type = 'bokeh';
        this.radius = Math.random() * 32 + 16;
        this.baseAlpha = Math.random() * 0.12 + 0.05;
        this.speedY = Math.random() * 0.3 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.angle = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.5 ? '212, 175, 55' : '230, 183, 71';
      } else {
        this.type = 'petal';
        this.radius = Math.random() * 4 + 3;
        this.baseAlpha = Math.random() * 0.35 + 0.2;
        this.speedY = Math.random() * 0.5 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1.5;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.color = '212, 175, 55';
      }

      this.currentAlpha = this.baseAlpha;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.phase += this.twinkleSpeed;
      this.x += this.speedX + Math.sin(this.phase) * 0.4;

      // Mouse interactive breeze (gently pushes particles away smoothly)
      if (mouse.isHovering) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 1.8;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.type === 'petal') {
        this.rotation += this.rotSpeed;
      }

      // Sine wave breathing opacity
      this.currentAlpha = this.baseAlpha + Math.sin(this.phase) * (this.baseAlpha * 0.5);

      // Reset when floating beyond the top
      if (this.y < -this.radius * 2 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      const alpha = Math.max(0.02, Math.min(0.95, this.currentAlpha));

      if (this.type === 'bokeh') {
        // Soft glowing camera lens bokeh circle
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(${this.color}, ${alpha * 1.4})`);
        grad.addColorStop(0.5, `rgba(${this.color}, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${this.color}, 0)`);

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (this.type === 'spark') {
        // Sharp sparkling starlight point
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      } else if (this.type === 'petal') {
        // Floating luxury golden petal/flake
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * 1.4, this.radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // Create particles pool
  const count = 55;
  for (let i = 0; i < count; i++) {
    particles.push(new PortfolioParticle(true));
  }

  // Render loop
  function loop() {
    if (isVisible && width > 0 && height > 0) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   13. ABOUT SECTION ANIMATED BACKGROUND (OPTICS, BOKEH & MOUSE SPOTLIGHT)
   ========================================================================== */
function initAboutBackgroundAnimation() {
  const section = document.getElementById('about');
  const canvas = document.getElementById('about-particles');
  const spotlight = document.getElementById('about-spotlight');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let isVisible = true;
  let mouse = { x: -1000, y: -1000, isHovering: false };

  function handleResize() {
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x;
    mouse.y = y;
    mouse.isHovering = true;
    section.style.setProperty('--about-mouse-x', `${x}px`);
    section.style.setProperty('--about-mouse-y', `${y}px`);
    if (spotlight) spotlight.style.opacity = '1';
  });

  section.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
    if (spotlight) spotlight.style.opacity = '0.5';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { rootMargin: '100px' });
  observer.observe(section);

  class AboutParticle {
    constructor(isInitial = false) {
      this.reset(isInitial);
    }

    reset(isInitial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = isInitial ? Math.random() * (height || 800) : (height || 800) + Math.random() * 30;

      const rand = Math.random();
      if (rand < 0.65) {
        this.type = 'spark';
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.6 + 0.3;
        this.speedY = Math.random() * 0.65 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.twinkleSpeed = Math.random() * 0.04 + 0.02;
        this.color = Math.random() > 0.4 ? '212, 175, 55' : '243, 229, 171';
      } else {
        this.type = 'bokeh';
        this.radius = Math.random() * 28 + 14;
        this.baseAlpha = Math.random() * 0.12 + 0.04;
        this.speedY = Math.random() * 0.28 + 0.12;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.color = Math.random() > 0.5 ? '212, 175, 55' : '230, 183, 71';
      }

      this.currentAlpha = this.baseAlpha;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.phase += this.twinkleSpeed;
      this.x += this.speedX + Math.sin(this.phase) * 0.35;

      if (mouse.isHovering) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 1.6;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      this.currentAlpha = this.baseAlpha + Math.sin(this.phase) * (this.baseAlpha * 0.5);

      if (this.y < -this.radius * 2 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw() {
      const alpha = Math.max(0.02, Math.min(0.9, this.currentAlpha));

      if (this.type === 'bokeh') {
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(${this.color}, ${alpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(${this.color}, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${this.color}, 0)`);

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const count = 42;
  for (let i = 0; i < count; i++) {
    particles.push(new AboutParticle(true));
  }

  function loop() {
    if (isVisible && width > 0 && height > 0) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   14. GLOBAL SECTION MOUSE SPOTLIGHT ENGINE
   ========================================================================== */
function initAllSectionSpotlights() {
  const sections = document.querySelectorAll(
    '.films-section, .services-section, .packages-section, .calculator-section, .workflow-section, .testimonials-section, .faq-section, .contact-section'
  );

  sections.forEach(sec => {
    const spotlight = sec.querySelector('.ambient-spotlight');

    sec.addEventListener('mousemove', (e) => {
      const rect = sec.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sec.style.setProperty('--sec-mouse-x', `${x}px`);
      sec.style.setProperty('--sec-mouse-y', `${y}px`);
      if (spotlight) spotlight.style.opacity = '1';
    });

    sec.addEventListener('mouseleave', () => {
      if (spotlight) spotlight.style.opacity = '0.4';
    });
  });
}

