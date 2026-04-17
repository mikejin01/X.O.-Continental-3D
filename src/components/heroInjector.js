/**
 * Injects the custom hero directly into the iframe's DOM.
 * Uses UnicornStudio animated background.
 *
 * Everything lives in one document so the navbar, scroll, and GSAP
 * animations all work normally.
 */

const BASE = import.meta.env.BASE_URL

/* ═══════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════ */

const HERO_CSS = `
/* ── Font faces ── */
@font-face {
  font-family: 'Coolvetica Rg Cond';
  src: url('${BASE}fonts/CoolveticaRgCond.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Humane';
  src: url('${BASE}fonts/Humane-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ── Hero overlay container ── */
.xo-hero-overlay {
  position: absolute;
  inset: 10px;
  z-index: 4;
  overflow: hidden;
  background: #000;
  border-radius: 2rem;
  transition: opacity 0.4s ease;
}
.xo-hero-overlay.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* ── UnicornStudio ── */
.xo-hero-unicorn {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.xo-hero-unicorn a[href*="unicorn"] {
  display: none !important;
}
.xo-hero-unicorn canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* ── Gradient overlays (top & bottom fade to black) ── */
.xo-hero-overlay::before,
.xo-hero-overlay::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 30%;
  pointer-events: none;
  z-index: 2;
}
.xo-hero-overlay::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
  border-radius: 2rem 2rem 0 0;
}
.xo-hero-overlay::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, transparent 100%);
  border-radius: 0 0 2rem 2rem;
}

/* ── Subtitle ── */
.xo-hero-subtitle-wrap {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 26.9vh;
  pointer-events: none;
}
.xo-hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 19.2px;
  color: #fff;
  text-align: center;
  line-height: 1.3;
  max-width: 300px;
  margin: 0;
}

/* ── Bottom bar ── */
.xo-hero-bottom {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 0 calc(2rem - 10px);
}
.xo-hero-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  align-items: end;
  max-width: 100rem;
  margin: 0 auto;
}
.xo-hero-bottom-left {
  display: flex;
  flex-direction: column;
}
.xo-hero-bottom-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.xo-hero-bottom-right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

/* ── Services list (continuous sliding marquee) ── */
.xo-hero-services {
  position: relative;
  height: 40px;
  overflow: clip;
  white-space: nowrap;
}
.xo-hero-services-track {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  -webkit-mask: linear-gradient(#0000, #000 50%, #0000);
  mask: linear-gradient(#0000, #000 50%, #0000);
  will-change: transform;
}
.xo-hero-service-item {
  font-family: 'Coolvetica Rg Cond', Arial, sans-serif;
  font-size: 19.2px;
  font-weight: 300;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 0.7px;
  line-height: 1;
  margin-bottom: 8px;
  display: block;
}

/* ── Scroll indicator ── */
.xo-hero-scroll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.xo-hero-scroll-arrow {
  width: 16px;
  height: 16px;
  background-image: url('https://cdn.prod.website-files.com/697344b93b0e03014bb98903/6973b6306fd8c2ae6c357490_arrow-down.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.xo-hero-scroll-text {
  font-family: 'Coolvetica Rg Cond', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #fff;
}

/* ── Badge card ── */
.xo-hero-badge-card {
  display: block;
  width: 205px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.xo-hero-badge-card:hover {
  transform: translateY(-2px);
}
.xo-hero-badge-photo {
  width: 205px;
  height: 130px;
  border-radius: 7px;
  background-image: url('${BASE}projects/Chuan-Bistro-web.avif');
  background-size: cover;
  background-position: center;
}
.xo-hero-badge-text {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 205px;
  height: 42px;
  background: rgba(255,255,255,0.97);
  border-radius: 7px;
  padding: 10px 13px 10px 11px;
  margin-top: 3px;
  position: relative;
  overflow: hidden;
}
.xo-hero-badge-circle {
  position: absolute;
  bottom: 10px;
  left: 12px;
  width: 0;
  height: 0;
  background: rgb(67,83,255);
  border-radius: 100%;
  transition: width 0.45s cubic-bezier(0.4,0,0.2,1),
              height 0.45s cubic-bezier(0.4,0,0.2,1),
              bottom 0.45s cubic-bezier(0.4,0,0.2,1),
              left 0.45s cubic-bezier(0.4,0,0.2,1);
  z-index: 0;
}
.xo-hero-badge-card:hover .xo-hero-badge-circle {
  width: 300px;
  height: 300px;
  bottom: -130px;
  left: -50px;
}
.xo-hero-badge-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.xo-hero-badge-card:hover .xo-hero-badge-icon {
  transform: scale(0.8);
  filter: brightness(0) invert(1);
}
.xo-hero-badge-icon img {
  width: 16px;
  height: 16px;
}
.xo-hero-badge-text-wrap {
  overflow: hidden;
  height: 18px;
  position: relative;
  z-index: 1;
  flex: 1;
}
.xo-hero-badge-label,
.xo-hero-badge-cta {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
  display: block;
  margin: 0;
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.xo-hero-badge-label {
  color: #000;
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), color 0.35s ease;
}
.xo-hero-badge-cta {
  color: #fff;
}
.xo-hero-badge-card:hover .xo-hero-badge-label {
  transform: translateY(-100%);
  color: #fff;
}
.xo-hero-badge-card:hover .xo-hero-badge-cta {
  transform: translateY(-100%);
}

/* ── V1 active: hide original Webflow hero content ── */
.section-home-header.xo-v1 .header-content-wrap,
.section-home-header.xo-v1 .background-video-wrap,
.section-home-header.xo-v1 .header-bottom-wrap,
.section-home-header.xo-v1 .gsap-component {
  visibility: hidden !important;
}

/* ── Entrance animation initial states ── */
.xo-hero-subtitle,
.xo-hero-services,
.xo-hero-scroll-indicator,
.xo-hero-badge-card {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 991px) {
  .xo-hero-subtitle { font-size: 16px; }
  .xo-hero-subtitle-wrap { max-width: 260px; }
  .xo-hero-badge-card,
  .xo-hero-badge-photo,
  .xo-hero-badge-text { width: 180px; }
  .xo-hero-badge-photo { height: 115px; }
}
@media (max-width: 767px) {
  .xo-hero-bottom { padding: 0 calc(1.25rem - 10px); bottom: 24px; }
  .xo-hero-services { display: none; }
  .xo-hero-badge-card,
  .xo-hero-badge-photo,
  .xo-hero-badge-text { width: 160px; }
  .xo-hero-badge-photo { height: 100px; }
  .xo-hero-subtitle { font-size: 14px; }
  .xo-hero-subtitle-wrap { max-width: 240px; }
}
`

