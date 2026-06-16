// src/pages/NewPolicyWorkflow.jsx
import React, { useState } from "react";
import { RegistrationProvider } from "../context/RegistrationContext";
import { LeadProvider } from "../context/LeadContext";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function NewPolicyWorkflow() {
  const [wizardStep, setWizardStep] = useState(1);
  const [policyForm, setPolicyForm] = useState({
    fullName: "",
    planType: "Term Life",
    sumAssured: "",
  });

  const nextStep = () => setWizardStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setWizardStep((prev) => Math.max(prev - 1, 1));

  return (
    <RegistrationProvider>
      <LeadProvider>
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-[#0B1F5B] mb-6">New Policy Application - Step {wizardStep}</h2>

          {/* Workflow Content */}
          <div className="min-h-[300px]">
            {wizardStep === 1 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase">Client Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl"
                  value={policyForm.fullName}
                  onChange={(e) => setPolicyForm({...policyForm, fullName: e.target.value})}
                />
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase">Select Plan Type</label>
                <select 
                  className="w-full p-3 border rounded-xl"
                  value={policyForm.planType}
                  onChange={(e) => setPolicyForm({...policyForm, planType: e.target.value})}
                >
                  <option>Term Life</option>
                  <option>Whole Life</option>
                  <option>Endowment</option>
                </select>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold">Review Details</h3>
                <p className="text-sm">Please verify the information for {policyForm.fullName} before issuing the policy.</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button 
              onClick={prevStep} 
              disabled={wizardStep === 1}
              className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Previous
            </button>
            
            {wizardStep < 3 ? (
              <button 
                onClick={nextStep} 
                className="px-4 py-2 bg-[#0B1F5B] text-white rounded-lg font-bold"
              >
                Next Step <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            ) : (
              <button 
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold"
              >
                Issue Policy <Check className="w-4 h-4 inline ml-1" />
              </button>
            )}
          </div>
        </div>
      </LeadProvider>
    </RegistrationProvider>
  );
}