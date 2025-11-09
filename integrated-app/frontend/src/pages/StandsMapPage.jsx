import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import axios from 'axios';

// Stand Marker Component
function StandMarker({ stand }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={stand.position}>
      {/* Stand Box */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.6, 0.8, 0.6]} />
        <meshStandardMaterial
          color={stand.club ? '#10b981' : stand.color}
          emissive={stand.club ? '#10b981' : stand.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Stand Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {stand.name}
      </Text>

      {/* Club Name (if assigned) */}
      {stand.club && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {stand.club.name}
        </Text>
      )}

      {/* Hover Info */}
      {hovered && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.15}
          color="yellow"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {stand.club ? `${stand.club.name} - ${stand.sizeMeters[0]}m²` : `${stand.sizeMeters[0]}m²`}
        </Text>
      )}
    </group>
  );
}

// Ground Plane Component
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#1e293b" opacity={0.8} transparent />
    </mesh>
  );
}

// Main Scene Component
function Scene({ stands }) {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#3b82f6" />

      {/* Ground */}
      <Ground />

      {/* Center Platform */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.3, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Stands */}
      {stands.map((stand) => (
        <StandMarker key={stand.id} stand={stand} />
      ))}

      {/* Center Title */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        fontWeight="bold"
      >
        ENSAM EVENT
      </Text>

      {/* Grid Helper */}
      <gridHelper args={[15, 15, '#334155', '#1e293b']} position={[0, -0.49, 0]} />
    </>
  );
}

function StandsMapPage() {
  const navigate = useNavigate();
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stands');
      setStands(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stands:', err);
      setError('Failed to load stands configuration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white">3D Stand Locations</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3D Canvas */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 140px)' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-base sm:text-lg">Loading 3D Map...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 p-4">
            <div className="bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg max-w-md">
              <p className="text-sm sm:text-lg font-semibold">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <Canvas shadows>
            <Scene stands={stands} />
          </Canvas>
        )}
      </div>

      {/* Controls Info */}
      <div className="bg-gray-800 border-t border-gray-700 py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-8 text-xs sm:text-sm text-gray-400">
            <span className="whitespace-nowrap">🖱️ Drag: Rotate</span>
            <span className="whitespace-nowrap">⚙️ Scroll: Zoom</span>
            <span className="hidden sm:inline whitespace-nowrap">✋ Right: Pan</span>
            <span className="whitespace-nowrap">👆 Hover: Info</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StandsMapPage;
