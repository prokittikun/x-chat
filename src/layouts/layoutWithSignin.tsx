import useSession from "../hooks/useSession";
import React, { useEffect } from "react";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";
interface Props {
  children: React.ReactNode;
}
export default function LayoutWithSignIn(props: Props) {
  const { status } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "unauth") {
      navigate("/signin");
    }
  }, [status]);

  return <>{status === "auth" ? props.children : <Loading />}</>;
  // return status === "loading" ? (
  //   <Loading />
  // ) : status === "auth" ? (
  //   props.children
  // ) : "";
}
