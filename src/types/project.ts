export type ProjectCategoryType = 'Residential' | 'Commercial' | 'Industrial';
export type ProjectStatusType = 'Ongoing' | 'Completed';

export interface ProjectImageData {
  url: string;
  storagePath?: string;
  name?: string;
  caption?: string;
  uploadedAt?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  category: ProjectCategoryType;
  status: ProjectStatusType;
  builtUpArea?: string;
  coverImage: string;
  images: ProjectImageData[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}
