import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import { replaceBrandInDocument } from './utils/replaceBrand'

function WebflowPage({ src }) {
  const frameRef = useRef(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) {
      return
    }

    const updateBranding = () => replaceBrandInDocument(frame.contentDocument)

    frame.addEventListener('load', updateBranding)
    updateBranding()

    return () => {
      frame.removeEventListener('load', updateBranding)
    }
  }, [src])

  return (
    <iframe
      ref={frameRef}
      title={src}
      src={`${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`}
      className="webflow-frame"
      loading="eager"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<WebflowPage src="/site/about.html" />} />
      <Route path="/contact" element={<WebflowPage src="/site/contact.html" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
