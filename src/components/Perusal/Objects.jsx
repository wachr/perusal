import { Fragment, h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";

import { ArrayContent } from "./Arrays";
import { StringContent } from "./Strings";
import { combine, onArray, onObject, onString } from "./ops";

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

const ObjectSubtopicContent = ({ nodeState, dispatch, displayTodoAlert }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={tabIndex}
      onChange={handleTabChange}
      aria-label="object subtopic"
      selectionFollowsFocus>
      {Object.entries(nodeState).map(([key, value], index) => (
        <Fragment>
          <Tab
            label={key}
            id={`vertical-tab-${index}`}
            aria-controls={`vertical-tabpanel-${index}`}
          />
          <div
            role="tabpanel"
            hidden={tabIndex !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}>
            {tabIndex === index && (
              <Box sx={{ p: 3 }}>
                <SubtopicContent
                  nodeState={value}
                  dispatch={dispatch}
                  displayTodoAlert={displayTodoAlert}
                />
              </Box>
            )}
          </div>
        </Fragment>
      ))}
    </Tabs>
  );
};

const SubtopicContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  combine(
    onString(() => <StringContent variant="body1" nodeState={nodeState} />),
    onArray(() => (
      <ArrayContent
        nodeState={nodeState}
        dispatch={dispatch}
        displayTodoAlert={displayTodoAlert}
      />
    )),
    onObject(() => (
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
        }}>
        <ObjectSubtopicContent
          nodeState={nodeState}
          dispatch={dispatch}
          displayTodoAlert={displayTodoAlert}
        />
      </Box>
    ))
  )(nodeState);

const ObjectContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() => {
    return (
      <Box sx={{ display: "flex" }}>
        <Card>
          <CardContent>
            <ObjectSubtopicContent
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </CardContent>
          <CardActions>
            <Button onClick={displayTodoAlert}>Add sub-topic</Button>
          </CardActions>
        </Card>
      </Box>
    );
  })(nodeState);

ObjectContent.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

export { ObjectContent, ObjectActions };
