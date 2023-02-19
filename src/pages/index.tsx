import { useEffect, useMemo, useRef, useState } from "react";
import ChatBox from "../components/chatBox";
import JoinRoom from "../components/joinRoom";
import Navbar from "../components/navbar";
import SendMessage from "./../components/sendMessage";
import CreatedRoom from "./../components/createdRoom";
import MyRoom from "../components/myRoom";
import { useRecoilState } from "recoil";
import { roomIdAtom } from "../stores/roomIdStore";
import { MyRoomInterface } from "../interfaces/myRoom";
import useSession from "../hooks/useSession";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { RoomIdInterface } from "../interfaces/roomId";
import { fireStore } from "../configs/firebase";

export default function Index() {
  const scroll = useRef<HTMLSpanElement>(null);
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const [findRoomCreatedStatus, setFindRoomCreatedStatus] = useState<
    "notFound" | "loading" | "found"
  >("notFound");
  const { userData } = useSession();
  const [myRoomData, setMyRoomData] = useState<MyRoomInterface[] | null>(null);

  const findMyRoom = async () => {
    if (userData) {
      if (myRoomData?.length === 0) {
        setFindRoomCreatedStatus("loading");
      }
      const roomsRef = collection(fireStore, "rooms");
      const q = query(roomsRef, where("host", "==", userData?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        setFindRoomCreatedStatus("notFound");
        return;
      }
      onSnapshot(q, (doc: any) => {
        const myRoomTemp: MyRoomInterface[] = [];
        doc.forEach(async (x: any) => {
          myRoomTemp.push({ ...x.data(), id: x.id });
        });
        // if(myRoomTemp.length === 0){
        //   setFindRoomCreatedStatus("notFound");
        //   return;
        // }
        setMyRoomData(myRoomTemp);
      });
      setFindRoomCreatedStatus("found");
    } else {
      setFindRoomCreatedStatus("notFound");
    }
  };
  useEffect(() => {
    findMyRoom();
  }, [userData]);
  return (
    <>
      <div className="h-screen  ">
        <Navbar />
        <div className="flex overflow-hidden">
          <div className="hidden w-[25rem] md:block ">
            {/* <div className=" w-full ">ssssss</div> */}
          </div>
          <div className="flex-col items-center justify-center mx-auto w-[50rem] max-w-[50rem]">
            <JoinRoom>
              <div className="bg-secondary-focus flex flex-col h-full max-h-[75vh] rounded-xl max-w-[50rem] w-full my-3 mt-3 px-5 gap-5 py-3">
                <ChatBox />
                <SendMessage scroll={scroll} />
              </div>
            </JoinRoom>
          </div>
          <div className="hidden w-[25rem] md:block">
            <div className="flex flex-col max-w-[50rem] justify-center items-center w-full mx-auto  gap-5 px-3">
              <CreatedRoom onCreatedRoom={findMyRoom} />
              <div className="flex flex-col w-full py-1 gap-5 px-3">
                <MyRoom
                  findRoomCreatedStatus={findRoomCreatedStatus}
                  myRoomData={myRoomData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
