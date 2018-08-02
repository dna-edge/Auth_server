const helpers = require('../utils/helpers');
const userModel = require('../models/UserModel');

/*******************
 *  Register
 *  TODO validation
 ********************/

 exports.register = async(req, res, next) => {
   let password;
   if (req.body.password != req.body.confirm_password) {
     return res.status(400).json({ message : "Passwords do not match" });
   } else {
     password = req.body.password;
   }

   let image;
   if (!req.file) { // 이미지가 없는 경우
     image = null;
   } else {
     image = req.file.location;
   }

   let result = '';
   try {
     const encodedPassword = helpers.encrypt(password);
     const userData = {
       id: req.body.id,
       password: encodedPassword,
       nickname: req.body.nickname,
       email: req.body.email,
       avatar: image
     };

     result = await userModel.register(userData);
   } catch (error) {
     // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
     return next(error);
   }

   // success
  return res.status(201).json({
    message: "Register Successfully",
    result: result[0]
  });
 }