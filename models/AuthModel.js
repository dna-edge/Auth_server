const redis = global.utils.redis;

const jwt = require('jsonwebtoken');

/*******************
 *  Authenticate
 *  @param: (Access) token
 ********************/
exports.auth = (token, done) => {
  jwt.verify(token, process.env.JWT_CERT, (err, decoded) => {
    if (err) {
      let customErr = '';

      switch (err.message) {
        case 'jwt expired':
          customErr = new Error("Token is expired");
          return done(customErr);
        case 'invalid token':
          customErr = new Error("Token is invalid");
          return done(customErr);
        default:
          return done(err.message);
      }
    } else {
      done(null, decoded);
    }
  });
};


/*******************
 *  Authenticate
 *  @param: (Refresh) token
 ********************/
exports.refresh = (token, done) => {
  
}