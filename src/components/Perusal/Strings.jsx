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
import { nanoid } from "nanoid/non-secure";
import PropTypes from "prop-types";

import { onString } from "./ops";
import { DeleteString, PromoteStringToObject, ReplaceString } from "./reducer";

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
          <Button onClick={() => setTopicField(nanoid(5))}>Randomize</Button>
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

const StringDescribeButton = ({ nodeState, dispatch }) => {
  const [open, setOpen] = useState(false);
  const [subtopicField, setSubtopicField] = useState(nanoid(5));
  return (
    <Button onClick={() => setOpen(true)}>
      Describe
      <Dialog
        onClose={() => {
          setSubtopicField(nodeState);
          setOpen(false);
        }}
        open={open}>
        <DialogTitle>Add subtopic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullwidth
            margin="dense"
            id="topic-field"
            label="new topic"
            value={subtopicField}
            onChange={(event) => setSubtopicField(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(PromoteStringToObject(subtopicField));
              setOpen(false);
            }}>
            Add
          </Button>
          <Button
            onClick={() => {
              setSubtopicField("");
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
      <StringDescribeButton nodeState={nodeState} dispatch={dispatch} />,
      <Button onClick={displayTodoAlert}>Add related topic</Button>,
      <Button onClick={() => dispatch(DeleteString())}>Delete</Button>,
    ];
  })(nodeState);

StringActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

const StringContent = ({ nodeState, variant }) =>
  onString(() => <Typography variant={variant}>{nodeState}</Typography>)(
    nodeState
  );

StringContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
  variant: PropTypes.string,
};

StringContent.defaultProps = {
  variant: "h1",
};

export { StringContent, StringActions };