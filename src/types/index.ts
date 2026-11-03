export type StudioCategory = "Photo Studio" | "Film Stage" | "Podcast Lounge" | "Music Suite" | "Workshop";

export interface Review {
  userEmail: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviews?: Review[];
  ownerEmail: string;
  ownerName: string;
  createdAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  userEmail: string;
  userName: string;
  startAt: string;
  endAt: string;
  hours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}
