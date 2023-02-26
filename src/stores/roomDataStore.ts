import { atom } from "recoil";
import { RoomIdInterface } from "../interfaces/roomId";



const roomDataAtom = atom<RoomIdInterface>({
  key: "roomIdKey",
  default: {
    roomId: "",
    roomName: "",
  },
});

export { roomDataAtom };