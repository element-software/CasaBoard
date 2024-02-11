import "@testing-library/jest-dom";

// suppressing console.error 
const consoleError = console.error;
const consoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

afterAll(() => {
  console.error = consoleError;
  console.log = consoleLog;
});