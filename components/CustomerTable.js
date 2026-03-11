"use client";

import React, { useState } from 'react';

const CustomerTable = ({ customers, selectedRegion }) => {
  return (
    <div className="card border-0 h-100 custom-shadow rounded-4 overflow-hidden">
      <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div>
          <h6 className="mb-0 fw-bold text-dark fs-5">
            {selectedRegion ? `Customers in ${selectedRegion}` : 'Customer Registry'}
          </h6>
        </div>
        {customers.length > 0 && (
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
            {customers.length} Accounts
          </span>
        )}
      </div>
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: '500px' }}>
          <table className="table table-borderless table-hover mb-0 align-middle">
            <thead className="table-light sticky-top bg-white shadow-sm" style={{ zIndex: 1 }}>
              <tr>
                <th className="py-3 px-4 text-muted fw-semibold small text-uppercase tracking-wide">Client Details</th>
                <th className="py-3 px-4 text-muted fw-semibold small text-uppercase tracking-wide">Location</th>
                <th className="py-3 px-4 text-muted fw-semibold small text-uppercase tracking-wide">Contact</th>
                <th className="py-3 px-4 text-muted fw-semibold small text-uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <span className="fw-bold">{customer.customerName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{customer.customerName}</div>
                          <div className="small text-secondary">{customer.product}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-dark fw-medium">{customer.district}</div>
                      <div className="small text-secondary">{customer.state}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-dark"><i className="bi bi-person me-2 text-muted"></i>{customer.contactPerson}</div>
                      <div className="small text-secondary"><i className="bi bi-telephone me-2 text-muted"></i>{customer.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill px-3 py-2 ${customer.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} fw-medium`}>
                        <span className={`d-inline-block rounded-circle me-2 ${customer.status === 'Active' ? 'bg-success' : 'bg-secondary'}`} style={{ width: '6px', height: '6px' }}></span>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="py-5 d-flex flex-column align-items-center justify-content-center opacity-75">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                        <i className="bi bi-map text-secondary fs-3"></i>
                      </div>
                      <h5 className="text-dark fw-semibold">No Regional Data Selected</h5>
                      <p className="text-muted w-75">Please select a state or prominent district on the interactive map to view assigned clients and operations.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
