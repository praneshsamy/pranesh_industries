"use client";
import React from 'react';
import EmailReminderModule from '@/components/EmailReminderModule';
import pendingData from '@/data/pendingInvoices.json';

const TestReminderPage = () => {
    return (
        <div className="page-wrapper py-5 px-3">
            <div className="container-fluid max-w-7xl">
                <header className="page-header d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <i className="bi bi-shield-check-fill text-primary fs-3"></i>
                            <h1 className="main-title mb-0">Financial Operations</h1>
                        </div>
                        <p className="sub-title mb-0">Globus Engineering Tools • Live Recovery Pipeline</p>
                    </div>
                </header>
                
                <div className="content-area">
                    <EmailReminderModule invoices={pendingData} />
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                body { 
                    font-family: 'Plus Jakarta Sans', sans-serif; 
                    background-color: #f8fafc;
                    color: #1a1a1a;
                }
                
                .max-w-7xl { max-width: 1400px; margin: 0 auto; }
                .main-title { font-weight: 800; font-size: 1.75rem; letter-spacing: -0.03em; }
                .sub-title { font-weight: 600; color: #64748b; font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default TestReminderPage;
