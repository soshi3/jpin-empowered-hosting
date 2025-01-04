import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
]);