import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { fireStore } from "../configs/firebase";
import "../css/chatBox.css";
import useSession from "../hooks/useSession";
import { MessageInterface } from "../interfaces/message";
import { roomIdAtom } from "../stores/roomIdStore";
import Message from "./messages";

export default function ChatBox() {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const roomId = roomIdStore.roomId;
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const { userData: session } = useSession();
  let scrollIntoView = useRef<boolean>(true);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    if (!session) return;
    const lastMessage = messages[messages.length - 1];
    const userUID = session?.uid;
    setTimeout(() => {
      if (scrollIntoView.current) {
        scroll.current?.scrollIntoView();
      } else if (lastMessage.uid === userUID) {
        scroll.current?.scrollIntoView();
      }
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;
    const roomCollection = collection(fireStore, "rooms");

    const roomRef = doc(roomCollection, roomId);
    const messageCollection = collection(roomRef, "messages");
    const q = query(messageCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (doc: any) => {
      const message2: MessageInterface[] = [];
      doc.forEach(async (x: any) => {
        message2.push({ ...x.data(), id: x.id });
      });
      setMessages(message2);
    });
    return () => unsub();
  }, [roomId]);

  return (
    <>
      <div
        className="flex h-screen overflow-auto chat-scroll"
        onScroll={(e: any) => {
          scrollIntoView.current =
            Math.ceil(e.target.scrollTop) >=
            e.target.scrollHeight - e.target.offsetHeight;
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
