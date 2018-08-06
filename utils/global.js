const db = require('./db').db;
const redis = require('redis').createClient(6379, '13.209.43.122');
redis.auth(process.env.REDIS_PASSWORD);

module.exports.db = db;
module.exports.redis = redis;