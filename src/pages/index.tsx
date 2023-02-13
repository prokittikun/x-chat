import { useRef } from "react";
import ChatBox from "../components/chatBox";
import JoinRoom from "../components/joinRoom";
import Navbar from "../components/navbar";
import SendMessage from "./../components/sendMessage";

export default function Index() {
  const scroll = useRef<HTMLSpanElement>(null);
  return (
    <>
      <div className="flex flex-col h-screen items-center">
        <Navbar />
        <JoinRoom>
          <div className="bg-base-200 flex flex-col h-full rounded-xl max-w-[50rem] w-full my-3 mt-3 px-5 gap-5 py-3">
            <ChatBox />
            <SendMessage scroll={scroll} />
          </div>
        </JoinRoom>
      </div>
    </>
  );
}
