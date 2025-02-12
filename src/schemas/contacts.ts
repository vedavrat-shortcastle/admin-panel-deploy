import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  role: z.string().min(1, { message: 'This field is required' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().min(1, { message: 'This field is required' }),
  academyIds: z.array(z.string()).min(1, { message: 'This field is requierd' }),
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  locationId: z.number().min(1, { message: 'This field is required' }),
  dateOfBirth: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  languagesSpoken: z.array(z.string()),
  currentAcademy: z.string().min(1, { message: 'This field is required' }),
  workingMode: z.enum(['online', 'offline', 'hybrid']),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
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
  titles: z.array(z.string()).min(1, { message: 'This field is required' }),
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0),
  numberOfCoaches: z.number().min(0),
  status: z.enum([
    'new',
    'lead',
    'prospect',
    'customer',
    'churned',
    'high_prospect',
  ]),
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});

export const personalInfoSchema = formSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  dateOfBirth: true,
  gender: true,
  profilePhoto: true,
});

// Professional Details Schema
export const professionalInfoSchema = formSchema.pick({
  role: true,
  currentAcademy: true,
  academyIds: true,
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
  locationId: true,
  address: true,
  social: true,
});
