import { procedure, router } from '@/app/server/trpc';
import { FilterGroup } from '@/types/dynamicFilter';
import {
  buildPrismaFilter,
  filterInputSchema,
} from '@/utils/Filter/filterBuilder';

export const contactRouter = router({
  getFiltered: procedure
    .input(filterInputSchema)
    .query(async ({ ctx, input }) => {
      const where = buildPrismaFilter(input.filter as FilterGroup);
      const skip = input.pagination
        ? (input.pagination.page - 1) * input.pagination.limit
        : undefined;
      const take = input.pagination?.limit ?? 10;
      const orderBy = input.sort
        ? { [input.sort.field]: input.sort.direction }
        : undefined;

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
          },
        }),
        ctx.db.contact.count({ where }),
      ]);

      return {
        data,
        total,
        page: input.pagination?.page ?? 1,
        limit: take,
      };
    }),
});
