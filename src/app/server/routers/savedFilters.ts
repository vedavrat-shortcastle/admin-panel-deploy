import { procedure, router } from '@/app/server/trpc';
import { savedFilterSchema } from '@/schemas/savedFilterSchema';
import { filterInputSchema } from '@/utils/Filter/filterBuilder';
import { z } from 'zod';
import { AdminPanelSection } from '@prisma/client';

export const filterRouter = router({
  // ✅ Create a new filter
  createFilter: procedure
    .input(savedFilterSchema)
    .mutation(async ({ ctx, input }) => {
<<<<<<< HEAD
      const userId = ctx.decoded?.user?.id;
=======
      const userDetails = ctx.userDetails;
      if (!userDetails) {
        throw new Error('Unauthorized: No user details found');
      }
      const userId = userDetails.user.id;
      console.log('session', userDetails);
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }
      const filter = await ctx.db.savedFilter.create({
        data: {
          userId,
          name: input.name,
          filter: input.filter,
<<<<<<< HEAD
          adminpanelSection: input.adminpanelSection as AdminPanelSection,
=======
          adminPanelSection: input.adminPanelSection as AdminPanelSection,
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
        },
      });

      return { success: true, filter };
    }),

  // ✅ Get all filters
  getFilters: procedure
    .input(z.object({ sectionName: z.string() }))
    .query(async ({ ctx, input }) => {
<<<<<<< HEAD
      const userId = ctx.decoded?.user?.id;
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }
=======
      const userDetails = ctx.userDetails;

      if (!userDetails) {
        throw new Error('Unauthorized: No user details found');
      }
      const userId = userDetails.user.id;
      console.log('session', userDetails);
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4

      const filters = await ctx.db.savedFilter.findMany({
        where: {
          userId,
<<<<<<< HEAD
          adminpanelSection: input.sectionName as AdminPanelSection,
=======
          adminPanelSection: input.sectionName as AdminPanelSection,
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
        },
      });

      return filters;
    }),

  // ✅ Get a single filter by ID
  getFilterById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
<<<<<<< HEAD
      const userId = ctx.decoded?.user?.id;
=======
      const userId = ctx.userDetails?.user.id;
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
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
<<<<<<< HEAD
      const userId = ctx.decoded?.user?.id;
=======
      const userId = ctx.userDetails?.user.id;
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
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
<<<<<<< HEAD
      const userId = ctx.decoded?.user?.id;
=======
      const userId = ctx.userDetails?.user.id;
>>>>>>> 9ce9ff48f1172a85acb968b33439ef2f2f20d3a4
      if (!userId) {
        throw new Error('Unauthorized: No user ID found');
      }

      await ctx.db.savedFilter.delete({
        where: { id: input.id },
      });

      return { success: true, message: 'Filter deleted successfully' };
    }),
});
