import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "DepthWizard API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DESCRIPTION: str = "SIH26175 - Monocular Depth Estimation, Metric Calibration & 3D Geospatial Reconstruction"
    
    # Storage & directories
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    DEMO_ASSETS_DIR: str = os.path.join(BASE_DIR, "frontend", "public", "demo")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Supabase (optional integration)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

settings = Settings()
