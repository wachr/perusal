import { fileOpen, fileSave } from "browser-fs-access";
import { h } from "preact";
import DOMPurify from "dompurify";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const handleImport = async setState => {
  const stateBlob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    startIn: "Downloads"
  });
  const fileContents = await stateBlob.text();
  const cleanedContents = DOMPurify.sanitize(fileContents);
  setState(JSON.parse(cleanedContents));
};

const handleExport = async state => {
  const stateBlob = new Blob([state], { type: "application/json" });
  await fileSave(stateBlob, {
    fileName: "state.json",
    extensions: [".json"],
    startIn: "Downloads"
  });
};

const StateInspector = ({ nodeState, setNode }) => {
  const cleanedState = DOMPurify.sanitize(
    JSON.stringify(nodeState, null, "\t")
  );
  return (
    <div data-testid="StateInspector-div">
      <Box sx={{ margin: "5pt" }}>
        <TextField
          multiline
          margin="normal"
          variant="outlined"
          label="app state"
          fullWidth
          maxRows={10}
          defaultValue={cleanedState}
          inputProps={{ readOnly: true }}
        />
        <ButtonGroup>
          <Button onClick={() => handleImport(setNode)}>
            <Typography variant="button">Import State</Typography>
          </Button>
          <Button onClick={() => handleExport(cleanedState)}>
            <Typography variant="button">Export State</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

StateInspector.propTypes = {
  nodeState: PropTypes.shape().isRequired,
  setNode: PropTypes.func.isRequired
};

export default StateInspector;
