import React, { useContext, useEffect, useState } from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import { GetTemplateModelData } from "../../redux/Services/Config/TemplateApi";
import { ElementType } from "../../Middleware/enums";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  GenerateContractFromProposal,
  GetContractDetailsForSignEasyList,
} from "../../redux/Services/Proposal/ProposalApi";
import { GetSendToSignEasy } from "../../redux/Services/SignEasy";
import GeneratePdfLoaderPage from "../../components/GeneratePdfloaderpage";
import { generatePdfUrl, mergePdfApiUrl } from "../../Base-Url/Base_Url";
function AcceptInvitation() {
  const { setTopbar, setLoader, formatValueWithoutCurrencySymbol, formatValue, getFontStylesFromHtml, replaceTemplatePricingVariables, replaceUrlInHtml } = useContext(AuthContextProvider);
  const [templateElementList, setTemplateElementList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatePdfData, setGeneratePdfData] = useState([]);
  const [MergePdfUrl, setMergePdfUrl] = useState("");

  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("");

  const [recurringServiceCatList, setRecurringServiceCatList] = useState([]);
  const [oneOffServiceCatList, setOneOffServiceCatList] = useState([]);
  const [serviceDescriptionList, setServiceDescriptionList] = useState([]);
  const [ChargeTypeId1Array, setChargeTypeId1Array] = useState([]);
  const [ChargeTypeId2Array, setChargeTypeId2Array] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [SvgShow, setSvgShow] = useState(false);
  const [ShowDiscountLine, setShowDiscountLine] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState(null);
  const [BrandColor, setBrandColor] = useState(false);
  const [BrandLogo, setBrandLogo] = useState(false);
  const [feeTypeId, setFeeTypeId] = useState("");
  const [TnCHtmlContent, setTnCHtmlContent] = useState(null);
  const [TnCPdf, setTnCPdf] = useState(null);
  const [webSite, setWebSite] = useState("");
  const [AdditionalInformation, setAdditionalInformation] = useState([]);
  const imgTag = `<img src="${BrandLogo}" alt="Logo" style="display: none; margin: 0 auto 15px;">`;

  const [contractSignatoriesList, setContractSignatoriesList] = useState([]);
  const [finalQuotationAmountList, setFinalQuotationAmountList] = useState([]);
  const location = useLocation();
  const [organisationData, setOrganisationData] = useState([]);

  const [contractKeyID, setContractKeyID] = useState();
  const urlParams = new URLSearchParams(location.search);
  const quoteKeyID = urlParams.get("quoteKeyID");
  const ServiceChargeTypeID = urlParams.get("ServiceChargeTypeID");
  const ContractSignatoryKeyID = urlParams.get("ContractSignatoryKeyID");
  const Action = urlParams.get("Action");
  const ServicePackageKeyID = urlParams.get("ServicePackageKeyID");
  const [quoteInfo, setQuoteInfo] = useState({
    templateKeyID: null,
    clientID: null,
  });
  // const fontSize = "0.20in";
  const fontSizeHeading = "0.2in";
  const common = useSelector((state) => state.Storage);

  useEffect(() => {
    setTopbar("none");
    //  GetTemplateModalData()
    GenerateContractFromProposalData();
    // GetOrganisationInformationModelData()
  }, [1]); // eslint-disable-line
  const getPaymentFrequencyLabel = () => {
    const Payment_Frequency = {
      Yearly: 1,
      HalfYearly: 2,
      Quarterly: 3,
      Monthly: 4,
    };

    const frequencyValue = paymentFrequency;

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
  // useEffect(() => {
  //   if (organisationData && organisationData.otherInformation) {
  //     const { emailID, phoneNo, fullAddress } =
  //       organisationData.otherInformation[0];
  //     setEmail(emailID);
  //     setPhone(phoneNo);
  //     setFullAddress(fullAddress);
  //   }
  // }, [organisationData]);

  // const GetOrganisationInformationModelData = async () => {
  //   const response = await GetOrganisationInformationModel(
  //     common.organisationKeyID
  //   );
  //   if (response) {
  //     if (response?.data?.statusCode === 200) {
  //       const ModelData = response?.data?.responseData?.data;

  //       // Extract emailId, phoneNumber, and countryCode
  //       const { emailID, phoneNo, countryCode } = ModelData.otherInformation;

  //       const concatenateFullAddress = (address) => {
  //         const addPart = (part) => (part ? `${part}, ` : "");

  //         let concatenatedAddress = `${addPart(
  //           address?.addressLine1?.replace(",", " ")
  //         )}${addPart(address?.addressLine2)}${addPart(
  //           address?.locality
  //         )}${addPart(address?.region)}${addPart(
  //           address?.country || address?.countryName
  //         )}${address?.postcode || ""}`;

  //         // Remove trailing comma, if present
  //         if (concatenatedAddress.endsWith(", ")) {
  //           concatenatedAddress = concatenatedAddress.slice(0, -2);
  //         }
  //         return concatenatedAddress;
  //       };

  //       const fullAddress = concatenateFullAddress(
  //         ModelData.organisationAddress
  //       );

  //       // Concatenate countryCode and phoneNo
  //       const concatenatedPhone = `${countryCode} ${phoneNo}`;

  //       // Update otherInformation with only required fields
  //       const updatedOtherInformation = [
  //         {
  //           emailID,
  //           phoneNo: concatenatedPhone,
  //           fullAddress,
  //         },
  //       ];

  //       // Set updated organization data
  //       setOrganisationData({
  //         otherInformation: updatedOtherInformation,
  //       });
  //       // Set updated organization data in local storage
  //     } else {
  //       setErrorMessage(response?.data?.errorMessage);
  //     }
  //   }
  // };

  //Change span color
  function changeSpanColor(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const elements = doc.getElementsByClassName("OrgBrandColor");
    if (elements.length > 0) {
      // Loop through each element and change its color
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = BrandColor;
      }
    }

    return doc.body.innerHTML;
  }
  //Generate Pdf Array and objects
  useEffect(() => {
    if (templateElementList) {
      const pdfDataArray = [];
      let currentArray = [];
      let pricingTableAdded = false; // Flag to ensure only one pricing table is added
      let prevElementType = null;
      templateElementList.forEach((element) => {

        switch (element.templateElementTypeID) {
          case ElementType.HEADING:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: ${fontSizeHeading}; font-family:${fontFamily};">${element.headings} <br
                >
                <hr  style=" padding-left: 40px; padding-right: 40px; color: black; "></hr></div>`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: ${fontSizeHeading};  font-family:${fontFamily};">${element.headings} <br
                  >
                  <hr  style=" padding-left: 40px; padding-right: 40px; color: black; "></hr></div>`,
                },
              ];
            }
            break;
          case ElementType.STATEMENT_OF_FACTS:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;margin-top: 10px"> 
                ${serviceDescriptionList
                    .map(
                      (serviceCat) => `
                      <div>
                          <p style="font-family:${fontFamily};color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                          .map(
                            (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize};">
                                  ${subService.serviceName}
                              </p>
                              ${subService?.gpdList !== null
                                ? subService?.gpdList.filter(item => item.driverTypeID !== 1)
                                  ?.map(
                                    (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSize}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                <span style="">
                                     <strong> ${
                                      //formatValue(pricingDriver.driverValue)
                                      pricingDriver.driverTypeID === 2
                                        ? Number(pricingDriver.driverValue)
                                          .toFixed(2)
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        : pricingDriver.driverTypeID === 3
                                          ? pricingDriver.variationName
                                          : pricingDriver.driverTypeID === 4
                                            ? pricingDriver.slabTypeID === 2 ?
                                              formatValueWithoutCurrencySymbol(pricingDriver.driverValue) :
                                              Number(pricingDriver.slabFrom)
                                                .toFixed(2)
                                                .toString()
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) +
                                              "-" +
                                              Number(pricingDriver.slabTo)
                                                .toFixed(2)
                                                .toString()
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : ""
                                      }</strong>
                                </span> 
                            </li>
                              `
                                  )
                                  .join("")
                                : ``
                              }
                          `
                          )
                          .join("")}
                      </div>
                  `
                    )
                    .join("")}
                                        ${AdditionalInformation?.length > 0 ?
                    `<p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p>
    <hr style="color: gray; margin-top: -15px;" />` +
                    AdditionalInformation.filter(item => item.driverTypeID !== 1).map(serviceCat => `
        <div>
            <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize};">
                ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4 ? serviceCat.slabTypeID === 2 ? `<strong>${formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong>` : `<strong>${formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}-${formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>` : serviceCat.driverTypeID === 3 ? `<strong>${serviceCat.variationName}</strong>` : `${serviceCat.driverName}: <strong>${formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong>`}
            </p>
        </div>
    `).join("") : ""
                  }

                  </div>`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray.push({
                textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;margin-top: 10px"> 
                ${serviceDescriptionList
                    .map(
                      (serviceCat) => `
                      <div>
                          <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                          .map(
                            (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize}; ">
                                  ${subService.serviceName}
                              </p>
                              ${subService?.gpdList !== null
                                ? subService?.gpdList.filter(item => item.driverTypeID !== 1)
                                  ?.map(
                                    (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSize}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                <span style="">
                                     <strong> ${
                                      //formatValue(pricingDriver.driverValue)
                                      pricingDriver.driverTypeID === 2
                                        ? Number(pricingDriver.driverValue)
                                          .toFixed(2)
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        : pricingDriver.driverTypeID === 3
                                          ? pricingDriver.variationName
                                          : pricingDriver.driverTypeID === 4
                                            ? pricingDriver.slabTypeID === 2 ?
                                              formatValueWithoutCurrencySymbol(pricingDriver.driverValue) :
                                              Number(pricingDriver.slabFrom)
                                                .toFixed(2)
                                                .toString()
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) +
                                              "-" +
                                              Number(pricingDriver.slabTo)
                                                .toFixed(2)
                                                .toString()
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : ""
                                      }</strong>
                                </span> 
                            </li>
                              `
                                  )
                                  .join("")
                                : ``
                              }
                          `
                          )
                          .join("")}
                      </div>
                  `
                    )
                    .join("")}
                                 ${AdditionalInformation?.length > 0 ?
                    `<p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p>
    <hr style="color: gray; margin-top: -15px;" />` +
                    AdditionalInformation.filter(item => item.driverTypeID !== 1).map(serviceCat => `
        <div>
            <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize};">
                 ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4 ? serviceCat.slabTypeID === 2 ? `<strong>${formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong>` : `<strong>${formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}-${formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>` : serviceCat.driverTypeID === 3 ? `<strong>${serviceCat.variationName}</strong>` : `${serviceCat.driverName}: <strong>${formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong>`}
            </p>
        </div>
    `).join("") : ""
                  }

                  </div>`,
              });
            }
            break;
          case ElementType.TEXT_BLOCK:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;">${replaceUrlInHtml(element.htmlContent)}</div>`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;">${replaceUrlInHtml(element.htmlContent)}</div>`,
                },
              ];
            }
            break;
          case ElementType.FULL_PAGE_HEADING:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                // textbox: `<div style="padding-left: 40px; padding-right: 40px; margin-top: 350px;">${element.htmlContent}</div>`,
                textbox: ` ${imgTag}<div style="text-align: center; padding-left: 40px; padding-right: 40px; color: ${BrandColor}; font-size: ${fontSizeHeading};  margin-top: 350px; font-family:${fontFamily};">${element.headings} <br
                  >
                  <hr  style=" padding-left: 40px; padding-right: 40px; color: black; "></hr><div style=" color: Black; font-size: ${fontSize}; font-family:${fontFamily};">${element.shortDesc}</div></div>
                 `,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  // textbox: `<div style="padding-left: 40px; padding-right: 40px; margin-top: 350px;">${element.htmlContent}</div>`,
                  textbox: ` ${imgTag}<div style=" text-align: center; padding-left: 40px; padding-right: 40px; color: ${BrandColor}; font-size: ${fontSizeHeading};  margin-top: 350px; font-family:${fontFamily};">${element.headings} <br
                    >
                    <hr  style=" padding-left: 40px; padding-right: 40px; color: black; "></hr> <div style="color: Black; font-size: ${fontSize}; font-family:${fontFamily};">${element.shortDesc}</div></div>
                   `,
                },
              ];
            }
            break;
          case ElementType.SIGNATURE_BLOCK:
            // const signatureObjects = [];
            let rightSignatureList = contractSignatoriesList.filter(
              (x) => x.signaturePositionID === 1 && x.officerType === null
            );
            let leftSignatureList = contractSignatoriesList.filter(
              (x) => x.signaturePositionID === 2 && x.officerType === null
            );
            let leftSignatureOfficerList = contractSignatoriesList.filter(
              (x) => x.signaturePositionID === 2
            );

            let htmlContentForSignatories = "";
            let loopCount = Math.max(
              rightSignatureList.length,
              leftSignatureList.length
            );

            htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px; page-break-inside: avoid; break-inside: avoid;'>`
            {/* "<div style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px;'>"; */ }
            htmlContentForSignatories += "<table style='width: 100%;'>";

            for (let i = 0; i < loopCount; i++) {
              //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
              //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
              htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureList[i]?.RowNo
                }_</span>${leftSignatureList[i]
                  ? leftSignatureList[i].firstName +
                  " " +
                  leftSignatureList[i].lastName
                  : ""
                }<span style="color: white;">^></span></td>
              <td id="right_${i + 1
                }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in;text-align:right"><span style="color: white;"><^${rightSignatureList[i]?.RowNo
                }_</span>${rightSignatureList[i]
                  ? rightSignatureList[i].firstName +
                  " " +
                  rightSignatureList[i].lastName
                  : ""
                }<span style="color: white;">^></span></td>

              </tr>`;
            }
            if (organisationData.otherInformation[0].signatureImageUrl !== null && organisationData.otherInformation[0].signatureImageUrl !== undefined && organisationData.otherInformation[0].signatureImageUrl !== "") {
              htmlContentForSignatories += `
  <tr style='width:100%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left:45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px; width:130px;"></div>
       <div style="margin-bottom: 20px;margin-top: 30px;">${organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;
            } else {
              for (let i = 0; i < Math.max(leftSignatureOfficerList.length); i++) {
                //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                  }" style="padding-top: 50px;width:50%; font-family:${fontFamily};font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureOfficerList[i]?.RowNo
                  }_</span>${leftSignatureOfficerList[i]
                    ? leftSignatureOfficerList[i].firstName +
                    " " +
                    leftSignatureOfficerList[i].lastName
                    : ""
                  }<span style="color: white;">^></span></td>
              

              </tr>`;
              }
            }
            htmlContentForSignatories += "</table>";
            htmlContentForSignatories += "</div>";
            // const signatureObject = {
            //   textbox: htmlContentForSignatories,
            // };
            // signatureObjects.push(signatureObject);
            // pdfDataArray.push(signatureObjects);
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: `${htmlContentForSignatories}`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `${htmlContentForSignatories}`,
                },
              ];
            }
            break;
          case ElementType.First_Page:
            const coloredHtmlContent = changeSpanColor(element.htmlContent);
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: `<div style="padding-left: 40px; padding-right: 40px;">${coloredHtmlContent}</div>`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `<div style="padding-left: 40px; padding-right: 40px;">${coloredHtmlContent}</div>`,
                },
              ];
            }
            break;
          case ElementType.SERVICE_PRICING_TABLE:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              if (packageList.length > 0) {
                currentArray.push({
                  table: packageList.map(
                    (selectedPackagesData) =>
                      ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: 30px;">Package :${selectedPackagesData.servicePackageName} </div>`
                  ),
                });

                if (recurringServiceCatList.length > 0) {
                  currentArray.push({
                    table: `
                              <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                                <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 15px;">Recurring Fees (${getPaymentFrequencyLabel()})</p>
                                <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                                  <tr style="background-color: ${BrandColor};">
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                    ${packageList
                        .map(
                          (selectedPackagesData) => `
                                      <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">
                                        ${selectedPackagesData.servicePackageName}
                                      </th>`
                        )
                        .join("")}
                                  </tr>
                                  ${recurringServiceCatList
                        .map(
                          (serviceCat) => `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                        ${serviceCat.serviceCatName}
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                    </tr>
                                    ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                          ${subService.serviceName}
                                        </td>
                                 ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }

                                      </tr>`
                              )
                              .join("")}
                                  `
                        )
                        .join("")}
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Net Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                        ${finalQuotationAmountList
                        .filter(
                          (x) =>
                            x.serviceChargeTypeID === 1 &&
                            x.servicePackageID ===
                            packageList[0]?.servicePackageID
                        )
                        .map((x) => (x.netTotal) < (x.discountedTotal) || (x.discounted > 0 && (!ShowDiscountLine)) ? formatValue(x.discountedTotal) : formatValue(x.netTotal))
                        .join("")}
                                    </td>
                                  </tr>
                                  ${finalQuotationAmountList.some(
                          (x) =>
                            x.serviceChargeTypeID === 1 &&
                            x.discounted > 0
                        ) && ShowDiscountLine
                        ? `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                        Discount
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                        (-)  ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.discounted))
                          .join("")}
                                      </td>
                                    </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) =>
                            formatValue(x.discountedTotal)
                          )
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                     ${finalQuotationAmountList.some(
                        (x) =>
                          x.serviceChargeTypeID === 1 &&
                          x.vat > 0
                      )
                        ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.vat))
                          .join("")}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.grandTotal))
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                </table>
                              </div>
                            `,
                  });
                }

                if (oneOffServiceCatList.length > 0) {
                  currentArray.push({
                    table: `
                                <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">

                                  <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 15px;"> One-Off Fees </p>
                                  <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                                  <tr style="background-color: ${BrandColor};">
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                    ${packageList
                        .map(
                          (selectedPackagesData) => `
                                      <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">
                                        ${selectedPackagesData.servicePackageName}
                                      </th>`
                        )
                        .join("")}
                                  </tr>
                                  ${oneOffServiceCatList
                        .map(
                          (serviceCat) => `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                        ${serviceCat.serviceCatName}
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                    </tr>
                                    ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                          ${subService.serviceName}
                                        </td>
                                        ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }

                                      </tr>`
                              )
                              .join("")}
                                  `
                        )
                        .join("")}
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Net Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                     ${finalQuotationAmountList
                        .filter(
                          (x) =>
                            x.serviceChargeTypeID === 2 &&
                            x.servicePackageID ===
                            packageList[0]?.servicePackageID
                        )
                        .map((x) => (x.netTotal) < (x.discountedTotal) || (x.discounted > 0 && (!ShowDiscountLine)) ? formatValue(x.discountedTotal) : formatValue(x.netTotal))
                        .join("")}
                                    </td>
                                  </tr>
                                   ${finalQuotationAmountList.some(
                          (x) =>
                            x.serviceChargeTypeID === 2 &&
                            x.discounted > 0
                        ) && ShowDiscountLine
                        ? `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                        Discount
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                        (-)  ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.discounted))
                          .join("")}
                                      </td>
                                    </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) =>
                            formatValue(x.discountedTotal)
                          )
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                     ${finalQuotationAmountList.some(
                        (x) =>
                          x.serviceChargeTypeID === 2 &&
                          x.vat > 0
                      )
                        ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.vat))
                          .join("")}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.grandTotal))
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                </table>
                                </div>
                              `,
                  });
                }
              } else {
                if (recurringServiceCatList.length > 0) {
                  currentArray.push({
                    table: ` ${imgTag}
                          <div style="padding: 40px; padding-top:0px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                            <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 0px;">Recurring Fees (${getPaymentFrequencyLabel()})</p>
                            <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                              <tr style="background-color: ${BrandColor};">
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees (£)</th>
                              </tr>
                              ${recurringServiceCatList
                        .map(
                          (serviceCat) => `
                                <tr style="background-color: #eee;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                    ${serviceCat.serviceCatName}
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                </tr>
                                ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                  <tr>
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                      ${subService.serviceName}
                                    </td>
                                          ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                  </tr>`
                              )
                              .join("")}
                              `
                        )
                        .join("")}
                              ${ChargeTypeId1Array.map(
                          (value) => `
                                <tr style="background-color:#808080;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                    Net Total
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                     ${(value.netTotal < value.discountedTotal) ||
                              (Number(value?.discounted) > 0 && (!ShowDiscountLine))
                              ? formatValue(value.discountedTotal)
                              : formatValue(value.netTotal)
                            }
                                  </td>
                                </tr>
                                ${(value?.discounted !== null &&
                              value?.discounted !== 0.0) &&
                              ShowDiscountLine
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      Discount
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                      (-)  ${formatValue(value?.discounted)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value?.discountedTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                                ${value?.vat !== null && value?.vat !== 0.0
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${formatValue(value?.vat)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value?.grandTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                              `
                        ).join("")}
                            </table>
                          </div>
                        `,
                  });
                }
                // Check if selectedOneOffServiceList has items
                if (oneOffServiceCatList.length > 0) {
                  // Append the table for selectedOneOffServiceList
                  currentArray.push({
                    table: `
                                <div style="padding: 40px; padding-top:0px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                                  <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px;margin-top: 0px;">One-Off Fees</p>
                                  <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                                    <tr style="background-color: ${BrandColor};">
                                      <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                      <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees ()</th>
                                    </tr>
                                    ${oneOffServiceCatList
                        .map(
                          (serviceCat) => `
                                      <tr style="background-color:#eee;">
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                          ${serviceCat.serviceCatName}
                                        </td>
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                      </tr>
                                      ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                        <tr>
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                      ${subService.serviceName}
                                    </td>
                                          ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                  </tr>`
                              )
                              .join("")}
                                    `
                        )
                        .join("")}
                                    ${ChargeTypeId2Array.map(
                          (value) => `
                                      <tr style="background-color:#808080;">
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                          Net Total
                                        </td>
                                        <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                           ${(value.netTotal < value.discountedTotal) ||
                              (Number(value?.discounted) > 0 && (!ShowDiscountLine))
                              ? formatValue(value.discountedTotal)
                              : formatValue(value.netTotal)
                            }
                                        </td>
                                      </tr>
                                      ${(value?.discounted !== null &&
                              value?.discounted !== 0.0) &&
                              ShowDiscountLine
                              ? `
                                        <tr style="background-color: #DCDCDC;">
                                          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                            Discount
                                          </td>
                                          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                            (-)  ${formatValue(
                                value.discounted
                              )}
                                          </td>
                                        </tr>
                                        <tr style="background-color:#808080;">
                                          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                            Discounted Total
                                          </td>
                                          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                             ${formatValue(
                                value.discountedTotal
                              )}
                                          </td>
                                        </tr>`
                              : ""
                            }
                                      ${value?.vat !== null &&
                              value?.vat !== 0.0
                              ? `
                                        <tr style="background-color: #DCDCDC;">
                                          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                            VAT
                                          </td>
                                          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                             ${formatValue(value.vat)}
                                          </td>
                                        </tr>
                                        <tr style="background-color:#808080;">
                                          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                            Grand Total
                                          </td>
                                          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                             ${formatValue(value.grandTotal)}
                                          </td>
                                        </tr>`
                              : ""
                            }
                                    `
                        ).join("")}
                                  </table>
                                </div>
                              `,
                  });
                }
              }
            } else {
              if (packageList.length > 0) {
                currentArray.push({
                  table: packageList.map(
                    (selectedPackagesData) =>
                      ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: 30px;">Package:${selectedPackagesData.servicePackageName} <br
                  ></br></div>`
                  ),
                });
                if (recurringServiceCatList.length > 0) {
                  currentArray.push({
                    table: `
                              <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                                <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 15px;">Recurring Fees (${getPaymentFrequencyLabel()})</p>
                                <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                                  <tr style="background-color: ${BrandColor};">
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                    ${packageList
                        .map(
                          (selectedPackagesData) => `
                                      <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">
                                        ${selectedPackagesData.servicePackageName}
                                      </th>`
                        )
                        .join("")}
                                  </tr>
                                  ${recurringServiceCatList
                        .map(
                          (serviceCat) => `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                        ${serviceCat.serviceCatName}
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                    </tr>
                                    ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                          ${subService.serviceName}
                                        </td>
                                              ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                      </tr>`
                              )
                              .join("")}
                                  `
                        )
                        .join("")}
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Net Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                     ${finalQuotationAmountList
                        .filter(
                          (x) =>
                            x.serviceChargeTypeID === 1 &&
                            x.servicePackageID ===
                            packageList[0]?.servicePackageID
                        )
                        .map((x) => (x.netTotal) < (x.discountedTotal) || (x.discounted > 0 && (!ShowDiscountLine)) ? formatValue(x.discountedTotal) : formatValue(x.netTotal))
                        .join("")}
                                    </td>
                                  </tr>
                                ${finalQuotationAmountList.some(
                          (x) =>
                            x.serviceChargeTypeID === 1 &&
                            x.discounted > 0
                        ) && ShowDiscountLine
                        ? `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                        Discount
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                        (-)  ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.discounted))
                          .join("")}
                                      </td>
                                    </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) =>
                            formatValue(x.discountedTotal)
                          )
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                     ${finalQuotationAmountList.some(
                        (x) =>
                          x.serviceChargeTypeID === 1 &&
                          x.vat > 0
                      )
                        ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.vat))
                          .join("")}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 1 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.grandTotal))
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                </table>
                              </div>
                            `,
                  });
                }

                if (oneOffServiceCatList.length > 0) {
                  currentArray.push({
                    table: `
                                <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">

                                  <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 15px;"> One-Off Fees </p>
                                  <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                                  <tr style="background-color: ${BrandColor};">
                                    <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                    ${packageList
                        .map(
                          (selectedPackagesData) => `
                                      <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">
                                        ${selectedPackagesData.servicePackageName}
                                      </th>`
                        )
                        .join("")}
                                  </tr>
                                  ${oneOffServiceCatList
                        .map(
                          (serviceCat) => `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                        ${serviceCat.serviceCatName}
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                    </tr>
                                    ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                          ${subService.serviceName}
                                        </td>
                                              ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                      </tr>`
                              )
                              .join("")}
                                  `
                        )
                        .join("")}
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Net Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                        .filter(
                          (x) =>
                            x.serviceChargeTypeID === 2 &&
                            x.servicePackageID ===
                            packageList[0]?.servicePackageID
                        )
                        .map((x) => (x.netTotal) < (x.discountedTotal) || (x.discounted > 0 && (!ShowDiscountLine)) ? formatValue(x.discountedTotal) : formatValue(x.netTotal))
                        .join("")}
                                    </td>
                                  </tr>
                                   ${finalQuotationAmountList.some(
                          (x) =>
                            x.serviceChargeTypeID === 2 &&
                            x.discounted > 0
                        ) && ShowDiscountLine
                        ? `
                                    <tr style="background-color: #DCDCDC;">
                                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                        Discount
                                      </td>
                                      <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                        (-)  ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.discounted))
                          .join("")}
                                      </td>
                                    </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) =>
                            formatValue(x.discountedTotal)
                          )
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                     ${finalQuotationAmountList.some(
                        (x) =>
                          x.serviceChargeTypeID === 2 &&
                          x.vat > 0
                      )
                        ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.vat))
                          .join("")}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${finalQuotationAmountList
                          .filter(
                            (x) =>
                              x.serviceChargeTypeID === 2 &&
                              x.servicePackageID ===
                              packageList[0]?.servicePackageID
                          )
                          .map((x) => formatValue(x.grandTotal))
                          .join("")}
                                    </td>
                                  </tr>`
                        : ""
                      }
                                </table>
                                </div>
                              `,
                  });
                }
              } else {
                if (recurringServiceCatList.length > 0) {
                  currentArray.push({
                    table: ` ${imgTag}
                          <div style="padding: 40px; padding-top:5px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                            <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px; margin-top: 0px;">Recurring Fees (${getPaymentFrequencyLabel()})</p>
                            <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                              <tr style="background-color: ${BrandColor};">
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees (£)</th>
                              </tr>
                              ${recurringServiceCatList
                        .map(
                          (serviceCat) => `
                                <tr style="background-color: #eee;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                    ${serviceCat.serviceCatName}
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                </tr>
                                ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                      ${subService.serviceName}
                                    </td>
                                          ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                  </tr>`
                              )
                              .join("")}
                              `
                        )
                        .join("")}
                              ${ChargeTypeId1Array.map(
                          (value) => `
                                <tr style="background-color:#808080;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                    Net Total
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                     ${(value.netTotal < value.discountedTotal) ||
                              (Number(value?.discounted) > 0 && (!ShowDiscountLine))
                              ? formatValue(value.discountedTotal)
                              : formatValue(value.netTotal)
                            }
                                  </td>
                                </tr>
                               ${(value?.discounted !== null &&
                              value?.discounted !== 0.0) &&
                              ShowDiscountLine
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      Discount
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                      (-)  ${formatValue(value?.discounted)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value?.discountedTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                                ${value?.vat !== null && value?.vat !== 0.0
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${formatValue(value?.vat)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value?.grandTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                              `
                        ).join("")}
                            </table>
                          </div>
                        `,
                  });
                }
                // Check if selectedOneOffServiceList has items
                if (oneOffServiceCatList.length > 0) {
                  // Append the table for selectedOneOffServiceList
                  currentArray.push({
                    table: ` ${imgTag}
                          <div style="padding: 40px; padding-top:0px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                            <p style="font-family:${fontFamily}; color: ${BrandColor}; font-size: 20px;margin-top: 0px;">One-Off Fees</p>
                            <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                              <tr style="background-color: ${BrandColor};">
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                                <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees (£)</th>
                              </tr>
                              ${oneOffServiceCatList
                        .map(
                          (serviceCat) => `
                                <tr style="background-color:#eee;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">
                                    ${serviceCat.serviceCatName}
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                </tr>
                                ${serviceCat.servicesList
                              .map(
                                (subService) => `
                                      <tr>
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                                      ${subService.serviceName}
                                    </td>
                                          ${feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${formatValue(
                                      subService.quotationPrice
                                    )}</td>`
                                    : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                                  </tr>`
                              )
                              .join("")}
                              `
                        )
                        .join("")}
                              ${ChargeTypeId2Array.map(
                          (value) => `
                                <tr style="background-color:#808080;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                    Net Total
                                  </td>
                                  <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                     ${(value.netTotal < value.discountedTotal) ||
                              (Number(value?.discounted) > 0 && (!ShowDiscountLine))
                              ? formatValue(value.discountedTotal)
                              : formatValue(value.netTotal)
                            }
                                  </td>
                                </tr>
                               ${(value?.discounted !== null &&
                              value?.discounted !== 0.0) &&
                              ShowDiscountLine
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      Discount
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                      (-)  ${formatValue(value.discounted)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Discounted Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value.discountedTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                                ${value?.vat !== null && value?.vat !== 0.0
                              ? `
                                  <tr style="background-color: #DCDCDC;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                                      VAT
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                                       ${formatValue(value.vat)}
                                    </td>
                                  </tr>
                                  <tr style="background-color:#808080;">
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
                                      Grand Total
                                    </td>
                                    <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                       ${formatValue(value.grandTotal)}
                                    </td>
                                  </tr>`
                              : ""
                            }
                              `
                        ).join("")}
                            </table>
                          </div>
                        `,
                  });
                }
              }
            }
            break;
          case ElementType.SERVICE_DESCRIPTION:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;margin-top: 10px">                
                                ${serviceDescriptionList
                    .map(
                      (serviceCat) => `
                      <div>
                          <p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: black;font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top:-5px;">
                          ${serviceCat.servicesList
                          .map(
                            (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize}; ">
                                  ${subService.serviceName}
                              </p>
                              <p>
                                 
                              ${subService.description === null ||
                                subService.description ===
                                undefined ||
                                subService.description === ""
                                ? ""
                                : subService.description
                              }
                              </p>
                             
                          `
                          )
                          .join("")}
                      </div>
                  `
                    )
                    .join("")}
                  
               
                </div >
                    `,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: ` ${imgTag}<div style="padding-left: 40px; padding-right: 40px;margin-top: 10px">                    
              ${serviceDescriptionList
                      .map(
                        (serviceCat) => `
                      <div>
                          <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -5px;">
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSize}; ">
                                  ${subService.serviceName}
                              </p>
                              <p>
                                  ${subService.description === null ||
                                  subService.description ===
                                  undefined ||
                                  subService.description === ""
                                  ? ""
                                  : subService.description
                                }
                              </p>
                             
                          `
                            )
                            .join("")}
                      </div>
                  `
                      )
                      .join("")}
                  </div >
                  
                  `,

                },
              ];
            }
            break;
          case ElementType.PAGE_BREAK: break;
          case ElementType.AWS_PDF_LINK:
            pdfDataArray.push(currentArray);
            currentArray = [];
            currentArray.push({
              [element.templateElementTypeID === ElementType.PAGE_BREAK
                ? "pageBreak"
                : "awsLink"]: element.htmlContent,
            });
            break;
          default:
            if (TnCHtmlContent || TnCPdf) {
              // let rightSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 1)
              // let leftSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 2)

              let rightSignatureList = contractSignatoriesList.filter(
                (x) => x.signaturePositionID === 1 && x.officerType === null
              );
              let leftSignatureList = contractSignatoriesList.filter(
                (x) => x.signaturePositionID === 2 && x.officerType === null
              );
              let leftSignatureOfficerList = contractSignatoriesList.filter(
                (x) => x.signaturePositionID === 2
              );
              let htmlContentForSignatories = ''
              let loopCount = Math.max(
                rightSignatureList.length,
                leftSignatureList.length
              );

              if ((TnCHtmlContent !== null && TnCHtmlContent !== undefined)) {
                // Handling Terms and Conditions
                //     if (
                //       prevElementType !== ElementType.PAGE_BREAK &&
                //       prevElementType !== ElementType.AWS_PDF_LINK

                //     ) {
                //       if (TnCHtmlContent) {
                //         currentArray.push({
                //           textbox: `<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: ${fontSizeHeading}; font-family:${fontFamily};" >TERMS & CONDITIONS<br>
                //         <hr style="padding-left: 40px; padding-right: 40px; color: black;"></hr></div>
                //           <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};">${TnCHtmlContent}</div><br>
                // ${(() => {
                //               htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 30px; page-break-inside: avoid; break-inside: avoid;'>`
                //               {/* "<div style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px;'>"; */ }
                //               htmlContentForSignatories += "<table style='width: 100%;'>";

                //               for (let i = 0; i < loopCount; i++) {
                //                 //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                //                 //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                //                 htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
                //   <td id="left_${i + 1
                //                   }" style="padding-top: 50px;width:50%; font-size: ${fontSize}; text-align:left"><span style="color: white;"><^${leftSignatureList[i]?.RowNo
                //                   }_</span>${leftSignatureList[i]
                //                     ? leftSignatureList[i].firstName +
                //                     " " +
                //                     leftSignatureList[i].lastName
                //                     : ""
                //                   }<span style="color: white;">^></span></td>
                //   <td id="right_${i + 1
                //                   }" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^${rightSignatureList[i]?.RowNo
                //                   }_</span>${rightSignatureList[i]
                //                     ? rightSignatureList[i].firstName +
                //                     " " +
                //                     rightSignatureList[i].lastName
                //                     : ""
                //                   }<span style="color: white;">^></span></td>

                //   </tr>`;
                //               }

                //               htmlContentForSignatories += "</table>";
                //               htmlContentForSignatories += "</div>";

                //               return htmlContentForSignatories;
                //             })()}`,
                //         });
                //       }
                //     } else {
                pdfDataArray.push(currentArray);
                currentArray = [
                  {
                    textbox: `<div style="padding-left: 40px; padding-right: 40px; color:${BrandColor}; font-size: ${fontSizeHeading}; font-family:${fontFamily};" >TERMS & CONDITIONS<br>
                    <hr style="padding-left: 40px; padding-right: 40px; color: black;"></hr></div>
                      <div style="padding-left: 40px; padding-right: 40px;">${TnCHtmlContent}</div><br>
            ${(() => {
                        htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 30px; page-break-inside: avoid; break-inside: avoid;'>`
                        {/* "<div style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px;'>"; */ }
                        htmlContentForSignatories += "<table style='width: 100%;'>";

                        for (let i = 0; i < loopCount; i++) {
                          //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                          //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                          htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                            }" style="padding-top: 50px;width:50%; font-family:${fontFamily};font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureList[i]?.RowNo
                            }_</span>${leftSignatureList[i]
                              ? leftSignatureList[i].firstName +
                              " " +
                              leftSignatureList[i].lastName
                              : ""
                            }<span style="color: white;">^></span></td>
              <td id="right_${i + 1
                            }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in;text-align:right"><span style="color: white;"><^${rightSignatureList[i]?.RowNo
                            }_</span>${rightSignatureList[i]
                              ? rightSignatureList[i].firstName +
                              " " +
                              rightSignatureList[i].lastName
                              : ""
                            }<span style="color: white;">^></span></td>

              </tr>`;
                        }
                        if (organisationData.otherInformation[0].signatureImageUrl !== null && organisationData.otherInformation[0].signatureImageUrl !== undefined && organisationData.otherInformation[0].signatureImageUrl !== "") {
                          htmlContentForSignatories += `
  <tr style='width:100%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left: 45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px; width:130px;"></div>
       <div style="margin-bottom: 20px;margin-top: 30px;">${organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;
                        } else {
                          for (let i = 0; i < Math.max(leftSignatureOfficerList.length); i++) {
                            //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                            //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                            htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                              }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size: font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureOfficerList[i]?.RowNo
                              }_</span>${leftSignatureOfficerList[i]
                                ? leftSignatureOfficerList[i].firstName +
                                " " +
                                leftSignatureOfficerList[i].lastName
                                : ""
                              }<span style="color: white;">^></span></td>
              

              </tr>`;
                          }
                        }
                        htmlContentForSignatories += "</table>";
                        htmlContentForSignatories += "</div>";

                        return htmlContentForSignatories;
                      })()}`,

                  },
                ];
                // }
              } else if (
                TnCPdf !== null ||
                TnCHtmlContent === null
              ) {
                pdfDataArray.push(currentArray);
                currentArray = [];
                currentArray.push({
                  ["awsLink"]: TnCPdf,

                });


                // let rightSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 1)
                // let leftSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 2)

                let rightSignatureList = contractSignatoriesList.filter(
                  (x) => x.signaturePositionID === 1 && x.officerType === null
                );
                let leftSignatureList = contractSignatoriesList.filter(
                  (x) => x.signaturePositionID === 2 && x.officerType === null
                );
                let leftSignatureOfficerList = contractSignatoriesList.filter(
                  (x) => x.signaturePositionID === 2
                );

                let htmlContentForSignatories = ''
                let loopCount = Math.max(
                  rightSignatureList.length,
                  leftSignatureList.length
                );


                htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px; page-break-inside: avoid; break-inside: avoid;'>`
                {/* "<div style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px;'>"; */ }
                htmlContentForSignatories += "<table style='width: 100%;'>";

                for (let i = 0; i < loopCount; i++) {
                  //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                  //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                  htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                    }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureList[i]?.RowNo
                    }_</span>${leftSignatureList[i]
                      ? leftSignatureList[i].firstName +
                      " " +
                      leftSignatureList[i].lastName
                      : ""
                    }<span style="color: white;">^></span></td>
              <td id="right_${i + 1
                    }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in;text-align:right"><span style="color: white;"><^${rightSignatureList[i]?.RowNo
                    }_</span>${rightSignatureList[i]
                      ? rightSignatureList[i].firstName +
                      " " +
                      rightSignatureList[i].lastName
                      : ""
                    }<span style="color: white;">^></span></td>

              </tr>`;
                }
                if (organisationData.otherInformation[0].signatureImageUrl !== null && organisationData.otherInformation[0].signatureImageUrl !== undefined && organisationData.otherInformation[0].signatureImageUrl !== "") {
                  htmlContentForSignatories += `
  <tr style='width:100%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left: 45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px; width:130px;"></div>
       <div style="margin-bottom: 20px;margin-top: 30px;">${organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;
                } else {
                  for (let i = 0; i < Math.max(leftSignatureOfficerList.length); i++) {
                    //                <td id="left_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:left"><span style="color: white;"><^</span>${leftSignatureList[i] ? leftSignatureList[i].firstName + ' ' + leftSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                    //  <td id="right_${i + 1}" style="padding-top: 50px;width:50%;font-size: ${fontSize};text-align:right"><span style="color: white;"><^</span>${rightSignatureList[i] ? rightSignatureList[i].firstName + ' ' + rightSignatureList[i].lastName : ''}<span style="color: white;">^></span></td>
                    htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
              <td id="left_${i + 1
                      }" style="padding-top: 50px;width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left"><span style="color: white;"><^${leftSignatureOfficerList[i]?.RowNo
                      }_</span>${leftSignatureOfficerList[i]
                        ? leftSignatureOfficerList[i].firstName +
                        " " +
                        leftSignatureOfficerList[i].lastName
                        : ""
                      }<span style="color: white;">^></span></td>
              

              </tr>`;
                  }
                }
                htmlContentForSignatories += "</table>";
                htmlContentForSignatories += "</div>";


                pdfDataArray.push(currentArray);
                currentArray = [
                  {
                    textbox: `${htmlContentForSignatories}`,
                  },
                ];

              }
            }
            break;
        }
        prevElementType = element.templateElementTypeID;
      });
      if (currentArray.length > 0) {
        pdfDataArray.push(currentArray);
      }
      setGeneratePdfData(pdfDataArray);
    } else {
      console.error("Error: No template element list found.");
    }
  }, [templateElementList]);

  //Send data to node js api For Generate Single Pdf .
  const sendDataToBackend = async (
    generatePdfData,
    index,
    email,
    phone,
    fullAddress,
    BrandColor,
    webSite
  ) => {
    const postData = {
      userId: common.userKeyID,
      email: email,
      mobile: phone,
      fullAddress: fullAddress,
      genratedPdfData: generatePdfData,
      sequence: index + 1,
      color: BrandColor,
      webSite: webSite,
      BrandLogo: BrandLogo,
      fontSizeContent: fontSize,
      fontFamily: fontFamily
    };
    try {
      const response = await fetch(generatePdfUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'X-Aws-Pdf-Path': awsPdfPath,
        },
        body: JSON.stringify(postData),
      });
      const responseData = await response.json();
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  //Generate the merge pdf 
  const generateMergePdfUrl = () => {
    fetch(mergePdfApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: common.userKeyID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const pdfUrl = data.s3Url;
          setMergePdfUrl(pdfUrl);

          const ApiRequest_ParamsObj = {
            moduleName: "Quotation",
            contractKeyID: contractKeyID,
            contractPDFUrl: pdfUrl,
            ContractSignatoryKeyID: ContractSignatoryKeyID
          };

          GetSendToSignEasyData(ApiRequest_ParamsObj);
          // Assuming there's an iframe with id "pdfViewer", uncomment this line if needed
          // document.getElementById("pdfViewer").src = pdfUrl;
        } else {
          console.error("Error:", data.message);
          generatePdf();
        }
      })
      .catch((error) => {
        console.error("Error fetching merged PDF:", error);
        generatePdf();
      });
  };

  //Generate Pdf For send the 
  const generatePdf = async () => {
    if (
      generatePdfData.length === 0 ||
      generatePdfData === null ||
      generatePdfData === undefined
    ) {
      return;
    }
    if (generatePdfData) {
      try {
        const promises = generatePdfData.map((data, index) =>
          sendDataToBackend(
            data,
            index,
            organisationData.otherInformation[0].emailID,
            organisationData.otherInformation[0].phoneNo,
            organisationData.otherInformation[0].fullAddress,
            BrandColor,
            webSite
          )
        );
        await Promise.all(promises);
        // All API calls have completed, now generate the merge PDF URL
        setSvgShow(true);
        generateMergePdfUrl();
      } catch (error) {
        console.error("Error generating PDFs:", error);
      }
    }
  };
  const GetVariableValuesForTnCTemplateData = async (ClientID, HtmlContent, variablesWithValuesList) => {
    // const VariableData = await GetVariableValuesForTnCTemplate(
    //   ClientID,
    //   common.userKeyID,
    //   common.organisationKeyID
    // );

    // Function to escape special characters in a string to be used in a regular expression
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const replaceVariables = (htmlContent, variablesWithValuesList) => {
      let replacedHtmlContent = htmlContent;
      variablesWithValuesList.forEach(({ variableName, variableValue }) => {
        const regex = new RegExp(escapeRegExp(variableName), "g");
        if (variableValue !== null) {
          replacedHtmlContent = replacedHtmlContent?.replace(
            regex,
            variableValue
          );
        }
      });
      return replacedHtmlContent;
    };

    const htmlContent = replaceVariables(
      HtmlContent,
      variablesWithValuesList
    );
    setTnCHtmlContent(htmlContent)

  };

  useEffect(() => {
    if (
      generatePdfData.length !== 0 &&
      generatePdfData !== null &&
      generatePdfData !== undefined &&
      organisationData.length !== 0
    ) {
      generatePdf();
    }
  }, [generatePdfData, organisationData]);
  //Get Template Model Data 
  const GetTemplateModalData = async (
    TemplateKeyID,
    clientID,
    ModuleKeyID,
    contractSignatoriesList,
    RecurringPricingInfo,
    OneOffPricingInfo,
    paymentFrequencyID,
    packageData
  ) => {
    try {

      const data = await GetTemplateModelData({
        TemplateKeyID: TemplateKeyID,
        clientID: clientID || null,
        TemplateTypeID: 2,
        ModuleKeyID: ModuleKeyID,
      });
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          function replaceVariables(array, signatoriesList) {
            // Mapping object for variable names to property names
            const variableMap = {
              //Individual Variables :
              "Client.FirstName": ["firstName"],
              "Client.LastName": ["lastName"],
              "Client.Name": ["firstName", "lastName"],
              //Sole Trader Variables :
              "Client.SoleTrader.FirstName": ["firstName"],
              "Client.SoleTrader.LastName": ["lastName"],
              //'Client.SoleTrader.Name': ['soleTraderName'],

              //Partnership Variables :
              "Client.Partner.Name": ["firstName", "lastName"],
              "Client.Partner.FirstName": ["firstName"],
              "Client.Partner.LastName": ["lastName"],

              //LLP / Ltd Variable :
              "Client.Officer.Name": ["firstName", "lastName"],
              "Client.Officer.FirstName": ["firstName"],
              "Client.Officer.LastName": ["lastName"],
            };

            const replacedArray = array.map((item) => {
              if (item.htmlContent) {
                let replacedContent = item.htmlContent;

                // Iterate over each variable and replace it in the content
                for (const variable in variableMap) {
                  const propertyNames = variableMap[variable];
                  const replacement = signatoriesList
                    .map((signatory) =>
                      propertyNames.map((prop) => signatory[prop]).join(" ")
                    )
                    .join(", ");
                  const regex = new RegExp(
                    "\\$" + variable.replace(/\./g, "\\.") + "\\$",
                    "g"
                  );
                  replacedContent = replacedContent.replace(regex, replacement);
                }

                // Update the htmlContent in the item
                return { ...item, htmlContent: replacedContent };
              } else {
                return item;
              }
            });

            return replacedArray;
          }

          // Call the function with your array and contract signatories list as arguments
          const newArray = replaceVariables(
            ModelData.templateElementList,
            contractSignatoriesList
          );
          const pdfObject = {
            ttetMapID: null, //Template's Template Element Type Mapping Id
            templateElementTypeID: 11,
            headings: null,
            shortDesc: null,
            htmlContent: null,
          };
          const updatedTemplateElementList = [...newArray, pdfObject];
          const Logo = ModelData.templateElementListWithRequiredData.organisationLogoUrl
          setBrandLogo(Logo)
          let clientNameOnFirstPage = ModelData.templateElementListWithRequiredData.clientNameOnFirstPage == null ? "" : ModelData.templateElementListWithRequiredData.clientNameOnFirstPage
          const firstPageHTML = `
         <div style="margin-top: 300px;>
     <div style="display: flex; justify-content: center; align-items: center; text-align: center;margin-top:${Logo ? `-100px` : "0px"}">
    ${Logo ? `
      <div style="display: inline-block; text-align: center; width: 700px; height: 150px; background-image: url('${Logo}'); background-size: contain; background-repeat: no-repeat; background-position: center;">
      </div>
    ` : ''}

  <p style="text-align: center; color: #00BFFF; page-break-after: always;">
    <span style="color: #00BFFF; margin-top: 15px; font-size: 50px;" class="OrgBrandColor">Engagement Letter For</span><br><br>
    <span style="color: black; margin-top: 15px; font-size: 25px;">${clientNameOnFirstPage}</span><br>
  </p>
    </div>
    </div>
  `;

          let isAddedFirstPage = updatedTemplateElementList.some(item => item.templateElementTypeID === 10);
          let AddFirstPageHtmlContent = [...updatedTemplateElementList]
          if (!isAddedFirstPage) {

            const firstPageElement = {
              "ttetMapID": null,
              "templateElementTypeID": 10,
              "templateElementTypeName": "First Page",
              "serialNo": null,
              "headings": "",
              "shortDesc": "",
              "htmlContent": firstPageHTML
            };
            AddFirstPageHtmlContent.splice(0, 0, firstPageElement);
          }
          const GetCommonFontFamily = AddFirstPageHtmlContent.find(item => item.templateElementTypeName === "Text Block").htmlContent
          const { uniqueFontFamilies, // Unique font families
            largestFontSize, // Largest font size
            smallestFontSize } = getFontStylesFromHtml(GetCommonFontFamily)
          const ReplaceVariableArray = replaceTemplatePricingVariables(
            AddFirstPageHtmlContent,
            RecurringPricingInfo,
            OneOffPricingInfo,
            paymentFrequencyID,
            3,
            packageData
          );
          setTemplateElementList(ReplaceVariableArray);
          setBrandColor(
            ModelData.templateElementListWithRequiredData.brandColor
          );
          setFontFamily(uniqueFontFamilies)
          setFontSize(smallestFontSize)
          setWebSite(ModelData.templateElementListWithRequiredData.website);
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let count = 0;
  const GenerateContractFromProposalData = async () => {
    if (count !== 0) {
      return false;
    }
    count = count + 1;
    setLoader(true);
    try {
      // const SelectedTemplateString = ReactDOMServer.renderToString(SelectedTemplate);
      const data = await GenerateContractFromProposal({
        quoteKeyID: quoteKeyID,
        serviceChargeTypeID: ServiceChargeTypeID, //1: Recurring, 2:OneOff
        servicePackageKeyID: ServicePackageKeyID || null,
        acceptedServiceHtmlContent: null,
        ContractSignatoryKeyID: ContractSignatoryKeyID,
        action: "Accepted", //Accepted/Declined
      });
      if (data) {
        setLoader(false);
        if (data?.data?.statusCode === 200) {
          setSvgShow(true);
          const GetContractKeyID = data?.data?.responseData?.data;
          const SignedFileID = data?.data?.responseData?.signedFileID;
          setContractKeyID(GetContractKeyID);

          if (Number(SignedFileID) > 0) {
            const ApiRequest_ParamsObj = {
              moduleName: "Quotation",
              contractKeyID: GetContractKeyID,
              contractPDFUrl: null,
              ContractSignatoryKeyID: ContractSignatoryKeyID
            };
            GetSendToSignEasyData(ApiRequest_ParamsObj);
          } else {
            GetContractDetailsForSignEasyData(GetContractKeyID);
          }
        } else {
          setLoader(false);
          setErrorMessage(data?.response?.data?.errorMessage);
          // GetContractDetailsForSignEasyData("510E5FC7-F107-4D6F-97F0-FD7307F29E4A")
        }
      } else {
        setLoader(false);
        setErrorMessage(data?.response?.data?.errorMessage);
        // GetContractDetailsForSignEasyData("510E5FC7-F107-4D6F-97F0-FD7307F29E4A")
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //GetContract Details For Sign Easy Data
  const GetContractDetailsForSignEasyData = async (GetContractKeyID) => {
    if (!GetContractKeyID) {
      return;
    }

    try {
      const data = await GetContractDetailsForSignEasyList(GetContractKeyID);

      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          const variablesWithValuesList = data?.data?.responseData?.variablesWithValuesList;
          await GetVariableValuesForTnCTemplateData(ModelData.clientID, ModelData.tnCTemplateContent, variablesWithValuesList)
          const packageData = data?.data?.responseData?.packageList;
          const finalQuotationAmountList =
            data?.data?.responseData?.finalContractAmountList;
          setServiceDescriptionList(ModelData.serviceDescriptionList);
          setShowDiscountLine(ModelData.showDiscountLine);
          // setShowDiscountLine(true)
          // setTnCHtmlContent(ModelData.tnCTemplateContent)
          setTnCPdf(ModelData.tnCTemplatePdfUrl)

          setFeeTypeId(ModelData.feesInQuoteID);
          setRecurringServiceCatList(ModelData.recurringServiceCatList);
          setOneOffServiceCatList(ModelData.oneOffServiceCatList);
          const RecurringData = finalQuotationAmountList.filter(item => item.serviceChargeTypeID === 1);
          const OneOffData = finalQuotationAmountList.filter(item => item.serviceChargeTypeID === 2);
          let OneOffPricingInfo = {
            OriginalPrice: "",
            DefaultDiscount: "",
            DiscountedPrice: "",
            VATPrice: "",
            NetTotal: "",
            Discount: "",
            GrandTotal: "",
            DiscountedTotal: ""
          }
          let RecurringPricingInfo = {
            OriginalPrice: "",
            DefaultDiscount: "",
            DiscountedPriceL: "",
            VATPrice: "",
            NetTotal: "",
            Discount: "",
            GrandTotal: "",
            DiscountedTotal: ""
          }
          if (RecurringData.length > 0) {
            const recurringItem = RecurringData[0]; // Access the first item in the filtered array

            RecurringPricingInfo = {
              OriginalPrice: recurringItem.netTotal,
              DefaultDiscount: recurringItem.discountPercentageWithAllDecimal,
              DiscountedPrice: recurringItem.discountedTotal,
              VATPrice: recurringItem.vat,
              NetTotal: recurringItem.netTotal,
              Discount: recurringItem.discounted,
              GrandTotal: recurringItem.grandTotal,
              DiscountedTotal: recurringItem.discountedTotal,
            }
          }

          if (OneOffData.length > 0) {
            const oneOffItem = OneOffData[0]; // Access the first item in the filtered array

            OneOffPricingInfo = {
              OriginalPrice: oneOffItem.netTotal,
              DefaultDiscount: oneOffItem.discountPercentageWithAllDecimal,
              DiscountedPrice: oneOffItem.discountedTotal,
              VATPrice: oneOffItem.vat,
              NetTotal: oneOffItem.netTotal,
              Discount: oneOffItem.discounted,
              GrandTotal: oneOffItem.grandTotal,
              DiscountedTotal: oneOffItem.discountedTotal,
            }
          }



          setFinalQuotationAmountList(finalQuotationAmountList);
          const contractSignatoryRowNo = ModelData.contractSignatoriesList.map(
            (item, index) => ({
              ...item,
              RowNo: index + 1,
            })
          );

          // setContractSignatoriesList(ModelData.contractSignatoriesList)
          setContractSignatoriesList(contractSignatoryRowNo);
          setPackageList(packageData);
          // setPaymentFrequency(2)
          setAdditionalInformation(ModelData.additionalInformationList);
          setPaymentFrequency(ModelData.paymentFrequencyID);
          setQuoteInfo({
            ...quoteInfo,

            templateKeyID: ModelData.templateKeyID,
            clientID: ModelData.clientID,
          });
          const chargeTypeId1Array = finalQuotationAmountList.filter(
            (obj) => obj.serviceChargeTypeID === 1
          );
          const chargeTypeId2Array = finalQuotationAmountList.filter(
            (obj) => obj.serviceChargeTypeID === 2
          );

          // setPackageList(packageData);
          const updatedOtherInformation = [
            {
              emailID: ModelData.organisationDetails.emailID,
              phoneNo: `${ModelData.organisationDetails.countryCode} ${ModelData.organisationDetails.phoneNo}`,
              fullAddress: ModelData.organisationDetails.tradingAddress,
              signatureImageUrl: ModelData.organisationDetails.signatureImageUrl,
              signatoryName: ModelData.organisationDetails?.signatoryName || ""

            },
          ];

          // // Set updated organization data
          setOrganisationData({
            otherInformation: updatedOtherInformation,
          });
          setChargeTypeId1Array(chargeTypeId1Array);
          setChargeTypeId2Array(chargeTypeId2Array);
          GetTemplateModalData(
            ModelData.templateKeyID,
            ModelData.clientID,
            GetContractKeyID,
            ModelData.contractSignatoriesList,
            RecurringPricingInfo,
            OneOffPricingInfo,
            ModelData.paymentFrequencyID,
            packageData
          );
        }
      } else {
        // setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // send To Sign Easy Data
  const GetSendToSignEasyData = async (params) => {
    try {
      const data = await GetSendToSignEasy(params);
      if (data?.data?.statusCode === 200) {
        setLoader(false);
        let acceptedDeclinedByEmailID = data?.data?.responseData?.acceptedDeclinedByEmailID
        const signingUrls =
          data?.data?.responseData?.sentMailResponse;
        let SignEasyUrlForEmail = signingUrls.find(item => item.email == acceptedDeclinedByEmailID)
        setSvgShow(false);
        if (SignEasyUrlForEmail.signingUrl) {
          window.open(SignEasyUrlForEmail.signingUrl, "_self");
        }
      } else {
        setErrorMessage(data?.data?.errorMessage);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <>
      {/* {
        MergePdfUrl && (
          <iframe
            title="PDF Viewer"
            src={MergePdfUrl}
            width="100%"
            height="600px"
          ></iframe>
        )
      } */}
      {/* {
        SvgShow ? */}
      <GeneratePdfLoaderPage message={errorMessage} />
      {/* :

          <React.Fragment>
            <div className="authentication-bg d-flex align-items-center pb-0 vh-100">
              <div className="content-center w-100">
                <div className="container">
                  <Card className="mo-mt-2">
                    <CardBody>
                      <Row className="align-items-center">
                        <Col lg="6" className="mx-auto">
                          <h4 className="mb-4">
                            {SuccessMessage ? SuccessMessage : errorMessage}
                          </h4> */}
      {/* {
                        MergePdfUrl && (
                          <iframe
                            title="PDF Viewer"
                            src={MergePdfUrl}
                            width="100%"
                            height="600px"
                          ></iframe>
                        )
                      } */}
      {/* </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </React.Fragment >

      } */}
    </>
  );
}

export default AcceptInvitation;
