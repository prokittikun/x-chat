import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { fireStore } from "../configs/firebase";
import RoomIdContext from "../stores/roomIdContext";
import KeyIcon from "@mui/icons-material/Key";
import { Loading } from "./loading";
import { roomIdAtom } from "../stores/roomIdStore";
import { Box, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
interface Props {
  children: React.ReactNode;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  boxShadow: 24,
  p: 4,
};
export default function JoinRoom(props: Props) {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const [roomPassword, setRoomPassword] = useState("");
  const [password, setPassword] = useState("");
  const [findRoomStatus, setFindRoomStatus] = useState<
    "notFound" | "loading" | "found" | "enterPassword"
  >("notFound");
  const [roomId, setRoomId] = useState("X-C");
  const roomsRef = collection(fireStore, "rooms");
  const [open, setOpen] = useState(false);
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
      setRoomPassword("");
      setPassword("");
      setRoomIdStore({ roomId });
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
    if (!querySnapshot.docs[0].data().password) {
      setRoomPassword(querySnapshot.docs[0].data().password);
      setRoomIdStore({ roomId });
      setFindRoomStatus("found");
    } else {
      setRoomPassword(querySnapshot.docs[0].data().password);
      setOpen(true);
      setFindRoomStatus("enterPassword");
    }
  };
  useMemo(() => {
    if (roomIdStore.roomId) {
      setRoomId(roomIdStore.roomId);
      setFindRoomStatus("found");
    }
  }, [roomIdStore]);

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
          <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
              <form
                className="absolute top-0 bottom-0 left-0 right-0 "
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
                      className="input text-base-content w-[50%] border-1 border-base-content focus:outline-none"
                      type="password"
                    />
                    {/* cancel */}
                    <div className="flex gap-2">
                      <button type="button" className="btn btn-base-300 btn-sm" onClick={()=>handleClose()}>
                        <CloseIcon />
                      </button>
                      <button type="submit" className="btn btn-base-300 btn-sm">
                        <KeyIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Box>
          </Modal>
          {/* <div 
            className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-[1px] bg-base-300/40 z-5"
            open={open}
            onClose={handleClose}
          ></div>
          <form
            className="absolute top-0 bottom-0 left-0 right-0 "
            onSubmit={(e) => checkPassword(e)}
          >
            <div className="flex justify-center items-center h-full z-1">
              <div className="flex flex-col gap-5 rounded-lg shadow-md shadow-base-content/60 justify-center items-center bg-base-content text-base-300 max-w-[30rem] w-full px-5 py-5 m-2">
                <h1 className="text-2xl font-bold base-content">
                  Enter password
                </h1>
                <input
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  className="input text-base-content w-[50%] border-1 border-base-content focus:outline-none"
                  type="password"
                />
                <button type="submit" className="btn btn-base-300 btn-sm">
                  <KeyIcon />
                </button>
              </div>
            </div>
          </form> */}
        </>
      ) : findRoomStatus === "found" ? (
        // <RoomIdContext.Provider value={{ roomId }}>
        props.children
      ) : // {/* </RoomIdContext.Provider> */}
      null}
    </>
  );
}
