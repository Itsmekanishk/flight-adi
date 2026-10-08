/**
 * FLIGHT ADITI: MASTER CONTROLLER & INTERACTIVE LOGIC
 * Features:
 *  1. Web Audio API Acoustic Cabin Chime ("Ding-Dong")
 *  2. 3D Boarding Pass Flip Controller
 *  3. Emoji Canvas Confetti System (Airplanes, Food Tech, Tomatoes, Sparkles)
 *  4. Real-time Vertical Altitude Scroll Tracker
 *  5. Flight Path Timeline Scroll Sync
 *  6. Polaroid Artifact Vault Lightbox Modal
 *  7. Humorous Cabin PA System & Live Telemetry
 */

document.addEventListener('DOMContentLoaded', () => {
  initAirlineAudioChime();
  initBoardingPassFlip();
  initSecurityColorTest();
  initConfettiEngine();
  initHazardChecklist();
  initUnifiedScrollSystem();
  initArtifactLightbox();
  initCabinClock();
  initQuickNavSpy();
  initCabinPaAnnouncements();
  initMobileInteractions();
});

/* ==========================================================================
   1. Authentic Web Audio API Cabin Chime Synthesizer
   Generates a luxury two-tone Boeing/Airbus chime with realistic acoustic decay.
   Zero external audio file dependency ensures 100% offline & instant playback.
   ========================================================================== */
let audioCtx = null;

function playCabinDingDong() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    const triggerSound = () => {
      const now = audioCtx.currentTime;

      // Note 1: High tone (F#5 ~ 740 Hz + harmonic overtone)
      createHarmonicTone(audioCtx, 739.99, now, 0.85);

      // Note 2: Harmonious lower tone (D5 ~ 587.3 Hz) 0.36s later
      createHarmonicTone(audioCtx, 587.33, now + 0.35, 1.25);
    };

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(triggerSound).catch(err => {
        console.warn('AudioContext resume error:', err);
      });
    } else {
      triggerSound();
    }
  } catch (err) {
    console.warn('Web Audio playback exception:', err);
  }
}

function createHarmonicTone(ctx, fundamentalFreq, startTime, duration) {
  // Fundamental Oscillator
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(fundamentalFreq, startTime);

  // Soft attack & exponential natural decay
  gain1.gain.setValueAtTime(0.0001, startTime);
  gain1.gain.exponentialRampToValueAtTime(0.4, startTime + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start(startTime);
  osc1.stop(startTime + duration);

  // Harmonic Overtone for bell-like chime realism
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(fundamentalFreq * 2, startTime);

  gain2.gain.setValueAtTime(0.0001, startTime);
  gain2.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(startTime);
  osc2.stop(startTime + duration * 0.7);
}

function initAirlineAudioChime() {
  const headerBtn = document.getElementById('headerChimeBtn');
  const footerBtn = document.getElementById('footerDingBtn');
  const cardChimeTrigger = document.getElementById('cardChimeTrigger');

  if (headerBtn) headerBtn.addEventListener('click', () => {
    playCabinDingDong();
    cycleCabinAnnouncement();
  });

  if (footerBtn) footerBtn.addEventListener('click', () => {
    playCabinDingDong();
    cycleCabinAnnouncement();
  });

  if (cardChimeTrigger) cardChimeTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    playCabinDingDong();
  });
}

/* ==========================================================================
   2. 3D Boarding Pass Flip Controller
   ========================================================================== */
