
export default {
  //
  // `deploy.default.js`
  // - The main sections in this file are the `deployment labels`
  // - Each main section may contain deployment information about the services
  //   in the deployment e.g. `arangodb`
  //
  // - can be used to set default deployment data
  // - will be added to git: do not add passwords, secrets or other private
  //   information
  // - use `deploy.local.js` to override or extend this config
  //

  local: {
    arangodb: {
      endpoint: 'tcp://localhost:8529',
      username: 'the-username',
      password: 'the-password',
      database: 'the-database-name'
    }
  }
  // test: ...
  // production: ...
};