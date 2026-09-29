import numpy as np
from backend.app.reconstruction.mesh_builder import MeshReconstructionEngine

def test_generate_obj_terrain_produces_valid_wavefront():
    # 128x128 elevation grid
    grid = np.full((128, 128), 22.5, dtype=np.float32)
    # Add a hill in center
    grid[40:80, 40:80] += 15.0
    
    obj_str = MeshReconstructionEngine.generate_obj_terrain(grid, gsd_m=0.35)
    
    assert "# DepthWizard 3D Metric Terrain Mesh" in obj_str
    assert "v " in obj_str
    assert "vt " in obj_str
    assert "vn " in obj_str
    assert "f " in obj_str
    
    lines = obj_str.strip().split("\n")
    vertex_lines = [l for l in lines if l.startswith("v ")]
    face_lines = [l for l in lines if l.startswith("f ")]
    
    assert len(vertex_lines) > 0
    assert len(face_lines) > 0

def test_mesh_summary():
    summary = MeshReconstructionEngine.get_mesh_summary()
    assert "vertexCount" in summary
    assert "triangleCount" in summary
    assert "format" in summary
    assert summary["format"] == "Wavefront OBJ + GLTF LOD2"
