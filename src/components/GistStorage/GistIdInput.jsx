import { h } from "preact";
import { useState } from "preact/hooks";

import Button from "@mui/material/Button";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PropTypes from "prop-types";

const GistIdInput = ({ id, setId }) => {
  const [idField, setIdField] = useState(id);
  const setField = () => setId(idField);
  const resetField = () => {
    setId("");
    setIdField("");
  };
  return (
    <FormControl
      disabled={!!id}
      variant="filled"
      sx={{
        display: "flex",
        flexDirection: "row",
      }}>
      <InputLabel htmlFor="gist-id-input">gist id</InputLabel>
      <FilledInput
        id="gist-id-input"
        size="small"
        onChange={(event) => setIdField(event.target.value)}
        label="gist id"
        value={idField}
      />
      <Button onClick={!id ? setField : resetField}>
        {!id ? "set" : "reset"}
      </Button>
    </FormControl>
  );
};

GistIdInput.propTypes = {
  id: PropTypes.string.isRequired,
  setId: PropTypes.func.isRequired,
};

export default GistIdInput;
