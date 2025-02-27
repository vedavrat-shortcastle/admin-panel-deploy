import { z } from 'zod';
import { router, procedure } from '@/app/server/trpc';
import { hashPassword } from '@/utils/encoder';

export const superUserRouter = router({
  createUser: procedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        password: z.string().min(8),
        role: z.enum(['ADMIN', 'MANAGER', 'EXECUTIVE']),
        permissions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hashPassword(input.password);
      // First verify if all permissions exist
      const permissions = await ctx.db.permission.findMany({
        where: {
          id: {
            in: input.permissions,
          },
        },
      });
      const permissionIds = input.permissions ?? [];
      if (permissions.length !== permissionIds.length) {
        throw new Error('Some permission IDs are invalid');
      }
      const user = await ctx.db.adminUser.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: hashedPassword,
          role: input.role,
        },
      });
      if (input.permissions?.length) {
        await ctx.db.adminUserPermission.createMany({
          data: input.permissions.map((permissionId) => ({
            adminUserId: user.id,
            permissionId: permissionId,
          })),
        });
      }
      return user;
    }),

  createPermission: procedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const permission = await ctx.db.permission.create({
        data: input,
      });
      return permission;
    }),

  updatePermission: procedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const permission = await ctx.db.permission.update({
        where: { id: input.id },
        data: input,
      });
      return permission;
    }),

  deletePermission: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.permission.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
