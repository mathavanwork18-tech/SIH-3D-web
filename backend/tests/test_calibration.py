import pytest
import numpy as np
from backend.app.geo.calibration import MetricElevationCalibrator

def test_benchmark_control_points_generation():
    count = 40
    disparities, dem_heights = MetricElevationCalibrator.generate_benchmark_control_points(count)
    assert len(disparities) == count
    assert len(dem_heights) == count
    assert all(0.0 <= d <= 1.0 for d in disparities)
    assert all(h > 0 for h in dem_heights)

def test_fit_affine_recovers_synthetic_parameters():
    calibrator = MetricElevationCalibrator(ransac_iterations=200, residual_threshold_m=1.5)
    
    # Ground truth parameters: Z = 40 * d + 12
    true_alpha = 40.0
    true_beta = 12.0
    
    np.random.seed(42)
    disparities = np.linspace(0.1, 0.9, 50).tolist()
    dem_heights = [true_alpha * d + true_beta + np.random.normal(0, 0.2) for d in disparities]
    
    # Add a few severe outliers (e.g. tree canopies or cloud shadows)
    dem_heights[5] += 25.0
    dem_heights[15] -= 18.0
    dem_heights[30] += 30.0
    
    stats = calibrator.fit_affine(disparities, dem_heights)
    
    assert abs(stats["scale"] - true_alpha) < 2.0
    assert abs(stats["offset"] - true_beta) < 2.0
    assert stats["pearsonCorrelation"] > 0.80
    assert stats["rmseMeters"] < 5.0
    assert stats["inlierCount"] >= 40
    assert len(stats["scatterPoints"]) == 50

def test_calibration_fails_on_too_few_points():
    calibrator = MetricElevationCalibrator()
    with pytest.raises(ValueError, match="At least 4 control points required"):
        calibrator.fit_affine([0.2, 0.4], [15.0, 25.0])

def test_compute_metric_elevations():
    calibrator = MetricElevationCalibrator()
    calibrator.scale = 35.0
    calibrator.offset = 14.0
    
    disparities = np.array([0.0, 0.5, 1.0])
    elevations = calibrator.compute_metric_elevations(disparities)
    
    assert pytest.approx(elevations[0], 0.01) == 14.0
    assert pytest.approx(elevations[1], 0.01) == 31.5
    assert pytest.approx(elevations[2], 0.01) == 49.0
