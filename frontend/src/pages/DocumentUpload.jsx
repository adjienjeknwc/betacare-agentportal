// src/pages/DocumentUpload.jsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Check, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentUpload() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead] = useState(location.state?.lead || null);
  const [quoteParams] = useState(location.state?.quoteParams || null);
  const [proposalFormData] = useState(location.state?.proposalFormData || null);

  const [toastMsg, setToastMsg] = useState('');
  
  // Document states
  const [docs, setDocs] = useState({
    panCard: null,
    aadhaarCard: null,
    addressProof: null,
    incomeProof: null,
    photograph: null
  });

  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleMockUpload = (docKey) => {
    setUploadingDoc(docKey);
    setTimeout(() => {
      setDocs(prev => ({ ...prev, [docKey]: `DOC_MOCK_${docKey.toUpperCase()}_REV26.pdf` }));
      setUploadingDoc(null);
      setToastMsg(`${docKey.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
      setTimeout(() => setToastMsg(''), 3000);
    }, 1200);
  };

  const uploadProgress = useMemo(() => {
    const requiredKeys = ['panCard', 'aadhaarCard', 'incomeProof', 'photograph'];
    let uploadedCount = 0;
    requiredKeys.forEach(k => {
      if (docs[k]) uploadedCount++;
    });
    return {
      percentage: Math.round((uploadedCount / requiredKeys.length) * 100),
      isEligible: uploadedCount === requiredKeys.length
    };
  }, [docs]);

  const handleProceedToReview = async () => {
    if (!uploadProgress.isEligible) {
      setToastMsg('Error: Please upload all mandatory documents first.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('agent_token');
      // Save documents to lead in backend database
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Documents Uploaded',
          proposalDocuments: docs
        })
      });
      navigate(`/lead-management/proposal-review/${leadId}`, {
        state: { lead, quoteParams, proposalFormData, proposalDocuments: docs }
      });
    } catch (err) {
      console.error(err);
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
          <button type="button" onClick={() => navigate(`/lead-management/proposal-form/${leadId}`, { state: { lead, quoteParams } })} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Step 4 — Document Upload Center</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {leadId.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Progress Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center select-none text-xs font-black uppercase text-[#0B1F5B] tracking-wider">
            <span>Mandatory Upload Progress</span>
            <span>{uploadProgress.percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border">
            <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${uploadProgress.percentage}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            * PAN Card, Aadhaar Card, Income Proof, and Customer Photograph are strictly mandatory files required to file the insurance application.
          </p>
        </div>

        {/* Upload forms grid */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          {[
            { key: 'panCard', label: 'PAN Card Proof', req: true, desc: 'Government tax identification record card.' },
            { key: 'aadhaarCard', label: 'Aadhaar Card Proof', req: true, desc: 'Biometric identity certificate proof.' },
            { key: 'addressProof', label: 'Utility Bill Address Proof', req: false, desc: 'Electricity, gas bills or rental contracts.' },
            { key: 'incomeProof', label: 'Income Verification Proof', req: true, desc: 'Salary payslips, Form 16, or ITR records.' },
            { key: 'photograph', label: 'Photograph (Applicant)', req: true, desc: 'Recent professional close face scan.' }
          ].map(doc => (
            <div key={doc.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl gap-3 text-xs font-semibold">
              <div className="text-left">
                <span className="text-slate-900 font-black flex items-center gap-1">
                  {doc.label} {doc.req && <span className="text-rose-500 font-black">*</span>}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{doc.desc}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <div className="min-w-[120px] text-left">
                  {docs[doc.key] ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Uploaded</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1 select-none">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={uploadingDoc !== null}
                  onClick={() => handleMockUpload(doc.key)}
                  className={`h-9 px-4 border rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-[11px] ${
                    docs[doc.key] ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {uploadingDoc === doc.key ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>{docs[doc.key] ? 'Re-upload' : 'Upload'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t flex justify-between select-none">
          <button onClick={() => navigate(`/lead-management/proposal-form/${leadId}`, { state: { lead, quoteParams } })} className="h-11 px-5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs">
            <span>Back to Form</span>
          </button>
          
          <button
            onClick={handleProceedToReview}
            disabled={!uploadProgress.isEligible}
            className={`h-11 px-6 font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 focus:outline-none transition-all ${
              uploadProgress.isEligible ? 'bg-[#0B1F5B] hover:bg-black text-white cursor-pointer' : 'bg-slate-300 text-slate-450 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Proceed to Proposal Review →</span>
          </button>
        </div>

      </main>
    </div>
  );
}
