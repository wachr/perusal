import { h } from "preact";
import { useState } from "preact/hooks";

import Types from "../../utils/Types";
import SaveIcon from "@mui/icons-material/CheckCircleTwoTone";
import EditIcon from "@mui/icons-material/EditTwoTone";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

import { onString } from "./ops";

const StringEditButton = ({ topic, setTopic }) => {
  const [edit, setEdit] = useState(false);
  const [editField, setEditField] = useState(topic);
  if (edit)
    return (
      <Container>
        <TextField
          id="edit-topic"
          value={editField}
          onChange={({ target: { value } }) => setEditField(value)}
        />
        <Button
          onClick={() => {
            setTopic(editField);
            setEditField("");
            setEdit(false);
          }}>
          <SaveIcon />
        </Button>
      </Container>
    );
  return (
    <Button onClick={() => setEdit(true)}>
      <EditIcon />
    </Button>
  );
};

const EditTopicButton = ({ topic, setTopic }) => {
  return onString((topic) => (
    <StringEditButton topic={topic} setTopic={setTopic} />
  ))(topic);
};

EditTopicButton.propTypes = {
  topic: Types.nodeState.isRequired,
  setTopic: PropTypes.func.isRequired,
};

export default EditTopicButton;
