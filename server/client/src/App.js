import { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/root";
import Home from "./pages/home";
import Login from "./pages/login";
import ManagePosts from "./pages/managePosts";
import Admin from "./pages/admin";
import ViewPost from "./pages/viewPost";
import EditPost from "./pages/editPost";
import ErrorBoundary from "./pages/errorHandler";
import EditUser from "./pages/editUser";

const CurrentUserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "managePosts",
          element: <ManagePosts />,
        },
        {
          path: "admin",
          element: <Admin />,
        },
        {
          path: "viewPost/:id",
          element: <ViewPost />,
        },
        {
          path: "editPost/:id?",
          element: <EditPost />,
        },
        {
          path: "editUser/:id",
          element: <EditUser />
        },
        {
          path: "/error",
          element: <ErrorBoundary />
        }
      ],
    },
  ]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <RouterProvider router={router} />
    </CurrentUserContext.Provider>
  );
}

export default App;
export { CurrentUserContext };
