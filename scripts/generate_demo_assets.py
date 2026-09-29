#!/usr/bin/env python3
"""
DepthWizard — Demo Asset Generator
Generates high-resolution synthetic geospatial aerial scene,
calibrated depth array, and metric elevation map visualizations.
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def generate_demo_assets(output_dir="frontend/public/demo"):
    os.makedirs(output_dir, exist_ok=True)
    w, h = 1024, 1024
    
    # 1. Generate Synthetic Satellite Aerial RGB Image
    # Base terrain (soil, grass, coastal water gradient)
    np.random.seed(42)
    x = np.linspace(0, 1, w)
    y = np.linspace(0, 1, h)
    xx, yy = np.meshgrid(x, y)
    
    # Base land texture
    land_r = 45 + 30 * np.sin(xx * 6) + 15 * np.cos(yy * 8) + np.random.normal(0, 5, (h, w))
    land_g = 70 + 40 * np.sin(xx * 5) + 20 * np.cos(yy * 7) + np.random.normal(0, 6, (h, w))
    land_b = 40 + 20 * np.sin(xx * 7) + np.random.normal(0, 4, (h, w))
    
    # Water body on the right edge
    water_mask = (xx > 0.82)
    land_r[water_mask] = 18 + np.random.normal(0, 2, np.sum(water_mask))
    land_g[water_mask] = 45 + np.random.normal(0, 3, np.sum(water_mask))
    land_b[water_mask] = 78 + np.random.normal(0, 4, np.sum(water_mask))
    
    rgb = np.stack([
        np.clip(land_r, 0, 255).astype(np.uint8),
        np.clip(land_g, 0, 255).astype(np.uint8),
        np.clip(land_b, 0, 255).astype(np.uint8)
    ], axis=-1)
    
    img = Image.fromarray(rgb)
    draw = ImageDraw.Draw(img)
    
    # Draw roads (asphalt gray)
    road_color = (65, 72, 80)
    draw.line([(0, 400), (840, 400)], fill=road_color, width=28)
    draw.line([(0, 720), (840, 720)], fill=road_color, width=24)
    draw.line([(320, 0), (320, 1024)], fill=road_color, width=26)
    draw.line([(650, 0), (650, 1024)], fill=road_color, width=22)
    
    # Road markings (yellow dashes)
    for rx in range(0, 840, 30):
        draw.line([(rx, 400), (rx + 16, 400)], fill=(215, 190, 60), width=2)
        draw.line([(rx, 720), (rx + 16, 720)], fill=(215, 190, 60), width=2)
    for ry in range(0, 1024, 30):
        draw.line([(320, ry), (320, ry + 16)], fill=(215, 190, 60), width=2)
        draw.line([(650, ry), (650, ry + 16)], fill=(215, 190, 60), width=2)

    # Buildings definitions: [id, x1, y1, x2, y2, height_m, roof_color]
    buildings = [
        ("BLD-101", 80, 80, 260, 220, 48.5, (180, 195, 205)),   # Tower North-West
        ("BLD-102", 80, 260, 240, 360, 32.0, (195, 180, 170)),  # Commercial Block
        ("BLD-103", 380, 100, 580, 240, 56.2, (210, 220, 230)), # Highrise Center
        ("BLD-104", 420, 280, 600, 360, 24.8, (160, 175, 185)), # Plaza Annex
        ("BLD-105", 80, 460, 270, 640, 38.6, (190, 195, 185)),  # Complex West
        ("BLD-106", 380, 460, 600, 640, 42.0, (175, 185, 200)), # Central Hub
        ("BLD-107", 710, 120, 800, 320, 28.4, (200, 190, 180)), # East Coastline Facility
        ("BLD-108", 710, 460, 800, 640, 35.5, (185, 195, 210)), # Maritime Terminal
        ("BLD-109", 100, 780, 280, 940, 22.0, (170, 180, 170)), # South Residential A
        ("BLD-110", 380, 780, 590, 940, 26.5, (180, 175, 190)), # South Residential B
    ]
    
    # Draw shadow and roof for each building
    for b in buildings:
        _, x1, y1, x2, y2, h_m, color = b
        # Shadow offset based on height (sun azimuth 315 deg)
        s_off = int(h_m * 0.45)
        draw.rectangle([x1 + s_off, y1 + s_off, x2 + s_off, y2 + s_off], fill=(20, 24, 28, 220))
        # Building roof
        draw.rectangle([x1, y1, x2, y2], fill=color, outline=(90, 105, 120), width=2)
        # Rooftop HVAC / structure details
        mx, my = (x1 + x2) // 2, (y1 + y2) // 2
        draw.rectangle([mx - 15, my - 15, mx + 15, my + 15], fill=(130, 140, 150), outline=(80, 90, 100))
        
    satellite_path = os.path.join(output_dir, "satellite_scene.png")
    img.save(satellite_path, "PNG")
    print(f"Saved satellite image: {satellite_path}")
    
    # 2. Generate Ground Truth & Calibrated Depth Map
    # Depth raster (normalized relative disparity 0.0 to 1.0)
    depth_arr = np.zeros((h, w), dtype=np.float32)
    # Background terrain slope
    depth_arr = 0.25 + 0.15 * (1.0 - yy) + 0.05 * np.sin(xx * 4)
    # Water has low relative height
    depth_arr[water_mask] = 0.12
    
    for b in buildings:
        _, x1, y1, x2, y2, h_m, _ = b
        # Disparity increases with closer / taller structures
        depth_val = 0.35 + (h_m / 65.0) * 0.60
        depth_arr[y1:y2, x1:x2] = depth_val
        
    # Smooth edges slightly to simulate sensor PSF
    depth_blurred = Image.fromarray((depth_arr * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.2))
    depth_arr_smooth = np.array(depth_blurred, dtype=np.float32) / 255.0
    
    # Generate Plasma / Inferno Colormap for Relative Depth
    def colorize_plasma(norm_val):
        # 0.0 -> dark blue/purple, 0.5 -> red/orange, 1.0 -> bright yellow
        r = np.clip(np.sin(norm_val * np.pi - np.pi/4) * 220 + 40, 0, 255)
        g = np.clip(np.sin(norm_val * np.pi) * 200 + (norm_val > 0.7) * 55, 0, 255)
        b = np.clip((1.0 - norm_val) * 230 + 20, 0, 255)
        return np.stack([r, g, b], axis=-1).astype(np.uint8)

    depth_rgb = colorize_plasma(depth_arr_smooth)
    depth_img = Image.fromarray(depth_rgb)
    depth_path = os.path.join(output_dir, "depth_relative_heatmap.png")
    depth_img.save(depth_path, "PNG")
    print(f"Saved depth heatmap: {depth_path}")
    
    # 3. Generate Metric Elevation DSM (Digital Surface Model)
    # Ground elevation = 12.5m to 18.0m, buildings reach up to 74.2m AMSL
    elevation_m = 14.0 + (depth_arr_smooth - 0.25) * 62.0
    elevation_m = np.clip(elevation_m, 2.0, 80.0)
    
    # Viridis-style color ramp for Elevation DSM:
    # Purple (lowest) -> Teal -> Green -> Yellow (highest peaks)
    def colorize_elevation(elev):
        norm = (elev - 12.0) / (72.0 - 12.0)
        norm = np.clip(norm, 0.0, 1.0)
        r = np.clip((norm ** 1.8) * 255, 15, 250)
        g = np.clip(np.sin(norm * np.pi * 0.9) * 220 + 20, 20, 235)
        b = np.clip((1.0 - norm ** 0.8) * 180 + 30, 20, 220)
        return np.stack([r, g, b], axis=-1).astype(np.uint8)
        
    elev_rgb = colorize_elevation(elevation_m)
    elev_img = Image.fromarray(elev_rgb)
    elev_path = os.path.join(output_dir, "elevation_metric_dsm.png")
    elev_img.save(elev_path, "PNG")
    print(f"Saved elevation DSM: {elev_path}")
    
    # 4. Generate Difference Map (Pre vs Post event comparison)
    diff_arr = np.zeros((h, w), dtype=np.float32)
    # Simulate a 12.4m new construction in South Residential Zone
    diff_arr[780:940, 100:280] = 12.4
    diff_arr[260:360, 80:240] = -4.2 # slight elevation erosion / demolition
    
    # Colorize difference: Red = loss, Cyan/Green = new height, Gray = 0
    diff_norm = np.clip(diff_arr / 15.0, -1.0, 1.0)
    dr = np.where(diff_norm < 0, np.clip(-diff_norm * 240, 0, 255), 30).astype(np.uint8)
    dg = np.where(diff_norm > 0, np.clip(diff_norm * 220, 0, 255), 30).astype(np.uint8)
    db = np.where(diff_norm > 0, np.clip(diff_norm * 240, 0, 255), 45).astype(np.uint8)
    diff_rgb = np.stack([dr, dg, db], axis=-1)
    diff_img = Image.fromarray(diff_rgb)
    diff_path = os.path.join(output_dir, "elevation_difference_map.png")
    diff_img.save(diff_path, "PNG")
    print(f"Saved difference map: {diff_path}")
    
    # Also save small thumbnail
    thumb = img.resize((256, 256), Image.Resampling.LANCZOS)
    thumb_path = os.path.join(output_dir, "thumbnail.png")
    thumb.save(thumb_path, "PNG")
    print(f"Saved thumbnail: {thumb_path}")

if __name__ == "__main__":
    generate_demo_assets()
