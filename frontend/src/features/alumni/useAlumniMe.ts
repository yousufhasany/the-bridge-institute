import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface OwnAlumniProfile {
  id: string;
  slug: string;
  displayName: string;
  graduationYear: number | null;
  programName: string | null;
  professionalTitle: string | null;
  organization: string | null;
  professionalField: string | null;
  skills: string[];
  interests: string[];
  bioEn: string | null;
  bioBn: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  photoAssetId: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isPublic: boolean;
  publicConsentAt: string | null;
  publicationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  pendingChanges: Record<string, unknown> | null;
  archivedAt: string | null;
  cohort: { id: string; name: string } | null;
  course: { id: string; slug: string; translations: { locale: string; title: string }[] } | null;
}

export interface AlumniMe {
  profile: OwnAlumniProfile | null;
  requests: { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; createdAt: string; reviewedAt: string | null }[];
}

export const ALUMNI_ME_KEY = ['alumni', 'me'] as const;

export const useAlumniMe = () => useQuery({ queryKey: ALUMNI_ME_KEY, queryFn: () => api.get<AlumniMe>('/alumni/me') });

export const isVerifiedAlumni = (me: AlumniMe | undefined) => me?.profile?.verificationStatus === 'VERIFIED' && !me.profile.archivedAt;
