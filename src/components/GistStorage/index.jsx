import { h } from "preact";

import Types from "../../utils/Types";
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
import { useImmer } from "use-immer";

import GistIdInput from "./GistIdInput";
import LoadGist from "./LoadGist";
import SaveGist from "./SaveGist";
import StubGist from "./StubGist";
import TokenControls from "./TokenControls";
import UniqueDialogId from "./UniqueDialogId";

const GistStorage = ({ nodeState, setNode }) => {
  const [open, setOpen] = useImmer(false);
  const [accessToken, setAccessToken] = useImmer("");
  const [gistId, setGistId] = useImmer("");
  const [openId, setOpenId] = useImmer("");

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
          <SaveGist
            accessToken={accessToken}
            gistId={gistId}
            nodeState={nodeState}
            success={() => setOpen(false)}
          />
          <LoadGist
            accessToken={accessToken}
            gistId={gistId}
            setNode={(node) => {
              setNode(node);
              setOpen(false);
            }}
          />
          <StubGist
            accessToken={accessToken}
            setGistId={(id) => {
              setGistId(id);
              setOpen(false);
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

GistStorage.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default GistStorage;
