type Status =
  | 'new'
  | 'lead'
  | 'prospect'
  | 'customer'
  | 'churned'
  | 'high_prospect';
type Gender = 'male' | 'female' | 'other';
type WorkingMode = 'online' | 'offline' | 'hybrid';
type Role = 'Headcoach' | 'Subcoach' | 'Admin' | 'Founder';

export const defaultFormValues = {
  firstName: '',
  lastName: '',
  role: 'Subcoach' as Role,
  email: '',
  phoneNumber: '',
  academyIds: [],
  locationId: undefined,
  website: '',
  dateOfBirth: undefined,
  gender: 'male' as Gender,
  languagesSpoken: [],
  currentAcademy: '',
  workingMode: 'hybrid' as WorkingMode, // Set a default value (could be 'online', 'offline', or 'hybrid')
  onlinePercentage: 0, // Default to 0
  offlinePercentage: 0, // Default to 0
  address: '',
  social: {
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
  },
  rating: {
    classic: 0,
    rapid: 0,
    blitz: 0,
  },
  fideId: '',
  titles: [],
  physicallyTaught: [],
  lastContacted: undefined, // Assuming the field is optional
  notes: '',
  customTags: [],
  yearsInOperation: 0, // Default to 0
  numberOfCoaches: 0, // Default to 0
  status: 'new' as Status, // Default to 'active' with the Status type
  profilePhoto: undefined, // Default to null since this is optional
};
