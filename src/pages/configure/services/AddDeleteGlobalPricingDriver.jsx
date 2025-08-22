import React, { useContext, useEffect, useState } from "react";
import "./ServiceStyle.css";
import {
  GetGlobalPricingDriverListForServices,
  GetGlobalPricingDriverModel,
} from "../../../redux/Services/Config/GlobalPricingDriverApi";
import { useSelector } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import Tooltip from "@mui/material/Tooltip";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";

function AddDeleteGlobalPricingDriverModal(props) {
  const { isMobile, scrollUpDownByElementID } = useContext(AuthContextProvider);
  // A] States Declaration :
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState("");
  const [globalPricingDriverList, setGlobalPricingDriverList] = useState([]);
  const common = useSelector((state) => state.Storage); //Getting Logged Users Details From Persist Storage of redux hooks

  // B] Initial useEffect :
  // 1) Will Call Initial Api Like List Api
  useEffect(() => {
    GetGlobalPricingDriverListData();
  }, []);

  // C] Calling All Api's like List and other Here :
  // 1) Get Global Pricing Driver List Data
  const GetGlobalPricingDriverListData = async (i) => {
    try {
      const response = await GetGlobalPricingDriverListForServices({
        userKeyID: common.userKeyID,
        organisationKeyID: common.organisationKeyID,
      });

      if (response) {
        if (response?.data?.statusCode === 200) {
          if (response?.data?.responseData?.data) {
            const totalCount = response.data.totalCount;
            const ServiceCategoryListData = response.data.responseData.data;
            setGlobalPricingDriverList(ServiceCategoryListData);
          }
        } 
      }
    } catch (error) {
      console.log(error);
    }
  };

  // D] handle Function
  const HandleDeleteClick = (index) => {
    const updatedGlobalPricingDrivers = [...props.pricingDriver];
    const itemIndex = updatedGlobalPricingDrivers.findIndex(
      (item) =>
        item.parentGlobalPricingDriverKeyID === index.globalPricingDriverKeyID
    );
    if (itemIndex !== -1) {
      updatedGlobalPricingDrivers.splice(itemIndex, 1);
      props.setPricingDriver(updatedGlobalPricingDrivers);
    }
  };
// Handle Add
  const HandleAdd = async (i) => {
    setId(i.globalPricingDriverKeyID);
    setLoader(true);
    const response = await GetGlobalPricingDriverModel(
      i.globalPricingDriverKeyID
    );
    if (response) {
      setLoader(false);
      const GetGlobalPricingDriverData = response?.data?.responseData?.data;
      const SetGlobalPricingDriverData = {
        userKeyID: common.userKeyID,
        globalPricingDriverID: null,
        globalPricingDriverKeyID: null,
        parentGlobalPricingDriverKeyID:
          GetGlobalPricingDriverData?.globalPricingDriverKeyID,
        driverName: GetGlobalPricingDriverData?.driverName,
        driverTypeID: GetGlobalPricingDriverData?.driverTypeID,
        isPredefined: null,
        temp_GlobalPricingDriverID_ForDependancy:
          props.pricingDriver.length === 0 ? 1 : props.pricingDriver.length + 1,
        dependsOn_DriverId: null,
        dependsOn_GlobalPricingDriverKeyID: null,
        dependant_OnDriverId: [],
        dependsOn_VariationID: null,
        dependsOn_VariationKeyID: null,
        dependant_GlobalPricingDriverKeyID: null,
        addedFor: "Services",
        variation: GetGlobalPricingDriverData?.variation
          ? GetGlobalPricingDriverData?.variation?.map((i, index) => ({
              isDefault: i.isDefault,
              parentVariationKeyID: i.variationKeyID,
              variationID: null,
              variationKeyID: null,
              temp_VariationID_ForDependancy: index + 1,
              variationName: i.variationName,
              variationValue: i.variationValue,
            }))
          : null,
        slab: GetGlobalPricingDriverData?.slab
          ? GetGlobalPricingDriverData.slab.map((item, index) => ({
              slabKeyID: null,
              parentSlabKeyID: item.slabKeyID,
              slabTypeID: item.slabTypeID,
              slabTypeName: item.slabTypeName,
              slabValue: item.slabValue,
              slabFrom: item.slabFrom,
              slabTo: item.slabTo,
              isDefault: item.isDefault,
            }))
          : null,
        text: GetGlobalPricingDriverData?.text
          ? GetGlobalPricingDriverData.text.map((item, index) => ({
              textKeyID: null,
              parentTextKeyID: item.textKeyID,
              textLength: item.textLength,
              textValue: item.textValue,
              allowedSpecialCharacters: item.allowedSpecialCharacters,
            }))
          : null,
        date: GetGlobalPricingDriverData?.date
          ? GetGlobalPricingDriverData.date.map((item) => ({
              dateKeyID: null,
              dateFormat: item.dateFormat,
              defaultDateValue: item.defaultDateValue,
              blocks: item.blocks
                ? item.blocks.map((block) => ({
                    dateKeyID: null,
                    parentDateKeyID: block.dateKeyID,
                    fromDate: block.fromDate,
                    toDate: block.toDate,
                    dateValue: block.dateValue,
                    isDefault: block.isDefault ?? null,
                  }))
                : [],
            }))
          : null
      };
      const updatedArray = [...props.pricingDriver, SetGlobalPricingDriverData];
      props.setPricingDriver(updatedArray);
      props.setAddGBP(true);
      setTimeout(function () {
        scrollUpDownByElementID(`Driver_${props.pricingDriver.length}`);
      }, 200);
    }
  };

  //Design part :
  return (
    <div>
      <div
        class={props.class}
        id={props.id}
        tabIndex={props.tabIndex}
        aria-labelledby={props.aria_labelledby}
        aria-hidden={props.aria_hidden}
      >
        <div class="modal-dialog modal-md">
          <div class="modal-content">
            <div class="modal-header bg-light p-3">
              <h5
                class="modal-title"
                style={{ marginLeft: "14px" }}
                id="addDeleteGlobalPricingDriver"
              >
                {props.title}
              </h5>
              <button
                style={{
                  position: "absolute",
                  right: "2.3rem",
                }}
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close-modal"
              ></button>
            </div>

            <div class="container-fluid margin-lr ">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card ">
                    <div class="card-body">
                      <div id="customerList">
                        <div class="row g-4 mb-3"></div>

                        <div class="table-responsive table-card  mb-1 table-padding Scroll_GlobalP_Driver">
                          <table
                            class="table align-middle table-nowrap"
                            id="customerTable"
                          >
                            <thead class="table-light">
                              <tr className="head-row">
                                <td
                                  colSpan={2}
                                  style={{
                                    color: "#ffffff",
                                    background: "#343a40",
                                    fontWeight: "600",
                                  }}
                                >
                                  Driver Name
                                </td>

                                <td
                                  colSpan={2}
                                  style={{
                                    color: "#ffffff",
                                    background: "#343a40",
                                    fontWeight: "600",
                                  }}
                                >
                                  Type
                                </td>
                              </tr>
                            </thead>
                            <tbody class="list form-check-all">
                              {globalPricingDriverList.map((i, index) => {
                                return (
                                  <tr class="table_new" key={index}>
                                    <td>
                                      {isMobile ? (
                                        <>
                                          {i.driverName.length > 20
                                            ? i.driverName.substring(0, 20) +
                                              "..."
                                            : i.driverName}
                                        </>
                                      ) : (
                                        <>
                                          {i.driverName.length > 30 ? (
                                            <Tooltip title={i.driverName}>
                                              {i.driverName.substring(0, 30) +
                                                "..."}
                                            </Tooltip>
                                          ) : (
                                            <>{i.driverName}</>
                                          )}
                                        </>
                                      )}
                                    </td>

                                    <td>&nbsp;&nbsp;</td>
                                    <td>{i.driverType}</td>
                                    <td class="table_left">
                                      <div class="d-flex gap-2">
                                        {props.pricingDriver?.some(
                                          (item) =>
                                            item.parentGlobalPricingDriverKeyID ===
                                            i.globalPricingDriverKeyID
                                        ) ? (
                                          <div class="remove">
                                            <button
                                              onClick={() =>
                                                HandleDeleteClick(i)
                                              }
                                              class="btn btn-sm btn-danger"
                                            >
                                                <i class="bi bi-trash3-fill"></i>
                                            </button>
                                          </div>
                                        ) : (
                                          <div class="remove">
                                            <button
                                              class="btn btn-sm btn-dark"
                                              onClick={() => HandleAdd(i)}
                                            >
                                              {id ===
                                                i.globalPricingDriverKeyID &&
                                              loader ? (
                                                <RotatingLines
                                                  strokeColor="grey"
                                                  strokeWidth="3"
                                                  animationDuration="0.75"
                                                  width="13"
                                                  visible={true}
                                                />
                                              ) : (
                                                <i class="bi bi-plus"></i>
                                                )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div class="noResult" style={{ display: "none" }}>
                            <div class="text-center">
                              <lord-icon
                                src="https://cdn.lordicon.com/msoeawqm.json"
                                trigger="loop"
                                colors="primary:#121331,secondary:#08a88a"
                                style={{ width: "75px", height: "75px" }}
                              ></lord-icon>
                              <h5 class="mt-2">Sorry! No Result Found</h5>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal  */}
            </div>

            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDeleteGlobalPricingDriverModal;
