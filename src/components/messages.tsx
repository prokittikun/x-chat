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
        {today ? `Today ${date[1]}` : message.displayDate}
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex w-full gap-2 ${
          message.uid === session?.uid
            ? "flex-row justify-end"
            : "flex-row-reverse justify-end"
        }`}
      >
        <div className="top-0 bottom-0 right-0 left-0 mt-auto ">
          <span className="text-[10px]">
            <ShowDate />
          </span>{" "}
        </div>
        <div className="flex-wrap flex-col max-w-[50%]">
          {message.uid !== session?.uid ? (
            <p
              className={`px-1 py-1 ${
                message.uid === session?.uid ? "text-right " : "text-left"
              }`}
            >
              {message.displayName}
            </p>
          ) : <div className="px-1 py-3"></div>}
          <div className="block p-2 bg-base-content  rounded-lg">
            <p className="text-base-100 flex break-all justify-center">
              {message.text}
            </p>
          </div>
        </div>
      </div>
      {/* <div
        className={`flex w-full  ${
          message.uid === session?.uid ? "justify-end" : "justify-start"
        }`}
      >
        <div className="flex-wrap max-w-[50%] ">
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
      <span className="text-[12px]">
        <ShowDate />
      </span> */}
    </>
  );
};
// Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora facilis repellendus quasi architecto, mollitia illum dolore enim aperiam tempore dicta doloribus optio dolor dignissimos id facere amet veniam inventore ab atque velit consequuntur cumque! Mollitia alias dignissimos suscipit voluptatem illo expedita deleniti ducimus! Praesentium saepe quas nihil commodi sit iusto.
export default Message;
