import {
  createBrowserRouter
} from "react-router-dom";

import App from './App';
import Page1 from './pages/Page1';

const routes = createBrowserRouter([
  {
    path: "/page1",
    element: <Page1></Page1>,
  },
  {
    path: "/",
    element : <App/>,
  },
]);

export default routes;