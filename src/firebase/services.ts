import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { db, storage, auth, isFirebaseConfigured } from './config.ts';
import { ProjectRecord, ProjectImageData } from '../types/project.ts';
import { INITIAL_PROJECT_GALLERY } from '../data/company.ts';

// Standard Firestore Error Handling Protocol
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Convert Firestore document snapshot to ProjectRecord
const docToProject = (id: string, data: Record<string, unknown>): ProjectRecord => {
  return {
    id,
    title: (data.title as string) || 'Untitled Project',
    description: (data.description as string) || '',
    location: (data.location as string) || 'Coimbatore, Tamil Nadu',
    category: (data.category as any) || 'Residential',
    status: (data.status as any) || 'Completed',
    builtUpArea: data.builtUpArea as string | undefined,
    coverImage: (data.coverImage as string) || '',
    images: Array.isArray(data.images) ? (data.images as ProjectImageData[]) : [],
    isPublished: data.isPublished === true,
    createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
    createdBy: data.createdBy as string | undefined,
  };
};

// 1. Fetch published projects for public visitors (Only published records!)
export const fetchPublishedProjects = async (): Promise<ProjectRecord[]> => {
  if (!isFirebaseConfigured() || !db) {
    // Return sample showcase mapped to ProjectRecord format when Firebase is not configured yet
    return INITIAL_PROJECT_GALLERY.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      category: p.category.includes('Commercial')
        ? 'Commercial'
        : p.category.includes('Industrial')
        ? 'Industrial'
        : 'Residential',
      status: p.status.includes('Ongoing') ? 'Ongoing' : 'Completed',
      builtUpArea: p.builtUpArea,
      coverImage: p.imageUrl,
      images: [
        { url: p.imageUrl, name: 'Cover Photo' },
        ...(p.additionalImages || []).map((url, idx) => ({ url, name: `Photo ${idx + 2}` })),
      ],
      isPublished: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    }));
  }

  const path = 'projects';
  try {
    const projectsRef = collection(db, path);
    // Explicit server-side query filter: only published projects
    const q = query(projectsRef, where('isPublished', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // If Firestore database is connected but no custom projects have been published yet,
      // return default sample projects so the public site is not blank
      return INITIAL_PROJECT_GALLERY.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        location: p.location,
        category: p.category.includes('Commercial')
          ? 'Commercial'
          : p.category.includes('Industrial')
          ? 'Industrial'
          : 'Residential',
        status: p.status.includes('Ongoing') ? 'Ongoing' : 'Completed',
        builtUpArea: p.builtUpArea,
        coverImage: p.imageUrl,
        images: [
          { url: p.imageUrl, name: 'Cover Photo' },
          ...(p.additionalImages || []).map((url, idx) => ({ url, name: `Photo ${idx + 2}` })),
        ],
        isPublished: true,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      }));
    }

    const projects: ProjectRecord[] = [];
    snapshot.forEach((docSnap) => {
      projects.push(docToProject(docSnap.id, docSnap.data()));
    });

    return projects;
  } catch (error) {
    console.warn('Could not query published projects from Firestore, falling back to showcase:', error);
    return INITIAL_PROJECT_GALLERY.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      category: p.category.includes('Commercial')
        ? 'Commercial'
        : p.category.includes('Industrial')
        ? 'Industrial'
        : 'Residential',
      status: p.status.includes('Ongoing') ? 'Ongoing' : 'Completed',
      builtUpArea: p.builtUpArea,
      coverImage: p.imageUrl,
      images: [{ url: p.imageUrl, name: 'Cover Photo' }],
      isPublished: true,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    }));
  }
};

