import moment from "moment";
import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import { MessageInterface } from "./../interfaces/message";
import axios from "axios";
import { OgInterface } from "../interfaces/og";
import { Link } from "react-router-dom";
import { roomDataAtom } from "../stores/roomDataStore";
import { useRecoilState } from "recoil";
import DOMPurify from "dompurify";

const Message = (message: MessageInterface) => {
  const { userData: session } = useSession();
  const [roomDataStore, setRoomDataStore] = useRecoilState(roomDataAtom);

  const [_message, setMessage] = useState<string>(message.text);

  const [isUrl, setIsUrl] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [urlData, setUrlData] = useState<OgInterface | null>(null);

  const [isImage, setIsImage] = useState(false);
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
    if (!match) return;
    const isImage = await axios.get(`https://corsproxy.io/?${match[0]}`);

    if (isImage.headers["content-type"].includes("image")) {
      const sanitizedHtml = DOMPurify.sanitize(
        message.text.replace(match[0], `<img style="margin: 5px 0 5px;" class="text-primary hover:underline" src="${match[0]}" />`),
        {
          ALLOWED_TAGS: ["img"],
        }
      );
      setMessage(sanitizedHtml);
      setUrl(match[0]);
      setIsImage(true);
    } else {
      const sanitizedHtml = DOMPurify.sanitize(
        message.text.replace(
          match[0],
          `<a style="margin: 0px 2px;" class="text-primary hover:underline" href="${match[0]}" target="_blank" >${match[0]}</a>`
        ),
        {
          ALLOWED_TAGS: ["a"],
        }
      );
      setMessage(sanitizedHtml);
      setIsUrl(true);
      setUrl(match[0]);
      const resp = await axios.post(
        "https://x-chat-backend.vercel.app/checkIsUrl",
        {
          url: match[0],
        }
      );
      setUrlData(resp.data);
    }
  };

  useEffect(() => {
    checkUrl();
    if(!roomDataStore.isDevelop){
      const sanitizedHtml = DOMPurify.sanitize(message.text, {
        ALLOWED_TAGS: [],
      });
      setMessage(sanitizedHtml);
    }
  }, []);

  return (
    <>
    <div className="text-primary hover:underline hidden" ></div>
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
          <div className="block p-2 bg-base-content rounded-lg">
            <p
              className="text-base-100 flex break-all justify-center"
              dangerouslySetInnerHTML={{ __html: _message }}
            />
          </div>
          {/* {isImage && url ? (
            <div className=" p-2 mt-2  w-[100%] ">
              <div className="flex flex-col text-base-100 break-all justify-center items-center p-2">
                <img alt={`null`} src={url} />
              </div>
            </div>
          ) : null} */}
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
    </>
  );
};
// Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora facilis repellendus quasi architecto, mollitia illum dolore enim aperiam tempore dicta doloribus optio dolor dignissimos id facere amet veniam inventore ab atque velit consequuntur cumque! Mollitia alias dignissimos suscipit voluptatem illo expedita deleniti ducimus! Praesentium saepe quas nihil commodi sit iusto.
export default Message;
