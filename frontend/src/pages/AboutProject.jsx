// src/pages/AboutProject.jsx
import React from 'react';
import { BookOpen, Target, Cpu, ShieldCheck, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="flex-1 p-6 space-y-8 bg-[#F5F7FB] min-h-screen text-left w-full font-sans antialiased pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0B1F5B] tracking-tight">About the Project</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Business Analyst Portfolio Case Study & Solution Architecture</p>
      </div>

      {/* Overview Block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Executive Summary</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          The **Betacare Life Insurance Agent Portal** is a digital transformation initiative designed to streamline the lifecycle of insurance prospect acquisition, risk underwriting, and policy issuance. Developed from a **Business Analyst perspective**, the portal addresses critical operational inefficiencies in agent workflows by replacing manual, paper-intensive processes with a unified digital console.
        </p>
      </div>

      {/* Case Study Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem Statement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">The Problem Statement</h2>
          </div>
          <ul className="space-y-3 text-xs text-slate-500 font-semibold list-disc pl-4">
            <li><strong className="text-slate-800">Long Turnaround Times (TAT):</strong> Moving a prospect from lead intake to active policy coverage traditionally took up to 14 business days.</li>
            <li><strong className="text-slate-800">High Lead Drop-offs:</strong> Lack of real-time quote generation and comparison allowed leads to explore competing brands.</li>
            <li><strong className="text-slate-800">Underwriting Backlogs:</strong> Manual review requirements for standard, low-risk policies created severe processing queues.</li>
            <li><strong className="text-slate-800">Compliance Vulnerability:</strong> High error rates in manual forms created regulatory compliance check failures.</li>
          </ul>
        </div>

        {/* Proposed Solution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Proposed Solution Design</h2>
          </div>
          <ul className="space-y-3 text-xs text-slate-500 font-semibold list-disc pl-4">
            <li><strong className="text-slate-800">Unified Lead Wizard:</strong> Enforces clean data entry across a validated 6-stage intake funnel.</li>
            <li><strong className="text-slate-800">Rules-Engine Auto-Underwriting:</strong> Instantly evaluates applicant risk parameters to automate approvals.</li>
            <li><strong className="text-slate-800">Real-time KPI Monitoring:</strong> Displays live performance trackers, activity streams, and collections trends.</li>
            <li><strong className="text-slate-800">Encrypted Digital Vault:</strong> Enforces security for uploaded identity parameters (PAN/Aadhaar) to satisfy IRDAI regulations.</li>
          </ul>
        </div>

      </div>

      {/* Target Business Metrics Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Business Impact & Metrics Delivered</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-slate-500 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Performance Metric</th>
                <th className="py-2.5">Legacy Process (As-Is)</th>
                <th className="py-2.5">Portal Process (To-Be)</th>
                <th className="py-2.5 text-right">Strategic Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 text-slate-800 font-bold">Policy Issuance TAT</td>
                <td className="py-3">14 Business Days</td>
                <td className="py-3 text-emerald-600 font-bold">Under 15 Minutes</td>
                <td className="py-3 text-right text-emerald-600 font-bold">98.9% Reduction</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-800 font-bold">Underwriting Automation</td>
                <td className="py-3">0% (100% Manual Review)</td>
                <td className="py-3 text-emerald-600 font-bold">70% Auto-Approved</td>
                <td className="py-3 text-right text-emerald-600 font-bold">70% Manual Reduction</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-800 font-bold">Form Input Error Rate</td>
                <td className="py-3">24.2% Average Error Rate</td>
                <td className="py-3 text-emerald-600 font-bold">0% (Enforced Validations)</td>
                <td className="py-3 text-right text-emerald-600 font-bold">100% Quality Improvement</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-800 font-bold">Client Conversion Rate</td>
                <td className="py-3">12.4% Average</td>
                <td className="py-3 text-emerald-600 font-bold">18.6% Target</td>
                <td className="py-3 text-right text-emerald-600 font-bold">50% Sales Uplift</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* System Requirements Outline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Requirement Specifications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500 font-semibold">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Functional Requirements (FR)</h4>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Automatic routing of pending quotes to comparison spreadsheets.</li>
              <li>Verification status logging on Pan/Aadhaar image file metadata.</li>
              <li>Dynamic database activity feed generation sorted chronologically.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Non-Functional Requirements (NFR)</h4>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Interface responsiveness scaling from 1200px screens to high-res displays.</li>
              <li>State persistence in local storage to preserve session parameters.</li>
              <li>Light/Dark UI toggles to safeguard operator visual ergonomics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