function initBoardingPassFlip() {
  const scene = document.getElementById('boardingPassScene');
  const flipBackBtn = document.getElementById('flipBackBtn');

  if (!scene) return;

  scene.addEventListener('click', (e) => {
    // If clicked on an internal button, handle appropriately
    if (e.target.closest('#cardChimeTrigger') || e.target.closest('#flipBackBtn')) {
      return;
    }
    scene.classList.toggle('is-flipped');
    playCabinDingDong();
  });

  if (flipBackBtn) {
    flipBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scene.classList.remove('is-flipped');
      playCabinDingDong();
    });
  }

  // Keyboard accessibility
  scene.setAttribute('tabindex', '0');
  scene.setAttribute('role', 'button');
  scene.setAttribute('aria-label', 'Interactive Boarding Pass. Press Enter to flip ticket.');
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scene.classList.toggle('is-flipped');
      playCabinDingDong();
    }
  });
}

/* ==========================================================================
   2B. Crucial Cabin Clearance Test (The Red Test)
   ========================================================================== */
function initSecurityColorTest() {
  const card = document.getElementById('clearanceCard');
  const buttons = document.querySelectorAll('.color-choice-btn');
  const feedbackBox = document.getElementById('clearanceFeedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackDesc = document.getElementById('feedbackDesc');
  const statusPill = document.getElementById('securityStatusPill');
  const statusLabel = document.getElementById('statusLabelText');

  if (!card || buttons.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      const rect = btn.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      if (color === 'red') {
        // Correct choice: Crimson Red
        playCabinDingDong();
        fireConfettiBurst(clickX, clickY, 65);

        // Update status indicator
        if (statusPill) statusPill.classList.add('is-cleared');
        if (statusLabel) statusLabel.textContent = 'CLEARANCE GRANTED • FIRST CLASS VERIFIED';

        // Feedback
        feedbackBox.style.display = 'flex';
        feedbackBox.className = 'clearance-feedback-box feedback-granted';
        feedbackIcon.innerHTML = '🎉';
        feedbackTitle.textContent = 'Correct. Clear for takeoff.';
        feedbackDesc.textContent = 'Next move: Unlocking first-class privileges (and admitting you actually pay attention to the details). Next Move Unlocked: First-Class Clearance Granted.';

        // Subtle glowing highlight on the button
        buttons.forEach(b => {
          b.style.opacity = '0.5';
          b.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        });
        btn.style.opacity = '1';
        btn.style.borderColor = '#D32F2F';
        btn.style.boxShadow = '0 0 25px rgba(211, 47, 47, 0.6)';
      } else {
        // Incorrect choice (Sky Blue or Safety Orange)
        playCabinDingDong();
        card.classList.remove('shake-alert');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('shake-alert');
        setTimeout(() => card.classList.remove('shake-alert'), 600);

        feedbackBox.style.display = 'flex';
        feedbackBox.className = 'clearance-feedback-box feedback-denied';
        feedbackIcon.innerHTML = '⚠️';
        feedbackTitle.textContent = 'Access Denied.';
        feedbackDesc.textContent = 'Seatbelt sign turned on. Prepare for immediate turbulence. (Hint: In cockpit telemetry logs, Kanishk’s true priority frequency is Crimson Red!)';
      }
    });
  });
}

/* ==========================================================================
   3. Emoji & Geometry Confetti Engine (Airplanes, Beakers, Tomatoes, Stars)
   ========================================================================== */
let confettiParticles = [];
let confettiAnimId = null;

function initConfettiEngine() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function fireConfettiBurst(x, y, count = 35) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const emojis = ['✈️', '🧪', '🍅', '🧣', '⌚', '🇮🇹', '✨', '⭐'];
  const colors = ['#38bdf8', '#FF6B35', '#D32F2F', '#f59e0b', '#10b981', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const isEmoji = Math.random() > 0.4;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;

    confettiParticles.push({
      x: x !== undefined ? x : window.innerWidth / 2,
      y: y !== undefined ? y : window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      gravity: 0.18,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      size: isEmoji ? Math.random() * 14 + 18 : Math.random() * 8 + 6,
      isEmoji: isEmoji,
      content: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 60 + 60
    });
  }

  if (!confettiAnimId) {
    animateConfetti(canvas, ctx);
  }
}

