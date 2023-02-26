import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { fireStore } from "../configs/firebase";
import useSession from "../hooks/useSession";
import { roomDataAtom } from "../stores/roomDataStore";
import { debounce } from "lodash";

const SendMessage = () => {
  const [roomDataStore, setRoomDataStore] = useRecoilState(roomDataAtom);
  // const [sendStatus, setSendStatus] = useState<"sending" | "sent">("sent");
  const [message, setMessage] = useState("");
  const { userData } = useSession();
  const sendMessageData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
      toast.error("Message can't be empty");
      return;
    }
    const uid = userData?.uid;
    const tempMessage = message;
    setMessage("");
    const roomCollection = collection(fireStore, "rooms");
    const roomRef = doc(roomCollection, roomDataStore.roomId);
    const docRoomRef = await getDoc(roomRef);
    if (!docRoomRef.exists()) {
      toast.error("The room could not be found or it may have been deleted.");
      return;
    }
    const messageCollection = collection(roomRef, "messages");
    
    await addDoc(messageCollection, {
      text: tempMessage,
      displayName: userData?.displayName,
      avatar: null,
      createdAt: serverTimestamp(),
      displayDate: moment().format("DD/MM/YYYY HH:mm"),
      uid: uid,
    });
  };
  useEffect(() => {
    setMessage("");
  }, [roomDataStore]);

  return (
    // <div className="w-full py-5 ">
    <>
      <form
        onSubmit={(event) => {
          sendMessageData(event);
        }}
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