// 2. Fetch all projects (including drafts/unpublished) for authorized admin only
export const fetchAllProjectsForAdmin = async (): Promise<ProjectRecord[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not yet configured. Please connect your Firebase project in the Setup Guide.');
  }

  const path = 'projects';
  try {
    const projectsRef = collection(db, path);
    const snapshot = await getDocs(projectsRef);

    const projects: ProjectRecord[] = [];
    snapshot.forEach((docSnap) => {
      projects.push(docToProject(docSnap.id, docSnap.data()));
    });

    // Sort by updatedAt descending
    return projects.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

// 3. Create a project document
export const createProject = async (
  projectData: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  if (!db) throw new Error('Firestore Database is not initialized');

  const path = 'projects';
  const now = new Date().toISOString();
  const payload = {
    ...projectData,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

// 4. Update an existing project
export const updateProject = async (
  id: string,
  projectData: Partial<ProjectRecord>
): Promise<void> => {
  if (!db) throw new Error('Firestore Database is not initialized');

  const path = `projects/${id}`;
  const docRef = doc(db, 'projects', id);
  const payload = {
    ...projectData,
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// 5. Delete a project document and its stored photos from Storage
export const deleteProject = async (
  id: string,
  images?: ProjectImageData[]
): Promise<void> => {
  if (!db) throw new Error('Firestore Database is not initialized');

  const path = `projects/${id}`;
  try {
    // Delete Firestore document
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }

  // Delete all associated photos from Cloud Storage
  if (images && images.length > 0 && storage) {
    for (const img of images) {
      if (img.storagePath) {
        try {
          const fileRef = ref(storage, img.storagePath);
          await deleteObject(fileRef);
        } catch (err) {
          console.warn('Could not delete storage image:', img.storagePath, err);
        }
      }
    }
  }
};

// 6. Upload an image to Cloud Storage with progress callback, format and 5MB limit validation
export const uploadProjectImage = async (
  file: File,
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; storagePath: string }> => {
  if (!storage) throw new Error('Cloud Storage is not initialized. Please verify Firebase Storage configuration.');

  // Validate format: JPEG, PNG, WebP only
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Invalid image format: ${file.type}. Allowed formats are JPEG, PNG, and WebP.`);
  }

  // Validate file size: 5 MB limit
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `projects/${projectId}/${Date.now()}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Cloud Storage upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadURL, storagePath });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

// 7. Delete a single file from Cloud Storage
export const deleteStorageFile = async (storagePath: string): Promise<void> => {
  if (!storage) throw new Error('Cloud Storage is not initialized');
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
};

// 8. Verify if current signed-in user is explicitly authorized by UID
export const verifyAdminAuthorization = async (
  user: User | null
): Promise<{ isAuthorized: boolean; reason?: string }> => {
  if (!user) return { isAuthorized: false, reason: 'Not signed in' };

  // Check 1: Explicit configured Admin UID (from environment or browser settings)
  const explicitAdminUid = (
    import.meta.env.VITE_AUTHORIZED_ADMIN_UID ||
    localStorage.getItem('shri_builders_admin_uid') ||
    ''
  ).trim();

  if (explicitAdminUid && user.uid === explicitAdminUid) {
    return { isAuthorized: true };
  }

  // Check 2: Check Firestore /admins/{uid} collection
  if (db) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (data.role === 'admin' || data.role === 'superadmin' || data.isAdmin === true || data.email) {
          return { isAuthorized: true };
        }
      }
    } catch (err: any) {
      console.warn('Firestore admins collection check notice:', err.message);
    }
  }

  // Check 3: Check VITE_ADMIN_UID_ALLOWLIST if provided
  const envAdminUids = (import.meta.env.VITE_ADMIN_UID_ALLOWLIST || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (envAdminUids.includes(user.uid)) {
    return { isAuthorized: true };
  }

  return {
    isAuthorized: false,
    reason: `Access Denied: Your account UID (${user.uid}) is not on the authorized Administrator allowlist. Add this UID to your Firestore "admins" collection or configure your Authorized Admin UID.`,
  };
};

// 9. Admin Sign In
export const adminSignIn = async (email: string, pass: string): Promise<User> => {
  if (!auth) throw new Error('Firebase Authentication is not initialized');
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

// 10. Admin Sign Out
export const adminSignOut = async (): Promise<void> => {
  if (!auth) return;
  await signOut(auth);
};

// 11. Send Password Reset Email
export const sendAdminPasswordReset = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase Authentication is not initialized');
  await sendPasswordResetEmail(auth, email);
};
