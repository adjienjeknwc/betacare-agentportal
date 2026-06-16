// src/pages/Settings.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Key, ToggleLeft, ToggleRight, 
  Clock, CheckCircle, AlertTriangle, Monitor, Globe, MailCheck, Save, RefreshCw, Camera, X, Lock
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 1. INTERACTIVE PROFILE & FORM APP STATES
  const [profilePic, setProfilePic] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Rohan',
    lastName: 'Mehta',
    email: 'rohan.mehta@abcdlife.com',
    mobile: '+91 98765 43210',
    address: 'Apt 402, Skyline Residency, Bandra West, Mumbai - 400050'
  });

  // 2. REAL-WORLD USABLE SECURITY OPTION STATES
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Theme & Region State
  const [appearance, setAppearance] = useState('light');
  const [timezone, setTimezone] = useState('(GMT+05:30) Mumbai, Kolkata');

  // Interactive Notification Matrix State
  const [notifications, setNotifications] = useState({
    renewals: { email: true, sms: false, whatsapp: false },
    assignments: { email: true, sms: true, whatsapp: false },
    updates: { email: true, sms: false, whatsapp: true }
  });

  // 3. ACTION HANDLERS WITH FEEDBACK LOGIC
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleNotification = (row, channel) => {
    setNotifications(prev => {
      const nextState = {
        ...prev,
        [row]: { ...prev[row], [channel]: !prev[row][channel] }
      };
      showToast(`Updated preferences for ${row.toUpperCase()} via ${channel.toUpperCase()}`);
      return nextState;
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      showToast("Profile display avatar updated successfully");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    showToast("Account credentials updated securely");
  };

  const handleSaveAll = () => {
    setIsEditable(false);
    showToast("Profile configuration system records updated successfully");
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#F5F7FB] relative pb-24 font-sans antialiased">
      
      {/* REAL-TIME NOTIFICATION TOAST POPUP */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-blue-400/20 flex items-center gap-2 animate-fade-in-down select-none">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP NAVBAR HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 select-none">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
            Dashboard / User Profile & Settings
          </span>
          <h1 className="text-xl font-bold text-[#0B1F5B] tracking-tight leading-none mt-1">
            Profile & Settings
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => {
              setPersonalInfo({
                firstName: 'Rohan',
                lastName: 'Mehta',
                email: 'rohan.mehta@abcdlife.com',
                mobile: '+91 98765 43210',
                address: 'Apt 402, Skyline Residency, Bandra West, Mumbai - 400050'
              });
              setTwoFactor(true);
              setBiometric(false);
              showToast("Application parameters reset to system ledger defaults");
            }}
            className="border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 font-bold text-xs h-9 px-3 rounded-xl flex items-center gap-1.5 transition-colors focus:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Settings</span>
          </button>
          
          <button 
            type="button" 
            onClick={handleSaveAll}
            className="bg-[#0B1E46] hover:bg-[#07132e] text-white text-xs font-bold h-9 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CANVAS VIEWPORT CONTAINER */}
      <main className="flex-1 w-full max-w-[1450px] mx-auto px-6 py-6 overflow-y-auto space-y-5">
        
        <div className="w-full text-left select-none">
          <p className="text-xs font-medium text-slate-500">
            Manage account preferences, security and application settings.
          </p>
        </div>

        {/* TOP COMPONENT CARD HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          
          {/* PROFILE DETAIL OVERLAY CONTROLLER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col sm:flex-row lg:col-span-2 items-center gap-5">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 bg-[#0F478D] rounded-2xl flex items-center justify-center text-white text-2xl font-bold tracking-tight shrink-0 shadow-inner select-none relative overflow-hidden group cursor-pointer border border-slate-200/50"
              title="Click to update avatar image"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>RM</span>
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-2xl">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[8px] font-black uppercase text-white tracking-wider mt-0.5">Change</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" className="hidden" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-2 w-full text-center sm:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Rohan Mehta</h2>
                  <span className="text-[9px] font-black bg-blue-50 text-[#0F478D] border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Senior Advisor</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold block mt-1">Senior Insurance Advisor — ID-47210</span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 w-full text-left">
                <div className="truncate"><span className="text-slate-400 font-medium">Branch:</span> <strong className="text-slate-700">Mumbai HQ</strong></div>
                <div className="truncate"><span className="text-slate-400 font-medium">Joined:</span> <strong className="text-slate-700">Mar 2021</strong></div>
                <div className="col-span-2 truncate"><span className="text-slate-400 font-medium">System Alias:</span> <strong className="text-slate-700">rohan.mehta@abcdlife.com</strong></div>
              </div>
            </div>

            <div className="w-full sm:w-32 text-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 select-none shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Profile Progress</span>
              <div className="text-xl font-black text-[#0B1F5B] tracking-tight mt-0.5">85%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-200/50">
                <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
              </div>
            </div>
          </div>

          {/* PERFORMANCE PULSE */}
          <div className="bg-[#0B1E46] text-white border border-slate-900 rounded-2xl p-4 shadow-sm flex flex-col justify-between select-none min-h-[120px]">
            <div className="border-b border-white/10 pb-1.5 text-left">
              <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">PERFORMANCE PULSE</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1.5">
              <div>
                <span className="text-[9px] font-medium text-slate-300 block uppercase leading-none">Policies Sold</span>
                <strong className="text-lg font-black block pt-1 text-white">124</strong>
              </div>
              <div>
                <span className="text-[9px] font-medium text-slate-300 block uppercase leading-none">Broker Rating</span>
                <strong className="text-lg font-black block pt-1 text-white">4.8/5</strong>
              </div>
              <div>
                <span className="text-[9px] font-medium text-slate-300 block uppercase leading-none">Target Achieved</span>
                <strong className="text-lg font-black block pt-1 text-emerald-400">112%</strong>
              </div>
            </div>
            <div className="pt-2 text-[9px] font-semibold text-slate-400 text-center border-t border-white/5 flex justify-between items-center">
              <span>RENEWALS RATIO: 94%</span>
              <span className="text-emerald-400 font-black">EXCELLENT STANDING</span>
            </div>
          </div>
        </div>

        {/* SYSTEM FORMS GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between select-none">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Personal Information
              </h3>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditable(!isEditable);
                  if (isEditable) showToast("Form data cells locked from inline changes");
                  else showToast("Fields unlocked. Form is now active and editable");
                }}
                className="text-xs font-bold text-[#0F478D] hover:underline focus:outline-none"
              >
                {isEditable ? "Lock Fields" : "Edit All Fields"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block select-none">First Name</label>
                <input 
                  type="text" 
                  disabled={!isEditable}
                  value={personalInfo.firstName} 
                  onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none transition-all ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-not-allowed'}`} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block select-none">Last Name</label>
                <input 
                  type="text" 
                  disabled={!isEditable}
                  value={personalInfo.lastName} 
                  onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none transition-all ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-not-allowed'}`} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block select-none">Email Address Location</label>
                <input 
                  type="email" 
                  disabled={!isEditable}
                  value={personalInfo.email} 
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none transition-all ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-not-allowed'}`} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block select-none">Mobile Contact Assignment</label>
                <input 
                  type="text" 
                  disabled={!isEditable}
                  value={personalInfo.mobile} 
                  onChange={(e) => setPersonalInfo({...personalInfo, mobile: e.target.value})}
                  className={`w-full h-9 rounded-xl border px-3 text-xs font-semibold outline-none transition-all ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-not-allowed'}`} 
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block select-none">Residential Address Line</label>
                <div className="relative flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input 
                    type="text" 
                    disabled={!isEditable}
                    value={personalInfo.address} 
                    onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                    className={`w-full h-9 rounded-xl border pl-9 pr-3 text-xs font-semibold outline-none transition-all ${isEditable ? 'bg-white border-[#0F478D] text-slate-900 shadow-3xs' : 'bg-slate-50/70 border-slate-200 text-slate-600 cursor-not-allowed'}`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KYC DOCUMENT TRACK */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3">
            <div className="border-b border-slate-100 pb-2 select-none text-left">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" /> KYC & Certifications
              </h3>
            </div>
            
            <div className="space-y-2.5 pt-1">
              <VerificationRow label="PAN Card Verification" verified={true} />
              <VerificationRow label="Aadhaar Link Verification" verified={true} />
              
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-2.5 select-none text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-amber-800 leading-tight">
                  <span className="font-bold block text-xs">IRDAI Broker License Alert</span>
                  Your statutory operating clearance credentials expire in <strong className="font-black text-amber-700">45 days</strong>.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM METRIC HUB - STYLED ENTIRELY LIKE THE SCREENSHOT REFERENCE IMAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          
          {/* SECURITY SETTINGS PANEL — MATCHES SCREENSHOT 1:1 WITH USABLE TOGGLES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
            <div className="border-b border-slate-100 pb-2 select-none">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-slate-400 shrink-0" /> SECURITY SETTINGS
              </h3>
            </div>
            
            <div className="space-y-3 font-semibold text-xs text-slate-700">
              <button 
                type="button" 
                onClick={() => setShowPasswordModal(true)}
                className="w-full h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0F478D] font-bold text-center text-xs focus:outline-none select-none transition-colors"
              >
                Change Account Password
              </button>
              
              {/* INTERACTIVE TOGGLE: TWO-FACTOR AUTHENTICATION */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="select-none">
                  <span className="font-bold text-slate-800 block">Two-Factor Authentication</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Secure session OTP routing</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setTwoFactor(!twoFactor);
                    showToast(`Two-Factor Authentication turned ${!twoFactor ? 'ON' : 'OFF'}`);
                  }} 
                  className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0 transition-colors"
                >
                  {twoFactor ? <ToggleRight className="w-8 h-8 text-[#0F478D]" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              {/* INTERACTIVE TOGGLE: BIOMETRIC LOGIN ACCESS */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="select-none">
                  <span className="font-bold text-slate-800 block">Biometric Login Access</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Fingerprint / TouchID sync</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setBiometric(!biometric);
                    showToast(`Biometric Login Access system synchronization ${!biometric ? 'ENABLED' : 'DISABLED'}`);
                  }} 
                  className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0 transition-colors"
                >
                  {biometric ? <ToggleRight className="w-8 h-8 text-[#0F478D]" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </div>
          </div>

          {/* ROLE & ACCESS PARAMETERS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
            <div className="border-b border-slate-100 pb-2 select-none">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Role & Access Parameters</h3>
            </div>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="select-none">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wide">System Assignment Profile</span>
                <strong className="text-sm font-bold text-slate-900 block pt-0.5">Senior Insurance Advisor Access</strong>
              </div>
              <div className="space-y-1.5 select-none">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wide">Authorized Clearances</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5 font-black text-[9px] tracking-wide uppercase">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">Lead Management</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">Underwriting Desk</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">Claims</span>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM ACCOUNT ACTIVITY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
            <div className="border-b border-slate-100 pb-2 select-none">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" /> System Account Activity
              </h3>
            </div>
            <div className="space-y-3 font-semibold text-xs text-slate-700 select-none">
              <TimelineEvent title="Password credentials changed" meta="2 days ago — IP: 192.168.1.1" />
              <TimelineEvent title="Login authenticated from new device" meta="MacBook Pro — London, UK" />
              <TimelineEvent title="Profile configuration parameters updated" meta="Just now" />
            </div>
          </div>

        </div>

        {/* NOTIFICATION CHICK GRID PREFERENCES MATRIX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-3 text-left">
          <div className="border-b border-slate-100 pb-2 select-none">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <MailCheck className="w-4 h-4 text-slate-400 shrink-0" /> Automated Notification Channels
            </h3>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs table-fixed min-w-[500px]">
              <thead>
                <tr className="border-b text-[10px] font-bold uppercase text-slate-400 tracking-wider select-none">
                  <th className="py-2 w-1/2">SYSTEM PIPELINE EVENTS TRIGGER</th>
                  <th className="py-2 text-center">EMAIL NODE</th>
                  <th className="py-2 text-center">SMS CELL</th>
                  <th className="py-2 text-center">WHATSAPP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                <MatrixRow label="Policy Renewals Alerts" rowKey="renewals" state={notifications} toggle={handleToggleNotification} />
                <MatrixRow label="New Lead Assignment Pushes" rowKey="assignments" state={notifications} toggle={handleToggleNotification} />
                <MatrixRow label="Underwriting Updates" rowKey="updates" state={notifications} toggle={handleToggleNotification} />
              </tbody>
            </table>
          </div>
        </div>

        {/* REGIONAL LAYOUT HOOK SWITCHERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Monitor className="w-4 h-4 text-slate-400" />
              <div><span>System Interface Theme</span><span className="text-[10px] text-slate-400 font-medium block">Toggle view style</span></div>
            </div>
            <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50 font-bold text-[11px] text-slate-600">
              <button type="button" onClick={() => { setAppearance('light'); showToast("Switched to Light interface index rendering"); }} className={`px-3 py-1 rounded-lg transition-all focus:outline-none ${appearance === 'light' ? 'bg-white border shadow-3xs text-slate-900 font-black' : 'hover:text-slate-900'}`}>Light</button>
              <button type="button" onClick={() => { setAppearance('dark'); showToast("Switched to Dark UI preview presentation layer"); }} className={`px-3 py-1 rounded-lg transition-all focus:outline-none ${appearance === 'dark' ? 'bg-white border shadow-3xs text-slate-900 font-black' : 'hover:text-slate-900'}`}>Dark</button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 min-w-0 flex-1">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0"><span>Regional System Timezone</span><span className="text-[10px] text-slate-400 font-medium block truncate">Locale defaults mapping</span></div>
            </div>
            <select 
              value={timezone}
              onChange={(e) => { setTimezone(e.target.value); showToast(`System locale synchronized to ${e.target.value}`); }}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-1.5 text-slate-700 focus:outline-none focus:border-[#0F478D] cursor-pointer max-w-[200px]"
            >
              <option>(GMT+05:30) Mumbai, Kolkata</option>
              <option>(GMT+00:00) London, Greenwich</option>
            </select>
          </div>
        </div>

      </main>

      {/* 3. STICKY BOTTOM ACTION BAR */}
      <footer className="fixed bottom-0 left-[260px] right-0 h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shadow-lg z-20 select-none">
        <button 
          type="button"
          onClick={() => navigate('/dashboard')}
          className="border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 font-bold text-xs h-9 px-4 rounded-xl transition-colors focus:outline-none"
        >
          Return to Dashboard
        </button>
        <button 
          type="button" 
          onClick={handleSaveAll}
          className="bg-[#0B1E46] hover:bg-black text-white text-xs font-bold h-9 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm focus:outline-none"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Commit & Save Preferences</span>
        </button>
      </footer>

      {/* INTERACTIVE CHANGES-PASSWORD POPUP MODAL OVERLAY SHEET */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center z-50 animate-fade-in select-none">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-sm w-full p-5 space-y-4 text-left animate-scale-up mx-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-[#0B1F5B] tracking-tight flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-400" /> Update Account Password
              </h3>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 focus:outline-none"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="block">Current Credentials Key</label>
                <input required type="password" placeholder="••••••••" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-mono text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="block">New Secure Pass Code</label>
                <input required type="password" placeholder="••••••••" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-mono text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="block">Confirm Pass Code Verification</label>
                <input required type="password" placeholder="••••••••" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none focus:bg-white focus:border-[#0F478D] font-mono text-slate-900" />
              </div>
              
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="h-8 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 font-bold transition-colors">Cancel</button>
                <button type="submit" className="h-8 px-3 bg-[#0B1E46] hover:bg-black text-white font-bold rounded-lg shadow-sm transition-all">Update Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function VerificationRow({ label, verified }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-50/60 border border-slate-100 rounded-xl font-semibold text-xs select-none">
      <span className="text-slate-700">{label}</span>
      {verified ? (
        <span className="text-[9px] font-black tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded uppercase flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-500" /> Authenticated
        </span>
      ) : (
        <span className="text-[9px] font-black tracking-wide bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded uppercase">Pending</span>
      )}
    </div>
  );
}

function TimelineEvent({ title, meta }) {
  return (
    <div className="flex gap-2.5 relative pl-3.5 border-l-2 border-l-slate-100 pb-1">
      <div className="w-1.5 h-1.5 rounded-full bg-[#0F478D] absolute left-[-4px] top-[5px]" />
      <div className="leading-tight">
        <span className="text-slate-800 font-bold block text-left">{title}</span>
        <span className="text-[10px] text-slate-400 font-medium block mt-0.5 text-left">{meta}</span>
      </div>
    </div>
  );
}

function MatrixRow({ label, rowKey, state, toggle }) {
  return (
    <tr className="hover:bg-slate-50/40 transition-colors">
      <td className="py-2.5 font-bold text-slate-800 truncate text-left">{label}</td>
      {['email', 'sms', 'whatsapp'].map((channel) => (
        <td key={channel} className="py-2.5 text-center">
          <input 
            type="checkbox"
            checked={state[rowKey][channel]}
            onChange={() => toggle(rowKey, channel)}
            className="w-3.5 h-3.5 text-[#0F478D] focus:ring-[#0F478D] border-slate-300 rounded cursor-pointer transition-all" 
          />
        </td>
      ))}
    </tr>
  );
}