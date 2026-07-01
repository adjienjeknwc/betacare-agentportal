// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // CRITICAL: Required to render active child pages
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FB] overflow-x-hidden">
      
      {/* FIXED BOUNDING SIDEBAR CONTAINER */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#0B1E46] text-white z-30 select-none">
        <Sidebar />
      </aside>

      {/* CORE WORKSPACE INNER CONTENT ROW FRAME */}
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen w-[calc(100%-260px)] relative overflow-x-hidden">
        
        {/* DYNAMIC CHILD LAYER OUTLET ANCHOR HOOK */}
        <Outlet /> 

      </div>

    </div>
  );
}