import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Apparition douce au scroll (fondu + translation) */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export { ease }
