import { Navigate, createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import './App.css';
import HomeLayout from './layouts/HomeLayout'
import OutWeighs from './pages/OutWeighs';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <OutWeighs />,
      },
    ]
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