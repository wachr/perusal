import { h } from "preact";

import Types from "../../utils/Types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
      <Typography>
        Not sure how to display {JSON.stringify(nodeState, null, "\t")}
      </Typography>
    ))
  )(nodeState);

const ObjectContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() => {
    const topics = Object.entries(nodeState).map(([key, value]) => (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{key}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SubtopicContent
            nodeState={value}
            dispatch={dispatch}
            displayTodoAlert={displayTodoAlert}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button size="small" onClick={displayTodoAlert}>
            Remove sub-topic
          </Button>
        </AccordionActions>
      </Accordion>
    ));
    return (
      <Card>
        <CardContent>{topics}</CardContent>
        <CardActions>
          <Button onClick={displayTodoAlert}>Add sub-topic</Button>
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
