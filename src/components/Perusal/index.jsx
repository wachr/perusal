import { Fragment, h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import AddTopicButton from "./AddTopicButton";
import EditTopicButton from "./EditTopicButton";
import RemoveTopicButton from "./RemoveTopicButton";

export function isEmpty(nodeState) {
  if (!nodeState) return true;
  if (typeof nodeState === "string" && nodeState === "") return true;
  if (Array.isArray(nodeState) && nodeState.length === 0) return true;
  if (typeof nodeState === "object" && Object.entries(nodeState).length === 0)
    return true;
  return false;
}

export function onString(stringTransform, unitValue) {
  return (nodeState) => {
    if (typeof nodeState === "string") return stringTransform(nodeState);
    return unitValue;
  };
}

const TopicContent = ({ nodeState, setNode }) => {
  function selectContent(nodeState) {
    return onString((nodeState) => (
      <Typography variant="h1">{nodeState}</Typography>
    ))(nodeState);
  }
  const content = selectContent(nodeState);
  return <CardContent>{content}</CardContent>;
};

const TopicCard = ({ nodeState, setNode }) => {
  const NonEmptyActions = () => {
    if (!isEmpty(nodeState))
      return (
        <Fragment>
          <EditTopicButton topic={nodeState} setTopic={setNode} />
          <RemoveTopicButton
            removeTopic={() => onString(() => setNode({}))(nodeState)}
          />
        </Fragment>
      );
  };
  return (
    <Card>
      <TopicContent nodeState={nodeState} setNode={setNode} />
      <CardActions>
        <AddTopicButton
          addTopic={(topic) => {
            if (isEmpty(nodeState)) {
              setNode(topic);
              return;
            }
          }}
        />
        <NonEmptyActions />
      </CardActions>
    </Card>
  );
};

const Perusal = ({ nodeState, setNode }) => {
  return (
    <div data-testid="Perusal-div">
      <Paper variant="outlined">
        <TopicCard nodeState={nodeState} setNode={setNode} />
      </Paper>
    </div>
  );
};

Perusal.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default Perusal;
