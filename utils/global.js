const db = require('./db').db;
const redis = require('redis').createClient(6379, '127.0.0.1');

module.exports.db = db;
module.exports.redis = redis;