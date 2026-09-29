import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.api.endpoints import analyses, calibration, measurements, pipeline, reconstruction, models

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount public demo assets directory if it exists
if os.path.exists(settings.DEMO_ASSETS_DIR):
    app.mount("/demo", StaticFiles(directory=settings.DEMO_ASSETS_DIR), name="demo")

# Include Routers
app.include_router(analyses.router, prefix="/api/analyses", tags=["Analyses"])
app.include_router(calibration.router, prefix="/api/calibration", tags=["Calibration"])
app.include_router(measurements.router, prefix="/api/measurements", tags=["Measurements"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Pipeline"])
app.include_router(reconstruction.router, prefix="/api/reconstruction", tags=["Reconstruction"])
app.include_router(models.router, prefix="/api/models", tags=["Models"])

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DepthWizard AI & Geospatial Core",
        "version": settings.VERSION,
        "cudaAvailable": False,
        "geospatialEngine": "Active (RANSAC Huber + Three.js LOD2)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
