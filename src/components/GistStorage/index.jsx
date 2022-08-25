import { h } from "preact";
import { useState } from "preact/hooks";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import GistIdInput from "./GistIdInput";
import LoadGist from "./LoadGist";
import TokenControls from "./TokenControls";
import UniqueDialogId from "./UniqueDialogId";

const SaveGist = () => {
  const updateGistFromNodeState = () => {
    alert("not yet implemented");
  };
  return (
    <Button onClick={updateGistFromNodeState}>
      <Typography variant="button">Save to Gist</Typography>
    </Button>
  );
};

const StubGist = () => {
  const stubOutGist = () => {
    alert("not yet implemented");
  };
  return (
    <Button onClick={stubOutGist}>
      <Typography variant="button">Create new Perusal Gist</Typography>
    </Button>
  );
};

const GistStorage = ({ nodeState, setNode }) => {
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [gistId, setGistId] = useState("");
  const [openId, setOpenId] = useState("");

  const handleDialogClose = () => {
    setOpen(false);
    setOpenId("");
  };

  return (
    <div data-testid="GistStorage-div">
      <ButtonGroup size="small" sx={{ height: "100%" }}>
        <Button onClick={() => setOpen(true)}>
          <Typography variant="button">Use Gists</Typography>
        </Button>
      </ButtonGroup>
      <TextField value={openId} variant="outlined" />
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Gist Actions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This dialog facilitates interaction with Gists for persistence.
            Every action requires an access token for GitHub authentication that
            is not stored, logged, nor persisted anywhere.
          </DialogContentText>
          <FormGroup>
            <UniqueDialogId open={open} id={openId} setId={setOpenId} />
            <TokenControls
              accessToken={accessToken}
              setAccessToken={setAccessToken}
            />
            <GistIdInput id={gistId} setId={setGistId} />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <SaveGist />
          <LoadGist
            accessToken={accessToken}
            gistId={gistId}
            setNode={setNode}
          />
          <StubGist />
        </DialogActions>
      </Dialog>
    </div>
  );
};

GistStorage.propTypes = {
  nodeState: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  setNode: PropTypes.func.isRequired,
};

export default GistStorage;
