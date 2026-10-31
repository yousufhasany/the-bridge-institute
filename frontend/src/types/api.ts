export type Locale = 'en' | 'bn';

export interface Me {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  preferredLocale: Locale;
  roles: string[];
  permissions: string[];
  studentProfile: { id: string; studentCode: string; status: string } | null;
  alumniProfile: { id: string; slug: string; verificationStatus: string } | null;
  latestAlumniRequest: { id: string; status: string; createdAt: string } | null;
}

export interface Course {
  id: string;
  slug: string;
  icon: string;
  title: string;
  summary: string;
  description: string;
  duration: string | null;
  category: { slug: string; name: string } | null;
  topics: string[];
  outcomes: string[];
}

export interface AdminCourseTranslation {
  title: string;
  summary: string;
  description: string;
  duration: string | null;
}

export interface AdminCourse {
  id: string;
  slug: string;
  icon: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sortOrder: number;
  categoryId: string | null;
  publishedAt: string | null;
  updatedAt: string;
  translations: { en: AdminCourseTranslation | null; bn: AdminCourseTranslation | null };
  topics: { en: string; bn: string | null }[];
  outcomes: { en: string; bn: string | null }[];
}

export interface PublicAlumniProfile {
  slug: string;
  displayName: string;
  graduationYear: number | null;
  cohort: { slug: string; name: string } | null;
  course: { slug: string; title: string | null } | null;
  programName: string | null;
  professionalTitle: string | null;
  organization: string | null;
  professionalField: string | null;
  skills: string[];
  interests: string[];
  bio: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  photoUrl: string | null;
  photoAlt: string;
}

export interface PublicStory {
  slug: string;
  title: string | null;
  excerpt: string | null;
  body?: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  author: { displayName: string; slug: string } | null;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export type PublicSettings = Record<string, unknown>;
