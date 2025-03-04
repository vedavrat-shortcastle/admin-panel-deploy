import {
  ChessTitle,
  ContactAcademy,
  ContactRole,
  ContactStatus,
  GenderType,
  TeachingMode,
} from '@prisma/client';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  role: ContactRole;
  email: string;
  phoneNumber?: string | null;
  academyIds?: string[] | null;
  academies?: ContactAcademy[] | null;
  website?: string | null;
  country?: string | null;
  yearOfBirth?: number | null;
  dateOfBirth: Date | null;
  gender: GenderType | null;
  languagesSpoken: string[] | null;
  currentAcademy?: string | null;
  workingMode?: TeachingMode | null;
  onlinePercentage?: number | null;
  offlinePercentage?: number | null;
  state?: string | null;
  city?: string | null;
  address: string | null;
  social?: {
    linkedin?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
  } | null;
  rating?: {
    classic?: number | null;
    rapid?: number | null;
    blitz?: number | null;
  } | null;
  fideId?: string | null;
  titles: ChessTitle[] | null;
  physicallyTaught: number[] | null;
  lastContacted?: Date | null;
  notes?: string | null;
  customTags?: string[] | null;
  yearsInOperation: number | null;
  numberOfCoaches: number | null;
  status?: ContactStatus | null;
  profilePhoto?: File | null | undefined;
}
