// src/context/LeadContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [masterLeadsData, setMasterLeadsData] = useState([
    { id: '#LD-8924', name: 'Arjun Mehta', interest: 'Term Life', score: '85', temp: 'HOT', status: '• New', statusColor: 'text-blue-700 bg-blue-50 border-blue-100', time: '2h ago', initials: 'AM', avatarBg: 'bg-blue-600' },
    { id: '#LD-8925', name: 'Sara Khan', interest: 'ULIP', score: '65', temp: 'WARM', status: 'Contacted', statusColor: 'text-amber-700 bg-amber-50 border-amber-100', time: 'Yesterday', initials: 'SK', avatarBg: 'bg-indigo-500' },
    { id: '#LD-8926', name: 'Rohan Joshi', interest: 'Term Life', score: '92', temp: 'HOT', status: 'Proposal', statusColor: 'text-purple-700 bg-purple-50 border-purple-100', time: '15m ago', initials: 'RJ', avatarBg: 'bg-emerald-600' }
  ]);

  const [wizardLeadForm, setWizardLeadForm] = useState({
    id: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    occupation: '',
    annualIncome: '',
    city: '',
    state: '',
    pincode: '',
    leadSource: 'Website',
    referralName: '',
    insuranceGoal: 'Family Protection',
    coverageAmount: '',
    policyTerm: '35',
    premiumFrequency: 'Half-Yearly',
    nationality: 'Indian',
    panNumber: '',
    employmentType: 'Salaried',
    smokingStatus: 'Non-Smoker',
    alcoholConsumption: 'No',
    medicalHistory: '',
    spouseName: '',
    dependentsCount: '0',
    childrenCount: '0',
    leadStatus: '• New',
    preferredTime: '10:00 AM - 02:00 PM',
    nextFollowUp: '2026-06-25'
  });

  const addNewLeadToMaster = (newLead) => {
    setMasterLeadsData((prev) => [newLead, ...prev]);
  };

  const resetWizardForm = () => {
    setWizardLeadForm({
      id: '', fullName: '', mobileNumber: '', email: '', dob: '', gender: 'Male', maritalStatus: 'Single',
      occupation: '', annualIncome: '', city: '', state: '', pincode: '', leadSource: 'Website', referralName: '',
      insuranceGoal: 'Family Protection', coverageAmount: '', policyTerm: '35', premiumFrequency: 'Half-Yearly',
      nationality: 'Indian', panNumber: '', employmentType: 'Salaried', smokingStatus: 'Non-Smoker',
      alcoholConsumption: 'No', medicalHistory: '', spouseName: '', dependentsCount: '0', childrenCount: '0',
      leadStatus: '• New', preferredTime: '10:00 AM - 02:00 PM', nextFollowUp: '2026-06-25'
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