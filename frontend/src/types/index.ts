// DepthWizard — SIH26175 Domain Type Definitions
// Strictly typed interfaces for geospatial AI, depth estimation, calibration, and 3D reconstruction

export type AnalysisStatus = 
  | 'DRAFT' 
  | 'UPLOADED' 
  | 'QUEUED' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export type JobStage = 
  | 'QUEUED' 
  | 'IMAGE_UPLOAD' 
  | 'IMAGE_PREPROCESSING' 
  | 'AI_DEPTH_ESTIMATION' 
  | 'METRIC_CALIBRATION' 
  | 'OBJECT_DETECTION' 
  | 'ELEVATION_MAP' 
  | 'RECONSTRUCTION_3D' 
  | 'FINAL_ANALYSIS' 
  | 'COMPLETED' 
  | 'FAILED';

export type JobStatus = 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'SUCCEEDED' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'RETRYING';

export type CalibrationStatus = 
  | 'NOT_REQUIRED' 
  | 'UNAVAILABLE' 
  | 'ESTIMATED' 
  | 'CALIBRATED' 
  | 'VALIDATED';

export type ArtifactType = 
  | 'ORIGINAL_IMAGE'
  | 'THUMBNAIL'
  | 'DEPTH_NUMERICAL'
  | 'DEPTH_VISUAL'
  | 'ELEVATION_NUMERICAL'
  | 'ELEVATION_VISUAL'
  | 'OBJECT_MASK'
  | 'OBJECT_GEOJSON'
  | 'DSM_GEOTIFF'
  | 'MESH_GLB'
  | 'MESH_GLTF'
  | 'REPORT_PDF'
  | 'MEASUREMENTS_CSV';

export type ObjectCategory = 
  | 'building' 
  | 'road' 
  | 'vegetation' 
  | 'water' 
  | 'vehicle' 
  | 'structure';

export type MeasurementType = 
  | 'height' 
  | 'horizontal_distance' 
  | 'polygon_area' 
  | 'elevation_difference';

export type UserRole = 'analyst' | 'senior_analyst' | 'admin' | 'system';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  organization: string;
  role: UserRole;
  storageQuotaBytes: number;
  storageUsedBytes: number;
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  preferredUnits: 'metric' | 'imperial';
  preferredCrs: string;
  defaultElevationColorRamp: string;
  defaultDepthColorRamp: string;
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  enableShadows: boolean;
  notificationEmail: boolean;
}

export interface ModelRegistryItem {
  id: string;
  name: string;
  version: string;
  task: 'depth_estimation' | 'height_calibration' | 'object_detection' | 'elevation_dsm' | 'reconstruction';
  provider: string;
  license: string;
  supportedInputs: string[];
  expectedOutput: string;
  isActive: boolean;
  isDemoFallback: boolean;
  description: string;
}

export interface ReferenceDataset {
  id: string;
  name: string;
  source: string;
  datasetType: 'DEM_SRTM' | 'DEM_ALOS' | 'DEM_COP30' | 'LIDAR_GCP' | 'SYNTHETIC_BENCHMARK';
  horizontalCrs: string;
  verticalDatum: string;
  nominalResolutionM: number;
  verticalAccuracyM: number;
  license: string;
  attribution: string;
}

export interface GeospatialMetadata {
  latitude?: number;
  longitude?: number;
  crs?: string;
  groundSampleDistanceM?: number;
  imageWidth: number;
  imageHeight: number;
  colorBands: number;
  bounds?: [number, number, number, number]; // [minX, minY, maxX, maxY]
  captureDate?: string;
  sensor?: string;
  isGeoreferenced: boolean;
}

export interface AnalysisFile {
  id: string;
  analysisId: string;
  fileType: ArtifactType;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  checksumSha256?: string;
  status: 'PENDING' | 'READY' | 'FAILED' | 'EXPIRED';
  url: string;
  createdAt: string;
}

export interface ProcessingJob {
  id: string;
  analysisId: string;
  currentStage: JobStage;
  status: JobStatus;
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  errorCode?: string;
  errorMessage?: string;
  workerNode?: string;
  hardwareAccelerator: string;
  logs: ProcessingLogEntry[];
}

