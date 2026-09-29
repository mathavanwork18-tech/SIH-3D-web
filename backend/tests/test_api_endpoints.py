import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "DepthWizard" in data["service"]

def test_list_analyses_endpoint():
    response = client.get("/api/analyses")
    assert response.status_code == 200
    analyses = response.json()
    assert isinstance(analyses, list)
    assert len(analyses) > 0
    assert analyses[0]["id"] == "demo-analysis-001"

def test_get_analysis_by_id():
    response = client.get("/api/analyses/demo-analysis-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "demo-analysis-001"
    assert "metadata" in data
    assert "elevationResult" in data
    assert len(data["detectedObjects"]) > 0

def test_get_analysis_not_found():
    response = client.get("/api/analyses/non-existent-id")
    assert response.status_code == 404

def test_models_catalog_endpoint():
    response = client.get("/api/models")
    assert response.status_code == 200
    models = response.json()
    assert len(models) >= 3
    model_names = [m["name"] for m in models]
    assert "Depth-Anything-V2-Aerial" in model_names

def test_pipeline_job_status_endpoint():
    response = client.get("/api/pipeline/jobs/demo-analysis-001")
    assert response.status_code == 200
    job = response.json()
    assert job["status"] in ["SUCCEEDED", "COMPLETED"]
    assert job["progressPercentage"] == 100
    assert len(job["logs"]) > 0

def test_reconstruction_obj_download():
    response = client.get("/api/reconstruction/mesh/obj?analysisId=demo-analysis-001")
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    assert "# DepthWizard 3D Metric Terrain Mesh" in response.text

def test_recalibration_endpoint():
    req_body = {
        "analysisId": "demo-analysis-001",
        "referenceDataset": "Copernicus GLO-30 DEM",
        "method": "DEM_AFFINE_ROBUST",
        "ransacIqrThreshold": 1.8,
        "minControlPoints": 12
    }
    response = client.post("/api/calibration/recalibrate", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert "scale" in data
    assert "offset" in data
    assert "rmseMeters" in data

def test_measurements_crud_flow():
    # 1. Create measurement
    meas_payload = {
        "analysisId": "demo-analysis-001",
        "title": "Test Tower Height Check",
        "measurementType": "height",
        "value": 42.5,
        "unit": "m",
        "uncertaintyMargin": 0.35,
        "isEstimated": False,
        "geometryCoords": [[10.0, 20.0], [10.0, 62.5]]
    }
    create_res = client.post("/api/measurements", json=meas_payload)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["title"] == "Test Tower Height Check"
    meas_id = created["id"]
    
    # 2. Delete measurement
    del_res = client.delete(f"/api/measurements/demo-analysis-001/{meas_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deletedId"] == meas_id
