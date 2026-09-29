# DepthWizard — Pipeline Execution & Operations Guide

## 1. Quickstart: Running DepthWizard Locally

### 1.1 Start FastAPI Backend Server
```bash
# From workspace root
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 1.2 Start Frontend Client
```bash
cd frontend
npm run dev
```
- Frontend application URL: `http://localhost:5173`

---

## 2. Nine-Stage Asynchronous Pipeline Workflow

```
[1. IMAGE_UPLOAD]
       │  (File integrity check, GSD verification, CRS validation)
       ▼
[2. IMAGE_PREPROCESSING]
       │  (CLAHE contrast adjustment, tile decomposition)
       ▼
[3. AI_DEPTH_ESTIMATION]
       │  (Depth-Anything-V2-Aerial forward inference -> 32-bit Disparity Map)
       ▼
[4. METRIC_CALIBRATION]
       │  (Copernicus GLO-30 / ALOS DEM matching + RANSAC Huber regression)
       ▼
[5. OBJECT_DETECTION]
       │  (YOLOv8x instance segmentation -> Rooftop & Building polygons)
       ▼
[6. ELEVATION_MAP]
       │  (Generation of metric DSM GeoTIFF in EPSG:4326 / EGM2008)
       ▼
[7. RECONSTRUCTION_3D]
       │  (LOD2 3D mesh synthesis, continuous terrain + building extrusions)
       ▼
[8. FINAL_ANALYSIS]
       │  (Accuracy validation, RMSE computation, reproducibility hash)
       ▼
[9. COMPLETED]
          (Artifacts published to interactive 3D WebGL viewport)
```

---

## 3. REST API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health & system accelerator status |
| `GET` | `/api/analyses` | List all cataloged remote sensing analyses |
| `GET` | `/api/analyses/{id}` | Detailed analysis metadata, elevations, objects |
| `POST` | `/api/calibration/recalibrate` | Re-run RANSAC affine fitting with customized IQR cutoff |
| `POST` | `/api/measurements` | Store 3D laser distance / height caliper readings |
| `DELETE` | `/api/measurements/{analysisId}/{id}` | Remove measurement annotation |
| `GET` | `/api/pipeline/jobs/{analysisId}` | Real-time state machine progress & streaming logs |
| `GET` | `/api/reconstruction/mesh/obj` | Download 3D Wavefront OBJ terrain mesh |
| `GET` | `/api/models` | List active AI foundation models & licenses |
