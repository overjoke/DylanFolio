import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useI18n } from '../../i18n/LanguageProvider'
import { stackGroups } from '../../data/profile'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/**
 * Sphère de mots en 3D (DOM + trigonométrie, sans WebGL).
 * Se manipule à la souris ou au doigt, avec inertie.
 */
function TagSphere({ tags }: { tags: string[] }) {
  const container = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])
  const reduce = useReducedMotion()

  // Répartition uniforme sur la sphère (spirale de Fibonacci)
  const points = useMemo(
    () =>
      tags.map((_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / tags.length)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i
        return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)] as const
      }),
    [tags],
  )

  useEffect(() => {
    const el = container.current
    if (!el) return
    let rx = 0.3
    let ry = 0
    let vx = reduce ? 0 : 0.0016
    let vy = reduce ? 0 : 0.0032
    let dragging = false
    let lastX = 0
    let lastY = 0
    let frame = 0
    let visible = true

    const render = () => {
      const radius = el.clientWidth / 2.35
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      points.forEach(([x, y, z], i) => {
        const node = items.current[i]
        if (!node) return
        // rotation autour de Y puis de X
        const x1 = x * cosY + z * sinY
        const z1 = -x * sinY + z * cosY
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        const depth = (z2 + 1) / 2 // 0 (fond) → 1 (devant)
        node.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${0.6 + depth * 0.55})`
        node.style.opacity = String(0.2 + depth * 0.8)
        node.style.zIndex = String(Math.round(depth * 100))
        node.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 3}px)` : 'none'
      })
    }

    const loop = () => {
      if (visible) {
        if (!dragging) {
          ry += vy
          rx += vx
          if (!reduce) {
            // retour progressif à la vitesse de croisière
            vy += (0.0032 - vy) * 0.02
            vx += (0.0016 - vx) * 0.02
          } else {
            vx *= 0.92
            vy *= 0.92
          }
        }
        render()
      }
      frame = requestAnimationFrame(loop)
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      vy = dx * 0.005
      vx = -dy * 0.005
      ry += vy
      rx += vx
    }
    const onUp = () => {
      dragging = false
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(el)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    render()
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [points, reduce])

  return (
    <div
      ref={container}
      className="relative mx-auto aspect-square w-full max-w-[520px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      aria-hidden="true"
    >
      <div
        className="absolute inset-[18%] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }}
      />
      <div className="absolute inset-[6%] rounded-full border border-dashed border-line" />
      <div className="absolute top-1/2 left-1/2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            ref={(node) => {
              items.current[i] = node
            }}
            className="absolute top-0 left-0 rounded-full border border-line bg-surface-strong px-3 py-1 font-mono text-[13px] whitespace-nowrap text-ink shadow-sm will-change-transform"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Stack() {
  const { t } = useI18n()
  const allTags = useMemo(() => stackGroups.flatMap((g) => g.items), [])

  return (
    <section id="stack" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading number="06" index={t.stack.index} title={t.stack.title} subtitle={t.stack.subtitle} />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <TagSphere tags={allTags} />
            <p className="mt-2 text-center font-mono text-xs text-faint">↻ {t.stack.hint}</p>
          </Reveal>

          <div className="space-y-6">
            {stackGroups.map((group, i) => (
              <Reveal key={group.key} delay={i * 0.06}>
                <h3 className="flex items-center gap-3 font-mono text-xs tracking-widest text-faint uppercase">
                  <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {t.stack.groups[group.key]}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-line bg-elev px-3 py-1.5 text-sm text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
