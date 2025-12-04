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
  serviceTypeID,
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
    setVisibleFieldsCustomTemp((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ✅ Rendering helper for field visibility
  // const renderField = (field, content) => {
  //   return visibleFieldsCustomTemp[field] ? <div className="mb-1">{content}</div> : null;
  // };

  if (!show) return null;

  const packageCount = selectedPackagesList.length;

  const handlePackageThreeDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageThree
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )

    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      InputValue
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
      RecurringPricingInfo.DiscountPercentagePackageTwo
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      RecurringPricingInfo.DiscountPercentagePackageOne,
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageThree
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
    CurrentValue
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
            2
          )}`;
        } else {
          // For positive values, limit to 4 digits before the decimal point
          formattedInput = `${integerPart.slice(0, 3)}.${decimalPart.slice(
            0,
            2
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
    isChecked
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
                              (id) => id !== packageID
                            ),
                      }
                    : service
                ),
              }
            : category
        )
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
                              (id) => id !== packageID
                            ),
                      }
                    : service
                ),
              }
            : category
        )
      );
    }
  };

  const handlePackageOneDiscountPercentage = (e) => {
    let InputValue = checkAllPackageDiscountPercentageValidation(
      e.target.value,
      RecurringPricingInfo.DiscountPercentagePackageOne
    );

    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      RecurringPricingInfo.DiscountPercentagePackageTwo,
      RecurringPricingInfo.DiscountPercentagePackageThree
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
      OneOffPricingInfoCopy.DiscountPercentagePackageOne
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
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
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      InputValue,
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
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
      OneOffPricingInfoCopy.DiscountPercentagePackageThree
    );
    // InputValue = InputValue.replace(
    //   /-/g,
    //   (match, index) => (index === 0 ? match : "")
    // )
    let DefaultDiscount = GetSingleDefaultDiscountPercentageOfPackages(
      OneOffPricingInfoCopy.DiscountPercentagePackageOne,
      OneOffPricingInfoCopy.DiscountPercentagePackageTwo,
      InputValue
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

  console.log("selectedOneOffServiceList", selectedOneOffServiceList);

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
                    Fees (£)
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
                                <>{formatValue(subService.price)}</>
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                          {formatValue(RecurringPricingInfo.Discount)}
                        </td>
                      </tr>
                      <tr class="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Discounted Total
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(RecurringPricingInfo.DiscountedTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    <tr class="head-grey-row">
                      <td className="tr-table-class font-14 text-white">VAT</td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.VATPrice)}
                      </td>
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.GrandTotal)}
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
                    Fees (£)
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
                                      : subService.quotationPrice
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          {formatValue(OneOffPricingInfo.Discount)}
                        </td>
                      </tr>
                      <tr class="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Discounted Total
                        </td>
                        <td className="tr-table-class font-14 text-white text-right">
                          {"  "}
                          {formatValue(OneOffPricingInfo.DiscountedTotal)}
                        </td>
                      </tr>
                    </>
                  )}
                {vatPercentage && (
                  <>
                    <tr class="head-grey-row">
                      <td className="tr-table-class font-14 text-white">VAT</td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.VATPrice)}
                      </td>
                    </tr>
                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        Grand Total
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.GrandTotal)}
                      </td>
                    </tr>
                  </>
                )}
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
                                      selectedPackagesList[0].servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                        selectedPackagesList[1].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageTwoValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageTwoValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageTwoID
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
                                        subService.packageTwoID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageTwoID,
                                        e.target.checked
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
                                        selectedPackagesList[2].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageThreeValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageThreeValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageThreeID
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
                                        subService.packageThreeID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageThreeID,
                                        e.target.checked
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
                            ","
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
                            RecurringPricingInfo.DiscountPercentagePackageOne
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
                              ","
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
                              RecurringPricingInfo.DiscountPercentagePackageTwo
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
                              ","
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
                              RecurringPricingInfo.DiscountPercentagePackageThree
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )
                      : formatValue(totalOnePackageValue)
                    : formatValue(RecurringPricingInfo.packageOneNetTotal)}
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
                            RecurringPricingInfo.packageTwoDisCountedTotal
                          )
                        : formatValue(totalTwoPackageValue)
                      : formatValue(RecurringPricingInfo.packageTwoNetTotal)}
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
                            RecurringPricingInfo.packageThreeDisCountedTotal
                          )
                        : formatValue(totalThreePackageValue)
                      : formatValue(RecurringPricingInfo.packageThreeNetTotal)}
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
                        {formatValue(RecurringPricingInfo.packageOneDisCount)}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(RecurringPricingInfo.packageTwoDisCount)}
                        </td>
                      )}
                      {packageCount === 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            RecurringPricingInfo.packageThreeDisCount
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )}
                      </td>

                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.packageTwoDisCountedTotal
                          )}
                        </td>
                      )}
                      {packageCount === 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.packageThreeDisCountedTotal
                          )}
                        </td>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage && (
                <>
                  <tr class="head-grey-row">
                    <td className="tr-table-class font-14 text-white">VAT</td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(RecurringPricingInfo.PackageOneVaTPrice)}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.PackageTwoVaTPrice)}
                      </td>
                    )}
                    {packageCount === 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.PackageThreeVaTPrice)}
                      </td>
                    )}
                  </tr>
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(RecurringPricingInfo.PackageOneGrandTotal)}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.PackageTwoGrandTotal)}
                      </td>
                    )}
                    {packageCount == 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageThreeGrandTotal
                        )}
                      </td>
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
                                      selectedPackagesList[0]?.servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      2,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                          ?.servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageTwoValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageTwoValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageTwoID
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
                                        subService.packageTwoID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        2,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageTwoID,
                                        e.target.checked
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
                                          ?.servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageThreeValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageThreeValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageThreeID
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
                                        subService.packageThreeID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        2,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageThreeID,
                                        e.target.checked
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
                            ","
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
                            OneOffPricingInfo.DiscountPercentagePackageOne
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
                              ","
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
                              OneOffPricingInfo.DiscountPercentagePackageTwo
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
                              ","
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
                              OneOffPricingInfo.DiscountPercentagePackageThree
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
                    ? formatValue(OneOffPricingInfo.packageOneDisCountedTotal)
                    : formatValue(totalOnePackageValueOneOff)}
                </td>
                {packageCount >= 2 && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {totalTwoPackageValueOneOff <
                      Number(OneOffPricingInfo.packageTwoDisCountedTotal) ||
                    (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                      !ProposalObject.DiscountLines)
                      ? formatValue(OneOffPricingInfo.packageTwoDisCountedTotal)
                      : formatValue(totalTwoPackageValueOneOff)}
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
                          OneOffPricingInfo.packageThreeDisCountedTotal
                        )
                      : formatValue(totalThreePackageValueOneOff)}
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
                        (-) {formatValue(OneOffPricingInfo.packageOneDisCount)}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(OneOffPricingInfo.packageTwoDisCount)}
                        </td>
                      )}
                      {packageCount == 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(OneOffPricingInfo.packageThreeDisCount)}
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
                          OneOffPricingInfo.packageOneDisCountedTotal
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.packageTwoDisCountedTotal
                          )}
                        </td>
                      )}
                      {packageCount == 3 && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.packageThreeDisCountedTotal
                          )}
                        </td>
                      )}
                    </tr>
                  </>
                )}
              {vatPercentage && (
                <>
                  <tr class="head-grey-row">
                    <td className="tr-table-class font-14 text-white">VAT</td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(OneOffPricingInfo.PackageOneVaTPrice)}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.PackageTwoVaTPrice)}
                      </td>
                    )}
                    {packageCount === 3 && (
                      <td className="tr-table-class text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.PackageThreeVaTPrice)}
                      </td>
                    )}
                  </tr>
                  <tr className="head-row">
                    <td className="tr-table-class font-14 text-white">
                      Grand Total
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(OneOffPricingInfo.PackageOneGrandTotal)}
                    </td>
                    {packageCount >= 2 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.PackageTwoGrandTotal)}
                      </td>
                    )}
                    {packageCount == 3 && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.PackageThreeGrandTotal)}
                      </td>
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
                    Fees (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                                formatValue(price)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total)}
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                            100
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100
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
                              100
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100
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
                          {formatValue(RecurringPricingInfo.Discount)}
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
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                  RecurringPricingInfo.Discount
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(RecurringPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                                formatValue(price)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total)}
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) / 100
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                              100
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                          {formatValue(OneOffPricingInfo.Discount)}
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  OneOffPricingInfo.Discount
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount
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
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(OneOffPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                        VAT (£)
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
                                      selectedPackagesList[0].servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                      selectedPackagesList[0].servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      (subService.packageOneValue * 20) / 100
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageTwoValue
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
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
                                          subService.packageTwoID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageTwoValue * 20) /
                                            100
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
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
                                          subService.packageTwoID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageThreeValue
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
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
                                          subService.packageThreeID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageThreeValue * 20) /
                                            100
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
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
                                          subService.packageThreeID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked
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
                            ","
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
                            RecurringPricingInfo.DiscountPercentagePackageOne
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageTwo
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageThree
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )
                      : formatValue(totalOnePackageValue)
                    : formatValue(RecurringPricingInfo.packageOneNetTotal)}
                </td>
                <td className="tr-table-class font-14 text-white text-right">
                  {" "}
                  {formatValue(
                    RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout
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
                              RecurringPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValue)
                        : formatValue(RecurringPricingInfo.packageTwoNetTotal)}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout
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
                              RecurringPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValue)
                        : formatValue(
                            RecurringPricingInfo.packageThreeNetTotal
                          )}
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(
                        RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout
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
                        {formatValue(RecurringPricingInfo.packageOneDisCount)}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(
                          (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                            RecurringPricingInfo.DiscountPercentagePackageOne) /
                            100
                        )}
                      </td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCount
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                100
                            )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCount
                            )}
                          </td>

                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                RecurringPricingInfo.DiscountPercentagePackageThree) /
                                100
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout -
                            (RecurringPricingInfo.PackageOneVaTPriceWithoutDiscout *
                              RecurringPricingInfo.DiscountPercentagePackageOne) /
                              100
                        )}
                      </td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                  RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                  100
                            )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCountedTotal
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                  RecurringPricingInfo.DiscountPercentagePackageThree) /
                                  100
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage && (
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
                      Fees inc VAT (£)
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(RecurringPricingInfo.PackageOneGrandTotal)}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageTwoGrandTotal
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
                            RecurringPricingInfo.PackageThreeGrandTotal
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
                        VAT (£)
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
                                      selectedPackagesList[0].servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      subService.packageOneValue
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                      selectedPackagesList[0].servicePackageID
                                  ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : !subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    ) ? (
                                    <span className="fa fa-times"></span>
                                  ) : (
                                    ` ${formatValue(
                                      (subService.packageOneValue * 20) / 100
                                    )}`
                                  )}
                                </div>
                              ) : Number(subService.packageOneValue) !== null &&
                                subService?.servicePackageIDs.includes(
                                  subService.packageOneID
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
                                      subService.packageOneID
                                    ) &&
                                    subService?.servicePackageIDs.length === 1
                                  }
                                  type="checkbox"
                                  checked={subService?.servicePackageIDs.includes(
                                    subService.packageOneID
                                  )}
                                  onChange={(e) =>
                                    handleAddAndRemoveAdditionalServices(
                                      1,
                                      service.serviceCatID,
                                      subService.serviceID,
                                      subService.packageOneID,
                                      e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageTwoValue
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
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
                                          subService.packageTwoID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageTwoValue * 20) /
                                            100
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageTwoValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageTwoID
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
                                          subService.packageTwoID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageTwoID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          subService.packageThreeValue
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
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
                                          subService.packageThreeID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked
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
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(
                                          (subService.packageThreeValue * 20) /
                                            100
                                        )}`
                                      )}
                                    </div>
                                  ) : Number(subService.packageThreeValue) !==
                                      null &&
                                    subService?.servicePackageIDs.includes(
                                      subService.packageThreeID
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
                                          subService.packageThreeID
                                        ) &&
                                        subService?.servicePackageIDs.length ===
                                          1
                                      }
                                      checked={subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
                                      )}
                                      onChange={(e) =>
                                        handleAddAndRemoveAdditionalServices(
                                          1,
                                          service.serviceCatID,
                                          subService.serviceID,
                                          subService.packageThreeID,
                                          e.target.checked
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
                            ","
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
                            OneOffPricingInfo.DiscountPercentagePackageOne
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageTwo
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageThree
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
                      ? formatValue(OneOffPricingInfo.packageOneDisCountedTotal)
                      : formatValue(totalOnePackageValueOneOff)
                    : formatValue(OneOffPricingInfo.packageOneNetTotal)}
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
                            100
                        )
                      : formatValue((totalOnePackageValueOneOff * 20) / 100)
                    : formatValue(
                        (OneOffPricingInfo.packageOneNetTotal * 20) / 100
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
                              OneOffPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValueOneOff)
                        : formatValue(OneOffPricingInfo.packageTwoNetTotal)}
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
                                100
                            )
                          : formatValue((totalTwoPackageValueOneOff * 20) / 100)
                        : formatValue(
                            (OneOffPricingInfo.packageTwoNetTotal * 20) / 100
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
                              OneOffPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValueOneOff)
                        : formatValue(OneOffPricingInfo.packageThreeNetTotal)}
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
                                100
                            )
                          : formatValue(
                              (totalThreePackageValueOneOff * 20) / 100
                            )
                        : formatValue(
                            (OneOffPricingInfo.packageThreeNetTotal * 20) / 100
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
                        (-) {formatValue(OneOffPricingInfo.packageOneDisCount)}
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
                                  100
                              )
                            : formatValue(
                                (((totalOnePackageValueOneOff * 20) / 100) *
                                  OneOffPricingInfo.DiscountPercentagePackageOne) /
                                  100
                              )
                          : formatValue(
                              (((OneOffPricingInfo.packageOneNetTotal * 20) /
                                100) *
                                OneOffPricingInfo.DiscountPercentagePackageOne) /
                                100
                            )}
                      </td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(OneOffPricingInfo.packageTwoDisCount)}
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
                                      100
                                  )
                                : formatValue(
                                    (((totalTwoPackageValueOneOff * 20) / 100) *
                                      OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                      100
                                  )
                              : formatValue(
                                  (((OneOffPricingInfo.packageTwoNetTotal *
                                    20) /
                                    100) *
                                    OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                    100
                                )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCount
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
                                      100
                                  )
                                : formatValue(
                                    (((totalThreePackageValueOneOff * 20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageThree) /
                                      100
                                  )
                              : formatValue(
                                  (((OneOffPricingInfo.packageThreeNetTotal *
                                    20) /
                                    100) *
                                    OneOffPricingInfo.DiscountPercentagePackageThree) /
                                    100
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
                          OneOffPricingInfo.packageOneDisCountedTotal
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
                                    100
                              )
                            : formatValue(
                                (totalOnePackageValueOneOff * 20) / 100 -
                                  (((totalOnePackageValueOneOff * 20) / 100) *
                                    OneOffPricingInfo.DiscountPercentagePackageOne) /
                                    100
                              )
                          : formatValue(
                              (OneOffPricingInfo.packageOneNetTotal * 20) /
                                100 -
                                (((OneOffPricingInfo.packageOneNetTotal * 20) /
                                  100) *
                                  OneOffPricingInfo.DiscountPercentagePackageOne) /
                                  100
                            )}
                      </td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal
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
                                        100
                                  )
                                : formatValue(
                                    (totalTwoPackageValueOneOff * 20) / 100 -
                                      (((totalTwoPackageValueOneOff * 20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                        100
                                  )
                              : formatValue(
                                  (OneOffPricingInfo.packageTwoNetTotal * 20) /
                                    100 -
                                    (((OneOffPricingInfo.packageTwoNetTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageTwo) /
                                      100
                                )}
                          </td>
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal
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
                                        100
                                  )
                                : formatValue(
                                    (totalThreePackageValueOneOff * 20) / 100 -
                                      (((totalThreePackageValueOneOff * 20) /
                                        100) *
                                        OneOffPricingInfo.DiscountPercentagePackageThree) /
                                        100
                                  )
                              : formatValue(
                                  (OneOffPricingInfo.packageThreeNetTotal *
                                    20) /
                                    100 -
                                    (((OneOffPricingInfo.packageThreeNetTotal *
                                      20) /
                                      100) *
                                      OneOffPricingInfo.DiscountPercentagePackageThree) /
                                      100
                                )}
                          </td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage && (
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
                      Fees inc VAT (£)
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(OneOffPricingInfo.PackageOneGrandTotal)}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(OneOffPricingInfo.PackageTwoGrandTotal)}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageThreeGrandTotal
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
                    Fees (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                                formatValue(price)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total)}
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                            100
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100
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
                              100
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100
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
                          {formatValue(RecurringPricingInfo.Discount)}
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
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                  RecurringPricingInfo.Discount
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(RecurringPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                                formatValue(price)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">20%</td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total)}
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) / 100
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                              100
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                          {formatValue(OneOffPricingInfo.Discount)}
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  OneOffPricingInfo.Discount
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount
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
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(OneOffPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                                        l.toUpperCase()
                                      ) + "..."}
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
                                        selectedPackagesList[0].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageOneValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageOneValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageOneID
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
                                        subService.packageOneID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    type="checkbox"
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageOneID,
                                        e.target.checked
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
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
                                              .servicePackageID
                                        ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageOneID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
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
                                            subService.packageTwoID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageTwoID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageTwoID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
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
                                            subService.packageThreeID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageThreeID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageThreeID
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
                            ","
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
                            RecurringPricingInfo.DiscountPercentagePackageOne
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageTwo
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageThree
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )
                      : formatValue(totalOnePackageValue)
                    : formatValue(RecurringPricingInfo.packageOneNetTotal)}
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
                              RecurringPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValue)
                        : formatValue(RecurringPricingInfo.packageTwoNetTotal)}
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
                              RecurringPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValue)
                        : formatValue(
                            RecurringPricingInfo.packageThreeNetTotal
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
                        {formatValue(RecurringPricingInfo.packageOneDisCount)}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right"></td>
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCount
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
                              RecurringPricingInfo.packageThreeDisCount
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )}
                      </td>
                      <td className="tr-table-class font-14 text-white text-right"></td>

                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCountedTotal
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
                              RecurringPricingInfo.packageThreeDisCountedTotal
                            )}
                          </td>
                          <td className="tr-table-class font-14 text-white text-right"></td>
                        </>
                      )}
                    </tr>
                  </>
                )}

              {vatPercentage && (
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
                      Fees inc VAT (£)
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(RecurringPricingInfo.PackageOneGrandTotal)}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            RecurringPricingInfo.PackageTwoGrandTotal
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
                            RecurringPricingInfo.PackageThreeGrandTotal
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
                                        l.toUpperCase()
                                      ) + "..."}
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
                                        selectedPackagesList[0].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageOneValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageOneValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageOneID
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
                                        subService.packageOneID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    type="checkbox"
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageOneID,
                                        e.target.checked
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>
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
                                              .servicePackageID
                                        ) ? (
                                          // <span className="fa fa-times"></span>
                                          <span>-</span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageOneID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
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
                                            subService.packageTwoID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageTwoID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageTwoID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
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
                                            subService.packageThreeID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageThreeID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              // <span className="fa fa-times"></span>
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageThreeID
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
                            ","
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
                            OneOffPricingInfo.DiscountPercentagePackageOne
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageTwo
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageThree
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
                      ? formatValue(OneOffPricingInfo.packageOneDisCountedTotal)
                      : formatValue(totalOnePackageValueOneOff)
                    : formatValue(OneOffPricingInfo.packageOneNetTotal)}
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
                              OneOffPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValueOneOff)
                        : formatValue(OneOffPricingInfo.packageTwoNetTotal)}
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
                              OneOffPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValueOneOff)
                        : formatValue(OneOffPricingInfo.packageThreeNetTotal)}
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
                        (-) {formatValue(OneOffPricingInfo.packageOneDisCount)}
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
                            {formatValue(OneOffPricingInfo.packageTwoDisCount)}
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
                              OneOffPricingInfo.packageThreeDisCount
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
                          OneOffPricingInfo.packageOneDisCountedTotal
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
                              OneOffPricingInfo.packageTwoDisCountedTotal
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
                              OneOffPricingInfo.packageThreeDisCountedTotal
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

              {vatPercentage && (
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
                      Fees inc VAT (£)
                    </td>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {formatValue(OneOffPricingInfo.PackageOneGrandTotal)}
                    </td>
                    <td></td>
                    {packageCount >= 2 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(OneOffPricingInfo.PackageTwoGrandTotal)}
                        </td>
                        <td></td>
                      </>
                    )}
                    {packageCount == 3 && (
                      <>
                        <td className="tr-table-class font-14 text-white text-right">
                          {" "}
                          {formatValue(
                            OneOffPricingInfo.PackageThreeGrandTotal
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
                    Fees (£)
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
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                              formatValue(price)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 && formatValue(vat)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total)}
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                            100
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100
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
                              100
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100
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
                          {formatValue(RecurringPricingInfo.Discount)}
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
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                  RecurringPricingInfo.Discount
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(RecurringPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
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
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                              formatValue(price)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 && formatValue(vat)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total)}
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) / 100
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                              100
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                          {formatValue(OneOffPricingInfo.Discount)}
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  OneOffPricingInfo.Discount
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount
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
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(OneOffPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
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
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                              formatValue(price)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 && formatValue(vat)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total)}
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                            100
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100
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
                              100
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100
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
                          {formatValue(RecurringPricingInfo.Discount)}
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
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                  RecurringPricingInfo.Discount
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(RecurringPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    VAT Rate
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
                    Fees inc VAT (£)
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
                              formatValue(price)}
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
                              formatValue(total)}
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) / 100
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                              100
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                          {formatValue(OneOffPricingInfo.Discount)}
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  OneOffPricingInfo.Discount
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount
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
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        {/* Discounted Fees inc Total */}
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(OneOffPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
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
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                              formatValue(price)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 && formatValue(vat)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}{" "}
                            (20%)
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total)}
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
                      ? formatValue(RecurringPricingInfo.DiscountedPrice)
                      : formatValue(RecurringPricingInfo.OriginalPrice)}
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
                            100
                        )
                      : formatValue(
                          (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                            100
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
                              100
                        )
                      : formatValue(
                          Number(RecurringPricingInfo.OriginalPrice) +
                            (Number(RecurringPricingInfo.OriginalPrice) * 20) /
                              100
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
                          {formatValue(RecurringPricingInfo.Discount)}
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
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) +
                                  (Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (RecurringPricingInfo.DefaultDiscount / 100)
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
                                  RecurringPricingInfo.Discount
                              )
                            : formatValue(
                                RecurringPricingInfo.OriginalPrice -
                                  RecurringPricingInfo.Discount
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
                                    RecurringPricingInfo.DiscountedPrice
                                  ) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(RecurringPricingInfo.OriginalPrice) *
                                  20) /
                                  100 -
                                  ((Number(RecurringPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (RecurringPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(RecurringPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      RecurringPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                    Fees (£)
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
                    VAT (£)
                  </th>
                  <th
                    className="tr-table-class text-white text-center"
                    style={{ width: "16.66%" }}
                  >
                    Fees inc VAT (£)
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
                              formatValue(price)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}
                          </td>
                          {/* <td className="text-center">20%</td> */}
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 && formatValue(vat)}
                            {ProposalObject.feeTypeId === 2 && (
                              <span className="fa fa-check"></span>
                            )}{" "}
                            (20%)
                          </td>
                          <td className="text-center">
                            {ProposalObject.feeTypeId === 1 &&
                              formatValue(total)}
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
                      ? formatValue(OneOffPricingInfo.DiscountedPrice)
                      : formatValue(OneOffPricingInfo.OriginalPrice)}
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
                          (Number(OneOffPricingInfo.DiscountedPrice) * 20) / 100
                        )
                      : formatValue(
                          (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                              100
                        )
                      : formatValue(
                          Number(OneOffPricingInfo.OriginalPrice) +
                            (Number(OneOffPricingInfo.OriginalPrice) * 20) / 100
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
                          {formatValue(OneOffPricingInfo.Discount)}
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                ((Number(OneOffPricingInfo.OriginalPrice) *
                                  20) /
                                  100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) +
                                  (Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                  (OneOffPricingInfo.DefaultDiscount / 100)
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
                                  OneOffPricingInfo.Discount
                              )
                            : formatValue(
                                OneOffPricingInfo.OriginalPrice -
                                  OneOffPricingInfo.Discount
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
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )
                            : formatValue(
                                (Number(OneOffPricingInfo.OriginalPrice) * 20) /
                                  100 -
                                  ((Number(OneOffPricingInfo.OriginalPrice) *
                                    20) /
                                    100) *
                                    (OneOffPricingInfo.DefaultDiscount / 100)
                              )}
                        </td>
                        <td className="tr-table-class font-14 text-white text-center">
                          {" "}
                          {formatValue(OneOffPricingInfo.GrandTotal)}
                        </td>
                      </tr>
                    </>
                  )}

                {vatPercentage && (
                  <>
                    {/* <tr class="head-grey-row">
                                  <td className="tr-table-class font-14 text-white">
                                    VAT
                                  </td>
                                  <td className="tr-table-class font-14 text-white text-right">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.VATPrice
                                    )}
                                  </td>
                                </tr> */}
                    {/* <tr className="head-row">
                                  <td className="tr-table-class font-14 text-white">
                                    Grand Total
                                  </td>
                                  <td></td>
                                  <td className="tr-table-class font-14 text-white text-center">
                                    {" "}
                                    {formatValue(
                                      OneOffPricingInfo.GrandTotal
                                    )}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr> */}
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
                      Fees (£)
                    </th>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.vatRate && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      VAT Rate
                    </th>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.vat && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      VAT (£)
                    </th>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.feesIncVat && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      Fees inc VAT (£)
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {selectedRecurringServiceList.map((service, index) => {
                  return (
                    <>
                      {service.servicesList.map((subService, subIndex) => {
                        const price = subService.price || 0;
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
                                        {d.driverName} = {d.driverValue}
                                        {i !== driverList.length - 1 && ", "}
                                      </div>
                                    ))
                                  : "-"}
                              </td>
                            )}
                            {visibleFieldsCustomTemp.fees && (
                              <td className="text-center">
                                {ProposalObject.feeTypeId === 1 &&
                                  formatValue(price)}
                                {ProposalObject.feeTypeId === 2 && (
                                  <span className="fa fa-check"></span>
                                )}
                              </td>
                            )}
                            {vatPercentage &&
                              visibleFieldsCustomTemp.vatRate && (
                                <td className="text-center">
                                  {subService.service_vat_percentage}%
                                </td>
                              )}
                            {vatPercentage && visibleFieldsCustomTemp.vat && (
                              <td className="text-center">
                                {ProposalObject.feeTypeId === 1 &&
                                  formatValue(vat)}
                                {ProposalObject.feeTypeId === 2 && (
                                  <span className="fa fa-check"></span>
                                )}
                              </td>
                            )}
                            {vatPercentage &&
                              visibleFieldsCustomTemp.feesIncVat && (
                                <td className="text-center">
                                  {ProposalObject.feeTypeId === 1 &&
                                    formatValue(total)}
                                  {ProposalObject.feeTypeId === 2 && (
                                    <span className="fa fa-check"></span>
                                  )}
                                </td>
                              )}
                          </tr>
                        );
                      })}
                    </>
                  );
                })}

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
                        ? formatValue(RecurringPricingInfo.DiscountedPrice)
                        : formatValue(RecurringPricingInfo.OriginalPrice)}
                    </td>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.vatRate && (
                    <td></td>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.vat && (
                    <td className="tr-table-class text-white text-center">
                      {formatValue(Number(RecurringPricingInfo.staticTotalVAT))}
                    </td>
                  )}
                  {vatPercentage && visibleFieldsCustomTemp.feesIncVat && (
                    <td className="tr-table-class text-white text-center">
                      {Number(RecurringPricingInfo.OriginalPrice) <
                        Number(RecurringPricingInfo.DiscountedPrice) ||
                      (Number(RecurringPricingInfo.Discount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? formatValue(
                            Number(RecurringPricingInfo.DiscountedPrice) +
                              Number(RecurringPricingInfo.staticTotalVAT)
                          )
                        : formatValue(
                            Number(RecurringPricingInfo.OriginalPrice) +
                              Number(RecurringPricingInfo.staticTotalVAT)
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
                            (-) {formatValue(RecurringPricingInfo.Discount)}
                          </td>
                        )}
                        {vatPercentage && visibleFieldsCustomTemp.vatRate && (
                          <td></td>
                        )}
                        {vatPercentage && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class text-white text-center">
                            (-){" "}
                            {formatValue(
                              Number(RecurringPricingInfo.staticTotalVAT) -
                                Number(RecurringPricingInfo.totalServiceWiseVAT)
                            )}
                          </td>
                        )}
                        {vatPercentage &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              (-){" "}
                              {formatValue(
                                Number(RecurringPricingInfo.Discount) +
                                  (Number(RecurringPricingInfo.staticTotalVAT) -
                                    Number(
                                      RecurringPricingInfo.totalServiceWiseVAT
                                    ))
                              )}
                            </td>
                          )}
                      </tr>

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
                                    RecurringPricingInfo.Discount
                                )
                              : formatValue(
                                  RecurringPricingInfo.OriginalPrice -
                                    RecurringPricingInfo.Discount
                                )}
                          </td>
                        )}
                        {vatPercentage && visibleFieldsCustomTemp.vatRate && (
                          <td></td>
                        )}
                        {vatPercentage && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class font-14 text-white text-center">
                            {formatValue(
                              Number(RecurringPricingInfo.totalServiceWiseVAT)
                            )}
                          </td>
                        )}
                        {vatPercentage &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class font-14 text-white text-center">
                              {formatValue(RecurringPricingInfo.GrandTotal)}
                            </td>
                          )}
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
          </div>
        ) : serviceTypeID === servicePackageTypeID.OneOffServiceTypeID ? (
          <div style={{ marginTop: "0px" }} className="table-responsive">
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
                      Fees (£)
                    </th>
                  )}
                  {vatPercentageOneOff && visibleFieldsCustomTemp.vatRate && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      VAT Rate
                    </th>
                  )}
                  {vatPercentageOneOff && visibleFieldsCustomTemp.vat && (
                    <th
                      className="tr-table-class text-white text-center"
                      style={{ width: "16.66%" }}
                    >
                      VAT (£)
                    </th>
                  )}
                  {vatPercentageOneOff &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <th
                        className="tr-table-class text-white text-center"
                        style={{ width: "16.66%" }}
                      >
                        Fees inc VAT (£)
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
                                      {d.driverName} = {d.driverValue}
                                      {i !== driverList.length - 1 && ", "}
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
                                formatValue(price)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          )}

                          {visibleFieldsCustomTemp.vatRate && (
                            <td className="text-center">
                              {subService.service_vat_percentage}%
                            </td>
                          )}

                          {visibleFieldsCustomTemp.vat && (
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(vat)}
                              {ProposalObject.feeTypeId === 2 && (
                                <span className="fa fa-check"></span>
                              )}
                            </td>
                          )}

                          {visibleFieldsCustomTemp.feesIncVat && (
                            <td className="text-center">
                              {ProposalObject.feeTypeId === 1 &&
                                formatValue(total)}
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
                        ? formatValue(OneOffPricingInfo.DiscountedPrice)
                        : formatValue(OneOffPricingInfo.OriginalPrice)}
                    </td>
                  )}
                  {vatPercentageOneOff && visibleFieldsCustomTemp.vatRate && (
                    <td></td>
                  )}
                  {vatPercentageOneOff && visibleFieldsCustomTemp.vat && (
                    <td className="tr-table-class text-white text-center">
                      {formatValue(
                        Number(OneOffPricingInfo.staticTotalVATOneOff)
                      )}
                    </td>
                  )}
                  {vatPercentageOneOff &&
                    visibleFieldsCustomTemp.feesIncVat && (
                      <td className="tr-table-class text-white text-center">
                        {Number(OneOffPricingInfo.OriginalPrice) <
                          Number(OneOffPricingInfo.DiscountedPrice) ||
                        (Number(OneOffPricingInfo.Discount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? formatValue(
                              Number(OneOffPricingInfo.DiscountedPrice) +
                                Number(OneOffPricingInfo.staticTotalVATOneOff)
                            )
                          : formatValue(
                              Number(OneOffPricingInfo.OriginalPrice) +
                                Number(OneOffPricingInfo.staticTotalVATOneOff)
                            )}
                      </td>
                    )}
                </tr>

                {Number(OneOffPricingInfo.Discount) > 0 &&
                  ProposalObject.DiscountLines && (
                    <>
                      <tr class="head-grey-row">
                        <td className="tr-table-class font-14 text-white">
                          Discount
                        </td>

                        {visibleFieldsCustomTemp?.serviceCategory && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class text-white text-center">
                            {Number(OneOffPricingInfo.Discount) > 0
                              ? formatValue(OneOffPricingInfo.Discount)
                              : "-"}
                          </td>
                        )}
                        {vatPercentageOneOff &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentageOneOff && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class text-white text-center">
                            (-){"  "}
                            {formatValue(
                              Number(OneOffPricingInfo.staticTotalVATOneOff) -
                                Number(
                                  OneOffPricingInfo.totalServiceWiseVATOneOff
                                )
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              (-){"  "}{" "}
                              {formatValue(
                                Number(OneOffPricingInfo.Discount) +
                                  (Number(
                                    OneOffPricingInfo.staticTotalVATOneOff
                                  ) -
                                    Number(
                                      OneOffPricingInfo.totalServiceWiseVATOneOff
                                    ))
                              )}
                            </td>
                          )}
                      </tr>
                      <tr className="head-row">
                        <td className="tr-table-class font-14 text-white">
                          Grand Total
                        </td>

                        {visibleFieldsCustomTemp?.serviceCategory && <td></td>}
                        {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        {visibleFieldsCustomTemp.fees && (
                          <td className="tr-table-class text-white text-center">
                            {formatValue(OneOffPricingInfo.DiscountedPrice)}
                          </td>
                        )}
                        {vatPercentageOneOff &&
                          visibleFieldsCustomTemp.vatRate && <td></td>}
                        {vatPercentageOneOff && visibleFieldsCustomTemp.vat && (
                          <td className="tr-table-class text-white text-center">
                            {formatValue(
                              Number(
                                OneOffPricingInfo.totalServiceWiseVATOneOff
                              )
                            )}
                          </td>
                        )}
                        {vatPercentageOneOff &&
                          visibleFieldsCustomTemp.feesIncVat && (
                            <td className="tr-table-class text-white text-center">
                              {formatValue(
                                Number(OneOffPricingInfo.DiscountedPrice) +
                                  Number(
                                    OneOffPricingInfo.totalServiceWiseVATOneOff
                                  )
                              )}
                            </td>
                          )}
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
                      {visibleFieldsCustomTemp.vat && <td></td>}
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
                      <th
                        className="tr-table-class text-white text-right"
                        style={{ width: "16.66%" }}
                      >
                        Fees (£)
                      </th>

                      {visibleFieldsCustomTemp.vat && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          VAT (£)
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
                          <th colSpan={1 + packageCount}>
                            {service.serviceCatName}
                          </th>
                        )}

                        {/* <th></th> */}
                        {visibleFieldsCustomTemp.vat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        {packageCount >= 2 && (
                          <>
                            {visibleFieldsCustomTemp.vat && <th></th>}
                            {visibleFieldsCustomTemp.serviceScope && <th></th>}
                          </>
                        )}

                        {packageCount === 3 && (
                          <>
                            {visibleFieldsCustomTemp.vat && <th></th>}
                            {visibleFieldsCustomTemp.serviceScope && <th></th>}
                          </>
                        )}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const packageOnePrice = subService.packageOneValue || 0;
                        const packageTwoPrice = subService.packageTwoValue || 0;
                        const packageThreePrice =
                          subService.packageThreeValue || 0;
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
                                          l.toUpperCase()
                                        ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    subService.serviceName
                                  )}
                                </div>
                                <div className="package-variables"></div>
                              </td>
                            )}

                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div>
                                    {(subService.packageOneValue === 0 ||
                                      subService.packageOneValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[0].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageOneValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageOneValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageOneID
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
                                        subService.packageOneID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    type="checkbox"
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageOneID,
                                        e.target.checked
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>

                            {/* VAT */}

                            {visibleFieldsCustomTemp.vat && (
                              <>
                                {/* Package One */}
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      (subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ===
                                          selectedPackagesList[0]
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(vatOne)}`
                                      )
                                    ) : Number(subService.packageOneValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageOneID
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
                                            subService.packageOneID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageOneID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageOneID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
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
                                            subService.packageTwoID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        type="checkbox"
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                {visibleFieldsCustomTemp.vat && (
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(vatTwo)}`
                                        )
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
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
                                              subService.packageTwoID
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
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
                                                    .servicePackageID
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageTwoID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
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
                                            subService.packageThreeID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        type="checkbox"
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>

                                {visibleFieldsCustomTemp.vat && (
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(vatThree)}`
                                        )
                                      ) : Number(
                                          subService.packageThreeValue
                                        ) !== null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
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
                                              subService.packageThreeID
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
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
                                                    .servicePackageID
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageThreeID
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
                            ","
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
                            RecurringPricingInfo.DiscountPercentagePackageOne
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.vat && <th></th>}
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageTwo
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.vat && <th></th>}
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
                                ","
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
                                RecurringPricingInfo.DiscountPercentagePackageThree
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
                          RecurringPricingInfo.packageOneDisCountedTotal
                        )
                      : formatValue(totalOnePackageValue)
                    : formatValue(RecurringPricingInfo.packageOneNetTotal)}
                </td>
                {visibleFieldsCustomTemp.vat && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {formatValue(RecurringPricingInfo.PackageOneStaticVaTPrice)}
                  </td>
                )}
                {visibleFieldsCustomTemp.serviceScope && <td></td>}
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
                              RecurringPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValue)
                        : formatValue(RecurringPricingInfo.packageTwoNetTotal)}
                    </td>

                    {visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageTwoStaticVaTPrice
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
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
                              RecurringPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValue)
                        : formatValue(
                            RecurringPricingInfo.packageThreeNetTotal
                          )}
                    </td>

                    {visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          RecurringPricingInfo.PackageThreeStaticVaTPrice
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
                      <td className="tr-table-class font-14 text-white text-right">
                        (-){" "}
                        {formatValue(RecurringPricingInfo.packageOneDisCount)}
                      </td>

                      {visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            Number(
                              RecurringPricingInfo.PackageOneStaticVaTPrice
                            ) - Number(RecurringPricingInfo.PackageOneVaTPrice)
                          )}
                        </td>
                      )}

                      {visibleFieldsCustomTemp.serviceScope && <td></td>}

                      {/* <td className="tr-table-class font-14 text-white text-right"></td> */}
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageTwoDisCount
                            )}
                          </td>

                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(
                                  RecurringPricingInfo.PackageTwoStaticVaTPrice
                                ) -
                                  Number(
                                    RecurringPricingInfo.PackageTwoVaTPrice
                                  )
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
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              RecurringPricingInfo.packageThreeDisCount
                            )}
                          </td>

                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(
                                  RecurringPricingInfo.PackageThreeStaticVaTPrice
                                ) -
                                  Number(
                                    RecurringPricingInfo.PackageThreeVaTPrice
                                  )
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
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>

                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        {/* Fees inc VAT (£) */}
                        Grand Total
                      </td>
                      {/* <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(RecurringPricingInfo.PackageOneGrandTotal)}
                      </td> */}
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalOnePackageValue >
                          Number(RecurringPricingInfo.packageOneNetTotal) ||
                        (Number(RecurringPricingInfo.packageOneDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(RecurringPricingInfo.packageOneDisCount) >
                              0 && !ProposalObject.DiscountLines
                            ? formatValue(
                                RecurringPricingInfo.packageOneDisCountedTotal -
                                  RecurringPricingInfo.packageOneDisCount
                              )
                            : formatValue(
                                totalOnePackageValue -
                                  RecurringPricingInfo.packageOneDisCount
                              )
                          : formatValue(
                              RecurringPricingInfo.packageOneNetTotal -
                                RecurringPricingInfo.packageOneDisCount
                            )}
                      </td>
                      {visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {formatValue(RecurringPricingInfo.PackageOneVaTPrice)}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageTwoGrandTotal
                            )}
                          </td>
                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout -
                                  (RecurringPricingInfo.PackageTwoVaTPriceWithoutDiscout *
                                    RecurringPricingInfo.DiscountPercentagePackageTwo) /
                                    100
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount == 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              RecurringPricingInfo.PackageThreeGrandTotal
                            )}
                          </td>
                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout -
                                  (RecurringPricingInfo.PackageThreeVaTPriceWithoutDiscout *
                                    RecurringPricingInfo.DiscountPercentagePackageThree) /
                                    100
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
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
                      {visibleFieldsCustomTemp.vat && <td></td>}
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
                      {/* <td
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
                      </td> */}

                      <th
                        className="tr-table-class text-white text-right"
                        style={{ width: "16.66%" }}
                      >
                        Fees (£)
                      </th>
                      {visibleFieldsCustomTemp.vat && (
                        <th
                          className="tr-table-class text-white text-right"
                          style={{ width: "16.66%" }}
                        >
                          VAT (£)
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
                          <th colSpan={1 + packageCount}>
                            {service.serviceCatName}
                          </th>
                        )}

                        {/* <th></th> */}
                        {visibleFieldsCustomTemp.vat && <th></th>}
                        {visibleFieldsCustomTemp.serviceScope && <th></th>}
                        {packageCount >= 2 && (
                          <>
                            {visibleFieldsCustomTemp.vat && <th></th>}
                            {visibleFieldsCustomTemp.serviceScope && <th></th>}
                          </>
                        )}

                        {packageCount === 3 && (
                          <>
                            {visibleFieldsCustomTemp.vat && <th></th>}
                            {visibleFieldsCustomTemp.serviceScope && <th></th>}
                          </>
                        )}
                      </tr>
                      {service.servicesList.map((subService, subIndex) => {
                        const packageOnePrice = subService.packageOneValue || 0;
                        const packageTwoPrice = subService.packageTwoValue || 0;
                        const packageThreePrice =
                          subService.packageThreeValue || 0;
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
                                          l.toUpperCase()
                                        ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    subService.serviceName
                                  )}
                                </div>
                                <div className="package-variables"></div>
                              </td>
                            )}

                            <td className="text-right">
                              <div className="flex-end-item">
                                {ProposalObject.feeTypeId === 1 ? (
                                  <div>
                                    {(subService.packageOneValue === 0 ||
                                      subService.packageOneValue === null) &&
                                    !subService.servicePackageIDs.some(
                                      (item) =>
                                        item ==
                                        selectedPackagesList[0].servicePackageID
                                    ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : !subService?.servicePackageIDs.includes(
                                        subService.packageOneID
                                      ) ? (
                                      <span className="fa fa-times"></span>
                                    ) : (
                                      ` ${formatValue(
                                        subService.packageOneValue
                                      )}`
                                    )}
                                  </div>
                                ) : Number(subService.packageOneValue) !==
                                    null &&
                                  subService?.servicePackageIDs.includes(
                                    subService.packageOneID
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
                                        subService.packageOneID
                                      ) &&
                                      subService?.servicePackageIDs.length === 1
                                    }
                                    type="checkbox"
                                    checked={subService?.servicePackageIDs.includes(
                                      subService.packageOneID
                                    )}
                                    onChange={(e) =>
                                      handleAddAndRemoveAdditionalServices(
                                        1,
                                        service.serviceCatID,
                                        subService.serviceID,
                                        subService.packageOneID,
                                        e.target.checked
                                      )
                                    }
                                  />
                                ) : (
                                  <div>&nbsp;&nbsp;</div>
                                )}
                              </div>
                            </td>

                            {/* VAT */}

                            {visibleFieldsCustomTemp.vat && (
                              <>
                                {/* Package One */}
                                <td className="text-right">
                                  <div className="flex-end-item">
                                    {ProposalObject.feeTypeId === 1 ? (
                                      (subService.packageOneValue === 0 ||
                                        subService.packageOneValue === null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ===
                                          selectedPackagesList[0]
                                            .servicePackageID
                                      ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : !subService?.servicePackageIDs.includes(
                                          subService.packageOneID
                                        ) ? (
                                        <span className="fa fa-times"></span>
                                      ) : (
                                        ` ${formatValue(vatOne)}`
                                      )
                                    ) : Number(subService.packageOneValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageOneID
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
                                            subService.packageOneID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageOneID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
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
                                                  .servicePackageID
                                            ) ? (
                                              <span>-</span>
                                            ) : !subService?.servicePackageIDs.includes(
                                                subService.packageOneID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageTwoValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageTwoValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageTwoID
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
                                            subService.packageTwoID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        type="checkbox"
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>
                                {visibleFieldsCustomTemp.vat && (
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(vatTwo)}`
                                        )
                                      ) : Number(subService.packageTwoValue) !==
                                          null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageTwoID
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
                                              subService.packageTwoID
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageTwoID
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
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
                                                    .servicePackageID
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageTwoID
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(
                                            subService.packageThreeValue
                                          )}`
                                        )}
                                      </div>
                                    ) : Number(subService.packageThreeValue) !==
                                        null &&
                                      subService?.servicePackageIDs.includes(
                                        subService.packageThreeID
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
                                            subService.packageThreeID
                                          ) &&
                                          subService?.servicePackageIDs
                                            .length === 1
                                        }
                                        type="checkbox"
                                        checked={subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
                                        )}
                                        onChange={(e) =>
                                          handleAddAndRemoveAdditionalServices(
                                            1,
                                            service.serviceCatID,
                                            subService.serviceID,
                                            subService.packageOneID,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    ) : (
                                      <div>&nbsp;&nbsp;</div>
                                    )}
                                  </div>
                                </td>

                                {visibleFieldsCustomTemp.vat && (
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
                                              .servicePackageID
                                        ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : !subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          ) ? (
                                          <span className="fa fa-times"></span>
                                        ) : (
                                          ` ${formatValue(vatThree)}`
                                        )
                                      ) : Number(
                                          subService.packageThreeValue
                                        ) !== null &&
                                        subService?.servicePackageIDs.includes(
                                          subService.packageThreeID
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
                                              subService.packageThreeID
                                            ) &&
                                            subService?.servicePackageIDs
                                              .length === 1
                                          }
                                          checked={subService?.servicePackageIDs.includes(
                                            subService.packageThreeID
                                          )}
                                          onChange={(e) =>
                                            handleAddAndRemoveAdditionalServices(
                                              1,
                                              service.serviceCatID,
                                              subService.serviceID,
                                              subService.packageOneID,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      ) : (
                                        <div>&nbsp;&nbsp;</div>
                                      )}
                                    </div>
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
                                                    .servicePackageID
                                              ) ? (
                                                <span>-</span>
                                              ) : !subService?.servicePackageIDs.includes(
                                                  subService.packageThreeID
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
                            ","
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
                            OneOffPricingInfo.DiscountPercentagePackageOne
                          )}
                        </div>
                      </div>
                    </td>

                    {packageCount >= 2 && (
                      <>
                        {visibleFieldsCustomTemp.vat && <th></th>}
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageTwo
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}

                    {packageCount === 3 && (
                      <>
                        {visibleFieldsCustomTemp.vat && <th></th>}
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
                                ","
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
                                OneOffPricingInfo.DiscountPercentagePackageThree
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
                    Number(OneOffPricingInfo.packageOneNetTotal) ||
                  (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                    !ProposalObject.DiscountLines)
                    ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                      !ProposalObject.DiscountLines
                      ? formatValue(OneOffPricingInfo.packageOneDisCountedTotal)
                      : formatValue(totalOnePackageValue)
                    : formatValue(OneOffPricingInfo.packageOneNetTotal)}
                </td>
                {/* Net VAT */}
                {visibleFieldsCustomTemp.vat && (
                  <td className="tr-table-class font-14 text-white text-right">
                    {" "}
                    {formatValue(
                      Number(OneOffPricingInfo.PackageOneStaticVaTPrice)
                    )}
                  </td>
                )}
                {visibleFieldsCustomTemp.serviceScope && <td></td>}
                {packageCount >= 2 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalTwoPackageValue >
                        Number(OneOffPricingInfo.packageTwoNetTotal) ||
                      (Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageTwoDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageTwoDisCountedTotal
                            )
                          : formatValue(totalTwoPackageValue)
                        : formatValue(OneOffPricingInfo.packageTwoNetTotal)}
                    </td>
                    {/* Net VAT */}
                    {visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(
                          Number(OneOffPricingInfo.PackageTwoStaticVaTPrice)
                        )}
                      </td>
                    )}
                    {visibleFieldsCustomTemp.serviceScope && <td></td>}
                  </>
                )}{" "}
                {packageCount === 3 && (
                  <>
                    <td className="tr-table-class font-14 text-white text-right">
                      {" "}
                      {totalThreePackageValue >
                        Number(OneOffPricingInfo.packageThreeNetTotal) ||
                      (Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                        !ProposalObject.DiscountLines)
                        ? Number(OneOffPricingInfo.packageThreeDisCount) > 0 &&
                          !ProposalObject.DiscountLines
                          ? formatValue(
                              OneOffPricingInfo.packageThreeDisCountedTotal
                            )
                          : formatValue(totalThreePackageValue)
                        : formatValue(OneOffPricingInfo.packageThreeNetTotal)}
                    </td>
                    {/* Net VAT */}
                    {visibleFieldsCustomTemp.vat && (
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {Number(OneOffPricingInfo.PackageThreeStaticVaTPrice)}
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
                      <td className="tr-table-class font-14 text-white text-right">
                        (-) {formatValue(OneOffPricingInfo.packageOneDisCount)}
                      </td>
                      {/* Discounted VAT */}

                      {visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          (-){" "}
                          {formatValue(
                            Number(OneOffPricingInfo.PackageOneStaticVaTPrice) -
                              Number(OneOffPricingInfo.PackageOneVaTPrice)
                          )}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}

                      {/* <td className="tr-table-class font-14 text-white text-right"></td> */}
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(OneOffPricingInfo.packageTwoDisCount)}
                          </td>
                          {/* Discounted VAT */}
                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(
                                  OneOffPricingInfo.PackageTwoStaticVaTPrice
                                ) - Number(OneOffPricingInfo.PackageTwoVaTPrice)
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount === 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            (-){" "}
                            {formatValue(
                              OneOffPricingInfo.packageThreeDisCount
                            )}
                          </td>

                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              (-){" "}
                              {formatValue(
                                Number(
                                  OneOffPricingInfo.PackageThreeStaticVaTPrice
                                ) -
                                  Number(OneOffPricingInfo.PackageThreeVaTPrice)
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                    </tr>

                    <tr className="head-row">
                      <td className="tr-table-class font-14 text-white">
                        {/* Fees inc VAT (£) */}
                        Grand Total
                      </td>
                      {/* <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {formatValue(OneOffPricingInfo.PackageOneGrandTotal)}
                      </td> */}
                      <td className="tr-table-class font-14 text-white text-right">
                        {" "}
                        {totalOnePackageValue >
                          Number(OneOffPricingInfo.packageOneNetTotal) ||
                        (Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                          !ProposalObject.DiscountLines)
                          ? Number(OneOffPricingInfo.packageOneDisCount) > 0 &&
                            !ProposalObject.DiscountLines
                            ? formatValue(
                                OneOffPricingInfo.packageOneDisCountedTotal -
                                  OneOffPricingInfo.packageOneDisCount
                              )
                            : formatValue(
                                totalOnePackageValue -
                                  OneOffPricingInfo.packageOneDisCount
                              )
                          : formatValue(
                              OneOffPricingInfo.packageOneNetTotal -
                                OneOffPricingInfo.packageOneDisCount
                            )}
                      </td>
                      {visibleFieldsCustomTemp.vat && (
                        <td className="tr-table-class font-14 text-white text-right">
                          {formatValue(
                            Number(OneOffPricingInfo.PackageOneVaTPrice)
                          )}
                        </td>
                      )}
                      {visibleFieldsCustomTemp.serviceScope && <td></td>}
                      {packageCount >= 2 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.PackageTwoGrandTotal
                            )}
                          </td>
                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageTwoVaTPrice)
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
                        </>
                      )}
                      {packageCount == 3 && (
                        <>
                          <td className="tr-table-class font-14 text-white text-right">
                            {" "}
                            {formatValue(
                              OneOffPricingInfo.PackageThreeGrandTotal
                            )}
                          </td>
                          {visibleFieldsCustomTemp.vat && (
                            <td className="tr-table-class font-14 text-white text-right">
                              {formatValue(
                                Number(OneOffPricingInfo.PackageThreeVaTPrice)
                              )}
                            </td>
                          )}
                          {visibleFieldsCustomTemp.serviceScope && <td></td>}
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
  ];

  console.log(RecurringPricingInfo, "RecurringPricingInfo");

  const ALL_COLUMNS = [
    { id: "serviceCategory", label: "Service Category" },
    { id: "serviceName", label: "Service Name" },
    { id: "vatRate", label: "VAT Rate" },
    { id: "vat", label: "VAT" },
    { id: "fees", label: "Fees" },
    { id: "serviceScope", label: "Service Scope" },
    { id: "feesIncVat", label: "Fees inc VAT" },
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
    if (field === "vatRate") return "VAT Rate";
    if (field === "feesIncVat") return "Fees Inc VAT";
    if (field === "vat") return "VAT";

    // Default behavior
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  console.log("vatPercentage", vatPercentage);

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
                            ? vatPercentage === null
                              ? field === "serviceName" ||
                                field === "fees" ||
                                field === "feesIncVat" ||
                                field === "vatRate" ||
                                field === "vat"
                              : field === "serviceName"
                            : serviceTypeID ===
                              servicePackageTypeID.OneOffServiceTypeID
                            ? vatPercentage === null
                              ? field === "serviceName" ||
                                field === "fees" ||
                                field === "feesIncVat" ||
                                field === "vatRate" ||
                                field === "vat"
                              : field === "serviceName"
                            : serviceTypeID ===
                              servicePackageTypeID.RecurringPackageTypeID
                            ? vatPercentage === null
                              ? field === "serviceName" ||
                                field === "fees" ||
                                field === "feesIncVat" ||
                                field === "vatRate" ||
                                field === "vat"
                              : field === "serviceName"
                            : servicePackageTypeID.OneOffPackageTypeID
                            ? vatPercentage === null
                              ? field === "serviceName" ||
                                field === "fees" ||
                                field === "feesIncVat" ||
                                field === "vatRate" ||
                                field === "vat"
                              : field === "serviceName"
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
                    checked={
                      serviceTypeID ===
                      servicePackageTypeID.RecurringServiceTypeID
                        ? selectedTemplateID === templates[6].id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffServiceTypeID
                        ? selectedTemplateIDOneOff === templates[6].id
                        : serviceTypeID ===
                          servicePackageTypeID.RecurringPackageTypeID
                        ? selectedTemplateID === templates[6].id
                        : serviceTypeID ===
                          servicePackageTypeID.OneOffPackageTypeID
                        ? selectedTemplateIDOneOff === templates[6].id
                        : null
                    }
                    onChange={() => {
                      if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringServiceTypeID
                      ) {
                        setSelectedTemplateID(templates[6].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffServiceTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates[6].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.RecurringPackageTypeID
                      ) {
                        setSelectedTemplateID(templates[6].id);
                      } else if (
                        serviceTypeID ===
                        servicePackageTypeID.OneOffPackageTypeID
                      ) {
                        setSelectedTemplateIDOneOff(templates[6].id);
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
