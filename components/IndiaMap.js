"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as d3 from 'd3';
import { isDistrictMatch, normalizeName } from '@/utils/geo_utils';

const geoCache = { states: null, districts: null };

export default function IndiaMap({
    onDistrictSelect,
    activeDistrict,
    activeDistricts = [],
    onVisibleFeaturesChange,
    onViewModeChange,
    onStateSelect,
    searchTerm = "",
    onRegionSelect,
    selectedRegion
}) {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);
    const [geoData, setGeoData] = useState(geoCache.states ? geoCache : null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [viewMode, setViewMode] = useState('states');
    const [selectedState, setSelectedState] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const lastZoomedStateRef = useRef(null);

    const manufacturingStates = useMemo(() => [
        'TAMIL NADU', 'KARNATAKA', 'ANDHRA PRADESH', 'MAHARASHTRA', 'TELANGANA'
    ], []);

    const isManufacturing = (name) => manufacturingStates.includes((name || '').toUpperCase());

    // 1. Fetch GeoJSON (Cached)
    useEffect(() => {
        if (geoCache.states) {
            setGeoData({ ...geoCache });
            return;
        }
        Promise.all([
            fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson').then(res => res.json()),
            fetch('https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson').then(res => res.json())
        ]).then(([states, districts]) => {
            geoCache.states = states;
            geoCache.districts = districts;
            setGeoData({ states, districts });
        }).catch(err => console.error("Error loading GeoJSON", err));
    }, []);

    // 2. Responsive
    useEffect(() => {
        const observeTarget = wrapperRef.current;
        if (!observeTarget) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });
        resizeObserver.observe(observeTarget);
        return () => resizeObserver.unobserve(observeTarget);
    }, []);

    const initialFeatures = useMemo(() => {
        if (!geoData || !geoData.states || !geoData.districts) return [];
        return viewMode === 'states' ? geoData.states.features :
            geoData.districts.features.filter((f) => (f.properties?.NAME_1 || f.properties?.stname) === selectedState);
    }, [geoData, viewMode, selectedState]);

    const currentFeatures = useMemo(() => {
        if (!searchTerm) return initialFeatures;
        return initialFeatures.filter((f) => {
            const name = f.properties?.NAME_2 || f.properties?.dtname || f.properties?.NAME_1 || f.properties?.stname || '';
            return name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [initialFeatures, searchTerm]);

    useEffect(() => {
        if (onVisibleFeaturesChange) onVisibleFeaturesChange(currentFeatures);
    }, [currentFeatures, onVisibleFeaturesChange]);

    useEffect(() => {
        if (onViewModeChange) onViewModeChange(viewMode);
    }, [viewMode, onViewModeChange]);

    useEffect(() => {
        if (selectedRegion && selectedRegion !== selectedState) {
            const s = geoData?.states?.features.find(f => (f.properties?.NAME_1 || f.properties?.stname) === selectedRegion);
            if (s) {
                setSelectedState(selectedRegion);
                setViewMode('districts');
            }
        } else if (!selectedRegion && selectedState) {
            setSelectedState(null);
            setViewMode('states');
        }
    }, [selectedRegion, geoData, selectedState]);

    // 3. Render
    useEffect(() => {
        if (!geoData || !geoData.states || !geoData.districts || !svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        const currentTransform = viewMode === 'states' ? d3.zoomIdentity : d3.zoomTransform(svg.node());
        svg.selectAll("*").remove();

        const projection = d3.geoMercator().fitSize([width, height], geoData.states);
        const pathGenerator = d3.geoPath().projection(projection);

        // Add Glow Filter
        const defs = svg.append("defs");
        const glowFilter = defs.append("filter").attr("id", "selection-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
        glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
        glowFilter.append("feComposite").attr("in", "SourceGraphic").attr("in2", "blur").attr("operator", "over");

        const g = svg.append("g");
        g.attr("transform", currentTransform.toString());

        const statesG = g.append("g").attr("class", "states-layer");
        const districtsG = g.append("g").attr("class", "districts-layer");
        const labelsG = g.append("g").attr("class", "labels-layer").style("pointer-events", "none");

        const zoom = d3.zoom().scaleExtent([1, 100]).on("zoom", (event) => {
            g.attr("transform", event.transform);
            g.selectAll("path").attr("stroke-width", 0.5 / event.transform.k);
            labelsG.selectAll("text").style("font-size", (d) => {
                const base = d.type === 'state' ? 10 : 4;
                return (base / Math.sqrt(event.transform.k)) + "px";
            });
        });

        svg.call(zoom).on("mousedown.zoom", null).on("touchstart.zoom", null).on("wheel.zoom", null).on("dblclick.zoom", null);
        svg.call(zoom.transform, currentTransform);

        const zoomToFeature = (feature) => {
            const bounds = pathGenerator.bounds(feature);
            const dx = bounds[1][0] - bounds[0][0], dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2, y = (bounds[0][1] + bounds[1][1]) / 2;
            const scale = Math.max(1, Math.min(40, 1.05 / Math.max(dx / width, dy / height)));
            const translate = [width / 2 - scale * x, height / 2 - scale * y];

            // Fast CSS-driven transition
            svg.transition()
                .duration(250)
                .ease(d3.easeLinear)
                .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
        };

        // Render States
        const statePaths = statesG.selectAll("path")
            .data(geoData.states.features)
            .enter().append("path")
            .attr("d", pathGenerator)
            .attr("fill", (d) => {
                const name = d.properties?.NAME_1 || d.properties?.stname;
                if (!isManufacturing(name)) return "#1a1a1e";
                return name === selectedState ? "#3b82f6" : "#2a2a32";
            })
            .attr("stroke", "#09090b")
            .attr("stroke-width", 0.5)
            .attr("class", (d) => isManufacturing(d.properties?.NAME_1 || d.properties?.stname) ? "cursor-pointer" : "opacity-40")
            .on("mouseover", (event, d) => {
                const name = d.properties?.NAME_1 || d.properties?.stname;
                setHoveredRegion(name);
            })
            .on("mousemove", (event) => {
                if (tooltipRef.current && wrapperRef.current) {
                    const rect = wrapperRef.current.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    tooltipRef.current.style.left = `${x}px`;
                    tooltipRef.current.style.top = `${y}px`;
                }
            })
            .on("mouseout", () => setHoveredRegion(null))
            .on("click", (event, feature) => {
                const name = feature.properties?.NAME_1 || feature.properties?.stname;
                if (!isManufacturing(name)) return;
                setSelectedState(name);
                if (onStateSelect) onStateSelect(name);
                if (onRegionSelect) onRegionSelect(name);
                setViewMode('districts');
            });

        // State Labels
        if (viewMode === 'states') {
            labelsG.selectAll(".state-label")
                .data(geoData.states.features)
                .enter().append("text")
                .attr("class", "state-label")
                .attr("transform", d => `translate(${pathGenerator.centroid(d)})`)
                .attr("text-anchor", "middle")
                .attr("fill", d => isManufacturing(d.properties?.NAME_1 || d.properties?.stname) ? "#ffffff" : "#4b5563")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)")
                .text(d => d.properties?.NAME_1 || d.properties?.stname);
        }

        // Render Districts
        if (viewMode === 'districts' || searchTerm) {
            const dFeatures = geoData.districts.features.filter(f => {
                const sName = f.properties?.NAME_1 || f.properties?.stname;
                if (searchTerm) {
                    const dName = (f.properties?.NAME_2 || f.properties?.dtname || '').toLowerCase();
                    return dName.includes(searchTerm.toLowerCase());
                }
                return sName === selectedState;
            });

            districtsG.selectAll("path")
                .data(dFeatures)
                .enter().append("path")
                .attr("d", pathGenerator)
                .attr("fill", (f) => {
                    const name = f.properties?.NAME_2 || f.properties?.dtname || '';
                    const isHub = activeDistricts.some(ad => isDistrictMatch(ad, name));
                    const isSel = activeDistrict && isDistrictMatch(activeDistrict.properties?.NAME_2 || activeDistrict.properties?.dtname || '', name);
                    if (isSel) return '#38bdf8';
                    if (isHub) return '#3b82f6';
                    return '#27272a';
                })
                .attr("filter", (f) => {
                    const name = f.properties?.NAME_2 || f.properties?.dtname || '';
                    const isHub = activeDistricts.some(ad => isDistrictMatch(ad, name));
                    return isHub ? "url(#selection-glow)" : null;
                })
                .attr("stroke", "#09090b")
                .attr("stroke-width", 0.2)
                .on("mouseover", (event, f) => {
                    const name = f.properties?.NAME_2 || f.properties?.dtname || '';
                    setHoveredRegion(name);
                })
                .on("mousemove", (event) => {
                    if (tooltipRef.current && wrapperRef.current) {
                        const rect = wrapperRef.current.getBoundingClientRect();
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;
                        tooltipRef.current.style.left = `${x}px`;
                        tooltipRef.current.style.top = `${y}px`;
                    }
                })
                .on("mouseout", () => setHoveredRegion(null))
                .on("click", (event, f) => {
                    event.stopPropagation();
                    if (onDistrictSelect) onDistrictSelect(f);
                    if (onRegionSelect) onRegionSelect(f.properties?.NAME_2 || f.properties?.dtname || '');
                });

            // District Labels
            labelsG.selectAll(".district-label")
                .data(dFeatures)
                .enter().append("text")
                .attr("class", "district-label")
                .attr("transform", d => `translate(${pathGenerator.centroid(d)})`)
                .attr("text-anchor", "middle")
                .attr("fill", "#ffffff")
                .style("font-size", "4px")
                .style("opacity", 0.9)
                .style("text-shadow", "0 1px 1px rgba(0,0,0,0.5)")
                .text(d => d.properties?.NAME_2 || d.properties?.dtname);
        }

        if (viewMode === 'districts' && selectedState && selectedState !== lastZoomedStateRef.current) {
            const f = geoData.states.features.find(f => (f.properties?.NAME_1 || f.properties?.stname) === selectedState);
            if (f) { lastZoomedStateRef.current = selectedState; zoomToFeature(f); }
        } else if (viewMode === 'states') {
            lastZoomedStateRef.current = null;
        }

        // Efficient update pattern
        svg.node().__zoomBehavior = zoom;
    }, [geoData, dimensions, activeDistricts, activeDistrict, viewMode, selectedState, searchTerm]);

    const handleZoomIn = () => {
        const b = d3.select(svgRef.current).node().__zoomBehavior;
        if (b) d3.select(svgRef.current).transition().duration(150).call(b.scaleBy, 2);
    };
    const handleZoomOut = () => {
        const b = d3.select(svgRef.current).node().__zoomBehavior;
        if (b) d3.select(svgRef.current).transition().duration(150).call(b.scaleBy, 0.5);
    };
    const handleResetZoom = () => {
        const b = d3.select(svgRef.current).node().__zoomBehavior;
        if (b) {
            d3.select(svgRef.current).transition().duration(300).call(b.transform, d3.zoomIdentity);
            setViewMode('states');
            setSelectedState(null);
            if (onStateSelect) onStateSelect(null);
            if (onRegionSelect) onRegionSelect(null);
            if (onDistrictSelect) onDistrictSelect(null);
        }
    };

    if (!geoData) {
        return (
            <div className="w-100 bg-dark rounded-3 border h-100 min-vh-50 d-flex flex-column align-items-center justify-content-center text-white">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <div className="small opacity-50">Loading Industrial Map Data...</div>
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="w-100 h-100 rounded-3 overflow-hidden border bg-[#09090b] position-relative" style={{ minHeight: '600px' }}>
            <svg ref={svgRef} className="w-100 h-100" style={{ cursor: 'grab' }} />

            {/* Smarter Floating Tooltip (Ref-based for speed) */}
            {hoveredRegion && (
                <div
                    ref={tooltipRef}
                    className="map-cursor-tooltip"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        pointerEvents: 'none',
                        zIndex: 1000,
                        transform: 'translate(-50%, -120%)',
                        transition: 'none'
                    }}
                >
                    <div className="tooltip-inner-content shadow-lg px-3 py-2 rounded-3 bg-dark border border-white border-opacity-10">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-1">
                            <span className="fw-black text-white small text-uppercase tracking-wider">{hoveredRegion}</span>
                            {activeDistricts.some(d => isDistrictMatch(d, hoveredRegion)) || isManufacturing(hoveredRegion) ? (
                                <span className="badge bg-primary smaller animate-pulse">LIVE</span>
                            ) : null}
                        </div>
                        <div className="smaller text-white text-opacity-50 fw-medium">
                            {isManufacturing(hoveredRegion) ? 'Manufacturing Hub' :
                                activeDistricts.some(d => isDistrictMatch(d, hoveredRegion)) ? 'Active Client Zone' :
                                    'Region Inspected'}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'districts' && (
                <button onClick={handleResetZoom} className="btn btn-dark btn-sm position-absolute top-0 start-0 m-3 z-3 shadow d-flex align-items-center gap-2 px-3 py-2 border-white border-opacity-10 rounded-pill">
                    <ArrowLeft size={16} className="text-primary" />
                    <span className="text-uppercase fw-bold smaller tracking-wider">India Map</span>
                </button>
            )}
            <div className="position-absolute bottom-0 end-0 m-3 d-flex flex-row gap-1 bg-dark bg-opacity-75 p-1 rounded-pill border border-white border-opacity-10 shadow">
                <button onClick={handleZoomIn} className="btn btn-sm btn-dark p-1 border-0 rounded-circle w-8 h-8"><ZoomIn size={14} /></button>
                <button onClick={handleZoomOut} className="btn btn-sm btn-dark p-1 border-0 rounded-circle w-8 h-8"><ZoomOut size={14} /></button>
                <button onClick={handleResetZoom} className="btn btn-sm btn-dark p-1 border-0 rounded-circle w-8 h-8"><RotateCcw size={14} /></button>
            </div>
            <div className="position-absolute bottom-0 start-0 m-3 d-flex flex-column gap-1 pointer-events-none p-3 bg-dark bg-opacity-50 rounded-3 backdrop-blur-sm">
                <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary" style={{ width: 8, height: 8 }}></div>
                    <span className="smaller text-white fw-bold text-uppercase">Manufacturing Hub</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-secondary" style={{ width: 8, height: 8 }}></div>
                    <span className="smaller text-white opacity-50 fw-medium text-uppercase">Locked Region</span>
                </div>
            </div>

            <style jsx global>{`
                .fw-black { font-weight: 900; }
                .smaller { font-size: 0.7rem; }
                .tracking-wider { letter-spacing: 0.05em; }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .tooltip-inner-content {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    background: rgba(15, 15, 20, 0.95) !important;
                }
            `}</style>
        </div>
    );
}