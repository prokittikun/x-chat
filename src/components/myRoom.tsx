import clsx from "clsx";
import { useRecoilState } from "recoil";
import { MyRoomInterface } from "../interfaces/myRoom";
import { RoomIdInterface } from "../interfaces/roomId";
import { roomIdAtom } from "../stores/roomIdStore";
import { LoadingFreePosition } from "./loading";

interface Props {
  findRoomCreatedStatus: string;
  myRoomData: MyRoomInterface[] | null;
}

export default function MyRoom(props: Props) {
  const [roomIdStore, setRoomIdStore] = useRecoilState(roomIdAtom);
  const goToRoomChat = (roomData: RoomIdInterface) => {
    setRoomIdStore(roomData);
  };

  return (
    <>
      {props.findRoomCreatedStatus === "loading" ? (
        <div>
          <LoadingFreePosition />
        </div>
      ) : props.findRoomCreatedStatus === "found" ? (
        props.myRoomData?.map((x) => (
          <input
            key={x.id}
            className={clsx(
              "w-full btn",
              roomIdStore.roomId === x.roomId
                ? "bg-base-content text-base-300"
                : "btn-outline "
            )}
            type="button"
            onClick={() => goToRoomChat({ roomId: x.roomId })}
            value={x.roomName}
          />
        ))
      ) : (
        <span>Try creating a chat room now!</span>
      )}
    </>
  );
}
