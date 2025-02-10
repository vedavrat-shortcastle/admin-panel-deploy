import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  role: z.string().min(1, { message: 'This field is required' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().min(1, { message: 'This field is required' }),
  academyNames: z.array(z.string()),
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  country: z.string().min(1, { message: 'This field is required' }),
  yearOfBirth: z.number().min(1900).max(new Date().getFullYear()),
  dateOfBirth: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  languagesSpoken: z.array(z.string()),
  currentAcademy: z.string().min(1, { message: 'This field is required' }),
  workingMode: z.enum(['online', 'offline', 'hybrid']),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  stateRegion: z.string().min(1, { message: 'This field is required' }),
  cityLocation: z.string().min(1, { message: 'This field is required' }),
  address: z.string().min(1, { message: 'This field is required' }),
  social: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
  }),
  rating: z.object({
    classic: z.number().optional(),
    rapid: z.number().optional(),
    blitz: z.number().optional(),
  }),
  fideId: z.string().optional(),
  titles: z.array(z.string()),
  physicallyTaught: z.array(z.string()),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0),
  numberOfCoaches: z.number().min(0),
  status: z.enum(['active', 'inactive', 'pending']),
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});

export const personalInfoSchema = formSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  dateOfBirth: true,
  yearOfBirth: true,
  gender: true,
  profilePhoto: true,
});

// Professional Details Schema
export const professionalInfoSchema = formSchema.pick({
  role: true,
  currentAcademy: true,
  academyNames: true,
  workingMode: true,
  onlinePercentage: true,
  offlinePercentage: true,
  languagesSpoken: true,
  titles: true,
  fideId: true,
  rating: true,
  website: true,
  physicallyTaught: true,
});

// Contact & Location Schema
export const contactAddressSchema = formSchema.pick({
  country: true,
  stateRegion: true,
  cityLocation: true,
  address: true,
  social: true,
});
