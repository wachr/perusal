import { h } from "preact";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const serializeNodeState = (nodeState) => {
  const stringify = (obj) => JSON.stringify(obj, null, "\t");
  const body = {
    files: {
      "perusal_state.json": {
        content: stringify(nodeState),
      },
    },
    public: false,
  };
  return stringify(body);
};

const SaveGist = ({ accessToken, gistId, nodeState }) => {
  const updateGistFromNodeState = async () => {
    const serializedState = serializeNodeState(nodeState);
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: serializedState,
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Button onClick={updateGistFromNodeState}>
      <Typography variant="button">Save to Gist</Typography>
    </Button>
  );
};

SaveGist.propTypes = {
  accessToken: PropTypes.string.isRequired,
  gistId: PropTypes.string.isRequired,
  nodeState: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
};

export default SaveGist;
