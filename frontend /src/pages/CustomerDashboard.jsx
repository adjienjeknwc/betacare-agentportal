// src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, User, CreditCard, Download, Heart, ArrowLeft, 
  CheckCircle2, Clock, HelpCircle, FileText, AlertCircle, RefreshCw
} from 'lucide-react';

export default function CustomerDashboard() {
  const { policyId } = useParams();
  const navigate = useNavigate();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('agent_token');
        const res = await fetch(`/api/policies/${policyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setPolicy(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (policyId) fetchPolicyData();
  }, [policyId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 gap-2">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0B1F5B]" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Customer Portal...</span>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 gap-4 p-6">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <span className="text-sm font-bold uppercase tracking-wider text-slate-900">No Policy Session Found</span>
        <button onClick={() => navigate('/login')} className="px-5 py-2.5 bg-[#0B1F5B] text-white rounded-xl text-xs font-bold">Return to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased text-left pb-12 w-full">
      {/* Premium Header */}
      <header className="bg-[#0B1F5B] text-white px-6 py-5 flex items-center justify-between sticky top-0 z-40 w-full shadow-md">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => window.history.back()} 
            className="p-2 border border-blue-900/60 bg-blue-950/40 text-blue-200 rounded-xl hover:bg-blue-900/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black tracking-tight text-lg sm:text-xl">Betacare Life Customer Service Desk</h1>
            <span className="text-[10px] text-blue-300 font-bold block uppercase tracking-wider mt-0.5">Policy Number: {policy.policyNumber}</span>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {policy.policyStatus}
        </span>
      </header>

      {/* Hero Customer Profile Panel */}
      <div className="bg-white border-b border-slate-200 py-6 px-6 shadow-3xs select-none">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-[#0B1F5B] flex items-center justify-center font-black text-xl shadow-3xs">
            {policy.customerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-black text-slate-900">Welcome, {policy.customerName}</h2>
            <p className="text-xs text-slate-400 font-semibold">Your comprehensive life insurance coverage is active and fully verified.</p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-[90px] select-none">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
            {[
              { id: 'overview', label: 'Coverage Overview', icon: Shield },
              { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
              { id: 'claims', label: 'File a Claim', icon: Heart },
              { id: 'documents', label: 'Documents Vault', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 border border-blue-100 text-blue-700 font-black' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab view containers */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Coverage Details</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Parameters of your active life policy cover.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left">
                  <span className="text-[9px] uppercase font-black text-slate-400">Policy Plan Blueprint</span>
                  <span className="text-base font-black text-slate-900 block mt-1">{policy.planName}</span>
                  <span className="text-slate-500 block mt-0.5">{policy.planType} Plan</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left">
                  <span className="text-[9px] uppercase font-black text-slate-400">Total Sum Assured</span>
                  <span className="text-lg font-black text-[#0B1F5B] block mt-1">₹{policy.sumAssured.toLocaleString('en-IN')}</span>
                  <span className="text-slate-400 block mt-0.5">Guaranteed protection payout</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold">
                <div><span className="text-slate-400 block text-[9px] uppercase">Commencement Date</span><span className="text-slate-950 font-bold block mt-1">{new Date(policy.policyCommencementDate).toLocaleDateString()}</span></div>
                <div><span className="text-slate-400 block text-[9px] uppercase">Next Premium Anniversary</span><span className="text-slate-950 font-bold block mt-1">{new Date(policy.nextPremiumDueDate).toLocaleDateString()}</span></div>
                <div><span className="text-slate-400 block text-[9px] uppercase">Annual Premium</span><span className="text-slate-950 font-bold block mt-1">₹{policy.totalAnnualPremium.toLocaleString('en-IN')}</span></div>
                <div><span className="text-slate-400 block text-[9px] uppercase">Billing mode</span><span className="text-slate-950 font-bold block mt-1">{policy.paymentFrequency}</span></div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="border-b pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Premium Ledger Statement</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Historical and upcoming invoice schedules.</p>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded border border-emerald-200">No Dues</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse font-semibold">
                  <thead>
                    <tr className="bg-slate-50 border-b font-black uppercase text-[9px] text-slate-400">
                      <th className="p-3">Remittance Date</th>
                      <th className="p-3">Reference ID</th>
                      <th className="p-3 text-right">Amount Paid</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3">{new Date(policy.policyCommencementDate).toLocaleDateString()}</td>
                      <td className="p-3 font-mono font-bold">TXN-881290</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{policy.totalAnnualPremium.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase">Successful</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">File an Insurance Claim</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Initialize a quick claim payout review request.</p>
              </div>

              <div className="p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B1F5B] flex items-center justify-center mx-auto shadow-3xs"><HelpCircle className="w-6 h-6" /></div>
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900 block">Initialize Claim Request</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                    Submit digital forms and required certificates to clear death, health, or critical illness claim reviews.
                  </p>
                </div>
                <button onClick={() => alert("Launching Claim application wizard...")} className="px-4 py-2 bg-[#0B1F5B] hover:bg-black text-white rounded-xl text-xs font-black transition-colors">Start Claim Request</button>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">My Documents Vault</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Download policy schedule sheets and verification slips.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Policy Schedule Pack', size: '1.2 MB', desc: 'Active signed coverage bond' },
                  { title: 'Premium Payment Receipt', size: '240 KB', desc: 'Invoice receipt copy for tax savings' },
                  { title: 'KYC Verification Slip', size: '120 KB', desc: 'Compliance cleared audit status' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-white hover:border-blue-300 transition-all flex items-center justify-between text-xs font-semibold">
                    <div className="text-left space-y-0.5">
                      <span className="font-black text-slate-900 block">{doc.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium block">{doc.desc} • {doc.size}</span>
                    </div>
                    <button onClick={() => alert(`Downloading document: ${doc.title}...`)} className="p-2 border rounded-lg text-slate-500 hover:text-black hover:bg-slate-50 transition-colors cursor-pointer"><Download className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
