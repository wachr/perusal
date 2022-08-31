import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const EditTopicButton = ({ topic, setTopic }) => {
  return (
    <Button onClick={() => alert("not yet implemented")}>
      <EditTwoToneIcon />
    </Button>
  );
};

EditTopicButton.propTypes = {
  topic: Types.nodeState.isRequired,
  setTopic: PropTypes.func.isRequired,
};

export default EditTopicButton;
