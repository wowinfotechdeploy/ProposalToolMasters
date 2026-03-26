import { useState } from "react";
import ConfirmModel from "../ConfirmationBox";

export default function AuthButton({ onConfirm }) {
    const [loading, setLoading] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const handleClose = () => {
        setOpenSuccessModal(false);
    };

    const handleYesClick = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } catch (error) {

        } finally {
            setLoading(false);
            setOpenSuccessModal(false);
        }
    };

    return (
        <>
            <button
                // onClick={() => setOpenSuccessModal(true)}
                disabled={loading}
                className={`btn btn-md btn-success create-item-btn${loading ? "opacity-60" : ""}`}
                data-bs-toggle="modal"
                data-bs-target="#ConfirmModel"
            >
                {loading && (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                )}
                Authenticate
            </button>

            <ConfirmModel
                openSuccessModal={true}
                handleClose={handleClose}
                UpdatedStatus={handleYesClick}
                modelRequestData={{
                    Action: "Redirect",
                    message: "You are about to connect your account securely.",
                }}
            />
        </>
    );
}



// import { useState, useRef, } from "react";
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
// import { ConnectionAuthentication } from "../../redux/Services/XeroAndQBO/XeroAndQBOApi";
// import editGif from "../../assets/images/gif/edit.gif";

// export default function AuthButton() {
//     const lastClickRef = useRef(0);
//     //localstorage key
//     const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
//     const organisationKeyID = JSON.parse(raw.organisationKeyID);


//     //======================state==========================
//     const [loading, setLoading] = useState(false);
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//     const [showError, setShowError] = useState(false);

//     //======================functions==========================
//     const handleAuthenticate = async () => {
//         const now = Date.now();

//         if (now - lastClickRef.current < 1500) return;
//         lastClickRef.current = now;

//         try {
//             setLoading(true);

//             const res = await ConnectionAuthentication(organisationKeyID);

//             if (res?.status === 200) {
//                 const url = res.data.connectionUrl;

//                 //open in new tab
//                 window.open(url, "_blank", "noopener,noreferrer");
//             } else {
//                 setShowError(true);
//             }
//         } catch (err) {
//             setShowError(true);
//         } finally {
//             setLoading(false);
//             setShowConfirmDialog(false)
//         }
//     };

//     return (
//         <>
//             {/* Button */}

//             <button
//                 onClick={() => setShowConfirmDialog(true)}
//                 disabled={loading}
//                 className={`btn btn-md btn-success create-item-btn ${loading ? "opacity-60 cursor-not-allowed" : ""
//                     }`}
//             >
//                 {loading && (
//                     <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
//                 )}
//                 Authenticate
//             </button>



//             {/*CONFIRMATION DIALOG */}
//             {showConfirmDialog && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                     style={{
//                         background: "rgba(0,0,0,0.6)",
//                         backdropFilter: "blur(4px)",
//                         zIndex: 99999,
//                     }}
//                     onClick={() => !loading && setShowConfirmDialog(false)}
//                 >
//                     <div
//                         className="modal-dialog modal-dialog-centered"
//                         style={{ maxWidth: "420px", width: "100%" }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="modal-content">

//                             {/*HEADER (MATCHED) */}
//                             <div
//                                 className="modal-header position-relative mb-2"
//                                 style={{
//                                     height: "40px",
//                                     padding: "0px",
//                                     borderBottom: "1px solid #d3d6d8",

//                                 }}
//                             >
//                                 <button
//                                     type="button"
//                                     className="btn-close position-absolute"
//                                     style={{
//                                         top: "12px",
//                                         right: "12px",
//                                     }}
//                                     onClick={() => setShowConfirmDialog(false)}
//                                 ></button>
//                             </div>

//                             {/* BODY */}
//                             <div className="custom-style modal-body">

//                                 <div className="text-center mt-2">
//                                     {/* IMAGE */}
//                                     <img
//                                         src={editGif}
//                                         style={{ width: "85px", height: "50px" }}
//                                     />

//                                     {/* TEXT */}
//                                     <div className="fs-15 mx-4 mx-sm-3">
//                                         <h4 className="text-dark">Are you sure?</h4>

