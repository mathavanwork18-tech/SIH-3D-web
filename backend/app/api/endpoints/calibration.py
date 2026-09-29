from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.schemas.domain import CalibrationRequest
from backend.app.services.analysis_service import analysis_service

router = APIRouter()

@router.post("/recalibrate", response_model=Dict[str, Any])
def recalibrate_elevation(req: CalibrationRequest):
    """
    Rerun RANSAC Huber affine calibration with updated hyperparameters or DEM reference dataset.
    """
    try:
        results = analysis_service.run_calibration(req)
        return results
    except KeyError:
        raise HTTPException(status_code=404, detail="Analysis not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
