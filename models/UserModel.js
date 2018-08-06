const db = global.utils.db;

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
      const sql = `INSERT INTO users (id, password, nickname, email, avatar) 
                          VALUES (?, ?, ?, ?, ?)`;
      db.query(sql, [userData.id, userData.password, userData.nickname, 
        userData.email, userData.avatar], (err, rows) => {
          if (err) {
            reject (err);
          } else {
            if (rows.affectedRows === 1) {
              resolve(rows);
            } else {
              const customErr = new Error("User register Custom Error");
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