/* ═══════════════════════════════════════════
   OVERLAY HTML
   ═══════════════════════════════════════════ */

const OVERLAY_HTML = `
<div class="xo-hero-unicorn" data-us-project="ls2GMMfphEx75JbBhSXt"></div>
<div class="xo-hero-subtitle-wrap">
  <p class="xo-hero-subtitle">We design and build digital experiences through strategy, branding, and technology.</p>
</div>
<div class="xo-hero-bottom">
  <div class="xo-hero-bottom-grid">
    <div class="xo-hero-bottom-left">
      <div class="xo-hero-services">
        <div class="xo-hero-services-track">
          <span class="xo-hero-service-item">Web Design</span>
          <span class="xo-hero-service-item">Social Media</span>
          <span class="xo-hero-service-item">Marketing</span>
          <span class="xo-hero-service-item">Development</span>
          <span class="xo-hero-service-item">SEO Optimization</span>
          <span class="xo-hero-service-item" aria-hidden="true">Web Design</span>
        </div>
      </div>
    </div>
    <div class="xo-hero-bottom-center">
      <div class="xo-hero-scroll-indicator">
        <div class="xo-hero-scroll-arrow"></div>
        <span class="xo-hero-scroll-text">Scroll to explore</span>
      </div>
    </div>
    <div class="xo-hero-bottom-right">
      <a href="javascript:void(0)" class="xo-hero-badge-card" onclick="document.querySelector('.section-home-projects').scrollIntoView({behavior:'smooth'})">
        <div class="xo-hero-badge-photo"></div>
        <div class="xo-hero-badge-text">
          <div class="xo-hero-badge-circle"></div>
          <div class="xo-hero-badge-icon">
            <img src="${BASE}images/lightning.png" alt="" width="16" height="16" />
          </div>
          <div class="xo-hero-badge-text-wrap">
            <p class="xo-hero-badge-label">Explore Our Work</p>
            <p class="xo-hero-badge-cta">View Projects</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</div>
`

