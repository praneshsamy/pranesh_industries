"use client";

import React from "react";

const CustomerTable = ({ customers, selectedRegion }) => {
    return (
        <div className="customer-table-container h-100 d-flex flex-column">
            <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-light-glass">
                <div>
                    <span className="fw-bold text-dark-mode">
                        {selectedRegion ? `Results for ${selectedRegion}` : "All Network Data"}
                    </span>
                    <span className="ms-2 badge bg-primary-subtle text-primary rounded-pill smaller">
                        {customers.length} Entries
                    </span>
                </div>
                <button className="btn btn-sm btn-link text-decoration-none smaller fw-bold p-0">
                    View All <i className="bi bi-chevron-right ms-1"></i>
                </button>
            </div>

            <div className="table-responsive flex-grow-1 custom-scrollbar">
                {customers.length > 0 ? (
                    <table className="table table-hover align-middle mb-0 border-0">
                        <thead className="table-light sticky-top shadow-sm">
                            <tr>
                                <th className="ps-4 py-3 border-0 text-uppercase smaller fw-black text-secondary tracking-wider">Client</th>
                                <th className="py-3 border-0 text-uppercase smaller fw-black text-secondary tracking-wider">Location</th>
                                <th className="py-3 border-0 text-uppercase smaller fw-black text-secondary tracking-wider text-center">Status</th>
                                <th className="pe-4 py-3 border-0 text-end text-uppercase smaller fw-black text-secondary tracking-wider">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {customers.map((customer, index) => (
                                <tr key={index} className="customer-row border-0">
                                    <td className="ps-4 py-3 border-0">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="client-initials shadow-sm">
                                                {customer.customerName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark-mode mb-0">{customer.customerName}</div>
                                                <div className="text-secondary smaller">{customer.product}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 border-0">
                                        <div className="d-flex flex-column">
                                            <span className="fw-medium text-dark-mode smaller">{customer.district}</span>
                                            <span className="text-secondary smaller opacity-75">{customer.state}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 border-0 text-center">
                                        <span className={`status-badge status-${customer.status.toLowerCase()}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="pe-4 py-3 border-0 text-end">
                                        <button className="btn btn-sm btn-action shadow-sm" title="Contact Client">
                                            <i className="bi bi-telephone-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 opacity-50 text-center px-4">
                        <div className="empty-icon-wrap mb-3">
                            <i className="bi bi-database-exclamation fs-1"></i>
                        </div>
                        <h6 className="fw-bold text-dark-mode">No Regional Operations Found</h6>
                        <p className="smaller maxWidth-250">
                            Selection contains no active manufacturing hubs or registered clients in our current database.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .customer-table-container {
                    min-height: 400px;
                }
                .bg-light-glass {
                    background: rgba(248, 250, 252, 0.5);
                }
                .smaller { font-size: 0.75rem; }
                .fw-black { font-weight: 800; }
                .tracking-wider { letter-spacing: 0.1em; }
                
                .client-initials {
                    width: 36px;
                    height: 36px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                }

                .customer-row {
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .customer-row:hover {
                    background-color: rgba(37, 99, 235, 0.05) !important;
                    transform: scale(1.005);
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 50px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .status-active { background: #dcfce7; color: #166534; }
                .status-inactive { background: #fee2e2; color: #991b1b; }

                .btn-action {
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    border-radius: 8px;
                    background: white;
                    color: #2563eb;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }
                .btn-action:hover {
                    background: #2563eb;
                    color: white;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }

                .maxWidth-250 { max-width: 250px; }

                .dark-mode .bg-light-glass { background: rgba(15, 23, 42, 0.5); }
                .dark-mode .table-light { background: #1e293b; color: #f1f5f9; }
                .dark-mode .client-initials { background: #334155; color: #f1f5f9; border-color: #475569; }
                .dark-mode .table-hover tbody tr:hover { background-color: rgba(255, 255, 255, 0.05) !important; }
            `}</style>
        </div>
    );
};

export default CustomerTable;
