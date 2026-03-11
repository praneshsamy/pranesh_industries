"use client";

import React from "react";

const StateInfoCard = ({ selectedRegion, customerCount }) => {
    return (
        <div className="state-info-content p-4">
            {selectedRegion ? (
                <div className="active-selection animate-in">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h3 className="fw-black mb-1">{selectedRegion}</h3>
                            <div className="d-flex align-items-center gap-2">
                                <span className="pulse-green shadow-sm"></span>
                                <span className="smaller fw-bold text-success text-uppercase tracking-widest">Operational Zone</span>
                            </div>
                        </div>
                        <div className="region-type-badge shadow-sm">
                            <i className="bi bi-geo-fill"></i>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <div className="metric-box shadow-sm">
                                <div className="smaller text-secondary mb-1">Total Leads</div>
                                <div className="fw-black fs-4">{customerCount}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="metric-box shadow-sm">
                                <div className="smaller text-secondary mb-1">Growth</div>
                                <div className="fw-black fs-4 text-success">+8%</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6 className="smaller fw-black text-secondary text-uppercase mb-3 tracking-widest">Resource Allocation</h6>
                        <div className="capacity-bar-wrap mb-2">
                            <div className="d-flex justify-content-between smaller mb-1">
                                <span>Manufacturing</span>
                                <span className="fw-bold">78%</span>
                            </div>
                            <div className="progress rounded-pill bg-light shadow-inner" style={{ height: '6px' }}>
                                <div className="progress-bar bg-primary rounded-pill animate-bar" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <div className="capacity-bar-wrap">
                            <div className="d-flex justify-content-between smaller mb-1">
                                <span>Logistics</span>
                                <span className="fw-bold">62%</span>
                            </div>
                            <div className="progress rounded-pill bg-light shadow-inner" style={{ height: '6px' }}>
                                <div className="progress-bar bg-info rounded-pill animate-bar" style={{ width: '62%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-primary-subtle rounded-3 border border-primary-subtle">
                        <div className="d-flex gap-3 align-items-center">
                            <i className="bi bi-shield-check fs-3 text-primary"></i>
                            <div>
                                <div className="fw-bold smaller text-primary">Regional Compliance</div>
                                <div className="smaller text-secondary-emphasis">Standard industrial protocols active in this sector.</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-selection py-5 text-center px-3">
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="empty-map-icon shadow-lg">
                            <i className="bi bi-pin-map-fill"></i>
                        </div>
                    </div>
                    <h5 className="fw-black text-dark-mode">Segment Analysis</h5>
                    <p className="text-secondary smaller">Select a specific geographic sector on the map to initialize deep-dive regional analytics and client metrics.</p>
                </div>
            )}

            <style jsx>{`
                .state-info-content {
                    min-height: 280px;
                }
                .smaller { font-size: 0.75rem; }
                .fw-black { font-weight: 800; }
                .tracking-widest { letter-spacing: 0.2em; }
                
                .pulse-green {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: shadow-pulse 2s infinite;
                }

                @keyframes shadow-pulse {
                    0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4); }
                    100% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                }

                .region-type-badge {
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #2563eb;
                    font-size: 1.2rem;
                }

                .metric-box {
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 12px;
                    border-radius: 12px;
                }

                .animate-in {
                    animation: slideUpFade 0.4s ease-out forwards;
                }
                @keyframes slideUpFade {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .animate-bar {
                    animation: growBar 1s ease-out forwards;
                }
                @keyframes growBar {
                    from { width: 0; }
                }

                .empty-map-icon {
                    width: 70px;
                    height: 70px;
                    background: var(--primary-gradient, #2563eb);
                    color: white;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    transform: rotate(-10deg);
                }

                .dark-mode .metric-box { background: rgba(0, 0, 0, 0.1); }
                .dark-mode .region-type-badge { background: #1e293b; color: #3b82f6; }
                .dark-mode .bg-light { background: #334155 !important; }
            `}</style>
        </div>
    );
};

export default StateInfoCard;
