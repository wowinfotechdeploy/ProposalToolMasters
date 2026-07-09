import React, { useContext } from "react";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";

const FeeInflationTab = (props) => {
  const { isMobile } = useContext(AuthContextProvider);
  const { servicesObj, handleDeleteFeeInflation } = props;

  return (
    <>
      <div className="create-practice-height scrollbar">
        <div className="tab-content mt-2">
          <div className="row">
            <div style={{ padding: isMobile && "0px" }} className="col-xl-12 col-lg-12">
              {servicesObj?.pricingTypeID === 2 &&
                servicesObj?.serviceFeeInflationList?.length > 0 &&
                servicesObj.serviceFeeInflationList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      id={`feeInflation${item.inflationIndex}`}
                      className="card-1 pricing-box p-4 mt-3"
                    >
                      <div className="gpd-title text-nowrap mt-2">
                        Fee Inflation Index {item.inflationIndex}
                      </div>
                      <button
                        className="btn btn-sm btn-danger gpd-title-1 left-responsive"
                        onClick={() => handleDeleteFeeInflation(item.serviceID, item.inflationIndex)}
                      >
                        <i
                          className="bi bi-trash3 margin-right"
                          style={{ marginRight: isMobile ? "0px" : "5px" }}
                        ></i>
                        <span className="d-none d-sm-inline-block">Delete Inflation</span>
                      </button>
                      <div className="modal-body">
                        <div className="tab-content">
                          <div className="row" id={`FeeInlfation_${item.inflationIndex}`}>
                            <div className="col-lg-6">
                              <label className="form-label">Operator</label>
                              <div className="input-group input-height">
                                <input className="input-text" type="text" value={item.operator} disabled />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">Value</label>
                              <div className="input-group input-height">
                                <input className="input-text" type="text" value={item.value} disabled />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="separator"></div>
        <div className="row fieldset modal-footer">
          <div className="col-lg-12 hstack gap-2 justify-content-end text-right mt-3">
            <button className="btn btn-md  btn-light" onClick={() => props.handleCancelButton()}>
              <span>{props.getCrudButtonTextName("Cancel")}</span>
            </button>
            <button
              onClick={() => props.handleBackButton(props.ServiceHeader.PricingDrivers)}
              style={{ paddingTop: "5px", marginRight: "4px" }}
              className="btn btn-md btn-success create-item-btn"
            >
              <span>Back</span>
            </button>
            <button
              className="btn btn-md btn-success create-item-btn"
              onClick={() => props.GlobalPricingDriverAddUpdateBtnClicked(props.ServiceHeader.PricingFormula)}
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeeInflationTab;
