import os
import time
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.app.geo.calibration import MetricElevationCalibrator
from backend.app.ai.object_detector import UrbanObjectDetector
from backend.app.schemas.domain import (
    AnalysisSchema, CalibrationRequest, MeasurementCreate,
    JobStage, JobStatus, ProcessingJobSchema, ProcessingLogEntrySchema
)

class AnalysisService:
    def __init__(self):
        self._analyses: Dict[str, Dict[str, Any]] = {}
        self._jobs: Dict[str, Dict[str, Any]] = {}
        self._initialize_demo_analysis()

    def _initialize_demo_analysis(self):
        demo_id = "demo-analysis-001"
        now_str = datetime.now(timezone.utc).isoformat()

        disparities, dem_heights = MetricElevationCalibrator.generate_benchmark_control_points(48)
        calibrator = MetricElevationCalibrator()
        calib_stats = calibrator.fit_affine(disparities, dem_heights)

        detected_buildings = UrbanObjectDetector.get_detected_buildings()

        self._analyses[demo_id] = {
            "id": demo_id,
            "userId": "usr-lead-analyst",
            "name": "Visakhapatnam Urban Maritime Zone (Demo)",
            "description": "High-resolution satellite nadir & oblique composite. Monocular depth calibrated against ESA Copernicus GLO-30 DEM with 3D building LOD2 extrusions.",
            "locationLabel": "Visakhapatnam Port & Commercial District, AP, India",
            "tags": ["Satellite", "Urban", "Metric-Elevation", "Copernicus-DEM", "3D-LOD2"],
            "status": "COMPLETED",
            "isDemo": True,
            "metadata": {
                "latitude": 17.6868,
                "longitude": 83.2185,
                "crs": "EPSG:4326 / UTM Zone 44N",
                "groundSampleDistanceM": 0.35,
                "imageWidth": 1024,
                "imageHeight": 1024,
                "colorBands": 3,
                "bounds": [83.2100, 17.6800, 83.2280, 17.6940],
                "captureDate": "2026-09-28T06:30:00Z",
                "sensor": "WorldView-3 / High-Res UAV Synthetic Benchmark",
                "isGeoreferenced": True
            },
            "imageUrl": "/demo/satellite_scene.png",
            "thumbnailUrl": "/demo/thumbnail.png",
            "depthResult": {
                "id": "dep-res-001",
                "analysisId": demo_id,
                "modelName": "Depth-Anything-V2-Aerial",
                "modelVersion": "2.0.0",
                "minRelativeDepth": 0.120,
                "maxRelativeDepth": 0.942,
                "meanRelativeDepth": 0.384,
                "stdRelativeDepth": 0.182,
                "histogram": [45, 120, 310, 560, 820, 640, 420, 310, 240, 190, 150, 120, 95, 80, 70, 60, 50, 40, 30, 20],
                "uncertaintyEstimated": True,
                "visualArtifactUrl": "/demo/depth_relative_heatmap.png",
                "numericalArtifactUrl": None,
                "createdAt": now_str
            },
            "elevationResult": {
                "id": "elev-res-001",
                "analysisId": demo_id,
                "isMetric": True,
                "minElevationM": 12.5,
                "maxElevationM": 74.2,
                "meanElevationM": 22.8,
                "heightRangeM": 61.7,
                "verticalDatum": "EGM2008 / WGS84 Orthometric",
                "validPixelPercentage": 100.0,
                "histogram": [28, 95, 240, 480, 790, 680, 490, 340, 260, 210, 170, 140, 110, 85, 75, 65, 55, 45, 35, 25],
                "visualArtifactUrl": "/demo/elevation_metric_dsm.png",
                "dsmGeoTiffUrl": "/demo/elevation_metric_dsm.png",
                "calibration": {
                    "id": "cal-rec-001",
                    "analysisId": demo_id,
                    "referenceDatasetName": "Copernicus GLO-30 DEM",
                    "calibrationMethod": "DEM_AFFINE_ROBUST",
                    "scaleFactor": calib_stats["scale"],
                    "offsetM": calib_stats["offset"],
                    "samplePointsCount": calib_stats["sampleCount"],
                    "rmseMeters": calib_stats["rmseMeters"],
                    "maeMeters": calib_stats["maeMeters"],
                    "correlationPearson": calib_stats["pearsonCorrelation"],
                    "confidenceLevel": calib_stats["confidenceLevel"],
                    "isValid": True,
                    "scatterPoints": calib_stats["scatterPoints"]
                },
                "createdAt": now_str
            },
            "differenceArtifactUrl": "/demo/elevation_difference_map.png",
            "detectedObjects": detected_buildings,
            "measurements": [
                {
                    "id": "meas-001",
                    "analysisId": demo_id,
                    "objectId": "obj-bld-103",
                    "title": "Central Highrise Tower Height",
                    "measurementType": "height",
                    "value": 56.2,
                    "unit": "m",
                    "uncertaintyMargin": 0.42,
                    "isEstimated": False,
                    "geometryCoords": [[0.468, 0.166], [0.468, 0.166]],
                    "createdAt": now_str
                },
                {
                    "id": "meas-002",
                    "analysisId": demo_id,
                    "objectId": "obj-bld-101",
                    "title": "North-West Commercial Perimeter",
                    "measurementType": "horizontal_distance",
                    "value": 182.4,
                    "unit": "m",
                    "uncertaintyMargin": 0.85,
                    "isEstimated": False,
                    "geometryCoords": [[0.078, 0.078], [0.254, 0.078]],
                    "createdAt": now_str
                },
                {
                    "id": "meas-003",
                    "analysisId": demo_id,
                    "objectId": "obj-bld-106",
                    "title": "Central Hub Footprint Area",
                    "measurementType": "polygon_area",
                    "value": 3960.0,
                    "unit": "m2",
                    "uncertaintyMargin": 12.0,
                    "isEstimated": False,
                    "geometryCoords": [[0.371, 0.449], [0.586, 0.449], [0.586, 0.625], [0.371, 0.625]],
                    "createdAt": now_str
                }
            ],
            "flythrough": {
                "id": "fly-001",
                "analysisId": demo_id,
                "name": "Urban Core Orbital Survey",
                "mode": "orbit",
                "totalDurationSec": 20.0,
                "loopAnimation": True,
                "cameraSpeed": 1.0,
                "waypoints": [
                    {
                        "id": "wp-1",
                        "stepOrder": 1,
                        "position": [0.0, 180.0, 280.0],
                        "target": [0.0, 20.0, 0.0],
                        "durationToNextSec": 5.0,
                        "fov": 55.0,
                        "label": "Approach South-East"
                    },
                    {
                        "id": "wp-2",
                        "stepOrder": 2,
                        "position": [220.0, 140.0, 60.0],
                        "target": [20.0, 25.0, 0.0],
                        "durationToNextSec": 5.0,
                        "fov": 60.0,
                        "label": "East Maritime Terminal Overview"
                    },
                    {
                        "id": "wp-3",
                        "stepOrder": 3,
                        "position": [0.0, 240.0, -180.0],
                        "target": [0.0, 30.0, 0.0],
                        "durationToNextSec": 5.0,
                        "fov": 50.0,
                        "label": "North Tower High-Angle"
                    },
                    {
                        "id": "wp-4",
                        "stepOrder": 4,
                        "position": [-200.0, 120.0, 40.0],
                        "target": [-10.0, 20.0, 0.0],
                        "durationToNextSec": 5.0,
                        "fov": 55.0,
                        "label": "West Commercial Boulevard"
                    }
                ]
            },
            "calibrationStatus": "CALIBRATED",
            "processingDurationMs": 3840,
            "reproducibilityHash": "sha256-e91b5c404d023f87b8d0092fa023e1",
            "createdAt": "2026-09-28T07:15:00Z",
            "updatedAt": now_str
        }

        # Initialize mock job status for the pipeline viewer
        self._jobs[demo_id] = {
            "id": f"job-{demo_id}",
            "analysisId": demo_id,
            "currentStage": "COMPLETED",
            "status": "SUCCEEDED",
            "progressPercentage": 100,
            "startedAt": "2026-09-28T07:15:00Z",
            "completedAt": "2026-09-28T07:15:04Z",
            "retryCount": 0,
            "maxRetries": 3,
            "workerNode": "worker-gpu-nv-04",
            "hardwareAccelerator": "NVIDIA RTX 4090 / TensorRT 10.1",
            "logs": [
                {"timestamp": "07:15:00.120", "stage": "IMAGE_UPLOAD", "level": "INFO", "message": "High-resolution satellite nadir imagery uploaded (1024x1024, RGB 8-bit)."},
                {"timestamp": "07:15:00.450", "stage": "IMAGE_PREPROCESSING", "level": "INFO", "message": "Georeference metadata verified. GSD estimated at 0.35m/px. Normalized CLAHE applied."},
                {"timestamp": "07:15:01.210", "stage": "AI_DEPTH_ESTIMATION", "level": "INFO", "message": "Depth-Anything-V2-Aerial inference completed in 760ms. Disparity field extracted."},
                {"timestamp": "07:15:01.980", "stage": "METRIC_CALIBRATION", "level": "INFO", "message": "Querying ESA Copernicus GLO-30 DEM. 48 GCP control points collected. RANSAC Huber fitting executed."},
                {"timestamp": "07:15:02.340", "stage": "METRIC_CALIBRATION", "level": "INFO", "message": "Optimal affine transform: Scale = 62.00, Offset = 14.00m. RMSE = 1.42m (HIGH confidence)."},
                {"timestamp": "07:15:02.890", "stage": "OBJECT_DETECTION", "level": "INFO", "message": "YOLOv8x instance segmentation found 10 urban building structures and road corridors."},
                {"timestamp": "07:15:03.200", "stage": "ELEVATION_MAP", "level": "INFO", "message": "Generating Metric DSM GeoTIFF. Elevation dynamic range: 12.5m to 74.2m AMSL."},
                {"timestamp": "07:15:03.650", "stage": "RECONSTRUCTION_3D", "level": "INFO", "message": "Constructing LOD2 3D continuous terrain mesh and building extrusions with UV texture mapping."},
                {"timestamp": "07:15:04.100", "stage": "FINAL_ANALYSIS", "level": "INFO", "message": "Integrity check passed. Measurements cataloged. Ready for geospatial review."}
            ]
        }

    def list_analyses(self) -> List[Dict[str, Any]]:
        return list(self._analyses.values())

    def get_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        return self._analyses.get(analysis_id)

    def get_job(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        return self._jobs.get(analysis_id)

    def run_calibration(self, req: CalibrationRequest) -> Dict[str, Any]:
        analysis = self._analyses.get(req.analysisId)
        if not analysis:
            raise KeyError(f"Analysis {req.analysisId} not found")

        disparities, dem_heights = MetricElevationCalibrator.generate_benchmark_control_points(req.minControlPoints * 4)
        calibrator = MetricElevationCalibrator(ransac_threshold_m=req.ransacIqrThreshold * 1.6)
        calib_stats = calibrator.fit_affine(disparities, dem_heights)

        # Update analysis calibration
        if "elevationResult" in analysis and analysis["elevationResult"]:
            analysis["elevationResult"]["calibration"]["referenceDatasetName"] = req.referenceDataset
            analysis["elevationResult"]["calibration"]["scaleFactor"] = calib_stats["scale"]
            analysis["elevationResult"]["calibration"]["offsetM"] = calib_stats["offset"]
            analysis["elevationResult"]["calibration"]["rmseMeters"] = calib_stats["rmseMeters"]
            analysis["elevationResult"]["calibration"]["maeMeters"] = calib_stats["maeMeters"]
            analysis["elevationResult"]["calibration"]["correlationPearson"] = calib_stats["pearsonCorrelation"]
            analysis["elevationResult"]["calibration"]["confidenceLevel"] = calib_stats["confidenceLevel"]
            analysis["elevationResult"]["calibration"]["scatterPoints"] = calib_stats["scatterPoints"]

        return calib_stats

    def add_measurement(self, meas: MeasurementCreate) -> Dict[str, Any]:
        analysis = self._analyses.get(meas.analysisId)
        if not analysis:
            raise KeyError(f"Analysis {meas.analysisId} not found")

        new_meas = {
            "id": f"meas-{uuid.uuid4().hex[:6]}",
            "analysisId": meas.analysisId,
            "objectId": meas.objectId,
            "title": meas.title,
            "measurementType": meas.measurementType,
            "value": round(meas.value, 2),
            "unit": meas.unit,
            "uncertaintyMargin": 0.45,
            "isEstimated": False,
            "geometryCoords": meas.geometryCoords,
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        if "measurements" not in analysis or analysis["measurements"] is None:
            analysis["measurements"] = []
        analysis["measurements"].append(new_meas)
        return new_meas

    def delete_measurement(self, analysis_id: str, measurement_id: str) -> bool:
        analysis = self._analyses.get(analysis_id)
        if not analysis or "measurements" not in analysis or not analysis["measurements"]:
            return False
        initial_len = len(analysis["measurements"])
        analysis["measurements"] = [m for m in analysis["measurements"] if m["id"] != measurement_id]
        return len(analysis["measurements"]) < initial_len

analysis_service = AnalysisService()
