import '../src/app/globals.css';
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "light",
          value: "#f5f5f5",
        },
        {
          name: "dark",
          value: "#171717",
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
