import React, { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext(null);

export const useRegistration = () => useContext(RegistrationContext);

export function RegistrationProvider({ children }) {
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+91 98765 43210',
    emailAddress: 'john.doe@email.com',
    dob: '',
    gender: '',
    permanentAddress: 'Street, Building, Flat No.',
    city: 'Mumbai',
    state: '',
    pinCode: '400001',

    // Step 2: Professional Info
    coreRole: 'Sales Agent',
    employeeId: 'AG-88291',
    designation: 'Portfolio Manager',
    branchLocation: '',
    yearsOfExperience: '',
    licenseNumber: 'INS-XXXX-XXXX',
    specialization: '',
    reportingManager: '',

    // Step 3: KYC Upload Placeholders
    panCardFile: 'pan_card_copy.pdf',
    aadhaarCardFile: 'Aadhaar Front.jpg',
    agentLicenseFile: null,
    addressProofFile: null,
    profilePhotoFile: null,

    // Step 4: Credentials
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',

    // Step 5: Declaration
    declarationAccepted: false
  });

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <RegistrationContext.Provider value={{ formData, updateFormData }}>
      {children}
    </RegistrationContext.Provider>
  );
}