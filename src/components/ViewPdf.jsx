import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GetQuoteContractViewPDFurl } from "../redux/Services/Proposal/ProposalApi";
import { AuthContextProvider } from "../AuthContext/AuthContext";
import { useSelector } from "react-redux";
import PdfViewer from "./PdfViewers";

const ViewPdf = () => {
  const location = useLocation();

  const { setLoader, setTopbar, isMobile } = useContext(AuthContextProvider);
  const [MergePdfUrl, setMergePdfUrl] = useState("");
  const common = useSelector((state) => state.Storage);
  useEffect(() => {
    setTopbar("none");
    if (location?.state?.quoteKeyID === undefined && location?.state?.contractKeyID === undefined) {
      setMergePdfUrl(location?.state);
    }
    if (location?.state?.quoteKeyID) {
      const { ModuleName, quoteKeyID } = location.state;
      getQuoteContractViewPDFurlData(
        common.userKeyID,
        common.organisationKeyID,
        ModuleName,
        quoteKeyID
      );
    }
    if (location?.state?.contractKeyID) {
      const { ModuleName, contractKeyID } = location.state;
      getQuoteContractViewPDFurlData(
        common.userKeyID,
        common.organisationKeyID,
        ModuleName,
        contractKeyID
      );
    }
  }, [location.state]);

  const getQuoteContractViewPDFurlData = async (
    userKeyID,
    organisationKeyID,
    ModuleName,
    quoteKeyID
  ) => {
    setLoader(true);
    try {
      const response = await GetQuoteContractViewPDFurl(
        userKeyID,
        organisationKeyID,
        ModuleName,
        quoteKeyID
      );
      const data = response.data;

      if (data.statusCode === 200) {
        setLoader(false);
        const pdfUrl = data.responseData.data;
        setMergePdfUrl(pdfUrl);
      } else {
        console.error("Error fetching data from the API");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API", error);
      setLoader(false);
    }
  };

  return (
    <>
      {MergePdfUrl && (
        isMobile ?
          <PdfViewer isVisible={true} pdfFile={MergePdfUrl} />
          :
          <iframe
            title="PDF Viewer"
            src={MergePdfUrl}
            // width="100%"
            // height="700px"
            style={{ width: '100%', height: '100vh', border: 'none' }}
          ></iframe>
      )}
    </>
  );
};

export default ViewPdf;
