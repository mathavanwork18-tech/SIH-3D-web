-- DEPTHWIZARD — SIH26175 Production-Quality Database Migration
-- PostgreSQL with PostGIS for Satellite AI Depth, Metric Elevation, and 3D Geospatial Reconstruction

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    organization TEXT DEFAULT 'Geospatial Research Lab',
    role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('analyst', 'senior_analyst', 'admin', 'system')),
    storage_quota_bytes BIGINT NOT NULL DEFAULT 5368709120, -- 5 GB default
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
    preferred_units TEXT NOT NULL DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
    preferred_crs TEXT NOT NULL DEFAULT 'EPSG:4326',
    default_elevation_color_ramp TEXT NOT NULL DEFAULT 'viridis',
    default_depth_color_ramp TEXT NOT NULL DEFAULT 'plasma',
    render_quality TEXT NOT NULL DEFAULT 'high' CHECK (render_quality IN ('low', 'medium', 'high', 'ultra')),
    enable_shadows BOOLEAN NOT NULL DEFAULT FALSE,
    notification_email BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Model registry table
CREATE TABLE IF NOT EXISTS public.model_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    task TEXT NOT NULL CHECK (task IN ('depth_estimation', 'height_calibration', 'object_detection', 'elevation_dsm', 'reconstruction')),
    provider TEXT NOT NULL,
    license TEXT NOT NULL,
    supported_inputs TEXT[] NOT NULL DEFAULT ARRAY['image/jpeg', 'image/png', 'image/tiff'],
    expected_output TEXT NOT NULL,
    default_preprocessing JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_demo_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_name_version UNIQUE (name, version)
);

-- 4. Reference datasets table (for metric height calibration truth / ground control)
CREATE TABLE IF NOT EXISTS public.reference_datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    dataset_type TEXT NOT NULL CHECK (dataset_type IN ('DEM_SRTM', 'DEM_ALOS', 'DEM_COP30', 'LIDAR_GCP', 'SYNTHETIC_BENCHMARK')),
    spatial_extent GEOMETRY(Polygon, 4326),
    horizontal_crs TEXT NOT NULL DEFAULT 'EPSG:4326',
    vertical_datum TEXT NOT NULL DEFAULT 'EGM96 / WGS84 Ellipsoid',
    nominal_resolution_m NUMERIC(8,2) NOT NULL DEFAULT 30.0,
    vertical_accuracy_m NUMERIC(8,2) NOT NULL DEFAULT 4.0,
    license TEXT NOT NULL DEFAULT 'Open / Public Domain',
    attribution TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    location_label TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'UPLOADED', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    footprint GEOMETRY(Polygon, 4326),
    centroid GEOMETRY(Point, 4326),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    image_width INTEGER,
    image_height INTEGER,
    ground_sample_distance_m NUMERIC(8, 4),
    crs TEXT DEFAULT 'EPSG:4326',
    color_bands INTEGER DEFAULT 3,
    preprocessing_version TEXT DEFAULT 'v1.0.0',
    depth_model_id UUID REFERENCES public.model_registry(id),
    calibration_status TEXT NOT NULL DEFAULT 'NOT_REQUIRED' CHECK (calibration_status IN ('NOT_REQUIRED', 'UNAVAILABLE', 'ESTIMATED', 'CALIBRATED', 'VALIDATED')),
    error_message TEXT,
    error_code TEXT,
    processing_duration_ms INTEGER,
    reproducibility_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Analysis files & artifacts table
CREATE TABLE IF NOT EXISTS public.analysis_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL CHECK (file_type IN (
        'ORIGINAL_IMAGE', 'THUMBNAIL', 'DEPTH_NUMERICAL', 'DEPTH_VISUAL',
        'ELEVATION_NUMERICAL', 'ELEVATION_VISUAL', 'OBJECT_MASK', 'OBJECT_GEOJSON',
        'DSM_GEOTIFF', 'MESH_GLB', 'MESH_GLTF', 'REPORT_PDF', 'MEASUREMENTS_CSV'
    )),
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    checksum_sha256 TEXT,
    status TEXT NOT NULL DEFAULT 'READY' CHECK (status IN ('PENDING', 'READY', 'FAILED', 'EXPIRED')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Processing jobs state machine table
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    current_stage TEXT NOT NULL DEFAULT 'QUEUED' CHECK (current_stage IN (
        'QUEUED', 'IMAGE_UPLOAD', 'IMAGE_PREPROCESSING', 'AI_DEPTH_ESTIMATION',
        'METRIC_CALIBRATION', 'OBJECT_DETECTION', 'ELEVATION_MAP', 'RECONSTRUCTION_3D', 'FINAL_ANALYSIS', 'COMPLETED', 'FAILED'
    )),
    status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'RETRYING')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    error_code TEXT,
    error_message TEXT,
    worker_node TEXT,
    hardware_accelerator TEXT DEFAULT 'CPU',
    execution_stats JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Depth estimation results
