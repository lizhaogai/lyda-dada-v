const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

module.exports = {
  path: '/:appId/data_v/dataSource',
  name: 'dataSource',
  getComponent(nextState, cb) {
    System.import('./')
      .then(loadModule(cb))
      .catch(errorLoading);
  },
  childRoutes: [
    {
      path: '/:appId/data_v/dataSource/newLayer',
      name: 'newLayer',
      getComponent(nextState, cb) {
        System.import('./EditLayer')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/:appId/data_v/dataSource/newLayer/:layerId',
      name: 'EditLayer',
      getComponent(nextState, cb) {
        System.import('./EditLayer')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }
  ]
};