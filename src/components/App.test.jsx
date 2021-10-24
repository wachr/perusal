import { h } from "preact";
import { render, screen } from "@testing-library/preact";

import App from "./App";

describe(App.name, () => {
  it("renders", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
