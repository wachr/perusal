import { h } from "preact";

import { fireEvent, render, screen } from "@testing-library/preact";

import StateInspector from "./StateInspector";

describe("StateInspector", () => {
  it("should render properly", async () => {
    const state = {
      title: "title",
      content: "content",
      subtopics: {
        "subtopic A": {
          title: "subtopic A",
          content: "subtopic details",
        },
        "subtopic B": {
          title: "subtopic B",
        },
      },
    };
    const mockSetter = jest.fn();
    render(<StateInspector nodeState={state} setNode={mockSetter} />);

    const subject = await screen.getByTestId("StateInspector-div");
    expect(subject).toMatchSnapshot();
  });

  it("should be collapsible", () => {
    render(<StateInspector nodeState={{}} setNode={jest.fn()} />);
    // App state is rendered by default
    expect(screen.queryAllByLabelText("app state")).not.toHaveLength(0);
    const collapseButton = screen.getByLabelText("show or hide state");
    fireEvent.click(collapseButton);
    expect(screen.queryByLabelText("app state")).toBeNull();
  });
});
