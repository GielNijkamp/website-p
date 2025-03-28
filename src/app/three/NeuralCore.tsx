// app/three/NeuralCore.tsx
'use client'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { useRef, useMemo, useLayoutEffect, useEffect } from 'react'
import * as THREE from 'three'
import { Line, LineSegments } from 'three'

extend({ Line, LineSegments })

type Signal = {
  path: THREE.Vector3[]
  currentSegment: number
  progress: number
  speed: number
  life: number
  scale: number
}

type Beam = {
  start: THREE.Vector3
  end: THREE.Vector3
  alpha: number
}

const MAX_BEAMS = 100

function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null!)
  const icosahedron = useMemo(() => new THREE.IcosahedronGeometry(80, 2), [])
  const vertices = icosahedron.attributes.position.array as Float32Array
  const particleCount = icosahedron.attributes.position.count

  // Main particles
  const particlesRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const basePositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < particleCount; i++) {
      positions.push(new THREE.Vector3(
        vertices[i * 3],
        vertices[i * 3 + 1],
        vertices[i * 3 + 2]
      ))
    }
    return positions
  }, [vertices, particleCount])

  // Signal particles
  const signalMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      intensity: { value: 1.0 }
    },
    vertexShader: `
      varying float vLife;
      varying vec3 vPosition;
      void main() {
        vLife = instanceMatrix[3][3];
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float intensity;
      varying float vLife;
      void main() {
        float pulse = sin(vLife * 20.0 + time * 5.0) * 0.5 + 0.5;
        vec3 color = vec3(1.0, 0.2, 0.2) * intensity * (1.0 + pulse * 0.5);
        float alpha = smoothstep(0.0, 0.2, vLife) * smoothstep(1.0, 0.8, vLife);
        gl_FragColor = vec4(color, alpha * 1.2);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  }), [])
  const signalParticlesRef = useRef<THREE.InstancedMesh>(null!)
  const signalQueue = useRef<Signal[]>([])

  // Beams
  const beamGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_BEAMS * 3 * 2)
    const alphas = new Float32Array(MAX_BEAMS * 2)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
    return geometry
  }, [])
  const beamMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xffff00) }
    },
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      void main() {
        float glow = smoothstep(0.3, 1.0, 1.0 - length(gl_PointCoord.xy - vec2(0.5)) * 1.0);
        gl_FragColor = vec4(color, vAlpha * glow * 0.9);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), [])
  const beamsRef = useRef<THREE.LineSegments>(null)
  const activeBeams = useRef<Beam[]>([])

  // Connections
  const connectionMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pulseSpeed: { value: 2.0 },
      glowIntensity: { value: 2.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float pulseSpeed;
      uniform float glowIntensity;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float pulse = sin(time * pulseSpeed + length(vPosition) * 2.0) * 0.5 + 0.5;
        vec3 color = vec3(1.0, 0.9, 0.3) * glowIntensity * pulse;
        float alpha = (sin((vUv.x * 20.0 - time * 3.0)) + 1.0) * 0.3 * (1.0 - vUv.x);
        gl_FragColor = vec4(color, alpha * 0.9);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), [])
  const connections = useMemo(() => {
    const maxConnections = Math.floor(particleCount * 0.85)
    return Array.from({ length: maxConnections }).map((_, i) => {
      const start = basePositions[i % particleCount]
      const end = basePositions[(i + Math.floor(Math.random() * 5) + 1) % particleCount]
      return { start, end }
    })
  }, [basePositions, particleCount])
  const connectionRefs = useRef<(THREE.Line | null)[]>([])

  useLayoutEffect(() => {
    // Initialize main particles
    for (let i = 0; i < particleCount; i++) {
      dummy.position.copy(basePositions[i])
      dummy.updateMatrix()
      particlesRef.current.setMatrixAt(i, dummy.matrix)
    }
    particlesRef.current.instanceMatrix.needsUpdate = true
  }, [basePositions, dummy, particleCount])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Update materials
    signalMaterial.uniforms.time.value = time
    signalMaterial.uniforms.intensity.value = 1.0 + Math.sin(time * 10) * 0.5
    beamMaterial.uniforms.time.value = time
    connectionMaterial.uniforms.time.value = time
    connectionMaterial.uniforms.glowIntensity.value = 2.0 + Math.sin(time * 2) * 0.5

    // Generate new signals
    if (time - (signalQueue.current[0]?.life ?? 0) > 0.1) {
      const newSignal = createSignal(basePositions, particleCount)
      signalQueue.current.push(newSignal)
    }

    // Update signals
    activeBeams.current = []
    signalQueue.current.forEach((signal, idx) => {
      signal.progress += signal.speed
      const startPos = signal.path[signal.currentSegment]
      const endPos = signal.path[signal.currentSegment + 1]
      const currentPos = startPos.clone().lerp(endPos, signal.progress)

      // Add beams
      for (let i = 0; i <= signal.currentSegment; i++) {
        activeBeams.current.push({
          start: signal.path[i],
          end: i === signal.currentSegment ? currentPos : signal.path[i + 1],
          alpha: signal.life * (1 - i / signal.path.length)
        })
      }

      // Update signal particle
      dummy.position.copy(currentPos)
      dummy.scale.setScalar(signal.scale)
      dummy.updateMatrix()
      signalParticlesRef.current.setMatrixAt(idx, dummy.matrix)

      // Check path progress
      if (signal.progress >= 1.0) {
        signal.currentSegment++
        signal.progress = 0
        if (signal.currentSegment >= signal.path.length - 1) {
          signalQueue.current.splice(idx, 1)
        }
      }
      signal.life -= 0.005
    })
    signalParticlesRef.current.instanceMatrix.needsUpdate = true

    // Update beams
    const positionAttr = beamGeometry.attributes.position as THREE.BufferAttribute
    const alphaAttr = beamGeometry.attributes.alpha as THREE.BufferAttribute
    activeBeams.current.forEach((beam, i) => {
      const offset = i * 6
      positionAttr.array[offset] = beam.start.x
      positionAttr.array[offset + 1] = beam.start.y
      positionAttr.array[offset + 2] = beam.start.z
      positionAttr.array[offset + 3] = beam.end.x
      positionAttr.array[offset + 4] = beam.end.y
      positionAttr.array[offset + 5] = beam.end.z
      alphaAttr.array[i * 2] = beam.alpha
      alphaAttr.array[i * 2 + 1] = beam.alpha
    })
    positionAttr.needsUpdate = true
    alphaAttr.needsUpdate = true
    if (beamsRef.current) {
      beamsRef.current.geometry.setDrawRange(0, activeBeams.current.length * 2)
    }

    // Update connections visibility
    const visibleCount = Math.floor(connections.length * (0.5 + Math.sin(time * 1.2) * 0.5))
    connectionRefs.current.forEach((conn, idx) => {
      if (conn) conn.visible = idx < visibleCount
    })

    // Rotation
    groupRef.current.rotation.x += 0.0005 * Math.sin(time * 0.1)
    groupRef.current.rotation.y += 0.0005 * Math.cos(time * 0.1)
    groupRef.current.rotation.z += 0.0003 * Math.sin(time * 0.1)
  })

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={particlesRef}
        args={[new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshBasicMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending
        }), particleCount]}
      />
      <instancedMesh
        ref={signalParticlesRef}
        args={[new THREE.SphereGeometry(1.2, 32, 32), signalMaterial, 150]}
      />
      <lineSegments ref={beamsRef} geometry={beamGeometry} material={beamMaterial} />
      <group>
        {connections.map(({ start, end }, idx) => (
            <line
              key={idx}
              ref={el => (connectionRefs.current[idx] = el)}
              geometry={new THREE.BufferGeometry().setFromPoints([start, end])}
              material={connectionMaterial}
            />
        ))}
      </group>
    </group>
  )
}

function createSignal(basePositions: THREE.Vector3[], particleCount: number): Signal {
  const startIdx = Math.floor(Math.random() * particleCount)
  const pathLength = Math.floor(Math.random() * 5) + 3
  const path = [basePositions[startIdx]]
  let currentIdx = startIdx
  for (let i = 1; i < pathLength; i++) {
    currentIdx = (currentIdx + Math.floor(Math.random() * 5) + 1) % particleCount
    path.push(basePositions[currentIdx])
  }
  return {
    path,
    currentSegment: 0,
    progress: 0,
    speed: 0.01 + Math.random() * 0.02,
    life: 1.0,
    scale: 0.8 + Math.random() * 1.2
  }
}

export default function NeuralScene() {
  return (
    <Canvas camera={{ position: [0, 0, 250], fov: 75 }} style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={['#0e0e1a']} />
      <NeuralCore />
    </Canvas>
  )
}