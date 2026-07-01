// src/context/PolicyContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PolicyContext = createContext(null);

export const PolicyProvider = ({ children }) => {
  // Master active policy repository layout grid dataset
  const [masterPolicies, setMasterPolicies] = useState([
    { id: 'POL-2026-1102', holderName: 'Meera Nair', planName: 'Whole Life Core', coverageAmount: '₹50,00,000', premiumAmount: '₹62,000', frequency: 'Annual', issueDate: '11 Jun 2026', status: 'Active' },
    { id: 'POL-2026-1105', holderName: 'Sanjana Rao', planName: 'Health Protect Pro', coverageAmount: '₹1,20,00,000', premiumAmount: '₹18,500', frequency: 'Annual', issueDate: '12 Jun 2026', status: 'Active' }
  ]);

  const issueNewPolicyRecord = (newPolicy) => {
    setMasterPolicies((prev) => [newPolicy, ...prev]);
  };

  return (
    <PolicyContext.Provider value={{ masterPolicies, issueNewPolicyRecord }}>
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicies = () => useContext(PolicyContext);