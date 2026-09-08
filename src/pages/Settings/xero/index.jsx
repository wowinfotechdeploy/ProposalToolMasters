import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConnectionAuthentication } from "../../../redux/Services/Xero/XeroApi";
import AuthButton from "../../../components/Sidebar/AuthenticationButton";
import {
  DisconnectIntegration,
  GetAllMetricsList,
} from "../../../redux/reducer/quickBookSlice";
import ErrorModel from "../../../components/ErrorModel";
import { AuthContextProvider } from "../../../AuthContext/AuthContext";
import "./Xero.css";
import { getActivePlatform } from "../../../lib/utils";
import {
  quickBooksConnectionStatus,
  xeroConnectionStatus,
} from "../../../redux/reducer/authSlice";
import {
  GetAllDrivers,
  GetMetricMappings,
} from "../../../redux/reducer/metricsSlice";
import MappingUI from "./components/MetricsMapping";

function XeroAuthentication() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.Storage);
  const drivers = useSelector((state) => state.metric.drivers);
  const metrics = useSelector((state) => state.quickBook.metrics);
  const metricMappings = useSelector((state) => state.metric.metricMappings);
  const activePlatform = getActivePlatform();

  //=====================state========================
  const { handleErrorMessage } = useContext(AuthContextProvider);
  const [errorMessage, setErrorMessage] = useState("");
  const formattedErrorMessage = handleErrorMessage(errorMessage);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  //==================UseEffect=====================
  useEffect(() => {
    dispatch(GetAllDrivers(auth?.organisationKeyID));
    dispatch(GetAllMetricsList());
    dispatch(GetMetricMappings(auth?.organisationKeyID));
  }, [dispatch, auth?.organisationKeyID]);

  //==================functions=====================
  const handleAuthenticate = async () => {
    try {
      const raw = JSON.parse(localStorage.getItem("persist:Proposal Tool"));
      const organisationKeyID = JSON.parse(raw.organisationKeyID);
      const res = await ConnectionAuthentication(
        organisationKeyID,
        activePlatform || "Xero",
      );

      if (res?.status === 200) {
        const url = res.data.connectionUrl;
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setOpenErrorModal(true);
        setErrorMessage(res.response.data.message);
      }
    } catch (err) {
      console.error(err);
      setOpenErrorModal(true);
      setErrorMessage("Something went wrong");
    } finally {
      const modalEl = document.getElementById("ConfirmModel");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);

        modalInstance.hide();
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await dispatch(
        DisconnectIntegration({
          organisationKeyID: auth?.organisationKeyID,
          activePlatform,
        }),
      ).unwrap();

      dispatch(xeroConnectionStatus(auth?.organisationKeyID));
      dispatch(quickBooksConnectionStatus(auth?.organisationKeyID));
      window.location.reload();
    } catch (err) {
      console.error(err);
      setOpenErrorModal(true);
      setErrorMessage(err || "Something went wrong");
    } finally {
      const modalEl = document.getElementById("ConfirmModel");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);

        modalInstance.hide();
      }
    }
  };

  const handleClose = () => {
    setOpenErrorModal(false);
  };

  return (
    <div className="xero-auth-page">
      {/* HEADER */}
      <div className="xero-auth-header">
        <div className="xero-auth-heading">
          <h4 className="xero-auth-title">Xero Driver Mapping</h4>
          <p className="xero-auth-subtitle">
            Configure your proposal engine data sources from Xero.
          </p>
        </div>

        <div className="xero-auth-actions">
          <AuthButton
            onAuthenticate={handleAuthenticate}
            onDisconnect={handleDisconnect}
            activePlatform={activePlatform}
            activeBtn={activePlatform == "Xero" ? true : false}
            moduleName="Xero"
            tooltipLabel="Authenticate Xero"
            key={getActivePlatform()}
          />
        </div>
      </div>

      {/* MAPPING */}
      <div className="xero-auth-body">
        <MappingUI
          drivers={drivers}
          metrics={metrics}
          metricMappings={metricMappings}
        />
      </div>

      {/* ERROR MODAL */}
      <ErrorModel
        ErrorModel={openErrorModal}
        handleClose={handleClose}
        ErrorMessage={formattedErrorMessage}
      />
    </div>
  );
}

export default XeroAuthentication;
