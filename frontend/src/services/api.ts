import type { Analysis, ProcessingJob } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Fallback demo dataset if backend server is not active
export const DEMO_ANALYSIS: Analysis = {
  id: 'demo-analysis-001',
  userId: 'usr-lead-analyst',
  name: 'Visakhapatnam Urban Maritime Zone (Demo)',
  description: 'High-resolution satellite nadir & oblique composite. Monocular depth calibrated against ESA Copernicus GLO-30 DEM with 3D building LOD2 extrusions.',
  locationLabel: 'Visakhapatnam Port & Commercial District, AP, India',
  tags: ['Satellite', 'Urban', 'Metric-Elevation', 'Copernicus-DEM', '3D-LOD2'],
  status: 'COMPLETED',
  isDemo: true,
  metadata: {
    latitude: 17.6868,
    longitude: 83.2185,
    crs: 'EPSG:4326 / UTM Zone 44N',
    groundSampleDistanceM: 0.35,
    imageWidth: 1024,
    imageHeight: 1024,
    colorBands: 3,
    bounds: [83.2100, 17.6800, 83.2280, 17.6940],
    captureDate: '2026-09-28T06:30:00Z',
    sensor: 'WorldView-3 / High-Res UAV Synthetic Benchmark',
    isGeoreferenced: true
  },
  imageUrl: '/demo/satellite_scene.png',
  thumbnailUrl: '/demo/thumbnail.png',
  depthResult: {
    id: 'dep-res-001',
    analysisId: 'demo-analysis-001',
    modelName: 'Depth-Anything-V2-Aerial',
    modelVersion: '2.0.0',
    minRelativeDepth: 0.120,
    maxRelativeDepth: 0.942,
    meanRelativeDepth: 0.384,
    stdRelativeDepth: 0.182,
    histogram: [45, 120, 310, 560, 820, 640, 420, 310, 240, 190, 150, 120, 95, 80, 70, 60, 50, 40, 30, 20],
    uncertaintyEstimated: true,
    visualArtifactUrl: '/demo/depth_relative_heatmap.png',
    createdAt: '2026-09-28T07:15:01Z'
  },
  elevationResult: {
    id: 'elev-res-001',
    analysisId: 'demo-analysis-001',
    isMetric: true,
    minElevationM: 12.5,
    maxElevationM: 74.2,
    meanElevationM: 22.8,
    heightRangeM: 61.7,
    verticalDatum: 'EGM2008 / WGS84 Orthometric',
    validPixelPercentage: 100.0,
    histogram: [28, 95, 240, 480, 790, 680, 490, 340, 260, 210, 170, 140, 110, 85, 75, 65, 55, 45, 35, 25],
    visualArtifactUrl: '/demo/elevation_metric_dsm.png',
    dsmGeoTiffUrl: '/demo/elevation_metric_dsm.png',
    calibration: {
      id: 'cal-rec-001',
      analysisId: 'demo-analysis-001',
      referenceDatasetName: 'Copernicus GLO-30 DEM',
      calibrationMethod: 'DEM_AFFINE_ROBUST',
      scaleFactor: 62.0,
      offsetM: 14.0,
      samplePointsCount: 48,
      rmseMeters: 1.42,
      maeMeters: 1.18,
      correlationPearson: 0.984,
      confidenceLevel: 'HIGH',
      isValid: true
    },
    createdAt: '2026-09-28T07:15:02Z'
  },
  detectedObjects: [
    {
      id: 'obj-bld-101',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-101',
      category: 'building',
      confidence: 0.984,
      estimatedHeightM: 48.5,
      roofElevationM: 62.8,
      groundElevationM: 14.3,
      areaSqM: 2520.0,
      boundingBox: [0.078, 0.078, 0.215, 0.254],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.078, 0.078], [0.254, 0.078], [0.254, 0.215], [0.078, 0.215], [0.078, 0.078]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-102',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-102',
      category: 'building',
      confidence: 0.965,
      estimatedHeightM: 32.0,
      roofElevationM: 46.5,
      groundElevationM: 14.5,
      areaSqM: 1600.0,
      boundingBox: [0.254, 0.078, 0.352, 0.234],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.078, 0.254], [0.234, 0.254], [0.234, 0.352], [0.078, 0.352], [0.078, 0.254]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-103',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-103',
      category: 'building',
      confidence: 0.992,
      estimatedHeightM: 56.2,
      roofElevationM: 71.4,
      groundElevationM: 15.2,
      areaSqM: 2800.0,
      boundingBox: [0.098, 0.371, 0.234, 0.566],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.371, 0.098], [0.566, 0.098], [0.566, 0.234], [0.371, 0.234], [0.371, 0.098]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-104',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-104',
      category: 'building',
      confidence: 0.941,
      estimatedHeightM: 24.8,
      roofElevationM: 40.1,
      groundElevationM: 15.3,
      areaSqM: 1440.0,
      boundingBox: [0.273, 0.410, 0.352, 0.586],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.410, 0.273], [0.586, 0.273], [0.586, 0.352], [0.410, 0.352], [0.410, 0.273]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-105',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-105',
      category: 'building',
      confidence: 0.978,
      estimatedHeightM: 38.6,
      roofElevationM: 53.4,
      groundElevationM: 14.8,
      areaSqM: 3420.0,
      boundingBox: [0.449, 0.078, 0.625, 0.264],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.078, 0.449], [0.264, 0.449], [0.264, 0.625], [0.078, 0.625], [0.078, 0.449]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-106',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-106',
      category: 'building',
      confidence: 0.985,
      estimatedHeightM: 42.0,
      roofElevationM: 57.0,
      groundElevationM: 15.0,
      areaSqM: 3960.0,
      boundingBox: [0.449, 0.371, 0.625, 0.586],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.371, 0.449], [0.586, 0.449], [0.586, 0.625], [0.371, 0.625], [0.371, 0.449]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-107',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-107',
      category: 'structure',
      confidence: 0.932,
      estimatedHeightM: 28.4,
      roofElevationM: 42.1,
      groundElevationM: 13.7,
      areaSqM: 1800.0,
      boundingBox: [0.117, 0.693, 0.312, 0.781],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.693, 0.117], [0.781, 0.117], [0.781, 0.312], [0.693, 0.312], [0.693, 0.117]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-108',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-108',
      category: 'structure',
      confidence: 0.951,
      estimatedHeightM: 35.5,
      roofElevationM: 49.3,
      groundElevationM: 13.8,
      areaSqM: 1620.0,
      boundingBox: [0.449, 0.693, 0.625, 0.781],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.693, 0.449], [0.781, 0.449], [0.781, 0.625], [0.693, 0.625], [0.693, 0.449]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-109',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-109',
      category: 'building',
      confidence: 0.963,
      estimatedHeightM: 22.0,
      roofElevationM: 36.8,
      groundElevationM: 14.8,
      areaSqM: 2880.0,
      boundingBox: [0.762, 0.098, 0.918, 0.273],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.098, 0.762], [0.273, 0.762], [0.273, 0.918], [0.098, 0.918], [0.098, 0.762]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    },
    {
      id: 'obj-bld-110',
      analysisId: 'demo-analysis-001',
      identifier: 'BLD-110',
      category: 'building',
      confidence: 0.970,
      estimatedHeightM: 26.5,
      roofElevationM: 41.5,
      groundElevationM: 15.0,
      areaSqM: 3360.0,
      boundingBox: [0.762, 0.371, 0.918, 0.576],
      polygonGeoJson: {
        type: 'Polygon',
        coordinates: [[[0.371, 0.762], [0.576, 0.762], [0.576, 0.918], [0.371, 0.918], [0.371, 0.762]]]
      },
      modelVersion: 'YOLOv8x-Geospatial-v2'
    }
  ],
  measurements: [
    {
      id: 'meas-001',
      analysisId: 'demo-analysis-001',
      objectId: 'obj-bld-103',
      title: 'Central Highrise Tower Height',
      measurementType: 'height',
      value: 56.2,
      unit: 'm',
      uncertaintyMargin: 0.42,
      isEstimated: false,
      geometryCoords: [[0.468, 0.166], [0.468, 0.166]],
      createdAt: '2026-09-28T07:15:03Z'
    },
    {
      id: 'meas-002',
      analysisId: 'demo-analysis-001',
      objectId: 'obj-bld-101',
      title: 'North-West Commercial Perimeter',
      measurementType: 'horizontal_distance',
      value: 182.4,
      unit: 'm',
      uncertaintyMargin: 0.85,
      isEstimated: false,
      geometryCoords: [[0.078, 0.078], [0.254, 0.078]],
      createdAt: '2026-09-28T07:15:03Z'
    },
    {
      id: 'meas-003',
      analysisId: 'demo-analysis-001',
      objectId: 'obj-bld-106',
      title: 'Central Hub Footprint Area',
      measurementType: 'polygon_area',
      value: 3960.0,
      unit: 'm2',
      uncertaintyMargin: 12.0,
      isEstimated: false,
      geometryCoords: [[0.371, 0.449], [0.586, 0.449], [0.586, 0.625], [0.371, 0.625]],
      createdAt: '2026-09-28T07:15:04Z'
    }
  ],
  flythrough: {
    id: 'fly-001',
    analysisId: 'demo-analysis-001',
    name: 'Urban Core Orbital Survey',
    mode: 'orbit',
    totalDurationSec: 20.0,
    loopAnimation: true,
    cameraSpeed: 1.0,
    waypoints: [
      {
        id: 'wp-1',
        stepOrder: 1,
        position: [0.0, 180.0, 280.0],
        target: [0.0, 20.0, 0.0],
        durationToNextSec: 5.0,
        fov: 55.0,
        label: 'Approach South-East'
      },
      {
        id: 'wp-2',
        stepOrder: 2,
        position: [220.0, 140.0, 60.0],
        target: [20.0, 25.0, 0.0],
        durationToNextSec: 5.0,
        fov: 60.0,
        label: 'East Maritime Terminal'
      },
      {
        id: 'wp-3',
        stepOrder: 3,
        position: [0.0, 240.0, -180.0],
        target: [0.0, 30.0, 0.0],
        durationToNextSec: 5.0,
        fov: 50.0,
        label: 'North High-Angle Overview'
      },
      {
        id: 'wp-4',
        stepOrder: 4,
        position: [-200.0, 120.0, 40.0],
        target: [-10.0, 20.0, 0.0],
        durationToNextSec: 5.0,
        fov: 55.0,
        label: 'West Commercial Boulevard'
      }
    ]
  },
  calibrationStatus: 'CALIBRATED',
  processingDurationMs: 3840,
  reproducibilityHash: 'sha256-e91b5c404d023f87b8d0092fa023e1',
  createdAt: '2026-09-28T07:15:00Z',
  updatedAt: '2026-09-28T07:15:04Z'
};

