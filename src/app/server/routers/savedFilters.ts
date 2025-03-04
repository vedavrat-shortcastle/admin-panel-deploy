import { procedure, router } from '@/app/server/trpc';
import { savedFilterSchema } from '@/schemas/savedFilterSchema';
import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { AdminPanelSection } from '@prisma/client';
import { z } from 'zod';

export const filterRouter = router({
  // ✅ Create a new filter
  createFilter: procedure
    .input(savedFilterSchema)
    .mutation(async ({ ctx, input }) => {
      const userDetails = ctx.userDetails;
      if (!userDetails) {
        throw new Error('Unauthorized: No user details found');
      }
      const userId = userDetails.user.id;
      console.log('session', userDetails);
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }
      const filter = await ctx.db.savedFilter.create({
        data: {
          userId,
          name: input.name,
          filter: input.filter,
          adminPanelSection: input.adminPanelSection as AdminPanelSection,
        },
      });

      return { success: true, filter };
    }),

  // ✅ Get all filters
  getFilters: procedure
    .input(z.object({ sectionName: z.string() }))
    .query(async ({ ctx, input }) => {
      const userDetails = ctx.userDetails;

      if (!userDetails) {
        throw new Error('Unauthorized: No user details found');
      }
      const userId = userDetails.user.id;
      console.log('session', userDetails);

      const filters = await ctx.db.savedFilter.findMany({
        where: {
          userId,
          adminPanelSection: input.sectionName as AdminPanelSection,
        },
      });

      return filters;
    }),

  // ✅ Get a single filter by ID
  getFilterById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userDetails?.user.id;
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }
      const filter = await ctx.db.savedFilter.findUnique({
        where: { id: input.id },
      });

      if (!filter) {
        throw new Error('Filter not found');
      }

      return filter;
    }),

  // ✅ Update a filter by ID
  updateFilter: procedure
    .input(
      z.object({ id: z.string(), name: z.string(), filter: filterInputSchema })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userDetails?.user.id;
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }

      const updatedFilter = await ctx.db.savedFilter.update({
        where: { id: input.id },
        data: {
          name: input.name,
          filter: input.filter,
        },
      });

      return { success: true, updatedFilter };
    }),

  // ✅ Delete a filter by ID
  deleteFilter: procedure
    .input(z.object({ id: z.string() })) // Expect an ID
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userDetails?.user.id;
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }

      await ctx.db.savedFilter.delete({
        where: { id: input.id },
      });

      return { success: true, message: 'Filter deleted successfully' };
    }),
});