//                                         <span className="text-muted mb-0">
//                                             You are about to connect your account securely.
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* BUTTONS */}
//                                 <div className="d-flex gap-2 justify-content-center mt-4 mb-4">
//                                     <button
//                                         class="btn btn-md btn-light cancel-item-btn"
//                                         onClick={() => setShowConfirmDialog(false)}
//                                     >
//                                         <span>Cancel</span>
//                                     </button>

//                                     <button
//                                         onClick={handleAuthenticate}
//                                         type="button"
//                                         class="btn btn-md btn-success create-item-btn"
//                                     >
//                                         <span> Yes, Continue</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}


//             {/*Error Dialog */}
//             {showError && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                     style={{
//                         background: "rgba(0,0,0,0.6)",
//                         backdropFilter: "blur(4px)",
//                         zIndex: 9999,
//                     }}
//                     onClick={() => setShowError(false)}
//                 >
//                     <div
//                         className="bg-white p-4"
//                         style={{
//                             width: "360px",
//                             borderRadius: "16px",
//                             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//                             animation: "fadeInScale 0.2s ease",
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Icon + Title */}
//                         <div className="d-flex align-items-center gap-2 mb-3">
//                             <div
//                                 className="d-flex align-items-center justify-content-center"
//                                 style={{
//                                     width: "40px",
//                                     height: "40px",
//                                     borderRadius: "50%",
//                                     background: "#fee2e2",
//                                 }}
//                             >
//                                 <ReportProblemIcon style={{ color: "#dc2626" }} />
//                             </div>

//                             <h5 className="mb-0 fw-semibold text-danger">Error</h5>
//                         </div>

//                         {/* Message */}
//                         <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
//                             Something went wrong. Please try again later.
//                         </p>

//                         {/* Action */}
//                         <div className="d-flex justify-content-end">
//                             <button
//                                 className="btn btn-sm px-3"
//                                 style={{
//                                     background: "#dc2626",
//                                     color: "#fff",
//                                     borderRadius: "8px",
//                                 }}
//                                 onClick={() => setShowError(false)}
//                             >
//                                 OK
//                             </button>
//                         </div>
//                     </div>

//                     {/* Animation */}
//                     <style>
//                         {`
//                 @keyframes fadeInScale {
//                     from {
//                         opacity: 0;
//                         transform: scale(0.9);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: scale(1);
//                     }
//                 }
//             `}
//                     </style>
//                 </div>
//             )}

//         </>
//     );
// }


//working with custom dialog box
// import { useState, useRef, } from "react";
// import { ConnectionAuthentication } from "../../redux/Services/XeroAndQBO/XeroAndQBOApi";
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// export default function AuthButton() {
//     const lastClickRef = useRef(0);
//     //localstorage key
//     const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
//     const organisationKeyID = JSON.parse(raw.organisationKeyID);


//     //======================state==========================
//     const [loading, setLoading] = useState(false);
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//     const [showError, setShowError] = useState(false);

//     //======================functions==========================
//     const handleAuthenticate = async () => {
//         const now = Date.now();

//         if (now - lastClickRef.current < 1500) return;
//         lastClickRef.current = now;

//         try {
//             setLoading(true);

//             const res = await ConnectionAuthentication(organisationKeyID);

//             if (res?.status === 200) {
//                 const url = res.data.connectionUrl;

//                 //open in new tab
//                 window.open(url, "_blank", "noopener,noreferrer");
//             } else {
//                 setShowError(true);
//             }
//         } catch (err) {
//             setShowError(true);
//         } finally {
//             setLoading(false);
//             setShowConfirmDialog(false)
//         }
//     };

//     return (
//         <>
//             {/* Button */}
//             <div className="py-2">
//                 <button
//                     onClick={() => setShowConfirmDialog(true)}
//                     disabled={loading}
//                     className={`btn bg-white flex items-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""
//                         }`}
//                 >
//                     {loading && (
//                         <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
//                     )}
//                     Authenticate
//                 </button>
//             </div>


