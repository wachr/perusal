import { h } from "preact";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link as WouterLink } from "wouter-preact";
import PropTypes from "prop-types";

import {
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";

function TopicSubtopics({ topic }) {
  return discriminating(topic)
    .considering(TOPIC_STRING, TOPIC_OBJECT)
    .renderWith(() => {
      if (!topic.topicSubtopics) return null;
      const listItems = topic.topicSubtopics
        .filter(subtopic => typeof subtopic === "string" || subtopic.topicTitle)
        .map(subtopic => (
          <ListItem disablePadding data-testid="topic-subtopic">
            <WouterLink
              href={[topic.topicTitle, subtopic.topicTitle || subtopic].join(
                "/"
              )}
            >
              <ListItemText inset primary={subtopic.topicTitle || subtopic} />
            </WouterLink>
          </ListItem>
        ));
      return <List>{listItems}</List>;
    })
    .render();
}

TopicSubtopics.propTypes = {
  topic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      topicSubtopics: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            topicTitle: PropTypes.string.isRequired
          })
        ])
      )
    })
  ]).isRequired
};

export default TopicSubtopics;
