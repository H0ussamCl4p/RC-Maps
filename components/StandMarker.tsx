// @ts-nocheck
'use client'

import { Float, Html, Outlines } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export type Stand = {
  id: number | string
  name: string
  position: [number, number, number]
  color: string
  /** Optional availability flag. If false, renders a smaller square to indicate not available. */
  available?: boolean
  /** Optional outer size (width, depth) in meters for the tile/space. */
  sizeMeters?: [number, number]
  /** Optional inner unavailable rectangle size (width, depth) in meters. */
  unavailableInnerMeters?: [number, number]
}

interface Props {
  stand: Stand
}

export default function StandMarker({ stand }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const tRef = useRef(0)
  const isUnavailable = stand.available === false

  // Scale factor to convert meters to scene units. With 0.02, 20m -> 0.4 units (matches previous default tile size).
  const metersToUnits = 0.02
  const outerWidth = (stand.sizeMeters?.[0] ?? 20) * metersToUnits // default 20m -> 0.4u
  const outerDepth = (stand.sizeMeters?.[1] ?? 20) * metersToUnits // default 20m -> 0.4u (square if not specified)
  const innerWidth = (stand.unavailableInnerMeters?.[0] ?? 13) * metersToUnits // sensible default smaller than outer
  const innerDepth = (stand.unavailableInnerMeters?.[1] ?? 13) * metersToUnits

  useFrame((_, delta) => {
    tRef.current += delta
    // Pulsing 0..1
    const pulse = 0.5 + Math.sin(tRef.current * 2) * 0.5

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      if (mat) {
        const baseColor = isUnavailable ? '#94a3b8' : stand.color
        mat.emissive = new THREE.Color(baseColor)
        mat.emissiveIntensity = isUnavailable ? 0.15 : 0.25 + pulse * 0.6
      }
      if (isUnavailable) {
        meshRef.current.scale.set(1, 1, 1)
      } else {
        const s = 1 + pulse * 0.03
        meshRef.current.scale.set(s, s, s)
      }
    }
  })

  return (
    <group position={stand.position}>
      {/* Float handles subtle up-down bobbing and a small rotation sway */}
      <Float floatIntensity={isUnavailable ? 0.15 : 0.3} speed={isUnavailable ? 1 : 1.5} rotationIntensity={0.08}>
        {/* Wrap meshes in a group so hover/click work across both parts */}
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation()
            setHovered(false)
          }}
        >
          {/* Outer tile (can be rectangular). Thickness is thin plate. */}
          <mesh ref={meshRef} castShadow>
            {/* 3D cube for available stands, flat tile for unavailable (main hall) */}
            <boxGeometry args={[outerWidth, isUnavailable ? 0.06 : outerWidth * 0.5, outerDepth]} />
            <meshStandardMaterial color={isUnavailable ? stand.color : stand.color} roughness={isUnavailable ? 0.6 : 0.4} metalness={0.08} />
            {!isUnavailable && (
              <Outlines thickness={2} color={stand.color} transparent visible={hovered} />
            )}
          </mesh>

          {/* Inner small square for unavailable stands: centered and slightly raised */}
          {isUnavailable && (
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
              {/* Center rectangle indicating unavailable; size derived from meters */}
              <boxGeometry args={[innerWidth, 0.03, innerDepth]} />
              {/* Light greenish-white color - very bright and clear */}
              <meshStandardMaterial 
                color={'#f6fff8'} 
                roughness={0.2} 
                metalness={0} 
                emissive={'#f6fff8'} 
                emissiveIntensity={0.4}
              />
            </mesh>
          )}
        </group>

        {/* Tooltip shown on hover */}
        {hovered && (
          <Html position={[0, 0.5, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-slate-800 shadow-md ring-1 ring-black/5">
              {stand.name}{isUnavailable ? ' (Unavailable)' : ''}
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}
