export interface MyRoomInterface {
  roomName: string;
  displayDate: string;
  password: any;
  roomId: string;
  createdAt: MyRoomCreatedAt;
  host: string;
  id: string;
}

export interface MyRoomCreatedAt {
  seconds: number;
  nanoseconds: number;
}
