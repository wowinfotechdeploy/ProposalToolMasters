import React, { useContext, useEffect, useRef, useState } from "react";
import { ElementType, statusID } from "../Middleware/enums";
import { useSelector } from "react-redux";
import { GetOrganisationInformationModel } from "../redux/Services/Setting/Organisation";
import Select from "react-select";
import Utils from "../Middleware/Utils";
import { ERROR_MESSAGES } from "./GlobalMessage";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import { generatePdfUrl, mergePdfApiUrl } from "../Base-Url/Base_Url";
import PdfViewer from "./PdfViewers";
import PaymentGatewayModel from "./PaymentGatewayModel";
import ViewPlan from "./ViewPlan";
export default function PreviewComponentPdf(props) {
  const moduleNameForSaveAsDraft = "Preview";
  const statusIDForSaveAsDraft = 1;
  const statusIDForSendProposal = 2;
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setISModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [heading, setHeading] = useState("");
  let count = 0;
  const statusIDForSkipped = 3;
  const [fullAddress, setFullAddress] = useState("");
  const [webSite, setWebSite] = useState("");
  const { setLoader, proposalName, EngagementName, userAccessData, isMobile, replaceUrlInHtml, activeOrganizationSubscriptionPlan } =
    useContext(AuthContextProvider);
  const [totalOnePackageValue, setTotalOnePackageValue] = useState(0);
  const [totalTwoPackageValue, setTotalTwoPackageValue] = useState(0);
  const [totalThreePackageValue, setTotalThreePackageValue] = useState(0);
  const [totalOnePackageValueOneOff, setTotalOnePackageValueOneOff] =
    useState(0);
  const [totalTwoPackageValueOneOff, setTotalTwoPackageValueOneOff] =
    useState(0);
  const [totalThreePackageValueOneOff, setTotalThreePackageValueOneOff] =
    useState(0);

  const handleFormate = (selectedOption) => {
    props.setProposalObject({
      ...props.ProposalObject,
      ProposalFormate: selectedOption.value === 1 ? 1 : 2,
    });
    props.setRequireMessage(false);
  };

  const ProposalFormatValue = Utils?.PreviewSelection.find(
    (item) => props?.ProposalObject?.ProposalFormate == item.value
  );

  useEffect(() => {
    // Function to compute the sum of package values
    const computeTotalPackageValues = () => {
      let totalOne = 0;
      let totalTwo = 0;
      let totalThree = 0;

      props?.selectedRecurringServiceList?.forEach((category) => {
        category.servicesList.forEach((service) => {
          // Check if the value is not null before adding
          if (service.packageOneValue !== null)
            totalOne += service.packageOneValue;
          if (service.packageTwoValue !== null)
            totalTwo += service.packageTwoValue;
          if (service.packageThreeValue !== null)
            totalThree += service.packageThreeValue;
        });
      });

      // Update state with the computed totals
      setTotalOnePackageValue(totalOne);
      setTotalTwoPackageValue(totalTwo);
      setTotalThreePackageValue(totalThree);
    };

    // Call the function when component mounts
    computeTotalPackageValues();
  }, []);

  useEffect(() => {
    // Function to compute the sum of package values
    const computeTotalPackageValues = () => {
      let totalOne = 0;
      let totalTwo = 0;
      let totalThree = 0;

      props?.selectedOneOffServiceList?.forEach((category) => {
        category.servicesList.forEach((service) => {
          // Check if the value is not null before adding
          if (service.packageOneValue !== null)
            totalOne += service.packageOneValue;
          if (service.packageTwoValue !== null)
            totalTwo += service.packageTwoValue;
          if (service.packageThreeValue !== null)
            totalThree += service.packageThreeValue;
        });
      });

      // Update state with the computed totals
      setTotalOnePackageValueOneOff(totalOne);
      setTotalTwoPackageValueOneOff(totalTwo);
      setTotalThreePackageValueOneOff(totalThree);
    };

    // Call the function when component mounts
    computeTotalPackageValues();
  }, []);

  useEffect(() => {
    if (
      props.organisationData.otherInformation &&
      props.organisationData.otherInformation
    ) {
      const { emailID, phoneNo, fullAddress, website } =
        props.organisationData.otherInformation[0];

      // setOfficersList(props.organisationData.officersList)
      setEmail(emailID);
      setPhone(phoneNo);
      setWebSite(website);
      setFullAddress(fullAddress);
    }
  }, [props.organisationData]);
  const pdfRef = useRef(null);
  const [generatePdfData, setGeneratePdfData] = useState([]);
  const PdfLength = generatePdfData.length;
  const common = useSelector((state) => state.Storage);
  const newColorCode = props.BrandColor; //"#FF5733";
  const BrandLogo = props.Logo; //"#FF5733";
  const [MergePdfUrl, setMergePdfUrl] = useState("");
  const fontSizeContent = props?.fontSize;
  // const fontSizeContent = "0.20in";
  const fontSizeHeading = "0.2in";
  const fontFamily = props?.fontFamily;
  const CommonFontFamily = "Roboto Mono;sans-serif";
  const imgTag = `<img src="${props.Logo}" alt="Logo" style="display: none; margin: 0 auto 15px;">`;
  const getPaymentFrequencyLabel = () => {
    const Payment_Frequency = {
      Yearly: 1,
      HalfYearly: 2,
      Quarterly: 3,
      Monthly: 4,
    };

    const frequencyValue =
      props.ProposalObject?.Payment_Frequency ||
      props.engagementObj?.Payment_Frequency;
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
  useEffect(() => {
    const HeadingValue =
      props.ProposalObject?.moduleName || props.engagementObj?.moduleName;
    setHeading(HeadingValue);
  }, []);

  if (MergePdfUrl) {
  }
  const sendDataToBackend = async (
    generatePdfData,
    index,
    email,
    phone,
    fullAddress,
    color,
    BrandLogo
  ) => {
    const postData = {
      userId: common.userKeyID,
      email: email,
      mobile: phone,
      fullAddress: fullAddress,
      webSite: webSite,
      headingforpage: heading,
      genratedPdfData: generatePdfData,
      sequence: index + 1,
      lengthPdf: PdfLength,
      color: color,
      BrandLogo: BrandLogo,
      fontSizeContent: fontSizeContent,
      fontFamily: fontFamily,

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
      // if (responseData.success && responseData.AllPdf && Array.isArray(responseData.AllPdf)) {
      //   const urls = responseData.AllPdf.map(pdf => pdf.url);
      //   setSinglePdf(urls);

      // } else {
      //   console.error('PDF creation and saving failed:', response.message);
      // }
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const generateMergePdfUrl = () => {
    if (count == 0) {
      return;
    }
    setLoader(true);
    fetch(mergePdfApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId: common.userKeyID,
        moduleName: props.moduleName
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const pdfUrl = data.s3Url;
          setMergePdfUrl(pdfUrl);
          props.setMergePdfUrl(pdfUrl);
          setLoader(false);
          if (pdfRef.current) {
            pdfRef.current.src = pdfUrl;
          }
          // document.getElementById("pdfViewer").src = pdfUrl;
        } else {
          setLoader(false);
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error fetching merged PDF:", error);
      });
  };
  const generatePdf = async () => {
    count = +1;
    setLoader(true);
    if (generatePdfData) {
      try {
        const promises = generatePdfData.map((data, index) =>
          sendDataToBackend(
            data,
            index,
            email,
            phone,
            fullAddress,
            newColorCode,
            BrandLogo
          )
        );
        await Promise.all(promises);
        // setLoader(false);
        generateMergePdfUrl();
      } catch (error) {
        setLoader(false);
        console.error("Error generating PDFs:", error);
      }
    }
  };
  useEffect(() => {

    if (generatePdfData.length !== 0) {
      generatePdf();
    }
  }, [generatePdfData]);

  function getPackageName(id, name) {
    const packages = props.lastPaymentFrequencyAndDiscountedPriceForPreview;
    let packageName = "";

    switch (id) {
      case packages?.PackageOneNetValue?.servicePackageID:
      case packages.PackageTwoNetValue?.servicePackageID:
      case packages?.PackageThreeNetValue?.servicePackageID:
        packageName = name;
        break;
      default:
        return name;
    }

    if (!packageName) return "";
    if (packages?.PackageOneNetValue?.servicePackageID === undefined) {
      return name
    } else {


      return packageName
        .split(",")
        .map((pkgName) => pkgName
        )
        // .map((pkgName) =>
        //   pkgName.length > 10 ? pkgName.substring(0, 10) + "..." : pkgName
        // )
        .join(", ");
    }
  }


  function changeSpanColor(htmlContent, newColorCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const elements = doc.getElementsByClassName("OrgnewColorCode");


    // Check if any elements are found with the class name 'OrgnewColorCode'
    if (elements.length > 0) {
      // Loop through each element and change its color
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = newColorCode;
      }
    } else {
      return htmlContent
    }

    return doc.body.innerHTML;
  }

  useEffect(() => {
    if (props.templateElementList) {
      const pdfDataArray = [];
      let currentArray = [];
      let pricingTableAdded = false; // Flag to ensure only one pricing table is added
      let prevElementType = null;

      props.templateElementList.forEach((element) => {

        switch (element.templateElementTypeID) {
          case ElementType.HEADING:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: `<div style="padding-left: 40px; padding-top: 40px; padding-right: 40px; font-size: ${fontSizeHeading}; color:${newColorCode}; font-family:${fontFamily};">${element.headings} <br>
                         <hr style="padding-left: 40px; padding-right: 40px; color: black;"></hr></div>`,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `<div style="padding-left: 40px; padding-right: 40px; color:${newColorCode}; font-size: ${fontSizeHeading}; font-family:${fontFamily};">${element.headings} <br
                >
                <hr style="padding-left: 40px; padding-right: 40px; color: black;"></hr></div>`,
                },
              ];
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
            console.log(currentArray, "HTMLCONTENT")
            break;
          case ElementType.SIGNATURE_BLOCK:
            const contractSignatoryRowNo = props.contractSignatoriesList.map(
              (item, index) => ({
                ...item,
                RowNo: index + 1,
              })
            );
            const contractSignatoryRowNoForOfficer = props.organisationData?.officersList !== undefined && props.organisationData?.officersList.filter(item => item.isAuthorisedSignatory).map(
              (item, index) => ({
                ...item,
                RowNo: Number(contractSignatoryRowNo.length) + index + 1,
              })
            );
            // let rightSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 1)
            // let leftSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 2)

            let rightSignatureList = contractSignatoryRowNo.filter(
              (x) => x.signaturePositionID === 1
            );
            let leftSignatureList = contractSignatoryRowNo.filter(
              (x) => x.signaturePositionID === 2
            );

            let htmlContentForSignatories = "";
            let loopCount = Math.max(
              rightSignatureList.length,
              leftSignatureList.length
            );


            htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px; page-break-inside: avoid; break-inside: avoid;'>`;
            htmlContentForSignatories += "<table style='width: 100%;'>";

            for (let i = 0; i < loopCount; i++) {
              htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                }"style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${leftSignatureList[i]?.RowNo}_</span>${leftSignatureList[i]
                  ? leftSignatureList[i].firstName +
                  " " +
                  leftSignatureList[i].lastName
                  : ""
                }<span style="color: white;">^></span>
    </td>
    <td id="right_${i + 1
                }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:right">
      <span style="color: white;"><^${rightSignatureList[i]?.RowNo}_</span>${rightSignatureList[i]
                  ? rightSignatureList[i].firstName +
                  " " +
                  rightSignatureList[i].lastName
                  : ""
                }<span style="color: white;">^></span>
    </td>
  </tr>`;
            }
            if (props.organisationData.otherInformation[0].signatureImageUrl !== null) {
              htmlContentForSignatories += `
  <tr style='width:50%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left: 45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${props.organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px; width:130px;"></div>
      <div style="margin-bottom: 20px;margin-top: 30px;">${props.organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;
            } else {
              for (let i = 0; i < Math.max(contractSignatoryRowNoForOfficer?.length); i++) {
                htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                  }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${contractSignatoryRowNoForOfficer[i]?.RowNo}_</span>${contractSignatoryRowNoForOfficer[i]
                    ? contractSignatoryRowNoForOfficer[i].firstName +
                    " " +
                    contractSignatoryRowNoForOfficer[i].lastName
                    : ""
                  }<span style="color: white;">^></span>
    </td>
   
  </tr>`;
              }
            }
            htmlContentForSignatories += "</table>";
            htmlContentForSignatories += "</div>";

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
          case ElementType.SERVICE_DESCRIPTION:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              currentArray.push({
                textbox: `${imgTag}<div style="padding-left: 40px; padding-right: 40px;">
                ${props?.selectedRecurringServiceList.length !== 0 ?
                    `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                     Ongoing/Recurring Services
                    </p>`
                    : ""}
                   ${props?.selectedRecurringServiceList
                    .map(
                      (serviceCat) => `
                      <div>
                          <p style="color: black; font-weight: bold;font-family:${fontFamily}; font-size: ${fontSizeHeading};">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                          .map(
                            (subService) => `
                              <p style=" color:black;font-family:${fontFamily}; font-size: ${fontSizeContent};">
                                  ${subService.serviceName}
                              </p>
                              <p style=" color:black;">
                                ${subService.serviceDescription === null ||
                                subService.serviceDescription === undefined ||
                                subService.serviceDescription === ""
                                ? ""
                                : subService.serviceDescription
                              }
                            </p>
                          `
                          )
                          .join("")}
                      </div>
                  `
                    )
                    .join("")}
                  
                 ${props?.selectedOneOffServiceList.length !== 0 ?
                    `<p style="font-family:${fontFamily}; color: ${newColorCode};font-size: ${fontSizeHeading}; font-weight: bold;">
                          One-Off/Ad hoc Services
                        </p>`
                    : ""}
                   ${props?.selectedOneOffServiceList
                    .map(
                      (serviceCat) => `
                      <div >
                          <p style=" color: black; font-family:${fontFamily}; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                          .map(
                            (subService) => `
                             <p style=" color:black; font-family:${fontFamily}; font-size: ${fontSizeContent};">
                                  ${subService.serviceName}
                              </p>
                              <p style=" color:black;">
                                ${subService.serviceDescription === null ||
                                subService.serviceDescription === undefined ||
                                subService.serviceDescription === ""
                                ? ""
                                : subService.serviceDescription
                              }
                            </p>
                          `
                          )
                          .join("")}
                      </div>
                  `
                    )
                    .join("")}
                </div>
                `,
              });
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `
                ${imgTag}
                <div style="padding-left: 40px; padding-right: 40px;">
              
                ${props?.selectedRecurringServiceList.length !== 0 ?
                      `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                     Ongoing/Recurring Services
                    </p>`
                      : ""}
              ${props?.selectedRecurringServiceList
                      .map(
                        (serviceCat) => `
                    <div>
                        <p style=" color: black;font-family:${fontFamily}; font-size: ${fontSizeHeading}; font-weight: bold;">
                            ${serviceCat.serviceCatName}
                        </p>
                        <hr style="color: gray; margin-top: -15px;">
                        ${serviceCat.servicesList
                            .map(
                              (subService) => `
                            <p style=" color:black;font-family:${fontFamily}; font-size: ${fontSizeContent};">
                                ${subService.serviceName}
                            </p>
                            <p style=" color:black;">
                               ${subService.serviceDescription === null ||
                                  subService.serviceDescription === undefined ||
                                  subService.serviceDescription === ""
                                  ? ""
                                  : subService.serviceDescription
                                }
                            </p>
                        `
                            )
                            .join("")}
                    </div>
                `
                      )
                      .join("")}
                       ${props?.selectedOneOffServiceList.length !== 0 ?
                      `<p style="font-family:${fontFamily}; color: ${newColorCode};font-size: ${fontSizeHeading}; font-weight: bold;">
                          One-Off/Ad hoc Services
                        </p>`
                      : ""}
                ${props?.selectedOneOffServiceList
                      .map(
                        (serviceCat) => `
                      <div>
                          <p style=" color: black;font-family:${fontFamily}; font-size: ${fontSizeHeading};font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `
                              <p style="color:black;font-family:${fontFamily}; font-size: ${fontSizeContent};">
                                  ${subService.serviceName}
                              </p>
                              <p style=" color:black;">
                                ${subService.serviceDescription === null ||
                                  subService.serviceDescription === undefined ||
                                  subService.serviceDescription === ""
                                  ? ""
                                  : subService.serviceDescription
                                }
                            </p>
                          `
                            )
                            .join("")}
                      </div>
                  `
                      )
                      .join("")}
                </div>
                `,
                },
              ];
            }
            break;
          case ElementType.First_Page:
            const coloredHtmlContent = changeSpanColor(
              element.htmlContent,
              newColorCode
            );
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `
      <div style="
        padding-left: 40px; 
        padding-right: 40px; 
        page-break-after: always;
      ">
        ${coloredHtmlContent}
      </div>
    `,
                },
              ];
            } else {
              pdfDataArray.push(currentArray);
              currentArray = [
                {
                  textbox: `
      <div style="
        padding-left: 40px; 
        padding-right: 40px; 
        page-break-after: always;
      ">
        ${coloredHtmlContent}
      </div>
    `,
                },
              ];
            }
            break;
          case ElementType.STATEMENT_OF_FACTS:
            if (
              prevElementType !== ElementType.PAGE_BREAK &&
              prevElementType !== ElementType.AWS_PDF_LINK
            ) {
              if (props.moduleName === "Quote" && props?.ProposalObject?.selectedProposalTypeValue === 2) {
                currentArray.push({
                  textbox: `
                    ${imgTag}
                    <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};">
                    ${props.StatementOfFact.map(
                    (SelectedPackage) =>
                      `<div style="font-family:${fontFamily};">
                          <p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
                            Package Name:  ${SelectedPackage.servicePackageName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                           ${SelectedPackage.reccuring.length !== 0 ?
                        `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                           Ongoing/Recurring Services
                          </p>`
                        : ""}
                          ${SelectedPackage.reccuring.map(
                          (SelectedServiceCat) =>
                            ` <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${SelectedServiceCat.serviceCategoryName}
                          </p>
                         ${SelectedServiceCat.servicesList
                              .map(
                                (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.gpdList)
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                   <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(pricingDriver.value)
                                          : pricingDriver.driverTypeID === 3
                                            ? pricingDriver.variationName
                                            : pricingDriver.driverTypeID === 4 ?
                                              pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.value) :
                                                pricingDriver.slabFrom + "-" + pricingDriver.slabTo : ""
                                        }</strong>
                            </li>
                              `).join("")}
                          `).join("")}
                          `).join(" ")}
                             ${SelectedPackage.oneOff.length !== 0 ?
                        `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                            One-Off/Ad hoc Services
                          </p>`
                        : ""}
                          ${SelectedPackage.oneOff.map(
                          (SelectedServiceCat) =>
                            ` <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${SelectedServiceCat.serviceCategoryName}
                          </p>
                         ${SelectedServiceCat.servicesList
                              .map(
                                (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.gpdList)
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                    <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(pricingDriver.value)
                                          : pricingDriver.driverTypeID === 3
                                            ? pricingDriver.variationName
                                            : pricingDriver.driverTypeID === 4 ?
                                              pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.value) :
                                                pricingDriver.slabFrom + "-" + pricingDriver.slabTo : ""
                                        }</strong>
                            </li>
                              `).join("")}
                          `).join("")}
                          `).join(" ")}

                            ${SelectedPackage.additionalInformationList?.length > 0 ?
                        `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p>
    <hr style="color: gray; margin-top: -15px;" />` +
                        SelectedPackage.additionalInformationList.filter(item => item.driverTypeID !== 1).map(serviceCat => `
        <div>
            <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4 ? serviceCat.slabTypeID === 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.value)}</strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}-${props.formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>` : serviceCat.driverTypeID === 3 ? `<strong>${serviceCat.variationName}</strong>` : `${serviceCat.driverName}: <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.value)}</strong>`}
            </p>
        </div>
    `).join("") : ""
                      }

                        </div>`
                  ).join(" ")}`
                });
              }
              else {
                currentArray.push({
                  textbox: `${imgTag}<div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};">
                  ${props?.selectedRecurringServiceList.length !== 0 ?
                      `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                       Ongoing/Recurring Services
                      </p>`
                      : ""}
                  ${props?.selectedRecurringServiceList
                      .map(
                        (serviceCat) => `
                       <div style="font-family:${fontFamily};">
                          <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${serviceCat.serviceCatName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.pricingDriverList || subService?.gpdList || [])
                                  .filter(pricingDriver =>
                                    subService?.pricingDriverList !== undefined
                                      ? pricingDriver.driverVisibility === true
                                      : true
                                  )
                                  .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                  .map(
                                    (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                    <strong> ${pricingDriver.driverTypeID === 2
                                        ? props.formatValueWithoutCurrencySymbol(
                                          pricingDriver.driverValue
                                        )
                                        : // Number(pricingDriver.driverValue).toFixed(2).toString().replace(
                                        //   /\B(?=(\d{3})+(?!\d))/g,
                                        //   ","
                                        // )
                                        pricingDriver.driverTypeID === 3
                                          ? subService?.pricingDriverList == undefined ? pricingDriver.variationName : pricingDriver.variation.find(
                                            (item) => item.isDefault
                                          ).variationName
                                          : pricingDriver.driverTypeID === 4
                                            ? subService?.pricingDriverList == undefined ? pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.driverValue) : props.formatValueWithoutCurrencySymbol(pricingDriver.slabFrom) - props.formatValueWithoutCurrencySymbol(pricingDriver.slabTo) : pricingDriver.slab.find((item) => item.isDefault).slabTypeID === 2
                                              ? Number(pricingDriver.slab.find((item) => item.isDefault).slabValue)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                              : Number(pricingDriver.slab.find((item) => item.isDefault).slabFrom)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                              "-" +
                                              Number(pricingDriver.slab.find((item) => item.isDefault).slabTo)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            : ""
                                      }</strong>
                            </li>
                              `
                                  )
                                  .join("")}
                          `
                            )
                            .join("")}
                      </div>
                  `
                      )
                      .join("")}
                    ${props?.selectedOneOffServiceList.length !== 0 ?
                      `<p style="font-family:${fontFamily}; color: ${newColorCode};font-size: ${fontSizeHeading}; font-weight: bold;">
                          One-Off/Ad hoc Services
                        </p>`
                      : ""}
                  ${props?.selectedOneOffServiceList
                      .map(
                        (serviceCat) => `
                         <div style="font-family:${fontFamily};">
                            <p style="font-family: ${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                                ${serviceCat.serviceCatName}
                            </p>
                            <hr style="color: gray; margin-top: -15px;">
                            ${serviceCat.servicesList
                            .map(
                              (subService) => `
                             <p style="font-family: ${fontFamily}; color:black; font-size: ${fontSizeContent};">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.pricingDriverList || subService?.gpdList || [])
                                  .filter(pricingDriver =>
                                    subService?.pricingDriverList !== undefined
                                      ? pricingDriver.driverVisibility === true
                                      : true
                                  )
                                  .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                  .map(
                                    (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                    <strong> ${pricingDriver.driverTypeID === 2
                                        ? props.formatValueWithoutCurrencySymbol(
                                          pricingDriver.driverValue
                                        )
                                        : // Number(pricingDriver.driverValue).toFixed(2).toString().replace(
                                        //   /\B(?=(\d{3})+(?!\d))/g,
                                        //   ","
                                        // )
                                        pricingDriver.driverTypeID === 3
                                          ? subService?.pricingDriverList == undefined ? pricingDriver.variationName : pricingDriver.variation.find(
                                            (item) => item.isDefault
                                          ).variationName
                                          : pricingDriver.driverTypeID === 4
                                            ? subService?.pricingDriverList == undefined ? pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.driverValue) : props.formatValueWithoutCurrencySymbol(pricingDriver.slabFrom) - props.formatValueWithoutCurrencySymbol(pricingDriver.slabTo) : pricingDriver.slab.find((item) => item.isDefault).slabTypeID === 2
                                              ? Number(pricingDriver.slab.find((item) => item.isDefault).slabValue)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                              : Number(pricingDriver.slab.find((item) => item.isDefault).slabFrom)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                              "-" +
                                              Number(pricingDriver.slab.find((item) => item.isDefault).slabTo)
                                                .toFixed(2)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            : ""
                                      }</strong>
                            </li>
                              `
                                  )
                                  .join("")}
                            `
                            )
                            .join("")}
                        </div>
                    `
                      )
                      .join("")}
                      
               
                      ${props?.additionalInformationList?.filter(
                        (item) => item.driverTypeID !== 1
                      ).length >
                      0 >
                      0
                      ? `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
          Additional Information
      </p><hr style="color: gray; margin-top: -15px;" ></hr>` +
                      props.additionalInformationList
                        .map(
                          (serviceCat) => `
          <div>
              ${serviceCat.driverTypeID === 2 &&
                              serviceCat.variation === null &&
                              serviceCat.slab === null
                              ? `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                          ${serviceCat.driverName}:  <strong> ${props.formatValueWithoutCurrencySymbol(
                                serviceCat.driverValue
                              )} </strong > 
                      </p>`
                              : (serviceCat.driverTypeID === 4
                                ? serviceCat.slab
                                : serviceCat.driverTypeID === 3
                                  ? serviceCat.variation
                                  : []
                              )
                                .filter((item) => item.isDefault)
                                .map(
                                  (subService) => `
  <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
      ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4
                                      ? subService.slabTypeID === 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(subService.slabValue)}</strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(subService.slabFrom)}-${props.formatValueWithoutCurrencySymbol(subService.slabTo)}</strong>`
                                      : `<strong>${subService.variationName}</strong>`
                                    }
  </p>
  `

                                )
                                .join("")
                            }
          </div>
      `
                        )
                        .join("")
                      : ""
                    }
  
                  ${props?.quoteAdditionalInfoGlobalPricingDriver?.filter(
                      (item) => item.driverTypeID !== 1
                    ).length > 0 ?
                      `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p>
    <hr style="color: gray; margin-top: -15px;" />` +
                      props.quoteAdditionalInfoGlobalPricingDriver
                        .map((serviceCat) => `
        <div>
          ${serviceCat.driverTypeID === 2 ?
                            `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong> 
            </p>`
                            : serviceCat.driverTypeID === 3 ?
                              `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: <strong>${serviceCat.variationName}</strong>
            </p>`
                              : serviceCat.driverTypeID === 4 ?
                                `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: ${serviceCat.slabTypeID == 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.driverValue)} <strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}</strong> - <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>`}
            </p>`
                                : ""}
        </div>`
                        ).join("")
                      : ""}
  
                  </div>`,
                });
              }
            } else {
              pdfDataArray.push(currentArray);
              if (props.moduleName === "Quote" && props?.ProposalObject?.selectedProposalTypeValue === 2) {
                currentArray.push({
                  textbox: `
                    ${imgTag}
                    <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};">
                    ${props.StatementOfFact.map(
                    (SelectedPackage) =>
                      `<div style="font-family:${fontFamily};">
                          <p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
                            Package Name:  ${SelectedPackage.servicePackageName}
                          </p>
                          <hr style="color: gray; margin-top: -15px;">
                              ${SelectedPackage.reccuring.length !== 0 ?
                        `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                           Ongoing/Recurring Services
                          </p>`
                        : ""}

                          ${SelectedPackage.reccuring.map(
                          (SelectedServiceCat) =>
                            ` <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${SelectedServiceCat.serviceCategoryName}
                          </p>
                         ${SelectedServiceCat.servicesList
                              .map(
                                (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.gpdList)
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                    <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(pricingDriver.value)
                                          : pricingDriver.driverTypeID === 3
                                            ? pricingDriver.variationName
                                            : pricingDriver.driverTypeID === 4 ?
                                              pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.value) :
                                                pricingDriver.slabFrom + "-" + pricingDriver.slabTo : ""
                                        }</strong>
                            </li>
                              `).join("")}
                          `).join("")}
                          `).join(" ")}
                             ${SelectedPackage.oneOff.length !== 0 ?
                        `<p style="font-family:${fontFamily}; color: ${newColorCode};font-size: ${fontSizeHeading}; font-weight: bold;">
                            One-Off/Ad hoc Services
                          </p>`
                        : ""}

                          ${SelectedPackage.oneOff.map(
                          (SelectedServiceCat) =>
                            ` <p style="font-family:${fontFamily}; color: black; font-size: ${fontSizeHeading}; font-weight: bold;">
                              ${SelectedServiceCat.serviceCategoryName}
                          </p>
                         ${SelectedServiceCat.servicesList
                              .map(
                                (subService) => `
                              <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                  ${subService.serviceName}
                              </p>
                              ${(subService?.gpdList)
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                                <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                                ${pricingDriver.driverName}: 
                                    <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(pricingDriver.value)
                                          : pricingDriver.driverTypeID === 3
                                            ? pricingDriver.variationName
                                            : pricingDriver.driverTypeID === 4 ?
                                              pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.value) :
                                                pricingDriver.slabFrom + "-" + pricingDriver.slabTo : ""
                                        }</strong>
                            </li>
                              `).join("")}
                          `).join("")}
                          `).join(" ")}
                    
                            ${SelectedPackage.additionalInformationList?.length > 0 ?
                        `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p>
    <hr style="color: gray; margin-top: -15px;" />` +
                        SelectedPackage.additionalInformationList.filter(item => item.driverTypeID !== 1).map(serviceCat => `
        <div>
            <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4 ? serviceCat.slabTypeID === 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.value)}</strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}-${props.formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>` : serviceCat.driverTypeID === 3 ? `<strong>${serviceCat.variationName}</strong>` : `${serviceCat.driverName}: <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.value)}</strong>`}
            </p>
        </div>
    `).join("") : ""
                      }

                        </div>`
                  ).join(" ")}`
                });
              }
              else {
                currentArray = [
                  {
                    textbox: `${imgTag}<div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily}">
                       ${props?.selectedRecurringServiceList.length !== 0 ?
                        `<p style="font-family:${fontFamily};font-size: ${fontSizeHeading};color: ${newColorCode}; font-weight: bold;">
                           Ongoing/Recurring Services
                          </p>`
                        : ""}
                    ${props?.selectedRecurringServiceList
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
                             <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                ${subService.serviceName}
                            </p>
                            ${(subService?.pricingDriverList || subService?.gpdList || [])
                                    .filter(pricingDriver =>
                                      subService?.pricingDriverList !== undefined
                                        ? pricingDriver.driverVisibility === true
                                        : true
                                    )
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                              <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                              ${pricingDriver.driverName}: 
                                  <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(
                                            pricingDriver.driverValue
                                          )
                                          : // Number(pricingDriver.driverValue).toFixed(2).toString().replace(
                                          //   /\B(?=(\d{3})+(?!\d))/g,
                                          //   ","
                                          // )
                                          pricingDriver.driverTypeID === 3
                                            ? subService?.pricingDriverList == undefined ? pricingDriver.variationName : pricingDriver.variation.find(
                                              (item) => item.isDefault
                                            ).variationName
                                            : pricingDriver.driverTypeID === 4
                                              ? subService?.pricingDriverList == undefined ? pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.driverValue) : props.formatValueWithoutCurrencySymbol(pricingDriver.slabFrom) - props.formatValueWithoutCurrencySymbol(pricingDriver.slabTo) : pricingDriver.slab.find((item) => item.isDefault).slabTypeID === 2
                                                ? Number(pricingDriver.slab.find((item) => item.isDefault).slabValue)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : Number(pricingDriver.slab.find((item) => item.isDefault).slabFrom)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                                "-" +
                                                Number(pricingDriver.slab.find((item) => item.isDefault).slabTo)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                              : ""
                                        }</strong>
                          </li>
                            `
                                    )
                                    .join("")}
                          `
                              )
                              .join("")}
                      </div>
                  `
                        )
                        .join("")}
                      ${props?.selectedOneOffServiceList.length !== 0 ?
                        `<p style="font-family:${fontFamily}; color: ${newColorCode};font-size: ${fontSizeHeading}; font-weight: bold;">
                            One-Off/Ad hoc Services
                          </p>`
                        : ""}
                  ${props?.selectedOneOffServiceList
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
                                <p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; ">
                                ${subService.serviceName}
                            </p>
                            ${(subService?.pricingDriverList || subService?.gpdList || [])
                                    .filter(pricingDriver =>
                                      subService?.pricingDriverList !== undefined
                                        ? pricingDriver.driverVisibility === true
                                        : true
                                    )
                                    .filter(pricingDriver => pricingDriver.driverTypeID !== 1)
                                    .map(
                                      (pricingDriver) => `
                              <li style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent}; margin-top:5px;">
                              ${pricingDriver.driverName}: 
                                  <strong> ${pricingDriver.driverTypeID === 2
                                          ? props.formatValueWithoutCurrencySymbol(
                                            pricingDriver.driverValue
                                          )
                                          : // Number(pricingDriver.driverValue).toFixed(2).toString().replace(
                                          //   /\B(?=(\d{3})+(?!\d))/g,
                                          //   ","
                                          // )
                                          pricingDriver.driverTypeID === 3
                                            ? subService?.pricingDriverList == undefined ? pricingDriver.variationName : pricingDriver.variation.find(
                                              (item) => item.isDefault
                                            ).variationName
                                            : pricingDriver.driverTypeID === 4
                                              ? subService?.pricingDriverList == undefined ? pricingDriver.slabTypeID === 2 ? props.formatValueWithoutCurrencySymbol(pricingDriver.driverValue) : props.formatValueWithoutCurrencySymbol(pricingDriver.slabFrom) - props.formatValueWithoutCurrencySymbol(pricingDriver.slabTo) : pricingDriver.slab.find((item) => item.isDefault).slabTypeID === 2
                                                ? Number(pricingDriver.slab.find((item) => item.isDefault).slabValue)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : Number(pricingDriver.slab.find((item) => item.isDefault).slabFrom)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                                "-" +
                                                Number(pricingDriver.slab.find((item) => item.isDefault).slabTo)
                                                  .toFixed(2)
                                                  .toString()
                                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                              : ""
                                        }</strong>
                          </li>
                            `
                                    )
                                    .join("")}
                            `
                              )
                              .join("")}
                        </div>
                    `
                        )
                        .join("")}

                          ${props?.additionalInformationList?.filter(
                          (item) => item.driverTypeID !== 1
                        ).length > 0
                        ? `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
        Additional Information
    </p><hr style="color: gray; margin-top: -15px;" ></hr>` +
                        props.additionalInformationList
                          .map(
                            (serviceCat) => `
        <div>
            ${serviceCat.driverTypeID === 2 &&
                                serviceCat.variation === null &&
                                serviceCat.slab === null
                                ? `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                        ${serviceCat.driverName}:  <strong> ${props.formatValueWithoutCurrencySymbol(
                                  serviceCat.driverValue
                                )} </strong > 
                    </p>`
                                : (serviceCat.driverTypeID === 4
                                  ? serviceCat.slab
                                  : serviceCat.driverTypeID === 3
                                    ? serviceCat.variation
                                    : []
                                )
                                  .filter((item) => item.isDefault)
                                  .map(
                                    (subService) => `
<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
    ${serviceCat.driverName}: ${serviceCat.driverTypeID === 4
                                        ? subService.slabTypeID === 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(subService.slabValue)}</strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(subService.slabFrom)}-${props.formatValueWithoutCurrencySymbol(subService.slabTo)}</strong>`
                                        : `<strong>${subService.variationName}</strong>`
                                      }
</p>
`
                                  )
                                  .join("")
                              }
        </div>
    `
                          )
                          .join("")
                        : ""
                      }

                    ${props?.quoteAdditionalInfoGlobalPricingDriver?.filter(
                        (item) => item.driverTypeID !== 1
                      ).length > 0 ?
                        `<p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: ${fontSizeHeading}; font-weight: bold;">
      Additional Information
  </p>
  <hr style="color: gray; margin-top: -15px;" />` +
                        props.quoteAdditionalInfoGlobalPricingDriver
                          .map((serviceCat) => `
      <div>
        ${serviceCat.driverTypeID === 2 ?
                              `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
              ${serviceCat.driverName}: <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.driverValue)}</strong> 
          </p>`
                              : serviceCat.driverTypeID === 3 ?
                                `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
              ${serviceCat.driverName}: <strong>${serviceCat.variationName}</strong>
          </p>`
                                : serviceCat.driverTypeID === 4 ?
                                  `<p style="font-family:${fontFamily}; color:black; font-size: ${fontSizeContent};">
                ${serviceCat.driverName}: ${serviceCat.slabTypeID == 2 ? `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.driverValue)} <strong>` : `<strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabFrom)}</strong> - <strong>${props.formatValueWithoutCurrencySymbol(serviceCat.slabTo)}</strong>`}
          </p>`
                                  : ""}
      </div>`
                          ).join("")
                        : ""}
                  </div>`,
                  },
                ];
              }
            }
            break;
          case ElementType.SERVICE_PRICING_TABLE:
            // Append the table for selectedRecurringServiceList
            if (prevElementType === ElementType.PAGE_BREAK ||
              prevElementType === ElementType.AWS_PDF_LINK) {
              pdfDataArray.push(currentArray);
              currentArray = [];
            }
            if (props?.servicePackageName?.length > 0) {
              currentArray.push({
                table:
                  `<div style="padding-left: 40px; padding-right: 40px; color:${newColorCode}; font-size: 30px;">Package : ${props?.servicePackageName} </div>`

              });
            }
            if (
              props?.selectedPackages?.length > 0 &&
              props?.selectedPackages !== null
            ) {
              if (props.selectedRecurringServiceList.length > 0) {
                currentArray.push({
                  table: `
                    <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily}; page-break-inside: avoid; break-inside: avoid;">
                    
                    <p style="font-family:${fontFamily}; color: ${newColorCode}; font-size: 20px; margin-top: 15px;"> Recurring Fees (${getPaymentFrequencyLabel()})</p>
                      <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                        <tr style="background-color:${newColorCode};">
                          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                          ${props?.selectedPackagesList
                      ?.map(
                        (selectedPackagesData) => `
                          <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">${getPackageName(
                          selectedPackagesData.servicePackageID,
                          selectedPackagesData.servicePackageName
                        )}</th>
                          `
                      )
                      .join("")}
                         
                        </tr>
                        ${props.selectedRecurringServiceList
                      .map(
                        (serviceCat) => `
                                                    <tr style="background-color: #DCDCDC;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">${serviceCat.serviceCatName
                          }</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                            ${props?.selectedPackages.length >= 2
                            ? `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>`
                            : ` `
                          }
                            ${props?.selectedPackages.length === 3
                            ? `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>`
                            : ` `
                          }
                            
                          </tr>
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `

                             
                            <tr>
                              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${subService.serviceName
                                }</td>
                                ${props?.feeTypeId == 1
                                  ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${subService.packageOneValue !== undefined
                                    ? (subService.packageOneValue === 0 ||
                                      subService.packageOneValue ===
                                      null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          props.selectedPackagesList[0]
                                            ?.servicePackageID
                                      )
                                      ? `<span>&#10007;</span>`
                                      : !(subService?.servicePackageIDs.includes(subService.packageOneID)) ? `<span>&#10007;</span>` : `${props.formatValue(
                                        subService.packageOneValue
                                      )}`
                                    : props.formatValue(subService.price)
                                  }</td>
                            `
                                  : `${subService.packageOneValue == undefined
                                    ? Number(
                                      subService.packageOneValue
                                    ) == 0
                                      ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                      : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    : Number(
                                      subService.packageOneValue
                                    ) !== null && !subService?.servicePackageIDs.includes(subService.packageOneID)
                                      ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                      : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                            `
                                }
                             
                              ${props?.selectedPackages.length >= 2
                                  ? `
                                  ${props?.feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">${subService.packageTwoValue !==
                                      undefined
                                      ? (subService.packageTwoValue ===
                                        0 ||
                                        subService.packageTwoValue ===
                                        null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            props.selectedPackagesList[1]
                                              ?.servicePackageID
                                        )
                                        ? `<span>&#10007;</span>`
                                        : !(subService?.servicePackageIDs.includes(subService.packageTwoID)) ? `<span>&#10007;</span>` : `${props.formatValue(
                                          subService.packageTwoValue
                                        )}`
                                      : props.formatValue(
                                        subService.price
                                      )
                                    }</td>
                              `
                                    : `${subService.packageTwoValue ==
                                      undefined
                                      ? Number(
                                        subService.packageTwoValue
                                      ) == 0
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                      : Number(
                                        subService.packageTwoValue
                                      ) !== null && !subService?.servicePackageIDs.includes(subService.packageTwoID)
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    }
                              `
                                  }
                                  `
                                  : ` `
                                }
                              ${props?.selectedPackages.length === 3
                                  ? `
                                  ${props?.feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">${subService.packageThreeValue !==
                                      undefined
                                      ? (subService.packageThreeValue ===
                                        0 ||
                                        subService.packageThreeValue ===
                                        null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            props.selectedPackagesList[2]
                                              ?.servicePackageID
                                        )
                                        ? `<span>&#10007;</span>`
                                        : !(subService?.servicePackageIDs.includes(subService.packageThreeID)) ? `<span>&#10007;</span>` : `${props.formatValue(
                                          subService.packageThreeValue
                                        )}`
                                      : props.formatValue(
                                        subService.price
                                      )
                                    }</td>
                              `
                                    : `${subService.packageThreeValue ==
                                      undefined
                                      ? Number(
                                        subService.packageThreeValue
                                      ) == 0
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                      : Number(
                                        subService.packageThreeValue
                                      ) !== null && !subService?.servicePackageIDs.includes(subService.packageThreeID)
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    }
                              `
                                  }
                                  
                                  `
                                  : ` `
                                }
                            </tr>`
                            )
                            .join("")}
                        `
                      )
                      .join("")}
                        <tr style="background-color:#808080;">                         
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">Net Total</td>
                        <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">   ${Number(
                        props.RecurringPricingInfo.packageOneNetTotal
                      ) <
                      Number(
                        props.RecurringPricingInfo
                          .packageOneDisCountedTotal
                      ) ||
                      (Number(
                        props.RecurringPricingInfo.packageOneDisCount
                      ) > 0 &&
                        !props.DiscountLines)
                      ? props.formatValue(
                        props.RecurringPricingInfo
                          .packageOneDisCountedTotal
                      )
                      : props.formatValue(
                        props.RecurringPricingInfo.packageOneNetTotal
                      )
                    }</td >
                          
                           ${props?.selectedPackages.length >= 2
                      ? `  <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">  
                      ${Number(props.RecurringPricingInfo.packageTwoNetTotal
                      ) <
                        Number(
                          props.RecurringPricingInfo
                            .packageTwoDisCountedTotal
                        ) ||
                        (Number(
                          props.RecurringPricingInfo
                            .packageTwoDisCount
                        ) > 0 &&
                          !props.DiscountLines)
                        ? props.formatValue(
                          props.RecurringPricingInfo
                            .packageTwoDisCountedTotal
                        )
                        : props.formatValue(
                          props.RecurringPricingInfo.packageTwoNetTotal
                        )
                      }</td>`
                      : ``
                    }
                           ${props?.selectedPackages.length === 3
                      ? ` <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                          ${Number(
                        props.RecurringPricingInfo.packageThreeNetTotal
                      ) <
                        Number(
                          props.RecurringPricingInfo
                            .packageThreeDisCountedTotal
                        ) ||
                        (Number(
                          props.RecurringPricingInfo
                            .packageThreeDisCount
                        ) > 0 &&
                          !props.DiscountLines)
                        ? props.formatValue(
                          props.RecurringPricingInfo
                            .packageThreeDisCountedTotal
                        )
                        : props.formatValue(
                          props.RecurringPricingInfo.packageThreeNetTotal
                        )
                      }</td>`
                      : ` `
                    }
                        ${(Number(
                      props.RecurringPricingInfo.packageThreeDisCount
                    ) > 0 ||
                      Number(
                        props.RecurringPricingInfo.packageOneDisCount
                      ) > 0 ||
                      Number(
                        props.RecurringPricingInfo.packageTwoDisCount
                      ) > 0) &&
                      props?.DiscountLines
                      ? `
         <tr style="background-color: #DCDCDC";>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: black;">
              Discount
            </td>
             <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
              (-)    
              ${props.formatValue(
                        props.RecurringPricingInfo.packageOneDisCount
                      )}
            </td>
            ${props?.selectedPackagesList?.length >= 2
                        ? `
               <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                (-)    
                ${props.formatValue(
                          props.RecurringPricingInfo.packageTwoDisCount
                        )}
              </td>
            `
                        : ``
                      }
            ${props?.selectedPackagesList?.length === 3
                        ? `
               <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                (-)    
                ${props.formatValue(
                          props.RecurringPricingInfo.packageThreeDisCount
                        )}
              </td>
            `
                        : ``
                      }
          </tr>
          <tr style="background-color:#808080;">
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Discounted Total
            </td>
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
            
                 
              ${props.formatValue(
                        props.RecurringPricingInfo.packageOneDisCountedTotal
                      )}
            </td>
            ${props?.selectedPackagesList?.length >= 2
                        ? `
              <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
               
                   
                ${props.formatValue(
                          props.RecurringPricingInfo.packageTwoDisCountedTotal
                        )}
              </td>
            `
                        : ``
                      }
            ${props?.selectedPackagesList?.length === 3
                        ? `
              <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
               
                   
                ${props.formatValue(
                          props.RecurringPricingInfo.packageThreeDisCountedTotal
                        )}
              </td>
            `
                        : ``
                      }
          </tr>
        
      `
                      : ``
                    }

       ${props.vatPercentage
                      ? `
        <tr style="background-color: #DCDCDC";>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: black;">
              VAT
          </td>
           <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
               
            ${props.formatValue(props.RecurringPricingInfo.PackageOneVaTPrice)

                      // Number(props.RecurringPricingInfo.PackageOneVaTPrice).toFixed(2).toString().replace(
                      //           /\B(?=(\d{3})+(?!\d))/g,
                      //           ","
                      //         )
                      }
          </td>
          ${props?.selectedPackagesList?.length >= 2
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                 
              ${props.formatValue(props.RecurringPricingInfo.PackageTwoVaTPrice)
                        // Number(props.RecurringPricingInfo.PackageTwoVaTPrice).toFixed(2).toString().replace(
                        //         /\B(?=(\d{3})+(?!\d))/g,
                        //         ","
                        //       )
                        }
            </td>
          `
                        : ``
                      }
          ${props?.selectedPackagesList?.length === 3
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                 
              ${props.formatValue(
                          props.RecurringPricingInfo.PackageThreeVaTPrice
                        )
                        // Number(props.RecurringPricingInfo.PackageThreeVaTPrice).toFixed(2).toString().replace(
                        //         /\B(?=(\d{3})+(?!\d))/g,
                        //         ","

                        //       )
                        }
            </td>
          `
                        : ``
                      }
        </tr>
<tr style="background-color:#808080;">
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Grand Total
            </td>
          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
               
            ${props.formatValue(props.RecurringPricingInfo.PackageOneGrandTotal)
                      // Number(props.RecurringPricingInfo.PackageOneGrandTotal).toFixed(2).toString().replace(
                      //           /\B(?=(\d{3})+(?!\d))/g,
                      //           ","
                      //         )
                      }
          </td>
          ${props?.selectedPackagesList?.length >= 2
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                 
              ${props.formatValue(
                          props.RecurringPricingInfo.PackageTwoGrandTotal
                        )
                        // Number(props.RecurringPricingInfo.PackageTwoGrandTotal).toFixed(2).toString().replace(
                        //         /\B(?=(\d{3})+(?!\d))/g,
                        //         ","
                        //       )
                        }
            </td>
          `
                        : ``
                      }
          ${props?.selectedPackagesList?.length === 3
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                 
              ${props.formatValue(
                          props.RecurringPricingInfo.PackageThreeGrandTotal
                        )
                        // Number(props.RecurringPricingInfo.PackageThreeGrandTotal).toFixed(2).toString().replace(
                        //         /\B(?=(\d{3})+(?!\d))/g,
                        //         ","
                        //       )
                        }
            </td>
          `
                        : ``
                      }
        </tr>
      
    `
                      : ``
                    }
                      
                      </table>
                    </div>
                  `,
                });
              }

              if (props.selectedOneOffServiceList.length > 0) {
                currentArray.push({
                  table: `
                    <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                      <p style="font-family:${fontFamily}; color:${newColorCode}; font-size: 20px; margin-top: 15px;"> One-Off Fees </p>
                      <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                        <tr style="background-color:${newColorCode};">
                          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                          ${props?.selectedPackagesList
                      ?.map(
                        (selectedPackagesData) => `
                          <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">${getPackageName(
                          selectedPackagesData.servicePackageID,
                          selectedPackagesData.servicePackageName
                        )}</th>
                          `
                      )
                      .join("")}                           
                        </tr>
                        ${props.selectedOneOffServiceList
                      .map(
                        (serviceCat) => `
                          <tr style="background-color: #DCDCDC;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">${serviceCat.serviceCatName
                          }</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                            ${props?.selectedPackages.length >= 2
                            ? `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>`
                            : ` `
                          }
                            ${props?.selectedPackages.length === 3
                            ? `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>`
                            : ` `
                          }
                            
                          </tr>
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `

                              <tr>
                        

                      </tr>
                            <tr>
                              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${subService.serviceName
                                }</td>
                                ${props?.feeTypeId == 1
                                  ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">${subService.packageOneValue !== undefined
                                    ? (subService.packageOneValue === 0 ||
                                      subService.packageOneValue ===
                                      null) &&
                                      !subService.servicePackageIDs.some(
                                        (item) =>
                                          item ==
                                          props.selectedPackagesList[0]
                                            ?.servicePackageID
                                      )
                                      ? `<span>&#10007;</span>`
                                      : !(subService?.servicePackageIDs.includes(subService.packageOneID)) ? `<span>&#10007;</span>` : `${props.formatValue(
                                        subService.packageOneValue
                                      )}`
                                    : props.formatValue(subService.price)
                                  }</td>
                            `
                                  : `${subService.packageOneValue == undefined
                                    ? Number(
                                      subService.packageOneValue
                                    ) == 0
                                      ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                      : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    : Number(
                                      subService.packageOneValue
                                    ) !== null && !subService?.servicePackageIDs.includes(subService.packageOneID)
                                      ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                      : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                  }
                            `
                                }
                             
                              ${props?.selectedPackages.length >= 2
                                  ? `
                                  ${props?.feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;"> ${subService.packageTwoValue !==
                                      undefined
                                      ? (subService.packageTwoValue ===
                                        0 ||
                                        subService.packageTwoValue ===
                                        null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            props.selectedPackagesList[1]
                                              ?.servicePackageID
                                        )
                                        ? `<span>&#10007;</span>`
                                        : !(subService?.servicePackageIDs.includes(subService.packageTwoID)) ? `<span>&#10007;</span>` : `${props.formatValue(
                                          subService.packageTwoValue
                                        )}`
                                      : props.formatValue(
                                        subService.price
                                      )
                                    }</td>
                              `
                                    : `${subService.packageTwoValue ==
                                      undefined
                                      ? Number(
                                        subService.packageTwoValue
                                      ) == 0
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                      : Number(
                                        subService.packageTwoValue
                                      ) !== null && !subService?.servicePackageIDs.includes(subService.packageTwoID)
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    }
                              `
                                  }
                                  `
                                  : ` `
                                }
                              ${props?.selectedPackages.length === 3
                                  ? `
                                  ${props?.feeTypeId == 1
                                    ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">${subService.packageThreeValue !==
                                      undefined ? (
                                      (subService.packageThreeValue ===
                                        0 ||
                                        subService.packageThreeValue ===
                                        null) &&
                                        !subService.servicePackageIDs.some(
                                          (item) =>
                                            item ==
                                            props.selectedPackagesList[2]
                                              ?.servicePackageID
                                        ) ?
                                        `<span>&#10007;</span>`
                                        : !(subService?.servicePackageIDs.includes(subService.packageThreeID)) ? `<span>&#10007;</span>` : `${props.formatValue(subService.packageThreeValue
                                        )}`
                                    )
                                      : (
                                        props.formatValue(subService.price)
                                      )
                                    }</td>
                              `
                                    : `${subService.packageThreeValue ==
                                      undefined
                                      ? Number(
                                        subService.packageThreeValue
                                      ) == 0
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                      : Number(
                                        subService.packageThreeValue
                                      ) !== null && !subService?.servicePackageIDs.includes(subService.packageThreeID)
                                        ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10007;</td>`
                                        : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                    }
                              `
                                  }
                                  
                                  `
                                  : ` `
                                }
                            </tr>`
                            )
                            .join("")}
                        `
                      )
                      .join("")}
                         <tr style="background-color:#808080;">
                        <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">Net Total</td>
                        <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">  ${Number(
                        props.OneOffPricingInfo.packageOneNetTotal
                      ) <
                      Number(
                        props.OneOffPricingInfo.packageOneDisCountedTotal
                      ) ||
                      (Number(props.OneOffPricingInfo.packageOneDisCount) >
                        0 &&
                        !props.DiscountLines)
                      ? props.formatValue(
                        props.OneOffPricingInfo
                          .packageOneDisCountedTotal
                      )
                      : props.formatValue(
                        props.OneOffPricingInfo.packageOneNetTotal
                      )
                    }</td>
                          
                           ${props?.selectedPackages.length >= 2
                      ? `  <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">   ${Number(
                        props.OneOffPricingInfo.packageTwoNetTotal
                      ) <
                        Number(
                          props.OneOffPricingInfo
                            .packageTwoDisCountedTotal
                        ) ||
                        (Number(
                          props.OneOffPricingInfo.packageTwoDisCount
                        ) > 0 &&
                          !props.DiscountLines)
                        ? props.formatValue(
                          props.OneOffPricingInfo
                            .packageTwoDisCountedTotal
                        )
                        : props.formatValue(
                          props.OneOffPricingInfo.packageTwoNetTotal
                        )
                      }</td>`
                      : ` `
                    }
                           ${props?.selectedPackages.length === 3
                      ? ` <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">  ${Number(
                        props.OneOffPricingInfo.packageThreeNetTotal
                      ) <
                        Number(
                          props.OneOffPricingInfo
                            .packageThreeDisCountedTotal
                        ) ||
                        (Number(
                          props.OneOffPricingInfo
                            .packageThreeDisCount
                        ) > 0 &&
                          !props.DiscountLines)
                        ? props.formatValue(
                          props.OneOffPricingInfo
                            .packageThreeDisCountedTotal
                        )
                        : props.formatValue(
                          props.OneOffPricingInfo.packageThreeNetTotal
                        )
                      }
                        </td>`
                      : ` `
                    }
                        ${(Number(
                      props.OneOffPricingInfo.packageThreeDisCount
                    ) > 0 ||
                      Number(props.OneOffPricingInfo.packageOneDisCount) >
                      0 ||
                      Number(props.OneOffPricingInfo.packageTwoDisCount) >
                      0) &&
                      props?.DiscountLines
                      ? `
         <tr style="background-color: #DCDCDC";>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: Black;">
              Discount
            </td>
             <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: Black;">
              (-)    
              ${props.formatValue(props.OneOffPricingInfo.packageOneDisCount)}
            </td>
            ${props?.selectedPackagesList?.length >= 2
                        ? `
               <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: Black;">
                (-)    
                ${props.formatValue(props.OneOffPricingInfo.packageTwoDisCount)}
              </td>
            `
                        : ``
                      }
            ${props?.selectedPackagesList?.length === 3
                        ? `
               <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: Black;"">
                (-)    
                ${props.formatValue(
                          props.OneOffPricingInfo.packageThreeDisCount
                        )}
              </td>
            `
                        : ``
                      }
          </tr>
          <tr style="background-color:#808080;">
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Discounted Total
            </td>
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
            
                 
              ${props.formatValue(
                        props.OneOffPricingInfo.packageOneDisCountedTotal
                      )
                      // Number(props.OneOffPricingInfo.packageOneDisCountedTotal)
                      //           .toFixed(2).toString().replace(
                      //             /\B(?=(\d{3})+(?!\d))/g,
                      //             ","
                      //           )
                      }
            </td>
            ${props?.selectedPackagesList?.length >= 2
                        ? `
              <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
   
                ${props.formatValue(
                          props.OneOffPricingInfo.packageTwoDisCountedTotal
                        )
                        // Number(props.OneOffPricingInfo.packageTwoDisCountedTotal)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
              </td>
            `
                        : ``
                      }
            ${props?.selectedPackagesList?.length === 3
                        ? `
              <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
               
                   
                ${props.formatValue(
                          props.OneOffPricingInfo.packageThreeDisCountedTotal
                        )
                        // Number(props.OneOffPricingInfo.packageThreeDisCountedTotal)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
              </td>
            `
                        : ``
                      }
          </tr>
        </>
      `
                      : ``
                    }

       ${props.vatPercentage
                      ? `
        <tr style="background-color: #DCDCDC";>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: black;">
              VAT
          </td>
           <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
               
            ${props.formatValue(props.OneOffPricingInfo.PackageOneVaTPrice)
                      // Number(props.OneOffPricingInfo.PackageOneVaTPrice)
                      //           .toFixed(2).toString().replace(
                      //             /\B(?=(\d{3})+(?!\d))/g,
                      //             ","
                      //           )
                      }
          </td>
          ${props?.selectedPackagesList?.length >= 2
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                 
              ${props.formatValue(props.OneOffPricingInfo.PackageTwoVaTPrice)
                        // Number(props.OneOffPricingInfo.PackageTwoVaTPrice)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
            </td>
          `
                        : ``
                      }
          ${props?.selectedPackagesList?.length === 3
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;color: black;">
                 
              ${props.formatValue(props.OneOffPricingInfo.PackageThreeVaTPrice)
                        // Number(props.OneOffPricingInfo.PackageThreeVaTPrice)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
            </td>
          `
                        : ``
                      }
        </tr>
<tr style="background-color:#808080;">
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Grand Total
            </td>
          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
               
            ${props.formatValue(props.OneOffPricingInfo.PackageOneGrandTotal)
                      // Number(props.OneOffPricingInfo.PackageOneGrandTotal)
                      //           .toFixed(2).toString().replace(
                      //             /\B(?=(\d{3})+(?!\d))/g,
                      //             ","
                      //           )
                      }
          </td>
          ${props?.selectedPackagesList?.length >= 2
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                 
              ${props.formatValue(props.OneOffPricingInfo.PackageTwoGrandTotal)
                        // Number(props.OneOffPricingInfo.PackageTwoGrandTotal)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
            </td>
          `
                        : ``
                      }
          ${props?.selectedPackagesList?.length === 3
                        ? `
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                 
              ${props.formatValue(
                          props.OneOffPricingInfo.PackageThreeGrandTotal
                        )
                        // Number(props.OneOffPricingInfo.PackageThreeGrandTotal)
                        //           .toFixed(2).toString().replace(
                        //             /\B(?=(\d{3})+(?!\d))/g,
                        //             ","
                        //           )
                        }
            </td>
          `
                        : ``
                      }
        </tr>
      </>
    `
                      : ``
                    }
                      
                         
                        </tr>
                      </table>
                    </div>
                  `,
                });
              }
            } else {
              if (props?.selectedRecurringServiceList.length > 0) {
                currentArray.push({
                  table: `
                    <div style="padding-left: 40px; padding-right: 40px; font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                     
                      <p style="font-family:${fontFamily}; color:${newColorCode}; font-size: 20px; margin-top: 15px;"> Recurring Fees (${getPaymentFrequencyLabel()})</p>
                      <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                        <tr style="background-color:${newColorCode};">
                          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                          <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees (£   )</th>
                        </tr>
                        ${props.selectedRecurringServiceList
                      .map(
                        (serviceCat) => `
                          <tr style="background-color: #eee;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">${serviceCat.serviceCatName
                          }</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                          </tr>
                          ${serviceCat.servicesList
                            .map(
                              (subService) => `
                            <tr>
                              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${subService.serviceName
                                }</td>
                                ${props?.feeTypeId == 1
                                  ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">   ${subService.price == undefined
                                    ? props.formatValue(
                                      subService.quotationPrice
                                    )
                                    : props.formatValue(subService.price)
                                  }</td>
                            `
                                  : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                }
                            </tr>
                          `
                            )
                            .join("")}
                        `
                      )
                      .join("")}
                        <tr style="background-color:#808080;">
                          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">Net Total</td>
                          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">   ${Number(props.RecurringPricingInfo.OriginalPrice) <
                      Number(
                        props.RecurringPricingInfo.DiscountedPrice
                      ) ||
                      (Number(props.RecurringPricingInfo.Discount) > 0 &&
                        !props.DiscountLines)
                      ? Number(
                        props.RecurringPricingInfo.DiscountedPrice
                      ) === 0
                        ? props.formatValue(
                          props.RecurringPricingInfo.OriginalPrice
                        )
                        : props.formatValue(
                          props.RecurringPricingInfo.DiscountedPrice
                        )
                      : props.formatValue(
                        props.RecurringPricingInfo.OriginalPrice
                      )
                    }
                    </td>
                    </tr>
                   ${Number(
                      props.RecurringPricingInfo.Discount > 0 &&
                      props?.DiscountLines
                    )
                      ? `<tr style="background-color:#DCDCDC ;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                      Discount
                      </td>
                       <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                       
                       (-)     ${props.formatValue(
                        props.RecurringPricingInfo.Discount
                      )}
                      </td>
                    </tr>
          <tr style="background-color:#808080;">
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Discounted Total
            </td>
             <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
             
                 
              ${props.formatValue(props.RecurringPricingInfo.DiscountedTotal)}
            </td>
          </tr>
        </>
     `
                      : ``
                    }
     
      ${props.vatPercentage
                      ? `      
          <tr style="background-color: #DCDCDC";>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: black;">
              VAT
          </td>
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">   ${props.formatValue(props.RecurringPricingInfo.VATPrice)
                      // Number(props.RecurringPricingInfo.VATPrice)
                      //           .toFixed(2).toString().replace(
                      //             /\B(?=(\d{3})+(?!\d))/g,
                      //             ","
                      //           )
                      }
            </td>
          </tr>
         <tr style="background-color:#808080;">
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Grand Total
            </td>
          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                  
              ${props.formatValue(props.RecurringPricingInfo.GrandTotal)
                      // Number(props.RecurringPricingInfo.GrandTotal)
                      //         .toFixed(2).toString().replace(
                      //           /\B(?=(\d{3})+(?!\d))/g,
                      //           ","
                      //         )
                      }
            </td>
          </tr> `
                      : ``
                    }
   
                      </table>
                    </div>
                  `,
                });
              }
              // Check if selectedOneOffServiceList has items
              if (props?.selectedOneOffServiceList.length > 0) {
                // Append the table for selectedOneOffServiceList
                currentArray.push({
                  table: `
                      <div style="padding: 40px;font-family:${fontFamily};page-break-inside: avoid; break-inside: avoid;">
                        <p style="font-family:${fontFamily}; color:${newColorCode}; font-size: 20px;">One-Off Fees </p>
                        <table style="font-family:${fontFamily}; border-collapse: collapse; width: 100%; margin-top: -15px;">
                          <tr style="background-color:${newColorCode};">
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white; font-size: 18px;">Services</th>
                            <th style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white; font-size: 18px;">Fees (£)</th>
                          </tr>
                          ${props.selectedOneOffServiceList
                      .map(
                        (serviceCat) => `
                                <tr style="background-color: #eee;">
                                  <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold; font-size: 18px;">${serviceCat.serviceCatName
                          }</td>
                                   <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;"></td>
                                </tr>
                                ${serviceCat.servicesList
                            .map(
                              (subService) => `
                                  <tr>
                                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${subService.serviceName
                                }</td>
                                ${props?.feeTypeId == 1
                                  ? `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">   ${subService.price == undefined
                                    ? props.formatValue(
                                      subService.quotationPrice
                                    )
                                    : props.formatValue(subService.price)
                                  }</td>
                            `
                                  : `<td style="border: 1px solid #DDDDDD; text-align: right; padding: 8px;">&#10003;</td>`
                                }
                                  </tr>
                                `
                            )
                            .join("")}
                              `
                      )
                      .join("")}
                          <tr style="background-color:#808080;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">Net Total</td>
                            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">   
                    
                    ${Number(props.OneOffPricingInfo.OriginalPrice) <
                      Number(props.OneOffPricingInfo.DiscountedPrice) ||
                      (Number(props.OneOffPricingInfo.Discount) > 0 &&
                        !props.DiscountLines)
                      ? Number(props.OneOffPricingInfo.DiscountedPrice) === 0
                        ? props.formatValue(
                          props.OneOffPricingInfo.OriginalPrice
                        )
                        : props.formatValue(
                          props.OneOffPricingInfo.DiscountedPrice
                        )
                      : props.formatValue(
                        props.OneOffPricingInfo.OriginalPrice
                      )
                    }
                    </td>
                    </tr>
                    
                      ${Number(
                      props.OneOffPricingInfo.Discount > 0 &&
                      props?.DiscountLines
                    )
                      ? `
      
          <tr style="background-color:#DCDCDC ;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: black;">
                      Discount
                      </td>
                       <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: black;">
                       
                       (-)      ${props.formatValue(
                        props.OneOffPricingInfo.Discount
                      )}
                      </td>
                    </tr>
          <tr style="background-color:#808080;">
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Discounted Total
            </td>
             <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
                                
              ${props.formatValue(props.OneOffPricingInfo.DiscountedTotal)}
            </td>
          </tr>
       
     `
                      : ``
                    }
      ${props.vatPercentage
                      ? `
       
          <tr style="background-color: #DCDCDC";>
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;color: black;">
              VAT
          </td>
            <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">   ${props.formatValue(props.OneOffPricingInfo.VATPrice)
                      // Number(props.OneOffPricingInfo.VATPrice)
                      //           .toFixed(2).toString().replace(
                      //             /\B(?=(\d{3})+(?!\d))/g,
                      //             ","
                      //           )
                      }
            </td>
          </tr>
         <tr style="background-color:#808080;">
           <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; color: white;">
              Grand Total
            </td>
          <td style="border: 1px solid #dddddd; text-align: right; padding: 8px; color: white;">
              
                  
              ${props.formatValue(props.OneOffPricingInfo.GrandTotal)
                      // Number(props.OneOffPricingInfo.GrandTotal)
                      //         .toFixed(2).toString().replace(
                      //           /\B(?=(\d{3})+(?!\d))/g,
                      //           ","
                      //         )
                      }
            </td>
          </tr>
     
              `
                      : ``
                    }
                          </tr>
                        </table>
                      </div>
                    `,
                });
              }
            }
            break;
          case ElementType.PAGE_BREAK: break;
          case ElementType.FULL_PAGE_HEADING:
            pdfDataArray.push(currentArray);
            currentArray = [
              {
                // textbox: `<div style="padding-left: 40px; padding-right: 40px; margin-top: 350px;">${element.htmlContent}</div>`,
                textbox: ` ${imgTag}<div style=" text-align: center; padding-left: 40px; padding-right: 40px; color:${newColorCode}; margin-top: 400px; padding-bottom: 400px; font-family:${fontFamily}; font-size:${fontSizeHeading}; ">${element.headings} <br
                  >
                  <hr style="padding-left: 40px; padding-right: 40px; color: black; "></hr> <div style="color: Black; font-size: 0.25in;font-family:${fontFamily}; font-size: ${fontSizeContent};">${element.shortDesc}</div></div>
                 `,
              },
            ];
            break;
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
            // pdfDataArray.push([]);
            if (props?.updatedTnCData || props?.engagementObj?.pdf) {
              const contractSignatoryRowNo = props.contractSignatoriesList.map(
                (item, index) => ({
                  ...item,
                  RowNo: index + 1,
                })
              );

              // let rightSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 1)
              // let leftSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 2)

              let rightSignatureList = contractSignatoryRowNo.filter(
                (x) => x.signaturePositionID === 1
              );
              let leftSignatureList = contractSignatoryRowNo.filter(
                (x) => x.signaturePositionID === 2
              );
              const contractSignatoryRowNoForOfficer = props.organisationData?.officersList !== undefined && props.organisationData?.officersList.filter(item => item.isAuthorisedSignatory).map(
                (item, index) => ({
                  ...item,
                  RowNo: Number(contractSignatoryRowNo.length) + index + 1,
                })
              );
              let htmlContentForSignatories = "";
              let loopCount = Math.max(
                rightSignatureList.length,
                leftSignatureList.length
              );

              if (
                props?.updatedTnCData !== null &&
                props?.updatedTnCData !== undefined
              ) {

                pdfDataArray.push(currentArray);
                currentArray = [
                  {
                    textbox: `<div style="padding-left: 40px; padding-right: 40px; color:${newColorCode}; font-size: ${fontSizeHeading}; font-family:${fontFamily}" >TERMS & CONDITIONS<br>
                    <hr style="padding-left: 40px; padding-right: 40px; color: black;"></hr></div>
                      <div style="padding-left: 40px; padding-right: 40px;">${props.updatedTnCData}</div><br>
            ${(() => {
                        htmlContentForSignatories =
                          "<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; page-break-inside: avoid; break-inside: avoid;'>";
                        htmlContentForSignatories += "<table style='width: 100%;'>";

                        for (let i = 0; i < loopCount; i++) {
                          htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                            }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${leftSignatureList[i]?.RowNo}_</span>${leftSignatureList[i]
                              ? leftSignatureList[i].firstName +
                              " " +
                              leftSignatureList[i].lastName
                              : ""
                            }<span style="color: white;">^></span>
    </td>
    <td id="right_${i + 1
                            }" style="padding-top: 60px;width:50%; font-size:0.2in;font-family:${fontFamily}; text-align:right">
      <span style="color: white;"><^${rightSignatureList[i]?.RowNo}_</span>${rightSignatureList[i]
                              ? rightSignatureList[i].firstName +
                              " " +
                              rightSignatureList[i].lastName
                              : ""
                            }<span style="color: white;">^></span>
    </td>
  </tr>`;
                        }
                        if (props.organisationData.otherInformation[0].signatureImageUrl !== null) {
                          htmlContentForSignatories += `
  <tr style='width:50%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left: 45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${props.organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px;width:130px;"></div>
      <div style="margin-bottom: 20px;margin-top: 30px;">${props.organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;
                        } else {
                          for (let i = 0; i < Math.max(contractSignatoryRowNoForOfficer?.length); i++) {
                            htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                              }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${contractSignatoryRowNoForOfficer[i]?.RowNo}_</span>${contractSignatoryRowNoForOfficer[i]
                                ? contractSignatoryRowNoForOfficer[i].firstName +
                                " " +
                                contractSignatoryRowNoForOfficer[i].lastName
                                : ""
                              }<span style="color: white;">^></span>
    </td>
   
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
                props?.engagementObj?.pdf !== null ||
                props?.updatedTnCData === null
              ) {
                pdfDataArray.push(currentArray);
                currentArray = [];
                currentArray.push({
                  ["awsLink"]: props.engagementObj.pdf,
                });
                const contractSignatoryRowNo =
                  props.contractSignatoriesList.map((item, index) => ({
                    ...item,
                    RowNo: index + 1,
                  }));

                // let rightSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 1)
                // let leftSignatureList = props.contractSignatoriesList.filter(x => x.signaturePositionID === 2)
                const contractSignatoryRowNoForOfficer = props.organisationData?.officersList !== undefined && props.organisationData?.officersList.filter(item => item.isAuthorisedSignatory).map(
                  (item, index) => ({
                    ...item,
                    RowNo: Number(contractSignatoryRowNo.length) + index + 1,
                  })
                );
                let rightSignatureList = contractSignatoryRowNo.filter(
                  (x) => x.signaturePositionID === 1
                );
                let leftSignatureList = contractSignatoryRowNo.filter(
                  (x) => x.signaturePositionID === 2
                );

                let htmlContentForSignatories = "";
                let loopCount = Math.max(
                  rightSignatureList.length,
                  leftSignatureList.length
                );

                htmlContentForSignatories += `<div id='SignatoryBlock' style='width: 95%; padding-left: 0px; padding-right: 0px; margin-top: 50px; page-break-inside: avoid; break-inside: avoid;'>`;
                htmlContentForSignatories += "<table style='width: 100%;'>";

                for (let i = 0; i < loopCount; i++) {
                  htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                    }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${leftSignatureList[i]?.RowNo}_</span>${leftSignatureList[i]
                      ? leftSignatureList[i].firstName +
                      " " +
                      leftSignatureList[i].lastName
                      : ""
                    }<span style="color: white;">^></span>
    </td>
    <td id="right_${i + 1
                    }" style="padding-top: 60px;width:50%; font-size:0.2in;font-family:${fontFamily}; text-align:right">
      <span style="color: white;"><^${rightSignatureList[i]?.RowNo}_</span>${rightSignatureList[i]
                      ? rightSignatureList[i].firstName +
                      " " +
                      rightSignatureList[i].lastName
                      : ""
                    }<span style="color: white;">^></span>
    </td>
  </tr>`;
                }
                if (props.organisationData.otherInformation[0].signatureImageUrl !== null) {
                  htmlContentForSignatories += `
  <tr style='width:50%; margin-top:100px;'>   
    <td id="left" style="padding-top: 60px;padding-left: 45px; width:50%;font-family:${fontFamily}; font-size:0.2in; text-align:left">
      <div><img src="${props.organisationData.otherInformation[0].signatureImageUrl}" alt="Signature" style="height:100px; width:130px;"></div>
      <div style="margin-bottom: 20px;margin-top: 30px;">${props.organisationData.otherInformation[0].signatoryName}</div>
    </td>
  </tr>`;

                } else {
                  for (let i = 0; i < Math.max(contractSignatoryRowNoForOfficer?.length); i++) {
                    htmlContentForSignatories += `<tr style='width:100%; margin-top:100px;'>
    <td id="left_${i + 1
                      }" style="padding-top: 60px;width:50%; font-family:${fontFamily}; font-size:0.2in;text-align:left">
      <span style="color: white;"><^${contractSignatoryRowNoForOfficer[i]?.RowNo}_</span>${contractSignatoryRowNoForOfficer[i]
                        ? contractSignatoryRowNoForOfficer[i].firstName +
                        " " +
                        contractSignatoryRowNoForOfficer[i].lastName
                        : ""
                      }<span style="color: white;">^></span>
    </td>
   
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
  }, [props.templateElementList]);


  const modifiedPaymentGatewayType = props.paymentGatewayObj !== undefined && Utils.payment_gateway.map((option) => {
    // Check if GoCardless access token is invalid
    const isGoCardlessTokenInvalid =
      props.paymentGatewayObj.goCardlessAccessToken === null ||
      props.paymentGatewayObj.goCardlessAccessToken === undefined ||
      props.paymentGatewayObj.goCardlessAccessToken === "";

    // Check if Stripe keys are invalid
    const isStripeKeysInvalid =
      (props.paymentGatewayObj.stripePublishableKey === null ||
        props.paymentGatewayObj.stripePublishableKey === undefined ||
        props.paymentGatewayObj.stripePublishableKey === "") &&
      (props.paymentGatewayObj.stripeSecretKey === null ||
        props.paymentGatewayObj.stripeSecretKey === undefined ||
        props.paymentGatewayObj.stripeSecretKey === "");

    // Check if Bank Transfer details are invalid
    const isBankTransferInvalid =
      (props.paymentGatewayObj.AccountNumber === null ||
        props.paymentGatewayObj.AccountNumber === undefined ||
        props.paymentGatewayObj.AccountNumber === "") &&
      (props.paymentGatewayObj.bankTransferName === null ||
        props.paymentGatewayObj.bankTransferName === undefined ||
        props.paymentGatewayObj.bankTransferName === "") &&
      (props.paymentGatewayObj.sortCode === null ||
        props.paymentGatewayObj.sortCode === undefined ||
        props.paymentGatewayObj.sortCode === "");

    // Return the modified option based on conditions
    if (option.value === 3 && isGoCardlessTokenInvalid) {
      return { ...option, isDisabled: true }; // Disable GoCardless option
    } else if (option.value === 2 && isStripeKeysInvalid) {
      return { ...option, isDisabled: true }; // Disable Stripe option
    } else if (option.value === 4 && isBankTransferInvalid) {
      return { ...option, isDisabled: true }; // Disable Bank Transfer option
    } else {
      return { ...option, isDisabled: false }; // Otherwise, leave it enabled (false is default)
    }
  });


  return (
    <>
      <div
        style={{ padding: isMobile ? "" : "0px 0px 0px 34px" }}
        className="create-practice-height "
      >
        {/* <div className="tab-content"> */}
        <div style={{ height: isMobile ? "" : "54vh" }} className="tab-pane active">
          {MergePdfUrl && (
            isMobile ?
              <PdfViewer isVisible={false} pdfFile={MergePdfUrl} />
              :
              <iframe
                title="PDF Viewer"
                src={MergePdfUrl}
                // width="100%"
                // height="700px"
                style={{ width: '100%', height: '100vh', border: 'none' }}
              ></iframe>
          )}

          {/* </div> */}
        </div>
      </div>
      {props.moduleName === "Quote" && (
        <>
          <div className="row fieldset">
            {/* Format Label */}
            <div className="col-lg-2 col-md-2 col-sm-6 d-flex align-items-center mt-4">
              <label className="required mt-2">{proposalName} Format:</label>
              <span className="text-danger">*</span>
            </div>

            {/* Format Select */}
            <div className="col-lg-4 col-md-4 col-sm-6 d-flex align-items-center  mt-4">
              <Select
                menuPosition="auto"
                className="phone-input-country-code selectDropDown"
                options={Utils.PreviewSelection}
                onChange={handleFormate}
                value={ProposalFormatValue}
              />
              {props.requireMessage && (
                <span className="validation">{ERROR_MESSAGES}</span>
              )}
            </div>
            {props.ProposalObject.ProposalFormate === 1 && (
              <>
                {/* Payment Gateway Label */}
                <div className="col-lg-2 col-md-2 col-sm-6 mt-4">
                  <label className="form-label">Payment Gateway</label>
                  <span className="text-danger">*</span>
                </div>

                {/* Payment Gateway Select */}
                <div className="col-lg-4 col-md-4 col-sm-6">
                  <div className="d-flex flex-column align-items-end">
                    <button
                      style={{
                        fontSize: "12px",
                        border: "none",
                        background: "transparent",
                        color: "#626ed4",
                      }}
                      onClick={() => setISModalOpen(true)}
                      data-bs-toggle="modal"
                      data-bs-target="#paymentGatewayModel"
                    >
                      + Payment Gateway
                    </button>
                    <Select
                      className="phone-input-country-code selectDropDown"
                      value={Utils.payment_gateway.find(
                        (item) => props.ProposalObject.paymentGatewayID === item.value
                      )}
                      onChange={(e) => {
                        props.setProposalObject({
                          ...props.ProposalObject,
                          paymentGatewayID: e.value,
                        });
                      }}
                      options={modifiedPaymentGatewayType}
                    />
                    {/* Validation error message for Client */}
                    {props.requireMessage &&
                      (!props.ProposalObject.paymentGatewayID ||
                        props.ProposalObject.paymentGatewayID === "") && (
                        <span className="validation">{ERROR_MESSAGES}</span>
                      )}
                  </div>
                </div>
              </>
            )}

          </div>
        </>
      )}
      <div class="separator mt-3 mb-3"></div>

      {/* <div class="modal-footer"> */}

      <div class="row fieldset">
        <div class="col-lg-12 hstack gap-1 justify-content-end text-right mt-3">
          <div class="d-flex" style={{ overflowX: "auto" }}>
            {/* <div class="d-flex flex-row justify-content-end align-items-center overflow-auto custom-scroll"> */}
            <button
              class="btn btn-md btn-light mr-1 text-nowrap"
              onClick={() => props.handleCancelBtn()}
            >
              <span>Cancel</span>
            </button>
            {props?.ProposalObject?.selectedProposalTypeValue === 1 && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn text-nowrap"
                onClick={() => props.HandleTabChange(7)}
              >
                <span>Back</span>
              </button>
            )}
            {props.moduleName == "Contract" && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn  text-nowrap"
                onClick={() => props?.HandleBack(props.engagementObj.selectSourceId === 3 ? 7 : 4)}
              >
                <span>Back</span>
              </button>
            )}
            {(props?.ProposalObject?.selectedProposalTypeValue === 2) && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn  text-nowrap"
                onClick={() => props.HandleTabChange(7)}
              >
                <span>Back</span>
              </button>
            )}
            {props?.ProposalObject?.selectedProposalTypeValue === 3 && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn text-nowrap"
                onClick={() => props.HandleTabChange(6)}
              >
                <span>Back</span>
              </button>
            )}
            {props.moduleName == "Quote" && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn  text-nowrap"
                onClick={() =>
                  props.handleSaveAsDraft(
                    4,
                    moduleNameForSaveAsDraft,
                    statusIDForSaveAsDraft
                  )
                }
              >
                <span>Save as a Draft</span>
              </button>
            )}
            {props.moduleName == "Contract" && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn  text-nowrap"
                onClick={() => props.handleSaveAsDraft(2, statusID.Draft)}
              >
                <span>Save as a Draft</span>
              </button>
            )}

            {props.moduleName == "Quote" && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn  text-nowrap"

                onClick={() => {
                  if (!activeOrganizationSubscriptionPlan.sendQuote) {
                    setShowModal(true)
                    return
                  };
                  props.handleSaveAsDraft(
                    4,
                    moduleNameForSaveAsDraft,
                    statusIDForSendProposal
                  );
                }}

              >
                <span className="d-inline-flex align-items-center">
                  <span className="me-2">Send {proposalName}</span>
                  <i className="bi bi-send"></i>
                </span>
              </button>
            )}
            {common.enableEL == 1 &&
              userAccessData.Admin_Engagement_Latter_CanAdd &&
              userAccessData.Admin_Engagement_Latter_CanView &&
              props.moduleName == "Quote" && (
                <button
                  style={{ paddingTop: "5px", marginRight: "4px" }}
                  class="btn btn-md btn-success create-item-btn text-nowrap"

                  onClick={() => {
                    if (!activeOrganizationSubscriptionPlan.prepareContract) {
                      setShowModal(true)
                      return
                    };
                    props.handleSaveAsDraft(
                      4,
                      moduleNameForSaveAsDraft,
                      statusIDForSkipped
                    );
                  }}

                >
                  <span>Skip To {EngagementName}</span>
                </button>
              )}
            {props.moduleName == "Contract" && (
              <button
                style={{ paddingTop: "5px", marginRight: "4px" }}
                class="btn btn-md btn-success create-item-btn text-nowrap"
                onClick={() => {
                  if (!activeOrganizationSubscriptionPlan.sendContract) {
                    setShowModal(true)
                    return
                  };
                  props.HandleTabChange(5, statusIDForSendProposal);
                }}

              >
                <span className="me-2">Send {EngagementName}</span>
                <i className="bi bi-send"></i>
              </button>
            )}
          </div>
        </div>
        <ViewPlan
          showModal={showModal}
          handleCloseModel={() => setShowModal(false)}
          setShowModal={setShowModal}
          activeOrganizationKeyId={common.organisationKeyID}
        />
        <PaymentGatewayModel
          class="modal fade"
          id="paymentGatewayModel"
          tabindex="-1"
          aria_labelledby="paymentGatewayModel"
          aria_hidden="true"
          isModalOpen={isModalOpen}
          setISModalOpen={setISModalOpen}
          isAddUpdatePricingActionDone={props.isAddUpdatePricingActionDone}
          setIsAddUpdatePricingActionDone={props.setIsAddUpdatePricingActionDone}
        />
      </div>
    </>
  );
}
