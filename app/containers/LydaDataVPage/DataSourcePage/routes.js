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
        const importModules = Promise.all([System.import('./Layer')]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/:appId/data_v/dataSource/layer/:layerId',
      name: 'EditLayer',
      getComponent(nextState, cb) {
        const importModules = Promise.all([require('./Layer')]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      }
    }
  ]
};