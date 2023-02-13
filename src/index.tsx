import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loading from "./components/loading";
import "./index.css";
import Login from "./pages/login";
import Register from "./pages/register";
import reportWebVitals from "./reportWebVitals";
import Index from "./pages/index";
import LayoutWithSignIn from "./layouts/layoutWithSignin";
import { Toaster } from "react-hot-toast";

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
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
