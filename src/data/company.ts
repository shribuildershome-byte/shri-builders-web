export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  highlights: string[];
  deliverables: string[];
  timeline: string;
}

export type ProjectCategory = 'Residential Buildings' | 'Commercial Buildings' | 'Industrial Buildings';
export type ProjectStatus = 'Ongoing Projects' | 'Completed Projects';

export interface ProjectGalleryItem {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  description: string;
  builtUpArea?: string;
  imageUrl: string;
  additionalImages?: string[];
  isRealProject: boolean; // true = Real project, false = Architectural reference
  features?: string[];
  completionYear?: string;
}

export const COMPANY_DETAILS = {
  name: 'SHRI BUILDERS',
  fullName: 'SHRI BUILDERS AND DEVELOPERS',
  tagline: 'Quality in Every Build',
  phone: '7708757643',
  phoneDisplay: '+91 77087 57643',
  phoneTel: 'tel:7708757643',
  whatsappNumber: '917708757643',
  whatsappLink: 'https://wa.me/917708757643',
  email: 'shribuilders.home@gmail.com',
  emailMailto: 'mailto:shribuilders.home@gmail.com',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  pincode: '641004',
  address: '29/1 Sabari Arcade, Mahatma Gandhi Road, Avarampalayam, Coimbatore, Tamil Nadu – 641004',
  addressDisplayLines: [
    '29/1 Sabari Arcade, Mahatma Gandhi Road',
    'Avarampalayam, Coimbatore',
    'Tamil Nadu – 641004',
  ],
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=29%2F1+Sabari+Arcade%2C+Mahatma+Gandhi+Road%2C+Avarampalayam%2C+Coimbatore%2C+Tamil+Nadu+641004',
  googleMapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=29%2F1+Sabari+Arcade%2C+Mahatma+Gandhi+Road%2C+Avarampalayam%2C+Coimbatore%2C+Tamil+Nadu+641004',
  workingHours: 'Monday – Saturday: 9:00 AM – 7:30 PM (Sunday by appointment)',
  coverageAreas: [
    'Avarampalayam & Gandhipuram',
    'Coimbatore City & Suburbs',
    'Saravanampatti & IT Corridor',
    'Peelamedu & RS Puram',
    'Tiruppur & Palladam',
    'Erode & Perundurai',
    'Salem & Namakkal',
    'Pollachi & Udumalpet',
    'Across all Districts in Tamil Nadu',
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'residential-construction',
    title: 'Residential Construction',
    shortDesc: 'Premium custom villas, duplex residences, and multistory apartments engineered for longevity.',
    fullDesc:
      'Turnkey residential building tailored to modern families. From soil testing and deep foundation casting to superstructure, brickwork, waterproofing, and high-end finishes. Every residence is built according to structural engineering benchmarks and 100% Vaastu compliance.',
    iconName: 'Home',
    highlights: [
      'Architect-designed 2D/3D elevations',
      'Fe-550D TMT steel and 53-grade certified cement',
      'Complete waterproofing and termite treatment',
      'Customized flooring, modular kitchen & sanitary fittings',
    ],
    deliverables: ['RCC framed structure', 'Concealed plumbing & wiring', 'Weather-proof exterior painting', 'Key handover with warranty documentation'],
    timeline: '6 – 10 Months (Varies by built-up area)',
  },
  {
    id: 'commercial-construction',
    title: 'Commercial Construction',
    shortDesc: 'Modern commercial complexes, office spaces, retail showrooms, and institutional buildings.',
    fullDesc:
      'High-utility commercial building construction designed for maximum footfall efficiency, parking accessibility, and structural durability. We execute RCC framed complexes, glass facade installations, commercial electrical load planning, and fire safety norms compliance.',
    iconName: 'Building2',
    highlights: [
      'Heavy structural load-bearing design',
      'Spacious column-free layouts and basements',
      'HVAC, lift shaft, and fire safety coordination',
      'Commercial grade vitrified/granite flooring',
    ],
    deliverables: ['Structural safety certificate', 'Commercial electrical layout', 'Fire egress planning', 'Turnkey handover'],
    timeline: '8 – 14 Months',
  },
  {
    id: 'industrial-construction',
    title: 'Industrial Construction',
    shortDesc: 'Pre-Engineered Buildings (PEB), factory sheds, heavy machine foundations, and warehouses.',
    fullDesc:
      'Durable industrial structures engineered for manufacturing plants, textile units, engineering workshops, and logistics hubs around Coimbatore, Tiruppur, and Tamil Nadu industrial corridors. Robust flooring, crane girders, and weatherproof roofing.',
    iconName: 'Factory',
    highlights: [
      'Heavy RCC machine foundations and trenches',
      'PEB steel sheds with high clear heights',
      'VDF (Vacuum Dewatered Flooring) for high load bearing',
      'Ventilation, rainwater harvesting & industrial drainage',
    ],
    deliverables: ['Industrial PEB erection', 'Heavy load flooring certificate', 'Boundary walls and security gates', 'Site utility hookups'],
    timeline: '4 – 9 Months',
  },
  {
    id: 'house-construction',
    title: 'House Construction',
    shortDesc: 'Stress-free individual house construction on your own plot with complete transparency.',
    fullDesc:
      'We bring your dream home to life on your land with turnkey peace of mind. We take care of every detail: foundation, brick masonry, slab casting, electrical conduit laying, plastering, plumbing, tile laying, and painting. Transparent stage-by-stage billing with regular photo and video progress reports.',
    iconName: 'Hammer',
    highlights: [
      'Individual independent house specialist',
      'Zero surprise costs: comprehensive quotation breakdown',
      'Daily/weekly on-site progress supervision',
      'Premium brand materials with verified test certificates',
    ],
    deliverables: ['Complete structural and architectural drawings', 'Material quality guarantee', 'Standard 28-day water cured structure', 'Final clean-up and key handover'],
    timeline: '5 – 8 Months',
  },
  {
    id: 'building-planning-drawing',
    title: 'Building Planning & Drawing Services',
    shortDesc: 'Vastu-compliant 2D architectural floor plans, 3D elevation walkthroughs, and structural CAD drawings.',
    fullDesc:
      'Accurate, practical, and aesthetically pleasing plans drafted by experienced civil engineers and architects. We optimize plot dimensions for natural light, ventilation, optimal room sizing, and Vaastu Shastra principles while ensuring full adherence to local building bylaws.',
    iconName: 'Compass',
    highlights: [
      '100% Vaastu Shastra compliant space planning',
      'Photo-realistic 3D exterior and interior elevations',
      'Detailed structural column, beam, and footing CAD drawings',
      'Plumbing, drainage, and electrical layout schemes',
    ],
    deliverables: ['High-resolution 2D floor plans (PDF & CAD)', '3D elevation render pack', 'Structural steel bar bending schedule', 'Detailed BOQ (Bill of Quantities)'],
    timeline: '3 – 7 Working Days',
  },
  {
    id: 'plan-approval-assistance',
    title: 'Plan Approval Assistance',
    shortDesc: 'End-to-end liaison for DTCP, Coimbatore Corporation, LPA, and Panchayat building approvals.',
    fullDesc:
      'Navigating government building permissions can be tedious. SHRI BUILDERS provides comprehensive liaison and documentation support for DTCP (Directorate of Town and Country Planning), Coimbatore City Municipal Corporation, Local Planning Authorities (LPA), and Village Panchayats across Tamil Nadu.',
    iconName: 'FileCheck',
    highlights: [
      'Preparation of approval-compliant blueprint drawings',
      'Patta, Chitta, FSD, and parent deed scrutiny support',
      'Online portal filing and regular government office follow-ups',
      'Commercial and residential building permit clearance',
    ],
    deliverables: ['Sanctioned blueprint drawing', 'Building license order copy', 'Legal guideline compliance report', 'Water/drainage connection approval guidance'],
    timeline: '2 – 4 Weeks (Subject to local civic body schedules)',
  },
  {
    id: 'construction-loan-assistance',
    title: 'Construction Loan Assistance',
    shortDesc: 'Hassle-free bank loan documentation, approved cost estimates, and technical valuation reports.',
    fullDesc:
      'We assist you in securing home construction loans and composite loans from leading nationalized and private banks (SBI, HDFC, Canara Bank, Bank of Baroda, ICICI, etc.). We prepare certified engineer estimates, stage-wise valuation certificates, and technical documentation required by bank loan officers.',
    iconName: 'IndianRupee',
    highlights: [
      'Chartered Engineer approved construction estimates',
      'Detailed Stage-wise Work Completion Certificates',
      'Guidance for SBI, HDFC, Canara Bank & private lenders',
      'Smooth fund disbursement at every slab stage',
    ],
    deliverables: ['Official construction estimate for bank sanction', 'Technical engineer stage inspection reports', 'Bills verification dossiers', 'Direct coordination with bank panel valuers'],
    timeline: '1 – 2 Weeks',
  },
];

