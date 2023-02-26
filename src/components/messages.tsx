import moment from "moment";
import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import { MessageInterface } from "./../interfaces/message";
import axios from "axios";
import { OgInterface } from "../interfaces/og";
import { Link } from "react-router-dom";
const Message = (message: MessageInterface) => {
  const { userData: session } = useSession();
  const [isUrl, setIsUrl] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [urlData, setUrlData] = useState<OgInterface | null>(null);
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

  const checkUrl = async () => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const text = message.text;
    const match = text.match(regex);
    if (match) {
      setIsUrl(true);
      setUrl(match[0]);
      const resp = await axios.post("https://x-chat-backend.vercel.app/checkIsUrl", {
        url: match[0],
      });
      setUrlData(resp.data);
    }
  };

  useEffect(() => {
    checkUrl();
  }, []);

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
          ) : (
            <div className="px-1 py-3 "></div>
          )}
          <div className="block p-2 bg-base-content  rounded-lg">
            <p className="text-base-100 flex break-all justify-center">
              {message.text}
            </p>
          </div>
          {isUrl && urlData && url ? (
            <Link to={url} target="_blank">
              <div className="block p-2 bg-base-content  rounded-lg mt-2">
                <p className="text-base-100 flex break-all justify-center">
                  {urlData.ogTitle
                    ? urlData.ogTitle
                    : url.substring(0, 50) + "..."}
                </p>
                <hr className="border-base-300" />
                <div className="flex flex-col text-base-100 break-all justify-center items-center p-2">
                  {urlData.ogDescription ? (
                    <div className="">
                      {urlData.ogDescription.substring(0, 60) + "..."}
                    </div>
                  ) : null}
                  {Array.isArray(urlData.ogImage) ? (
                    <img
                      alt={`null`}
                      src={urlData.ogImage[0].url}
                      width={urlData.ogImage[0].width}
                    />
                  ) : typeof urlData.ogImage === "object" ? (
                    <img
                      alt={`null`}
                      src={urlData.ogImage.url}
                      width={urlData.ogImage.width}
                    />
                  ) : (
                    <img alt={``} width={"30px"} src={urlData.favicon} />
                  )}
                </div>
              </div>
            </Link>
          ) : null}
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
