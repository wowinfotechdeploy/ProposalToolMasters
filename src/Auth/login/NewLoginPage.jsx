/* global $ */
import React, { useContext, useEffect, useState } from "react";
import microsoftLogo from "../../assets/images/login-with-icon/icon-microsoft-login.webp";
import iconFacebook from "../../assets/images/icon-fb.webp";
import iconLinkedin from "../../assets/images/icon-ln.webp";
import iconX from "../../assets/images/icon-x.webp";
import iconYoutube from "../../assets/images/icon-yt.webp";
import logoImg from "../../assets/images/company-logos/logo-outbooks-proposal.webp";
import LoginLogo from "../../assets/images/login.webp";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../redux/Persist";
import { useNavigate } from "react-router-dom";
import {
  VerifyAuthenticateWithSocialMediaByToken,
  VerifyLoginCredential,
  VerifySocialMediaLoginCredential,
} from "../../redux/Services/Auth/loginApi";
import { USER_ROLE_TYPE } from "../../Middleware/enums";
import Loader from "../../loader/Loader";
import { ERROR_MESSAGES } from "../../components/GlobalMessage";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../config/microsoftConfig";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import "./LoginStyle.css";
import { redirectUri } from "../../Base-Url/Base_Url";
import GoogleLoginButton from "./GoogleLoginButton";
import "./NewLoginPage.css";

