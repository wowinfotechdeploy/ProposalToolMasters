import React from "react";
import Tooltip from "@mui/material/Tooltip";

//Add Common Button
const CommonButtonComponent = ({
  name,
  onclick,
  AddBtn,
  dataBsTarget,
  data_bs_toggle,
  title,
}) => {
  return (
    <div class="text-right flex1" onClick={onclick}>
      <Tooltip title={title}>
        <button
          className="btn btn-md btn-success create-item-btn"
          onClick={AddBtn}
          data-bs-target={dataBsTarget}
          data-bs-toggle={data_bs_toggle}
        >
          <i className="bi bi-plus-circle "></i>
          <span className="d-none d-sm-inline"> {name}</span>
          <span className="d-inline d-sm-none"> Add</span>
        </button>
      </Tooltip>
    </div>
  );
};

export default CommonButtonComponent;
