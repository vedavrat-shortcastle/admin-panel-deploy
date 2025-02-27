// Map routes to required permissions
export const permissionMap: Record<string, Record<string, string>> = {
  '/api/trpc/contacts.getFiltered': {
    GET: 'contacts:read',
  },
  // Add more route-permission mappings as needed
};
