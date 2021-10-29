import { h, Fragment } from "preact";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

import {
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";

function TopicTitle({ topic }) {
  return discriminating(topic)
    .considering(TOPIC_STRING, TOPIC_OBJECT)
    .renderWith(() => (
      <Typography variant="h6" data-testid="topic-title">
        {topic.topicTitle || topic}
      </Typography>
    ))
    .render();
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
