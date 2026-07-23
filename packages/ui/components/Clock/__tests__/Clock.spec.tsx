import { render } from "@testing-library/react";
import Clock from "..";
import React from "react";

describe("Clock", () => {
  it("should render the component successfully", () => {
    const { container } = render(<Clock />);

    const now = new Date();
    const expected = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    expect(container).toHaveTextContent(expected);
  });
});
