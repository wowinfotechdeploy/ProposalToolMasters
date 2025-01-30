import React from "react";
import { Detector } from "react-detect-offline";
import Img from "../assets/images/internetdis.png";
const CheckConnection = (props) => {
  return (
    <Detector
      render={({ online }) =>
        online ? (
          props.children
        ) : (
          <>
            <div
              style={{
                display:"flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <img
                src={Img}
                alt="internetDisConnect"
                style={{ width: "100px" }}
              />
              <h1 style={{ marginBottom: "5px" }}>No Connection</h1>
              <h4 style={{ margin: "0px" }}>
                You are not connected to the internet
              </h4>
            </div>
          </>
        )
      }
    />
  );
};

export default CheckConnection;
