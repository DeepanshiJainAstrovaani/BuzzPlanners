export type Place = {
  entityId: string;
  iataCode: string;
  name: string;
  countryName: string;
  cityName?: string;
};


export interface FlightData {
  airline: { name: string };
  flight: { iata: string; number: string };
  departure: { airport: string; scheduled: string };
  arrival: { airport: string; scheduled: string };
  flight_status: string;
}

export interface AeroFlight {
  flightIata: string;
  airlineName: string;
  departure: { iata: string; scheduledTime: string };
  arrival: { iata: string; scheduledTime: string };
}

// Wedding Management Types
export interface VendorMasterSheetRow {
  item: string; // e.g., Venue, Hotel, DJ
  status: 'Booked' | 'Pending';
  advance: number;
  cost: number;
  pending: number;
  vendor: string; // Vendor name/type
  vendorContact: string;
}

export interface Wedding {
  weddingId: string; // e.g., WED453
  title: string; // e.g., Jatin weds Roshni
  date: string; // ISO date string
  venue: string;
  contactPersonGroomSide: string;
  contactPersonBrideSide: string;
  mobileGroomSide: string;
  mobileBrideSide: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  vendorMasterSheet: VendorMasterSheetRow[];
  brideSide?: any[];
  groomSide?: any[];
  makeupArtist?: any[];
  performanceLineups?: any[];
  // Add more tables as needed
}

export interface Guest {
  name: string;
  side: 'Bride' | 'Groom';
  contactNumber: string;
}
