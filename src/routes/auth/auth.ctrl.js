const models = require("../../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { validation } = require("../../functions/validation");

// 회원가입
const register = async (req, res) => {
  if (validation(req.body.username, "username", res)) return;
  if (validation(req.body.email, "email", res)) return;
  if (validation(req.body.password, "password", res)) return;

  try {
    const _newUser = await models.Users.create({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.AES_SECRET_KEY
      ).toString(),
    });

    const { password, ...newUser } = _newUser.dataValues;

    res.status(201).json({ newUser, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
};

// 로그인
const login = async (req, res) => {
  if (validation(req.body.username, "username", res)) return;
  if (validation(req.body.password, "password", res)) return;

  try {
    const _user = await models.Users.findOne({
      where: {
        username: req.body.username,
      },
    });
    !_user &&
      res
        .status(401)
        .json({ message: `There is no user named ${req.body.username}` });

    const hashedPassword = CryptoJS.AES.decrypt(
      _user.password,
      process.env.AES_SECRET_KEY
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json({ message: "Password is wrong!" });

    const accessToken = jwt.sign(
      {
        id: _user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...user } = _user.dataValues;

    res.status(200).json({ user, accessToken, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
};

module.exports = { register, login };
