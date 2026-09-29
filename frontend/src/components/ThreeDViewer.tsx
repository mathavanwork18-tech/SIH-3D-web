import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Layers, 
  Ruler, 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  Building, 
  Sliders, 
  CheckCircle2, 
  MapPin 
} from 'lucide-react';
import type { Analysis, DetectedObject, Measurement } from '../types';

interface ThreeDViewerProps {
  analysis: Analysis;
  selectedBuildingId?: string;
  onSelectBuilding?: (building: DetectedObject | null) => void;
  onAddMeasurement?: (measurement: Measurement) => void;
}

export type TextureLayer = 'satellite' | 'depth' | 'elevation' | 'difference' | 'wireframe';

const generateMeasurementId = () => `meas-${Math.random().toString(36).substring(2, 9)}`;

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  analysis,
  selectedBuildingId,
  onSelectBuilding,
  onAddMeasurement
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [activeLayer, setActiveLayer] = useState<TextureLayer>('satellite');
  const [elevationExaggeration, setElevationExaggeration] = useState<number>(1.2);
  const [showBuildings, setShowBuildings] = useState<boolean>(true);
  const [showPointcloud, setShowPointcloud] = useState<boolean>(false);
  const [isFlythroughActive, setIsFlythroughActive] = useState<boolean>(false);
  const [measureMode, setMeasureMode] = useState<'none' | 'distance' | 'height'>('none');
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
  const [hoveredBuilding, setHoveredBuilding] = useState<DetectedObject | null>(null);
  const [inspectedBuilding, setInspectedBuilding] = useState<DetectedObject | null>(null);
  const [cursorCoord, setCursorCoord] = useState<{ x: number; y: number; z: number } | null>(null);
  const [activeMeasurementText, setActiveMeasurementText] = useState<string | null>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainGeoRef = useRef<THREE.PlaneGeometry | null>(null);
  const buildingMeshesRef = useRef<{ mesh: THREE.Mesh; data: DetectedObject; outline: THREE.LineSegments }[]>([]);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const measurementLineRef = useRef<THREE.Line | null>(null);
  const texturesRef = useRef<Record<string, THREE.Texture>>({});
  const animationFrameIdRef = useRef<number | null>(null);
  const flythroughTimeRef = useRef<number>(0);

  // Mouse orbit controls internal state
  const isDraggingRef = useRef<boolean>(false);
  const isPanningRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 380,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2
  });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 0));
  const isFlythroughActiveRef = useRef<boolean>(isFlythroughActive);
  useEffect(() => {
    isFlythroughActiveRef.current = isFlythroughActive;
  }, [isFlythroughActive]);

  // Update camera coordinates from spherical
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const target = cameraTargetRef.current;

    cameraRef.current.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cameraRef.current.lookAt(target);
  };

  // Displace terrain geometry with realistic elevation equation
  const applyElevationDisplacement = (geo: THREE.PlaneGeometry, exaggeration: number) => {
    const pos = geo.attributes.position;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const nx = x / 180.0;
      const nz = z / 180.0;

      let elevM = 14.0 + 8.0 * (1.0 - nz) + 4.0 * Math.sin(nx * 3.5);
      if (nx > 0.65) {
        elevM = 6.0;
      }

      pos.setY(i, elevM * 0.35 * exaggeration);
    }
    geo.computeVertexNormals();
    pos.needsUpdate = true;
  };

  // Build / update 3D Extruded Buildings
  const buildBuildingMeshes = (scene: THREE.Scene, buildings: DetectedObject[], exaggeration: number) => {
    buildingMeshesRef.current.forEach(({ mesh, outline }) => {
      scene.remove(mesh);
      scene.remove(outline);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      outline.geometry.dispose();
    });
    buildingMeshesRef.current = [];

    if (!showBuildings) return;

    const terrainSize = 360;

    buildings.forEach((b) => {
      const [ymin, xmin, ymax, xmax] = b.boundingBox;
      const width = (xmax - xmin) * terrainSize;
      const depth = (ymax - ymin) * terrainSize;
      const height = (b.estimatedHeightM || 30.0) * 0.35 * exaggeration;

      const posX = (xmin + xmax) / 2.0 * terrainSize - terrainSize / 2.0;
      const posZ = (ymin + ymax) / 2.0 * terrainSize - terrainSize / 2.0;
      const baseElev = (b.groundElevationM || 14.0) * 0.35 * exaggeration;
      const posY = baseElev + height / 2.0;

      const geo = new THREE.BoxGeometry(width, height, depth);

      const isSelected = selectedBuildingId === b.id;
      const mat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x00f2fe : 0xcbd5e1,
        metalness: 0.35,
        roughness: 0.3,
        emissive: isSelected ? 0x005577 : 0x051020,
        emissiveIntensity: isSelected ? 0.6 : 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(posX, posY, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      (mesh as any).userData = { buildingData: b };

      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x00f2fe : 0x38bdf8,
        linewidth: isSelected ? 2 : 1
      });
      const outline = new THREE.LineSegments(edges, lineMat);
      outline.position.copy(mesh.position);

      scene.add(mesh);
      scene.add(outline);

      buildingMeshesRef.current.push({ mesh, data: b, outline });
    });
  };

  // Build dense point cloud mode
  const buildPointCloud = (scene: THREE.Scene, terrainSize: number, res: number) => {
    const totalPoints = res * res;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);

    let idx = 0;
    for (let r = 0; r < res; r++) {
      for (let c = 0; c < res; c++) {
        const u = c / (res - 1);
        const v = r / (res - 1);
        const x = (u - 0.5) * terrainSize;
        const z = (v - 0.5) * terrainSize;
        const elev = 14.0 + 35.0 * Math.sin(u * 3) * Math.cos(v * 2) + 20.0 * (1.0 - v);
        const y = elev * 0.4;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const norm = Math.min(1.0, Math.max(0.0, (elev - 12.0) / 60.0));
        colors[idx * 3] = norm * 0.9;
        colors[idx * 3 + 1] = Math.sin(norm * Math.PI) * 0.8 + 0.2;
        colors[idx * 3 + 2] = (1.0 - norm) * 0.9;

        idx++;
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      sizeAttenuation: true
    });

    const pc = new THREE.Points(pGeo, pMat);
    pc.visible = showPointcloud;
    scene.add(pc);
    pointCloudRef.current = pc;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);
    scene.fog = new THREE.FogExp2(0x070b14, 0.0018);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting (Simulating solar illumination for high-angle remote sensing)
    const ambientLight = new THREE.AmbientLight(0xdcf0ff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    sunLight.position.set(250, 450, 200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 50;
    sunLight.shadow.camera.far = 1000;
    const d = 260;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Secondary fill light for shadows
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    fillLight.position.set(-200, 150, -200);
    scene.add(fillLight);

    // 5. Grid Helper & Compass Axes
    const grid = new THREE.GridHelper(480, 24, 0x06b6d4, 0x1e293b);
    grid.position.y = 0.5;
    scene.add(grid);

    // 6. Load Textures
    const textureLoader = new THREE.TextureLoader();
    const loadTex = (url: string, key: string) => {
      textureLoader.load(url, (tex) => {
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        texturesRef.current[key] = tex;
        if (key === activeLayer && terrainMeshRef.current) {
          (terrainMeshRef.current.material as THREE.MeshStandardMaterial).map = tex;
          (terrainMeshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      });
    };

    loadTex(analysis.imageUrl || '/demo/satellite_scene.png', 'satellite');
    loadTex(analysis.depthResult?.visualArtifactUrl || '/demo/depth_relative_heatmap.png', 'depth');
    loadTex(analysis.elevationResult?.visualArtifactUrl || '/demo/elevation_metric_dsm.png', 'elevation');
    loadTex('/demo/elevation_difference_map.png', 'difference');

    // 7. Build Continuous Metric Terrain Plane
    const terrainSize = 360;
    const gridRes = 96;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, gridRes, gridRes);
    geometry.rotateX(-Math.PI / 2);
    terrainGeoRef.current = geometry;

    // Displace vertices according to elevation model
    applyElevationDisplacement(geometry, elevationExaggeration);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.75,
      metalness: 0.1,
      wireframe: activeLayer === 'wireframe'
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 8. Build 3D Extruded Building Models (LOD2)
    buildBuildingMeshes(scene, analysis.detectedObjects || [], elevationExaggeration);

    // 9. Build Elevation Point Cloud
    buildPointCloud(scene, terrainSize, gridRes);

    // 10. Animation Render Loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Automated flythrough orbit if enabled
      if (isFlythroughActiveRef.current) {
        flythroughTimeRef.current += delta * 0.25;
        const angle = flythroughTimeRef.current;
        cameraSphericalRef.current.theta = angle;
        cameraSphericalRef.current.phi = Math.PI / 3.4 + 0.15 * Math.sin(angle * 1.5);
        cameraSphericalRef.current.radius = 360 + 50 * Math.cos(angle * 0.8);
        cameraTargetRef.current.set(
          30 * Math.sin(angle * 0.7),
          20 + 8 * Math.cos(angle),
          30 * Math.cos(angle * 0.7)
        );
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate(performance.now());

    // 11. Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
    };
  }, []);

  // Re-apply exaggeration when slider changes
  useEffect(() => {
    if (terrainGeoRef.current) {
      applyElevationDisplacement(terrainGeoRef.current, elevationExaggeration);
    }
    if (sceneRef.current) {
      buildBuildingMeshes(sceneRef.current, analysis.detectedObjects || [], elevationExaggeration);
    }
  }, [elevationExaggeration, analysis.detectedObjects]);

  // Update material textures when activeLayer changes
  useEffect(() => {
    if (!terrainMeshRef.current) return;
    const mat = terrainMeshRef.current.material as THREE.MeshStandardMaterial;

    if (activeLayer === 'wireframe') {
      mat.wireframe = true;
      mat.map = null;
    } else {
      mat.wireframe = false;
      const tex = texturesRef.current[activeLayer];
      if (tex) {
        mat.map = tex;
      }
    }
    mat.needsUpdate = true;
  }, [activeLayer]);

  // Toggle point cloud visibility
  useEffect(() => {
    if (pointCloudRef.current) {
      pointCloudRef.current.visible = showPointcloud;
    }
  }, [showPointcloud]);

  // Handle selected building prop changes
  useEffect(() => {
    buildingMeshesRef.current.forEach(({ mesh, data, outline }) => {
      const isSelected = selectedBuildingId === data.id;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(isSelected ? 0x00f2fe : 0xcbd5e1);
      mat.emissive.setHex(isSelected ? 0x005577 : 0x051020);
      mat.emissiveIntensity = isSelected ? 0.6 : 0.2;
      (outline.material as THREE.LineBasicMaterial).color.setHex(isSelected ? 0x00f2fe : 0x38bdf8);
      
      if (isSelected) {
        setInspectedBuilding(data);
      }
    });
  }, [selectedBuildingId]);

  // Mouse & Touch Interaction Handlers (Raycasting, Orbit, Pan, Measure)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) { // Left click
      isDraggingRef.current = true;
    } else if (e.button === 2) { // Right click pan
      isPanningRef.current = true;
    }
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (isDraggingRef.current) {
      // Orbit rotation
      cameraSphericalRef.current.theta -= deltaX * 0.005;
      cameraSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - deltaY * 0.005)
      );
      updateCameraPosition();
    } else if (isPanningRef.current) {
      // Pan target
      if (!cameraRef.current) return;
      const panSpeed = 0.4;
      const right = new THREE.Vector3();
      cameraRef.current.getWorldDirection(right);
      right.cross(cameraRef.current.up).normalize();

      cameraTargetRef.current.addScaledVector(right, -deltaX * panSpeed);
      cameraTargetRef.current.addScaledVector(cameraRef.current.up, deltaY * panSpeed);
      updateCameraPosition();
    }

    // Raycast for hover detection & cursor coords
    if (mountRef.current && cameraRef.current && sceneRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Check buildings
      const buildingMeshes = buildingMeshesRef.current.map((b) => b.mesh);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      if (intersects.length > 0) {
        const hitBuilding = (intersects[0].object as any).userData?.buildingData;
        setHoveredBuilding(hitBuilding || null);
        mountRef.current.style.cursor = 'pointer';
      } else {
        setHoveredBuilding(null);
        mountRef.current.style.cursor = measureMode !== 'none' ? 'crosshair' : 'default';
      }

      // Check terrain for dynamic altitude probe
      if (terrainMeshRef.current) {
        const terrainHits = raycaster.intersectObject(terrainMeshRef.current);
        if (terrainHits.length > 0) {
          const pt = terrainHits[0].point;
          const metricAltitude = (pt.y / (0.35 * elevationExaggeration)).toFixed(1);
          setCursorCoord({
            x: Math.round(pt.x),
            y: parseFloat(metricAltitude),
            z: Math.round(pt.z)
          });
        }
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    cameraSphericalRef.current.radius = Math.max(
      60,
      Math.min(900, cameraSphericalRef.current.radius * zoomFactor)
    );
    updateCameraPosition();
  };

  // Click handler (Building Inspection / Measurements)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // 1. Measurement mode
    if (measureMode !== 'none') {
      const hits = raycaster.intersectObjects(
        [
          terrainMeshRef.current,
          ...buildingMeshesRef.current.map((b) => b.mesh)
        ].filter(Boolean) as THREE.Object3D[]
      );

      if (hits.length > 0) {
        const point = hits[0].point;
        const newPts = [...measurePoints, point];

        if (measureMode === 'height') {
          if (newPts.length === 1) {
            setMeasurePoints(newPts);
            setActiveMeasurementText('Click top of building / roof peak');
          } else if (newPts.length === 2) {
            const dy = Math.abs(newPts[1].y - newPts[0].y) / (0.35 * elevationExaggeration);
            const distStr = `${dy.toFixed(2)} m (Metric Height)`;
            setActiveMeasurementText(`Measured Height: ${distStr}`);
            drawMeasurementVector(newPts[0], newPts[1], 0x00f2fe);
            setMeasurePoints([]);
            if (onAddMeasurement) {
              onAddMeasurement({
                id: generateMeasurementId(),
                analysisId: analysis.id,
                title: `Vertical Height: ${dy.toFixed(1)}m`,
                measurementType: 'height',
                value: parseFloat(dy.toFixed(2)),
                unit: 'm',
                uncertaintyMargin: 0.35,
                isEstimated: false,
                geometryCoords: [[newPts[0].x, newPts[0].z], [newPts[1].x, newPts[1].z]],
                createdAt: new Date().toISOString()
              });
            }
          }
        } else if (measureMode === 'distance') {
          if (newPts.length === 1) {
            setMeasurePoints(newPts);
            setActiveMeasurementText('Click end point');
          } else if (newPts.length === 2) {
            const dist = newPts[0].distanceTo(newPts[1]) / 0.35;
            const distStr = `${dist.toFixed(2)} m`;
            setActiveMeasurementText(`Measured Distance: ${distStr}`);
            drawMeasurementVector(newPts[0], newPts[1], 0x10b981);
            setMeasurePoints([]);
            if (onAddMeasurement) {
              onAddMeasurement({
                id: generateMeasurementId(),
                analysisId: analysis.id,
                title: `Ground Distance: ${dist.toFixed(1)}m`,
                measurementType: 'horizontal_distance',
                value: parseFloat(dist.toFixed(2)),
                unit: 'm',
                uncertaintyMargin: 0.5,
                isEstimated: false,
                geometryCoords: [[newPts[0].x, newPts[0].z], [newPts[1].x, newPts[1].z]],
                createdAt: new Date().toISOString()
              });
            }
          }
        }
      }
      return;
    }

    // 2. Regular Selection: Inspect clicked building
    const buildingMeshes = buildingMeshesRef.current.map((b) => b.mesh);
    const intersects = raycaster.intersectObjects(buildingMeshes);

    if (intersects.length > 0) {
      const clicked = (intersects[0].object as any).userData?.buildingData;
      setInspectedBuilding(clicked);
      if (onSelectBuilding) {
        onSelectBuilding(clicked);
      }
    } else {
      setInspectedBuilding(null);
      if (onSelectBuilding) {
        onSelectBuilding(null);
      }
    }
  };

  // Draw 3D Measurement Visual Line
  const drawMeasurementVector = (p1: THREE.Vector3, p2: THREE.Vector3, hexColor: number) => {
    if (!sceneRef.current) return;
    if (measurementLineRef.current) {
      sceneRef.current.remove(measurementLineRef.current);
      measurementLineRef.current.geometry.dispose();
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMat = new THREE.LineBasicMaterial({ color: hexColor, linewidth: 3 });
    const line = new THREE.Line(lineGeo, lineMat);
    sceneRef.current.add(line);
    measurementLineRef.current = line;
  };

  // Camera Presets
  const setCameraPreset = (preset: 'nadir' | 'oblique' | 'pedestrian' | 'reset') => {
    setIsFlythroughActive(false);
    if (preset === 'nadir') {
      cameraSphericalRef.current = { radius: 380, theta: 0, phi: 0.05 };
      cameraTargetRef.current.set(0, 15, 0);
    } else if (preset === 'oblique') {
      cameraSphericalRef.current = { radius: 360, theta: Math.PI / 4, phi: Math.PI / 3.4 };
      cameraTargetRef.current.set(0, 15, 0);
    } else if (preset === 'pedestrian') {
      cameraSphericalRef.current = { radius: 120, theta: Math.PI / 2, phi: Math.PI / 2.2 };
      cameraTargetRef.current.set(0, 18, 0);
    } else {
      cameraSphericalRef.current = { radius: 380, theta: Math.PI / 4, phi: Math.PI / 3.2 };
      cameraTargetRef.current.set(0, 15, 0);
    }
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#070b14] overflow-hidden select-none">
      
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top Left: Layer Selector Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="glass-panel-elevated p-2 rounded-xl flex items-center gap-1.5 shadow-xl">
          <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            LAYER:
          </span>

          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'satellite'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Satellite RGB
          </button>

          <button
            onClick={() => setActiveLayer('depth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'depth'
                ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white font-bold shadow-md shadow-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Relative Disparity
          </button>

          <button
            onClick={() => setActiveLayer('elevation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'elevation'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Metric Elevation DSM
          </button>

          <button
            onClick={() => setActiveLayer('difference')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'difference'
                ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Difference Map
          </button>

          <button
            onClick={() => setActiveLayer('wireframe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'wireframe'
                ? 'bg-slate-200 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Wireframe
          </button>
        </div>

        {/* Feature Toggles (Extrusions, Pointcloud, Exaggeration) */}
        <div className="glass-panel p-2.5 rounded-xl flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showBuildings}
              onChange={(e) => setShowBuildings(e.target.checked)}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Buildings (LOD2)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showPointcloud}
              onChange={(e) => setShowPointcloud(e.target.checked)}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <span>Point Cloud</span>
          </label>

          {/* Elevation Exaggeration Slider */}
          <div className="flex items-center gap-2 border-l border-slate-700/60 pl-3">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px]">Z-Scale:</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={elevationExaggeration}
              onChange={(e) => setElevationExaggeration(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-cyan-400 text-[11px] font-semibold w-8">
              {elevationExaggeration.toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Camera Presets & Autopilot Flythrough */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="glass-panel-elevated p-1.5 rounded-xl flex items-center gap-1 shadow-xl">
          <button
            onClick={() => setCameraPreset('nadir')}
            title="Nadir 90° Top-Down View"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Nadir 90°
          </button>
          <button
            onClick={() => setCameraPreset('oblique')}
            title="Oblique 45° Perspective"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Oblique 45°
          </button>
          <button
            onClick={() => setCameraPreset('pedestrian')}
            title="Street-Level View"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Street View
          </button>
          <button
            onClick={() => setCameraPreset('reset')}
            title="Reset Camera"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Drone Flythrough Animation Button */}
        <button
          onClick={() => setIsFlythroughActive(!isFlythroughActive)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
            isFlythroughActive
              ? 'bg-rose-600 text-white ring-2 ring-rose-400/40 animate-pulse'
              : 'glass-panel-elevated text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/40'
          }`}
        >
          {isFlythroughActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isFlythroughActive ? 'Stop Flythrough' : 'Drone Autopilot'}</span>
        </button>
      </div>

      {/* Bottom Left: Interactive Laser Measurement Tools */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
        <div className="glass-panel-elevated p-2 rounded-xl flex items-center gap-2 shadow-2xl">
          <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" />
            3D CALIPER:
          </span>

          <button
            onClick={() => {
              setMeasureMode(measureMode === 'height' ? 'none' : 'height');
              setMeasurePoints([]);
              setActiveMeasurementText(measureMode === 'height' ? null : 'Click building base on ground');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              measureMode === 'height'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Measure Height</span>
          </button>

          <button
            onClick={() => {
              setMeasureMode(measureMode === 'distance' ? 'none' : 'distance');
              setMeasurePoints([]);
              setActiveMeasurementText(measureMode === 'distance' ? null : 'Click start point on map');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              measureMode === 'distance'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Ground Distance</span>
          </button>

          {measureMode !== 'none' && (
            <button
              onClick={() => {
                setMeasureMode('none');
                setMeasurePoints([]);
                setActiveMeasurementText(null);
              }}
              className="px-2 py-1 text-[11px] text-slate-400 hover:text-rose-400 font-mono"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Measurement Hint / Output banner */}
        {activeMeasurementText && (
          <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2 border border-cyan-500/40 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{activeMeasurementText}</span>
          </div>
        )}
      </div>

      {/* Bottom Center: Altitude HUD & Coordinates */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="glass-panel-elevated px-4 py-1.5 rounded-full flex items-center gap-4 text-[11px] font-mono shadow-2xl border border-cyan-500/30">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>X: {cursorCoord ? `${cursorCoord.x}m` : '--'}</span>
            <span className="text-slate-600">|</span>
            <span>Y: {cursorCoord ? `${cursorCoord.z}m` : '--'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span>ELEVATION:</span>
            <span className="text-white text-xs">{cursorCoord ? `${cursorCoord.y} m AMSL` : '--'}</span>
          </div>
          <div className="text-[10px] text-slate-400 hidden sm:block">
            CRS: EPSG:4326 (EGM2008)
          </div>
        </div>
      </div>

      {/* Floating HUD Building Inspector (When building is clicked or hovered) */}
      {(inspectedBuilding || hoveredBuilding) && (
        <div className="absolute top-20 right-4 z-30 w-72 glass-panel-elevated p-4 rounded-2xl shadow-2xl border border-cyan-400/40 animate-fade-in">
          {(() => {
            const bld = inspectedBuilding || hoveredBuilding!;
            return (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white tracking-wide">
                        {bld.identifier}
                      </h3>
                      <span className="text-[10px] uppercase font-mono text-cyan-400">
                        {bld.category} • LOD2 Extrusion
                      </span>
                    </div>
                  </div>
                  {inspectedBuilding && (
                    <button
                      onClick={() => setInspectedBuilding(null)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-[#070b14]/70 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Net Height</span>
                    <span className="text-base font-extrabold text-cyan-300 font-mono">
                      {(bld.estimatedHeightM || 0).toFixed(1)} m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Footprint Area</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {(bld.areaSqM || 0).toFixed(0)} m²
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Roof Elevation</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">
                      {bld.roofElevationM?.toFixed(1) || '--'} m AMSL
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ground Base</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">
                      {bld.groundElevationM?.toFixed(1) || '--'} m AMSL
                    </span>
                  </div>
                </div>

                {/* Additional Specs */}
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Storeys:</span>
                    <span className="font-mono text-white font-medium">
                      ~{Math.round((bld.estimatedHeightM || 0) / 3.2)} floors
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Detection Confidence:</span>
                    <span className="font-mono text-emerald-400 font-medium">
                      {(bld.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Segmentation:</span>
                    <span className="font-mono text-slate-300 text-[10px]">
                      {bld.modelVersion}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-cyan-400 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Calibrated against Copernicus DEM
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Navigation / Control Help Legend */}
      <div className="absolute bottom-4 right-4 z-20 text-[10px] text-slate-400 font-mono bg-[#070b14]/80 px-2.5 py-1.5 rounded-lg border border-slate-800 hidden md:block">
        Left Drag: Orbit • Right Drag: Pan • Scroll: Zoom
      </div>

    </div>
  );
};
