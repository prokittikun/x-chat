import clsx from "clsx";
import { useRecoilState } from "recoil";
import { MyRoomInterface } from "../interfaces/myRoom";
import { RoomIdInterface } from "../interfaces/roomId";
import { roomIdAtom } from "../stores/roomIdStore";
import { LoadingFreePosition } from "./loading";
import "../css/myRoom.css";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-hot-toast";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { fireStore } from "../configs/firebase";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  findRoomCreatedStatus: string;
  myRoomData: MyRoomInterface[] | null;
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
export default function MyRoom(props: Props) {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const [roomIdDelete, setRoomIdDelete] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean, roomId: string) => {
    setOpen(isOpen);
    setRoomIdDelete(roomId);
  };
  const handleClose = () => {
    setOpen(false);
    setRoomIdDelete("");
  };
  const goToRoomChat = (roomData: RoomIdInterface) => {
    setRoomIdStore(roomData);
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
    const roomCollection = collection(fireStore, "rooms");
    await deleteDoc(doc(roomCollection, roomId));
    toast.success("Room deleted!");
    handleClose();
  };
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
                      roomIdStore.roomId === x.roomId
                        ? "bg-base-content text-base-300 hover:bg-base-content"
                        : "btn-outline "
                    )}
                    type="button"
                    onClick={() => goToRoomChat({ roomId: x.roomId })}
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
                    onClick={() => handleOpen(true, x.roomId)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              ))}
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
                    onSubmit={(e) => deleteRoomId(e, roomIdDelete)}
                  >
                    <div className="flex justify-center items-center h-full w-full">
                      <div className="flex flex-col gap-5 rounded-lg shadow-md shadow-base-content/60 justify-center items-center bg-base-content text-base-300 max-w-[30rem] w-full px-5 py-5 m-2">
                        <h1 className="text-2xl font-bold base-content">
                          Do you want to delete this room?
                        </h1>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-base-300 btn-sm"
                            onClick={() => handleClose()}
                          >
                            <CloseIcon />
                          </button>
                          <button
                            type="submit"
                            className="btn btn-base-300 btn-sm"
                          >
                            <DeleteOutlineIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Box>
              </Modal>
            </div>
          </div>
        </>
      ) : (
        <span className="text-center">Try creating a chat room now!</span>
      )}
    </>
  );
}
