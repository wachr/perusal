import { h } from "preact";
import { fireEvent, render, screen } from "@testing-library/preact";

import { TOPIC_STRING, discriminating } from "./DiscriminatingByType";
import { selectByPath } from "./Lenses";
import TopicCard from "./TopicCard";

describe(TopicCard.name, () => {
  it("should render with minimal state", () => {
    render(<TopicCard topic={"foo"} />);
    const topicCard = screen.queryByTestId("topic-card");
    expect(topicCard).toMatchSnapshot();
  });

  it("should be able to render a minimal subtopic", () => {
    const topic = {
      topicTitle: "foo",
      topicSubtopics: ["bar"]
    };
    const path = ["foo", "bar"];
    render(<TopicCard topic={topic} path={path} />);
    expect(selectByPath(topic, path)).toBe("bar");
    expect(discriminating(selectByPath(topic, path)).type()).toBe(TOPIC_STRING);
    const topicCard = screen.queryByTestId("topic-card");
    expect(topicCard).toMatchSnapshot();
  });

  it("should be able to lens into a subtopic", () => {
    const topic = {
      topicTitle: "foo",
      topicSubtopics: ["bar", "baz"]
    };
    const path = ["foo", "bar"];
    render(<TopicCard topic={topic} path={path} />);
    const topicCard = screen.queryByTestId("topic-card");
    expect(topicCard).not.toHaveTextContent("foo");
    expect(topicCard).toHaveTextContent("bar");
    expect(topicCard).not.toHaveTextContent("baz");
  });
});