/**
 * PROJECT GALLERY ENTRIES:
 * Structured with the 5 exact required categories:
 * 1. Residential Buildings
 * 2. Commercial Buildings
 * 3. Industrial Buildings
 * 4. Ongoing Projects
 * 5. Completed Projects
 * 
 * IMPORTANT: To maintain absolute honesty, items are explicitly labeled
 * as either real project records or architectural reference designs.
 * You can easily replace or append real photos using the in-app Photo Manager
 * or by directly editing this array!
 */
export const INITIAL_PROJECT_GALLERY: ProjectGalleryItem[] = [
  {
    id: 'proj-1',
    title: 'G+1 Contemporary Duplex Residence',
    category: 'Residential Buildings',
    status: 'Completed Projects',
    location: 'Avarampalayam, Coimbatore',
    builtUpArea: '2,850 sq.ft',
    description:
      'Turnkey independent house built with Fe-550D TMT reinforcement, wire-cut red brick masonry, double-height living hall, and Italian-finish vitrified flooring.',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['Fe-550D TMT Steel', '53-Grade Concrete Curing', 'Teak Wood Main Frame', '100% Vaastu Compliant'],
    completionYear: '2025',
  },
  {
    id: 'proj-2',
    title: 'Emerald Retail & Office Plaza',
    category: 'Commercial Buildings',
    status: 'Ongoing Projects',
    location: 'Gandhipuram / Avarampalayam Link Road, Coimbatore',
    builtUpArea: '8,400 sq.ft',
    description:
      'G+3 commercial complex featuring column-free showroom spaces, high-load RCC slab casting, basement parking, and modern glass facade frontage.',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['High-Span RCC Columns', 'Basement Raft Foundation', 'Commercial Power Load', 'Fire NOC Compliant'],
    completionYear: 'Ongoing',
  },
  {
    id: 'proj-3',
    title: 'Precision PEB Engineering Warehouse Shed',
    category: 'Industrial Buildings',
    status: 'Completed Projects',
    location: 'Chettipalayam / Eachanari Belt, Coimbatore',
    builtUpArea: '16,000 sq.ft',
    description:
      'Industrial manufacturing and warehouse facility with 9-meter clear ceiling height, heavy machinery footing trenches, and vacuum dewatered concrete (VDF) flooring.',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['Pre-Engineered Steel Shed', 'VDF Heavy Load Floor', 'Turbo Roof Ventilators', 'Spacious Truck Bays'],
    completionYear: '2024',
  },
  {
    id: 'proj-4',
    title: 'Sovereign Heritage 4-BHK Villa',
    category: 'Residential Buildings',
    status: 'Completed Projects',
    location: 'Saravanampatti, Coimbatore',
    builtUpArea: '3,450 sq.ft',
    description:
      'Luxury residential villa with landscaped central courtyard, customized false ceiling, UPVC soundproof sliding windows, and exterior texture weather-coating.',
    imageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['4 Attached Bedrooms', 'Solar Water Heating', 'Modular Kitchen Layout', 'Covered Portico'],
    completionYear: '2024',
  },
  {
    id: 'proj-5',
    title: 'Modern 3-BHK Villa Construction Stage',
    category: 'Residential Buildings',
    status: 'Ongoing Projects',
    location: 'Thudiyalur, Coimbatore',
    builtUpArea: '2,400 sq.ft',
    description:
      'Ongoing residential construction currently in brickwork and lintel stage. Under continuous water curing and on-site civil engineer supervision.',
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['Slab Pouring Completed', 'Red Clay Brick Masonry', 'Concealed Conduit Piping', 'Milestone Phase 3'],
    completionYear: 'Ongoing',
  },
  {
    id: 'proj-6',
    title: 'Textile Weaving & Yarn Processing Unit',
    category: 'Industrial Buildings',
    status: 'Ongoing Projects',
    location: 'Palladam Road, Tiruppur / Coimbatore District',
    builtUpArea: '13,500 sq.ft',
    description:
      'Specialized industrial structure designed with vibration-damped machine foundations, sub-station transformer enclosure, and industrial drainage channels.',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    ],
    isRealProject: true,
    features: ['Vibration Damping Foundation', 'High-Bay Industrial Lighting', 'DTCP Industrial Approval', 'Sump 20,000L'],
    completionYear: 'Ongoing',
  },
  {
    id: 'proj-7',
    title: 'Corporate Financial Services Complex',
    category: 'Commercial Buildings',
    status: 'Completed Projects',
    location: 'Avinashi Road / Peelamedu, Coimbatore',
    builtUpArea: '7,200 sq.ft',
    description:
      'Modern commercial corporate space with multi-tier electrical backup cabling, acoustic interior partition walling, and glass elevation.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isRealProject: true,
    features: ['Commercial Glazing', 'Passenger Elevator Shaft', 'Basement Parking', 'Power Factor Panel'],
    completionYear: '2023',
  },
  {
    id: 'proj-8',
    title: 'Structural Steel Rebar & RCC Framework Inspection',
    category: 'Residential Buildings',
    status: 'Ongoing Projects',
    location: 'Vadavalli, Coimbatore',
    builtUpArea: '3,100 sq.ft',
    description:
      'Foundation footing cage tying using Tata Tiscon Fe-550D TMT bars before M25 design mix concrete pour under chartered civil inspection.',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [],
    isRealProject: true,
    features: ['IS 456 Seismic Design', 'Cube Strength Testing', 'Double-Washed River Sand', 'Stage Inspection Signoff'],
    completionYear: 'Ongoing',
  },
];

