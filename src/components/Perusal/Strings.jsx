import { h } from "preact";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import TopicDialog from "./TopicDialog";
import { onString } from "./ops";
import {
  DeleteString,
  PromoteStringToArray,
  PromoteStringToObject,
  ReplaceString,
} from "./reducer";

const StringActions = ({ nodeState, dispatch }) =>
  onString(() => {
    return [
      <TopicDialog
        text="Edit"
        value={nodeState}
        update={(newTopic) => dispatch(ReplaceString(newTopic))}
      />,
      <TopicDialog
        text="Describe"
        update={(newTopic) => dispatch(PromoteStringToObject(newTopic))}
      />,
      <TopicDialog
        text="Add related topic"
        update={(newTopic) => dispatch(PromoteStringToArray(newTopic))}
      />,
      <Button onClick={() => dispatch(DeleteString())}>Delete</Button>,
    ];
  })(nodeState);

StringActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const StringContent = ({ nodeState, variant }) =>
  onString(() => (
    <Paper>
      <Typography variant={variant}>{nodeState}</Typography>
    </Paper>
  ))(nodeState);

StringContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
  variant: PropTypes.string,
};

StringContent.defaultProps = {
  variant: "h1",
};

export { StringContent, StringActions };
