// @ts-nocheck
'use client'

// Temporary JSX intrinsic elements declaration for three.js tags to satisfy TypeScript in some setups.
// If you prefer stricter typing, replace this with a proper R3F JSX augmentation file.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any
      mesh: any
      planeGeometry: any
      boxGeometry: any
      meshStandardMaterial: any
      ambientLight: any
      directionalLight: any
    }
  }
}

import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import StandMarker, { type Stand } from '@/components/StandMarker'
import * as THREE from 'three'
import { useMemo, useEffect, useState } from 'react'
import { siteConfig } from '@/config/siteConfig'

export default function Page() {
  // Auto-detect screen size
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Adaptive camera settings based on device
  const cameraSettings = useMemo(() => {
    if (isMobile) {
      return { position: [8, 8, 10] as [number, number, number], fov: 60 }
    } else if (isTablet) {
      return { position: [7, 7, 9] as [number, number, number], fov: 55 }
    }
    return { position: siteConfig.scene.cameraPosition, fov: siteConfig.scene.cameraFov }
  }, [isMobile, isTablet])

  // Stands data. Add more by pushing new objects with id, name, position [x,y,z], color, and formUrl.
  // Tip: y is the height above the ground plane (keep small, e.g., 0.05). x and z place the stand on the map plane.
  const stands: Stand[] = useMemo(() => [
    {
      id: 1,
      name: 'Main Hall',
      position: [0, 0.05, 0],
      color: '#cce3de',  // Soft sage-green main square border
      available: false, // Unavailable area in center
      sizeMeters: [400, 300],  // 400m × 300m outer dimensions
      unavailableInnerMeters: [320, 220],  // 320m × 220m inner unavailable area
    },
    // Top border (outside) - 2 stands (T1 and T2 on outer line)
    {
      id: 2,
      name: 'S1',
      position: [-2.5, 0, -3.5],  // Outside top, left side (z=0, on ground)
      color: '#3b82f6',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 3,
      name: 'S2',
      position: [2.5, 0, -3.5],  // Outside top, right side (z=0, on ground)
      color: '#3b82f6',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Conference room (behind T1 and T2)
    {
      id: 19,
      name: 'Salle conférence',
      position: [0, 0, -5.5],  // Behind T1 and T2 (z=0, on ground)
      color: '#8b5cf6',
      available: false,  // Not available as a stand
      sizeMeters: [200, 60],  // Wide rectangle: 200m × 60m
    },
    // Left border (outside) - 2 stands
    {
      id: 6,
      name: 'S3',
      position: [-4.5, 0, -1.5],  // Outside left, top (z=0, on ground)
      color: '#ef4444',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 7,
      name: 'S4',
      position: [-4.5, 0, 1.5],  // Outside left, bottom (z=0, on ground)
      color: '#ef4444',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Right border (outside) - 2 stands
    {
      id: 8,
      name: 'S5',
      position: [4.5, 0, -1.5],  // Outside right, top (z=0, on ground)
      color: '#f59e0b',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 9,
      name: 'S6',
      position: [4.5, 0, 1.5],  // Outside right, bottom (z=0, on ground)
      color: '#f59e0b',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Top inner border - 2 stands (IT1 and IT2 on inner line, parallel to T1 and T2)
    {
      id: 10,
      name: 'S7',
      position: [-2.5, 0, -2.3],  // Inner top border (available space), left (z=0, on ground) - parallel to T1
      color: '#06b6d4',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 11,
      name: 'S8',
      position: [2.5, 0, -2.3],  // Inner top border (available space), right (z=0, on ground) - parallel to T2
      color: '#06b6d4',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Bottom inner border - 3 stands
    {
      id: 12,
      name: 'S9',
      position: [-2.5, 0, 2.3],  // Inner bottom border (available space), left (z=0, on ground)
      color: '#ec4899',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 18,
      name: 'S10',
      position: [0, 0, 2.3],  // Inner bottom border center, between IB1 and IB2
      color: '#ec4899',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 13,
      name: 'S11',
      position: [2.5, 0, 2.3],  // Inner bottom border (available space), right (z=0, on ground)
      color: '#ec4899',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Left inner border - 2 stands
    {
      id: 14,
      name: 'S12',
      position: [-3.5, 0, -1],  // Inner left border (available space), top (z=0, on ground)
      color: '#84cc16',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 15,
      name: 'S13',
      position: [-3.5, 0, 1],  // Inner left border (available space), bottom (z=0, on ground)
      color: '#84cc16',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    // Right inner border - 2 stands
    {
      id: 16,
      name: 'S14',
      position: [3.5, 0, -1],  // Inner right border (available space), top (z=0, on ground)
      color: '#f97316',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
    {
      id: 17,
      name: 'S15',
      position: [3.5, 0, 1],  // Inner right border (available space), bottom (z=0, on ground)
      color: '#f97316',
      available: true,
      sizeMeters: [36, 36],  // 36m × 36m cube (doubled)
    },
  ], [])

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header / Title */}
      <header className="sticky top-0 z-20 w-full border-b border-white/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-3 sm:py-4 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base lg:text-xl font-bold text-white drop-shadow-md truncate">{siteConfig.header.title}</h1>
              <p className="text-xs sm:text-sm text-emerald-50/90 truncate hidden sm:block">{siteConfig.header.subtitle}</p>
            </div>
          </div>
          {!isMobile && (
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white/20 px-3 lg:px-4 py-2 backdrop-blur-sm flex-shrink-0">
              <svg className="h-4 w-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-white whitespace-nowrap">Survolez pour voir les détails</span>
            </div>
          )}
        </div>
      </header>

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8 lg:grid-cols-4">
        {/* 3D Canvas area */}
        <section className="group relative col-span-1 h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-xl sm:rounded-2xl glass-effect transition-all duration-300 hover:shadow-3xl lg:col-span-3 lg:min-h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Canvas
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            shadows
            camera={{ position: cameraSettings.position, fov: cameraSettings.fov, near: 0.1, far: 100 }}
          >
            {/* Keep canvas transparent so the soft CSS gradient shows behind */}
            {/* Lights */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[6, 10, 6]} intensity={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

            {/* Ground plane to represent the map (flat). Replace with a texture if desired. */}
            <group position={[0, 0, 0]}>
              {/* Subtle grid helper for orientation */}
              <Grid
                position={[0, -0.0005, 0]}
                args={[20, 20]}
                cellSize={0.5}
                sectionSize={3}
                cellColor="#cbd5e1"
                sectionColor="#94a3b8"
                fadeDistance={30}
                fadeStrength={5}
                infiniteGrid
              />
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 14]} />
                <meshStandardMaterial color="#f1f5f9" side={THREE.DoubleSide} />
              </mesh>
            </group>

            {/* Stand markers */}
            {stands.map((s) => (
              <StandMarker key={s.id} stand={s} />
            ))}

            {/* Camera controls */}
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              minDistance={isMobile ? 4 : 3}
              maxDistance={isMobile ? 25 : 30}
              maxPolarAngle={Math.PI / 2.05}
              enablePan={!isMobile}
              rotateSpeed={isMobile ? 0.5 : 1}
              zoomSpeed={isMobile ? 0.5 : 1}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
          </Canvas>
        </section>

        {/* Legend */}
        <aside className="col-span-1 space-y-4 sm:space-y-6">
          {/* Stands Section */}
          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">{siteConfig.legend.standsTitle}</h2>
              <div className="ml-auto rounded-full bg-emerald-100 px-2 sm:px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {stands.filter((s) => s.available !== false).length}
              </div>
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {stands.filter((s) => s.available !== false).map((s) => (
                <li key={s.id} className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg p-1.5 sm:p-2 transition-all duration-200 hover:bg-white/80">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <span 
                        className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-md shadow-sm transition-transform duration-200 group-hover:scale-110" 
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="absolute -inset-1 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: `${s.color}40`, filter: 'blur(4px)' }} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-emerald-600 truncate">{s.name}</span>
                  </div>
                  {siteConfig.general.showStandIds && (
                    <span className="rounded-full bg-slate-100 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-slate-600 transition-all duration-200 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex-shrink-0">#{s.id}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Unavailable Section */}
          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500"></div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">{siteConfig.legend.unavailableTitle}</h2>
              <div className="ml-auto rounded-full bg-amber-100 px-2 sm:px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                {stands.filter((s) => s.available === false).length}
              </div>
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {stands.filter((s) => s.available === false).map((s) => (
                <li key={s.id} className="group flex items-center justify-between gap-2 sm:gap-3 rounded-lg p-1.5 sm:p-2 transition-all duration-200 hover:bg-white/80">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <span
                        className="relative inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-md transition-transform duration-200 group-hover:scale-110"
                        style={{ border: `2px solid ${s.color}` }}
                        title="Unavailable"
                      >
                        <span className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 sm:h-2 sm:w-2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-slate-200" />
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-amber-600 truncate">{s.name}</span>
                  </div>
                  {siteConfig.general.showStandIds && (
                    <span className="rounded-full bg-slate-100 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-slate-600 transition-all duration-200 group-hover:bg-amber-100 group-hover:text-amber-700 flex-shrink-0">#{s.id}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="mt-auto border-t border-white/30 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-sm text-slate-300">{siteConfig.footer.text}</p>
        </div>
      </footer>
    </main>
  )
}
