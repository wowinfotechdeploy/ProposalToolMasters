import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionAuthentication } from "../../../redux/Services//Xero/XeroApi";
import AuthButton from "../../../components/Sidebar/AuthenticationButton";
import { DisconnectIntegration, GetAllDrivers } from "../../../redux/reducer/quickBookSlice";
import ErrorModel from "../../../components/ErrorModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import "./Xero.css";
import { getActivePlatform } from "../../../lib/utils";

function XeroAuthentication() {
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

            const res = await ConnectionAuthentication(organisationKeyID, activePlatform,
                "Xero"
            );

            if (res?.status === 200) {
                const url = res.data.connectionUrl;
                window.open(url, "_blank", "noopener,noreferrer");
            } else {

                setOpenErrorModal(true);
                setErrorMessage(res.response.data.message);
            }
        } catch (err) {

            console.error(err);
            setOpenErrorModal(true);
            setErrorMessage("Something went wrong");
        } finally {
            const modalEl = document.getElementById("ConfirmModel");
            if (modalEl) {
                const modalInstance =
                    window.bootstrap.Modal.getInstance(modalEl) ||
                    new window.bootstrap.Modal(modalEl);

                modalInstance.hide();
            }
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
        } finally {
            const modalEl = document.getElementById("ConfirmModel");
            if (modalEl) {
                const modalInstance =
                    window.bootstrap.Modal.getInstance(modalEl) ||
                    new window.bootstrap.Modal(modalEl);

                modalInstance.hide();
            }
        }

    }

    const handleClose = () => {
        setOpenErrorModal(false);
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
                    Xero Driver Mapping
                </h4>

                <AuthButton onAuthenticate={handleAuthenticate} onDisconnect={handleDisconnect} activePlatform={activePlatform == 'Xero' ? true : false} />
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

export default XeroAuthentication;

