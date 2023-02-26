import clsx from "clsx";
import { useRecoilState } from "recoil";
import { MyRoomInterface } from "../interfaces/myRoom";
import { RoomIdInterface } from "../interfaces/roomId";
import { roomDataAtom } from "../stores/roomDataStore";
import { LoadingFreePosition } from "./loading";
import "../css/myRoom.css";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-hot-toast";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { fireStore } from "../configs/firebase";
import { Box, Modal } from "@mui/material";
import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  findRoomCreatedStatus: string;
  myRoomData: MyRoomInterface[] | null;
}

export default function MyRoom(props: Props) {
  const [roomDataStore, setRoomDataStore] = useRecoilState(roomDataAtom);
  const [roomData, setRoomData] = useState<{
    roomId: string;
    roomName: string;
  }>({
    roomId: "",
    roomName: "",
  });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleOpen = (isOpen: boolean, roomData: MyRoomInterface) => {
    setOpen(isOpen);
    setRoomData(roomData);
  };
  const handleClose = () => {
    setOpen(false);
    setRoomData({ roomId: "", roomName: "" });
  };
  const goToRoomChat = (roomData: RoomIdInterface) => {
    setRoomDataStore(roomData);
  };

  const copyRoomId = (roomId: string) => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const deleteRoomId = async (
    e: React.FormEvent<HTMLFormElement>,
    roomId: string
  ) => {
    e.preventDefault();
    toast.success("Room deleted!");
    handleClose();
    const roomCollection = collection(fireStore, "rooms");
    const roomRef = doc(roomCollection, roomId);
    const message = collection(roomRef, "messages");
    const query = await getDocs(message);
    query.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    await deleteDoc(roomRef);
  };
  const handleClickOutside = () => {
    handleClose();
  };
  useOnClickOutside(ref, handleClickOutside);
  return (
    <>
      {props.findRoomCreatedStatus === "loading" ? (
        <div>
          <LoadingFreePosition />
        </div>
      ) : props.findRoomCreatedStatus === "found" ? (
        <>
          <span className="text-center">
            Total {props.myRoomData?.length} chat rooms.
          </span>
          <div className="max-h-[45vh] overflow-y-scroll my-room-scroll p-3">
            <div className="flex flex-col gap-5 ">
              {props.myRoomData?.map((x) => (
                <div className="flex gap-3 p-2 justify-center" key={x.id}>
                  <input
                    className={clsx(
                      "w-[60%] btn",
                      roomDataStore.roomId === x.roomId
                        ? "bg-base-content text-base-300 hover:bg-base-content"
                        : "btn-outline "
                    )}
                    type="button"
                    onClick={() =>
                      goToRoomChat({ roomId: x.roomId, roomName: x.roomName, isDevelop: x.isDevelop })
                    }
                    value={x.roomName}
                  />
                  <button
                    className="btn btn-outline w-auto hover:bg-blue-700 hover:border-blue-700"
                    onClick={() => copyRoomId(x.roomId)}
                  >
                    <AttachmentIcon />
                  </button>
                  <button
                    className="btn btn-outline w-auto hover:bg-red-700 hover:border-red-700"
                    onClick={() => handleOpen(true, x)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              ))}
              {open ? (
                <>
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-base-300/40 z-0 flex justify-center items-center">
                    <form
                      ref={ref}
                      // onClick={() => console.log("clicked")}
                      className=""
                      onSubmit={(e) => deleteRoomId(e, roomData.roomId)}
                    >
                      <div className="flex justify-center items-center h-full w-full">
                        <div className="flex flex-col gap-5 rounded-lg shadow-md shadow-base-content/60 justify-center items-center bg-base-content text-base-300 max-w-[35rem] w-full px-5 py-5 m-2">
                          <h1 className="text-2xl font-bold base-content">
                            Do you want to delete this{" "}
                            <span className="badge">{roomData.roomName}</span>{" "}
                            room?
                          </h1>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="btn btn-base-300 btn-sm"
                            >
                              <DeleteOutlineIcon />
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
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <span className="text-center">Try creating a chat room now!</span>
      )}
    </>
  );
}
