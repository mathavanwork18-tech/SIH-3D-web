import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Activity, Crosshair } from 'lucide-react';

export const HeroVisualization: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 560;
    const height = currentMount.clientHeight || 420;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1220);
    scene.fog = new THREE.FogExp2(0x0a1220, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(38, 42, 54);
    camera.lookAt(0, 4, 0);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      currentMount.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // Grid Floor
    const gridHelper = new THREE.GridHelper(70, 28, 0x193450, 0x0f2136);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Terrain Base Plane
    const terrainGeo = new THREE.PlaneGeometry(64, 64, 32, 32);
    terrainGeo.rotateX(-Math.PI / 2);
    // Subtle elevation displacement
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const elevation = Math.sin(vx * 0.1) * Math.cos(vz * 0.1) * 1.4;
      pos.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0e1b2f,
      roughness: 0.85,
      metalness: 0.2,
      wireframe: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // Subtle terrain wireframe overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x193450,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(terrainGeo, wireframeMat);
    scene.add(wireMesh);

    // Extruded Building Blocks with Scientific Height Coloring
    const buildingsGroup = new THREE.Group();

    const buildingsData = [
      { x: -14, z: -12, w: 9, d: 8, h: 14.5, color: 0x00c8ff },
      { x: -12, z: 2, w: 8, d: 7, h: 9.8, color: 0x22d3ee },
      { x: 3, z: -10, w: 11, d: 9, h: 22.8, color: 0x1677ff },
      { x: 6, z: 4, w: 8, d: 8, h: 7.4, color: 0x38bdf8 },
      { x: -14, z: 14, w: 10, d: 9, h: 11.6, color: 0x0ea5e9 },
      { x: 4, z: 16, w: 9, d: 8, h: 13.2, color: 0x00c8ff },
      { x: 18, z: -8, w: 7, d: 11, h: 8.5, color: 0x22d3ee },
      { x: 18, z: 12, w: 7, d: 9, h: 10.5, color: 0x38bdf8 },
    ];

    buildingsData.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      geo.translate(0, b.h / 2, 0);

      // Building material with height illumination
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: b.color,
        emissiveIntensity: 0.15,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, 0, b.z);
      buildingsGroup.add(mesh);

      // Edge wireframe for architectural CAD precision feel
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.copy(mesh.position);
      buildingsGroup.add(line);
    });

    scene.add(buildingsGroup);

    // Laser Radar / Coordinate Ring
    const ringGeo = new THREE.RingGeometry(24, 24.3, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.2;
    scene.add(ringMesh);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x00c8ff, 1.8);
    dirLight.position.set(30, 50, 40);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 2.5, 90);
    pointLight.position.set(0, 25, 0);
    scene.add(pointLight);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle orbital turntable motion
      const radius = 62;
      const angle = elapsedTime * 0.14;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = 36 + Math.sin(elapsedTime * 0.25) * 4;
      camera.lookAt(0, 5, 0);

      // Rotate radar ring
      ringMesh.rotation.y = elapsedTime * 0.2;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!currentMount || !renderer) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[520px] rounded-xl overflow-hidden bg-[#0A1220] border border-[#193450] shadow-2xl dw-corner-tl dw-corner-br">
      
      {/* Subtle scanning laser line */}
      <div className="dw-scanner-line" aria-hidden="true" />

      {/* Top Header Overlay: GIS Status & Flow */}
      <div className="absolute top-0 inset-x-0 z-30 p-3.5 bg-gradient-to-b from-[#050B14]/90 to-transparent flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00C8FF] animate-pulse" />
          <span className="text-[#F8FAFC] font-semibold tracking-wider">DEPTHWIZARD ENGINE</span>
          <span className="text-[#94A3B8] hidden sm:inline">|</span>
          <span className="text-[#22D3EE] hidden sm:inline">DEMO VISUALIZATION</span>
        </div>

        {/* Visual Flow Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 text-[10px] text-[#94A3B8] bg-[#0E192A]/80 px-2.5 py-1 rounded border border-[#193450]">
          <span className="text-[#F8FAFC]">Satellite</span>
          <span>→</span>
          <span className="text-[#00C8FF]">Depth</span>
          <span>→</span>
          <span className="text-[#22D3EE]">Height</span>
          <span>→</span>
          <span className="text-[#22C55E]">3D</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      {webGlSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Fallback 2D Image Display */
        <div className="w-full h-full relative flex items-center justify-center bg-[#0A1220]">
          <img
            src="/demo/satellite_scene.png"
            alt="Demo Satellite Visualization Preview"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent" />
          <div className="absolute bottom-12 left-4 text-xs font-mono bg-[#0A1220]/90 border border-[#193450] px-3 py-1.5 rounded text-[#F8FAFC]">
            Visualization Preview (2D Fallback Mode)
          </div>
        </div>
      )}

      {/* Floating Scientific Readout Cards (Exactly 4 Cards, Max Allowed 4) */}
      
      {/* Floating Card 1: DEPTH */}
      <div className="absolute top-16 left-4 z-20 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] px-3 py-2 rounded-lg shadow-lg">
        <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider flex items-center justify-between gap-3">
          <span>Depth</span>
          <span className="text-[9px] text-[#22D3EE] font-semibold">DEMO</span>
        </div>
        <div className="text-sm font-mono font-bold text-[#F8FAFC] mt-0.5">
          42.7 m
        </div>
      </div>

      {/* Floating Card 2: HEIGHT */}
      <div className="absolute top-16 right-4 z-20 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] px-3 py-2 rounded-lg shadow-lg">
        <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider flex items-center justify-between gap-3">
          <span>Height</span>
          <span className="text-[9px] text-[#22D3EE] font-semibold">DEMO</span>
        </div>
        <div className="text-sm font-mono font-bold text-[#00C8FF] mt-0.5">
          76.3 m
        </div>
      </div>

      {/* Floating Card 3: CONFIDENCE */}
      <div className="absolute bottom-16 left-4 z-20 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] px-3 py-2 rounded-lg shadow-lg">
        <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider flex items-center justify-between gap-3">
          <span>Confidence</span>
          <span className="text-[9px] text-[#22D3EE] font-semibold">DEMO</span>
        </div>
        <div className="text-sm font-mono font-bold text-[#22C55E] mt-0.5 flex items-center space-x-1">
          <Activity className="w-3.5 h-3.5" />
          <span>92%</span>
        </div>
      </div>

      {/* Floating Card 4: 3D MODEL READY */}
      <div className="absolute bottom-16 right-4 z-20 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] px-3 py-2 rounded-lg shadow-lg">
        <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
          Geometry Status
        </div>
        <div className="text-sm font-mono font-bold text-[#22D3EE] mt-0.5 flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
          <span>3D MODEL READY</span>
        </div>
      </div>

      {/* Bottom Telemetry Bar: Coordinates & CRS */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-4 py-2 bg-[#0A1220]/95 border-t border-[#193450] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <div className="flex items-center space-x-3">
          <Crosshair className="w-3.5 h-3.5 text-[#00C8FF]" />
          <span>LAT: <strong className="text-[#F8FAFC]">11.0168° N</strong></span>
          <span>LON: <strong className="text-[#F8FAFC]">76.9558° E</strong></span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span>CRS: <strong className="text-[#22D3EE]">EPSG:4326</strong></span>
          <span className="px-1.5 py-0.2 rounded bg-[#0E192A] text-[#94A3B8] border border-[#193450]">
            Demo Visualization
          </span>
        </div>
      </div>

    </div>
  );
};
