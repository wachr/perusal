import { Fragment } from "preact";

import Types from "../utils/Types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

function displayTopicPrimitive(nodeState, nodeTitle) {
  if (nodeTitle !== undefined && typeof nodeState === "string") {
    return (
      <Card>
        <Typography variant="h1">{nodeTitle}</Typography>
        <CardContent>
          <Typography variant="body">{nodeState}</Typography>
        </CardContent>
      </Card>
    );
  }
  if (typeof nodeState === "string") {
    return (
      <Card>
        <Typography variant="h1">{nodeState}</Typography>
      </Card>
    );
  }
  return <Fragment />;
}

function displayTopic(nodeState) {
  if (typeof nodeState === "string") return displayTopicPrimitive(nodeState);
  if (typeof nodeState === "array") return nodeState.map(displayTopicPrimitive);
  if (typeof nodeState === "object")
    return Object.entries(nodeState).map(([key, value]) =>
      displayTopicPrimitive(value, key)
    );
  return displayTopicPrimitive("Could not display topic");
}

const Perusal = ({ nodeState, setNode }) => {
  return displayTopic(nodeState);
};

Perusal.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default Perusal;
