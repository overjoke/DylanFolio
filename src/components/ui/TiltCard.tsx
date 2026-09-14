import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

interface Props {
  children: ReactNode
  className?: string
  /** Inclinaison maximale en degrés */
  max?: number
  spotlight?: boolean
}

/** Carte avec inclinaison 3D au survol et halo lumineux qui suit le pointeur */
export function TiltCard({ children, className = '', max = 7, spotlight = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rx = useSpring(0, { stiffness: 180, damping: 18 })
  const ry = useSpring(0, { stiffness: 180, damping: 18 })
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, var(--accent-glow), transparent 55%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set(px * 100)
    my.set(py * 100)
    if (!reduce) {
      ry.set((px - 0.5) * max * 2)
      rx.set(-(py - 0.5) * max * 2)
    }
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={`group relative h-full overflow-hidden rounded-2xl glass transition-[border-color] duration-300 hover:border-line-strong ${className}`}
      >
        {spotlight && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glow }}
          />
        )}
        <div className="relative h-full">{children}</div>
      </motion.div>
    </div>
  )
}
