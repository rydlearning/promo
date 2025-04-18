import { Navigate, RouteObject } from "react-router-dom";
import SignUpParent from "../pages/parent webapp/authentication/SignUp";
import Login from "../pages/partner webapp/authentication/Login";
import Dashboard from "../pages/partner webapp/app/dashboard";
import Error from "../pages/error";
import ParentList from "../pages/partner webapp/app/parentList";
import InviteParent from "../pages/partner webapp/invite parent";
import ParentDetails from "../pages/partner webapp/app/parentList/parent details";
import ParentDashboard from "../pages/parent webapp/app/dashboard";
import LoginParent from "../pages/parent webapp/authentication/Login";
import ForgotPassword from "../pages/parent webapp/authentication/ForgotPassword";
// import PasswordReset from "../pages/parent webapp/authentication/PasswordReset";
import SetNewPassword from "../pages/parent webapp/authentication/SetNewPassword";
import CohortDetails from "../pages/partner webapp/app/dashboard/CohortDetails";

const routes: RouteObject[] = [
  //partner components
  { path: "/", element: <Navigate to="promo/login" replace={true} /> },
  { path: "/promo/login", element: <Login /> },
  { path: "/promo/dashboard", element: <Dashboard /> },
  { path: "/promo/cohort/:id", element: <CohortDetails /> },
  { path: "/promo/parent-list", element: <ParentList /> },
  { path: "/promo/parent/:id/:cid", element: <ParentDetails /> },
  { path: "/promo/invite-parent", element: <InviteParent /> },

  // parent components/
  { path: "/promo/parent/login", element: <LoginParent /> },
  { path: "/promo/parent/register", element: <SignUpParent /> },
  { path: "/promo/parent/dashboard", element: <ParentDashboard /> },

  //Forgot password
  { path: ":promo/forgot-password", element: <ForgotPassword /> },
  // { path: "/promo/parent/password-reset", element: <PasswordReset /> },
  { path: ":promo/:email/set-password", element: <SetNewPassword /> },

  //error path
  { path: "*", element: <Error /> },
];

export { routes };
