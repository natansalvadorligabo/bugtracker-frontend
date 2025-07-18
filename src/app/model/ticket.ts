export interface Ticket {
  ticketId: number;
  senderId: number;
  receiverId: number;
  ticketCategoryId: number;
  ratingId: number;
  title: string;
  description: string;
  ticketStatus: string;
  timestamp: string;
}
