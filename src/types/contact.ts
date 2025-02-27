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
  phoneNumber?: string;
  academyIds?: string[];
  academies?: ContactAcademy[];
  website?: string;
  country?: string;
  yearOfBirth?: number;
  dateOfBirth: Date;
  gender: GenderType;
  languagesSpoken: string[];
  currentAcademy?: string;
  workingMode?: TeachingMode;
  onlinePercentage?: number;
  offlinePercentage?: number;
  state?: string;
  city?: string;
  address: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  rating?: {
    classic?: number;
    rapid?: number;
    blitz?: number;
  };
  fideId?: string;
  titles: ChessTitle[];
  physicallyTaught: number[];
  lastContacted?: Date;
  notes?: string;
  customTags?: string[];
  yearsInOperation: number;
  numberOfCoaches: number;
  status?: ContactStatus;
  profilePhoto?: File | undefined;
}
