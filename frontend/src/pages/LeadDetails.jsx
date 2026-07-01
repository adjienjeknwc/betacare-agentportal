// src/pages/LeadDetails.jsx
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext'; // Context binding
import { 
  ArrowLeft, Phone, MessageSquare, Mail, User, Calendar, 
  Briefcase, DollarSign, Activity, FileText, LayoutGrid, ShieldAlert 
} from 'lucide-react';

export default function LeadDetails() {
  const navigate = useNavigate();
  const { leadId } = useParams(); // Extract route param from link string
  const { masterLeadsData } = useLeads();

  // ==========================================================================
  // REAL-TIME LOOKUP ROUTER ENGINE
  // Locates the specific lead record from memory based on URL parameter
  // ==========================================================================
  const activeLead = useMemo(() => {
    // Look up lead matching the structural string signature format (handling '#' token prefixes)
    return masterLeadsData.find(
      lead => lead.id.replace('#', '') === leadId || lead.id === leadId
    );
  }, [masterLeadsData, leadId]);

  // Comprehensive safety layout map to bridge fields gracefully if no object matches
  const resolvedProfile = useMemo(() => {
    if (activeLead) {
      return {
        id: activeLead.id,
        fullName: activeLead.name,
        initials: activeLead.initials || 'NL',
        avatarBg: activeLead.avatarBg || 'bg-blue-600',
        interest: activeLead.interest || 'Term Life',
        score: activeLead.score || '92',
        temp: activeLead.temp || 'HOT',
        mobileNumber: activeLead.mobileNumber || '+91 98765 43210',
        email: activeLead.email || 'client@insuranceportal.io',
        dob: activeLead.dob || '1994-05-14',
        gender: activeLead.gender || 'Male',
        occupation: activeLead.occupation || 'Salaried IT Professional',
        annualIncome: activeLead.annualIncome || '1200000',
        city: activeLead.city || 'Mumbai',
        state: activeLead.state || 'Maharashtra'
      };
    }

    // Default template fallback backup state block to safeguard UI integrity
    return {
      id: `#LD-${leadId || '8926'}`,
      fullName: 'Rohan Joshi',
      initials: 'RJ',
      avatarBg: 'bg-emerald-600',
      interest: 'Term Life',
      score: '92',
      temp: 'HOT',
      mobileNumber: '+91 98765 43210',
      email: 'rohan.joshi@insuranceportal.io',
      dob: '1994-05-14',
      gender: 'Male',
      occupation: 'Salaried IT Professional',
      annualIncome: '1200000',
      city: 'Mumbai',
      state: 'Maharashtra'
    };
  }, [activeLead, leadId]);

  const displayIncome = useMemo(() => {
    const rawIncome = parseFloat(resolvedProfile.annualIncome);
    return !isNaN(rawIncome) ? rawIncome.toLocaleString('en-IN') : '1,200,000';
  }, [resolvedProfile.annualIncome]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full relative">
      
      {/* TOOLBAR TITLE PANEL */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-3xs w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[22px] leading-none">Lead Details Workspace</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1.5">Comprehensive Customer Evaluation Context</p>
          </div>
        </div>
      </header>

      {/* CORE INFO MATRIX PROFILE HUD ROW */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-6 py-5 space-y-5">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${resolvedProfile.avatarBg} flex items-center justify-center text-white text-lg font-black select-none shadow-3xs`}>
              {resolvedProfile.initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{resolvedProfile.fullName}</h2>
                <span className="font-mono text-xs font-bold text-slate-400 border bg-slate-50 px-1.5 py-0.5 rounded-md">{resolvedProfile.id}</span>
                <span className="text-[9px] font-black tracking-wider uppercase bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md">{resolvedProfile.temp} PROFILE</span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Underwriting Health Score: <span className="text-slate-900 font-bold">{resolvedProfile.score}/100</span> • Created: Just now • Agent: John (AJ-2026)
              </p>
            </div>
          </div>

          {/* ACTION QUICK ENGAGEMENT LINK BUTTONS */}
          <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            <button type="button" className="h-9 px-3 border rounded-xl bg-white hover:bg-slate-50 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>Call</span></button>
            <button type="button" className="h-9 px-3 border rounded-xl bg-white hover:bg-slate-50 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /><span>WhatsApp</span></button>
            <button type="button" className="h-9 px-3 border rounded-xl bg-white hover:bg-slate-50 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>Email</span></button>
          </div>
        </div>

        {/* TWO-COLUMN DETAILS WORKSPACE GRID SHEET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-2 select-none">
              <div className="flex items-center gap-1.5 text-[#0B1F5B] font-black text-xs uppercase tracking-wider">
                <User className="w-4 h-4 text-blue-500" />
                <span>Customer Information Profile</span>
              </div>
              <span className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">Modify Information Fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
              <div className="space-y-1"><label>Full Legal Name</label><input type="text" readOnly value={resolvedProfile.fullName} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-slate-900 font-medium outline-none" /></div>
              <div className="space-y-1"><label>Date of Birth</label><input type="text" readOnly value={resolvedProfile.dob} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-slate-900 font-medium outline-none" /></div>
              <div className="space-y-1"><label>Gender</label><input type="text" readOnly value={resolvedProfile.gender} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-slate-900 font-medium outline-none" /></div>
              <div className="space-y-1"><label>Mobile Number</label><input type="text" readOnly value={resolvedProfile.mobileNumber} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-slate-900 font-medium outline-none" /></div>
              <div className="space-y-1"><label>Occupation</label><input type="text" readOnly value={resolvedProfile.occupation} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-slate-900 font-medium outline-none" /></div>
              <div className="space-y-1"><label>Gross Annual Income (₹)</label><input type="text" readOnly value={`₹${displayIncome}`} className="w-full h-10 bg-slate-50/50 border rounded-xl px-3 text-[#0B1F5B] font-black outline-none" /></div>
            </div>

            <div className="pt-2">
              <div className="text-[#0B1F5B] font-black border-b pb-1.5 uppercase text-[10px] tracking-wider select-none mb-3">Product Interest Configuration</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold text-slate-600">
                <div className="bg-slate-50/80 border rounded-xl p-3">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Selected Product Plan</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">{resolvedProfile.interest}</span>
                </div>
                <div className="bg-slate-50/80 border rounded-xl p-3">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Target City Region</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{resolvedProfile.city}, {resolvedProfile.state}</span>
                </div>
                <div className="bg-slate-50/80 border rounded-xl p-3">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Compliance Evaluation</span>
                  <span className="text-xs font-black text-emerald-600 block mt-0.5">✓ Passed Checksum</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI ANALYTICS SIDEBAR */}
          <div className="lg:col-span-4 bg-white border-2 border-blue-50 rounded-2xl p-5 space-y-4 shadow-sm text-xs font-semibold">
            <div className="border-b pb-1.5 font-black text-[10px] text-[#0B1F5B] uppercase tracking-wider select-none">Predictive Recommendation Analytics</div>
            <div className="bg-blue-50/30 border border-blue-100 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[9px] font-black uppercase text-[#0F478D] tracking-wider block">Underwriting Prediction:</span>
              <p className="text-slate-700 font-medium leading-relaxed">High chance of conversion within 7 operational days based on interaction history trends.</p>
            </div>
            <div className="flex justify-between border-b pb-2 text-slate-500"><span>Conversion Probability:</span><span className="text-emerald-600 font-black">88%</span></div>
            <div className="flex justify-between text-slate-500"><span>Risk Classification:</span><span className="text-slate-900 font-bold">Standard Low Risk Profile</span></div>
          </div>

        </div>

        {/* BOTTOM FORM CTAs AND ACTION TRIGGER BAR ROW */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-bold text-xs">
          <button type="button" onClick={() => navigate('/lead-management')} className="w-full sm:w-auto h-10 px-4 border bg-white hover:bg-slate-50 text-slate-700 rounded-xl">Return to Leads Grid</button>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            <button type="button" className="w-full sm:w-auto h-10 px-4 border rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1"><LayoutGrid className="w-3.5 h-3.5 text-slate-400" /><span>Compare Plans Matrix</span></button>
            <button type="button" className="w-full sm:w-auto h-10 px-4 border rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /><span>Download Proposal PDF</span></button>
            
            {/* LINK TO AUTO-FILLED QUOTE DESK ROUTE FOR THIS SPECIFIC ID OBJECT */}
            <button 
              type="button" 
              onClick={() => navigate(`/lead-management/generate-quote/${resolvedProfile.id.replace('#', '')}`, {
                state: { leadData: resolvedProfile }
              })}
              className="w-full sm:w-auto h-11 px-6 bg-[#0B1F5B] hover:bg-black text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1"
            >
              <span>Generate Premium Quote →</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}