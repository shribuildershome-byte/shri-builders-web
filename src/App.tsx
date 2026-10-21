import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutUs } from './components/AboutUs.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ConstructionProcess } from './components/ConstructionProcess.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { CostEstimator } from './components/CostEstimator.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileStickyBar } from './components/MobileStickyBar.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { FirebaseSetupGuide } from './components/admin/FirebaseSetupGuide.tsx';

function MainWebsite() {
  const { user, isAdmin } = useAuth();
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Sync routing on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedService(serviceTitle);
    }
    const contactElem = document.querySelector('#contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEstimator = () => {
    const estElem = document.querySelector('#estimator');
    if (estElem) {
      estElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ROUTE 1: ADMIN LOGIN PAGE (/admin/login)
  if (currentPath === '/admin/login') {
    if (isAdmin) {
      // If already signed in as authorized admin, forward to dashboard
      return (
        <>
          <AdminDashboard
            onViewPublicSite={() => navigateTo('/')}
            onOpenSetupGuide={() => setShowSetupGuide(true)}
          />
          <FirebaseSetupGuide
            isOpen={showSetupGuide}
            onClose={() => setShowSetupGuide(false)}
          />
        </>
      );
    }

    return (
      <>
        <AdminLogin
          onBackToWebsite={() => navigateTo('/')}
          onLoginSuccess={() => navigateTo('/admin')}
          onOpenSetupGuide={() => setShowSetupGuide(true)}
        />
        <FirebaseSetupGuide
          isOpen={showSetupGuide}
          onClose={() => setShowSetupGuide(false)}
        />
      </>
    );
  }

  // ROUTE 2: PROTECTED ADMIN DASHBOARD (/admin or /admin/dashboard)
  if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
    if (!isAdmin) {
      return (
        <>
          <AdminLogin
            onBackToWebsite={() => navigateTo('/')}
            onLoginSuccess={() => navigateTo('/admin')}
            onOpenSetupGuide={() => setShowSetupGuide(true)}
          />
          <FirebaseSetupGuide
            isOpen={showSetupGuide}
            onClose={() => setShowSetupGuide(false)}
          />
        </>
      );
    }

    return (
      <>
        <AdminDashboard
          onViewPublicSite={() => navigateTo('/')}
          onOpenSetupGuide={() => setShowSetupGuide(true)}
        />
        <FirebaseSetupGuide
          isOpen={showSetupGuide}
          onClose={() => setShowSetupGuide(false)}
        />
      </>
    );
  }

  // ROUTE 3: PUBLIC PRODUCTION WEBSITE (/)
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Main Navigation Header */}
      <Header
        onSelectService={(serviceId) => scrollToContact(serviceId)}
        onNavigateToAdmin={() => navigateTo('/admin/login')}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenEstimator={scrollToEstimator}
          onOpenContact={() => scrollToContact()}
        />

        {/* 2. About Us Section */}
        <AboutUs onEnquire={() => scrollToContact()} />

        {/* 3. Services Section */}
        <ServicesSection
          onSelectServiceForEnquiry={(serviceTitle) => scrollToContact(serviceTitle)}
        />

        {/* 4. Systematic Construction Process Workflow */}
        <ConstructionProcess />

        {/* 5. Projects Showcase Section */}
        <ProjectsSection
          onEnquireProject={(projectTitle) =>
            scrollToContact(`Project Inquiry: ${projectTitle}`)
          }
        />

        {/* 6. Dynamic Photo Gallery (Synced with Firestore published records) */}
        <GallerySection
          onEnquire={(projTitle) => scrollToContact(projTitle ? `Project: ${projTitle}` : undefined)}
          onOpenAdmin={() => navigateTo('/admin/login')}
        />

        {/* 7. Interactive Construction Cost Estimator */}
        <CostEstimator />

        {/* 8. Contact Section & Customer Enquiry Form */}
        <ContactSection preselectedService={selectedService} />
      </main>

      {/* Footer with Company Details, Services, and Admin Portal link */}
      <Footer
        onSelectService={(serviceTitle) => scrollToContact(serviceTitle)}
        onNavigateToAdmin={() => navigateTo('/admin/login')}
      />

      {/* Sticky Bottom Actions Bar on Mobile Devices */}
      <MobileStickyBar onEnquireClick={() => scrollToContact()} />

      {/* Firebase Setup Guide Modal */}
      <FirebaseSetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainWebsite />
    </AuthProvider>
  );
}
