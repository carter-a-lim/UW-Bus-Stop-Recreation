import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const generateRainPositions = (count) => {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 60
    arr[i * 3 + 1] = Math.random() * 30
    arr[i * 3 + 2] = (Math.random() - 0.5) * 200 - 70
  }
  return arr
}

export default function Rain() {
  const ref = useRef()
  const count = 1500

  const positions = useMemo(() => generateRainPositions(count), [count])

  useFrame(() => {
    if (!ref.current) return
    const posArr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] -= 0.3 // Fall speed
      if (posArr[i * 3 + 1] < -1) {
        posArr[i * 3 + 1] = 25 + Math.random() * 5
        posArr[i * 3] = (Math.random() - 0.5) * 60
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#aaccff" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}
