import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import "./App.css";
import HomeLayout from "./layouts/HomeLayout";
import PrintLayout from "./layouts/PrintLayout";
import OutWeighs from "./SharedComponents/OutWeighs";
import InWeights from "./SharedComponents/InWeights";
import Impexp from "./SharedComponents/Impexp";
import Day from "./SharedComponents/Day";
import Storage from "./SharedComponents/Storage";
import Settings from "./SharedComponents/Settings";
import MainPage from "./SharedComponents/MainPage";
import ModeratorLayout from "./layouts/ModeratorLayout";
import { useUserContext } from "./hooks/useUserContext";
import Login from "./SharedComponents/Login";
import "./styles/tailwind.css";
import ModeratorMainPage from "./ModeratorPages/ModeratorMainPage";
import WorkerMainPage from "./WorkerPages/WorkerMainPage";
import ReceiptPrintPage, { GetOrder } from "./WorkerPages/ReceiptPrintPage";
import FinishedOrders from "./SharedComponents/FinishedOrders";
const LoginRoute = () => {
  const { user } = useUserContext();
  if (user === null) {
    return <Login />;
  } else {
    return user.name === "Osama" ? <Navigate to="/up" /> : <Navigate to="/down" />;
  }
};

const ModeratorRoute = () => {

  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.name === "Osama" ? <ModeratorLayout /> : <Navigate to="/" />;
  }
};

const WorkerRoute = () => {

  const { user } = useUserContext();
  if (user === null) {
    return <Navigate to="/" />;
  } else {
    return user.name === "Hassan" ? <HomeLayout /> : <Navigate to="/" />;
  }
};

const router = createBrowserRouter([
  {
    path: "/down",
    element: <WorkerRoute />,
    children: [
      {
        index: true,
        element: <WorkerMainPage />,
      },
      {
        path: "impexp",
        element: <Impexp />,
      },
      {
        path: "day",
        element: <Day />,
      },
      {
        path: "storage",
        element: <Storage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "finishedOrders",
        element: <FinishedOrders />,
      },
    ],
  },
  {
    path: "/",
    element: <LoginRoute />,
  },
  {
    path: "/print/:isFinishedTicket/:id",
    element: <PrintLayout />,
    children: [
      {
        index: true,
        element: <ReceiptPrintPage />,
        loader: GetOrder
      }
    ]
  },
  {
    path: "/up",
    element: <ModeratorRoute />,
    children: [
      {
        index: true,
        element: <ModeratorMainPage />,
      },
      // {
      //   path: "impexp",
      //   element: <Impexp />,
      // },
      // {
      //   path: "day",
      //   element: <Day />,
      // },
      // {
      //   path: "storage",
      //   element: <Storage />,
      // },
      // {
      //   path: "settings",
      //   element: <Settings />,
      // },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
