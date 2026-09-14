import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01'

/**
 * Affiche un texte qui se « décode » à chaque changement (ex. changement de langue).
 * Le texte final est toujours exposé aux lecteurs d'écran.
 */
export function ScrambleText({ text, className, duration = 700 }: { text: string; className?: string; duration?: number }) {
  const [display, setDisplay] = useState(text)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      setDisplay(text)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const revealed = Math.floor(progress * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (i < revealed || ch === ' ') out += ch
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setDisplay(out)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, duration])

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
