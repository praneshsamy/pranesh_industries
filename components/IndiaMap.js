"use client";

import React, { useState } from "react";
import IndiaDetailedMapSvg from "./IndiaDetailedMapSvg";

const IndiaMap = ({ onRegionSelect, selectedRegion }) => {
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleRegionHover = (region) => {
        setHoveredRegion(region);
    };

    const handleRegionLeave = () => {
        setHoveredRegion(null);
    };

    const handleMouseMove = (e) => {
        if (hoveredRegion) {
            setCursorPos({
                x: e.clientX + 10,
                y: e.clientY + 10,
            });
        }
    };

    const hubs = [
        { id: "hub-chennai", name: "Chennai", x: "51%", y: "84%" },
        { id: "hub-coimbatore", name: "Coimbatore", x: "47%", y: "87%" },
        { id: "hub-bangalore", name: "Bangalore", x: "44%", y: "81%" },
        { id: "hub-pune", name: "Pune", x: "29%", y: "58%" },
        { id: "hub-mumbai", name: "Mumbai", x: "26%", y: "56%" },
        { id: "hub-vijayawada", name: "Vijayawada", x: "48%", y: "73%" },
    ];

    return (
        <div
            className="map-container card border-0 h-100 position-relative"
            onMouseMove={handleMouseMove}
        >
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="mb-1 fw-bold text-dark">Geographic Distribution</h5>
                <p className="text-secondary small mb-0">
                    Select any state or hub to analyze customer data
                </p>
            </div>

            <div
                className="card-body p-4 d-flex justify-content-center align-items-center position-relative flex-column"
                style={{ minHeight: "650px" }}
            >
                {/* SVG Map */}
                <div className="position-relative w-100 h-100 d-flex justify-content-center">
                    <IndiaDetailedMapSvg
                        selectedRegion={selectedRegion}
                        onRegionSelect={onRegionSelect}
                        onRegionHover={handleRegionHover}
                        onRegionLeave={handleRegionLeave}
                    >
                        {hubs.map((hub) => (
                            <circle
                                key={hub.id}
                                cx={parseFloat(hub.x) * 10}
                                cy={parseFloat(hub.y) * 10}
                                r="8"
                                className={`district-hub ${selectedRegion === hub.name ? "hub-active" : ""
                                    }`}
                                onClick={(e) => { e.stopPropagation(); onRegionSelect(hub.name); }}
                                onMouseEnter={() => handleRegionHover(hub.name)}
                                onMouseLeave={handleRegionLeave}
                            />
                        ))}
                    </IndiaDetailedMapSvg>
                </div>

                {/* Tooltip */}
                {hoveredRegion && (
                    <div
                        className="glass-tooltip position-fixed"
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y,
                        }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary rounded-circle p-1">
                                <i
                                    className="bi bi-geo-alt-fill text-white"
                                    style={{ fontSize: "12px" }}
                                ></i>
                            </span>
                            <span className="fw-semibold">{hoveredRegion}</span>
                        </div>

                        <div className="text-muted small mt-1">
                            Click to view operations data
                        </div>
                    </div>
                )}
            </div>

            {/* CSS */}
            <style jsx global>{`
        .india-svg-container {
          width: 100%;
          height: 100%;
          max-height: 600px;
          display: flex;
          justify-content: center;
        }
        .india-svg-container svg {
          width: 100%;
          height: auto;
          max-height: 600px;
          filter: drop-shadow(0px 8px 16px rgba(0,0,0,0.06));
        }
        .state-region {
          fill: #f1f5f9;
          stroke: #cbd5e1;
          stroke-width: 1.5;
          transition: all 0.3s ease;
          cursor: not-allowed;
        }
        .state-manufacturing {
          fill: #bfdbfe;
          stroke: #ffffff;
          cursor: pointer;
        }
        .state-manufacturing:hover {
          fill: #60a5fa;
        }
        .state-region.state-active {
          fill: #2563eb !important;
          stroke: #ffffff !important;
          stroke-width: 2.5;
        }
        .district-hub {
          fill: #f59e0b;
          stroke: #ffffff;
          stroke-width: 2.5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .district-hub:hover {
          fill: #fbbf24;
          stroke-width: 4px;
        }
        .district-hub.hub-active {
          fill: #ef4444;
          stroke-width: 4px;
        }
      `}</style>
            <style jsx>{`
        .glass-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          pointer-events: none;
          transform: translate(-50%, -120%);
          z-index: 1000;
        }
      `}</style>
        </div>
    );
};

export default IndiaMap;