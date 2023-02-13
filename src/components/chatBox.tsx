import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { fireStore } from "../configs/firebase";
import "../css/chatBox.css";
import useSession from "../hooks/useSession";
import { MessageInterface } from "../interfaces/message";
import Message from "./messages";

export default function ChatBox() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const { userData: session } = useSession();
  let scrollIntoView = useRef<boolean>(true);
  const scroll = useRef<HTMLDivElement>(null);
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
      console.log(scrollIntoView.current); // TODO
      if (scrollIntoView.current) { // && session && message2[message2.length - 1].uid !== session?.uid
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      }
      // console.log(message2[message2.length - 1].uid, session?.uid);
      
      setMessages(message2);
    });
  }, []);

  return (
    <>
      <div
        className="flex h-screen overflow-auto chat-scroll"
        onScroll={(e: any) => {
          scrollIntoView.current =
            Math.ceil(e.target.scrollTop) >=
            e.target.scrollHeight - e.target.offsetHeight;
          // console.log(scrollIntoView.current);
          
        }}
      >
        <div className="rounded-xl w-full px-1 flex flex-col gap-1">
          {messages?.map((message: MessageInterface) => (
            <Message key={message.id} {...message} />
          ))}
          <div ref={scroll}></div>
        </div>
      </div>
    </>
  );
}
