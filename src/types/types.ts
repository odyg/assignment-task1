// types.ts or in a navigation-specific file (inside the 'types' folder)
type Location = {
  latitude: number;
  longitude: number;
};

type AddEventDetailsParams = {
  selectedLocation: Location;
};

export type RootStackParamList = {
  AddEventDetails: { selectedLocation: Location }; // No parameters for AddEventDetails
  AddEventLocation: undefined; // No parameters for AddEventLocation
  // EventDetails: { id: string; name: string }; // If EventDetails accepts parameters
  // Add other routes if needed
};
