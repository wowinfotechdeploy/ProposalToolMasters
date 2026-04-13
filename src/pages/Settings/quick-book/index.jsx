import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionAuthentication } from "../../../redux/Services//Xero/XeroApi";
import AuthButton from "../../../components/Sidebar/AuthenticationButton";
import { DisconnectIntegration, GetAllDrivers } from "../../../redux/reducer/quickBookSlice";
import ErrorModel from "../../../components/ErrorModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import "../xero/Xero.css"
import { getActivePlatform } from "../../../lib/utils";

function QuickBookAuthentication() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state?.Storage);
    const drivers = useSelector((state) => state.quickBook.drivers);
    const activePlatform = getActivePlatform();

    //==================state=====================
    const { handleErrorMessage } = useContext(AuthContextProvider);
    const [errorMessage, setErrorMessage] = useState("");
    const formattedErrorMessage = handleErrorMessage(errorMessage);
    const [openErrorModal, setOpenErrorModal] = useState(false);

    //==================UseEffect=====================
    useEffect(() => {
        dispatch(GetAllDrivers(auth?.organisationKeyID));
    }, [dispatch]);

    //==================functions=====================
    const handleAuthenticate = async () => {

        try {
            const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
            const organisationKeyID = JSON.parse(raw.organisationKeyID);

            const res = await ConnectionAuthentication(
                organisationKeyID,
                activePlatform,
                "QuickBooks" // 👈 fallback
            );

            if (res?.status === 200) {
                const url = res.data.connectionUrl;
                // CLOSE MODAL BEFORE REDIRECT
                const modalEl = document.getElementById("ConfirmModel");
                if (modalEl) {
                    const modalInstance =
                        window.bootstrap.Modal.getInstance(modalEl) ||
                        new window.bootstrap.Modal(modalEl);

                    modalInstance.hide();
                }


                window.open(url, "_blank", "noopener,noreferrer");


            } else {
                setOpenErrorModal(true);
                setErrorMessage(res.response.data.message);
            }
        } catch (err) {
            console.error(err);
            setOpenErrorModal(true);
            setErrorMessage("Something went wrong");
        }
    };

    const handleDisconnect = async () => {
        try {
            await dispatch(
                DisconnectIntegration({ organisationKeyID: auth?.organisationKeyID, activePlatform })
            ).unwrap();

            console.log("Disconnected successfully");

        } catch (err) {
            console.error(err);

            setOpenErrorModal(true);
            setErrorMessage(err || "Something went wrong");
        }

    }

    const handleClose = () => {
        setOpenErrorModal(false);
        const modalEl = document.getElementById("ConfirmModel");
        if (modalEl) {
            const modalInstance =
                window.bootstrap.Modal.getInstance(modalEl) ||
                new window.bootstrap.Modal(modalEl);

            modalInstance.hide();
        }
    };

    //-------------------mapping component-------------------
    function MappingUI({ drivers = [] }) {
        const entities = [
            "Client Name",
            "Email",
            "Phone",
            "Company",
            "Address",
            "City",
            "State",
            "Country",
        ];

        const driverOptions = drivers.map((d) => ({
            value: d.id,
            label: d.name,
        }));

        const [mapping, setMapping] = useState({});
        const [savedMapping, setSavedMapping] = useState({});

        // styles
        const headingStyle = { color: "#182031ff" };
        const labelStyle = { color: "#000000ff" };

        //================ HANDLE CHANGE =================
        const handleDriverChange = (entity, selectedOption) => {
            const selectedDrivers = selectedOption
                ? drivers.filter((d) => d.id === selectedOption.value)
                : [];

            const services = selectedDrivers.flatMap((d) => d.services || []);

            setMapping((prev) => ({
                ...prev,
                [entity]: {
                    driver: selectedOption || null,
                    services,
                },
            }));
        };

        //================ SAVE =================
        const handleSave = (entity) => {
            setSavedMapping((prev) => ({
                ...prev,
                [entity]: mapping[entity],
            }));

            console.log("Saved:", entity, mapping[entity]);
        };

        if (!drivers.length) {
            return <p className="text-center py-4">Loading drivers...</p>;
        }

        return (
            <div className="row g-4">
                {entities.map((entity, index) => {
                    const data = mapping[entity] || {};
                    const selectedDriver = data.driver || null;
                    const services = data.services || [];
                    const isSaved = savedMapping[entity];

                    return (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="h-100 p-3 bg-white border rounded-3">
                                {/* HEADER */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0 fw-semibold" style={headingStyle}>
                                        {entity}
                                    </h6>

                                    <div className="d-flex align-items-center gap-2">
                                        {isSaved && (
                                            <span
                                                className="badge"
                                                style={{
                                                    background: "#ecfdf5",
                                                    color: "#16a34a",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                Saved
                                            </span>
                                        )}

                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleSave(entity)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* DRIVER LABEL */}
                                <p className="mb-1 small fw-semibold" style={labelStyle}>
                                    Proposal Tool Drivers
                                </p>

                                {/* SELECT */}
                                <div className="mb-3">
                                    <Select
                                        options={driverOptions}
                                        value={selectedDriver}
                                        onChange={(selected) =>
                                            handleDriverChange(entity, selected)
                                        }
                                        placeholder="Select driver"
                                    />
                                </div>

                                {/* SERVICES */}
                                <p className="mb-2 small fw-semibold" style={labelStyle}>
                                    Proposal Services
                                </p>

                                {services.length > 0 ? (
                                    <div className="d-flex flex-wrap gap-2">
                                        {services.map((s, i) => (
                                            <span key={i} className="service-tag">
                                                {s.serviceName}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="small" style={{ color: "#9ca3af" }}>
                                        No services selected
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-semibold mb-0" style={{ color: "#111827" }}>
                    Quick Book Integration
                </h4>

                <AuthButton onAuthenticate={handleAuthenticate} onDisconnect={handleDisconnect} activePlatform={activePlatform == 'QuickBooks' ? true : false} />
            </div>

            {/* MAPPING */}
            <MappingUI drivers={drivers} />

            {/*SEPARATE PRICING SECTION */}
            <div className="mt-4">
                <div className="p-3 bg-white border rounded-3">
                    <h6 className="fw-semibold mb-3" style={{ color: "#111827" }}>
                        Proposal Tool Pricing
                    </h6>

                    <div className="row g-3">
                        {/* DEVIATION */}
                        <div className="col-md-3">
                            <label
                                className="form-label small fw-semibold"
                                style={{ color: "#6b7280" }}
                            >
                                Deviation
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter deviation"
                            />
                        </div>

                        {/* FREQUENCY */}
                        <div className="col-md-3">
                            <label
                                className="form-label small fw-semibold"
                                style={{ color: "#6b7280" }}
                            >
                                Frequency
                            </label>

                            <Select
                                classNamePrefix="proposal-select"
                                options={[
                                    { value: "monthly", label: "Monthly" },
                                    { value: "quarterly", label: "Quarterly" },
                                    { value: "yearly", label: "Yearly" },
                                ]}
                                placeholder="Select"
                                menuPortalTarget={document.body}   // 👈 KEY FIX
                                menuPosition="fixed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ERROR MODAL */}
            <ErrorModel
                ErrorModel={openErrorModal}
                handleClose={handleClose}
                ErrorMessage={formattedErrorMessage}
            />
        </div>
    );
}

export default QuickBookAuthentication;



// import { useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";

// import "../xero/Xero.css"
// import ErrorModel from "../../../components/ErrorModel";
// import AuthButton from "../../../components/Sidebar/AuthenticationButton";
// import { ConnectionAuthentication } from "../../../redux/Services//Xero/XeroApi"
// import { AuthContextProvider } from "../../../AuthContext/AuthContext";
// import { GetAllDrivers } from "../../../redux/reducer/quickBookSlice";
// import { OrganisationToQuickBookAuthentication } from "../../../redux/Services/QuickBook/QuickBookApi";


// function QuickBookAuthentication() {
//     const dispatch = useDispatch()
//     const auth = useSelector((state) => state?.Storage);
//     const isXero = useSelector((state) => state?.auth?.bookkeeping);
//     const drivers = useSelector((state) => state.quickBook.drivers);

//     //==================state=====================
//     const { handleErrorMessage } = useContext(AuthContextProvider);
//     const [errorMessage, setErrorMessage] = useState("");
//     const formattedErrorMessage = handleErrorMessage(errorMessage);
//     const [openErrorModal, setOpenErrorModal] = useState(false);

//     //==================UseEffect=====================
//     useEffect(() => {
//         dispatch(GetAllDrivers(auth?.organisationKeyID))
//     }, [dispatch])

//     //==================functions=====================
//     const handleAuthenticate = async () => {
//         try {

//             const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
//             const organisationKeyID = JSON.parse(raw.organisationKeyID);

//             const res = await OrganisationToQuickBookAuthentication(organisationKeyID, isXero);

//             if (res?.status === 200) {
//                 const url = res.data.connectionUrl;
//                 window.open(url, "_blank", "noopener,noreferrer");
//             } else {
//                 setOpenErrorModal(true)
//                 setErrorMessage(res.response.data.message)
//                 throw new Error("Something went wrong");
//             }
//         } catch (err) {
//             console.error(err);
//             throw new Error("Something went wrong");
//         }
//     };

//     const handleClose = () => {
//         setOpenErrorModal(false)
//     };

//     //-------------------mapping component-------------------
//     function MappingUI({ drivers = [] }) {
//         //==================state===================
//         const entities = [
//             "Client Name",
//             "Email",
//             "Phone",
//             "Company",
//             "Address",
//             "City",
//             "State",
//             "Country",
//         ];

//         const driverOptions = drivers.map((d) => ({
//             value: d.id,
//             label: d.name,
//         }));

//         const [activeEntity, setActiveEntity] = useState(null);
//         const [savingEntity, setSavingEntity] = useState(null);
//         const [mapping, setMapping] = useState({});
//         const [savedMapping, setSavedMapping] = useState({});

//         //================ HANDLE CHANGE =================
//         const handleToggle = (entity) => {
//             setActiveEntity((prev) => (prev === entity ? null : entity));

//             // remove saved state when reopening
//             setSavedMapping((prev) => {
//                 const updated = { ...prev };
//                 delete updated[entity];
//                 return updated;
//             });
//         };

//         const handleDriverChange = (entity, selectedOptions) => {
//             const selectedIds = selectedOptions
//                 ? selectedOptions.map((opt) => opt.value)
//                 : [];

//             const selectedDrivers = drivers.filter((d) =>
//                 selectedIds.includes(d.id)
//             );

//             const services = selectedDrivers.flatMap((d) => d.services || []);

//             setMapping((prev) => ({
//                 ...prev,
//                 [entity]: {
//                     ...prev[entity],
//                     drivers: selectedOptions || [],
//                     services,
//                 },
//             }));
//         };

//         const handleDerivationChange = (entity, value) => {
//             setMapping((prev) => ({
//                 ...prev,
//                 [entity]: {
//                     ...prev[entity],
//                     derivation: value,
//                 },
//             }));
//         };
//         //================ SAVE =================
//         const handleSave = async (entity) => {
//             setSavingEntity(entity);

//             // simulate API call delay (replace with real API)
//             setTimeout(() => {
//                 setSavedMapping((prev) => ({
//                     ...prev,
//                     [entity]: mapping[entity],
//                 }));

//                 setSavingEntity(null);
//             }, 1000);
//         };

//         if (!drivers.length) {
//             return <p className="text-center py-4">Loading drivers...</p>;
//         }



//         return (
//             <div className="row g-3">
//                 {entities.map((entity, index) => {
//                     const data = mapping[entity] || {};
//                     const selectedDrivers = data.drivers || [];
//                     const services = data.services || [];
//                     const derivation = data.derivation || "";
//                     const isSaved = savedMapping[entity];
//                     const isOpen = activeEntity === entity;
//                     const isSaving = savingEntity === entity;

//                     return (
//                         <div className="col-12" key={index}>
//                             <div
//                                 className="p-3 bg-white border rounded-3"
//                                 style={{ borderColor: "#e5e7eb", cursor: "pointer" }}
//                                 onClick={() => handleToggle(entity)}
//                             >
//                                 {/* HEADER */}
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div className="d-flex align-items-center gap-2">
//                                         <h6 className="mb-0 fw-semibold">{entity}</h6>

//                                         {isSaved && (
//                                             <span className="badge bg-success-subtle text-success">
//                                                 Recently Saved
//                                             </span>
//                                         )}
//                                     </div>

//                                     <span>{isOpen ? "▲" : "▼"}</span>
//                                 </div>

//                                 {/* EXPANDED */}
//                                 {isOpen && (
//                                     <div
//                                         className="mt-3"
//                                         onClick={(e) => e.stopPropagation()}
//                                     >
//                                         <div className="row g-3">

//                                             {/* DRIVERS */}
//                                             <div className="col-md-6 order-1 order-md-2">
//                                                 <label className="form-label small fw-bold">
//                                                     Drivers
//                                                 </label>

//                                                 <Select
//                                                     isMulti
//                                                     options={driverOptions}
//                                                     value={selectedDrivers}
//                                                     onChange={(selected) =>
//                                                         handleDriverChange(entity, selected)
//                                                     }
//                                                     placeholder="Select drivers"
//                                                     styles={{
//                                                         container: (base) => ({
//                                                             ...base,
//                                                             width: "100%",
//                                                         }),
//                                                         control: (base) => ({
//                                                             ...base,
//                                                             minHeight: "38px",
//                                                             borderRadius: "6px",
//                                                             fontSize: "13px",
//                                                         }),
//                                                     }}
//                                                 />
//                                             </div>

//                                             {/* DERIVATION */}
//                                             <div className="col-md-6">
//                                                 <label className="form-label small fw-bold text-muted">
//                                                     Deviation
//                                                 </label>

//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     placeholder="Enter derivation..."
//                                                     value={derivation}
//                                                     onChange={(e) =>
//                                                         handleDerivationChange(entity, e.target.value)
//                                                     }
//                                                     style={{
//                                                         height: "38px",
//                                                         fontSize: "13px",
//                                                         borderRadius: "6px",
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* SERVICES */}
//                                         <div className="mt-3">
//                                             <p className="small fw-bold text-muted mb-2">Services</p>

//                                             {services.length > 0 ? (
//                                                 <div className="d-flex flex-wrap gap-2">
//                                                     {services.map((s, i) => (
//                                                         <span key={i} className="service-tag">
//                                                             {s.serviceName}
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-muted small">No services selected</p>
//                                             )}
//                                         </div>

//                                         {/* SAVE BUTTON */}
//                                         <div className="mt-3 text-end">
//                                             <button
//                                                 className="btn btn-outline-primary btn-sm"
//                                                 style={{
//                                                     height: "34px",
//                                                     fontSize: "13px",
//                                                     borderRadius: "6px",
//                                                 }}
//                                                 disabled={!selectedDrivers.length || isSaving}
//                                                 onClick={() => handleSave(entity)}
//                                             >
//                                                 {isSaving ? (
//                                                     <>
//                                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                                         Saving...
//                                                     </>
//                                                 ) : (
//                                                     "Save"
//                                                 )}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         )
//     }


//     return (
//         <div className="container-fluid py-4">

//             {/* HEADER */}
//             <div className="mb-4 p-4 bg-white border rounded-3 d-flex justify-content-between align-items-center">
//                 <div>
//                     <h5 className="fw-semibold mb-1" style={{ color: "#111827" }}>
//                         Quick Book Integration
//                     </h5>
//                     <p className="mb-0" style={{ fontSize: "14px", color: "#6b7280" }}>
//                         Connect your account and map your data fields
//                     </p>
//                 </div>

//                 <AuthButton onConfirm={handleAuthenticate} />
//             </div>

//             {/* MAPPING SECTION */}
//             <MappingUI drivers={drivers} />

//             <ErrorModel
//                 ErrorModel={openErrorModal}
//                 handleClose={handleClose}
//                 ErrorMessage={formattedErrorMessage}
//             />
//         </div>
//     );
// }

// export default QuickBookAuthentication;
