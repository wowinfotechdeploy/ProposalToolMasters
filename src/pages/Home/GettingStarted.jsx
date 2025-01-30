/* global $ */
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/company-logos/outbooks.png";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { resetState, updateState } from "../../redux/Persist";
import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ColorContext, useColorContext } from "../../AuthContext/ColorContext";
import profile from "../../../src/assets/images/profile.jpg";
import LogoutModal from "../../components/LogoutModal";
// import { useMsal } from "@azure/msal-react";

import { OutBooksTitle } from "../../components/GlobalMessage";
import Footer from "../../components/Footer";
import ResetPasswordModal from "../../Auth/ResetPassword/ResetPasswordModal";
import SetTimeoutComponent from "../../components/SetTimeoutComponent";
import UserModelNew from "../../components/UserModelNew";

const GetStarted = () => {
  // declare state
  const dispatch = useDispatch();
  const [organisationsList, setOrganisationsList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(""); // Initialize selectedValue state
  const [showUserModal, setShowUserModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [currentTopbarColor, setCurrentTopbarColor] = useState("#333547");
  const [currentTopbarTextColor, setCurrentTopbarTextColor] =
    useState("#8d8d8d");
  const {
    topbar,
    setTopbar,
    prospectName,
    updatedName,
    handleInputChange,
    handleNameChange,
    proposalName,
    updatedProposalName,
    handleInputChangeProposal,
    handleNameChangeProposal,
    updatedEngagementName,
    EngagementName,
    handleNameChangeEngagement,
    handleInputChangeEngagement,
    setLoader,
  } = useContext(AuthContextProvider);
  const {
    currentCardColor,
    handleOnChangeCard,
    handleSetDefault,
    setCardBackgroundColor,
    setCurrentCardColor,
  } = useContext(ColorContext);
  // const { instance } = useMsal();

  const location = useLocation();
  // B]declare variables
  const navigate = useNavigate();
  const TopbarStyle = {
    backgroundColor: currentTopbarColor,
  };
  const topTextColor = {
    color: currentTopbarTextColor,
  };
  const common = useSelector((state) => state.Storage);
  // c]Declare Initial Effect
  const [dataTarget, setDataTarget] = useState("");
  const [dataToggle, setDataToggle] = useState("");
  const [isOpenSessionTimeout, setIsOpenSessionTimeout] = useState(false);
  useEffect(() => {
    setTopbar("none");
    setLoader(false);
  }, []);

  useEffect(() => {
    if (common.mobileNo === null) {
      setShowUserModal(true);
      $("#GetStartedUserUpdate").modal("show");
      setDataTarget("");
      setDataToggle("");
    } else {
      setDataTarget("");
      setDataToggle("");
    }
  }, []);

  // D] declare Handle Function
  const OnOrganisationsChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "1") {
      navigate("/create-new-practice", { state: 1 });
    } else {
      dispatch(
        updateState({
          organisationKeyID: selectedValue,
        })
      );
    }
  };

  const handleNavigate = () => {
    navigate("/create-new-practice");
  };

  const handleOpenSessionModel = () => {
    setIsOpenSessionTimeout(true);
  };
  const handleCloseSessionModel = () => {
    setIsOpenSessionTimeout(false);
  };
  // E] Declare onchange
  const OnChangeTopbarColor = (event) => {
    const newColor = event.target.value;
    setCurrentTopbarColor(newColor);
  };

  const OnChangeTopbarTextColor = (event) => {
    const newColor = event.target.value;
    setCurrentTopbarTextColor(newColor);
  };

  //F] declare Other Function
  const Logout = () => {
    // instance.logoutRedirect({
    //     postLogoutRedirectUri: "/",
    // });
    localStorage.removeItem("userThemeSettingLocalStorage");
    dispatch(resetState());
    navigate("/login");
  };

  const Notifications = () => {
    navigate("/notification");
  };

  const setDefault = () => {
    setCurrentCardColor("#626ed4");
    setCurrentTopbarColor("#333547");
    setCurrentTopbarTextColor("#8d8d8d");
  };

  const ToggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const DriverValueKeyPress = (e) => {
    if (e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
  };

  // LogoutTime function
  const LogoutTime = () => {
    setSuccessMessage("Logout Time Set successfully!");
  };

  const List = (anchor) => (
    <>
      <div
        class="d-flex align-items-center bg-gradient offcanvas-header sidebar-header"
        style={TopbarStyle}
      >
        <h5 class="m-0 me-2" style={topTextColor}>
          Theme Customiser
        </h5>
        <button
          type="button"
          class="btn-close btn-close-white ms-auto"
          id="customizerclose-btn"
          onClick={ToggleDrawer(anchor, false)}
        ></button>
      </div>
      <Box
        className="color-sidebar"
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        //  onClick={ToggleDrawer(anchor,false)}
        onKeyDown={ToggleDrawer(anchor, false)}
        onKeyPress={ToggleDrawer(anchor, true)}
      >
        <div className="row">
          <div className="col-8" style={{ marginTop: "10px" }}>
            {" "}
            <h6 class="fw-semibold fs-15">Color Scheme:</h6>
          </div>
          <div className="col-4 float">
            <h6 class="fw-semibold fs-15">
              <button
                type="button"
                onClick={setDefault}
                style={{ backgroundColor: "#ebebebe0", fontSize: "small" }}
                className="btn "
              >
                Default
              </button>
            </h6>
          </div>
        </div>

        <p class="text-muted fs-13 sidebar-sub-title">Set your color scheme</p>

        <div className="row">
          <div className="col-md-6">
            <input
              type="color"
              class="form-control height"
              id="exampleColorInput contactNumber"
              value={currentTopbarColor}
              onChange={OnChangeTopbarColor}
            />
            <h5 class="fs-13 text-center mt-2">Header color</h5>
          </div>
          <div className="col-md-6">
            <input
              type="color"
              class="form-control height"
              id="exampleColorInput contactNumber"
              value={currentTopbarTextColor}
              onChange={OnChangeTopbarTextColor}
            />
            <h5 class="fs-13 text-center mt-2">Header Text</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              type="color"
              class="form-control height"
              id="exampleColorInput contactNumber"
              value={currentCardColor}
              onChange={handleOnChangeCard}
            />
            <h5 class="fs-13 text-center mt-2">Card</h5>
          </div>
        </div>
      </Box>
    </>
  );

  return (
    <div className="container">
      <div
        className="container"
        style={{ display: "block", marginBottom: "180px" }}
      >
        <div className="row">
          <header id="page-topbar" style={TopbarStyle}>
            <div class="layout-width">
              <div class="navbar-header1">
                <div class="d-flex">
                  <div
                    class="navbar-menu topdropdowm"
                    style={{ position: "fixed", top: "20px" }}
                  >
                    <div class="container">
                      <div class="row">
                        <ul class="navbar-nav" id="navbar-nav">
                          <li
                            class="nav-item edit-dropdown-cls"
                            style={{ width: "17%" }}
                          >
                            <Tooltip title={"Create New Practice"}>
                              <button
                                className=" organisation-selector organisationBtn"
                                onClick={() => {
                                  navigate("/create-new-practice", {
                                    state: 1,
                                  });
                                }}
                              >
                                <i class="bi bi-plus-circle margin-right"></i>
                                <span> Create New Practice</span>
                              </button>
                            </Tooltip>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="navbar-header" style={{ height: "75px" }}>
                <button
                  type="button"
                  // onClick={ToggleNavigationChange}
                  class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                  id="topnav-hamburger-icon"
                >
                  <button
                    className=" organisation-selector organisationBtn"
                    onClick={() => {
                      navigate("/create-new-practice", { state: 1 });
                    }}
                  >
                    <i class="bi bi-plus-circle margin-right"></i>
                    <span> Create New Practice</span>
                  </button>
                </button>
                <div class="d-flex">
                  <div
                    class="d-flex align-items-center search"
                    style={{ marginTop: "0px" }}
                  >
                    <Tooltip title={"Notifications"}>
                      <div
                        class="dropdown topbar-head-dropdown ms-1 header-item"
                        id="notificationDropdown"
                      >
                        <button
                          type="button"
                          class="btn btn-icon btn-topbar btn-ghost-dark rounded-circle"
                          id="page-header-notifications-dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xlink="http://www.w3.org/1999/xlink"
                              width="22"
                              zoomAndPan="magnify"
                              viewBox="0 0 36 36.000001"
                              height="22"
                              preserveAspectRatio="xMidYMid meet"
                              version="1.0"
                            >
                              <defs>
                                <clipPath id="4d9247cc3b">
                                  <path
                                    d="M 6.925781 1.128906 L 28.816406 1.128906 L 28.816406 33.964844 L 6.925781 33.964844 Z M 6.925781 1.128906 "
                                    clip-rule="nonzero"
                                  />
                                </clipPath>
                              </defs>
                              <g clip-path="url(#4d9247cc3b)">
                                <path
                                  fill="#ffffff"
                                  d="M 15.132812 31.050781 L 20.605469 31.050781 L 20.605469 31.4375 C 20.605469 32.832031 19.476562 33.960938 18.082031 33.960938 L 17.660156 33.960938 C 16.265625 33.960938 15.132812 32.832031 15.132812 31.4375 Z M 28.644531 23.242188 C 26.976562 20.921875 26.078125 18.132812 26.078125 15.265625 L 26.078125 12.8125 C 26.078125 8.882812 23.40625 5.40625 19.695312 4.539062 L 19.695312 2.816406 C 19.695312 1.886719 18.941406 1.132812 18.011719 1.132812 L 17.730469 1.132812 C 16.800781 1.132812 16.046875 1.886719 16.046875 2.816406 L 16.046875 4.535156 C 12.390625 5.367188 9.660156 8.625 9.660156 12.53125 L 9.660156 15.265625 C 9.660156 18.132812 8.761719 20.921875 7.09375 23.242188 C 6.984375 23.394531 6.925781 23.574219 6.925781 23.761719 L 6.925781 28.035156 C 6.925781 28.539062 7.332031 28.945312 7.835938 28.945312 L 27.902344 28.945312 C 28.40625 28.945312 28.816406 28.539062 28.816406 28.035156 L 28.816406 23.761719 C 28.816406 23.574219 28.753906 23.394531 28.644531 23.242188 Z M 28.644531 23.242188 "
                                  fill-opacity="1"
                                  fillRule="nonzero"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                        {/* ....end..... */}
                      </div>
                    </Tooltip>
                    <div class="dropdown ms-sm-3 header-item ">
                      <Tooltip title={common.name}>
                        <button
                          style={{ background: "transparent", border: "none" }}
                          type="button"
                          class="btn"
                          id="page-header-user-dropdown"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span class="d-flex align-items-center">
                            <img
                              class="rounded-circle header-profile-user"
                              src={profile}
                              alt="Header Avatar"
                            />
                          </span>
                        </button>
                      </Tooltip>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a
                          class="dropdown-item"
                          onClick={() => setShowUserModal(true)}
                          data-bs-target={
                            common.mobileNo === null
                              ? ""
                              : "#GetStartedUserUpdate"
                          }
                          data-bs-toggle="modal"
                          style={{ cursor: "pointer" }}
                        >
                          <span class="align-middle" data-key="t-logout">
                            Hello {" "}
                            <strong class="FontW">
                              {common.name.length > 15
                                ? `${common.name.slice(0, 15)}....`
                                : common.name}
                            </strong>
                            <hr />
                          </span>
                          {/* <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "} */}
                          <i
                            class="bi bi-person"
                            style={{ marginRight: "5px" }}
                          ></i>{" "}
                          <span class="align-middle" data-key="t-logout">
                            My Profile
                          </span>
                        </a>
                        <a
                          class="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#ResetPasswordModal"
                          style={{ cursor: "pointer" }}
                        // onClick={ResetPasswordClicked}
                        >
                          {/* <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "} */}
                          <i class=" mdi mdi-key-star text-muted fs-16 align-middle me-1"></i>{" "}
                          <span class="align-middle" data-key="t-logout">
                            {common.isPasswordSet
                              ? "Reset Password"
                              : "Set Password"}
                          </span>
                        </a>
                        <a
                          class="dropdown-item"
                          onClick={handleOpenSessionModel}
                          // data-bs-toggle="modal"
                          // data-bs-target="#SetLogoutTimeModal"
                          style={{ cursor: "pointer" }}
                        >
                          <i class="mdi mdi-clock-outline text-muted fs-16 align-middle me-1"></i>{" "}
                          <span class="align-middle" data-key="t-logout">
                            Set Session Timeout
                          </span>
                        </a>

                        <a
                          class="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#logoutModal"
                          style={{ cursor: "pointer" }}
                        >
                          <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
                          <span class="align-middle " data-key="t-logout">
                            Logout
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
        {/* <!-- LOGOUT MODAL --> */}
        <LogoutModal Logout={Logout} />
      </div>
      {/* card body*/}
      <div className="container">
        <div className="row mt-3">
          <div className="col-lg-12 d-flex align-items-center justify-content-center">
            <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
              <div className="card-body get-started-card row " >
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                  <img src={logo} className="img-fluid" alt="Logo" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 text-center" >
                  <h2>Welcome to {OutBooksTitle}!</h2>
                  <p className="mt-4">
                    Please create a new practice to get started or contact your
                    administrator to request access to the portal.
                  </p>
                  <Tooltip title={"Create New Practice"}>
                    <button
                      onClick={() => {
                        navigate("/create-new-practice", {
                          state: 1,
                        });
                      }}
                      className="btn btn-md btn-dark create-item-btn mt-3"
                    >
                      Create New Practice
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <SetTimeoutComponent id="SetLogoutTimeModal" /> */}
      <ResetPasswordModal id="ResetPasswordModal" />

      <UserModelNew
        id="GetStartedUserUpdate"
        class="modal fade"
        tabIndex="-1"
        aria_labelledby="exampleModalLabel"
        aria_hidden="true"
        open={showUserModal}
        setShowUserModal={setShowUserModal}
        UserKeyID={common.userKeyID}
        Edit={true}
        setIsAddUpdateActionDone={false}
      />
      <SetTimeoutComponent
        isOpenSessionTimeout={isOpenSessionTimeout}
        handleCloseSessionModel={handleCloseSessionModel}
      />

      <Footer />
    </div>
  );
};

export default GetStarted;