/* ═══════════════════════════════════════════
   MAIN INJECTOR
   ═══════════════════════════════════════════ */

export function injectHero(doc, win, onReady) {
  const heroSection = doc.querySelector('.section-home-header')
  if (!heroSection) return
  if (doc.querySelector('.xo-hero-overlay')) {
    if (onReady) onReady()
    return
  }

  const grid = heroSection.querySelector('.header-component-grid')
  if (!grid) return

  const navbar = doc.querySelector('.navbar')

  const style = doc.createElement('style')
  style.textContent = HERO_CSS
  doc.head.appendChild(style)

  // Grid must be a positioning context for the absolute-positioned overlay.
  grid.style.position = 'relative'

  const overlay = doc.createElement('div')
  overlay.className = 'xo-hero-overlay'
  overlay.innerHTML = OVERLAY_HTML
  grid.appendChild(overlay)

  heroSection.classList.add('xo-v1')

  if (navbar) {
    navbar.style.opacity = '0'
    navbar.style.transform = 'translateY(-20px)'
  }

  // Signal ready before entrance runs so the loading screen fades into the pre-entrance state, not a flash of animated content.
  if (onReady) onReady()

  runOverlayEntrance(win, overlay, navbar)

  const unicornEl = overlay.querySelector('.xo-hero-unicorn')
  if (unicornEl) unicornEl.style.opacity = '0'

  const script = doc.createElement('script')
  script.crossOrigin = 'anonymous'
  script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.6/dist/unicornStudio.umd.js'
  script.onload = () => {
    if (win.UnicornStudio) {
      win.UnicornStudio.init({ scale: 1, dpi: 1.5 })
    }
    // Fade in the animated background once SDK is ready
    if (unicornEl && win.gsap) {
      win.gsap.to(unicornEl, { opacity: 1, duration: 1.2, ease: 'power2.inOut' })
    } else if (unicornEl) {
      unicornEl.style.transition = 'opacity 1.2s ease'
      unicornEl.style.opacity = '1'
    }
  }
  doc.body.appendChild(script)
}

/* ═══════════════════════════════════════════
   ENTRANCE ANIMATION
   ═══════════════════════════════════════════ */

function runOverlayEntrance(win, overlay, navbar) {
  const gsap = win.gsap
  if (!gsap) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Navbar slides down into view
  if (navbar) {
    tl.fromTo(
      navbar,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      0.1
    )
  }

  tl.fromTo(
    overlay.querySelector('.xo-hero-subtitle'),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    0.3
  )

  tl.fromTo(
    overlay.querySelector('.xo-hero-services'),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    0.5
  )

  tl.fromTo(
    overlay.querySelector('.xo-hero-scroll-indicator'),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    0.6
  )

  tl.fromTo(
    overlay.querySelector('.xo-hero-badge-card'),
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    0.6
  )

  tl.call(() => runServicesCycle(win, overlay), null, 1.4)
}

/* ═══════════════════════════════════════════
   SERVICES ROLLING TICKER
   ═══════════════════════════════════════════ */

function runServicesCycle(win, overlay) {
  const gsap = win.gsap
  const track = overlay.querySelector('.xo-hero-services-track')
  if (!gsap || !track) return

  const items = track.querySelectorAll('.xo-hero-service-item')
  if (items.length < 2) return

  const cs = win.getComputedStyle(items[0])
  const step = items[0].offsetHeight + parseFloat(cs.marginBottom) || 27.2
  const realCount = items.length - 1 // last item duplicates first for seamless loop
  const secondsPerItem = 1.8

  gsap.set(track, { y: 0 })
  gsap.to(track, {
    y: -realCount * step,
    duration: secondsPerItem * realCount,
    ease: 'none',
    repeat: -1,
  })
}
