// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { 
  LayoutDashboard, UserCheck, FolderKanban, ShieldAlert, 
  FileCheck, CalendarClock, Users, BarChart3,  
  ChevronDown, ChevronRight, Shield, ShieldCheck, 
  Settings, LogOut, BookOpen
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ==========================================================================
  // 1. ALL REACT HOOKS PLACED SAFELY INSIDE THE FUNCTION BODY
  // ==========================================================================
  const { logout, activeRole, switchRole } = useAuth();
  
  // State variables for sub-menus and agent settings context
  const [isNewBusinessOpen, setIsNewBusinessOpen] = useState(true);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(true);
  const currentAgentName = localStorage.getItem('agentName') || "Rohan Malhotra";

  // Active path checking logic helper
  const isActive = (path) => location.pathname === path;

  const getDynamicInitials = (nameString) => {
    const words = nameString.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0] ? words[0].slice(0, 2).toUpperCase() : "AA";
  };

  return (
    <div className="w-[260px] h-screen bg-[#0B1F5B] text-white flex flex-col fixed left-0 top-0 z-50 border-r border-blue-950 font-sans select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-blue-900/50 shrink-0">
        <img src="/logo.png" alt="Betacare Life Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 no-invert" />
        <span className="font-black text-xs tracking-wider uppercase text-white">
          Betacare Life
        </span>
      </div>

      {/* Navigation Matrix Link Groupings */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 text-xs font-bold text-blue-100/80">
        
        {/* Dashboard Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/dashboard') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Lead Management Link */}
        <button
          onClick={() => navigate('/lead-management')}
          className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/lead-management') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Lead Management</span>
        </button>

        {/* --- CATEGORY 1: NEW BUSINESS DROPDOWN DECK --- */}
        <div className="space-y-0.5">
          <button
            onClick={() => setIsNewBusinessOpen(!isNewBusinessOpen)}
            className="w-full h-9 flex items-center justify-between px-3 rounded-xl hover:bg-blue-900/30 text-blue-300 font-black uppercase text-[10px] tracking-wider mt-2"
          >
            <span>New Business</span>
            {isNewBusinessOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {isNewBusinessOpen && (
            <div className="pl-3 space-y-0.5 border-l border-blue-900/40 ml-4 mt-0.5">
              {activeRole !== 'Underwriter' && (
                <button
                  onClick={() => navigate('/quotations')}
                  className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                    isActive('/quotations') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Quotations</span>
                </button>
              )}

              <button
                onClick={() => navigate('/policies/underwriting')}
                className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                  isActive('/policies/underwriting') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Underwriting Cases</span>
              </button>
            </div>
          )}
        </div>

        {/* --- CATEGORY 2: POLICIES DROPDOWN DECK --- */}
        <div className="space-y-0.5">
          <button
            onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
            className="w-full h-9 flex items-center justify-between px-3 rounded-xl hover:bg-blue-900/30 text-blue-300 font-black uppercase text-[10px] tracking-wider mt-2"
          >
            <span>Policies</span>
            {isPoliciesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          {isPoliciesOpen && (
            <div className="pl-3 space-y-0.5 border-l border-blue-900/40 ml-4 mt-0.5">
              <button
                onClick={() => navigate('/policies')}
                className={`w-full h-8 flex items-center gap-2.5 px-3 rounded-lg text-left transition-all ${
                  isActive('/policies') ? 'bg-blue-600/60 text-white font-extrabold' : 'hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Active Policies</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Standalone Link Rows */}
        <div className="pt-2 border-t border-blue-900/40 mt-2 space-y-1">
          <button onClick={() => navigate('/settings')} className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl transition-all ${
            isActive('/settings') ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-blue-900/40 hover:text-white'
          }`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* User Profile Footer Section */}
      <div className="p-4 border-t border-blue-900/50 space-y-3 bg-blue-950/40 shrink-0">


        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all select-none cursor-pointer" onClick={() => navigate('/settings')}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black tracking-tighter shrink-0 shadow-sm">
            {getDynamicInitials(currentAgentName)}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-xs font-bold text-white leading-none truncate">{currentAgentName.split(' ')[0]}</p>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">View Profile</span>
          </div>
        </div>
        
        {/* LOGOUT INTERACTION BUTTON */}
        <div className="pt-2 border-t border-blue-900/30">
          <button
            type="button"
            onClick={() => {
              logout(); 
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold px-2 py-1.5 focus:outline-none rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Exit Session (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
}