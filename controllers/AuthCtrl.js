const validator = require('validator');

const authModel = require('../models/AuthModel');
const helpers = require('../utils/helpers');
const errorCode = require('../utils/error').code;

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
        return res.json(errorCode[err]);
      } else {
        req.userData = userData;
        return next();

        // const respond = {
        //   status: 202,
        //   message: "Authenticate Successfully", 
        //   data: userData
        // };
        // return res.status(202).json(respond);
      }
    });
  }
};

/*******************
 *  Refresh Token
 ********************/
exports.refresh = async (req, res, next) => {
  if (!req.headers.token) {
    tokenError.errors = { message : "Refresh Token is required" };
    return res.status(400).json(tokenError);
  } else {
    let result = '';

    try {
      result = await authModel.refresh(req.headers.token);     
    } catch (err) {
      return res.json(errorCode[err]);
    }

    const respond = {
      status: 200,
      message: "New Access Token is successfully issued",
      data: result
    };

    return res.status(200).json(respond);  
  }
}