import { UserReference } from "./user";

export interface Ticket {
  ticketId: number;
  sender: UserReference;
  receiver: UserReference;
  ticketCategoryId: number;
  ratingId: number;
  title: string;
  description: string;
  ticketStatus: string;
  timestamp: string;
}