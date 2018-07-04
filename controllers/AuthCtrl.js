const authModel = require('../models/AuthModel');

/*******************
 *  Authenticate
 ********************/

exports.auth = (req, res, next) => {
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
};