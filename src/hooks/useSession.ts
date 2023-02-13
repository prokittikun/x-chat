import { auth } from "./../configs/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useState } from "react";
import { useEffect, useCallback } from "react";

export default function useSession() {
  const [userData, setUserData] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">(
    "loading"
  );
  useEffect(() => {
    setStatus("loading");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus("auth");
        setUserData(user);
      } else {
        setStatus("unauth");
        setUserData(null);
      }
    });
  }, []);
  return { userData, status };
}
