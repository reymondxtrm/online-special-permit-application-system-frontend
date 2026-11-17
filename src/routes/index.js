import React from "react";
import { Redirect } from "react-router-dom";

//ITSM Components***********/
import RequestedServices from "../pages/RequestedServices/index";
import Reports from "../pages/Reports/index";
import MultipurposeSMS from "../pages/Tools/MultipurposeSMS/index";
import VaxcertSMS from "../pages/Tools/VaxcertSMS/index";
import Verification from "../pages/UserControls/Verification/index";
import Controls from "../pages/UserControls/Controls/index";
import RequestService from "pages/Services/RequestService/index";
import RequestTracker from "pages/Services/RequestTracker/index";
import CreateUser from "pages/UserControls/CreateUser/index";
//********************** */

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Analytics from "pages/Analytics";

import InitialReceiverDashboard from "../pages/InitialReceiver/Dashboard/index";
import Receive from "../pages/InitialReceiver/ForReceiving/index";
import AssessmentReceiverDashboard from "../pages/AssessmentReceiver/Dashboard/index";
import AssessmentForReceiving from "../pages/AssessmentReceiver/ForReceiving/index";
import AssessmentReleaserDashboard from "../pages/AssessmentReleaser/Dashboard/index";
import AssessmentForReleasing from "../pages/AssessmentReleaser/ForReleasing/index";
import CompleteReceiverDashboard from "../pages/CompleteReceiver/Dashboard/index";
import CompleteForReceiving from "../pages/CompleteReceiver/ForReceiving/index";

import NotificationsPage from "pages/Notification";

import CryptoIcoLanding from "../pages/Crypto/CryptoIcoLanding/index";

import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesForbidden from "../pages/Utility/pages-forbidden";

import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import FinalReleaserDashboard from "pages/FinalReleaser/Dashboard";
import FinalForReleasing from "pages/FinalReleaser/ForReleasing";
import ForPrinting from "pages/FinalReleaser/ForPrinting";
import Summary from "pages/Summary";

import CbpldLandingPage from "pages/CbpldLandingPage";

import ClientServices from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Services";
import ClientProfile from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Profile";
import ClientApplications from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Applications";


import AdminPending from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Pending";
import AdminDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Dashboard";
import AdminForPaymentDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForPayment";
import AdminReturnedDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/Returned";
import AdminForPaymentApproval from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForApproval";
import AdminForSignature from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/ForSignature";
import AdminControls from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/AdminControls";
import FormEditors from "pages/Forms/FormEditors";
import EmailVerification from "pages/AuthenticationInner/auth-email-verification-2";
import SpecialPermitEmailVerication from "pages/AuthenticationInner/SpecialPermitEmailVerication";
import ForgetPasswordPage from "pages/AuthenticationInner/ForgetPassword";
import ConfirmMail from "pages/AuthenticationInner/page-confirm-mail";

//Offline Module
import OfflineTransaction from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction";

//QR code
import SpecialPermitDetailsQr from "pages/CbpldLandingPage/SpecialPermit/SpecialPermitDetailsQr";
import { components } from "react-select/dist/react-select.cjs.prod";
import CedulaApplicationFormModal from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Modals/CedulaApplicationFormModal";
import PassportCropper from "pages/TrialPages/PassportCropper";
import TwostepVerification2 from "pages/AuthenticationInner/auth-two-step-verification-2";
import TwostepVerification from "pages/AuthenticationInner/auth-two-step-verification";
import SuperAdminControl from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/SuperAdminControl";
import AdminDeclined from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Declined";
import SpecialPermitAnalytics from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Analytics/index";
import SpecialPermitReports from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Reports/index";
import Release from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction/Release";
import OfflineDashboard from "pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/OfflineTransaction/OfflineDashboard";

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
