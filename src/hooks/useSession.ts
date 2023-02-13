import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./../configs/firebase";

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
