import { Controls, Player } from "@lottiefiles/react-lottie-player";

export default function Loading() {
  
  return (
    <div className="absolute z-50 top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <Player
          autoplay
          loop
          src="https://assets1.lottiefiles.com/packages/lf20_gbfwtkzw.json"
          style={{ height: "200px", width: "200px" }}
        >
          <Controls
            visible={false}
            buttons={["play", "repeat", "frame", "debug"]}
          />
        </Player>
        <div className="text-xl font-bold">Loading...</div>
      </div>
    </div>
  );
}
