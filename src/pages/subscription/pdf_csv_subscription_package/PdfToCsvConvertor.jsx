import React, { useContext, useEffect, useRef, useState } from "react";
import BackButtonSvg from "../../../components/BackButtonSvg";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { Select } from "@mui/material";
import axios from "axios";
import { ChoosePlanApi } from "../../../redux/Services/Setting/PaymentGatewayApi";

function PdfToCsvConvertorModel(props) {
  const [pdfFile, setPdfFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [hasSubcription, setHasSubcription] = useState(true);
  const [convertablePageCount, setConvertablePageCount] = useState(10);
  const [pagesPackages, setPagesPackages] = useState([]);
  const {
    setLoader,
    EngagementName,
    proposalName,
    formatValue,
    formatValueWithoutCurrencySymbol,
    setTopbar,
  } = useContext(AuthContextProvider);
  //   const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_KEY = `828c1ceb-7702-4a15-a71b-c4f186884dc1`;

  const navigate = useNavigate();

  useEffect(() => {
    ChoosePlanApiModelData();
  }, []);

  const handleFileChange = (e) => {
    debugger;
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
      setCsvData(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleConvert = async () => {
    debugger;
    if (!pdfFile) {
      setError("No file selected.");
      return;
    }

    setIsConverting(true);
    setError("");

    const formData = new FormData();
    console.log("pdfFile:", pdfFile);
    console.log("instanceof File:", pdfFile instanceof File); // should be true

    formData.append("file", pdfFile);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value); // should show "file: File {...}"
    }

    try {
      const response = await axios.post(
        "https://docubot.caelum.ai/api/process-bank-statement?output_file_format=csv&response_format=url",
        formData,
        {
          headers: {
            "API-Key": "828c1ceb-7702-4a15-a71b-c4f186884dc1",
          },
        }
      );

      const result = response.data;

      if (result?.response?.status === "SUCCESS") {
        const csvUrl = result.response.processed_file_download_url;
        setCsvData(csvUrl);
      } else {
        setError("File processed, but response status is not SUCCESS.");
      }
    } catch (err) {
      console.error("Error during conversion:", err);
      setError("Failed to upload and process the file.");
    } finally {
      setIsConverting(false);
    }
  };

  const [convertedFiles, setConvertedFiles] = useState([
    {
      fileName: "invoice_march_2025.pdf",
      convertedAt: "2025-06-05 10:15 AM",
      csvContent: `Item,Quantity,Price\nApple,10,200\nBanana,5,50`,
    },
    {
      fileName: "client_list_april.pdf",
      convertedAt: "2025-06-03 3:45 PM",
      csvContent: `Name,Email,Phone\nAmit Sharma,amit@example.com,9876543210\nPriya Patel,priya@example.com,9123456780`,
    },
    {
      fileName: "sales_report_q1.pdf",
      convertedAt: "2025-05-28 11:00 AM",
      csvContent: `Product,Region,Sales\nShoes,West,15000\nBags,North,12000`,
    },
  ]);

  const ChoosePlanApiModelData = async () => {
    try {
      const data = await ChoosePlanApi();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;

          setPagesPackages(ModelData);
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const chooseApiData = [
    {
      subscriptionPackageKeyID: "0ff66006-7bba-4157-9cb9-b5f871b9853b",
      packageName: "Free",
      isFreePackage: true,
      apiIntegration: false,
      isMailBox: null,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 5,
      yearlyValuePlan: 0.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [],
    },
    {
      subscriptionPackageKeyID: "35092371-c544-4ae9-b607-8f749646dc17",
      packageName: "Premium",
      isFreePackage: false,
      apiIntegration: false,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 50,
      yearlyValuePlan: 360.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [
        {
          offerID: "DiscountPrice",
          offerName: "Get at £300.00",
          value: "300.00",
        },
      ],
    },
    {
      subscriptionPackageKeyID: "cd87c6c2-f474-4b1b-8669-fe8854abb06e",
      packageName: "Unlimited",
      isFreePackage: false,
      apiIntegration: true,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 999,
      yearlyValuePlan: 3000.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [
        {
          offerID: "DiscountPrice",
          offerName: "Get at £2000.00",
          value: "2000.00",
        },
      ],
    },
    {
      subscriptionPackageKeyID: "3e04f731-2cb0-4c35-acd1-4c53bebe3710",
      packageName: "Test Package",
      isFreePackage: false,
      apiIntegration: true,
      isMailBox: true,
      prepareQuote: true,
      sendQuote: true,
      prepareContract: true,
      sendContract: true,
      signContract: true,
      eSignaturePerMonth: 100,
      yearlyValuePlan: 1.0,
      discountPercentage: null,
      discountPrice: null,
      monthFree: null,
      getMonths: null,
      inPriceOfMonth: null,
      monthlyOffer: [],
      yearlyOffer: [],
    },
  ];

  const isYearly = true;

  return (
    <div style={{ marginTop: "110px" }}>
      <div className="container-fluid new-item-page-container mt-4">
        {hasSubcription ? (
          <div className="new-item-page-content">
            <div className="row form-row">
              <div className="col-lg-12">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h3 className="modal-title">
                    <BackButtonSvg onClick={() => navigate("/")} />
                    Convert PDF To CSV File
                  </h3>
                  <button
                    className="btn btn-md btn-success create-item-btn"
                    onClick={() => setHasSubcription(false)}
                    // disabled={isConverting}
                  >
                    Upgrade
                  </button>
                </div>
                <div className="separator mb-3" />

                {/* Compact Convertor Section */}
                <div className="p-3 border rounded bg-light mb-4">
                  <div className="form-group mb-2">
                    <label htmlFor="pdfUpload" className="mb-1">
                      Upload PDF File
                    </label>
                    <input
                      type="file"
                      id="pdfUpload"
                      accept="application/pdf"
                      className="form-control"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </div>

                  {/* {pdfFile && (
                  <div className="mt-2 small text-muted">
                    <strong>Selected File:</strong> {pdfFile.name}
                  </div>
                )} */}

                  {error && <div className="text-danger mt-2">{error}</div>}

                  {/* Buttons Row */}
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <button
                      className="btn btn-md btn-success create-item-btn"
                      onClick={handleConvert}
                      disabled={isConverting}
                    >
                      {isConverting ? "Converting..." : "Convert to CSV"}
                    </button>

                    {pdfFile && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemoveFile}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <hr />

                {/* Previously Converted Files Table */}
                {convertedFiles.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-1">Previously Converted Files</h5>
                    <div
                      className="table-responsive"
                      style={{ marginTop: "30px" }}
                    >
                      <table className="table table-bordered table-sm">
                        <thead className="thead-light bg-dark">
                          <tr>
                            <th className="text-white">Sr No.</th>
                            <th className="text-white">PDF File</th>
                            <th className="text-white">CSV File</th>
                            <th className="text-white">Converted At</th>
                          </tr>
                        </thead>

                        <tbody>
                          {convertedFiles.map((file, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{file.fileName}</td>

                              <td>
                                <pre
                                  style={{
                                    maxHeight: "100px",
                                    overflowY: "auto",
                                  }}
                                  className="small mb-0"
                                >
                                  {file.csvContent}
                                </pre>
                              </td>
                              <td>{file.convertedAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div class="container">
            {/* Cards for subscription */}
            <div class="row form-row">
              <div class="col-lg-12">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h3 className="modal-title">
                    <BackButtonSvg onClick={() => navigate("/")} />
                    Convert PDF To CSV File
                  </h3>
                  {convertablePageCount > 0 && (
                    <button
                      className="btn btn-md btn-success create-item-btn"
                      onClick={() => setHasSubcription(true)}
                      // disabled={isConverting}
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="separator mb-3" />
                <div class="card">
                  <div class="card-body">
                    <div id="customerList">
                      <div class="row g-4 mb-3"></div>
                      <div
                        class="table-responsive table-card  mb-3 table-padding"
                        style={{ marginTop: "0px" }}
                      >
                        <div class="modal-body">
                          <>
                            <div className="scrollbar" id="style-1">
                              <div className="tab-content">
                                <div className="container-fluid">
                                  <Row
                                    className="d-flex"
                                    style={{ background: "white" }}
                                  >
                                    {pagesPackages
                                      ?.filter((item) => !item.isFreePackage)
                                      .map((PurchasePlanList, index) => {
                                        return (
                                          <>
                                            <Col xl={4} md={6}>
                                              <Card className="pricing-box d-flex shadow-lg p-3 mb-3 bg-white rounded">
                                                <CardBody
                                                  style={{
                                                    width: "200px",
                                                    height: "max-content",
                                                  }}
                                                  className="p-3"
                                                >
                                                  <div className="media ">
                                                    <i className="ion ion-ios-airplane h2 align-self-center"></i>
                                                    <div className="media-body text-center ">
                                                      <div className="text-center login-logo">
                                                        <img
                                                          width={130}
                                                          height={25}
                                                          src="data:image/png;base64,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"
                                                          alt="login"
                                                        />
                                                      </div>

                                                      <h6 className="text-dark">
                                                        {
                                                          PurchasePlanList?.packageName
                                                        }
                                                      </h6>

                                                      {!isYearly ? (
                                                        <div>
                                                          {(() => {
                                                            const MonthlyPrice =
                                                              Number(
                                                                PurchasePlanList?.yearlyValuePlan
                                                              ) / 12;
                                                            return formatValue(
                                                              MonthlyPrice
                                                            );
                                                          })()}
                                                          / Month
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          {formatValue(
                                                            PurchasePlanList?.yearlyValuePlan
                                                          )}
                                                          / Year
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="pricing-features mt-1 pt-2">
                                                    {/* <div>
                                                      {PurchasePlanList?.apiIntegration ==
                                                      true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        API Integration
                                                      </span>
                                                    </div>
                                                    <div>
                                                      {PurchasePlanList?.prepareQuote ==
                                                      true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Prepare {proposalName}
                                                      </span>
                                                    </div>
                                                    <div>
                                                      {PurchasePlanList?.prepareContract ===
                                                      true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      {"  "}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Prepare {EngagementName}
                                                      </span>
                                                    </div> */}
                                                    <div>
                                                      {PurchasePlanList?.sendQuote ===
                                                      true ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Send {proposalName}
                                                      </span>
                                                    </div>

                                                    <div className="d-flex align-items-start">
                                                      <div>
                                                        {PurchasePlanList?.eSignaturePerMonth >
                                                        0 ? (
                                                          <span
                                                            style={{
                                                              color: "green",
                                                            }}
                                                            className="fa fa-check"
                                                          ></span>
                                                        ) : (
                                                          <span
                                                            style={{
                                                              color: "red",
                                                            }}
                                                            className="fa fa-times"
                                                          ></span>
                                                        )}
                                                      </div>
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        Send And Digitally Sign
                                                        The {EngagementName}
                                                        {PurchasePlanList?.eSignaturePerMonth >
                                                          0 && (
                                                          <>
                                                            :{" "}
                                                            {formatValueWithoutCurrencySymbol(
                                                              PurchasePlanList?.eSignaturePerMonth
                                                            )}
                                                            /Month
                                                          </>
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div>
                                                      {PurchasePlanList?.isMailBox ===
                                                        true ||
                                                      PurchasePlanList?.isMailBox ===
                                                        null ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                          className="fa fa-check"
                                                        ></span>
                                                      ) : (
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-times"
                                                        ></span>
                                                      )}
                                                      <span
                                                        style={{
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        {" "}
                                                        Personalized Outgoing
                                                        Mailbox
                                                      </span>
                                                    </div>
                                                    {PurchasePlanList && (
                                                      <div
                                                        className="d-flex flex-column"
                                                        style={{
                                                          minHeight: "40px",
                                                        }}
                                                      >
                                                        {(isYearly &&
                                                          PurchasePlanList
                                                            .yearlyOffer
                                                            ?.length > 0) ||
                                                        (!isYearly &&
                                                          PurchasePlanList
                                                            .monthlyOffer
                                                            ?.length > 0) ? (
                                                          <div className="w-100">
                                                            <label></label>
                                                            {/* <Select
                                                              placeholder="Select Offer"
                                                              menuPosition="auto"
                                                              className="phone-input-country-code selectDropDown Drop-down-width"
                                                              onChange={(
                                                                selectedOption
                                                              ) =>
                                                                handleSelectChange(
                                                                  selectedOption,
                                                                  index,
                                                                  PurchasePlanList.subscriptionPackageKeyID,
                                                                  PurchasePlanList.packageName
                                                                )
                                                              }
                                                              options={(isYearly
                                                                ? PurchasePlanList.yearlyOffer
                                                                : PurchasePlanList.monthlyOffer
                                                              )?.map(
                                                                (offer) => ({
                                                                  id: offer.offerID,
                                                                  label:
                                                                    offer.offerName,
                                                                  value:
                                                                    offer.offerID,
                                                                })
                                                              )}
                                                              value={
                                                                selectedOfferID &&
                                                                selectedOfferID.index ===
                                                                  index
                                                                  ? selectedOfferID
                                                                  : null
                                                              }
                                                            /> */}
                                                          </div>
                                                        ) : (
                                                          <div className="flex-grow-1"></div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                  {errorMessage && (
                                                    <p>{errorMessage}</p>
                                                  )}

                                                  <div className=" d-flex justify-content-center ">
                                                    <button
                                                      // onClick={() =>
                                                      //   handleButtonClick(
                                                      //     index,
                                                      //     PurchasePlanList.subscriptionPackageKeyID
                                                      //   )
                                                      // }
                                                      className="btn btn-success create-item-btn add-new "
                                                    >
                                                      <span> Purchase</span>
                                                    </button>
                                                  </div>
                                                </CardBody>
                                              </Card>
                                            </Col>
                                          </>
                                        );
                                      })}
                                  </Row>
                                </div>
                              </div>
                            </div>
                          </>
                        </div>{" "}
                      </div>
                    </div>
                    {/* end card  */}
                  </div>
                </div>
                {/* end col */}
              </div>
              {/* end col  */}
            </div>
            {/* end modal  */}
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfToCsvConvertorModel;
