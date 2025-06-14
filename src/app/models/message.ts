import { Ticket } from "./ticket.js";
import { User } from "./user.js";

export interface Message {
  messageId: number;
  message: string;
  timestamp: string;
  ticket: Ticket;
  sender: User;
}
