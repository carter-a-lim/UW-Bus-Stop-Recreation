import { useState, useCallback, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import Scene from './components/Scene'
import LoadingScreen from './components/LoadingScreen'
import Modal from './components/Modal'
import './index.css'

function IntroAnimation({ audioStarted, controlsRef }) {
  useFrame((state, delta) => {
    if (audioStarted && controlsRef.current) {
      // Pan up: smoothly interpolate the target Y to eye level (1.25)
      controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, 1.25, delta * 1.2)
      controlsRef.current.update()
    }
  })
  return null
}



export default function App() {
  const [modal, setModal] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const [headphonesOn, setHeadphonesOn] = useState(null)

  const audioCtxRef = useRef(null)
  
  // Music refs
  const filterRef = useRef(null)
  const gainRef = useRef(null)
  const audioElRef = useRef(null)
  
  // Rain refs
  const rainFilterRef = useRef(null)
  const rainGainRef = useRef(null)
  const rainElRef = useRef(null)

  const controlsRef = useRef(null)

  const startAudio = () => {
    if (!audioCtxRef.current) {
      const audio = new Audio(`${import.meta.env.BASE_URL}the_way_life_goes.mp3`)
      audio.loop = true
      audioElRef.current = audio

      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx

      // 1. Music Setup
      const source = ctx.createMediaElementSource(audio)
      
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 150 // Even more muffled on start (headphones off)
      filterRef.current = filter

      const gain = ctx.createGain()
      gain.gain.value = 0.35 // Quieter when off
      gainRef.current = gain

      // Connect: audio -> filter -> gain -> destination
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      
      audio.play().catch(e => console.error("Audio play failed:", e))

      // 2. Rain Setup
      const rainAudio = new Audio(`${import.meta.env.BASE_URL}rain.mp3`)
      rainAudio.loop = true
      rainElRef.current = rainAudio

      const rainSource = ctx.createMediaElementSource(rainAudio)
      
      const rainFilter = ctx.createBiquadFilter()
      rainFilter.type = 'lowpass'
      rainFilter.frequency.value = 20000 // Clear on start (headphones off)
      rainFilterRef.current = rainFilter

      const rainGain = ctx.createGain()
      rainGain.gain.value = 0.6 // Adjust base volume of rain
      rainGainRef.current = rainGain

      rainSource.connect(rainFilter)
      rainFilter.connect(rainGain)
      rainGain.connect(ctx.destination)

      rainAudio.play().catch(e => console.error("Rain audio play failed:", e))
    }
    setAudioStarted(true)
  }

  const toggleHeadphones = () => {
    if (!filterRef.current || !gainRef.current || !audioCtxRef.current) return
    
    const isNowOn = !headphonesOn
    setHeadphonesOn(isNowOn)
    
    const { currentTime } = audioCtxRef.current
    // User requested faster transition when taking headphones off
    const transitionTime = isNowOn ? 0.8 : 0.1 

    // Music changes: Muffled -> Clear when putting ON
    filterRef.current.frequency.setTargetAtTime(
      isNowOn ? 20000 : 150, 
      currentTime,
      transitionTime
    )
    gainRef.current.gain.setTargetAtTime(
      isNowOn ? 1.0 : 0.35,
      currentTime,
      transitionTime
    )

    // Rain changes: Clear -> Muffled when putting ON
    if (rainFilterRef.current && rainGainRef.current) {
      rainFilterRef.current.frequency.setTargetAtTime(
        isNowOn ? 200 : 20000, 
        currentTime,
        transitionTime
      )
      rainGainRef.current.gain.setTargetAtTime(
        isNowOn ? 0.05 : 0.6,
        currentTime,
        transitionTime
      )
    }
  }

  const openModal = useCallback((content) => setModal(content), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <>
      <LoadingScreen loaded={loaded} />

      {/* Cinematic Start Overlay (solid black fading out) */}
      <div className={`audio-start-overlay ${audioStarted ? 'fade-out' : ''}`}>
        {loaded && !audioStarted && (
          <button className="start-btn" onClick={startAudio}>
            Enter Scene
          </button>
        )}
      </div>

      <div className="canvas-wrapper">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [-3.2, 1.25, -1.55], fov: 60, near: 0.1, far: 300 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#050510')
            setTimeout(() => setLoaded(true), 800)
          }}
        >
          <OrbitControls 
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            target={[-3.2, 1.15, -1.5]} // Starts looking down (-45 degree pitch equivalent due to near z-distance)
          />
          <IntroAnimation audioStarted={audioStarted} controlsRef={controlsRef} />
          <Suspense fallback={null}>
            <Scene openModal={openModal} />
          </Suspense>
        </Canvas>
      </div>

      {/* Real-Life Location Link */}
      <a 
        href="https://earth.google.com/web/search/bus+stop/@47.65394764,-122.30505794,39.53076553a,0d,60y,275.91318031h,85.50359095t,0r/data=CiwiJgokCZbEBhM31EdAES9G8AJo00dAGcE0cDr-kl7AIQMtwHkclF7AQgIIASIaChZ4SGNqSDJidHBhZV9pMFRMOVBuY2RnEAI6AwoBMEICCABKDQj___________8BEAA?authuser=0"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', top: 15, right: 15, zIndex: 999,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          padding: '8px 12px', borderRadius: 8,
          fontFamily: 'Space Mono, monospace', fontSize: '0.75rem',
          textDecoration: 'none', border: '1px solid #333',
          display: 'flex', alignItems: 'center', gap: '6px',
          backdropFilter: 'blur(4px)', transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.8)'
          e.currentTarget.style.borderColor = '#00e5ff'
          e.currentTarget.style.color = '#00e5ff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
          e.currentTarget.style.borderColor = '#333'
          e.currentTarget.style.color = '#fff'
        }}
      >
        <span>📍</span> View Real Location
      </a>

      {/* Header */}
      <div className="site-header">
        <div className="header-name">Carter <span>Lim</span></div>
      </div>

      {/* Interaction Hint */}
      {loaded && !modal && (
        <div className="interaction-hint">
          <span>⟷</span> Drag to explore
        </div>
      )}

      {/* Headphones Animation Overlay (Earcups) */}
      {audioStarted && (
        <div className={`headphones-overlay ${headphonesOn === true ? 'on' : headphonesOn === false ? 'off' : ''}`}>
          <div className="earcup left"></div>
          <div className="earcup right"></div>
        </div>
      )}

      {/* Arms Animation Overlay */}
      {audioStarted && (
        <div className={`arms-overlay ${headphonesOn === true ? 'on' : headphonesOn === false ? 'off' : ''}`}>
          <div className="arm left">
            <div className="hand"></div>
          </div>
          <div className="arm right">
            <div className="hand"></div>
          </div>
        </div>
      )}

      {/* Headphones Toggle Button */}
      {audioStarted && !modal && (
        <button className={`headphones-btn ${headphonesOn ? 'active' : ''}`} onClick={toggleHeadphones}>
          {headphonesOn ? '🎧 Take Off Headphones' : '🎧 Put On Headphones'}
        </button>
      )}

      {modal && <Modal content={modal} onClose={closeModal} />}
    </>
  )
}
