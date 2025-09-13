
import "../login/LoginStyle.css";
import logoImg from "../../assets/images/company-logos/logo-outbooks-proposal.webp";
import forgotPasswordImg from "../../assets/images/icon-password.png";
import iconFacebook from "../../assets/images/icon-fb.webp";
import iconX from "../../assets/images/icon-x.webp";
import iconLinkedin from "../../assets/images/icon-ln.webp";
import iconYoutube from "../../assets/images/icon-yt.webp";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendRequestForForgotPassword } from "../../redux/Services/Auth/PasswordApi";
import { ERROR_MESSAGES } from "../../components/GlobalMessage";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "../../redux/Persist";
import SuccessModal from "../../components/SuccessModal";
const NewForgotPage = () => {
    // Declare state
    const [successEmail, setSuccessEmail] = useState("");
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [email, setEmail] = useState("");
    const [requireErrorMessage, setRequireErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { setLoginLoader, setTopbar, toggleMenuVisibility,
        isMenuVisible, setMenuVisible } = useContext(AuthContextProvider);
    const navigate = useNavigate();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetState());
        setTopbar('none')
        setMenuVisible(false)
    }, []);

    // ResetPassword function
    const ResetPasswordClicked = () => {
        if (email === undefined || email === "" || !emailRegex.test(email)) {
            setRequireErrorMessage(true);
            return false;
        }
        const ApiRequest_ParamsObj = {
            email: email,
        };
        SendForgotPasswordRequest(ApiRequest_ParamsObj);
    };

    //Api calling operation here
    const SendForgotPasswordRequest = async (ApiRequest_ParamsObj) => {
        setLoginLoader(true);
        try {
            const response = await SendRequestForForgotPassword(ApiRequest_ParamsObj);
            if (response) {
                setLoginLoader(false);
                if (response?.data?.statusCode === 200) {
                    const emailToken = response?.data?.responseData?.data; // Get the token from the response

                    if (emailToken) {
                        setOpenSuccessModal(true);
                        setSuccessEmail(email);
                        setErrorMessage(null);
                        setEmail("");
                        setRequireErrorMessage("");
                    }
                } else {
                    setErrorMessage(response?.response.data?.errorMessage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleCloseModal = () => {
        setOpenSuccessModal(false);
        navigate("/login");
    };
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
                                            <a className="lna" href="https://outlook.office.com/bookwithme/user/4a35845a9f444012a9e5a4f2fbe159b2%40outbooks.com?anonymous&ismsaljsauthenabled=true" target="_Blank">Book a Free Demo</a>
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
                            <a href="https://outlook.office.com/bookwithme/user/4a35845a9f444012a9e5a4f2fbe159b2%40outbooks.com?anonymous&ismsaljsauthenabled=true" target="_blank" className="top3btn t3btn1">BOOK A FREE DEMO</a>
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
                                                    src={forgotPasswordImg}
                                                    alt="Proposl Tool Forgot Password"
                                                />
                                            </td>
                                            {/* <td width={25}></td> */}
                                            <td>

                                                <div className="sign-ar">
                                                    <div className="row-f">
                                                        <h1 className="lnh1 sign-f darkh">Reset Password</h1>
                                                    </div>
                                                    <div className="row-f marb">
                                                        {errorMessage ? (
                                                            <div
                                                                className="fade show justify-content-center align-items-center"
                                                                style={{
                                                                    fontSize: "13px",
                                                                    textAlign: "center", // Centering the text
                                                                    color: "#ec4561",
                                                                }}
                                                                role="alert"
                                                            >
                                                                {errorMessage ===
                                                                    "Couldn't find your Outbooks Proposal Account" ? (
                                                                    <>

                                                                        Sorry, we couldn't find your Outbooks Proposal Account.<br></br>
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
                                                                    errorMessage
                                                                )}
                                                            </div>
                                                        ) : (

                                                            <p className="lnp p-text sign-f">
                                                                Forgot your password? No Problem! Please enter
                                                                your email to reset the password. We will send
                                                                you reset instructions by email. You may need
                                                                to check your spam folder or unblock
                                                                do-not-reply@proposal.outbooks.com
                                                            </p>

                                                        )}

                                                    </div>

                                                    <input
                                                        type="text"
                                                        className="lninput lntext sign-f big"
                                                        placeholder="Enter Email*"
                                                        value={email}
                                                        onChange={(e) => {
                                                            const enteredValue = e.target.value
                                                                .trim()
                                                                .toLowerCase();
                                                            if (enteredValue.includes("..")) {
                                                                return;
                                                            }
                                                            setEmail(enteredValue);
                                                        }}
                                                        required
                                                        maxLength={50}
                                                    />
                                                    {requireErrorMessage ? (
                                                        email === undefined || email === "" ? (
                                                            <label className="validation registration">{ERROR_MESSAGES}</label>
                                                        ) : !emailRegex.test(email) ? (
                                                            <label className="validation registration">
                                                                Enter a valid email.
                                                            </label>
                                                        ) : null
                                                    ) : null}
                                                    <div className="row-f">
                                                        <button
                                                            type="submit"
                                                            name="submit"
                                                            className="lnpage-btn lnlogin sign-f"
                                                            onClick={ResetPasswordClicked}
                                                        >
                                                            RESET PASSWORD
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
                                    <a className="lna" onClick={() => navigate("/registration")}>SIGN UP</a>
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
                    <div className="lncol-2">
                        <div className="lnmenu footer-m1">
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
                        </div>
                    </div>
                    <div className="lncol-3">
                        <p>
                            <b>
                                OUTBOOKS TECH LTD
                            </b>
                        </p>
                        <p className="lnp lnadr">
                            415 C, MARGARET POWELL HOUSE, Midsummer Blvd,Milton Keynes MK9 3BN, United Kingdom
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
                openSuccessModal={openSuccessModal}
                handleClose={handleCloseModal}
                message={`Success! We've sent the password reset link to your email address ${successEmail}`}

                modelAction="ShowMessage"
            />
        </React.Fragment>
    );
}


export default NewForgotPage