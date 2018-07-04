const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {
  router.route('/users/login')
    .post(userCtrl.login); 
}