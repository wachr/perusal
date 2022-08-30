import { h } from "preact";

import Types from "../utils/Types";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import { fileOpen, fileSave } from "browser-fs-access";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

const handleImport = async (setState) => {
  const fileContents = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
  }).then((blob) => blob.text());
  const cleanedContents = DOMPurify.sanitize(fileContents);
  const parsedContents = cleanedContents && JSON.parse(cleanedContents);
  setState(parsedContents);
};

const handleExport = async (state) => {
  const stateBlob = new Blob([state], { type: "application/json" });
  return fileSave(stateBlob, {
    fileName: "state.json",
    extensions: [".json"],
  });
};

const FileStorage = ({ nodeState, setNode }) => {
  const stateString = JSON.stringify(nodeState, null, "\t");
  return (
    <div data-testid="FileStorage-div">
      <ButtonGroup size="small" sx={{ height: "100%" }}>
        <Button onClick={async () => handleImport(setNode)}>
          <FileUploadIcon />
          <Typography variant="button">Import State</Typography>
        </Button>
        <Button onClick={async () => handleExport(stateString)}>
          <FileDownloadIcon />
          <Typography variant="button">Export State</Typography>
        </Button>
      </ButtonGroup>
    </div>
  );
};

FileStorage.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default FileStorage;
