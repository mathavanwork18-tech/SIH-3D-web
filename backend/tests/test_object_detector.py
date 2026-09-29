from backend.app.ai.object_detector import UrbanObjectDetector

def test_urban_object_detector_returns_buildings():
    buildings = UrbanObjectDetector.get_detected_buildings()
    assert len(buildings) >= 6
    for b in buildings:
        assert "id" in b
        assert "identifier" in b
        assert "estimatedHeightM" in b
        assert "roofElevationM" in b
        assert "groundElevationM" in b
        assert "areaSqM" in b
        assert "boundingBox" in b
        
        # Test height integrity: Roof elevation = Ground elevation + Net height
        expected_height = b["roofElevationM"] - b["groundElevationM"]
        assert abs(b["estimatedHeightM"] - expected_height) < 0.2
        assert b["estimatedHeightM"] > 0
        assert b["areaSqM"] > 0
        assert b["confidence"] >= 0.90
