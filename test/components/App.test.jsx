import { h } from "preact";
import { render } from "@testing-library/preact";

import App from "../../src/components/App";

describe(App.name, () => {
  it("renders", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
