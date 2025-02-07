type Status = 'active' | 'inactive' | 'pending';
type Gender = 'male' | 'female' | 'other';
type WorkingMode = 'online' | 'offline' | 'hybrid';

export const defaultFormValues = {
  firstName: '',
  lastName: '',
  role: '',
  email: '',
  phoneNumber: '',
  academyNames: [],
  website: '',
  country: '',
  yearOfBirth: undefined,
  dateOfBirth: undefined,
  gender: 'male' as Gender,
  languagesSpoken: [],
  currentAcademy: '',
  workingMode: 'online' as WorkingMode, // Set a default value (could be 'online', 'offline', or 'hybrid')
  onlinePercentage: 0, // Default to 0
  offlinePercentage: 0, // Default to 0
  stateRegion: '',
  cityLocation: '',
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
  status: 'active' as Status, // Default to 'active' with the Status type
  profilePhoto: undefined, // Default to null since this is optional
};
