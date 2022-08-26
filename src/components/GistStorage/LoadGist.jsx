import { h } from "preact";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const LoadGist = ({ accessToken, gistId, setNode }) => {
  const updateNodeStateFromGist = async () => {
    await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          await res
            .json()
            .then((json) => json.files["perusal_state.json"].content)
            .then(JSON.parse)
            .then(setNode);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Button onClick={updateNodeStateFromGist}>
      <Typography variant="button">Load Gist as Perusal</Typography>
    </Button>
  );
};

LoadGist.propTypes = {
  accessToken: PropTypes.string.isRequired,
  gistId: PropTypes.string.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default LoadGist;
