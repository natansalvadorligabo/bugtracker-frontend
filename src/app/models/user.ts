import { Message } from "./message.js";
import { Rating } from "./rating.js";
import { Role } from "./role.js";
import { Ticket } from "./ticket.js";

export interface User {
  userId: number;
  email: string;
  name: string;
  password: string;
  profilePicture: string;
  roles: Role[];
  tickets: Ticket[];
  messages: Message[];
  ratings: Rating[];
}
