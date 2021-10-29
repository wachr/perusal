import { h } from "preact";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

function TopicUnrenderableAlert({ topic }) {
  return (
    <Alert severity="error">
      <AlertTitle>Could not render</AlertTitle>
      Unable to render topic.
      <TextField
        hiddenLabel
        multiline
        margin="normal"
        aria-label="unrecognized content"
        fullWidth
        defaultValue={JSON.stringify(topics, null, "\t")}
        inputProps={{ readOnly: true }}
      />
    </Alert>
  );
}

TopicUnrenderableAlert.propTypes = {
  topic: PropTypes.node
};

export default TopicUnrenderableAlert;
