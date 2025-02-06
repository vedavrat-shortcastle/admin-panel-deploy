export type ContactsTable = {
  firstname: string;
  lastname: string;
  email: string;
  role: 'Coach' | 'Subcoach' | 'Admin';
  title: 'GM' | 'IM' | 'FM' | 'CM' | 'NM';
  status: 'active' | 'lead' | 'churned' | 'prospect' | 'new';
};
