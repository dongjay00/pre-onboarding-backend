const router = require("express").Router();
const models = require("../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// 양식 검토 함수
const validation = (form, kind, res) => {
  const validationErrors = {};
  if (form === undefined || form === "" || form === null) {
    validationErrors[kind] = `${kind} is required!`;
  }

  if (Object.keys(validationErrors).length > 0) {
    res.status(422).json({
      result: "failed",
      data: validationErrors,
    });
  }
};

// 회원가입
router.post("/register", async (req, res) => {
  validation(req.body.username, "username", res);
  validation(req.body.email, "email", res);
  validation(req.body.password, "password", res);

  try {
    const newUser = await models.Users.create({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.AES_SECRET_KEY
      ).toString(),
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 로그인
router.post("/login", async (req, res) => {
  validation(req.body.username, "username", res);
  validation(req.body.password, "password", res);

  try {
    const user = await models.Users.findOne({
      where: {
        username: req.body.username,
      },
    });
    !user &&
      res.status(401).json(`There is no user named ${req.body.username}`);

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.AES_SECRET_KEY
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Password is wrong!");

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.status(200).json({ user, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
