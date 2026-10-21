import React from 'react';
import {Shield, Compass, Building, Award, CheckCircle, MapPin, Layers, Clock, FileCheck2, ArrowRight} from 'lucide-react';
import {COMPANY_DETAILS} from '../data/company.ts';

interface AboutUsProps {
  onEnquire: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({onEnquire}) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold tracking-wide uppercase mb-3">
            About Our Company
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Building Strong Foundations Across <span className="text-blue-700">Tamil Nadu</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Headquartered in Coimbatore, <strong className="text-slate-800 font-semibold">SHRI BUILDERS</strong> is dedicated to delivering durable, 
            architecturally refined, and structurally sound residential, commercial, and industrial constructions.
          </p>
        </div>

        {/* Narrative & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Images Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=900&auto=format&fit=crop"
                alt="RCC column casting and engineering construction supervision at SHRI BUILDERS"
                className="w-full h-[380px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                  Engineering Standard
                </span>
                <p className="text-sm font-bold mt-1">
                  On-Site Civil Supervision at Foundation, Column & Slab Pouring
                </p>
              </div>
            </div>

            {/* Inset Sub-Image */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop"
                alt="Civil structural drawings and architectural plan scrutiny"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Committed to Structural Integrity, Precision Engineering & Complete Peace of Mind
            </h3>
            
            <p className="text-slate-600 leading-relaxed">
              At <strong className="text-slate-900 font-semibold">SHRI BUILDERS</strong>, we believe every structure should be built to withstand decades of weather and generations of living. 
              Based in Coimbatore, Tamil Nadu, we provide complete turnkey construction services for individuals, business owners, and industries across Tamil Nadu.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Whether you possess a residential plot in Coimbatore, plan to build a multistory commercial building in Tiruppur, or require an industrial shed in the industrial belt, 
              we oversee the full lifecycle — starting with soil testing, architectural planning, DTCP / Corporation approvals, and bank loan valuation dossiers, through to turnkey handover.
            </p>

            {/* Official Corporate Credentials Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <Building className="w-6 h-6 text-amber-300" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-700 block">
                  Registered Construction Brand
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {COMPANY_DETAILS.name}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Headquartered at 29/1 Sabari Arcade, Avarampalayam, Coimbatore. Backed by certified civil engineers, structural CAD drawings, and transparent milestone contracts.
                </p>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Certified Materials Only</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We use Fe-550D TMT steel bars, 53-grade certified cement, and double-washed sand adhering strictly to IS 456 construction codes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">100% Vaastu & By-law Compliance</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every 2D layout and 3D elevation harmonizes traditional Tamil Nadu Vaastu Shastra with modern natural lighting and cross-ventilation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Approvals & Loan Liaison</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We prepare blue prints and complete liaison for DTCP, Coimbatore Corporation, LPA, and provide certified stage estimates for bank loans.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Milestone-Based Billing</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear stage-wise progress: foundation, lintel, slab casting, brickwork, plastering, and finishing. No sudden price surprises.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnquire}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
              >
                <span>Discuss Your Construction Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tamil Nadu Coverage Districts Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>Geographic Reach</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Serving Clients Throughout Coimbatore & All Across Tamil Nadu
              </h3>
              <p className="text-blue-100/80 text-xs sm:text-sm mt-1 max-w-2xl">
                Our site engineers travel to active project plots across the state. Contact us for site inspections, plot boundary measurements, and soil feasibility reviews.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-w-lg">
              {COMPANY_DETAILS.coverageAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium text-blue-50 border border-white/10 transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
