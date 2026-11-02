export default {
  // Node strips the types and runs the steps: `tsc -b` (pnpm check) checks them
  import: ['e2e/**/*.ts'],
  paths: ['e2e/**/*.feature'],
  // Only one formatter can write to stdout: the others need a file target
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/index.html',
    'pretty',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: { SERVER_URL: process.env.SERVER_URL },
};
