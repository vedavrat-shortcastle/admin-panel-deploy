import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';
import { createSubscriptionSchema } from '@/schemas/subscription';

//subscription is a router that contains multiple procedures for customers management

export const subscriptionRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    return await ctx.db.subscription.findMany({
      take: 10,
      select: {
        id: true,
        salesType: true,
        academy: {
          select: {
            name: true,
          },
        },
        contact: { select: { email: true, firstName: true, lastName: true } },
      },
    });
  }),

  getById: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { id: parseInt(input) },
      select: {
        id: true,
        adminName: true,
        academyId: true,
        salesType: true,
        paidSeats: true,
        freeSeats: true,
        planStartDate: true,
        planEndDate: true,
        salesPerson: true,
        currency: true,
        notes: true,
        paymentMode: true,
        amount: true,
        renewalType: true,
        planType: true,
        academy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return subscription;
  }),

  create: procedure
    .input(createSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.subscription.create({
        data: {
          ...input,
          paidSeats: input.paidSeats ?? 0,
          freeSeats: input.freeSeats ?? 0,
        },
      });
    }),

  getbyContactId: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const subscriptions = await ctx.db.subscription.findMany({
      where: { contactId: parseInt(input) },
      select: {
        academy: {
          select: {
            name: true,
          },
        },
        salesType: true,
        planEndDate: true,
      },
    });

    return subscriptions;
  }),
});
