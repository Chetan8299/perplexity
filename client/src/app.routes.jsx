import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";

const RootLayout = () => <Outlet />;

const Home = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-semibold text-slate-100 mb-4">Welcome</h1>
    <div className="flex gap-4">
      <Link
        to="/login"
        className="rounded-lg bg-slate-800 border border-slate-600 text-slate-200 hover:border-teal-500/50 hover:text-teal-400 px-4 py-2 transition-colors"
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-4 py-2 transition-colors"
      >
        Sign up
      </Link>
    </div>
  </div>
);

const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Protected children={<Home />} /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={appRouter} />;
