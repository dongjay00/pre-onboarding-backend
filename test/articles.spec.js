const request = require("supertest");
const should = require("should");
const app = require("../src");
const models = require("../src/models");

let testToken, testUserId, testArticleId;

// testToken을 얻기 위한 작업
describe("Get testToken", () => {
  const testuser = {
    username: "testuser",
    password: "test1234",
  };

  it("Login", (done) => {
    request(app)
      .post("/api/auth/login")
      .send(testuser)
      .expect(200)
      .end((err, res) => {
        testToken = res.body.accessToken;
        testUserId = res.body.user.id;
        done();
      });
  });
});

const testArticle = {
  title: "test article",
  content: "This is test article",
};

// 글 작성 테스트
describe("POST /api/articles", () => {
  before(() => models.sequelize.sync());

  describe("If success", () => {
    let newArticle;

    before((done) => {
      request(app)
        .post("/api/articles")
        .set("token", testToken)
        .send(testArticle)
        .expect(201)
        .end((err, res) => {
          newArticle = res.body.newArticle;
          testArticleId = newArticle.id;
          done();
        });
    });

    it("Return created article object", () => {
      newArticle.should.have.property("id");
    });
    it("Return inserted title", () => {
      newArticle.should.have.property("title");
    });
  });

  describe("If failed", () => {
    it("Return 422 if title or content missed", (done) => {
      request(app)
        .post("/api/articles")
        .set("token", testToken)
        .send({})
        .expect(422)
        .end(done);
    });
  });
});

// 글 목록 확인 테스트
describe("GET /api/articles", () => {
  let articlesCount;
  before(() => models.sequelize.sync());

  describe("If success", () => {
    it("If get all Articles, return Array", (done) => {
      request(app)
        .get("/api/articles")
        .expect(200)
        .end((err, res) => {
          articlesCount = res.body.articles.length;
          res.body.articles.should.be.instanceOf(Array);
          done();
        });
    });

    it("If get articles of specific page, articles.length should be 1 to limit", (done) => {
      request(app)
        .get("/api/articles")
        .query({ page: 1 })
        .expect(200)
        .end((err, res) => {
          res.body.articles.length.should.be.aboveOrEqual(1);
          res.body.articles.length.should.be.belowOrEqual(5);
          done();
        });
    });
  });

  describe("If failed", () => {
    it("Return 404 if page is not exist", (done) => {
      request(app)
        .get("/api/articles")
        .query({ page: parseInt(articlesCount / 5) + 100 })
        .expect(404)
        .end(done);
    });

    it("Return 400 if bad request", (done) => {
      request(app)
        .get("/api/articles")
        .query({ page: Infinity })
        .expect(400)
        .end(done);
    });
  });
});

// 글 확인 테스트
describe("GET /api/articles/:id", () => {
  before(() => models.sequelize.sync());

  describe("If success", () => {
    it("If get article", (done) => {
      request(app)
        .get(`/api/articles/${testArticleId}`)
        .expect(200)
        .end((err, res) => {
          res.body.article.should.have.property("id", testArticleId);
          done();
        });
    });
  });

  describe("If failed", () => {
    it("Return 404 if article is not exist", (done) => {
      request(app).get("/api/articles/0").expect(404).end(done);
    });
  });
});

// 글 수정 테스트
describe("PUT /api/articles/:id", () => {
  before(() => models.sequelize.sync());

  describe("If success", () => {
    it("Return Array", (done) => {
      request(app)
        .put(`/api/articles/${testArticleId}`)
        .set("token", testToken)
        .send({
          title: "Updated test",
          content: "This is updated test article",
          UserId: testUserId,
        })
        .expect(200)
        .end((err, res) => {
          res.body.updatedArticle.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe("If failed", () => {
    it("Return 422 if title or content missed", (done) => {
      request(app)
        .put(`/api/articles/${testArticleId}`)
        .set("token", testToken)
        .send({
          title: "",
          content: "",
          UserId: testUserId,
        })
        .expect(422)
        .end(done);
    });
  });
});

// 글 삭제 테스트
describe("DELETE /api/articles/:id", () => {
  before(() => models.sequelize.sync());

  describe("If success", () => {
    it("Respond 200 and id", (done) => {
      request(app)
        .delete(`/api/articles/${testArticleId}`)
        .set("token", testToken)
        .send({ UserId: testUserId })
        .expect(200)
        .end((err, res) => {
          res.body.id.should.be.equal(String(testArticleId));
          done();
        });
    });
  });

  describe("If failed", () => {
    it("Return 404 if article is not exist", (done) => {
      request(app)
        .delete(`/api/articles/${testArticleId}`)
        .set("token", testToken)
        .send({ UserId: testUserId })
        .expect(404)
        .end(done);
    });
  });
});
