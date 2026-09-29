from fastapi import APIRouter, Response
import numpy as np
from backend.app.reconstruction.mesh_builder import MeshReconstructionEngine

router = APIRouter()

@router.get("/mesh/obj")
def get_obj_mesh():
    """Returns Wavefront OBJ 3D terrain surface mesh download."""
    # Synthetic terrain grid 64x64
    x = np.linspace(0, 1, 64)
    y = np.linspace(0, 1, 64)
    xx, yy = np.meshgrid(x, y)
    elevation = 14.0 + 35.0 * np.sin(xx * 3) * np.cos(yy * 2) + 10.0 * (1.0 - yy)
    obj_data = MeshReconstructionEngine.generate_obj_terrain(elevation, gsd_m=0.35)

    return Response(
        content=obj_data,
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=depthwizard_terrain_3d.obj"}
    )

@router.get("/mesh/metadata")
def get_mesh_metadata():
    """Metadata describing vertex counts and spatial bounding volumes."""
    return MeshReconstructionEngine.get_mesh_summary()
