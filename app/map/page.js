"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import IndiaMap from '@/components/IndiaMap';
import CustomerTable from '@/components/CustomerTable';
import StateInfoCard from '@/components/StateInfoCard';
import customerData from '@/data/customers.json';

const MapPage = () => {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'month', 'year', 'all'

    // Filter JSON data based on selected region, search query, and time period
    const filteredCustomers = useMemo(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        return customerData.filter(customer => {
            const matchesRegion = !selectedRegion || 
                customer.state.toLowerCase() === selectedRegion.toLowerCase() ||
                customer.district.toLowerCase() === selectedRegion.toLowerCase();
            
            const matchesSearch = !searchQuery || 
                Object.values(customer).some(val => 
                    String(val).toLowerCase().includes(searchQuery.toLowerCase())
                );
            
            let matchesTime = true;
            if (customer.registrationDate) {
                const regDate = new Date(customer.registrationDate);
                if (timeFilter === 'today') {
                    matchesTime = customer.registrationDate === today;
                } else if (timeFilter === 'month') {
                    matchesTime = regDate.getMonth() === thisMonth && regDate.getFullYear() === thisYear;
                } else if (timeFilter === 'year') {
                    matchesTime = regDate.getFullYear() === thisYear;
                }
            }
            
            return matchesRegion && matchesSearch && matchesTime;
        });
    }, [selectedRegion, searchQuery, timeFilter]);

    const stats = useMemo(() => {
        const uniqueStates = [...new Set(filteredCustomers.map(c => c.state))].length;
        const activeCount = filteredCustomers.filter(c => c.status === 'Active').length;
        return {
            totalCustomers: filteredCustomers.length,
            activeHubs: 6,
            states: uniqueStates,
            activePercentage: filteredCustomers.length > 0 ? Math.round((activeCount / filteredCustomers.length) * 100) : 0
        };
    }, [filteredCustomers]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div className={`dashboard-layout min-vh-100 ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Top Navigation Bar */}
            <nav className="navbar navbar-expand-lg border-bottom px-4 shadow-sm sticky-top glass-nav">
                <div className="container-fluid py-2">
                    <div className="d-flex align-items-center gap-3">
                        <div className="brand-logo bg-primary text-white rounded-xl d-flex justify-content-center align-items-center shadow-lg">
                            <i className="bi bi-hexagon-half fs-4"></i>
                        </div>
                        <div>
                            <h4 className="fw-black mb-0 text-gradient tracking-tight">Pranesh Industries</h4>
                            <div className="text-secondary-emphasis small fw-bold opacity-75">Unified Operations Center</div>
                        </div>
                    </div>

                    <div className="search-container mx-auto d-none d-md-flex">
                        <div className="input-group search-bar shadow-sm">
                            <span className="input-group-text border-0 bg-transparent ps-3">
                                <i className="bi bi-search text-primary"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-0 bg-transparent py-2" 
                                placeholder="Search customers, hubs, or regions..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="time-filters d-none d-xl-flex p-1 bg-light-glass rounded-3 border">
                            {['Today', 'Month', 'Year', 'All'].map((p) => (
                                <button 
                                    key={p}
                                    onClick={() => setTimeFilter(p.toLowerCase())}
                                    className={`btn btn-sm px-3 rounded-2 fw-bold transition-all ${timeFilter === p.toLowerCase() ? 'bg-primary text-white shadow-sm' : 'text-secondary'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button className="btn-toggle-theme shadow-sm me-2" onClick={toggleDarkMode}>
                            <i className={`bi bi-${isDarkMode ? 'sun-fill text-warning' : 'moon-stars-fill text-primary'}`}></i>
                        </button>
                        <Link href="/gst-lookup" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold d-none d-lg-flex align-items-center gap-2 border-opacity-25">
                            <i className="bi bi-shield-check"></i> GSTIN Lookup
                        </Link>
                        <div className="vr d-none d-md-block" style={{ height: '30px' }}></div>
                        <button className="btn-notification position-relative d-none d-sm-block">
                            <i className="bi bi-bell-fill fs-5"></i>
                            <span className="notification-dot"></span>
                        </button>
                        <div className="profile-group d-flex align-items-center gap-2 ps-2">
                            <div className="text-end d-none d-lg-block">
                                <div className="fw-bold small lh-1">Pranesh Samy</div>
                                <div className="text-primary smaller fw-bold">Admin Level 4</div>
                            </div>
                            <div className="profile-avatar shadow-sm">
                                <i className="bi bi-person-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4 py-4 content-fade-in">
                {/* Metrics Grid */}
                <div className="row g-4 mb-5">
                    {[
                        { label: 'Network Reach', value: stats.totalCustomers, icon: 'people', color: 'primary', trend: '+12% this month' },
                        { label: 'Operational Hubs', value: stats.activeHubs, icon: 'geo-alt', color: 'success', trend: 'Live Monitoring' },
                        { label: 'State Coverage', value: stats.states, icon: 'map', color: 'info', trend: 'Across India' },
                        { label: 'Health Index', value: `${stats.activePercentage}%`, icon: 'activity', color: 'warning', trend: 'Systems Optimal' },
                    ].map((metric, idx) => (
                        <div className="col-sm-6 col-xl-3" key={idx}>
                            <div className="card metric-card border-0 h-100 shadow-sm overflow-hidden">
                                <div className="card-body p-4 position-relative">
                                    <div className={`icon-shape bg-${metric.color}-subtle text-${metric.color} mb-3`}>
                                        <i className={`bi bi-${metric.icon}`}></i>
                                    </div>
                                    <h6 className="text-secondary small fw-bold text-uppercase tracking-wider mb-1">{metric.label}</h6>
                                    <h2 className="fw-black mb-1">{metric.value}</h2>
                                    <div className="d-flex align-items-center gap-1 smaller fw-medium opacity-75">
                                        <span className={`text-${metric.color}`}>{metric.trend}</span>
                                    </div>
                                    <div className="metric-bg-icon">
                                        <i className={`bi bi-${metric.icon}`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Main Grid */}
                <div className="row g-4">
                    <div className="col-xl-7 col-xxl-8">
                        <div className="card border-0 shadow-lg h-100 bg-glass overflow-hidden">
                            <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-black text-dark-mode mb-1">Geographic Influence</h4>
                                    <p className="text-secondary small mb-0">Interactive industrial footprint visualizer</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-light-glass border"
                                        onClick={() => {
                                            setSelectedRegion(null);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>Reset View
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-2 p-md-4 d-flex justify-content-center align-items-center" style={{ minHeight: '650px' }}>
                                <IndiaMap
                                    onRegionSelect={setSelectedRegion}
                                    selectedRegion={selectedRegion}
                                    activeDistricts={useMemo(() => [...new Set(customerData.map(c => c.district))], [])}
                                    searchTerm={searchQuery}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-5 col-xxl-4 d-flex flex-column gap-4">
                        <div className="card border-0 shadow-lg bg-glass overflow-hidden sidebar-card">
                            <StateInfoCard
                                selectedRegion={selectedRegion}
                                customerCount={filteredCustomers.length}
                            />
                        </div>
                        <div className="card border-0 shadow-lg bg-glass overflow-hidden flex-grow-1 sidebar-card">
                            <div className="card-header bg-transparent border-0 p-4 pb-2">
                                <h5 className="fw-black text-dark-mode mb-0">Client Registry</h5>
                            </div>
                            <div className="card-body p-0">
                                <CustomerTable
                                    customers={filteredCustomers}
                                    selectedRegion={selectedRegion}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                
                :root {
                    --bg-main: #f4f7fa;
                    --glass-bg: rgba(255, 255, 255, 0.7);
                    --glass-border: rgba(255, 255, 255, 0.4);
                    --text-main: #1e293b;
                    --primary-gradient: linear-gradient(135deg, #2563eb, #7c3aed);
                }

                .dark-mode {
                    --bg-main: #0f172a;
                    --glass-bg: rgba(30, 41, 59, 0.7);
                    --glass-border: rgba(255, 255, 255, 0.05);
                    --text-main: #f8fafc;
                    --text-secondary: #94a3b8;
                }

                body {
                    background-color: var(--bg-main);
                    color: var(--text-main);
                    font-family: 'Inter', sans-serif;
                    transition: background-color 0.3s ease;
                }

                .fw-black { font-weight: 800; }
                .text-gradient {
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* Layout & Cards */
                .glass-nav {
                    background: var(--glass-bg) !important;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--glass-border) !important;
                }

                .bg-glass {
                    background: var(--glass-bg);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--glass-border) !important;
                }

                .metric-card {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    cursor: default;
                }
                .metric-card:hover {
                    transform: translateY(-10px);
                }

                .icon-shape {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-size: 1.5rem;
                }

                .metric-bg-icon {
                    position: absolute;
                    bottom: -15px;
                    right: -5px;
                    font-size: 80px;
                    opacity: 0.04;
                    transform: rotate(-15deg);
                }

                /* Search Bar */
                .search-bar {
                    background: rgba(0, 0, 0, 0.03);
                    border-radius: 50px;
                    width: 400px;
                    border: 1px solid transparent;
                    transition: all 0.3s ease;
                }
                .search-bar:focus-within {
                    background: white;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
                }
                .dark-mode .search-bar {
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Profile & Interface */
                .rounded-xl { border-radius: 12px; }
                .brand-logo { width: 44px; height: 44px; }
                
                .btn-toggle-theme, .btn-notification {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .btn-notification:hover, .btn-toggle-theme:hover {
                    transform: scale(1.05);
                    background: white;
                }
                .notification-dot {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .profile-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--primary-gradient);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Animations */
                .content-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .dark-mode .text-dark-mode { color: #f8fafc !important; }
                .dark-mode .card-header .text-secondary { color: #94a3b8 !important; }
                
                .smaller { font-size: 0.75rem; }
                .tracking-wider { letter-spacing: 0.1em; }

                @media (max-width: 768px) {
                    .search-container { width: 100%; margin-top: 15px; order: 3; }
                    .navbar { padding-bottom: 15px; }
                }
            `}</style>
        </div>
    );
};

export default MapPage;