function animateConfetti(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.rotation += p.rotationSpeed;
    p.opacity = Math.max(0, 1 - (p.life / p.maxLife));

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    if (p.isEmoji) {
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.content, 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    }

    ctx.restore();

    if (p.life >= p.maxLife || p.y > canvas.height + 50) {
      confettiParticles.splice(i, 1);
    }
  }

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(() => animateConfetti(canvas, ctx));
  } else {
    confettiAnimId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ==========================================================================
   4. Cabin Hazard & Survivor Checklist Controller
   ========================================================================== */
function initHazardChecklist() {
  const container = document.getElementById('checklistContainer');
  const scoreCount = document.getElementById('scoreCount');
  const allDoneBanner = document.getElementById('allDoneBanner');
  const retriggerBtn = document.getElementById('retriggerConfettiBtn');

  if (!container) return;

  const checkboxes = container.querySelectorAll('.chk-input');
  const total = checkboxes.length;

  function updateScore() {
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      const row = cb.closest('.check-item-row');
      if (cb.checked) {
        checkedCount++;
        row.classList.add('is-completed');
      } else {
        row.classList.remove('is-completed');
      }
    });

    if (scoreCount) {
      scoreCount.textContent = `${checkedCount} / ${total}`;
    }

    if (checkedCount === total) {
      if (allDoneBanner) allDoneBanner.style.display = 'flex';
      // Grand celebratory multi-cannon confetti burst
      fireConfettiBurst(window.innerWidth * 0.25, window.innerHeight * 0.5, 50);
      setTimeout(() => fireConfettiBurst(window.innerWidth * 0.75, window.innerHeight * 0.5, 50), 250);
      playCabinDingDong();
    } else {
      if (allDoneBanner) allDoneBanner.style.display = 'none';
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const rect = cb.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      if (cb.checked) {
        fireConfettiBurst(clickX, clickY, 25);
        playCabinDingDong();
      }

      updateScore();
    });
  });

  if (retriggerBtn) {
    retriggerBtn.addEventListener('click', () => {
      fireConfettiBurst(window.innerWidth * 0.5, window.innerHeight * 0.4, 70);
      playCabinDingDong();
    });
  }
}

/* ==========================================================================
   5 & 6. Unified High-Performance Scroll Controller
   Synchronized via requestAnimationFrame to ensure smooth 60fps/120fps motion.
   Zero layout thrashing and zero repaint stalls.
   ========================================================================== */
function initUnifiedScrollSystem() {
  const altitudeFill = document.getElementById('altitudeFill');
  const altitudePlane = document.getElementById('altitudePlaneIndicator');
  const altValue = document.getElementById('altValue');
  const altStatus = document.getElementById('altStatus');
  const spineFill = document.getElementById('timelineActiveFill');
  const planeNode = document.getElementById('travelingPlaneNode');
  const timelineBox = document.querySelector('.flight-path-timeline-box');

  let isTicking = false;
  let cachedTimelineTop = 0;
  let cachedTimelineHeight = 0;

  function measureTimeline() {
    if (timelineBox) {
      const rect = timelineBox.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      cachedTimelineTop = rect.top + scrollTop;
      cachedTimelineHeight = rect.height;
    }
  }

  // Pre-measure on load and resize so we never cause layout thrashing on scroll
  measureTimeline();
  window.addEventListener('resize', measureTimeline, { passive: true });
  window.addEventListener('load', measureTimeline, { passive: true });

  function renderScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - winHeight;
    const totalProgress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);
    const pct = totalProgress * 100;

    // 1. Update Altitude Rail
    if (altitudeFill && altitudePlane) {
      altitudeFill.style.height = `${pct}%`;
      altitudePlane.style.top = `${pct}%`;

      let currentAlt = Math.round(totalProgress * 38500);
      if (currentAlt < 500) currentAlt = 0;

      if (altValue) {
        altValue.textContent = `${currentAlt.toLocaleString()} FT`;
      }

      if (altStatus) {
        if (totalProgress < 0.1) {
          altStatus.textContent = 'ORIGIN RUNWAY';
        } else if (totalProgress < 0.35) {
          altStatus.textContent = 'CLIMBING';
        } else if (totalProgress < 0.75) {
          altStatus.textContent = 'CRUISING';
        } else {
          altStatus.textContent = 'DESCENT: ITALY';
        }
      }
    }

    // 2. Update Flight Path Timeline
    if (spineFill && planeNode && cachedTimelineHeight > 0) {
      const currentDist = (scrollY + winHeight * 0.6) - cachedTimelineTop;
      const timelineProgress = Math.min(Math.max(currentDist / cachedTimelineHeight, 0), 1);
      const timelinePct = timelineProgress * 100;

      spineFill.style.height = `${timelinePct}%`;
      planeNode.style.top = `${timelinePct}%`;
    }

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(renderScroll);
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  renderScroll();
}

