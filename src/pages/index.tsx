import useSession from "../hooks/useSession";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import Navbar from "../components/navbar";

export default function Index() {


  return (
    <>
      <Navbar/>
      
    </>
  );
}
