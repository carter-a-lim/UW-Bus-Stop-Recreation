import { useState } from 'react'
import { Html } from '@react-three/drei'

function ClickableMesh({ children, onClick, ...props }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group
      {...props}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      scale={hovered ? 1.05 : 1}
    >
      {children}
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 4]} />
        <meshStandardMaterial color="#3a251a" roughness={0.9} />
      </mesh>
      {/* Leaves (Low Poly) */}
      <mesh position={[0, 4.5, 0]}>
        <dodecahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#1a4d25" roughness={0.8} />
      </mesh>
      <mesh position={[-1.5, 3.5, 1]}>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#143d1a" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 4, -1]}>
        <dodecahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#215c2d" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Road() {
  return (
    <group>
      {/* Main Asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} /> {/* Wet look */}
      </mesh>

      {/* Sidewalk */}
      <mesh position={[0, 0.1, -3]}>
        <boxGeometry args={[40, 0.2, 8]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>

      {/* Double Yellow Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4]}>
        <planeGeometry args={[40, 0.15]} />
        <meshStandardMaterial color="#d4a300" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4.3]}>
        <planeGeometry args={[40, 0.15]} />
        <meshStandardMaterial color="#d4a300" roughness={0.6} />
      </mesh>

      {/* Crosswalk Group (Matching Reference Image) */}
      <group position={[-9, 0.02, 4]}>
        {/* Left Boundary Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0, 0]}>
          <planeGeometry args={[0.2, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.5} />
        </mesh>
        
        {/* Right Boundary Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0, 0]}>
          <planeGeometry args={[0.2, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.5} />
        </mesh>

        {/* Zebra Stripes (skipping the center double yellow line) */}
        {[-5.25, -4, -2.75, -1.5, 1.5, 2.75, 4, 5.25].map((z, i) => (
          <mesh key={`stripe-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}>
            <planeGeometry args={[2.5, 0.55]} />
            <meshStandardMaterial color="#ddd" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* === Across the Street === */}

      {/* Far Sidewalk / Curb */}
      <mesh position={[0, 0.12, 10.5]}>
        <boxGeometry args={[40, 0.25, 1.5]} />
        <meshStandardMaterial color="#555" roughness={0.85} />
      </mesh>

      {/* Grass Lawn */}
      <mesh position={[0, 0.05, 18]}>
        <boxGeometry args={[40, 0.1, 16]} />
        <meshStandardMaterial color="#1a3d11" roughness={0.9} />
      </mesh>

      {/* Sidewalk path along road (horizontal) */}
      <mesh position={[0, 0.11, 11.5]}>
        <boxGeometry args={[40, 0.1, 1.5]} />
        <meshStandardMaterial color="#555" roughness={0.8} />
      </mesh>

      {/* Diagonal path cutting from road toward building (SW to NE) */}
      <mesh position={[-4, 0.11, 17]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.1, 12]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>

      {/* Second diagonal path (from right side toward building) */}
      <mesh position={[8, 0.11, 17]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[1.4, 0.1, 11]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>

      {/* Connecting path near building entrance */}
      <mesh position={[2, 0.11, 21]}>
        <boxGeometry args={[10, 0.1, 1.4]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>

      {/* Black lamp posts lighting up the background street */}
      {[-6.5, 1.5, 9.5].map((x, i) => (
        <group key={`lamp-${i}`} position={[x, 0, 24.5]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 3.6]} />
            <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 3.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#ffddaa" emissiveIntensity={3} />
          </mesh>
          {/* Functional Light Source — bright warm pool */}
          <pointLight position={[0, 3.6, 0]} color="#ffddaa" intensity={8} distance={25} decay={1.5} castShadow />
        </group>
      ))}

      {/* Sparse large trees matching street view reference */}
      {/* Far left large tree */}
      <Tree position={[-12, 0.1, 14]} scale={2.2} />
      
      {/* Center-left tree near building entrance */}
      <Tree position={[-2, 0.1, 19]} scale={2.5} />
      
      {/* Center-right large tree next to path intersection */}
      <Tree position={[5, 0.1, 15]} scale={2.4} />
      
      {/* Far right large tree near white building */}
      <Tree position={[14, 0.1, 16]} scale={2.6} />

      {/* Aerospace & Engineering Research Building (Large brick building across street left) */}
      <group position={[-5, 7, 36]} rotation={[0, 0.76, 0]}>
        {/* Main building body */}
        <mesh>
          <boxGeometry args={[26, 14, 6]} />
          <meshStandardMaterial color="#c27a5b" roughness={0.9} /> {/* Light orange brick */}
        </mesh>
        
        {/* Windows facing street (-Z face: z = -3.01) */}
        {/* Floors 1 to 4 */}
        {[-4.5, -1.5, 1.5, 4.5].map((y, floorIdx) => (
          <group key={`aero-floor-${floorIdx}`}>
            {/* Columns of windows */}
            {[-10, -7, -4, -1, 2, 5, 8, 11].map((x, winIdx) => {
              // Leave space for the recessed entrance on ground floor (floorIdx 0) at x = 5
              if (floorIdx === 0 && x === 5) return null;
              
              return (
                <group key={`aero-win-${floorIdx}-${winIdx}`} position={[x, y, -3.01]} rotation={[0, Math.PI, 0]}>
                  {/* Recessed dark window glass */}
                  <mesh>
                    <planeGeometry args={[1.8, 2.2]} />
                    <meshStandardMaterial color="#111" emissive="#2a2a2a" emissiveIntensity={0.2} />
                  </mesh>
                  {/* Window thick dark frame */}
                  <mesh position={[0, 1.1, 0.02]}><planeGeometry args={[1.8, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
                  <mesh position={[0, -1.1, 0.02]}><planeGeometry args={[1.8, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
                  <mesh position={[-0.9, 0, 0.02]}><planeGeometry args={[0.1, 2.2]} /><meshStandardMaterial color="#222" /></mesh>
                  <mesh position={[0.9, 0, 0.02]}><planeGeometry args={[0.1, 2.2]} /><meshStandardMaterial color="#222" /></mesh>
                </group>
              );
            })}
          </group>
        ))}

        {/* Recessed Entrance Area on Ground Floor */}
        <group position={[5, -4.5, -3.01]} rotation={[0, Math.PI, 0]}>
          {/* Inner dark walls of the recess */}
          <mesh position={[0, -0.5, -0.5]}>
             <boxGeometry args={[3, 3, 1]} />
             <meshStandardMaterial color="#8a553f" roughness={0.9} />
          </mesh>
          {/* Dark doorway glass inside recess */}
          <mesh position={[0, -0.5, -0.98]}>
            <planeGeometry args={[2.5, 2.5]} />
            <meshStandardMaterial color="#0a0a0a" emissive="#1a1a1a" />
          </mesh>
          
          {/* Stairs leading up to entrance */}
          {[-1.8, -1.6, -1.4, -1.2, -1.0].map((stepY, i) => (
             <mesh key={`aero-step-${i}`} position={[0, stepY, 0.5 - (i * 0.2)]}>
               <boxGeometry args={[3, 0.2, 0.3]} />
               <meshStandardMaterial color="#888" roughness={0.8} />
             </mesh>
          ))}
          
          {/* Handrails (thin metal poles) */}
          <mesh position={[-1.2, -0.8, 0]} rotation={[0.5, 0, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 2.5]} />
             <meshStandardMaterial color="#333" metalness={0.6} />
          </mesh>
          <mesh position={[1.2, -0.8, 0]} rotation={[0.5, 0, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 2.5]} />
             <meshStandardMaterial color="#333" metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Mechanical Engineering Building BEHIND bus stop (same side of street) */}
      <mesh position={[0, 3.5, -6]}>
        <boxGeometry args={[22, 7, 4]} />
        <meshStandardMaterial color="#5a3528" roughness={0.92} />
      </mesh>
      {/* Grid windows on brick building behind */}
      {[-8, -5.5, -3, -0.5, 2, 4.5, 7, 9.5].map((x, i) => (
        <group key={`back-win-${i}`} position={[x, 4.5, -3.98]}>
          <mesh>
            <planeGeometry args={[2, 2.5]} />
            <meshStandardMaterial color="#1a2a2a" emissive="#556666" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2, 0.06]} />
            <meshStandardMaterial color="#ddd" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.06, 2.5]} />
            <meshStandardMaterial color="#ddd" />
          </mesh>
        </group>
      ))}

      {/* Kirsten Wind Tunnel Building (Pale green-grey building on far right) */}
      <group position={[-16, 0, 20]}>
        {/* Main building body */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[14, 4, 4]} />
          <meshStandardMaterial color="#949b92" roughness={0.8} /> {/* Pale greenish-grey */}
        </mesh>
        {/* Dark concrete base */}
        <mesh position={[0, 0.4, 0.1]}>
          <boxGeometry args={[14.2, 0.8, 4.2]} />
          <meshStandardMaterial color="#6a6d68" roughness={0.9} />
        </mesh>
        {/* Roof trim/overhang */}
        <mesh position={[0, 4.6, 0.1]}>
          <boxGeometry args={[14.4, 0.2, 4.4]} />
          <meshStandardMaterial color="#b2b8b0" roughness={0.7} />
        </mesh>
        {/* Foundation slight inset line above base */}
        <mesh position={[0, 0.85, 0.15]}>
          <boxGeometry args={[14.3, 0.1, 4.3]} />
          <meshStandardMaterial color="#848b82" roughness={0.8} />
        </mesh>

        {/* Detailed Multi-pane Windows (Three pairs) */}
        {[
          { x: -4.5, w: 2.2 }, // Left small window pair
          { x: 0, w: 4.8 },    // Center large window set
          { x: 4.5, w: 3.2 }   // Right medium window set
        ].map((win, i) => (
          <group key={`kirsten-win-${i}`} position={[win.x, 2.6, -2.02]} rotation={[0, Math.PI, 0]}>
            {/* Window glass background */}
            <mesh>
              <planeGeometry args={[win.w, 3]} />
              <meshStandardMaterial color="#111" emissive="#334455" emissiveIntensity={0.4} />
            </mesh>
            
            {/* Thick white window frames (outer edge) */}
            {/* Top/Bottom */}
            <mesh position={[0, 1.5, 0.01]}><planeGeometry args={[win.w, 0.1]} /><meshStandardMaterial color="#eee" /></mesh>
            <mesh position={[0, -1.5, 0.01]}><planeGeometry args={[win.w, 0.1]} /><meshStandardMaterial color="#eee" /></mesh>
            {/* Left/Right */}
            <mesh position={[-win.w/2, 0, 0.01]}><planeGeometry args={[0.1, 3]} /><meshStandardMaterial color="#eee" /></mesh>
            <mesh position={[win.w/2, 0, 0.01]}><planeGeometry args={[0.1, 3]} /><meshStandardMaterial color="#eee" /></mesh>

            {/* Vertical inner structural columns (thick) */}
            <mesh position={[-win.w/4, 0, 0.01]}><planeGeometry args={[0.1, 3]} /><meshStandardMaterial color="#eee" /></mesh>
            <mesh position={[win.w/4, 0, 0.01]}><planeGeometry args={[0.1, 3]} /><meshStandardMaterial color="#eee" /></mesh>

            {/* Detailed window grids (thin mullions) */}
            {/* Horizontal divisions */}
            {[-1.0, -0.5, 0, 0.5, 1.0].map((y, yi) => (
              <mesh key={`h-mullion-${yi}`} position={[0, y, 0.01]}>
                <planeGeometry args={[win.w, 0.03]} />
                <meshStandardMaterial color="#ddd" />
              </mesh>
            ))}
            {/* Vertical divisions (within each section) */}
            {[-win.w/2 + win.w/8, -win.w/4 + win.w/8, 0, win.w/4 + win.w/8, win.w/2 - win.w/8].map((vx, vi) => (
              <mesh key={`v-mullion-${vi}`} position={[vx, 0, 0.01]}>
                <planeGeometry args={[0.03, 3]} />
                <meshStandardMaterial color="#ddd" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Small vent/AC detail below left window */}
        <mesh position={[-4.5, 0.8, -2.05]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.2, 0.6]} />
          <meshStandardMaterial color="#7a8078" />
        </mesh>
      </group>

      {/* Pedestrian Crossing Diamond Sign (in front of Kirsten Wind Tunnel) */}
      <group position={[-8, 0, 12.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Metal Pole */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.4]} />
          <meshStandardMaterial color="#333" metalness={0.7} />
        </mesh>
        {/* Yellow Diamond Sign */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.8, 0.04]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.4} />
        </mesh>
        {/* Black internal border */}
        <mesh position={[0, 2.2, -0.021]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.75, 0.75]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Inner yellow square */}
        <mesh position={[0, 2.2, -0.022]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.72, 0.72]} />
          <meshStandardMaterial color="#ffcc00" />
        </mesh>
        {/* Pedestrian stick figure (abstract) */}
        <group position={[0, 2.2, -0.023]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.2, 0]}><circleGeometry args={[0.06, 16]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 0, 0]}><planeGeometry args={[0.08, 0.3]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[-0.1, -0.05, 0]} rotation={[0, 0, 0.4]}><planeGeometry args={[0.05, 0.25]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0.1, -0.05, 0]} rotation={[0, 0, -0.4]}><planeGeometry args={[0.05, 0.25]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[-0.05, -0.2, 0]} rotation={[0, 0, 0.2]}><planeGeometry args={[0.05, 0.25]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0.05, -0.2, 0]} rotation={[0, 0, -0.2]}><planeGeometry args={[0.05, 0.25]} /><meshStandardMaterial color="#111" /></mesh>
        </group>
      </group>

      {/* Street Furniture (Right side matching reference) */}
      <group position={[11, 0, 11]}>
        {/* Wooden Bench */}
        <group position={[0, 0.4, 0]} rotation={[0, -0.2, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[2, 0.1, 0.5]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, -0.2]}>
            <boxGeometry args={[2, 0.6, 0.1]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
          </mesh>
          <mesh position={[-0.9, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0.9, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>

        {/* Metal Trash Can */}
        <mesh position={[-3, 0.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[-3, 0.85, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.1]} />
          <meshStandardMaterial color="#222" metalness={0.7} />
        </mesh>
      </group>

      {/* Campus Sign (Aerospace & Engineering Research Building style) */}
      <group position={[-3, 0, 12.5]}>
        {/* Two thin metal posts */}
        <mesh position={[-0.65, 0.55, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.1]} />
          <meshStandardMaterial color="#444" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0.65, 0.55, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.1]} />
          <meshStandardMaterial color="#444" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* Dark charcoal sign panel */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.4, 0.7, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
        </mesh>

        {/* Gold UW Block "W" Logo (top-left of sign) */}
        <group position={[-0.52, 0.92, -0.025]}>
          {/* The UW block W: 3 downward strokes forming the W shape */}
          {/* Left outer leg */}
          <mesh position={[-0.06, -0.01, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.022, 0.11, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Left inner leg */}
          <mesh position={[-0.025, -0.01, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.022, 0.11, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Center point (V bottom) */}
          <mesh position={[-0.043, -0.06, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Right inner leg */}
          <mesh position={[0.025, -0.01, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.022, 0.11, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Right outer leg */}
          <mesh position={[0.06, -0.01, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.022, 0.11, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Center point (V bottom right) */}
          <mesh position={[0.043, -0.06, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          {/* Top bar connecting all legs */}
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[0.15, 0.02, 0.008]} />
            <meshStandardMaterial color="#b7a56a" emissive="#b7a56a" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
        </group>

        {/* White text lines (top section - building name) */}
        <mesh position={[-0.05, 0.93, -0.025]}>
          <boxGeometry args={[0.7, 0.03, 0.005]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        <mesh position={[-0.1, 0.88, -0.025]}>
          <boxGeometry args={[0.5, 0.025, 0.005]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>

        {/* Horizontal divider line */}
        <mesh position={[0, 0.82, -0.025]}>
          <boxGeometry args={[1.2, 0.005, 0.005]} />
          <meshStandardMaterial color="#888" />
        </mesh>

        {/* Smaller text lines (bottom section - departments) */}
        <mesh position={[-0.15, 0.74, -0.025]}>
          <boxGeometry args={[0.55, 0.02, 0.005]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[-0.1, 0.7, -0.025]}>
          <boxGeometry args={[0.65, 0.02, 0.005]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[-0.12, 0.66, -0.025]}>
          <boxGeometry args={[0.6, 0.02, 0.005]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        <mesh position={[-0.18, 0.62, -0.025]}>
          <boxGeometry args={[0.45, 0.02, 0.005]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </group>

    </group>
  )
}

export default function BusStop() {
  return (
    <group>
      <Road />

      {/* Overhanging Trees from Reference */}
      <Tree position={[-8, 0, -5]} scale={1.2} />
      <Tree position={[2, 0, -6]} scale={1.5} />
      <Tree position={[10, 0, -4]} scale={1.1} />

      {/* Shrubs & Greenery (camera side of sidewalk) */}
      {/* Behind shelter */}
      <mesh position={[-5, 0.5, -3.5]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#1a4420" roughness={0.9} />
      </mesh>
      <mesh position={[-4.2, 0.4, -4]}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#163a1a" roughness={0.9} />
      </mesh>
      <mesh position={[-6.5, 0.5, -3]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#1e4d26" roughness={0.9} />
      </mesh>
      {/* Right side of shelter */}
      <mesh position={[3, 0.45, -3.5]}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#1a4420" roughness={0.9} />
      </mesh>
      <mesh position={[4.5, 0.5, -4.2]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#163a1a" roughness={0.9} />
      </mesh>
      <mesh position={[6, 0.4, -3]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#1e4d26" roughness={0.9} />
      </mesh>
      {/* Far left along sidewalk */}
      <mesh position={[-10, 0.5, -3.5]}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#1a4420" roughness={0.9} />
      </mesh>
      <mesh position={[-12, 0.45, -4]}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#163a1a" roughness={0.9} />
      </mesh>
      {/* Far right along sidewalk */}
      <mesh position={[8, 0.5, -3.8]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#1e4d26" roughness={0.9} />
      </mesh>
      <mesh position={[12, 0.45, -3.5]}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#1a4420" roughness={0.9} />
      </mesh>
      
      {/* Background Brick Building Suggestion (Discovery Hall) */}
      <mesh position={[0, 4, -15]}>
        <boxGeometry args={[30, 8, 2]} />
        <meshStandardMaterial color="#6b3e2e" roughness={0.9} />
      </mesh>

      {/* --- King County Metro Shelter --- */}
      <group position={[-2, 0.2, -1]}>
        
        {/* Support Pillars (Dark Metal) */}
        {[[-2.4, -0.8], [2.4, -0.8], [-2.4, 0.8], [2.4, 0.8]].map(([x, z], i) => (
          <mesh key={`pillar-${i}`} position={[x, 1.6, z]}>
            <cylinderGeometry args={[0.06, 0.06, 3.2]} />
            <meshStandardMaterial color="#1a2b25" metalness={0.8} />
          </mesh>
        ))}

        {/* Flat Overhanging Roof */}
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[5.2, 0.1, 2.2]} />
          <meshStandardMaterial color="#112" />
        </mesh>

        {/* Ceiling Light Fixture & Beam */}
        <mesh position={[0, 3.1, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05]} />
          <meshStandardMaterial color="#fff" emissive="#ffe4b5" emissiveIntensity={2} />
        </mesh>
        <spotLight position={[0, 3.0, 0]} angle={0.8} penumbra={0.5} intensity={5} color="#ffe4b5" distance={10} castShadow />

        {/* === Tempered Glass Enclosure === */}

        {/* --- Back Wall: 5 glass panels with metal dividers --- */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
          <group key={`back-panel-${i}`}>
            {/* Glass panel */}
            <mesh position={[x, 1.6, -0.8]}>
              <boxGeometry args={[0.85, 3, 0.04]} />
              <meshStandardMaterial color="#aaddee" transparent opacity={0.7} roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Wavy frosted lower portion */}
            <mesh position={[x, 0.7, -0.78]}>
              <planeGeometry args={[0.85, 1.4]} />
              <meshStandardMaterial color="#ddeeff" transparent opacity={0.85} roughness={0.95} />
            </mesh>
            {/* Metal divider frame */}
            <mesh position={[x + 0.44, 1.6, -0.8]}>
              <boxGeometry args={[0.04, 3.1, 0.06]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* --- Left Side Wall: 2 panels --- */}
        {[-0.25, 0.45].map((z, i) => (
          <group key={`left-panel-${i}`}>
            <mesh position={[-2.4, 1.6, z]}>
              <boxGeometry args={[0.04, 3, 0.65]} />
              <meshStandardMaterial color="#aaddee" transparent opacity={0.7} roughness={0.4} metalness={0.3} />
            </mesh>
            <mesh position={[-2.4, 0.7, z]}>
              <planeGeometry args={[0.65, 1.4]} />
              <meshStandardMaterial color="#ddeeff" transparent opacity={0.85} roughness={0.95} />
            </mesh>
            {/* Horizontal divider */}
            <mesh position={[-2.4, 1.6, z + 0.34]}>
              <boxGeometry args={[0.06, 3.1, 0.04]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* --- Right Side Wall: 2 panels --- */}
        {[-0.25, 0.45].map((z, i) => (
          <group key={`right-panel-${i}`}>
            <mesh position={[2.4, 1.6, z]}>
              <boxGeometry args={[0.04, 3, 0.65]} />
              <meshStandardMaterial color="#aaddee" transparent opacity={0.7} roughness={0.4} metalness={0.3} />
            </mesh>
            <mesh position={[2.4, 0.7, z]}>
              <planeGeometry args={[0.65, 1.4]} />
              <meshStandardMaterial color="#ddeeff" transparent opacity={0.85} roughness={0.95} />
            </mesh>
            <mesh position={[2.4, 1.6, z + 0.34]}>
              <boxGeometry args={[0.06, 3.1, 0.04]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* --- Front Wall: center glass, doorways on left & right --- */}
        {/* Center glass panel */}
        <mesh position={[0, 1.6, 0.8]}>
          <boxGeometry args={[1.2, 3, 0.04]} />
          <meshStandardMaterial color="#aaddee" transparent opacity={0.7} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.7, 0.78]}>
          <planeGeometry args={[1.2, 1.4]} />
          <meshStandardMaterial color="#ddeeff" transparent opacity={0.85} roughness={0.95} />
        </mesh>
        {/* Doorway divider frames (left & right of center panel) */}
        <mesh position={[-0.62, 1.6, 0.8]}>
          <boxGeometry args={[0.04, 3.1, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.62, 1.6, 0.8]}>
          <boxGeometry args={[0.04, 3.1, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Top & bottom horizontal frames (all around) */}
        <mesh position={[0, 3.15, 0]}>
          <boxGeometry args={[4.84, 0.04, 1.64]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[4.84, 0.04, 1.64]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Bench */}
        <mesh position={[0, 0.7, -0.5]}>
          <boxGeometry args={[3, 0.08, 0.5]} />
          <meshStandardMaterial color="#3a251a" />
        </mesh>
        {/* Bench Backrest */}
        <mesh position={[0, 1.1, -0.7]}>
          <boxGeometry args={[3, 0.3, 0.05]} />
          <meshStandardMaterial color="#3a251a" />
        </mesh>

        {/* Little Person (Carter) — Seated on Left Side */}
        <group position={[-1.2, 0, -0.5]}>
          {/* Head */}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#e0b090" roughness={0.7} />
          </mesh>
          {/* Torso (Hoodie) */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.35, 0.45, 0.25]} />
            <meshStandardMaterial color="#1a237e" roughness={0.8} />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.08, 0.85, 0.1]}>
            <boxGeometry args={[0.14, 0.35, 0.2]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
          </mesh>
          <mesh position={[0.08, 0.85, 0.1]}>
            <boxGeometry args={[0.14, 0.35, 0.2]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
          </mesh>
          {/* Shoes */}
          <mesh position={[-0.08, 0.65, 0.18]}>
            <boxGeometry args={[0.14, 0.06, 0.12]} />
            <meshStandardMaterial color="#fff" roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 0.65, 0.18]}>
            <boxGeometry args={[0.14, 0.06, 0.12]} />
            <meshStandardMaterial color="#fff" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Trash Can */}
      <mesh position={[1.5, 0.7, -0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 1.2, -0.5]}>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} />
      </mesh>

      {/* Info Kiosk (Right of Shelter) */}
      <group position={[4, 0, -1]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.8, 2, 0.3]} />
          <meshStandardMaterial color="#1a2b25" metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.2, 0.16]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial color="#0a1a0a" emissive="#00e5ff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* UW Lamp Post (Left) */}
      <group position={[-6, 0, -0.5]}>
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 5]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        <mesh position={[0.5, 4.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        <mesh position={[1, 4.7, 0]}>
          <coneGeometry args={[0.3, 0.2, 8, 1, true]} />
          <meshStandardMaterial color="#111" side={2} />
        </mesh>
        <pointLight position={[1, 4.5, 0]} intensity={3} color="#ffe4b5" distance={20} />
        <mesh position={[0.4, 3, 0]}>
          <planeGeometry args={[0.6, 1.5]} />
          <meshStandardMaterial color="#4b2e83" emissive="#4b2e83" emissiveIntensity={0.5} side={2} />
        </mesh>
      </group>

      {/* Extra cinematic light hitting puddle */}
      <pointLight position={[4, 5, 3]} intensity={1} color="#00e5ff" distance={15} />

    </group>
  )
}
