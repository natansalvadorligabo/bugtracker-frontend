export interface TicketRequest {
    senderId: number;
    receiverId: number;
    ticketCategoryId: number;
    ratingId: number;
    description: string;
    ticketStatus: string;
    timestamp: Date;
}

export interface TicketResponse {
    ticketId: number;
    senderId: number;
    receiverId: number;
    ticketCategoryId: number;
    ratingId: number;
    description: string;
    ticketStatus: string;
    timestamp: Date;
}