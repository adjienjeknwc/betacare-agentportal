// src/pages/ProposalReview.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ProposalReview() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead] = useState(location.state?.lead || null);
  const [quoteParams] = useState(location.state?.quoteParams || null);
  const [proposalFormData] = useState(location.state?.proposalFormData || null);
  const [proposalDocuments] = useState(location.state?.proposalDocuments || null);

  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitProposal = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('agent_token');
      const payload = {
        leadId,
        customerName: proposalFormData?.fullName || lead?.customerName || 'Rahul Sharma',
        planName: quoteParams?.planName || 'Betacare Life Term Protect',
        sumAssured: quoteParams?.sumAssured || 28500000,
        premium: quoteParams?.totalPayable || 23840,
        kycDocuments: proposalDocuments,
        proposalFormData // Save the complete medical and nominee form
      };
      
      const res = await fetch('/api/underwriting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setToastMsg('Proposal submitted successfully!');
        setTimeout(() => {
          navigate(`/lead-management/proposal-submitted/${leadId}`, {
            state: { lead, quoteParams, proposalId: data.data._id }
          });
        }, 1500);
      } else {
        setToastMsg(`Submission error: ${data.message}`);
        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to submit proposal to server.');
      setTimeout(() => setToastMsg(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-16 w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(`/lead-management/document-upload/${leadId}`, { state: { lead, quoteParams, proposalFormData } })} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Step 5 — Proposal Summary Review</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {leadId.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Core summary fields */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-xs font-semibold text-slate-700">
          
          {/* Section 1: Customer info */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">Applicant & Nominee details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-400 block text-[10px]">FULL NAME</span><span className="text-slate-900 block mt-0.5">{proposalFormData?.fullName}</span></div>
              <div><span className="text-slate-400 block text-[10px]">DATE OF BIRTH</span><span className="text-slate-900 block mt-0.5">{proposalFormData?.dob}</span></div>
              <div><span className="text-slate-400 block text-[10px]">NOMINEE NAME</span><span className="text-slate-900 block mt-0.5">{proposalFormData?.nomineeName} ({proposalFormData?.nomineeRelationship})</span></div>
              <div><span className="text-slate-400 block text-[10px]">NOMINEE AGE</span><span className="text-slate-900 block mt-0.5">{proposalFormData?.nomineeAge} yrs</span></div>
            </div>
          </div>

          {/* Section 2: Coverage & Plan info */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">Plan & Underwriting Cover</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-400 block text-[10px]">SELECTED PLAN</span><span className="text-slate-900 block mt-0.5">{quoteParams?.planName}</span></div>
              <div><span className="text-slate-400 block text-[10px]">SUM ASSURED</span><span className="text-[#0B1F5B] font-extrabold block mt-0.5">₹{quoteParams?.sumAssured?.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400 block text-[10px]">ANNUAL PREMIUM</span><span className="text-slate-900 font-extrabold block mt-0.5">₹{quoteParams?.totalPayable?.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400 block text-[10px]">FREQUENCY</span><span className="text-slate-900 block mt-0.5">{quoteParams?.premiumFrequency}</span></div>
            </div>
          </div>

          {/* Section 3: Medical risk assessment summary */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">Medical risk checklist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-900 font-bold">
              <div className="p-3 bg-slate-50 border rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase">Pre-existing illness?</span>
                <span className="block mt-0.5">{proposalFormData?.hasPreExistingIllness}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase">Chronic chronic ailments?</span>
                <span className="block mt-0.5">{proposalFormData?.hasChronicAilments}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase">Prior hospitalization?</span>
                <span className="block mt-0.5">{proposalFormData?.hasHospitalizationHistory}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Uploaded Files */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 border-b pb-1.5 uppercase tracking-wider">Uploaded Documents Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-slate-800 font-bold text-[11px]">
              {proposalDocuments && Object.entries(proposalDocuments).filter(([_, val]) => !!val).map(([key, val]) => (
                <div key={key} className="p-2.5 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0B1F5B] shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <span className="text-slate-900 font-black block truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-[9px] text-slate-400 font-mono block truncate mt-0.5">{val}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Dec list */}
          <div className="p-4 border border-blue-100 bg-blue-50/10 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-900 font-extrabold block">Filing suited parameters clearance certification</span>
              <p className="text-[10px] text-slate-450 font-semibold block mt-0.5 leading-relaxed">
                By submitting this proposal, the sales agent certifies that the client's declarations match physical KYC files and annual inflow bank statements.
              </p>
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="pt-4 flex justify-between select-none">
          <button onClick={() => navigate(`/lead-management/document-upload/${leadId}`, { state: { lead, quoteParams, proposalFormData } })} className="h-11 px-5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs">
            <span>Edit Form</span>
          </button>
          
          <button
            onClick={handleSubmitProposal}
            disabled={submitting}
            className="h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{submitting ? 'Submitting to Underwriting...' : 'Submit Proposal to Underwriting Review →'}</span>
          </button>
        </div>

      </main>
    </div>
  );
}
