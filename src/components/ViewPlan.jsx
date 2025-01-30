import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import errorImage from "../assets/images/gif/wired-outline-1140-error.gif";
import { ChoosePlanApi } from "../redux/Services/Setting/PaymentGatewayApi";

import { useNavigate } from "react-router-dom";
function ViewPlan(props) {
  const navigate = useNavigate();
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [chooseApiData, setChooseApiData] = useState([]);
  // const handleRedirectSubscription = async () => {
  //   props.setShowModal(false);
  //   await ChoosePlanApiModelData();
  //   setOpenPurchaseModal(true);
  // };
  const handleRedirectSubscription = async () => {
    props.setShowModal(false);
    await ChoosePlanApiModelData();
    navigate("/ChoosePlan", {
      state: { organizationKeyId: props.activeOrganizationKeyId },
    });
  };
  const handleClosePurchaseModel = () => {
    setOpenPurchaseModal(false);
  };
  const handleCloseModel = () => {
    props.setShowModal(false);
  };
  const ChoosePlanApiModelData = async () => {
    try {
      const data = await ChoosePlanApi();
      if (data?.data?.statusCode === 200) {
        if (data?.data?.responseData?.data) {
          const ModelData = data?.data?.responseData?.data;
          setChooseApiData(ModelData);
        }
      } else {
        // setErrorMessage(data?.data?.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const GetPlanList = () => {
    // Functionality to get plan list
  };
  return (
    <>
      <Modal
        show={props.showModal}
        // onHide={handleCloseModel}
        centered
        size="md"
      >
        <Modal.Header >

          <h6>Upgrade Plan</h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              handleCloseModel();

            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <img src={errorImage} alt="error_Img" height="70px" width="70px" />
          </div>
          <p className="text-center mb-3">
            This feature is not available with your current subscription. Please upgrade to access it.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCloseModel}
            type="button"
            class="btn btn-md btn-light cancel-item-btn"
            data-bs-dismiss="modal"
          ></button>
          <Button
            type="button"
            className="btn btn-md btn-success create-item-btn p-8"
            onClick={handleRedirectSubscription}
          >
            View Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ViewPlan;
