const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

module.exports = {
  path: '/data_v',
  name: 'data_v',
  getComponent(nextState, cb) {
    System.import('./index')
      .then(loadModule(cb))
      .catch(errorLoading);
  },
  childRoutes: [
    require('./DataSourcePage/routes')
  ]
};