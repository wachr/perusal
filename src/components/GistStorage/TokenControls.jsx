import { h } from "preact";
import { useState } from "preact/hooks";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PropTypes from "prop-types";

const TokenControls = ({ accessToken, setAccessToken }) => {
  const [tokenField, setTokenField] = useState(accessToken);
  const inputToken = () => setAccessToken(tokenField);
  const resetToken = () => {
    setTokenField("");
    setAccessToken("");
  };
  return (
    <FormControl
      disabled={!!accessToken}
      variant="filled"
      sx={{
        display: "flex",
        flexDirection: "row",
      }}>
      <InputLabel htmlFor="gist-access-token-input">
        gist access token
      </InputLabel>
      <FilledInput
        id="gist-access-token-input"
        size="small"
        onChange={(event) => setTokenField(event.target.value)}
        label="gist access token"
        value={tokenField}
      />
      <Button onClick={!accessToken ? inputToken : resetToken}>
        {!accessToken ? <LoginIcon /> : <LogoutIcon />}
      </Button>
    </FormControl>
  );
};

TokenControls.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setAccessToken: PropTypes.func.isRequired,
};

export default TokenControls;
