import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { Theme } from '../../lib/theme'

const palettes = {
  dark: { core: '#7b61ff', emissive: '#3b1fd1', wire: '#a99bff', ring: '#22d3ee', particles: '#b9adff', light1: '#8f80ff', light2: '#22d3ee' },
  light: { core: '#7b61ff', emissive: '#2f17b8', wire: '#5b45e0', ring: '#0891b2', particles: '#5b45e0', light1: '#a78bfa', light2: '#38bdf8' },
}

type Palette = (typeof palettes)['dark']

/** Suit le pointeur sur toute la fenêtre (le canvas est derrière le texte) */
function usePointer() {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return pointer
}

function Core({ palette, pointer }: { palette: Palette; pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  const wire = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.current.x * 0.5, 3, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.current.y * 0.35, 3, delta)
    }
    if (wire.current) {
      wire.current.rotation.x = t * 0.08
      wire.current.rotation.y = t * 0.12
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.25
    if (ringB.current) ringB.current.rotation.z = -t * 0.18
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh>
          <icosahedronGeometry args={[1.15, 20]} />
          <MeshDistortMaterial
            color={palette.core}
            emissive={palette.emissive}
            emissiveIntensity={0.45}
            roughness={0.22}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.15}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[200, 900]}
            envMapIntensity={1.4}
            distort={0.36}
            speed={1.5}
          />
        </mesh>
        <mesh ref={wire} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={palette.wire} wireframe transparent opacity={0.22} />
        </mesh>
      </Float>

      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.45, 0.008, 16, 180]} />
        <meshBasicMaterial color={palette.ring} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0.4]}>
        <torusGeometry args={[2.9, 0.005, 16, 200]} />
        <meshBasicMaterial color={palette.wire} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function Particles({ palette, count = 900 }: { palette: Palette; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Coquille sphérique irrégulière autour du noyau
      const r = 3.2 + Math.random() * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={palette.particles} size={0.028} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  )
}

/** Décale la scène à droite sur grand écran, la centre sur mobile */
function Rig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const wide = size.width >= 1024
    camera.position.set(wide ? -2.6 : -1.3, 0, wide ? 7.8 : 10)
    camera.lookAt(wide ? -2.6 : -1.3, 0, 0)
  }, [camera, size.width])
  return null
}

export default function HeroScene({ theme }: { theme: Theme }) {
  const palette = palettes[theme]
  const pointer = usePointer()
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const isSmall = useMemo(() => window.innerWidth < 640, [])

  // Met la boucle de rendu en pause quand le hero n'est plus visible
  useEffect(() => {
    const el = container.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={container} className="absolute inset-0 opacity-50 lg:opacity-100">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 42, position: [0, 0, 8] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduce || !visible ? 'demand' : 'always'}
      >
        <Rig />
        <ambientLight intensity={theme === 'dark' ? 0.25 : 0.7} />
        <pointLight position={[4, 3, 4]} intensity={18} color={palette.light1} />
        <pointLight position={[-4, -2, 2]} intensity={14} color={palette.light2} />
        {/* Éclairage studio généré localement (aucun fichier HDR à télécharger) */}
        <Environment key={theme} resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} color={palette.light2} position={[-5, 0, -1]} scale={[1.2, 10, 1]} />
          <Lightformer form="rect" intensity={2.8} color={palette.light1} position={[5, 0, -1]} scale={[1.2, 10, 1]} />
          <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, 6, -2]} scale={[12, 1.5, 1]} />
          <Lightformer form="circle" intensity={0.7} color={palette.core} position={[0, 0, -9]} scale={14} />
        </Environment>
        <group>
          <Core palette={palette} pointer={pointer} />
          <Particles palette={palette} count={isSmall ? 450 : 900} />
        </group>
      </Canvas>
    </div>
  )
}
