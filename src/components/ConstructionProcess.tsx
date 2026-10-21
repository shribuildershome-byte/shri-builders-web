import React from 'react';
import {
  MapPin,
  Compass,
  FileSpreadsheet,
  FileCheck2,
  HardHat,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const ConstructionProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Site Visit & Soil Study',
      desc: 'Our engineers visit your plot in Coimbatore or Tamil Nadu to assess topography, boundary markers, and foundation soil bearing capacity.',
      icon: <MapPin className="w-5 h-5 text-blue-700" />,
    },
    {
      step: '02',
      title: '2D & 3D Architectural Drafting',
      desc: 'We design custom 2D floor plans with 100% Vaastu compliance, followed by photorealistic 3D elevations and structural CAD layouts.',
      icon: <Compass className="w-5 h-5 text-blue-700" />,
    },
    {
      step: '03',
      title: 'Itemized BOQ & Transparent Contract',
      desc: 'Receive an exhaustive Bill of Quantities specifying branded materials, structural schedules, and stage-wise payment milestones.',
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-700" />,
    },
    {
      step: '04',
      title: 'Approval & Loan Support',
      desc: 'We complete the blueprint liaison for DTCP, Corporation, or Panchayat permits, alongside certified bank loan valuation dossiers.',
      icon: <FileCheck2 className="w-5 h-5 text-blue-700" />,
    },
    {
      step: '05',
      title: 'Supervised Structural Execution',
      desc: 'Footing, RCC columns, slab casting, masonry, and MEP works supervised by qualified civil engineers with 28-day water curing.',
      icon: <HardHat className="w-5 h-5 text-blue-700" />,
    },
    {
      step: '06',
      title: 'Quality Inspection & Handover',
      desc: 'Final snagging audit, complete cleaning, waterproofing warranty documentation, and celebratory key handover on schedule.',
      icon: <KeyRound className="w-5 h-5 text-blue-700" />,
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold tracking-wide uppercase mb-3">
            Systematic Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How We Build <span className="text-blue-700">Your Vision</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From plot measurements to key handover, our systematic engineering workflow guarantees total clarity at every phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((st) => (
            <div
              key={st.step}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-blue-700 flex items-center justify-center shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  {st.icon}
                </div>
                <span className="text-3xl font-black text-slate-300 font-mono group-hover:text-blue-200 transition-colors">
                  {st.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {st.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
