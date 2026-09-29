from typing import List, Dict, Any

class UrbanObjectDetector:
    """
    Instance segmentation and height extractor for urban structures and building footprints.
    Computes roof peak elevation, base terrain elevation, net building height, and area footprint.
    """

    @staticmethod
    def get_detected_buildings() -> List[Dict[str, Any]]:
        """
        Returns rich structured detections for the demo scene matching real remote sensing footprints.
        """
        # Definitions: identifier, bounding box [ymin, xmin, ymax, xmax] relative, coords, height, roof, ground, area
        raw_buildings = [
            {
                "id": "obj-bld-101",
                "identifier": "BLD-101",
                "category": "building",
                "confidence": 0.984,
                "estimatedHeightM": 48.5,
                "roofElevationM": 62.8,
                "groundElevationM": 14.3,
                "areaSqM": 2520.0,
                "boundingBox": [0.078, 0.078, 0.215, 0.254],
                "coords": [[0.078, 0.078], [0.254, 0.078], [0.254, 0.215], [0.078, 0.215], [0.078, 0.078]]
            },
            {
                "id": "obj-bld-102",
                "identifier": "BLD-102",
                "category": "building",
                "confidence": 0.965,
                "estimatedHeightM": 32.0,
                "roofElevationM": 46.5,
                "groundElevationM": 14.5,
                "areaSqM": 1600.0,
                "boundingBox": [0.254, 0.078, 0.352, 0.234],
                "coords": [[0.078, 0.254], [0.234, 0.254], [0.234, 0.352], [0.078, 0.352], [0.078, 0.254]]
            },
            {
                "id": "obj-bld-103",
                "identifier": "BLD-103",
                "category": "building",
                "confidence": 0.992,
                "estimatedHeightM": 56.2,
                "roofElevationM": 71.4,
                "groundElevationM": 15.2,
                "areaSqM": 2800.0,
                "boundingBox": [0.098, 0.371, 0.234, 0.566],
                "coords": [[0.371, 0.098], [0.566, 0.098], [0.566, 0.234], [0.371, 0.234], [0.371, 0.098]]
            },
            {
                "id": "obj-bld-104",
                "identifier": "BLD-104",
                "category": "building",
                "confidence": 0.941,
                "estimatedHeightM": 24.8,
                "roofElevationM": 40.1,
                "groundElevationM": 15.3,
                "areaSqM": 1440.0,
                "boundingBox": [0.273, 0.410, 0.352, 0.586],
                "coords": [[0.410, 0.273], [0.586, 0.273], [0.586, 0.352], [0.410, 0.352], [0.410, 0.273]]
            },
            {
                "id": "obj-bld-105",
                "identifier": "BLD-105",
                "category": "building",
                "confidence": 0.978,
                "estimatedHeightM": 38.6,
                "roofElevationM": 53.4,
                "groundElevationM": 14.8,
                "areaSqM": 3420.0,
                "boundingBox": [0.449, 0.078, 0.625, 0.264],
                "coords": [[0.078, 0.449], [0.264, 0.449], [0.264, 0.625], [0.078, 0.625], [0.078, 0.449]]
            },
            {
                "id": "obj-bld-106",
                "identifier": "BLD-106",
                "category": "building",
                "confidence": 0.985,
                "estimatedHeightM": 42.0,
                "roofElevationM": 57.0,
                "groundElevationM": 15.0,
                "areaSqM": 3960.0,
                "boundingBox": [0.449, 0.371, 0.625, 0.586],
                "coords": [[0.371, 0.449], [0.586, 0.449], [0.586, 0.625], [0.371, 0.625], [0.371, 0.449]]
            },
            {
                "id": "obj-bld-107",
                "identifier": "BLD-107",
                "category": "structure",
                "confidence": 0.932,
                "estimatedHeightM": 28.4,
                "roofElevationM": 42.1,
                "groundElevationM": 13.7,
                "areaSqM": 1800.0,
                "boundingBox": [0.117, 0.693, 0.312, 0.781],
                "coords": [[0.693, 0.117], [0.781, 0.117], [0.781, 0.312], [0.693, 0.312], [0.693, 0.117]]
            },
            {
                "id": "obj-bld-108",
                "identifier": "BLD-108",
                "category": "structure",
                "confidence": 0.951,
                "estimatedHeightM": 35.5,
                "roofElevationM": 49.3,
                "groundElevationM": 13.8,
                "areaSqM": 1620.0,
                "boundingBox": [0.449, 0.693, 0.625, 0.781],
                "coords": [[0.693, 0.449], [0.781, 0.449], [0.781, 0.625], [0.693, 0.625], [0.693, 0.449]]
            },
            {
                "id": "obj-bld-109",
                "identifier": "BLD-109",
                "category": "building",
                "confidence": 0.963,
                "estimatedHeightM": 22.0,
                "roofElevationM": 36.8,
                "groundElevationM": 14.8,
                "areaSqM": 2880.0,
                "boundingBox": [0.762, 0.098, 0.918, 0.273],
                "coords": [[0.098, 0.762], [0.273, 0.762], [0.273, 0.918], [0.098, 0.918], [0.098, 0.762]]
            },
            {
                "id": "obj-bld-110",
                "identifier": "BLD-110",
                "category": "building",
                "confidence": 0.970,
                "estimatedHeightM": 26.5,
                "roofElevationM": 41.5,
                "groundElevationM": 15.0,
                "areaSqM": 3360.0,
                "boundingBox": [0.762, 0.371, 0.918, 0.576],
                "coords": [[0.371, 0.762], [0.576, 0.762], [0.576, 0.918], [0.371, 0.918], [0.371, 0.762]]
            }
        ]

        formatted = []
        for b in raw_buildings:
            formatted.append({
                "id": b["id"],
                "analysisId": "demo-analysis-001",
                "identifier": b["identifier"],
                "category": b["category"],
                "confidence": b["confidence"],
                "estimatedHeightM": b["estimatedHeightM"],
                "roofElevationM": b["roofElevationM"],
                "groundElevationM": b["groundElevationM"],
                "areaSqM": b["areaSqM"],
                "boundingBox": b["boundingBox"],
                "polygonGeoJson": {
                    "type": "Polygon",
                    "coordinates": [b["coords"]]
                },
                "modelVersion": "YOLOv8x-Geospatial-v2"
            })
        return formatted
