import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {} from "../../../../redux/reducer/quickBookSlice";
import ErrorModel from "../../../../components/ErrorModel";
import { AuthContextProvider } from "../../../../AuthContext/AuthContext";
import { SaveMetricMapping } from "../../../../redux/reducer/metricsSlice";

export default function MappingUI({
  drivers = [],
  metrics = [],
  metricMappings = [],
}) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.Storage);
  const { handleErrorMessage } = useContext(AuthContextProvider);

  //================ STATE =================
  const [mapping, setMapping] = useState({});
  const [savedMapping, setSavedMapping] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  const [successMapping, setSuccessMapping] = useState({});
  //================ STYLES =================
  const headingStyle = { color: "#182031ff" };
  const labelStyle = { color: "#000000ff" };
  //================ DRIVER OPTIONS =================
  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  //================ PRELOAD EXISTING MAPPINGS =================
  useEffect(() => {
    if (!metricMappings?.length || !drivers?.length) return;

    const formattedMapping = {};

    metricMappings.forEach((item) => {
      // selected drivers for react-select
      const selectedDrivers = [];

      // payload-ready drivers
      const payloadDrivers = [];

      // services for UI
      const services = [];

      item.drivers?.forEach((driverItem) => {
        // match full driver object
        const matchedDriver = drivers.find(
          (d) => Number(d.id) === Number(driverItem.globalPricingDriverId),
        );

        // react-select selected values
        if (
          matchedDriver &&
          !selectedDrivers.some(
            (s) => Number(s.value) === Number(matchedDriver.id),
          )
        ) {
          selectedDrivers.push({
            value: matchedDriver.id,
            label: matchedDriver.name,
          });
        }

        // payload structure
        payloadDrivers.push({
          globalPricingDriverId: driverItem.globalPricingDriverId,
          serviceId: driverItem.serviceId || null,
        });

        // services UI
        if (driverItem.serviceName) {
          services.push({
            serviceID: driverItem.serviceId,
            serviceName: driverItem.serviceName,
          });
        }
      });

      formattedMapping[item.metricKey] = {
        metricKey: item.metricKey,

        thresholdPercent: item.thresholdPercent || 0,

        selectedDrivers,

        drivers: payloadDrivers,

        services,
      };
    });

    setMapping(formattedMapping);

    setSavedMapping(formattedMapping);
  }, [metricMappings, drivers]);
  //================ HANDLE SAVE =================
  const handleSave = async (metricKey) => {
    try {
      const payload = {
        metricKey: mapping[metricKey]?.metricKey,
        thresholdPercent: Number(mapping[metricKey]?.thresholdPercent || 0),
        drivers: mapping[metricKey]?.drivers || [],
      };

      // API CALL
      await dispatch(
        SaveMetricMapping({
          organisationKeyID: auth?.organisationKeyID,
          payload,
        }),
      ).unwrap();

      setSuccessMapping((prev) => ({
        ...prev,
        [metricKey]: true,
      }));
      setTimeout(() => {
        setSuccessMapping((prev) => ({
          ...prev,
          [metricKey]: false,
        }));
      }, 4000);
    } catch (err) {
      console.error(err);
      setOpenErrorModal(true);
      setErrorMessage(err?.message || "Something went wrong");
    }
  };

  const handleClose = () => {
    setOpenErrorModal(false);
  };

  //================ UI =================
  return (
    <div className="row g-4">
      {metrics.map((metric, index) => {
        const metricKey = metric.metricKey;
        const data = mapping[metricKey] || {};
        const isSaved = successMapping[metricKey];

        return (
          <div className="col-md-6 col-lg-4" key={metricKey || index}>
            <div className="h-100 p-3 bg-white border rounded-3">
              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6
                    className="mb-1 fw-semibold text-capitalize"
                    style={headingStyle}
                  >
                    {metricKey.replaceAll("_", " ")}
                  </h6>

                  {/* <small style={{ color: "#6b7280" }}>
                      {metric.description}
                    </small> */}
                </div>

                <div className="d-flex align-items-center gap-2">
                  {isSaved ? (
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
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleSave(metricKey)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>

              {/* DRIVER LABEL */}
              <p className="mb-1 small fw-semibold" style={labelStyle}>
                Proposal Tool Drivers
              </p>

              {/* SELECT */}
              <div className="mb-3">
                <Select
                  isMulti
                  options={driverOptions}
                  value={data.selectedDrivers || []}
                  onChange={(selected) => {
                    // selected driver full objects
                    const selectedDriverObjects = drivers.filter((d) =>
                      selected?.some(
                        (option) => Number(option.value) === Number(d.id),
                      ),
                    );

                    // create payload-ready drivers array
                    const payloadDrivers = [];

                    // collect services for UI
                    const services = [];

                    selectedDriverObjects.forEach((driver) => {
                      // GLOBAL DRIVER
                      const isGlobalDriver = driver.services?.every(
                        (service) => service.serviceID === null,
                      );

                      // ================= GLOBAL =================
                      if (isGlobalDriver) {
                        payloadDrivers.push({
                          globalPricingDriverId: driver.id,
                          serviceId: null,
                        });

                        // UI services only
                        driver.services.forEach((service) => {
                          services.push({
                            serviceID: null,
                            serviceName: service.serviceName,
                          });
                        });
                      }

                      // ================= LOCAL =================
                      else {
                        driver.services.forEach((service) => {
                          payloadDrivers.push({
                            globalPricingDriverId: driver.id,
                            serviceId: service.serviceID,
                          });

                          services.push({
                            serviceID: service.serviceID,
                            serviceName: service.serviceName,
                          });
                        });
                      }
                    });

                    setMapping((prev) => ({
                      ...prev,
                      [metricKey]: {
                        ...prev[metricKey],

                        // select value
                        selectedDrivers: selected,

                        // payload-ready array
                        drivers: payloadDrivers,

                        // for UI
                        services,

                        metricKey,

                        thresholdPercent:
                          prev[metricKey]?.thresholdPercent || 0,
                      },
                    }));
                  }}
                  placeholder="Select driver"
                />
              </div>

              {/* SERVICES */}
              <p className="mb-2 small fw-semibold" style={labelStyle}>
                Proposal Services
              </p>

              {data?.services?.length > 0 ? (
                <>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {data.services.map((service, i) => (
                      <span key={i} className="service-tag">
                        {service.serviceName}
                      </span>
                    ))}
                  </div>

                  <div>
                    <label
                      className="form-label small fw-semibold"
                      style={{ color: "#6b7280" }}
                    >
                      Deviation (%)
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter deviation"
                      min={0}
                      max={100}
                      value={data.thresholdPercent || ""}
                      onChange={(e) => {
                        let value = Number(e.target.value);

                        if (value > 100) value = 100;
                        if (value < 0) value = 0;

                        setMapping((prev) => ({
                          ...prev,
                          [metricKey]: {
                            ...prev[metricKey],
                            thresholdPercent: value,
                          },
                        }));
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="small" style={{ color: "#9ca3af" }}>
                  No services selected
                </p>
              )}
            </div>
          </div>
        );
      })}

      <ErrorModel
        ErrorModel={openErrorModal}
        handleClose={handleClose}
        ErrorMessage={formattedErrorMessage}
      />
    </div>
  );
}
