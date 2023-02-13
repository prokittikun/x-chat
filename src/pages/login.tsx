import LoginIcon from "@mui/icons-material/Login";
import { TextField } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "./../components/loading";
import { auth } from "./../configs/firebase";
import useSession from "./../hooks/useSession";

export default function Login() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { userData: session, status } = useSession();
  useEffect(() => {
    if (session) {
      console.log(session);
      navigate("/");
    }
  }, [session]);

  const login = async () => {
    if (!email.current || !password.current) return;
    if (!email.current.value || !password.current.value)
      return toast.error("email or password can not be empty");
    try {
      const respUser = await signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );
      navigate("/");
      console.log(respUser.user);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") toast.error("User not found");
      else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email"
      ) {
        toast.error("email or password is invalid");
      }
      console.log(error);
    }
  };

  return status === "loading" ? (
    <Loading />
  ) : status === "unauth" ? (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <div className="max-w-[30rem] w-full px-5 flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-left base-content">LOGIN</h1>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            label="Username"
            variant="outlined"
            autoComplete="off"
            inputRef={email}
          />
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            autoComplete="off"
            inputRef={password}
          />
          <button className="btn btn-secondary text-white" onClick={login}>
            <LoginIcon />
          </button>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
