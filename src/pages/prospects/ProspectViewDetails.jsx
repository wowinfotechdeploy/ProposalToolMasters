import React, { useContext, useEffect, useState } from "react";
import CommonButtonComponent from "../../components/CommonButtonComponent";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import "../proposals/Proposals.css";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { GetClientInformationModel } from "../../redux/Services/client/clientAPI";
import { CountryCode, CountryName } from "../../redux/Services/CountryApi";
import { CLIENT_TYPES } from "../../Middleware/enums";
import { GetIncorporatedInLookUpList } from "../../redux/Services/Master/IncorporatedInLookUpList";
import Footer from "../../components/Footer";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import "./Prospects.css";
const ProspectViewDetails = () => {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [IncorporatedValue, setIncorporateValue] = useState("");
  const [incorporatedInList, setIncorporatedInList] = useState([]);
  const { setTopbar, prospectName, setLoader, isMobile } =
    useContext(AuthContextProvider);
  const [basicInfo, setBasicInfo] = useState({
    clientKeyID: null,
    addressId: null,
    businessTypeID: null,
    originalBusinessTypeID: null,
    businessTypeName: "",
    tradingName: null,
    tradingAddress: null,
    VATReg: null,
    VATNumber: null,
    website: null,
    businessNatureNames: null,
    NatureOfBusiness: [],
  });
  const navigate = useNavigate();
  const [companyForm, setCompanyForm] = useState({
    companyID: null,
    companyName: null,
    companyType: null,
    companyNumber: null,
    companyStatus: null,
    addressID: null,
    incorporationDate: null,
    incInID: null,
    moduleName: null,
    moduleID: null,
    companyAddress: null,
    entityType: null,
  });
  const [officersForm, setOfficers] = useState([
    {
      officerID: null,
      firstName: null,
      lastName: null,
      countryCodeID: null,
      phoneCountryCodeID: null,
      phoneNo: null,
      emailID: null,
      addressID: null,
      isAuthorisedSignatory: null,
      officerRole: null,
      appointedOn: null,
      moduleName: null,
      moduleID: null,
      officersAddress: {
        addressId: null,
        premises: null,
        addressLine1: null,
        addressLine2: null,
        locality: null,
        region: null,
        countryId: null,
        postcode: null,
      },
    },
  ]);
  const [concatenatedResidentialAddress, setConcatenatedResidentialAddress] =
    useState([{ officersFullAddress: null }]);
  const [concatenatedTradingAddress, setConcatenatedTradingAddress] =
    useState("");

  const [concatenatedRegisterAddress, setConcatenatedRegisterAddress] =
    useState("");
  const location = useLocation();
  const [saveLocationState, setSaveLocationState] = useState(location.state);
  // initial UseEffect
  useEffect(() => {
    setTopbar("block");
  }, []);

  useEffect(() => {
    if (
      saveLocationState?.Action !== undefined &&
      saveLocationState?.Action !== null
    ) {
      GetClientInformationModelData(saveLocationState.clientKeyID);
    }
  }, [saveLocationState]);

  const GetClientInformationModelData = async (id) => {
    if (!id) {
      return;
    }
    setLoader(true);
    try {
      const data = await GetClientInformationModel(id);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        if (data?.data?.responseData?.data) {
          let CountryList;
          const countryCodeData = await CountryCode();
          if (countryCodeData?.data?.statusCode === 200) {
            if (countryCodeData?.data?.responseData?.data) {
              CountryList = countryCodeData?.data?.responseData?.data;
              CountryList = CountryList.map((countryCode) => ({
                value: countryCode.countryCodeId,
                label: countryCode.countryCode,
              }));
            }
          }
          const IncIn = await GetIncorporatedInLookUpList();
          let incorporateInListData = IncIn?.data?.responseData?.data;
          // incorporateInListData = incorporateInListData.map((incIn) => ({
          //   value: incIn.incInID,
          //   label: incIn.incInName,
          // }));
          // setIncorporatedInList(incorporateInListData);

          const ModelData = data?.data?.responseData?.data;
          const AddressObj = {
            addressId: ModelData.tradingAddress.addressId,
            premises: ModelData.tradingAddress.premises,
            addressLine1: ModelData.tradingAddress.addressLine1,
            addressLine2: ModelData.tradingAddress.addressLine2,
            locality: ModelData.tradingAddress.locality,
            region: ModelData.tradingAddress.region,
            countryId: ModelData.tradingAddress.countryId,
            postcode: ModelData.tradingAddress.postcode,
          };

          setBasicInfo({
            ...basicInfo,
            clientKeyID: ModelData.clientKeyID,
            originalBusinessTypeID: ModelData.originalBusinessTypeID,
            businessTypeID: ModelData.businessTypeID,
            businessTypeName: ModelData.businessTypeName,
            tradingName: ModelData.tradingBusinessName,
            tradingAddress: AddressObj,
            VATReg: ModelData.isVatRegistered,
            VATNumber: ModelData.vatNumber,
            website: ModelData.websiteName,
            NatureOfBusiness: ModelData.NatureOfBusiness,
            businessNatureNames: ModelData.businessNatureNames,
          });

          let officerArray = [];
          ModelData.officersList.forEach((item) => {
            const PhoneSelectedValue = CountryList.find(
              (countryCode) => item.countryCodeID == countryCode.value
            );
            let officerObj = {
              officerID: item.officerID,
              firstName: item.firstName,
              lastName: item.lastName,
              countryCodeID: item.countryCodeID,
              phoneCountryCodeID: PhoneSelectedValue,
              phoneNo: item.phoneNo,
              emailID: item.emailID,
              addressID: item.addressID,
              isAuthorisedSignatory: item.isAuthorisedSignatory,
              officerRole: item.officerRole,
              appointedOn: item.appointedOn,
              moduleName: item.moduleName,
              moduleID: item.moduleID,
              officersAddress: {
                addressId: item.officersAddress.addressId,
                premises: item.officersAddress.premises,
                addressLine1: item.officersAddress.addressLine1,
                addressLine2: item.officersAddress.addressLine2,
                locality: item.officersAddress.locality,
                region: item.officersAddress.region,
                countryId: item.officersAddress.countryID,
                postcode: item.officersAddress.postcode,
                countryName: item.officersAddress.countryName,
              },
            };
            officerArray.push(officerObj);
          });

          setOfficers(officerArray);
          let companyObj = {
            companyID: ModelData.companyDetails.companyID,
            companyName: ModelData.companyDetails.companyName,
            companyType: ModelData.companyDetails.companyType,
            companyNumber: ModelData.companyDetails.companyNumber,
            companyStatus: ModelData.companyDetails.companyStatus,
            addressID: ModelData.companyDetails.addressID,
            incorporationDate: ModelData.companyDetails.incorporationDate,
            incInID: ModelData.companyDetails.incInID,
            moduleName: ModelData.companyDetails.moduleName,
            moduleID: ModelData.companyDetails.moduleID,
            companyAddress: {
              addressId: ModelData.companyDetails.companyAddress?.addressId,
              premises: ModelData.companyDetails.companyAddress?.premises,
              addressLine1:
                ModelData.companyDetails.companyAddress?.addressLine1,
              addressLine2:
                ModelData.companyDetails.companyAddress?.addressLine2,
              locality: ModelData.companyDetails.companyAddress?.locality,
              region: ModelData.companyDetails.companyAddress?.region,
              countryId: ModelData.companyDetails.companyAddress?.countryId,
              postcode: ModelData.companyDetails.companyAddress?.postcode,
            },
          };

          setCompanyForm(companyObj);
          const fullAddress = concatenateFullAddress(
            ModelData.companyDetails?.companyAddress
          );
          setConcatenatedRegisterAddress(fullAddress);

          let CorrespondenceOrResidentialAddress = [];
          ModelData.officersList.forEach((officer, index) => {
            const address = officer.officersAddress;
            if (address) {
              let fullAddressConcatenation = concatenateFullAddress(address);
              let CorrespondenceOrResidentialAddressObj = {
                officersFullAddress: fullAddressConcatenation,
              };
              CorrespondenceOrResidentialAddress.push(
                CorrespondenceOrResidentialAddressObj
              );
            } else {
              CorrespondenceOrResidentialAddress.push({
                officersFullAddress: null,
              });
            }
          });
          setConcatenatedResidentialAddress(CorrespondenceOrResidentialAddress);

          if (ModelData.tradingAddress) {
            //const addPart = (part) => (part ? `${part}, ` : "");
            const fullAddress = concatenateFullAddress(
              ModelData.tradingAddress
            );
            //`${addPart(ModelData.tradingAddress?.premises)}${addPart(ModelData.tradingAddress?.addressLine1)}${addPart(ModelData.tradingAddress?.addressLine2)}${addPart(ModelData.tradingAddress?.locality)}${addPart(ModelData.tradingAddress?.region)}${addPart(ModelData.tradingAddress?.country)}${ModelData.tradingAddress?.postcode || ""}`;
            setConcatenatedTradingAddress(fullAddress);
          }
          const IncorporateValue = incorporateInListData.filter(
            (item) => ModelData.companyDetails.incInID == item.incInID
          );

          setIncorporateValue(IncorporateValue[0].incInName);
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const concatenateFullAddress = (address) => {
    const addPart = (part) => (part ? `${part}, ` : "");
    let concatenatedAddress = `${addPart(address?.addressLine1)}${addPart(
      address?.addressLine2
    )}${addPart(address?.locality)}${addPart(address?.region)}${addPart(
      address?.country
    )}${addPart(address?.countryName)}${address?.postcode || ""}`;

    // Remove trailing comma, if present
    if (concatenatedAddress.endsWith(", ")) {
      concatenatedAddress = concatenatedAddress.slice(0, -2);
    }
    return concatenatedAddress;
  };

  return (
    <div className="container">
      <div class="main-content">
        <div class="page-content page-background prospect-bg">
          <div class="page-info-header page-info-strip">
            <div class="container">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-6">
                  <div class="page-title-cls">{prospectName}</div>
                </div>
                <div class="col-md-6 col-sm-6 col-6">
                  <div
                    class="d-flex justify-content-sm-end add-new-btn"
                    style={{ float: "right" }}
                  >
                    <Tooltip title={"Back"}>
                      <button
                        className="btn btn-md btn-success create-item-btn"
                        onClick={() => navigate("/prospects")}
                      >
                        <i className="fa fa-arrow-left d-md-none"></i>
                        <span className="d-none d-sm-inline">Back</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container-fluid ">
            <div class="row">
              <div className="col-lg-12">
                <div class="card" style={{ marginTop: "75px" }}>
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div class="search-box ms-2 width-searchbox prospect-form">
                        <div class=" table-card  mb-3 Height_View_scroll">
                          <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                              <a
                                class="nav-link tab_nav active"
                                data-bs-toggle="tab"
                                href="#base-justified-home"
                                role="tab"
                                aria-selected="false"
                              >
                                {prospectName} Details
                              </a>
                            </li>
                            {basicInfo.originalBusinessTypeID ===
                              CLIENT_TYPES.Individual ? null : (
                              <li class="nav-item">
                                {basicInfo.originalBusinessTypeID ===
                                  CLIENT_TYPES.Partnership ? (
                                  <a
                                    class="nav-link tab_nav"
                                    data-bs-toggle="tab"
                                    href="#product"
                                    role="tab"
                                    aria-selected="false"
                                  >
                                    Partner Details
                                  </a>
                                ) : null}
                                {basicInfo.originalBusinessTypeID ===
                                  CLIENT_TYPES.Sole_Trader ? (
                                  <a
                                    class="nav-link tab_nav"
                                    data-bs-toggle="tab"
                                    href="#product"
                                    role="tab"
                                    aria-selected="false"
                                  >
                                    Sole Trader Details
                                  </a>
                                ) : null}
                                {basicInfo.originalBusinessTypeID ===
                                  CLIENT_TYPES.LLP ||
                                  basicInfo.originalBusinessTypeID ===
                                  CLIENT_TYPES.Company ? (
                                  <a
                                    class="nav-link tab_nav"
                                    data-bs-toggle="tab"
                                    href="#product"
                                    role="tab"
                                    aria-selected="false"
                                  >
                                    {" "}
                                    Officer Details
                                  </a>
                                ) : null}
                              </li>
                            )}
                          </ul>
                          <div class="tab-content  text-muted">
                            <div
                              class="tab-pane active"
                              id="base-justified-home"
                              role="tabpanel"
                            >
                              <table class="table table-striped fs-13 view-details-table">
                                <tbody>
                                  <tr>
                                    <td>{prospectName} Type</td>
                                    <td class="text-end">
                                      {basicInfo.businessTypeName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="break-table" colspan="2"></td>
                                  </tr>
                                  {basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Individual ||
                                    basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Sole_Trader ||
                                    basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Partnership ? null : (
                                    <>
                                      <tr>
                                        <td>VAT Registered</td>
                                        <td class="text-end">
                                          {basicInfo.VATReg === 0 ? "Yes" : ""}
                                          {basicInfo.VATReg === 1 ? "No" : ""}
                                        </td>
                                      </tr>
                                      {basicInfo.VATNumber !== null && (
                                        <tr>
                                          <td>VAT Number</td>
                                          <td class="text-end">
                                            {basicInfo.VATNumber}
                                          </td>
                                        </tr>
                                      )}

                                      <tr>
                                        <td>Website</td>
                                        <td class="text-end">
                                          {basicInfo.website}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          class="break-table"
                                          colspan="2"
                                        ></td>
                                      </tr>
                                      <tr>
                                        <th colspan="2">Trading Details</th>
                                      </tr>
                                      <tr>
                                        <td>Trading Name</td>
                                        <td class="text-end">
                                          {basicInfo.tradingName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Trading Address</td>
                                        <td class="text-end">
                                          {concatenatedTradingAddress}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Nature Of Business</td>
                                        <td class="text-end">
                                          {basicInfo.businessNatureNames}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          class="break-table"
                                          colspan="2"
                                        ></td>
                                      </tr>

                                      <tr>
                                        <th colspan="2">Company Details</th>
                                      </tr>
                                      <tr>
                                        <td>Company Name</td>
                                        <td class="text-end">
                                          {companyForm.companyName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Entity Type</td>
                                        <td class="text-end">
                                          {companyForm.companyType}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Company Number</td>
                                        <td class="text-end">
                                          {" "}
                                          {companyForm.companyNumber}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Company Incorporated In</td>
                                        <td class="text-end">
                                          {IncorporatedValue}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Company Incorporation Date</td>
                                        <td class="text-end">
                                          {" "}
                                          {companyForm.incorporationDate}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          Company Registered Office Address
                                        </td>
                                        <td class="text-end">
                                          {concatenatedRegisterAddress}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          class="break-table"
                                          colspan="2"
                                        ></td>
                                      </tr>
                                    </>
                                  )}
                                  {basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Individual ? (
                                    <>
                                      <tr>
                                        <td>First Name</td>
                                        <td class="text-end">
                                          {officersForm[0]?.firstName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Last Name</td>
                                        <td class="text-end">
                                          {officersForm[0]?.lastName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Phone</td>
                                        <td class="text-end">
                                          {officersForm[0]?.phoneNo}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>{prospectName} Email</td>
                                        <td class="text-end">
                                          {officersForm[0]?.emailID}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Website</td>
                                        <td class="text-end">
                                          {basicInfo.website}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Residential Address</td>
                                        <td class="text-end">
                                          {
                                            concatenatedResidentialAddress[0]
                                              ?.officersFullAddress
                                          }
                                        </td>
                                      </tr>
                                    </>
                                  ) : null}
                                  {basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Sole_Trader ||
                                    basicInfo.originalBusinessTypeID ===
                                    CLIENT_TYPES.Partnership ? (
                                    <>
                                      {basicInfo.VATReg === 0 ? (
                                        <tr>
                                          <td>VAT Registered</td>
                                          <td class="text-end">Yes</td>
                                        </tr>
                                      ) : (
                                        <tr>
                                          <td>VAT Registered</td>
                                          <td class="text-end">No</td>
                                        </tr>
                                      )}
                                      {basicInfo.VATNumber !== null && (
                                        <tr>
                                          <td>VAT Number</td>
                                          <td class="text-end">
                                            {basicInfo.VATNumber}
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td>Website</td>
                                        <td class="text-end">
                                          {basicInfo.website}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          class="break-table"
                                          colspan="2"
                                        ></td>
                                      </tr>
                                      <tr>
                                        <th colspan="2">Trading Details</th>
                                      </tr>
                                      <tr>
                                        <td>Trading Name</td>
                                        <td class="text-end">
                                          {basicInfo.tradingName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Trading Address</td>
                                        <td class="text-end">
                                          {concatenatedTradingAddress}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Nature Of Business</td>
                                        <td class="text-end">
                                          {basicInfo.businessNatureNames}
                                        </td>
                                      </tr>
                                    </>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                            {/* New Tab Start */}
                            {/* Officer details */}
                            <div class="tab-pane" id="product" role="tabpanel">
                              <div
                                class="tab-pane active"
                                id="base-justified-home"
                                role="tabpanel"
                              >
                                <table className="table table-striped fs-13 view-details-table">
                                  <tbody>
                                    {officersForm.map((prospect, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          {basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Partnership ? (
                                            <th colspan="2">
                                              Partner {index + 1}
                                            </th>
                                          ) : null}
                                          {basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Sole_Trader
                                            ? null
                                            : null}
                                          {basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.LLP ||
                                            basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Company ? (
                                            <th colspan="2">
                                              Officer {index + 1}
                                            </th>
                                          ) : null}
                                        </tr>
                                        {(basicInfo.originalBusinessTypeID ===
                                          CLIENT_TYPES.LLP ||
                                          basicInfo.originalBusinessTypeID ===
                                          CLIENT_TYPES.Company ||
                                          basicInfo.originalBusinessTypeID ===
                                          CLIENT_TYPES.Partnership) && (
                                            <tr>
                                              <td>Authorized </td>
                                              <td className="text-end">
                                                {officersForm[index]
                                                  ?.isAuthorisedSignatory
                                                  ? "Yes"
                                                  : "NO"}
                                                <Switch
                                                  checked={
                                                    officersForm[index]
                                                      ?.isAuthorisedSignatory
                                                  }
                                                  disabled
                                                  color="primary"
                                                />
                                              </td>
                                            </tr>
                                          )}

                                        <tr>
                                          <td>First Name</td>
                                          <td className="text-end">
                                            {officersForm[index].firstName}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>Last Name</td>
                                          <td className="text-end">
                                            {officersForm[index].lastName}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>Phone</td>
                                          <td className="text-end">
                                            {officersForm[index].phoneNo}
                                          </td>
                                        </tr>

                                        <tr>
                                          <td>Email</td>
                                          <td className="text-end">
                                            {officersForm[index].emailID}
                                          </td>
                                        </tr>
                                        {basicInfo.originalBusinessTypeID ===
                                          CLIENT_TYPES.Sole_Trader ||
                                          basicInfo.originalBusinessTypeID ===
                                          CLIENT_TYPES.Partnership ? null : (
                                          <>
                                            {" "}
                                            <tr>
                                              <td>Role</td>
                                              <td className="text-end">
                                                {
                                                  officersForm[index]
                                                    .officerRole
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Appointed On</td>
                                              <td className="text-end">
                                                {
                                                  officersForm[index]
                                                    .appointedOn
                                                }
                                              </td>
                                            </tr>
                                          </>
                                        )}
                                        <tr>
                                          {(basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Sole_Trader ||
                                            basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Other ||
                                            basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Partnership) && (
                                              <td>Residential Address</td>
                                            )}
                                          {(basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.Company ||
                                            basicInfo.originalBusinessTypeID ===
                                            CLIENT_TYPES.LLP) && (
                                              <td>Correspondence Address</td>
                                            )}

                                          <td className="text-end">
                                            {
                                              concatenatedResidentialAddress[
                                                index
                                              ]?.officersFullAddress
                                            }
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            class="break-table"
                                            colspan="2"
                                          ></td>
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          {/* <div class="noResult" style={{ display: "none" }}>
                                                        <div class="text-center">
                                                            <lord-icon
                                                                src="https://cdn.lordicon.com/msoeawqm.json"
                                                                trigger="loop"
                                                                colors="primary:#121331,secondary:#08a88a"
                                                                style={{ width: "75px", height: "75px" }}
                                                            ></lord-icon>
                                                            <h5 class="mt-2">Sorry! No Result Found</h5>
                                                            <p class="text-muted mb-0">
                                                                We've searched more than 150+ Orders We did not
                                                                find any orders for you search.
                                                            </p>
                                                        </div>
                                                    </div> */}
                        </div>
                      </div>
                    </div>
                    {/* end card  */}
                  </div>
                  {/* end col */}
                </div>
              </div>
              {/* end col  */}
            </div>
            {/* end row */}

            {/* end modal  */}
          </div>
          {/* container-fluid  */}
        </div>
        {/* End Page-content */}

        <Footer />
      </div>

      {/* start back-to-top */}
      <button
        onclick="topFunction()"
        class="btn btn-danger btn-icon"
        id="back-to-top"
      >
        <i class="ri-arrow-up-line"></i>
      </button>
      {/* end back-to-top */}
    </div>
  );
};

export default ProspectViewDetails;
