import {
  ChessTitle,
  ContactRole,
  ContactStatus,
  GenderType,
  TeachingMode,
} from '@prisma/client';
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const phoneNumberSchema = z.string().refine(
  (value) => {
    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid();
  },
  {
    message: 'Invalid phone number format.',
  }
);

export const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  role: z.nativeEnum(ContactRole),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: phoneNumberSchema,
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
    .optional(),
  lastName: z.string().min(1, { message: 'This field is required' }).optional(),
  role: z.enum(['Headcoach', 'Admin', 'Subcoach', 'Founder']).optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
  phone: z.string().min(1, { message: 'This field is required' }).optional(),
  academyIds: z
    .array(z.string())
    .min(1, { message: 'This field is requierd' })
    .optional(),
  website: z.string().url({ message: 'Invalid URL.' }).optional(),
  locationId: z
    .number()
    .min(1, { message: 'This field is required' })
    .optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  currentAcademy: z
    .string()
    .min(1, { message: 'This field is required' })
    .optional(),
  teachingMode: z.enum(['online', 'offline', 'hybrid']).optional(),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  address: z.string().min(1, { message: 'This field is required' }).optional(),
  social: z
    .object({
      linkedin: z.string().url().optional(),
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      twitter: z.string().url().optional(),
    })
    .optional(),
  rating: z
    .object({
      classic: z.number().optional(),
      rapid: z.number().optional(),
      blitz: z.number().optional(),
    })
    .optional(),
  fideId: z.string().optional(),
  titles: z
    .array(z.string())
    .min(1, { message: 'This field is required' })
    .optional(),
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0).optional(),
  numberOfCoaches: z.number().min(0).optional(),
  currentStatus: z
    .enum(['new', 'lead', 'prospect', 'customer', 'churned', 'high_prospect'])
    .optional(),
  profilePhoto: z.instanceof(globalThis.File || Blob).optional(),
});
