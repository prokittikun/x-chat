export interface MessageInterface {
  displayName: string;
  uid: string;
  avatar: any;
  createdAt: MessageCreatedAt;
  displayDate: string;
  text: string;
  id: string;
}

export interface MessageCreatedAt {
  seconds: number;
  nanoseconds: number;
}
