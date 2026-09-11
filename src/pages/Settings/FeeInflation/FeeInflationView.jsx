/* global $ */
import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import SuccessModal from "../../../components/SuccessModal";
import ConfirmModel from "../../../components/ConfirmationBox";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import {
  GetServiceFeeInflationList,
  AddUpdateServiceFeeInflation,
  DeleteAllServiceFeeInflationConfiguration,
} from "../../../redux/Services/Config/ServicesApi";
import { USER_ROLE_TYPE } from "../../../Middleware/enums";
import "../Pricing-settings/PricingSettingStyle.css";
import "./FeeInflationView-redesign.css";

const FeeInflationView = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [dismissModal, setDismissModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUpdateActionDone, setIsAddUpdateActionDone] = useState(false);
  const [modelRequestData, setModelRequestData] = useState({
    message: null,
    status: null,
    Action: null,
    keyID: null,
    SearchKeyword: "",
    RefId: null,
  });
  const [ServiceFeeInflationConfig, setServiceFeeInflationConfig] = useState({
    OrganisationKeyID: null,
    UserKeyID: null,
    ServiceFeeInflationList: [],
    HasExistingConfig: false,
    SelectionError: "",
    SelectedServices: [],
    InflationRule: {
      operator: null,
      value: null,
    },
  });

  const { setLoader, setTopbar, userAccessData } =
    useContext(AuthContextProvider);
  const common = useSelector((state) => state.Storage);
  const isSuperAdminView = common?.organisationKeyID == null;
  const canManageFeeInflation =
    isSuperAdminView && common?.roleTypeId === USER_ROLE_TYPE.SuperAdmin;

  useEffect(() => {
    setTopbar("block");
  }, [setTopbar]);

  useEffect(() => {
    if (common.userKeyID && canManageFeeInflation) {
      GetServiceFeeInflationConfigData();
    }
  }, [common.organisationKeyID, common.userKeyID, canManageFeeInflation]);

  const availableServices =
    ServiceFeeInflationConfig.ServiceFeeInflationList.filter((s) => {
      const isFixed = s.pricingTypeID !== 2;
      const isAlreadyConfigured = s.operator !== null && s.value !== null;

      if (isFixed && isAlreadyConfigured) return false;

      return true;
    });

  const allServicesSelected =
    availableServices.length > 0 &&
    ServiceFeeInflationConfig.SelectedServices.length ===
      availableServices.length;

  const GetServiceFeeInflationConfigData = async () => {
    if (!common.userKeyID) {
      return;
    }

    try {
      const data = await GetServiceFeeInflationList({
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
      });

      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ListData = data?.data?.responseData?.data;
          setServiceFeeInflationConfig((prev) => ({
            ...prev,
            OrganisationKeyID: common.organisationKeyID,
            UserKeyID: common.userKeyID,
            ServiceFeeInflationList: ListData,
            SelectedServices: [],
            HasExistingConfig: ListData.some(
              (s) => s.operator !== null && s.value !== null,
            ),
            InflationRule: {
              operator: null,
              value: null,
            },
          }));
        }
      } else {
        setErrorMessage(
          data?.data?.errorMessage || "Unable to load fee inflation data.",
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to load fee inflation data.");
    }
  };

  const SubmitServiceFeeInflation = async () => {
    setErrorMessage("");
    if (
      !ServiceFeeInflationConfig.SelectedServices ||
      ServiceFeeInflationConfig.SelectedServices.length === 0
    ) {
      // setErrorMessage("Please select one or more services to configure.");
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please select one or more services to configure.",
      });
      return;
    }

    if (!ServiceFeeInflationConfig.InflationRule.operator) {
      // setErrorMessage("Please choose an operator.");
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please choose an operator.",
      });
      return;
    }

    if (ServiceFeeInflationConfig.InflationRule.value === null) {
      // setErrorMessage("Please enter a value.");
      setServiceFeeInflationConfig({
        ...ServiceFeeInflationConfig,
        SelectionError: "Please enter a value.",
      });
      return;
    }

    setLoader(true);
    try {
      const serviceIDs = ServiceFeeInflationConfig.SelectedServices.map(
        (s) => s.serviceID ?? s.serviceID ?? s.ServiceID,
      ).join(",");

      const apiParams = {
        organisationKeyID: common.organisationKeyID,
        userKeyID: common.userKeyID,
        operator: ServiceFeeInflationConfig.InflationRule.operator,
        value: ServiceFeeInflationConfig.InflationRule.value,
        serviceIDs,
      };

      const response = await AddUpdateServiceFeeInflation(apiParams);
      setLoader(false);
      if (response?.data?.statusCode === 200) {
        setOpenSuccessModal(true);
        setIsAddUpdateActionDone(true);
        GetServiceFeeInflationConfigData();
      } else {
        setErrorMessage(
          response?.data?.errorMessage ||
            response?.response?.data?.errorMessage ||
            "Unable to save fee inflation rule.",
        );
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
      setErrorMessage("Unable to save fee inflation rule.");
    }
  };

  const DeleteServiceFeeInflationConfig = async () => {
    if (!common.userKeyID) {
      return;
    }

    try {
      const data = await DeleteAllServiceFeeInflationConfiguration(
        common.organisationKeyID,
        common.userKeyID,
        modelRequestData.batchID,
      );

      if (data?.data?.statusCode === 200) {
        $("#ConfirmModel").one("hidden.bs.modal", () => {
          setIsAddUpdateActionDone(true);
          setOpenSuccessModal(true);
          GetServiceFeeInflationConfigData();
        });
        $("#ConfirmModel").modal("hide");
      } else {
        setErrorMessage(
          data?.data?.errorMessage ||
            data?.response?.data?.errorMessage ||
            "Unable to delete fee inflation rule.",
        );
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setErrorMessage("Unable to delete fee inflation rule.");
    }
  };

  const handleClose = () => {
    $("#" + "confirm").modal("hide");
    setOpenSuccessModal(false);
  };

  if (!canManageFeeInflation) {
    return (
      <div className="container py-4">
        <div className="alert alert-info mb-0">
          This fee inflation screen is available only for super admin users.
        </div>
      </div>
    );
  }

  return (
    <div className="fee-inflation-redesign">
      <div className="fee-inflation-page">
        <div className="fee-inflation-page-header">
          <div className="fee-inflation-heading-copy">
            <h1>Fee Inflation</h1>
            <p>
              Configure price adjustment rules for selected services and manage
              existing inflation configurations.
            </p>
          </div>

          <div className="fee-inflation-header-badge">
            <span className="fee-inflation-header-badge-icon">
              <i className="ri-shield-check-line"></i>
            </span>
            <div>
              <span>Access</span>
              <strong>Super Admin</strong>
            </div>
          </div>
        </div>

        <section className="fee-inflation-config-card">
          <div className="fee-inflation-card-header">
            <div className="fee-inflation-card-title">
              <span className="fee-inflation-card-icon">
                <i className="ri-line-chart-line"></i>
              </span>
              <div>
                <h2>Configure Inflation Rule</h2>
                <p>
                  Select services, choose an adjustment type and enter its
                  value.
                </p>
              </div>
            </div>
            <span className="fee-inflation-selected-count">
              {ServiceFeeInflationConfig.SelectedServices.length} selected
            </span>
          </div>

          <div className="fee-inflation-card-body">
            <div className="fee-inflation-step">
              <div className="fee-inflation-step-number">1</div>
              <div className="fee-inflation-step-content">
                <div className="fee-inflation-field-heading">
                  <div>
                    <label>Select Services</label>
                    <span>Choose one or more services to apply this rule.</span>
                  </div>
                  <span className="fee-inflation-available-count">
                    {availableServices.length} available
                  </span>
                </div>

                <Select
                  isMulti
                  className="fee-inflation-service-select"
                  classNamePrefix="fee-inflation-select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 99999,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 99999,
                    }),
                  }}
                  options={[
                    ...(!allServicesSelected
                      ? [
                          {
                            value: "ALL",
                            label: "All",
                            isAll: true,
                          },
                        ]
                      : []),

                    ...availableServices.map((s) => ({
                      value: s.serviceID,
                      label: s.serviceName,
                      isConfigured: s.operator !== null && s.value !== null,
                      data: s,
                    })),
                  ]}
                  value={ServiceFeeInflationConfig.SelectedServices.map(
                    (s) => ({
                      value: s.serviceID,
                      label: s.serviceName,
                      isConfigured: s.operator !== null && s.value !== null,
                      data: s,
                    }),
                  )}
                  onChange={(selected) => {
                    const clickedAll = selected?.some((s) => s.isAll);

                    const selectedServices = clickedAll
                      ? availableServices
                      : selected
                        ? selected.map((s) => s.data)
                        : [];

                    setServiceFeeInflationConfig((prev) => ({
                      ...prev,
                      SelectedServices: selectedServices,
                      SelectionError: "",
                      InflationRule:
                        selectedServices.length > 0
                          ? prev.InflationRule
                          : {
                              operator: null,
                              value: null,
                            },
                    }));
                  }}
                  formatOptionLabel={(option) => (
                    <div className="fee-inflation-option">
                      <span>{option.label}</span>

                      {option.isConfigured && (
                        <span className="fee-inflation-option-badge">
                          Configured
                        </span>
                      )}
                    </div>
                  )}
                  isClearable
                  placeholder="Search and select services..."
                />

                {ServiceFeeInflationConfig.SelectedServices.length == 0 &&
                  ServiceFeeInflationConfig.SelectionError && (
                    <label className="validation fee-inflation-validation">
                      {ServiceFeeInflationConfig.SelectionError}
                    </label>
                  )}
              </div>
            </div>

            {ServiceFeeInflationConfig.SelectedServices.length > 0 && (
              <>
                <div className="fee-inflation-divider"></div>
                <div className="fee-inflation-step">
                  <div className="fee-inflation-step-number">2</div>
                  <div className="fee-inflation-step-content">
                    <div className="fee-inflation-field-heading">
                      <div>
                        <label>Choose Adjustment Type</label>
                        <span>
                          Select how prices should be increased or reduced.
                        </span>
                      </div>
                    </div>

                    <div className="fee-inflation-operator-grid">
                      {[
                        {
                          symbol: "+",
                          label: "Add",
                          description: "Flat increase",
                          icon: "ri-add-line",
                        },
                        {
                          symbol: "-",
                          label: "Subtract",
                          description: "Flat reduction",
                          icon: "ri-subtract-line",
                        },
                        {
                          symbol: "*",
                          label: "Markup %",
                          description: "Percentage increase",
                          icon: "ri-percent-line",
                        },
                        {
                          symbol: "/",
                          label: "Discount %",
                          description: "Percentage reduction",
                          icon: "ri-percent-line",
                        },
                      ].map((op) => {
                        const isSelected =
                          ServiceFeeInflationConfig.InflationRule.operator ===
                          op.symbol;
                        return (
                          <button
                            key={op.symbol}
                            type="button"
                            className={`fee-inflation-operator-card ${isSelected ? "is-selected" : ""}`}
                            onClick={() =>
                              setServiceFeeInflationConfig((prev) => ({
                                ...prev,
                                InflationRule: {
                                  ...prev.InflationRule,
                                  operator: op.symbol,
                                  value: null,
                                },
                                SelectionError: "",
                              }))
                            }
                          >
                            <span className="fee-inflation-operator-icon">
                              <i className={op.icon}></i>
                            </span>
                            <span className="fee-inflation-operator-copy">
                              <strong>{op.label}</strong>
                              <small>{op.description}</small>
                            </span>
                            <span className="fee-inflation-operator-symbol">
                              {op.symbol}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {!ServiceFeeInflationConfig.InflationRule.operator &&
                      ServiceFeeInflationConfig.SelectionError && (
                        <label className="validation fee-inflation-validation">
                          {ServiceFeeInflationConfig.SelectionError}
                        </label>
                      )}
                  </div>
                </div>

                {ServiceFeeInflationConfig.InflationRule.operator && (
                  <>
                    <div className="fee-inflation-divider"></div>
                    <div className="fee-inflation-step">
                      <div className="fee-inflation-step-number">3</div>
                      <div className="fee-inflation-step-content">
                        <div className="fee-inflation-value-layout">
                          <div className="fee-inflation-value-field">
                            <label className="fee-inflation-input-label">
                              {ServiceFeeInflationConfig.InflationRule
                                .operator === "+" ||
                              ServiceFeeInflationConfig.InflationRule
                                .operator === "-"
                                ? "Amount"
                                : "Percentage (%)"}
                            </label>
                            <div className="fee-inflation-value-input-wrap">
                              <span className="fee-inflation-value-prefix">
                                {ServiceFeeInflationConfig.InflationRule
                                  .operator === "+" ||
                                ServiceFeeInflationConfig.InflationRule
                                  .operator === "-"
                                  ? ServiceFeeInflationConfig.InflationRule
                                      .operator
                                  : "%"}
                              </span>
                              <input
                                type="text"
                                inpitMode="decimal"
                                className="form-control fee-inflation-value-input"
                                min={0}
                                placeholder={
                                  ServiceFeeInflationConfig.InflationRule
                                    .operator === "+" ||
                                  ServiceFeeInflationConfig.InflationRule
                                    .operator === "-"
                                    ? "Enter flat amount"
                                    : "Enter percentage e.g. 10"
                                }
                                value={
                                  ServiceFeeInflationConfig.InflationRule
                                    .value ?? ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    setServiceFeeInflationConfig({
                                      ...ServiceFeeInflationConfig,
                                      InflationRule: {
                                        ...ServiceFeeInflationConfig.InflationRule,
                                        value: null,
                                      },
                                      SelectionError: "",
                                    });
                                    return;
                                  }
                                  if (!/^[1-9][0-9]*$/.test(value)) {
                                    return;
                                  }
                                  const maxValue =
                                    ServiceFeeInflationConfig.InflationRule
                                      .operator === "+" ||
                                    ServiceFeeInflationConfig.InflationRule
                                      .operator === "-"
                                      ? 9999
                                      : 100;
                                  if (parseInt(value, 10) > maxValue) {
                                    return;
                                  }
                                  setServiceFeeInflationConfig({
                                    ...ServiceFeeInflationConfig,
                                    InflationRule: {
                                      ...ServiceFeeInflationConfig.InflationRule,
                                      value,
                                    },
                                  });
                                }}
                              />
                            </div>

                            {ServiceFeeInflationConfig.InflationRule.operator &&
                              ServiceFeeInflationConfig.InflationRule.value ===
                                null &&
                              ServiceFeeInflationConfig.SelectionError && (
                                <label className="validation fee-inflation-validation">
                                  {ServiceFeeInflationConfig.SelectionError}
                                </label>
                              )}
                          </div>

                          {ServiceFeeInflationConfig.InflationRule.value >
                            0 && (
                            <div className="fee-inflation-preview">
                              <span className="fee-inflation-preview-icon">
                                <i className="ri-eye-line"></i>
                              </span>
                              <div>
                                <span>Rule Preview</span>
                                <strong>
                                  {ServiceFeeInflationConfig.InflationRule
                                    .operator === "+" &&
                                    `Price + ${ServiceFeeInflationConfig.InflationRule.value}`}
                                  {ServiceFeeInflationConfig.InflationRule
                                    .operator === "-" &&
                                    `Price − ${ServiceFeeInflationConfig.InflationRule.value}`}
                                  {ServiceFeeInflationConfig.InflationRule
                                    .operator === "*" &&
                                    `Price × ${(1 + ServiceFeeInflationConfig.InflationRule.value / 100).toFixed(2)}`}
                                  {ServiceFeeInflationConfig.InflationRule
                                    .operator === "/" &&
                                    `Price × ${(1 - ServiceFeeInflationConfig.InflationRule.value / 100).toFixed(2)}`}
                                </strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {errorMessage && (
              <div className="fee-inflation-api-error">
                <i className="ri-error-warning-line"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {canManageFeeInflation && (
              <div className="fee-inflation-config-actions">
                <button
                  type="button"
                  className="fee-inflation-submit-btn"
                  onClick={() => SubmitServiceFeeInflation()}
                >
                  <i className="ri-check-line"></i>
                  <span>Submit Configuration</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {(() => {
          const configured =
            ServiceFeeInflationConfig.ServiceFeeInflationList.filter(
              (s) => s.operator !== null && s.value !== null,
            );
          if (configured.length === 0) return null;

          const grouped = configured.reduce((acc, s) => {
            const key = `${s.operator}|${s.value}|${s.batchID}`;
            if (!acc[key]) {
              acc[key] = {
                operator: s.operator,
                value: s.value,
                batchID: s.batchID,
                services: [],
              };
            }
            acc[key].services.push({
              serviceID: s.serviceID,
              serviceName: s.serviceName,
            });
            return acc;
          }, {});

          const rows = Object.values(grouped);
          const operatorLabel = (op, val) => {
            if (op === "+") return `+ ${val} (flat add)`;
            if (op === "-") return `− ${val} (flat subtract)`;
            if (op === "*")
              return `× ${(1 + val / 100).toFixed(2)} (${val}% markup)`;
            if (op === "/")
              return `× ${(1 - val / 100).toFixed(2)} (${val}% discount)`;
            return `${op} ${val}`;
          };

          return (
            <section className="fee-inflation-rules-card">
              <div className="fee-inflation-card-header">
                <div className="fee-inflation-card-title">
                  <span className="fee-inflation-card-icon">
                    <i className="ri-settings-3-line"></i>
                  </span>
                  <div>
                    <h2>Configured Inflation Rules</h2>
                    <p>
                      Review existing service adjustments and remove rules when
                      required.
                    </p>
                  </div>
                </div>
                <span className="fee-inflation-rule-count">
                  {rows.length} {rows.length === 1 ? "rule" : "rules"}
                </span>
              </div>

              <div className="fee-inflation-table-scroll">
                <table className="fee-inflation-table">
                  <thead>
                    <tr>
                      <th>Inflation Rule</th>
                      <th>Services</th>
                      {canManageFeeInflation && (
                        <th className="fee-inflation-actions-heading">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={`${row.operator}|${row.value}|${row.batchID}`}>
                        <td>
                          <div className="fee-inflation-rule-cell">
                            <span className="fee-inflation-rule-icon">
                              {row.operator}
                            </span>
                            <code>
                              {operatorLabel(row.operator, row.value)}
                            </code>
                          </div>
                        </td>
                        <td>
                          <div className="fee-inflation-service-tags">
                            {row.services.map((svc) => (
                              <span
                                key={svc.serviceID}
                                className="fee-inflation-service-tag"
                              >
                                {svc.serviceName}
                              </span>
                            ))}
                          </div>
                        </td>
                        {canManageFeeInflation && (
                          <td className="fee-inflation-actions-cell">
                            <button
                              type="button"
                              className="fee-inflation-delete-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#ConfirmModel"
                              onClick={() =>
                                setModelRequestData({
                                  Action: "DeleteServiceFeeInflationRule",
                                  batchID: row.batchID,
                                  serviceIDs: row.services.map(
                                    (s) => s.serviceID,
                                  ),
                                  message:
                                    "This will delete the inflation rule. Are you sure?",
                                })
                              }
                            >
                              <i className="ri-delete-bin-5-fill"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        <ConfirmModel
          openSuccessModal={openSuccessModal}
          modelRequestData={modelRequestData}
          setModelRequestData={setModelRequestData}
          UpdatedStatus={
            modelRequestData.Action === "DeleteServiceFeeInflationRule"
              ? DeleteServiceFeeInflationConfig
              : null
          }
        />
        <SuccessModal
          handleClose={handleClose}
          setDismissModal={setDismissModal}
          setOpenSuccessModal={setOpenSuccessModal}
          openSuccessModal={openSuccessModal}
          modelAction={"Update"}
          message={"Fee inflation"}
        />
      </div>
    </div>
  );
};

export default FeeInflationView;
