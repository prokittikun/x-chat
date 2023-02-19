import { atom } from "recoil";
import { RoomIdInterface } from "../interfaces/roomId";



const roomIdAtom = atom<RoomIdInterface>({
  key: "roomIdKey",
  default: {
    roomId: "",
  },
});

export { roomIdAtom };