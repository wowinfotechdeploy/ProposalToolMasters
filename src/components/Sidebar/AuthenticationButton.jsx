import { useState } from "react";
import ConfirmModel from "../ConfirmationBox";

export default function AuthButton({ onAuthenticate, onDisconnect, activePlatform }) {
    const [loading, setLoading] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [actionType, setActionType] = useState("");

    //===================functions============================
    const handleClose = () => {
        setOpenSuccessModal(false);
    };

    const handleYesClick = async () => {
        setLoading(true);
        try {

            if (actionType === "authenticate") {
                await onAuthenticate();
            } else if (actionType === "Disconnect") {
                await onDisconnect();
            }
        } catch (error) {

        } finally {
            setLoading(false);
            setOpenSuccessModal(false);
        }
    };

    return (
        <>
            <div className="d-flex gap-2">
                <button
                    // onClick={() => setOpenSuccessModal(true)}
                    onClick={() => {
                        setActionType("authenticate");
                        setOpenSuccessModal(true);
                        const modal = new window.bootstrap.Modal(
                            document.getElementById("ConfirmModel")
                        );
                        modal.show();
                    }}
                    disabled={loading}
                    className={`btn btn-md btn-success create-item-btn${loading ? "opacity-60" : ""}`}
                // data-bs-toggle="modal"
                // data-bs-target="#ConfirmModel"
                >
                    {loading && (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                    )}
                    Authenticate
                </button>

                {activePlatform && (
                    <button
                        onClick={() => {
                            setActionType("Disconnect");
                            setOpenSuccessModal(true);

                            const modal = new window.bootstrap.Modal(
                                document.getElementById("ConfirmModel")
                            );
                            modal.show();
                        }}
                        disabled={loading}
                        className={`btn btn-md create-item-btn${loading ? "opacity-60" : ""}`}
                    // data-bs-toggle="modal"
                    // data-bs-target="#ConfirmModel"
                    >
                        {loading && (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        )}
                        Disconnect
                    </button>
                )}
            </div>

            <ConfirmModel
                openSuccessModal={openSuccessModal}
                handleClose={handleClose}
                UpdatedStatus={handleYesClick}
                modelRequestData={{
                    Action: actionType === "Disconnect" ? "Disconnect" : "Redirect",
                }}
            />
        </>
    );
}



// import { useState } from "react";
// import ConfirmModel from "../ConfirmationBox";

// export default function AuthButton({ onConfirm }) {
//     const [loading, setLoading] = useState(false);
//     const [openSuccessModal, setOpenSuccessModal] = useState(false);

//     const handleClose = () => {
//         setOpenSuccessModal(false);
//     };

//     const handleYesClick = async () => {
//         setLoading(true);
//         try {
//             await onConfirm();
//         } catch (error) {

//         } finally {
//             setLoading(false);
//             setOpenSuccessModal(false);
//         }
//     };

//     return (
//         <>
//             <div className="d-flex gap-2">
//                 <button
//                     // onClick={() => setOpenSuccessModal(true)}
//                     disabled={loading}
//                     className={`btn btn-md btn-success create-item-btn${loading ? "opacity-60" : ""}`}
//                     data-bs-toggle="modal"
//                     data-bs-target="#ConfirmModel"
//                 >
//                     {loading && (
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                     )}
//                     Authenticate
//                 </button>

//                 {/* <button
//                     disabled={loading}
//                     className={`btn btn-md create-item-btn${loading ? "opacity-60" : ""}`}
//                     data-bs-toggle="modal"
//                     data-bs-target="#ConfirmModel"
//                 >
//                     {loading && (
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                     )}
//                     Disconnect
//                 </button> */}
//             </div>
//             <ConfirmModel
//                 openSuccessModal={true}
//                 handleClose={handleClose}
//                 UpdatedStatus={handleYesClick}
//                 modelRequestData={{
//                     Action: "Redirect",
//                     message: "You are about to connect your account securely.",
//                 }}
//             />
//         </>
//     );
// }

