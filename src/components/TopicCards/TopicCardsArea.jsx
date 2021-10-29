import { h } from "preact";
import PropTypes from "prop-types";

import {
  TOPIC_ARRAY,
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";
import TopicCard, { SINGLE_TOPIC_PROP_TYPE } from "./TopicCard";
import TopicSubtopics from "./TopicSubtopics";
import TopicTitle from "./TopicTitle";
import TopicUnrenderableAlert from "./TopicUnrenderableAlert";

function TopicCardsArea({ topics }) {
  return (
    <div id="TopicCards">
      {discriminating(topics)
        .considering(TOPIC_ARRAY)
        .renderWith(() => topics.map(topic => <TopicCard topic={topic} />))
        .considering(TOPIC_OBJECT, TOPIC_STRING)
        .renderWith(() => <TopicCard topic={topics} />)
        .defaultTo(() => <TopicUnrenderableAlert topic={topics} />)
        .render()}
    </div>
  );
}

TopicCardsArea.propTypes = {
  topics: PropTypes.oneOfType([
    PropTypes.arrayOf(SINGLE_TOPIC_PROP_TYPE),
    SINGLE_TOPIC_PROP_TYPE
  ]).isRequired
};

export default TopicCardsArea;
