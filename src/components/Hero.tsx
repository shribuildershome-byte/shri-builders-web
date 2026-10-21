import React from 'react';
import {Phone, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, Calculator, Ruler, HardHat} from 'lucide-react';
import {COMPANY_DETAILS} from '../data/company.ts';

interface HeroProps {
  onOpenEstimator: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({onOpenEstimator, onOpenContact}) => {
  return (
    <section id="home" className="relative pt-28 sm:pt-32 pb-16 lg:pb-24 overflow-hidden bg-slate-50">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Decorative Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Coimbatore, Tamil Nadu • Premier Construction Contractors</span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Quality in <span className="text-blue-700 underline decoration-blue-200 decoration-wavy decoration-2">Every Build</span>
            </h1>

            {/* Company Introduction */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
              Welcome to <strong className="text-slate-900 font-bold">SHRI BUILDERS</strong>, your trusted construction company based in Coimbatore. 
              We engineer durable residential houses, commercial buildings, and industrial facilities with precision civil engineering, 
              complete DTCP plan approval assistance, and transparent pricing across Tamil Nadu.
            </p>

            {/* Prominent Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Call Now Button */}
              <a
                href={COMPANY_DETAILS.phoneTel}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold text-white bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-5 h-5 text-amber-300" />
                <span>Call Now: 7708757643</span>
              </a>

              {/* WhatsApp Button */}
              <a
                href={COMPANY_DETAILS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-5 h-5 text-white" />
                <span>WhatsApp Us</span>
              </a>

              {/* Cost Estimator Button */}
              <button
                onClick={onOpenEstimator}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-all"
              >
                <Calculator className="w-4 h-4 text-blue-700" />
                <span>Cost Calculator</span>
              </button>
            </div>

            {/* Engineering Highlights / Quality Commitments */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fe-550 TMT Steel</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>53-Grade Certified Cement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>DTCP / LPA Approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>100% Vaastu Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Bank Loan Estimates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>28-Day Water Curing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image / Hero Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Architectural Showcase Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
                  alt="Modern residential villa built by SHRI BUILDERS in Coimbatore"
                  className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                {/* Brand Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-100/90 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center text-white">
                    <HardHat className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">
                      {COMPANY_DETAILS.name}
                    </p>
                    <p className="text-[9px] text-slate-500 font-medium">
                      {COMPANY_DETAILS.tagline}
                    </p>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                      Coimbatore Construction Excellence
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Turnkey Solutions
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    Residential • Commercial • Industrial
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    From foundation soil testing to key handover across Tamil Nadu.
                  </p>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Engineering Rigor</p>
                  <p className="text-[11px] text-slate-500">Zero Compromise on Quality</p>
                </div>
              </div>

              {/* Floating Drawing Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">2D & 3D Planning</p>
                  <p className="text-[11px] text-slate-500">Vaastu & By-law Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
