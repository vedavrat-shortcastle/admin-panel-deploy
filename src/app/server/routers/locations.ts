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
      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
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
  getById: procedure
    .input(z.array(z.number()).or(z.number()))
    .query(async ({ ctx, input }) => {
      try {
        if (typeof input === 'number') {
          const location = await ctx.db.location.findUnique({
            where: {
              id: input,
            },
            select: {
              id: true,
              city: true,
              state: true,
              country: true,
            },
          });

          return [location];
        } else if (Array.isArray(input) && input.length > 0) {
          const locations = await ctx.db.location.findMany({
            where: {
              id: {
                in: input,
              },
            },
            select: {
              id: true,
              city: true,
              state: true,
              country: true,
            },
          });

          return locations;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }),
});
