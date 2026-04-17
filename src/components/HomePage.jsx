import { useEffect, useRef, useState } from 'react'
import { injectHero } from './heroInjector'
import { replaceBrandInDocument } from '../utils/replaceBrand'

const BASE = import.meta.env.BASE_URL
const HIDE_SELECTORS = ['.section-home-testimonial', '.section-home-pricing']

export default function HomePage() {
  const frameRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'opacity' && ready) {
      setDismissed(true)
    }
  }

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const handleLoad = () => {
      const doc = frame.contentDocument
      if (!doc) return

      replaceBrandInDocument(doc, { hideSelectors: HIDE_SELECTORS })
      injectHero(doc, frame.contentWindow, () => setReady(true))
    }

    frame.addEventListener('load', handleLoad)
    return () => frame.removeEventListener('load', handleLoad)
  }, [])

  return (
    <>
      {!dismissed && (
        <div
          className="xo-loading-screen"
          data-ready={ready ? 'true' : 'false'}
          onTransitionEnd={handleTransitionEnd}
        >
          <img
            className="xo-loading-logo"
            src={`${BASE}site/images/xo-logo.png`}
            alt=""
          />
          <span className="xo-loading-label">Loading</span>
        </div>
      )}
      <iframe
        ref={frameRef}
        title="Home"
        src={`${BASE}site/index.html`}
        className="webflow-frame"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </>
  )
}
