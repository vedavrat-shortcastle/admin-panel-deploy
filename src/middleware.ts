import { NextRequest, NextResponse } from 'next/server';
import { permissionMap } from '@/constants';
import { Permission } from '@prisma/client';
import { getToken } from 'next-auth/jwt'; // Import getToken to access JWT from NextAuth

async function checkPermission(
  userPermissions: Permission[],
  requiredPermission: string
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

  const excludePaths = ['/api/trpc/auth.login', '/api/auth']; // Exclude NextAuth API routes and login route

  const isExcluded = excludePaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isExcluded) {
    return NextResponse.next();
  }

  // Use NextAuth to verify authentication
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  // RBAC check based on permissions in the token from NextAuth
  const path = req.nextUrl.pathname;
  const method = req.method;
  const requiredPermission = permissionMap[path]?.[method];

  if (requiredPermission) {
    if (!token.permissions) {
      return NextResponse.json(
        { error: 'Permission denied - No permissions found in token' },
        { status: 403 }
      );
    }
    const hasPermission = await checkPermission(
      token.permissions as Permission[],
      requiredPermission
    );
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Permission denied - RBAC check failed' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/api/:path*',
};
