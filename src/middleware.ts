import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/utils/encoder';
import { permissionMap } from '@/constants';
import { Permission } from '@prisma/client';

async function checkPermission(
  userPermissions: Permission[],
  requiredPermission: string //user:read
) {
  const [module, actions] = requiredPermission.split(':');
  const requiredActions = actions.split(',');
  const hasPermission = userPermissions.some((p) => {
    const [userModule, userActions] = p.code.split(':');
    if (userModule !== module) {
      return false;
    }
    if (userActions.includes('all')) {
      return true;
    }
    return requiredActions.every((action) => userActions.includes(action));
  });
  return hasPermission;
}

// Remove dbMiddleware and update middleware chain
export const middleware = async (req: NextRequest) => {
  if (req.method === 'OPTIONS') {
    return NextResponse.json('ok', { status: 200 });
  }

  if (req.nextUrl.pathname.startsWith('/api/trpc/superUser')) {
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.SUPER_USER_SECRET) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }
    return NextResponse.next();
  }

  const excludePaths = ['/api/trpc/auth.login'];

  const isExcluded = excludePaths.some((path) => path === req.nextUrl.pathname);

  if (isExcluded) {
    return NextResponse.next();
  }

  // Auth check
  const token = req.headers.get('authorization')?.split(' ')[1] || '';
  const tokenData = await verifyJWT(token);
  if (!tokenData.verify) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  // RBAC check
  const path = req.nextUrl.pathname;
  const method = req.method;
  const requiredPermission = permissionMap[path]?.[method];

  if (!tokenData.permissions) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  if (requiredPermission) {
    const hasPermission = await checkPermission(
      tokenData.permissions,
      requiredPermission
    );
    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }
  }

  return NextResponse.next({
    headers: {
      tokenData: JSON.stringify(tokenData),
    },
  });
};

export const config = {
  matcher: '/api/:path*',
};
