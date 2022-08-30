import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import AddTopicButton from "./AddTopicButton";

const TopicContent = ({ nodeState, setNode }) => {
  function selectContent(nodeState) {
    if (typeof nodeState === "string")
      return <Typography variant="h1">{nodeState}</Typography>;
    if (Array.isArray(nodeState))
      return (
        <Stack>
          {nodeState.map((node) => (
            <TopicCard
              nodeState={node}
              // TODO Implement array lens for setNode here
              setNode={() => alert("not yet implemented")}
            />
          ))}
        </Stack>
      );
  }
  const content = selectContent(nodeState);
  return <CardContent>{content}</CardContent>;
};

const TopicCard = ({ nodeState, setNode }) => {
  return (
    <Card>
      <TopicContent nodeState={nodeState} setNode={setNode} />
      <CardActions>
        <AddTopicButton
          addTopic={(topic) => {
            if (!nodeState || Object.entries(nodeState).length === 0) {
              setNode(topic);
              return;
            }
            if (Array.isArray(nodeState)) {
              setNode([...nodeState, topic]);
              return;
            }
            setNode([nodeState, topic]);
          }}
        />
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
