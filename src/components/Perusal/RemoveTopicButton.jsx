import { h } from "preact";

import DeleteDisabledIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const RemoveTopicButton = ({ disabled, removeTopic }) => {
  return (
    <Button onClick={removeTopic}>
      {disabled ? <DeleteDisabledIcon /> : <DeleteIcon />}
    </Button>
  );
};

RemoveTopicButton.propTypes = {
  disabled: PropTypes.bool,
  removeTopic: PropTypes.func.isRequired,
};

RemoveTopicButton.defaultProps = {
  disabled: false,
};

export default RemoveTopicButton;
