import { Navigate, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import './App.css';
import HomeLayout from './layouts/HomeLayout'
import OutWeighs from './pages/OutWeighs';
import InWeights from './pages/InWeights';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <OutWeighs />,
      },
    ] , 
    
  } , 
  {
    path: "/in",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <InWeights />,
      },
    ] , 
    
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