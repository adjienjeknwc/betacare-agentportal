// src/context/LeadContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  // Master Array state to simulate your live CRM database ledger
  const [masterLeadsData, setMasterLeadsData] = useState([
    { id: '#LD-8924', name: 'Arjun Mehta', interest: 'Term Life', score: '85', temp: 'HOT', status: '• Sent', statusColor: 'text-blue-700 bg-blue-50 border-blue-100', time: '2h ago', initials: 'AM', avatarBg: 'bg-blue-600' },
    { id: '#LD-8925', name: 'Sara Khan', interest: 'ULIP', score: '65', temp: 'WARM', status: 'Contacted', statusColor: 'text-amber-700 bg-amber-50 border-amber-100', time: 'Yesterday', initials: 'SK', avatarBg: 'bg-indigo-500' },
    { id: '#LD-8926', name: 'Rohan Joshi', interest: 'Term Life', score: '92', temp: 'HOT', status: 'Proposal', statusColor: 'text-purple-700 bg-purple-50 border-purple-100', time: '15m ago', initials: 'RJ', avatarBg: 'bg-emerald-600' }
  ]);

  // Shared state holding active inputs across your 6-step registration wizard
  const [wizardLeadForm, setWizardLeadForm] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    mobileNumber: '',
    email: '',
    occupation: '',
    annualIncome: '',
    city: '',
    smokingStatus: 'Non-Smoker',
    planInterest: 'Term Life'
  });

  // Handler to inject a newly generated lead directly into the dashboard timeline view
  const addNewLeadToMaster = (newLead) => {
    setMasterLeadsData((prevLeads) => [newLead, ...prevLeads]);
  };

  const resetWizardForm = () => {
    setWizardLeadForm({
      fullName: '', dob: '', gender: 'Male', mobileNumber: '', email: '',
      occupation: '', annualIncome: '', city: '', smokingStatus: 'Non-Smoker', planInterest: 'Term Life'
    });
  };

  return (
    <LeadContext.Provider value={{ 
      masterLeadsData, 
      wizardLeadForm, 
      setWizardLeadForm, 
      addNewLeadToMaster,
      resetWizardForm 
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);