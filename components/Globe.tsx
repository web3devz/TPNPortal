"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import { countryPositions, latLngToVector3 } from "@/lib/tpn-client"
import LeaseModal from "./LeaseModal"

// Country pin component
function CountryPin({ position, name, code, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pin */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#ff4040" : "#ff8080"} />
      </mesh>

      {/* Label - only show when hovered */}
      {hovered && (
        <Html position={[0, 0.15, 0]} center distanceFactor={10}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {name} ({code})
          </div>
        </Html>
      )}
    </group>
  )
}

// Simplify the Earth component to use a basic color instead of trying to load a texture
function Earth({ onCountrySelect }) {
  const earthRef = useRef()

  // Slow rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group>
      {/* Earth sphere with simple color material */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial color="#1a4275" emissive="#072534" specular="#555555" shininess={30} />
      </mesh>

      {/* Country pins */}
      {Object.entries(countryPositions).map(([code, { lat, lng, name }]) => {
        const [x, y, z] = latLngToVector3(lat, lng, 2.05)
        return (
          <CountryPin key={code} position={[x, y, z]} name={name} code={code} onClick={() => onCountrySelect(code)} />
        )
      })}
    </group>
  )
}

// Update the main Globe component to remove the EarthTexture component
export default function Globe() {
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleCountrySelect = (code) => {
    setSelectedCountry(code)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Earth onCountrySelect={handleCountrySelect} />
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} />
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute top-20 left-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg max-w-xs">
        <h2 className="text-lg font-bold mb-2">TPN Lease Portal</h2>
        <p className="text-sm text-muted-foreground">
          Click on a country pin to create a VPN lease for that region. Rotate the globe by dragging, zoom with scroll.
        </p>
      </div>

      {/* Lease modal */}
      {selectedCountry && (
        <LeaseModal
          country={selectedCountry}
          countryName={countryPositions[selectedCountry]?.name || selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  )
}
