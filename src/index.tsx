import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import LayoutWithSignIn from "./layouts/layoutWithSignin";
import Index from "./pages/index";
import Login from "./pages/login";
import Register from "./pages/register";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWithSignIn>
        <Index />
      </LayoutWithSignIn>
    ),
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <RouterProvider router={router} />
      {/* </Toaster> */}
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
