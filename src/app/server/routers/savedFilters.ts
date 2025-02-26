import { procedure, router } from '@/app/server/trpc';
import { savedFilterSchema } from '@/schemas/savedFilterSchema';
import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { z } from 'zod';

export const filterRouter = router({
  // ✅ Create a new filter
  createFilter: procedure
    .input(savedFilterSchema)
    .mutation(async ({ ctx, input }) => {
      const filter = await ctx.db.savedFilter.create({
        data: {
          name: input.name,
          filter: input.filter, // Ensure it's correctly structured
        },
      });

      return { success: true, filter };
    }),

  // ✅ Get all filters
  getFilters: procedure.query(async ({ ctx }) => {
    const filters = await ctx.db.savedFilter.findMany();
    return filters;
  }),

  // ✅ Get a single filter by ID
  getFilterById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
    .input(z.object({ id: z.string(), name: z.string(), filterInputSchema })) // Expect ID, name, and filter updates
    .mutation(async ({ ctx, input }) => {
      const updatedFilter = await ctx.db.savedFilter.update({
        where: { id: input.id },
        data: {
          name: input.name,
          filter: input.filterInputSchema,
        },
      });

      return { success: true, updatedFilter };
    }),

  // ✅ Delete a filter by ID
  deleteFilter: procedure
    .input(z.object({ id: z.string() })) // Expect an ID
    .mutation(async ({ ctx, input }) => {
      await ctx.db.savedFilter.delete({
        where: { id: input.id },
      });

      return { success: true, message: 'Filter deleted successfully' };
    }),
});
