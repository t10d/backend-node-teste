export const roots = ["<rootDir>/src"];
export const collectCoverageFrom = ["<rootDir>/src/**/*.ts"];
export const coverageDirectory = "coverage";
export const testEnvironment = "node";
export const transform = {
  ".+\\.ts$": "ts-jest",
};
