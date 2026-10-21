import React from 'react';
import {
  HardHat,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  ArrowUp,
  Navigation,
} from 'lucide-react';
import {COMPANY_DETAILS, SERVICES} from '../data/company.ts';

interface FooterProps {
  onSelectService?: (serviceTitle: string) => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({onSelectService, onNavigateToAdmin}) => {
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const socialLinks = [
    {name: 'Facebook', href: '#', icon: 'FB'},
    {name: 'Instagram', href: '#', icon: 'IG'},
    {name: 'LinkedIn', href: '#', icon: 'IN'},
    {name: 'YouTube', href: '#', icon: 'YT'},
    {name: 'Twitter / X', href: '#', icon: 'X'},
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & Introduction Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Company Brand Badge & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                <HardHat className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg text-white tracking-tight">
                  {COMPANY_DETAILS.name}
                </span>
                <span className="text-[11px] font-medium text-blue-400 uppercase tracking-wider -mt-0.5">
                  Builders &amp; Developers
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Premier construction company based in Coimbatore, Tamil Nadu. Delivering enduring residential villas, 
              commercial complexes, industrial PEB sheds, DTCP plan approval liaison, and bank loan documentation across Tamil Nadu.
            </p>

            {/* Social Media Link Placeholders */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2.5">
                Social Media Links
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={`SHRI BUILDERS on ${social.name} (Placeholder)`}
                    title={`${social.name} (Placeholder link)`}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white hover:bg-blue-900 hover:border-blue-700 transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Construction Services Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      if (onSelectService) {
                        e.preventDefault();
                        onSelectService(s.title);
                        const el = document.querySelector('#services');
                        if (el) el.scrollIntoView({behavior: 'smooth'});
                      }
                    }}
                    className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-blue-500">›</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Districts Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Coverage Areas
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Coimbatore City</li>
              <li>Saravanampatti & IT Belt</li>
              <li>Tiruppur & Palladam</li>
              <li>Erode & Perundurai</li>
              <li>Salem & Namakkal</li>
              <li>Pollachi & Udumalpet</li>
              <li>Madurai & Trichy</li>
              <li className="text-blue-400 font-semibold pt-1">Across Tamil Nadu</li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Head Office & Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <a
                href={COMPANY_DETAILS.phoneTel}
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-semibold">{COMPANY_DETAILS.phone}</span>
                  <span className="text-[11px] text-slate-500">Tap to call</span>
                </div>
              </a>

              <a
                href={COMPANY_DETAILS.emailMailto}
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="break-all">{COMPANY_DETAILS.email}</span>
              </a>

              <a
                href={COMPANY_DETAILS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                <span>WhatsApp: +91 {COMPANY_DETAILS.phone}</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-300 pt-1">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <div>
                  <span className="text-white font-semibold block">SHRI BUILDERS Office</span>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {COMPANY_DETAILS.address}
                  </p>
                  <a
                    href={COMPANY_DETAILS.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Navigation className="w-3 h-3 text-amber-400" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-300">SHRI BUILDERS</strong>. All rights reserved. 
            Coimbatore, Tamil Nadu, India.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAdmin}
              className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
              title="Admin Sign In"
            >
              Admin Portal
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
