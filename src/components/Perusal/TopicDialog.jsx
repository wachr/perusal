import { h } from "preact";
import { useState } from "preact/hooks";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { nanoid } from "nanoid/non-secure";
import PropTypes from "prop-types";

const random = () => nanoid(5);

const TopicDialog = ({ text, value, update }) => {
  const [open, setOpen] = useState(false);
  const [topicField, setTopicField] = useState(value || random());
  const close = () => {
    setOpen(false);
    setTopicField(value || random());
  };
  return (
    <Button onClick={() => setOpen(true)}>
      {String(text)}
      <Dialog onClose={close} open={open}>
        <DialogTitle>{String(text)}</DialogTitle>
        <DialogContent>
          <TextField
            fullwidth
            margin="dense"
            id="topic-field"
            label="topic"
            value={topicField}
            onChange={({ target: { value } }) => setTopicField(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              update(topicField);
              close();
            }}>
            Submit
          </Button>
          <Button onClick={() => setTopicField(random())}>Randomize</Button>
          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Button>
  );
};

TopicDialog.propTypes = {
  value: PropTypes.string,
  text: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};

TopicDialog.random = random;

export default TopicDialog;
