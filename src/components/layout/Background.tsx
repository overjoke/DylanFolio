import { motion, useScroll, useSpring } from 'motion/react'

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div
        className="aurora-a absolute -top-[20vh] -left-[10vw] h-[60vh] w-[60vw] rounded-full opacity-40 blur-[120px] dark:opacity-30"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
      />
      <div
        className="aurora-b absolute top-[30vh] -right-[15vw] h-[55vh] w-[50vw] rounded-full opacity-25 blur-[130px] dark:opacity-20"
        style={{ background: 'radial-gradient(circle, var(--accent-3) 0%, transparent 65%)' }}
      />
      <div className="noise absolute inset-0" />
    </div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
      style={{ scaleX }}
    />
  )
}
