import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { TextField } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./../components/loading";
import { auth } from "./../configs/firebase";
import useSession from "./../hooks/useSession";

export default function Register() {
  const username = useRef<HTMLInputElement>(null);
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
    if (!username.current || !password.current) return;
    try {
      const usernameConcatAtGmail = username.current.value.concat("@gmail.com");
      const respCreatedUser = await createUserWithEmailAndPassword(
        auth,
        usernameConcatAtGmail,
        password.current.value
      );
      updateProfile(respCreatedUser.user, {
        displayName: username.current.value,
      });
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
          inputRef={username}
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
        <div className="text-base-content mx-auto">
          <Link to={`/signIn`}>Already have an account ?</Link>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
