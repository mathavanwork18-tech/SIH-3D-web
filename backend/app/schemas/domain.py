from typing import List, Optional, Literal, Dict, Any, Tuple
from pydantic import BaseModel, Field
from datetime import datetime

AnalysisStatus = Literal['DRAFT', 'UPLOADED', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']
JobStage = Literal['QUEUED', 'IMAGE_UPLOAD', 'IMAGE_PREPROCESSING', 'AI_DEPTH_ESTIMATION', 'METRIC_CALIBRATION', 'OBJECT_DETECTION', 'ELEVATION_MAP', 'RECONSTRUCTION_3D', 'FINAL_ANALYSIS', 'COMPLETED', 'FAILED']
JobStatus = Literal['QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'RETRYING']
CalibrationStatus = Literal['NOT_REQUIRED', 'UNAVAILABLE', 'ESTIMATED', 'CALIBRATED', 'VALIDATED']
ObjectCategory = Literal['building', 'road', 'vegetation', 'water', 'vehicle', 'structure']
MeasurementType = Literal['height', 'horizontal_distance', 'polygon_area', 'elevation_difference']

class GeospatialMetadata(BaseModel):
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    crs: str = "EPSG:4326"
    groundSampleDistanceM: float = 0.35
    imageWidth: int = 1024
    imageHeight: int = 1024
    colorBands: int = 3
    bounds: Optional[List[float]] = [77.5900, 12.9680, 77.5990, 12.9750]
    captureDate: Optional[str] = "2026-09-28T09:00:00Z"
    sensor: Optional[str] = "WorldView-3 / High-Res UAV"
    isGeoreferenced: bool = True

class DepthResultSchema(BaseModel):
    id: str
    analysisId: str
    modelName: str = "Depth-Anything-V2-Aerial"
    modelVersion: str = "2.0.0"
    minRelativeDepth: float
    maxRelativeDepth: float
    meanRelativeDepth: float
    stdRelativeDepth: float
    histogram: List[int]
    uncertaintyEstimated: bool = True
    visualArtifactUrl: str
    numericalArtifactUrl: Optional[str] = None
    createdAt: str

class CalibrationRecordSchema(BaseModel):
    id: str
    analysisId: str
    referenceDatasetName: str = "Copernicus GLO-30 DEM"
    calibrationMethod: Literal['DEM_AFFINE_ROBUST', 'GCP_CONTROL_POINTS', 'KNOWN_HEIGHT_PRIOR', 'SYNTHETIC_BENCHMARK'] = 'DEM_AFFINE_ROBUST'
    scaleFactor: float = 62.0
    offsetM: float = 14.0
    samplePointsCount: int = 64
    rmseMeters: float = 1.42
    maeMeters: float = 1.18
    correlationPearson: float = 0.984
    confidenceLevel: Literal['LOW', 'MEDIUM', 'HIGH', 'SURVEY_GRADE_INVALID'] = 'HIGH'
    isValid: bool = True

class ElevationResultSchema(BaseModel):
    id: str
    analysisId: str
    isMetric: bool = True
    minElevationM: float = 14.2
    maxElevationM: float = 70.8
    meanElevationM: float = 23.6
    heightRangeM: float = 56.6
    verticalDatum: str = "EGM2008 / WGS84"
    validPixelPercentage: float = 100.0
    histogram: List[int]
    visualArtifactUrl: str
    dsmGeoTiffUrl: Optional[str] = None
    calibration: CalibrationRecordSchema
    createdAt: str

class GeoJSONPolygon(BaseModel):
    type: Literal['Polygon'] = 'Polygon'
    coordinates: List[List[List[float]]]

class DetectedObjectSchema(BaseModel):
    id: str
    analysisId: str
    identifier: str # e.g. BLD-101
    category: ObjectCategory = 'building'
    confidence: float
    estimatedHeightM: float
    roofElevationM: float
    groundElevationM: float
    areaSqM: float
    boundingBox: List[float] # [ymin, xmin, ymax, xmax] in relative 0..1
    polygonGeoJson: GeoJSONPolygon
    modelVersion: str = "YOLOv8x-Geospatial-v2"

class MeasurementSchema(BaseModel):
    id: str
    analysisId: str
    objectId: Optional[str] = None
    title: str
    measurementType: MeasurementType
    value: float
    unit: str = "m"
    uncertaintyMargin: Optional[float] = 0.4
    isEstimated: bool = False
    geometryCoords: List[List[float]]
    createdAt: str

class FlythroughWaypointSchema(BaseModel):
    id: str
    stepOrder: int
    position: Tuple[float, float, float]
    target: Tuple[float, float, float]
    durationToNextSec: float
    fov: float = 60.0
    label: Optional[str] = None

class FlythroughSchema(BaseModel):
    id: str
    analysisId: str
    name: str = "Urban Complex Orbit"
    mode: Literal['orbit', 'fly', 'walk'] = 'orbit'
    totalDurationSec: float = 24.0
    loopAnimation: bool = True
    cameraSpeed: float = 1.0
    waypoints: List[FlythroughWaypointSchema]

class ProcessingLogEntrySchema(BaseModel):
    timestamp: str
    stage: str
    level: Literal['DEBUG', 'INFO', 'WARNING', 'ERROR']
    message: str

class ProcessingJobSchema(BaseModel):
    id: str
    analysisId: str
    currentStage: JobStage
    status: JobStatus
    progressPercentage: int
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None
    retryCount: int = 0
    maxRetries: int = 3
    errorCode: Optional[str] = None
    errorMessage: Optional[str] = None
    workerNode: Optional[str] = "cuda-node-01"
    hardwareAccelerator: str = "NVIDIA RTX 4090 / CUDA 12.4"
    logs: List[ProcessingLogEntrySchema]

class AnalysisSchema(BaseModel):
    id: str
    userId: str = "demo-analyst-001"
    name: str
    description: Optional[str] = None
    locationLabel: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    status: AnalysisStatus = 'COMPLETED'
    isDemo: bool = True
    metadata: GeospatialMetadata
    imageUrl: str
    thumbnailUrl: str
    depthResult: Optional[DepthResultSchema] = None
    elevationResult: Optional[ElevationResultSchema] = None
    detectedObjects: Optional[List[DetectedObjectSchema]] = None
    measurements: Optional[List[MeasurementSchema]] = None
    meshGlbUrl: Optional[str] = None
    meshGltfUrl: Optional[str] = None
    flythrough: Optional[FlythroughSchema] = None
    calibrationStatus: CalibrationStatus = 'CALIBRATED'
    processingDurationMs: Optional[int] = 4280
    reproducibilityHash: Optional[str] = "sha256-a94f1c7d8e2098b3c"
    createdAt: str
    updatedAt: str

class CalibrationRequest(BaseModel):
    analysisId: str
    referenceDataset: str = "Copernicus GLO-30 DEM"
    method: Literal['DEM_AFFINE_ROBUST', 'GCP_CONTROL_POINTS', 'KNOWN_HEIGHT_PRIOR'] = 'DEM_AFFINE_ROBUST'
    ransacIqrThreshold: float = 1.5
    minControlPoints: int = 8

class MeasurementCreate(BaseModel):
    analysisId: str
    objectId: Optional[str] = None
    title: str
    measurementType: MeasurementType
    value: float
    unit: str = "m"
    geometryCoords: List[List[float]]
