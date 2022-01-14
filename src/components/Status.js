import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const Status = ({...props}) => {
const { loading, error, success } = props.transactionState;
    return (
    <div
        style={{
        height: `${loading ? "100px" : "50px"}`,
        width: "100%",
        display: "flex",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        }}
    >
        <Box sx={{ width: "30%" }}>
        {loading ? loading : success ? success : error}
        </Box>
        {loading && (
        <Box sx={{ width: "20%", marginTop: "30px" }}>
            <LinearProgress />
        </Box>
        )}
    </div>
    );
}


    export default Status;