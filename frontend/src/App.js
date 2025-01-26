import { Navigate, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import './App.css';
import HomeLayout from './layouts/HomeLayout'
import OutWeighs from './pages/OutWeighs';
import InWeights from './pages/InWeights';
import Impexp from './pages/Impexp';
import Day from './pages/Day';
import Storage from './pages/Storage';
import Settings from './pages/Settings';
import MainPage from './pages/MainPage';
import { useUserContext } from './hooks/useUserContext';
import Login from './pages/Login';

const LoginRoute = () =>{
  const { user } = useUserContext();
  return user? <HomeLayout/> : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute/>,
    children: [
      {
        index: true,
        element: <MainPage />
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
      }
    ] , 
    
  } , 
  {
    path: "/login",
    element: <Login/>,
  }
  
])


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
export default App; 