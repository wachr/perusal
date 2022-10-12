import { h } from "preact";

import Types from "../../utils/Types";
import PropTypes from "prop-types";

import TopicDialog from "./TopicDialog";
import { onEmpty } from "./ops";

const EmptyActions = ({ nodeState, setNode }) =>
  onEmpty(() => <TopicDialog text="Add topic" update={setNode} />)(nodeState);

EmptyActions.propTypes = {
  nodeState: Types.nodeState.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default EmptyActions;
