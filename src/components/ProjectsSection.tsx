import React, {useState, useEffect} from 'react';
import {
  Building,
  MapPin,
  Maximize2,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Info,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {SAMPLE_PROJECTS, ProjectItem} from '../data/company.ts';
import {fetchPublishedProjects} from '../firebase/services.ts';
import {ProjectRecord} from '../types/project.ts';

interface ProjectsSectionProps {
  onEnquireProject: (projectTitle: string) => void;
}

interface DisplayProject {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'industrial' | 'house';
  status: 'Completed' | 'Ongoing';
  isSample: boolean;
  location: string;
  builtUpArea: string;
  duration?: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  features: string[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({onEnquireProject}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);
  const [projectsList, setProjectsList] = useState<DisplayProject[]>(() =>
    SAMPLE_PROJECTS.map((p) => ({
      ...p,
      isSample: true,
    }))
  );

  // Fetch published projects dynamically from Firestore
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const records = await fetchPublishedProjects();
        if (records && records.length > 0 && isMounted) {
          const mapped: DisplayProject[] = records.map((r) => {
            const catLower = r.category.toLowerCase();
            const cat = catLower.includes('commercial')
              ? 'commercial'
              : catLower.includes('industrial')
              ? 'industrial'
              : 'residential';

            return {
              id: r.id,
              title: r.title,
              category: cat as 'residential' | 'commercial' | 'industrial',
              status: r.status === 'Ongoing' ? 'Ongoing' : 'Completed',
              isSample: r.id.startsWith('proj-') || r.id.startsWith('sample-'),
              location: r.location,
              builtUpArea: r.builtUpArea || '2,400 sq.ft',
              duration: r.status === 'Ongoing' ? 'In Progress' : 'Completed Build',
              description: r.description,
              imageUrl: r.coverImage || r.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
              additionalImages: (r.images || []).map((img) => img.url),
              features: [
                'Fe-550D TMT Reinforcement',
                '53-Grade Concrete Curing',
                'Vaastu-Compliant Architecture',
                'Engineered Soil & Foundation Scrutiny',
              ],
            };
          });

          setProjectsList(mapped);
        }
      } catch (err) {
        console.warn('ProjectsSection fetch error, using sample showcase:', err);
      }
    };

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterButtons = [
    {id: 'all', label: 'All Projects'},
    {id: 'residential', label: 'Residential'},
    {id: 'commercial', label: 'Commercial'},
    {id: 'industrial', label: 'Industrial'},
    {id: 'completed', label: 'Completed'},
    {id: 'ongoing', label: 'Ongoing'},
  ];

  const filteredProjects = projectsList.filter((proj) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return proj.status === 'Completed';
    if (activeFilter === 'ongoing') return proj.status === 'Ongoing';
    return proj.category === activeFilter;
  });

  return (
    <section id="projects" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold tracking-wide uppercase mb-3">
            Portfolio & Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Featured <span className="text-blue-700">Projects Showcase</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A curated showcase of residential homes, modern commercial spaces, and industrial projects. Only published projects are displayed publicly.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === btn.id
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div>
                {/* Project Image Box */}
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} - ${project.location}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Sample or Real Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
                      project.isSample
                        ? 'bg-amber-500/90 text-slate-950'
                        : 'bg-blue-600/90 text-white'
                    }`}
                  >
                    {project.isSample ? 'Sample Project' : 'Published Build'}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                      project.status === 'Completed'
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-blue-600/90 text-white'
                    }`}
                  >
                    {project.status}
                  </span>

                  {/* Location Banner inside Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center text-white text-xs font-medium gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      {project.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {project.duration || project.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Specs Pill List */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs text-slate-700 mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Built-up Area</span>
                      <span className="font-semibold text-slate-900">{project.builtUpArea}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Region</span>
                      <span className="font-semibold text-slate-900 truncate block">Tamil Nadu</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-2">
                    {project.features.slice(0, 2).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <span>Specifications</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onEnquireProject(project.title)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Spec Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      selectedProject.isSample
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {selectedProject.isSample ? 'Sample Project Record' : 'Verified Build'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase">
                    {selectedProject.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedProject.location}</span>
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Project Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold block">Built-up Area</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.builtUpArea}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold block">Status</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold block">Category</span>
                  <span className="font-bold text-slate-900 text-sm capitalize">{selectedProject.category}</span>
                </div>
              </div>

              {selectedProject.additionalImages && selectedProject.additionalImages.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5">
                    Project Gallery Photos
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.additionalImages.map((imgUrl, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={imgUrl}
                        alt={`Photo ${imgIdx + 1}`}
                        className="h-24 w-full object-cover rounded-lg border border-slate-200"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5">
                  Structural & Engineering Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Ready to start a similar build in Tamil Nadu?
                </span>
                <button
                  onClick={() => {
                    const title = selectedProject.title;
                    setSelectedProject(null);
                    onEnquireProject(title);
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Enquire About Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
