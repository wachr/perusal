import { h } from "preact";

import Types from "../../utils/Types";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";

import { ObjectContent } from "./Objects";
import { StringActions, StringContent } from "./Strings";
import TopicDialog from "./TopicDialog";
import { combine, onArray, onObject, onString } from "./ops";
import { AddToArray, DeleteFromArray, withPath } from "./reducer";

const ArrayActions = ({ nodeState, dispatch }) =>
  onArray(() => {
    return [
      <TopicDialog
        text="Add alternative topic"
        update={(alternative) =>
          dispatch(AddToArray(nodeState.length, alternative))
        }
      />,
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

const ArrayContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onArray(() => {
    const elements = nodeState.map((element, index) => {
      const arrayDispatch = (action) =>
        dispatch(withPath(String(index))(action));
      return combine(
        onString(() => (
          <ListItem>
            <Stack direction="row">
              <StringContent variant="h6" nodeState={element} />
              <StringActions
                nodeState={element}
                dispatch={arrayDispatch}
                displayTodoAlert={displayTodoAlert}
              />
            </Stack>
          </ListItem>
        )),
        onArray(() => (
          <ListItem>
            <ArrayContent
              nodeState={element}
              dispatch={arrayDispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </ListItem>
        )),
        onObject(() => (
          <ListItem>
            <ObjectContent
              nodeState={element}
              dispatch={arrayDispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </ListItem>
        ))
      )(element);
    });
    return <List> {elements} </List>;
  })(nodeState);

ArrayContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

export { ArrayContent, ArrayActions };
