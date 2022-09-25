import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import EmptyActions from "./EmptyActions";
import { onString } from "./ops";
import reducer, { DeleteString, ReplaceString } from "./reducer";

const StringContent = ({ nodeState }) =>
  onString(() => <Typography variant="h1">{nodeState}</Typography>)(nodeState);

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

const StringActions = ({ nodeState, dispatch }) =>
  onString(() => {
    const [open, setOpen] = useState(false);
    const handleClose = (_, reason) => {
      if (reason === "clickaway") return;
      setOpen(false);
    };
    return [
      <StringEditButton nodeState={nodeState} dispatch={dispatch} />,
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          Not yet implemented.
        </Alert>
      </Snackbar>,
      <Button onClick={() => setOpen(true)}>Describe</Button>,
      <Button onClick={() => setOpen(true)}>Add related topic</Button>,
      <Button onClick={() => dispatch(DeleteString())}>Delete</Button>,
    ];
  })(nodeState);

const Perusal = ({ nodeState, dispatch, setNode }) => {
  return (
    <div data-testid="Perusal-div">
      <Paper variant="outlined">
        <Card>
          <CardContent>
            <StringContent nodeState={nodeState} />
          </CardContent>
          <CardActions>
            <EmptyActions nodeState={nodeState} setNode={setNode} />
            <StringActions nodeState={nodeState} dispatch={dispatch} />
          </CardActions>
        </Card>
      </Paper>
    </div>
  );
};

Perusal.reducer = reducer;

export * from "./reducer";

Perusal.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default Perusal;
