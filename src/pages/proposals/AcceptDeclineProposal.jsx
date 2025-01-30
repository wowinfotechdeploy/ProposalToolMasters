/* global $ */
import React, { useContext, useEffect, useState } from "react";
import acceptInviteIMG from "../../assets/images/accept-invite.jpg";
import DeniedInviteIMG from "../../assets/images/Denied.jpg";
import { Row, Col, Card, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import ReactDOMServer from "react-dom/server";
import {
  GetAcceptedQuotationServiceDetails,
  GetSelectedServicePackageAccept,
} from "../../redux/Services/Proposal/ProposalApi";
import AcceptDeclinedPackage from "../../components/AcceptDeclinedPackageModel";

function AcceptInvitation() {
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alreadyAcceptedServicePackageKeyID, setAlreadyAcceptedServicePackageKeyID] = useState(null);
  const [AcceptDeclinedMessage, setAcceptDeclinedMessage] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const { setTopbar, setLoader, formatValue } = useContext(AuthContextProvider);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const common = useSelector((state) => state.Storage);
  const urlParams = new URLSearchParams(location.search);
  const quoteKeyID = urlParams.get("quoteKeyID");
  const ServiceChargeTypeID = urlParams.get("ServiceChargeTypeID");
  const ContractSignatoryKeyID = urlParams.get("ContractSignatoryKeyID");
  const action = urlParams.get("Action");
  const servicePackageKeyID = urlParams.get("ServicePackageKeyID");
  const [Template, setTemplate] = useState(null);

  useEffect(() => {
    setTopbar("none");
  }, []);

  useEffect(() => {
    GetAcceptPackageData()
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  // GetSelectedServicePackageAcceptData From Api
  const getPaymentFrequencyLabel = (id) => {
    const Payment_Frequency = {
      Yearly: 1,
      HalfYearly: 2,
      Quarterly: 3,
      Monthly: 4,
    };

    const frequencyValue = id
    switch (frequencyValue) {
      case Payment_Frequency.Yearly:
        return "Yearly";
      case Payment_Frequency.HalfYearly:
        return "Half-Yearly";
      case Payment_Frequency.Quarterly:
        return "Quarterly";
      case Payment_Frequency.Monthly:
        return "Monthly";
      default:
        return "Unknown";
    }
  };


  const GetAcceptPackageData = async () => {
    setLoader(true);
    try {
      let concatenatedServicePricingHtml = null;

      // if (servicePackageKeyID === null) {
      // const oneServiceHtml = await GetSelectedServicePackageAcceptData();
      // concatenatedServicePricingHtml = oneServiceHtml;
      // } else {
      const [recurringServiceHtml, oneServiceHtml] = await Promise.all([
        GetSelectedServicePackageAcceptData(1),
        GetSelectedServicePackageAcceptData(2)
      ]);

      concatenatedServicePricingHtml = (
        <>
          {recurringServiceHtml}
          {oneServiceHtml}
        </>
      );
      // }

      setTemplate(concatenatedServicePricingHtml);
      GetAcceptedQuotationServiceDetailsData(concatenatedServicePricingHtml,);
    } catch (error) {
      console.error("Error in GetAcceptPackageData:", error);
    }
  };
  const GetAcceptExistingPackageData = async (Action) => {
    setLoader(true);
    try {
      let concatenatedServicePricingHtml = null;

      // if (servicePackageKeyID === null) {
      // const oneServiceHtml = await GetSelectedServicePackageAcceptData();
      // concatenatedServicePricingHtml = oneServiceHtml;
      // } else {
      const [recurringServiceHtml, oneServiceHtml] = await Promise.all([
        GetSelectedServicePackageAcceptExistData(alreadyAcceptedServicePackageKeyID, 1),
        GetSelectedServicePackageAcceptExistData(alreadyAcceptedServicePackageKeyID, 2)
      ]);

      concatenatedServicePricingHtml = (
        <>
          {recurringServiceHtml}
          {oneServiceHtml}
        </>
      );
      GetAcceptedQuotationServiceDetailsData(concatenatedServicePricingHtml, Action);
    } catch (error) {
      console.error("Error in GetAcceptPackageData:", error);
    }
  };
  const GetSelectedServicePackageAcceptData = async (ServiceChargeTypeId) => {
    setLoader(true);
    try {
      const data = await GetSelectedServicePackageAccept(
        quoteKeyID,
        servicePackageKeyID,
        action,
        ServiceChargeTypeId || ServiceChargeTypeID || null,
        ContractSignatoryKeyID || null,
      );

      if (data) {

        if (data?.data?.statusCode === 200) {
          const selectedServices = data.data.responseData.selectedServices;
          if (selectedServices.length == 0) {
            return;
          }
          const finalQuotationAmount =
            data.data.responseData.finalQuotationAmount;
          const showDiscountLine = data.data.responseData?.recurringOneOffPrice?.showDiscountLine
          let recurringOneOffPrice = data.data.responseData.recurringOneOffPrice;
          let SendSelectedServicePackage = (
            <div
              style={{
                paddingLeft: "40px",
                paddingRight: "40px",
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              <p
                style={{
                  fontFamily: "arial, sans-serif",
                  color: "#00BFFF",
                  fontSize: "20px",
                  float: "inline-start",
                  marginTop: "15px",
                }}
              >
                {finalQuotationAmount.serviceChargeTypeID === 1
                  ? `Recurring Fees (${getPaymentFrequencyLabel(recurringOneOffPrice.paymentFrequencyID)})`
                  : 'One-Off Fees'}
              </p>
              <table
                style={{
                  fontFamily: "arial, sans-serif",
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "-15px",
                }}
              >
                <tr style={{ backgroundColor: "#00BFFF" }}>
                  <th
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "left",
                      padding: "8px",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    Services
                  </th>
                  <th
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "right",
                      padding: "8px",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    {
                      finalQuotationAmount.servicePackageName === null
                        ? "Fees(£)"
                        : finalQuotationAmount.servicePackageName.length > 40
                          ? finalQuotationAmount.servicePackageName
                            .substring(0, 40)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."
                          : finalQuotationAmount.servicePackageName
                    }

                  </th>
                </tr>
                {selectedServices.map((serviceCat) => (
                  <React.Fragment key={serviceCat.serviceCatID}>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >

                        {serviceCat.serviceCatName.length > 40
                          ? serviceCat.serviceCatName
                            .substring(0, 40)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) =>
                              l.toUpperCase()
                            ) + "..."
                          : serviceCat.serviceCatName}
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                        }}
                      ></td>
                    </tr>
                    {serviceCat.servicesList.map((service) => (
                      <tr key={service.serviceID}>
                        <td
                          style={{
                            border: "1px solid #DDDDDD",
                            textAlign: "left",
                            padding: "8px",
                          }}
                        >
                          {service.serviceName.length > 40
                            ? service.serviceName
                              .substring(0, 40)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) =>
                                l.toUpperCase()
                              ) + "..."
                            : service.serviceName}
                        </td>
                        <td
                          style={{
                            border: "1px solid #DDDDDD",
                            textAlign: "right",
                            padding: "8px",
                          }}
                        >
                          {service.quotationPrice?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                <tr style={{ backgroundColor: "#808080" }}>
                  <td
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "left",
                      padding: "8px",
                      color: "white",
                    }}
                  >
                    Net Total
                  </td>
                  <td
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "right",
                      padding: "8px",
                      color: "white",
                    }}
                  >
                    {" "}

                    {formatValue(finalQuotationAmount.netTotal)}
                  </td>
                </tr>
                {((finalQuotationAmount.discounted !== null && finalQuotationAmount.discounted !== 0) || showDiscountLine) && (
                  <>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        Discount
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        {" "}
                        (-)
                        {formatValue(finalQuotationAmount.discounted)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#808080" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        Discounted Total
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.discountedTotal)}
                      </td>
                    </tr>
                  </>
                )}
                {(finalQuotationAmount.vat !== null && finalQuotationAmount.vat !== 0) && (
                  <>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        VAT
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.vat)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#808080" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        Grand Total
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.grandTotal)}
                      </td>
                    </tr>
                  </>
                )}
              </table>
            </div>
          );

          return SendSelectedServicePackage;

        } else {
          setLoader(false);
          setErrorMessage(data?.response?.data?.errorMessage);
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const GetSelectedServicePackageAcceptExistData = async (servicePackageKeyId, ServiceChargeTypeId) => {
    setLoader(true);
    try {
      const data = await GetSelectedServicePackageAccept(
        quoteKeyID,
        servicePackageKeyId,
        action,
        ServiceChargeTypeId || ServiceChargeTypeID || null,
        ContractSignatoryKeyID || null,
      );

      if (data) {

        if (data?.data?.statusCode === 200) {
          const selectedServices = data.data.responseData.selectedServices;
          if (selectedServices.length == 0) {
            return;
          }
          const finalQuotationAmount =
            data.data.responseData.finalQuotationAmount;
          const showDiscountLine = data.data.responseData?.recurringOneOffPrice?.showDiscountLine
          let recurringOneOffPrice = data.data.responseData.recurringOneOffPrice;
          let SendSelectedServicePackage = (
            <div
              style={{
                paddingLeft: "40px",
                paddingRight: "40px",
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              <p
                style={{
                  fontFamily: "arial, sans-serif",
                  color: "#00BFFF",
                  fontSize: "20px",
                  float: "inline-start",
                  marginTop: "15px",
                }}
              >
                {finalQuotationAmount.serviceChargeTypeID === 1
                  ? `Recurring Fees (${getPaymentFrequencyLabel(recurringOneOffPrice.paymentFrequencyID)})`
                  : 'One-Off Fees'}
              </p>
              <table
                style={{
                  fontFamily: "arial, sans-serif",
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "-15px",
                }}
              >
                <tr style={{ backgroundColor: "#00BFFF" }}>
                  <th
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "left",
                      padding: "8px",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    Services
                  </th>
                  <th
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "right",
                      padding: "8px",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    {
                      finalQuotationAmount.servicePackageName === null
                        ? "Fees(£)"
                        : finalQuotationAmount.servicePackageName.length > 40
                          ? finalQuotationAmount.servicePackageName
                            .substring(0, 40)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase()) + "..."
                          : finalQuotationAmount.servicePackageName
                    }

                  </th>
                </tr>
                {selectedServices.map((serviceCat) => (
                  <React.Fragment key={serviceCat.serviceCatID}>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >

                        {serviceCat.serviceCatName.length > 40
                          ? serviceCat.serviceCatName
                            .substring(0, 40)
                            .toLowerCase()
                            .replace(/\b\w/g, (l) =>
                              l.toUpperCase()
                            ) + "..."
                          : serviceCat.serviceCatName}
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                        }}
                      ></td>
                    </tr>
                    {serviceCat.servicesList.map((service) => (
                      <tr key={service.serviceID}>
                        <td
                          style={{
                            border: "1px solid #DDDDDD",
                            textAlign: "left",
                            padding: "8px",
                          }}
                        >
                          {service.serviceName.length > 40
                            ? service.serviceName
                              .substring(0, 40)
                              .toLowerCase()
                              .replace(/\b\w/g, (l) =>
                                l.toUpperCase()
                              ) + "..."
                            : service.serviceName}
                        </td>
                        <td
                          style={{
                            border: "1px solid #DDDDDD",
                            textAlign: "right",
                            padding: "8px",
                          }}
                        >
                          {service.quotationPrice?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                <tr style={{ backgroundColor: "#808080" }}>
                  <td
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "left",
                      padding: "8px",
                      color: "white",
                    }}
                  >
                    Net Total
                  </td>
                  <td
                    style={{
                      border: "1px solid #DDDDDD",
                      textAlign: "right",
                      padding: "8px",
                      color: "white",
                    }}
                  >
                    {" "}

                    {formatValue(finalQuotationAmount.netTotal)}
                  </td>
                </tr>
                {((finalQuotationAmount.discounted !== null && finalQuotationAmount.discounted !== 0) || showDiscountLine) && (
                  <>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        Discount
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        {" "}
                        (-)
                        {formatValue(finalQuotationAmount.discounted)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#808080" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        Discounted Total
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.discountedTotal)}
                      </td>
                    </tr>
                  </>
                )}
                {(finalQuotationAmount.vat !== null && finalQuotationAmount.vat !== 0) && (
                  <>
                    <tr style={{ backgroundColor: "#DCDCDC" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        VAT
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "black",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.vat)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#808080" }}>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "left",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        Grand Total
                      </td>
                      <td
                        style={{
                          border: "1px solid #DDDDDD",
                          textAlign: "right",
                          padding: "8px",
                          color: "white",
                        }}
                      >
                        {" "}

                        {formatValue(finalQuotationAmount.grandTotal)}
                      </td>
                    </tr>
                  </>
                )}
              </table>
            </div>
          );

          return SendSelectedServicePackage;

        } else {
          setLoader(false);
          setErrorMessage(data?.response?.data?.errorMessage);
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  // GetAcceptedQuotationServiceDetailsData From Api 
  const GetAcceptedQuotationServiceDetailsData = async (SelectedTemplate, Action) => {
    setLoader(true);
    try {
      let data = null
      if (SelectedTemplate === null && Action === "Declined") {
        const SelectedTemplateString =
          ReactDOMServer.renderToString(Template);
        data = await GetAcceptedQuotationServiceDetails({
          quoteKeyID: quoteKeyID,
          serviceChargeTypeID: ServiceChargeTypeID, //1: Recurring, 2:OneOff
          servicePackageKeyID: servicePackageKeyID,
          acceptedServiceHtmlContent: SelectedTemplateString,
          ContractSignatoryKeyID: ContractSignatoryKeyID || null,
          action: Action, //Accepted/Declined
        });
      } else if (Action === "Accepted") {
        const SelectedTemplateString =
          ReactDOMServer.renderToString(SelectedTemplate);
        data = await GetAcceptedQuotationServiceDetails({
          quoteKeyID: quoteKeyID,
          serviceChargeTypeID: ServiceChargeTypeID, //1: Recurring, 2:OneOff
          servicePackageKeyID: alreadyAcceptedServicePackageKeyID,
          acceptedServiceHtmlContent: SelectedTemplateString,
          ContractSignatoryKeyID: ContractSignatoryKeyID || null,
          action: Action, //Accepted/Declined
        });
      } else if (Action === undefined) {
        const SelectedTemplateString =
          ReactDOMServer.renderToString(SelectedTemplate);
        data = await GetAcceptedQuotationServiceDetails({
          quoteKeyID: quoteKeyID,
          serviceChargeTypeID: ServiceChargeTypeID, //1: Recurring, 2:OneOff
          servicePackageKeyID: servicePackageKeyID,
          acceptedServiceHtmlContent: SelectedTemplateString,
          ContractSignatoryKeyID: ContractSignatoryKeyID || null,
          action: action, //Accepted/Declined
        });
      }
      // const SelectedTemplateString =
      //   ReactDOMServer.renderToString(SelectedTemplate);
      // const data = await GetAcceptedQuotationServiceDetails({
      //   quoteKeyID: quoteKeyID,
      //   serviceChargeTypeID: ServiceChargeTypeID, //1: Recurring, 2:OneOff
      //   servicePackageKeyID: servicePackageKeyID,
      //   acceptedServiceHtmlContent: SelectedTemplateString,
      //   ContractSignatoryKeyID: ContractSignatoryKeyID || null,
      //   action: action, //Accepted/Declined
      // });
      if (data) {
        if (data?.data?.statusCode === 200) {
          if (data?.data?.responseData.alreadyAcceptedServicePackageKeyID !== null
            && data?.data?.responseData.alreadyAcceptedServicePackageKeyID !== undefined
            && data?.data?.responseData.alreadyAcceptedServicePackageKeyID !== "") {
            setAlreadyAcceptedServicePackageKeyID(data?.data?.responseData.alreadyAcceptedServicePackageKeyID)
            setLoader(false);
            $("#" + "AcceptDeclinedPackage").modal("show");
            const officerName = data?.data?.responseData.officerName
            const PackageName = data?.data?.responseData.servicePackageName
            const Message = `${officerName} has already accepted ${PackageName}.
            Would you like to accept or decline this package.
            `
            setAcceptDeclinedMessage(Message);
          } else {
            $("#" + "AcceptDeclinedPackage").modal("hide");
            setSuccessMessage(
              data?.data?.responseData?.acceptDeclineStatusMessage
            );
          }
          setLoader(false);
        } else {
          $("#" + "AcceptDeclinedPackage").modal("hide");
          setLoader(false);
          setErrorMessage(data?.response?.data?.errorMessage);
        }
      } else {
        $("#" + "AcceptDeclinedPackage").modal("hide");
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
      }
    } catch (error) {
      $("#" + "AcceptDeclinedPackage").modal("hide");
      setLoader(false);
      console.log(error);
    }
  };

  const renderInviteImage = () => {
    if ((action === "Declined" && (!errorMessage || errorMessage === "")) || errorMessage.includes("declined")) {
      return (
        <Col lg="6" className="mx-auto">
          <img
            src={DeniedInviteIMG}
            alt="Denied Invite"
            className="img-fluid mx-auto d-block"
          />
        </Col>
      );
    }

    if ((action === "Accepted" && (!errorMessage || errorMessage === "")) || errorMessage.includes("accepted")) {
      return (
        <Col lg="6" className="mx-auto">
          <img
            src={acceptInviteIMG}
            alt="Accepted Invite"
            className="img-fluid mx-auto d-block"
          />
        </Col>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      <div className="authentication-bg d-flex align-items-center pb-0 vh-100">
        <div className="content-center w-100">
          <div className="container">
            <Card className="mo-mt-2">
              <CardBody>
                <Row className="align-items-center">

                  <Col lg="6" className="ml-auto">
                    {/* {verifyToken === "Active" && ( */}
                    <div className="ex-page-content text-center">
                      <h4 className="mb-4">
                        {((SuccessMessage === "" || SuccessMessage === null) && (errorMessage === "" || errorMessage === null)) ? (
                          <>
                            <div
                              style={{
                                justifyContent: "center",
                              }}
                              className="mb-4 d-flex"
                            >
                              <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="xMidYMid"
                                width="50"
                                height="50"
                                style={{
                                  shapeRendering: "auto",
                                  display: "block",
                                  background: "rgb(255, 255, 255)",
                                }}
                              >
                                <g>
                                  <rect
                                    fill="#009fe5"
                                    height="40"
                                    width="15"
                                    y="30"
                                    x="17.5"
                                  >
                                    <animate
                                      begin="-0.2s"
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="18;30;30"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="y"
                                    ></animate>
                                    <animate
                                      begin="-0.2s"
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="64;40;40"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="height"
                                    ></animate>
                                  </rect>
                                  <rect
                                    fill="#3ba098"
                                    height="40"
                                    width="15"
                                    y="30"
                                    x="42.5"
                                  >
                                    <animate
                                      begin="-0.1s"
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="20.999999999999996;30;30"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="y"
                                    ></animate>
                                    <animate
                                      begin="-0.1s"
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="58.00000000000001;40;40"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="height"
                                    ></animate>
                                  </rect>
                                  <rect
                                    fill="#122549"
                                    height="40"
                                    width="15"
                                    y="30"
                                    x="67.5"
                                  >
                                    <animate
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="20.999999999999996;30;30"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="y"
                                    ></animate>
                                    <animate
                                      keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                                      values="58.00000000000001;40;40"
                                      keyTimes="0;0.5;1"
                                      calcMode="spline"
                                      dur="1s"
                                      repeatCount="indefinite"
                                      attributeName="height"
                                    ></animate>
                                  </rect>
                                </g>
                              </svg>
                            </div>
                            <div style={{ color: "#6c757d" }}>
                              <b>Please wait</b>
                            </div>
                            <div style={{ color: "#6c757d", fontSize: "12px" }}>
                              Do not refresh page{" "}
                            </div>
                          </>
                        ) : null}
                        {(SuccessMessage !== "" && SuccessMessage !== null) ? SuccessMessage : errorMessage}
                      </h4>

                      {/* {Template} */}
                    </div>
                    {/* )} */}
                    {verifyToken === "Expired" && (
                      <div class="expired">
                        <svg className="link-expired"
                          version="1.1"
                          id="Layer_1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 364 390.4"
                          height="350.4"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <style type="text/css">
                            {`
         .st0 { fill: #3D2B1F; } /* Dark brown for the eyes */
         .st1 { fill: #FFDAC1; } /* Light skin tone */
         .st2 { fill: #3D2B1F; } /* Dark brown for the hair */
         .st3 { fill: #FFDAC1; } /* Light skin tone */
         .st4 { fill: #D98D54; } /* Orange-brown for the shirt */
       `}
                          </style>
                          <circle className="st0" cx="126" cy="175.4" r="12" />
                          <circle className="st0" cx="339" cy="175.4" r="12" />
                          <circle className="st1" cx="232.5" cy="170.9" r="106.5" />
                          <path
                            className="st2"
                            d="M126,164.4c0,0,4.5-15.4,10.5-19.6c0,0,31,0,65-26.5c0,0,110,85.9,176-30.8c0,0-33,28.6-116-41.4
                                 c0,0-131-16.2-135.5,106V164.4z"
                          />
                          <path
                            className="st2"
                            d="M339,164.4c0,0,6.2-13.3-8.2-32.4l-6.3,3.9C324.5,135.9,333.5,142.9,339,164.4z"
                          />
                          <path
                            className="st2"
                            d="M247.8,45.3c0,0,47.7-5.3,76.7,53.7L247.8,45.3z"
                          />
                          <circle className="st0" cx="192" cy="175.4" r="9" />
                          <circle className="st0" cx="271" cy="175.4" r="9" />
                          <path
                            className="st4"
                            d="M101.4,390.1c22.1-106.8,75.7-114.1,137.1-114.1c61.4,0,104,18.8,130.1,114.1C368.7,390.6,101.3,390.6,101.4,390.1z"
                          />
                          <circle className="st0" cx="234.5" cy="230.5" r="20" />
                        </svg>

                        <div class="message">
                          <h1>Oops, this link is expired</h1>
                        </div>

                        <div class="light">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div class="light_btm">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                  </Col>
                  {renderInviteImage()}
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <AcceptDeclinedPackage
        Message={AcceptDeclinedMessage}
        handleAcceptFunction={() => GetAcceptExistingPackageData("Accepted")}
        handleDeclinedFunction={() => GetAcceptedQuotationServiceDetailsData(null, "Declined")}
      />
    </React.Fragment>
  );
}

export default AcceptInvitation;