export interface ProcessingLogEntry {
  timestamp: string;
  stage: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}

export interface DepthResult {
  id: string;
  analysisId: string;
  modelName: string;
  modelVersion: string;
  minRelativeDepth: number;
  maxRelativeDepth: number;
  meanRelativeDepth: number;
  stdRelativeDepth: number;
  histogram: number[];
  uncertaintyEstimated: boolean;
  visualArtifactUrl: string;
  numericalArtifactUrl?: string;
  createdAt: string;
}

export interface CalibrationRecord {
  id: string;
  analysisId: string;
  referenceDatasetName: string;
  calibrationMethod: 'DEM_AFFINE_ROBUST' | 'GCP_CONTROL_POINTS' | 'KNOWN_HEIGHT_PRIOR' | 'SYNTHETIC_BENCHMARK';
  scaleFactor: number;
  offsetM: number;
  samplePointsCount: number;
  rmseMeters: number;
  maeMeters: number;
  correlationPearson: number;
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SURVEY_GRADE_INVALID';
  isValid: boolean;
}

export interface ElevationResult {
  id: string;
  analysisId: string;
  isMetric: boolean;
  minElevationM: number;
  maxElevationM: number;
  meanElevationM: number;
  heightRangeM: number;
  verticalDatum: string;
  validPixelPercentage: number;
  histogram: number[];
  visualArtifactUrl: string;
  dsmGeoTiffUrl?: string;
  calibration: CalibrationRecord;
  createdAt: string;
}

export interface DetectedObject {
  id: string;
  analysisId: string;
  identifier: string; // e.g., 'BLD-101'
  category: ObjectCategory;
  confidence: number;
  estimatedHeightM?: number;
  roofElevationM?: number;
  groundElevationM?: number;
  areaSqM?: number;
  boundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] relative 0..1
  polygonGeoJson: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  modelVersion: string;
}

export interface Measurement {
  id: string;
  analysisId: string;
  objectId?: string;
  title: string;
  measurementType: MeasurementType;
  value: number;
  unit: 'm' | 'm2' | 'ft' | 'ft2';
  uncertaintyMargin?: number;
  isEstimated: boolean;
  geometryCoords: [number, number][];
  createdAt: string;
}

export interface FlythroughWaypoint {
  id: string;
  stepOrder: number;
  position: [number, number, number];
  target: [number, number, number];
  durationToNextSec: number;
  fov: number;
  label?: string;
}

export interface Flythrough {
  id: string;
  analysisId: string;
  name: string;
  mode: 'orbit' | 'fly' | 'walk';
  totalDurationSec: number;
  loopAnimation: boolean;
  cameraSpeed: number;
  waypoints: FlythroughWaypoint[];
}

export interface ComparisonResult {
  id: string;
  analysisAId: string;
  analysisBId: string;
  analysisAName: string;
  analysisBName: string;
  alignmentStatus: 'ALIGNED' | 'TRANSFORMED' | 'INCOMPATIBLE_CRS';
  meanElevationDiffM: number;
  maxElevationDiffM: number;
  structuresCountDelta: number;
  differenceArtifactUrl: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  analysisId: string;
  title: string;
  summary: string;
  status: 'REQUESTED' | 'GENERATING' | 'READY' | 'FAILED';
  pdfArtifactUrl?: string;
  metricsSnapshot: Record<string, any>;
  createdAt: string;
}

export interface Analysis {
  id: string;
  userId: string;
  name: string;
  description?: string;
  locationLabel?: string;
  tags: string[];
  status: AnalysisStatus;
  isDemo: boolean;
  metadata: GeospatialMetadata;
  imageUrl: string;
  thumbnailUrl: string;
  depthResult?: DepthResult;
  elevationResult?: ElevationResult;
  detectedObjects?: DetectedObject[];
  measurements?: Measurement[];
  meshGlbUrl?: string;
  meshGltfUrl?: string;
  flythrough?: Flythrough;
  calibrationStatus: CalibrationStatus;
  processingDurationMs?: number;
  reproducibilityHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  activeJobs: number;
  failedJobs: number;
  storageUsedBytes: number;
  systemHealth: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  averageInferenceTimeMs: number;
  gpuUtilizationPercent: number;
}
