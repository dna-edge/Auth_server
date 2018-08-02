const authModel = require('../models/AuthModel');

/*******************
 *  Authenticate
 ********************/

exports.login = (req, res, next) => {
  /* 유효성 체크하기 */
  let isValid = true;
  let validationError = {
    name:'ValidationError',
    errors:{}
  };

  if (!req.body.id) {
    isValid = false;
    validationError.errors.id = { message:'ID is required!' };
  }
  if (!req.body.password) {
    isValid = false;
    validationError.errors.password = { message:'Password is required!' };
  }

  if (!isValid) return res.status(400).json(validationError);
  /* 유효성 체크 끝 */

  let result = '';

  try {
    const getSalt = await userModel.getSalt(req.body.id);

    // TODO 회원이 없을 경우
    // TODO salt가 undefined일 경우

    const userData = {
      id: req.body.id,
      password: global.utils.doCypher(req.body.pw, getSalt.salt).password
    };

    result = await authModel.login(userData);

    const sessionData = {
      token: result.token,
      idx: result.profile.idx,
      id: result.profile.id,
      nickname: result.nickname
    };
  } catch (error) {
    return next(error);
  }

  /* 로그인 성공 시 */
  return res.status(200).json(result);  
};

/*

if (!req.headers.token) {
    return next (401);
  } else {
    authModel.auth(req.headers.token, (err, decoded) => {
      if (err) {
        return next(err);
      } else {
        req.userInfo = decoded;
        return next;
      }
    });
  }

  */