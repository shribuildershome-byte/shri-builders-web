import React from 'react';
import {Phone, MessageSquare, Send} from 'lucide-react';
import {COMPANY_DETAILS} from '../data/company.ts';

interface MobileStickyBarProps {
  onEnquireClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({onEnquireClick}) => {
  return (
    <aside
      aria-label="Quick contact actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl"
    >
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={COMPANY_DETAILS.phoneTel}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-blue-800 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 mb-0.5 text-amber-300" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={COMPANY_DETAILS.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* Enquire Button */}
        <button
          onClick={onEnquireClick}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-900 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4 mb-0.5 text-blue-400" />
          <span>Get Quote</span>
        </button>
      </div>
    </aside>
  );
};
