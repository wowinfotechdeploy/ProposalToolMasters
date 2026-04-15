import React, { useState } from "react";
import { servicePackageTypeID } from "../Middleware/enums";
import { Tooltip } from "@mui/material";
import { FormatOverlineSharp } from "@mui/icons-material";

const PricingTableTemplatesModal = ({
  show,
  onHide,
  setSelectedTemplateID,
  selectedTemplateID,
  selectedRecurringServiceList,
  setSelectedRecurringServiceList,
  RecurringPricingInfo,
  ProposalObject,
  formatValue,
  vatPercentage,
  serviceTypeID: requestedServiceTypeID,
  setSelectedTemplateIDOneOff,
  selectedTemplateIDOneOff,
  selectedOneOffServiceList,
  OneOffPricingInfo,
  selectedPackagesList,
  getValidationMessage,
  requireMessage,
  pricingSettingObj,
  setSelectedOneOffServiceList,
  hasHyphenAfterNumber,
  GetSingleDefaultDiscountPercentageOfPackages,
  setRecurringPricingInfo,
  setRecurringFrequencyPricingInfo,
  RecurringFrequencyPricingInfo,
  OneOffPricingInfoCopy,
  setOneOffPricingInfoCopy,
  setOneOffPricingInfo,
  setVisibleFieldsCustomTemp,
  visibleFieldsCustomTemp,
  vatPercentageOneOff,
  currencyID,
  taxName,
  currencySymbol,
}) => {
  const [totalOnePackageValue, setTotalOnePackageValue] = useState(0);
  const [totalTwoPackageValue, setTotalTwoPackageValue] = useState(0);
  const [totalThreePackageValue, setTotalThreePackageValue] = useState(0);
  const [totalOnePackageValueOneOff, setTotalOnePackageValueOneOff] =
    useState(0);
  const [totalTwoPackageValueOneOff, setTotalTwoPackageValueOneOff] =
    useState(0);
  const [totalThreePackageValueOneOff, setTotalThreePackageValueOneOff] =
    useState(0);
  // const REQUIRED_COLUMNS = ["serviceName", "fees"];
  // const [templateType, setTemplateType] = useState("default");

  // Selected checkboxes for custom template
  // const [selectedColumns, setSelectedColumns] = useState([...REQUIRED_COLUMNS]);

  const handleCheckboxChange = (field) => {
    setVisibleFieldsCustomTemp((prev) => {
      const next = { ...prev, [field]: !prev[field] };
      console.log(
        "Custom Template, line 61, visibleFieldsCustomTemp",
        next,
      );
      return next;
    });
  };

  // ✅ Rendering helper for field visibility
  // const renderField = (field, content) => {
  //   return visibleFieldsCustomTemp[field] ? <div className="mb-1">{content}</div> : null;
  // };

  if (!show) return null;

  const hasRecurringServices = Array.isArray(selectedRecurringServiceList)
    ? selectedRecurringServiceList.some(
        (service) => (service?.servicesList || []).length > 0,
      )
    : false;
  const hasOneOffServices = Array.isArray(selectedOneOffServiceList)
    ? selectedOneOffServiceList.some(
        (service) => (service?.servicesList || []).length > 0,
      )
    : false;

  const isServiceContext =
    requestedServiceTypeID === servicePackageTypeID.RecurringServiceTypeID ||
    requestedServiceTypeID === servicePackageTypeID.OneOffServiceTypeID;

  const recurringPreviewType = isServiceContext
    ? servicePackageTypeID.RecurringServiceTypeID
    : servicePackageTypeID.RecurringPackageTypeID;
  const oneOffPreviewType = isServiceContext
    ? servicePackageTypeID.OneOffServiceTypeID
    : servicePackageTypeID.OneOffPackageTypeID;

  const previewServiceTypeID = hasRecurringServices
    ? recurringPreviewType
    : hasOneOffServices
      ? oneOffPreviewType
      : requestedServiceTypeID || recurringPreviewType;

  const serviceTypeID = previewServiceTypeID;
  const previewTableLabel =
    previewServiceTypeID === servicePackageTypeID.RecurringServiceTypeID ||
    previewServiceTypeID === servicePackageTypeID.RecurringPackageTypeID
      ? "Recurring Table"
      : "One-Off Table";
  const globalSelectedTemplateID =
    selectedTemplateID === 6 || selectedTemplateIDOneOff === 6 ? 6 : 0;
  const setGlobalTemplateSelection = (templateID) => {
    setSelectedTemplateID(templateID);
    setSelectedTemplateIDOneOff(templateID);
  };

  console.log(
    "Custom Template, line 76, visibleFieldsCustomTemp",
    visibleFieldsCustomTemp,
  );

  const packageCount = selectedPackagesList.length;

  const handlePackageThreeDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageThree,
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )

    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      InputValue,
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handlePackageTwoDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageThree,
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const checkAllPackageDiscountPercentageValidation = (
    discountPercentage,
    CurrentValue,
  ) => {
    // Allow only numeric, dot, and negative sign characters and limit to 8 characters
    let sanitizedInput = discountPercentage
      .replace(/[^0-9.-]/g, "")
      .slice(0, 8);

    // Ensure the input is properly formatted with a hyphen if necessary
    sanitizedInput = hasHyphenAfterNumber(sanitizedInput);

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedInput.split(".");

    // Combine integer and decimal parts with appropriate precision
    let formattedInput;

    // Check if the input is within the valid range
    if (
      sanitizedInput === "-" ||
      (parseFloat(sanitizedInput) >= -999.0 &&
        parseFloat(sanitizedInput) <= 100)
    ) {
      if (decimalPart !== undefined) {
        if (integerPart.includes("-")) {
          // For negative values, ensure 4 digits after the negative sign
          formattedInput = `-${integerPart.slice(1, 4)}.${decimalPart.slice(
            0,
            2,
          )}`;
        } else {
          // For positive values, limit to 4 digits before the decimal point
          formattedInput = `${integerPart.slice(0, 3)}.${decimalPart.slice(
            0,
            2,
          )}`;
        }
      } else {
        // No decimal part, limit to 4 digits
        formattedInput = integerPart.includes("-")
          ? `-${integerPart.slice(1, 4)}`
          : `${integerPart.slice(0, 3)}`;
      }
      return formattedInput === undefined
        ? sanitizedInput === ""
          ? ""
          : CurrentValue
        : formattedInput;
    }
    return formattedInput === undefined
      ? sanitizedInput === ""
        ? ""
        : CurrentValue
      : formattedInput;
  };

  const handleAddAndRemoveAdditionalServices = (
    serviceType,
    serviceCatID,
    serviceID,
    packageID,
    isChecked,
  ) => {
    if (serviceType === 1) {
      setSelectedRecurringServiceList((prevServices) =>
        prevServices.map((category) =>
          category.serviceCatID === serviceCatID
            ? {
                ...category,
                servicesList: category.servicesList.map((service) =>
                  service.serviceID === serviceID
                    ? {
                        ...service,
                        servicePackageIDs: isChecked
                          ? [...service.servicePackageIDs, packageID]
                          : service.servicePackageIDs.filter(
                              (id) => id !== packageID,
                            ),
                      }
                    : service,
                ),
              }
            : category,
        ),
      );
    } else {
      setSelectedOneOffServiceList((prevServices) =>
        prevServices.map((category) =>
          category.serviceCatID === serviceCatID
            ? {
                ...category,
                servicesList: category.servicesList.map((service) =>
                  service.serviceID === serviceID
                    ? {
                        ...service,
                        servicePackageIDs: isChecked
                          ? [...service.servicePackageIDs, packageID]
                          : service.servicePackageIDs.filter(
                              (id) => id !== packageID,
                            ),
                      }
                    : service,
                ),
              }
            : category,
        ),
      );
    }
  };

  const handlePackageOneDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageOne,
    );

    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      RecurringPricingInfo.DiscountPercentagePackageThree,
    );

    setRecurringPricingInfo({
      ...RecurringPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setRecurringFrequencyPricingInfo({
      ...RecurringFrequencyPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageOneDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree,
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageOne: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageTwoDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree,
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageTwo: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  const handleOneOffPackageThreeDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree,
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      InputValue,
    );

    setOneOffPricingInfo({
      ...OneOffPricingInfo,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
    setOneOffPricingInfoCopy({
      ...OneOffPricingInfoCopy,
      DiscountPercentagePackageThree: InputValue,
      DefaultDiscount: DefaultDiscount,
    });
  };

  // console.log("selectedOneOffServiceList", selectedOneOffServiceList);
  // console.log("vatPercentage", vatPercentage);

  const templates = [
    {
      id: 0,
      label: "Default Template",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <th className="tr-table-class text-white">Services</th>
                  <th className="tr-table-class text-white text-right">
                    Fees ({currencySymbol})
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      <tr class="a-la-carte-services-review-head-row">
                        <th colspan="2">{service.serviceCatName}</th>
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        return (
                          <tr key={subIndex}>
                            <td>
                              <div>{subService.serviceName}</div>
                              <div class="package-variables"></div>
                            </td>
                            <td className="text-right">
                              {ProposalObject.feeTypeId === 1 && (
                                <>{formatValue(subService.price, currencyID)}</>
                              )}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td className="tr-table-class text-white text-right">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                      </tr>
                      <tr class="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Discounted Total
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.DiscountedTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage ? (
                  <>
                    <tr class="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        {taxName}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.VATPrice, currencyID)}
                      </td>
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.GrandTotal,
                          currencyID,
                        )}
                      </td>
                    </tr>
                  </>
                ):(
                  ""
                )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignOneOff,
                        }}
                      /> */}
            <table className="table align-middle table-nowrap">
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <th className="tr-table-class text-white">Services</th>
                  <th className="tr-table-class text-white text-right">
                    Fees ({currencySymbol})
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      <tr class="a-la-carte-services-review-head-row">
                        <th colspan="2">{service.serviceCatName}</th>
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        return (
                          <tr key={subIndex}>
                            <td>
                              <div>{subService.serviceName}</div>
                              <div class="package-variables"></div>
                            </td>
                            <td className="text-right">
                              {ProposalObject.feeTypeId === 1 && (
                                <>
                                  {" "}
                                  {formatValue(
                                    subService.price
                                      ? subService.price
                                      : subService.quotationPrice,
                                    currencyID,
                                  )}
                                </>
                              )}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Net Total
                  </td>
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      {" "}
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                      </tr>
                      <tr class="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Discounted Total
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          {"  "}
                          {formatValue(
                            OneOffPricingInfo.DiscountedTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
                {vatPercentage ? (
                  <>
                    <tr class="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        {taxName}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.VATPrice, currencyID)}
                      </td>
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.GrandTotal, currencyID)}
                      </td>
                    </tr>
                  </>
                ):""}
              </tbody>
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.RecurringPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <td
                      key={index}
                      className="tr-table-class font-14 text-white text-right"
                    >
                      {pkg.servicePackageName.length > 10 ? (
                        <Tooltip title={pkg.servicePackageName}>
                          {pkg.servicePackageName
                            .substring(0, 10)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                        </Tooltip>
                      ) : pkg.servicePackageName.length > 10 ? (
                        <Tooltip title={pkg.servicePackageName}>
                          {pkg.servicePackageName.substring(0, 10) + "..."}
                        </Tooltip>
                      ) : (
                        pkg.servicePackageName
                      )}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                      </tr>
                      {service.servicesList.map((subService, subIndex) => (
                        <tr
                          key={subIndex}
                          className={` ${
                            subService?.isAdditionalService !== null
                              ? "bg-info  text-white"
                              : ""
                          }`}
                        >
                          <td>
                            <div>
                              {subService.serviceName.length > 45 ? (
                                <Tooltip title={subService.serviceName}>
                                  {subService.serviceName
                                    .substring(0, 45)
                                    .toLowerCase()
                                    .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                    "..."}
                                </Tooltip>
                              ) : (
                                subService.serviceName
                              )}
                            </div>
                            <div className="package-variables"></div>
                          </td>

                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div>
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {packageCount >= 2 && (
                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div className="flex-end-item">
                                    {(subService.packageTwoValue === 0 ||
                                      subService.packageTwoValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[1]
                                          .servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageTwoValue,
                                        currencyID,
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageTwoValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageTwoID,
                                  ) ? (
                                  <span className="fa fa-check"></span>
                                ) : (
                                  <span className="fa fa-times"></span>
                                )}
                                {subService?.isAdditionalService !== null ? (
                                  <input
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                    type="checkbox"
                                    disabled={
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageTwoID,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
                          )}
                          {packageCount === 3 && (
                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div className="flex-end-item">
                                    {(subService.packageThreeValue === 0 ||
                                      subService.packageThreeValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[2]
                                          .servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageThreeValue,
                                        currencyID,
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageThreeValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageThreeID,
                                  ) ? (
                                  <span className="fa fa-check"></span>
                                ) : (
                                  <span className="fa fa-times"></span>
                                )}
                                {subService?.isAdditionalService !== null ? (
                                  <input
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                    type="checkbox"
                                    disabled={
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageThreeID,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={RecurringPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handlePackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            RecurringPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <td
                        style={{
                          width: "35%",
                          padding: "0px",
                          whiteSpace: "normal",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            className="input-text"
                            type="text"
                            placeholder="Discount (%)"
                            value={RecurringPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ",",
                            )}
                            onChange={(e) => {
                              handlePackageTwoDiscountPercentage(e);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "right",
                            }}
                          />
                          <div>
                            {getValidationMessage(
                              requireMessage,
                              pricingSettingObj.maxDiscountForQC,
                              RecurringPricingInfo.DiscountPercentagePackageTwo,
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {packageCount === 3 && (
                      <td
                        style={{
                          width: "35%",
                          padding: "0px",
                          whiteSpace: "normal",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            className="input-text"
                            type="text"
                            placeholder="Discount (%)"
                            value={RecurringPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ",",
                            )}
                            onChange={(e) => {
                              handlePackageThreeDiscountPercentage(e);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "right",
                            }}
                          />
                          <div>
                            {getValidationMessage(
                              requireMessage,
                              pricingSettingObj.maxDiscountForQC,
                              RecurringPricingInfo.DiscountPercentagePackageThree,
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValue >
                    Number(RecurringPricingInfo.packageOneNetTotal) ||
                  (Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalOnePackageValue, currencyID)
                    : formatValue(
                        RecurringPricingInfo.packageOneNetTotal,
                        currencyID,
                      )}
                </td>
                {packageCount >= 2 && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalTwoPackageValue >
                      Number(RecurringPricingInfo.packageTwoNetTotal) ||
                    (Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines
                        ? formatValue(
                            RecurringPricingInfo.packageTwoDisCountedTotal,
                            currencyID,
                          )
                        : formatValue(totalTwoPackageValue, currencyID)
                      : formatValue(
                          RecurringPricingInfo.packageTwoNetTotal,
                          currencyID,
                        )}
                  </td>
                )}{" "}
                {packageCount === 3 && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalThreePackageValue >
                      Number(RecurringPricingInfo.packageThreeNetTotal) ||
                    (Number(RecurringPricingInfo.packageThreeDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? Number(RecurringPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines
                        ? formatValue(
                            RecurringPricingInfo.packageThreeDisCountedTotal,
                            currencyID,
                          )
                        : formatValue(totalThreePackageValue, currencyID)
                      : formatValue(
                          RecurringPricingInfo.packageThreeNetTotal,
                          currencyID,
                        )}
                  </td>
                )}
              </tr>

              {(Number(RecurringPricingInfo.packageThreeDisCount) > 0 ||
                Number(RecurringPricingInfo.packageOneDisCount) > 0 ||
                Number(RecurringPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            RecurringPricingInfo.packageTwoDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                      {packageCount === 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            RecurringPricingInfo.packageThreeDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>

                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.packageTwoDisCountedTotal,
                            currencyID,
                          )}
                        </td>
                      )}
                      {packageCount === 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.packageThreeDisCountedTotal,
                            currencyID,
                          )}
                        </td>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage ? (
                <>
                  <tr class="head-grey-row">
                    <td className="tr-table-class font-14 text-white">
                      {taxName}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageOneVaTPrice,
                        currencyID,
                      )}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageTwoVaTPrice,
                          currencyID,
                        )}
                      </td>
                    )}
                    {packageCount === 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageThreeVaTPrice,
                          currencyID,
                        )}
                      </td>
                    )}
                  </tr>
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageTwoGrandTotal,
                          currencyID,
                        )}
                      </td>
                    )}
                    {packageCount == 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageThreeGrandTotal,
                          currencyID,
                        )}
                      </td>
                    )}
                  </tr>
                </>
              ):""}
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                                    dangerouslySetInnerHTML={{
                                      __html: currentPricingTableDesignOneOff,
                                    }}
                                  /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <td
                      key={index}
                      className="tr-table-class font-14 text-white text-right"
                    >
                      {pkg.servicePackageName.length > 10 ? (
                        <Tooltip title={pkg.servicePackageName}>
                          {pkg.servicePackageName
                            .substring(0, 10)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                        </Tooltip>
                      ) : pkg.servicePackageName.length > 10 ? (
                        <Tooltip title={pkg.servicePackageName}>
                          {pkg.servicePackageName.substring(0, 10) + "..."}
                        </Tooltip>
                      ) : (
                        pkg.servicePackageName
                      )}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                      </tr>
                      {service.servicesList.map((subService, subIndex) => (
                        <tr
                          key={subIndex}
                          className={` ${
                            subService?.isAdditionalService !== null
                              ? "bg-info  text-white"
                              : ""
                          }`}
                        >
                          <td>
                            <div>
                              {subService.serviceName.length > 45
                                ? subService.serviceName
                                    .substring(0, 45)
                                    .toLowerCase()
                                    .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                  "..."
                                : subService.serviceName}
                            </div>
                            <div className="package-variables"></div>
                          </td>

                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div className="flex-end-item">
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0]?.servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  type="checkbox"
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      2,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {packageCount >= 2 && (
                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div className="flex-end-item">
                                    {(subService.packageTwoValue === 0 ||
                                      subService.packageTwoValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[1]
                                          ?.servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageTwoValue,
                                        currencyID,
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageTwoValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageTwoID,
                                  ) ? (
                                  <span className="fa fa-check"></span>
                                ) : (
                                  <span className="fa fa-times"></span>
                                )}
                                {subService?.isAdditionalService !== null ? (
                                  <input
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                    type="checkbox"
                                    disabled={
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        2,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageTwoID,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
                          )}
                          {packageCount === 3 && (
                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div className="flex-end-item">
                                    {(subService.packageThreeValue === 0 ||
                                      subService.packageThreeValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[2]
                                          ?.servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageThreeValue,
                                        currencyID,
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageThreeValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageThreeID,
                                  ) ? (
                                  <span className="fa fa-check"></span>
                                ) : (
                                  <span className="fa fa-times"></span>
                                )}
                                {subService?.isAdditionalService !== null ? (
                                  <input
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                    type="checkbox"
                                    disabled={
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        2,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageThreeID,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="OneOff_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>
                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={OneOffPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handleOneOffPackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            OneOffPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <td
                        style={{
                          width: "35%",
                          padding: "0px",
                          whiteSpace: "normal",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            className="input-text"
                            type="text"
                            placeholder="Discount (%)"
                            value={OneOffPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ",",
                            )}
                            onChange={(e) => {
                              handleOneOffPackageTwoDiscountPercentage(e);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "right",
                            }}
                          />
                          <div>
                            {getValidationMessage(
                              requireMessage,
                              pricingSettingObj.maxDiscountForQC,
                              OneOffPricingInfo.DiscountPercentagePackageTwo,
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {packageCount === 3 && (
                      <td
                        style={{
                          width: "35%",
                          padding: "0px",
                          whiteSpace: "normal",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            className="input-text"
                            type="text"
                            placeholder="Discount (%)"
                            value={OneOffPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ",",
                            )}
                            onChange={(e) => {
                              handleOneOffPackageThreeDiscountPercentage(e);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "right",
                            }}
                          />
                          <div>
                            {getValidationMessage(
                              requireMessage,
                              pricingSettingObj.maxDiscountForQC,
                              OneOffPricingInfo.DiscountPercentagePackageThree,
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValueOneOff <
                    Number(OneOffPricingInfo.packageOneDisCountedTotal) ||
                  (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? formatValue(
                        OneOffPricingInfo.packageOneDisCountedTotal,
                        currencyID,
                      )
                    : formatValue(totalOnePackageValueOneOff, currencyID)}
                </td>
                {packageCount >= 2 && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalTwoPackageValueOneOff <
                      Number(OneOffPricingInfo.packageTwoDisCountedTotal) ||
                    (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.packageTwoDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalTwoPackageValueOneOff, currencyID)}
                  </td>
                )}{" "}
                {packageCount === 3 && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalThreePackageValueOneOff <
                      Number(OneOffPricingInfo.packageThreeDisCountedTotal) ||
                    (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.packageThreeDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalThreePackageValueOneOff, currencyID)}
                  </td>
                )}
              </tr>

              {(Number(OneOffPricingInfo.packageThreeDisCount) > 0 ||
                Number(OneOffPricingInfo.packageOneDisCount) > 0 ||
                Number(OneOffPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            OneOffPricingInfo.packageTwoDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                      {packageCount == 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            OneOffPricingInfo.packageThreeDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.packageTwoDisCountedTotal,
                            currencyID,
                          )}
                        </td>
                      )}
                      {packageCount == 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.packageThreeDisCountedTotal,
                            currencyID,
                          )}
                        </td>
                      )}
                    </tr>
                  </>
                )}
              {vatPercentageOneOff ? (
                <>
                  <tr class="head-grey-row">
                    <td className="tr-table-class font-14 text-white">
                      {taxName}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        OneOffPricingInfo.PackageOneVaTPrice,
                        currencyID,
                      )}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.PackageTwoVaTPrice,
                          currencyID,
                        )}
                      </td>
                    )}
                    {packageCount === 3 && (
                      <td className="tr-table-class text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.PackageThreeVaTPrice,
                          currencyID,
                        )}
                      </td>
                    )}
                  </tr>
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        OneOffPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.PackageTwoGrandTotal,
                          currencyID,
                        )}
                      </td>
                    )}
                    {packageCount == 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.PackageThreeGrandTotal,
                          currencyID,
                        )}
                      </td>
                    )}
                  </tr>
                </>
              ):""}
            </table>
          </div>
        ) : (
          ""
        ),
    },
    {
      id: 1,
      label: "Template 1",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service Category
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      {service.servicesList.map((subService, subIndex) => {
                        const price = subService.price || 0;
                        const vat = (price * 20) / 100;
                        const total = price + vat;

                        return (
                          <tr key={`sub-${index}-${subIndex}`}>
                            <td className="text-center">
                              {service.serviceCatName}
                            </td>
                            <td className="text-center">
                              {subService.serviceName}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(price, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  <td></td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  RecurringPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(RecurringPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  RecurringPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(RecurringPricingInfo.DiscountedPrice) +
                            (Number(RecurringPricingInfo.DiscountedPrice) *
                              20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) +
                                  (Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        RecurringPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                RecurringPricingInfo.DiscountedPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service Category
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      {service.servicesList.map((subService, subIndex) => {
                        const price = subService.price || 0;
                        const vat = (price * 20) / 100;
                        const total = price + vat;

                        return (
                          <tr key={`sub-${index}-${subIndex}`}>
                            <td className="text-center">
                              {service.serviceCatName}
                            </td>
                            <td className="text-center">
                              {subService.serviceName}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(price, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  <td></td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  OneOffPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  OneOffPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(OneOffPricingInfo.DiscountedPrice) +
                            (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>

                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) +
                                  (Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          OneOffPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                OneOffPricingInfo.DiscountedPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.RecurringPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                                 dangerouslySetInnerHTML={{
                                   __html: currentPricingTableDesignRecurring,
                                 }}
                               /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {taxName} ({currencySymbol})
                      </td>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                        <th></th>
                        {packageCount >= 2 && <th></th>}
                        {packageCount === 3 && <th></th>}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => (
                        <tr
                          key={subIndex}
                          className={` ${
                            subService?.isAdditionalService !== null
                              ? "bg-info  text-white"
                              : ""
                          }`}
                        >
                          <td>
                            <div>
                              {subService.serviceName.length > 45 ? (
                                <Tooltip title={subService.serviceName}>
                                  {subService.serviceName
                                    .substring(0, 45)
                                    .toLowerCase()
                                    .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                    "..."}
                                </Tooltip>
                              ) : (
                                subService.serviceName
                              )}
                            </div>
                            <div className="package-variables"></div>
                          </td>

                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div>
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {/* VAT Rate column with 20% */}
                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div>
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      (subService.packageOneValue * 20) / 100,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {packageCount >= 2 && (
                            <>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[1]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageTwoValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[1]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageTwoValue * 20) /
                                            100,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                          {packageCount === 3 && (
                            <>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue ===
                                          null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[2]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageThreeValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue ===
                                          null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[2]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageThreeValue * 20) /
                                            100,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={RecurringPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handlePackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            RecurringPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValue >
                    Number(RecurringPricingInfo.packageOneNetTotal) ||
                  (Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalOnePackageValue, currencyID)
                    : formatValue(
                        RecurringPricingInfo.packageOneNetTotal,
                        currencyID,
                      )}
                </td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {formatValue(
                    RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout,
                    currencyID,
                  )}
                </td>
                {packageCount >= 2 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalTwoPackageValue >
                        Number(RecurringPricingInfo.packageTwoNetTotal) ||
                      (Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalTwoPackageValue, currencyID)
                        : formatValue(
                            RecurringPricingInfo.packageTwoNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout,
                        currencyID,
                      )}
                    </td>
                  </>
                )}{" "}
                {packageCount === 3 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalThreePackageValue >
                        Number(RecurringPricingInfo.packageThreeNetTotal) ||
                      (Number(RecurringPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(RecurringPricingInfo.packageThreeDisCount) >
                            0 && !ProposalObject.DiscountLines
                          ? formatValue(
                              RecurringPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalThreePackageValue, currencyID)
                        : formatValue(
                            RecurringPricingInfo.packageThreeNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout,
                        currencyID,
                      )}
                    </td>
                  </>
                )}
              </tr>

              {(Number(RecurringPricingInfo.packageThreeDisCount) > 0 ||
                Number(RecurringPricingInfo.packageOneDisCount) > 0 ||
                Number(RecurringPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                            RecurringPricingInfo.DiscountPercentagePackageOne) /
                            100,
                          currencyID,
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCount,
                              currencyID,
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                100,
                              currencyID,
                            )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCount,
                              currencyID,
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                RecurringPricingInfo.DiscountPercentagePackageThree) /
                                100,
                              currencyID,
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout -
                            (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                              RecurringPricingInfo.DiscountPercentagePackageOne) /
                              100,
                          currencyID,
                        )}
                      </td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                  RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                  100,
                              currencyID,
                            )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                  RecurringPricingInfo.DiscountPercentagePackageThree) /
                                  100,
                              currencyID,
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage !== null && (
                <>
                  {/* <tr class="head-grey-row">
                                         <td className="tr-table-class font-14 text-white">
                                           VAT
                                         </td>
                                         <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {formatValue(
                                             RecurringPricingInfo
                                               .PackageOneVaTPrice
                                           )}
                                         </td>
                                         {packageCount >= 2 && (
                                           <td className="tr-table-class font-14 text-white text-right">
                                             {" "}
                                             {formatValue(
                                               RecurringPricingInfo
                                                 .PackageTwoVaTPrice
                                             )}
                                           </td>
                                         )}
                                         {packageCount === 3 && (
                                           <td className="tr-table-class font-14 text-white text-right">
                                             {" "}
                                             {formatValue(
                                               RecurringPricingInfo
                                                 .PackageThreeVaTPrice
                                             )}
                                           </td>
                                         )}
                                       </tr> */}
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Fees inc {taxName} ({currencySymbol})
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageTwoGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageThreeGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                </>
              )}
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                               dangerouslySetInnerHTML={{
                                 __html: currentPricingTableDesignRecurring,
                               }}
                             /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {taxName} ({currencySymbol})
                      </td>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                        <th></th>
                        {packageCount >= 2 && <th></th>}
                        {packageCount === 3 && <th></th>}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => (
                        <tr
                          key={subIndex}
                          className={` ${
                            subService?.isAdditionalService !== null
                              ? "bg-info  text-white"
                              : ""
                          }`}
                        >
                          <td>
                            <div>
                              {subService.serviceName.length > 45 ? (
                                <Tooltip title={subService.serviceName}>
                                  {subService.serviceName
                                    .substring(0, 45)
                                    .toLowerCase()
                                    .replace(/\b\w/g, (l) => l.toUpperCase()) +
                                    "..."}
                                </Tooltip>
                              ) : (
                                subService.serviceName
                              )}
                            </div>
                            <div className="package-variables"></div>
                          </td>

                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div>
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {/* VAT Rate column with 20% */}
                          <td className="text-right">
                            <div className="flex-end-item">
                              {ProposalObject.feeTypeId === 1 ? (
                                <div>
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      (subService.packageOneValue * 20) / 100,
                                      currencyID,
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID,
                                ) ? (
                                <span className="fa fa-check"></span>
                              ) : (
                                <span className="fa fa-times"></span>
                              )}
                              {subService?.isAdditionalService !== null ? (
                                <input
                                  style={{ marginLeft: "5px" }}
                                  disabled={
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID,
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked,
                                    )
                                  }
                                />
                              ) : (
                                <div>&nbsp;&nbsp;</div>
                              )}
                            </div>
                          </td>
                          {packageCount >= 2 && (
                            <>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[1]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageTwoValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[1]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageTwoValue * 20) /
                                            100,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                          {packageCount === 3 && (
                            <>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue ===
                                          null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[2]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageThreeValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div className="flex-end-item">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue ===
                                          null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[2]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageThreeValue * 20) /
                                            100,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      type="checkbox"
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={OneOffPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handleOneOffPackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            OneOffPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                {/* p1 net total */}
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValueOneOff >
                    Number(OneOffPricingInfo.packageOneNetTotal) ||
                  (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          OneOffPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalOnePackageValueOneOff, currencyID)
                    : formatValue(
                        OneOffPricingInfo.packageOneNetTotal,
                        currencyID,
                      )}
                </td>

                {/* p1 vat */}
                <td className="tr-table-class font-14 text-white text-right">
                  {totalOnePackageValueOneOff >
                    Number(OneOffPricingInfo.packageOneNetTotal) ||
                  (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          (OneOffPricingInfo.packageOneDisCountedTotal * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (totalOnePackageValueOneOff * 20) / 100,
                          currencyID,
                        )
                    : formatValue(
                        (OneOffPricingInfo.packageOneNetTotal * 20) / 100,
                        currencyID,
                      )}
                </td>

                {/* p2 net total and vat */}
                {packageCount >= 2 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {totalTwoPackageValueOneOff >
                        Number(OneOffPricingInfo.packageTwoNetTotal) ||
                      (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalTwoPackageValueOneOff, currencyID)
                        : formatValue(
                            OneOffPricingInfo.packageTwoNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {totalTwoPackageValueOneOff >
                        Number(OneOffPricingInfo.packageTwoNetTotal) ||
                      (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              (OneOffPricingInfo.packageTwoDisCountedTotal *
                                20) /
                                100,
                              currencyID,
                            )
                          : formatValue(
                              (totalTwoPackageValueOneOff * 20) / 100,
                              currencyID,
                            )
                        : formatValue(
                            (OneOffPricingInfo.packageTwoNetTotal * 20) / 100,
                            currencyID,
                          )}
                    </td>
                  </>
                )}
                {packageCount === 3 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalThreePackageValueOneOff >
                        Number(OneOffPricingInfo.packageThreeNetTotal) ||
                      (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(
                              totalThreePackageValueOneOff,
                              currencyID,
                            )
                        : formatValue(
                            OneOffPricingInfo.packageThreeNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {totalThreePackageValueOneOff >
                        Number(OneOffPricingInfo.packageThreeNetTotal) ||
                      (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              (OneOffPricingInfo.packageThreeDisCountedTotal *
                                20) /
                                100,
                              currencyID,
                            )
                          : formatValue(
                              (totalThreePackageValueOneOff * 20) / 100,
                              currencyID,
                            )
                        : formatValue(
                            (OneOffPricingInfo.packageThreeNetTotal * 20) / 100,
                            currencyID,
                          )}
                    </td>
                  </>
                )}
              </tr>

              {/* Discounts */}

              {(Number(OneOffPricingInfo.packageThreeDisCount) > 0 ||
                Number(OneOffPricingInfo.packageOneDisCount) > 0 ||
                Number(OneOffPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      {/* VAT Discount */}
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {totalOnePackageValueOneOff >
                          Number(OneOffPricingInfo.packageOneNetTotal) ||
                        (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                            !ProposalObject.DiscountLines
                            ? formatValue(
                                (((OneOffPricingInfo.packageOneDisCountedTotal *
                                  20) /
                                  100) *
                                  OneOffPricingInfo.DiscountPercentagePackageOne) /
                                  100,
                                currencyID,
                              )
                            : formatValue(
                                (((totalOnePackageValueOneOff * 20) / 100) *
                                  OneOffPricingInfo.DiscountPercentagePackageOne) /
                                  100,
                                currencyID,
                              )
                          : formatValue(
                              (((OneOffPricingInfo.packageOneNetTotal * 20) /
                                100) *
                                OneOffPricingInfo.DiscountPercentagePackageOne) /
                                100,
                              currencyID,
                            )}
                      </td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageTwoDisCount,
                              currencyID,
                            )}
                          </td>

                          {/* VAT Discount */}
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {totalTwoPackageValueOneOff >
                              Number(OneOffPricingInfo.packageTwoNetTotal) ||
                            (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                              !ProposalObject.DiscountLines)
                              ? Number(OneOffPricingInfo.packageOneDisCount) >
                                  0 && !ProposalObject.DiscountLines
                                ? formatValue(
                                    (((OneOffPricingInfo.packageTwoDisCountedTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                      100,
                                    currencyID,
                                  )
                                : formatValue(
                                    (((totalTwoPackageValueOneOff * 20) / 100) *
                                      OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                      100,
                                    currencyID,
                                  )
                              : formatValue(
                                  (((OneOffPricingInfo.packageTwoNetTotal *
                                    20) /
                                    100) *
                                    OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                    100,
                                  currencyID,
                                )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCount,
                              currencyID,
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {totalThreePackageValueOneOff >
                              Number(OneOffPricingInfo.packageThreeNetTotal) ||
                            (Number(OneOffPricingInfo.packageThreeDisCount) >
                              0 &&
                              !ProposalObject.DiscountLines)
                              ? Number(OneOffPricingInfo.packageThreeDisCount) >
                                  0 && !ProposalObject.DiscountLines
                                ? formatValue(
                                    (((OneOffPricingInfo.packageThreeDisCountedTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageThree) /
                                      100,
                                    currencyID,
                                  )
                                : formatValue(
                                    (((totalThreePackageValueOneOff * 20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageThree) /
                                      100,
                                    currencyID,
                                  )
                              : formatValue(
                                  (((OneOffPricingInfo.packageThreeNetTotal *
                                    20) /
                                    100) *
                                    OneOffPricingInfo.DiscountPercentagePackageThree) /
                                    100,
                                  currencyID,
                                )}
                          </td>
                        </>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalOnePackageValueOneOff >
                          Number(OneOffPricingInfo.packageOneNetTotal) ||
                        (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                            !ProposalObject.DiscountLines
                            ? formatValue(
                                (OneOffPricingInfo.packageOneDisCountedTotal *
                                  20) /
                                  100 -
                                  (((OneOffPricingInfo.packageOneDisCountedTotal *
                                    20) /
                                    100) *
                                    OneOffPricingInfo.DiscountPercentagePackageOne) /
                                    100,
                                currencyID,
                              )
                            : formatValue(
                                (totalOnePackageValueOneOff * 20) / 100 -
                                  (((totalOnePackageValueOneOff * 20) / 100) *
                                    OneOffPricingInfo.DiscountPercentagePackageOne) /
                                    100,
                                currencyID,
                              )
                          : formatValue(
                              (OneOffPricingInfo.packageOneNetTotal * 20) /
                                100 -
                                (((OneOffPricingInfo.packageOneNetTotal * 20) /
                                  100) *
                                  OneOffPricingInfo.DiscountPercentagePackageOne) /
                                  100,
                              currencyID,
                            )}
                      </td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {totalTwoPackageValueOneOff >
                              Number(OneOffPricingInfo.packageTwoNetTotal) ||
                            (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                              !ProposalObject.DiscountLines)
                              ? Number(OneOffPricingInfo.packageOneDisCount) >
                                  0 && !ProposalObject.DiscountLines
                                ? formatValue(
                                    (OneOffPricingInfo.packageTwoDisCountedTotal *
                                      20) /
                                      100 -
                                      (((OneOffPricingInfo.packageTwoDisCountedTotal *
                                        20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                        100,
                                    currencyID,
                                  )
                                : formatValue(
                                    (totalTwoPackageValueOneOff * 20) / 100 -
                                      (((totalTwoPackageValueOneOff * 20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                        100,
                                    currencyID,
                                  )
                              : formatValue(
                                  (OneOffPricingInfo.packageTwoNetTotal * 20) /
                                    100 -
                                    (((OneOffPricingInfo.packageTwoNetTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                      100,
                                  currencyID,
                                )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {totalThreePackageValueOneOff >
                              Number(OneOffPricingInfo.packageThreeNetTotal) ||
                            (Number(OneOffPricingInfo.packageThreeDisCount) >
                              0 &&
                              !ProposalObject.DiscountLines)
                              ? Number(OneOffPricingInfo.packageThreeDisCount) >
                                  0 && !ProposalObject.DiscountLines
                                ? formatValue(
                                    (OneOffPricingInfo.packageThreeDisCountedTotal *
                                      20) /
                                      100 -
                                      (((OneOffPricingInfo.packageThreeDisCountedTotal *
                                        20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageThree) /
                                        100,
                                    currencyID,
                                  )
                                : formatValue(
                                    (totalThreePackageValueOneOff * 20) / 100 -
                                      (((totalThreePackageValueOneOff * 20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageThree) /
                                        100,
                                    currencyID,
                                  )
                              : formatValue(
                                  (OneOffPricingInfo.packageThreeNetTotal *
                                    20) /
                                    100 -
                                    (((OneOffPricingInfo.packageThreeNetTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageThree) /
                                      100,
                                  currencyID,
                                )}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentageOneOff !== null && (
                <>
                  {/* <tr class="head-grey-row">
                                       <td className="tr-table-class font-14 text-white">
                                         VAT
                                       </td>
                                       <td className="tr-table-class font-14 text-white text-right">
                                         {" "}
                                         {formatValue(
                                           OneOffPricingInfo
                                             .PackageOneVaTPrice
                                         )}
                                       </td>
                                       {packageCount >= 2 && (
                                         <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {formatValue(
                                             OneOffPricingInfo
                                               .PackageTwoVaTPrice
                                           )}
                                         </td>
                                       )}
                                       {packageCount === 3 && (
                                         <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {formatValue(
                                             OneOffPricingInfo
                                               .PackageThreeVaTPrice
                                           )}
                                         </td>
                                       )}
                                     </tr> */}
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Fees inc {taxName} ({currencySymbol})
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        OneOffPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageTwoGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageThreeGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                </>
              )}
            </table>
          </div>
        ) : (
          ""
        ),
    },
    {
      id: 2,
      label: "Template 2",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      {service.servicesList.map((subService, subIndex) => {
                        const price = subService.price || 0;
                        const vat = (price * 20) / 100;
                        const total = price + vat;

                        return (
                          <tr key={`sub-${index}-${subIndex}`}>
                            {/* <td className="text-center">
                                              {service.serviceCatName}
                                            </td> */}
                            <td className="text-center">
                              {subService.serviceName}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(price, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            {/* <td></td> */}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>

                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  <td></td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  RecurringPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(RecurringPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  RecurringPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(RecurringPricingInfo.DiscountedPrice) +
                            (Number(RecurringPricingInfo.DiscountedPrice) *
                              20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) +
                                  (Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        RecurringPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>

                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                RecurringPricingInfo.DiscountedPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      {service.servicesList.map((subService, subIndex) => {
                        const price = subService.price || 0;
                        const vat = (price * 20) / 100;
                        const total = price + vat;

                        return (
                          <tr key={`sub-${index}-${subIndex}`}>
                            {/* <td className="text-center">
                                              {service.serviceCatName}
                                            </td> */}
                            <td className="text-center">
                              {subService.serviceName}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(price, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            {/* <td></td> */}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  <td></td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  OneOffPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  OneOffPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(OneOffPricingInfo.DiscountedPrice) +
                            (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) +
                                  (Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          OneOffPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>

                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                OneOffPricingInfo.DiscountedPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        /*
              CHARGE_TYPE: Recurring Package
        */
        ) : serviceTypeID === servicePackageTypeID.RecurringPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                              dangerouslySetInnerHTML={{
                                __html: currentPricingTableDesignRecurring,
                              }}
                            /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        Service Scope
                      </td>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                        <th></th>
                        {packageCount >= 2 && <th></th>}
                        {packageCount === 3 && <th></th>}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const driverList = subService.pricingDriverList || [];
                        return (
                          <tr
                            key={subIndex}
                            className={` ${
                              subService?.isAdditionalService !== null
                                ? "bg-info  text-white"
                                : ""
                            }`}
                          >
                            <td>
                              <div>
                                {subService.serviceName.length > 45 ? (
                                  <Tooltip title={subService.serviceName}>
                                    {subService.serviceName
                                      .substring(0, 45)
                                      .toLowerCase()
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase(),
                                      ) + "..."}
                                  </Tooltip>
                                ) : (
                                  subService.serviceName
                                )}
                              </div>
                              <div className="package-variables"></div>
                            </td>

                            {/* {visibleFieldsCustomTemp.fees && ( */}
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div>
                                      {(subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageOneValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) &&
                                        subService?.servicePackageIDs.length === 1
                                      }
                                      type="checkbox"
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageOneID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            {/* )} */}
                            {/* {(() => { console.log("Heloo 5283 visibleFieldsCustomTemp", visibleFieldsCustomTemp); return null; })()}
                            {(() => { console.log("Heloo 5284 vatPercentageOneOff", vatPercentageOneOff); return null; })()}
                            {(() => { console.log("Heloo 5285 subService", subService); return null; })()}
                            {vatPercentageOneOff !== 0 &&
                              visibleFieldsCustomTemp.vatRate && (
                                <td className="text-right">
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    `${subService.service_vat_percentage ?? 0}%`
                                  )}
                                </td>
                              )} */}
                            {/* Service Scope */}

                            <td className="text-right">
                              {driverList.length > 0
                                ? driverList
                                    .filter((d) => d.driverValue !== null)
                                    .map((d, i, arr) => (
                                      <div key={i}>
                                        {(subService.packageOneValue === 0 ||
                                          subService.packageOneValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[0]
                                              .servicePackageID,
                                        ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageOneID,
                                          ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : (
                                          ` ${d.driverName} =${" "}
                                                              ${d.driverValue}
                                                              ${
                                                                i !==
                                                                arr.length - 1
                                                                  ? ", "
                                                                  : ""
                                                              }`
                                        )}
                                      </div>
                                    ))
                                : "-"}
                            </td>

                            {packageCount >= 2 && (
                              <>
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      <div className="flex-end-item">
                                        {(subService.packageTwoValue === 0 ||
                                          subService.packageTwoValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[1]
                                              .servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue,
                                            currencyID,
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) ? (
                                      <span className="fa fa-check"></span>
                                    ) : (
                                      <span className="fa fa-times"></span>
                                    )}
                                    {subService?.isAdditionalService !==
                                    null ? (
                                      <input
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                        type="checkbox"
                                        disabled={
                                          subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageTwoID,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageTwoValue ===
                                              0 ||
                                              subService.packageTwoValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ==
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageTwoID,
                                              ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} =${" "}
                                                              ${d.driverValue}
                                                              ${
                                                                i !==
                                                                arr.length - 1
                                                                  ? ", "
                                                                  : ""
                                                              }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}
                            {packageCount === 3 && (
                              <>
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      <div className="flex-end-item">
                                        {(subService.packageThreeValue === 0 ||
                                          subService.packageThreeValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[2]
                                              .servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue,
                                            currencyID,
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) ? (
                                      <span className="fa fa-check"></span>
                                    ) : (
                                      <span className="fa fa-times"></span>
                                    )}
                                    {subService?.isAdditionalService !==
                                    null ? (
                                      <input
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                        type="checkbox"
                                        disabled={
                                          subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageThreeID,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageThreeValue ===
                                              0 ||
                                              subService.packageThreeValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ==
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageThreeID,
                                              ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} =${" "}
                                                              ${d.driverValue}
                                                              ${
                                                                i !==
                                                                arr.length - 1
                                                                  ? ", "
                                                                  : ""
                                                              }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={RecurringPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handlePackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            RecurringPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValue >
                    Number(RecurringPricingInfo.packageOneNetTotal) ||
                  (Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalOnePackageValue, currencyID)
                    : formatValue(
                        RecurringPricingInfo.packageOneNetTotal,
                        currencyID,
                      )}
                </td>
                <td></td>
                {packageCount >= 2 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalTwoPackageValue >
                        Number(RecurringPricingInfo.packageTwoNetTotal) ||
                      (Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalTwoPackageValue, currencyID)
                        : formatValue(
                            RecurringPricingInfo.packageTwoNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right"></td>
                  </>
                )}{" "}
                {packageCount === 3 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalThreePackageValue >
                        Number(RecurringPricingInfo.packageThreeNetTotal) ||
                      (Number(RecurringPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(RecurringPricingInfo.packageThreeDisCount) >
                            0 && !ProposalObject.DiscountLines
                          ? formatValue(
                              RecurringPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalThreePackageValue, currencyID)
                        : formatValue(
                            RecurringPricingInfo.packageThreeNetTotal,
                            currencyID,
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right"></td>
                  </>
                )}
              </tr>

              {(Number(RecurringPricingInfo.packageThreeDisCount) > 0 ||
                Number(RecurringPricingInfo.packageOneDisCount) > 0 ||
                Number(RecurringPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right"></td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCount,
                              currencyID,
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right"></td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCount,
                              currencyID,
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right"></td>
                        </>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right"></td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right"></td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right"></td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage !== null && (
                <>
                  {/* <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        VAT
                                      </td>
                                      <td className="tr-table-class font-14 text-white text-right">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo
                                            .PackageOneVaTPrice
                                        )}
                                      </td>
                                      {packageCount >= 2 && (
                                        <td className="tr-table-class font-14 text-white text-right">
                                          {" "}
                                          {formatValue(
                                            RecurringPricingInfo
                                              .PackageTwoVaTPrice
                                          )}
                                        </td>
                                      )}
                                      {packageCount === 3 && (
                                        <td className="tr-table-class font-14 text-white text-right">
                                          {" "}
                                          {formatValue(
                                            RecurringPricingInfo
                                              .PackageThreeVaTPrice
                                          )}
                                        </td>
                                      )}
                                    </tr> */}
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Fees inc {taxName} ({currencySymbol})
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageTwoGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageThreeGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                </>
              )}
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffPackageTypeID ? (
          /*
              CHARGE_TYPE: One Off Package
        */
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {/* <div
                               dangerouslySetInnerHTML={{
                                 __html: currentPricingTableDesignRecurring,
                               }}
                             /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td className="tr-table-class font-14 text-white">
                    Services
                  </td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        Service Scope
                      </td>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        <th colSpan={1 + packageCount}>
                          {service.serviceCatName}
                        </th>
                        <th></th>
                        {packageCount >= 2 && <th></th>}
                        {packageCount === 3 && <th></th>}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const driverList = subService.pricingDriverList || [];
                        return (
                          <tr
                            key={subIndex}
                            className={` ${
                              subService?.isAdditionalService !== null
                                ? "bg-info  text-white"
                                : ""
                            }`}
                          >
                            <td>
                              <div>
                                {subService.serviceName.length > 45 ? (
                                  <Tooltip title={subService.serviceName}>
                                    {subService.serviceName
                                      .substring(0, 45)
                                      .toLowerCase()
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase(),
                                      ) + "..."}
                                  </Tooltip>
                                ) : (
                                  subService.serviceName
                                )}
                              </div>
                              <div className="package-variables"></div>
                            </td>

                            {/* {visibleFieldsCustomTemp.fees && ( */}
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div>
                                      {(subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageOneValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) &&
                                        subService?.servicePackageIDs.length === 1
                                      }
                                      type="checkbox"
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageOneID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            {/* )} */}
{/* 
                            {vatPercentageOneOff !== 0 &&
                              visibleFieldsCustomTemp.vatRate && (
                                <td className="text-right">
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    `${subService.service_vat_percentage ?? 0}%`
                                  )}
                                </td>
                              )} */}
                            {/* Service Scope */}

                            <td className="text-right">
                              {driverList.length > 0
                                ? driverList
                                    .filter((d) => d.driverValue !== null)
                                    .map((d, i, arr) => (
                                      <div key={i}>
                                        {(subService.packageOneValue === 0 ||
                                          subService.packageOneValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[0]
                                              .servicePackageID,
                                        ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageOneID,
                                          ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : (
                                          ` ${d.driverName} =${" "}
                                                               ${d.driverValue}
                                                               ${
                                                                 i !==
                                                                 arr.length - 1
                                                                   ? ", "
                                                                   : ""
                                                               }`
                                        )}
                                      </div>
                                    ))
                                : "-"}
                            </td>

                            {packageCount >= 2 && (
                              <>
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      <div className="flex-end-item">
                                        {(subService.packageTwoValue === 0 ||
                                          subService.packageTwoValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[1]
                                              .servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue,
                                            currencyID,
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID,
                                      ) ? (
                                      <span className="fa fa-check"></span>
                                    ) : (
                                      <span className="fa fa-times"></span>
                                    )}
                                    {subService?.isAdditionalService !==
                                    null ? (
                                      <input
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                        type="checkbox"
                                        disabled={
                                          subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageTwoID,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageTwoValue ===
                                              0 ||
                                              subService.packageTwoValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ==
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageTwoID,
                                              ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} =${" "}
                                                               ${d.driverValue}
                                                               ${
                                                                 i !==
                                                                 arr.length - 1
                                                                   ? ", "
                                                                   : ""
                                                               }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}
                            {packageCount === 3 && (
                              <>
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      <div className="flex-end-item">
                                        {(subService.packageThreeValue === 0 ||
                                          subService.packageThreeValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            selectedPackagesList[2]
                                              .servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue,
                                            currencyID,
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID,
                                      ) ? (
                                      <span className="fa fa-check"></span>
                                    ) : (
                                      <span className="fa fa-times"></span>
                                    )}
                                    {subService?.isAdditionalService !==
                                    null ? (
                                      <input
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                        type="checkbox"
                                        disabled={
                                          subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageThreeID,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageThreeValue ===
                                              0 ||
                                              subService.packageThreeValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ==
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageThreeID,
                                              ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} =${" "}
                                                               ${d.driverValue}
                                                               ${
                                                                 i !==
                                                                 arr.length - 1
                                                                   ? ", "
                                                                   : ""
                                                               }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={OneOffPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handleOneOffPackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            OneOffPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        <td></td>
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}
              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                {/* p1 net total */}
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {totalOnePackageValueOneOff >
                    Number(OneOffPricingInfo.packageOneNetTotal) ||
                  (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(
                          OneOffPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )
                      : formatValue(totalOnePackageValueOneOff, currencyID)
                    : formatValue(
                        OneOffPricingInfo.packageOneNetTotal,
                        currencyID,
                      )}
                </td>

                {/* p1 vat */}
                {/* <td className="tr-table-class font-14 text-white text-right">
                                     {totalOnePackageValueOneOff >
                                       Number(
                                         OneOffPricingInfo.packageOneNetTotal
                                       ) ||
                                     (Number(
                                       OneOffPricingInfo.packageOneDisCount
                                     ) > 0 &&
                                       !ProposalObject.DiscountLines)
                                       ? Number(
                                           OneOffPricingInfo.packageOneDisCount
                                         ) > 0 && !ProposalObject.DiscountLines
                                         ? formatValue(
                                             (OneOffPricingInfo
                                               .packageOneDisCountedTotal *
                                               20) /
                                               100
                                           )
                                         : formatValue(
                                             (totalOnePackageValueOneOff * 20) / 100
                                           )
                                       : formatValue(
                                           (OneOffPricingInfo
                                             .packageOneNetTotal *
                                             20) /
                                             100
                                         )}
                                   </td> */}
                <td></td>

                {/* p2 net total and vat */}
                {packageCount >= 2 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {totalTwoPackageValueOneOff >
                        Number(OneOffPricingInfo.packageTwoNetTotal) ||
                      (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(totalTwoPackageValueOneOff, currencyID)
                        : formatValue(
                            OneOffPricingInfo.packageTwoNetTotal,
                            currencyID,
                          )}
                    </td>
                    {/* <td className="tr-table-class font-14 text-white text-right">
                                         {totalTwoPackageValueOneOff >
                                           Number(
                                             OneOffPricingInfo.packageTwoNetTotal
                                           ) ||
                                         (Number(
                                           OneOffPricingInfo.packageTwoDisCount
                                         ) > 0 &&
                                           !ProposalObject.DiscountLines)
                                           ? Number(
                                               OneOffPricingInfo
                                                 .packageTwoDisCount
                                             ) > 0 &&
                                             !ProposalObject.DiscountLines
                                             ? formatValue(
                                                 (OneOffPricingInfo
                                                   .packageTwoDisCountedTotal *
                                                   20) /
                                                   100
                                               )
                                             : formatValue(
                                                 (totalTwoPackageValueOneOff * 20) /
                                                   100
                                               )
                                           : formatValue(
                                               (OneOffPricingInfo
                                                 .packageTwoNetTotal *
                                                 20) /
                                                 100
                                             )}
                                       </td> */}
                    <td></td>
                  </>
                )}
                {packageCount === 3 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalThreePackageValueOneOff >
                        Number(OneOffPricingInfo.packageThreeNetTotal) ||
                      (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )
                          : formatValue(
                              totalThreePackageValueOneOff,
                              currencyID,
                            )
                        : formatValue(
                            OneOffPricingInfo.packageThreeNetTotal,
                            currencyID,
                          )}
                    </td>
                    {/* <td className="tr-table-class font-14 text-white text-right">
                                         {totalThreePackageValueOneOff >
                                           Number(
                                             OneOffPricingInfo
                                               .packageThreeNetTotal
                                           ) ||
                                         (Number(
                                           OneOffPricingInfo.packageThreeDisCount
                                         ) > 0 &&
                                           !ProposalObject.DiscountLines)
                                           ? Number(
                                               OneOffPricingInfo
                                                 .packageThreeDisCount
                                             ) > 0 &&
                                             !ProposalObject.DiscountLines
                                             ? formatValue(
                                                 (OneOffPricingInfo
                                                   .packageThreeDisCountedTotal *
                                                   20) /
                                                   100
                                               )
                                             : formatValue(
                                                 (totalThreePackageValueOneOff * 20) /
                                                   100
                                               )
                                           : formatValue(
                                               (OneOffPricingInfo
                                                 .packageThreeNetTotal *
                                                 20) /
                                                 100
                                             )}
                                       </td> */}
                    <td></td>
                  </>
                )}
              </tr>

              {/* Discounts */}

              {(Number(OneOffPricingInfo.packageThreeDisCount) > 0 ||
                Number(OneOffPricingInfo.packageOneDisCount) > 0 ||
                Number(OneOffPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCount,
                          currencyID,
                        )}
                      </td>
                      {/* VAT Discount */}
                      {/* <td className="tr-table-class font-14 text-white text-right">
                                           (-){" "}
                                           {totalOnePackageValueOneOff >
                                             Number(
                                               OneOffPricingInfo
                                                 .packageOneNetTotal
                                             ) ||
                                           (Number(
                                             OneOffPricingInfo.packageOneDisCount
                                           ) > 0 &&
                                             !ProposalObject.DiscountLines)
                                             ? Number(
                                                 OneOffPricingInfo
                                                   .packageOneDisCount
                                               ) > 0 &&
                                               !ProposalObject.DiscountLines
                                               ? formatValue(
                                                   (((OneOffPricingInfo
                                                     .packageOneDisCountedTotal *
                                                     20) /
                                                     100) *
                                                     OneOffPricingInfo
                                                       .DiscountPercentagePackageOne) /
                                                     100
                                                 )
                                               : formatValue(
                                                   (((totalOnePackageValueOneOff *
                                                     20) /
                                                     100) *
                                                     OneOffPricingInfo
                                                       .DiscountPercentagePackageOne) /
                                                     100
                                                 )
                                             : formatValue(
                                                 (((OneOffPricingInfo
                                                   .packageOneNetTotal *
                                                   20) /
                                                   100) *
                                                   OneOffPricingInfo
                                                     .DiscountPercentagePackageOne) /
                                                   100
                                               )}
                                         </td> */}
                      <td></td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageTwoDisCount,
                              currencyID,
                            )}
                          </td>

                          {/* VAT Discount */}
                          {/* <td className="tr-table-class font-14 text-white text-right">
                                               (-){" "}
                                               {totalTwoPackageValueOneOff >
                                                 Number(
                                                   OneOffPricingInfo
                                                     .packageTwoNetTotal
                                                 ) ||
                                               (Number(
                                                 OneOffPricingInfo
                                                   .packageTwoDisCount
                                               ) > 0 &&
                                                 !ProposalObject.DiscountLines)
                                                 ? Number(
                                                     OneOffPricingInfo
                                                       .packageOneDisCount
                                                   ) > 0 &&
                                                   !ProposalObject.DiscountLines
                                                   ? formatValue(
                                                       (((OneOffPricingInfo
                                                         .packageTwoDisCountedTotal *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageTwo) /
                                                         100
                                                     )
                                                   : formatValue(
                                                       (((totalTwoPackageValueOneOff *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageTwo) /
                                                         100
                                                     )
                                                 : formatValue(
                                                     (((OneOffPricingInfo
                                                       .packageTwoNetTotal *
                                                       20) /
                                                       100) *
                                                       OneOffPricingInfo
                                                         .DiscountPercentagePackageTwo) /
                                                       100
                                                   )}
                                             </td> */}
                          <td></td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCount,
                              currencyID,
                            )}
                          </td>

                          {/* <td className="tr-table-class font-14 text-white text-right">
                                               (-){" "}
                                               {totalThreePackageValueOneOff >
                                                 Number(
                                                   OneOffPricingInfo
                                                     .packageThreeNetTotal
                                                 ) ||
                                               (Number(
                                                 OneOffPricingInfo
                                                   .packageThreeDisCount
                                               ) > 0 &&
                                                 !ProposalObject.DiscountLines)
                                                 ? Number(
                                                     OneOffPricingInfo
                                                       .packageThreeDisCount
                                                   ) > 0 &&
                                                   !ProposalObject.DiscountLines
                                                   ? formatValue(
                                                       (((OneOffPricingInfo
                                                         .packageThreeDisCountedTotal *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageThree) /
                                                         100
                                                     )
                                                   : formatValue(
                                                       (((totalThreePackageValueOneOff *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageThree) /
                                                         100
                                                     )
                                                 : formatValue(
                                                     (((OneOffPricingInfo
                                                       .packageThreeNetTotal *
                                                       20) /
                                                       100) *
                                                       OneOffPricingInfo
                                                         .DiscountPercentagePackageThree) /
                                                       100
                                                   )}
                                             </td> */}
                          <td></td>
                        </>
                      )}
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Discounted Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          OneOffPricingInfo.packageOneDisCountedTotal,
                          currencyID,
                        )}
                      </td>
                      {/* <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {totalOnePackageValueOneOff >
                                             Number(
                                               OneOffPricingInfo
                                                 .packageOneNetTotal
                                             ) ||
                                           (Number(
                                             OneOffPricingInfo.packageOneDisCount
                                           ) > 0 &&
                                             !ProposalObject.DiscountLines)
                                             ? Number(
                                                 OneOffPricingInfo
                                                   .packageOneDisCount
                                               ) > 0 &&
                                               !ProposalObject.DiscountLines
                                               ? formatValue(
                                                   (OneOffPricingInfo
                                                     .packageOneDisCountedTotal *
                                                     20) /
                                                     100 -
                                                     (((OneOffPricingInfo
                                                       .packageOneDisCountedTotal *
                                                       20) /
                                                       100) *
                                                       OneOffPricingInfo
                                                         .DiscountPercentagePackageOne) /
                                                       100
                                                 )
                                               : formatValue(
                                                   (totalOnePackageValueOneOff * 20) /
                                                     100 -
                                                     (((totalOnePackageValueOneOff *
                                                       20) /
                                                       100) *
                                                       OneOffPricingInfo
                                                         .DiscountPercentagePackageOne) /
                                                       100
                                                 )
                                             : formatValue(
                                                 (OneOffPricingInfo
                                                   .packageOneNetTotal *
                                                   20) /
                                                   100 -
                                                   (((OneOffPricingInfo
                                                     .packageOneNetTotal *
                                                     20) /
                                                     100) *
                                                     OneOffPricingInfo
                                                       .DiscountPercentagePackageOne) /
                                                     100
                                               )}
                                         </td> */}
                      <td></td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          {/* <td className="tr-table-class font-14 text-white text-right">
                                               {" "}
                                               {totalTwoPackageValueOneOff >
                                                 Number(
                                                   OneOffPricingInfo
                                                     .packageTwoNetTotal
                                                 ) ||
                                               (Number(
                                                 OneOffPricingInfo
                                                   .packageTwoDisCount
                                               ) > 0 &&
                                                 !ProposalObject.DiscountLines)
                                                 ? Number(
                                                     OneOffPricingInfo
                                                       .packageOneDisCount
                                                   ) > 0 &&
                                                   !ProposalObject.DiscountLines
                                                   ? formatValue(
                                                       (OneOffPricingInfo
                                                         .packageTwoDisCountedTotal *
                                                         20) /
                                                         100 -
                                                         (((OneOffPricingInfo
                                                           .packageTwoDisCountedTotal *
                                                           20) /
                                                           100) *
                                                           OneOffPricingInfo
                                                             .DiscountPercentagePackageTwo) /
                                                           100
                                                     )
                                                   : formatValue(
                                                       (totalTwoPackageValueOneOff *
                                                         20) /
                                                         100 -
                                                         (((totalTwoPackageValueOneOff *
                                                           20) /
                                                           100) *
                                                           OneOffPricingInfo
                                                             .DiscountPercentagePackageTwo) /
                                                           100
                                                     )
                                                 : formatValue(
                                                     (OneOffPricingInfo
                                                       .packageTwoNetTotal *
                                                       20) /
                                                       100 -
                                                       (((OneOffPricingInfo
                                                         .packageTwoNetTotal *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageTwo) /
                                                         100
                                                   )}
                                             </td> */}
                          <td></td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal,
                              currencyID,
                            )}
                          </td>
                          {/* <td className="tr-table-class font-14 text-white text-right">
                                               {" "}
                                               {totalThreePackageValueOneOff >
                                                 Number(
                                                   OneOffPricingInfo
                                                     .packageThreeNetTotal
                                                 ) ||
                                               (Number(
                                                 OneOffPricingInfo
                                                   .packageThreeDisCount
                                               ) > 0 &&
                                                 !ProposalObject.DiscountLines)
                                                 ? Number(
                                                     OneOffPricingInfo
                                                       .packageThreeDisCount
                                                   ) > 0 &&
                                                   !ProposalObject.DiscountLines
                                                   ? formatValue(
                                                       (OneOffPricingInfo
                                                         .packageThreeDisCountedTotal *
                                                         20) /
                                                         100 -
                                                         (((OneOffPricingInfo
                                                           .packageThreeDisCountedTotal *
                                                           20) /
                                                           100) *
                                                           OneOffPricingInfo
                                                             .DiscountPercentagePackageThree) /
                                                           100
                                                     )
                                                   : formatValue(
                                                       (totalThreePackageValueOneOff *
                                                         20) /
                                                         100 -
                                                         (((totalThreePackageValueOneOff *
                                                           20) /
                                                           100) *
                                                           OneOffPricingInfo
                                                             .DiscountPercentagePackageThree) /
                                                           100
                                                     )
                                                 : formatValue(
                                                     (OneOffPricingInfo
                                                       .packageThreeNetTotal *
                                                       20) /
                                                       100 -
                                                       (((OneOffPricingInfo
                                                         .packageThreeNetTotal *
                                                         20) /
                                                         100) *
                                                         OneOffPricingInfo
                                                           .DiscountPercentagePackageThree) /
                                                         100
                                                   )}
                                             </td> */}
                          <td></td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentageOneOff !== null && (
                <>
                  {/* <tr class="head-grey-row">
                                       <td className="tr-table-class font-14 text-white">
                                         VAT
                                       </td>
                                       <td className="tr-table-class font-14 text-white text-right">
                                         {" "}
                                         {formatValue(
                                           OneOffPricingInfo
                                             .PackageOneVaTPrice
                                         )}
                                       </td>
                                       {packageCount >= 2 && (
                                         <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {formatValue(
                                             OneOffPricingInfo
                                               .PackageTwoVaTPrice
                                           )}
                                         </td>
                                       )}
                                       {packageCount === 3 && (
                                         <td className="tr-table-class font-14 text-white text-right">
                                           {" "}
                                           {formatValue(
                                             OneOffPricingInfo
                                               .PackageThreeVaTPrice
                                           )}
                                         </td>
                                       )}
                                     </tr> */}
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Fees inc {taxName} ({currencySymbol})
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        OneOffPricingInfo.PackageOneGrandTotal,
                        currencyID,
                      )}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageTwoGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageThreeGrandTotal,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                </>
              )}
            </table>
          </div>
        ) : (
          ""
        ),
    },
    {
      id: 3,
      label: "Template 3",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service Category
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                VAT Rate
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          <td className="text-center">
                            {service.serviceCatName}
                          </td>
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(vat, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  <td></td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  RecurringPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(RecurringPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  RecurringPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(RecurringPricingInfo.DiscountedPrice) +
                            (Number(RecurringPricingInfo.DiscountedPrice) *
                              20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) +
                                  (Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        RecurringPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                RecurringPricingInfo.DiscountedPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td></td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service Category
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                VAT Rate
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          <td className="text-center">
                            {service.serviceCatName}
                          </td>
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {" "}
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(vat, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  OneOffPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  OneOffPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(OneOffPricingInfo.DiscountedPrice) +
                            (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) +
                                  (Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          OneOffPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                OneOffPricingInfo.DiscountedPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : (
          ""
        ),
    },
    {
      id: 4,
      label: "Template 4",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  {/* <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
                  </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          {/* <td className="text-center">
                                            {service.serviceCatName}
                                          </td> */}
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(vat, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  RecurringPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(RecurringPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  RecurringPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(RecurringPricingInfo.DiscountedPrice) +
                            (Number(RecurringPricingInfo.DiscountedPrice) *
                              20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) +
                                  (Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        RecurringPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                RecurringPricingInfo.DiscountedPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} Rate
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                VAT (£)
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          {/* <td className="text-center">
                                            {service.serviceCatName}
                                          </td> */}
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {" "}
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">20%</td>
                          {/* <td className="text-center">
                                            {ProposalObject.feeTypeId ===
                                              1 && formatValue(vat)}
                                            {ProposalObject.feeTypeId ===
                                              2 && (
                                              <span className="fa fa-check"></span>
                                            )}
                                          </td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>

                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  OneOffPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  OneOffPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(OneOffPricingInfo.DiscountedPrice) +
                            (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) +
                                  (Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          OneOffPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>

                        <td></td>
                        {/* Discounted Total */}
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                OneOffPricingInfo.DiscountedPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        {/* Discounted VAT Total */}
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        {/* Discounted Fees inc Total */}
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : (
          ""
        ),
    },
    {
      id: 5,
      label: "Template 5",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                VAT Rate
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          {/* <td className="text-center">
                                            {service.serviceCatName}
                                          </td> */}
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(vat, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}{" "}
                            (20%)
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>
                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          RecurringPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          RecurringPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  RecurringPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(RecurringPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  RecurringPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(RecurringPricingInfo.OriginalPrice) <
                      Number(RecurringPricingInfo.DiscountedPrice) ||
                    (Number(RecurringPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(RecurringPricingInfo.DiscountedPrice) +
                            (Number(RecurringPricingInfo.DiscountedPrice) *
                              20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(
                            RecurringPricingInfo.Discount,
                            currencyID,
                          )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>

                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) +
                                  (Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        RecurringPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          RecurringPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>
                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                RecurringPricingInfo.DiscountedPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(RecurringPricingInfo.OriginalPrice) <
                            Number(RecurringPricingInfo.DiscountedPrice) ||
                          (Number(RecurringPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(RecurringPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(
                                    RecurringPricingInfo.DiscountedPrice,
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount /
                                      100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Service Category
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Services
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Service scope
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                Scope value
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees ({currencySymbol})
                  </th>
                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                              >
                                VAT Rate
                              </th> */}
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    {taxName} ({currencySymbol})
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc {taxName} ({currencySymbol})
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price || 0;
                      const vat = (price * 20) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          {/* <td className="text-center">
                                            {service.serviceCatName}
                                          </td> */}
                          <td className="text-center">
                            {subService.serviceName}
                          </td>

                          <td className="text-center">
                            {driverList.length > 0
                              ? driverList.map((d, i) => (
                                  <div key={i}>
                                    {" "}
                                    {d.driverName} = {d.driverValue}
                                    {i !== driverList.length - 1 && ", "}
                                  </div>
                                ))
                              : "-"}
                          </td>

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(price, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(vat, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}{" "}
                            (20%)
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total, currencyID)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}

                <tr className="head-row">
                  <td className="tr-table-class text-white">Net Total</td>

                  <td></td>
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          OneOffPricingInfo.DiscountedPrice,
                          currencyID,
                        )
                      : formatValue(
                          OneOffPricingInfo.OriginalPrice,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class text-white text-center">
                                {formatValue(
                                  OneOffPricingInfo
                                    .VATPriceWithoutDiscount
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                            100,
                          currencyID,
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100,
                          currencyID,
                        )}
                  </td>
                  {/* <td className="tr-table-class font-14 text-white text-center">
                                {" "}
                                {formatValue(
                                  OneOffPricingInfo.FeesIncVAT
                                )}
                              </td> */}
                  <td className="tr-table-class text-white text-center">
                    {" "}
                    {Number(OneOffPricingInfo.OriginalPrice) <
                      Number(OneOffPricingInfo.DiscountedPrice) ||
                    (Number(OneOffPricingInfo.Discount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(
                          Number(OneOffPricingInfo.DiscountedPrice) +
                            (Number(OneOffPricingInfo.DiscountedPrice) * 20) /
                              100,
                          currencyID,
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                              100,
                          currencyID,
                        )}
                  </td>
                </tr>
                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        <td></td>
                        {/* discount */}
                        <td className="tr-table-class font-14 text-white text-center">
                          (-){"  "}
                          {"  "}
                          {formatValue(OneOffPricingInfo.Discount, currencyID)}
                        </td>
                        {/* VAT discount */}
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                ((Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        {/* Discounted total */}
                        <td className="tr-table-class text-white text-center">
                          (-){"  "}{" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) +
                                  (Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                      </tr>
                      {/* <tr class="head-row">
                                    <td className="tr-table-class font-14 text-white">
                                      Discounted Total
                                    </td>

                                    <td></td>
                                    <td className="tr-table-class font-14 text-white text-center">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                          .DiscountedTotal
                                      )}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  {vatPercentage && (
                                    <tr class="head-grey-row">
                                      <td className="tr-table-class font-14 text-white">
                                        Discounted VAT
                                      </td>

                                      <td></td>
                                      <td className="tr-table-class font-14 text-white text-center">
                                        {" "}
                                        {formatValue(
                                          OneOffPricingInfo.VATPrice
                                        )}
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )} */}
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>

                        <td></td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                OneOffPricingInfo.DiscountedPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount,
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class text-white text-center">
                          {" "}
                          {Number(OneOffPricingInfo.OriginalPrice) <
                            Number(OneOffPricingInfo.DiscountedPrice) ||
                          (Number(OneOffPricingInfo.Discount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? formatValue(
                                (Number(OneOffPricingInfo.DiscountedPrice) *
                                  20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.DiscountedPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100),
                                currencyID,
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.GrandTotal,
                            currencyID,
                          )}
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : (
          ""
        ),
    },

    // Checkbox customized template

    {
      id: 6,
      label: "Customize your Template",
      content:
        serviceTypeID === servicePackageTypeID.RecurringServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {(() => {
              console.log("Custom Template, line 9341, branch", "RecurringServiceTypeID");
              console.log("Custom Template, line 9342, props snapshot", {
                serviceTypeID,
                servicePackageTypeID,
                visibleFieldsCustomTemp,
                selectedRecurringServiceList,
                RecurringPricingInfo,
                ProposalObject,
                vatPercentage,
                currencyID,
                taxName,
                currencySymbol,
              });
              return null;
            })()}
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {visibleFieldsCustomTemp?.serviceCategory && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Service Category
                    </th>
                  )}
                  {visibleFieldsCustomTemp.serviceName && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Services
                    </th>
                  )}
                  {visibleFieldsCustomTemp.serviceScope && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Service Scope
                    </th>
                  )}

                  {visibleFieldsCustomTemp.fees && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Fees ({currencySymbol})
                    </th>
                  )}
                  {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      {taxName} Rate
                    </th>
                  )}
                  {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      {taxName} ({currencySymbol})
                    </th>
                  )}
                  {vatPercentage !== 0 &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <th
                        className="tr-table-class text-white text-center"
                        style={{ width: "16.66%" }}
                      >
                        Fees inc {taxName} ({currencySymbol})
                      </th>
                    )}
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map(
                              (service, index) => (
                                <>
                                  {service.servicesList.map(
                                    (subService, subIndex) => {
                                      const price =
                                        Number(subService.price) || 0;
                                      const vat =
                                        (price *
                                          subService.service_vat_percentage) /
                                        100;
                                      console.log(vat);
                                      const total = price + vat;

                                      const driverList =
                                        subService.pricingDriverList || [];

                                      return (
                                        <tr key={`sub-${index}-${subIndex}`}>
                                          {visibleFieldsCustomTemp
                                            .serviceCategory && (
                                            <td className="text-center">
                                              {service.serviceCatName}
                                            </td>
                                          )}
                                          {visibleFieldsCustomTemp
                                            .serviceName && (
                                            <td className="text-center">
                                              {subService.serviceName}
                                            </td>
                                          )}
                                          {visibleFieldsCustomTemp
                                            .serviceScope && (
                                            <td className="text-center">
                                              {driverList.length > 0
                                                ? driverList.map((d, i) => (
                                                    <div key={i}>
                                                      {d.variation === null ? (
                                                        <>
                                                          {d.driverName} ={" "}
                                                          {d.driverValue}
                                                          {i !==
                                                            driverList.length -
                                                              1 && "; "}
                                                        </>
                                                      ) : (
                                                        (() => {
                                                          const matched =
                                                            d.variation.find(
                                                              (v) =>
                                                                Number(
                                                                  v.variationValue,
                                                                ) ===
                                                                Number(
                                                                  d.driverValue,
                                                                ),
                                                            );

                                                          return (
                                                            <>
                                                              {d.driverName} ={" "}
                                                              {matched
                                                                ? matched.variationName
                                                                : ""}
                                                              {i !==
                                                                driverList.length -
                                                                  1 && "; "}
                                                            </>
                                                          );
                                                        })()
                                                      )}

                                                      {/* {d.driverName} ={" "}
                                                      {d.driverValue}
                                                      {i !==
                                                        driverList.length - 1 &&
                                                        "; "} */}
                                                    </div>
                                                  ))
                                                : "-"}
                                            </td>
                                          )}

                                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                                          {visibleFieldsCustomTemp
                                            .fees && (
                                            <td className="text-center">
                                              {ProposalObject
                                                .feeTypeId === 1 &&
                                                formatValue(
                                                  price,
                                                  currencyID,
                                                )}
                                              {ProposalObject
                                                .feeTypeId === 2 && (
                                                <span className="fa fa-check"></span>
                                              )}
                                            </td>
                                          )}
                                          {vatPercentage !== 0 &&
                                            visibleFieldsCustomTemp
                                              .vatRate && (
                                              <td className="text-center">
                                                {
                                                  subService.service_vat_percentage
                                                }
                                                %
                                              </td>
                                            )}
                                          {vatPercentage !== 0 &&
                                            visibleFieldsCustomTemp
                                              .vat && (
                                              <td className="text-center">
                                                {ProposalObject
                                                  .feeTypeId === 1 &&
                                                  formatValue(
                                                    subService.service_vat_amount,
                                                    currencyID,
                                                  )}
                                                {ProposalObject
                                                  .feeTypeId === 2 && (
                                                  <span className="fa fa-check"></span>
                                                )}
                                              </td>
                                            )}
                                          {vatPercentage !== 0 &&
                                            visibleFieldsCustomTemp
                                              .feesIncVat && (
                                              <td className="text-center">
                                                {ProposalObject
                                                  .feeTypeId === 1 &&
                                                  formatValue(
                                                    price +
                                                      Number(
                                                        subService.service_vat_amount,
                                                      ),
                                                    currencyID,
                                                  )}
                                                {ProposalObject
                                                  .feeTypeId === 2 && (
                                                  <span className="fa fa-check"></span>
                                                )}
                                              </td>
                                            )}
                                        </tr>
                                      );
                                    },
                                  )}
                                </>
                              ),
                            )}

                {/* === NET TOTAL ROW === */}
                <tr className="head-row">
                  {/* {visibleFieldsCustomTemp.serviceCategory && (
          <td className="tr-table-class text-white">Net Total</td>
        )} */}
                  <td className="tr-table-class text-white">Net Total</td>
                  {visibleFieldsCustomTemp?.serviceCategory && <td></td>}
                  {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  {visibleFieldsCustomTemp.fees && (
                    <td className="tr-table-class text-white text-center">
                      {Number(RecurringPricingInfo.OriginalPrice) <
                        Number(RecurringPricingInfo.DiscountedPrice) ||
                      (Number(RecurringPricingInfo.Discount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? formatValue(
                            RecurringPricingInfo.DiscountedPrice,
                            currencyID,
                          )
                        : formatValue(
                            RecurringPricingInfo.OriginalPrice,
                            currencyID,
                          )}
                    </td>
                  )}
                  {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                    <td></td>
                  )}
                  {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && (
                    <td className="tr-table-class text-white text-center">
                      {formatValue(
                        Number(RecurringPricingInfo.staticTotalVAT, currencyID),
                      )}
                    </td>
                  )}
                  {vatPercentage !== 0 &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class text-white text-center">
                        {Number(RecurringPricingInfo.OriginalPrice) <
                          Number(RecurringPricingInfo.DiscountedPrice) ||
                        (Number(RecurringPricingInfo.Discount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? formatValue(
                              Number(RecurringPricingInfo.DiscountedPrice) +
                                Number(RecurringPricingInfo.staticTotalVAT),
                              currencyID,
                            )
                          : formatValue(
                              Number(RecurringPricingInfo.OriginalPrice) +
                                Number(RecurringPricingInfo.staticTotalVAT),
                              currencyID,
                            )}
                      </td>
                    )}
                </tr>

                {/* === DISCOUNT + GRAND TOTAL ROWS === */}
                {Number(RecurringPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr className="head-grey-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Discount
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-center">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.Discount,
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class text-white text-center">
                            (-){" "}
                            {formatValue(
                              Number(RecurringPricingInfo.staticTotalVAT) -
                                Number(
                                  RecurringPricingInfo.totalServiceWiseVAT,
                                ),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              (-){" "}
                              {formatValue(
                                Number(RecurringPricingInfo.Discount) +
                                  (Number(RecurringPricingInfo.staticTotalVAT) -
                                    Number(
                                      RecurringPricingInfo.totalServiceWiseVAT,
                                    )),
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
{
  vatPercentage ? (
<tr className="head-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Grand Total
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-center">
                            {Number(RecurringPricingInfo.OriginalPrice) <
                              Number(RecurringPricingInfo.DiscountedPrice) ||
                            (Number(RecurringPricingInfo.Discount) > 0 &&
                              !ProposalObject.DiscountLines)
                              ? formatValue(
                                  RecurringPricingInfo.DiscountedPrice -
                                    RecurringPricingInfo.Discount,
                                  currencyID,
                                )
                              : formatValue(
                                  RecurringPricingInfo.OriginalPrice -
                                    RecurringPricingInfo.Discount,
                                  currencyID,
                                )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-center">
                            {formatValue(
                              Number(RecurringPricingInfo.totalServiceWiseVAT),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-center">
                              {formatValue(
                                RecurringPricingInfo.GrandTotal,
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
  ) : (
<tr className="head-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Discounted Total
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-center">
                            {Number(RecurringPricingInfo.OriginalPrice) <
                              Number(RecurringPricingInfo.DiscountedPrice) ||
                            (Number(RecurringPricingInfo.Discount) > 0 &&
                              !ProposalObject.DiscountLines)
                              ? formatValue(
                                  RecurringPricingInfo.DiscountedPrice -
                                    RecurringPricingInfo.Discount,
                                  currencyID,
                                )
                              : formatValue(
                                  RecurringPricingInfo.OriginalPrice -
                                    RecurringPricingInfo.Discount,
                                  currencyID,
                                )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-center">
                            {formatValue(
                              Number(RecurringPricingInfo.totalServiceWiseVAT),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-center">
                              {formatValue(
                                RecurringPricingInfo.GrandTotal,
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
  )
}
                      
                    </>
                  )}
              </tbody>
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {(() => {
              console.log("Custom Template, line 9793, branch", "OneOffServiceTypeID");
              console.log("Custom Template, line 9794, props snapshot", {
                serviceTypeID,
                servicePackageTypeID,
                visibleFieldsCustomTemp,
                selectedOneOffServiceList,
                OneOffPricingInfo,
                ProposalObject,
                vatPercentageOneOff,
                currencyID,
                taxName,
                currencySymbol,
              });
              return null;
            })()}
            <table className="table align-middle table-nowrap">
              <thead className="table-dark text-white">
                <tr className="head-row">
                  {visibleFieldsCustomTemp?.serviceCategory && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Service Category
                    </th>
                  )}
                  {visibleFieldsCustomTemp.serviceName && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Services
                    </th>
                  )}
                  {visibleFieldsCustomTemp.serviceScope && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Service scope
                    </th>
                  )}

                  {/* <th
                                className="tr-table-class text-white text-center"
                                style={{ width: "16.66%" }}
                                >
                                Scope value
                                </th> */}
                  {visibleFieldsCustomTemp.fees && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Fees ({currencySymbol})
                    </th>
                  )}
                  {vatPercentageOneOff !== 0 &&
                    visibleFieldsCustomTemp.vatRate && (
                      <th
                        className="tr-table-class text-white text-center"
                        style={{ width: "16.66%" }}
                      >
                        {taxName} Rate
                      </th>
                    )}
                  {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vat && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      {taxName} ({currencySymbol})
                    </th>
                  )}
                  {vatPercentageOneOff !== 0 &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <th
                        className="tr-table-class text-white text-center"
                        style={{ width: "16.66%" }}
                      >
                        Fees inc {taxName} ({currencySymbol})
                      </th>
                    )}
                </tr>
              </thead>

              <tbody>
                {selectedOneOffServiceList.map((service, index) => (
                  <>
                    {service.servicesList.map((subService, subIndex) => {
                      const price = subService.price
                        ? subService.price
                        : subService.quotationPrice || 0;
                      const vat =
                        (price * subService.service_vat_percentage) / 100;
                      const total = price + vat;
                      const driverList = subService.pricingDriverList || [];

                      return (
                        <tr key={`sub-${index}-${subIndex}`}>
                          {visibleFieldsCustomTemp?.serviceCategory && (
                            <td className="text-center">
                              {service.serviceCatName}
                            </td>
                          )}

                          {visibleFieldsCustomTemp.serviceName && (
                            <td className="text-center">
                              {subService.serviceName}
                            </td>
                          )}

                          {visibleFieldsCustomTemp.serviceScope && (
                            <td className="text-center">
                              {driverList.length > 0
                                ? driverList.map((d, i) => (
                                    <div key={i}>
                                      {d.variation === null ? (
                                        <>
                                          {d.driverName} = {d.driverValue}
                                          {i !== driverList.length - 1 && "; "}
                                        </>
                                      ) : (
                                        (() => {
                                          const matched = d.variation.find(
                                            (v) =>
                                              Number(v.variationValue) ===
                                              Number(d.driverValue),
                                          );

                                          return (
                                            <>
                                              {d.driverName} ={" "}
                                              {matched
                                                ? matched.variationName
                                                : ""}
                                              {i !== driverList.length - 1 &&
                                                "; "}
                                            </>
                                          );
                                        })()
                                      )}

                                      {/* {d.driverName} ={" "}
                                                      {d.driverValue}
                                                      {i !==
                                                        driverList.length - 1 &&
                                                        "; "} */}
                                    </div>
                                  ))
                                : "-"}
                            </td>
                          )}

                          {/* <td className="text-center">
                                            {driverList.length > 0
                                              ? driverList.map((d, i) => (
                                                  <div key={i}>
                                                    {d.driverValue}
                                                  </div>
                                                ))
                                              : "-"}
                                          </td> */}

                          {visibleFieldsCustomTemp.fees && (
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(price, currencyID)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          )}
                          {vatPercentageOneOff !== 0 &&
                            visibleFieldsCustomTemp.vatRate && (
                              <td className="text-center">
                                {subService.service_vat_percentage}%
                              </td>
                            )}

                          {vatPercentageOneOff !== 0 &&
                            visibleFieldsCustomTemp.vat && (
                              <td className="text-center">
                                {ProposalObject.feeTypeId === 1 &&
                                  formatValue(vat, currencyID)}
                                {ProposalObject.feeTypeId === 2 && (
                                  <span className="fa fa-check"></span>
                                )}
                              </td>
                            )}

                          {vatPercentageOneOff !== 0 &&
                            visibleFieldsCustomTemp.feesIncVat && (
                              <td className="text-center">
                                {ProposalObject.feeTypeId === 1 &&
                                  formatValue(total, currencyID)}
                                {ProposalObject.feeTypeId === 2 && (
                                  <span className="fa fa-check"></span>
                                )}
                              </td>
                            )}
                        </tr>
                      );
                    })}
                  </>
                ))}

                {/* NET TOTAL ROW */}
                <tr className="head-row">
                  {/* {visibleFieldsCustomTemp.serviceCategory && (
                                <td className="tr-table-class text-white">
                                  Net Total
                                </td>
                              )} */}
                  <td className="tr-table-class text-white">Net Total</td>
                  {visibleFieldsCustomTemp?.serviceCategory && <td></td>}
                  {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  {visibleFieldsCustomTemp.fees && (
                    <td className="tr-table-class text-white text-center">
                      {Number(OneOffPricingInfo.OriginalPrice) <
                        Number(OneOffPricingInfo.DiscountedPrice) ||
                      (Number(OneOffPricingInfo.Discount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? formatValue(
                            OneOffPricingInfo.DiscountedPrice,
                            currencyID,
                          )
                        : formatValue(
                            OneOffPricingInfo.OriginalPrice,
                            currencyID,
                          )}
                    </td>
                  )}
                  {vatPercentageOneOff !== 0 &&
                    visibleFieldsCustomTemp.vatRate && <td></td>}
                  {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vat && (
                    <td className="tr-table-class text-white text-center">
                      {formatValue(
                        Number(OneOffPricingInfo.staticTotalVATOneOff),
                        currencyID,
                      )}
                    </td>
                  )}
                  {vatPercentageOneOff !== 0 &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class text-white text-center">
                        {Number(OneOffPricingInfo.OriginalPrice) <
                          Number(OneOffPricingInfo.DiscountedPrice) ||
                        (Number(OneOffPricingInfo.Discount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? formatValue(
                              Number(OneOffPricingInfo.DiscountedPrice) +
                                Number(OneOffPricingInfo.staticTotalVATOneOff),
                              currencyID,
                            )
                          : formatValue(
                              Number(OneOffPricingInfo.OriginalPrice) +
                                Number(OneOffPricingInfo.staticTotalVATOneOff),
                              currencyID,
                            )}
                      </td>
                    )}
                </tr>

                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Discount
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class text-white text-center">
                            {Number(OneOffPricingInfo.Discount) > 0
                              ? formatValue(
                                  OneOffPricingInfo.Discount,
                                  currencyID,
                                )
                              : "-"}
                          </td>
                        )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class text-white text-center">
                              (-){"  "}
                              {formatValue(
                                Number(OneOffPricingInfo.staticTotalVATOneOff) -
                                  Number(
                                    OneOffPricingInfo.totalServiceWiseVATOneOff,
                                  ),
                                currencyID,
                              )}
                            </td>
                          )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              (-){"  "}{" "}
                              {formatValue(
                                Number(OneOffPricingInfo.Discount) +
                                  (Number(
                                    OneOffPricingInfo.staticTotalVATOneOff,
                                  ) -
                                    Number(
                                      OneOffPricingInfo.totalServiceWiseVATOneOff,
                                    )),
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
                      {
                        vatPercentageOneOff ? (
<tr className="head-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Grand Total
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class text-white text-center">
                            {formatValue(
                              OneOffPricingInfo.DiscountedPrice,
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class text-white text-center">
                              {formatValue(
                                Number(
                                  OneOffPricingInfo.totalServiceWiseVATOneOff,
                                ),
                                currencyID,
                              )}
                            </td>
                          )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              {formatValue(
                                Number(OneOffPricingInfo.DiscountedPrice) +
                                  Number(
                                    OneOffPricingInfo.totalServiceWiseVATOneOff,
                                  ),
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
                        ) : (
                          <tr className="head-row">
                        {visibleFieldsCustomTemp?.serviceCategory && (
                          <td className="tr-table-class font-14 text-white">
                            Discounted Total
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceName && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class text-white text-center">
                            {formatValue(
                              OneOffPricingInfo.DiscountedPrice,
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class text-white text-center">
                              {formatValue(
                                Number(
                                  OneOffPricingInfo.totalServiceWiseVATOneOff,
                                ),
                                currencyID,
                              )}
                            </td>
                          )}
                        {vatPercentageOneOff !== 0 &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              {formatValue(
                                Number(OneOffPricingInfo.DiscountedPrice) +
                                  Number(
                                    OneOffPricingInfo.totalServiceWiseVATOneOff,
                                  ),
                                currencyID,
                              )}
                            </td>
                          )}
                      </tr>
                        )
                      }
                      
                    </>
                  )}
              </tbody>
            </table>
            {/* <div
                        dangerouslySetInnerHTML={{
                          __html: currentPricingTableDesignRecurring,
                        }}
                      /> */}
          </div>
        ) : serviceTypeID === servicePackageTypeID.RecurringPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {(() => {
              console.log("Custom Template, line 10210, branch", "RecurringPackageTypeID");
              console.log("Custom Template, line 10211, props snapshot", {
                serviceTypeID,
                servicePackageTypeID,
                visibleFieldsCustomTemp,
                selectedPackagesList,
                selectedRecurringServiceList,
                RecurringPricingInfo,
                ProposalObject,
                vatPercentage,
                packageCount,
                currencyID,
                taxName,
                currencySymbol,
              });
              return null;
            })()}
            {/* <div
                                 dangerouslySetInnerHTML={{
                                   __html: currentPricingTableDesignRecurring,
                                 }}
                               /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td></td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      {visibleFieldsCustomTemp.fees && <td></td>}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                        <td></td>
                      )}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && <td></td>}
                      {vatPercentage !== 0 &&
                        visibleFieldsCustomTemp.feesIncVat && <td></td>}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                    </>
                  ))}
                </tr>
                <tr className="head-row">
                  {visibleFieldsCustomTemp.serviceName && (
                    <td className="tr-table-class font-14 text-white">
                      Services
                    </td>
                  )}
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      {visibleFieldsCustomTemp.fees && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          Fees ({currencySymbol})
                        </th>
                      )}

                      {vatPercentage !== 0 &&
                        visibleFieldsCustomTemp.vatRate && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            {taxName} Rate
                          </th>
                        )}

                      {vatPercentage !== 0 &&
                        visibleFieldsCustomTemp.vat && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            {taxName} ({currencySymbol})
                          </th>
                        )}

                      {vatPercentage !== 0 &&
                        visibleFieldsCustomTemp.feesIncVat && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            Fees inc {taxName} ({currencySymbol})
                          </th>
                        )}

                      {visibleFieldsCustomTemp.serviceScope && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          Service Scope
                        </th>
                      )}
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        {visibleFieldsCustomTemp.serviceName && (
                          <th colSpan={
                            (visibleFieldsCustomTemp.serviceName ? 1 : 0) +
                            packageCount * (
                              (visibleFieldsCustomTemp.fees ? 1 : 0) +
                              (vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate ? 1 : 0) +
                              (vatPercentage !== 0 && visibleFieldsCustomTemp.vat ? 1 : 0) +
                              (vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat ? 1 : 0) +
                              (visibleFieldsCustomTemp.serviceScope ? 1 : 0)
                            )
                          }>
                            {service.serviceCatName}
                          </th>
                        )}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const packageOnePrice =
                          Number(
                            String(subService.packageOneValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const packageTwoPrice =
                          Number(
                            String(subService.packageTwoValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const packageThreePrice =
                          Number(
                            String(subService.packageThreeValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const vatOne =
                          (packageOnePrice *
                            subService.service_vat_percentage) /
                          100;
                        const vatTwo =
                          (packageTwoPrice *
                            subService.service_vat_percentage) /
                          100;
                        const vatThree =
                          (packageThreePrice *
                            subService.service_vat_percentage) /
                          100;
                        const totalOne = packageOnePrice + vatOne;
                        const totalTwo = packageTwoPrice + vatTwo;
                        const totalThree = packageThreePrice + vatThree;
                        const driverList = subService.pricingDriverList || [];
                        return (
                          <tr
                            key={subIndex}
                            className={` ${
                              subService?.isAdditionalService !== null
                                ? "bg-info  text-white"
                                : ""
                            }`}
                          >
                            {visibleFieldsCustomTemp.serviceName && (
                              <td>
                                <div>
                                  {subService.serviceName.length > 45 ? (
                                    <Tooltip title={subService.serviceName}>
                                      {subService.serviceName
                                        .substring(0, 45)
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase(),
                                        ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    subService.serviceName
                                  )}
                                </div>
                                <div className="package-variables"></div>
                              </td>
                            )}

                            {visibleFieldsCustomTemp.fees && (
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div>
                                      {(subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageOneValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) &&
                                        subService?.servicePackageIDs.length === 1
                                      }
                                      type="checkbox"
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageOneID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            )}
                            {/* Vat Rate */}
                            {vatPercentage !== 0 &&
                              visibleFieldsCustomTemp.vatRate && (
                                <td className="text-right">
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    `${subService.service_vat_percentage ?? 0}%`
                                  )}
                                </td>
                              )}

                            {/* VAT */}

                            {vatPercentage !== 0 &&
                                              visibleFieldsCustomTemp
                                                .vat && (
                                                <>
                                                  {/* Package One */}
                                                  <td className="text-right">
                                                    <div className="flex-end-item">
                                                      {ProposalObject
                                                        .feeTypeId === 1 ? (
                                                        (subService.packageOneValue ===
                                                          0 ||
                                                          subService.packageOneValue ===
                                                            null) &&
                                                        !subService.servicePackageIDs.some(
                                                          (item) =>
                                                            item ===selectedPackagesList[0].servicePackageID,
                                                        ) ? (
                                                          <span className="fa fa-times"></span>
                                                        ) : !subService?.servicePackageIDs.includes(
                                                            subService.packageOneID,
                                                          ) ? (
                                                          <span className="fa fa-times"></span>
                                                        ) : (
                                                          ` ${formatValue(
                                                            vatOne,
                                                            currencyID,
                                                          )}`
                                                        )
                                                      ) : Number(
                                                          subService.packageOneValue,
                                                        ) !== null &&
                                                        subService?.servicePackageIDs.includes(
                                                          subService.packageOneID,
                                                        ) ? (
                                                        <span className="fa fa-check"></span>
                                                      ) : (
                                                        <span className="fa fa-times"></span>
                                                      )}

                                                      {subService?.isAdditionalService !==
                                                      null ? (
                                                        <input
                                                          style={{
                                                            marginLeft: "5px",
                                                          }}
                                                          type="checkbox"
                                                          disabled={
                                                            subService?.servicePackageIDs.includes(
                                                              subService.packageOneID,
                                                            ) &&
                                                            subService
                                                              ?.servicePackageIDs
                                                              .length === 1
                                                          }
                                                          checked={subService?.servicePackageIDs.includes(
                                                            subService.packageOneID,
                                                          )}
                                                          onChange={(e) =>
                                                            handleAddAndRemoveAdditionalServices(
                                                              1,
                                                              service.serviceCatID,
                                                              subService.serviceID,
                                                              subService.packageOneID,
                                                              e.target.checked,
                                                            )
                                                          }
                                                        />
                                                      ) : (
                                                        <div>&nbsp;&nbsp;</div>
                                                      )}
                                                    </div>
                                                  </td>
                                                </>
                                              // ):""}
                                                    )}
                            {/* Fees inc Vat */}
                            {vatPercentage !== 0 &&
                              visibleFieldsCustomTemp.feesIncVat && (
                                <td className="text-right">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    (subService.packageOneValue === 0 ||
                                      subService.packageOneValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ===
                                        selectedPackagesList[0].servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(totalOne, currencyID)}`
                                    )
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                </td>
                              )}

                            {/* Service Scope */}

                            {visibleFieldsCustomTemp.serviceScope && (
                              <>
                                {/* Package One */}
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageOneValue ===
                                              0 ||
                                              subService.packageOneValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ===
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageOneID,
                                              ) ? (
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} = ${
                                                d.driverValue
                                              }${
                                                i !== arr.length - 1 ? ", " : ""
                                              }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}

                            {/* Package Two */}
                            {packageCount >= 2 && (
                              <>
                                {visibleFieldsCustomTemp.fees && (
                                  <td className="text-right">
                                    <div className="flex-end-item">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        <div>
                                          {(subService.packageTwoValue === 0 ||
                                            subService.packageTwoValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ==
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(
                                              subService.packageTwoValue,
                                              currencyID,
                                            )}`
                                          )}
                                        </div>
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                      {subService?.isAdditionalService !==
                                      null ? (
                                        <input
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                          disabled={
                                            subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          type="checkbox"
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
                                  </td>
                                )}

                                {vatPercentage !== 0 &&
                                  visibleFieldsCustomTemp.vatRate && (
                                    <td className="text-right">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0].servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        `${subService.service_vat_percentage ?? 0}%`
                                      )}
                                    </td>
                                  )}

                                {vatPercentage !== 0 &&
                                                  visibleFieldsCustomTemp
                                                    .vat && (
                                                    <td className="text-right">
                                                      <div className="flex-end-item">
                                                        {ProposalObject
                                                          .feeTypeId === 1 ? (
                                                          (subService.packageTwoValue ===
                                                            0 ||
                                                            subService.packageTwoValue ===
                                                              null) &&
                                                          !subService.servicePackageIDs.some(
                                                            (item) =>
                                                              item === selectedPackagesList[0].servicePackageID,
                                                          ) ? (
                                                            <span className="fa fa-times"></span>
                                                          ) : !subService?.servicePackageIDs.includes(
                                                              subService.packageTwoID,
                                                            ) ? (
                                                            <span className="fa fa-times"></span>
                                                          ) : (
                                                            ` ${formatValue(
                                                              vatTwo,
                                                              currencyID,
                                                            )}`
                                                          )
                                                        ) : Number(
                                                            subService.packageTwoValue,
                                                          ) !== null &&
                                                          subService?.servicePackageIDs.includes(
                                                            subService.packageTwoID,
                                                          ) ? (
                                                          <span className="fa fa-check"></span>
                                                        ) : (
                                                          <span className="fa fa-times"></span>
                                                        )}

                                                        {subService?.isAdditionalService !==
                                                        null ? (
                                                          <input
                                                            style={{
                                                              marginLeft: "5px",
                                                            }}
                                                            type="checkbox"
                                                            disabled={
                                                              subService?.servicePackageIDs.includes(
                                                                subService.packageTwoID,
                                                              ) &&
                                                              subService
                                                                ?.servicePackageIDs
                                                                .length === 1
                                                            }
                                                            checked={subService?.servicePackageIDs.includes(
                                                              subService.packageTwoID,
                                                            )}
                                                            onChange={(e) =>
                                                              handleAddAndRemoveAdditionalServices(
                                                                1,
                                                                service.serviceCatID,
                                                                subService.serviceID,
                                                                subService.packageOneID,
                                                                e.target
                                                                  .checked,
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          <div>
                                                            &nbsp;&nbsp;
                                                          </div>
                                                        )}
                                                      </div>
                                                    </td>
                                                  // ):""}
                                                )}

                                {vatPercentage !== 0 &&
                                  visibleFieldsCustomTemp.feesIncVat && (
                                    <td className="text-right">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        (subService.packageTwoValue === 0 ||
                                          subService.packageTwoValue === null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ===
                                            selectedPackagesList[0].servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(totalTwo, currencyID)}`
                                        )
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                    </td>
                                  )}
                                {visibleFieldsCustomTemp.serviceScope && (
                                  <td className="text-right">
                                    {driverList.length > 0
                                      ? driverList
                                          .filter((d) => d.driverValue !== null)
                                          .map((d, i, arr) => (
                                            <div key={i}>
                                              {(subService.packageTwoValue ===
                                                0 ||
                                                subService.packageTwoValue ===
                                                  null) &&
                                              !subService.servicePackageIDs.some(
                                                (item) =>
                                                  item ===
                                                  selectedPackagesList[0]
                                                    .servicePackageID,
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageTwoID,
                                                ) ? (
                                                <span>-</span>
                                              ) : (
                                                ` ${d.driverName} = ${
                                                  d.driverValue
                                                }${
                                                  i !== arr.length - 1
                                                    ? ", "
                                                    : ""
                                                }`
                                              )}
                                            </div>
                                          ))
                                      : "-"}
                                  </td>
                                )}
                              </>
                            )}
                            {/* Package Three */}
                            {packageCount === 3 && (
                              <>
                                {visibleFieldsCustomTemp.fees && (
                                  <td className="text-right">
                                    <div className="flex-end-item">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        <div>
                                          {(subService.packageThreeValue === 0 ||
                                            subService.packageThreeValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ==
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(
                                              subService.packageThreeValue,
                                              currencyID,
                                            )}`
                                          )}
                                        </div>
                                      ) : Number(subService.packageThreeValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                      {subService?.isAdditionalService !==
                                      null ? (
                                        <input
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                          disabled={
                                            subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          type="checkbox"
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
                                  </td>
                                )}
                                {/* Vat Rate */}
                                {vatPercentage !== 0 &&
                                  visibleFieldsCustomTemp.vatRate && (
                                    <td className="text-right">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0].servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        `${subService.service_vat_percentage ?? 0}%`
                                      )}
                                    </td>
                                  )}
                                {/* Vat */}
                                {vatPercentage !== 0 &&
                                                  visibleFieldsCustomTemp
                                                    .vat && (
                                                    <td className="text-right">
                                                      <div className="flex-end-item">
                                                        {ProposalObject
                                                          .feeTypeId === 1 ? (
                                                          (subService.packageThreeValue ===
                                                            0 ||
                                                            subService.packageThreeValue ===
                                                              null) &&
                                                          !subService.servicePackageIDs.some(
                                                            (item) =>
                                                              item === selectedPackagesList[0].servicePackageID,
                                                          ) ? (
                                                            <span className="fa fa-times"></span>
                                                          ) : !subService?.servicePackageIDs.includes(
                                                              subService.packageThreeID,
                                                            ) ? (
                                                            <span className="fa fa-times"></span>
                                                          ) : (
                                                            ` ${formatValue(
                                                              vatThree,
                                                              currencyID,
                                                            )}`
                                                          )
                                                        ) : Number(
                                                            subService.packageThreeValue,
                                                          ) !== null &&
                                                          subService?.servicePackageIDs.includes(
                                                            subService.packageThreeID,
                                                          ) ? (
                                                          <span className="fa fa-check"></span>
                                                        ) : (
                                                          <span className="fa fa-times"></span>
                                                        )}

                                                        {subService?.isAdditionalService !==
                                                        null ? (
                                                          <input
                                                            style={{
                                                              marginLeft: "5px",
                                                            }}
                                                            type="checkbox"
                                                            disabled={
                                                              subService?.servicePackageIDs.includes(
                                                                subService.packageThreeID,
                                                              ) &&
                                                              subService
                                                                ?.servicePackageIDs
                                                                .length === 1
                                                            }
                                                            checked={subService?.servicePackageIDs.includes(
                                                              subService.packageThreeID,
                                                            )}
                                                            onChange={(e) =>
                                                              handleAddAndRemoveAdditionalServices(
                                                                1,
                                                                service.serviceCatID,
                                                                subService.serviceID,
                                                                subService.packageOneID,
                                                                e.target
                                                                  .checked,
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          <div>
                                                            &nbsp;&nbsp;
                                                          </div>
                                                        )}
                                                      </div>
                                                    </td>
                                                  // ):""}
                                                )}
                                {/* Fees inc Vat */}
                                {vatPercentage !== 0 &&
                                  visibleFieldsCustomTemp.feesIncVat && (
                                    <td className="text-right">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        (subService.packageThreeValue === 0 ||
                                          subService.packageThreeValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ===
                                            selectedPackagesList[0].servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(totalThree, currencyID)}`
                                        )
                                      ) : Number(subService.packageThreeValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                    </td>
                                  )}

                                {visibleFieldsCustomTemp.serviceScope && (
                                  <td className="text-right">
                                    {driverList.length > 0
                                      ? driverList
                                          .filter((d) => d.driverValue !== null)
                                          .map((d, i, arr) => (
                                            <div key={i}>
                                              {(subService.packageThreeValue ===
                                                0 ||
                                                subService.packageThreeValue ===
                                                  null) &&
                                              !subService.servicePackageIDs.some(
                                                (item) =>
                                                  item ===
                                                  selectedPackagesList[0]
                                                    .servicePackageID,
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageThreeID,
                                                ) ? (
                                                <span>-</span>
                                              ) : (
                                                ` ${d.driverName} = ${
                                                  d.driverValue
                                                }${
                                                  i !== arr.length - 1
                                                    ? ", "
                                                    : ""
                                                }`
                                              )}
                                            </div>
                                          ))
                                      : "-"}
                                  </td>
                                )}
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={RecurringPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handlePackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            RecurringPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.fees && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.fees && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vat && <th></th>}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={RecurringPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handlePackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                RecurringPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}

              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                {visibleFieldsCustomTemp.fees && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalOnePackageValue >
                      Number(RecurringPricingInfo.packageOneNetTotal) ||
                    (Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                        !ProposalObject.DiscountLines
                        ? formatValue(
                            RecurringPricingInfo.packageOneDisCountedTotal,
                            currencyID,
                          )
                        : formatValue(totalOnePackageValue, currencyID)
                      : formatValue(
                          RecurringPricingInfo.packageOneNetTotal,
                          currencyID,
                        )}
                  </td>
                )}
                {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                  <td className="tr-table-class font-14 text-white"></td>
                )}
                {vatPercentage? visibleFieldsCustomTemp.vat && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {formatValue(
                      Number(
                        RecurringPricingInfo.PackageOneStaticVaTPrice ??
                          RecurringPricingInfo.PackageOneStaticVaTPrice ??
                          0,
                      ) || 0,
                      currencyID,
                    )}
                  </td>
                ):""}
                {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {formatValue(
                      Number(
                        RecurringPricingInfo.packageOneNetTotal ?? 0,
                      ) +
                      Number(
                        RecurringPricingInfo.PackageOneStaticVaTPrice ?? 0,
                      ),
                      currencyID,
                    )}
                  </td>
                )}
                {visibleFieldsCustomTemp.serviceScope && <td></td>}
                {packageCount >= 2 && (
                  <>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalTwoPackageValue >
                          Number(RecurringPricingInfo.packageTwoNetTotal) ||
                        (Number(RecurringPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(RecurringPricingInfo.packageTwoDisCount) >
                              0 && !ProposalObject.DiscountLines
                            ? formatValue(
                                RecurringPricingInfo.packageTwoDisCountedTotal,
                                currencyID,
                              )
                            : formatValue(totalTwoPackageValue, currencyID)
                          : formatValue(
                              RecurringPricingInfo.packageTwoNetTotal,
                              currencyID,
                            )}
                      </td>
                    )}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {vatPercentage ? visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageTwoStaticVaTPrice,
                          currencyID,
                        )}
                      </td>
                    ):""}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          Number(
                            RecurringPricingInfo.packageTwoNetTotal ?? 0,
                          ) +
                          Number(
                            RecurringPricingInfo.PackageTwoStaticVaTPrice ?? 0,
                          ),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  </>
                )}{" "}
                {packageCount === 3 && (
                  <>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalThreePackageValue >
                          Number(RecurringPricingInfo.packageThreeNetTotal) ||
                        (Number(RecurringPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(RecurringPricingInfo.packageThreeDisCount) >
                              0 && !ProposalObject.DiscountLines
                            ? formatValue(
                                RecurringPricingInfo.packageThreeDisCountedTotal,
                                currencyID,
                              )
                            : formatValue(totalThreePackageValue, currencyID)
                          : formatValue(
                              RecurringPricingInfo.packageThreeNetTotal,
                              currencyID,
                            )}
                      </td>
                    )}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {vatPercentage ? visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageThreeStaticVaTPrice,
                          currencyID,
                        )}
                      </td>
                    ):""}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          Number(
                            RecurringPricingInfo.packageThreeNetTotal ?? 0,
                          ) +
                          Number(
                            RecurringPricingInfo.PackageThreeStaticVaTPrice ?? 0,
                          ),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  </>
                )}
              </tr>

              {(Number(RecurringPricingInfo.packageThreeDisCount) > 0 ||
                Number(RecurringPricingInfo.packageOneDisCount) > 0 ||
                Number(RecurringPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      {visibleFieldsCustomTemp.fees && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            RecurringPricingInfo.packageOneDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                        <td className="tr-table-class font-14 text-white"></td>
                      )}

                      {vatPercentage ?
                        visibleFieldsCustomTemp.vat && (
                          // <td className="tr-table-class font-14 text-white text-right">
                          //   (-){" "}
                          //   {formatValue(
                          //     Number.isNaN(
                          //       Number(
                          //         RecurringPricingInfo.PackageOneVaTPriceWithoutDiscount,
                          //       ) -
                          //         Number(
                          //           RecurringPricingInfo.PackageOneVaTPrice,
                          //         ),
                          //     )
                          //       ? 0
                          //       : Number(
                          //           RecurringPricingInfo.PackageOneVaTPriceWithoutDiscount,
                          //         ) -
                          //           Number(
                          //             RecurringPricingInfo.PackageOneVaTPrice,
                          //           ),
                          //     currencyID,
                          //   )}
                          // </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                                          Number(
                                            RecurringPricingInfo
                                              .PackageOneStaticVaTPrice,
                                          ) -
                                            Number(
                                              RecurringPricingInfo
                                                .PackageOneVaTPrice,
                                            ),
                                          currencyID,
                                        )}
                          </td>
                        ):""}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            Number(RecurringPricingInfo.packageOneDisCount) +
                              (Number(RecurringPricingInfo.PackageOneStaticVaTPrice) -
                                Number(RecurringPricingInfo.PackageOneVaTPrice)),
                            currencyID,
                          )}
                        </td>
                      )}

                      {visibleFieldsCustomTemp.serviceScope && <td></td>}

                      {/* <td className="tr-table-class font-14 text-white text-right"></td> */}
                      {packageCount >= 2 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                RecurringPricingInfo.packageTwoDisCount,
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}

                          {vatPercentage ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                (-){" "}
                                {formatValue(
                                  Number(
                                    RecurringPricingInfo.PackageTwoStaticVaTPrice,
                                  ) -
                                    Number(
                                      RecurringPricingInfo.PackageTwoVaTPrice,
                                    ),
                                  currencyID,
                                )}
                              </td>
                              // <td className="tr-table-class font-14 text-white text-right">
                              //   (-){" "}
                              //   {formatValue(
                              //     (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                              //       RecurringPricingInfo.DiscountPercentagePackageTwo) /
                              //       100
                              //   )}
                              // </td>
                            ):""}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(RecurringPricingInfo.packageTwoDisCount) +
                                  (Number(RecurringPricingInfo.PackageTwoStaticVaTPrice) -
                                    Number(RecurringPricingInfo.PackageTwoVaTPrice)),
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                RecurringPricingInfo.packageThreeDisCount,
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}

                          {vatPercentage ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                (-){" "}
                                {formatValue(
                                  Number(
                                    RecurringPricingInfo.PackageThreeStaticVaTPrice,
                                  ) -
                                    Number(
                                      RecurringPricingInfo.PackageThreeVaTPrice,
                                    ),
                                  currencyID,
                                )}
                              </td>
                              // <td className="tr-table-class font-14 text-white text-right">
                              //   (-){" "}
                              //   {formatValue(
                              //     (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                              //       RecurringPricingInfo.DiscountPercentagePackageThree) /
                              //       100
                              //   )}
                              // </td>
                            ):""}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(RecurringPricingInfo.packageThreeDisCount) +
                                  (Number(RecurringPricingInfo.PackageThreeStaticVaTPrice) -
                                    Number(RecurringPricingInfo.PackageThreeVaTPrice)),
                                currencyID,
                              )} ABCD Pacakge Count 3
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>

                    {
                      vatPercentage ? (
                        <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      {visibleFieldsCustomTemp.fees && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            Number(RecurringPricingInfo.PackageOneGrandTotal ?? 0) -
                              Number(RecurringPricingInfo.PackageOneVaTPrice ?? 0),
                            currencyID,
                          )}
                        </td>
                      )}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                        <td className="tr-table-class font-14 text-white"></td>
                      )}
                      {vatPercentage !== null &&
                        visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              RecurringPricingInfo.PackageOneVaTPrice,
                              currencyID,
                            )}
                          </td>
                        )}
                      {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {formatValue(
                            RecurringPricingInfo.PackageOneGrandTotal,
                            currencyID,
                          )}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      {packageCount >= 2 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {" "}
                              {formatValue(
                                Number(RecurringPricingInfo.PackageTwoGrandTotal ?? 0) -
                                  Number(RecurringPricingInfo.PackageTwoVaTPrice ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {vatPercentage !== null &&
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                {formatValue(
                              RecurringPricingInfo.PackageTwoVaTPrice,
                              currencyID,
                            )}
                              </td>
                            )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                RecurringPricingInfo.PackageTwoGrandTotal,
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount == 3 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {" "}
                              {formatValue(
                                Number(RecurringPricingInfo.PackageThreeGrandTotal ?? 0) -
                                  Number(RecurringPricingInfo.PackageThreeVaTPrice ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {vatPercentage !== null &&
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                {formatValue(
                              RecurringPricingInfo.PackageThreeVaTPrice,
                              currencyID,
                            )}
                              </td>
                            )}
                          {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                RecurringPricingInfo.PackageThreeGrandTotal,
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>
                      ): (
                        <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Discounted Total
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo
                                        .packageOneDisCountedTotal,
                                      currencyID,
                                    )}
                                  </td>
                                  {visibleFieldsCustomTemp
                                    .serviceScope && <td></td>}

                                  {packageCount >= 2 && (
  <>
    <td className="tr-table-class font-14 text-white text-right">
      {" "}
      {formatValue(
        RecurringPricingInfo.packageTwoDisCountedTotal,
        currencyID
      )}
    </td>
    {visibleFieldsCustomTemp.serviceScope && <td></td>}
  </>
)}

{packageCount === 3 && (
  <>
    <td className="tr-table-class font-14 text-white text-right">
      {" "}
      {formatValue(
        RecurringPricingInfo.packageThreeDisCountedTotal,
        currencyID
      )}
    </td>
    {visibleFieldsCustomTemp.serviceScope && <td></td>}
  </>
)}
                                </tr>
                      )
                    }

                    
                  </>
                )}

              {vatPercentage !== 0 &&
                !(
                  (Number(RecurringPricingInfo.packageThreeDisCount) > 0 ||
                    Number(RecurringPricingInfo.packageOneDisCount) > 0 ||
                    Number(RecurringPricingInfo.packageTwoDisCount) > 0) &&
                  ProposalObject.DiscountLines
                ) && (
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          Number(RecurringPricingInfo.packageOneNetTotal ?? 0),
                          currencyID,
                        )}
                      </td>
                    )}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          RecurringPricingInfo.PackageOneStaticVaTPrice,
                          currencyID,
                        )}
                      </td>
                    )}
                    {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          Number(RecurringPricingInfo.packageOneNetTotal ?? 0) +
                          Number(RecurringPricingInfo.PackageOneStaticVaTPrice ?? 0),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              Number(RecurringPricingInfo.packageTwoNetTotal ?? 0),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                          <td className="tr-table-class font-14 text-white"></td>
                        )}
                        {visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              RecurringPricingInfo.PackageTwoStaticVaTPrice,
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              Number(RecurringPricingInfo.packageTwoNetTotal ?? 0) +
                              Number(RecurringPricingInfo.PackageTwoStaticVaTPrice ?? 0),
                              currencyID,
                            )}
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      </>
                    )}
                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              Number(RecurringPricingInfo.packageThreeNetTotal ?? 0),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.vatRate && (
                          <td className="tr-table-class font-14 text-white"></td>
                        )}
                        {visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              RecurringPricingInfo.PackageThreeStaticVaTPrice,
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentage !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              Number(RecurringPricingInfo.packageThreeNetTotal ?? 0) +
                              Number(RecurringPricingInfo.PackageThreeStaticVaTPrice ?? 0),
                              currencyID,
                            )}
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      </>
                    )}
                  </tr>
                )}
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffPackageTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
            {(() => {
              console.log("Custom Template, line 11851, branch", "OneOffPackageTypeID");
              console.log("Custom Template, line 11852, props snapshot", {
                serviceTypeID,
                servicePackageTypeID,
                visibleFieldsCustomTemp,
                selectedPackagesList,
                selectedOneOffServiceList,
                OneOffPricingInfo,
                ProposalObject,
                vatPercentageOneOff,
                packageCount,
                currencyID,
                taxName,
                currencySymbol,
              });
              return null;
            })()}
            {/* <div
                                 dangerouslySetInnerHTML={{
                                   __html: currentPricingTableDesignRecurring,
                                 }}
                               /> */}
            <table
              class="table align-middle table-nowrap"
              style={{ width: "100%" }}
            >
              <thead className="table-light table-header-font">
                <tr className="head-row">
                  <td></td>
                  {selectedPackagesList.map((pkg, index) => (
                    <>
                      <td
                        key={index}
                        className="tr-table-class font-14 text-white text-right"
                      >
                        {pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName
                              .substring(0, 10)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."}
                          </Tooltip>
                        ) : pkg.servicePackageName.length > 10 ? (
                          <Tooltip title={pkg.servicePackageName}>
                            {pkg.servicePackageName.substring(0, 10) + "..."}
                          </Tooltip>
                        ) : (
                          pkg.servicePackageName
                        )}
                      </td>
                      {visibleFieldsCustomTemp.fees && <td></td>}
                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.vatRate && <td></td>}
                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.vat && <td></td>}
                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.feesIncVat && <td></td>}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                    </>
                  ))}
                </tr>
                <tr className="head-row">
                  {visibleFieldsCustomTemp.serviceName && (
                    <td className="tr-table-class font-14 text-white">
                      Services
                    </td>
                  )}
                  {selectedPackagesList.map((pkg, index) => (
                    <>

                      {visibleFieldsCustomTemp.fees && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          Fees ({currencySymbol})
                        </th>
                      )}

                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.vatRate && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            {taxName} Rate
                          </th>
                        )}

                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.vat && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            {taxName} ({currencySymbol})
                          </th>
                        )}

                      {vatPercentageOneOff !== 0 &&
                        visibleFieldsCustomTemp.feesIncVat && (
                          <th
                            className="tr-table-class text-white text-right"
                            style={{ width: "16.66%" }}
                          >
                            Fees inc {taxName} ({currencySymbol})
                          </th>
                        )}

                      {visibleFieldsCustomTemp.serviceScope && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          Service Scope
                        </th>
                      )}
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedOneOffServiceList.map((service, index) => {
                  return (
                    <>
                      <tr className="a-la-carte-services-review-head-row">
                        {visibleFieldsCustomTemp.serviceName && (
                          <th colSpan={
                            (visibleFieldsCustomTemp.serviceName ? 1 : 0) +
                            packageCount * (
                              (visibleFieldsCustomTemp.fees ? 1 : 0) +
                              (vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate ? 1 : 0) +
                              (vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vat ? 1 : 0) +
                              (vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat ? 1 : 0) +
                              (visibleFieldsCustomTemp.serviceScope ? 1 : 0)
                            )
                          }>
                            {service.serviceCatName}
                          </th>
                        )}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const packageOnePrice =
                          Number(
                            String(subService.packageOneValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const packageTwoPrice =
                          Number(
                            String(subService.packageTwoValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const packageThreePrice =
                          Number(
                            String(subService.packageThreeValue ?? "").replace(
                              /,/g,
                              "",
                            ),
                          ) || 0;
                        const vatOne =
                          (packageOnePrice *
                            subService.service_vat_percentage) /
                          100;
                        const vatTwo =
                          (packageTwoPrice *
                            subService.service_vat_percentage) /
                          100;
                        const vatThree =
                          (packageThreePrice *
                            subService.service_vat_percentage) /
                          100;
                        const totalOne = packageOnePrice + vatOne;
                        const totalTwo = packageTwoPrice + vatTwo;
                        const totalThree = packageThreePrice + vatThree;
                        const driverList = subService.pricingDriverList || [];
                        return (
                          <tr
                            key={subIndex}
                            className={` ${
                              subService?.isAdditionalService !== null
                                ? "bg-info  text-white"
                                : ""
                            }`}
                          >
                            {visibleFieldsCustomTemp.serviceName && (
                              <td>
                                <div>
                                  {subService.serviceName.length > 45 ? (
                                    <Tooltip title={subService.serviceName}>
                                      {subService.serviceName
                                        .substring(0, 45)
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase(),
                                        ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    subService.serviceName
                                  )}
                                </div>
                                <div className="package-variables"></div>
                              </td>
                            )}

                            {visibleFieldsCustomTemp.fees && (
                              <td className="text-right">
                                <div className="flex-end-item">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    <div>
                                      {(subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0]
                                            .servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageOneValue,
                                          currencyID,
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                  {subService?.isAdditionalService !== null ? (
                                    <input
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                      disabled={
                                        subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) &&
                                        subService?.servicePackageIDs.length === 1
                                      }
                                      type="checkbox"
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageOneID,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  ) : (
                                    <div>&nbsp;&nbsp;</div>
                                  )}
                                </div>
                              </td>
                            )}
                            {/* Vat Rate */}
                            {vatPercentageOneOff !== 0 &&
                              visibleFieldsCustomTemp.vatRate && (
                                <td className="text-right">
                                  {(subService.packageOneValue === 0 ||
                                    subService.packageOneValue === null) &&
                                  !subService.servicePackageIDs.some(
                                    (item) =>
                                      item ==
                                      selectedPackagesList[0].servicePackageID,
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    `${subService.service_vat_percentage ?? 0}%`
                                  )}
                                </td>
                              )}

                            {/* VAT */}

                            {vatPercentageOneOff !== 0 ?
                              visibleFieldsCustomTemp.vat && (
                                <>
                                  {/* Package One */}
                                  <td className="text-right">
                                    <div className="flex-end-item">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        (subService.packageOneValue === 0 ||
                                          subService.packageOneValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ===
                                            selectedPackagesList[0]
                                              .servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageOneID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(vatOne, currencyID)}`
                                        )
                                      ) : Number(subService.packageOneValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageOneID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}

                                      {subService?.isAdditionalService !==
                                      null ? (
                                        <input
                                          style={{ marginLeft: "5px" }}
                                          type="checkbox"
                                          disabled={
                                            subService?.servicePackageIDs.includes(
                                              subService.packageOneID,
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageOneID,
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
                                  </td>
                                </>
                              ):""}

                            {/* Fee inc Vat */}
                            {vatPercentageOneOff !== 0 &&
                              visibleFieldsCustomTemp.feesIncVat && (
                                <td className="text-right">
                                  {ProposalObject.feeTypeId === 1 ? (
                                    (subService.packageOneValue === 0 ||
                                      subService.packageOneValue ===
                                        null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ===
                                        selectedPackagesList[0].servicePackageID,
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID,
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(totalOne, currencyID)}`
                                    )
                                  ) : Number(subService.packageOneValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageOneID,
                                    ) ? (
                                    <span className="fa fa-check"></span>
                                  ) : (
                                    <span className="fa fa-times"></span>
                                  )}
                                </td>
                              )}

                            {/* Service Scope */}

                            {visibleFieldsCustomTemp.serviceScope && (
                              <>
                                {/* Package One */}
                                <td className="text-right">
                                  {driverList.length > 0
                                    ? driverList
                                        .filter((d) => d.driverValue !== null)
                                        .map((d, i, arr) => (
                                          <div key={i}>
                                            {(subService.packageOneValue ===
                                              0 ||
                                              subService.packageOneValue ===
                                                null) &&
                                            !subService.servicePackageIDs.some(
                                              (item) =>
                                                item ===
                                                selectedPackagesList[0]
                                                  .servicePackageID,
                                            ) ? (
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageOneID,
                                              ) ? (
                                              <span>-</span>
                                            ) : (
                                              ` ${d.driverName} = ${
                                                d.driverValue
                                              }${
                                                i !== arr.length - 1 ? ", " : ""
                                              }`
                                            )}
                                          </div>
                                        ))
                                    : "-"}
                                </td>
                              </>
                            )}

                            {/* Package Two */}
                            {packageCount >= 2 && (
                              <>  
                              {/* Fees */}
                                {visibleFieldsCustomTemp.fees && (
                                  <td className="text-right">
                                    <div className="flex-end-item">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        <div>
                                          {(subService.packageTwoValue === 0 ||
                                            subService.packageTwoValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ==
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(
                                              subService.packageTwoValue,
                                              currencyID,
                                            )}`
                                          )}
                                        </div>
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                      {subService?.isAdditionalService !==
                                      null ? (
                                        <input
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                          disabled={
                                            subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          type="checkbox"
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
                                  </td>
                                )}
                                {/* Vat Rate */}
                                {vatPercentageOneOff !== 0 &&
                                  visibleFieldsCustomTemp.vatRate && (
                                    <td className="text-right">
                                      {(subService.packageTwoValue === 0 ||
                                        subService.packageTwoValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0].servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        `${subService.service_vat_percentage ?? 0}%`
                                      )}
                                    </td>
                                  )}
                                {/* Vat */}
                                {vatPercentageOneOff !== 0 ?
                                  visibleFieldsCustomTemp.vat && (
                                    <td className="text-right">
                                      <div className="flex-end-item">
                                        {ProposalObject.feeTypeId === 1 ? (
                                          (subService.packageTwoValue === 0 ||
                                            subService.packageTwoValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ===
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(vatTwo, currencyID)}`
                                          )
                                        ) : Number(
                                            subService.packageTwoValue,
                                          ) !== null &&
                                          subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) ? (
                                          <span className="fa fa-check"></span>
                                        ) : (
                                          <span className="fa fa-times"></span>
                                        )}

                                        {subService?.isAdditionalService !==
                                        null ? (
                                          <input
                                            style={{ marginLeft: "5px" }}
                                            type="checkbox"
                                            disabled={
                                              subService?.servicePackageIDs.includes(
                                                subService.packageTwoID,
                                              ) &&
                                              subService?.servicePackageIDs
                                                .length === 1
                                            }
                                            checked={subService?.servicePackageIDs.includes(
                                              subService.packageTwoID,
                                            )}
                                            onChange={(e) =>
                                              handleAddAndRemoveAdditionalServices(
                                                1,
                                                service.serviceCatID,
                                                subService.serviceID,
                                                subService.packageOneID,
                                                e.target.checked,
                                              )
                                            }
                                          />
                                        ) : (
                                          <div>&nbsp;&nbsp;</div>
                                        )}
                                      </div>
                                    </td>
                                  ):""}

                                {/* Fee inc Vat */}
                                {vatPercentageOneOff !== 0 &&
                                  visibleFieldsCustomTemp.feesIncVat && (
                                    <td className="text-right">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        (subService.packageTwoValue === 0 ||
                                          subService.packageTwoValue === null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ===
                                            selectedPackagesList[0].servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(totalTwo, currencyID)}`
                                        )
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                    </td>
                                  )}
                                  {/* Service Scope */}
                                {visibleFieldsCustomTemp.serviceScope && (
                                  <td className="text-right">
                                    {driverList.length > 0
                                      ? driverList
                                          .filter((d) => d.driverValue !== null)
                                          .map((d, i, arr) => (
                                            <div key={i}>
                                              {(subService.packageTwoValue ===
                                                0 ||
                                                subService.packageTwoValue ===
                                                  null) &&
                                              !subService.servicePackageIDs.some(
                                                (item) =>
                                                  item ===
                                                  selectedPackagesList[0]
                                                    .servicePackageID,
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageTwoID,
                                                ) ? (
                                                <span>-</span>
                                              ) : (
                                                ` ${d.driverName} = ${
                                                  d.driverValue
                                                }${
                                                  i !== arr.length - 1
                                                    ? ", "
                                                    : ""
                                                }`
                                              )}
                                            </div>
                                          ))
                                      : "-"}
                                  </td>
                                )}
                              </>
                            )}
                            {/* Package Three */}
                            {packageCount === 3 && (
                              <>
                              {/* Fees */}
                                {visibleFieldsCustomTemp.fees && (
                                  <td className="text-right">
                                    <div className="flex-end-item">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        <div>
                                          {(subService.packageThreeValue === 0 ||
                                            subService.packageThreeValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ==
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(
                                              subService.packageThreeValue,
                                              currencyID,
                                            )}`
                                          )}
                                        </div>
                                      ) : Number(subService.packageThreeValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                      {subService?.isAdditionalService !==
                                      null ? (
                                        <input
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                          disabled={
                                            subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          type="checkbox"
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked,
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
                                  </td>
                                )}
                                {/* Vat Rate */}
                                {vatPercentageOneOff !== 0 &&
                                  visibleFieldsCustomTemp.vatRate && (
                                    <td className="text-right">
                                      {(subService.packageThreeValue === 0 ||
                                        subService.packageThreeValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          selectedPackagesList[0].servicePackageID,
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        `${subService.service_vat_percentage ?? 0}%`
                                      )}
                                    </td>
                                  )}
                                {/* Vat */}
                                {vatPercentageOneOff !== 0 ?
                                  visibleFieldsCustomTemp.vat && (
                                    <td className="text-right">
                                      <div className="flex-end-item">
                                        {ProposalObject.feeTypeId === 1 ? (
                                          (subService.packageThreeValue === 0 ||
                                            subService.packageThreeValue ===
                                              null) &&
                                          !subService.servicePackageIDs.some(
                                            (item) =>
                                              item ===
                                              selectedPackagesList[0]
                                                .servicePackageID,
                                          ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : !subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            ) ? (
                                            <span className="fa fa-times"></span>
                                          ) : (
                                            ` ${formatValue(vatThree, currencyID)}`
                                          )
                                        ) : Number(
                                            subService.packageThreeValue,
                                          ) !== null &&
                                          subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) ? (
                                          <span className="fa fa-check"></span>
                                        ) : (
                                          <span className="fa fa-times"></span>
                                        )}

                                        {subService?.isAdditionalService !==
                                        null ? (
                                          <input
                                            style={{ marginLeft: "5px" }}
                                            type="checkbox"
                                            disabled={
                                              subService?.servicePackageIDs.includes(
                                                subService.packageThreeID,
                                              ) &&
                                              subService?.servicePackageIDs
                                                .length === 1
                                            }
                                            checked={subService?.servicePackageIDs.includes(
                                              subService.packageThreeID,
                                            )}
                                            onChange={(e) =>
                                              handleAddAndRemoveAdditionalServices(
                                                1,
                                                service.serviceCatID,
                                                subService.serviceID,
                                                subService.packageOneID,
                                                e.target.checked,
                                              )
                                            }
                                          />
                                        ) : (
                                          <div>&nbsp;&nbsp;</div>
                                        )}
                                      </div>
                                    </td>
                                  ):""}
                                {/* Fees In Vat */}
                                {vatPercentageOneOff !== 0 &&
                                  visibleFieldsCustomTemp.feesIncVat && (
                                    <td className="text-right">
                                      {ProposalObject.feeTypeId === 1 ? (
                                        (subService.packageThreeValue === 0 ||
                                          subService.packageThreeValue ===
                                            null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ===
                                            selectedPackagesList[0].servicePackageID,
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID,
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(totalThree, currencyID)}`
                                        )
                                      ) : Number(subService.packageThreeValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID,
                                        ) ? (
                                        <span className="fa fa-check"></span>
                                      ) : (
                                        <span className="fa fa-times"></span>
                                      )}
                                    </td>
                                  )}
                                {/* Service Scope */}
                                {visibleFieldsCustomTemp.serviceScope && (
                                  <td className="text-right">
                                    {driverList.length > 0
                                      ? driverList
                                          .filter((d) => d.driverValue !== null)
                                          .map((d, i, arr) => (
                                            <div key={i}>
                                              {(subService.packageThreeValue ===
                                                0 ||
                                                subService.packageThreeValue ===
                                                  null) &&
                                              !subService.servicePackageIDs.some(
                                                (item) =>
                                                  item ===
                                                  selectedPackagesList[0]
                                                    .servicePackageID,
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageThreeID,
                                                ) ? (
                                                <span>-</span>
                                              ) : (
                                                ` ${d.driverName} = ${
                                                  d.driverValue
                                                }${
                                                  i !== arr.length - 1
                                                    ? ", "
                                                    : ""
                                                }`
                                              )}
                                            </div>
                                          ))
                                      : "-"}
                                  </td>
                                )}
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
              {packageCount > 1 && (
                <>
                  <tr id="recurring_DefaultWithPackages">
                    <td
                      style={{
                        padding: "8px",
                      }}
                    >
                      Discount (%)
                    </td>

                    <td
                      style={{
                        width: "35%",
                        padding: "0px",
                        whiteSpace: "normal",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <input
                          className="input-text"
                          type="text"
                          placeholder="Discount (%)"
                          value={OneOffPricingInfo.DiscountPercentagePackageOne?.toString()?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          )}
                          onChange={(e) => {
                            handleOneOffPackageOneDiscountPercentage(e);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        />
                        <div>
                          {getValidationMessage(
                            requireMessage,
                            pricingSettingObj.maxDiscountForQC,
                            OneOffPricingInfo.DiscountPercentagePackageOne,
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.fees && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vat && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageTwo?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageTwoDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageTwo,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.fees && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vat && <th></th>}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        <td
                          style={{
                            width: "35%",
                            padding: "0px",
                            whiteSpace: "normal",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <input
                              className="input-text"
                              type="text"
                              placeholder="Discount (%)"
                              value={OneOffPricingInfo.DiscountPercentagePackageThree?.toString()?.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              )}
                              onChange={(e) => {
                                handleOneOffPackageThreeDiscountPercentage(e);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "right",
                              }}
                            />
                            <div>
                              {getValidationMessage(
                                requireMessage,
                                pricingSettingObj.maxDiscountForQC,
                                OneOffPricingInfo.DiscountPercentagePackageThree,
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              )}

              <tr className="head-row">
                <td className="tr-table-class font-14 text-white">Net Total</td>
                {visibleFieldsCustomTemp.fees && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalOnePackageValue >
                      Number(OneOffPricingInfo.packageOneNetTotal) ||
                    (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                        !ProposalObject.DiscountLines
                        ? formatValue(
                            OneOffPricingInfo.packageOneDisCountedTotal,
                            currencyID,
                          )
                        : formatValue(totalOnePackageValue, currencyID)
                      : formatValue(
                          OneOffPricingInfo.packageOneNetTotal,
                          currencyID,
                        )}
                  </td>
                )}
                {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                  <td className="tr-table-class font-14 text-white"></td>
                )}
                {/* Net VAT */}
                {vatPercentageOneOff !== 0 ?
                  visibleFieldsCustomTemp.vat && (
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        Number(OneOffPricingInfo.PackageOneStaticVaTPrice),
                        currencyID,
                      )}
                    </td>
                  ):""}
                {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {formatValue(
                      (totalOnePackageValue >
                        Number(OneOffPricingInfo.packageOneNetTotal) ||
                      (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? Number(OneOffPricingInfo.packageOneDisCountedTotal)
                          : totalOnePackageValue
                        : Number(OneOffPricingInfo.packageOneNetTotal)) +
                      Number(OneOffPricingInfo.PackageOneStaticVaTPrice),
                      currencyID,
                    )}
                  </td>
                )}
                {visibleFieldsCustomTemp.serviceScope && <td></td>}
                {packageCount >= 2 && (
                  <>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalTwoPackageValue >
                          Number(OneOffPricingInfo.packageTwoNetTotal) ||
                        (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                            !ProposalObject.DiscountLines
                            ? formatValue(
                                OneOffPricingInfo.packageTwoDisCountedTotal,
                                currencyID,
                              )
                            : formatValue(totalTwoPackageValue, currencyID)
                          : formatValue(
                              OneOffPricingInfo.packageTwoNetTotal,
                              currencyID,
                            )}
                      </td>
                    )}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {/* Net VAT */}
                    {vatPercentageOneOff !== 0 ?
                      visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            Number(OneOffPricingInfo.PackageTwoStaticVaTPrice),
                            currencyID,
                          )}
                        </td>
                      ):""}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          (totalTwoPackageValue >
                            Number(OneOffPricingInfo.packageTwoNetTotal) ||
                          (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                              !ProposalObject.DiscountLines
                              ? Number(OneOffPricingInfo.packageTwoDisCountedTotal)
                              : totalTwoPackageValue
                            : Number(OneOffPricingInfo.packageTwoNetTotal)) +
                          Number(OneOffPricingInfo.PackageTwoStaticVaTPrice),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  </>
                )}{" "}
                {packageCount === 3 && (
                  <>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalThreePackageValue >
                          Number(OneOffPricingInfo.packageThreeNetTotal) ||
                        (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                            !ProposalObject.DiscountLines
                            ? formatValue(
                                OneOffPricingInfo.packageThreeDisCountedTotal,
                                currencyID,
                              )
                            : formatValue(totalThreePackageValue, currencyID)
                          : formatValue(
                              OneOffPricingInfo.packageThreeNetTotal,
                              currencyID,
                            )}
                      </td>
                    )}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {/* Net VAT */}
                    {vatPercentageOneOff !== 0 ?
                      visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            Number(OneOffPricingInfo.PackageThreeStaticVaTPrice),
                            currencyID,
                          )}
                        </td>
                      ):""}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          (totalThreePackageValue >
                            Number(OneOffPricingInfo.packageThreeNetTotal) ||
                          (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                              !ProposalObject.DiscountLines
                              ? Number(OneOffPricingInfo.packageThreeDisCountedTotal)
                              : totalThreePackageValue
                            : Number(OneOffPricingInfo.packageThreeNetTotal)) +
                          Number(OneOffPricingInfo.PackageThreeStaticVaTPrice),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  </>
                )}
              </tr>

              {(Number(OneOffPricingInfo.packageThreeDisCount) > 0 ||
                Number(OneOffPricingInfo.packageOneDisCount) > 0 ||
                Number(OneOffPricingInfo.packageTwoDisCount) > 0) &&
                ProposalObject.DiscountLines && (
                  <>
                    <tr className="head-grey-row">
                      <td className="tr-table-class font-14 text-white">
                        Discount
                      </td>
                      {visibleFieldsCustomTemp.fees && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            OneOffPricingInfo.packageOneDisCount,
                            currencyID,
                          )}
                        </td>
                      )}
                      {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                        <td className="tr-table-class font-14 text-white"></td>
                      )}
                      {/* Discounted VAT */}
                      {vatPercentageOneOff !== 0 ?
                        visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              Number(
                                OneOffPricingInfo.PackageOneStaticVaTPrice,
                              ) - Number(OneOffPricingInfo.PackageOneVaTPrice),
                              currencyID,
                            )}
                          </td>
                        ):""}
                      {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            Number(OneOffPricingInfo.packageOneDisCount) +
                              (Number(OneOffPricingInfo.PackageOneStaticVaTPrice) -
                                Number(OneOffPricingInfo.PackageOneVaTPrice)),
                            currencyID,
                          )}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}

                      {packageCount >= 2 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                OneOffPricingInfo.packageTwoDisCount,
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {/* Discounted VAT */}
                          {vatPercentageOneOff !== 0 ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                (-){" "}
                                {formatValue(
                                  Number(
                                    OneOffPricingInfo.PackageTwoStaticVaTPrice,
                                  ) -
                                    Number(
                                      OneOffPricingInfo.PackageTwoVaTPrice,
                                    ),
                                  currencyID,
                                )}
                              </td>
                            ):""}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(OneOffPricingInfo.packageTwoDisCount) +
                                  (Number(OneOffPricingInfo.PackageTwoStaticVaTPrice) -
                                    Number(OneOffPricingInfo.PackageTwoVaTPrice)),
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                OneOffPricingInfo.packageThreeDisCount,
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {vatPercentageOneOff !== 0 ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                (-){" "}
                                {formatValue(
                                  Number(
                                    OneOffPricingInfo.PackageThreeStaticVaTPrice,
                                  ) -
                                    Number(
                                      OneOffPricingInfo.PackageThreeVaTPrice,
                                    ),
                                  currencyID,
                                )}
                              </td>
                            ):""}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(OneOffPricingInfo.packageThreeDisCount) +
                                  (Number(OneOffPricingInfo.PackageThreeStaticVaTPrice) -
                                    Number(OneOffPricingInfo.PackageThreeVaTPrice)),
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>

                    {vatPercentageOneOff !== 0 ? (
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      {visibleFieldsCustomTemp.fees && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            Number(OneOffPricingInfo.PackageOneGrandTotal ?? 0) -
                              Number(OneOffPricingInfo.PackageOneVaTPrice ?? 0),
                            currencyID,
                          )}
                        </td>
                      )}
                      {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                        <td className="tr-table-class font-14 text-white"></td>
                      )}
                      {vatPercentageOneOff !== 0 ?
                        visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              Number(OneOffPricingInfo.PackageOneVaTPrice),
                              currencyID,
                            )}
                          </td>
                        ):""}
                      {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {formatValue(
                            Number(OneOffPricingInfo.PackageOneGrandTotal ?? 0),
                            currencyID,
                          )}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      {packageCount >= 2 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {" "}
                              {formatValue(
                                Number(OneOffPricingInfo.PackageTwoGrandTotal ?? 0) -
                                  Number(OneOffPricingInfo.PackageTwoVaTPrice ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {vatPercentageOneOff !== 0 ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                {formatValue(
                                  Number(OneOffPricingInfo.PackageTwoVaTPrice),
                                  currencyID,
                                )}
                              </td>
                            ):""}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageTwoGrandTotal ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount == 3 && (
                        <>
                          {visibleFieldsCustomTemp.fees && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {" "}
                              {formatValue(
                                Number(OneOffPricingInfo.PackageThreeGrandTotal ?? 0) -
                                  Number(OneOffPricingInfo.PackageThreeVaTPrice ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                            <td className="tr-table-class font-14 text-white"></td>
                          )}
                          {vatPercentageOneOff !== 0 ?
                            visibleFieldsCustomTemp.vat && (
                              <td className="tr-table-class font-14 text-white text-right">
                                {formatValue(
                                  Number(
                                    OneOffPricingInfo.PackageThreeVaTPrice,
                                  ),
                                  currencyID,
                                )}
                              </td>
                            ):""}
                          {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageThreeGrandTotal ?? 0),
                                currencyID,
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>
                    ):(
                      <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Discounted Total
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo
                                        .packageOneDisCountedTotal,
                                      currencyID,
                                    )}
                                  </td>
                                  {visibleFieldsCustomTemp
                                    .serviceScope && <td></td>}
                                  {packageCount >= 2 && (
                                    <>
                                    <td className="tr-table-class font-14 text-white text-right">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                        .packageTwoDisCountedTotal,
                                        currencyID,
                                      )}
                                    </td>
                                    {visibleFieldsCustomTemp
                                    .serviceScope && <td></td>}
                                      </>
                                  )}
                                  {packageCount == 3 && (
                                    <>
                                    <td className="tr-table-class font-14 text-white text-right">
                                      {" "}
                                      {formatValue(
                                        OneOffPricingInfo
                                        .packageThreeDisCountedTotal,
                                        currencyID,
                                      )}
                                    </td>
                                    {visibleFieldsCustomTemp
                                    .serviceScope && <td></td>}
                                    </>
                                  )}
                                </tr>
                    )}

                    
                  </>
                )}

              {vatPercentageOneOff !== 0 &&
                !(
                  (Number(OneOffPricingInfo.packageThreeDisCount) > 0 ||
                    Number(OneOffPricingInfo.packageOneDisCount) > 0 ||
                    Number(OneOffPricingInfo.packageTwoDisCount) > 0) &&
                  ProposalObject.DiscountLines
                ) && (
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    {visibleFieldsCustomTemp.fees && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          totalOnePackageValue >
                            Number(OneOffPricingInfo.packageOneNetTotal) ||
                          (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                              !ProposalObject.DiscountLines
                              ? Number(OneOffPricingInfo.packageOneDisCountedTotal)
                              : totalOnePackageValue
                            : Number(OneOffPricingInfo.packageOneNetTotal),
                          currencyID,
                        )}
                      </td>
                    )}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                      <td className="tr-table-class font-14 text-white"></td>
                    )}
                    {vatPercentageOneOff !== 0 ?
                      visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {formatValue(
                            Number(OneOffPricingInfo.PackageOneStaticVaTPrice),
                            currencyID,
                          )}
                        </td>
                      ):""}
                    {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {formatValue(
                          (totalOnePackageValue >
                            Number(OneOffPricingInfo.packageOneNetTotal) ||
                          (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                            !ProposalObject.DiscountLines)
                            ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                              !ProposalObject.DiscountLines
                              ? Number(OneOffPricingInfo.packageOneDisCountedTotal)
                              : totalOnePackageValue
                            : Number(OneOffPricingInfo.packageOneNetTotal)) +
                          Number(OneOffPricingInfo.PackageOneStaticVaTPrice),
                          currencyID,
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              totalTwoPackageValue >
                                Number(OneOffPricingInfo.packageTwoNetTotal) ||
                              (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                                !ProposalObject.DiscountLines)
                                ? Number(OneOffPricingInfo.packageTwoDisCount) >
                                    0 && !ProposalObject.DiscountLines
                                  ? Number(OneOffPricingInfo.packageTwoDisCountedTotal)
                                  : totalTwoPackageValue
                                : Number(OneOffPricingInfo.packageTwoNetTotal),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                          <td className="tr-table-class font-14 text-white"></td>
                        )}
                        {vatPercentageOneOff !== 0 ?
                          visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageTwoStaticVaTPrice),
                                currencyID,
                              )}
                            </td>
                          ):""}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              (totalTwoPackageValue >
                                Number(OneOffPricingInfo.packageTwoNetTotal) ||
                              (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                                !ProposalObject.DiscountLines)
                                ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                                  !ProposalObject.DiscountLines
                                  ? Number(OneOffPricingInfo.packageTwoDisCountedTotal)
                                  : totalTwoPackageValue
                                : Number(OneOffPricingInfo.packageTwoNetTotal)) +
                              Number(OneOffPricingInfo.PackageTwoStaticVaTPrice),
                              currencyID,
                            )}
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      </>
                    )}
                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              totalThreePackageValue >
                                Number(OneOffPricingInfo.packageThreeNetTotal) ||
                              (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                                !ProposalObject.DiscountLines)
                                ? Number(OneOffPricingInfo.packageThreeDisCount) >
                                    0 && !ProposalObject.DiscountLines
                                  ? Number(
                                      OneOffPricingInfo.packageThreeDisCountedTotal,
                                    )
                                  : totalThreePackageValue
                                : Number(OneOffPricingInfo.packageThreeNetTotal),
                              currencyID,
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.vatRate && (
                          <td className="tr-table-class font-14 text-white"></td>
                        )}
                        {vatPercentageOneOff !== 0 ?
                          visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageThreeStaticVaTPrice),
                                currencyID,
                              )}
                            </td>
                          ):""}
                        {vatPercentageOneOff !== 0 && visibleFieldsCustomTemp.feesIncVat && (
                          <td className="tr-table-class font-14 text-white text-right">
                            {formatValue(
                              (totalThreePackageValue >
                                Number(OneOffPricingInfo.packageThreeNetTotal) ||
                              (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                                !ProposalObject.DiscountLines)
                                ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                                  !ProposalObject.DiscountLines
                                  ? Number(OneOffPricingInfo.packageThreeDisCountedTotal)
                                  : totalThreePackageValue
                                : Number(OneOffPricingInfo.packageThreeNetTotal)) +
                              Number(OneOffPricingInfo.PackageThreeStaticVaTPrice),
                              currencyID,
                            )}
                          </td>
                        )}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      </>
                    )}
                  </tr>
                )}
            </table>
          </div>
        ) : (
          (() => {
            console.log("Custom Template, line 13490, branch", "NO_MATCH");
            console.log("Custom Template, line 13491, props snapshot", {
              serviceTypeID,
              servicePackageTypeID,
              visibleFieldsCustomTemp,
              selectedRecurringServiceList,
              selectedOneOffServiceList,
              selectedPackagesList,
              RecurringPricingInfo,
              OneOffPricingInfo,
              ProposalObject,
              vatPercentage,
              vatPercentageOneOff,
              currencyID,
              taxName,
              currencySymbol,
            });
            return "";
          })()
        ),
    },
  ];

  {
    /* console.log(RecurringPricingInfo, "RecurringPricingInfo"); */
  }

  const ALL_COLUMNS = [
    { id: "serviceCategory", label: "Service Category" },
    { id: "serviceName", label: "Service Name" },
    { id: "vatRate", label: `${taxName} Rate` },
    { id: "vat", label: `${taxName}` },
    { id: "fees", label: "Fees" },
    { id: "serviceScope", label: "Service Scope" },
    { id: "feesIncVat", label: `Fees inc ${taxName}` },
  ];

  // const toggleColumn = (colId) => {
  //   if (REQUIRED_COLUMNS.includes(colId)) return; // can't uncheck required

  //   let updated = [...selectedColumns];
  //   if (updated.includes(colId)) {
  //     updated = updated.filter((c) => c !== colId);
  //   } else {
  //     updated.push(colId);
  //   }

  //   // Always make sure required are present
  //   REQUIRED_COLUMNS.forEach((r) => {
  //     if (!updated.includes(r)) updated.push(r);
  //   });

  //   setSelectedColumns(updated);
  // };

  // const handleConfirm = () => {
  //   const templatePayload =
  //     templateType === "default"
  //       ? {
  //           templateType: "default",
  //           columns: ["Service Category", "Service Name", "Fees", "VAT"],
  //         }
  //       : {
  //           templateType: "custom",
  //           columns: ALL_COLUMNS.filter((c) =>
  //             selectedColumns.includes(c.id)
  //           ).map((c) => c.label),
  //         };

  //   console.log("Chosen template:", templatePayload);
  //   onHide();
  // };

  const formatFieldLabel = (field) => {
    // Special case for VAT fields
    if (field === "vatRate") return `${taxName} Rate`;
    if (field === "feesIncVat") return `Fees Inc ${taxName}`;
    if (field === "vat") return `${taxName}`;

    // Default behavior
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // console.log("vatPercentage", vatPercentage);

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
        onClick={onHide}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light p-3">
              <h5 className="modal-title" id="modalLabel">
                Select Template
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <small className="text-muted">
                  Preview: <strong>{previewTableLabel}</strong> (applies to both
                  recurring and one-off tables)
                </small>
              </div>
              <form>
                <div
                  key={templates[0].id}
                  className="form-check d-flex align-items-start justify-content-center mb-3"
                >
                  <input
                    className="form-check-input mt-2 me-2"
                    type="radio"
                    name="pricingTemplate"
                    id={templates[0].id}
                    value={templates[0].id}
                    checked={globalSelectedTemplateID === templates[0].id}
                    onChange={() => {
                      setGlobalTemplateSelection(templates[0].id);
                    }}
                  />
                  <label
                    className="form-check-label w-100"
                    htmlFor={templates[0].id}
                  >
                    <strong style={{ fontSize: "20px" }}>
                      {templates[0].label}
                    </strong>
                    <div className="mt-1">{templates[0].content}</div>
                  </label>
                </div>

                {/* <div
                  key={templates.id}
                  className="form-check d-flex align-items-start justify-content-center mb-3"
                >
                  <input
                    className="form-check-input mt-2 me-2"
                    type="radio"
                    name="pricingTemplate"
                    id={templates.id}
                    value={templates.id}
                    checked={
                      serviceTypeID ===
                      servicePackageTypeID.RecurringServiceTypeID
                        ? selectedTemplateID === templates.id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffServiceTypeID
                        ? selectedTemplateIDOneOff === templates.id
                        : serviceTypeID ===
                          servicePackageTypeID.RecurringPackageTypeID
                        ? selectedTemplateID === templates.id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffPackageTypeID
                        ? selectedTemplateIDOneOff === templates.id
                        : null
                    }
                    onChange={() => {
                      if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringServiceTypeID
                      ) {
                        setSelectedTemplateID(templates.id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffServiceTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates.id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringPackageTypeID
                      ) {
                        setSelectedTemplateID(templates.id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffPackageTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates.id);
                      }
                    }}
                  />
                  <label
                    className="form-check-label w-100"
                    htmlFor={templates.id}
                  >
                    <strong style={{ fontSize: "20px" }}>
                      {templates.label}
                    </strong>
                    <div className="mt-1">{templates.content}</div>
                  </label>
                </div> */}

                <div className="mb-3 d-flex flex-wrap gap-3">
                  {Object.keys(visibleFieldsCustomTemp).map((field) => (
                    <div key={field} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={field}
                        checked={visibleFieldsCustomTemp[field]}
                        onChange={() => handleCheckboxChange(field)}
                        disabled={
                          serviceTypeID ===
                          servicePackageTypeID.RecurringServiceTypeID
                            ? vatPercentage === 0
                              ? field === "serviceName" ||
                                field === "fees" ||
                                field === "feesIncVat" ||
                                field === "vatRate" ||
                                field === "vat"
                              : field === "serviceName"
                            : serviceTypeID ===
                                servicePackageTypeID.OneOffServiceTypeID
                              ? vatPercentageOneOff === 0
                                ? field === "serviceName" ||
                                  field === "fees" ||
                                  field === "feesIncVat" ||
                                  field === "vatRate" ||
                                  field === "vat"
                                : field === "serviceName"
                              : serviceTypeID ===
                                  servicePackageTypeID.RecurringPackageTypeID
                                ? (vatPercentage === null || vatPercentage === 0)
                                  ? field === "serviceName" ||
                                    field === "serviceCategory" ||
                                    field === "fees" ||
                                    field === "feesIncVat" ||
                                    field === "vatRate" ||
                                    field === "vat"
                                  : field === "serviceName" ||
                                    field === "serviceCategory"
                                : serviceTypeID ===
                                    servicePackageTypeID.OneOffPackageTypeID
                                  ? (vatPercentageOneOff === null ||
                                      vatPercentageOneOff === 0)
                                    ? field === "serviceName" ||
                                      field === "serviceCategory" ||
                                      field === "fees" ||
                                      field === "feesIncVat" ||
                                      field === "vatRate" ||
                                      field === "vat"
                                    : field === "serviceName" ||
                                      field === "serviceCategory"
                                  : ""
                        }
                      />
                      <label htmlFor={field} className="form-check-label">
                        {formatFieldLabel(field)}
                      </label>
                    </div>
                  ))}
                </div>

                {/* <div
                  key={templates[0].id}
                  className="form-check d-flex align-items-start justify-content-center mb-3"
                >
                  <input
                    className="form-check-input mt-2 me-2"
                    type="radio"
                    name="pricingTemplate"
                    id={templates[0].id}
                    value={templates[0].id}
                    checked={
                      serviceTypeID ===
                      servicePackageTypeID.RecurringServiceTypeID
                        ? selectedTemplateID === templates[0].id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffServiceTypeID
                        ? selectedTemplateIDOneOff === templates[0].id
                        : serviceTypeID ===
                          servicePackageTypeID.RecurringPackageTypeID
                        ? selectedTemplateID === templates[0].id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffPackageTypeID
                        ? selectedTemplateIDOneOff === templates[0].id
                        : null
                    }
                    onChange={() => {
                      if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringServiceTypeID
                      ) {
                        setSelectedTemplateID(templates[0].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffServiceTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates[0].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringPackageTypeID
                      ) {
                        setSelectedTemplateID(templates[0].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffPackageTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates[0].id);
                      }
                    }}
                  />
                  <label
                    className="form-check-label w-100"
                    htmlFor={templates[6].id}
                  >
                    <strong style={{ fontSize: "20px" }}>
                      {templates[6].label}
                    </strong>
                    <div className="mt-1">{templates[6].content}</div>
                  </label>
                </div> */}

                <div
                  key={templates[6].id}
                  className="form-check d-flex align-items-start justify-content-center mb-3"
                >
                  <input
                    className="form-check-input mt-2 me-2"
                    type="radio"
                    name="pricingTemplate"
                    id={templates[6].id}
                    value={templates[6].id}
                    checked={globalSelectedTemplateID === templates[6].id}
                    onChange={() => {
                      setGlobalTemplateSelection(templates[6].id);
                    }}
                  />
                  <label
                    className="form-check-label w-100"
                    htmlFor={templates[6].id}
                  >
                    <strong style={{ fontSize: "20px" }}>
                      {templates[6].label}
                    </strong>
                    <div className="mt-1">{templates[6].content}</div>
                  </label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-md btn-light"
                onClick={() => {
                  onHide();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-md btn-primary create-item-btn"
                onClick={() => {
                  // console.log("Selected Template:", selectedTemplateID);
                  onHide();
                }}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingTableTemplatesModal;
