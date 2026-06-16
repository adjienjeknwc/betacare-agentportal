// src/components/lead/LeadContactInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Globe, ArrowRight, ArrowLeft, Bell } from 'lucide-react';

export default function LeadContactInfo() {
  const navigate = useNavigate();

  // 1. DATA MANAGEMENT STATE MATRICES
  const [countryData, setCountryData] = useState({ code: '+91', flag: '🇮🇳', label: 'IN' });
  const [contactForm, setContactForm] = useState({
    mobile: '',
    email: '',
    communicationPreference: 'WhatsApp Web Node',
    addressLine: '',
    regionState: 'Maharashtra'
  });

  const countries = [
    { code: '+91', flag: '🇮🇳', label: 'IN' },
    { code: '+1', flag: '🇺🇸', label: 'US' },
    { code: '+44', flag: '🇬🇧', label: 'UK' },
    { code: '+61', flag: '🇦🇺', label: 'AU' },
    { code: '+971', flag: '🇦🇪', label: 'AE' }
  ];

  const regionalStates = [
    'Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Telangana', 
    'Gujarat', 'West Bengal', 'Uttar Pradesh', 'Other International Locale'
  ];

  const steps = [
    { label: '1. Personal', active: false },
    { label: '2. Contact', active: true },
    { label: '3. Financial', active: false },
    { label: '4. Insurance', active: false },
    { label: '5. Documents', active: false },
    { label: '6. Review', active: false }
  ];

  const handleCountryChange = (e) => {
    const selected = countries.find(c => c.code === e.target.value);
    if (selected) setCountryData(selected);
  };

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    navigate('/register/financial', { 
      state: { 
        contactData: { ...contactForm, countryCode: countryData.code } 
      } 
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] text-left font-sans antialiased pb-12">
      
      {/* HEADER TOP BAR CONTAINER NAVIGATION SLAT */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/register/personal-details')}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 transition-colors focus:outline-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-black tracking-tight leading-none">Add New Lead</h1>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md tracking-wider uppercase">
              Step 2 of 6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg relative focus:outline-none">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
          </button>
          <div className="flex items-center gap-2 select-none">
            <div className="text-right">
              <h4 className="text-xs font-bold text-black leading-none">Agent John</h4>
              <span className="text-[9px] text-slate-400 font-black tracking-wider block mt-0.5">PREMIUM BROKER</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#0F478D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">AJ</div>
          </div>
        </div>
      </header>

      {/* MAIN CANVAS BODY ROW */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        
        {/* MULTI-STEP INDICATOR HUB ROW */}
        <div className="w-full bg-white border border-slate-200 p-3 rounded-xl shadow-3xs select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight border transition-colors ${
                  step.active 
                    ? 'bg-white text-[#0F478D] border-[#0F478D] font-black shadow-3xs' 
                    : 'bg-slate-50/60 text-slate-400 border-transparent'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* INPUT DATA CARD MODULE BOX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          
          <div className="text-left space-y-1 border-b border-slate-100 pb-4 select-none">
            <h2 className="text-xl font-bold text-black tracking-tight leading-none">Contact Channels</h2>
            <p className="text-xs font-medium text-slate-500 max-w-xl">
              Configure active reachability vectors and location context metrics cleanly.
            </p>
          </div>

          <form onSubmit={handleSaveAndContinue} className="space-y-5 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              
              {/* MOBILE NUMBER ROW CONTAINER */}
              <div className="md:col-span-6 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Mobile Number
                </label>
                <div className="flex gap-2 relative">
                  
                  {/* SELECT DROPDOWN PREFIX LAYER */}
                  <div className="relative flex items-center shrink-0 min-w-[95px] h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl px-2.5 transition-all focus-within:bg-white focus-within:border-[#0F478D]">
                    <span className="text-sm mr-1.5 select-none">{countryData.flag}</span>
                    <span className="text-xs font-bold text-slate-800 pr-1 select-none">{countryData.code}</span>
                    <select 
                      value={countryData.code}
                      onChange={handleCountryChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-bold"
                    >
                      {countries.map((c, i) => (
                        <option key={`${c.code}-${i}`} value={c.code}>
                          {c.flag} {c.label} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TELEPHONE FIELD INPUT BOX */}
                  <div className="relative flex-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input 
                      required 
                      type="tel"
                      pattern="[0-9]{7,12}"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="Enter mobile digits..." 
                      className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* EMAIL ADDRESS INPUT FIELD */}
              <div className="md:col-span-6 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required 
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="client.name@example.com" 
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* OPTIMIZED FIELD 1: PREFERRED NOTIFICATION CHANNEL HUB DROPDOWN */}
              <div className="md:col-span-6 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Preferred Channel Event Trigger
                </label>
                <div className="relative flex items-center w-full">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none z-10" />
                  {/* FIXED: Added pl-9 to remove visual overlap layout glitches */}
                  <select 
                    value={contactForm.communicationPreference}
                    onChange={(e) => setContactForm({ ...contactForm, communicationPreference: e.target.value })}
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-8 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all appearance-none"
                  >
                    <option>Email</option>
                    <option>SMS Routing</option>
                    <option>WhatsApp Web Node</option>
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-500 font-bold text-xs">▼</div>
                </div>
              </div>

              {/* OPTIMIZED FIELD 2: REGIONAL STATE / LOCATION PROFILE COMPLIANCE */}
              <div className="md:col-span-6 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Regional Jurisdiction State
                </label>
                <div className="relative flex items-center w-full">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none z-10" />
                  {/* FIXED: Added pl-9 to remove visual overlap layout glitches */}
                  <select 
                    value={contactForm.regionState}
                    onChange={(e) => setContactForm({ ...contactForm, regionState: e.target.value })}
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-8 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-bold cursor-pointer transition-all appearance-none"
                  >
                    {regionalStates.map((state, i) => (
                      <option key={i} value={state}>{state}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-500 font-bold text-xs">▼</div>
                </div>
              </div>

              {/* FULL RESIDENTIAL ADDRESS LINE STRIP */}
              <div className="md:col-span-12 space-y-1.5 text-left">
                <label className="block text-slate-400 font-bold tracking-wider uppercase text-[10px] select-none">
                  Permanent Residential Address Line
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    required
                    type="text"
                    value={contactForm.addressLine}
                    onChange={(e) => setContactForm({ ...contactForm, addressLine: e.target.value })}
                    placeholder="Apartment, Street Name, Block, Landmark & Postal Pin Code..." 
                    className="w-full h-10 bg-[#F5F7FB] border border-slate-200 rounded-xl pl-9 pr-4 outline-none focus:bg-white focus:border-[#0F478D] text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

            </div>

            {/* FORM FOOTER TRIGGER LAYOUT */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end select-none">
              <button 
                type="submit"
                className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}