import { Fragment, h } from "preact";

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
import { combine, isEmpty, onArray, onEmpty, onString } from "./ops";

const TopicContent = ({ nodeState, setNode }) => {
  const content = combine(
    onString((nodeState) => <Typography variant="h1">{nodeState}</Typography>),
    onArray((arr) =>
      Array.from(arr).map((topic, index) => (
        <TopicCard
          nodeState={topic}
          setNode={(
            topic // FIXME Need to handle update of nested arrays
          ) => setNode((draft) => void draft.splice(index, 1, topic))}
          removeNode={() =>
            setNode((draft) => {
              if (draft.length === 2) return draft[index === 0 ? 1 : 0];
              draft.splice(index, 1);
            })
          }
        />
      ))
    )
  )(nodeState);
  return <CardContent>{content}</CardContent>;
};

const TopicCard = ({ nodeState, setNode, removeNode }) => {
  const NonEmptyActions = () => {
    if (!isEmpty(nodeState))
      return (
        <Fragment>
          <EditTopicButton topic={nodeState} setTopic={setNode} />
          <RemoveTopicButton
            disabled={onString(() => false, true)(nodeState)}
            removeTopic={() =>
              typeof removeNode === "function" ? removeNode() : setNode({})
            }
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
            combine(
              onEmpty(() => setNode(topic)),
              onString(() => setNode([nodeState, topic])),
              onArray(() => setNode([...nodeState, topic]))
            )(nodeState);
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
