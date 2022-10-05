import { h } from "preact";

import Types from "../../utils/Types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

import { ArrayActions, ArrayContent } from "./Arrays";
import EmptyActions from "./EmptyActions";
import { ObjectActions, ObjectContent } from "./Objects";
import { StringActions, StringContent } from "./Strings";
import reducer from "./reducer";

const Perusal = ({ nodeState, dispatch, setNode, displayTodoAlert }) => {
  return (
    <div data-testid="Perusal-div">
      <Paper variant="outlined">
        <Card>
          <CardContent>
            <StringContent nodeState={nodeState} />
            <ArrayContent
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
            <ObjectContent
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </CardContent>
          <CardActions>
            <EmptyActions nodeState={nodeState} setNode={setNode} />
            <StringActions
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
            <ArrayActions
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
            <ObjectActions
              nodeState={nodeState}
              dispatch={dispatch}
              displayTodoAlert={displayTodoAlert}
            />
          </CardActions>
        </Card>
      </Paper>
    </div>
  );
};

Perusal.reducer = reducer;

export * from "./reducer";

Perusal.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  displayTodoAlert: PropTypes.func.isRequired,
};

export default Perusal;
