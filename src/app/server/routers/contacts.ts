import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';

import { formSchema } from '@/schemas/contacts';
import {
  ChessTitle,
  ContactRole,
  ContactStatus,
  GenderType,
  TeachingMode,
} from '@prisma/client';
import {
  buildPrismaFilter,
  filterInputSchema,
} from '@/utils/Filter/filterBuilder';
import { FilterGroup } from '@/types/dynamicFilter';

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
    const contactTableData = await ctx.db.contact.findUnique({
      where: { id: parseInt(input) },
    });

    const contactLocationData = await ctx.db.location.findUnique({
      where: { id: contactTableData?.locationId ?? undefined },
      select: {
        country: true,
        state: true,
        city: true,
      },
    });

    return { ...contactTableData, ...contactLocationData };
  }),

  getFiltered: procedure
    .input(filterInputSchema)
    .query(async ({ ctx, input }) => {
      console.log('input', JSON.stringify(input));
      const where = buildPrismaFilter(input.filter as FilterGroup);
      console.log('where', JSON.stringify(where));
      const skip = input.pagination
        ? (input.pagination.page - 1) * input.pagination.limit
        : 0;
      const take = input.pagination?.limit ?? 10;
      const orderBy = input.sort
        ? { [input.sort.field]: input.sort.direction }
        : { id: 'desc' as const };

      try {
        if (!where || typeof where !== 'object') {
          throw new Error('Invalid filter conditions');
        }

        const [data, total] = await Promise.all([
          ctx.db.contact.findMany({
            where,
            skip,
            take,
            orderBy,
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              titles: true,
              currentStatus: true,
            },
          }),
          ctx.db.contact.count({ where }),
        ]);

        return {
          data,
          total,
          page: input.pagination?.page ?? 1,
          limit: take,
          pageCount: Math.ceil(total / take),
        };
      } catch (error) {
        console.error('Filter error:', error);
        throw new Error('Failed to fetch filtered contacts');
      }
    }),

  create: procedure.input(formSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db.$transaction(
      async (tx: {
        contact: {
          create: (arg0: {
            data: {
              firstName: string;
              lastName: string;
              role: ContactRole;
              email: string;
              phone: string;
              website: string | undefined;
              dateOfBirth: Date;
              gender: GenderType;
              languagesSpoken: string[];
              teachingMode: TeachingMode;
              onlinePercentage: number | undefined;
              offlinePercentage: number | undefined;
              locationId: number | undefined;
              address: string;
              linkedinUrl: string | undefined;
              facebookUrl: string | undefined;
              instagramUrl: string | undefined;
              twitterUrl: string | undefined;
              classicRating: number | undefined;
              rapidRating: number | undefined;
              blitzRating: number | undefined;
              fideId: string | undefined;
              titles: ChessTitle[];
              notes: string | undefined;
              yearsInOperation: number;
              numberOfCoaches: number;
              currentStatus: ContactStatus;
              imageUrl: string;
              lastContacted: Date | undefined;
            };
          }) => any;
        };
        contactAcademy: {
          createMany: (arg0: {
            data: { contactId: any; academyId: string; isCurrent: boolean }[];
          }) => any;
        };
        contactPhysicalLocation: {
          createMany: (arg0: {
            data: { contactId: any; locationId: number }[];
          }) => any;
        };
        tag: {
          findUnique: (arg0: { where: { name: string } }) => any;
          create: (arg0: { data: { name: string } }) => any;
        };
        contactTag: {
          create: (arg0: { data: { contactId: any; tagId: any } }) => any;
        };
      }) => {
        try {
          const inputAcademyIds = input.academyIds;
          const physicallyTaughtLocations = input.physicallyTaught;

          const newContact = await tx.contact.create({
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              role: input.role as ContactRole,
              email: input.email,
              phone: input.phoneNumber,
              website: input.website,
              dateOfBirth: input.dateOfBirth,
              gender: input.gender as GenderType,
              languagesSpoken: input.languagesSpoken,
              teachingMode: input.workingMode as TeachingMode,
              onlinePercentage: input.onlinePercentage,
              offlinePercentage: input.offlinePercentage,
              locationId: input.locationId,
              address: input.address,
              linkedinUrl: input.social.linkedin,
              facebookUrl: input.social.facebook,
              instagramUrl: input.social.instagram,
              twitterUrl: input.social.twitter,
              classicRating: input.rating.classic,
              rapidRating: input.rating.rapid,
              blitzRating: input.rating.blitz,
              fideId: input.fideId,
              titles: input.titles as ChessTitle[],
              notes: input.notes,
              yearsInOperation: input.yearsInOperation,
              numberOfCoaches: input.numberOfCoaches,
              currentStatus: input.status as ContactStatus,
              imageUrl: 'https://placehold.co/600x400',
              lastContacted: input.lastContacted,
            },
          });

          if (inputAcademyIds.length > 0) {
            await tx.contactAcademy.createMany({
              data: inputAcademyIds.map((academyId) => ({
                contactId: newContact.id,
                academyId: academyId,
                isCurrent: academyId === input.currentAcademy,
              })),
            });
          }

          if (physicallyTaughtLocations?.length) {
            await tx.contactPhysicalLocation.createMany({
              data: physicallyTaughtLocations.map((locationId) => ({
                contactId: newContact.id,
                locationId,
              })),
            });
          }

          if (Array.isArray(input.customTags) && input.customTags.length > 0) {
            for (const tagName of input.customTags) {
              let tag = await tx.tag.findUnique({
                where: { name: tagName },
              });

              if (!tag) {
                tag = await tx.tag.create({ data: { name: tagName } });
              }

              await tx.contactTag.create({
                data: { contactId: newContact.id, tagId: tag.id },
              });
            }
          }

          return newContact;
        } catch (error) {
          throw new Error(`Error while creating contact:  ${error}`);
        }
      },
      { timeout: 15000 }
    );
  }),
});
