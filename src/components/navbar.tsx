import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { auth } from "../configs/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useSession from "../hooks/useSession";
export default function Navbar() {
  const { userData } = useSession();
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    navigate("/signin");
  };
  return (
    <div className="navbar bg-base-100 drop-shadow-md">
      <div className="flex-1">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="btn btn-ghost normal-case text-xl"
        >
          X-Chat
        </button>
      </div>
      <div className="flex-none gap-2">
        {/* <div className="form-control">
           <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
          /> 
        </div> */}
        <div className="text-2x">{userData?.email}</div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="avatar cursor-pointer">
            <AccountCircleIcon sx={{ fontSize: 50 }} />
          </div>

          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <span className="justify-between">
                Profile
                <span className="badge">New</span>
              </span>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
