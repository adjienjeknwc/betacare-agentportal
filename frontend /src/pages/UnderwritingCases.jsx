import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolicies } from '../context/PolicyContext'; // IMPORT SHARED CONTEXT HOOK
import { 
  Search, Shield, FileText, CheckCircle2, XCircle, AlertCircle, 
  Clock, ArrowLeft, Filter, Calendar, Upload, ShieldCheck, 
  ArrowRight, Activity, ChevronRight, CreditCard, Landmark, RefreshCw
} from 'lucide-react';

export default function UnderwritingCases() {
  const navigate = useNavigate();
  const { issueNewPolicyRecord } = usePolicies(); // BIND SHARED DISPATCH HOOK
  
  const [viewingCaseId, setViewingCaseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  
  // States for billing remittance execution workflows
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('upi');

  // --- Master Active CRM Dataset ---
  const casesData = [
    { id: 'APP-2026-1001', customer: 'Rahul Sharma', product: 'Term Plan', submitted: '12 Jun', status: 'Approved', decisionDate: '15 Jun', sumAssured: '₹1,50,00,000', premium: '₹23,840/yr', email: 'rahul.sharma@example.com' },
    { id: 'APP-2026-1002', customer: 'Priya Mehta', product: 'ULIP', submitted: '13 Jun', status: 'Pending', decisionDate: '-', sumAssured: '₹80,00,000', premium: '₹48,000/yr', email: 'priya.mehta@example.com' },
    { id: 'APP-2026-1003', customer: 'Raj Jain', product: 'Term Plan', submitted: '14 Jun', status: 'Rejected', decisionDate: '15 Jun', sumAssured: '₹2,00,00,000', premium: '₹32,500/yr', email: 'raj.jain@example.com' },
    { id: 'APP-2026-1004', customer: 'Amit Patel', product: 'Endowment', submitted: '10 Jun', status: 'Additional Docs Required', decisionDate: '11 Jun', sumAssured: '₹50,00,000', premium: '₹62,000/yr', email: 'amit.patel@example.com' },
    { id: 'APP-2026-1005', customer: 'Sanjana Rao', product: 'Health Protect', submitted: '09 Jun', status: 'Medical Required', decisionDate: '11 Jun', sumAssured: '₹1,20,00,000', premium: '₹18,500/yr', email: 'sanjana.rao@example.com' },
  ];

  const selectedCaseDetails = casesData.find(c => c.id === viewingCaseId);
  const generatedPolicyNumber = `POL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    
  // Refactored Payment Action to safely capture data, issue record, and unlock states
  const executePaymentRemittance = () => {
    if (!selectedCaseDetails) return;

    const issuedAssetRow = {
      id: generatedPolicyNumber,
      holderName: selectedCaseDetails.customer,
      planName: selectedCaseDetails.product,
      coverageAmount: selectedCaseDetails.sumAssured,
      premiumAmount: selectedCaseDetails.premium.split('/')[0], // Extract raw amount fields
      frequency: 'Annual',
      issueDate: '15 Jun 2026', // Current Date
      status: 'Active'
    };

    // Commit asset records live into shared state repository
    issueNewPolicyRecord(issuedAssetRow);
    setPaymentCompleted(true);
  };

  const getStatusBadge = (status) => {
    const configurations = {
      'Approved': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'Pending': 'bg-amber-50 border-amber-200 text-amber-700',
      'Rejected': 'bg-rose-50 border-rose-200 text-rose-700',
      'Additional Docs Required': 'bg-purple-50 border-purple-200 text-purple-700',
      'Medical Required': 'bg-blue-50 border-blue-200 text-blue-700',
    };
    return configurations[status] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  const filteredCases = casesData.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesProduct = productFilter === 'All' || item.product === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const closeCaseWorkspace = () => {
    setViewingCaseId(null);
    setIsPaymentExpanded(false);
    setPaymentCompleted(false);
  };

  // --- MAIN TABLE VIEW ---
  if (!viewingCaseId) {
    return (
      <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-12 w-full">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sticky top-0 z-40 w-full">
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Underwriting Cases</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">
              Track all applications currently under underwriting review.
            </span>
          </div>
        </header>

        <main className="max-w-[1400px] w-full mx-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Cases', value: 245, color: 'text-slate-900 border-slate-200' },
              { label: 'Pending Review', value: 67, color: 'text-amber-600 border-amber-200 bg-amber-50/10' },
              { label: 'Approved', value: 153, color: 'text-emerald-600 border-emerald-200 bg-emerald-50/10' },
              { label: 'Rejected', value: 25, color: 'text-rose-600 border-rose-200 bg-rose-50/10' },
              { label: 'Action Needed', value: 12, color: 'text-purple-600 border-purple-200 bg-purple-50/10' }
            ].map((kpi, idx) => (
              <div key={idx} className={`bg-white border rounded-2xl p-4 shadow-3xs flex flex-col items-start ${kpi.color}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <span className="text-2xl font-black mt-1 block">{kpi.value}</span>
              </div>
            ))}
          </div>

          {/* Filtering Control Row */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-xs font-bold text-slate-700">
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Search className="w-3 h-3" /> Search Workplace</label>
              <input type="text" placeholder="App ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-[#0F478D]" />
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Filter className="w-3 h-3" /> Status Matrix</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Additional Docs Required">Additional Docs Required</option>
                <option value="Medical Required">Medical Required</option>
              </select>
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Shield className="w-3 h-3" /> Product Type</label>
              <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#0F478D]">
                <option value="All">All Products</option>
                <option value="Term Plan">Term Plan</option>
                <option value="ULIP">ULIP</option>
                <option value="Endowment">Endowment</option>
                <option value="Health Protect">Health Protect</option>
              </select>
            </div>
            <div className="flex flex-col items-start w-full">
              <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Time Horizon</label>
              <div className="w-full h-10 border border-slate-200 bg-slate-50 rounded-xl flex items-center px-3 text-slate-500 font-bold cursor-pointer"><span>Last 30 Days</span></div>
            </div>
          </div>

          {/* Core Table Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Application ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Product Matrix</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Underwriting Status</th>
                    <th className="py-3.5 px-4">Decision Date</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCases.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#0B1F5B]">{item.id}</td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">{item.customer}</td>
                      <td className="py-4 px-4">{item.product}</td>
                      <td className="py-4 px-4 text-slate-500">{item.submitted}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-wide rounded-full ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-500">{item.decisionDate}</td>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => setViewingCaseId(item.id)} className="h-8 px-3 border border-slate-200 rounded-lg font-bold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1 mx-auto">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- WORKSPACE CASE VIEW DETAILS ---
  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full animate-fade-in">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={closeCaseWorkspace} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-tight">Case Underwriting Overview</h1>
            <span className="text-slate-400 font-bold block mt-0.5 uppercase tracking-wider text-[10px]">REVIEWING CASE: {selectedCaseDetails.id}</span>
          </div>
        </div>
        <span className={`px-3 py-1 border text-xs font-black uppercase tracking-wider rounded-md ${getStatusBadge(paymentCompleted ? 'Approved' : selectedCaseDetails.status)}`}>
          {paymentCompleted ? 'Active Issued' : selectedCaseDetails.status}
        </span>
      </header>

      <main className="max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Core Profile Ledger Forms Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary Information Grid Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0F478D]" />
              <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Application Summary</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Application ID</span>
                <span className="text-mono font-bold text-slate-900 block mt-0.5">{selectedCaseDetails.id}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Customer Name</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.customer}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Plan Architecture</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.product}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Face Valued Sum Assured</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.sumAssured}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Premium Rate Card</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.premium}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Submission Timeline</span>
                <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.submitted} 2026</span>
              </div>
            </div>
          </div>

          {/* Underwriting Verification Status Frame */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Underwriting Status Verification</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Automated verification parameters based on central risk evaluations.</p>
            </div>

            {selectedCaseDetails.status === 'Approved' && (
              <div className="p-5 border border-emerald-200 bg-emerald-50/10 rounded-xl space-y-4 text-xs font-semibold">
                <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Application Cleared</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Risk Classification Matrix</span>
                    <span className="text-slate-900 font-extrabold block mt-0.5">Standard Risk Tier</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Clearance Anniversary</span>
                    <span className="text-slate-900 font-bold block mt-0.5">{selectedCaseDetails.decisionDate} Jun 2026</span>
                  </div>
                  <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Underwriter Notes</span>
                    <p className="text-slate-600 font-medium mt-1 leading-relaxed">Application meets all baseline liability requirements. All profile declarations pass risk thresholds cleanly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================================================
              FIXED & HIGH-DENSITY PREMIUM REMITTANCE WORKSPACE BLOCK
              ========================================================================== */}
          {isPaymentExpanded && (
            <div id="premium-remittance-deck" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 scroll-mt-6 animate-slide-up w-full">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black text-[#0B1F5B] uppercase tracking-wider">Step 12 — Premium Remittance Gateway</h2>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Secure clearing gateway module for capturing initial policy deposits.</p>
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-md ${
                  paymentCompleted ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-amber-50 border border-amber-200 text-amber-700'
                }`}>
                  {paymentCompleted ? 'Remittance Success' : 'Awaiting Clearing'}
                </span>
              </div>

              {!paymentCompleted ? (
                /* TWO COLUMN RE-ALIGNMENT MATRIX FOR FLUID DESKTOP CAPTURE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Select Payment Method Left Pane */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Authorized Remittance Mode</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                      {[
                        { id: 'upi', title: 'Instant UPI Intent Node', desc: 'Google Pay, PhonePe, BHIM' },
                        { id: 'netbanking', title: 'Net Banking Network', desc: 'Direct corporate banking link' },
                        { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay, Amex' },
                        { id: 'nach', title: 'NACH / Auto-Debit Setup', desc: 'Auto-recurring annual cycles' }
                      ].map((mode) => (
                        <label 
                          key={mode.id} 
                          onClick={() => setSelectedPaymentMode(mode.id)}
                          className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                            selectedPaymentMode === mode.id ? 'border-[#0B1F5B] bg-blue-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <input type="radio" name="payment_mode" checked={selectedPaymentMode === mode.id} onChange={() => {}} className="mt-0.5 accent-[#0B1F5B]" />
                          <div className="flex flex-col text-left">
                            <span className="text-slate-900 font-extrabold">{mode.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{mode.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 text-xs font-medium text-slate-600">
                      <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 animate-pulse" />
                      <div className="text-left">
                        <span className="font-bold text-slate-900 block">PCI-DSS Level 1 Secure Vault Link</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Remittance streams are fully tokenized point-to-point via asymmetric keys.</p>
                      </div>
                    </div>
                  </div>

                  {/* Accounting Invoice Statements Right Card */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200 pb-2 mb-4 text-left">Premium Accounting Statement</h4>
                      <div className="space-y-3 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between"><span>Base Annual premium</span><span className="font-bold text-slate-900">₹16,500</span></div>
                        <div className="flex justify-between"><span>Supplementary Riders</span><span className="font-bold text-slate-900">₹3,700</span></div>
                        <div className="flex justify-between"><span>Statutory GST (18%)</span><span className="font-bold text-slate-900">₹3,640</span></div>
                        <div className="pt-2 border-t border-slate-200 border-dashed flex justify-between text-slate-900 font-black text-sm">
                          <span>Total Premium Payable</span>
                          <span className="text-[#0B1F5B] font-black text-base">₹23,840</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={executePaymentRemittance}
                      className="w-full h-11 bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Execute Secure Payment</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* HIGH DENSITY REMITTANCE CLEARING CONFIRMATION SCREEN */
                <div className="p-8 border border-emerald-100 bg-emerald-50/10 rounded-xl text-center space-y-4 animate-fade-in max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Initial Premium Token Captured</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Transaction reference ID: <span className="font-mono font-bold text-[#0B1F5B]">TXN-99834212-A</span> has cleared bank settlement rails cleanly.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/40 flex items-center justify-center">
                  <button 
  onClick={() => navigate(`/policies/${generatedPolicyNumber}`)}
  className="h-10 px-5 bg-[#0B1F5B] text-white font-black text-xs rounded-xl shadow-xs hover:bg-[#0B1E46] transition-colors"
>
  View Policy Workspace Detail View →
</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Flow Actions Menu Panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[112px]">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2">Required Agent Next Step</h3>
            
            {selectedCaseDetails.status === 'Approved' && !isPaymentExpanded && (
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsPaymentExpanded(true);
                    setTimeout(() => {
                      document.getElementById('premium-remittance-deck')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full h-11 bg-[#0B1F5B] text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-[#0B1E46] transition-all"
                >
                  <span>Proceed to Premium Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full h-11 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>View Issued Policy Contract</span>
                </button>
              </div>
            )}

            {selectedCaseDetails.status === 'Approved' && isPaymentExpanded && (
              <div className="text-center p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#0B1F5B] animate-spin" />
                <span>Processing Payment Layout Below...</span>
              </div>
            )}

            {selectedCaseDetails.status === 'Additional Docs Required' && (
              <button className="w-full h-11 bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-purple-800 transition-all">
                <Upload className="w-4 h-4" /> <span>Upload Missing Evidence</span>
              </button>
            )}

            {selectedCaseDetails.status === 'Medical Required' && (
              <button className="w-full h-11 bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all">
                <Calendar className="w-4 h-4" /> <span>Schedule Medical Diagnostics</span>
              </button>
            )}

            {selectedCaseDetails.status === 'Pending' && (
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center text-slate-400 text-xs font-bold">
                🔒 Application Locked. Underwriting operations in progress.
              </div>
            )}

            {selectedCaseDetails.status === 'Rejected' && (
              <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-left text-rose-900 text-xs font-semibold leading-relaxed">
                This file has closed underwriting review. Please contact the regional panel lead for policy design escalations.
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b pb-2">Underwriting Process Audit</h3>
            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                { step: 'Proposal Submitted', done: true },
                { step: 'KYC Verification Done', done: true },
                { step: 'Document Authentication Matrix', done: true },
                { step: 'Medical Examination Assessment', done: ['Approved', 'Rejected', 'Additional Docs Required'].includes(selectedCaseDetails.status) },
                { step: 'Core Underwriting Review Run', done: ['Approved', 'Rejected'].includes(selectedCaseDetails.status) },
                { step: 'Final Policy Decision Issued', done: ['Approved', 'Rejected'].includes(selectedCaseDetails.status) },
                { step: 'Premium Collected & Policy Active', done: paymentCompleted }
              ].map((log, index) => (
                <div key={index} className="flex gap-4 items-start relative text-xs text-left font-semibold">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    log.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {log.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <span className={log.done ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}>{log.step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}