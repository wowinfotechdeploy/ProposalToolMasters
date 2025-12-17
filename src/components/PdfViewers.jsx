import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// // 👇 Set workerSrc properly using pdfjs version and CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfFile, isVisible }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = () => {
    console.error("Error loading document.");
  };

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFile.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-container">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<span>Loading...</span>}
      >
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={window.innerWidth}
              loading={<span>Loading page...</span>}
            />
          ))}
      </Document>
      {isVisible && (
        <div className="sticky-download-button">
          <button
            className="btn btn-md btn-success create-item-btn"
            onClick={downloadPdf}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
