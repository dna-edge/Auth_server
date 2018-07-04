const jwt = require('jsonwebtoken');

const db = global.utils.db;
const redis = global.utils.redis;

/*******************
 *  Authenticate
 *  @param: token
 ********************/
exports.auth = (token, done) => {
  jwt.verify(token, process.env.JWT_CERT, (err, decoded) => {
    if (err) {
      switch (err.message) {
        case 'jwt expired':
          return done(10401);
        case 'invalid token':
          return done(10403);
        default:
          return done(err.message);
      }
    } else {
      done(decoded);
    }
  });
};