import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { TextField } from "@mui/material";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./../components/loading";
import { auth } from "./../configs/firebase";
import useSession from "./../hooks/useSession";

export default function Register() {
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

  const register = async () => {
    if (!email.current || !password.current) return;
    try {
      const respCreatedUser = await createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );
      signOut(auth);
      navigate("/signin");
      console.log(respCreatedUser.user);
    } catch (error: any) {
      console.log(error.code, error.message);
    }
  };

  return status === "loading" ? (
    <Loading />
  ) : status === "unauth" ? (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="max-w-[30rem] w-full px-5 flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-left base-content">REGISTER</h1>
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
        <button className="btn btn-secondary text-white" onClick={register}>
          <AppRegistrationIcon />
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
