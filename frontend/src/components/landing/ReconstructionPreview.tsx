import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box, Layers, RotateCcw, ZoomIn, Move } from 'lucide-react';

interface ReconstructionPreviewProps {
  onExplore3DDemo?: () => void;
}

export const ReconstructionPreview: React.FC<ReconstructionPreviewProps> = ({ onExplore3DDemo }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState({
    buildings: true,
    terrain: true,
    roads: true,
    vegetation: true,
  });
  const [isRotating, setIsRotating] = useState(true);

  // References for camera reset / controls
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070E1A);
    scene.fog = new THREE.FogExp2(0x070E1A, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(45, 38, 55);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Grid Floor
    const grid = new THREE.GridHelper(80, 32, 0x193450, 0x0f2136);
    grid.position.y = -0.05;
    scene.add(grid);

    // Terrain Mesh (TIN simulation)
    const terrainGeo = new THREE.PlaneGeometry(70, 70, 32, 32);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const elev = Math.sin(vx * 0.08) * Math.cos(vz * 0.08) * 1.8 + Math.sin(vx * 0.15) * 0.5;
      pos.setY(i, elev);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0E192A,
      roughness: 0.8,
      metalness: 0.15,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // Water body on side
    const waterGeo = new THREE.PlaneGeometry(24, 68);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(24, 0.1, 0);
    scene.add(waterMesh);

    // Roads (Vector surface simulation)
    const roadsGroup = new THREE.Group();
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x1E293B });
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(60, 4), roadMat);
    road1.rotateX(-Math.PI / 2);
    road1.position.set(-4, 0.15, -4);
    roadsGroup.add(road1);

    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(4, 60), roadMat);
    road2.rotateX(-Math.PI / 2);
    road2.position.set(-6, 0.15, 0);
    roadsGroup.add(road2);
    scene.add(roadsGroup);

    // Extruded Building Geometry Group
    const buildingsGroup = new THREE.Group();
    const buildingDefs = [
      { x: -16, z: -14, w: 9, d: 8, h: 18, color: 0x00C8FF },
      { x: -14, z: 2, w: 8, d: 8, h: 12, color: 0x22D3EE },
      { x: 4, z: -14, w: 12, d: 10, h: 26, color: 0x1677FF },
      { x: 4, z: 6, w: 9, d: 9, h: 10, color: 0x38BDF8 },
      { x: -16, z: 16, w: 11, d: 9, h: 15, color: 0x0EA5E9 },
      { x: 4, z: 20, w: 8, d: 8, h: 14, color: 0x00C8FF },
    ];

    buildingDefs.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      geo.translate(0, b.h / 2, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.25,
        metalness: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, 0.2, b.z);
      buildingsGroup.add(mesh);

      // Edge outlines
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x22D3EE, opacity: 0.7, transparent: true }));
      line.position.copy(mesh.position);
      buildingsGroup.add(line);
    });
    scene.add(buildingsGroup);

    // Vegetation Clusters
    const vegGroup = new THREE.Group();
    const vegMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.9 });
    for (let i = 0; i < 18; i++) {
      const vx = -25 + (i * 2.8);
      const vz = -24 + (i % 5) * 10;
      const tree = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.5, 6), vegMat);
      tree.position.set(vx, 1.75, vz);
      vegGroup.add(tree);
    }
    scene.add(vegGroup);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);
    const sun = new THREE.DirectionalLight(0x00C8FF, 1.6);
    sun.position.set(30, 60, 40);
    scene.add(sun);

    // Simple mouse drag orbit controls
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngle = 0.8;
    let cameraRadius = 75;
    let cameraY = 40;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsRotating(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraAngle -= deltaX * 0.008;
      cameraY = Math.max(10, Math.min(80, cameraY - deltaY * 0.2));
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isMouseDown) {
        cameraAngle += delta * 0.12;
      }

      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.position.y = cameraY;
      camera.lookAt(0, 5, 0);

      // Layer visibilities
      buildingsGroup.visible = layers.buildings;
      terrainMesh.visible = layers.terrain;
      roadsGroup.visible = layers.roads;
      vegGroup.visible = layers.vegetation;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!currentMount || !renderer) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [layers, isRotating]);

  const handleResetCamera = () => {
    setIsRotating(true);
  };

  const handleExploreClick = () => {
    handleResetCamera();
    if (onExplore3DDemo) {
      onExplore3DDemo();
    } else {
      const el = document.getElementById('reconstruction');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="reconstruction" className="py-20 bg-[#050B14] relative border-t border-[#193450]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtext */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0A1220] border border-[#193450] text-[#00C8FF] text-xs font-mono mb-3">
              <span>VOLUMETRIC RECONSTRUCTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Reconstruct the Scene in 3D
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#94A3B8]">
              Interactive 3D geometry combining extruded building footprints, terrain surfaces, road vectors, and natural features.
            </p>
          </div>

          {/* Button 5: Explore 3D Demo (from Section 21 Complete Button Inventory) */}
          <button
            type="button"
            onClick={handleExploreClick}
            className="dw-btn-primary px-5 py-3 rounded-lg text-sm group shrink-0"
            aria-label="Explore 3D Demo"
          >
            <span>Explore 3D Demo</span>
            <Box className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Large 3D Visualization Container */}
        <div className="relative w-full h-[540px] sm:h-[600px] rounded-2xl overflow-hidden bg-[#0A1220] border border-[#193450] shadow-2xl dw-corner-tl dw-corner-br">
          
          {/* Three.js Canvas Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Controls Shown Visually: Orbit, Zoom, Pan, Reset */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#0A1220]/90 backdrop-blur-md border border-[#193450] p-1.5 rounded-lg text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0E192A] text-[#F8FAFC]">
              <RotateCcw className="w-3.5 h-3.5 text-[#00C8FF]" strokeWidth={1.75} />
              <span>Orbit</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0E192A]">
              <ZoomIn className="w-3.5 h-3.5 text-[#00C8FF]" strokeWidth={1.75} />
              <span>Zoom</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0E192A]">
              <Move className="w-3.5 h-3.5 text-[#00C8FF]" strokeWidth={1.75} />
              <span>Pan</span>
            </div>
            <button
              onClick={handleResetCamera}
              className="px-2 py-1 rounded bg-[#0E192A] text-[#22D3EE] hover:bg-[#193450] transition-colors"
              title="Reset camera position"
            >
              Reset
            </button>
          </div>

          {/* Layer Panel Overlay (Buildings, Terrain, Roads, Vegetation) */}
          <div className="absolute top-4 right-4 z-20 bg-[#0A1220]/95 backdrop-blur-md border border-[#193450] p-3 rounded-xl shadow-xl w-48 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#193450] text-[#F8FAFC]">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00C8FF]" strokeWidth={1.75} />
                <span className="font-semibold">Scene Layers</span>
              </span>
              <span className="text-[10px] text-[#22D3EE]">LOD2</span>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#0E192A]">
                <span className="text-[#F8FAFC]">Buildings</span>
                <input
                  type="checkbox"
                  checked={layers.buildings}
                  onChange={(e) => setLayers({ ...layers, buildings: e.target.checked })}
                  className="rounded border-[#193450] text-[#00C8FF] focus:ring-0 bg-[#0E192A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#0E192A]">
                <span className="text-[#94A3B8]">Terrain</span>
                <input
                  type="checkbox"
                  checked={layers.terrain}
                  onChange={(e) => setLayers({ ...layers, terrain: e.target.checked })}
                  className="rounded border-[#193450] text-[#00C8FF] focus:ring-0 bg-[#0E192A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#0E192A]">
                <span className="text-[#94A3B8]">Roads</span>
                <input
                  type="checkbox"
                  checked={layers.roads}
                  onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
                  className="rounded border-[#193450] text-[#00C8FF] focus:ring-0 bg-[#0E192A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#0E192A]">
                <span className="text-[#94A3B8]">Vegetation</span>
                <input
                  type="checkbox"
                  checked={layers.vegetation}
                  onChange={(e) => setLayers({ ...layers, vegetation: e.target.checked })}
                  className="rounded border-[#193450] text-[#00C8FF] focus:ring-0 bg-[#0E192A]"
                />
              </label>
            </div>
          </div>

          {/* Bottom HUD Bar */}
          <div className="absolute bottom-0 inset-x-0 z-20 px-4 py-2.5 bg-[#0A1220]/95 border-t border-[#193450] flex flex-wrap items-center justify-between text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center space-x-3">
              <span className="text-[#00C8FF]">GEOMETRY: 1,420 Triangles</span>
              <span>•</span>
              <span>DATUM: WGS84</span>
              <span>•</span>
              <span className="text-[#22D3EE]">ELEVATION EXAGGERATION: 1.0×</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-1 sm:mt-0">
              Interactive 3D Preview (Click & Drag to Orbit)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
