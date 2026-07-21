// src/pages/PaymentGateway.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle2, Landmark, RefreshCw } from 'lucide-react';
import { fetchFromPortal } from './api';

export default function PaymentGateway() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [uCase, setUCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [toastMsg, setToastMsg] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('agent_token');
        const res = await fetch(`/api/underwriting`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          const matched = data.data.find(c => c._id === caseId);
          setUCase(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem('agent_token');
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseId,
          paymentMode: selectedMethod
        })
      });

      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
        setToastMsg('Payment captured successfully!');
        setTimeout(() => {
          navigate(`/policies/issued/${data.data.policyNumber}`, { state: { policy: data.data } });
        }, 1500);
      } else {
        setToastMsg(`Clearing error: ${data.message}`);
        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to process payment with settlement bank.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0B1F5B] mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Opening Payment Gateway...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F5F7FB] text-left font-sans pb-16 w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-[#0B1F5B] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 border border-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-3xs w-full">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate('/lead-management/proposal-tracking')} className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-[#0B1F5B] tracking-tight text-[20px] leading-none">Step 7 — Premium Payment Remittance</h1>
            <span className="text-slate-400 font-bold block mt-1 uppercase tracking-wider text-[9px]">ID Reference: {caseId.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment options column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-2">Select Premium Payment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700 select-none">
              {[
                { id: 'upi', title: 'Instant UPI Transfer', desc: 'Google Pay, PhonePe, BHIM' },
                { id: 'netbanking', title: 'Net Banking Node', desc: 'Direct corporate banking gateways' },
                { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { id: 'nach', title: 'NACH Auto-Debit mandate', desc: 'Auto-recurring yearly renewal' }
              ].map(method => (
                <label
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                    selectedMethod === method.id ? 'border-[#0B1F5B] bg-blue-50/15' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" checked={selectedMethod === method.id} onChange={() => {}} className="mt-0.5 accent-[#0B1F5B]" />
                  <div className="flex flex-col text-left">
                    <span className="text-slate-900 font-extrabold">{method.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-normal">{method.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 text-[11px] font-semibold text-slate-600 select-none">
              <Shield className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-left">
                <span className="font-bold text-slate-900 block">Secured clearing node gateway connection</span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                  Remittances are routed point-to-point via asymmetric vault keys complying with PCI-DSS guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Cost Statement */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-2 mb-4">Premium Accounting Summary</h3>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-650 text-left">
                <div className="flex justify-between"><span>Base Premium</span><span className="font-bold text-slate-900">₹{Math.round(uCase?.premium / 1.18).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>GST / Taxes (18%)</span><span className="font-bold text-slate-900">₹{Math.round(uCase?.premium - (uCase?.premium / 1.18)).toLocaleString('en-IN')}</span></div>
                <div className="pt-2.5 border-t border-dashed border-slate-250 flex justify-between text-slate-900 font-black text-sm">
                  <span>Total Premium Payable</span>
                  <span className="text-[#0B1F5B] text-base font-black">₹{uCase?.premium.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={paymentSuccess}
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
            >
              <CreditCard className="w-4 h-4 text-emerald-100" />
              <span>Confirm & Process Payment</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