/* ==========================================================================
   7. Artifact Vault Lightbox Modal Controller
   ========================================================================== */
function initArtifactLightbox() {
  const modal = document.getElementById('artifactModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalQuote = document.getElementById('modalQuote');
  const modalStory = document.getElementById('modalStory');
  const modalTag = document.getElementById('modalTag');
  const modalDate = document.getElementById('modalDate');

  const watchCard = document.getElementById('polaroidWatch');
  const scarfCard = document.getElementById('polaroidScarf');

  const artifactsData = {
    watch: {
      src: 'assets/watch.jpg',
      title: 'The 7-Year Watch',
      quote: '“Unclaimed baggage since 2017. Current status: Held in safe custody, zero intention of returning.”',
      story: 'Officially transferred into Kanishk’s custody circa 2017 under the legendary memorandum of understanding: “I’ll come grab it next weekend.” Seven full calendar years later, it ticks with zero errors, tracks shared milestones, and holds permanent diplomatic immunity with zero intention of returning.',
      tag: 'CARGO LOG #AD-WATCH-07Y',
      date: 'Custody: 2017 – Present'
    },
    scarf: {
      src: 'assets/scarf.jpg',
      title: 'The Legendary Scarf',
      quote: '“Surviving winter drafts since 2017.”',
      story: 'Handcrafted warmth engineered to withstand arctic aircraft cabin air conditioning vents and chilly bus journeys. Left on what was supposed to be a temporary loan, now certified as indispensable companion gear with zero intention of returning.',
      tag: 'CARGO LOG #AD-SCARF-01',
      date: 'Custody: Certified Heirloom'
    }
  };

  function openModal(data) {
    if (!modal) return;
    modalImg.src = data.src;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalQuote.textContent = data.quote;
    modalStory.textContent = data.story;
    modalTag.textContent = data.tag;
    modalDate.textContent = data.date;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playCabinDingDong();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (watchCard) {
    watchCard.addEventListener('click', () => openModal(artifactsData.watch));
    watchCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(artifactsData.watch);
      }
    });
  }

  if (scarfCard) {
    scarfCard.addEventListener('click', () => openModal(artifactsData.scarf));
    scarfCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(artifactsData.scarf);
      }
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Humorous Cabin PA System & Telemetry Clock
   ========================================================================== */
const cabinAnnouncements = [
  "Attention passengers: Please be advised that true connection does not begin in Paris or Venice. It begins on a bumpy MSRTC red bus clattering its way from Aundha to Parbhani, where the inflight entertainment was just me trying not to fall into your lap on every speed breaker.",
  "Cruising Altitude reached. Survival stats: 3+ years of tolerating terminal bugs, late-night code rants, and stubborn habit loops.",
  "PA: Would Passenger Aditi please report to Seat 1A? Unclaimed baggage since 2017 is held in safe custody with zero intention of returning.",
  "PA: Flight Deck Notice — explaining to Seat 12C that tea and coffee are made with the same hot water tank.",
  "PA: The Debugger Debrief — between mid-air turbulence and a Python SyntaxError, your passengers might actually be easier to handle.",
  "PA: Cabin advisory — ground crew confirms Bhindi Masala has been permanently ejected from all galleys.",
  "PA: Telemetry update — Millie Bobby Brown remains certified as undisputed #1 actress across all airspaces."
];
let currentAnnouncementIdx = 0;

