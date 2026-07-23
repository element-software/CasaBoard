import { render } from "@testing-library/react";
import Clock from "..";
import React from "react";

describe('Clock', () => {
  it('should render the component successfully', () => {
    const { getByText } = render(<Clock />);

    const now = new Date();
    const expected = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    expect(getByText(expected)).toBeInTheDocument();
  });
});