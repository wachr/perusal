import { h } from "preact";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRoute } from "wouter-preact";

import {
  TOPIC_OBJECT,
  TOPIC_STRING,
  discriminating
} from "./DiscriminatingByType";
import TopicSubtopics from "./TopicSubtopics";
import TopicTitle from "./TopicTitle";
import TopicUnrenderableAlert from "./TopicUnrenderableAlert";
import { selectByPath } from "./Lenses";

function TopicCard({ topic }) {
  const [_, { topicPath }] = useRoute("/:topicPath*");
  const path = (topicPath && topicPath.split("/")) || [];
  const topicToRender = selectByPath(topic, path);
  if (!topicToRender) return null;
  return (
    <div id="TopicCard" data-testid="topic-card">
      <Box sx={{ width: "400px", padding: "3px" }}>
        <Card>
          {discriminating(topicToRender)
            .considering(TOPIC_STRING)
            .renderWith(() => <TopicTitle topic={topicToRender} />)
            .considering(TOPIC_OBJECT)
            .renderWith(() => (
              <Stack>
                <TopicTitle topic={topicToRender} />
                {(topic.topicDetails || topic.topicSubtopics) && <Divider />}
                {topic.topicDetails && (
                  <Typography variant="body" data-testid="topic-details">
                    {topic.topicDetails}
                  </Typography>
                )}
                <TopicSubtopics topic={topicToRender} />
              </Stack>
            ))
            .defaultTo(() => (
              <TopicUnrenderableAlert topic={topicToRender || topicPath} />
            ))
            .render()}
        </Card>
      </Box>
    </div>
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
