"use client";

import React, { useState, useEffect } from 'react';
import IndiaMap from '@/components/IndiaMap';
import CustomerTable from '@/components/CustomerTable';
import StateInfoCard from '@/components/StateInfoCard';
import customerData from '@/data/customers.json';

const MapPage = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);

        // Filter JSON data - case insensitive matching for both states and districts
        const filtered = customerData.filter(customer =>
            customer.state.toLowerCase() === region.toLowerCase() ||
            customer.district.toLowerCase() === region.toLowerCase()
        );

        // Simulating API network delay slightly for premium feel
        setFilteredCustomers([]);
        setTimeout(() => setFilteredCustomers(filtered), 150);
    };

    return (
        <div className="dashboard-layout min-vh-100 pb-5">
            {/* Top Navigation Bar */}
            <nav className="navbar navbar-expand-lg border-bottom px-4 shadow-sm bg-white sticky-top">
                <div className="container-fluid py-2">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded p-2 d-flex justify-content-center align-items-center">
                            <i className="bi bi-hexagon-fill fs-5"></i>
                        </div>
                        <div>
                            <h4 className="fw-bolder mb-0 text-dark tracking-tight">Pranesh Industries</h4>
                            <div className="text-muted small fw-medium">Unified Operations Center</div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center gap-2 text-secondary">
                            <i className="bi bi-broadcast text-success pulse"></i>
                            <span className="fw-semibold small opacity-75">Systems Online</span>
                        </div>
                        <div className="vr" style={{ height: '24px' }}></div>
                        <button className="btn btn-light rounded-circle p-2 mx-1 position-relative" title="Notifications">
                            <i className="bi bi-bell fs-5 text-dark"></i>
                            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                <span className="visually-hidden">New alerts</span>
                            </span>
                        </button>
                        <div className="profile-avatar bg-primary-subtle text-primary fw-bolder rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                            JS
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4 py-4 mt-2">
                {/* Dashboard Header Summary */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-8">
                        <h2 className="fw-bolder text-dark mb-1">Geographic Distribution Network</h2>
                        <p className="text-secondary mb-0">Overview of active clients, industrial hubs, and manufacturing supply chains across India.</p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <button
                            className="btn btn-outline-secondary fw-medium px-4 py-2 me-2 custom-hover-btn"
                            onClick={() => {
                                setSelectedRegion(null);
                                setFilteredCustomers([]);
                            }}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>Reset Filter
                        </button>
                        <button className="btn btn-primary shadow-sm fw-medium px-4 py-2">
                            <i className="bi bi-cloud-arrow-down-fill me-2"></i>Export Report
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="row g-4">
                    {/* Left Section - Interactive Map */}
                    <div className="col-xl-7 col-xxl-8">
                        <IndiaMap
                            onRegionSelect={handleRegionSelect}
                            selectedRegion={selectedRegion}
                        />
                    </div>

                    {/* Right Section - Sidebar Content */}
                    <div className="col-xl-5 col-xxl-4 d-flex flex-column gap-4">
                        <StateInfoCard
                            selectedRegion={selectedRegion}
                            customerCount={filteredCustomers.length}
                        />
                        <div className="flex-grow-1">
                            <CustomerTable
                                customers={filteredCustomers}
                                selectedRegion={selectedRegion}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Dashboard Styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                body {
                    background-color: #f4f6f8;
                    color: #334155;
                }
                .dashboard-layout {
                    font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
                }
                .tracking-tight {
                    letter-spacing: -0.025em;
                }
                .tracking-wide {
                    letter-spacing: 0.05em;
                }
                .custom-shadow {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
                }
                .card {
                    border-radius: 16px;
                }
                .bg-primary-subtle {
                    background-color: #eff6ff !important;
                }
                .bg-success-subtle {
                    background-color: #dcfce7 !important;
                }
                .bg-light {
                    background-color: #f8fafc !important;
                }
                .text-primary {
                    color: #2563eb !important;
                }
                .text-success {
                    color: #16a34a !important;
                }
                .btn-primary {
                    background-color: #2563eb;
                    border-color: #2563eb;
                }
                .btn-primary:hover {
                    background-color: #1d4ed8;
                    border-color: #1e40af;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
                }
                .custom-hover-btn:hover {
                    background-color: #f1f5f9;
                    color: #1e293b;
                    border-color: #cbd5e1;
                }
                .pulse {
                    animation: opacityPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes opacityPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                /* Hide scrollbars for cleaner UI but allow scroll */
                .table-responsive::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .table-responsive::-webkit-scrollbar-track {
                    background: transparent;
                }
                .table-responsive::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}} />
        </div>
    );
};

export default MapPage;
