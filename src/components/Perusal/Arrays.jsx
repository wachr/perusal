import { h } from "preact";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

import { combine, onArray, onObject, onString } from "./ops";
import { DeleteFromArray } from "./reducer";

const ArrayActions = ({ nodeState, dispatch, displayTodoAlert }) =>
  onArray(() => {
    return [
      <Button onClick={displayTodoAlert}>Add related topic</Button>,
      <Button onClick={() => dispatch(DeleteFromArray(nodeState.length - 1))}>
        Delete last topic
      </Button>,
    ];
  })(nodeState);

ArrayActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

const ArrayContent = ({ nodeState }) =>
  onArray(() => {
    const elements = nodeState.map((element) =>
      combine(
        onString(() => (
          <ListItem>
            <ListItemText primary={element} />
          </ListItem>
        )),
        onArray(() => (
          <ListItem>
            <Stack direction="row">
              {element.map((key) => (
                <Chip variant="outlined" label={key} />
              ))}
            </Stack>
          </ListItem>
        )),
        onObject(() => (
          <ListItem>
            <Stack direction="row">
              {Object.keys(element).map((key) => (
                <Chip variant="outlined" label={key} />
              ))}
            </Stack>
          </ListItem>
        ))
      )(element)
    );
    return <List> {elements} </List>;
  })(nodeState);

ArrayContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
};

export { ArrayContent, ArrayActions };
