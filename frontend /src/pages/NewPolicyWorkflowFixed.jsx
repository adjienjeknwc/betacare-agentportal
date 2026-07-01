// src/pages/NewPolicyWorkflowFixed.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext'; // Hook into the master database array context
import { X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function NewPolicyWorkflowFixed({ onClose }) {
  const navigate = useNavigate();
  const { masterLeadsData } = useLeads();
  
  // Local active states tracking data changes live
  const [availableLeads, setAvailableLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);

  // ==========================================================================
  // PIPELINE FILTERING & LIFECYCLE SYNCHRONIZER
  // Fetches leads from backend and displays ONLY underwriter-approved cases
  // ==========================================================================
  useEffect(() => {
    const fetchApprovedLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('agent_token');
        const res = await fetch('/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          const approved = (data.data || []).filter(lead => {
            const cleanStatus = (lead.status || '').toLowerCase();
            return cleanStatus === 'approved';
          }).map(lead => ({
            id: lead._id || lead.id,
            name: lead.customerName || lead.fullName || 'Unnamed Lead',
            email: lead.email || lead.emailAddress || 'No Email',
            phone: lead.phone || lead.mobileNumber || '—',
            status: lead.status || 'Approved',
            statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100'
          }));
          
          setAvailableLeads(approved);
          if (approved.length > 0 && !selectedLeadId) {
            setSelectedLeadId(approved[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch approved leads:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedLeads();
  }, [selectedLeadId]);

  const handleNextStep = () => {
    const chosenTarget = availableLeads.find(l => l.id === selectedLeadId);
    
    if (currentStep === 1) {
      if (!chosenTarget) return;
      console.log("Passing Target Parameters to Step 2 Workflow Engine:", chosenTarget);
      setCurrentStep(2);
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (onClose) onClose();
      navigate('/active-policies');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans text-left antialiased">
      
      {/* MODAL MAIN VIEWPORT SHEET CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL TITLE HEADER LOG STRIP */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B1F5B] text-white flex items-center justify-center font-black text-sm">N</div>
            <div>
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider">New Application</h3>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest mt-0.5">Step {currentStep} of 5</span>
            </div>
          </div>
          <button type="button" onClick={() => { if (onClose) { onClose(); } else { navigate('/active-policies'); } }} className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors focus:outline-none">
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* MODAL CONTENT WORKSPACE BODY */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white min-w-0">
          
          {currentStep === 1 ? (
            <>
              {/* STEP 1 LABELS */}
              <div className="space-y-1 select-none">
                <h4 className="text-base font-black text-slate-900 tracking-tight">Step 1: Select Lead Target</h4>
                <p className="text-[11px] font-medium text-slate-400">Choose a qualified entry context module from the database network logs.</p>
              </div>

              {/* LIVE SYNCHRONIZED MATRIX ROWS CARDS */}
              <div className="space-y-3 pt-1">
                {availableLeads.length > 0 ? (
                  availableLeads.map((lead) => {
                    const isSelected = selectedLeadId === lead.id;
                    return (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`border-2 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between gap-4 group relative ${
                          isSelected 
                            ? 'border-[#0B1F5B] bg-blue-50/10 shadow-3xs' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-slate-900 tracking-tight">{lead.name}</span>
                            <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded-md">
                              {lead.id}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 truncate">
                            {lead.email || `${lead.name.toLowerCase().replace(/\s/g, '')}@enterprise.com`} • {lead.phone || lead.mobileNumber || '+91 XXXXX XXXXX'}
                          </p>
                        </div>

                        {/* ACTIONS MATCHING CHIPS */}
                        <div className="shrink-0 flex items-center gap-3 select-none">
                          <span className={`text-[10px] px-2 py-0.5 rounded-lg border ${lead.statusColor || 'text-blue-700 bg-blue-50 border-blue-100'}`}>
                            {lead.status || 'Qualified'}
                          </span>
                          
                          {/* Selected Bullet Ring */}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'border-[#0B1F5B] bg-[#0B1F5B]' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400 font-medium border border-dashed rounded-2xl bg-slate-50/50">
                    No underwriter-approved leads found. Please complete the underwriting clearance flow for a case first.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* WIZARD SUB-STEPS RENDERS */
            <div className="py-12 text-center space-y-3 select-none">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-black text-slate-900">Step {currentStep} Configuration Module Loaded</h4>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">Target context parameters have been mapped into your active policy generation tables.</p>
            </div>
          )}

        </div>

        {/* MODAL CONTROLLER ACTION FOOTER STEP TOW ROW */}
        <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between font-bold text-xs select-none">
          <button 
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`h-9 px-4 border rounded-xl flex items-center gap-1 bg-white ${
              currentStep === 1 ? 'text-slate-300 border-slate-200 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <button 
            type="button"
            disabled={availableLeads.length === 0}
            onClick={handleNextStep}
            className={`h-10 px-5 text-white font-black rounded-xl shadow-sm flex items-center gap-1.5 transition-all focus:outline-none ${
              availableLeads.length === 0 ? 'bg-slate-300 cursor-not-allowed opacity-60' : 'bg-[#0B1F5B] hover:bg-black'
            }`}
          >
            <span>{currentStep === 5 ? 'Submit Application' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>

      </div>
    </div>
  );
}