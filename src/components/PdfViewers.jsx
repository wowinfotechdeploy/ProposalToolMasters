import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfViewer = ({ pdfFile, isVisible }) => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onDocumentLoadError = () => {
        console.error("Error loading document."); // Log error if needed
    };

    const downloadPdf = () => {
        const link = document.createElement('a');
        link.href = pdfFile; // Use the URL of the PDF file
        link.download = pdfFile.split('/').pop(); // Extract filename from the URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-container">
            <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError} // Handle load error
                loading={false}
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={window.innerWidth} // Set width to window width for responsiveness
                        loading={false}
                    />
                ))}
            </Document>
            {isVisible && (
                <div className="sticky-download-button">
                    <button className="btn btn-md btn-success create-item-btn" onClick={downloadPdf}>
                        Download
                    </button>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
