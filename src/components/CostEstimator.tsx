import React, {useState} from 'react';
import {
  Calculator,
  IndianRupee,
  Layers,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  Info,
  Building,
} from 'lucide-react';
import {ESTIMATOR_PACKAGES, COMPANY_DETAILS} from '../data/company.ts';

export const CostEstimator: React.FC = () => {
  const [areaSqFt, setAreaSqFt] = useState<number>(1800);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('premium');
  const [includeSumpSeptic, setIncludeSumpSeptic] = useState<boolean>(true);
  const [floorType, setFloorType] = useState<string>('G+1');

  const selectedPkg = ESTIMATOR_PACKAGES.find((p) => p.id === selectedPackageId) || ESTIMATOR_PACKAGES[1];

  // Base construction cost
  const baseCost = areaSqFt * selectedPkg.ratePerSqFt;
  // Sump, septic tank, and basic compound foundation approx ₹1.8 Lakhs if toggled
  const ancillaryCost = includeSumpSeptic ? 180000 : 0;
  const totalEstimatedCost = baseCost + ancillaryCost;

  // Breakdown percentages
  const civilCost = Math.round(baseCost * 0.58);
  const finishingCost = Math.round(baseCost * 0.26);
  const mepCost = Math.round(baseCost * 0.16);

  const formatLakhs = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crores`;
    }
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  };

  const generateWhatsAppMessage = () => {
    const text = `Namaste SHRI BUILDERS,
I calculated a construction estimate on your website:
- Built-up Area: ${areaSqFt} sq.ft (${floorType})
- Package: ${selectedPkg.name} (₹${selectedPkg.ratePerSqFt}/sq.ft)
- Sump & Septic Tank: ${includeSumpSeptic ? 'Included' : 'Not included'}
- Estimated Total: ${formatLakhs(totalEstimatedCost)} (₹${totalEstimatedCost.toLocaleString('en-IN')})
Location: Coimbatore / Tamil Nadu

Please provide a detailed BOQ and site inspection consultation.`;
    return encodeURIComponent(text);
  };

  return (
    <section id="estimator" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold tracking-wide uppercase mb-3">
            Tamil Nadu Construction Cost Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Estimate Your <span className="text-blue-700">Construction Budget</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Get an instant, transparent ballpark calculation for building an individual house, villa, or commercial property 
            based on Coimbatore and Tamil Nadu market material and labor rates.
          </p>
        </div>

        {/* Estimator Card Container */}
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
              {/* Step 1: Built-up Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="area-input" className="text-sm font-bold text-slate-900">
                    1. Built-up Area (Sq.Ft)
                  </label>
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                    <span className="text-base font-extrabold text-blue-900">{areaSqFt}</span>
                    <span className="text-xs text-blue-700 font-semibold">sq.ft</span>
                  </div>
                </div>

                <input
                  id="area-input"
                  type="range"
                  min="600"
                  max="5000"
                  step="50"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                />

                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>600 sq.ft (Compact Home)</span>
                  <span>2,000 sq.ft (Duplex)</span>
                  <span>5,000 sq.ft (Luxury Villa)</span>
                </div>
              </div>

              {/* Step 2: Floor Structure */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-2.5">
                  2. Building Configuration
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {id: 'Ground Floor', label: 'Ground Floor (G)'},
                    {id: 'G+1', label: 'Duplex (G+1)'},
                    {id: 'G+2', label: 'Triplex (G+2)'},
                  ].map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setFloorType(fl.id)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                        floorType === fl.id
                          ? 'bg-blue-800 text-white border-blue-800 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Package Selector */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-2.5">
                  3. Select Material Specification Package
                </label>
                <div className="space-y-3">
                  {ESTIMATOR_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPackageId === pkg.id
                          ? 'border-blue-700 bg-blue-50/60 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="package-selector"
                            checked={selectedPackageId === pkg.id}
                            onChange={() => setSelectedPackageId(pkg.id)}
                            className="text-blue-700 focus:ring-blue-600"
                          />
                          <span className="font-bold text-sm text-slate-900">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                              Most Preferred
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-extrabold text-blue-900">
                          ₹{pkg.ratePerSqFt} <span className="text-[11px] font-normal text-slate-500">/ sq.ft</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-6">{pkg.recommendedFor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Sump & Septic Tank Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSumpSeptic}
                    onChange={(e) => setIncludeSumpSeptic(e.target.checked)}
                    className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-600"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Include Under-ground RCC Sump (6,000L) & Septic Tank (~₹1.80 L approx)
                  </span>
                </label>
              </div>
            </div>

            {/* Right Result Summary Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400 block mb-1">
                  Estimated Construction Budget
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {formatLakhs(totalEstimatedCost)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ₹{totalEstimatedCost.toLocaleString('en-IN')} (Approximate turnkey cost)
                </p>

                {/* Selected Package Specs Preview */}
                <div className="mt-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2.5 text-xs">
                  <div className="text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1.5 flex justify-between">
                    <span>{selectedPkg.name} Inclusions</span>
                    <span className="text-blue-400">₹{selectedPkg.ratePerSqFt}/sq.ft</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Cement:</span>
                    <span className="font-medium text-right text-slate-200">{selectedPkg.cement}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Steel:</span>
                    <span className="font-medium text-right text-slate-200">{selectedPkg.steel}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Bricks:</span>
                    <span className="font-medium text-right text-slate-200">{selectedPkg.bricks}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Flooring:</span>
                    <span className="font-medium text-right text-slate-200 truncate max-w-[160px]">{selectedPkg.flooring}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Sanitary:</span>
                    <span className="font-medium text-right text-slate-200 truncate max-w-[160px]">{selectedPkg.plumbing}</span>
                  </div>
                </div>

                {/* Stage Breakdown */}
                <div className="mt-6 space-y-2 text-xs">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                    Phase-wise Budget Allocation (Approx)
                  </span>
                  <div className="flex justify-between text-slate-300">
                    <span>RCC & Civil Works (58%):</span>
                    <span className="font-semibold">{formatLakhs(civilCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Finishing & Painting (26%):</span>
                    <span className="font-semibold">{formatLakhs(finishingCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Plumbing & Electrical (16%):</span>
                    <span className="font-semibold">{formatLakhs(mepCost)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                <a
                  href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Estimate to WhatsApp (+91 77087 57643)</span>
                </a>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  *Preliminary estimation for budgeting guidance in Coimbatore & Tamil Nadu. Exact quotation provided after plot survey, soil test report, and structural drawing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
