import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { useAppContext } from "../state/hooks";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const { notification, setNotification } = useAppContext();
  const { open, vertical, horizontal, severity, message, autoHideDuration } =
    notification;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ ...notification, open: false });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert
        onClose={(e, r) => handleClose(e, r)}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
