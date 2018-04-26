export const environment = {
  version: require('../../package.json').version,
  production: true,
  test: false,
  apiWorkingHours: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/prod/working-hours',
  apiProjects: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/prod/projects',
  apiComments: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/prod/comments'
};
