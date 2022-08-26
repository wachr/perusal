import { h } from "preact";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const stub = {
  files: {
    "perusal_state.json": {
      content: "{}",
    },
  },
  public: false,
};

const StubGist = ({ accessToken, setGistId }) => {
  const stubOutGist = async () => {
    await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(stub, null, "\n"),
    })
      .then(async (res) => {
        if (res.status === 201) {
          await res
            .json()
            .then((json) => json.id)
            .then(setGistId);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Button onClick={stubOutGist}>
      <Typography variant="button">Create new Perusal Gist</Typography>
    </Button>
  );
};

StubGist.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setGistId: PropTypes.func.isRequired,
};

export default StubGist;
