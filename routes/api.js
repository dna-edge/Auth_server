const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {
  router.route('/users/login').post(authCtrl.login);
  router.route('/users/register').post(userCtrl.register);

  return router;
};