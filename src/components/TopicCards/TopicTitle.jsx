import { h, Fragment } from "preact";
import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import { Link as WouterLink } from "wouter-preact";

import {
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";

function TopicTitle({ topic }) {
  return discriminating(topic)
    .considering(TOPIC_STRING, TOPIC_OBJECT)
    .renderWith(() => (
      <div data-testid="topic-title">
        <WouterLink href={topic.topicTitle || topic}>
          <Link variant="h6">{topic.topicTitle || topic}</Link>
        </WouterLink>
      </div>
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
