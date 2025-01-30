import React, { useState, useEffect } from "react";
import {
  CountryName,
} from "../../redux/Services/CountryApi";
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
    if (props.openAddressPopUp) {
      if (
        props.title !== undefined &&
        props.title !== null &&
        props.title !== ""
      ) {
        getCountries(props.address?.country);
        const selected_Country = countries.filter(
          (c) => c.countryId == props.address?.countryId
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

  useEffect(() => {
    if (query.trim() === "") {
      setPredictions([]);
      return;
    }
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
        }
      }
    );
  }, [query]);

  const handleClearAddress = () => {
    setRequireErrorMessage(false);
    // Reset the state values for your input fields
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
  };

  const concatenateFullAddress = (address) => {
    const addPart = (part) => (part ? `${part}, ` : "");

    let concatenatedAddress = `${addPart(
      address?.addressLine1?.replace(",", " ")
    )}${addPart(address?.addressLine2)}${addPart(address?.locality)}${addPart(
      address?.region
      )}${addPart(address?.country || address?.countryName)}${address?.postcode || ""
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
              (c) => c.countryName == selectedCountryName
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
  };

  const handlePlaceSelect = (placeId) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
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
          (c) => c.countryName == updatedAddress.country
        )[0];
        setSelectedCountries({
          value: selectedCountry?.countryId,
          label: selectedCountry?.countryName,
        });

        updatedAddress = {
          ...updatedAddress,
          countryId: selectedCountry?.countryId,
        };

        setAddress({
          addressId:
            props.address?.addressId === null ? null : props.address?.addressId,
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
      className="AddressModal"
      open={props.openAddressPopUp}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="Responsive-Address">
        {/* </Modal.Header> */}
        <div className="fieldset-group margin-20">
          <label
            style={{ fontSize: "14px" }}
            className="fieldset-group-label required"
          >
            {props.title}
          </label>
          <div className="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label className="fieldset-label required SearchAddress-Modal">
                Search Address
              </label>
            </div>
            <div class="col-lg-9 col-md-9 ">
              <input
                type="text"
                className="input-text"
                value={query}
                onChange={(e) => {
                  let { value } = e.target;
                  // If there's no text or only spaces, allow trimming leading spaces
                  if (!value.trim()) {
                    value = value.trim();
                  } else {
                    // Capitalize first letter
                    value = value.charAt(0).toUpperCase() + value.slice(1);
                  }
                  // Update the state with the modified value
                  setQuery(value);
                }}
                placeholder="Search Address"
                autoComplete="off"
              />
              {predictions.length > 0 && (
                <div className="autocomplete-input-div show">
                  <ul className="locationSearchList">
                    {predictions.map((prediction) => (
                      <li
                        key={prediction.place_id}
                        onClick={() => {
                          setQuery("");
                          handlePlaceSelect(prediction.place_id);
                        }}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div class="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">
                Premises Or Address Line 1
              </label>
            </div>
            <div class="col-lg-9 col-md-9">
              <input
                class="input-text"
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

          <div class="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">Address Line 2</label>
            </div>
            <div class="col-lg-9 col-md-9">
              <input
                class="input-text"
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
          <div class="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">Town Or City</label>
            </div>
            <div class="col-lg-9 col-md-9">
              <input
                class="input-text"
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
          <div class="row fieldset ">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">Region Or County</label>
            </div>
            <div class="col-lg-9 col-md-9">
              <input
                class="input-text"
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
          <div class="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">Country</label>
            </div>
            <div class="col-lg-9 col-md-9">
              <div className="input-group">
                <Select
                  defaultValue="Select..."
                  options={countryValue}
                  className="SelectedCity"
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
          </div>
          <div class="row fieldset">
            <div class="col-md-3 col-sm-12 text-start text-md-end">
              <label class="fieldset-label required">
                Postcode
                <span className="text-danger">*</span>
              </label>
            </div>
            <div class="col-lg-9 col-md-9">
              <input
                type="text"
                class="input-text"
                placeholder="Postcode"
                value={address.postcode}
                onChange={(e) => {
                  const trimmedValue = e.target.value.replace(/[^a-z\d]/i, "");
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
              {requireErrorMessage &&
                (address.postcode === null ||
                  address.postcode === undefined ||
                  address.postcode === "") ? (
                <span className="validation">{ERROR_MESSAGES}</span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div style={{ float: "right" }}>
            <button
              type="button"
              style={{ padding: "4px" }}
              class="btn btn-md btn-light Clear-Address"
              // onClick={() => props.handleAddressPopUpClose();}
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
              class="btn btn-md btn-light Clear-Address"
              onClick={() => {
                handleClearAddress();
              }}
              variant="outlined"
            >
              <span>Clear Address</span>
            </button>
            <button
              type="button"
              class="btn btn-md btn-success create-item-btn"
              onClick={() => handleSetAddress()}
            >
              <span>Ok</span>
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default AddressModalComponent;