CREATE TABLE IF NOT EXISTS public.depth_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE UNIQUE,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    min_relative_depth NUMERIC(10, 4) NOT NULL,
    max_relative_depth NUMERIC(10, 4) NOT NULL,
    mean_relative_depth NUMERIC(10, 4) NOT NULL,
    std_relative_depth NUMERIC(10, 4) NOT NULL,
    histogram JSONB DEFAULT '[]'::jsonb,
    uncertainty_estimated BOOLEAN NOT NULL DEFAULT FALSE,
    relative_depth_artifact_id UUID REFERENCES public.analysis_files(id),
    visual_artifact_id UUID REFERENCES public.analysis_files(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Metric calibration records
CREATE TABLE IF NOT EXISTS public.calibration_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    reference_dataset_id UUID REFERENCES public.reference_datasets(id),
    calibration_method TEXT NOT NULL CHECK (calibration_method IN ('DEM_AFFINE_ROBUST', 'GCP_CONTROL_POINTS', 'KNOWN_HEIGHT_PRIOR', 'SYNTHETIC_BENCHMARK')),
    scale_factor NUMERIC(12, 6) NOT NULL,
    offset_m NUMERIC(12, 4) NOT NULL,
    sample_points_count INTEGER NOT NULL DEFAULT 0,
    rmse_meters NUMERIC(8, 4),
    mae_meters NUMERIC(8, 4),
    correlation_pearson NUMERIC(6, 4),
    confidence_level TEXT NOT NULL CHECK (confidence_level IN ('LOW', 'MEDIUM', 'HIGH', 'SURVEY_GRADE_INVALID')),
    residuals_distribution JSONB DEFAULT '{}'::jsonb,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Elevation results
CREATE TABLE IF NOT EXISTS public.elevation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE UNIQUE,
    calibration_record_id UUID REFERENCES public.calibration_records(id),
    is_metric BOOLEAN NOT NULL DEFAULT FALSE,
    min_elevation_m NUMERIC(10, 2) NOT NULL,
    max_elevation_m NUMERIC(10, 2) NOT NULL,
    mean_elevation_m NUMERIC(10, 2) NOT NULL,
    height_range_m NUMERIC(10, 2) NOT NULL,
    vertical_datum TEXT NOT NULL DEFAULT 'Relative / Local Ground',
    valid_pixel_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    histogram JSONB DEFAULT '[]'::jsonb,
    dsm_artifact_id UUID REFERENCES public.analysis_files(id),
    visual_artifact_id UUID REFERENCES public.analysis_files(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Detected objects table (building footprints, roads, vegetation)
CREATE TABLE IF NOT EXISTS public.detected_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    object_identifier TEXT NOT NULL, -- e.g. BLD-001
    category TEXT NOT NULL CHECK (category IN ('building', 'road', 'vegetation', 'water', 'vehicle', 'structure')),
    confidence NUMERIC(5, 4) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    estimated_height_m NUMERIC(8, 2),
    roof_elevation_m NUMERIC(8, 2),
    ground_elevation_m NUMERIC(8, 2),
    area_sq_m NUMERIC(10, 2),
    bounding_box JSONB NOT NULL, -- [ymin, xmin, ymax, xmax]
    polygon_geojson JSONB NOT NULL, -- GeoJSON polygon
    geometry GEOMETRY(Polygon, 4326),
    model_version TEXT NOT NULL DEFAULT 'v1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Measurements table
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    object_id UUID REFERENCES public.detected_objects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    measurement_type TEXT NOT NULL CHECK (measurement_type IN ('height', 'horizontal_distance', 'polygon_area', 'elevation_difference')),
    value NUMERIC(12, 4) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'm' CHECK (unit IN ('m', 'm2', 'ft', 'ft2')),
    uncertainty_margin NUMERIC(8, 4),
    is_estimated BOOLEAN NOT NULL DEFAULT TRUE,
    geometry_coords JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Flythroughs & Waypoints
CREATE TABLE IF NOT EXISTS public.flythroughs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Standard Orbital Flythrough',
    mode TEXT NOT NULL DEFAULT 'fly' CHECK (mode IN ('orbit', 'fly', 'walk')),
    total_duration_sec NUMERIC(6, 2) NOT NULL DEFAULT 30.0,
    loop_animation BOOLEAN NOT NULL DEFAULT TRUE,
    camera_speed NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flythrough_waypoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flythrough_id UUID NOT NULL REFERENCES public.flythroughs(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    position_x NUMERIC(10, 4) NOT NULL,
    position_y NUMERIC(10, 4) NOT NULL,
    position_z NUMERIC(10, 4) NOT NULL,
    target_x NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    target_y NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    target_z NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    duration_to_next_sec NUMERIC(6, 2) NOT NULL DEFAULT 5.0,
    fov NUMERIC(5, 2) NOT NULL DEFAULT 45.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Comparison results table
CREATE TABLE IF NOT EXISTS public.comparison_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    analysis_a_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    analysis_b_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    alignment_status TEXT NOT NULL CHECK (alignment_status IN ('ALIGNED', 'TRANSFORMED', 'INCOMPATIBLE_CRS')),
    mean_elevation_diff_m NUMERIC(8, 3),
    max_elevation_diff_m NUMERIC(8, 3),
    structures_count_delta INTEGER,
    difference_artifact_id UUID REFERENCES public.analysis_files(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'GENERATING', 'READY', 'FAILED')),
    pdf_artifact_id UUID REFERENCES public.analysis_files(id),
    metrics_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. System logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
    job_id UUID REFERENCES public.processing_jobs(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    level TEXT NOT NULL CHECK (level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    stage TEXT,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON public.analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_footprint ON public.analyses USING GIST (footprint);
CREATE INDEX IF NOT EXISTS idx_analyses_centroid ON public.analyses USING GIST (centroid);

CREATE INDEX IF NOT EXISTS idx_analysis_files_analysis_id ON public.analysis_files(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analysis_files_file_type ON public.analysis_files(file_type);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_analysis_id ON public.processing_jobs(analysis_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON public.processing_jobs(status);

CREATE INDEX IF NOT EXISTS idx_detected_objects_analysis_id ON public.detected_objects(analysis_id);
CREATE INDEX IF NOT EXISTS idx_detected_objects_category ON public.detected_objects(category);
CREATE INDEX IF NOT EXISTS idx_detected_objects_geometry ON public.detected_objects USING GIST (geometry);

CREATE INDEX IF NOT EXISTS idx_measurements_analysis_id ON public.measurements(analysis_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_job_id ON public.system_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Enable Row Level Security (RLS) on all user-accessible tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depth_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elevation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detected_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flythroughs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flythrough_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Model registry & reference datasets are public read
ALTER TABLE public.model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read model registry" ON public.model_registry FOR SELECT USING (true);
CREATE POLICY "Public read reference datasets" ON public.reference_datasets FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can read own profile or admin reads all" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Settings policies
CREATE POLICY "Users manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users read own analyses or public demo analyses" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id OR is_demo = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users insert own analyses" ON public.analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own analyses" ON public.analyses
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own analyses" ON public.analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Analysis files policies
CREATE POLICY "Users access own analysis files or demo files" ON public.analysis_files
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = analysis_files.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

-- Processing jobs policies
CREATE POLICY "Users access own processing jobs" ON public.processing_jobs
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = processing_jobs.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

-- Sub-analysis entities policies (Depth, Calibration, Elevation, Objects, Measurements, Reports, Flythroughs)
CREATE POLICY "Users access own depth results" ON public.depth_results
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = depth_results.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own calibration records" ON public.calibration_records
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = calibration_records.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own elevation results" ON public.elevation_results
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = elevation_results.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own detected objects" ON public.detected_objects
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = detected_objects.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own measurements" ON public.measurements
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = measurements.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own reports" ON public.reports
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = reports.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own flythroughs" ON public.flythroughs
    FOR ALL USING (EXISTS (SELECT 1 FROM public.analyses WHERE id = flythroughs.analysis_id AND (user_id = auth.uid() OR is_demo = true)));

CREATE POLICY "Users access own flythrough waypoints" ON public.flythrough_waypoints
    FOR ALL USING (EXISTS (SELECT 1 FROM public.flythroughs f JOIN public.analyses a ON f.analysis_id = a.id WHERE f.id = flythrough_waypoints.flythrough_id AND (a.user_id = auth.uid() OR a.is_demo = true)));

CREATE POLICY "Users access own comparisons" ON public.comparison_results
    FOR ALL USING (user_id = auth.uid());
