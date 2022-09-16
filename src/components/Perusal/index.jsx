import { Fragment, h } from "preact";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import EmptyActions from "./EmptyActions";
import { combine, isEmpty, onArray, onEmpty, onString } from "./ops";

const StringContent = ({ nodeState, setNode }) =>
  onString(() => <Typography variant="h1">{nodeState}</Typography>)(nodeState);

const StringActions = ({ nodeState, setNode }) =>
  onString(() => [
    <Button>Edit</Button>,
    <Button>Describe</Button>,
    <Button>Add related topic</Button>,
    <Button>Delete</Button>,
  ])(nodeState);

const Perusal = ({ nodeState, setNode }) => {
  return (
    <div data-testid="Perusal-div">
      <Paper variant="outlined">
        <Card>
          <CardContent>
            <StringContent nodeState={nodeState} setNode={setNode} />
          </CardContent>
          <CardActions>
            <EmptyActions nodeState={nodeState} setNode={setNode} />
            <StringActions nodeState={nodeState} setNode={setNode} />
          </CardActions>
        </Card>
      </Paper>
    </div>
  );
};

Perusal.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default Perusal;
