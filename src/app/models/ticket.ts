import { Message } from "./message.js";
import { Rating } from "./rating.js";
import { TicketCategory } from "./ticket-category.js";
import { TicketStatus } from "./ticket-status.js";
import { User } from "./user.js";

export interface Ticket {
  ticketId: number;
  user: User;
  description: string;
  ticketCategory: TicketCategory;
  ticketStatus: TicketStatus;
  messages: Message[];
  timestamp: string;
  rating: Rating;
  sender: User;
  receiver: User;
}
