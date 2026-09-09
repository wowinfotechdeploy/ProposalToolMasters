import React, { useState, useEffect, useRef } from "react";
import { CountryName } from "../../redux/Services/CountryApi";
import Select from "react-select";
import { Box, Modal } from "@mui/material";
import "./AddressModalStyle.css";
import { ERROR_MESSAGES } from "../GlobalMessage";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: 650,
  // height:300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function AddressModalComponent(props) {
  const addressDebounceRef = useRef(null);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedCountry, setSelectedCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState({
    addressId: null,
    premises: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    region: "",
    country: "",
    countryId: null,
    postcode: "",
  });

  const [countries, setCountries] = useState([]);
  let countryValue;

  useEffect(() => {
    if (
      props.openAddressPopUp &&
      props.modelRequestData?.model === "Registered Office Address"
    ) {
      if (
        props.title !== undefined &&
        props.title !== null &&
        props.title !== ""
      ) {
        getCountries(props.companyAddress?.country);
        const selected_Country = countries.filter(
          (c) => c.countryId == props.companyAddress?.countryId,
        )[0];

        setSelectedCountries({
          value: selected_Country?.countryId,
          label: selected_Country?.countryName,
        });

        setAddress({
          addressId:
            props.companyAddress?.addressId === null
              ? null
              : props.companyAddress?.addressId,
          premises:
            props.companyAddress?.premises === null
              ? ""
              : props.companyAddress?.premises,
          addressLine1:
            props.companyAddress?.addressLine1 === null
              ? ""
              : props.companyAddress?.addressLine1,
          addressLine2:
            props.companyAddress?.addressLine2 === null
              ? ""
              : props.companyAddress?.addressLine2,
          locality:
            props.companyAddress?.locality === null
              ? ""
              : props.companyAddress?.locality,
          region:
            props.companyAddress?.region === null
              ? ""
              : props.companyAddress?.region,
          country:
            props.companyAddress?.country === null
              ? ""
              : props.companyAddress?.country,
          countryId:
            props.companyAddress?.countryId === null
              ? null
              : props.companyAddress?.countryId,
          postcode:
            props.companyAddress?.postcode === null
              ? ""
              : props.companyAddress?.postcode,
        });

        const fullAddress = concatenateFullAddress(props.companyAddress);
        setFullAddress(fullAddress);
      }
    } else if (props.openAddressPopUp) {
      if (
        props.title !== undefined &&
        props.title !== null &&
        props.title !== ""
      ) {
        getCountries(props.address?.country);
        const selected_Country = countries.filter(
          (c) => c.countryId == props.address?.countryId,
        )[0];

        setSelectedCountries({
          value: selected_Country?.countryId,
          label: selected_Country?.countryName,
        });

        setAddress({
          addressId:
            props.address?.addressId === null ? null : props.address?.addressId,
          premises:
            props.address?.premises === null ? "" : props.address?.premises,
          addressLine1:
            props.address?.addressLine1 === null
              ? ""
              : props.address?.addressLine1,
          addressLine2:
            props.address?.addressLine2 === null
              ? ""
              : props.address?.addressLine2,
          locality:
            props.address?.locality === null ? "" : props.address?.locality,
          region: props.address?.region === null ? "" : props.address?.region,
          country:
            props.address?.country === null ? "" : props.address?.country,
          countryId:
            props.address?.countryId === null ? null : props.address?.countryId,
          postcode:
            props.address?.postcode === null ? "" : props.address?.postcode,
        });

        const fullAddress = concatenateFullAddress(props.address);
        setFullAddress(fullAddress);
      }
    }
  }, [props.openAddressPopUp]);

  // useEffect(() => {
  //   if (query.trim() === "") {
  //     setPredictions([]);
  //     return;
  //   }
  //   const autocompleteService =
  //     new window.google.maps.places.AutocompleteService();
  //   autocompleteService.getPlacePredictions(
  //     {
  //       input: query,
  //       componentRestrictions: { country: "uk" },
  //     },
  //     (predictions, status) => {
  //       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
  //         setPredictions(predictions);
  //       } else {
  //         console.error("Error fetching predictions");
  //       }
  //     }
  //   );
  // }, [query]);

  useEffect(() => {
    if (query.trim() === "") {
      setPredictions([]);
      return;
    }

    const handler = setTimeout(() => {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "uk" },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(predictions);
          } else {
            console.error("Error fetching predictions");
            setPredictions([]);
          }
        },
      );
    }, 700); // 700ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  // useEffect(() => {
  //     if (query.trim() === "") {
  //       setPredictions([]);
  //       return;
  //     }

  //     const handler = setTimeout(async () => {
  //       try {
  //         const { AutocompleteSuggestion } = await window.google.maps.importLibrary("places");

  //         // Fetch predictions
  //         const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
  //           input: query,
  //           includedRegionCodes: ["gb"],
  //         });

  //         const formatted = suggestions.map((s) => ({
  //           description: `${s.placePrediction.mainText.text}${s.placePrediction.secondaryText
  //               ? ", " + s.placePrediction.secondaryText.text
  //               : ""
  //             }`,
  //           place_id: s.placePrediction.placeId,
  //         }));

  //         setPredictions(formatted);
  //       } catch (err) {
  //         console.error("Error fetching predictions", err);
  //         setPredictions([]);
  //       }
  //     },700);
  //     // cleanup
  //     return () => clearTimeout(handler);
  //   }, [query]);

  const handleClearAddress = () => {
    setRequireErrorMessage(false);
    // Reset the state values for your input fields
    if (props.modelRequestData?.model === "Registered Office Address") {
      setAddress({
        addressId:
          props.companyAddress?.addressId === null
            ? null
            : props.companyAddress?.addressId,
        premises: "",
        addressLine1: "",
        addressLine2: "",
        locality: "",
        region: "",
        country: "",
        countryId: null,
        postcode: "",
      });
      setFullAddress("");
      setQuery("");
      setSelectedCountries([]);
    } else {
      setAddress({
        addressId:
          props.address?.addressId === null ? null : props.address?.addressId,
        premises: "",
        addressLine1: "",
        addressLine2: "",
        locality: "",
        region: "",
        country: "",
        countryId: null,
        postcode: "",
      });
      setFullAddress("");
      setQuery("");
      setSelectedCountries([]);
    }
  };

  const concatenateFullAddress = (address) => {
    const addPart = (part) => (part ? `${part}, ` : "");

    let concatenatedAddress = `${addPart(
      address?.addressLine1?.replace(",", " "),
    )}${addPart(address?.addressLine2)}${addPart(address?.locality)}${addPart(
      address?.region,
    )}${addPart(address?.country || address?.countryName)}${
      address?.postcode || ""
    }`;

    // Remove trailing comma, if present
    if (concatenatedAddress.endsWith(", ")) {
      concatenatedAddress = concatenatedAddress.slice(0, -2);
    }
    return concatenatedAddress;
  };

  const getCountries = async (selectedCountryName) => {
    try {
      const data = await CountryName();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const CountryList = data?.data?.responseData?.data;
          setCountries(CountryList);

          if (
            selectedCountryName !== undefined &&
            selectedCountryName !== null &&
            selectedCountryName.trim() !== ""
          ) {
            const selected_Country = CountryList.filter(
              (c) => c.countryName == selectedCountryName,
            )[0];

            setSelectedCountries({
              value: selected_Country?.countryId,
              label: selected_Country?.countryName,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCountriesChange = (selectedCountry) => {
    setSelectedCountries(selectedCountry);
    setAddress({
      ...address,
      countryId: selectedCountry.value,
      country: selectedCountry.label,
    });
  };

  const handleSetAddress = () => {
    if (props.modelRequestData?.model === "Registered Office Address") {
      if (
        address.postcode === null ||
        address.postcode === "" ||
        address.postcode === undefined
      ) {
        setRequireErrorMessage(true);
        return false;
      }
      setQuery("");
      props.setCompanyAddress(address);
      // props.setCompanyAddress({ ...props.companyAddress, address });
      const fullAddress = concatenateFullAddress(address);
      props.setFullAddress(fullAddress.trim());
      props.setAddressUpdatedDatetime(Date.now());
      props.setOpenAddressPopUp(false);
    } else {
      if (
        address.postcode === null ||
        address.postcode === "" ||
        address.postcode === undefined
      ) {
        setRequireErrorMessage(true);
        return false;
      }
      setQuery("");
      props.setAddress({ ...props.address, address });
      const fullAddress = concatenateFullAddress(address);
      props.setFullAddress(fullAddress.trim());
      props.setAddressUpdatedDatetime(Date.now());
      props.setOpenAddressPopUp(false);
    }
  };

  const handlePlaceSelect = (placeId) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
    placesService.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        let updatedAddress = {
          addressId: props.address?.addressId,
          premises: "",
          addressLine1: "",
          addressLine2: "",
          locality: "",
          region: "",
          country: "",
          countryId: null,
          postcode: "",
        };
        place.address_components.forEach((component) => {
          switch (true) {
            case component.types.includes("street_number") ||
              component.types.includes("premise"):
              updatedAddress.premises = component.long_name;
              break;

            case component.types.includes("locality"):
              updatedAddress.addressLine1 = component.long_name;
              break;

            case component.types.includes("route"):
              if (updatedAddress.addressLine1) {
                updatedAddress.addressLine2 = component.long_name;
              } else {
                updatedAddress.addressLine1 = component.long_name;
              }
              break;

            case component.types.includes("postal_town"):
              updatedAddress.locality = component.long_name;
              break;

            case component.types.includes("administrative_area_level_2"):
              updatedAddress.region = component.long_name;
              break;

            case component.types.includes("country"):
              updatedAddress.country = component.long_name;
              break;

            case component.types.includes("postal_code"):
              updatedAddress.postcode = component.long_name;
              break;
          }
        });

        setPredictions([]);
        const selectedCountry = countries.filter(
          (c) => c.countryName == updatedAddress.country,
        )[0];
        setSelectedCountries({
          value: selectedCountry?.countryId,
          label: selectedCountry?.countryName,
        });

        updatedAddress = {
          ...updatedAddress,
          countryId: selectedCountry?.countryId,
        };

        if (props.modelRequestData?.model === "Trading Address") {
          setAddress({
            addressId:
              props.address?.addressId === null
                ? null
                : props.address?.addressId,
            premises: updatedAddress.premises,
            addressLine1:
              updatedAddress.premises != undefined &&
              updatedAddress.premises != null &&
              updatedAddress.premises != ""
                ? `${updatedAddress.premises},${updatedAddress.addressLine1}`
                : updatedAddress.addressLine1,
            addressLine2: updatedAddress.addressLine2,
            locality: updatedAddress.locality,
            region: updatedAddress.region,
            country: updatedAddress.country,
            countryId: updatedAddress.countryId,
            postcode: updatedAddress.postcode,
          });
        } else if (
          props.modelRequestData?.model === "Registered Office Address"
        ) {
          setAddress({
            addressId:
              props.companyAddress?.addressId === null
                ? null
                : props.companyAddress?.addressId,
            premises: updatedAddress.premises,
            addressLine1:
              updatedAddress.premises != undefined &&
              updatedAddress.premises != null &&
              updatedAddress.premises != ""
                ? `${updatedAddress.premises},${updatedAddress.addressLine1}`
                : updatedAddress.addressLine1,
            addressLine2: updatedAddress.addressLine2,
            locality: updatedAddress.locality,
            region: updatedAddress.region,
            country: updatedAddress.country,
            countryId: updatedAddress.countryId,
            postcode: updatedAddress.postcode,
          });
        }

        // setAddress(updatedAddress)
        const fullAddress = concatenateFullAddress(updatedAddress);
        setFullAddress(fullAddress.trim());
      } else {
        console.error("Error fetching place details");
      }
    });
  };

  countryValue = countries.map((country) => ({
    value: country?.countryId,
    label: country?.countryName,
  }));

  return (
    <Modal
      className="AddressModal address-modal-redesign"
      open={props.openAddressPopUp}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="Responsive-Address address-modal-panel">
        <div className="address-modal-header">
          <div className="address-modal-heading">
            <span className="address-modal-heading-icon">
              <i className="ri-map-pin-line"></i>
            </span>

            <div>
              <h5 id="modal-modal-title">{props.title}</h5>
              <p>Search for an address or enter the details manually.</p>
            </div>
          </div>

          <button
            type="button"
            className="address-modal-close-btn"
            aria-label="Close"
            onClick={() => {
              props.handleAddressPopUpClose();
              handleClearAddress();
            }}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="address-modal-body">
          <div className="address-modal-search-section">
            <label className="address-modal-label required">
              Search Address
            </label>

            <div className="address-modal-search-wrap">
              <span className="address-modal-search-icon">
                <i className="ri-search-line"></i>
              </span>

              <input
                type="text"
                className="input-text address-modal-input address-modal-search-input"
                value={query}
                onChange={(e) => {
                  let { value } = e.target;
                  if (!value.trim()) {
                    value = value.trim();
                  } else {
                    value = value.charAt(0).toUpperCase() + value.slice(1);
                  }
                  setQuery(value);
                }}
                placeholder="Search Address"
                autoComplete="off"
              />

              {predictions.length > 0 && (
                <div className="autocomplete-input-div show address-modal-autocomplete">
                  <ul className="locationSearchList">
                    {predictions.map((prediction) => (
                      <li
                        key={prediction.place_id}
                        onClick={() => {
                          setQuery("");
                          handlePlaceSelect(prediction.place_id);
                        }}
                      >
                        <i className="ri-map-pin-2-line"></i>
                        <span>{prediction.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <span className="address-modal-search-help">
              Start typing to search UK addresses.
            </span>
          </div>

          <div className="address-modal-divider"></div>

          <div className="address-modal-form-grid">
            <div className="address-modal-field address-modal-field-full">
              <label className="address-modal-label required">
                Premises Or Address Line 1
              </label>

              <div className="address-modal-input-wrap">
                <span className="address-modal-field-icon">
                  <i className="ri-home-4-line"></i>
                </span>

                <input
                  className="input-text address-modal-input"
                  placeholder="Premises Or Address Line 1"
                  value={address.addressLine1}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/^\s+/, "");
                    if (!/^[^+-.]*$/.test(trimmedValue)) {
                      return;
                    }
                    setAddress({
                      ...address,
                      addressLine1: trimmedValue,
                    });
                  }}
                />
              </div>
            </div>

            <div className="address-modal-field address-modal-field-full">
              <label className="address-modal-label required">
                Address Line 2
              </label>

              <div className="address-modal-input-wrap">
                <span className="address-modal-field-icon">
                  <i className="ri-road-map-line"></i>
                </span>

                <input
                  className="input-text address-modal-input"
                  placeholder="Address Line 2"
                  value={address.addressLine2}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/^\s+/, "");
                    if (!/^[^+-.]*$/.test(trimmedValue)) {
                      return;
                    }
                    setAddress({
                      ...address,
                      addressLine2: trimmedValue,
                    });
                  }}
                />
              </div>
            </div>

            <div className="address-modal-field">
              <label className="address-modal-label required">
                Town Or City
              </label>

              <div className="address-modal-input-wrap">
                <span className="address-modal-field-icon">
                  <i className="ri-building-2-line"></i>
                </span>

                <input
                  className="input-text address-modal-input"
                  placeholder="Town Or City"
                  value={address.locality}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/^\s+/, "");
                    if (!/^[^+-.]*$/.test(trimmedValue)) {
                      return;
                    }
                    setAddress({
                      ...address,
                      locality: trimmedValue,
                    });
                  }}
                />
              </div>
            </div>

            <div className="address-modal-field">
              <label className="address-modal-label required">
                Region Or County
              </label>

              <div className="address-modal-input-wrap">
                <span className="address-modal-field-icon">
                  <i className="ri-map-2-line"></i>
                </span>

                <input
                  className="input-text address-modal-input"
                  placeholder="Region Or County"
                  value={address.region}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(/^\s+/, "");
                    if (!/^[^+-.]*$/.test(trimmedValue)) {
                      return;
                    }
                    setAddress({
                      ...address,
                      region: trimmedValue,
                    });
                  }}
                />
              </div>
            </div>

            <div className="address-modal-field">
              <label className="address-modal-label required">Country</label>

              <div className="address-modal-select-wrap">
                <Select
                  defaultValue="Select..."
                  options={countryValue}
                  className="SelectedCity address-modal-country-select"
                  classNamePrefix="address-country"
                  value={
                    selectedCountry?.value === undefined ||
                    selectedCountry?.value === null
                      ? []
                      : selectedCountry
                  }
                  onChange={handleCountriesChange}
                  placeholder="Select Country"
                />
              </div>
            </div>

            <div className="address-modal-field">
              <label className="address-modal-label required">
                Postcode
                <span className="text-danger">*</span>
              </label>

              <div className="address-modal-input-wrap">
                <span className="address-modal-field-icon">
                  <i className="ri-mail-send-line"></i>
                </span>

                <input
                  type="text"
                  className="input-text address-modal-input"
                  placeholder="Postcode"
                  value={address.postcode}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.replace(
                      /[^a-z\d]/i,
                      "",
                    );
                    if (!/^[^+-.]*$/.test(trimmedValue)) {
                      return;
                    }
                    setAddress({
                      ...address,
                      postcode: trimmedValue,
                    });
                  }}
                  maxLength={10}
                />
              </div>

              {requireErrorMessage &&
              (address.postcode === null ||
                address.postcode === undefined ||
                address.postcode === "") ? (
                <span className="validation address-modal-validation">
                  {ERROR_MESSAGES}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="address-modal-footer">
          <button
            type="button"
            className="btn btn-md btn-light Clear-Address address-modal-close-action"
            onClick={() => {
              props.handleAddressPopUpClose();
              handleClearAddress();
            }}
            variant="outlined"
          >
            <span>Close</span>
          </button>

          <button
            type="button"
            className="btn btn-md btn-light Clear-Address address-modal-clear-btn"
            onClick={() => {
              handleClearAddress();
            }}
            variant="outlined"
          >
            <i className="ri-refresh-line"></i>
            <span>Clear Address</span>
          </button>

          <button
            type="button"
            className="btn btn-md btn-success create-item-btn address-modal-save-btn"
            onClick={() => handleSetAddress()}
          >
            <i className="ri-check-line"></i>
            <span>Ok</span>
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default AddressModalComponent;
