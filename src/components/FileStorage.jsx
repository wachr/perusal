import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import { fileOpen, fileSave } from "browser-fs-access";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

const handleImport = async (setState) => {
  const stateBlob = await fileOpen({
    mimeTypes: ["application/json"],
    extensions: [".json"],
    startIn: "Downloads",
  });
  const fileContents = await stateBlob.text();
  const cleanedContents = DOMPurify.sanitize(fileContents);
  setState(JSON.parse(cleanedContents));
};

const handleExport = async (state) => {
  const stateBlob = new Blob([state], { type: "application/json" });
  await fileSave(stateBlob, {
    fileName: "state.json",
    extensions: [".json"],
    startIn: "Downloads",
  });
};

const FileStorage = ({ nodeState, setNode }) => {
  const stateString = JSON.stringify(nodeState, null, "\t");
  return (
    <div data-testid="FileStorage-div">
      <ButtonGroup size="small" sx={{ height: '100%' }}>
        <Button onClick={() => handleImport(setNode)}>
          <FileUploadIcon />
          <Typography variant="button">Import State</Typography>
        </Button>
        <Button onClick={() => handleExport(stateString)}>
          <FileDownloadIcon />
          <Typography variant="button">Export State</Typography>
        </Button>
      </ButtonGroup>
    </div >
  );
};

FileStorage.propTypes = {
  nodeState: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  setNode: PropTypes.func.isRequired,
};

export default FileStorage;
