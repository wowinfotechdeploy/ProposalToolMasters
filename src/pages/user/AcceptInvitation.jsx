import React, { useContext, useEffect, useState } from "react";
import acceptInviteIMG from "../../assets/images/accept-invite.jpg";
import ExpireImg from "../../assets/images/ExpireImg.jpg";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ValidateUserToken } from "../../redux/Services/Auth/PasswordApi";
import { AcceptUserInvitation } from "../../redux/Services/Setting/InviteUserApi";

import { resetState } from "../../redux/Persist";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
function AcceptInvitation() {
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const { setTopbar, setLoader } = useContext(AuthContextProvider);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const [token, setToken] = useState(searchParams.get("token"));
  const common = useSelector((state) => state.Storage);

  // useEffect(() => {
  //     dispatch(resetState());
  //     GetUserTokenVerificationStatus();
  //     setTopbar("none");
  // }, [token, common.token,navigate]);

  useEffect(() => {
    GetUserTokenVerificationStatus();
    setTopbar("none");
  }, []);

  const GetUserTokenVerificationStatus = async () => {
    setLoader(true);
    try {
      const tokenType = "InviteUser";
      const response = await ValidateUserToken(token, tokenType);
      if (response) {
        setLoader(false);
        if (response?.data?.statusCode === 200) {
          setVerifyToken(response?.data?.responseData?.data);
        } else {
          {
            response?.response?.data?.errorMessage
              ? setErrorMessage(response?.response?.data?.errorMessage)
              : setErrorMessage("Something went wrong");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInvitation = async () => {
    const url = `AcceptInvitation?UserToken=${token}`;
    const response = await AcceptUserInvitation(url);
    if (response) {
      if (response?.data?.responseData?.data.status === "Success") {
        if (response?.data?.responseData?.data.isInvitedUserRegistered) {
          navigate("/login");
        } else {
          navigate("/registration", {
            state: {
              firstName: response?.data?.responseData?.data.firstName,
              lastName: response?.data?.responseData?.data.lastName,
              email: response?.data?.responseData?.data.email,
            },
          });
        }
      }
    }
  };
  const handleReloadClick = () => {
    const broadcastChannel = new BroadcastChannel("reloadChannel");
    broadcastChannel.postMessage("reload");
  };
  const handleAcceptAndReload = async () => {
    await handleAcceptInvitation();
    handleReloadClick();
  };
  return (
    <React.Fragment>
      <div className="authentication-bg d-flex align-items-center pb-0 vh-100">
        <div className="content-center w-100">
          <div className="container">
            <Card className="mo-mt-2">
              <CardBody>
                <Row className="align-items-center">
                  {verifyToken === "Active" && (
                    <Col lg="6" className="ml-auto">

                      <div className="ex-page-content text-center">
                        <h4 className="mb-4">
                          Yes, I would like to accept the invite
                        </h4>
                        <button
                          type="submit"
                          class="btn btn-md btn-success create-item-btn"
                          onClick={() => {
                            handleAcceptInvitation();
                            handleAcceptAndReload();
                          }}
                        >
                          <span>Accept Invite</span>
                        </button>
                      </div>
                    </Col>
                  )}
                  {((verifyToken === "" || verifyToken === null)) ? (
                    <Col lg="6" className="ml-auto">
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh" }} className="expired">

                        <>
                          <div
                            style={{
                              justifyContent: "center",
                            }}
                            className="mb-4 d-flex"
                          >
                            <svg
                              viewBox="0 0 100 100"
                              preserveAspectRatio="xMidYMid"
                              width="50"
                              height="50"
                              style={{
                                shapeRendering: "auto",
                                display: "block",
                                background: "rgb(255, 255, 255)",
                              }}
                            >
                              <g>
                                <rect
                                  fill="#009fe5"
                                  height="40"
                                  width="15"
                                  y="30"
                                  x="17.5"
                                >
                                  <animate
                                    begin="-0.2s"
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="18;30;30"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="y"
                                  ></animate>
                                  <animate
                                    begin="-0.2s"
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="64;40;40"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="height"
                                  ></animate>
                                </rect>
                                <rect
                                  fill="#3ba098"
                                  height="40"
                                  width="15"
                                  y="30"
                                  x="42.5"
                                >
                                  <animate
                                    begin="-0.1s"
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="20.999999999999996;30;30"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="y"
                                  ></animate>
                                  <animate
                                    begin="-0.1s"
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="58.00000000000001;40;40"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="height"
                                  ></animate>
                                </rect>
                                <rect
                                  fill="#122549"
                                  height="40"
                                  width="15"
                                  y="30"
                                  x="67.5"
                                >
                                  <animate
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="20.999999999999996;30;30"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="y"
                                  ></animate>
                                  <animate
                                    keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                    values="58.00000000000001;40;40"
                                    keyTimes="0;0.5;1"
                                    calcMode="spline"
                                    dur="1s"
                                    repeatCount="indefinite"
                                    attributeName="height"
                                  ></animate>
                                </rect>
                              </g>
                            </svg>
                          </div>
                          <div style={{ color: "#6c757d" }}>
                            <b>Please wait</b>
                          </div>
                          <div style={{ color: "#6c757d", fontSize: "12px" }}>
                            Do not refresh page{" "}
                          </div>
                        </>

                      </div>
                    </Col>
                  ) : null}
                  {verifyToken === "Expired" && (
                    <Col lg="6" className="ml-auto">
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh" }} className="expired">

                        <div className="message">
                          <h4>Oops, this link is expired.</h4>
                        </div>
                        <div className="light">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="light_btm">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </Col>
                  )}
                  {/* {verifyToken !== "Expired" && */}
                  <Col lg="6" className="mx-auto">
                    <img
                      src={acceptInviteIMG}
                      alt="acceptInviteIMG"
                      className="img-fluid mx-auto d-block"

                    />
                  </Col>
                  {/* } */}
                  {/* {verifyToken === "Expired" &&
                    <Col lg="6" className="mx-auto">
                      <img
                        src={ExpireImg}
                        alt="ExpireImg"
                        className="img-fluid mx-auto d-block"
                      />

                    </Col>
                  } */}
                </Row>
                {/* {verifyToken !== "Expired" && */}
                <Row className="align-items-center">

                  <Col sm="12" className="text-center">
                    <p>
                      <i>
                        <strong>Note:</strong>
                        This link will expire in 7 Days. And once accepted
                        cannot be used again.
                      </i>
                    </p>
                  </Col>
                </Row>
                {/* } */}

              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AcceptInvitation;
