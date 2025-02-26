import {
  ChessTitle,
  ContactRole,
  ContactStatus,
  GenderType,
  TeachingMode,
} from '@prisma/client';
import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  role: z.nativeEnum(ContactRole),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().min(1, { message: 'This field is required' }),
  academyIds: z.array(z.string()).min(1, { message: 'This field is requierd' }),
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  locationId: z
    .number()
    .min(1, { message: 'This field is required' })
    .optional(),
  dateOfBirth: z.date(),
  gender: z.nativeEnum(GenderType),
  languagesSpoken: z.array(z.string()),
  currentAcademy: z.string().min(1, { message: 'This field is required' }),
  teachingMode: z.nativeEnum(TeachingMode),
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
  titles: z.array(z.nativeEnum(ChessTitle)),
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0),
  numberOfCoaches: z.number().min(0),
  status: z.nativeEnum(ContactStatus),
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});

export const personalInfoSchema = contactFormSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  dateOfBirth: true,
  gender: true,
  profilePhoto: true,
});

// Professional Details Schema
export const professionalInfoSchema = contactFormSchema.pick({
  role: true,
  currentAcademy: true,
  academyIds: true,
  teachingMode: true,
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
export const contactAddressSchema = contactFormSchema.pick({
  locationId: true,
  address: true,
  social: true,
  notes: true,
  lastContacted: true,
});

export const newCitySchema = z.object({
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().optional().default(''),
  country: z.string().min(1, { message: 'Country is required' }),
});

export const contactUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'This field is required' })
    .optional(), // Made optional
  lastName: z.string().min(1, { message: 'This field is required' }).optional(), // Made optional
  role: z.enum(['Headcoach', 'Admin', 'Subcoach', 'Founder']).optional(), // Made optional
  email: z.string().email({ message: 'Invalid email address.' }).optional(), // Made optional
  phone: z.string().min(1, { message: 'This field is required' }).optional(), // Made optional
  academyIds: z
    .array(z.string())
    .min(1, { message: 'This field is requierd' })
    .optional(), // Made optional
  website: z.string().url({ message: 'Invalid URL.' }).optional(),
  // .or(z.literal('')) - No need for .or(z.literal('')) as optional handles undefined already
  locationId: z
    .number()
    .min(1, { message: 'This field is required' })
    .optional(),
  dateOfBirth: z.date().optional(), // Made optional
  gender: z.enum(['male', 'female', 'other']).optional(), // Made optional
  languagesSpoken: z.array(z.string()).optional(), // Made optional
  currentAcademy: z
    .string()
    .min(1, { message: 'This field is required' })
    .optional(), // Made optional
  teachingMode: z.enum(['online', 'offline', 'hybrid']).optional(), // Made optional
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  address: z.string().min(1, { message: 'This field is required' }).optional(), // Made optional
  social: z
    .object({
      linkedin: z.string().url().optional(),
      // .or(z.literal('')) - No need for .or(z.literal(''))
      facebook: z.string().url().optional(),
      // .or(z.literal('')) - No need for .or(z.literal(''))
      instagram: z.string().url().optional(),
      // .or(z.literal('')) - No need for .or(z.literal(''))
      twitter: z.string().url().optional(),
      // .or(z.literal('')) - No need for .or(z.literal(''))
    })
    .optional(), // Made social object itself optional
  rating: z
    .object({
      classic: z.number().optional(),
      rapid: z.number().optional(),
      blitz: z.number().optional(),
    })
    .optional(), // Made rating object itself optional
  fideId: z.string().optional(),
  titles: z
    .array(z.string())
    .min(1, { message: 'This field is required' })
    .optional(), // Made optional
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0).optional(), // Made optional
  numberOfCoaches: z.number().min(0).optional(), // Made optional
  currentStatus: z
    .enum(['new', 'lead', 'prospect', 'customer', 'churned', 'high_prospect'])
    .optional(), // Made optional
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});
