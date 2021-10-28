import PropTypes from "prop-types";

const TOPIC_ARRAY = Symbol("TOPIC_ARRAY");
const TOPIC_OBJECT = Symbol("TOPIC_OBJECT");
const TOPIC_STRING = Symbol("TOPIC_STRING");
const TOPIC_UNKNOWN = Symbol("TOPIC_UNKNOWN");

const SINGLE_TOPIC_PROP_TYPE = PropTypes.oneOfType([
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
  })
]).isRequired;

export {
  TOPIC_ARRAY,
  TOPIC_OBJECT,
  TOPIC_STRING,
  TOPIC_UNKNOWN,
  SINGLE_TOPIC_PROP_TYPE
};
