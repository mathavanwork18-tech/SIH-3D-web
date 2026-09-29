from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.schemas.domain import MeasurementCreate
from backend.app.services.analysis_service import analysis_service

router = APIRouter()

@router.post("", response_model=Dict[str, Any])
def create_measurement(req: MeasurementCreate):
    """Save an interactive 3D spatial measurement."""
    try:
        meas = analysis_service.add_measurement(req)
        return meas
    except KeyError:
        raise HTTPException(status_code=404, detail="Analysis not found")

@router.delete("/{analysis_id}/{measurement_id}")
def delete_measurement(analysis_id: str, measurement_id: str):
    """Delete a spatial measurement."""
    success = analysis_service.delete_measurement(analysis_id, measurement_id)
    if not success:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return {"status": "success", "deletedId": measurement_id}
