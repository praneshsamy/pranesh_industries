"use client";

import React, { useState } from "react";
import {
    Settings,
    Palette,
    Square,
    Database,
    Filter,
    Globe,
    Search,
    Eye,
    Plus,
    MapPin,
    Copy,
    Trash2,
    ChevronDown,
    Layout
} from "lucide-react";

const CustomerTable = ({ customers, selectedRegion }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = customers.filter(c =>
        searchTerm === "" ||
        Object.values(c).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="sales-rep-table bg-white h-100 d-flex flex-column rounded-3 shadow-sm border overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="table-toolbar px-3 py-2 border-bottom d-flex align-items-center justify-content-between bg-white sticky-top z-3">
                <div className="d-flex align-items-center gap-2">
                    <button className="tool-btn"><Settings size={16} /></button>
                    <button className="tool-btn"><Palette size={16} /></button>
                    <button className="tool-btn"><Square size={16} /></button>
                    <div className="vr mx-1 my-2"></div>
                    <button className="tool-btn active-tool"><Database size={16} /></button>
                    <button className="tool-btn"><Filter size={16} /></button>
                    <button className="tool-btn"><Globe size={16} /></button>
                    <button className="tool-btn"><Layout size={16} /></button>
                    <button className="tool-btn"><ChevronDown size={16} /></button>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0 me-3 text-muted fw-normal small">Table</h6>
                    <div className="search-input-group position-relative">
                        <Search size={14} className="search-icon" />
                        <input
                            type="text"
                            className="form-control form-control-sm ps-4 border-0 bg-light"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="tool-btn"><Eye size={16} /></button>
                    <button className="tool-btn"><Plus size={16} /></button>
                </div>
            </div>

            {/* Table Area */}
            <div className="table-responsive flex-grow-1 custom-scrollbar">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="id-col">id</th>
                            <th className="name-col">firstName</th>
                            <th className="name-col">lastName</th>
                            <th className="location-col">location</th>
                            <th className="image-col">images</th>
                            <th className="action-col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((customer, index) => {
                                const names = customer.contactPerson.split(" ");
                                const firstName = names[0];
                                const lastName = names.slice(1).join(" ") || "—";

                                return (
                                    <tr key={index}>
                                        <td className="id-col text-muted">{index + 1}</td>
                                        <td className="name-col fw-medium">{firstName}</td>
                                        <td className="name-col fw-medium">{lastName}</td>
                                        <td className="location-col">
                                            <div className="d-flex align-items-center gap-2 text-primary-emphasis">
                                                <MapPin size={14} className="text-orange" />
                                                <span className="small">{customer.district}, {customer.state}</span>
                                            </div>
                                        </td>
                                        <td className="image-col">
                                            <div className="avatar-wrapper">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff`}
                                                    alt={firstName}
                                                    className="avatar-img"
                                                />
                                            </div>
                                        </td>
                                        <td className="action-col">
                                            <div className="d-flex gap-2">
                                                <button className="action-row-btn"><Copy size={14} /></button>
                                                <button className="action-row-btn delete-btn"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted small">
                                    No data matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .sales-rep-table {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                
                .table-toolbar {
                    min-height: 48px;
                    border-bottom: 1px solid #f1f5f9 !important;
                }

                .tool-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    padding: 6px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .tool-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                }
                .tool-btn.active-tool {
                    background: #64748b;
                    color: white;
                }

                .search-input-group {
                    width: 180px;
                }
                .search-icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }
                .search-input-group .form-control {
                    border-radius: 4px;
                }

                table thead th {
                    background: #fff;
                    color: #94a3b8;
                    font-weight: 600;
                    font-size: 0.8rem;
                    padding: 12px 16px;
                    border-bottom: 1px solid #f1f5f9;
                    text-transform: none;
                }

                table tbody td {
                    padding: 10px 16px;
                    font-size: 0.85rem;
                    border-bottom: 1px solid #f8fafc;
                    color: #334155;
                }

                .id-col { width: 40px; }
                .name-col { width: 120px; }
                .location-col { min-width: 200px; }
                .image-col { width: 80px; }
                .action-col { width: 100px; text-align: right; }

                .text-orange { color: #f97316; }

                .avatar-wrapper {
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #f1f5f9;
                }
                .avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .action-row-btn {
                    background: transparent;
                    border: 1px solid #e2e8f0;
                    color: #94a3b8;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .action-row-btn:hover {
                    background: #f1f5f9;
                    color: #475569;
                    border-color: #cbd5e1;
                }
                .action-row-btn.delete-btn:hover {
                    background: #fee2e2;
                    color: #ef4444;
                    border-color: #fecaca;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }

                .fw-black { font-weight: 900; }
            `}</style>
        </div>
    );
};

export default CustomerTable;
