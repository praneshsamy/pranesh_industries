"use client";

import React, { useState, useMemo } from 'react';

/**
 * EMAIL REMAINDER MODULE - GLOBUS ENGINEERING TOOLS
 * A comprehensive, standalone module for tracking invoices, 
 * calculating processing/product billing, and managing recovery emails.
 */
const EmailReminderModule = ({ invoices = [] }) => {
    const today = new Date();
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'overdue', 'paid'

    // --- LOGIC: DASHBOARD METRICS (Points 8, 9, 12 from Doc) ---
    const stats = useMemo(() => {
        const pending = invoices.filter(inv => inv.status !== 'Paid');
        const overdue = pending.filter(inv => new Date(inv.dueDate) < today);
        const totalOutstanding = pending.reduce((acc, inv) => acc + (inv.amount - inv.paid), 0);
        const totalSales = invoices.reduce((acc, inv) => acc + inv.amount, 0);
        const recoveryRate = totalSales > 0 ? ((totalSales - totalOutstanding) / totalSales * 100).toFixed(1) : 0;

        return {
            pendingCount: pending.length,
            overdueCount: overdue.length,
            totalOutstanding,
            recoveryRate
        };
    }, [invoices]);

    // --- LOGIC: REMINDER CALCULATIONS (Point 9 from Doc) ---
    const getReminderStatus = (dueDateStr) => {
        const dueDate = new Date(dueDateStr);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return {
            days: daysDiff,
            isOverdue: daysDiff < 0,
            isDueToday: daysDiff === 0,
            stage: daysDiff <= 0 ? 'DUE' : daysDiff <= 1 ? '1D' : daysDiff <= 2 ? '2D' : daysDiff <= 7 ? '7D' : 'UPCOMING'
        };
    };

    const handleSendAction = (inv) => {
        setSelectedInvoice(inv);
        setShowPreview(true);
    };

    // --- FILTERED DATA ---
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const status = getReminderStatus(inv.dueDate);
            if (activeTab === 'overdue') return status.isOverdue && inv.status !== 'Paid';
            if (activeTab === 'paid') return inv.status === 'Paid';
            return inv.status !== 'Paid';
        });
    }, [invoices, activeTab]);

    return (
        <div className="email-remainder-suite">
            {/* Dashboard Section */}
            <div className="dashboard-grid mb-5">
                <div className="stat-card">
                    <span className="label">Outstanding</span>
                    <span className="value">₹{stats.totalOutstanding.toLocaleString()}</span>
                    <div className="footer text-danger">Across {stats.pendingCount} Invoices</div>
                </div>
                <div className="stat-card">
                    <span className="label">Overdue</span>
                    <span className="value text-danger">{stats.overdueCount}</span>
                    <div className="footer">Critical Recovery Needed</div>
                </div>
                <div className="stat-card">
                    <span className="label">Recovery Rate</span>
                    <span className="value text-primary">{stats.recoveryRate}%</span>
                    <div className="footer text-primary">Financial Health Score</div>
                </div>
            </div>

            {/* Main Interface */}
            <div className="main-paper shadow-sm">
                <div className="paper-header">
                    <nav className="nav-tabs">
                        <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pending ({stats.pendingCount})</button>
                        <button className={activeTab === 'overdue' ? 'active' : ''} onClick={() => setActiveTab('overdue')}>Overdue ({stats.overdueCount})</button>
                        <button className={activeTab === 'paid' ? 'active' : ''} onClick={() => setActiveTab('paid')}>Paid</button>
                    </nav>
                </div>

                <div className="invoice-list">
                    {filteredInvoices.length === 0 ? (
                        <div className="empty-state p-5 text-center text-muted">No invoices found for this category.</div>
                    ) : (
                        filteredInvoices.map((inv, idx) => {
                            const rem = getReminderStatus(inv.dueDate);
                            return (
                                <div key={idx} className={`invoice-row ${rem.isOverdue ? 'overdue-row' : ''}`}>
                                    <div className="col-info">
                                        <div className="id-block">
                                            <span className="inv-id">{inv.id || inv.invoiceNo}</span>
                                            <span className={`type-badge`}>{inv.billingType}</span>
                                        </div>
                                        <h6 className="cust-name">{inv.customer}</h6>
                                        <p className="description">{inv.details}</p>
                                    </div>

                                    <div className="col-timeline">
                                        <div className="timeline-wrapper">
                                            <div className="mini-timeline">
                                                <div className="timeline-line"></div>
                                                <div className={`node ${rem.days <= 7 ? 'active' : ''}`} data-tip="7 Days Before">7D</div>
                                                <div className={`node ${rem.days <= 2 ? 'active' : ''}`} data-tip="2 Days Before">2D</div>
                                                <div className={`node ${rem.days <= 1 ? 'active' : ''}`} data-tip="1 Day Before">1D</div>
                                                <div className={`node ${rem.days <= 0 ? 'active' : ''}`} data-tip="Due Date">DUE</div>
                                            </div>
                                        </div>
                                        <div className="timeline-footer mt-2">
                                            <span className="due-status">
                                                {rem.isOverdue ? (
                                                    <span className="text-danger fw-bold"><i className="bi bi-calendar-x me-1"></i>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                                ) : (
                                                    <span className="text-muted small fw-bold"><i className="bi bi-calendar-event me-1"></i>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                                )}
                                            </span>
                                            <div className="days-counter">
                                                {rem.days > 0 ? `${rem.days} Days Remaining` : rem.days === 0 ? "Due Today" : "Overdue"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-amount">
                                        <div className="price-tag">₹{(inv.amount - inv.paid).toLocaleString()}</div>
                                        {inv.paid > 0 && <div className="paid-hint">Partially Paid: ₹{inv.paid.toLocaleString()}</div>}
                                    </div>

                                    <div className="col-action">
                                        <button className="send-btn" onClick={() => handleSendAction(inv)}>
                                            <i className="bi bi-send-fill me-2"></i>Send
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Email Preview Modal */}
            {showPreview && selectedInvoice && (
                <EmailPreviewModal 
                    invoice={selectedInvoice} 
                    status={getReminderStatus(selectedInvoice.dueDate)} 
                    onClose={() => setShowPreview(false)} 
                />
            )}

            <style jsx>{`
                .email-remainder-suite {
                    --accent: #2563eb;
                    --bg: #f8fafc;
                    --white: #ffffff;
                    --text: #1e293b;
                    --text-soft: #64748b;
                    --border: #e2e8f0;
                    --danger: #ef4444;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                }

                .stat-card {
                    background: var(--white);
                    padding: 24px;
                    border-radius: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    border: 1px solid var(--border);
                }
                .stat-card .label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-soft); letter-spacing: 0.05em; margin-bottom: 8px; }
                .stat-card .value { display: block; font-size: 1.75rem; font-weight: 800; color: var(--text); }
                .stat-card .footer { font-size: 0.75rem; font-weight: 700; margin-top: 12px; }

                .main-paper {
                    background: var(--white);
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid var(--border);
                }

                .paper-header { padding: 0 32px; border-bottom: 1px solid var(--border); background: #fafafa; }
                .nav-tabs { display: flex; gap: 32px; }
                .nav-tabs button {
                    background: none; border: none; padding: 20px 0; font-size: 0.85rem; font-weight: 700; color: var(--text-soft);
                    position: relative; transition: all 0.2s;
                }
                .nav-tabs button.active { color: var(--accent); }
                .nav-tabs button.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--accent); border-radius: 3px 3px 0 0; }

                .invoice-list { padding: 12px; display: flex; flex-direction: column; gap: 20px; }
                .invoice-row {
                    display: grid; grid-template-columns: 2fr 1.2fr 1fr 120px; align-items: center;
                    padding: 24px 20px; border-radius: 20px; transition: all 0.2s; 
                    border: 1px solid #f1f5f9; background: white;
                    gap: 30px;
                }
                .invoice-row:hover { 
                    background: #ffffff; 
                    transform: translateY(-2px); 
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
                    border-color: var(--accent);
                }
                .overdue-row { border-left: 4px solid var(--danger); }

                .id-block { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
                .inv-id { font-size: 0.7rem; font-weight: 800; color: var(--text-soft); }
                .type-badge { font-size: 0.6rem; font-weight: 800; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; color: var(--text-soft); }
                
                .cust-name { font-weight: 800; font-size: 1rem; color: var(--text); margin: 0; }
                .description { font-size: 0.75rem; color: var(--text-soft); margin: 4px 0 0; }

                .mini-timeline { display: flex; gap: 12px; position: relative; width: fit-content; }
                .timeline-line { position: absolute; top: 16px; left: 16px; right: 16px; height: 2px; background: #e2e8f0; z-index: 0; }
                .node {
                    width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; border: 2px solid var(--border);
                    display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; color: #94a3b8;
                    position: relative; z-index: 1; transition: all 0.3s;
                }
                .node.active { background: #eff6ff; border-color: var(--accent); color: var(--accent); box-shadow: 0 0 0 4px #eff6ff; }
                
                .timeline-footer { display: flex; flex-direction: column; gap: 4px; }
                .due-status { font-size: 0.75rem; display: flex; align-items: center; }
                .days-counter { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--accent); opacity: 0.8; }

                .price-tag { font-size: 1.25rem; font-weight: 900; color: var(--text); text-align: right; }
                .paid-hint { font-size: 0.65rem; font-weight: 700; color: #10b981; text-align: right; margin-top: 2px; }

                .send-btn {
                    background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 10px;
                    font-weight: 700; font-size: 0.8rem; box-shadow: 0 4px 6px rgba(37,99,235,0.1); transition: all 0.2s;
                }
                .send-btn:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(37,99,235,0.2); }

                @media (max-width: 992px) {
                    .invoice-row { grid-template-columns: 1fr 1fr; gap: 20px; }
                    .col-action { grid-column: span 2; display: flex; justify-content: flex-end; }
                }
            `}</style>
        </div>
    );
};

/* Email Preview Sub-Component */
const EmailPreviewModal = ({ invoice, status, onClose }) => {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    // Generate Stage-Specific Content
    const getMailContent = () => {
        if (status.isOverdue) return { title: 'DUE IMMEDIATELY: Urgent Payment Notice', intro: 'Your payment is now OVERDUE. This is an urgent notice requested by Globus Engineering Tools.', tone: 'urgent' };
        if (status.days === 0) return { title: 'ACTION REQUIRED: Invoice Due Today', intro: 'This is a reminder that your payment is due by the end of the business day today.', tone: 'important' };
        if (status.days <= 2) return { title: 'REMINDER: Payment Due in 48 Hours', intro: 'We are reaching out to ensure your payment process is initiated as it is due shortly.', tone: 'standard' };
        return { title: 'Friendly Reminder: Upcoming Invoice Due', intro: 'This is a gentle reminder regarding your upcoming invoice due next week.', tone: 'soft' };
    };

    const content = getMailContent();

    const handleActualSend = () => {
        setSending(true);
        // Simulate API call to email service
        setTimeout(() => {
            setSending(false);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }, 2000);
    };

    if (success) {
        return (
            <div className="modal-overlay">
                <div className="modal-box animate-pop text-center p-5">
                    <div className="success-icon mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="fw-black mb-3">Email Sent Successfully!</h3>
                    <p className="text-secondary">Reminder was sent to <strong>{invoice.email || 'customer@globus.com'}</strong></p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box animate-pop" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="d-flex align-items-center gap-3">
                        <div className={`tone-dot ${content.tone}`}></div>
                        <h5 className="m-0 fw-black">Manual Recovery Release</h5>
                    </div>
                    <button className="close-btn" onClick={onClose}><i className="bi bi-x-large"></i></button>
                </div>
                
                <div className="modal-body">
                    <div className="email-meta mb-3 p-3 bg-light rounded-3 border">
                        <div className="d-flex gap-2 mb-1">
                            <span className="text-muted small fw-bold">From:</span>
                            <span className="small fw-bold">accounts@globusengineering.com</span>
                        </div>
                        <div className="d-flex gap-2">
                            <span className="text-muted small fw-bold">To:</span>
                            <span className="small fw-bold text-primary">{invoice.email || invoice.customer + '@example.com'}</span>
                        </div>
                    </div>

                    <div className="email-canvas shadow-xl">
                        <div className="email-header">
                            <div className="logo"><i className="bi bi-hexagon-fill"></i></div>
                            <div className="brand">GLOBUS ENGINEERING TOOLS</div>
                        </div>

                        <div className="email-inner">
                            <div className="subject">Subject: {content.title}</div>
                            <p className="salutation">Dear <strong>{invoice.customer}</strong>,</p>
                            <p className="intro">{content.intro}</p>

                            <div className="payment-slab">
                                <div className="slab-row">
                                    <span className="label">Invoice Reference</span>
                                    <span className="val">{invoice.id || invoice.invoiceNo}</span>
                                </div>
                                <div className="slab-row">
                                    <span className="label">Billing Category</span>
                                    <span className="val">{invoice.billingType}</span>
                                </div>
                                <div className="slab-row highlight">
                                    <span className="label">Balance Outstanding</span>
                                    <span className="val">₹{(invoice.amount - invoice.paid).toLocaleString()}</span>
                                </div>
                            </div>

                            <p className="final-note">Please process the payment to the registered bank details of Globus Engineering. If already paid, kindly share the receipt with our accounts team.</p>
                            
                            <a href="#" className="pay-link">Submit Payment via Portal</a>

                            <div className="sign-off">
                                <strong>Operations Team</strong><br/>
                                Globus Engineering Tools<br/>
                                <span className="small opacity-50">GSTIN: {invoice.gst}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={sending}>Discard</button>
                    <button className="btn-send d-flex align-items-center gap-2" onClick={handleActualSend} disabled={sending}>
                        {sending ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Releasing Email...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send-check"></i>
                                Commit & Send Release
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .modal-box { background: #f1f5f9; width: 100%; max-width: 680px; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; }
                
                .modal-header { background: white; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
                .tone-dot { width: 12px; height: 12px; border-radius: 50%; }
                .tone-dot.urgent { background: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.2); }
                .tone-dot.important { background: #f59e0b; }
                .tone-dot.standard { background: #3b82f6; }
                .tone-dot.soft { background: #10b981; }
                .close-btn { background: none; border: none; font-size: 1.25rem; color: #94a3b8; }

                .modal-body { padding: 40px; overflow-y: auto; max-height: 70vh; }
                .email-canvas { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; }
                
                .email-header { background: #0f172a; padding: 24px; text-align: center; color: white; }
                .logo { font-size: 1.75rem; color: #3b82f6; margin-bottom: 4px; }
                .brand { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.2em; opacity: 0.8; }

                .email-inner { padding: 40px; }
                .subject { font-weight: 800; color: #0f172a; margin-bottom: 24px; font-size: 0.95rem; border-left: 3px solid #3b82f6; padding-left: 12px; }
                .salutation { font-size: 1rem; color: #1e293b; margin-bottom: 16px; }
                .intro { color: #475569; line-height: 1.6; font-size: 0.95rem; margin-bottom: 32px; }

                .payment-slab { background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 32px; }
                .slab-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
                .slab-row.highlight { margin-bottom: 0; padding-top: 12px; border-top: 2px dashed #e2e8f0; }
                .slab-row .label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
                .slab-row .val { font-weight: 800; color: #1e293b; }
                .slab-row.highlight .val { font-size: 1.5rem; color: #2563eb; }

                .final-note { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 40px; text-align: center; }
                .pay-link { display: block; background: #2563eb; color: white; text-align: center; padding: 18px; border-radius: 12px; font-weight: 800; text-decoration: none; margin-bottom: 40px; transition: 0.2s; }
                .pay-link:hover { background: #1d4ed8; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3); }

                .sign-off { text-align: center; font-size: 0.85rem; color: #1e293b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 32px; }

                .modal-footer { padding: 24px 32px; display: flex; justify-content: flex-end; gap: 16px; background: white; border-top: 1px solid #e2e8f0; }
                .btn-cancel { background: none; border: 1px solid #e2e8f0; padding: 12px 28px; border-radius: 12px; font-weight: 700; color: #64748b; }
                .btn-send { background: #2563eb; border: none; padding: 12px 32px; border-radius: 12px; color: white; font-weight: 800; box-shadow: 0 4px 6px rgba(37,99,235,0.2); }

                .animate-pop { animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default EmailReminderModule;