export const DEMO_JOB: ProcessingJob = {
  id: 'job-demo-analysis-001',
  analysisId: 'demo-analysis-001',
  currentStage: 'COMPLETED',
  status: 'SUCCEEDED',
  progressPercentage: 100,
  startedAt: '2026-09-28T07:15:00Z',
  completedAt: '2026-09-28T07:15:04Z',
  retryCount: 0,
  maxRetries: 3,
  workerNode: 'worker-gpu-nv-04',
  hardwareAccelerator: 'NVIDIA RTX 4090 / TensorRT 10.1',
  logs: [
    { timestamp: '07:15:00.120', stage: 'IMAGE_UPLOAD', level: 'INFO', message: 'High-resolution satellite nadir imagery uploaded (1024x1024, RGB 8-bit).' },
    { timestamp: '07:15:00.450', stage: 'IMAGE_PREPROCESSING', level: 'INFO', message: 'Georeference metadata verified. GSD estimated at 0.35m/px. Normalized CLAHE applied.' },
    { timestamp: '07:15:01.210', stage: 'AI_DEPTH_ESTIMATION', level: 'INFO', message: 'Depth-Anything-V2-Aerial inference completed in 760ms. Disparity field extracted.' },
    { timestamp: '07:15:01.980', stage: 'METRIC_CALIBRATION', level: 'INFO', message: 'Querying ESA Copernicus GLO-30 DEM. 48 GCP control points collected. RANSAC Huber fitting executed.' },
    { timestamp: '07:15:02.340', stage: 'METRIC_CALIBRATION', level: 'INFO', message: 'Optimal affine transform: Scale = 62.00, Offset = 14.00m. RMSE = 1.42m (HIGH confidence).' },
    { timestamp: '07:15:02.890', stage: 'OBJECT_DETECTION', level: 'INFO', message: 'YOLOv8x instance segmentation found 10 urban building structures and road corridors.' },
    { timestamp: '07:15:03.200', stage: 'ELEVATION_MAP', level: 'INFO', message: 'Generating Metric DSM GeoTIFF. Elevation dynamic range: 12.5m to 74.2m AMSL.' },
    { timestamp: '07:15:03.650', stage: 'RECONSTRUCTION_3D', level: 'INFO', message: 'Constructing LOD2 3D continuous terrain mesh and building extrusions with UV texture mapping.' },
    { timestamp: '07:15:04.100', stage: 'FINAL_ANALYSIS', level: 'INFO', message: 'Integrity check passed. Measurements cataloged. Ready for geospatial review.' }
  ]
};

export const api = {
  async getAnalysis(id: string): Promise<Analysis> {
    try {
      const res = await fetch(`${API_BASE_URL}/analyses/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local high-fidelity demo
    }
    return DEMO_ANALYSIS;
  },

  async getJob(analysisId: string): Promise<ProcessingJob> {
    try {
      const res = await fetch(`${API_BASE_URL}/pipeline/jobs/${analysisId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEMO_JOB;
  },

  async recalibrate(req: {
    analysisId: string;
    referenceDataset: string;
    ransacIqrThreshold: number;
    minControlPoints: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/calibration/recalibrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      scale: 62.0,
      offset: 14.0,
      sampleCount: 48,
      inlierCount: 44,
      rmseMeters: 1.42,
      maeMeters: 1.18,
      pearsonCorrelation: 0.984,
      confidenceLevel: 'HIGH'
    };
  }
};
