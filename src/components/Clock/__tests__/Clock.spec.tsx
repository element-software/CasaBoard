import { render } from "@testing-library/react";
import Clock from "..";
import React from "react";

describe('Clock', () => {
  it('should render the component successfully', () => {
    const { getByText } = render(<Clock />);

    expect(getByText(new Date().toLocaleTimeString().slice(0,5))).toBeInTheDocument();
  });
});