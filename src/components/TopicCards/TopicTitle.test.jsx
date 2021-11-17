import { h } from "preact";
import { fireEvent, render, screen } from "@testing-library/preact";

import TopicTitle from "./TopicTitle";

describe(TopicTitle.name, () => {
  it("should render objects", () => {
    render(<TopicTitle topic={{ topicTitle: "foo" }} />);
    const title = screen.queryByTestId("topic-title");
    expect(title).not.toBeNull();
    expect(title).toHaveTextContent("foo");
    expect(title).toMatchSnapshot();
  });

  it("should render strings", () => {
    render(<TopicTitle topic={"foo"} />);
    const title = screen.queryByTestId("topic-title");
    expect(title).not.toBeNull();
    expect(title).toHaveTextContent("foo");
    expect(title).toMatchSnapshot();
  });

  it("should not render arrays", () => {
    render(<TopicTitle topic={["foo"]} />);
    const title = screen.queryByTestId("topic-title");
    expect(title).toBeNull();
  });

  it("should not render objects without a title field", () => {
    render(<TopicTitle topic={{ foo: "foo" }} />);
    const title = screen.queryByTestId("topic-title");
    expect(title).toBeNull();
  });
});
