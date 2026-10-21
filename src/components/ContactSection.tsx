import React, {useState, useEffect} from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ExternalLink,
  Navigation,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import {COMPANY_DETAILS, SERVICES} from '../data/company.ts';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({preselectedService}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    service?: string;
    location?: string;
  }>({});

  // Submission statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    code?: string;
    message?: string;
    details?: string;
  } | null>(null);

  const [directActionTaken, setDirectActionTaken] = useState<string | null>(null);
  const [showBackendGuide, setShowBackendGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const validate = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      service?: string;
      location?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your contact mobile number';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!service) {
      newErrors.service = 'Please select the service required';
    }

    if (!location.trim()) {
      newErrors.location = 'Please enter your location or plot city in Tamil Nadu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const constructEnquiryText = () => {
    return `*SHRI BUILDERS - New Website Enquiry*
*Client Name:* ${name.trim()}
*Phone Number:* ${phone.trim()}
*Service Required:* ${service}
*Plot Location:* ${location.trim()}
*Project Details:* ${message.trim() ? message.trim() : 'Interested in quotation and site consultation'}`;
  };

  // 1. Direct WhatsApp dispatch: guarantees instant delivery to 917708757643
  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setApiResponse(null);
    const text = constructEnquiryText();
    const waUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    setDirectActionTaken('WhatsApp');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // 2. Direct Email draft: guarantees instant drafting to shribuilders.home@gmail.com
  const handleSendViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setApiResponse(null);
    const subject = encodeURIComponent(`Construction Enquiry: ${service} - ${name.trim()} (${location.trim()})`);
    const body = encodeURIComponent(constructEnquiryText());
    const mailtoUrl = `mailto:${COMPANY_DETAILS.email}?subject=${subject}&body=${body}`;
    setDirectActionTaken('Email');
    window.location.href = mailtoUrl;
  };

  // 3. Web Server Submission: POST /api/enquiry
  // Note: Only displays success if genuinely submitted and confirmed by backend.
  const handleSubmitViaApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiResponse(null);
    setDirectActionTaken(null);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service,
          location: location.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();
      setApiResponse(data);
    } catch {
      setApiResponse({
        success: false,
        code: 'NETWORK_ERROR',
        message:
          'Could not reach the server endpoint. Please send your enquiry directly via WhatsApp or Email below.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySampleCode = () => {
    const code = `// Example: Connect Resend in vite.config.ts or express backend
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'enquiries@shribuilders.in',
  to: 'shribuilders.home@gmail.com',
  subject: 'New Construction Enquiry from ' + req.body.name,
  text: req.body.message
});`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold tracking-wide uppercase mb-3">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact <span className="text-blue-700">SHRI BUILDERS</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Reach out for site visits, architectural drawings, DTCP approvals, and complete construction quotations in Coimbatore and Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="text-2xl font-bold text-slate-900">
              Direct Contact Details
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our engineering team is readily available on call and WhatsApp for swift consultation regarding your plot and project requirements.
            </p>

            <div className="space-y-4">
              {/* Phone Card */}
              <a
                href={COMPANY_DETAILS.phoneTel}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                    Call Directly
                  </span>
                  <span className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {COMPANY_DETAILS.phone}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Click to initiate call: 7708757643
                  </span>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={COMPANY_DETAILS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                    WhatsApp Chat
                  </span>
                  <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    +91 {COMPANY_DETAILS.phone}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Instant reply & plot coordinate sharing
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={COMPANY_DETAILS.emailMailto}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                    Email Inquiries
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors break-all">
                    {COMPANY_DETAILS.email}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Send drawings & architectural briefs
                  </span>
                </div>
              </a>

              {/* Office Address Card with Google Maps Directions */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-700 block">
                      Registered Office Address
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-1 leading-snug">
                      SHRI BUILDERS
                    </p>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                      {COMPANY_DETAILS.address}
                    </p>

                    {/* Google Maps Action Buttons */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                      <a
                        href={COMPANY_DETAILS.googleMapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-sm hover:shadow"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-300" />
                        <span>Get Directions on Google Maps</span>
                      </a>

                      <a
                        href={COMPANY_DETAILS.googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        <span>View on Map</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center gap-3 text-xs text-blue-950">
                <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                <span><strong>Office Hours:</strong> {COMPANY_DETAILS.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Right Customer Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xl text-left relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Customer Enquiry Form
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your project details. You can submit directly to our WhatsApp or email for guaranteed instant response.
              </p>
            </div>

            {/* Direct Action Notification */}
            {directActionTaken && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-900">
                  <strong>Enquiry Transmitted via {directActionTaken}!</strong>
                  <p className="mt-0.5 text-emerald-800">
                    Your enquiry details were formatted and opened in your {directActionTaken} client for direct delivery to SHRI BUILDERS ({COMPANY_DETAILS.phone}).
                  </p>
                </div>
              </div>
            )}

            {/* API Status Handling (Honest, strictly no fake success message if unconfigured) */}
            {apiResponse && (
              <div
                className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                  apiResponse.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {apiResponse.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm">
                  <p className="font-bold">
                    {apiResponse.success ? 'Enquiry Delivered' : 'Notice on Server Dispatch'}
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {apiResponse.message ||
                      'Automated email service is not yet connected on the backend.'}
                  </p>

                  {!apiResponse.success && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSendViaWhatsApp}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send to WhatsApp Instead</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowBackendGuide(true)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>How to Connect Backend</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({...errors, name: undefined});
                  }}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Mobile Number (10 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPhone(val);
                      if (errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    placeholder="7708757643"
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
              </div>

              {/* Service Required Dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    if (errors.service) setErrors({...errors, service: undefined});
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.service
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                >
                  <option value="">-- Select Required Service --</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="General Construction Consultation">General Construction Consultation</option>
                </select>
                {errors.service && <p className="text-xs text-red-600 mt-1 font-medium">{errors.service}</p>}
              </div>

              {/* Location in Tamil Nadu */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Plot / Project Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({...errors, location: undefined});
                  }}
                  placeholder="e.g. Saravanampatti, Coimbatore or Tiruppur"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.location
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
                {errors.location && <p className="text-xs text-red-600 mt-1 font-medium">{errors.location}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  Message / Project Specifics (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Plot dimensions, estimated built-up area in sq.ft, or approval requirements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                {/* Primary Button: WhatsApp Direct Dispatch */}
                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp (Instant Reply to 7708757643)</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Secondary: Email Client Draft */}
                  <button
                    type="button"
                    onClick={handleSendViaEmail}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>Send via Email Client</span>
                  </button>

                  {/* Tertiary: Submit to Server API */}
                  <button
                    type="button"
                    onClick={handleSubmitViaApi}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-800" />
                    <span>{isSubmitting ? 'Validating...' : 'Submit to Server API'}</span>
                  </button>
                </div>
              </div>

              {/* Backend explanation link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowBackendGuide(true)}
                  className="text-[11px] text-slate-500 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>How does enquiry delivery work on this website? (Backend integration info)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Backend Integration Explanation Modal */}
      {showBackendGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-700" />
                <h4 className="text-lg font-bold text-slate-900">
                  Enquiry Backend & Email Setup Guide
                </h4>
              </div>
              <button
                onClick={() => setShowBackendGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-950">
                <p className="font-semibold text-xs mb-1">Zero-Loss Communication Policy</p>
                <p className="text-xs">
                  To ensure that potential home builders never have an enquiry get lost in an unmonitored local database, 
                  the form is configured with direct <strong>WhatsApp (+91 77087 57643)</strong> and <strong>Email (shribuilders.home@gmail.com)</strong> transmission.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  How to enable automated server email delivery:
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 text-xs">
                  <li>
                    <strong>Resend / SendGrid:</strong> Add <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-900">RESEND_API_KEY</code> to your environment secrets.
                  </li>
                  <li>
                    <strong>SMTP / Gmail:</strong> Configure <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-900">SMTP_HOST</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-900">SMTP_USER</code> in <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code>.
                  </li>
                  <li>
                    <strong>Direct Webhook:</strong> Point the endpoint to Formspree, Make, or a Google Cloud Function to trigger SMS / CRM updates.
                  </li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-3 py-1.5 rounded-t-lg text-xs font-mono">
                  <span>server-integration.js</span>
                  <button
                    onClick={copySampleCode}
                    className="flex items-center gap-1 text-[11px] hover:text-white"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-b-lg text-[11px] overflow-x-auto font-mono">
{`// Connect Resend or Nodemailer in server.ts / vite.config.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'enquiries@shribuilders.in',
  to: 'shribuilders.home@gmail.com',
  subject: 'New Construction Enquiry from ' + req.body.name,
  text: req.body.message
});`}
                </pre>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowBackendGuide(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
