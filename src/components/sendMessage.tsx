import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fireStore } from "../configs/firebase";
import RoomIdContext from "../stores/roomIdContext";
import useSession from "../hooks/useSession";
import { useRecoilState } from "recoil";
import { roomIdAtom } from "../stores/roomIdStore";

const SendMessage = ({ scroll }: any) => {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState("");
  const { userData } = useSession();
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }
    const uid = userData?.uid;
    const roomCollection = collection(fireStore, "rooms");
    const roomRef = doc(roomCollection, roomIdStore.roomId);
    const messageCollection = collection(roomRef, "messages");

    addDoc(messageCollection, {
      text: message,
      displayName: userData?.displayName,
      avatar: null,
      createdAt: serverTimestamp(),
      displayDate: moment().format("DD/MM/YYYY HH:mm"),
      uid: uid,
      roomId: roomIdStore.roomId,
    });
    setMessage("");
  };
  
  return (
    // <div className="w-full py-5 ">
    <>
      <form
        onSubmit={(event) => sendMessage(event)}
        className="py-5 flex gap-5"
      >
        <label htmlFor="messageInput" hidden>
          Enter Message
        </label>
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className="w-full input focus:outline-none"
          autoComplete="off"
          placeholder="type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-outline btn-base-100">SEND</button>
      </form>
      {/* </div> */}
    </>
  );
};

export default SendMessage;
