from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_registered_models():
    """List AI foundation models available in DepthWizard registry."""
    return [
        {
            "id": "mod-01",
            "name": "Depth-Anything-V2-Aerial",
            "version": "2.0.0",
            "task": "depth_estimation",
            "provider": "Depth-Anything / Hugging Face",
            "license": "Apache-2.0",
            "isActive": True,
            "description": "State-of-the-art monocular depth estimation foundation model specialized for remote sensing."
        },
        {
            "id": "mod-02",
            "name": "MiDaS-v3.1-DPT-Large",
            "version": "3.1.0",
            "task": "depth_estimation",
            "provider": "Intel ISL",
            "license": "MIT",
            "isActive": True,
            "description": "Dense prediction transformer baseline for relative disparity extraction."
        },
        {
            "id": "mod-03",
            "name": "Urban-Building-Segmenter-YOLOv8x",
            "version": "8.2.0",
            "task": "object_detection",
            "provider": "Ultralytics",
            "license": "AGPL-3.0",
            "isActive": True,
            "description": "Instance polygon segmentation for building rooftops and infrastructure."
        },
        {
            "id": "mod-04",
            "name": "Robust-Affine-DEM-Calibrator",
            "version": "1.4.2",
            "task": "height_calibration",
            "provider": "DepthWizard Geospatial Lab",
            "license": "Open Research",
            "isActive": True,
            "description": "RANSAC Huber-loss affine calibrator resolving scale-shift ambiguity against reference DEMs."
        }
    ]