function cycleCabinAnnouncement() {
  const paText = document.getElementById('paMessageText');
  const paBanner = document.getElementById('cabinPaBanner');
  if (!paText) return;

  currentAnnouncementIdx = (currentAnnouncementIdx + 1) % cabinAnnouncements.length;
  paText.textContent = cabinAnnouncements[currentAnnouncementIdx];

  if (paBanner) {
    paBanner.style.animation = 'none';
    void paBanner.offsetWidth; // Trigger reflow
    paBanner.style.animation = 'slideDownFade 0.4s ease-out';
  }
}

function initCabinPaAnnouncements() {
  const closeBtn = document.getElementById('paCloseBtn');
  const paBanner = document.getElementById('cabinPaBanner');

  if (closeBtn && paBanner) {
    closeBtn.addEventListener('click', () => {
      paBanner.style.display = 'none';
    });
  }

  // Automatically cycle announcement every 22 seconds
  setInterval(cycleCabinAnnouncement, 22000);
}

function initCabinClock() {
  const clockEl = document.getElementById('cabinClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatted}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   9. Quick Touch Nav Scrollspy
   Smoothly tracks active sections and enables accurate offset scroll.
   ========================================================================== */
function initQuickNavSpy() {
  const chips = document.querySelectorAll('.nav-chip');
  const sections = document.querySelectorAll('.section');
  const navWrapper = document.querySelector('.nav-scroll-wrapper');

  if (chips.length === 0 || sections.length === 0) return;

  // 1. Smooth, offset-aware click scroll for nav chips
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const targetId = chip.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const topBar = document.getElementById('topStatusBar');
          const quickNav = document.getElementById('quickNavBar');
          const headerHeight = topBar ? topBar.offsetHeight : 65;
          const navHeight = quickNav ? quickNav.offsetHeight : 50;
          const totalOffset = headerHeight + navHeight + 16;
          const elementPos = targetEl.getBoundingClientRect().top + window.pageYOffset;

          window.scrollTo({
            top: elementPos - totalOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 2. Observer: Highlight active chip without disrupting document vertical scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        chips.forEach(chip => {
          if (chip.getAttribute('href') === `#${id}`) {
            chip.classList.add('active');
            // Safely scroll ONLY the horizontal nav wrapper, NEVER the window!
            if (navWrapper) {
              const chipLeft = chip.offsetLeft;
              const chipWidth = chip.offsetWidth;
              const wrapperWidth = navWrapper.clientWidth;
              navWrapper.scrollTo({
                left: chipLeft - (wrapperWidth / 2) + (chipWidth / 2),
                behavior: 'smooth'
              });
            }
          } else {
            chip.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   10. Mobile Touch Interactions & Haptic Feedback
   ========================================================================== */
function initMobileInteractions() {
  // Tap to reveal transformations on mobile phones (where hover does not exist)
  const galleyCards = document.querySelectorAll('.galley-reveal-card');
  galleyCards.forEach(card => {
    card.addEventListener('click', () => {
      const isNowRevealed = card.classList.toggle('is-revealed');
      // If card has transformed content and is now revealed, play chime
      if (isNowRevealed && card.querySelector('.content-transformed')) {
        playCabinDingDong();
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isNowRevealed = card.classList.toggle('is-revealed');
        if (isNowRevealed && card.querySelector('.content-transformed')) {
          playCabinDingDong();
        }
      }
    });
  });
}

