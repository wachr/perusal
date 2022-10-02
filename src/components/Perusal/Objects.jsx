import { h } from "preact";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { onObject } from "./ops";

const ObjectActions = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() => {
    return [
      <Button onClick={displayTodoAlert}>Edit</Button>,
      <Button onClick={displayTodoAlert}>Add related topic</Button>,
      <Button onClick={displayTodoAlert}>Delete</Button>,
    ];
  })(nodeState);

ObjectActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

const ObjectContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() => {
    // FIXME Display entire object not just one entry
    const [title, subtitle] = Object.entries(nodeState)[0];
    return (
      <Card>
        <CardContent>
          <Typography variant="h1">{title}</Typography>
          <Typography variant="h2">{subtitle}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={displayTodoAlert}>Add sub-topic</Button>
          <Button onClick={displayTodoAlert}>Remove sub-topic</Button>
        </CardActions>
      </Card>
    );
  })(nodeState);

ObjectContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

export { ObjectContent, ObjectActions };
