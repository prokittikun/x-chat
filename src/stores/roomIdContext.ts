import { createContext } from "react";
import { RoomIdContextType } from "../interfaces/roomIdContext";

const RoomIdContext = createContext<RoomIdContextType>({roomId: ""});
export default RoomIdContext;