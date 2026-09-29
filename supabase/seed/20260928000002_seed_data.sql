-- DEPTHWIZARD — SIH26175 Seed Data
-- Registered AI models, reference datasets, and benchmark control data

-- 1. Insert Pretrained Monocular Depth & Elevation Models
INSERT INTO public.model_registry (id, name, version, task, provider, license, supported_inputs, expected_output, default_preprocessing, is_active, is_demo_fallback, description)
VALUES 
    (
        '10000000-0000-0000-0000-000000000001',
        'MiDaS-v3.1-DPT-Large',
        '3.1.0',
        'depth_estimation',
        'Intel ISL / Hugging Face',
        'MIT',
        ARRAY['image/jpeg', 'image/png', 'image/tiff'],
        'relative_inverse_depth_raster_float32',
        '{"resize_dimensions": [384, 384], "normalize_mean": [0.485, 0.456, 0.406], "normalize_std": [0.229, 0.224, 0.225]}'::jsonb,
        TRUE,
        TRUE,
        'Baseline monocular depth estimation network fine-tuned with vision transformers for dense disparity maps.'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'Depth-Anything-V2-Aerial',
        '2.0.0',
        'depth_estimation',
        'Depth-Anything Team / HF',
        'Apache 2.0',
        ARRAY['image/jpeg', 'image/png', 'image/tiff', 'image/geotiff'],
        'relative_depth_raster_float32',
        '{"resize_dimensions": [518, 518], "edge_preservation": true}'::jsonb,
        TRUE,
        FALSE,
        'High-resolution monocular depth foundation model adapted for nadir and oblique aerial perspectives.'
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'Urban-Building-Segmenter-YOLOv8x',
        '8.2.0',
        'object_detection',
        'Ultralytics / SIH Geospatial',
        'AGPL-3.0',
        ARRAY['image/jpeg', 'image/png', 'image/tiff'],
        'geojson_footprint_polygons',
        '{"conf_threshold": 0.35, "iou_threshold": 0.45}'::jsonb,
        TRUE,
        TRUE,
        'Instance segmentation engine for building footprints, road vectors, and urban canopy from high-res remote sensing.'
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'Robust-Affine-DEM-Calibrator',
        '1.4.2',
        'height_calibration',
        'DepthWizard Scientific Engine',
        'Proprietary / Open Research',
        ARRAY['application/x-raster-array'],
        'metric_height_surface_dem',
        '{"outlier_rejection_iqr": 1.5, "min_control_points": 8}'::jsonb,
        TRUE,
        TRUE,
        'RANSAC and Huber-loss robust regression calibrator mapping relative monocular depth to metric orthometric height.'
    )
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Reference Datasets (Public DEMs for GCP alignment)
INSERT INTO public.reference_datasets (id, name, source, dataset_type, horizontal_crs, vertical_datum, nominal_resolution_m, vertical_accuracy_m, license, attribution, is_active)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        'Copernicus GLO-30 DEM',
        'European Space Agency (ESA)',
        'DEM_COP30',
        'EPSG:4326',
        'EGM2008 Geoid',
        30.00,
        2.00,
        'Open Access (Free for scientific & commercial use)',
        '© ESA Copernicus Earth Observation Programme',
        TRUE
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'ALOS World 3D (AW3D30)',
        'JAXA',
        'DEM_ALOS',
        'EPSG:4326',
        'EGM96 Geoid',
        30.00,
        5.00,
        'JAXA Open Data Policy',
        '© Japan Aerospace Exploration Agency (JAXA)',
        TRUE
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'ISRO Cartosat-1 DEM',
        'ISRO / Bhuvan',
        'LIDAR_GCP',
        'EPSG:4326',
        'WGS84 Ellipsoid',
        10.00,
        3.00,
        'ISRO Open Data Portal',
        '© Indian Space Research Organisation (ISRO)',
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
