import { Canvas } from '@react-three/fiber';
import { Float, BakeShadows, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function HeroShape() {
  return (
    <PresentationControls 
      global 
      rotation={[0.13, 0.1, 0]} 
      polar={[-0.4, 0.2]} 
      azimuth={[-1, 0.75]} 
    >
      <Float rotationIntensity={0.4}>
        <mesh position={[0, 0, 0]} castShadow>
          <icosahedronGeometry args={[2, 1]} />
          {/* Matte Plastic Material */}
          <meshStandardMaterial 
            color="#E94560" 
            roughness={0.8} 
            metalness={0.2} 
          />
        </mesh>
        
        {/* Floating companion shapes */}
        <mesh position={[2.5, 1.5, -1]} rotation={[Math.PI / 4, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#FF6B8A" roughness={0.9} metalness={0.1} />
        </mesh>
        
        <mesh position={[-2, -1.5, 1]} castShadow>
          <torusGeometry args={[0.6, 0.2, 32, 64]} />
          <meshStandardMaterial color="#14080C" roughness={1.0} metalness={0.0} emissive="#3D0A1A" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </PresentationControls>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-70 pointer-events-auto md:pointer-events-none md:[&_canvas]:pointer-events-auto">
      <Canvas 
        frameloop="demand" 
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF6B8A" />
        
        <HeroShape />

        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
        <BakeShadows />
      </Canvas>
    </div>
  );
}
