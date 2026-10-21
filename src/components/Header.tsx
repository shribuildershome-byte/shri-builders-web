import React, {useState, useEffect} from 'react';
import {Phone, MessageSquare, Mail, MapPin, Menu, X, ArrowRight, HardHat} from 'lucide-react';
import {COMPANY_DETAILS} from '../data/company.ts';

interface HeaderProps {
  onSelectService?: (serviceId: string) => void;
  onNavigateToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectService, onNavigateToAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {name: 'Home', href: '#home'},
    {name: 'About Us', href: '#about'},
    {name: 'Services', href: '#services'},
    {name: 'Projects', href: '#projects'},
    {name: 'Gallery', href: '#gallery'},
    {name: 'Cost Estimator', href: '#estimator'},
    {name: 'Contact Us', href: '#contact'},
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Corporate Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={COMPANY_DETAILS.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium hover:text-white transition-colors"
              title="Get directions to 29/1 Sabari Arcade, Avarampalayam, Coimbatore"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Avarampalayam, Coimbatore</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">Serving all districts across Tamil Nadu</span>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <a
              href={COMPANY_DETAILS.phoneTel}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="Call SHRI BUILDERS"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-slate-100">{COMPANY_DETAILS.phoneDisplay}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={COMPANY_DETAILS.emailMailto}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
              title="Email SHRI BUILDERS"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{COMPANY_DETAILS.email}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a
              href={COMPANY_DETAILS.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            {onNavigateToAdmin && (
              <>
                <span className="text-slate-700">|</span>
                <button
                  onClick={onNavigateToAdmin}
                  className="text-slate-400 hover:text-blue-300 font-medium transition-colors text-[11px]"
                  title="Admin Portal Login"
                >
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md py-3' : 'shadow-sm py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Company Brand & Name */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none py-1"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            title="SHRI BUILDERS - Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                {COMPANY_DETAILS.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 tracking-wider uppercase -mt-0.5">
                Builders &amp; Developers
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-700 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={COMPANY_DETAILS.phoneTel}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>7708757643</span>
            </a>

            <a
              href={COMPANY_DETAILS.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-all hover:shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => handleNavClick('#contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-all"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={COMPANY_DETAILS.phoneTel}
              className="p-2 text-blue-800 bg-blue-50 rounded-md border border-blue-200"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-blue-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="space-y-1 py-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-800 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={COMPANY_DETAILS.phoneTel}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-blue-800 rounded-md shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now: 7708757643</span>
              </a>

              <a
                href={COMPANY_DETAILS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 rounded-md shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => handleNavClick('#contact')}
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Request a Free Quote & Site Inspection
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
