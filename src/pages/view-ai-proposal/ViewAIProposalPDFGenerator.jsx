import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { generatePdfUrl, mergePdfApiUrl } from "../../Base-Url/Base_Url";

export default function ViewAiProposalPdfGenerator({
  children,
  userKeyID,
  moduleName = "Quote",
  proposalName = "AI Proposal",
  email = "",
  phone = "",
  fullAddress = "",
  webSite = "",
  brandColor = "#00BFFF",
  brandLogo = "",
  fontFamily = "Arial, sans-serif",
  proposalData = null,
  onPdfGenerated,
}) {
  const [loading, setLoading] = useState(false);

  const removeAcceptButtonFromPdfHtml = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const links = doc.querySelectorAll("a");

    links.forEach((link) => {
      const text = link.textContent?.trim()?.toLowerCase();

      if (text === "accept") {
        const row = link.closest("tr");

        if (row) {
          row.remove();
        } else {
          link.remove();
        }
      }
    });

    return doc.body.innerHTML;
  };

  const wrapHtmlSection = (title, htmlContent) => {
    if (!htmlContent) return null;

    return {
      textbox: `
      <style>
        .ai-pdf-section ul {
          margin: 6px 0 10px 18px !important;
          padding-left: 14px !important;
        }

        .ai-pdf-section li {
          font-size: 14px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
          margin: 4px 0 !important;
        }

        .ai-pdf-section li::marker {
          font-size: 11px !important;
          color: #555 !important;
          font-weight: normal !important;
        }

        .ai-pdf-section p {
          margin: 6px 0 !important;
          line-height: 1.5 !important;
        }
      </style>
        <div style="padding:40px;font-family:${fontFamily};">
          <div style="color:${brandColor};font-size:0.2in;font-weight:bold;">
            ${title}
            <br />
            <hr style="color:black;" />
          </div>

          <div style="margin-top:15px;">
            ${htmlContent}
          </div>
        </div>
      `,
    };
  };

  const generateViewAiProposalPdf = async () => {
    try {
      setLoading(true);

      const rawHtmlString = ReactDOMServer.renderToString(children);
      const htmlString = removeAcceptButtonFromPdfHtml(rawHtmlString);

      const pdfSections = [
        {
          textbox: `
            <div style="padding:40px;font-family:${fontFamily};">
              ${htmlString}
            </div>
          `,
        },

        wrapHtmlSection(
          "Service Description",
          proposalData?.serviceDescription,
        ),

        wrapHtmlSection("Statement Of Facts", proposalData?.statementOfFacts),
      ].filter(Boolean);

      const postData = {
        userId: userKeyID,
        email,
        mobile: phone,
        fullAddress,
        webSite,
        headingforpage: proposalName,
        genratedPdfData: pdfSections,
        sequence: 1,
        lengthPdf: pdfSections.length,
        color: brandColor,
        BrandLogo: brandLogo,
        fontSizeContent: "0.18in",
        fontFamily,
        HeaderContent: null,
        FooterContent: null,
        HeaderImage: null,
        FooterImage: null,
        HeaderHeight: null,
        FooterHeight: null,
        WatermarkImage: null,
        showSeparatorLines: false,
        landscapeMode: false,
        headerFooterFirstPage: null,
        headerFooterLastPage: null,
      };

      const pdfResponse = await fetch(generatePdfUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const pdfData = await pdfResponse.json();

      if (!pdfResponse.ok) {
        throw new Error(pdfData?.message || "PDF generation failed");
      }

      const mergeResponse = await fetch(mergePdfApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userKeyID,
          moduleName,
        }),
      });

      const mergeData = await mergeResponse.json();

      if (!mergeData?.success) {
        throw new Error(mergeData?.message || "PDF merge failed");
      }

      const pdfUrl = mergeData.s3Url;

      onPdfGenerated?.(pdfUrl);
      window.open(pdfUrl, "_blank");

      return pdfUrl;
    } catch (error) {
      console.error("View AI Proposal PDF Error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generateViewAiProposalPdf}
      disabled={loading}
      style={{
        backgroundColor: brandColor,
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Generating..." : "View PDF"}
    </button>
  );
}
