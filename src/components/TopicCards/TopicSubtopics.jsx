import { h } from "preact";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";

import { TOPIC_OBJECT, TOPIC_STRING } from "./constants";
import { discriminating } from "./utils";

function TopicSubtopics({ topic }) {
  return discriminating(topic)([TOPIC_STRING, TOPIC_OBJECT], () => {
    if (!topic.topicSubtopics) return null;
    const listItems = topic.topicSubtopics
      .filter(subtopic => typeof subtopic === "string" || subtopic.topicTitle)
      .map(subtopic => (
        <ListItem disablePadding>
          <ListItemText inset primary={subtopic.topicTitle || subtopic} />
        </ListItem>
      ));
    return <List>{listItems}</List>;
  });
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
  ])
};

export default TopicSubtopics;
