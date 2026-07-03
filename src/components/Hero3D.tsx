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
            color="#8B5CF6" 
            roughness={0.8} 
            metalness={0.2} 
          />
        </mesh>
        
        {/* Floating companion shapes */}
        <mesh position={[2.5, 1.5, -1]} rotation={[Math.PI / 4, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#22D3EE" roughness={0.9} metalness={0.1} />
        </mesh>
        
        <mesh position={[-2, -1.5, 1]} castShadow>
          <torusGeometry args={[0.6, 0.2, 32, 64]} />
          <meshStandardMaterial color="#0C0918" roughness={1.0} metalness={0.0} emissive="#4C1D95" emissiveIntensity={0.6} />
        </mesh>
      </Float>
    </PresentationControls>
  );
}

export default function Hero3D() {
  if (typeof window === 'undefined') {
    return (
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none flex items-center justify-center">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 animate-pulse" />
          <div className="absolute w-48 h-48 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-32 h-32 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    );
  }

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
        <pointLight position={[-10, -10, -10]} intensity={1} color="#22D3EE" />
        
        <HeroShape />

        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#000000" />
        <BakeShadows />
      </Canvas>
    </div>
  );
}
