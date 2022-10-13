import { Fragment, h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import { ArrayContent } from "./Arrays";
import { StringActions, StringContent } from "./Strings";
import TopicDialog from "./TopicDialog";
import { combine, onArray, onObject, onString } from "./ops";
import { AddKeyValueToObject } from "./reducer";

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

const ObjectSubtopicContentAccordian = ({
  nodeState,
  dispatch,
  displayTodoAlert,
}) =>
  onObject(() =>
    Object.entries(nodeState).map(([key, value]) => (
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="accordion-content"
          id="accordion-header">
          <Typography>{key}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper variant="outlined">
            <SubtopicContent
              nodeState={value}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </Paper>
        </AccordionDetails>
      </Accordion>
    ))
  )(nodeState);

const ObjectSubtopicContentTabbed = ({
  nodeState,
  dispatch,
  displayTodoAlert,
}) =>
  onObject(() => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (_, newIndex) => {
      setTabIndex(newIndex);
    };
    const [tabs, panels] = Object.entries(nodeState)
      .map(([key, value], index) => [
        <Tab
          label={key}
          id={`vertical-tab-${index}`}
          aria-controls={`vertical-tabpanel-${index}`}
          wrapped
        />,
        <div
          role="tabpanel"
          hidden={tabIndex !== index}
          id={`vertical-tabpanel-${index}`}
          aria-labelledby={`vertical-tab-${index}`}>
          {tabIndex === index && (
            <Paper variant="outlined">
              <SubtopicContent
                nodeState={value}
                dispatch={dispatch}
                displayTodoAlert={displayTodoAlert}
              />
            </Paper>
          )}
        </div>,
      ])
      .reduce(
        (acc, [tab, panel]) => {
          acc[0].push(tab);
          acc[1].push(panel);
          return acc;
        },
        [[], []]
      );
    return (
      <Container fixed>
        <Stack direction="column">
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="object subtopic"
            scrollButtons
            allowScrollButtonsMobile>
            {tabs}
          </Tabs>
          {panels}
        </Stack>
      </Container>
    );
  })(nodeState);

const ObjectSubtopicContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() =>
    Object.keys(nodeState).length === 1 ? (
      <ObjectSubtopicContentAccordian
        nodeState={nodeState}
        dispatch={dispatch}
        displayTodoAlert={displayTodoAlert}
      />
    ) : (
      <ObjectSubtopicContentTabbed
        nodeState={nodeState}
        dispatch={dispatch}
        displayTodoAlert={displayTodoAlert}
      />
    )
  )(nodeState);

const SubtopicContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  combine(
    onString(() => (
      <Stack direction="row">
        <StringContent variant="body1" nodeState={nodeState} />
        <StringActions nodeState={nodeState} dispatch={dispatch} />
      </Stack>
    )),
    onArray(() => (
      <ArrayContent
        nodeState={nodeState}
        dispatch={dispatch}
        displayTodoAlert={displayTodoAlert}
      />
    )),
    onObject(() => (
      <ObjectSubtopicContent
        nodeState={nodeState}
        dispatch={dispatch}
        displayTodoAlert={displayTodoAlert}
      />
    ))
  )(nodeState);

const AddSubtopicDialog = ({ dispatch }) => {
  const random = TopicDialog.random;
  const [open, setOpen] = useState(false);
  const [keyField, setKeyField] = useState(random());
  const [valueField, setValueField] = useState(random());
  const randomize = () => {
    setKeyField(random());
    setValueField(random());
  };
  const close = () => {
    setOpen(false);
    randomize();
  };
  return (
    <Button onClick={() => setOpen(true)}>
      Add sub-topic
      <Dialog onClose={close} open={open}>
        <DialogTitle>Add sub-topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="sub-topic-key-field"
            label="sub-topic key"
            value={keyField}
            onChange={(_, newValue) => setKeyField(newValue)}
          />
          <TextField
            margin="dense"
            id="sub-topic-value-field"
            label="sub-topic value"
            value={valueField}
            onChange={(_, newValue) => setValueField(newValue)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(AddKeyValueToObject(keyField, valueField));
              close();
            }}>
            Submit
          </Button>
          <Button onClick={randomize}>Randomize</Button>
          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Button>
  );
};

const ObjectContent = ({ nodeState, dispatch, displayTodoAlert }) =>
  onObject(() => {
    return (
      <Card>
        <CardContent>
          <ObjectSubtopicContent
            nodeState={nodeState}
            dispatch={displayTodoAlert}
            displayTodoAlert={displayTodoAlert}
          />
        </CardContent>
        <CardActions>
          <AddSubtopicDialog dispatch={dispatch} />
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