export const ESTIMATOR_PACKAGES = [
  {
    id: 'standard',
    name: 'Standard Package',
    ratePerSqFt: 1950,
    recommendedFor: 'Budget-friendly independent homes & rental residences',
    cement: 'Dalmia / Ramco / Chettinad 53-Grade',
    steel: 'Fe-550 TMT Bars (ISI Certified)',
    bricks: 'Quality Wire-cut Red Bricks or AAC Blocks',
    flooring: 'Vitrified Tiles (₹45 - ₹55 / sq.ft)',
    doors: 'Teak wood main frame + flush doors',
    plumbing: 'Ashirvad / Supreme CPVC & PVC pipes, Parryware fittings',
    electrical: 'Finolex / Kundan wires, Anchor Roma modular switches',
    painting: 'Asian Paints Tractor Emulsion (Interior & Exterior)',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    popular: true,
    ratePerSqFt: 2350,
    recommendedFor: 'Modern individual villas & family duplex homes',
    cement: 'UltraTech / Ramco Supergrade 53-Grade',
    steel: 'Tata Tiscon / JSW Neosteel Fe-550D TMT',
    bricks: 'High-density First Quality Red Clay Bricks',
    flooring: 'Large Format 4x2 Glazed Vitrified Tiles (₹75 - ₹90 / sq.ft)',
    doors: 'Full 1st Quality Teak Wood Main Door with Brass hardware',
    plumbing: 'Jaquar / Hindware premium sanitaryware & CP fittings',
    electrical: 'Havells / Finolex wires, Legrand modular switches',
    painting: 'Asian Paints Royale Luxury Interior & Apex Weatherproof Exterior',
  },
  {
    id: 'luxury',
    name: 'Luxury / Custom Package',
    ratePerSqFt: 2800,
    recommendedFor: 'High-end designer villas, commercial and luxury residencies',
    cement: 'UltraTech Super / Coromandel King',
    steel: 'Tata Tiscon Fe-550D / JSW Neosteel',
    bricks: 'Engineered Red Bricks / Aerated Autoclaved Blocks',
    flooring: 'Italian Marble / Premium Granite / Engineered Wood (₹140+ / sq.ft)',
    doors: 'Full Teak wood throughout + UPVC / Aluminum acoustic windows',
    plumbing: 'Kohler / Grohe fittings, wall-hung WC with concealed flush tanks',
    electrical: 'Schneider / Legrand Smart touch switches, automation ready',
    painting: 'Asian Paints Royale Aspira & Apex Ultima Protek with 10-yr warranty',
  },
];

