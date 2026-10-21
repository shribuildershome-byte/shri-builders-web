import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Image as ImageIcon,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  fetchAllProjectsForAdmin,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteStorageFile,
} from '../../firebase/services.ts';
import {
  ProjectRecord,
  ProjectCategoryType,
  ProjectStatusType,
  ProjectImageData,
} from '../../types/project.ts';
import { COMPANY_DETAILS } from '../../data/company.ts';

interface AdminDashboardProps {
  onViewPublicSite: () => void;
  onOpenSetupGuide: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewPublicSite,
  onOpenSetupGuide,
}) => {
  const { user, logout, isConfigured } = useAuth();

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form / Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Coimbatore, Tamil Nadu');
  const [category, setCategory] = useState<ProjectCategoryType>('Residential');
  const [status, setStatus] = useState<ProjectStatusType>('Completed');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<ProjectImageData[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);

  // Preview state
  const [previewProject, setPreviewProject] = useState<ProjectRecord | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchAllProjectsForAdmin();
      setProjects(data);
    } catch (err: any) {
      console.warn('Failed to load projects:', err);
      setErrorMsg(err.message || 'Could not load projects. Verify Firebase configuration and security rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [isConfigured]);

  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setTitle('');
    setDescription('');
    setLocation('Avarampalayam, Coimbatore');
    setCategory('Residential');
    setStatus('Completed');
    setBuiltUpArea('');
    setCoverImage('');
    setImages([]);
    setIsPublished(true);
    setIsEditing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleOpenEdit = (proj: ProjectRecord) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setLocation(proj.location);
    setCategory(proj.category);
    setStatus(proj.status);
    setBuiltUpArea(proj.builtUpArea || '');
    setCoverImage(proj.coverImage);
    setImages(proj.images || []);
    setIsPublished(proj.isPublished);
    setIsEditing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setUploadProgress(null);
  };

  // Image file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const projectId = editingProjectId || `temp_${Date.now()}`;
    const fileList = Array.from(files);

    for (const file of fileList) {
      // Validate MIME type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg(`Invalid file type "${file.name}". Only JPG, PNG, and WebP are allowed.`);
        return;
      }

      // Validate size 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
        return;
      }

      setUploadingFileName(file.name);
      setUploadProgress(0);

      try {
        const { url, storagePath } = await uploadProjectImage(file, projectId, (prog) => {
          setUploadProgress(prog);
        });

        const newImageData: ProjectImageData = {
          url,
          storagePath,
          name: file.name,
          uploadedAt: new Date().toISOString(),
        };

        setImages((prev) => {
          const next = [...prev, newImageData];
          // If no cover image set yet, make this the cover image
          if (!coverImage) {
            setCoverImage(url);
          }
          return next;
        });

        setSuccessMsg(`Uploaded ${file.name} successfully to Cloud Storage.`);
      } catch (err: any) {
        setErrorMsg(`Failed to upload ${file.name}: ${err.message}`);
      } finally {
        setUploadProgress(null);
        setUploadingFileName(null);
      }
    }
  };

  // Delete photo from project and Storage
  const handleDeletePhoto = async (index: number) => {
    const target = images[index];
    if (!target) return;

    if (window.confirm('Delete this photo from project and Cloud Storage?')) {
      if (target.storagePath) {
        try {
          await deleteStorageFile(target.storagePath);
          setSuccessMsg('Photo deleted from Firebase Cloud Storage.');
        } catch (err: any) {
          console.warn('Storage deletion notice:', err);
        }
      }

      const updated = images.filter((_, idx) => idx !== index);
      setImages(updated);

      // If deleted image was the cover image, pick the first remaining or empty
      if (coverImage === target.url) {
        setCoverImage(updated.length > 0 ? updated[0].url : '');
      }
    }
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Project location is required.');
      return;
    }

    const effectiveCoverImage = coverImage || (images.length > 0 ? images[0].url : '');

    setFormSubmitting(true);
    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category,
          status,
          builtUpArea: builtUpArea.trim() || undefined,
          coverImage: effectiveCoverImage,
          images,
          isPublished,
          createdBy: user?.uid,
        });
        setSuccessMsg(`Project "${title}" updated successfully.`);
      } else {
        await createProject({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category,
          status,
          builtUpArea: builtUpArea.trim() || undefined,
          coverImage: effectiveCoverImage,
          images,
          isPublished,
          createdBy: user?.uid,
        });
        setSuccessMsg(`Project "${title}" created and saved to Firestore.`);
      }

      setIsEditing(false);
      await loadProjects();
    } catch (err: any) {
      setErrorMsg(`Failed to save project: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (proj: ProjectRecord) => {
    if (window.confirm(`Are you sure you want to delete project "${proj.title}" and its storage photos?`)) {
      try {
        await deleteProject(proj.id, proj.images);
        setSuccessMsg(`Project "${proj.title}" deleted.`);
        await loadProjects();
      } catch (err: any) {
        setErrorMsg(`Failed to delete project: ${err.message}`);
      }
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (proj: ProjectRecord) => {
    try {
      const nextState = !proj.isPublished;
      await updateProject(proj.id, { isPublished: nextState });
      setSuccessMsg(
        `Project "${proj.title}" is now ${nextState ? 'Published to Public Website' : 'Hidden as Draft'}.`
      );
      await loadProjects();
    } catch (err: any) {
      setErrorMsg(`Failed to change publish status: ${err.message}`);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = totalCount - publishedCount;
  const totalPhotosCount = projects.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 text-left">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3.5 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">
                {COMPANY_DETAILS.name}
              </span>
              <span className="text-[10px] text-blue-300 block -mt-0.5">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user?.email || 'Authorized Administrator'}</span>
            </span>

            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>View Public Website</span>
            </button>

            <button
              onClick={onOpenSetupGuide}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-900 text-blue-200 text-xs font-semibold transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Config Guide</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Messages */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block">Notice:</strong>
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
              ✕
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">{successMsg}</div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">
              ✕
            </button>
          </div>
        )}

        {/* 1. Dashboard Overview Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Total Projects
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                {totalCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Live Published
              </span>
              <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">
                {publishedCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                Unpublished Drafts
              </span>
              <span className="text-3xl font-extrabold text-amber-700 mt-1 block">
                {draftCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Project Photos
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                {totalPhotosCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* 2. Controls & Search Toolbar */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Categories</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={loadProjects}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-colors"
              title="Refresh Projects"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Project Action */}
          <button
            onClick={handleOpenAdd}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add New Construction Project</span>
          </button>
        </section>

        {/* 3. Projects List / Management Table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Project Records ({filteredProjects.length})
            </h2>
            <span className="text-xs text-slate-500">
              Synced with Cloud Firestore & Cloud Storage
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <span>Loading projects from Firestore...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No projects found</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "Add New Construction Project" above to create your first Firestore project record.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Cover & Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Photos</th>
                    <th className="px-4 py-3.5">Public State</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <img
                          src={proj.coverImage || proj.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop'}
                          alt={proj.title}
                          className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">
                            {proj.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                            {proj.builtUpArea || 'Area not specified'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-100">
                          {proj.category}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 truncate max-w-[140px]">
                        {proj.location}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="flex items-center gap-1 font-semibold">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{proj.images?.length || 0}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            proj.isPublished
                              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                              : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {proj.isPublished ? 'Published' : 'Draft / Hidden'}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewProject(proj)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100"
                            title="Preview Public View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(proj)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Project & Photos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* 4. Project Add / Edit Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingProjectId ? 'Edit Construction Project' : 'Add New Construction Project'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save persistent metadata to Firestore and photos to Firebase Cloud Storage.
                </p>
              </div>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs sm:text-sm">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sovereign Heritage 4-BHK Villa"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>

              {/* Category, Status & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategoryType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-blue-600 text-sm"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatusType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-blue-600 text-sm"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Built-up Area (Optional)
                  </label>
                  <input
                    type="text"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                    placeholder="e.g. 3,200 sq.ft"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                  />
                </div>
              </div>

              {/* Location in Tamil Nadu */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Location (Tamil Nadu) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 29/1 Sabari Arcade, Avarampalayam, Coimbatore"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Project Description & Specifications
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural features, Fe-550 TMT details, Vaastu adherence, foundation depth..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 text-sm"
                ></textarea>
              </div>

              {/* Multi-Photo Cloud Storage Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Project Photos & Cloud Storage Upload
                    </span>
                    <span className="text-xs text-slate-500">
                      Upload multiple images. Max 5 MB per file (JPG, PNG, WebP).
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Progress Bar */}
                {uploadProgress !== null && (
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between text-xs text-blue-900 mb-1">
                      <span>Uploading {uploadingFileName}...</span>
                      <span className="font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Uploaded Photos Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 group ${
                          coverImage === img.url ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Uploaded ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />

                        {/* Top action bar */}
                        <div className="absolute top-1 right-1 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(idx)}
                            className="p-1 rounded bg-red-600 text-white hover:bg-red-700 shadow-sm"
                            title="Delete photo from Storage"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Cover Image Selector */}
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.url)}
                          className={`w-full py-1 text-[10px] font-bold text-center block transition-colors ${
                            coverImage === img.url
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-black/70 text-white hover:bg-black'
                          }`}
                        >
                          {coverImage === img.url ? '★ Cover Image' : 'Set as Cover'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 italic">
                    No images uploaded yet. Click "Upload Images" to choose photos from your device.
                  </p>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    Publish Status
                  </span>
                  <span className="text-[11px] text-slate-500">
                    When enabled, this project is immediately visible to public visitors on the website.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving to Firestore...' : editingProjectId ? 'Update Project' : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Project Preview Modal (Live Public Preview) */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
            <div className="relative h-64 bg-slate-900">
              <img
                src={previewProject.coverImage || previewProject.images?.[0]?.url}
                alt={previewProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <button
                onClick={() => setPreviewProject(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase">
                    {previewProject.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase">
                    {previewProject.status}
                  </span>
                  {!previewProject.isPublished && (
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                      Draft / Unpublished
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold">{previewProject.title}</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{previewProject.location}</span>
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                  Project Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {previewProject.description || 'No description provided.'}
                </p>
              </div>

              {previewProject.builtUpArea && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-slate-400 block font-bold">Built-up Area:</span>
                  <span className="font-bold text-slate-900 text-sm">{previewProject.builtUpArea}</span>
                </div>
              )}

              {/* Gallery thumbnails */}
              {previewProject.images && previewProject.images.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                    Project Gallery Photos ({previewProject.images.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {previewProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={`Photo ${i + 1}`}
                        className="h-20 w-full object-cover rounded-lg border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {previewProject.isPublished
                    ? 'Visible on public website'
                    : 'Hidden from public visitors (Draft)'}
                </span>
                <button
                  onClick={() => setPreviewProject(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
