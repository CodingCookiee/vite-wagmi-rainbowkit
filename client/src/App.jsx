import { Header, Footer, Main } from "./components/layout";
import { ContractInteraction } from "./components/ui/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/common";
export default function App() {
  const Layout = () => {
    return (
      <div className="flex flex-col items-center p-0 min-h-screen w-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 ">
        <Header />
        <main className="flex-1 w-full h-full ">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Main />,
        },
        {
          path: "/contract-interaction",
          element: <ContractInteraction />,
        },
      ],
    },
  ]);

  return (
    <div className="overflow-x-hidden ">
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
