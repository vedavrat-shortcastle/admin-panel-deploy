import { z } from 'zod';

export const createUsageSchema = z.object({
  academy: z.string().min(1, 'Academy name is required'),
  coach: z.string().min(1, 'Coach name is required'),
  overallUsageColor: z.string().optional(),
  classroomColor: z.string().optional(),
  tournamentColor: z.string().optional(),
  coursesColor: z.string().optional(),
  gameAreaColor: z.string().optional(),
  quizColor: z.string().optional(),
  assignmentColor: z.string().optional(),
  databaseColor: z.string().optional(),
});

export type usageFormValues = z.infer<typeof createUsageSchema>;

export const usageDetailsSchema = createUsageSchema.pick({
  academy: true,
  coach: true,
  overallUsageColor: true,
  classroomColor: true,
  tournamentColor: true,
  coursesColor: true,
  gameAreaColor: true,
  quizColor: true,
  assignmentColor: true,
  databaseColor: true,
});
