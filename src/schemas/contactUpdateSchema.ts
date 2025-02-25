import { z } from 'zod';
// import { parsePhoneNumberFromString } from 'libphonenumber-js';

// const phoneNumberSchema = z.string().refine(
//   (value) => {
//     const phoneNumber = parsePhoneNumberFromString(value);
//     return phoneNumber?.isValid();
//   },
//   {
//     message: 'Invalid phone number format.',
//   }
// );

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
  role: z.enum(['Headcoach', 'Admin', 'Subcoach', 'Founder']).optional(),
  email: z.string().email().optional().or(z.literal('')).optional(),
  phone: z.string().optional(), // Adjusting field name to match expected structure
  website: z.string().url({ message: 'Invalid URL.' }).optional(),
  locationId: z.number().nullable().optional(),
  academyIds: z.array(z.string()).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  teachingMode: z.enum(['online', 'offline', 'hybrid']).optional(),
  onlinePercentage: z.number().min(0).max(100).optional(),
  offlinePercentage: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
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
  titles: z.array(ChessTitle).optional(),
  physicallyTaught: z.array(z.number()).optional(),
  lastContacted: z.date().optional(),
  notes: z.string().optional(),
  customTags: z.array(z.string()).optional(),
  yearsInOperation: z.number().min(0).optional(),
  numberOfCoaches: z.number().min(0).optional(),
  currentAcademy: z.string().optional(),
  currentStatus: z
    .enum(['new', 'lead', 'prospect', 'customer', 'churned', 'high_prospect'])
    .optional(),
  imageUrl: z.string().url().optional(),
});

export type FormValues = z.infer<typeof contactUpdateSchema>;
