import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { onString } from "./ops";
import { DeleteString, ReplaceString } from "./reducer";

const StringEditButton = ({ nodeState, dispatch }) => {
  const [open, setOpen] = useState(false);
  const [topicField, setTopicField] = useState(nodeState);
  return (
    <Button onClick={() => setOpen(true)}>
      Edit
      <Dialog
        onClose={() => {
          setTopicField(nodeState);
          setOpen(false);
        }}
        open={open}>
        <DialogTitle>Edit topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullwidth
            margin="dense"
            id="topic-field"
            label="new topic"
            value={topicField}
            onChange={(event) => setTopicField(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(ReplaceString(topicField));
              setOpen(false);
            }}>
            Update
          </Button>
          <Button
            onClick={() => {
              setTopicField(nodeState);
              setOpen(false);
            }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Button>
  );
};

const StringActions = ({ nodeState, dispatch, displayTodoAlert }) =>
  onString(() => {
    return [
      <StringEditButton nodeState={nodeState} dispatch={dispatch} />,
      <Button onClick={displayTodoAlert}>Describe</Button>,
      <Button onClick={displayTodoAlert}>Add related topic</Button>,
      <Button onClick={() => dispatch(DeleteString())}>Delete</Button>,
    ];
  })(nodeState);

StringActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

const StringContent = ({ nodeState }) =>
  onString(() => <Typography variant="h1">{nodeState}</Typography>)(nodeState);

StringContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
};

export { StringContent, StringActions };