const Login = () => {
  const common = useSelector((state) => state.Storage);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const [LoginObj, setLoginObj] = useState({
    email: "",
    password: "",
  });
  const [ErrorMessage, setErrorMessage] = useState();
  const [socialLoader, setSocialLoader] = useState(false);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    setTopbar,
    setLoginLoader,
    setLoader,
    accessCount,
    SetAccessCount,
    toggleMenuVisibility,
    isMenuVisible,
    setMenuVisible,
  } = useContext(AuthContextProvider);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useMsal();

  useEffect(() => {
    navigate("/login");
    setMenuVisible(false);
    SetAccessCount();
  }, [accessCount]);

  useEffect(() => {
    setTopbar("none");
    // Attach the keydown event listener to the window
    window.addEventListener("keydown", handleKeyDown);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const MicrosoftLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((result) => {
        const data = result.account;
        const userName = data.name.split(" ");
        const SocialRequest_ParamsObj = {
          email: data.username,
          firstName: userName[0],
          lastName: userName[1],
          loginBy: "Microsoft",
          tokenID: result.idToken,
        };
        handleSocialMediaLogin(SocialRequest_ParamsObj);
      })
      .catch((e) => {
        console.log("result", e);
      });
  };

  // 1] Social Media logic api function call
  const handleSocialMediaLogin = async (SocialRequest_ParamsObj) => {
    setSocialLoader(true);
    let apiUrl;
    if (SocialRequest_ParamsObj.loginBy === "Microsoft") {
      apiUrl = await VerifySocialMediaLoginCredential(SocialRequest_ParamsObj);
    } else {
      apiUrl = await VerifyAuthenticateWithSocialMediaByToken(
        SocialRequest_ParamsObj
      );
    }

    if (apiUrl) {
      setSocialLoader(false);

      if (apiUrl?.data?.statusCode === 200) {
        setLoader(false);
        const token = apiUrl.data.responseData.data.token;
        if (token === null) {
          setErrorMessage(apiUrl.data.responseData.data.message);
          return false;
        }
        const mobileNo = apiUrl.data.responseData.data.mobileNo;
        const isPasswordSet = apiUrl.data.responseData.data.isPasswordSet;
        const roleTypeId = apiUrl.data.responseData.data.roleTypeId;
        const userId = apiUrl.data.responseData.data.userId;
        const userKeyID = apiUrl.data.responseData.data.userKeyID;
        const name = apiUrl.data.responseData.data.firstName;
        const organisationCount =
          apiUrl.data.responseData.data.organisationCount;
        const enableMFA = apiUrl.data.responseData.data.enableMFA;
        const modelData = apiUrl.data.responseData.data;
        const userAccessList = apiUrl.data.responseData.data.userAccessList;
        const logoutMilliseconds = modelData.loginSessionTime * 60000;
        const currency = "GBP";
        // Set the value in local storage
        localStorage.setItem("logoutMilliseconds", logoutMilliseconds);
        // Count the number of true values
        const trueCount = userAccessList.reduce((count, item) => {
          return count + (item.setDefaultAction === true ? 1 : 0);
        }, 0);
        // Set the access count based on the total count of true values
        let newAccessCount = trueCount > 0 ? trueCount : 0;
        SetAccessCount(newAccessCount);
        // Store accessCount in local storage
        localStorage.setItem("accessCount", newAccessCount);

        dispatch(
          updateState({
            isAuth: "yes",
            userType: "",
            roleTypeId: roleTypeId,
            email: SocialRequest_ParamsObj?.email,
            mobileNo: mobileNo,
            token: token,
            name: name,
            userId: userId,
            isPasswordSet: isPasswordSet,
            userKeyID: userKeyID,
            organisationCount: organisationCount,
            organisationID: roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : 1,
            organisationKeyID:
              roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : "",
            enableMFA: enableMFA,
            isUpdateRole: false,
            enableEL: roleTypeId == USER_ROLE_TYPE.SuperAdmin ? 1 : 0,
            currency: currency,
          })
        );
        if (common.organisationCount === 0) {
          navigate("/get-started");
        } else {
          navigate("/");
        }
      }
    }
  };

  // 2] This function validate email id & password is in valid format
  const LoginBtnClicked = (OnEnterButton, Type) => {
    // Reset error messages
    setErrorMessage("");
    let emailToUse = LoginObj.email; // Default to the state value
    let passwordToUse = LoginObj.password; // Default to the state value

    // Check if it's an Enter key press and use the passed object
    if (Type === "Enter") {
      emailToUse = OnEnterButton.email;
      passwordToUse = OnEnterButton.password;
    }
    // Validation logic
    if (!emailToUse || !emailRegex.test(emailToUse) || !passwordToUse) {
      setRequireErrorMessage("Please fill in all fields correctly!");
      return; // Exit if validation fails
    }
    // Clear error message if everything is correct
    setErrorMessage("");
    // Preparing API request parameters
    const ApiRequest_ParamsObj = {
      username: emailToUse,
      password: passwordToUse,
    };
    LoginData(ApiRequest_ParamsObj); // Call your login function
  };

  // 3) User Logged in from here and api call or normal flow (entering email and pass)
  const LoginData = async (ApiRequest_ParamsObj) => {
    localStorage.removeItem("userThemeSettingLocalStorage");
    try {
      setLoginLoader(true);
      const response = await VerifyLoginCredential(ApiRequest_ParamsObj);
      if (response) {
        if (response?.data?.statusCode === 200) {
          setLoginLoader(false);
          const modelData = response.data.responseData.data;
          const token = response.data.responseData.data.token;
          if (token === null) {
            setErrorMessage(response.data.responseData.data.message);
            return false;
          }
          const userKeyID = response.data.responseData.data.userKeyID;
          if (token) {
            setLoginLoader(false);
          }
          const roleTypeId = response.data.responseData.data.roleTypeId;
          const userId = response.data.responseData.data.userId;
          const mobileNo = response.data.responseData.data.mobileNo;
          const isPasswordSet = response.data.responseData.data.isPasswordSet;
          const name = response.data.responseData.data.firstName;
          const organisationCount =
            response.data.responseData.data.organisationCount;
          const enableMFA = response.data.responseData.data.enableMFA;
          const mfaKeyID = response.data.responseData.data.mfaKeyID;
          const authenticatorName =
            response.data.responseData.data.authenticatorName;
          const userAccessList = response.data.responseData.data.userAccessList;
          // const  currency=response.data.responseData.data.currency;
          const currency = "GBP";
          // Count the number of true values
          const trueCount = userAccessList.reduce((count, item) => {
            return count + (item.setDefaultAction === true ? 1 : 0);
          }, 0);
          // Convert minutes to milliseconds
          const logoutMilliseconds = modelData.loginSessionTime * 60000;
          // Set the value in local storage
          localStorage.setItem("logoutMilliseconds", logoutMilliseconds);
          // Set the access count based on the total count of true values
          let newAccessCount = trueCount > 0 ? trueCount : 0;
          SetAccessCount(newAccessCount);
          // Store accessCount in local storage
          localStorage.setItem("accessCount", newAccessCount);
          if (enableMFA == 1) {
            localStorage.setItem(
              "userLoginLocalStorage",
              JSON.stringify(modelData)
            );
            dispatch(
              updateState({
                userKeyID: userKeyID,
                enableMFA: enableMFA,
                email: LoginObj.email,
                isPasswordSet: isPasswordSet,
                mobileNo: mobileNo === "" ? LoginObj.mobileNo : mobileNo,
                authenticatorName: authenticatorName,
                organisationID:
                  roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : 1,
                organisationKeyID:
                  roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : "",
                isUpdateRole: false,
                enableEL: roleTypeId == USER_ROLE_TYPE.SuperAdmin ? 1 : 0,
                currency: currency,
              })
            );
          } else {
            dispatch(
              updateState({
                isAuth: "yes",
                userType: "",
                roleTypeId: roleTypeId,
                email: LoginObj.email,
                mobileNo: mobileNo === "" ? LoginObj.mobileNo : mobileNo,
                token: token,
                name: name,
                userId: userId,
                userKeyID: userKeyID,
                isPasswordSet: isPasswordSet,
                organisationCount: organisationCount,
                organisationID:
                  roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : 1,
                organisationKeyID:
                  roleTypeId == USER_ROLE_TYPE.SuperAdmin ? null : "",
                enableMFA: enableMFA,
                authenticatorName: authenticatorName,
                isUpdateRole: false,
                enableEL: roleTypeId == USER_ROLE_TYPE.SuperAdmin ? 1 : 0,
                currency: currency,
              })
            );
          }
          if (organisationCount === 0 && roleTypeId === 2) {
            navigate("/get-started");
            setLoginLoader(false);
          } else {
            setLoginLoader(false);
            if (enableMFA === 1) {
              navigate("/security-landing-page", {
                state: {
                  token: token,
                  mfaKeyID: mfaKeyID,
                },
              });
            } else {
              navigate("/");
            }
          }
        } else {
          const ErrorMessage = response?.response?.data?.errorMessage;
          setErrorMessage(ErrorMessage);
          setLoginLoader(false);
        }
      }
    } catch (error) {
      setLoginLoader(false);
      console.log(error);
      setLoader(false);
    }
  };
  // This function show the eye icon user can see and hide the password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleKeyDown = (event) => {
    // Log the key pressed for debugging
    if (event.key === "Enter") {
      const param = {
        email: document.querySelector('input[type="text"]')?.value,
        password: document.querySelector(`input[name="password"]`)?.value,
      };
      LoginBtnClicked(param, "Enter");
    }
  };

  return (
    <React.Fragment>
      <div>
        <header className="lnheader">
          <div className="lnnav-bar">
            <div className="lnlogo">
              <a className="lna" href="https://outbooks.com/proposal/">
                <img src={logoImg} alt="Outbooks" />
                {/* <img alt="Outbooks" /> */}
              </a>
              <div className="mbMenuCont">
                {/* <button className="mbTgl" onClick={this.toggleVisibility}>&#9776;</button> */}
                <button className="mbTgl" onClick={toggleMenuVisibility}>
                  &#9776;
                </button>

                <div
                  id="mbMenu"
                  className={`lnmenu mb-lnmenu ${
                    isMenuVisible ? "show" : "hide"
                  }`}
                >
                  <ul className="lnul">
                    <li>
                      <a className="lna" href="https://outbooks.com/proposal/">
                        HOME
                      </a>
                    </li>
                    <li className="tosb-nav">
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/features/"
                      >
                        FEATURES &#x25BE;
                      </a>
                      <ul className="sb-nav">
                        <li>
                          <a
                            className="lna"
                            href="https://outbooks.com/proposal/engagement-letter/"
                          >
                            Engagement Letter
                          </a>
                        </li>
                        <li>
                          <a
                            className="lna"
                            href="https://outbooks.com/proposal/professional-proposal-renewals/"
                          >
                            Professional Proposal & Renewal
                          </a>
                        </li>
                        <li>
                          <a
                            className="lna"
                            href="https://outbooks.com/proposal/consistent-pricing/"
                          >
                            Consistent Pricing
                          </a>
                        </li>
                        <li>
                          <a
                            className="lna"
                            href="https://outbooks.com/proposal/client-payment/"
                          >
                            Client Payment
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/contact-us/"
                      >
                        CONTACT US
                      </a>
                    </li>
                    <li>
                      <button
                        className="lna"
                        onClick={() => {
                          navigate("/login");
                          setMenuVisible(false);
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        className="lna"
                        onClick={() => {
                          navigate("/registration");
                          setMenuVisible(false);
                        }}
                      >
                        Signup
                      </button>
                    </li>
                    <li>
                      <a
                        className="lna"
                        href="https://outlook.office.com/bookwithme/user/4a35845a9f444012a9e5a4f2fbe159b2%40outbooks.com?anonymous&ismsaljsauthenabled=true"
                        target="_Blank"
                      >
                        Book a Free Demo
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lnmenu lp-lnmenu">
              <ul className="lnul">
                <li>
                  <a className="lna" href="https://outbooks.com/proposal/">
                    HOME
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/features/"
                  >
                    FEATURES &#x25BE;
                  </a>
                  <ul className="sb-nav">
                    <li>
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/engagement-letter/"
                      >
                        Engagement Letter
                      </a>
                    </li>
                    <li>
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/professional-proposal-renewals/"
                      >
                        Professional Proposal & Renewal
                      </a>
                    </li>
                    <li>
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/consistent-pricing/"
                      >
                        Consistent Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        className="lna"
                        href="https://outbooks.com/proposal/client-payment/"
                      >
                        Client Payment
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/contact-us/"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
            </div>
            <div className="lnbtn lp-lnmenu">
              <a
                onClick={() => {
                  navigate("/registration");
                  setMenuVisible(false);
                }}
                className="top3btn t3btn3"
              >
                SIGNUP
              </a>
              <a
                onClick={() => {
                  navigate("/login");
                  setMenuVisible(false);
                }}
                className="top3btn t3btn2"
              >
                LOGIN
              </a>
              <a
                href="https://outlook.office.com/bookwithme/user/4a35845a9f444012a9e5a4f2fbe159b2%40outbooks.com?anonymous&ismsaljsauthenabled=true"
                target="_blank"
                className="top3btn t3btn1"
              >
                BOOK A FREE DEMO
              </a>
            </div>
          </div>
        </header>
        {socialLoader && <Loader />}
        <div className="lnmain-content">
          <section className="lnsection-one">
            <div className="lnhead-panel">
              <div className="lntext lnleft">
                <h2 style={{ color: "#fff" }} className="lnh1 martno">
                  Welcome Back
                </h2>
                <p className="lnp">Sign in to continue to Outbooks Proposal</p>
              </div>
            </div>
            <div className="lnlogin-panel">
              <a className="lna" name="login"></a>
              <div className="lnlogin-right">
                <table className="lntable" border="0" cellPadding={5}>
                  <tbody>
                    <tr>
                      <td
                        className="responsive-td"
                        width={300}
                        align="center"
                        style={{ verticalAlign: "middle", padding: "18px" }}
                      >
                        <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
                          <div
                            className="responsive-wrapper"
                            style={{
                              color: "white",
                              fontFamily: "'Gotham', 'Montserrat', sans-serif",
                              maxWidth: "500px",
                              textAlign: "left",
                              margin: "0 auto",
                            }}
                          >
                            <h2
                              style={{
                                fontSize: "35px",
                                fontWeight: "bold",
                                color: "#00e0ff",
                                margin: "0 0 20px 0",
                              }}
                            >
                              Integrate in minutes, no coding needed!
                            </h2>
                            <h3
                              style={{
                                fontSize: "25px",
                                fontWeight: "bold",
                                color: "white",
                                margin: "0 0 20px 0",
                              }}
                            >
                              Create, send and sign proposals, fast and easy.
                            </h3>
                            <p
                              style={{
                                fontSize: "18px",
                                color: "white",
                                margin: "0 0 30px 0",
                              }}
                            >
                              Boost efficiency with seamless automation.
                              <br />
                              Watch how simple it is below!
                            </p>
                            <iframe
                              className="responsive-video"
                              width="450"
                              height="250"
                              src="https://www.youtube.com/embed/FtKPfV79mJg?si=FHeX5ApkqKLgY157"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                              style={{ borderRadius: "8px" }}
                            ></iframe>
                          </div>
                        </div>
                      </td>
                      {/* <td width={25}></td> */}
                      <td>
                        <div className="sign-ar">
                          {ErrorMessage && (
                            <div
                              className="mb-2 fade show justify-content-center align-items-center"
                              style={{
                                marginBottom: "0px",
                                fontSize: "13px",
                                padding: "9px", // Increased padding
                                textAlign: "center", // Centering the text
                                color: "#ec4561",
                              }}
                              role="alert"
                            >
                              {ErrorMessage ===
                              "Username or password is incorrect" ? (
                                "Email or password is incorrect"
                              ) : ErrorMessage ===
                                "Wrong Email/Password Combination" ? (
                                <>{ErrorMessage}</>
                              ) : ErrorMessage.includes("Couldn't find") ? (
                                <>
                                  Sorry, we couldn't find your Outbooks Proposal
                                  Account.<br></br>
                                  Would you like to create one?{" "}
                                  <a
                                    onClick={() => navigate("/registration")}
                                    style={{ cursor: "pointer" }}
                                    className="mdi anchorLink"
                                  >
                                    Sign up
                                  </a>
                                </>
                              ) : (
                                <>{ErrorMessage}</>
                              )}
                            </div>
                          )}
                          <div className="row-f">
                            <input
                              maxLength={50}
                              type="text"
                              autoComplete="off"
                              onKeyDown={handleKeyDown}
                              name="email"
                              // value={this.props.email || ""}
                              value={LoginObj.email}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const trimmedValue = inputValue
                                  .replace(/\s+/g, "")
                                  .replace(/\.+/g, "."); // Remove consecutive dots
                                setLoginObj({
                                  ...LoginObj,
                                  email: trimmedValue,
                                });
                              }}
                              className="lninput lntext sign-f big martno"
                              placeholder="Email*"
                            />
                          </div>

                          {requireErrorMessage ? (
                            LoginObj.email === undefined ||
                            LoginObj.email === "" ||
                            LoginObj.email === null ? (
                              <label
                                className="validation"
                                style={{ paddingLeft: "40px" }}
                              >
                                {ERROR_MESSAGES}
                              </label>
                            ) : !emailRegex.test(LoginObj.email) ? (
                              <label
                                className="validation"
                                style={{ paddingLeft: "40px" }}
                              >
                                Enter a valid email.
                              </label>
                            ) : null
                          ) : null}

                          <div className="row-f position-relative auth-pass-inputgroup overflow-hidden">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              onKeyDown={handleKeyDown}
                              value={LoginObj.password}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const passwordWithoutSpaces =
                                  inputValue.replace(/\s+/g, ""); // Remove all spaces
                                setLoginObj({
                                  ...LoginObj,
                                  password: passwordWithoutSpaces,
                                });
                              }}
                              className="lninput lntext sign-f big"
                              placeholder="Password*"
                            />

                            {requireErrorMessage &&
                            (LoginObj.password === undefined ||
                              LoginObj.password === "" ||
                              LoginObj.password === null) ? (
                              <label
                                className="validation"
                                style={{ paddingLeft: "40px" }}
                              >
                                {ERROR_MESSAGES}
                              </label>
                            ) : (
                              ""
                            )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                              onClick={togglePasswordVisibility}
                              style={{ marginTop: "35px" }}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>

                          <div className="row-f mart" tabIndex="0">
                            <button
                              className="lnpage-btn lnlogin sign-f"
                              onClick={LoginBtnClicked}
                            >
                              LOG IN
                            </button>
                          </div>

                          <div className="row-f ordiv mart">
                            <hr></hr>
                            <div className="or-devider">or</div>
                          </div>

                          <div className="row-f mart">
                            <div
                              className="btn-div sign-f d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <GoogleLoginButton
                                handleSocialMediaLogin={handleSocialMediaLogin}
                              />
                            </div>
                            <div
                              className="btn-div sign-f d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                                onClick={MicrosoftLogin}
                              >
                                <img
                                  src={microsoftLogo}
                                  height={30}
                                  alt="Microsoft"
                                />
                                <span
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Login with Microsoft
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row-f">
                            <div className="tc-div sign-f">
                              <a
                                onClick={() => navigate("/forget-password")}
                                className="lna tc-2 sign-f"
                                style={{ cursor: "pointer" }}
                              >
                                <span> &#x1F512;Forgot Password ?</span>
                              </a>
                            </div>
                          </div>
                          <div className="row-f">
                            <div className="tc-div sign-f">
                              <span className="tc-2 sign-f">
                                {" "}
                                &nbsp;Don't have an account?
                              </span>{" "}
                              &nbsp;{" "}
                              <a
                                className="lna"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/registration")}
                              >
                                <strong>SIGN UP</strong>
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <footer className="lnfooter">
          <div className="lncol-1">
            <div className="lnlogo">
              <a className="lna" href={redirectUri}>
                <img src={logoImg} alt="Outbooks" />
              </a>
            </div>
            <div className="lnmenu">
              <ul className="lnul lnnav-list">
                <li>
                  <a className="lna" href="https://outbooks.com/proposal/">
                    HOME
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    onClick={() => {
                      navigate("/registration");
                      setMenuVisible(false);
                    }}
                  >
                    SIGN UP
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/features/"
                  >
                    FEATURES
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/contact-us/"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
            </div>
            <p className="lnp lncopy-right">
              Copyright © Outbooks Proposal {new Date().getFullYear()} | All
              Rights Reserved
            </p>
          </div>
          <div className="lncol-2">
            <div className="lnmenu footer-m1">
              <ul className="lnul lnnav-list">
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/contact-us"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/articles/"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    className="lna"
                    href="https://outbooks.com/proposal/terms-and-conditions/"
                  >
                    Terms and Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="lncol-3">
            <p>
              <b>OUTBOOKS TECH LTD</b>
            </p>
            <p className="lnp lnadr">
              415 C, MARGARET POWELL HOUSE, Midsummer Blvd,Milton Keynes MK9
              3BN, United Kingdom
            </p>
            <p className="lnp lnregno">Registration No: 15082614</p>
            <ul className="lnul lncontact-links">
              <li>
                <a className="lna" href="mailto:info@outbookstech.com">
                  &#9993; &nbsp; info@outbookstech.com
                </a>
              </li>
              <li>
                <a className="lna" href="tel:+443300578597">
                  &#9743; &nbsp; +44 330 057 8597
                </a>
              </li>
            </ul>
            <ul className="lnul lnsocial-links">
              <li>
                <a
                  className="lna"
                  href="https://www.facebook.com/profile.php?id=61556567720993"
                >
                  <img src={iconFacebook} alt="Facebook" />
                </a>
              </li>
              <li>
                <a
                  className="lna"
                  href="https://www.linkedin.com/company/outbooksproposal/"
                >
                  <img src={iconLinkedin} alt="Linkedin" />
                </a>
              </li>
              <li>
                <a className="lna" href="https://twitter.com/outbookproposal">
                  <img src={iconX} alt="Twitter / X" />
                </a>
              </li>
              <li>
                <a
                  className="lna"
                  href="https://www.youtube.com/channel/UCCucVxt5QuYrJI6SDCDW7sQ"
                >
                  <img src={iconYoutube} alt="Youtube" />
                </a>
              </li>
            </ul>
            <a
              href="https://outbooks.com/proposal/contact-us/"
              className="lna lnpage-btn"
            >
              CONTACT US
            </a>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default Login;
