import { h } from "preact";

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const RemoveTopicButton = ({ removeTopic }) => {
  return (
    <Button onClick={removeTopic}>
      <DeleteTwoToneIcon />
    </Button>
  );
};

RemoveTopicButton.propTypes = {
  removeTopic: PropTypes.func.isRequired,
};

export default RemoveTopicButton;
