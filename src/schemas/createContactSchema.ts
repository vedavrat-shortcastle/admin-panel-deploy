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

export const createContactSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  role: z.enum(['Headcoach', 'Admin', 'Subcoach', 'Founder']),
  email: z.string().email().optional(),
  phone: phoneNumberSchema.optional(),
  website: z
    .string()
    .url({ message: 'Invalid URL.' })
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  teachingMode: z.enum(['online', 'offline', 'hybrid']).optional(),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  locationId: z.number().nullable().optional(),
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
    .optional(),
  fideId: z.string().optional(),
  titles: z.array(ChessTitle).optional(),
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  academyIds: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0).optional(),
  numberOfCoaches: z.number().min(0).optional(),
  status: z
    .enum(['new', 'lead', 'prospect', 'customer', 'churned', 'high_prospect'])
    .optional(),
  currentAcademy: z.string().optional(),
  imageUrl: z.string().url().optional().default('https://placehold.co/600x400'),
});

export type FormValues = z.infer<typeof createContactSchema>;
