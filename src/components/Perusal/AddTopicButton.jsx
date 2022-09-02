import { h } from "preact";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { nolookalikesSafe } from "nanoid-dictionary";
import { customAlphabet } from "nanoid/non-secure";
import PropTypes from "prop-types";
import { useImmer } from "use-immer";

const AddTopicButton = ({ addTopic }) => {
  const [edit, setEdit] = useImmer(false);
  const genInput = () => customAlphabet(nolookalikesSafe, 1);
  const [addTopicField, setAddTopicField] = useImmer("");
  if (edit)
    return (
      <Container>
        <TextField
          id="add-topic"
          label="topic"
          value={addTopicField}
          onChange={({ target: { value } }) => setAddTopicField(value)}
        />
        <Button
          onClick={() => {
            if (addTopicField) addTopic(addTopicField);
            setEdit(false);
          }}>
          add
        </Button>
      </Container>
    );
  return (
    <Button
      variant="contained"
      onClick={() => {
        setAddTopicField(genInput());
        setEdit(true);
      }}>
      +
    </Button>
  );
};

AddTopicButton.propTypes = {
  addTopic: PropTypes.func.isRequired,
};

export default AddTopicButton;
