const getWorldParameters = () => {
  return {
    SERVER_URL: process.env.SERVER_URL,
  };
};

const config = {
  requireModule: ['ts-node/register'],
  require: ['e2e/**/*.ts'],
  paths: ['e2e/**/*.feature'],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/index.html',
    'summary',
    'progress-bar',
    '@cucumber/pretty-formatter',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: getWorldParameters(),
};

export default config;
