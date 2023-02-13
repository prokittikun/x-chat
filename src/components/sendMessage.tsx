import React, { useState } from "react";
import { auth, fireStore } from "../configs/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import useSession from "../hooks/useSession";
import toast from "react-hot-toast";

const SendMessage = ({ scroll }: any) => {
  //{ scroll }
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
    const roomRef = doc(roomCollection, "X-C999");
    const messageCollection = collection(roomRef, "messages");
    addDoc(messageCollection, {
      text: message,
      name: userData?.email,
      avatar: null,
      createdAt: serverTimestamp(),
      uid: uid,
    });
    // setMessage("");
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