//             {/*CONFIRMATION DIALOG */}
//             {showConfirmDialog && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                     style={{
//                         background: "rgba(0,0,0,0.6)",
//                         backdropFilter: "blur(4px)",
//                         zIndex: 9999,
//                     }}
//                     onClick={() => !loading && setShowConfirmDialog(false)}
//                 >
//                     <div
//                         className="bg-white p-4"
//                         style={{
//                             width: "380px",
//                             borderRadius: "16px",
//                             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//                             animation: "fadeInScale 0.2s ease",
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Icon + Title */}
//                         <div className="d-flex align-items-center gap-3 mb-3">
//                             <div
//                                 className="d-flex align-items-center justify-content-center"
//                                 style={{
//                                     width: "42px",
//                                     height: "42px",
//                                     borderRadius: "50%",
//                                     background: "#e0f2fe",
//                                 }}
//                             >
//                                 <i
//                                     className="bi bi-shield-check"
//                                     style={{ color: "#0284c7", fontSize: "20px" }}
//                                 ></i>
//                             </div>

//                             <h5 className="mb-0 fw-semibold text-dark">
//                                 Confirm Authentication
//                             </h5>
//                         </div>

//                         {/* Message */}
//                         <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
//                             You are about to connect your account securely. Do you want to continue?
//                         </p>

//                         {/* Actions */}
//                         <div className="d-flex justify-content-end gap-2">
//                             <button
//                                 className="btn btn-sm px-3"
//                                 style={{
//                                     borderRadius: "8px",
//                                     border: "1px solid #dee2e6",
//                                     background: "#f8f9fa",
//                                 }}
//                                 onClick={() => setShowConfirmDialog(false)}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 className="btn btn-sm px-3 d-flex align-items-center justify-content-center gap-2"
//                                 style={{
//                                     background: "#16a34a",
//                                     color: "#fff",
//                                     borderRadius: "8px",
//                                     minWidth: "130px",
//                                 }}
//                                 onClick={handleAuthenticate}
//                                 disabled={loading}
//                             >
//                                 {loading && (
//                                     <span className="spinner-border spinner-border-sm"></span>
//                                 )}
//                                 {loading ? "Processing..." : "Yes, Continue"}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Animation */}
//                     <style>
//                         {`
//                 @keyframes fadeInScale {
//                     from {
//                         opacity: 0;
//                         transform: scale(0.9);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: scale(1);
//                     }
//                 }
//             `}
//                     </style>
//                 </div>
//             )}


//             {/*Error Dialog */}
//             {showError && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                     style={{
//                         background: "rgba(0,0,0,0.6)",
//                         backdropFilter: "blur(4px)",
//                         zIndex: 9999,
//                     }}
//                     onClick={() => setShowError(false)}
//                 >
//                     <div
//                         className="bg-white p-4"
//                         style={{
//                             width: "360px",
//                             borderRadius: "16px",
//                             boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//                             animation: "fadeInScale 0.2s ease",
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Icon + Title */}
//                         <div className="d-flex align-items-center gap-2 mb-3">
//                             <div
//                                 className="d-flex align-items-center justify-content-center"
//                                 style={{
//                                     width: "40px",
//                                     height: "40px",
//                                     borderRadius: "50%",
//                                     background: "#fee2e2",
//                                 }}
//                             >
//                                 <ReportProblemIcon style={{ color: "#dc2626" }} />
//                             </div>

//                             <h5 className="mb-0 fw-semibold text-danger">Error</h5>
//                         </div>

//                         {/* Message */}
//                         <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
//                             Something went wrong. Please try again later.
//                         </p>

//                         {/* Action */}
//                         <div className="d-flex justify-content-end">
//                             <button
//                                 className="btn btn-sm px-3"
//                                 style={{
//                                     background: "#dc2626",
//                                     color: "#fff",
//                                     borderRadius: "8px",
//                                 }}
//                                 onClick={() => setShowError(false)}
//                             >
//                                 OK
//                             </button>
//                         </div>
//                     </div>

//                     {/* Animation */}
//                     <style>
//                         {`
//                 @keyframes fadeInScale {
//                     from {
//                         opacity: 0;
//                         transform: scale(0.9);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: scale(1);
//                     }
//                 }
//             `}
//                     </style>
//                 </div>
//             )}

//         </>
//     );
// }