import React, { useContext, useEffect, useState } from "react";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import "./SecurityStyle.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AuthenticationLookupList,
  GetSendMFAVerificationCodeByEmailByLogin,
} from "../../redux/Services/Auth/AuthenticatioApi";
import { useDispatch, useSelector } from "react-redux";
import BackButtonSvg from "../BackButtonSvg";
import { GetAuthenticateWithMFA } from "../../redux/Services/Auth/loginApi";
import { ERROR_MESSAGES } from "../GlobalMessage";
import { updateState } from "../../redux/Persist";
import OtpIcon from "../../assets/images/login-with-icon/otp.png";

const SecurityLandingPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [lookupList, setLookUpList] = useState([]);
  const navigate = useNavigate();
  const common = useSelector((state) => state.Storage);
  const [errorMessage, setErrorMessage] = useState("");
  const [listErrorMessage, setListErrorMessage] = useState("");
  const [LoginObj, setLoginObj] = useState({});
  const { setLoader, setTopbar, isMobile, SetAccessCount } =
    useContext(AuthContextProvider);
  const [showTroubleView, setShowTroubleView] = useState(false);
  const [requireMessage, setRequireMessage] = useState(false);
  const [VerifyTokenObj, setVerifyTokenObj] = useState({
    verifyToken: null,
    mfaKeyID: LoginObj.mfaKeyID,
    authenticationTypeName: null,
    authenticationTypeID: null,
  });

  const [Token, setToken] = useState(location.state);


  useEffect(() => {
    setTopbar("none");
    const objString = localStorage.getItem("userLoginLocalStorage");
    if (objString) {
      try {
        const obj = JSON.parse(objString);
        setLoginObj(obj);
        setVerifyTokenObj({
          ...VerifyTokenObj,
          authenticatorName: obj.authenticatorName,
          mfaKeyID: obj.mfaKeyID,
          authenticationTypeID: obj.authenticationTypeID,
        });
      } catch (error) {
        console.error("Error parsing object from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    AuthenticationLookupListData(); // This function is called, presumably for some authentication purpose
    SetAccessCount();
  }, [common.userKeyID]);

  const AuthenticationLookupListData = async () => {
    setLoader(true);
    try {
      const data = await AuthenticationLookupList(
        common.userKeyID,
        Token?.token == undefined ? LoginObj?.token : Token?.token
      );

      if (data) {
        setLoader(false);
        if (data?.data?.statusCode === 200) {
          setLoader(false);
          if (data?.data?.responseData) {
            const AuthList = data?.data?.responseData.data;
            setLookUpList(AuthList);
          }
        } else {
          setErrorMessage(data?.data?.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleSubmitVerifyCode = async () => {
    if (
      VerifyTokenObj.verifyToken === undefined ||
      VerifyTokenObj.verifyToken === null ||
      VerifyTokenObj.verifyToken === ""
    ) {
      setRequireMessage(true);
      return false;
    }
    try {
      setLoader(true);
      const response = await GetAuthenticateWithMFA({
        userKeyID: common.userKeyID,
        mfaKeyID: VerifyTokenObj.mfaKeyID,
        mfaVerificationToken: VerifyTokenObj.verifyToken,
      });
      if (response) {
        if (response.data.statusCode === 200) {
          setLoader(false);
          const token = LoginObj.token;
          const mobileNo = LoginObj.mobileNo;
          const isPasswordSet = LoginObj.isPasswordSet;
          const roleTypeId = LoginObj.roleTypeId;
          const userId = LoginObj.userId;
          const userKeyID = LoginObj.userKeyID;
          const name = LoginObj.firstName;
          const organisationCount = LoginObj.organisationCount;
          const enableMFA = LoginObj.enableMFA;
          const userAccessList = LoginObj.userAccessList;

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
              token: token,
              name: name,
              userKeyID: userKeyID,
              isPasswordSet: isPasswordSet,
              organisationCount: organisationCount,
            })
          );

          setTimeout(function () {
            navigate("/");
            window.location.reload();
          }, 200);
        } else {
          setLoader(false);
          setErrorMessage(response.data.errorMessage);
        }
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleContinue = () => {
    if (VerifyTokenObj.authenticationTypeName == "Email") {
      GetSendMFAVerificationCodeByEmailData();
    } else {
      setShowTroubleView(showTroubleView ? false : true);
    }
  };
  const GetSendMFAVerificationCodeByEmailData = async (newTab) => {
    setLoader(true);
    try {
      const response = await GetSendMFAVerificationCodeByEmailByLogin({
        userKeyID: common.userKeyID,
        mfaKeyID: VerifyTokenObj.mfaKeyID,
        authenticationTypeID: 2,
        email: VerifyTokenObj.authenticatorName,
      });

      if (response) {
        if (response.data?.statusCode == 200) {
          setLoader(false);
          setShowTroubleView(showTroubleView ? false : true);
          setListErrorMessage("");
        } else {
          setLoader(false);
          setListErrorMessage(response.response.data.errorMessage);
        }
      } else {
        setLoader(false);
        setListErrorMessage(response.response.data.errorMessage);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleTroubleButtonClick = () => {
    setShowTroubleView(showTroubleView ? false : true);
    setErrorMessage("");
    VerifyTokenObj.verifyToken = "";
    setRequireMessage("");
  };

  const handleChange = (event) => {
    const selectedValue = JSON.parse(event.target.value); // Parse the stringified JSON back to an object

    setVerifyTokenObj({
      ...VerifyTokenObj,
      authenticationTypeName: selectedValue.authenticationTypeName,
      authenticatorName: selectedValue.authenticatorName, // Assuming authenticationTypeName is the property name
      mfaKeyID: selectedValue.mfaKeyID,
      authenticationTypeID: selectedValue.authenticationTypeID,
    });
  };

  return (
    <>
      <div className="container">
        <div class="row " style={{ justifyContent: "center" }}>
          <div className="col-md-2"></div>
          <div class="xcard text-center col-md-6 mt-5 col-lg-5 col-sm-10 p-0">
            <div class=" p-0">
              <div class="xcard-body p-4 ">
                {!showTroubleView ? (
                  <>
                    <img
                      src="https://outbooks.com/wp-content/uploads/2023/02/Outbooks-Logo.png"
                      alt="outBooks Logo"
                      class="logo_security"
                    />
                    <h1 className="card-title">2 Step Verification</h1>
                    <p className="card-text">
                      {VerifyTokenObj && (
                        <>
                          {VerifyTokenObj.authenticationTypeID === 2 ? (
                            <>
                              Please enter the 6 digit verification code sent to
                              your email. <br />
                              <strong style={{ fontWeight: "bold" }}>
                                {VerifyTokenObj.authenticatorName.replace(/^(.{3}).+(@.+)$/, (_, p1, p2) => p1 + '*'.repeat(VerifyTokenObj.authenticatorName.indexOf('@') - 3) + p2)}
                              </strong>
                            </>
                          ) : (
                            <>
                              Please enter the 6 digit verification code sent to
                              your authenticator app. <br />
                              <strong style={{ fontWeight: "bold" }}>
                                {VerifyTokenObj.authenticatorName}
                              </strong>
                            </>
                          )}
                        </>
                      )}
                      <br />
                    </p>
                    <div className="col-lg-12 p-2 ">
                      <div className="col-lg-12 p-2">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            id="basic-addon1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img src={OtpIcon} width={20} height={20} />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="6-digit code"
                            value={VerifyTokenObj.verifyToken}
                            onChange={(e) => {
                              setErrorMessage("");
                              const inputValue = e.target.value;
                              const regex = /^[0-9]{0,6}$/;
                              if (regex.test(inputValue)) {
                                setVerifyTokenObj({
                                  ...VerifyTokenObj,
                                  verifyToken: inputValue,
                                });
                              }
                            }}
                            aria-describedby="passwordHelpInline"
                          />
                        </div>
                      </div>
                      <div className="text-start">
                        {requireMessage &&
                          (VerifyTokenObj.verifyToken == undefined ||
                            VerifyTokenObj.verifyToken == null ||
                            VerifyTokenObj.verifyToken == "") ? (
                          <label
                            style={{ paddingLeft: "55px" }}
                            className="validation"
                          >
                            {ERROR_MESSAGES}
                          </label>
                        ) : (
                          <>
                            {errorMessage && <div
                              className="alert alert-danger fade show"
                              style={{
                                marginBottom: "0px",
                                fontSize: "small",
                                padding: "4px",
                                textAlign: 'center'
                              }}
                              role="alert"
                            >   {errorMessage}
                              </div>}
                            </>
                        )}
                      </div>
                    </div>

                    <br />
                    <button
                      type="button"
                      className="btn btn-md btn-success create-item-btn mb-2"
                      onClick={handleSubmitVerifyCode}
                    >
                      Verify Code
                    </button>
                    <br />
                    <Link
                      style={{ color: "#00afef" }}
                      onClick={handleTroubleButtonClick}
                    >
                      Having trouble signing in ?
                    </Link>
                    <br />

                    <Link style={{ color: "#00afef" }} to={"/login"}>
                      Back To Login
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="xcard-body  p-4">
                      <h5 className="card-title  ">
                        <BackButtonSvg onClick={handleTroubleButtonClick} />
                        Problems with your code?
                      </h5>
                      <p className="card-text ">
                        Please choose a method to confirm your identity:
                      </p>
                      <div
                        class=" justify-content-between "
                        style={{
                          overflowY: "auto",
                          height: "33vh",
                        }}
                      >
                        <div class="col-md-6 ">
                          <div class="form-group">
                            <div class="form-check ">
                              {lookupList
                                .slice(
                                  0,
                                  lookupList.length
                                )
                                .map((authList, index) => {
                                  return (
                                    <div
                                      key={authList.mfaKeyID}
                                      class="form-check form-check-lg custom-radio"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="authenticator"
                                        id={`${authList.authenticatorName.replace(
                                          /\s+/g,
                                          ""
                                        )}Authenticator`}
                                        value={JSON.stringify({
                                          mfaKeyID: authList.mfaKeyID,
                                          authenticationTypeName:
                                            authList.authenticationTypeName,
                                          authenticatorName:
                                            authList.authenticatorName,
                                          authenticationTypeID:
                                            authList.authenticationTypeName ==
                                              "AuthenticatorApp"
                                              ? 1
                                              : 2,
                                        })}
                                        checked={
                                          VerifyTokenObj.mfaKeyID ===
                                          authList.mfaKeyID
                                        }
                                        onChange={handleChange}
                                      />
                                      <label
                                        style={{ fontSize: "1.2rem" }}
                                        class="form-check-label ms-2"
                                        htmlFor={
                                          authList.authenticatorName.replace(
                                            /\s+/g,
                                            ""
                                          ) + "Authenticator"
                                        }
                                      >
                                        {authList.authenticatorName}
                                      </label>
                                    </div>
                                  );
                                })}

                              <label className="validation">
                                {listErrorMessage}
                              </label>
                            </div>
                          </div>
                          <br />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-md btn-success create-item-btn mb-3 "
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </>
  );
};

export default SecurityLandingPage;
