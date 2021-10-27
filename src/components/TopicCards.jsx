import { h, Fragment } from "preact";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const TOPIC_ARRAY = Symbol("TOPIC_ARRAY");
const TOPIC_OBJECT = Symbol("TOPIC_OBJECT");
const TOPIC_LEGACY = Symbol("TOPIC_LEGACY");
const TOPIC_STRING = Symbol("TOPIC_STRING");
const TOPIC_UNKNOWN = Symbol("TOPIC_UNKNOWN");

function discriminateTopic(topic) {
  if (Array.isArray(topic)) return TOPIC_ARRAY;
  if (topic && topic.topicTitle) return TOPIC_OBJECT;
  if (topic && topic.title) return TOPIC_LEGACY;
  if (topic && typeof topic === "string") return TOPIC_STRING;
  return TOPIC_UNKNOWN;
}

const singleTopicPropType = PropTypes.oneOfType([
  // TOPIC_STRING
  PropTypes.string,
  // TOPIC_OBJECT
  PropTypes.shape({
    topicTitle: PropTypes.string.isRequired,
    topicDetails: PropTypes.string,
    topicSubtopics: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          topicTitle: PropTypes.string.isRequired
        }),
        PropTypes.string
      ]).isRequired
    )
  }),
  // TOPIC_LEGACY
  PropTypes.shape({
    title: PropTypes.string.isRequired,
    details: PropTypes.string,
    content: PropTypes.string
  })
]).isRequired;

export function TopicCard({ topic }) {
  function renderSubtopics() {
    if (!topic.topicSubtopics) return null;
    const listItems = topic.topicSubtopics
      .filter(subtopic => typeof subtopic === "string" || subtopic.topicTitle)
      .map(subtopic => (
        <ListItem disablePadding>
          <ListItemText inset primary={subtopic.topicTitle || subtopic} />
        </ListItem>
      ));
    return <List>{listItems}</List>;
  }
  function renderTopic() {
    const titleVariant = "h6";
    switch (discriminateTopic(topic)) {
      case TOPIC_STRING:
        return (
          <Typography variant={titleVariant} data-testid="topic-title">
            {topic}
          </Typography>
        );
      case TOPIC_OBJECT:
        return (
          <Stack>
            <Typography variant={titleVariant} data-testid="topic-title">
              {topic.topicTitle}
            </Typography>
            {(topic.topicDetails || topic.topicSubtopics) && <Divider />}
            {topic.topicDetails && (
              <Typography variant="body" data-testid="topic-details">
                {topic.topicDetails}
              </Typography>
            )}
            {renderSubtopics()}
          </Stack>
        );
      case TOPIC_LEGACY:
        return (
          <Fragment>
            <Typography variant={titleVariant} data-testid="topic-legacy-title">
              {topic.title}
            </Typography>
            {(topic.details || topic.content) && (
              <Skeleton
                variant="rectangle"
                data-testid="topic-legacy-details"
              />
            )}
          </Fragment>
        );
      case TOPIC_ARRAY:
        throw new Error(`Cannot render array as TopicCard: ${topic}`);
      case TOPIC_UNKNOWN:
      default:
        throw new Error(
          `Unable to render TopicCard for ${JSON.stringify(topic)}`
        );
    }
  }
  return (
    <Box sx={{ width: "400px", padding: "3px" }}>
      <Card>{renderTopic()}</Card>
    </Box>
  );
}

TopicCard.proptypes = {
  topic: singleTopicPropType.isRequired
};

export default function TopicCards({ topics }) {
  function renderTopic(topics) {
    switch (discriminateTopic(topics)) {
      case TOPIC_ARRAY:
        return topics.map(topic => <TopicCard topic={topic} />);
      case TOPIC_OBJECT:
      case TOPIC_LEGACY:
      case TOPIC_STRING:
        return <TopicCard topic={topics} />;
      case TOPIC_UNKNOWN:
      default:
        throw new Error(`Unable to render topic ${topics}`);
    }
  }
  return <div id="TopicCards">{renderTopic(topics)}</div>;
}

TopicCards.propTypes = {
  topics: PropTypes.oneOfType([
    PropTypes.arrayOf(singleTopicPropType),
    singleTopicPropType
  ]).isRequired
};
