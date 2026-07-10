/* global $ */
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import { GetDeviationList } from "../../../redux/Services/Setting/DeviationApi";

const Deviation = () => {
    const { setLoader } = useContext(AuthContextProvider);
    const common = useSelector((state) => state.Storage);

    const [data, setData] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoader(true);

                const res = await GetDeviationList(common.organisationKeyID);

                const list =
                    Array.isArray(res)
                        ? res
                        : Array.isArray(res?.data)
                            ? res.data
                            : [];

                setData(list);

            } catch (err) {
                console.error(err);
            } finally {
                setLoader(false);
            }
        };

        if (common.organisationKeyID) fetchData();
    }, [common.organisationKeyID]);

    // Load More Handler
    const handleLoadMore = () => {
        setLoadingMore(true);

        setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setLoadingMore(false);
        }, 500); // small delay for spinner UX
    };

    return (
        <div className="container-fluid">
            <div className="services page-background">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">

                            <div className="card-body mb-2">
                                <div id="customerList" style={{ marginTop: "3rem" }}>
                                    <div className="bg-light border-bottom px-2">
                                        <div className="row">
                                            <div className="col-md-6 p-0">
                                                <div className="page-title-cls">Deviation</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="tablesections">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="card">
                                                <div className="card-body">

                                                    <div className="table-responsive table-card mt-2 mb-3 table-padding">
                                                        <table className="table align-middle table-nowrap">
                                                            <thead className="table-light table-header-font">
                                                                <tr className="head-row">
                                                                    <td className="tr-table-class text-white">Name</td>
                                                                    <td className="tr-table-class text-white">Profession Type</td>
                                                                    <td className="tr-table-class text-white">Original Price</td>
                                                                    <td className="tr-table-class text-white">Default Price</td>
                                                                    <td className="tr-table-class text-white">Minimum Price</td>
                                                                    <td className="tr-table-class text-white">Status</td>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="list form-check-all">
                                                                {Array.isArray(data) &&
                                                                    data.slice(0, visibleCount).map((item, index) => (
                                                                        <tr key={index} className="table_new table-content-font">
                                                                            <td>{item.servicePackageName}</td>
                                                                            <td>{item.professionTypeNames}</td>
                                                                            <td>
                                                                                <div>Recurring: <b>{item.recurringOriginalPrice}</b></div>
                                                                                <div>One Off: <b>{item.oneOffOriginalPrice}</b></div>
                                                                            </td>
                                                                            <td>
                                                                                <div>Recurring: <b>{item.recurringDefaultPrice}</b></div>
                                                                                <div>One Off: <b>{item.oneOffDefaultPrice}</b></div>
                                                                            </td>
                                                                            <td>
                                                                                <div>Recurring: <b>{item.recurringMinPrice}</b></div>
                                                                                <div>One Off: <b>{item.oneOffMinPrice}</b></div>
                                                                            </td>
                                                                            <td>{item.statusName}</td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>
                                                        </table>

                                                        {/* NO DATA */}
                                                        {Array.isArray(data) && data.length === 0 && (
                                                            <div className="text-center py-3">
                                                                No records found
                                                            </div>
                                                        )}

                                                        {/* LOAD MORE */}
                                                        {Array.isArray(data) && visibleCount < data.length && (
                                                            <div className="text-center my-3">
                                                                <button
                                                                    className="btn btn-success create-item-btn"
                                                                    onClick={handleLoadMore}
                                                                    disabled={loadingMore}
                                                                >
                                                                    {loadingMore ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                                            Loading...
                                                                        </>
                                                                    ) : (
                                                                        "Show More"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deviation;


// /* global $ */
// import React, { useContext, useEffect, useState } from "react";
// import CommonButtonComponent from "../../../components/CommonButtonComponent";
// import { useNavigate } from "react-router";
// import Android12Switch from "../../../components/AndroidSwitch";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
// import { AuthContextProvider } from "../../../AuthContext/AuthContext";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     CopyPackage,
//     GetPackageList,
//     GetServicePackageModel,
//     ServicePackageChangeStatus,
//     ServicePackageDelete,
// } from "../../../redux/Services/Config/PackageApi";
// import PaginationComponent from "../../../components/PaginationModel";
// import NoResultFoundModel from "../../../components/NoResultFoundModel";
// import ErrorModel from "../../../components/ErrorModel";
// import ConfirmModel from "../../../components/ConfirmationBox";
// import SuccessModal from "../../../components/SuccessModal";
// import Footer from "../../../components/Footer";
// import RecordsAvailablePopupModel from "../../../components/RecordsAvailablePopupModel";
// import { updateState } from "../../../redux/Persist";
// import FilterModel from "../../../components/FilterModel";
// import { GetDeviationList } from "../../../redux/Services/Setting/DeviationApi";


// const Deviation = () => {
//     //const
//     const moduleName = "Deviation";

//     //auth context
//     const {
//         setLoader,
//         setTopbar,
//         isMobile,
//         setListCount,
//         listCount,
//         desktopRecords,
//         isMobileRecords,
//         getCrudButtonTextName,
//         getPlaceholderTextName,
//         getCrudButtonToolTipName,
//         userAccessData,
//         EngagementName,
//         proposalName,
//         handleErrorMessage,
//         formatValue,
//     } = useContext(AuthContextProvider);

//     //redux state
//     const common = useSelector((state) => state.Storage);
//     //state
//     const [totalRecords, setTotalRecords] = useState(-1);
//     const [openErrorModal, setOpenErrorModal] = useState(false);

//     //useEffect

//     useEffect(() => {
//         async function fetchData() {
//             const res = GetDeviationList(common.organisationKeyID);

//         }

//         if (common.organisationKeyID) fetchData()
//     }, [])

//     return (
//         <>
//             <div className="container-fluid">
//                 {/* <div class="main-content"> */}
//                 <div class="services page-background">
//                     <div class="">
//                         <div class="row">
//                             <div class="col-lg-12">
//                                 <div class="card">
//                                     {/* end card header  */}
//                                     <div class="card-body mb-2">
//                                         <div id="customerList" style={{ marginTop: "3rem" }}>
//                                             <div class="bg-light border-bottom px-2">
//                                                 <div className="row">
//                                                     <div className="col-md-6 p-0 ">
//                                                         <div class="page-title-cls">Deviation</div>
//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="" id="tablesections">
//                                             <div class="row">
//                                                 <div class="col-lg-12">
//                                                     <div class="card">
//                                                         {/* end card header  */}
//                                                         <div class="card-body">
//                                                             <div id="customerList">
//                                                                 <div class="row g-4 mb-3"></div>
//                                                                 <div class="table-responsive table-card mt-2 mb-3 table-padding">
//                                                                     <table
//                                                                         class="table align-middle table-nowrap"
//                                                                         id="customerTable"
//                                                                     >
//                                                                         <thead class="table-light table-header-font">
//                                                                             <tr className="head-row">
//                                                                                 <td
//                                                                                     className="tr-table-class text-white"
//                                                                                     style={{ width: "20%" }}
//                                                                                 >
//                                                                                     Name{" "}

//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white profession-type-column">
//                                                                                     {true && <>Profession Type</>}
//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white">
//                                                                                     Original Price
//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white">
//                                                                                     Default Price
//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white">
//                                                                                     Minimum Price
//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white">
//                                                                                     Status
//                                                                                 </td>
//                                                                                 <td className="tr-table-class text-white">

//                                                                                 </td>
//                                                                             </tr>
//                                                                         </thead>
//                                                                         <tbody class="list form-check-all">

//                                                                         </tbody>
//                                                                     </table>

//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         {/* end card  */}
//                                                     </div>
//                                                     {/* end col */}
//                                                 </div>
//                                                 {/* end col  */}
//                                             </div>

//                                             {/* end row */}
//                                         </div>
//                                         {/* container-fluid  */}
//                                     </div>
//                                     {/* End Page-content */}

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* start back-to-top */}
//                 <button
//                     onclick="topFunction()"
//                     class="btn btn-danger btn-icon"
//                     id="back-to-top"
//                 >
//                     <i class="ri-arrow-up-line"></i>
//                 </button>
//                 {/* end back-to-top */}
//             </div>
//         </>
//     );
// };



// export default Deviation
