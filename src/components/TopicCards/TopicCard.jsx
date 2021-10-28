import { h } from "preact";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  TOPIC_ARRAY,
  TOPIC_OBJECT,
  TOPIC_STRING,
  TOPIC_UNKNOWN,
  SINGLE_TOPIC_PROP_TYPE
} from "./constants";
import { discriminateTopic } from "./utils";
import TopicSubtopics from "./TopicSubtopics";
import TopicTitle from "./TopicTitle";

export default function TopicCard({ topic }) {
  function renderTopic() {
    switch (discriminateTopic(topic)) {
      case TOPIC_STRING:
        return <TopicTitle topic={topic} />;
      case TOPIC_OBJECT:
        return (
          <Stack>
            <TopicTitle topic={topic} />
            {(topic.topicDetails || topic.topicSubtopics) && <Divider />}
            {topic.topicDetails && (
              <Typography variant="body" data-testid="topic-details">
                {topic.topicDetails}
              </Typography>
            )}
            <TopicSubtopics topic={topic} />
          </Stack>
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
  topic: SINGLE_TOPIC_PROP_TYPE.isRequired
};
