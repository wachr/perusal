import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { nanoid } from "nanoid/non-secure";
import PropTypes from "prop-types";

import { onEmpty, onString } from "./ops";

const EmptyActions = ({ nodeState, setNode }) => {
  const [open, setOpen] = useState(false);
  const [topicField, setTopicField] = useState(nanoid(5));
  const addString = (setNode, topic) => onString(() => setNode(topic))(topic);
  return onEmpty(() => (
    <Button onClick={() => setOpen(true)}>
      Add topic
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>New string topic</DialogTitle>
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
              addString(setNode, topicField);
              setOpen(false);
            }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Button>
  ))(nodeState);
};

EmptyActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default EmptyActions;
