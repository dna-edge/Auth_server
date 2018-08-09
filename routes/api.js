const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {
  router.route('/users/login').post(userCtrl.login);        // 로그인
  router.route('/users/register').post(userCtrl.register);  // 회원가입
  router.route('/auth').get(authCtrl.auth);                 // 토큰 인증
  router.route('/auth/refresh').get(authCtrl.refresh);      // 토큰 재발급

  return router;
};