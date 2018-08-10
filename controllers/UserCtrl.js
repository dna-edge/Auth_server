const validator = require('validator');

const helpers = require('../utils/helpers');
const userModel = require('../models/UserModel');

let validationError = {
  name:'ValidationError',
  errors:{}
};

/*******************
 *  Register
 *  TODO validation
 *  TODO 이미지 등록
 ********************/
exports.register = async (req, res, next) => {   
  /* PARAM */
  const id = req.body.id || req.params.id;
  const password = req.body.password || req.params.password;
  const confirm_password = req.body.confirm_password || req.params.confirm_password;
  const email = req.body.email || req.params.email;
  const nickname = req.body.nickname || req.params.nickname;

  /* 1. 유효성 체크하기 */
  let validpassword;
  let isValid = true;
  
  if (!id || validator.isEmpty(id)) {
    isValid = false;
    validationError.errors.id = { message : "ID is required" };
  }

  if (!nickname || validator.isEmpty(nickname)) {
    isValid = false;
    validationError.errors.nickname = { message : "Nickname is required" };
  }

  if (!email || validator.isEmpty(email)) {
    isValid = false;
    validationError.errors.email = { message : "Email is required" };
  }

  if (!validator.isEmail(email)) {
    isValid = false;
    validationError.errors.email = { message : "Invalid email format" };
  }

  if (!password || validator.isEmpty(password)) {
    isValid = false;
    validationError.errors.password = { message : "Password is required" };
  }
  
  // 입력한 비밀번호가 서로 일치하는지 체크
  if (password !== confirm_password) {
    isValid = false;
    validationError.errors.password = { message : "Passwords do not match" };
  } else {
    validpassword = password;
  }

  if (!isValid) return res.status(400).json(validationError);
  /* 유효성 체크 끝 */

  // 2. 아바타용 이미지를 업로드했는지 체크
  // TODO 이미지 업로드 처리하기
  let image;
  if (!req.file) {
    image = null;
  } else {
    image = req.file.location;
  }

  // 3. 결과 암호화해서 DB에 저장하기
  let result = '';
  try {
    const encodedPassword = helpers.doCypher(validpassword);
    const userData = {
      id,
      password: encodedPassword.password,
      nickname,
      email,
      avatar,
      salt: encodedPassword.newSalt
    };
    result = await userModel.register(userData);
  } catch (error) {
    // TODO 에러 잡았을때 응답메세지, 응답코드 수정할것
    return next(error);
  }
  // 4. 등록 성공
  const respond = {
    status: 201,
    message : "Register Successfully",
    data: result[0]
  };
  return res.status(201).json(respond);
};


/*******************
 *  Login
 ********************/
exports.login = async (req, res, next) => {
  /* PARAM */
  const id = req.body.id || req.params.id;
  const password = req.body.password || req.params.password;

  /* 유효성 체크하기 */
  let isValid = true;

  if (!id || validator.isEmpty(id)) {
    isValid = false;
    validationError.errors.id = { message : 'ID is required!' };
  }

  if (!password || validator.isEmpty(password)) {
    isValid = false;
    validationError.errors.password = { message:'Password is required!' };
  }

  if (!isValid) return res.status(400).json(validationError);
  /* 유효성 체크 끝 */

  let result = '';

  try {
    // TODO 회원이 없을 경우

    const getSalt = await userModel.getSalt(id);

    const decodedPassword = helpers.doCypher(password, getSalt.salt).password;
    const userData = {
      id: id,
      password: decodedPassword
    };

    result = await userModel.login(userData);

  } catch (error) {
    return next(error);
  }

  /* 로그인 성공 시 */
  const respond = {
    status: 200,
    message : "Login Successfully",
    data: result
  };
  return res.status(200).json(respond);  
};