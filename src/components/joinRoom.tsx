import CloseIcon from "@mui/icons-material/Close";
import KeyIcon from "@mui/icons-material/Key";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { useOnClickOutside } from "usehooks-ts";
import { fireStore } from "../configs/firebase";
import { roomDataAtom } from "../stores/roomDataStore";
import { Loading } from "./loading";

interface Props {
  children: React.ReactNode;
}
export default function JoinRoom(props: Props) {
  const [roomDataStore, setRoomDataStore] = useRecoilState(roomDataAtom);
  const [roomData, setRoomData] = useState<{roomId: string, roomName: string, isDevelop: boolean}>({
    roomId: "",
    roomName: "",
    isDevelop: false,
  });
  const [roomPassword, setRoomPassword] = useState("");
  const [password, setPassword] = useState("");
  const [findRoomStatus, setFindRoomStatus] = useState<
    "notFound" | "loading" | "found" | "enterPassword"
  >("notFound");
  const [roomId, setRoomId] = useState("X-C");
  const roomsRef = collection(fireStore, "rooms");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClose = () => {
    setPassword("");
    setRoomPassword("");
    setFindRoomStatus("notFound");
    setOpen(false);
  };
  const checkPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      toast.error("Password can't be empty");
      return;
    }
    if (password === roomPassword) {
      setRoomDataStore({ roomId: roomData.roomId, roomName: roomData.roomName, isDevelop: roomData.isDevelop });
      setRoomPassword("");
      setPassword("");
      setFindRoomStatus("found");
    } else {
      toast.error("Incorrect Password");
    }
    setPassword("");
  };
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
    setRoomData({ roomId: querySnapshot.docs[0].data().roomId, roomName: querySnapshot.docs[0].data().roomName, isDevelop: querySnapshot.docs[0].data().isDevelop });
    if (!querySnapshot.docs[0].data().password) {
      setRoomPassword(querySnapshot.docs[0].data().password);
      setRoomDataStore({ roomId: roomData.roomId, roomName: roomData.roomName, isDevelop: roomData.isDevelop });
      setFindRoomStatus("found");
    } else {
      setRoomPassword(querySnapshot.docs[0].data().password);
      setOpen(true);
      setFindRoomStatus("enterPassword");
    }
  };
  const handleClickOutside = () => {
    handleClose();
  };
  useOnClickOutside(ref, handleClickOutside);

  useMemo(() => {
    if (roomDataStore.roomId) {
      setRoomId(roomDataStore.roomId);
      setFindRoomStatus("found");
    }
  }, [roomDataStore]);

  return (
    <>
      {/* search bar */}
      <form
        onSubmit={(event) => findRoom(event)}
        className="flex max-w-[50rem] justify-center items-center mx-auto py-5 gap-5 px-3"
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
      ) : findRoomStatus === "enterPassword" ? (
        <>
          <>
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-base-300/40 z-0 flex justify-center items-center">
              <form
                ref={ref}
                // onClick={() => console.log("clicked")}
                className="w-[50%]"
                onSubmit={(e) => checkPassword(e)}
              >
                <div className="flex justify-center items-center h-full w-full">
                  <div className="flex flex-col gap-5 rounded-lg shadow-md shadow-base-content/60 justify-center items-center bg-base-content text-base-300 max-w-[30rem] w-full px-5 py-5 m-2">
                    <h1 className="text-2xl font-bold base-content">
                      Enter password
                    </h1>
                    <input
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.trim())}
                      className="input text-base-content w-[80%] border-1 border-base-content focus:outline-none"
                      type="password"
                    />
                    {/* cancel */}
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-base-300 btn-sm">
                        <KeyIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-base-300 btn-sm"
                        onClick={() => handleClose()}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        </>
      ) : findRoomStatus === "found" ? (
        // <RoomIdContext.Provider value={{ roomId }}>
        props.children
      ) : // {/* </RoomIdContext.Provider> */}
      null}
    </>
  );
}
