/* global $ */
import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { ColorContext, useColorContext } from "../../AuthContext/ColorContext";
import DraftProposalPng from "../../assets/images/Web Icons Redo/Draft Proposal Icon.svg";
import SentProposalPng from "../../assets/images/Web Icons Redo/Proposal Sent Icon.svg";
import DraftEngagementLatterPng from "../../assets/images/gallery/Draft Engagement Letters icon.svg";
import EngagementLatterSendSvg from "../../assets/images/gallery/Engagement letters sent icon.svg";
import EngagementLatterAwaitingSignatureSvg from "../../assets/images/gallery/Engagement letter Awaiting sign icon.svg";
import EngagementLatterSignedSvg from "../../assets/images/gallery/Engagement letters signed icon.svg";
import EngagementLaterDeclinedSvg from "../../assets/images/gallery/Engagement Letter Declined icon.png";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import Footer from "../../components/Footer";
import Select from "react-select";
import { VerifySocialMediaLoginCredential } from "../../redux/Services/Auth/loginApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_ROLE_TYPE } from "../../Middleware/enums";
import { updateState } from "../../redux/Persist";
import ErrorModel from "../../components/ErrorModel";
import { ThirdPartyAppLogin } from "../../redux/Services/ConnectWithOldSystem/ThirdPartyApi";
import DashboardSvg from "../../../src/assets/images/Navbar Icons/Dashboard Icon.svg";


