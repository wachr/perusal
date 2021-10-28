import { h, Fragment } from "preact";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

import { TOPIC_OBJECT, TOPIC_STRING } from "./constants";
import { discriminating } from "./utils";

function TopicTitle({ topic }) {
  return discriminating(topic)([TOPIC_STRING, TOPIC_OBJECT], () => (
    <Typography variant="h6" data-testid="topic-title">
      {topic.topicTitle || topic}
    </Typography>
  ));
}

TopicTitle.propTypes = {
  topic: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.shape({
      topicTitle: PropTypes.string.isRequired
    })
  ]).isRequired
};

export default TopicTitle;
