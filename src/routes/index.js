import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

// Each page is its own chunk so users only download what they open.
const Controls = lazy(() => import("../pages/UserControls/Controls/index"));
const UserProfile = lazy(() => import("../pages/Authentication/user-profile"));
const Logout = lazy(() => import("../pages/Authentication/Logout"));
const Register = lazy(() => import("../pages/Authentication/Register"));
const ForgetPwd = lazy(() => import("../pages/Authentication/ForgetPassword"));
const Analytics = lazy(() => import("pages/Analytics"));
const CryptoIcoLanding = lazy(() => import("../pages/Crypto/CryptoIcoLanding/index"));
const PagesMaintenance = lazy(() => import("../pages/Utility/pages-maintenance"));
const PagesComingsoon = lazy(() => import("../pages/Utility/pages-comingsoon"));
const PagesForbidden = lazy(() => import("../pages/Utility/pages-forbidden"));
const Pages404 = lazy(() => import("../pages/Utility/pages-404"));
const Pages500 = lazy(() => import("../pages/Utility/pages-500"));
const CbpldLandingPage = lazy(() => import("pages/CbpldLandingPage"));
const ClientServices = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Services"));
const ClientProfile = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Profile"));
const ClientApplications = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Applications"));
const AdminPending = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Pending"));
const AdminDashboard = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Dashboard"));
const AdminForPaymentDashboard = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForPayment"));
const AdminReturnedDashboard = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/Returned"));
const AdminForPaymentApproval = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForApproval"));
const AdminForSignature = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/ForSignature"));
const AdminControls = lazy(() => import("../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/AdminControls"));
const SpecialPermitEmailVerication = lazy(() => import("pages/AuthenticationInner/SpecialPermitEmailVerication"));
const ForgetPasswordPage = lazy(() => import("pages/AuthenticationInner/ForgetPassword"));
const ConfirmMail = lazy(() => import("pages/AuthenticationInner/page-confirm-mail"));
const OfflineTransaction = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction"));
const SpecialPermitDetailsQr = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/SpecialPermitDetailsQr"));
const TwostepVerification = lazy(() => import("pages/AuthenticationInner/auth-two-step-verification"));
const SuperAdminControl = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/SuperAdminControl"));
const AdminDeclined = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Declined"));
const SpecialPermitAnalytics = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Analytics/index"));
const SpecialPermitReports = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Reports/index"));
const Release = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction/Release"));
const OfflineDashboard = lazy(() => import("pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction/OfflineDashboard"));

// Old per-stage client URLs (still linked from sent emails / payment returns).
const ToClientApplications = () => <Redirect to="/client/applications" />;
const OLD_CLIENT_STAGE_PATHS = [
  "/client/dashboard",
  "/client/pending",
  "/client/for-payment/approval",
  "/client/for-payment/dashboard",
  "/client/returned/dashboard",
  "/client/for-signature",
  "/client/declined",
];

const authProtectedRoutes = [
  { path: "/dashboard", component: Analytics },

  // Special Permit Routes
  { path: "/client/services", component: ClientServices },
  { path: "/client/applications", component: ClientApplications },
  ...OLD_CLIENT_STAGE_PATHS.map((path) => ({
    path,
    component: ToClientApplications,
  })),
  { path: "/client/profile", component: ClientProfile },

  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/admin/for-signature", component: AdminForSignature },
  { path: "/admin/for-payment/dashboard", component: AdminForPaymentDashboard },
  { path: "/admin/returned/dashboard", component: AdminReturnedDashboard },
  { path: "/admin/declined", component: AdminDeclined },
  {
    path: "/admin/for-payment/approval",
    component: AdminForPaymentApproval,
  },
  { path: "/admin/pending", component: AdminPending },
  { path: "/admin/controls", component: AdminControls },
  { path: "/admin/analytics", component: SpecialPermitAnalytics },
  { path: "/admin/reports", component: SpecialPermitReports },
  {
    path: "/user-control",
    component: Controls,
  },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/logout", component: Logout },
  { path: "/profile", component: UserProfile },
  {
    path: "/super-admin",
    component: SuperAdminControl,
  },
  {
    path: "/offline-transaction",
    component: OfflineTransaction,
  },
  {
    path: "/offline-transaction/release",
    component: Release,
  },
  {
    path: "/offline-transaction/dashboard",
    component: OfflineDashboard,
  },
];

const publicRoutes = [
  { path: "/register", component: Register },
  { path: "/home", component: CbpldLandingPage },

  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-forbidden", component: PagesForbidden },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-500", component: Pages500 },
  { path: "/crypto-ico-landing", component: CryptoIcoLanding },
  { path: "/not-found", component: Pages404 },
  {
    path: "/email-verification",
    component: SpecialPermitEmailVerication,
  },
  { path: "/forgot-password", component: ForgetPasswordPage },
  { path: "/verify-email", component: ConfirmMail },
  { path: "/special-permit-qr-details/:id", component: SpecialPermitDetailsQr },
  { path: "/verify-otp", component: TwostepVerification },
];

export { authProtectedRoutes, publicRoutes };