const Dashboard = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const common = useSelector((state) => state.Storage);
    const searchParams = new URLSearchParams(location.search);
    const Email = searchParams.get("EmailId")
    const AuthorizationToken = searchParams.get("AuthorizationToken")
    const FirstName = searchParams.get("FirstName")
    const LastName = searchParams.get("LastName")
    const {
        setTopbar,
        proposalName,
        EngagementName,
        setLoader, SetAccessCount
    } = useContext(AuthContextProvider);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [errorMessage, setErrorModalMessage] = useState();
    const {
    } = useContext(ColorContext);

    useEffect(() => {
        setTopbar("block");
        if ((Email !== null && Email !== undefined) || (AuthorizationToken !== null && AuthorizationToken !== undefined)) {
            ThirdPartyAppLoginData()
            setLoader(true);
        } else if (common.token) {
            navigate("/")
        } else if (!common.token) {
            navigate("/login")
        }
        // handleSocialMediaLogin()
    }, [Email, AuthorizationToken]);

    const ThirdPartyAppLoginData = async () => {
        try {
            const data = await ThirdPartyAppLogin({
                email: Email,
                authorizationToken: AuthorizationToken
            })
            if (data.data.VerificationStatus) {
                handleSocialMediaLogin({
                    email: Email,
                    firstName: data.data.FirstName,
                    lastName: data.data.LastName,
                    loginBy: "Outbooks",
                })
            } else {
                window.location.href = "https://teststaging.outbooks.com/dashboard";
            }
        } catch (error) {
            console.log(error, "error")
        }
    }
    const handleSocialMediaLogin = async (params) => {
        setLoader(true);
        const apiUrl = await VerifySocialMediaLoginCredential(
            params
        );

        if (apiUrl) {
            if (apiUrl.data?.responseData?.data?.status === 0) {
                setOpenErrorModal(true);
                setErrorModalMessage(apiUrl.data.responseData.data.message);
            }
            if (apiUrl?.data?.statusCode === 200) {
                const token = apiUrl.data.responseData.data.token;
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
                const currency = 'GBP';
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
                        email: Email,
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
                        currency: currency
                    })
                );
                if (organisationCount === 0) {
                    navigate("/get-started");
                } else {
                    navigate("/");
                }
            }
        }
    };

    const handleClose = () => {
        $("#" + "ConfirmModel").modal("hide");
        setOpenErrorModal(false);
    };
    return (
        <>
            <div className="container" style={{ display: "Block" }}>
                <div className="row">
                    <header
                        id="page-topbar"
                        style={{
                            backgroundColor: "#333547",
                        }} // set display block and none using authcontext
                    >
                        <div class="layout-width">

                            <div class="navbar-header ">
                                <button
                                    type="button"

                                    class="btn btn-sm px-2  fs-16 header-item vertical-menu-btn topnav-hamburger"
                                    id="topnav-hamburger-icon"
                                >
                                    <span class="hamburger-icon">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                </button>
                                <div class="d-flex">
                                    <div class="navbar-menu">
                                        <div class="container">
                                            <div class="row" style={{ marginTop: "5px" }}>
                                                <ul
                                                    className={`changed-nav navbar-nav`}
                                                    id="navbar-UL-nav"
                                                >
                                                    <li class="menu-title">
                                                        <span data-key="t-menu">Menu</span>
                                                    </li>
                                                    {/* Dashboard Start */}

                                                    <li class="nav-item">

                                                        <img
                                                            src={DashboardSvg}
                                                            alt="Dashboard"
                                                            style={{ width: "16px", marginRight: "5px" }}
                                                        />
                                                        {/* <i class="bi bi-graph-up mr-2"></i> */}
                                                        <span data-key="t-dashboard">Dashboard</span>

                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </header>
                </div>

                {/* <!-- ========== App Menu ========== --> */}
                <div class="app-menu ">
                    <div id="scrollbar">
                        <div class="container-fluid">
                            <div id="two-column-menu"></div>
                            <ul class="navbar-nav" id="navbar-nav"></ul>
                        </div>
                    </div>
                    <div class="sidebar-background"></div>
                </div>
                {/* <!-- Left Sidebar End -->
        <!-- Vertical Overlay--> */}
                <div class="vertical-overlay"></div>

                {/* <!-- end main content--> */}
            </div>
            <div class="main-content">
                <div class="page-content" style={{ height: '90vh' }}>

                    <div class="container">
                        <div class="col-lg-1">
                            <h5 className="page-title-cls">Dashboard</h5>
                        </div>
                        <div class="row align-items-center  left-margin">
                            <div className="col-lg-6 col-md-8 col-sm-8 ">
                                <div>
                                    <Select
                                        className="user-role-select phone-input-country-code"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-4 mt-1 ">
                                <div className="add-new-btn">
                                    <button
                                        className="btn btn-success create-item-btn add-new"
                                    >
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="date-picker-div"></div>
                            </div>
                        </div>
                        <div class="row dashboard-top-class">
                            <div class="col">
                                <div class="h-100">
                                    <div className="dashboard-top" class="row">
                                        <div class="col-xl-8 col-lg-8 col-sm-12 ">
                                            <div class="row">
                                                {/* proposal start */}
                                                {/* 
                                                {(userAccessData.Admin_Proposal_CanView ||
                                                    common.organisationKeyID == null) && ( */}
                                                <>
                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12 `}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"
                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={DraftProposalPng}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="text-white mb-0">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success  text-white text-sm font-weight-bolder" />
                                                                        Draft {proposalName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12`}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"

                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={SentProposalPng}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class=" text-white  mb-0">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1">
                                                                        {/* <p class="text-sm mb-0 text-capitalize">Sent</p> */}
                                                                        {/* <h4 class=" text-white  mb-0">44</h4> */}
                                                                    </div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        {proposalName} Sent
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* proposal start */}
                                                    {/* {(common.enableEL == 0 ||
                                                                common.enableEL == null) && ( */}
                                                    <>
                                                        <div
                                                            className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12 `}
                                                        >
                                                            <div className="dashboard-new-design">
                                                                <div
                                                                    class="card"

                                                                >
                                                                    <div
                                                                        class="card-header p-3 pt-2"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-lg-6">
                                                                                <img
                                                                                    src={DraftEngagementLatterPng}
                                                                                    className="CardImage"
                                                                                    alt
                                                                                />
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <div class="text-end pt-1">
                                                                                    <h4 class="mb-0 text-white ">
                                                                                        0
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="text-end pt-1"></div>
                                                                    </div>
                                                                    <hr class="dark horizontal my-0" />
                                                                    <div
                                                                        class="card-footer p-3"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <p class="mb-0 font-weight-bolder">
                                                                            <span class="text-success text-sm font-weight-bolder" />
                                                                            Awaiting Response
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    {/* )} */}
                                                    {/* {(common.enableEL == 0 ||
                                                                common.enableEL == null) && ( */}
                                                    <>
                                                        <div
                                                            className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12`}
                                                        >
                                                            <div className="dashboard-new-design">
                                                                <div
                                                                    class="card"
                                                                >
                                                                    <div
                                                                        class="card-header p-3 pt-2"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-lg-6">
                                                                                <img
                                                                                    src={DraftEngagementLatterPng}
                                                                                    className="CardImage"
                                                                                    alt
                                                                                />
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <div class="text-end pt-1">
                                                                                    <h4 class="mb-0 text-white ">
                                                                                        0
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="text-end pt-1"></div>
                                                                    </div>
                                                                    <hr class="dark horizontal my-0" />
                                                                    <div
                                                                        class="card-footer p-3"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <p class="mb-0 font-weight-bolder">
                                                                            <span class="text-success text-sm font-weight-bolder" />
                                                                            {proposalName} Accepted
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12`}
                                                        >
                                                            <div className="dashboard-new-design">
                                                                <div
                                                                    class="card"
                                                                >
                                                                    <div
                                                                        class="card-header p-3 pt-2"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <div className="row">
                                                                            <div className="col-lg-6">
                                                                                <img
                                                                                    src={EngagementLatterSendSvg}
                                                                                    className="CardImage"
                                                                                    alt
                                                                                />
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <div class="text-end pt-1">
                                                                                    <h4 class="mb-0 text-white ">
                                                                                        0
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="text-end pt-1"></div>
                                                                    </div>
                                                                    <hr class="dark horizontal my-0" />
                                                                    <div
                                                                        class="card-footer p-3"
                                                                        style={{
                                                                            backgroundColor: "#626ed4",
                                                                        }}
                                                                    >
                                                                        <p class="mb-0 font-weight-bolder">
                                                                            <span class="text-success text-sm font-weight-bolder" />
                                                                            {proposalName} Declined
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    {/* )} */}
                                                </>
                                                {/* // )} */}
                                            </div>
                                            {/* proposal end  */}

                                            {/* engagement start */}
                                            <div className="row">
                                                {/* {(common.enableEL == 1 || common.enableEL == null) &&
                                                    (userAccessData.Admin_Engagement_Latter_CanView ||
                                                        common.organisationKeyID == null) && ( */}
                                                <>
                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  `}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"

                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={EngagementLatterSendSvg}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="mb-0 text-white ">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        Draft {EngagementName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12  `}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"

                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={EngagementLatterSendSvg}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="mb-0 text-white ">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        {EngagementName} Sent
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12`}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"
                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={
                                                                                    EngagementLatterAwaitingSignatureSvg
                                                                                }
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="mb-0 text-white ">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        {EngagementName} Viewed
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12`}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"
                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={EngagementLatterSignedSvg}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="mb-0 text-white ">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        {EngagementName} Signed
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`col-xl-3 col-lg-3 col-md-4 dashboard-box col-sm-12 `}
                                                    >
                                                        <div className="dashboard-new-design">
                                                            <div
                                                                class="card"

                                                            >
                                                                <div
                                                                    class="card-header p-3 pt-2"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <img
                                                                                src={EngagementLaterDeclinedSvg}
                                                                                className="CardImage"
                                                                                alt
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div class="text-end pt-1">
                                                                                <h4 class="mb-0 text-white ">
                                                                                    0
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-end pt-1"></div>
                                                                </div>
                                                                <hr class="dark horizontal my-0" />
                                                                <div
                                                                    class="card-footer p-3"
                                                                    style={{
                                                                        backgroundColor: "#626ed4",
                                                                    }}
                                                                >
                                                                    <p class="mb-0 font-weight-bolder">
                                                                        <span class="text-success text-sm font-weight-bolder" />
                                                                        {EngagementName} Declined
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                {/* // )} */}
                                            </div>
                                        </div>
                                        {/* {(userAccessData.Admin_Activity_Log_CanView ||
                                            common.organisationKeyID == null) && ( */}
                                        <>
                                            <div class="col-xl-4 col-lg-4">
                                                <div class="card activity-section-cls">
                                                    <div class="card-body dashboard-body">
                                                        <h5 className="activity-cls">Activity</h5>
                                                        <ol class="activity-feed">

                                                            <>
                                                                <h6 className="activity-cls">
                                                                    No Activity Logs Found Today..
                                                                </h6>
                                                            </>

                                                        </ol>
                                                        <>
                                                            {" "}
                                                            <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                                                                <div className="add-new-btn">
                                                                    <button
                                                                        className="btn btn-success create-item-btn add-new"

                                                                    >
                                                                        <span>View All</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        {/* )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- container-fluid --> */}
                </div>
                {/* <!-- End Page-content --> */}
                <ErrorModel
                    ErrorModel={openErrorModal}
                    handleClose={handleClose}
                    ErrorMessage={errorMessage}
                />
                <Footer />
            </div>
        </>
    );
};

export default Dashboard;
