from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.services.analysis_service import analysis_service

router = APIRouter()

@router.get("/jobs/{analysis_id}", response_model=Dict[str, Any])
def get_job_status(analysis_id: str):
    """Get real-time job execution state, stages, progress and logs."""
    job = analysis_service.get_job(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")
    return job
