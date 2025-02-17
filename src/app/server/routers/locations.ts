import { procedure, router } from '@/app/server/trpc'; // Import TRPCError
import { newCitySchema } from '@/schemas/contacts';

import { z } from 'zod';

export const locationRouter = router({
  getAllLocations: procedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const locations = await ctx.db.location.findMany({
        take: 20,
        where: {
          city: {
            contains: input,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          city: true,
          state: true,
          country: true,
        },
      });
      return locations; // Return locations if query is successful
    } catch (error) {
      // Error handling block
      console.error('Error fetching locations:', error); // Log the error on the server
    }
  }),

  create: procedure.input(newCitySchema).mutation(async ({ ctx, input }) => {
    try {
      const newLocation = await ctx.db.location.create({
        data: {
          city: input.city,
          country: input.country,
          state: input.state,
        },
      });
      return newLocation;
    } catch (error) {
      throw new Error(`Error while creating contact:  ${error}`);
    }
  }),
});
