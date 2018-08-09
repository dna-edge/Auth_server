const env = global.env;

/* redis */
const redis = require('redis').createClient(env.REDIS_PORT, env.EC2_HOST);
redis.auth(env.DB_PASSWORD);

/* mysql */
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME
});

module.exports.mysql = connection;
module.exports.redis = redis;