import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';

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
import { contactUpdateSchema } from '@/schemas/contactUpdateSchema';
import { contactFormSchema } from '@/schemas/contacts';

export const contactsRouter = router({
  getAll: procedure.input(z.string()).query(async ({ ctx }) => {
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
      include: {
        academies: {
          include: {
            academy: true,
          },
        },
        location: {
          select: {
            country: true,
            state: true,
            city: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        physicalLocationsTaught: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!contactTableData) {
      throw new Error('Contact not found');
    }

    const academyNames = contactTableData.academies.map(
      (ca) => ca.academy.name
    );
    const customTags = contactTableData.tags.map((t) => t.tag.name);
    const physicallyTaught = contactTableData.physicalLocationsTaught.map(
      (pl) => pl.locationId
    );

    return {
      ...contactTableData,
      academyNames,
      customTags,
      physicallyTaught,
      contactLocationData: contactTableData.location,
    };
  }),

  getFiltered: procedure
    .input(filterInputSchema)
    .query(async ({ ctx, input }) => {
      console.log('input', JSON.stringify(input));
      try {
        const where = buildPrismaFilter(input.filter as FilterGroup);
        console.log('where', JSON.stringify(where));
        const skip = input.pagination
          ? (input.pagination.page - 1) * input.pagination.limit
          : 0;
        const take = input.pagination?.limit ?? 10;
        const orderBy = input.sort
          ? { [input.sort.field]: input.sort.direction }
          : { id: 'desc' as const };

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
      } catch (error: any) {
        console.error('Filter error:', error);
        throw new Error('Failed to fetch filtered contacts: ' + error.message);
      }
    }),

  create: procedure
    .input(contactFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(
        async (tx) => {
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
                teachingMode: input.teachingMode as TeachingMode,
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

            if (
              Array.isArray(input.customTags) &&
              input.customTags.length > 0
            ) {
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
  updateById: procedure
    .input(contactUpdateSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(
        async (tx) => {
          try {
            const {
              id,
              academyIds,
              currentAcademy,
              physicallyTaught,
              customTags,
              ...rest
            } = input;
            const updateData = Object.fromEntries(
              Object.entries(rest).filter(([value]) => value !== undefined)
            );
            let updatedContact;
            if (Object.keys(updateData).length > 0) {
              updatedContact = await tx.contact.update({
                where: { id },
                data: updateData,
              });
            } else {
              updatedContact = await tx.contact.findUnique({ where: { id } });
            }
            if (academyIds !== undefined) {
              await tx.contactAcademy.deleteMany({ where: { contactId: id } });
              if (academyIds.length > 0) {
                await tx.contactAcademy.createMany({
                  data: academyIds.map((academyId) => ({
                    contactId: id,
                    academyId,
                    isCurrent: academyId === currentAcademy,
                  })),
                });
              }
            }
            if (physicallyTaught !== undefined) {
              await tx.contactPhysicalLocation.deleteMany({
                where: { contactId: id },
              });
              if (physicallyTaught.length) {
                await tx.contactPhysicalLocation.createMany({
                  data: physicallyTaught.map((locationId) => ({
                    contactId: id,
                    locationId,
                  })),
                });
              }
            }
            if (customTags !== undefined) {
              await tx.contactTag.deleteMany({ where: { contactId: id } });
              if (customTags.length > 0) {
                const existingTags = await tx.tag.findMany({
                  where: { name: { in: customTags } },
                });
                const existingTagNames = existingTags.map((tag) => tag.name);
                const newTags = customTags
                  .filter((tagName) => !existingTagNames.includes(tagName))
                  .map((tagName) => tx.tag.create({ data: { name: tagName } }));
                const createdTags = await Promise.all(newTags);
                const allTags = [...existingTags, ...createdTags];
                await tx.contactTag.createMany({
                  data: allTags.map((tag) => ({
                    contactId: id,
                    tagId: tag.id,
                  })),
                });
              }
            }
            return updatedContact;
          } catch (error) {
            throw new Error(`Error updating contact: ${error}`);
          }
        },
        { timeout: 15000 }
      );
    }),
});
