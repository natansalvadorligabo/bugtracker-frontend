// src/app/models/rating.model.ts

import { Ticket } from "./ticket.js";
import { User } from "./user.js";

export interface Rating {
  ratingId: number;
  ticket: Ticket;
  sender: User;
}
