const router = require("express").Router();
const models = require("../models");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const { validation } = require("../functions/validation");

// 글 작성
router.post("/", verifyToken, async (req, res) => {
  if (validation(req.body.title, "title", res)) return;
  if (validation(req.body.content, "content", res)) return;

  try {
    const newArticle = await models.Articles.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json({ newArticle, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
});

// 글 목록 확인 (pagination의 경우, 한 페이지 당 5개의 글을 가져오도록 설정)
router.get("/", async (req, res) => {
  const page = req.query.page;
  const limit = 5;
  let offset = 0;
  if (page > 1) offset = limit * (page - 1);

  try {
    const articles = page
      ? await models.Articles.findAll({ offset, limit })
      : await models.Articles.findAll();
    articles.length !== 0
      ? res.status(200).json({ articles, message: "Success!" })
      : res.status(404).json({ message: "Page Not Found!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
});

// 글 확인
router.get("/:id", async (req, res) => {
  try {
    const article = await models.Articles.findOne({
      where: { id: req.params.id },
    });
    res.status(200).json({ article, message: "Success!" });
  } catch (err) {
    res.status(404).json({ message: "Article Not Found!" });
  }
});

// 글 수정
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (validation(req.body.title, "title", res)) return;
  if (validation(req.body.content, "content", res)) return;

  try {
    const updatedArticle = await models.Articles.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ updatedArticle, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
});

// 글 삭제
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const article = await models.Articles.findOne({
    where: { id: req.params.id },
  });
  !article && res.status(404).json({ message: "Article Not Found!" });

  try {
    await models.Articles.destroy({
      where: { id: req.params.id },
    }).then(() => {
      res.status(200).json({ id: req.params.id, message: "Success!" });
    });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
});

module.exports = router;
