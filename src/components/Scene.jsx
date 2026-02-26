import * as THREE from 'three'
import Rain from './Rain'
import BusStop from '../hubs/BusStop'

export default function Scene({ openModal }) {
  return (
    <>
      {/* Cinematic Lighting — Brighter with Vignette Fog */}
      <ambientLight intensity={1.2} color="#1a2a3a" />
      <directionalLight position={[10, 20, -10]} intensity={0.8} color="#ff9040" />
      <directionalLight position={[-5, 15, 5]} intensity={0.4} color="#00e5ff" />
      <hemisphereLight args={['#4488aa', '#0a0a0f', 0.8]} />

      {/* Atmosphere — fog creates natural vignette */}
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 16, 36]} />

      {/* Weather */}
      <Rain />

      {/* The Diorama */}
      <group position={[0, -0.5, 0]}>
        <BusStop openModal={openModal} />
      </group>
    </>
  )
}
