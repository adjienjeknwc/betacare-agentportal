// src/pages/LeadDetails.jsx — Updated High-Contrast Structure
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Phone, MessageSquare, Mail, FileText, 
  ShieldCheck, Sparkles, Clock, Save, Upload, Download, Layers, CheckCircle, ArrowRight, User
} from 'lucide-react';

export default function LeadDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const leadData = useMemo(() => {
    return location.state?.lead || {
      id: '#LD-8926',
      name: 'Rohan Joshi',
      interest: 'Term Life',
      score: '92',
      temp: 'HOT',
      status: 'Proposal',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-100',
      time: '15m ago',
      initials: 'RJ',
      avatarBg: 'bg-emerald-600'
    };
  }, [location.state]);

  const [isEditable, setIsEditable] = useState(false);
  const [leadStatus, setLeadStatus] = useState(() => leadData.status || 'Interested');
  const [followUpDate, setFollowUpDate] = useState('2026-06-15');
  const [followUpTask, setFollowUpTask] = useState('Schedule Callback');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [notesTimestamp, setNotesTimestamp] = useState('Last updated: 10m ago by John');
  
  const [customerForm, setCustomerForm] = useState({
    fullName: leadData.name || 'Rohan Joshi',
    dob: '1991-06-15',
    gender: 'Male',
    mobile: '+91 98765 43210',
    email: (leadData.name || 'Rohan Joshi').toLowerCase().replace(/\s+/g, '.') + '@gmail.com',
    occupation: 'Salaried IT Professional',
    income: '1,200,000',
    location: 'Mumbai, Maharashtra'
  });

  const [internalNotes, setInternalNotes] = useState(
    "Client prefers lower premium track initially.\nInterested in long-term child education milestone targets.\nLooking for absolute tax-saving eligibility profiles."
  );

  const handleNotesSave = () => {
    setIsNotesSaved(true);
    const now = new Date();
    setNotesTimestamp(`Saved just now at ${now.toLocaleTimeString()}`);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  const handleGenerateQuoteNavigation = () => {
    navigate('/analytics/premium-calculator', {
      state: {
        prefill: {
          customerName: customerForm.fullName,
          annualIncome: parseInt(customerForm.income.replace(/,/g, ''), 10) || 1200000,
          policyType: leadData.interest === 'ULIP' ? 'ULIP' : 'Term Life'
        }
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] overflow-x-hidden relative pb-24 text-left">
      
      {/* 1. TOP NAVBAR HEADER ARCHITECTURE — ENFORCED SOLID TEXT-SLATE COLORING */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Dashboard &gt; Leads &gt; {customerForm.fullName}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <button 
              type="button" 
              onClick={() => navigate('/lead-management')}
              className="p-1 hover:bg-slate-50 border rounded-lg text-slate-500 transition-colors focus:outline-none shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            {/* FIXED COLOR: Enforced explicit text-slate-900 override value */}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              Lead Details Workspace
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="flex items-center gap-2.5 select-none">
            <div className="text-right hidden sm:block">
              <h4 className="text-xs font-bold text-slate-900 leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CORE WORKSPACE CANVAS FRAME */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-6 py-6 overflow-y-auto space-y-6">
        
        {/* SUMMARY PROFILE PANEL — FIXED HEADING CONTRAST */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-5 select-none">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${leadData.avatarBg || 'bg-emerald-600'} text-white text-xl font-bold flex items-center justify-center shrink-0`}>
              {leadData.initials || 'RJ'}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* FIXED COLOR: Restored pure high-visibility text-slate-900 to customer name */}
                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  {customerForm.fullName}
                </h2>
                <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">{leadData.id}</span>
                <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase bg-red-50 text-red-600 border-red-100`}>
                  HOT PROFILE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Underwriting Health Score: <strong className="text-slate-800 font-bold">{leadData.score}/100</strong> • Created: 1 week ago • Agent: John Smith
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href={`tel:${customerForm.mobile}`} className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Call
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> WhatsApp
            </a>
            <a href={`mailto:${customerForm.email}`} className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
            </a>
          </div>
        </div>

        {/* WORKSPACE SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          
          <div className="lg:col-span-8 space-y-6">
            {/* PROFILE FORM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between select-none">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Customer Information Profile
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsEditable(!isEditable)}
                  className="text-xs font-bold text-[#0F478D] hover:underline focus:outline-none"
                >
                  {isEditable ? "Lock Profile Data" : "Modify Information Fields"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Legal Name</label>
                  <input type="text" disabled={!isEditable} value={customerForm.fullName} onChange={(e)=>setCustomerForm({...customerForm, fullName:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Date of Birth</label>
                  <input type="date" disabled={!isEditable} value={customerForm.dob} onChange={(e)=>setCustomerForm({...customerForm, dob:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Gender</label>
                  <select disabled={!isEditable} value={customerForm.gender} onChange={(e)=>setCustomerForm({...customerForm, gender:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
                  <input type="text" disabled={!isEditable} value={customerForm.mobile} onChange={(e)=>setCustomerForm({...customerForm, mobile:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Occupation</label>
                  <input type="text" disabled={!isEditable} value={customerForm.occupation} onChange={(e)=>setCustomerForm({...customerForm, occupation:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Gross Annual Income (₹)</label>
                  <input type="text" disabled={!isEditable} value={customerForm.income} onChange={(e)=>setCustomerForm({...customerForm, income:e.target.value})} className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none ${isEditable ? 'bg-white border-[#0F478D] text-slate-900' : 'bg-slate-50/70 border-slate-200 text-slate-600'}`} />
                </div>
              </div>
            </div>

            {/* PRODUCT SEGMENT */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3">
              <div className="border-b border-slate-100 pb-2 select-none">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" /> Product Interest Configuration
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-500 select-none">
                <div><span className="text-slate-400 block font-medium">Interested Product</span> <strong className="text-slate-900 text-sm font-bold block mt-0.5">{leadData.interest} Plan</strong></div>
                <div><span className="text-slate-400 block font-medium">Desired Sum Assured</span> <strong className="text-slate-900 text-sm font-bold block mt-0.5">₹1 Crore</strong></div>
                <div><span className="text-slate-400 block font-medium">Policy Tenure</span> <strong className="text-slate-900 text-sm font-bold block mt-0.5">25 Years</strong></div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-2 select-none">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Operational Communication Timeline
                </h3>
              </div>
              <div className="space-y-4 relative pl-3 select-none border-l-2 border-slate-100 text-xs font-semibold text-slate-700">
                <div className="relative"><div className="w-2 h-2 rounded-full bg-blue-600 absolute left-[-16px] top-1" /><strong>Today — Premium Proposal Worksheet Shared</strong><span className="text-[10px] text-slate-400 block mt-0.5">System log update via email dispatch track</span></div>
                <div className="relative"><div className="w-2 h-2 rounded-full bg-[#0F478D] absolute left-[-16px] top-1" /><strong>Yesterday — Outbound Callback Connected</strong><span className="text-[10px] text-slate-400 block mt-0.5">Duration: 4m 12s • Discussed Critical Illness extension add-ons</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS */}
          <div className="lg:col-span-4 space-y-6">
            {/* INSIGHTS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs border-l-4 border-l-[#0F478D] space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0B1F5B] uppercase tracking-wide select-none">
                <Sparkles className="w-4 h-4 text-[#0F478D]" /> <span>Predictive Recommendation Analytics</span>
              </div>
              <div className="space-y-3 text-xs text-slate-600 font-semibold">
                <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-xl text-slate-800 leading-normal text-left">
                  <strong className="text-[#0F478D] font-black block text-[11px] mb-0.5 uppercase tracking-wide">Underwriting Prediction:</strong>
                  High chance of conversion within 7 operational days based on interaction history trends.
                </div>
                <div className="divide-y select-none text-[11px] font-bold">
                  <div className="py-2 flex justify-between"><span>Conversion Probability:</span><span className="text-emerald-600 font-black">88%</span></div>
                  <div className="py-2 flex justify-between"><span>Risk Classification:</span><span className="text-[#0B1F5B] font-black">Standard Low Risk Profile</span></div>
                </div>
              </div>
            </div>

            {/* PIPELINE ALLOCATION CONTROLS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3.5 text-xs font-semibold text-slate-700 text-left">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Pipeline Allocation Desk</h4>
              <div className="space-y-1">
                <label className="block select-none">Active Lead Pipeline Stage</label>
                <select value={leadStatus} onChange={(e)=>setLeadStatus(e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 font-bold text-slate-800 focus:outline-none focus:border-[#0F478D] cursor-pointer">
                  <option>New</option><option>Contacted</option><option>Interested</option><option>Proposal Shared</option>
                </select>
              </div>
            </div>

            {/* REMARKS INPUT LOG */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3 flex flex-col justify-between min-h-[190px]">
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Internal Remarks Consultation Log</h4>
                <textarea rows={4} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Type notes..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-[#0F478D] transition-all resize-none shadow-inner" />
                <span className="text-[9px] text-slate-400 block tracking-tight select-none mt-1">{notesTimestamp}</span>
              </div>
              <button type="button" onClick={handleNotesSave} className="bg-slate-100 hover:bg-slate-200 border text-slate-700 font-bold text-xs h-8 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none w-full select-none">
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isNotesSaved ? "Notes Committed ✓" : "Commit Changes"}</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER ACTIONS BAR */}
      <footer className="fixed bottom-0 left-[260px] right-0 h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-xl z-20 select-none">
        <button type="button" onClick={() => navigate('/lead-management')} className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs h-9 px-4 rounded-xl transition-colors focus:outline-none">
          Return to Leads Grid
        </button>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar ml-2">
          <button type="button" className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none"><Layers className="w-3.5 h-3.5 text-slate-400" /><span>Compare Plans Matrix</span></button>
          <button type="button" className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none"><Download className="w-3.5 h-3.5 text-slate-400" /><span>Download Proposal PDF</span></button>
          <button type="button" onClick={handleGenerateQuoteNavigation} className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-9 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none">
            <span>Generate Premium Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
}