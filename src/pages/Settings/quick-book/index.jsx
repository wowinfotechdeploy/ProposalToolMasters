import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import "../xero/Xero.css"
import ErrorModel from "../../../components/ErrorModel";
import AuthButton from "../../../components/Sidebar/AuthenticationButton";
import { ConnectionAuthentication } from "../../../redux/Services//Xero/XeroApi"
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { GetAllDrivers } from "../../../redux/reducer/quickBookSlice";


function QuickBookAuthentication() {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state?.Storage);
    const drivers = useSelector((state) => state.quickBook.drivers);

    //==================state=====================
    const { handleErrorMessage } = useContext(AuthContextProvider);
    const [errorMessage, setErrorMessage] = useState("");
    const formattedErrorMessage = handleErrorMessage(errorMessage);
    const [openErrorModal, setOpenErrorModal] = useState(false);

    //==================UseEffect=====================
    useEffect(() => {
        dispatch(GetAllDrivers(auth?.organisationKeyID))
    }, [dispatch])

    //==================functions=====================
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

    //-------------------mapping component-------------------
    function MappingUI({ drivers = [] }) {
        //==================state===================
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

        const [activeEntity, setActiveEntity] = useState(null);
        const [savingEntity, setSavingEntity] = useState(null);
        const [mapping, setMapping] = useState({});
        const [savedMapping, setSavedMapping] = useState({});

        //================ HANDLE CHANGE =================
        const handleToggle = (entity) => {
            setActiveEntity((prev) => (prev === entity ? null : entity));

            // remove saved state when reopening
            setSavedMapping((prev) => {
                const updated = { ...prev };
                delete updated[entity];
                return updated;
            });
        };

        const handleDriverChange = (entity, selectedOptions) => {
            const selectedIds = selectedOptions
                ? selectedOptions.map((opt) => opt.value)
                : [];

            const selectedDrivers = drivers.filter((d) =>
                selectedIds.includes(d.id)
            );

            const services = selectedDrivers.flatMap((d) => d.services || []);

            setMapping((prev) => ({
                ...prev,
                [entity]: {
                    ...prev[entity],
                    drivers: selectedOptions || [],
                    services,
                },
            }));
        };

        const handleDerivationChange = (entity, value) => {
            setMapping((prev) => ({
                ...prev,
                [entity]: {
                    ...prev[entity],
                    derivation: value,
                },
            }));
        };
        //================ SAVE =================
        const handleSave = async (entity) => {
            setSavingEntity(entity);

            // simulate API call delay (replace with real API)
            setTimeout(() => {
                setSavedMapping((prev) => ({
                    ...prev,
                    [entity]: mapping[entity],
                }));

                setSavingEntity(null);
            }, 1000);
        };

        if (!drivers.length) {
            return <p className="text-center py-4">Loading drivers...</p>;
        }



        return (
            <div className="row g-3">
                {entities.map((entity, index) => {
                    const data = mapping[entity] || {};
                    const selectedDrivers = data.drivers || [];
                    const services = data.services || [];
                    const derivation = data.derivation || "";
                    const isSaved = savedMapping[entity];
                    const isOpen = activeEntity === entity;
                    const isSaving = savingEntity === entity;

                    return (
                        <div className="col-12" key={index}>
                            <div
                                className="p-3 bg-white border rounded-3"
                                style={{ borderColor: "#e5e7eb", cursor: "pointer" }}
                                onClick={() => handleToggle(entity)}
                            >
                                {/* HEADER */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <h6 className="mb-0 fw-semibold">{entity}</h6>

                                        {isSaved && (
                                            <span className="badge bg-success-subtle text-success">
                                                Recently Saved
                                            </span>
                                        )}
                                    </div>

                                    <span>{isOpen ? "▲" : "▼"}</span>
                                </div>

                                {/* EXPANDED */}
                                {isOpen && (
                                    <div
                                        className="mt-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="row g-3">

                                            {/* DRIVERS */}
                                            <div className="col-md-6 order-1 order-md-2">
                                                <label className="form-label small fw-bold">
                                                    Drivers
                                                </label>

                                                <Select
                                                    isMulti
                                                    options={driverOptions}
                                                    value={selectedDrivers}
                                                    onChange={(selected) =>
                                                        handleDriverChange(entity, selected)
                                                    }
                                                    placeholder="Select drivers"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: "100%",
                                                        }),
                                                        control: (base) => ({
                                                            ...base,
                                                            minHeight: "38px",
                                                            borderRadius: "6px",
                                                            fontSize: "13px",
                                                        }),
                                                    }}
                                                />
                                            </div>

                                            {/* DERIVATION */}
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted">
                                                    Deviation
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter derivation..."
                                                    value={derivation}
                                                    onChange={(e) =>
                                                        handleDerivationChange(entity, e.target.value)
                                                    }
                                                    style={{
                                                        height: "38px",
                                                        fontSize: "13px",
                                                        borderRadius: "6px",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* SERVICES */}
                                        <div className="mt-3">
                                            <p className="small fw-bold text-muted mb-2">Services</p>

                                            {services.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {services.map((s, i) => (
                                                        <span key={i} className="service-tag">
                                                            {s.serviceName}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted small">No services selected</p>
                                            )}
                                        </div>

                                        {/* SAVE BUTTON */}
                                        <div className="mt-3 text-end">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                style={{
                                                    height: "34px",
                                                    fontSize: "13px",
                                                    borderRadius: "6px",
                                                }}
                                                disabled={!selectedDrivers.length || isSaving}
                                                onClick={() => handleSave(entity)}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }


    return (
        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="mb-4 p-4 bg-white border rounded-3 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="fw-semibold mb-1" style={{ color: "#111827" }}>
                        Quick Book Integration
                    </h5>
                    <p className="mb-0" style={{ fontSize: "14px", color: "#6b7280" }}>
                        Connect your account and map your data fields
                    </p>
                </div>

                <AuthButton onConfirm={handleAuthenticate} />
            </div>

            {/* MAPPING SECTION */}
            <MappingUI drivers={drivers} />

            <ErrorModel
                ErrorModel={openErrorModal}
                handleClose={handleClose}
                ErrorMessage={formattedErrorMessage}
            />
        </div>
    );
}

export default QuickBookAuthentication;


// //api integration

// import { useContext, useEffect, useState } from "react";
// import ErrorModel from "../../../components/ErrorModel";
// import AuthButton from "../../../components/Sidebar/AuthenticationButton";
// import { ConnectionAuthentication } from "../../../redux/Services//Xero/XeroApi"
// import { AuthContextProvider } from "../../../AuthContext/AuthContext";
// import Select from "react-select";
// import { GetAllDrivers } from "../../../redux/reducer/quickBookSlice";
// import { useDispatch, useSelector } from "react-redux";


// function QuickBookAuthentication() {
//     const dispatch = useDispatch()
//     const auth = useSelector((state) => state?.Storage);
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
//             const res = await ConnectionAuthentication(organisationKeyID);

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

//         const [mapping, setMapping] = useState({});
//         const [savedMapping, setSavedMapping] = useState({});

//         //================ HANDLE CHANGE =================
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
//                     drivers: selectedOptions || [],
//                     services,
//                 },
//             }));
//         };

//         //================ SAVE =================
//         const handleSave = (entity) => {
//             setSavedMapping((prev) => ({
//                 ...prev,
//                 [entity]: mapping[entity],
//             }));

//             console.log("Saved:", entity, mapping[entity]);
//         };

//         if (!drivers.length) {
//             return <p className="text-center py-4">Loading drivers...</p>;
//         }

//         return (
//             <div className="row g-4">
//                 {entities.map((entity, index) => {
//                     const data = mapping[entity] || {};
//                     const selectedDrivers = data.drivers || [];
//                     const services = data.services || [];
//                     const isSaved = savedMapping[entity];

//                     return (
//                         <div className="col-md-6 col-lg-4" key={index}>
//                             <div
//                                 className="h-100 p-3 bg-white border rounded-3"
//                                 style={{
//                                     borderColor: "#e5e7eb",
//                                 }}
//                             >
//                                 {/* HEADER */}
//                                 <div className="d-flex justify-content-between align-items-center mb-3">
//                                     <h6
//                                         className="mb-0 fw-semibold"
//                                         style={{ fontSize: "15px", color: "#111827" }}
//                                     >
//                                         {entity}
//                                     </h6>

//                                     <div className="d-flex align-items-center gap-2">
//                                         {isSaved && (
//                                             <span
//                                                 className="badge"
//                                                 style={{
//                                                     background: "#ecfdf5",
//                                                     color: "#16a34a",
//                                                     fontSize: "11px",
//                                                     fontWeight: 500,
//                                                 }}
//                                             >
//                                                 Saved
//                                             </span>
//                                         )}

//                                         <button
//                                             className="btn btn-outline-primary btn-md btn-success create-item-btn"
//                                             style={{ fontSize: "13px" }}
//                                             onClick={() => handleSave(entity)}
//                                         >
//                                             Save
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* SELECT */}
//                                 <div className="mb-3">
//                                     <Select
//                                         isMulti
//                                         options={driverOptions}
//                                         value={selectedDrivers}
//                                         onChange={(selected) =>
//                                             handleDriverChange(entity, selected)
//                                         }
//                                         placeholder="Select drivers"
//                                         styles={{
//                                             control: (base) => ({
//                                                 ...base,
//                                                 minHeight: "38px",
//                                                 borderRadius: "6px",
//                                                 fontSize: "13px",
//                                             }),
//                                         }}
//                                     />
//                                 </div>

//                                 {/* SERVICES */}
//                                 <div>
//                                     <p
//                                         className="mb-2"
//                                         style={{
//                                             fontSize: "12px",
//                                             fontWeight: 500,
//                                             color: "#6b7280",
//                                         }}
//                                     >
//                                         Services
//                                     </p>

//                                     {services.length > 0 ? (
//                                         <div className="d-flex flex-wrap gap-2">
//                                             {services.map((s, i) => (
//                                                 <span
//                                                     key={i}
//                                                     style={{
//                                                         fontSize: "12px",
//                                                         padding: "4px 8px",
//                                                         borderRadius: "6px",
//                                                         background: "#eff6ff",
//                                                         color: "#2563eb",
//                                                         border: "1px solid #dbeafe",
//                                                     }}
//                                                 >
//                                                     {s.serviceName}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p
//                                             className="mb-0"
//                                             style={{ fontSize: "12px", color: "#9ca3af" }}
//                                         >
//                                             No services selected
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
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