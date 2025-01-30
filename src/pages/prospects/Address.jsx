import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DropDown from "../../components/DropDown";
import Utils from "../../Middleware/Utils";
import { Modal } from "react-bootstrap";
import { CountryCode, CountryName } from "../../redux/Services/CountryApi";
import {
  AddressLine1,
  AddressLine2,
  Locality,
  Postcode,
  Premises,
  Region,
} from "../../components/Validations";

export default function Address(props) {
  const [premises, setPremises] = React.useState("");
  const [premisesError, setPremisesError] = React.useState(false);
  const [address1, setAddress1] = React.useState("");
  const [address1Error, setAddress1Error] = React.useState(false);
  const [address2, setAddress2] = React.useState("");
  const [address1Error2, setAddress1Error2] = React.useState(false);
  const [locality, setLocality] = React.useState("");
  const [localityError, setLocalityError] = React.useState(false);
  const [region, setRegion] = React.useState("");
  const [regionError, setRegionError] = React.useState(false);
  const [postcode, setPostcode] = React.useState("");
  const [postcodeError, setPostcodeError] = React.useState(false);
  const [address, setAddress] = useState({
    premises: "",
    address1: "",
    address2: "",
    locality: "",
    region: "",
    country: "",
    postcode: "",
  });
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  // useEffect(() => {
  //   getCountries()

  // }, [title]);

  const getCountries = async () => {
    try {
      const data = await CountryName();

      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const CountryList = data?.data?.responseData?.data;
          setCountries(CountryList);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let countryValue;

  countryValue = countries.map((c) => ({
    value: c.countryId,
    label: c.countryName,
  }));

  const handleCountriesChange = (selectedCountry) => {
    setSelectedCountries(selectedCountry);
    setAddress({ ...address, country: selectedCountry.value });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

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

  const handlePlaceSelect = (placeId) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    placesService.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(place);

        const updatedAddress = { ...address };

        place.address_components.forEach((component) => {
          if (component.types.includes("premises")) {
            updatedAddress.premises = component.long_name;
          }
          if (component.types.includes("street_number")) {
            updatedAddress.address1 = component.long_name;
          }
          if (component.types.includes("route")) {
            updatedAddress.address2 = component.long_name;
          }
          if (component.types.includes("locality")) {
            updatedAddress.locality = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            updatedAddress.region = component.long_name;
          }
          if (component.types.includes("country")) {
            updatedAddress.country = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            updatedAddress.postcode = component.long_name;
          }
          if (component.types.includes("postal_town")) {
            updatedAddress.locality = component.long_name;
          }
        });
        setPredictions([]);
        const selectedCOuntry = countries.filter(
          (c) => c.countryName == updatedAddress.region
        )[0];
        setSelectedCountries({
          value: selectedCOuntry.countryId,
          label: selectedCOuntry.countryName,
        });
        setAddress(updatedAddress);
        const fullAddress = `${updatedAddress.premises || ""} ${
          updatedAddress.address1 || ""
        } ${updatedAddress.address2 || ""} ${updatedAddress.locality || ""} ${
          updatedAddress.region || ""
        } ${updatedAddress.country || ""} ${updatedAddress.postcode || ""}`;

        setFullAddress(fullAddress.trim());
      } else {
        console.error("Error fetching place details");
      }
    });
  };

  return (
    <div
      class={props.class}
      id={props.id}
      tabIndex={props.tabIndex}
      aria-labelledby={props.aria_labelledby}
      aria-hidden={props.aria_hidden}
    >
      <div className="fieldset-group margin-20">
        <label className="fieldset-group-label required margin-20 prospect-address-title">
          Residential Address
        </label>

        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Search Address
              <span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <input
              style={{ padding: "5px" }}
              class="input-text"
              value={query}
              onChange={handleInputChange}
              id="category-description"
              placeholder="Search Address"
              autofocus
            />
            {predictions && (
              <ul>
                {predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handlePlaceSelect(prediction.place_id)}
                  >
                    {prediction.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Premises
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <Premises
              premises={address.premises}
              setPremises={setPremises}
              premisesError={premisesError}
              setPremisesError={setPremisesError}
            />
          </div>
        </div>

        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Address Line 1<span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <AddressLine1
              address1={address.address1}
              setAddress1={setAddress1}
              address1Error={address1Error}
              setAddress1Error={setAddress1Error}
            />
          </div>
        </div>

        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Address Line 2<span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <AddressLine2
              address2={address.address2}
              setAddress2={setAddress2}
              address1Error2={address1Error2}
              setAddress1Error2={setAddress1Error2}
            />
          </div>
        </div>
        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label
              htmlFor="customerName-field"
              // class="fieldset-label required"
            >
              Locality (Town/City)
              <span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <Locality
              locality={address.locality}
              setLocality={setLocality}
              localityError={localityError}
              setLocalityError={setLocalityError}
            />
          </div>
        </div>
        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label
              htmlFor="customerName-field"
              // class="fieldset-label required"
            >
              Region (County/State)
              <span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <Region
              region={address.region}
              setRegion={setRegion}
              regionError={regionError}
              setRegionError={setRegionError}
            />
          </div>
        </div>
        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Country
              <span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <DropDown
              className="phone-input-country-code selectDropDown Drop-down-width"
              options={countryValue}
              value={selectedCountry}
              onChange={handleCountriesChange}
            />
          </div>
        </div>
        <div class="row fieldset">
          <div class="col-lg-3 col-md-4 col-sm-12 text-right">
            <label htmlFor="customerName-field" class="fieldset-label required">
              Postcode
              <span className="text-danger">*</span>
            </label>
          </div>
          <div class="col-lg-9 col-md-8 col-sm-12">
            <Postcode
              postcode={address.postcode}
              setPostcode={setPostcode}
              postcodeError={postcodeError}
              setPostcodeError={setPostcodeError}
            />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div style={{ float: "right", padding: "20px" }}>
          <Button
            variant="outlined"
            style={{ textTransform: "capitalize", margin: "10px" }}
          >
            Cancel
          </Button>
          <Button variant="outlined" style={{ textTransform: "capitalize" }}>
            Clear Address
          </Button>
          <Button style={{ textTransform: "capitalize" }}>Ok</Button>
        </div>
      </div>
    </div>
  );
}
