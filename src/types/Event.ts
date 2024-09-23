export interface Event {
    id: string;
    dateTime: string;
    description: string;
    name: string;
    organizerId: string;
    position: {
      latitude: number;
      longitude: number;
    };
    volunteersNeeded: number;
    volunteersIds: string[];
  }