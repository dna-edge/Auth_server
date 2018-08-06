const validator = require('validator');

const helpers = require('../utils/helpers');
const authModel = require('../models/AuthModel');

let tokenError = {
  name:'tokenError',
  errors:{}
};

/*******************
 *  Authenticate
 ********************/
exports.auth = (req, res, next) => {
  if (!req.headers.token) {
    tokenError.errors = { message : 'Access Token is required' };
    return res.status(400).json(tokenError);
  } else {
    authModel.auth(req.headers.token, (err, userData) => {
      if (err) {
        return next(err);
      } else {
        req.userData = userData;
        // return next();
        return res.status(202).json({message:"Authenticate Successfully", data: userData});
      }
    });
  }
};

/*******************
 *  Refresh Token
 ********************/
exports.refresh = (req, res, next) => {
  if (!req.headers.token) {
    tokenError.errors = { message : 'Refresh Token is required' };
    return res.status(400).json(tokenError);
  } else {
    
  }
}

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