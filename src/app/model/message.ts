export interface Message {
  messageId: number;
  senderId: number;
  ticketId: number;
  message: string;
  timestamp: string;
  wasEdited: boolean;
}

export interface MessageCreate {
  ticketId: number;
  senderId: number;
  message: string | null | undefined;
  timestamp: string;
}
