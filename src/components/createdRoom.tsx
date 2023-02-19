import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { fireStore } from "../configs/firebase";
import useSession from "../hooks/useSession";
import generateString from "../services/generateString";
interface Props {
  onCreatedRoom: () => void;
}

export default function CreatedRoom(props: Props) {
  const [havePassword, setHavePassword] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const { userData } = useSession();

  const createdRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (roomName === "") {
      toast.error("Room name is required");
      return;
    } else if (havePassword && roomPassword === "") {
      toast.error("Password is required");
      return;
    }
    const stringGenerate = generateString();
    setRoomId("X-C" + stringGenerate);
  };
  useMemo(async () => {
    const roomCollection = collection(fireStore, "rooms");
    if (roomId) {
      await setDoc(doc(roomCollection, roomId), {
        roomId: roomId,
        host: userData?.uid,
        roomName: roomName,
        password: roomPassword,
        createdAt: serverTimestamp(),
        displayDate: moment().format("DD/MM/YYYY HH:mm"),
      });
      props.onCreatedRoom();
    }
  }, [roomId]);

  return (
    <>
      {/* search bar */}
      <form
        onSubmit={(event) => createdRoom(event)}
        className="flex flex-col max-w-[50rem] justify-center items-center w-full mx-auto py-5 gap-5 px-3"
      >
        <input
          placeholder="Room name"
          onChange={(e) => setRoomName(e.target.value)}
          className="input w-full border-1 border-base-content focus:outline-none"
          type="text"
        />
        {havePassword ? (
          <input
            placeholder="Password"
            onChange={(e) => setRoomPassword(e.target.value)}
            className="input w-full border-1 border-base-content focus:outline-none"
            type="password"
          />
        ) : null}
        <label className="cursor-pointer label gap-1">
          <input
            type="checkbox"
            className="checkbox checkbox-warning"
            onChange={() => {
              setRoomPassword(null);
              setHavePassword(!havePassword);
            }}
          />
          <span className="label-text">Password</span>
        </label>
        <button className="btn w-full btn-outline btn-base-100">Create</button>
        <div className="inline-flex items-center justify-center w-full">
          <div className="w-full  my-2 border-base-content border" />
        </div>
      </form>
    </>
  );
}