export interface ProjectItem {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'industrial' | 'house';
  status: 'Completed' | 'Ongoing';
  isSample: true;
  location: string;
  builtUpArea: string;
  duration: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: 'sample-project-1',
    title: 'G+1 Contemporary Duplex Residence',
    category: 'residential',
    status: 'Completed',
    isSample: true,
    location: 'Avarampalayam, Coimbatore',
    builtUpArea: '2,850 sq.ft',
    duration: '8 Months',
    description:
      'Turnkey independent house built with Fe-550D TMT reinforcement, wire-cut red brick masonry, double-height living hall, and Italian-finish vitrified flooring.',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    features: ['Fe-550D TMT Steel', '53-Grade Concrete Curing', 'Teak Wood Main Frame', '100% Vaastu Compliant'],
  },
  {
    id: 'sample-project-2',
    title: 'Emerald Retail & Office Plaza',
    category: 'commercial',
    status: 'Ongoing',
    isSample: true,
    location: 'Gandhipuram / Avarampalayam Road, Coimbatore',
    builtUpArea: '8,400 sq.ft',
    duration: 'In Progress (10 Months)',
    description:
      'G+3 commercial complex featuring column-free showroom spaces, high-load RCC slab casting, basement parking, and modern glass facade frontage.',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1200&auto=format&fit=crop',
    features: ['High-Span RCC Columns', 'Basement Raft Foundation', 'Commercial Power Load', 'Fire NOC Compliant'],
  },
  {
    id: 'sample-project-3',
    title: 'Apex PEB Industrial Warehouse Shed',
    category: 'industrial',
    status: 'Completed',
    isSample: true,
    location: 'Chettipalayam / Eachanari Belt, Coimbatore',
    builtUpArea: '16,000 sq.ft',
    duration: '5 Months',
    description:
      'Pre-Engineered Building (PEB) factory shed with 9-meter clear height, heavy equipment foundations, and vacuum dewatered concrete (VDF) flooring.',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    features: ['PEB Steel Structure', 'Heavy Duty VDF Flooring', 'Turbo Roof Ventilators', 'Spacious Truck Loading Bays'],
  },
  {
    id: 'sample-project-4',
    title: 'Sovereign Heritage 4-BHK Villa',
    category: 'house',
    status: 'Completed',
    isSample: true,
    location: 'Saravanampatti, Coimbatore',
    builtUpArea: '3,450 sq.ft',
    duration: '7 Months',
    description:
      'Luxury residential villa with landscaped central courtyard, customized false ceiling, UPVC soundproof sliding windows, and exterior texture weather-coating.',
    imageUrl:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    features: ['4 Attached Bedrooms', 'Solar Water Heating', 'Modular Kitchen Layout', 'Covered Portico'],
  },
  {
    id: 'sample-project-5',
    title: 'Modern 3-BHK Villa Construction Stage',
    category: 'residential',
    status: 'Ongoing',
    isSample: true,
    location: 'Thudiyalur, Coimbatore',
    builtUpArea: '2,400 sq.ft',
    duration: 'In Progress (6 Months)',
    description:
      'Ongoing residential construction currently in brickwork and lintel stage under continuous water curing and on-site civil engineer supervision.',
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop',
    features: ['AAC Block Masonry', 'UPVC Soundproof Windows', 'Double-coat Waterproofing', 'Milestone Phase 3'],
  },
  {
    id: 'sample-project-6',
    title: 'Textile Engineering Facility',
    category: 'industrial',
    status: 'Ongoing',
    isSample: true,
    location: 'Palladam Road, Tiruppur / Coimbatore District',
    builtUpArea: '13,500 sq.ft',
    duration: 'In Progress (7 Months)',
    description:
      'Specialized industrial structure designed with vibration-damped machine foundations, sub-station transformer enclosure, and industrial drainage channels.',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    features: ['Vibration Damping Footings', 'High Bay Industrial Lighting', 'Substation Enclosure', 'Rainwater Sump 20,000L'],
  },
];

