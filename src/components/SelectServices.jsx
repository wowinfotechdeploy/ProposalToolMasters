import Select from "react-select";
import { ERROR_MESSAGES } from "./GlobalMessage";
import { Tooltip } from "@mui/material";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import { useContext } from "react";
import { statusID } from "../Middleware/enums";
export const SelectServices = (props) => {
  const {
    isMobile,
    getCrudButtonTextName,
  } = useContext(AuthContextProvider);

  const moduleNameForSaveAsDraft = "SelectServices";
  const notAllowed = "not-allowed";

  const handleRecurringServiceDependsServerClick = (
    recurringService,
    subRecurringService,
    id,
    prevId,
    type
  ) => {
    props.DisableTabOnChange();
    const variationIdMatches = prevId?.variation?.map((i) => {
      return i.variationID;
    });
    if (type === "RecurringService") {
      let updatedRecurringList = props.recurringServiceList?.map((category) => {

        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      const isVariation =
                        pricingList.variation &&
                        pricingList.variation.some(
                          (variation) => variation.variationID === id.value
                        );
                      const isSlab =
                        pricingList.slab &&
                        pricingList.slab.some(
                          (slab) => slab.slabID === id.value
                        );
                      if (isVariation) {
                        return {
                          ...pricingList,
                          driverVisibility: true,
                          driverValue: pricingList.variation
                            .filter(
                              (variation) => variation.variationID === id.value
                            )
                            .map((varValue) => varValue.variationValue)
                            .join(", "),
                          variation: pricingList.variation.map((variation) => ({
                            ...variation,
                            isDefault: variation.variationID === id.value,
                          })),
                        };
                      } else if (isSlab) {
                        return {
                          ...pricingList,
                          driverVisibility: true,
                          driverValue:
                            pricingList.slab
                              .filter(
                                (Slab) =>
                                  Slab.slabID === id.value &&
                                  Slab.slabTypeID == 1
                              )
                              .map((slabsValue) => slabsValue.slabValue)
                              .join(", ") || null,
                          slab: pricingList.slab.map((slab) => ({
                            ...slab,
                            isDefault: slab.slabID === id.value,
                          })),
                        };
                      }

                      if (pricingList.dependsOnVariationID === id.value) {

                        return {
                          ...pricingList,
                          driverVisibility: true,
                        };
                      } else if (
                        variationIdMatches?.includes(
                          pricingList.dependsOnVariationID
                        )
                      ) {

                        return {
                          ...pricingList,
                          driverVisibility: false,
                          driverValue: null,
                        };
                      } else if (
                        pricingList.globalPricingDriverID ===
                        prevId.globalPricingDriverID
                      ) {

                        return {
                          ...pricingList,
                          driverValue: id.variationValue,
                        };
                      }

                      // Make sure to return the original object when none of the conditions are met
                      return pricingList;
                    }
                  ),
                };
              }

              return service;
            }),
          };
        }
        return category;
      });
      updatedRecurringList = updatedRecurringList.map((item) => {
        // Check if the item has servicesList array
        if (item?.serviceCatID === recurringService?.serviceCatID) {
          if (item.servicesList && item.servicesList.length > 0) {
            // Iterate through each service in servicesList
            item.servicesList = item.servicesList.map((service) => {
              // Check if pricingDriverList array exists and has elements
              if (service.serviceID === subRecurringService.serviceID) {
                if (
                  service.pricingDriverList &&
                  service.pricingDriverList.length > 0
                ) {
                  //Iterate through pricingDriverList array
                  service.pricingDriverList = service.pricingDriverList.map(
                    (driver) => {
                      // Check if driverTypeID is 3 and driverValue, variationID, and slabID are null
                      if (driver.driverTypeID === 3) {
                        // Find the default variation
                        const defaultVariation = driver.variation.find(
                          (variation) => variation.isDefault === true
                        );
                        // Update driverValue and variationID if defaultVariation exists
                        if (defaultVariation) {
                          driver.driverValue = defaultVariation.variationValue;
                          driver.variationID = defaultVariation.variationID;
                        }
                      }
                      // Check if driverTypeID is 4 and driverValue, variationID, and slabID are null
                      else if (driver.driverTypeID === 4) {
                        // Find the default slab
                        const defaultSlab = driver.slab.find(
                          (slab) => slab.isDefault === true
                        );
                        // Update driverValue and slabID if defaultSlab exists
                        if (defaultSlab) {

                          driver.driverValue =
                            defaultSlab.slabTypeID == 2
                              ? null
                              : defaultSlab.slabValue;
                          driver.slabID = defaultSlab.slabID;
                        }
                      }
                      // Check if dependsOnGlobalPricingDriverID and dependsOnVariationID are not null
                      if (
                        driver.dependsOnGlobalPricingDriverID !== null &&
                        driver.dependsOnVariationID !== null
                      ) {
                        // Find the globalPricingDriverID with value of dependsOnGlobalPricingDriverID
                        const dependsOnGlobalDriver =
                          service.pricingDriverList.find(
                            (driver2) =>
                              driver2.globalPricingDriverID ===
                              driver.dependsOnGlobalPricingDriverID
                          );
                        // Check if dependsOnGlobalDriver exists and has variationID equal to dependsOnVariationID
                        if (
                          dependsOnGlobalDriver &&
                          dependsOnGlobalDriver.variationID ===
                          driver.dependsOnVariationID &&
                          dependsOnGlobalDriver.driverVisibility === true
                        ) {
                          driver.driverVisibility = true;
                        } else {
                          driver.driverVisibility = false;
                        }
                      }
                      return driver; // Return the modified or unchanged driver object
                    }
                  );
                }
              }
              return service; // Return the modified or unchanged service object
            });
          }
        }
        return item; // Return the modified or unchanged item object
      });
      props.setRecurringServiceList(updatedRecurringList);
    } else if (type === "OneOffService") {
      let updatedOneOffList = props.oneOffServiceList?.map((category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      const isVariation =
                        pricingList.variation &&
                        pricingList.variation.some(
                          (variation) => variation.variationID === id.value
                        );
                      const isSlab =
                        pricingList.slab &&
                        pricingList.slab.some(
                          (slab) => slab.slabID === id.value
                        );
                      if (isVariation) {
                        return {
                          ...pricingList,
                          driverVisibility: true,
                          driverValue: pricingList.variation
                            .filter(
                              (variation) => variation.variationID === id.value
                            )
                            .map((varValue) => varValue.variationValue)
                            .join(", "),
                          variation: pricingList.variation.map((variation) => ({
                            ...variation,
                            isDefault: variation.variationID === id.value,
                          })),
                        };
                      } else if (isSlab) {
                        return {
                          ...pricingList,
                          driverVisibility: true,
                          driverValue:
                            pricingList.slab
                              .filter(
                                (Slab) =>
                                  Slab.slabID === id.value &&
                                  Slab.slabTypeID == 1
                              )
                              .map((slabsValue) => slabsValue.slabValue)
                              .join(", ") || null,

                          slab: pricingList.slab.map((slab) => ({
                            ...slab,
                            isDefault: slab.slabID === id.value,
                          })),
                        };
                      }

                      if (pricingList.dependsOnVariationID === id.value) {
                        return {
                          ...pricingList,
                          driverVisibility: true,
                        };
                      } else if (
                        variationIdMatches?.includes(
                          pricingList.dependsOnVariationID
                        )
                      ) {
                        return {
                          ...pricingList,
                          driverVisibility: false,
                          driverValue: null,
                        };
                      } else if (
                        pricingList.globalPricingDriverID ===
                        prevId.globalPricingDriverID
                      ) {
                        return {
                          ...pricingList,
                          driverValue: id.variationValue,
                        };
                      }

                      // Make sure to return the original object when none of the conditions are met
                      return pricingList;
                    }
                  ),
                };
              }

              return service;
            }),
          };
        }
        return category;
      });
      updatedOneOffList = updatedOneOffList.map((item) => {
        // Check if the item has servicesList array
        if (item?.serviceCatID === recurringService?.serviceCatID) {
          if (item.servicesList && item.servicesList.length > 0) {
            // Iterate through each service in servicesList
            item.servicesList = item.servicesList.map((service) => {
              // Check if pricingDriverList array exists and has elements
              if (service.serviceID === subRecurringService.serviceID) {
                if (
                  service.pricingDriverList &&
                  service.pricingDriverList.length > 0
                ) {
                  //Iterate through pricingDriverList array
                  service.pricingDriverList = service.pricingDriverList.map(
                    (driver) => {
                      // Check if driverTypeID is 3 and driverValue, variationID, and slabID are null
                      if (driver.driverTypeID === 3) {
                        // Find the default variation
                        const defaultVariation = driver.variation.find(
                          (variation) => variation.isDefault === true
                        );
                        // Update driverValue and variationID if defaultVariation exists
                        if (defaultVariation) {
                          driver.driverValue = defaultVariation.variationValue;
                          driver.variationID = defaultVariation.variationID;
                        }
                      }
                      // Check if driverTypeID is 4 and driverValue, variationID, and slabID are null
                      else if (driver.driverTypeID === 4) {
                        // Find the default slab
                        const defaultSlab = driver.slab.find(
                          (slab) => slab.isDefault === true
                        );
                        // Update driverValue and slabID if defaultSlab exists
                        if (defaultSlab) {
                          driver.driverValue =
                            defaultSlab.slabTypeID == 2
                              ? null
                              : defaultSlab.slabValue;
                          driver.slabID = defaultSlab.slabID;
                        }
                      }
                      // Check if dependsOnGlobalPricingDriverID and dependsOnVariationID are not null
                      if (
                        driver.dependsOnGlobalPricingDriverID !== null &&
                        driver.dependsOnVariationID !== null
                      ) {
                        // Find the globalPricingDriverID with value of dependsOnGlobalPricingDriverID
                        const dependsOnGlobalDriver =
                          service.pricingDriverList.find(
                            (driver2) =>
                              driver2.globalPricingDriverID ===
                              driver.dependsOnGlobalPricingDriverID
                          );
                        // Check if dependsOnGlobalDriver exists and has variationID equal to dependsOnVariationID
                        if (
                          dependsOnGlobalDriver &&
                          dependsOnGlobalDriver.variationID ===
                          driver.dependsOnVariationID &&
                          dependsOnGlobalDriver.driverVisibility === true
                        ) {
                          driver.driverVisibility = true;
                        } else {
                          driver.driverVisibility = false;
                        }
                      }
                      return driver; // Return the modified or unchanged driver object
                    }
                  );
                }
              }
              return service; // Return the modified or unchanged service object
            });
          }
        }
        return item; // Return the modified or unchanged item object
      });

      props.setOneOffServiceList(updatedOneOffList);
    }
  };

  const handleRecurringServiceCheckboxClick = (
    recurringService,
    subRecurringService
  ) => {
    props.DisableTabOnChange();

    const updatedRecurringList = props.recurringServiceList?.map((category) => {
      if (category?.serviceCatID === recurringService?.serviceCatID) {
        return {
          ...category,
          servicesList: category.servicesList?.map((service) => {
            if (service.serviceID === subRecurringService.serviceID) {
              return {
                ...service,
                isSelected: service.isSelected === true ? false : true,
                isDisabled: false,
                pricingDriverList: service.pricingDriverList?.map(
                  (pricingList) => {
                    return {
                      ...pricingList,
                      driverValue:
                        pricingList.driverTypeID === 3
                          ? pricingList?.variation?.filter(
                            (i) => i.isDefault === true
                          )[0]?.variationValue
                          : pricingList?.slab?.filter(
                            (i) => i.isDefault === true
                          )[0]?.slabValue || null,
                    };
                  }
                ),
              };
            }
            return service;
          }),
        };
      }
      return category;
    });
    props.setRecurringServiceList(updatedRecurringList);
    const updatedOneOffServiceList = props.oneOffServiceList?.map(
      (category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  isDisabled: !service.isDisabled,
                };
              }
              return service;
            }),
          };
        }
        return category;
      }
    );
    props.setOneOffServiceList(updatedOneOffServiceList);
  };

  const handleOneOffServiceCheckboxClick = (
    recurringService,
    subRecurringService
  ) => {
    props.DisableTabOnChange();

    const updatedOneOffServiceList = props.oneOffServiceList?.map(
      (category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  isSelected: service.isSelected === true ? false : true,
                  isDisabled: false,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      return {
                        ...pricingList,
                        driverValue:
                          pricingList.driverTypeID === 3
                            ? pricingList?.variation?.filter(
                              (i) => i.isDefault === true
                            )[0]?.variationValue
                            : pricingList?.slab?.filter(
                              (i) => i.isDefault === true
                            )[0]?.slabValue,
                      };
                    }
                  ),
                };
              }
              return service;
            }),
          };
        }
        return category;
      }
    );

    props.setOneOffServiceList(updatedOneOffServiceList);
    const updatedRecurringList = props.recurringServiceList?.map((category) => {
      if (category?.serviceCatID === recurringService?.serviceCatID) {
        return {
          ...category,
          servicesList: category.servicesList?.map((service) => {
            if (service.serviceID === subRecurringService.serviceID) {
              return {
                ...service,
                isDisabled: !service.isDisabled,
              };
            }
            return service;
          }),
        };
      }
      return category;
    });

    props.setRecurringServiceList(updatedRecurringList);
  };

  const OnQuantityValueChange = (
    recurringService,
    subRecurringService,
    prevId,
    value,
    Type
  ) => {
    props.DisableTabOnChange();
    // Ensure that the input only contains numeric characters
    const sanitizedInput = value
      .replace(/[^0-9.]/g, "") // Allow only numeric, dot, and negative sign characters
      .slice(0, 16); // Limit to 8 characters (5 digits + 1 dot + 1 decimal + 1 negative sign)

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedInput.split(".");

    // Combine integer and decimal parts with appropriate precision
    if (sanitizedInput == undefined) {
      return;
    }
    let formattedInput;
    if (decimalPart !== undefined) {
      if (integerPart.includes("-")) {
        // For negative values, ensure 5 digits after the negative sign
        formattedInput = `-${integerPart.slice(1, 13)}.${decimalPart.slice(
          0,
          2
        )}`;
      } else {
        // For positive values, limit to 5 digits before the decimal point
        formattedInput = `${integerPart.slice(0, 12)}.${decimalPart.slice(
          0,
          2
        )}`;
      }
    } else {
      // No decimal part, limit to 5 digits
      formattedInput = integerPart.includes("-")
        ? `-${integerPart.slice(1, 13)}`
        : `${integerPart.slice(0, 12)}`;
    }

    if (Type === "RecurringService") {
      const updatedRecurringList = props.recurringServiceList?.map(
        (category) => {
          if (category?.serviceCatID === recurringService?.serviceCatID) {
            return {
              ...category,
              servicesList: category.servicesList?.map((service) => {
                if (service.serviceID === subRecurringService.serviceID) {
                  return {
                    ...service,
                    pricingDriverList: service.pricingDriverList?.map(
                      (pricingList) => {
                        if (
                          pricingList.globalPricingDriverID ===
                          prevId.globalPricingDriverID
                        ) {
                          return {
                            ...pricingList,
                            driverValue: formattedInput.replace(
                              /-/g,
                              (match, index) => (index === 0 ? match : "")
                            ),
                          };
                        }
                        // Make sure to return the original object when none of the conditions are met
                        return pricingList;
                      }
                    ),
                  };
                }
                return service;
              }),
            };
          }
          return category;
        }
      );
      props.setRecurringServiceList(updatedRecurringList);
    } else if (Type === "OneOffService") {
      const updatedRecurringList = props.oneOffServiceList?.map((category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      if (
                        pricingList.globalPricingDriverID ===
                        prevId.globalPricingDriverID
                      ) {
                        return {
                          ...pricingList,
                          driverValue: formattedInput.replace(
                            /-/g,
                            (match, index) => (index === 0 ? match : "")
                          ),
                        };
                      }
                      // Make sure to return the original object when none of the conditions are met
                      return pricingList;
                    }
                  ),
                };
              }
              return service;
            }),
          };
        }
        return category;
      });
      props.setOneOffServiceList(updatedRecurringList);
    }
  };

  const OnIncrementalValueChange = (
    recurringService,
    subRecurringService,
    prevId,
    value,
    Type
  ) => {
    props.DisableTabOnChange();
    // Ensure that the input only contains numeric characters
    const sanitizedInput = value
      .replace(/[^0-9.-]/g, "") // Allow only numeric, dot, and negative sign characters
      .slice(0, 16); // Limit to 8 characters (5 digits + 1 dot + 1 decimal + 1 negative sign)

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedInput.split(".");

    // Combine integer and decimal parts with appropriate precision
    if (sanitizedInput == undefined) {
      return;
    }
    let formattedInput;
    if (decimalPart !== undefined) {
      if (integerPart.includes("-")) {
        // For negative values, ensure 5 digits after the negative sign
        formattedInput = `-${integerPart.slice(1, 13)}.${decimalPart.slice(
          0,
          2
        )}`;
      } else {
        // For positive values, limit to 5 digits before the decimal point
        formattedInput = `${integerPart.slice(0, 12)}.${decimalPart.slice(
          0,
          2
        )}`;
      }
    } else {
      // No decimal part, limit to 5 digits
      formattedInput = integerPart.includes("-")
        ? `-${integerPart.slice(1, 13)}`
        : `${integerPart.slice(0, 12)}`;
    }

    if (Type === "RecurringService") {
      let updatedRecurringList = props.recurringServiceList?.map((category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      if (
                        pricingList.globalPricingDriverID ===
                        prevId.globalPricingDriverID
                      ) {
                        return {
                          ...pricingList,
                          driverValue: formattedInput.replace(
                            /-/g,
                            (match, index) => (index === 0 ? match : "")
                          ),
                          slab: pricingList.slab.map((slab) => {
                            if (slab.isDefault === true) {
                              return {
                                ...slab,
                                slabValue: formattedInput.replace(
                                  /-/g,
                                  (match, index) => (index === 0 ? match : "")
                                ), // Assuming formattedInput is your desired new value
                              };
                            }
                            return slab; // Preserve other slabs
                          }),
                        };
                      }
                      // Make sure to return the original object when none of the conditions are met
                      return pricingList;
                    }
                  ),
                };
              }
              return service;
            }),
          };
        }
        return category;
      });

      props.setRecurringServiceList(updatedRecurringList);
    } else if (Type === "OneOffService") {
      let updatedOneOffList = props.oneOffServiceList?.map((category) => {
        if (category?.serviceCatID === recurringService?.serviceCatID) {
          return {
            ...category,
            servicesList: category.servicesList?.map((service) => {
              if (service.serviceID === subRecurringService.serviceID) {
                return {
                  ...service,
                  pricingDriverList: service.pricingDriverList?.map(
                    (pricingList) => {
                      if (
                        pricingList.globalPricingDriverID ===
                        prevId.globalPricingDriverID
                      ) {
                        return {
                          ...pricingList,
                          driverValue: formattedInput.replace(
                            /-/g,
                            (match, index) => (index === 0 ? match : "")
                          ),
                          slab: pricingList.slab.map((slab) => {
                            if (slab.isDefault === true) {
                              return {
                                ...slab,
                                slabValue: formattedInput.replace(
                                  /-/g,
                                  (match, index) => (index === 0 ? match : "")
                                ), // Assuming formattedInput is your desired new value
                              };
                            }
                            return slab; // Preserve other slabs
                          }),
                        };
                      }
                      // Make sure to return the original object when none of the conditions are met
                      return pricingList;
                    }
                  ),
                };
              }
              return service;
            }),
          };
        }
        return category;
      });
      props.setOneOffServiceList(updatedOneOffList);
    }
  };
  return (
    <>
      <div className="create-practice-height scrollbar">
        <div className="tab-content">
          <div className="tab-pane p-3 active">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12 border-right-separator">
                <h6 className="text-center">Ongoing/Recurring Services</h6>
                <div class="separator mb-2"></div>
                <table
                  class="table align-middle table-nowrap"
                  id="customerTable"
                >
                  {props.recurringServiceList?.map((recurringService) => {
                    return (
                      <>
                        <thead class="table-light table-header-font">
                          <tr class="head-row">
                            <td className="tr-table-class text-white">
                              {isMobile ? (
                                <>
                                  {recurringService?.serviceCatName.length > 20
                                    ? recurringService?.serviceCatName
                                      .substring(0, 20)
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase()
                                      ) + "..."
                                    : recurringService?.serviceCatName
                                      .replace(/\b\w/g, (l) =>
                                        l.toUpperCase()
                                      )}
                                </>
                              ) : (
                                <>
                                  {recurringService?.serviceCatName.length >
                                    30 ? (
                                    <Tooltip
                                      title={recurringService?.serviceCatName}
                                    >
                                      {recurringService?.serviceCatName
                                        .substring(0, 30)
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase()
                                        ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    <>
                                      {recurringService?.serviceCatName
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase()
                                        )}
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {recurringService?.servicesList?.map(
                            (subRecurringService, index) => {
                              return (
                                <tr>
                                  <td>
                                    <div
                                      class="select-row align-center"
                                      id={`SelectServiceDiv${index}`}
                                    >
                                      <input
                                        type="checkbox"
                                        className="check check_tick"
                                        value={subRecurringService?.isSelected}
                                        // id={`flexCheckDefault_${subRecurringService.serviceID}`}
                                        onClick={() => {
                                          if (!subRecurringService.isDisabled) {
                                            handleRecurringServiceCheckboxClick(
                                              recurringService,
                                              subRecurringService
                                            );
                                          }
                                        }}
                                        checked={subRecurringService.isSelected}
                                        style={{
                                          cursor: `${subRecurringService.isDisabled ==
                                            true
                                            ? notAllowed
                                            : ""
                                            }`,
                                        }}
                                      />
                                      <label
                                        style={{
                                          wordBreak: "break-word",
                                          marginBottom: "0",
                                        }}
                                        onClick={() => {
                                          if (!subRecurringService.isDisabled) {
                                            handleRecurringServiceCheckboxClick(
                                              recurringService,
                                              subRecurringService
                                            );
                                          }
                                        }}
                                      >
                                        {isMobile ? (
                                          <>
                                            {subRecurringService.serviceName
                                              .length > 20
                                              ? subRecurringService.serviceName.substring(
                                                0,
                                                20
                                              ) + "..."
                                              : subRecurringService.serviceName}
                                          </>
                                        ) : (
                                          <>
                                            {subRecurringService.serviceName
                                              .length > 38 ? (
                                              <Tooltip
                                                title={
                                                  subRecurringService.serviceName
                                                }
                                              >
                                                {subRecurringService.serviceName.substring(
                                                  0,
                                                  38
                                                ) + "..."}
                                              </Tooltip>
                                            ) : (
                                              <>
                                                {
                                                  subRecurringService.serviceName
                                                }
                                              </>
                                            )}
                                          </>
                                        )}
                                      </label>
                                    </div>
                                    {subRecurringService?.pricingDriverList
                                      .length >= 1 &&
                                      subRecurringService?.isSelected &&
                                      subRecurringService?.pricingDriverList.map(
                                        (i) => {
                                          return (
                                            <div
                                              style={{
                                                width: "90%",
                                                float: "right",
                                              }}
                                            >
                                              {i?.driverTypeID === 3 &&
                                                i?.driverVisibility && (
                                                  <div>
                                                    <label className="mt-2">
                                                      <strong>
                                                        {isMobile ? (
                                                          <>
                                                            {i?.driverName
                                                              .substring(0, 10)
                                                              .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                  l.toUpperCase()
                                                              ) + "..."}
                                                          </>
                                                        ) : (
                                                          <>
                                                            {i?.driverName
                                                              .length > 38 ? (
                                                              <Tooltip
                                                                title={
                                                                  i?.driverName
                                                                }
                                                              >
                                                                {i?.driverName
                                                                  .substring(
                                                                    0,
                                                                    38
                                                                  )
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  ) + "..."}
                                                              </Tooltip>
                                                            ) : (
                                                              <>
                                                                {i?.driverName
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  )}
                                                              </>
                                                            )}
                                                          </>
                                                        )}
                                                      </strong>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <Select
                                                      options={i?.variation.map(
                                                        (variation) => ({
                                                          value:
                                                            variation.variationID,
                                                          label:
                                                            variation.variationName,
                                                          variationValue:
                                                            variation.variationValue,
                                                        })
                                                      )}
                                                      value={i?.variation
                                                        .filter(
                                                          (variation) =>
                                                            variation.isDefault ===
                                                            true
                                                        )
                                                        .map((i) => ({
                                                          value: i.variationID,
                                                          label:
                                                            i.variationName,
                                                        }))}
                                                      onChange={(
                                                        selectOption
                                                      ) =>
                                                        handleRecurringServiceDependsServerClick(
                                                          recurringService,
                                                          subRecurringService,
                                                          selectOption,
                                                          i,
                                                          "RecurringService"
                                                        )
                                                      }
                                                    />
                                                    {props.requireMessage &&
                                                      (i.driverValue === null ||
                                                        i.driverValue ===
                                                        undefined ||
                                                        i.driverValue ===
                                                        "") && (
                                                        <label className="text-danger">
                                                          {ERROR_MESSAGES}
                                                        </label>
                                                      )}
                                                  </div>
                                                )}
                                              {i?.driverTypeID === 2 &&
                                                i?.driverVisibility && (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                    }}
                                                    id={`SelectServiceQuantity_${i.driverName}`}
                                                  >
                                                    <label className="mt-2">
                                                      <strong>
                                                        {isMobile ? (
                                                          <>
                                                            {i?.driverName
                                                              .substring(0, 10)
                                                              .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                  l.toUpperCase()
                                                              ) + "..."}
                                                          </>
                                                        ) : (
                                                          <>
                                                            {i?.driverName
                                                              .length > 38 ? (
                                                              <Tooltip
                                                                title={
                                                                  i?.driverName
                                                                }
                                                              >
                                                                {i?.driverName
                                                                  .substring(
                                                                    0,
                                                                    38
                                                                  )
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  ) + "..."}
                                                              </Tooltip>
                                                            ) : (
                                                              <>
                                                                {i?.driverName
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  )}
                                                              </>
                                                            )}
                                                          </>
                                                        )}
                                                      </strong>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      value={i?.driverValue
                                                        ?.toString()
                                                        ?.replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ","
                                                        )}
                                                      onChange={(e) => {
                                                        OnQuantityValueChange(
                                                          recurringService,
                                                          subRecurringService,
                                                          i,
                                                          e.target.value,
                                                          "RecurringService"
                                                        );
                                                      }}
                                                      className="input-text"
                                                      placeholder={
                                                        i?.driverName
                                                      }
                                                    />
                                                    {props.requireMessage &&
                                                      (i?.driverValue ===
                                                        undefined ||
                                                        i?.driverValue ===
                                                        null ||
                                                        i?.driverValue ===
                                                        "") &&
                                                      i?.driverTypeID === 2 && (
                                                        <label className="text-danger">
                                                          {ERROR_MESSAGES}
                                                        </label>
                                                      )}
                                                  </div>
                                                )}
                                              {i?.driverTypeID === 4 &&
                                                i?.driverVisibility && (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                    }}
                                                    id={`SelectServiceQuantity_${i.driverName}`}
                                                  >
                                                    <label className="mt-1">
                                                      <strong>
                                                        {isMobile ? (
                                                          <>
                                                            {i?.driverName
                                                              .substring(0, 10)
                                                              .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                  l.toUpperCase()
                                                              ) + "..."}
                                                          </>
                                                        ) : (
                                                          <>
                                                            {i?.driverName
                                                              .length > 38 ? (
                                                              <Tooltip
                                                                title={
                                                                  i?.driverName
                                                                }
                                                              >
                                                                {i?.driverName
                                                                  .substring(
                                                                    0,
                                                                    38
                                                                  )
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  ) + "..."}
                                                              </Tooltip>
                                                            ) : (
                                                              <>
                                                                {i?.driverName
                                                                  .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                      l.toUpperCase()
                                                                  )}
                                                              </>
                                                            )}
                                                          </>
                                                        )}
                                                      </strong>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                    <Select
                                                      options={i.slab.map(
                                                        (i) => ({
                                                          value: i.slabID,
                                                          label:
                                                            i.slabTypeID === 2
                                                              ? "Other"
                                                              : `${i.slabFrom
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )} - ${i.slabTo
                                                                  .toString()
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}`,
                                                          variationValue:
                                                            i.slabValue,
                                                        })
                                                      )}
                                                      // value={slabSelectedRecValue}
                                                      value={i?.slab
                                                        ?.filter(
                                                          (slab) =>
                                                            slab.isDefault ===
                                                            true
                                                        )
                                                        .map((i) => ({
                                                          value: i.slabID,
                                                          label:
                                                            i.slabTypeID === 2
                                                              ? "Other"
                                                              : `${i.slabFrom
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )} - ${i.slabTo
                                                                  .toString()
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}`,
                                                        }))}
                                                      onChange={(
                                                        selectOption
                                                      ) =>
                                                        handleRecurringServiceDependsServerClick(
                                                          recurringService,
                                                          subRecurringService,
                                                          selectOption,
                                                          i,
                                                          "RecurringService"
                                                        )
                                                      }
                                                    />
                                                    {i?.slab
                                                      ?.filter(
                                                        (slab) =>
                                                          slab.isDefault ===
                                                          true
                                                      )
                                                      .map((item) => {
                                                        return (
                                                          item.slabTypeID ===
                                                          2 && (
                                                            <input
                                                              type="text"
                                                              value={i?.driverValue
                                                                ?.toString()
                                                                ?.replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}
                                                              onChange={(e) => {
                                                                OnIncrementalValueChange(
                                                                  recurringService,
                                                                  subRecurringService,
                                                                  i,
                                                                  e.target
                                                                    .value,
                                                                  "RecurringService"
                                                                );
                                                              }}
                                                              className="input-text  mt-2"
                                                              placeholder="Other"
                                                            />
                                                          )
                                                        );
                                                      })}

                                                    {props.requireMessage &&
                                                      (i.driverValue === null ||
                                                        i.driverValue ===
                                                        undefined ||
                                                        i.driverValue ===
                                                        "") && (
                                                        <label className="text-danger">
                                                          {ERROR_MESSAGES}
                                                        </label>
                                                      )}
                                                  </div>
                                                )}
                                            </div>
                                          );
                                        }
                                      )}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </>
                    );
                  })}
                </table>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 border-right-separator mobile-margin-top ">
                <h6 className="text-center">One-Off/Ad hoc Services</h6>
                <div class="separator mb-2"></div>
                <table
                  class="table align-middle table-nowrap"
                  id="customerTable"
                >
                  {props.oneOffServiceList?.map((oneOffService) => {
                    return (
                      <>
                        <thead class="table-light table-header-font">
                          <tr class="head-row">
                            <td className="tr-table-class text-white">
                              {isMobile ? (
                                <>
                                  {oneOffService?.serviceCatName.length > 20
                                    ? oneOffService?.serviceCatName.substring(
                                      0,
                                      20
                                    ) + "..."
                                    : oneOffService?.serviceCatName}
                                </>
                              ) : (
                                <>
                                  {oneOffService?.serviceCatName.length > 38 ? (
                                    <Tooltip
                                      title={oneOffService?.serviceCatName}
                                    >
                                      {oneOffService?.serviceCatName.substring(
                                        0,
                                        38
                                      ) + "..."}
                                    </Tooltip>
                                  ) : (
                                    <>{oneOffService?.serviceCatName}</>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {oneOffService?.servicesList?.map(
                            (subOneOff, index) => {
                              return (
                                <tr>
                                  <td>
                                    <div class="select-row align-center">
                                      <input
                                        type="checkbox"
                                        className="check check_tick"
                                        value={subOneOff?.isSelected}
                                        // id={`flexCheckDefault_${subOneOff.serviceID}`}
                                        onClick={() => {
                                          if (!subOneOff.isDisabled) {
                                            handleOneOffServiceCheckboxClick(
                                              oneOffService,
                                              subOneOff
                                            );
                                          }
                                        }}
                                        checked={subOneOff.isSelected}
                                        style={{
                                          cursor: `${subOneOff.isDisabled == true
                                            ? notAllowed
                                            : ""
                                            }`,
                                        }}
                                      />
                                      <label
                                        style={{
                                          wordBreak: "break-word",
                                          marginBottom: "0",
                                        }}
                                        onClick={() => {
                                          if (!subOneOff.isDisabled) {
                                            handleOneOffServiceCheckboxClick(
                                              oneOffService,
                                              subOneOff
                                            );
                                          }
                                        }}
                                      >
                                        {isMobile ? (
                                          <>
                                            {subOneOff.serviceName.length > 20
                                              ? subOneOff.serviceName.substring(
                                                0,
                                                20
                                              ) + "..."
                                              : subOneOff.serviceName}
                                          </>
                                        ) : (
                                          <>
                                            {subOneOff.serviceName.length >
                                              38 ? (
                                              <Tooltip
                                                title={subOneOff.serviceName}
                                              >
                                                {subOneOff.serviceName.substring(
                                                  0,
                                                  38
                                                ) + "..."}
                                              </Tooltip>
                                            ) : (
                                              <>{subOneOff.serviceName}</>
                                            )}
                                          </>
                                        )}
                                      </label>
                                    </div>
                                    {subOneOff?.pricingDriverList.length >= 1 &&
                                      subOneOff?.isSelected &&
                                      subOneOff?.pricingDriverList.map((i) => {
                                        return (
                                          <div
                                            style={{
                                              width: "90%",
                                              float: "right",
                                            }}
                                          >
                                            {i?.driverTypeID === 3 &&
                                              i?.driverVisibility && (
                                                <div>
                                                  <label className="mt-2">
                                                    <strong>
                                                      {isMobile ? (
                                                        <>
                                                          {i?.driverName
                                                            .substring(0, 10)
                                                            .replace(
                                                              /\b\w/g,
                                                              (l) =>
                                                                l.toUpperCase()
                                                            ) + "..."}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {i?.driverName
                                                            .length > 38 ? (
                                                            <Tooltip
                                                              title={
                                                                i?.driverName
                                                              }
                                                            >
                                                              {i?.driverName
                                                                .substring(
                                                                  0,
                                                                  38
                                                                )
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                ) + "..."}
                                                            </Tooltip>
                                                          ) : (
                                                            <>
                                                              {i?.driverName
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                )}
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </strong>
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </label>
                                                  <Select
                                                    options={i?.variation.map(
                                                      (variation) => ({
                                                        value:
                                                          variation.variationID,
                                                        label:
                                                          variation.variationName,
                                                        variationValue:
                                                          variation.variationValue,
                                                      })
                                                    )}
                                                    value={i?.variation
                                                      .filter(
                                                        (variation) =>
                                                          variation.isDefault ===
                                                          true
                                                      )
                                                      .map((i) => ({
                                                        value: i.variationID,
                                                        label: i.variationName,
                                                      }))}
                                                    onChange={(selectOption) =>
                                                      handleRecurringServiceDependsServerClick(
                                                        oneOffService,
                                                        subOneOff,
                                                        selectOption,
                                                        i,
                                                        "OneOffService"
                                                      )
                                                    }
                                                  />
                                                  {props.requireMessage &&
                                                    (i.driverValue === null ||
                                                      i.driverValue ===
                                                      undefined ||
                                                      i.driverValue === "") && (
                                                      <label className="text-danger">
                                                        {ERROR_MESSAGES}
                                                      </label>
                                                    )}
                                                </div>
                                              )}
                                            {i?.driverTypeID === 2 &&
                                              i?.driverVisibility && (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                  }}
                                                  id={`SelectServiceQuantity_${i.driverName}`}
                                                >
                                                  <label className="mt-2">
                                                    <strong>
                                                      {isMobile ? (
                                                        <>
                                                          {i?.driverName
                                                            .substring(0, 10)
                                                            .replace(
                                                              /\b\w/g,
                                                              (l) =>
                                                                l.toUpperCase()
                                                            ) + "..."}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {i?.driverName
                                                            .length > 38 ? (
                                                            <Tooltip
                                                              title={
                                                                i?.driverName
                                                              }
                                                            >
                                                              {i?.driverName
                                                                .substring(
                                                                  0,
                                                                  38
                                                                )
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                ) + "..."}
                                                            </Tooltip>
                                                          ) : (
                                                            <>
                                                              {i?.driverName
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                )}
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </strong>
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={i?.driverValue
                                                      ?.toString()
                                                      ?.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                      )}
                                                    onChange={(e) => {
                                                      OnQuantityValueChange(
                                                        oneOffService,
                                                        subOneOff,
                                                        i,
                                                        e.target.value,
                                                        "OneOffService"
                                                      );
                                                    }}
                                                    className="input-text"
                                                    placeholder={i?.driverName}
                                                  />
                                                  {props.requireMessage &&
                                                    (i?.driverValue ===
                                                      undefined ||
                                                      i?.driverValue === null ||
                                                      i?.driverValue === "") &&
                                                    i?.driverTypeID === 2 && (
                                                      <label className="text-danger">
                                                        {ERROR_MESSAGES}
                                                      </label>
                                                    )}
                                                </div>
                                              )}

                                            {i?.driverTypeID === 4 &&
                                              i?.driverVisibility && (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                  }}
                                                  id={`SelectServiceQuantity_${i.driverName}`}
                                                >
                                                  <label className="mt-1">
                                                    <strong>
                                                      {isMobile ? (
                                                        <>
                                                          {i?.driverName
                                                            .substring(0, 10)
                                                            .replace(
                                                              /\b\w/g,
                                                              (l) =>
                                                                l.toUpperCase()
                                                            ) + "..."}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {i?.driverName
                                                            .length > 38 ? (
                                                            <Tooltip
                                                              title={
                                                                i?.driverName
                                                              }
                                                            >
                                                              {i?.driverName
                                                                .substring(
                                                                  0,
                                                                  38
                                                                )
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                ) + "..."}
                                                            </Tooltip>
                                                          ) : (
                                                            <>
                                                              {i?.driverName
                                                                .replace(
                                                                  /\b\w/g,
                                                                  (l) =>
                                                                    l.toUpperCase()
                                                                )}
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </strong>
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </label>
                                                  <Select
                                                    options={i.slab.map(
                                                      (i) => ({
                                                        value: i.slabID,
                                                        label:
                                                          i.slabTypeID === 2
                                                            ? "Other"
                                                            : `${i.slabFrom
                                                              .toString()
                                                              .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                              )} - ${i.slabTo
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}`,
                                                        variationValue:
                                                          i.slabValue,
                                                      })
                                                    )}
                                                    // value={slabSelectedRecValue}
                                                    value={i?.slab
                                                      ?.filter(
                                                        (slab) =>
                                                          slab.isDefault ===
                                                          true
                                                      )
                                                      .map((i) => ({
                                                        value: i.slabID,
                                                        label:
                                                          i.slabTypeID === 2
                                                            ? "Other"
                                                            : `${i.slabFrom
                                                              .toString()
                                                              .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                              )} - ${i.slabTo
                                                                .toString()
                                                                .replace(
                                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                                  ","
                                                                )}`,
                                                      }))}
                                                    onChange={(selectOption) =>
                                                      handleRecurringServiceDependsServerClick(
                                                        oneOffService,
                                                        subOneOff,
                                                        selectOption,
                                                        i,
                                                        "OneOffService"
                                                      )
                                                    }
                                                  />
                                                  {i?.slab
                                                    ?.filter(
                                                      (slab) =>
                                                        slab.isDefault === true
                                                    )
                                                    .map((item) => {
                                                      return (
                                                        item.slabTypeID ===
                                                        2 && (
                                                          <input
                                                            type="text"
                                                            value={i?.driverValue
                                                              ?.toString()
                                                              ?.replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                              )}
                                                            onChange={(e) => {
                                                              OnIncrementalValueChange(
                                                                oneOffService,
                                                                subOneOff,
                                                                i,
                                                                e.target.value,
                                                                "OneOffService"
                                                              );
                                                            }}
                                                            className="input-text mt-2"
                                                            placeholder="Other"
                                                          />
                                                        )
                                                      );
                                                    })}

                                                  {props.requireMessage &&
                                                    (i.driverValue === null ||
                                                      i.driverValue ===
                                                      undefined ||
                                                      i.driverValue === "") && (
                                                      <label className="text-danger">
                                                        {ERROR_MESSAGES}
                                                      </label>
                                                    )}
                                                </div>
                                              )}
                                          </div>
                                        );
                                      })}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.requireMessage &&
        (props.recurringServiceList.some((i) =>
          i.servicesList.some((item) => item.isSelected)
        ) ||
          props.oneOffServiceList.some((i) =>
            i.servicesList.some((item) => item.isSelected)
          ) ? (
          ""
        ) : (
          <label
            className="validation mt-2"
            style={{ width: "100%", textAlign: "center" }}
          >
            Please select at least one service.
          </label>
        ))}
      <div class="separator"></div>
      <div
        class="row fieldset modal-footer"
        style={{ overflow: "auto", maxHeight: "150px" }}
      >
        <div class="col-lg-12 hstack gap-2 justify-content-end text-right mt-3 ">
          <div class="d-flex" style={{ overflowX: "auto" }}>
            {/* <button
              class="btn btn-md  btn-light mr-1"
              onClick={props.handleCancel}
            >
              <span>{getCrudButtonTextName("Cancel")}</span>
            </button> */}
            {props.getSAChanges ?
              <button class="btn btn-md btn-success declined-item-btn mr-1" onClick={() => props.DeclineSuperAdminChangesData("Decline")}>
                <span>Decline</span>
              </button> : <button class="btn btn-md  btn-light mr-1" onClick={props.handleCancel}>
                <span>{getCrudButtonTextName("Cancel")}</span>
              </button>
            }
            {props?.ProposalObject?.selectedProposalTypeValue === 1 && (
              <button
                onClick={() => props.HandleBack(5)}
                style={{ marginRight: "5px" }}
                className="btn btn-md btn-success create-item-btn"
              >
                <span>Back</span>
              </button>
            )}
            {props?.ProposalObject?.selectedProposalTypeValue === 3 && (
              <button
                onClick={() => props.HandleBack(1)}
                style={{ marginRight: "5px" }}
                className="btn btn-md btn-success create-item-btn"
              >
                <span>Back</span>
              </button>
            )}
            {props?.ProposalObject?.selectedProposalTypeValue === 4 && (
              <button
                onClick={() => props.HandleBack(1)}
                style={{ marginRight: "5px" }}
                className="btn btn-md btn-success create-item-btn"
              >
                <span>Back</span>
              </button>
            )}
            {(props?.moduleName == "Contract" ||
              props.moduleName === "Package") && (
                <>
                  <button
                    onClick={() => props.HandleBack(1)}
                    style={{ marginRight: "5px" }}
                    className="btn btn-md btn-success create-item-btn"
                  >
                    <span>Back</span>
                  </button>
                  <button
                    class="btn btn-md btn-success create-item-btn"
                    onClick={async () => {
                      await props.HandleTabChange(3);
                    }}
                  >
                    <span>Next</span>
                  </button>
                </>
              )}
            {props?.ProposalObject &&
              props?.ProposalObject?.selectedProposalTypeValue === 1 && (
                <button
                  className="btn btn-md btn-success create-item-btn"
                  onClick={async () => {
                    await props.HandleTabChange(7);
                  }}
                >
                  <span>Next</span>
                </button>
              )}
            {props?.ProposalObject &&
              props?.ProposalObject?.selectedProposalTypeValue === 3 && (
                <button
                  className="btn btn-md btn-success create-item-btn"
                  onClick={async () => {
                    await props.HandleTabChange(6);
                  }}
                >
                  <span>Next</span>
                </button>
              )}
            {props?.ProposalObject &&
              props?.ProposalObject?.selectedProposalTypeValue === 4 && (
                <button
                  className="btn btn-md btn-success create-item-btn"
                  onClick={async () => {
                    await props.HandleTabChange(4);
                  }}
                >
                  <span>Next</span>
                </button>
              )}
            {props.moduleName == "Quote" && (
              <button
                type="submit"
                class="btn btn-md btn-success create-item-btn text-nowrap"
                onClick={() =>
                  props.handleSaveAsDraft(
                    2,
                    moduleNameForSaveAsDraft,
                    statusID.Draft
                  )
                }
                style={{ marginLeft: "5px" }}
              >
                <span>Save as a Draft</span>
              </button>
            )}
            {props.moduleName == "Contract" && (
              <button
                type="submit"
                class="btn btn-md btn-success create-item-btn text-nowrap"
                onClick={() => props.HandleTabChange(3, statusID.Draft)}
                style={{ marginLeft: "5px" }}
              >
                <span>Save as a Draft</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
