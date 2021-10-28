import { h } from "preact";
import PropTypes from "prop-types";

import {
  TOPIC_ARRAY,
  TOPIC_OBJECT,
  TOPIC_STRING,
  TOPIC_UNKNOWN,
  SINGLE_TOPIC_PROP_TYPE
} from "./constants";
import { discriminateTopic } from "./utils";
import TopicCard from "./TopicCard";
import TopicSubtopics from "./TopicSubtopics";
import TopicTitle from "./TopicTitle";

export default function TopicCardsArea({ topics }) {
  function renderTopic(topics) {
    switch (discriminateTopic(topics)) {
      case TOPIC_ARRAY:
        return topics.map(topic => <TopicCard topic={topic} />);
      case TOPIC_OBJECT:
      case TOPIC_STRING:
        return <TopicCard topic={topics} />;
      case TOPIC_UNKNOWN:
      default:
        throw new Error(`Unable to render topic ${topics}`);
    }
  }
  return <div id="TopicCards">{renderTopic(topics)}</div>;
}

TopicCardsArea.propTypes = {
  topics: PropTypes.oneOfType([
    PropTypes.arrayOf(SINGLE_TOPIC_PROP_TYPE),
    SINGLE_TOPIC_PROP_TYPE
  ]).isRequired
};
