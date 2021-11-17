import { h } from "preact";
import { render, screen } from "@testing-library/preact";

import { TOPIC_OBJECT, TOPIC_STRING } from "./DiscriminatingByType";

import TopicSubtopics from "./TopicSubtopics";

describe(TopicSubtopics.name, () => {
  test.each([
    [TOPIC_STRING, "foo", 0],
    [TOPIC_OBJECT, { topicTitle: "foo", topicSubtopics: ["bar"] }, 1],
    [TOPIC_OBJECT, { topicTitle: "foo", topicSubtopics: ["bar", "bar2"] }, 2],
    [
      TOPIC_OBJECT,
      { topicTitle: "foo", topicSubtopics: [{ topicTitle: "bar" }] },
      1
    ],
    [
      TOPIC_OBJECT,
      {
        topicTitle: "foo",
        topicSubtopics: [{ topicTitle: "bar", topicSubtopics: ["baz"] }]
      },
      1
    ],
    [
      TOPIC_OBJECT,
      { topicTitle: "foo", topicSubtopics: [{ topicTitle: "bar" }, "bar2"] },
      2
    ],
    [
      TOPIC_OBJECT,
      {
        topicTitle: "foo",
        topicSubtopics: [{ topicTitle: "bar" }, { topicTitle: "bar2" }]
      },
      2
    ],
    [
      TOPIC_OBJECT,
      {
        topicTitle: "foo",
        topicSubtopics: [
          { topicTitle: "bar", topicSubtopics: [{ topicTitle: "baz" }] }
        ]
      },
      1
    ]
  ])("should render %s topic", (topicType, topic, subtopicsCount) => {
    render(<TopicSubtopics topic={topic} />);
    const subtopics = screen.queryAllByTestId("topic-subtopic");
    expect(subtopics.length).toEqual(subtopicsCount);
  });
});
