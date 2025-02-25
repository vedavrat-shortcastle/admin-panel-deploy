'use client';

import { usePathname } from 'next/navigation';
import { capitalize } from 'lodash';

export function Navbar() {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop() || 'dashboard';

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <h1 className="text-2xl font-semibold">{capitalize(currentPath)}</h1>
    </nav>
  );
}
