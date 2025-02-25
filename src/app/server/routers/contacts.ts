import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';
// import {} from @/schemas/contactUpdateSchema;

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
import { contactUpdateSchema } from '@/schemas/contactUpdateSchema';

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
  // updateById: procedure
  //     .input(
  //       z.object({
  //         id: z.number().int().positive(),
  //         ...formSchema.shape,
  //       })
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       const contactId = input.id;
  //       const { social, rating, locationId, academyIds, customTags, physicallyTaught, currentAcademy, ...rest } = input;

  //       // Exclude the id field from the data object
  //       const { id, ...data } = rest;

  //       const updatedContact = await ctx.db.contact.update({
  //         where: { id: contactId },
  //         data: {
  //           ...data,
  //           //prisma cannot convert nested to flat
  //           linkedinUrl: social?.linkedin,
  //           facebookUrl: social?.facebook,
  //           instagramUrl: social?.instagram,
  //           twitterUrl: social?.twitter,
  //           classicRating: rating?.classic,
  //           rapidRating: rating?.rapid,
  //           blitzRating: rating?.blitz,
  //           location: locationId ? { connect: { id: locationId } } : undefined,
  //         },
  //       });

  //       if (academyIds?.length) {
  //         const existingAcademyIds = await ctx.db.contactAcademy
  //           .findMany({
  //             where: { contactId },
  //             select: { academyId: true },
  //           })
  //           .then((academies) => academies.map((a) => a.academyId));

  //         const academiesToAdd = academyIds.filter(
  //           (id) => !existingAcademyIds.includes(id)
  //         );
  //         const academiesToRemove = existingAcademyIds.filter(
  //           (id) => !academyIds.includes(id)
  //         );

  //         if (academiesToRemove.length) {
  //           await ctx.db.contactAcademy.deleteMany({
  //             where: { contactId, academyId: { in: academiesToRemove } },
  //           });
  //         }

  //         if (academiesToAdd.length) {
  //           await ctx.db.contactAcademy.createMany({
  //             data: academiesToAdd.map((academyId) => ({
  //               contactId: updatedContact.id,
  //               academyId,
  //               isCurrent: academyId === currentAcademy,
  //             })),
  //           });
  //         }

  //         await ctx.db.contactAcademy.updateMany({
  //           where: { contactId },
  //           data: { isCurrent: false },
  //         });

  //         if (currentAcademy) {
  //           await ctx.db.contactAcademy.update({
  //             where: {
  //               contactId_academyId: {
  //                 contactId,
  //                 academyId: currentAcademy,
  //               },
  //             },
  //             data: { isCurrent: true },
  //           });
  //         }
  //       }

  //       if (physicallyTaught?.length) {
  //         const existingPhysicalLocations = await ctx.db.contactPhysicalLocation
  //           .findMany({
  //             where: { contactId },
  //             select: { locationId: true },
  //           })
  //           .then((locations) => locations.map((l) => l.locationId));

  //         const locationsToAdd = physicallyTaught.filter(
  //           (id) => !existingPhysicalLocations.includes(id)
  //         );
  //         const locationsToRemove = existingPhysicalLocations.filter(
  //           (id) => !physicallyTaught.includes(id)
  //         );
  //         if (locationsToRemove.length) {
  //           await ctx.db.contactPhysicalLocation.deleteMany({
  //             where: { contactId, locationId: { in: locationsToRemove } },
  //           });
  //         }

  //         if (locationsToAdd.length) {
  //           await ctx.db.contactPhysicalLocation.createMany({
  //             data: locationsToAdd.map((locationId) => ({
  //               contactId: updatedContact.id,
  //               locationId,
  //             })),
  //           });
  //         }
  //       }

  //       if (Array.isArray(customTags)) {
  //         const existingTags = await ctx.db.contactTag.findMany({
  //           where: { contactId: updatedContact.id },
  //           include: { tag: true },
  //         });

  //         const existingTagNames = existingTags.map((ct) => ct.tag.name);
  //         const tagsToRemove = existingTagNames.filter(
  //           (tagName) => !customTags.includes(tagName)
  //         );
  //         const tagsToAdd = customTags.filter(
  //           (tagName) => !existingTagNames.includes(tagName)
  //         );
  //         // Remove tags
  //         if (tagsToRemove.length > 0) {
  //           const tagIdsToRemove = existingTags
  //             .filter((ct) => tagsToRemove.includes(ct.tag.name))
  //             .map((ct) => ct.tagId);

  //           await ctx.db.contactTag.deleteMany({
  //             where: {
  //               contactId: updatedContact.id,
  //               tagId: { in: tagIdsToRemove },
  //             },
  //           });
  //         }
  //         // Add new tags
  //         for (const tagName of tagsToAdd) {
  //           let tag = await ctx.db.tag.findUnique({
  //             where: { name: tagName },
  //           });

  //           if (!tag) {
  //             tag = await ctx.db.tag.create({ data: { name: tagName } });
  //           }

  //           await ctx.db.contactTag.create({
  //             data: { contactId: updatedContact.id, tagId: tag.id },
  //           });
  //         }
  //       }

  //       if (Array.isArray(customTags) && customTags.length > 0) {
  //         for (const tagName of customTags) {
  //           let tag = await ctx.db.tag.findUnique({
  //             where: { name: tagName },
  //           });

  //           if (!tag) {
  //             tag = await ctx.db.tag.create({ data: { name: tagName } });
  //           }

  //           await ctx.db.contactTag.create({
  //             data: { contactId: updatedContact.id, tagId: tag.id },
  //           });
  //         }
  //       }

  //       return updatedContact;
  //     }),
  //   updateById: procedure
  //     .input(contactUpdateSchema.extend({ id: z.number() })) // Include `id` in input
  //     .mutation(async ({ ctx, input }) => {
  //       return await ctx.db.$transaction(
  //         async (tx) => {
  //           try {
  //             const { id, academyIds, physicallyTaught, customTags, ...rest } =
  //               input;
  //             // ✅ Update contact details
  //             const updatedContact = await tx.contact.update({
  //               where: { id },
  //               data: {
  //                 ...rest,
  //                 role: rest.role as ContactRole,
  //                 gender: rest.gender as GenderType,
  //                 teachingMode: rest.teachingMode as TeachingMode,
  //                 titles: rest.titles as ChessTitle[],
  //                 currentStatus:  rest.currentStatus as ContactStatus,
  //                 linkedinUrl: rest.social?.linkedin,
  //                 facebookUrl: rest.social?.facebook,
  //                 instagramUrl: rest.social?.instagram,
  //                 twitterUrl: rest.social?.twitter,
  //                 classicRating: rest.rating.classic,
  //                 rapidRating: rest.rating.rapid,
  //                 blitzRating: rest.rating.blitz,
  //               },
  //             });
  //             // ✅ Update associated academies
  //             await tx.contactAcademy.deleteMany({ where: { contactId: id } });
  //             if (academyIds.length > 0) {
  //               await tx.contactAcademy.createMany({
  //                 data: academyIds.map((academyId) => ({
  //                   contactId: id,
  //                   academyId,
  //                   isCurrent: academyId === input.currentAcademy,
  //                 })),
  //               });
  //             }
  //             // ✅ Update physically taught locations
  //             await tx.contactPhysicalLocation.deleteMany({
  //               where: { contactId: id },
  //             });
  //             if (physicallyTaught?.length) {
  //               await tx.contactPhysicalLocation.createMany({
  //                 data: physicallyTaught.map((locationId) => ({
  //                   contactId: id,
  //                   locationId,
  //                 })),
  //               });
  //             }
  //             // ✅ Update custom tags
  //             await tx.contactTag.deleteMany({ where: { contactId: id } });
  //             if (Array.isArray(customTags) && customTags.length > 0) {
  //               for (const tagName of customTags) {
  //                 let tag = await tx.tag.findUnique({ where: { name: tagName } });
  //                 if (!tag) {
  //                   tag = await tx.tag.create({ data: { name: tagName } });
  //                 }
  //                 await tx.contactTag.create({
  //                   data: { contactId: id, tagId: tag.id },
  //                 });
  //               }
  //             }
  //             return updatedContact;
  //           } catch (error) {
  //             throw new Error(`Error updating contact: ${error}`);
  //           }
  //         },
  //         { timeout: 15000 }
  //       );
  //     }),
  // });
  updateById: procedure
    .input(contactUpdateSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(
        async (tx) => {
          try {
            const { id, academyIds, physicallyTaught, customTags, ...rest } =
              input;
            // Directly use the rest object, filtering out undefined values.
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
                    isCurrent: academyId === input.currentAcademy,
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
