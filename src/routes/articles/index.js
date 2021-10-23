const express = require("express");
const { verifyToken, verifyTokenAndAuthorization } = require("../verifyToken");
const router = express.Router();
const ctrl = require("./articles.ctrl");

router.post("/", verifyToken, ctrl.createArticle);
router.get("/", ctrl.getArticles);
router.get("/:id", ctrl.showArticle);
router.put("/:id", verifyTokenAndAuthorization, ctrl.editArticle);
router.delete("/:id", verifyTokenAndAuthorization, ctrl.deleteArticle);

module.exports = router;
