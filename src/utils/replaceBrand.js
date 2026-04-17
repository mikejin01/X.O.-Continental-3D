const BASE = import.meta.env.BASE_URL
const BRAND_NAME = 'X.O. Continental'
const BRAND_PATTERN = /\bUnusually\b/g
const COPYRIGHT_PATTERN = /\(2010-26©\)/g

const FACEBOOK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"></path></svg>'

const PHONE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor"><path d="M6.62,10.79c1.44,2.83,3.76,5.14,6.59,6.59l2.2-2.2c0.27-0.27,0.67-0.36,1.02-0.24c1.12,0.37,2.33,0.57,3.57,0.57c0.55,0,1,0.45,1,1V20c0,0.55-0.45,1-1,1C10.75,21,3,13.25,3,4c0-0.55,0.45-1,1-1h3.5c0.55,0,1,0.45,1,1c0,1.24,0.2,2.45,0.57,3.57c0.11,0.35,0.03,0.75-0.25,1.02L6.62,10.79z"></path></svg>'

const SOCIAL_LINKS = {
  'Instagram Link': 'https://www.instagram.com/x.o.continental/',
  'Linkedin Link': 'https://www.linkedin.com/company/xo-continental/',
  'Facebook Link': 'https://www.facebook.com/people/XO-Continental-Marketing/61577776691224/',
  'Phone Link': 'tel:+17187015918',
}

const TEXT_ATTRS = ['alt', 'title', 'aria-label', 'placeholder']

function replaceBrandText(value) {
  return value.replace(BRAND_PATTERN, BRAND_NAME).replace(COPYRIGHT_PATTERN, '2025-2026©')
}

export function replaceBrandInDocument(doc, { hideSelectors = [] } = {}) {
  if (!doc) return

  doc.title = replaceBrandText(doc.title)

  doc.querySelectorAll('[content]').forEach((el) => {
    const current = el.getAttribute('content')
    if (current) el.setAttribute('content', replaceBrandText(current))
  })

  doc.querySelectorAll(TEXT_ATTRS.map((a) => `[${a}]`).join(', ')).forEach((el) => {
    TEXT_ATTRS.forEach((attr) => {
      const current = el.getAttribute(attr)
      if (current) el.setAttribute(attr, replaceBrandText(current))
    })
  })

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    if (node.nodeValue && node.nodeValue.includes('Unusually')) {
      node.nodeValue = replaceBrandText(node.nodeValue)
    }
    node = walker.nextNode()
  }

  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src')
    if (src && src.startsWith('/client%20logos/')) {
      img.setAttribute('src', `${BASE}${src.slice(1)}`)
    }
  })

  doc.querySelectorAll('a[aria-label]').forEach((link) => {
    let label = link.getAttribute('aria-label')

    if (label === 'Behance Link') {
      link.setAttribute('aria-label', 'Facebook Link')
      label = 'Facebook Link'
      link.querySelectorAll('.social-icon.w-embed').forEach((svg) => {
        svg.innerHTML = FACEBOOK_SVG
      })
    } else if (label === 'Dribbble Link' || label === 'Website Link') {
      link.setAttribute('aria-label', 'Phone Link')
      label = 'Phone Link'
      link.querySelectorAll('.social-icon.w-embed').forEach((svg) => {
        svg.innerHTML = PHONE_SVG
      })
    }

    if (SOCIAL_LINKS[label]) {
      link.setAttribute('href', SOCIAL_LINKS[label])
    }
  })

  hideSelectors.forEach((sel) => {
    const section = doc.querySelector(sel)
    if (section) section.style.display = 'none'
  })

  doc.querySelectorAll('.footer-logo-link').forEach((link) => {
    const xoLogo = link.querySelector('img[alt="X.O. Continental Logo"]')
    if (xoLogo) {
      const style = (xoLogo.getAttribute('style') || '').replace(
        /;?\s*filter:\s*brightness\(0\)/i,
        ''
      )
      xoLogo.setAttribute('style', `${style};height:2.4rem;width:auto;`)
    }

    link.querySelectorAll('img.footer-logo').forEach((img) => {
      if (img !== xoLogo) img.remove()
    })

    link.setAttribute(
      'style',
      'display:flex;align-items:center;gap:.65rem;text-decoration:none;'
    )

    const topContent = link.closest('.footer-top-content')
    if (topContent) {
      const stale = topContent.querySelector('.footer-business-name')
      if (stale) stale.remove()
      topContent.style.removeProperty('flex-direction')
      topContent.style.removeProperty('gap')
    }

    if (!link.querySelector('.footer-brand-text')) {
      const wrap = doc.createElement('div')
      wrap.className = 'footer-brand-text'
      wrap.style.cssText = 'display:flex;flex-direction:column;line-height:1.1;'

      const line1 = doc.createElement('div')
      line1.textContent = 'X.O. CONTINENTAL'
      line1.style.cssText =
        'font-size:1.05rem;font-weight:600;letter-spacing:.08em;color:inherit;'

      const line2 = doc.createElement('div')
      line2.textContent = 'MARKETING & BRANDING CO.'
      line2.style.cssText =
        'font-size:.7rem;font-weight:400;letter-spacing:.18em;opacity:.7;margin-top:.2rem;'

      wrap.append(line1, line2)
      link.appendChild(wrap)
    }
  })

  const bottomBlocks = doc.querySelectorAll('.footer-bottom .footer-content-block')
  if (bottomBlocks.length) {
    const leftBlock = bottomBlocks[0]
    const copyrightText = leftBlock.querySelector('.footer-text')
    if (copyrightText && copyrightText.textContent.includes('©')) {
      copyrightText.textContent = '© 2026 X.O. Continental'
    }

    const allBlocks = Array.from(leftBlock.querySelectorAll('.footer-block'))
    allBlocks.forEach((block, i) => {
      if (i > 0) block.remove()
    })

    const hasAllRights = Array.from(leftBlock.querySelectorAll('.footer-text')).some(
      (t) => t.textContent.trim() === 'All rights reserved.'
    )
    if (!hasAllRights) {
      const block = doc.createElement('div')
      block.className = 'footer-block'
      const text = doc.createElement('div')
      text.className = 'footer-text'
      text.textContent = 'All rights reserved.'
      block.appendChild(text)
      leftBlock.appendChild(block)
    }

    const rightBlock = bottomBlocks[1]
    if (rightBlock) {
      rightBlock.innerHTML = `
        <div class="footer-block">
          <a href="#" class="footer-link w-inline-block">
            <div class="link-text-block">
              <div class="link-text-item">Privacy Policy</div>
              <div class="link-text-item">Privacy Policy</div>
            </div>
          </a>
        </div>
        <div class="footer-block">
          <a href="#" class="footer-link w-inline-block">
            <div class="link-text-block">
              <div class="link-text-item">Terms of Service</div>
              <div class="link-text-item">Terms of Service</div>
            </div>
          </a>
        </div>
      `
    }
  }
}
