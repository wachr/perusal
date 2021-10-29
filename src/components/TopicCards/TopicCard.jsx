import { h } from "preact";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";
import TopicSubtopics from "./TopicSubtopics";
import TopicTitle from "./TopicTitle";
import TopicUnrenderableAlert from "./TopicUnrenderableAlert";

function TopicCard({ topic }) {
  return (
    <Box sx={{ width: "400px", padding: "3px" }}>
      <Card>
        {discriminating(topic)
          .considering(TOPIC_STRING)
          .renderWith(() => <TopicTitle topic={topic} />)
          .considering(TOPIC_OBJECT)
          .renderWith(() => (
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
          ))
          .defaultTo(() => <TopicUnrenderableAlert topic={topic} />)
          .render()}
      </Card>
    </Box>
  );
}

export const SINGLE_TOPIC_PROP_TYPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    topicTitle: PropTypes.string.isRequired,
    topicDetails: PropTypes.string,
    topicSubtopics: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          topicTitle: PropTypes.string.isRequired
        })
      ]).isRequired
    )
  })
]).isRequired;

TopicCard.proptypes = {
  topic: SINGLE_TOPIC_PROP_TYPE.isRequired
};

export default TopicCard;
