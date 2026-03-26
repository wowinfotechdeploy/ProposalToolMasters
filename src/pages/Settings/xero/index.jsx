import { useContext, useState } from "react";
import ErrorModel from "../../../components/ErrorModel";
import AuthButton from "../../../components/Sidebar/AuthenticationButton";
import { ConnectionAuthentication } from "../../../redux/Services/XeroAndQBO/XeroAndQBOApi";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";



function XeroAuthentication() {
    const { handleErrorMessage } = useContext(AuthContextProvider);
    const [errorMessage, setErrorMessage] = useState("");
    const formattedErrorMessage = handleErrorMessage(errorMessage);
    const [openErrorModal, setOpenErrorModal] = useState(false);


    const handleAuthenticate = async () => {

        try {
            const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
            const organisationKeyID = JSON.parse(raw.organisationKeyID);

            const res = await ConnectionAuthentication(organisationKeyID);

            if (res?.status === 200) {
                const url = res.data.connectionUrl;
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                setOpenErrorModal(true)
                setErrorMessage(res.response.data.message)
                throw new Error("Something went wrong");
            }
        } catch (err) {
            console.error(err);
            throw new Error("Something went wrong");
        }
    };

    const handleClose = () => {
        setOpenErrorModal(false)

    };

    return (
        <div className="container-fluid py-4">

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                {/* Left Title */}
                <div>
                    <h4 className="fw-semibold mb-1">Xero Integration</h4>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        Connect your account to start syncing your financial data.
                    </p>
                </div>

                {/* Right Button */}
                <div>
                    <AuthButton onConfirm={handleAuthenticate} />
                </div>
            </div>

            {/* Info Card */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">

                    <div className="d-flex align-items-start gap-3">

                        {/* Icon */}
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "12px",
                                background: "#e7f1ff",
                            }}
                        >
                            <i className="ri-links-line text-primary fs-4"></i>
                        </div>

                        {/* Content */}
                        <div>
                            <h6 className="fw-semibold mb-1">
                                Secure Authentication
                            </h6>
                            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                                Authenticate with Xero to enable seamless data transfer,
                                contact sync, and financial operations.
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* Placeholder Section (Drivers / Future UI) */}
            <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">

                    <div className="mb-3">
                        <i className="ri-database-2-line text-muted" style={{ fontSize: "40px" }}></i>
                    </div>

                    <h6 className="fw-semibold">No Data Available</h6>

                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        Once authenticated, your drivers and integration data will appear here.
                    </p>

                </div>
            </div>

            <ErrorModel
                ErrorModel={openErrorModal}
                handleClose={handleClose}
                ErrorMessage={formattedErrorMessage}
            />

        </div>
    );
}

export default XeroAuthentication;