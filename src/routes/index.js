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
import ClientPending from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Pending";
import ClientDeclined from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Declined";
import ClientDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Dashboard";
import ClientForSignature from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/ForSignature";
import ClientForPayment from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Payment/ForPayment";
import ClientReturned from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Payment/Returned";
import ClientProfile from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Profile";
import ClientForPaymentApproval from "../pages/CbpldLandingPage/SpecialPermit/AuthClientPages/Payment/ForApproval";

import AdminPending from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Pending";
import AdminDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Dashboard";
import AdminForPaymentDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForPayment";
import AdminReturnedDashboard from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/Returned";
import AdminForPaymentApproval from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Payment/ForApproval";
import AdminForSignature from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/ForSignature";
import AdminControls from "../pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/AdminControls";
import FormEditors from "pages/Forms/FormEditors";
import EmailVerification from "pages/AuthenticationInner/auth-email-verification";
import SpecialPermitEmailVerication from "pages/AuthenticationInner/SpecialPermitEmailVerication";
import ForgetPasswordPage from "pages/AuthenticationInner/ForgetPassword";
import ConfirmMail from "pages/AuthenticationInner/page-confirm-mail";

const authProtectedRoutes = [
  { path: "/dashboard", component: Analytics },

  // { path: "/initial-receiver/dashboard", component: InitialReceiverDashboard },
  // { path: "/initial-receiver/receive", component: Receive },
  // {
  //   path: "/assessment-receiver/dashboard",
  //   component: AssessmentReceiverDashboard,
  // },
  // {
  //   path: "/assessment-receiver/for-receiving",
  //   component: AssessmentForReceiving,
  // },
  // {
  //   path: "/assessment-releaser/dashboard",
  //   component: AssessmentReleaserDashboard,
  // },
  // {
  //   path: "/assessment-releaser/for-releasing",
  //   component: AssessmentForReleasing,
  // },
  // {
  //   path: "/complete-receiver/dashboard",
  //   component: CompleteReceiverDashboard,
  // },
  // {
  //   path: "/complete-receiver/for-receiving",
  //   component: CompleteForReceiving,
  // },
  // {
  //   path: "/final-releaser/dashboard",
  //   component: FinalReleaserDashboard,
  // },
  // {
  //   path: "/final-releaser/for-printing",
  //   component: ForPrinting,
  // },
  // {
  //   path: "/final-releaser/for-releasing",
  //   component: FinalForReleasing,
  // },
  // {
  //   path: "/summary",
  //   component: Summary,
  // },
  // {
  //   path: "/user-control",
  //   component: Controls,
  // },

  // Special Permit Routes
  { path: "/client/services", component: ClientServices },
  { path: "/client/dashboard", component: ClientDashboard },
  { path: "/client/for-signature", component: ClientForSignature },
  { path: "/client/for-payment/dashboard", component: ClientForPayment },
  { path: "/client/returned/dashboard", component: ClientReturned },
  {
    path: "/client/for-payment/approval",
    component: ClientForPaymentApproval,
  },
  { path: "/client/pending", component: ClientPending },
  { path: "/client/declined", component: ClientDeclined },
  { path: "/client/profile", component: ClientProfile },

  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/admin/for-signature", component: AdminForSignature },
  { path: "/admin/for-payment/dashboard", component: AdminForPaymentDashboard },
  { path: "/admin/returned/dashboard", component: AdminReturnedDashboard },
  {
    path: "/admin/for-payment/approval",
    component: AdminForPaymentApproval,
  },
  { path: "/admin/pending", component: AdminPending },
  { path: "/admin/controls", component: AdminControls },
  {
    path: "/user-control",
    component: Controls,
  },
];

const publicRoutes = [
  { path: "/profile", component: UserProfile },
  { path: "/logout", component: Logout },
  // { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
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
];

export { authProtectedRoutes, publicRoutes };
