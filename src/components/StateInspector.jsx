import { fileOpen, fileSave } from "browser-fs-access";
import { h } from "preact";
import { useState } from "preact/hooks";
import DOMPurify from "dompurify";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
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
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div data-testid="StateInspector-div">
      <Box sx={{ margin: "5pt" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            marginRight: "-5pt"
          }}
        >
          <ButtonGroup size="small">
            <Button onClick={() => handleImport(setNode)}>
              <FileUploadIcon />
              <Typography variant="button">Import State</Typography>
            </Button>
            <Button onClick={() => handleExport(cleanedState)}>
              <FileDownloadIcon />
              <Typography variant="button">Export State</Typography>
            </Button>
            <Button
              onClick={() => setCollapsed(!collapsed)}
              aria-label="show or hide state"
            >
              {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </Button>
          </ButtonGroup>
        </Box>
        {!collapsed && (
          <TextField
            multiline
            margin="normal"
            variant="outlined"
            label="app state"
            aria-label="app state"
            fullWidth
            maxRows={10}
            defaultValue={cleanedState}
            inputProps={{ readOnly: true }}
          />
        )}
      </Box>
    </div>
  );
};

StateInspector.propTypes = {
  nodeState: PropTypes.shape().isRequired,
  setNode: PropTypes.func.isRequired
};

export default StateInspector;
