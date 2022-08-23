import { h } from "preact";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const handleImport = () => alert("import");

const handleExport = () => alert("export");

const GistStorage = ({ nodeState, setNode }) => {
  return (
    <div data-testid="GistStorage-div">
      <ButtonGroup size="small" sx={{ height: "100%" }}>
        <Button onClick={() => handleImport()}>
          <Typography variant="button">Import Gist</Typography>
        </Button>
        <Button onClick={() => handleExport()}>
          <Typography variant="button">Export Gist</Typography>
        </Button>
      </ButtonGroup>
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
