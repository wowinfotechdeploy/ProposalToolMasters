import React, { useContext, useEffect, useState } from "react";
import "../login/LoginStyle.css";
import iconFacebook from "../../assets/images/icon-fb.webp";
import iconLinkedin from "../../assets/images/icon-ln.webp";
import iconX from "../../assets/images/icon-x.webp";
import iconYoutube from "../../assets/images/icon-yt.webp";
import logoImg from "../../assets/images/company-logos/logo-outbooks-proposal.webp";
import newPasswordImg from "../../assets/images/icon-key.png";
import "../Auth.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ResetForgottenPassword } from "../../redux/Services/Auth/PasswordApi";
import { ValidateUserToken } from "../../redux/Services/Auth/PasswordApi";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { OutBooksTitle } from "../../components/GlobalMessage";
import { resetState } from "../../redux/Persist";
import { useDispatch } from "react-redux";
import SuccessModal from "../../components/SuccessModal";
const NewResetPage = () => {
    /* -------------------------------------------------------------------------- */
    /*                                Declare State                               */
    /* -------------------------------------------------------------------------- */
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [verifyToken, setVerifyToken] = useState("");
    const [requireErrorMessage, setRequireErrorMessage] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { setLoginLoader, toggleMenuVisibility,
        isMenuVisible, setMenuVisible } = useContext(AuthContextProvider);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [token, setToken] = useState(searchParams.get("token"));
    const dispatch = useDispatch();
    const [CreateNewPassword, setCreateNewPassword] = useState({
        Password: "",
        ConfirmPassword: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        Password: "",
        ConfirmPassword: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("userThemeSettingLocalStorage");
        dispatch(resetState());
        GetUserTokenVerificationStatus();
        setMenuVisible(false)
    }, [token]);
    useEffect(() => {
        setMenuVisible(false)
    }, []);

    const setInitialData = () => {
        setCreateNewPassword({
            Password: "",
            ConfirmPassword: "",
            CurrentPassword: "",
        });
        setValidationErrors({
            Password: "",
            ConfirmPassword: "",
        });
    };

    //handle Function password change
    const handlePasswordChange = (e) => {
        setErrorMessage('')
        const inputValue = e.target.value;
        const passwordWithoutSpaces = inputValue.replace(/\s+/g, ""); // Remove all spaces
        setCreateNewPassword({
            ...CreateNewPassword,
            Password: passwordWithoutSpaces,
        });
        validateConfirmPassword(
            passwordWithoutSpaces,
            CreateNewPassword.ConfirmPassword
        );
        validatePassword(passwordWithoutSpaces);
    };

    //handle Function Confirm  password
    const handleConfirmPasswordChange = (e) => {
        setErrorMessage('')
        const inputValue = e.target.value;
        const trimmedValue = inputValue.replace(/\s+/g, ""); // Remove leading spaces
        setCreateNewPassword({
            ...CreateNewPassword,
            ConfirmPassword: trimmedValue,
        });
        validateConfirmPassword(CreateNewPassword.Password, trimmedValue);
    };

    // validation Function for new password
    const validatePassword = (password) => {
        const isFieldEmpty = password.trim() === "";
        if (isFieldEmpty) {
            setValidationErrors({
                ...validationErrors,
                Password: "This field is required.",
            });
        } else {
            const patternError =
                /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d!@#$%^&*?()_+-]{8,}$/.test(password)
                    ? ""
                    : "Password should be minimum 8 characters long. It must contain at least 1 letter, at least 1 number and at least 1 of the following special characters -@$!%*#?&";

            setValidationErrors({
                ...validationErrors,
                Password: patternError,
            });
        }
    };

    // validation Function for Confirm password
    const validateConfirmPassword = (password, confirmPassword) => {
        if (confirmPassword === password) {
            setValidationErrors({ ...validationErrors, ConfirmPassword: "" });
        } else {
            setValidationErrors({
                ...validationErrors,
                ConfirmPassword: "Passwords do not match.",
            });
        }
    };

    //2]Add Update Button Click Function check this function thrice input field valid and correct password
    const CreateNewPasswordClicked = () => {
        let hasError = false;

        if (
            CreateNewPassword.Password === undefined ||
            CreateNewPassword.Password === "" ||
            CreateNewPassword.ConfirmPassword === undefined ||
            CreateNewPassword.ConfirmPassword === ""
        ) {
            hasError = true;
            setRequireErrorMessage(true);
            return false; // Return false or handle your error logic here if needed.
        } else {
            hasError = false;
            setRequireErrorMessage(""); // Clear the error message if there are no errors.
        }

        const pass = /^(?=.*\d)(?=.*[-@$!%*#?&])[A-Za-z\d!@#$%^&*?()_+-]{8,}$/.test(
            CreateNewPassword.Password
        );
        if (!pass) {
            setRequireErrorMessage(true);
            setValidationErrors({
                ...validationErrors,
                Password:
                    "Password should be minimum 8 characters long. It must contain at least 1 letter, at least 1 number and at least 1 of the following special characters -@$!%*#?&",
            });
            hasError = true;
        } else {
            hasError = false;
        }
        if (CreateNewPassword.Password !== CreateNewPassword.ConfirmPassword) {
            setValidationErrors({
                ...validationErrors,
                ConfirmPassword: "Passwords do not match.",
            });
            hasError = true;
        }
        // Preparing Object For Add Update and if any modification then it will done here
        const ApiRequest_ParamsObj = {
            createPassword: CreateNewPassword.Password,
            confirmPassword: CreateNewPassword.ConfirmPassword,
            userToken: token,
        };
        if (!hasError) {
            UpdateForgotPasswordDetail(ApiRequest_ParamsObj);
        }
    };

    // Forgot password  Api Call
    const UpdateForgotPasswordDetail = async (ApiRequest_ParamsObj) => {
        setLoginLoader(true);
        try {
            const response = await ResetForgottenPassword(ApiRequest_ParamsObj);
            if (response) {
                setLoginLoader(false);
                if (response?.data?.statusCode === 200) {
                    setOpenSuccessModal(true);
                    setInitialData();
                } else {
                    setErrorMessage(response?.response?.data?.errorMessage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const GetUserTokenVerificationStatus = async () => {
        try {
            const tokenType = "ResetForgottenPassword";
            const response = await ValidateUserToken(token, tokenType);
            if (response) {
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

    // Password Show And Hide.
    const togglePasswordVisibility = (state) => {
        if (state === "Current") {
            setShowCurrentPassword(!showCurrentPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleClose = () => {
        setOpenSuccessModal(false);
        navigate("/login");
    };
    /* ---------------------- Design Part Start From Here. ---------------------- */

    return (
        <React.Fragment>
            <div>
                <header className="lnheader">
                    <div className="lnnav-bar">
                        <div className="lnlogo">
                            <a className="lna" href="https://outbooks.com/proposal/">
                                <img src={logoImg} alt="Outbooks" />
                            </a>
                            <div className="mbMenuCont">
                                <button className="mbTgl" onClick={toggleMenuVisibility}>&#9776;</button>

                                <div id="mbMenu" className={`lnmenu mb-lnmenu ${isMenuVisible ? 'show' : 'hide'}`}>
                                    <ul className="lnul">
                                        <li>
                                            <a className="lna" href="https://outbooks.com/proposal/">HOME</a>
                                        </li>
                                        <li className="tosb-nav">
                                            <a className="lna" href="https://outbooks.com/proposal/features/">FEATURES &#x25BE;</a>
                                            <ul className="sb-nav">
                                                <li><a className="lna" href="https://outbooks.com/proposal/engagement-letter/">Engagement Letter</a></li>
                                                <li><a className="lna" href="https://outbooks.com/proposal/professional-proposal-renewals/">Professional Proposal & Renewal</a></li>
                                                <li><a className="lna" href="https://outbooks.com/proposal/consistent-pricing/">Consistent Pricing</a></li>
                                                <li><a className="lna" href="https://outbooks.com/proposal/client-payment/">Client Payment</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a className="lna" href="https://outbooks.com/proposal/contact-us/">CONTACT US</a>
                                        </li>
                                        <li>
                                            <a className="lna" onClick={() => {
                                                navigate("/login")
                                                setMenuVisible(false)
                                            }}>Login</a>
                                        </li>
                                        <li>
                                            <a className="lna" onClick={() => {
                                                navigate("/registration")
                                                setMenuVisible(false)
                                            }}>Signup</a>
                                        </li>
                                        <li>
                                            <a className="lna" href="https://calendly.com/amit-outbooks/outbooksproposal" target="_Blank">Book a Free Demo</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="lnmenu lp-lnmenu">
                            <ul className="lnul">
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/">HOME</a>
                                </li>
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/features/">FEATURES &#x25BE;</a>
                                    <ul className="sb-nav">
                                        <li><a className="lna" href="https://outbooks.com/proposal/engagement-letter/">Engagement Letter</a></li>
                                        <li><a className="lna" href="https://outbooks.com/proposal/professional-proposal-renewals/">Professional Proposal & Renewal</a></li>
                                        <li><a className="lna" href="https://outbooks.com/proposal/consistent-pricing/">Consistent Pricing</a></li>
                                        <li><a className="lna" href="https://outbooks.com/proposal/client-payment/">Client Payment</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/contact-us/">CONTACT US</a>
                                </li>
                            </ul>
                        </div>
                        <div className="lnbtn lp-lnmenu">
                            <a onClick={() => navigate("/registration")} className="top3btn t3btn3">SIGNUP</a>
                            <a onClick={() => navigate("/login")} className="top3btn t3btn2">LOGIN</a>
                            <a href="https://calendly.com/amit-outbooks/outbooksproposal" target="_blank" className="top3btn t3btn1">BOOK A FREE DEMO</a>
                        </div>
                    </div>
                </header>

                <div className="lnmain-content">
                    <section className="lnsection-one">
                        <div className="lnlogin-panel">
                            <a className="lna" name="login"></a>
                            <div className="lnlogin-right">
                                <table className="lntable" border="0" cellPadding={5}>
                                    <tbody>
                                        <tr>
                                            <td vertical-align="middle" width={300} align="center">
                                                <img
                                                    src={newPasswordImg}
                                                    alt="Proposl Tool Reset Password"
                                                />
                                            </td>
                                            {/* <td width={25}></td> */}
                                            <td>
                                                <div className="sign-ar">

                                                    <div className="row-f">
                                                        <h1 className="lnh1 sign-f darkh">Reset Password</h1>
                                                    </div>

                                                    <div>
                                                        <div className="row-f">
                                                            {successMessage ? (
                                                                <div className="alert alert-success mt-3" role="alert">
                                                                    {successMessage}
                                                                </div>
                                                            ) : errorMessage ? (
                                                                <div className="alert alert-danger mt-3" role="alert">
                                                                    {errorMessage}
                                                                </div>
                                                            ) : null}
                                                            {!successMessage && verifyToken !== "Expired" && (<>
                                                                <div className="alert alert-info mt-3" role="alert">
                                                                    {/* Enter your new password! */}
                                                                    Please enter a new password. Password must meet the following
                                                                    criteria
                                                                </div>
                                                                <div className="criteria">
                                                                    <span style={{ fontSize: '12px' }}>
                                                                        <label
                                                                            className={
                                                                                CreateNewPassword.Password.length >= 8
                                                                                    ? "text-success"
                                                                                    : "validation"
                                                                            }
                                                                        >
                                                                            Minimum of 8 characters long{" "}
                                                                            {CreateNewPassword.Password.length >= 8 && (
                                                                                <span>&#10004;</span>
                                                                            )}
                                                                        </label>
                                                                        <br />
                                                                        <label
                                                                            className={
                                                                                /[a-zA-Z]/.test(CreateNewPassword.Password)
                                                                                    ? "text-success"
                                                                                    : "validation "
                                                                            }
                                                                        >
                                                                            Include at least one letter{" "}
                                                                            {/[a-zA-Z]/.test(CreateNewPassword.Password) && (
                                                                                <span>&#10004;</span>
                                                                            )}
                                                                        </label>
                                                                        <br />
                                                                        <label
                                                                            className={
                                                                                /\d/.test(CreateNewPassword.Password)
                                                                                    ? "text-success"
                                                                                    : "validation "
                                                                            }
                                                                        >
                                                                            Include at least one number{" "}
                                                                            {/\d/.test(CreateNewPassword.Password) && (
                                                                                <span>&#10004;</span>
                                                                            )}
                                                                        </label>
                                                                        <br />
                                                                        <label
                                                                            className={
                                                                                /[-@$!%*#?&]/.test(CreateNewPassword.Password)
                                                                                    ? "text-success"
                                                                                    : "validation "
                                                                            }
                                                                        >
                                                                            Include at least one special character -@$!%*#?&{" "}
                                                                            {/[-@$!%*#?&]/.test(CreateNewPassword.Password) && (
                                                                                <span>&#10004;</span>
                                                                            )}
                                                                        </label>

                                                                    </span>
                                                                </div>
                                                            </>
                                                            )}
                                                        </div>
                                                    </div>


                                                    <div className="row-f">
                                                        <div className="position-relative">
                                                            <input
                                                                type={showCurrentPassword ? "text" : "password"}
                                                                className="lninput lntext sign-f big"
                                                                placeholder="Enter new password*"
                                                                value={CreateNewPassword.Password}
                                                                onChange={handlePasswordChange}
                                                            />
                                                            <button
                                                                className="btn btn-link position-absolute text-decoration-none text-muted password-addon"
                                                                type="button"
                                                                id="password-addon"
                                                                onClick={() => togglePasswordVisibility("Current")}
                                                                style={{ right: "10px", top: "35px" }}
                                                            >
                                                                <i style={{ color: "#5b626b" }} className="ri-eye-fill align-middle"></i>
                                                            </button>
                                                        </div>
                                                        {requireErrorMessage &&
                                                            (CreateNewPassword.Password === undefined ||
                                                                CreateNewPassword.Password === "") && (
                                                                <label className="validation registration">
                                                                    This field is required.
                                                                </label>
                                                            )}
                                                        {requireErrorMessage &&
                                                            CreateNewPassword.Password &&
                                                            validationErrors.Password && (
                                                                <label className="validation registration">
                                                                    {validationErrors.Password}
                                                                </label>
                                                            )}

                                                    </div>
                                                    <div className="row-f">
                                                        <div className="position-relative">
                                                            <input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                className="lninput lntext sign-f big"
                                                                placeholder="Enter confirm password*"
                                                                value={CreateNewPassword.ConfirmPassword}
                                                                onChange={handleConfirmPasswordChange}
                                                                style={{ paddingRight: "40px" }}  // Add some padding for button space
                                                            />
                                                            <button
                                                                className="btn btn-link position-absolute  translate-middle-y text-decoration-none text-muted password-addon"
                                                                type="button"
                                                                id="password-addon"
                                                                onClick={() => togglePasswordVisibility("Confirm")}
                                                                style={{ right: "10px", top: "55px" }}  // Adjust position as needed
                                                            >
                                                                <i style={{ color: "#5b626b" }} className="ri-eye-fill align-middle"></i>
                                                            </button>
                                                        </div>

                                                        {CreateNewPassword.Password &&
                                                            CreateNewPassword.ConfirmPassword &&
                                                            CreateNewPassword.Password !==
                                                            CreateNewPassword.ConfirmPassword && (
                                                                <label className="validation registration">
                                                                    Passwords do not match.
                                                                </label>
                                                            )}
                                                        {requireErrorMessage &&
                                                            (CreateNewPassword.ConfirmPassword === undefined ||
                                                                CreateNewPassword.ConfirmPassword === "") ? (
                                                            <label className="validation registration">
                                                                This field is required.
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>

                                                    <div className="row-f">
                                                        <button
                                                            type="submit"
                                                            className="lnpage-btn lnlogin sign-f"
                                                            onClick={CreateNewPasswordClicked}
                                                        >
                                                            SUBMIT
                                                        </button>
                                                    </div>
                                                    <div className="row-f">
                                                        <div className="tc-div sign-f">
                                                            <span className="tc-2 sign-f">
                                                                {" "}
                                                                &nbsp;Remember It?
                                                            </span>{" "}
                                                            &nbsp;{" "}
                                                            <a className="lna" onClick={() => navigate("/login")}>
                                                                <strong>SIGN IN HERE</strong>
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
                            <a className="lna" href="https://outbooks.com/proposal/">
                                <img src={logoImg} alt="Outbooks Proposal" />
                            </a>
                        </div>
                        <div className="lnmenu">
                            <ul className="lnul lnnav-list">
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/">HOME</a>
                                </li>
                                <li>
                                    <a className="lna" onClick={() => {
                                        navigate("/registration")
                                        setMenuVisible(false)
                                    }}>SIGN UP</a>
                                </li>
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/features/">FEATURES</a>
                                </li>
                                <li>
                                    <a className="lna" href="https://outbooks.com/proposal/contact-us/">CONTACT US</a>
                                </li>
                            </ul>
                        </div>
                        <p className="lnp lncopy-right">
                            Copyright © Outbooks Proposal {new Date().getFullYear()} | All Rights Reserved
                        </p>
                    </div>
                    <div className="lncol-2"><div className="lnmenu footer-m1">
                        <ul className="lnul lnnav-list">
                            <li>
                                <a className="lna" href="https://outbooks.com/proposal/contact-us">Help Center</a>
                            </li>
                            <li>
                                <a className="lna" href="https://outbooks.com/proposal/articles/">Blogs</a>
                            </li>
                            <li>
                                <a className="lna" href="https://outbooks.com/proposal/terms-and-conditions/">Terms and Conditions</a>
                            </li>
                        </ul>
                    </div></div>
                    <div className="lncol-3">
                        <p className="lnp lnadr">
                            Suite 18, Winsor & Newton Building,
                            <br />
                            Whitefriars Avenue, Harrow HA3 5RN
                        </p>
                        <p className="lnp lnregno">Registration No: 10746177</p>
                        <ul className="lnul lncontact-links">
                            <li>
                                <a className="lna" href="mailto:info@outbooks.com">
                                    &#9993; &nbsp; info@outbooks.com
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
                                <a className="lna" href="https://www.facebook.com/profile.php?id=61556567720993">
                                    <img src={iconFacebook} alt="Facebook" />
                                </a>
                            </li>
                            <li>
                                <a className="lna" href="https://www.linkedin.com/company/outbooksproposal/">
                                    <img src={iconLinkedin} alt="Linkedin" />
                                </a>
                            </li>
                            <li>
                                <a className="lna" href="https://twitter.com/outbookproposal">
                                    <img src={iconX} alt="Twitter / X" />
                                </a>
                            </li>
                            <li>
                                <a className="lna" href="https://www.youtube.com/channel/UCCucVxt5QuYrJI6SDCDW7sQ">
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
            <SuccessModal
                handleClose={handleClose}
                setOpenSuccessModal={setOpenSuccessModal}
                openSuccessModal={openSuccessModal}
                modelAction={null}
                message={"Your Password has been reset successfully."}
            />
        </React.Fragment>
    );
}




export default NewResetPage
