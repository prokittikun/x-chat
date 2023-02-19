import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { fireStore } from "../configs/firebase";
import RoomIdContext from "../stores/roomIdContext";
import { Loading } from "./loading";
import { roomIdAtom } from "../stores/roomIdStore";
interface Props {
  children: React.ReactNode;
}

export default function JoinRoom(props: Props) {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const [findRoomStatus, setFindRoomStatus] = useState<
    "notFound" | "loading" | "found"
  >("notFound");
  const [roomId, setRoomId] = useState("X-C");
  const roomsRef = collection(fireStore, "rooms");

  const findRoom = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event?.preventDefault();
    }
    setFindRoomStatus("loading");

    const q = query(roomsRef, where("roomId", "==", roomId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      setFindRoomStatus("notFound");
      toast.error("Room not found");
      return;
    }
    setRoomIdStore({ roomId });
    setFindRoomStatus("found");
  };
  useMemo(() => {
    if (roomIdStore.roomId) {
      setRoomId(roomIdStore.roomId);
      setFindRoomStatus("found");
    }
  }, [roomIdStore]);
  
  return (
    <>
      {/* search bar */}
      <form
        onSubmit={(event) => findRoom(event)}
        className="flex max-w-[50rem] justify-center items-center w-full mx-auto py-5 gap-5 px-3"
      >
        <input
          placeholder="Room ID : X-Cxxxx"
          onChange={(e) => setRoomId(e.target.value.trim())}
          value={roomId}
          className="input w-full border-1 border-base-content focus:outline-none"
          type="text"
        />
        <button className="btn btn-outline btn-base-100">Join room</button>
      </form>
      {findRoomStatus === "loading" ? (
        <Loading />
      ) : findRoomStatus === "found" ? (
        // <RoomIdContext.Provider value={{ roomId }}>
          props.children
        // {/* </RoomIdContext.Provider> */}
      ) : null}
    </>
  );
}
