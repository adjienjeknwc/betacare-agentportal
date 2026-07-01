// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FB] overflow-x-hidden">
      
      {/* SIDEBAR CONTAINER (Responsive Drawer on Mobile, Fixed Sidebar on Large Screens) */}
      <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-[#0B1E46] text-white z-50 select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* MOBILE HEADER BAR (Visible only on mobile/tablet) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0B1F5B] text-white flex items-center justify-between px-4 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-0.5" />
          <span className="text-sm font-black tracking-tight">BETACARE LIFE</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-1.5 rounded-lg hover:bg-blue-900 focus:outline-none transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* BACKDROP FOR MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      {/* CORE WORKSPACE INNER CONTENT ROW FRAME */}
      <div className="lg:ml-[260px] flex-1 flex flex-col min-h-screen lg:w-[calc(100%-260px)] w-full relative overflow-x-hidden pt-14 lg:pt-0">
        
        {/* DYNAMIC CHILD LAYER OUTLET ANCHOR HOOK */}
        <Outlet /> 

      </div>

    </div>
  );
}