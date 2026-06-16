// src/pages/NewPolicyWorkflowFixed.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Shield, CreditCard, Calendar, AlertTriangle, ArrowLeft, 
  ArrowRight, Save, User, Briefcase, DollarSign, Heart, Layers, CheckCircle2, 
  FileText, Check, Upload, Activity, Smartphone, Building, Mail, Phone, MapPin 
} from 'lucide-react';

export default function NewPolicyWorkflowFixed() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(5);
  
  const [formData] = useState({
    paymentMethod: 'Credit/Debit Card',
    cardholderName: 'Jonathan Sterling',
    cardNumber: '**** **** **** 4421',
    expiryDate: 'MM/YY',
    cvvCode: '***',
    declaredInfoCorrect: true,
    declaredCreditAssessment: true
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] text-left font-sans antialiased pb-16 w-full">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/policies')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-start">
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-tight">New Policy Application</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[10px]">Step 5 of 5: Review & Payment</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-black text-[#0B1F5B] uppercase tracking-wider">Final Review</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Verify details prior to invoking payment engines.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Client Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/60 p-4 border border-slate-100 rounded-xl text-xs font-semibold">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Primary Applicant</span>
                <span className="text-slate-900 font-bold block mt-0.5">Jonathan K. Sterling</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Contact</span>
                <span className="text-slate-900 font-bold block mt-0.5">j.sterling@example.com</span>
                <span className="text-slate-500 font-medium block mt-0.5">+1 (555) 012-3456</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Policy Holder ID</span>
                <span className="text-slate-900 font-mono font-bold block mt-0.5">LUM-992834-X</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Address</span>
                <span className="text-slate-900 font-medium block mt-0.5 leading-normal">7224 Oak Creek Terrace, San Francisco, CA 94107</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="sm:col-span-3 border-b border-slate-100 pb-2">
              <span className="text-base font-black text-[#0B1F5B] block">Lumina Secure+ Elite</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">Comprehensive Life & Health Coverage</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Coverage Amount</span>
              <span className="text-slate-900 font-black block mt-0.5 text-sm">\$2,500,000</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Policy Term</span>
              <span className="text-slate-900 font-extrabold block mt-0.5">25 Years</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Riders Added</span>
              <span className="text-[#0B1F5B] font-black block mt-0.5 text-sm">03</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
              <label className="p-3 border rounded-xl flex items-center gap-3 cursor-pointer border-[#0B1F5B] bg-blue-50/10">
                <input type="radio" checked={formData.paymentMethod === 'Credit/Debit Card'} readOnly />
                <div className="text-left">
                  <span className="block text-slate-900 font-extrabold">Credit/Debit Card</span>
                  <span className="text-[9px] text-slate-400 block font-medium mt-0.5">Visa, Mastercard, Amex</span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-4 border border-slate-200 bg-slate-50/40 rounded-xl space-y-3">
            <h4 className="text-[10px] font-black uppercase text-[#0B1F5B] tracking-wider block mb-1">Declarations & Consent</h4>
            <label className="flex items-start gap-2.5 text-[11px] font-semibold">
              <input type="checkbox" checked={formData.declaredInfoCorrect} readOnly className="mt-0.5" /> 
              <span className="text-slate-700">I confirm that all information provided is accurate.</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button type="button" className="h-10 px-6 bg-black text-white font-black text-xs rounded-xl shadow-md">
              Pay & Submit Application →
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[112px]">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">TOTAL ANNUAL PREMIUM DUE</h4>
              <span className="text-2xl font-black text-slate-900 block mt-1">\$4,820.50</span>
            </div>
            <div className="space-y-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between"><span>Base Premium</span><span className="font-bold text-slate-900">\$4,200.00</span></div>
              <div className="flex justify-between"><span>Rider Charges</span><span className="font-bold text-slate-900">\$420.50</span></div>
              <div className="flex justify-between"><span>Policy Admin Fee</span><span className="font-bold text-slate-900">\$200.00</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}