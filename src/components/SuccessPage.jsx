import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContextProvider } from "../AuthContext/AuthContext";

const SuccessPage = () => {

  const {
    setActiveOrganizationSubscriptionPlan,
    setIsAddUpdatePurchaseDone
  } = useContext(AuthContextProvider);
  useEffect(() => {
    localStorage.removeItem("OrganisationLocalList");
    // localStorage.removeItem("subscriptionPlan");
    localStorage.removeItem("subscriptionPlan");

    // Reset the activeOrganizationSubscriptionPlan state to null
    setActiveOrganizationSubscriptionPlan(null);
    setIsAddUpdatePurchaseDone(true)
  }, []);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Thank you!</h1>
      <div className="modallogo">
        <div className=""></div>
        <span className="modallogo2"></span>
        <span className="modallogo3"></span>
        <div className="modallogo4"></div>
        <div className=""></div>
        <div className=""></div>
      </div>
      <div
        className="alert alert-success"
        role="alert"
        style={{ textAlign: "center" }}
      >
        Thank you for your purchase! Your payment was processed successfully.
      </div>
      <div style={{ textAlign: "center" }}>
        <br />
        <Link
          to="/mySubscription"
          className="btn btn-md btn-success create-item-btn"
        >
          Go to My Subscription
        </Link>
        &nbsp;|&nbsp;
        <Link to="/" className="btn btn-md btn-success create-item-btn">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
