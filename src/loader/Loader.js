import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Loader.css";
import { Backdrop } from "@mui/material";

const Loader = () => {
  const [open, setOpen] = useState(true);

  return (
    <Backdrop
      sx={{
        color: "#00AFEF",
        backgroundColor: "#ffffff40",
        zIndex: (theme) =>
          theme.zIndex.drawer < theme.zIndex.modal
            ? theme.zIndex.modal + 1
            : theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
