const db = global.utils.db;
const redis = global.utils.redis;

const jwt = require('jsonwebtoken');

/*******************
 *  Register
 *  @param: userData = {id, password, nickname, email, avatar}
 ********************/
exports.register = (userData) => {
  // 1. 아이디 중복 체크하기
  return new Promise((resolve, reject) => {    
    const sql = `SELECT id 
                   FROM users 
                  WHERE id = ?`;

    db.query(sql, [userData.id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length !== 0) {
          const customErr = new Error("This ID already exists");
          reject(customErr);
        } else {
          resolve(null);
        }
      }
    });
  })
  .then(() => {
    // 2. DB에 정보 삽입하기
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (id, password, nickname, email, avatar, salt) 
                          VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(sql, [userData.id, userData.password, userData.nickname, 
        userData.email, userData.avatar, userData.salt], (err, rows) => {
          if (err) {
            reject (err);
          } else {
            if (rows.affectedRows === 1) {
              resolve(rows);
            } else {
              const customErr = new Error("Error occurred while saving the user data into DB");
              reject(customErr);
            }
          }
      });
    });
  })
  .then((result) => {
    // 3. 결과 조회해 돌려주기
    return new Promise((resolve, reject) => {
      const sql = `SELECT idx, id 
                     FROM users 
                    WHERE idx = ?`;
      
      db.query(sql, result.insertId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
};

/*******************
 *  Login
 *  @param: userData = {id, password}
 *  TODO refresh token
 ********************/
exports.login = (userData) => {
  // 1. 아이디 체크
  return new Promise((resolve, reject) => {
    const sql = `SELECT id
                   FROM users
                  WHERE id = ?`;
    
    db.query(sql, [userData.id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) { // 해당 아이디 없음
          const customErr = new Error("This ID does not exist");
          reject(customErr);
        } else {
          resolve(null);
        }
      }
    });
  })
  .then(() => {
    // 2. 비밀번호 체크
    return new Promise((resolve, reject) => {
      const sql = `SELECT idx, id, nickname, avatar
                     FROM users
                    WHERE id = ? AND password = ?`;

      db.query(sql, [userData.id, userData.password], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) { // 비밀번호가 틀렸을 경우
            const customErr = new Error("Wrong Password");
            reject(customErr);
          } else {
            const profile = {
              idx: rows[0].idx,
              id: rows[0].id,
              nickname: rows[0].nickname,
              avatar: rows[0].avatar
            };

            resolve(profile);
          }
        }
      });
    });
  })
  .then((profile) => {
    // 3. 토큰 발급 및 저장
    return new Promise((resolve, reject) => {
      const token = {
        accessToken: jwt.sign(profile, process.env.JWT_CERT, {'expiresIn': "12h"}),
        refreshToken: jwt.sign(profile, process.env.JWT_CERT, {'expiresIn': "7 days"})
      };

      redis.set(token.refreshToken, profile.id, 'EX', 7*24*60*60); // 7일 후 삭제됨
      redis.get(token.refreshToken,(err, object) => {
        if (err){
          const customErr = new Error("Error occurred while saving the token into Redis: " + err);
          reject(customErr);
        } else {
          console.log(object); // refresh 토큰까지 완벽하게 저장된 경우
          const result = {
            profile,
            token
          };
      
          resolve(result);
        }
      });
    });    
  })
};            
        

/****************
 *  salt 조회
 *  @param: userData = {id}
 *  @returns {Promise<any>}
 */
exports.getSalt = (userData) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT salt 
                   FROM users 
                  WHERE id = ?`;

    db.query(sql, [userData], (err, rows) => {
      if (err){
        reject(err);
      } else {
        if (rows.length === 0) { // 해당 아이디 없음
          const customErr = new Error("This ID does not exist");
          reject(customErr);
        } else {
          resolve(rows[0]);
        }
      }
    });
  });
};