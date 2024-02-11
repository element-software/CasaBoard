import { render } from "@testing-library/react";
import Clock from "..";
import React from "react";

describe('Clock', () => {
  it('should render the component successfully', () => {
    const { getByText } = render(<Clock />);

    expect(getByText(/Current time:/)).toBeInTheDocument();
  });
});