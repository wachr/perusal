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
import Paper from "@mui/material/Paper";
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
  const [collapsed, setCollapsed] = useState(false);
  const stateString = JSON.stringify(nodeState, null, "\t");
  return (
    <div data-testid="StateInspector-div">
      <Box sx={{ mx: "5%" }}>
        <Paper elevation={0}>
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
                <Button onClick={() => handleExport(stateString)}>
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
                minRows={4}
                maxRows={20}
                defaultValue={stateString}
                inputProps={{ readOnly: true }}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

StateInspector.propTypes = {
  nodeState: PropTypes.shape().isRequired,
  setNode: PropTypes.func.isRequired
};

export default StateInspector;
