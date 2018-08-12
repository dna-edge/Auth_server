const redis = global.utils.redis;
const helpers = require('../utils/helpers');

/* cron 설정 (redis 삭제) */
const cron = require("node-cron");
exports.setCron = () => {
  cron.schedule("* * * * *", function() {
    console.log("---------------------");
    console.log("Running Cron Job");

    let count = 0;

    redis.hgetall('refreshTokens', function(err, reply) {
      if (err) {
        console.log("Error file succesfully deleted");
      }
      if (reply) {
        Object.keys(reply).forEach(key => {
          // 날짜를 서로 비교해 현재보다 앞에 있을 경우 삭제한다.
          if (reply[key] && JSON.parse(reply[key]).expiresIn < new Date().getTime()) {
              redis.hdel('refreshTokens', key);
              count++;
          }
        });
      }
      console.log(count + " Expired tokens deleted successfully");
    });
  });
  const fs = require("fs");
}