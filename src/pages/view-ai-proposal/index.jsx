import React, { useEffect, useState } from "react";
import {
  GetProposalModel,
  GetProposalModelList,
} from "../../redux/Services/Proposal/ProposalApi";
import { Base_Url, Frontend_Url } from "../../Base-Url/Base_Url";
import { ServiceChargeTypeEnum } from "../../Middleware/enums";
import ViewAiProposalPdfGenerator from "./ViewAIProposalPDFGenerator";

export default function ViewAiProposal() {
  const [proposalData, setProposalData] = useState(null);
  const [packageList, setPackageList] = useState(null);
  const [serviceMappingWithPackagesList, setServiceMappingWithPackagesList] =
    useState(null);
  const [finalQuotationAmountList, setFinalQuotationAmountList] = useState([]);
  const currencySymbol = "£";
  const urlParams = new URLSearchParams(window.location.search);

  const QuoteKeyID = urlParams.get("QuoteKeyID");
  const ContractSignatoryKeyID = urlParams.get("ContractSignatoryKeyID");

  const taxName = "VAT";
  const id = "944f6852-233d-49c9-81b6-26cc78928e98";

  const [loading, setLoading] = useState(false);

  const paymentFrequencyLabel =
    proposalData?.paymentFrequencyID === 4 ? "Monthly" : "";

  useEffect(() => {
    getAiProposal();
  }, []);

  const getAiProposal = async () => {
    debugger;
    try {
      setLoading(true);

      const data = await GetProposalModelList(QuoteKeyID);
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          setProposalData(data?.data?.responseData?.data);
          setPackageList(data?.data?.responseData?.packageList);
          setServiceMappingWithPackagesList(
            data?.data?.responseData?.serviceMappingWithPackagesList,
          );
          setFinalQuotationAmountList(
            data?.data?.responseData.finalQuotationAmountList,
          );
        }
      }
    } catch (error) {
      console.error("AI Proposal API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const recurringServices = proposalData?.reccrunigServiceCatList || [];

  const oneOffServices = proposalData?.oneOffServiceCatList || [];

  // For services

  const recurringPricing =
    finalQuotationAmountList?.find((item) => item.serviceChargeTypeID === 1) ||
    {};

  const oneOffPricing =
    finalQuotationAmountList?.find((item) => item.serviceChargeTypeID === 2) ||
    {};

  // For packages

  const isPackageProposal =
    packageList?.length > 0 || serviceMappingWithPackagesList?.length > 0;

  const selectedPackagesList = packageList || [];

  // const recurringServices = proposalData?.data?.reccrunigServiceCatList || [];

  // const oneOffServices = proposalData?.data?.oneOffServiceCatList || [];

  const finalAmountList =
    finalQuotationAmountList ||
    proposalData?.finalQuotationAmountList ||
    proposalData?.quotationFinalAmountList ||
    [];

  const getPricing = (serviceChargeTypeID, servicePackageID = null) => {
    return (
      finalAmountList.find(
        (x) =>
          Number(x.serviceChargeTypeID) === Number(serviceChargeTypeID) &&
          (servicePackageID
            ? Number(x.servicePackageID) === Number(servicePackageID)
            : !x.servicePackageID),
      ) || {}
    );
  };

  console.log("recurringPricing", recurringPricing);

  const formatValue = (value) => {
    return `${currencySymbol}${Number(value || 0).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const styles = {
    wrapper: {
      padding: "20px 40px",
      fontFamily: "Arial, sans-serif",
      color: "#56616b",
    },
    tableContainer: {
      maxWidth: "900px",
      marginBottom: "35px",
    },
    title: {
      color: "#00BFFF",
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "26px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "Arial, sans-serif",
    },
    headerRow: {
      backgroundColor: "#00BFFF",
    },
    thLeft: {
      border: "1px solid #dcdcdc",
      textAlign: "left",
      padding: "12px 10px",
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
    },
    thRight: {
      border: "1px solid #dcdcdc",
      textAlign: "right",
      padding: "12px 10px",
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
      width: "140px",
    },
    categoryRow: {
      backgroundColor: "#dcdcdc",
    },
    categoryTd: {
      border: "1px solid #dcdcdc",
      textAlign: "left",
      padding: "12px 10px",
      fontSize: "20px",
      fontWeight: "700",
      color: "#5d6770",
    },
    serviceTd: {
      border: "1px solid #e5e5e5",
      textAlign: "left",
      padding: "11px 10px",
      fontSize: "16px",
      fontWeight: "700",
      color: "#5d6770",
    },
    amountTd: {
      border: "1px solid #e5e5e5",
      textAlign: "right",
      padding: "11px 10px",
      fontSize: "16px",
      fontWeight: "700",
      color: "#5d6770",
    },
    darkRow: {
      backgroundColor: "#808080",
    },
    darkTdLeft: {
      border: "1px solid #cfcfcf",
      textAlign: "left",
      padding: "12px 10px",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
    },
    darkTdRight: {
      border: "1px solid #cfcfcf",
      textAlign: "right",
      padding: "12px 10px",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
    },
    lightRow: {
      backgroundColor: "#dcdcdc",
    },
    lightTdLeft: {
      border: "1px solid #dcdcdc",
      textAlign: "left",
      padding: "12px 10px",
      color: "#000000",
      fontSize: "16px",
      fontWeight: "700",
    },
    lightTdRight: {
      border: "1px solid #dcdcdc",
      textAlign: "right",
      padding: "12px 10px",
      color: "#000000",
      fontSize: "16px",
      fontWeight: "700",
    },
    acceptText: {
      border: "1px solid #dcdcdc",
      textAlign: "left",
      padding: "14px 10px",
      color: "#000000",
      fontSize: "16px",
      fontWeight: "700",
    },
    acceptButtonTd: {
      border: "1px solid #dcdcdc",
      textAlign: "right",
      padding: "10px 16px",
    },
    acceptButton: {
      display: "inline-block",
      padding: "8px 18px",
      backgroundColor: "green",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "100px",
      fontSize: "16px",
      fontWeight: "700",
    },
  };

  const ProposalTable = ({ title, services, pricing, serviceChargeTypeID }) => {
    return (
      <div style={styles.tableContainer}>
        <p style={styles.title}>{title}</p>

        <table style={styles.table}>
          <tbody>
            <tr style={styles.headerRow}>
              <th style={styles.thLeft}>Services</th>
              <th style={styles.thRight}>Fees ({currencySymbol})</th>
            </tr>

            {services.map((serviceCat) => (
              <React.Fragment key={serviceCat.serviceCatID}>
                <tr style={styles.categoryRow}>
                  <td style={styles.categoryTd} colSpan={2}>
                    {serviceCat.serviceCatName}
                  </td>
                </tr>

                {serviceCat.servicesList?.map((service) => (
                  <tr key={service.serviceID}>
                    <td style={styles.serviceTd}>{service.serviceName}</td>

                    <td style={styles.amountTd}>
                      {formatValue(service.quotationPrice)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            <tr style={styles.darkRow}>
              <td style={styles.darkTdLeft}>Net Total</td>
              <td style={styles.darkTdRight}>
                {formatValue(pricing.netTotal)}
              </td>
            </tr>

            {Number(pricing.discounted || 0) > 0 && (
              <>
                <tr style={styles.lightRow}>
                  <td style={styles.lightTdLeft}>Discount</td>
                  <td style={styles.lightTdRight}>
                    (-) {formatValue(pricing.discounted)}
                  </td>
                </tr>

                <tr style={styles.darkRow}>
                  <td style={styles.darkTdLeft}>Discounted Total</td>
                  <td style={styles.darkTdRight}>
                    {formatValue(pricing.discountedTotal)}
                  </td>
                </tr>
              </>
            )}

            <tr style={styles.lightRow}>
              <td style={styles.lightTdLeft}>VAT</td>
              <td style={styles.lightTdRight}>{formatValue(pricing.vat)}</td>
            </tr>

            <tr style={styles.darkRow}>
              <td style={styles.darkTdLeft}>Grand Total</td>
              <td style={styles.darkTdRight}>
                {formatValue(pricing.grandTotal)}
              </td>
            </tr>

            <tr style={styles.lightRow}>
              <td style={styles.acceptText}>
                If you are happy with this proposal please click Accept to
                accept the proposal
              </td>
              <td style={styles.acceptButtonTd}>
                <a
                  href={
                    serviceChargeTypeID === 1
                      ? AcceptRecurringUrl
                      : AcceptOneOffUrl
                  }
                  style={styles.acceptButton}
                >
                  Accept
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const PackageProposalTable = ({
    title,
    services,
    packages,
    serviceChargeTypeID,
  }) => {
    const getPackageValue = (service, index) => {
      if (index === 0) return service.packageOneValue;
      if (index === 1) return service.packageTwoValue;
      if (index === 2) return service.packageThreeValue;
      return null;
    };

    const hasServiceInPackage = (service, packageId) => {
      return service?.servicePackageIDs?.some(
        (id) => Number(id) === Number(packageId),
      );
    };

    const getPackagePricing = (packageId, packageIndex) => {
      return (
        finalAmountList?.find(
          (item) =>
            Number(item.serviceChargeTypeID) === Number(serviceChargeTypeID) &&
            Number(item.servicePackageID) === Number(packageId),
        ) ||
        finalAmountList?.filter(
          (item) =>
            Number(item.serviceChargeTypeID) === Number(serviceChargeTypeID),
        )?.[packageIndex] ||
        {}
      );
    };

    return (
      <div style={styles.tableContainer}>
        <p style={styles.title}>{title}</p>

        <table style={styles.table}>
          <tbody>
            <tr style={styles.headerRow}>
              <th style={styles.thLeft}>Services</th>

              {packages.map((pkg) => (
                <th key={pkg.servicePackageID} style={styles.thRight}>
                  {pkg.servicePackageName}
                </th>
              ))}
            </tr>

            {services.map((serviceCat) => (
              <React.Fragment key={serviceCat.serviceCatID}>
                <tr style={styles.categoryRow}>
                  <td style={styles.categoryTd}>{serviceCat.serviceCatName}</td>

                  {packages.map((pkg) => (
                    <td
                      key={pkg.servicePackageID}
                      style={styles.categoryTd}
                    ></td>
                  ))}
                </tr>

                {serviceCat.servicesList?.map((service) => (
                  <tr key={service.serviceID}>
                    <td style={styles.serviceTd}>{service.serviceName}</td>

                    {packages.map((pkg, index) => {
                      const packageValue = getPackageValue(service, index);
                      const isIncluded = hasServiceInPackage(
                        service,
                        pkg.servicePackageID,
                      );

                      return (
                        <td key={pkg.servicePackageID} style={styles.amountTd}>
                          {isIncluded && packageValue !== null
                            ? formatValue(packageValue)
                            : "✗"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}

            <tr style={styles.darkRow}>
              <td style={styles.darkTdLeft}>Net Total</td>
              {packages.map((pkg, index) => {
                const pricing = getPackagePricing(pkg.servicePackageID, index);
                return (
                  <td key={pkg.servicePackageID} style={styles.darkTdRight}>
                    {formatValue(pricing.netTotal)}
                  </td>
                );
              })}
            </tr>

            {packages.some(
              (pkg) =>
                Number(getPackagePricing(pkg.servicePackageID).discounted) > 0,
            ) && (
              <>
                <tr style={styles.lightRow}>
                  <td style={styles.lightTdLeft}>Discount</td>
                  {packages.map((pkg, index) => {
                    const pricing = getPackagePricing(
                      pkg.servicePackageID,
                      index,
                    );
                    return (
                      <td
                        key={pkg.servicePackageID}
                        style={styles.lightTdRight}
                      >
                        (-) {formatValue(pricing.discounted)}
                      </td>
                    );
                  })}
                </tr>

                <tr style={styles.darkRow}>
                  <td style={styles.darkTdLeft}>Discounted Total</td>
                  {packages.map((pkg, index) => {
                    const pricing = getPackagePricing(
                      pkg.servicePackageID,
                      index,
                    );
                    return (
                      <td key={pkg.servicePackageID} style={styles.darkTdRight}>
                        {formatValue(pricing.discountedTotal)}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            <tr style={styles.lightRow}>
              <td style={styles.lightTdLeft}>VAT</td>
              {packages.map((pkg, index) => {
                const pricing = getPackagePricing(pkg.servicePackageID, index);
                return (
                  <td key={pkg.servicePackageID} style={styles.lightTdRight}>
                    {formatValue(pricing.vat)}
                  </td>
                );
              })}
            </tr>

            <tr style={styles.darkRow}>
              <td style={styles.darkTdLeft}>Grand Total</td>
              {packages.map((pkg, index) => {
                const pricing = getPackagePricing(pkg.servicePackageID, index);
                return (
                  <td key={pkg.servicePackageID} style={styles.darkTdRight}>
                    {formatValue(pricing.grandTotal)}
                  </td>
                );
              })}
            </tr>

            <tr style={styles.lightRow}>
              <td style={styles.acceptText}>
                If you are happy with this proposal please click Accept to
                accept the proposal
              </td>

              {packages.map((pkg, packageIndex) => (
                <td style={styles.acceptButtonTd}>
                  <a
                    href={
                      serviceChargeTypeID === ServiceChargeTypeEnum.Recurring
                        ? packageIndex === 0
                          ? AcceptRecurringUrlButton1
                          : packageIndex === 1
                            ? AcceptRecurringUrlButton2
                            : AcceptRecurringUrlButton3
                        : packageIndex === 0
                          ? AcceptOneOffUrlButton1
                          : packageIndex === 1
                            ? AcceptOneOffUrlButton2
                            : AcceptOneOffUrlButton3
                    }
                    style={styles.acceptButton}
                  >
                    Accept
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Recurring accept button URLs

  const AcceptRecurringUrl = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.Recurring}&Action=Accepted&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  const AcceptOneOffUrl = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.OneOff}&Action=Accepted&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  const AcceptRecurringUrlButton1 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.Recurring}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[0]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;
  const AcceptRecurringUrlButton2 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.Recurring}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[1]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;
  const AcceptRecurringUrlButton3 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.Recurring}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[2]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  const DeclineRecurringUrl = `https://${Frontend_Url}/accept-decline-proposal?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.Recurring}&Action=Declined&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  const AcceptOneOffUrlButton1 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.OneOff}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[0]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;
  const AcceptOneOffUrlButton2 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.OneOff}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[1]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;
  const AcceptOneOffUrlButton3 = `https://${Frontend_Url}/generate-contract?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.OneOff}&Action=Accepted&ServicePackageKeyID=${selectedPackagesList[2]?.servicePackageKeyID}&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  const DeclineOneOffUrl = `https://${Frontend_Url}/accept-decline-proposal?quoteKeyID=${QuoteKeyID}&ServiceChargeTypeID=${ServiceChargeTypeEnum.OneOff}&Action=Declined&ContractSignatoryKeyID=${ContractSignatoryKeyID}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 40px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "120px" }} />

        <h1
          style={{
            color: "#00BFFF",
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          AI-Built Proposal
        </h1>

        <ViewAiProposalPdfGenerator
          userKeyID={proposalData.userKeyID}
          moduleName="Quote"
          proposalName="AI-Built Proposal"
          brandColor="#00BFFF"
          proposalData={proposalData}
          onPdfGenerated={(url) => {
            console.log("Generated PDF URL:", url);
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {isPackageProposal ? (
              <>
                {recurringServices?.length > 0 && (
                  <PackageProposalTable
                    title={`Recurring Fees (${paymentFrequencyLabel})`}
                    services={recurringServices}
                    packages={selectedPackagesList}
                    serviceChargeTypeID={1}
                  />
                )}

                {oneOffServices?.length > 0 && (
                  <PackageProposalTable
                    title="One-Off Fees"
                    services={oneOffServices}
                    packages={selectedPackagesList}
                    serviceChargeTypeID={2}
                  />
                )}
              </>
            ) : (
              <>
                {recurringServices.length > 0 && (
                  <ProposalTable
                    title={`Recurring Fees (${paymentFrequencyLabel})`}
                    services={recurringServices}
                    pricing={getPricing(1)}
                    serviceChargeTypeID={1}
                  />
                )}

                {oneOffServices.length > 0 && (
                  <ProposalTable
                    title="One-Off Fees"
                    services={oneOffServices}
                    pricing={getPricing(2)}
                    serviceChargeTypeID={2}
                  />
                )}
              </>
            )}
          </div>
        </ViewAiProposalPdfGenerator>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {isPackageProposal ? (
          <>
            {recurringServices?.length > 0 && (
              <PackageProposalTable
                title={`Recurring Fees (${paymentFrequencyLabel})`}
                services={recurringServices}
                packages={selectedPackagesList}
                serviceChargeTypeID={1}
              />
            )}

            {oneOffServices?.length > 0 && (
              <PackageProposalTable
                title="One-Off Fees"
                services={oneOffServices}
                packages={selectedPackagesList}
                serviceChargeTypeID={2}
              />
            )}
          </>
        ) : (
          <>
            {recurringServices.length > 0 && (
              <ProposalTable
                title={`Recurring Fees (${paymentFrequencyLabel})`}
                services={recurringServices}
                pricing={getPricing(1)}
                serviceChargeTypeID={1}
              />
            )}

            {oneOffServices.length > 0 && (
              <ProposalTable
                title="One-Off Fees"
                services={oneOffServices}
                pricing={getPricing(2)}
                serviceChargeTypeID={2}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
