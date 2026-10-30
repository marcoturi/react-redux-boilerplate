const getWorldParameters = () => {
  return {
    SERVER_URL: process.env.SERVER_URL,
  };
};

const config = {
  requireModule: ['ts-node/register'],
  require: ['e2e/**/*.ts'],
  paths: ['e2e/**/*.feature'],
  // Only one formatter can write to stdout: the others need a file target
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/index.html',
    'pretty',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: getWorldParameters(),
};

export default config;
