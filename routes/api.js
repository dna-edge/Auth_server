const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {
  router.route('/users/login').post(userCtrl.login);
  router.route('/users/register').post(userCtrl.register);
  router.route('/auth').get(authCtrl.auth);
  router.route('/auth/refresh').get(authCtrl.refresh);

  return router;
};