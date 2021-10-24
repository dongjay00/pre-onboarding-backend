const models = require("../../models");
const { validation } = require("../../functions/validation");

// 글 작성
const createArticle = async (req, res) => {
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
};

// 글 목록 확인 (pagination의 경우, 한 페이지 당 'limit'개의 글을 가져오도록 설정)
const getArticles = async (req, res) => {
  const page = req.query.page;
  const limit = 5;
  let offset = 0;
  if (page > 1) offset = limit * (page - 1);

  try {
    const articles = page
      ? await models.Articles.findAll({ offset, limit })
      : await models.Articles.findAll();
    page && articles.length === 0
      ? res.status(404).json({ message: "Page Not Found!" })
      : res.status(200).json({ articles, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
};

// 글 확인
const showArticle = async (req, res) => {
  try {
    const article = await models.Articles.findOne({
      where: { id: req.params.id },
    });
    article === null
      ? res.status(404).json({ message: "Article Not Found!" })
      : res.status(200).json({ article, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
};

// 글 수정
const editArticle = async (req, res) => {
  if (validation(req.body.title, "title", res)) return;
  if (validation(req.body.content, "content", res)) return;

  try {
    const updatedArticle = await models.Articles.update(
      {
        title: req.body.title,
        content: req.body.content,
        UserId: req.user.id,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ updatedArticle, message: "Success!" });
  } catch (err) {
    res.status(400).json({ err, message: "Bad request!" });
  }
};

// 글 삭제
const deleteArticle = async (req, res) => {
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
};

module.exports = {
  createArticle,
  getArticles,
  showArticle,
  editArticle,
  deleteArticle,
};
