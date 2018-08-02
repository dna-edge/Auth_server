const authCtrl = require('../controllers/AuthCtrl');

module.exports = (router) => {
  router.route('/users/login')
    .post(authCtrl.login); 
}