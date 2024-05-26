import { Navigate, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import './App.css';
import HomeLayout from './layouts/HomeLayout'
import OutWeighs from './pages/OutWeighs';
import InWeights from './pages/InWeights';
import Impexp from './pages/Impexp';
import Day from './pages/Day';
import Storage from './pages/Storage';
import Settings from './pages/Settings';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <OutWeighs />,
      },
      {
      path: "in",
        element: <InWeights />,
      },
      {
        path: "impexp",
        element: < Impexp/>,
      },
      {
        path: "day",
        element: < Day/>,
      },
      {
        path: "storage",
        element: < Storage/>,
      },
      {
        path: "settings",
        element: < Settings/>,
      },
    ] , 
    
  } , 
  
])


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
export default App; 