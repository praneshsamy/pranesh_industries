"use client";

import React from 'react';

const StateInfoCard = ({ selectedRegion, customerCount }) => {
    if (!selectedRegion) return null;

    return (
        <div className="card border-0 custom-shadow rounded-4 bg-white overflow-hidden position-relative">
            {/* Decorative gradient blob */}
            <div className="position-absolute top-0 end-0 opacity-25" style={{ width: '150px', height: '150px', background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>

            <div className="card-body p-4 position-relative z-1">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h6 className="text-secondary fw-semibold text-uppercase tracking-wide small mb-1">Active Region Profile</h6>
                        <h3 className="card-title fw-bolder text-dark mb-0">
                            {selectedRegion}
                        </h3>
                    </div>
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-pin-map-fill fs-4"></i>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-6">
                        <div className="p-3 bg-light rounded-3 border border-light transition-all hover-lift">
                            <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-medium">
                                <i className="bi bi-people text-primary"></i> Total Clients
                            </div>
                            <h2 className="fw-bolder mb-0 text-dark">{customerCount}</h2>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="p-3 bg-light rounded-3 border border-light transition-all hover-lift">
                            <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-medium">
                                <i className="bi bi-activity text-success"></i> Status
                            </div>
                            <h5 className="fw-bolder mb-0 text-success d-flex align-items-center h-100">
                                Active Zone
                            </h5>
                        </div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          background-color: #fff !important;
          border-color: #e2e8f0 !important;
        }
      `}} />
        </div>
    );
};

export default StateInfoCard;
