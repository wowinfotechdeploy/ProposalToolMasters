import React, { useState } from "react";
import { ERROR_MESSAGES } from "../../../components/GlobalMessage";

function VariationDragDrop(props) {
  return (
    <div class="row" id={`Variation_${props.mainIndex}`}>
      <div class="col-xl-12 col-lg-12">
        {props.pricingDriver[props.mainIndex]?.variation?.map(
          (variation, VariationIndex) => {
            return (
              <div
                className="card-1 pricing-box p-4 mt-3"
                draggable="true"
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", "Datatype"); // Set a data type for the drag
                  e.dataTransfer.setData("VariationIndex", VariationIndex);
                  // setDragOverStart(props.i);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const dataType = e.dataTransfer.getData("text/plain");
                  if (dataType == "Datatype") {
                    const sourceVariationIndex =
                      e.dataTransfer.getData("VariationIndex");
                    const targetVariationIndex = VariationIndex;
                    // Rearrange the variationsList based on the drag-and-drop
                    if (sourceVariationIndex !== targetVariationIndex) {
                      const pricingDriverCopy = [...props.pricingDriver];
                      const variationsList = [
                        ...pricingDriverCopy[props.mainIndex].variation,
                      ];

                      // Splice and rearrange the dragged item
                      const draggedItem = variationsList[sourceVariationIndex];

                      // Insert the draggedItem at the targetVariationIndex
                      variationsList.splice(sourceVariationIndex, 1);
                      variationsList.splice(
                        targetVariationIndex,
                        0,
                        draggedItem
                      );

                      // Update the variation array in the copy of pricingDriver
                      pricingDriverCopy[props.mainIndex].variation =
                        variationsList;

                      // Update the state with the modified pricingDriver copy
                      props.setPricingDriver(pricingDriverCopy);
                    }
                  }
                }}
              >
                <div class="col-lg-6 col-md-6">
                  <p
                    class="office-name font-weight"
                    style={{ width: "auto", zIndex: "0" }}
                  >
                    Variation {VariationIndex + 1}
                  </p>
                </div>
                <button
                  style={{ marginTop: "-34px" }}
                  className="btn btn-sm btn-danger gpd-title-1"
                  disabled={
                    props.pricingDriver[props.mainIndex]
                      .parentGlobalPricingDriverKeyID
                      ? true
                      : false
                  }
                  onClick={() => {
                    if (
                      props.pricingDriver[props.mainIndex]
                        .parentGlobalPricingDriverKeyID === null
                    ) {
                      props.OnDeleteVariations(props.mainIndex, VariationIndex);
                    }
                  }}
                >
                  {" "}
                  <i class="bi bi-trash3" style={{ marginRight: props.isMobile ? "0px" : "5px" }}></i>
                  <span class="d-none d-sm-inline-block">Delete Variation</span>
                </button>
                <div
                  class="row mt-1"
                  id={`VariationDiv_${props.mainIndex}${VariationIndex}`}
                >
                  <div className="col-lg-6">
                    <div className="mb-1">
                      <label className="form-label">
                        Variation Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-height">
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Enter Variation Name"
                          value={
                            props.pricingDriver[props.mainIndex].variation[
                              VariationIndex
                            ]
                              ? props.pricingDriver[props.mainIndex].variation[
                                VariationIndex
                              ].variationName
                              : ""
                          }
                          disabled={
                            props.pricingDriver[props.mainIndex]
                              .parentGlobalPricingDriverKeyID
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const trimmedValue = inputValue.replace(
                              /^\s+/g,
                              ""
                            ); // Remove leading spaces
                            const capitalizedValue =
                              trimmedValue.charAt(0).toUpperCase() +
                              trimmedValue.slice(1);

                            const isDuplicate = props.pricingDriver[
                              props.mainIndex
                            ].variation.some(
                              (item, index) =>
                                index !== props.mainIndex &&
                                item.variationName.toUpperCase() ===
                                capitalizedValue.toUpperCase()
                            );
                            // if (isDuplicate) {
                            //     props.seDuplicateName(true)
                            // } else {
                            //     props.seDuplicateName(false)
                            // }

                            props.OnVariationChange(
                              props.mainIndex,
                              VariationIndex,
                              "variationName",
                              capitalizedValue
                            );
                          }}
                          maxLength={200}
                        />
                      </div>
                      {props.gdrivererror.variationnameError &&
                        (props.pricingDriver[props.mainIndex].variation[
                          VariationIndex
                        ].variationName === "" ||
                          props.pricingDriver[props.mainIndex].variation[
                            VariationIndex
                          ].variationName === null) ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                      {/* {props.DuplicateName &&
                                                props.pricingDriver[props.mainIndex].variation[
                                                    VariationIndex
                                                ].variationName !==
                                                "" ? (
                                                <label className="validation">
                                                    Variation name already exists.
                                                </label>
                                            ) : (
                                                ""
                                            )} */}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-1">
                      <label className="form-label">
                        Variation Value <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-height">
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Enter Variation Value"
                          defaultValue={0}
                          value={
                            props.pricingDriver[props.mainIndex].variation[
                              VariationIndex
                            ]?.variationValue === ""
                              ? ""
                              : props.pricingDriver[props.mainIndex].variation[
                                VariationIndex
                              ]?.variationValue
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          onChange={(e) => {
                            props.DriverValue(
                              e,
                              props.mainIndex,
                              VariationIndex,
                              "variationValue"
                            );
                            // Ensure that the input only contains numeric characters
                          }}
                        />
                      </div>
                      {props.gdrivererror.variationvalueError &&
                        props.pricingDriver[props.mainIndex].variation[
                          VariationIndex
                        ]?.variationValue === "" ? (
                        <label className="validation">{ERROR_MESSAGES}</label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div
                    className="col-lg-12 col-12"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <input
                      style={{ marginRight: "1rem" }}
                      type="radio"
                      id={`variation${props.mainIndex}${VariationIndex}`}
                      name={`variations${props.mainIndex}`}
                      disabled={
                        props.pricingDriver[props.mainIndex]
                          .parentGlobalPricingDriverKeyID
                          ? true
                          : false
                      }
                      checked={
                        props.pricingDriver[props.mainIndex].variation[
                          VariationIndex
                        ]?.isDefault
                      }
                      onChange={(e) =>
                        props.OnVariationsRadioChange(
                          props.mainIndex,
                          VariationIndex
                        )
                      }
                    />
                    <label
                      className="toggle"
                      name={`variations${props.mainIndex}`}
                      style={{ cursor: "pointer", marginBottom: "0" }}
                      htmlFor={`variation${props.mainIndex}${VariationIndex}`}
                    >
                      Set to Default
                    </label>
                  </div>
                </div>
              </div>
            );
          }
        )}
        {props.gdrivererror.variationError &&
          props.pricingDriver[props.mainIndex].variation.length === 0 ? (
          <div className="text-center">
            <label className="validation">
              At least 1 Variation is required.
            </label>
          </div>
        ) : (
          ""
        )}
        <span className="delete-right align-right mt-1">
          <button
            onClick={() => {
              if (
                props.pricingDriver[props.mainIndex]
                  .parentGlobalPricingDriverKeyID === null
              ) {
                props.OnAddVariations(props.mainIndex);
              }
            }}
            class={`btn btn-sm ${props.pricingDriver[props.mainIndex]
              .parentGlobalPricingDriverKeyID
              ? "create-item-btn-2"
              : "create-item-btn"
              } d-flex gap-1`}
          >
            <i class="bi bi-plus-circle"></i>
            <span>Add Variation</span>
          </button>
        </span>
      </div>
    </div>
  );
}

export default VariationDragDrop;
