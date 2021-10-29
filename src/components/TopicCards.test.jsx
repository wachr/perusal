import { h } from "preact";
import { fireEvent, render, screen } from "@testing-library/preact";

import TopicCards from "./TopicCards";

describe(TopicCards.name, () => {
  it("should render each topic given an array", () => {
    const topics = ["foo", "bar"];
    render(<TopicCards topics={topics} />);
    const cards = screen.queryAllByTestId("topic-title");
    expect(cards.length).toBe(2);
  });

  it("should render one topic given an object", () => {
    const topics = { topicTitle: "foo" };
    render(<TopicCards topics={topics} />);
    const cards = screen.queryAllByTestId("topic-title");
    expect(cards.length).toBe(1);
  });

  it("should render one topic given a string", () => {
    const topics = "foo";
    render(<TopicCards topics={topics} />);
    const cards = screen.queryAllByTestId("topic-title");
    expect(cards.length).toBe(1);
  });

});
