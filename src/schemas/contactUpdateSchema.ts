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

const ChessTitle = z.enum([
  'FIDETrainer',
  'FIDEInstructor',
  'GM',
  'IM',
  'WIM',
  'WGM',
]);

export const contactUpdateSchema = z.object({
  firstName: z.string().max(100).optional().default(''),
  lastName: z.string().max(100).optional().default(''),
  role: z
    .enum(['Headcoach', 'Admin', 'Subcoach', 'Founder'])
    .default('Headcoach'),
  email: z.string().email().optional().or(z.literal('')).default(''),
  phone: phoneNumberSchema.optional(), // Adjusting field name to match expected structure
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  locationId: z.number().nullable().optional().default(null),
  academyIds: z.array(z.string()).optional().default([]),
  dateOfBirth: z.date().optional().default(new Date('2000-01-01')),
  gender: z.enum(['male', 'female', 'other']).optional(),
  languagesSpoken: z.array(z.string()).optional().default([]),
  teachingMode: z
    .enum(['online', 'offline', 'hybrid'])
    .optional()
    .default('online'),
  onlinePercentage: z.number().min(0).max(100).optional().default(50),
  offlinePercentage: z.number().min(0).max(100).optional().default(50),
  address: z.string().optional(),
  social: z
    .object({
      linkedin: z.string().url().optional().or(z.literal('')),
      facebook: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
  rating: z
    .object({
      classic: z.number().optional(),
      rapid: z.number().optional(),
      blitz: z.number().optional(),
    })
    .optional()
    .default({ classic: 0, rapid: 0, blitz: 0 }),
  fideId: z.string().optional().default(''),
  titles: z.array(ChessTitle).optional().default([]),
  physicallyTaught: z.array(z.number()).optional().default([]),
  lastContacted: z.date().optional().default(new Date()),
  notes: z.string().optional().default(''),
  customTags: z.array(z.string()).optional().default([]),
  yearsInOperation: z.number().min(0).optional().default(0),
  numberOfCoaches: z.number().min(0).optional().default(0),
  currentAcademy: z.string().optional().default(''),
  currentStatus: z
    .enum(['new', 'lead', 'prospect', 'customer', 'churned', 'high_prospect'])
    .optional()
    .default('new'),
  imageUrl: z.string().url().optional().default('https://placehold.co/600x400'),
});

export type FormValues = z.infer<typeof contactUpdateSchema>;
