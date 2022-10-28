import { h } from "preact";

import Types from "../../utils/Types";
import PropTypes from "prop-types";

import TopicDialog from "./TopicDialog";
import { onEmpty } from "./ops";
import { PromoteEmptyToString } from "./reducer";

const EmptyActions = ({ nodeState, dispatch }) =>
  onEmpty(() => (
    <TopicDialog
      text="Add topic"
      update={(topic) => dispatch(PromoteEmptyToString(topic))}
    />
  ))(nodeState);

EmptyActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default EmptyActions;
