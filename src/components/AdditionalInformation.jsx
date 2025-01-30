import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { ERROR_MESSAGES } from "./GlobalMessage";
import { Util } from "reactstrap";
import Utils from "../Middleware/Utils";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import { Tooltip } from "@mui/material";
import Text_Editor from "./Text_Editor";
import { statusID } from "../Middleware/enums";
export const AdditionalInformation = (props) => {
    const moduleNameForSaveAsDraft = "AdditionalInformation"
    const { isValidEmail, isMobile } =
        useContext(AuthContextProvider);

    const HandleAdditionalInformation = (
        value,
        globalPricingDriverID,
        variationID,
        prevId
    ) => {
        let formattedInput;
        props.DisableTabOnChange()
        if (value.variationValue === undefined) {
            const inputValue = value;
            // Allow only numeric and dot characters, limit to 7 characters
            const sanitizedInput = inputValue?.replace(/[^0-9.]/g, "")?.slice(0, 15);

            // Split the input into integer and decimal parts
            const [integerPart, decimalPart] = sanitizedInput.split(".");
            const formattedIntegerPart = integerPart;

            // Combine integer and decimal parts with appropriate precision
            formattedInput =
                decimalPart !== undefined
                    ? `${formattedIntegerPart.slice(0, 11)}.${decimalPart.slice(0, 2)}`
                    : formattedIntegerPart.slice(0, 11);
        }
        const variationMatches = prevId?.variation?.map((i) => i.variationID);
        const updateAdditionalInformationList = props.additionalInformationList.map(
            (additionalInformation) => {
                if (
                    additionalInformation.globalPricingDriverID ===
                    globalPricingDriverID &&
                    variationID === undefined &&
                    value.variationValue !== undefined
                ) {
                    const updatedSlab = additionalInformation.slab.map((slab) => ({
                        ...slab,
                        isDefault: slab.slabID === value.value ? true : false,
                    }));
                    return {
                        ...additionalInformation,
                        slab: updatedSlab,
                        driverValue: additionalInformation.slab.filter(Slab => Slab.slabID == value.value && Slab.slabTypeID == 1).map(slabsValue => slabsValue.slabValue).join(', ') || null,
                        // value.variationValue === undefined ? value : value.variationValue,
                    };
                }
                if (
                    additionalInformation.globalPricingDriverID ===
                    globalPricingDriverID &&
                    variationID !== null &&
                    value.variationValue !== undefined
                ) {
                    const updatedVariations = additionalInformation.variation.map(
                        (variation) => ({
                            ...variation,
                            isDefault: variation.variationID === value.value ? true : false,
                        })
                    );
                    return {
                        ...additionalInformation,
                        variation: updatedVariations,
                        driverValue:
                            additionalInformation.variation.filter(variation => variation.variationID === value.value).map(varValue => varValue.variationValue).join(', '),
                    };
                }
                if (
                    additionalInformation.globalPricingDriverID ===
                    globalPricingDriverID &&
                    value.variationValue === undefined
                ) {
                    return {
                        ...additionalInformation,
                        driverValue: formattedInput.replace(/-/g, (match, index) => index === 0 ? match : "")

                    };
                }
                if (additionalInformation.dependsOnVariationID === variationID) {
                    return {
                        ...additionalInformation,
                        driverVisibility: true,
                    };
                } else if (
                    variationMatches?.includes(additionalInformation.dependsOnVariationID)
                ) {
                    return {
                        ...additionalInformation,
                        driverVisibility: false,
                        driverValue: null,
                    };
                }

                return additionalInformation;
            }
        );
        props.setAdditionalInformationList(updateAdditionalInformationList);
    };

    const OnIncrementalValueChange = (slabObject, slabValue) => {
        props.DisableTabOnChange();
        const inputValue = slabValue.replace(/[^0-9.-]/g, ""); // Allow only numeric, dot, comma, and hyphen characters

        const sanitizedInput = inputValue;
        // Split the input into integer and decimal parts
        const [integerPart, decimalPart] = sanitizedInput.split(".");
        // Combine integer and decimal parts with appropriate precision
        let formattedInput;
        if (decimalPart !== undefined) {
            if (integerPart.includes("-")) {
                // For negative values, ensure 5 digits after the negative sign
                formattedInput = `-${integerPart.slice(
                    1,
                    13
                )}.${decimalPart.slice(0, 2)}`;
            } else {
                // For positive values, limit to 5 digits before the decimal point
                formattedInput = `${integerPart.slice(
                    0,
                    12
                )}.${decimalPart.slice(0, 2)}`;
            }
        } else {
            // No decimal part, limit to 5 digits
            formattedInput = integerPart.includes(
                "-"
            )
                ? `-${integerPart.slice(1, 13)}`
                : `${integerPart.slice(0, 12)}`;
        }
        const slabId = slabObject.slab.filter(item => item.isDefault === true).map(Id => Id.slabID)[0];
        let updatedAdditionalInformationList = props.additionalInformationList.map(Driver => {
            if (Driver.slab?.some(slab => slab.slabID === slabId)) {
                return {
                    ...Driver,
                    driverValue: formattedInput.replace(/-/g, (match, index) => index === 0 ? match : ""),
                    slab: Driver.slab.map(slab => {
                        if (slab.slabID === slabId && slab.isDefault === true) {
                            return {
                                ...slab,
                                slabValue: formattedInput.replace(/-/g, (match, index) => index === 0 ? match : "")// Assuming formattedInput is your desired new value
                            };
                        }
                        return slab; // Preserve other slabs
                    })
                };
            }
            return Driver; // Preserve Driver if no matching slabID found
        });

        props.setAdditionalInformationList(updatedAdditionalInformationList);
    }

    const handleSignatoryBlock = (index, field, e) => {
        props.DisableTabOnChange()
        const updatedSignatoriesList = [...props?.contractSignatoriesList]; // Create a copy of the existing list

        if (field === "signaturePositionID") {
            updatedSignatoriesList[index][field] = e.value; // Use square brackets notation to dynamically set the property
        } else {
            updatedSignatoriesList[index][field] = e; // Use square brackets notation to dynamically set the property
            if (field == "emailID") {
                if (props.isDuplicateEmail(e, index)) {
                    props.setEmailError(`Duplicate email should not be allowed `);
                    // scrollUpDownByElementID(`EmailError`);
                } else {
                    props.setEmailError("")
                }
            }
        }
        props?.setContractSignatoriesList(updatedSignatoriesList); // Update the state with the modified list
    }

    return (
        <div>
            <div className="create-practice-height scrollbar">
                <div className="tab-content">
                    <div class="tab-pane p-3 active">
                        {props.additionalInformationList?.filter(item => item.driverTypeID !== 1)?.map((i) => {
                            return (
                                <div class="row fieldset add-new-package">
                                    {i.driverVisibility && i.driverTypeID === 2 && (
                                        <>
                                            <div className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-md-5 col-sm-12 text-start text-md-start" : "col-md-3 col-sm-12 text-start text-md-end"}
                                            >
                                                <div class="">
                                                    <label class="form-label">
                                                        {isMobile ? (
                                                            <>
                                                                {i?.driverName.substring(0, 30).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(props.moduleName === "Package" || props.moduleName === "Quote") ? (
                                                                    i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                ) : (
                                                                    i?.driverName.length > 20 ? (
                                                                        <Tooltip title={i?.driverName}>
                                                                            {i?.driverName.substring(0, 25).toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) + '...'}
                                                                        </Tooltip>
                                                                    ) : (
                                                                        i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                        <span class="text-danger">*</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div id={`${i?.driverName}`} className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-lg-7 col-md-9 col-sm-12" : "col-lg-9 col-md-9 col-sm-12"}>
                                                <div class="mb-1">
                                                    <div class="input-group">
                                                        <input
                                                            type="text"
                                                            class="input-text"
                                                            placeholder={i?.driverName}
                                                            value={i.driverValue === null ? "" : i.driverValue}
                                                            onChange={(e) =>
                                                                HandleAdditionalInformation(
                                                                    e.target.value,
                                                                    i.globalPricingDriverID
                                                                )
                                                            }
                                                        />
                                                        {props.requireMessage &&
                                                            (i.driverValue === null ||
                                                                i.driverValue === undefined ||
                                                                i.driverValue === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {i.driverVisibility && i.driverTypeID === 3 && (
                                        <>

                                            <div className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-md-5 col-sm-12 text-start text-md-start" : "col-md-3 col-sm-12 text-start text-md-end"}>
                                                <div class="">
                                                    <label class="form-label">
                                                        {isMobile ? (
                                                            <>
                                                                {i?.driverName.substring(0, 30).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(props.moduleName === "Package" || props.moduleName === "Quote") ? (
                                                                    i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                ) : (
                                                                    i?.driverName.length > 20 ? (
                                                                        <Tooltip title={i?.driverName}>
                                                                            {i?.driverName.substring(0, 25).toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) + '...'}
                                                                        </Tooltip>
                                                                    ) : (
                                                                        i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                        <span class="text-danger">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div id={`${i?.driverName}`} className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-lg-7 col-md-9 col-sm-12" : "col-lg-9 col-md-9 col-sm-12"} >
                                                <div class="mb-1 ">
                                                    <div class="input-group">
                                                        <Select
                                                            options={i.variation?.map((item) => ({
                                                                value: item.variationID,
                                                                label: item.variationName,
                                                                variationValue: item.variationValue,
                                                            }))}
                                                            value={
                                                                i?.variation.filter((variation) => variation.isDefault === true).map((i) => ({
                                                                    value: i.variationID,
                                                                    label: i.variationName
                                                                }))
                                                            }
                                                            onChange={(value) =>
                                                                HandleAdditionalInformation(
                                                                    value,
                                                                    i.globalPricingDriverID,
                                                                    value.value,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                        {props.requireMessage &&
                                                            (i.driverValue === null ||
                                                                i.driverValue === undefined ||
                                                                i.driverValue === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {/* props.moduleName === "Package" */}

                                    {/* working here  */}
                                    {i.driverVisibility && i.driverTypeID === 4 && (
                                        <>
                                            <div className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-md-5 col-sm-12 text-start text-md-start" : "col-md-3 col-sm-12 text-start text-md-end"}>

                                                {/* <div class="col-md-5 col-sm-12 text-start text-md-start"> */}
                                                <div class="">
                                                    <label class="form-label">
                                                        {isMobile ? (
                                                            <>
                                                                {i?.driverName.substring(0, 30).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(props.moduleName === "Package" || props.moduleName === "Quote") ? (
                                                                    i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                ) : (
                                                                    i?.driverName.length > 20 ? (
                                                                        <Tooltip title={i?.driverName}>
                                                                            {i?.driverName.substring(0, 25).toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) + '...'}
                                                                        </Tooltip>
                                                                    ) : (
                                                                        i?.driverName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                        <span class="text-danger">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div id={`${i?.driverName}`} className={(props.moduleName === "Package" || props.moduleName === "Quote") ? "col-lg-7 col-md-9 col-sm-12" : "col-lg-9 col-md-9 col-sm-12"}>
                                                <div class="mb-1 ">
                                                    <div class="input-group">
                                                        <Select
                                                            options={i.slab?.map((item) => ({
                                                                value: item.slabID,
                                                                label: item.slabTypeID === 2 ? "Other" : `${item.slabFrom.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - ${item.slabTo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                                                                variationValue: item.slabValue,
                                                            }))}
                                                            value={
                                                                i?.slab?.filter((slab) => slab.isDefault === true).map((i) => ({
                                                                    value: i.slabID,
                                                                    label: i.slabTypeID === 2 ? "Other" : `${i.slabFrom.toString()
                                                                        .replace(
                                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                                            ","
                                                                        )} - ${i.slabTo.toString()
                                                                            .replace(
                                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                                ","
                                                                            )}`
                                                                }))
                                                            }
                                                            onChange={(value) =>
                                                                HandleAdditionalInformation(
                                                                    value,
                                                                    i.globalPricingDriverID
                                                                )
                                                            }
                                                        />
                                                        {props.requireMessage && i?.slab?.some(slab => slab.isDefault && slab.slabTypeID !== 2) &&
                                                            (i.driverValue === null ||
                                                                i.driverValue === undefined ||
                                                                i.driverValue === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {i?.slab
                                                ?.filter((slab) => slab.isDefault === true)
                                                .map((item) => {
                                                    if (item.slabTypeID === 2) {
                                                        return (
                                                            <React.Fragment key={i?.driverName}>
                                                                <div
                                                                    className={
                                                                        props.moduleName === "Package" || props.moduleName === "Quote"
                                                                            ? "col-md-5 col-sm-12 text-start text-md-start"
                                                                            : "col-md-3 col-sm-12 text-start text-md-end"
                                                                    }
                                                                >
                                                                    <div>
                                                                        <label className="form-label"></label>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    id={`${i?.driverName}`}
                                                                    className={
                                                                        props.moduleName === "Package" || props.moduleName === "Quote"
                                                                            ? "col-lg-7 col-md-9 col-sm-12"
                                                                            : "col-lg-9 col-md-9 col-sm-12"
                                                                    }
                                                                >
                                                                    <div className="mb-1 d-flex flex-column justify-content-end h-100">
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="text"
                                                                                value={i?.driverValue
                                                                                    ?.toString()
                                                                                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                                onChange={(e) => {
                                                                                    OnIncrementalValueChange(i, e.target.value);
                                                                                }}
                                                                                className="input-text mt-2"
                                                                                placeholder={i.driverName}
                                                                            />
                                                                        </div>
                                                                        {props.requireMessage &&
                                                                            (i.driverValue === null ||
                                                                                i.driverValue === undefined ||
                                                                                i.driverValue === "") && (
                                                                                <label className="validation">{ERROR_MESSAGES}</label>
                                                                            )}
                                                                        {props.requireMessage &&
                                                                            (i.driverValue === "." || i.driverValue === "-") && (
                                                                                <label className="validation">Invalid Value</label>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {props.moduleName == "Contract" &&
                            (<div id="SignatoryBlockDiv">
                                <h3 class="modal-title">
                                    Signatories
                                </h3>
                                <div class="separator"></div>
                                {props?.contractSignatoriesList?.map((signatory, index) => {
                                    return (
                                        <div id={`contract-signatory-${index}`} className="fieldset-group mb-4" key={index}>
                                            <div>
                                                <label className="fieldset-group-label">
                                                    {Utils.stringifyNumber(index + 1)} Signatory
                                                </label>
                                                <label className="fieldset-group-label-1 required">
                                                    {props.contractSignatoriesList?.length === 1 ? null : (
                                                        <button onClick={() => props.deleteSignatory(index)} className="btn btn-sm btn-danger delete-fieldset-group">
                                                            <i className="bi bi-trash3 margin-right "></i>{' '}
                                                            <span className="d-none d-sm-inline">Delete Signature</span>
                                                        </button>
                                                    )}
                                                </label>
                                                <div className="row fieldset">
                                                    <div className="col-lg-3 col-md-3 col-sm-12 text-start text-md-end">
                                                        <label className="fieldset-label required">First Name <span style={{ color: "#ec4561" }}>*</span></label>
                                                    </div>
                                                    <div className="col-lg-9 col-md-9 col-sm-12 ">
                                                        <input
                                                            type="text"
                                                            className="input-text"
                                                            placeholder="First Name"
                                                            value={props?.contractSignatoriesList[index]?.firstName}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value.trim();
                                                                // Reject input if it contains numeric characters
                                                                // Remove all spaces and dots
                                                                const cleanedValue = inputValue.replace(
                                                                    /[.\s]/g,
                                                                    ""
                                                                );
                                                                // Reject input if it starts with a digit
                                                                if (/\d/.test(cleanedValue)) {
                                                                    return;
                                                                }
                                                                const capitalizedValue =
                                                                    cleanedValue.charAt(0).toUpperCase() +
                                                                    cleanedValue.slice(1);
                                                                handleSignatoryBlock(index, "firstName", capitalizedValue)

                                                            }}
                                                            maxLength={30}
                                                        />
                                                        {props.requireMessage &&
                                                            (props?.contractSignatoriesList[index]?.firstName === null ||
                                                                props?.contractSignatoriesList[index]?.firstName === undefined ||
                                                                props?.contractSignatoriesList[index]?.firstName === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <div className="mb-2"></div>
                                                    <div className="col-lg-3 col-md-3 col-sm-12 text-start text-md-end">
                                                        <label className="fieldset-label required">Last Name <span style={{ color: "#ec4561" }}>*</span></label>
                                                    </div>
                                                    <div className="col-lg-9 col-md-9 col-sm-12 ">
                                                        <input
                                                            type="text"
                                                            className="input-text"
                                                            placeholder="Last Name"
                                                            value={props?.contractSignatoriesList[index]?.lastName}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value.trim();
                                                                // Reject input if it contains numeric characters
                                                                // Remove all spaces and dots
                                                                const cleanedValue = inputValue.replace(
                                                                    /[.\s]/g,
                                                                    ""
                                                                );
                                                                // Reject input if it starts with a digit
                                                                if (/\d/.test(cleanedValue)) {
                                                                    return;
                                                                }
                                                                const capitalizedValue =
                                                                    cleanedValue.charAt(0).toUpperCase() +
                                                                    cleanedValue.slice(1);
                                                                handleSignatoryBlock(index, "lastName", capitalizedValue)
                                                            }}
                                                            maxLength={30} />
                                                        {props.requireMessage &&
                                                            (props?.contractSignatoriesList[index]?.lastName === null ||
                                                                props?.contractSignatoriesList[index]?.lastName === undefined ||
                                                                props?.contractSignatoriesList[index]?.lastName === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="row fieldset ">
                                                    <div className="col-md-3 col-sm-12 text-start text-md-end">
                                                        <label className="fieldset-label required">Email <span style={{ color: "#ec4561" }}>*</span></label>
                                                    </div>
                                                    <div className="col-md-9 col-sm-12 ">
                                                        <input
                                                            type="text"
                                                            className="input-text"
                                                            value={props?.contractSignatoriesList[index]?.emailID}
                                                            onChange={(e) => {
                                                                handleSignatoryBlock(index, "emailID", e.target.value)
                                                            }}
                                                            placeholder="Email" />
                                                        {props.requireMessage &&
                                                            (props?.contractSignatoriesList[index]?.emailID === null ||
                                                                props?.contractSignatoriesList[index]?.emailID === undefined ||
                                                                props?.contractSignatoriesList[index]?.emailID === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (props.requireMessage &&
                                                            !isValidEmail(
                                                                props?.contractSignatoriesList[index]?.emailID
                                                            ) && (
                                                                <label className="validation">
                                                                    Invalid email pattern
                                                                </label>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="row fieldset">
                                                    <div className="col-lg-3 col-md-3 col-sm-12 text-start text-md-end ">
                                                        <label className="fieldset-label required">Signature Position<span style={{ color: "#ec4561" }}>*</span></label>
                                                    </div>
                                                    <div className="col-lg-9 col-md-9 col-sm-12">
                                                        <div className="input-group">
                                                            <Select
                                                                options={Utils.SignaturePosition}
                                                                value={props?.SignaturePositionValue[index]} // Assuming 'index' is defined somewhere
                                                                onChange={(e) => {
                                                                    handleSignatoryBlock(index, "signaturePositionID", e)
                                                                }}
                                                            />
                                                        </div>
                                                        {props.requireMessage &&
                                                            (props?.contractSignatoriesList[index]?.signaturePositionID === null ||
                                                                props?.contractSignatoriesList[index]?.signaturePositionID === undefined ||
                                                                props?.contractSignatoriesList[index]?.signaturePositionID === "") ? (
                                                            <label className="validation">
                                                                {ERROR_MESSAGES}
                                                            </label>
                                                        ) : (
                                                            ""
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {props.requireMessage &&
                                    (props?.contractSignatoriesList?.length === 0) ? (
                                    <label className="validation">
                                        At least 1 Signatory is required.{" "}
                                    </label>
                                ) : (
                                    ""
                                )}
                            </div>)
                        }
                        {props.moduleName === "Contract" && (
                            <>
                                <h3 className="modal-title">Terms & Conditions</h3>
                                <div className="separator"></div>
                                <div id="TnC-Div" className="row fieldset mt-3">
                                    <div className="col-lg-3 col-md-3 col-sm-12 text-start text-md-end">
                                        <label className="fieldset-label required">
                                            TnC Template<span style={{ color: "#ec4561" }}>*</span>
                                        </label>
                                    </div>
                                    <div className="col-lg-9 col-md-9 col-sm-12">
                                        <div className="input-group">
                                            <Select

                                                options={props.TnCLookupList}
                                                value={props?.SelectTnCTemplateValue} // Assuming 'index' is defined somewhere
                                                onChange={(e) => {
                                                    props.handleSelectTncTemplate(e);
                                                }}
                                            />
                                        </div>
                                        {props.requireMessage &&
                                            (props?.engagementObj.tnCTemplateID === null ||
                                                props?.engagementObj.tnCTemplateID === undefined ||
                                                props?.engagementObj.tnCTemplateID === "") ? (
                                            <label className="validation">
                                                {ERROR_MESSAGES}
                                            </label>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                {props?.engagementObj?.pdf !== null ? (
                                    <div id="TnC-PdfDiv" className="mt-2">
                                        <iframe
                                            title="PDF Viewer"
                                            src={props?.engagementObj?.pdf}
                                            width="100%"
                                            height="600px"
                                        ></iframe>
                                    </div>
                                ) : props?.engagementObj?.tnCTemplateContent !== null ? (
                                    <div id="TnC-EditorDiv">
                                        <Text_Editor
                                            className="mt-2"
                                            handleContentChange={props?.handleContentChange}
                                            editorState={props?.engagementObj?.tnCTemplateContent}
                                        />
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div >
            <div class="separator"></div>
            <div class="row fieldset modal-footer">
                <div class="col-lg-12 hstack gap-1 justify-content-end text-right mt-3">
                    <div class="d-flex" style={{ overflowX: 'auto' }}>
                        {props.moduleName == "Contract" && (
                            <button
                                className="btn btn-md btn-primary create-item-btn  mr-1 text-nowrap "
                                onClick={() => {
                                    props.AddSignatory();
                                }}
                            >
                                <i class="bi bi-plus-circle "></i>
                                <span style={{ paddingLeft: "5px" }}>Add Signatory</span>
                            </button>
                        )}
                        {props.getSAChanges ?
                            <button class="btn btn-md btn-success declined-item-btn mr-1" onClick={() => props.DeclineSuperAdminChangesData("Decline")}>
                                <span>Decline</span>
                            </button> : <button class="btn btn-md  btn-light mr-1" onClick={props.handleCancel}>
                                <span>{props.getCrudButtonTextName("Cancel")}</span>
                            </button>
                        }
                        <button
                            onClick={() => props.HandleBack(2)}
                            style={{ marginRight: "5px" }}
                            className="btn btn-md btn-success create-item-btn text-nowrap"
                        >
                            <span>Back</span>
                        </button>
                        {props?.ProposalObject?.selectedProposalTypeValue === 1 && (
                            <button
                                className="btn btn-md btn-success create-item-btn"
                                onClick={async () => {
                                    await props.HandleTabChange(7);
                                }}
                            >
                                <span>Next</span>
                            </button>
                        )}{props?.ProposalObject?.selectedProposalTypeValue === 2 && (
                            <button
                                className="btn btn-md btn-success create-item-btn"
                                onClick={async () => {
                                    await props.HandleTabChange(7);
                                }}
                            >
                                <span>Next</span>
                            </button>
                        )}
                        {props?.ProposalObject?.selectedProposalTypeValue === 3 && (
                            <button
                                className="btn btn-md btn-success create-item-btn"
                                onClick={async () => {
                                    await props.HandleTabChange(6);
                                }}
                            >
                                <span>Next</span>
                            </button>
                        )}
                        {(props.moduleName == "Contract" || props.moduleName === "Package") && (
                            <button
                                className="btn btn-md btn-success create-item-btn"
                                onClick={async () => {
                                    await props.HandleTabChange(4);
                                }}
                            >
                                <span>Next</span>
                            </button>
                        )}
                        {(props.moduleName == "Quote") && (
                            <button
                                type="submit"
                                class="btn btn-md btn-success create-item-btn text-nowrap"
                                onClick={() => props.handleSaveAsDraft(3, moduleNameForSaveAsDraft, statusID.Draft)}
                                style={{ marginLeft: "5px" }}
                            >
                                <span>Save as a Draft</span>
                            </button>)}
                        {(props.moduleName == "Contract") && (
                            <button
                                type="submit"
                                class="btn btn-md btn-success create-item-btn text-nowrap"
                                onClick={() => props.HandleTabChange(4, statusID.Draft)}
                                style={{ marginLeft: "5px" }}
                            >
                                <span>Save as a Draft</span>
                            </button>)}
                    </div>
                </div>
            </div>
        </div>
    );
};
