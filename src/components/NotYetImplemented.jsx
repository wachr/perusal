import { h } from "preact";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PropTypes from "prop-types";

const NotYetImplemented = ({ open, close }) => {
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    close();
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        Not yet implemented.
      </Alert>
    </Snackbar>
  );
};

NotYetImplemented.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default NotYetImplemented;
