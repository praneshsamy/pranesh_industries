"use client";

import React, { useState, useEffect } from "react";
import IndiaDetailedMapSvg from "./IndiaDetailedMapSvg";

const IndiaMap = ({ onRegionSelect, selectedRegion: externalSelectedRegion }) => {
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [zoomParams, setZoomParams] = useState({ scale: 1, x: 0, y: 0 });

    const stateZoomConfigs = {
        'Tamil Nadu': { scale: 3.5, x: 280, y: 720 },          // TN Hubs (Chennai/Coimbatore)
        'Karnataka': { scale: 3.2, x: 240, y: 650 },           // Bangalore area
        'Maharashtra': { scale: 3.0, x: 180, y: 480 },          // Pune/Mumbai corridor (Fixed alignment)
        'Andhra Pradesh': { scale: 3.2, x: 380, y: 650 },      // Vijayawada/Coastal centers
        'Telangana': { scale: 3.5, x: 330, y: 580 }            // Hyderabad region
    };

    // Helper to find the parent state for any selection (State or District)
    const getParentState = (region) => {
        if (!region) return null;
        if (stateZoomConfigs[region]) return region; // It's already a state
        const hub = hubs.find(h => h.name === region);
        return hub ? hub.state : null;
    };

    // Keep internal zoom in sync with external selection
    useEffect(() => {
        const parentState = getParentState(externalSelectedRegion);
        if (parentState && stateZoomConfigs[parentState]) {
            setZoomParams(stateZoomConfigs[parentState]);
        } else if (!externalSelectedRegion) {
            setZoomParams({ scale: 1, x: 0, y: 0 });
        }
    }, [externalSelectedRegion]);

    const handleRegionClick = (region) => {
        // Toggle selection off if same is clicked
        if (externalSelectedRegion === region) {
            onRegionSelect(null);
        } else {
            onRegionSelect(region);
        }
    };

    const resetZoom = () => {
        onRegionSelect(null);
    };

    const handleRegionHover = (region, e) => {
        setHoveredRegion(region);
        if (e) {
            setCursorPos({
                x: e.clientX,
                y: e.clientY,
            });
        }
    };

    const handleRegionLeave = () => {
        setHoveredRegion(null);
    };

    const hubs = [
        { id: "hub-chennai", name: "Chennai", state: "Tamil Nadu", x: "410", y: "810", type: "Distribution" },
        { id: "hub-coimbatore", name: "Coimbatore", state: "Tamil Nadu", x: "360", y: "860", type: "Manufacturing" },
        { id: "hub-bangalore", name: "Bangalore", state: "Karnataka", x: "330", y: "770", type: "R&D Center" },
        { id: "hub-pune", name: "Pune", state: "Maharashtra", x: "270", y: "610", type: "Automotive Hub" },
        { id: "hub-mumbai", name: "Mumbai", state: "Maharashtra", x: "240", y: "580", type: "Logistics HQ" },
        { id: "hub-vijayawada", name: "Vijayawada", state: "Andhra Pradesh", x: "430", y: "740", type: "Processing" },
    ];

    const manufacturingStates = [
        'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Maharashtra'
    ];

    const isManufacturing = (regionName) => manufacturingStates.includes(regionName) || hubs.some(h => h.name === regionName);

    return (
        <div
            className="map-viewport position-relative w-100 h-100"
            onMouseMove={(e) => {
                if (hoveredRegion) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCursorPos({ 
                        x: e.clientX - rect.left, 
                        y: e.clientY - rect.top 
                    });
                }
            }}
        >
            <IndiaDetailedMapSvg
                selectedRegion={externalSelectedRegion}
                onRegionSelect={handleRegionClick}
                onRegionHover={handleRegionHover}
                onRegionLeave={handleRegionLeave}
                zoomParams={zoomParams}
            >
                {(() => {
                    const activeParentState = getParentState(externalSelectedRegion);
                    return hubs
                        .filter(hub => !activeParentState || hub.state === activeParentState)
                        .map((hub) => (
                            <g key={hub.id} className="hub-group hub-visible">
                                <circle
                                    cx={hub.x}
                                    cy={hub.y}
                                    r="12"
                                    className={`hub-ping ${externalSelectedRegion === hub.name ? 'ping-active' : ''}`}
                                />
                                <circle
                                    cx={hub.x}
                                    cy={hub.y}
                                    r="6"
                                    className={`district-hub ${externalSelectedRegion === hub.name ? "hub-active" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); handleRegionClick(hub.name); }}
                                    onMouseEnter={(e) => handleRegionHover(hub.name, e)}
                                    onMouseLeave={handleRegionLeave}
                                />
                                {activeParentState && (
                                    <text
                                        x={hub.x}
                                        y={parseInt(hub.y) + 20}
                                        textAnchor="middle"
                                        className={`hub-label animate-fade-in ${externalSelectedRegion === hub.name ? 'label-active' : ''}`}
                                    >
                                        {hub.name}
                                    </text>
                                )}
                            </g>
                        ));
                })()}
            </IndiaDetailedMapSvg>

            {externalSelectedRegion && (
                <button 
                    className="btn btn-dark btn-sm reset-map-btn shadow-lg animate-pop"
                    onClick={resetZoom}
                >
                    <i className="bi bi-zoom-out me-2"></i>Back to Full Map
                </button>
            )}

            {/* Smarter Floating Tooltip */}
            {hoveredRegion && (
                <div
                    className={`map-cursor-tooltip ${!isManufacturing(hoveredRegion) ? 'tooltip-locked' : ''}`}
                    style={{
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                    }}
                >
                    <div className="tooltip-content shadow-lg animate-pop">
                        <div className="tooltip-badge">
                            <span className="region-label">{hoveredRegion}</span>
                            {isManufacturing(hoveredRegion) ? (
                                <span className="live-tag">LIVE</span>
                            ) : (
                                <span className="locked-tag">
                                    <i className="bi bi-lock-fill me-1"></i>LOCKED
                                </span>
                            )}
                        </div>
                        <div className="tooltip-mini-stats">
                            <div className="mini-stat">
                                <span className="label">Status</span>
                                <span className={`value ${isManufacturing(hoveredRegion) ? 'text-success' : 'opacity-50'}`}>
                                    {isManufacturing(hoveredRegion) ? 'Active Zone' : 'No Coverage'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .map-viewport {
                    overflow: visible;
                }

                .india-svg-container {
                    width: 100%;
                    height: 100%;
                    min-height: 500px;
                    max-height: 800px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
                    overflow: hidden;
                    position: relative;
                }

                .reset-map-btn {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    z-index: 100;
                    border-radius: 50px;
                    padding: 8px 20px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    background: #1e293b;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .reset-map-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                }
                
                .hub-label {
                    fill: #475569;
                    font-weight: 700;
                    font-size: 6px;
                    pointer-events: none;
                    transition: all 0.3s ease;
                }

                .label-active {
                    fill: #ef4444;
                    font-weight: 900;
                    font-size: 8px;
                }

                .dark-mode .hub-label {
                    fill: #94a3b8;
                }
                
                .dark-mode .label-active {
                    fill: #ef4444;
                }

                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(3px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .state-region {
                    fill: #e2e8f0;
                    stroke: #ffffff;
                    stroke-width: 0.8;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .state-region:hover {
                    fill: #94a3b8;
                    stroke-width: 1.5;
                    transform: scale(1.002);
                    z-index: 10;
                }

                .state-manufacturing {
                    fill: #bfdbfe;
                    stroke: #3b82f6;
                    cursor: pointer;
                }

                .state-manufacturing:hover {
                    fill: #60a5fa !important;
                }

                .state-region.state-active {
                    fill: #2563eb !important;
                    stroke: #1e40af !important;
                    stroke-width: 2;
                }

                .district-hub {
                    fill: #f59e0b;
                    stroke: #ffffff;
                    stroke-width: 2;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .hub-ping {
                    fill: #f59e0b;
                    opacity: 0.15;
                    animation: hubPing 2.5s infinite;
                    pointer-events: none;
                    transition: all 0.3s ease;
                }

                .ping-active {
                    fill: #ef4444;
                    opacity: 0.3;
                    animation-duration: 1.5s;
                }

                @keyframes hubPing {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(3); opacity: 0; }
                }

                .hub-active {
                    fill: #ef4444 !important;
                    stroke: #ffffff !important;
                    stroke-width: 3 !important;
                    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
                }

                .map-cursor-tooltip {
                    position: absolute;
                    z-index: 10000;
                    pointer-events: none;
                    transform: translate(-50%, -120%);
                    transition: left 0.05s ease-out, top 0.05s ease-out;
                }

                .tooltip-content {
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    padding: 8px 12px;
                    color: white;
                    min-width: 140px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                }

                .tooltip-locked .tooltip-content {
                    background: rgba(30, 41, 59, 0.98);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .tooltip-badge {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    gap: 12px;
                }

                .region-label {
                    font-weight: 800;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    color: #fff;
                }

                .live-tag {
                    background: #ef4444;
                    font-size: 0.6rem;
                    font-weight: 900;
                    padding: 1px 4px;
                    border-radius: 3px;
                    animation: blink 1.5s infinite;
                }

                .locked-tag {
                    background: #64748b;
                    font-size: 0.6rem;
                    font-weight: 900;
                    padding: 1px 6px;
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                }

                .tooltip-mini-stats {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 4px;
                }

                .mini-stat {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    font-weight: 600;
                }

                .mini-stat .label { opacity: 0.6; }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .animate-pop {
                    animation: tooltipPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes tooltipPop {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .state-disabled {
                    cursor: not-allowed !important;
                    pointer-events: auto !important;
                    fill: #e2e8f0 !important;
                    stroke: #cbd5e1 !important;
                    opacity: 0.8 !important;
                    transition: fill 0.3s ease;
                }

                .state-disabled:hover {
                    fill: #d1d5db !important;
                }

                .dark-mode .state-region {
                    fill: #1e293b;
                    stroke: #334155;
                }
                .dark-mode .state-manufacturing {
                    fill: #1d4ed8;
                    opacity: 0.8;
                }
                .dark-mode .state-disabled {
                    fill: #1e293b !important;
                    stroke: #334155 !important;
                    opacity: 0.5 !important;
                }
            `}</style>
        </div>
    );
};

export default IndiaMap;