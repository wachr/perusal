import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useState } from "preact/hooks";
import PropTypes from "prop-types";
import FileStorage from "./FileStorage";
import GistStorage from "./GistStorage";


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
              }}>
              <ButtonGroup size="small">
                <GistStorage nodeState={nodeState} setNode={setNode} />
                <FileStorage nodeState={nodeState} setNode={setNode} />
                <Button
                  onClick={() => setCollapsed(!collapsed)}
                  aria-label="show or hide state">
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
  nodeState: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  setNode: PropTypes.func.isRequired,
};

export default StateInspector;
