from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.services.analysis_service import analysis_service

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def get_analyses():
    """Retrieve all available geospatial analyses."""
    return analysis_service.list_analyses()

@router.get("/{analysis_id}", response_model=Dict[str, Any])
def get_analysis_by_id(analysis_id: str):
    """Retrieve full details of a specific analysis."""
    analysis = analysis_service.get_analysis(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
