# SIH-3D-web

AI-powered 3D Urban Reconstruction and Metric Elevation Mapping from Satellite & Aerial Imagery.

## Features
- **Depth Estimation**: Monocular and stereo disparity estimation pipeline.
- **Metric Elevation Calibration**: RANSAC-based affine fitting to align relative disparities to metric Digital Elevation Models (DEM).
- **Urban Reconstruction**: 3D mesh generation and height-attribute extraction.
- **Interactive Visualization**: Three.js/WebGL frontend viewer with real-time analytics.

## Tech Stack
- **Backend**: FastAPI, PyTorch, NumPy, Pillow, OpenCV, Pytest
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Three.js, Lucide Icons
