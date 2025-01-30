import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Loader.css";
import { Backdrop } from "@mui/material";

const LoginPageLoader = () => {
    const [open, setOpen] = useState(true);
    const [loaderLeftMargin, setLoaderLeftMargin] = useState("")

    // useEffect(() => {
    //     if (window.innerWidth > 768) {
    //         setLoaderLeftMargin("-35%")
    //     }
    // }, [])

    return (
        <Backdrop
            sx={{ color: "#00AFEF", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress color="inherit" sx={{ position: "relative", left: loaderLeftMargin }} />
        </Backdrop>
    );
};

export default LoginPageLoader;
