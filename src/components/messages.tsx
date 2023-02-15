import moment from "moment";
import useSession from "../hooks/useSession";
import { MessageInterface } from "./../interfaces/message";

const Message = (message: MessageInterface) => {
  const { userData: session } = useSession();

  const ShowDate = (props: {}) => {
    if (!message.displayDate) return <></>;
    const date = message.displayDate.split(" ");
    const today = date[0] === moment().format("DD/MM/YYYY");
    return (
      <div
        className={`flex ${
          message.uid === session?.uid ? "justify-end" : "justify-start"
        }   `}
      >
        {today ? `today ${date[1]}` : message.displayDate}
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex w-full  ${
          message.uid === session?.uid ? "justify-end" : "justify-start"
        }`}
      >
        <div className="flex-wrap max-w-[50%] ">
          {/* <img
            className="chat-bubble w-5"
            src="https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ype8x0zkqbv239asgx9p/%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B8%A7%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B8%E0%B8%81%E0%B9%84%E0%B8%AD%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%A1%E0%B8%88%E0%B8%B5%20%E0%B9%80%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%94%E0%B9%8C%20%E0%B8%AD%E0%B8%AD%E0%B8%9F%20%E0%B9%81%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%A7%E0%B8%99%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A3%E0%B9%8C%20(IMG%20Worlds%20of%20Adventure)%20%E0%B9%83%E0%B8%99%E0%B8%94%E0%B8%B9%E0%B9%84%E0%B8%9A.jpg"
            alt="user avatar"
          /> */}
          <p
            className={`px-1 py-1 ${
              message.uid === session?.uid ? "text-right " : "text-left"
            }`}
          >
            {message.displayName}
          </p>
          <div className="block p-3 bg-base-content  rounded-lg">
            <p className="text-base-100 flex break-all justify-center">
              {message.text}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <span className="text-[15px]">
          <ShowDate />
        </span>
      </div>
    </>
  );
};
// Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora facilis repellendus quasi architecto, mollitia illum dolore enim aperiam tempore dicta doloribus optio dolor dignissimos id facere amet veniam inventore ab atque velit consequuntur cumque! Mollitia alias dignissimos suscipit voluptatem illo expedita deleniti ducimus! Praesentium saepe quas nihil commodi sit iusto.
export default Message;
