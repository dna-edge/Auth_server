const crypto = require('crypto');

exports.encrypt = (text) => {
  var cipher = crypto.createCipher(process.env.CYPHER_CODE, process.env.CYPHER)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.decrypt = (text) => {
  var decipher = crypto.createDecipher(process.env.CYPHER_CODE, process.env.CYPHER)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}