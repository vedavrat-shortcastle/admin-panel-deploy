import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';

export const contactsRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    return await ctx.db.contact.findMany({
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        titles: true,
        currentStatus: true,
      },
    });
  }),

  getById: procedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.contact.findUnique({
      where: { id: parseInt(input) },
    });
  }),
});
