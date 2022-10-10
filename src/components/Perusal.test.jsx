import { h } from "preact";

import { fireEvent, render, screen } from "@testing-library/preact";

import Perusal from "./Perusal";

describe(Perusal.name, () => {
  it.skip("should support adding a simple field to an empty state", async () => {
    const initialState = {};
    const mockSetNode = jest.fn();
    render(<Perusal nodeState={initialState} setNode={mockSetNode} />);
    const addButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(addButton);
    const newTopicField = await screen.findByRole("textbox", { name: "topic" });
    fireEvent.change(newTopicField, { target: { value: "foo" } });
    const addTopicButton = screen.getByRole("button", { name: "add" });
    fireEvent.click(addTopicButton);
    await screen.findByText("foo");
    expect(mockSetNode).toHaveBeenCalledWith("foo");
  });
});
