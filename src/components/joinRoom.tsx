import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { fireStore } from "../configs/firebase";
import Loading from "./loading";
interface Props {
  children: React.ReactNode;
}
export default function JoinRoom(props: Props) {
  const [findRoomStatus, setFindRoomStatus] = useState<
    "notFound" | "loading" | "found"
  >("notFound");
  const [roomId, setRoomId] = useState("");
  const roomsRef = collection(fireStore, "rooms");
  const findRoom = async () => {
    setFindRoomStatus("loading");
    const q = query(roomsRef, where("roomId", "==", roomId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      setFindRoomStatus("notFound");
      toast.error("Room not found");
      return;
    }
    setFindRoomStatus("found");
  };
  return (
    <>
      <div className="flex justify-center items-center max-w-[50rem] w-full mx-auto py-5 gap-5 px-3">
        {/* search bar */}
        <input
          placeholder="Room ID : X-Cxxxx"
          onChange={(e) => setRoomId(e.target.value)}
          className="input w-full border-1 border-base-content focus:outline-none"
          type="text"
        />
        <button onClick={findRoom} className="btn btn-outline btn-base-100">
          Join room
        </button>
      </div>
      {findRoomStatus === "loading" ? (
        <Loading />
      ) : findRoomStatus === "found" ? (
        props.children
      ) : null}
    </>
  );
}
