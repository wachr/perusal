import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { nanoid } from "nanoid/non-secure";
import PropTypes from "prop-types";

import { combine, onArray, onObject, onString } from "./ops";
import { AddToArray, DeleteFromArray } from "./reducer";

const AddRelatedButton = ({ nodeState, dispatch }) => {
  const [open, setOpen] = useState(false);
  const [alternativeField, setAlternativeField] = useState(nanoid(5));
  return (
    <Button onClick={() => setOpen(true)}>
      Add new topic
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Add alternative topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullwidth
            margin="dense"
            id="topic-field"
            label="new topic"
            value={alternativeField}
            onChange={(event) => setAlternativeField(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(AddToArray(nodeState.length, alternativeField));
              setAlternativeField(nanoid(5));
              setOpen(false);
            }}>
            Add
          </Button>
          <Button
            onClick={() => {
              setAlternativeField(nanoid(5));
              setOpen(false);
            }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Button>
  );
};

const ArrayActions = ({ nodeState, dispatch, displayTodoAlert }) =>
  onArray(() => {
    return [
      <AddRelatedButton nodeState={nodeState} dispatch={dispatch} />,
      <Button onClick={() => dispatch(DeleteFromArray(nodeState.length - 1))}>
        Delete last topic
      </Button>,
    ];
  })(nodeState);

ArrayActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

const ArrayContent = ({ nodeState }) =>
  onArray(() => {
    const elements = nodeState.map((element) =>
      combine(
        onString(() => (
          <ListItem>
            <ListItemText primary={element} />
          </ListItem>
        )),
        onArray(() => (
          <ListItem>
            <Stack direction="row">
              {element.map((key) => (
                <Chip variant="outlined" label={key} />
              ))}
            </Stack>
          </ListItem>
        )),
        onObject(() => (
          <ListItem>
            <Stack direction="row">
              {Object.keys(element).map((key) => (
                <Chip variant="outlined" label={key} />
              ))}
            </Stack>
          </ListItem>
        ))
      )(element)
    );
    return <List> {elements} </List>;
  })(nodeState);

ArrayContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
};

export { ArrayContent, ArrayActions };
