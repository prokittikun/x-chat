import { orderByChild } from "firebase/database";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { fireStore } from "../configs/firebase";
import { MessageInterface } from "../interfaces/message";
import Message from "./messages";

export default function ChatBox() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  // const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roomCollection = collection(fireStore, "rooms");
    const roomRef = doc(roomCollection, "X-C999");
    const messageCollection = collection(roomRef, "messages");
    const q = query(messageCollection, orderBy("createdAt", "asc"));
    onSnapshot(q, (doc: any) => {
      const message2: MessageInterface[] = [];
      doc.forEach((x: any) => {
        // console.log(x.data());
        message2.push({ ...x.data(), id: x.id });
      });
      setMessages(message2);
      // scroll.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-full max-h-70 overflow-auto">
        <div className=" rounded-xl w-full h-full max-h-80 px-1 flex flex-col gap-5">
          {messages?.map((message: any) => (
            <Message key={message.id} {...message} />
          ))}
          {/* <div ref={scroll}></div> */} 
          {/* TODO */}
        </div>
      </div>
    </>
  );
}
