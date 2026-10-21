import React, {useState, useEffect} from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Info,
  Upload,
  Code2,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import {
  INITIAL_PROJECT_GALLERY,
  ProjectGalleryItem,
  ProjectCategory,
  ProjectStatus,
  COMPANY_DETAILS,
} from '../data/company.ts';
import { fetchPublishedProjects } from '../firebase/services.ts';

interface GallerySectionProps {
  onEnquire: (projectTitle?: string) => void;
  onOpenAdmin?: () => void;
}

const LOCAL_STORAGE_KEY = 'shri_builders_custom_projects_v1';

export const GallerySection: React.FC<GallerySectionProps> = ({onEnquire}) => {
  // Selected category filter
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Unified projects list (pre-populated + custom added from localStorage)
  const [projects, setProjects] = useState<ProjectGalleryItem[]>(INITIAL_PROJECT_GALLERY);

  // Lightbox state
  const [lightboxProject, setLightboxProject] = useState<ProjectGalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Admin / Photo Management Modal
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerTab, setManagerTab] = useState<'add' | 'guide' | 'manage'>('add');

  // Form fields for adding new project photos
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Coimbatore, Tamil Nadu');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Residential Buildings');
  const [newStatus, setNewStatus] = useState<ProjectStatus>('Completed Projects');
  const [newBuiltUpArea, setNewBuiltUpArea] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAdditionalImages, setNewAdditionalImages] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Load published projects dynamically from Cloud Firestore or fallback
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const publishedRecords = await fetchPublishedProjects();
        if (publishedRecords && publishedRecords.length > 0 && isMounted) {
          const mapped: ProjectGalleryItem[] = publishedRecords.map((p) => ({
            id: p.id,
            title: p.title,
            category: (p.category.includes('Commercial')
              ? 'Commercial Buildings'
              : p.category.includes('Industrial')
              ? 'Industrial Buildings'
              : 'Residential Buildings') as ProjectCategory,
            status: (p.status.includes('Ongoing')
              ? 'Ongoing Projects'
              : 'Completed Projects') as ProjectStatus,
            location: p.location,
            description: p.description,
            builtUpArea: p.builtUpArea,
            imageUrl: p.coverImage || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
            additionalImages: (p.images || []).map((img) => img.url).filter((u) => u !== p.coverImage),
            isRealProject: true,
          }));

          setProjects(mapped);
          return;
        }
      } catch (err) {
        console.warn('Firestore load notice:', err);
      }

      // Fallback to local storage if present
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored && isMounted) {
          const customItems: ProjectGalleryItem[] = JSON.parse(stored);
          if (Array.isArray(customItems) && customItems.length > 0) {
            const existingIds = new Set(customItems.map((c) => c.id));
            const filteredInitial = INITIAL_PROJECT_GALLERY.filter((p) => !existingIds.has(p.id));
            setProjects([...customItems, ...filteredInitial]);
          }
        }
      } catch {
        // Local storage fallback
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter categories requested by the user
  const categories: {id: string; label: string}[] = [
    {id: 'all', label: 'All Photos'},
    {id: 'Residential Buildings', label: 'Residential Buildings'},
    {id: 'Commercial Buildings', label: 'Commercial Buildings'},
    {id: 'Industrial Buildings', label: 'Industrial Buildings'},
    {id: 'Ongoing Projects', label: 'Ongoing Projects'},
    {id: 'Completed Projects', label: 'Completed Projects'},
  ];

  const filteredProjects = projects.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'Ongoing Projects') return item.status === 'Ongoing Projects';
    if (activeCategory === 'Completed Projects') return item.status === 'Completed Projects';
    return item.category === activeCategory;
  });

  const handleOpenLightbox = (project: ProjectGalleryItem, photoIdx = 0) => {
    setLightboxProject(project);
    setActivePhotoIndex(photoIdx);
  };

  const handleCloseLightbox = () => {
    setLightboxProject(null);
    setActivePhotoIndex(0);
  };

  const getAllPhotosForProject = (project: ProjectGalleryItem): string[] => {
    const list = [project.imageUrl];
    if (project.additionalImages && project.additionalImages.length > 0) {
      list.push(...project.additionalImages);
    }
    return list;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert selected image file to base64 Data URL for instant local preview
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newTitle.trim()) {
      setFormError('Please enter a project title.');
      return;
    }
    if (!newLocation.trim()) {
      setFormError('Please enter the project location in Tamil Nadu.');
      return;
    }
    if (!newImageUrl.trim()) {
      setFormError('Please provide at least one photo URL or upload an image.');
      return;
    }

    const additionalArr = newAdditionalImages
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const newItem: ProjectGalleryItem = {
      id: `custom-proj-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      location: newLocation.trim(),
      description: newDescription.trim() || 'Custom project executed by SHRI BUILDERS in Tamil Nadu.',
      builtUpArea: newBuiltUpArea.trim() || undefined,
      imageUrl: newImageUrl.trim(),
      additionalImages: additionalArr,
      isRealProject: true,
      completionYear: newStatus === 'Completed Projects' ? '2025' : 'Ongoing',
    };

    const updatedProjects = [newItem, ...projects];
    setProjects(updatedProjects);

    // Save custom items to local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existingCustom: ProjectGalleryItem[] = stored ? JSON.parse(stored) : [];
      const updatedCustom = [newItem, ...existingCustom];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCustom));
    } catch {
      // Ignore
    }

    setFormSuccess('Project photo added successfully! It is now visible in the gallery preview.');
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewAdditionalImages('');
    setNewBuiltUpArea('');
  };

  const handleDeleteCustomProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const existingCustom: ProjectGalleryItem[] = JSON.parse(stored);
        const filteredCustom = existingCustom.filter((c) => c.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredCustom));
      }
    } catch {
      // Ignore
    }
  };

  const generateCodeSnippet = () => {
    return `// Paste this updated array into src/data/company.ts inside INITIAL_PROJECT_GALLERY:
export const INITIAL_PROJECT_GALLERY: ProjectGalleryItem[] = ${JSON.stringify(projects, null, 2)};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold tracking-wide uppercase mb-3">
            Portfolio & Visual Archive
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Project <span className="text-blue-700">Photo Gallery</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore construction milestones, architectural elevations, and completed works across Coimbatore and Tamil Nadu. 
            Filtered by category and project progress.
          </p>
        </div>

        {/* Category Filter Tabs & Photo Manager Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* 5 Categories Requested by User */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Add & Manage Photos Button */}
          <button
            onClick={() => setIsManagerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add / Manage Project Photos</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => {
            const allPhotos = getAllPhotosForProject(project);
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Photo Display Frame */}
                  <div className="relative h-64 overflow-hidden bg-slate-900 cursor-pointer">
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} - ${project.location}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onClick={() => handleOpenLightbox(project, 0)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-blue-900/90 text-white shadow-sm">
                        {project.category}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          project.status === 'Completed Projects'
                            ? 'bg-emerald-700/90 text-white'
                            : 'bg-amber-600/90 text-white'
                        }`}
                      >
                        {project.status === 'Completed Projects' ? 'Completed' : 'Ongoing'}
                      </span>
                    </div>

                    {/* Multiple Photos Badge & Zoom Icon */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      {allPhotos.length > 1 && (
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-blue-300" />
                          <span>{allPhotos.length} Photos</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenLightbox(project, 0)}
                        className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors"
                        title="View Fullscreen"
                        aria-label="View Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium max-w-[65%] truncate pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>

                  {/* Thumbnail Row if project has multiple photos */}
                  {allPhotos.length > 1 && (
                    <div className="p-3 bg-slate-100 flex items-center gap-2 overflow-x-auto border-b border-slate-200">
                      {allPhotos.map((photo, pIdx) => (
                        <img
                          key={pIdx}
                          src={photo}
                          alt={`${project.title} preview ${pIdx + 1}`}
                          onClick={() => handleOpenLightbox(project, pIdx)}
                          className="w-14 h-10 object-cover rounded border border-slate-300 cursor-pointer hover:border-blue-600 transition-colors shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="p-6">
                    <h3
                      onClick={() => handleOpenLightbox(project, 0)}
                      className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Specs & Authenticity Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                      {project.builtUpArea ? (
                        <span className="font-semibold text-slate-700">
                          Built-up: <strong className="text-slate-900">{project.builtUpArea}</strong>
                        </span>
                      ) : (
                        <span className="text-slate-500">Tamil Nadu Region</span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Real Project Entry</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenLightbox(project, 0)}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span>View Photos & Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEnquire(project.title)}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next photo buttons */}
          {getAllPhotosForProject(lightboxProject).length > 1 && (
            <>
              <button
                onClick={() => {
                  const photos = getAllPhotosForProject(lightboxProject);
                  setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => {
                  const photos = getAllPhotosForProject(lightboxProject);
                  setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl w-full max-h-[92vh] flex flex-col items-center overflow-y-auto">
            {/* Active Image */}
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-[65vh] shadow-2xl flex items-center justify-center w-full">
              <img
                src={getAllPhotosForProject(lightboxProject)[activePhotoIndex]}
                alt={lightboxProject.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Thumbnails row */}
            {getAllPhotosForProject(lightboxProject).length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto p-1 max-w-full">
                {getAllPhotosForProject(lightboxProject).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-14 h-10 object-cover rounded cursor-pointer border-2 transition-all ${
                      activePhotoIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Description & Specs Details */}
            <div className="mt-4 text-center text-white max-w-2xl text-left bg-slate-900/90 p-5 rounded-xl border border-slate-800 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {lightboxProject.category} • {lightboxProject.status}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lightboxProject.location}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{lightboxProject.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {lightboxProject.description}
              </p>

              {lightboxProject.builtUpArea && (
                <div className="mb-4 text-xs text-slate-400">
                  Built-up Area: <strong className="text-white">{lightboxProject.builtUpArea}</strong>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Need a similar build in Coimbatore or Tamil Nadu?
                </span>
                <button
                  onClick={() => {
                    handleCloseLightbox();
                    onEnquire(lightboxProject.title);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>Enquire For This Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Management & Photo Upload Guide Modal */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  SHRI BUILDERS Project Photo Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add genuine project photos, preview them instantly, and update your site records.
                </p>
              </div>
              <button
                onClick={() => setIsManagerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
                aria-label="Close manager"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-2">
              <button
                onClick={() => setManagerTab('add')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  managerTab === 'add'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Add New Project Photo
              </button>

              <button
                onClick={() => setManagerTab('guide')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  managerTab === 'guide'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Permanent Code & Publish Guide
              </button>

              <button
                onClick={() => setManagerTab('manage')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  managerTab === 'manage'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Manage Saved ({projects.length})
              </button>
            </div>

            {/* TAB 1: ADD PROJECT PHOTO */}
            {managerTab === 'add' && (
              <form onSubmit={handleAddProject} className="space-y-4 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                  <strong>Notice on Photo Storage:</strong> To prevent misleading fake upload claims, 
                  photos added here are saved directly in your browser's persistent storage for instant live preview. 
                  To make your photos permanently visible to every website visitor on the internet, follow the simple 2-step guide in Tab 2.
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {formSuccess}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Contemporary Duplex Residence in Avarampalayam"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Project Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="Residential Buildings">Residential Buildings</option>
                      <option value="Commercial Buildings">Commercial Buildings</option>
                      <option value="Industrial Buildings">Industrial Buildings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Project Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="Ongoing Projects">Ongoing Projects</option>
                      <option value="Completed Projects">Completed Projects</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Location in Tamil Nadu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Avarampalayam, Coimbatore"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Built-up Area (Optional)
                    </label>
                    <input
                      type="text"
                      value={newBuiltUpArea}
                      onChange={(e) => setNewBuiltUpArea(e.target.value)}
                      placeholder="e.g. 2,800 sq.ft"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Primary Photo URL or Image Selection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL (https://... or /projects/my-house.jpg)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 mb-2"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">OR choose local file to preview:</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Photo from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Additional Photos (Optional - One URL per line)
                  </label>
                  <textarea
                    rows={2}
                    value={newAdditionalImages}
                    onChange={(e) => setNewAdditionalImages(e.target.value)}
                    placeholder="https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Specifications, RCC details, finishing materials, client requirements..."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsManagerOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Add Project Photo to Gallery
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: PERMANENT CODE & PUBLISH GUIDE */}
            {managerTab === 'guide' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">
                    How To Permanently Update Project Photos
                  </h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Follow these simple steps to ensure all your site photos are bundled directly with the website code and permanently accessible to the public:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-800">
                    <li>
                      <strong>Save Your Image Files:</strong> Save your site photos in your project's <code className="bg-white px-1.5 py-0.5 rounded font-mono text-blue-800 border border-slate-200">/public/projects/</code> directory (e.g. <code className="font-mono">/public/projects/villa-avarampalayam.jpg</code>), OR upload them to an image hosting service (such as Imgur, Cloudinary, or Google Drive direct link).
                    </li>
                    <li>
                      <strong>Update <code className="bg-white px-1.5 py-0.5 rounded font-mono text-blue-800 border border-slate-200">src/data/company.ts</code>:</strong> Copy the generated TypeScript code snippet below and paste it directly into <code className="font-mono">INITIAL_PROJECT_GALLERY</code> in <code className="font-mono">src/data/company.ts</code>.
                    </li>
                    <li>
                      <strong>Publish:</strong> Commit your changes or build the project. The changes will immediately go live on your domain.
                    </li>
                  </ol>
                </div>

                <div>
                  <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-3 py-2 rounded-t-lg font-mono text-xs">
                    <span>Generated Code for company.ts</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-[11px] hover:text-white font-sans font-semibold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-200 p-3 rounded-b-lg text-[11px] overflow-x-auto font-mono max-h-56">
                    {generateCodeSnippet()}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: MANAGE SAVED */}
            {managerTab === 'manage' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Current projects currently active in the gallery view:
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-12 h-10 object-cover rounded border border-slate-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{proj.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {proj.category} • {proj.status} • {proj.location}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCustomProject(proj.id)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 shrink-0"
                        title="Remove project"
                        aria-label="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
