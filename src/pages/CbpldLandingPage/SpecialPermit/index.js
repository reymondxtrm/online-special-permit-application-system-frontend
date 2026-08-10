import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import { Formik } from "formik";
import { loginUser, userSlice } from "../../../features/user/userSlice";
import { useHistory } from "react-router-dom";
import bg from "../../../assets/images/Background.svg";
import SignupModal from "../Modals/SignupModal";
import logo from "../../../assets/images/cgbLogo.png";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function SpecialPermit({ props }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const formikRef = useRef(null);
  const loginStatus = useSelector((state) => state.user);
  const [signupModalState, setSignupModalState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 900;

  useEffect(() => {
    dispatch(userSlice.actions.clearState());
  }, []);

  const toggleSignUp = () => setSignupModalState((prev) => !prev);
  const handleForgotPassword = () => history.push("/forgot-password");

  const styles = {
    root: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "center",
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      fontFamily: "'DM Sans', Inter, system-ui, sans-serif",
      padding: isMobile ? "0" : "1rem",
      boxSizing: "border-box",
    },
    card: {
      width: "100%",
      maxWidth: isMobile ? "100%" : 440,
      minHeight: isMobile ? "100vh" : "auto",
      backgroundColor: "#ffffff",
      borderRadius: isMobile ? 0 : 12,
      overflow: "hidden",
      boxShadow: isMobile ? "none" : "0 8px 40px rgba(0,0,0,0.18)",
      display: "flex",
      flexDirection: "column",
    },
    banner: {
      position: "relative",
      height: isMobile ? 280 : 260,
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center top",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "1.5rem",
      overflow: "hidden",
      flexShrink: 0,
    },
    bannerOverlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(30, 100, 180, 0.55)",
      backdropFilter: "blur(1px)",
    },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "#fff",
      border: "2px solid rgba(255,255,255,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    bannerOrg: {
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      letterSpacing: "0.01em",
      position: "relative",
      zIndex: 1,
      margin: 0,
      fontWeight: 400,
    },
    bannerTitle: {
      fontSize: isMobile ? 24 : 26,
      fontWeight: 700,
      color: "#fff",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
      margin: 0,
      lineHeight: 1.25,
    },
    body: {
      padding: isMobile ? "2rem 1.5rem 1.5rem" : "1.75rem 2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.1rem",
      flex: 1,
    },
    heading: {
      fontSize: 22,
      fontWeight: 600,
      color: "#111",
      textAlign: "center",
      margin: 0,
      letterSpacing: "0.01em",
    },
    label: {
      fontSize: 14,
      color: "#374151",
      fontWeight: 400,
      marginBottom: 2,
      display: "block",
    },
    input: {
      width: "100%",
      padding: "6px 0",
      fontSize: 15,
      background: "transparent",
      color: "#111",
      border: "none",
      borderBottom: "1px solid #9ca3af",
      borderRadius: 0,
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    passwordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    eyeBtn: {
      position: "absolute",
      right: 0,
      bottom: 6,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      color: "#9ca3af",
      fontSize: 18,
      lineHeight: 1,
    },
    forgotLink: {
      textAlign: "right",
      fontSize: 14,
      color: "#2563EB",
      cursor: "pointer",
      textDecoration: "underline",
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: "inherit",
      display: "block",
      width: "100%",
      marginTop: -4,
    },
    submitBtn: {
      width: "100%",
      padding: "13px",
      background: "#4162bd",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: "0.08em",
      fontFamily: "inherit",
      marginTop: 4,
    },
    disabledBtn: {
      width: "100%",
      padding: "13px",
      background: "#93b8e0",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 700,
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      cursor: "not-allowed",
      marginTop: 4,
      letterSpacing: "0.08em",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: "0.75rem 2rem 1.5rem",
      marginTop: "auto",
    },
    footerText: {
      fontSize: 14,
      color: "#374151",
      margin: 0,
    },
    footerLink: {
      fontSize: 14,
      color: "#2563EB",
      cursor: "pointer",
      textDecoration: "underline",
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: "inherit",
      fontWeight: 500,
    },
  };

  return (
    <>
      <SignupModal
        openModal={signupModalState}
        toggleModal={toggleSignUp}
        props={props}
      />

      <div style={styles.root}>
        <div style={styles.card}>
          {/* Banner */}
          <div style={styles.banner}>
            <div style={styles.bannerOverlay} />
            <div style={styles.logoCircle}>
              <img
                src={logo}
                alt="City Government of Butuan logo"
                style={styles.logoImg}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.style.fontSize = "11px";
                  e.target.parentNode.style.fontWeight = "700";
                  e.target.parentNode.style.color = "#1D4ED8";
                  e.target.parentNode.style.textAlign = "center";
                  e.target.parentNode.innerText = "CGB";
                }}
              />
            </div>
            <p style={styles.bannerOrg}>City Government of Butuan</p>
            <p style={styles.bannerTitle}>
              Online Special Permit
              <br />
              Application Systems
            </p>
          </div>

          {/* Form Body */}
          <div style={styles.body}>
            <p style={styles.heading}>Sign In</p>

            <Formik
              innerRef={formikRef}
              initialValues={{ username: "", password: "" }}
              validateOnMount={false}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={(values) => {
                dispatch(loginUser({ data: values, history: props.history }));
              }}
            >
              {(formikProps) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {loginStatus?.isLoginError &&
                    !loginStatus?.isFetching &&
                    formikProps.submitCount > 0 && (
                      <UncontrolledAlert
                        color="danger"
                        style={{
                          borderRadius: 8,
                          fontSize: 14,
                          marginBottom: 0,
                        }}
                      >
                        <i className="mdi mdi-block-helper me-2" />
                        {loginStatus?.errorMessage}
                      </UncontrolledAlert>
                    )}

                  <FormGroup style={{ margin: 0 }}>
                    <Label style={styles.label} for="username">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder=""
                      onChange={formikProps.handleChange}
                      style={styles.input}
                    />
                  </FormGroup>

                  <FormGroup style={{ margin: 0 }}>
                    <Label style={styles.label} for="password">
                      Password
                    </Label>
                    <div style={styles.passwordWrapper}>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        onChange={formikProps.handleChange}
                        style={{ ...styles.input, paddingRight: 28 }}
                      />
                      <button
                        type="button"
                        style={styles.eyeBtn}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <i className="fa fas fa-eye-slash"></i>
                        ) : (
                          <i className="fa fas fa-eye"></i>
                        )}
                      </button>
                    </div>
                  </FormGroup>

                  <button
                    type="button"
                    style={styles.forgotLink}
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </button>

                  {!loginStatus.isFetching ? (
                    <button
                      type="button"
                      style={styles.submitBtn}
                      onClick={() => formikRef.current.handleSubmit()}
                    >
                      SIGN IN
                    </button>
                  ) : (
                    <button type="button" style={styles.disabledBtn} disabled>
                      <Spinner size="sm" />
                      <span>Signing in...</span>
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>Don&apos;t have an account?</p>
            <button style={styles.footerLink} onClick={toggleSignUp}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecialPermit;
