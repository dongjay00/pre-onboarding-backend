const request = require("supertest");
const should = require("should");
const app = require("../src");
const models = require("../src/models");

const testuser = {
  username: "testuser",
  email: "testuser@gmail.com",
  password: "test1234",
};

// 회원가입 테스트
describe("POST /api/auth/register", () => {
  const firstUser = {
    username: "first",
    email: "first@gmail.com",
    password: "first1234",
  };
  before(() => models.sequelize.sync());
  before(() => {
    models.Users.destroy({ where: { username: "first" } });
    models.Users.destroy({ where: { username: "testuser" } });
  });
  before(() => models.Users.create(firstUser));

  describe("If success", () => {
    let newUser;

    before((done) => {
      request(app)
        .post("/api/auth/register")
        .send(testuser)
        .expect(201)
        .end((err, res) => {
          newUser = res.body.newUser;
          done();
        });
    });

    it("Return created user object", () => {
      newUser.should.have.property("id");
    });
    it("Return inserted username", () => {
      newUser.should.have.property("username");
    });
  });

  describe("If failed", () => {
    it("Return 422 if username missed", (done) => {
      request(app).post("/api/auth/register").send({}).expect(422).end(done);
    });
    it("Return 400 if username duplicated", (done) => {
      request(app)
        .post("/api/auth/register")
        .send({
          username: "first",
          email: "first@naver.com",
          password: "first1234",
        })
        .expect(400)
        .end(done);
    });
  });
});

// 로그인 테스트
describe("POST /api/auth/login", () => {
  before(() => models.sequelize.sync());

  const { username, password } = testuser;

  describe("If success", () => {
    before((done) => {
      request(app)
        .post("/api/auth/login")
        .send({ username, password })
        .expect(200)
        .end((err, res) => {
          body = res.body;
          done();
        });
    });

    it("Return login user object", () => {
      body.should.have.property("user");
    });
    it("Return accessToken", () => {
      body.should.have.property("accessToken");
    });
  });

  describe("If failed", () => {
    it("Return 422 if username missed", (done) => {
      request(app).post("/api/auth/login").send({}).expect(422).end(done);
    });
    it("Return 401 if insert wrong password", (done) => {
      request(app)
        .post("/api/auth/login")
        .send({
          username,
          password: "1234",
        })
        .expect(401)
        .end(done);
    });
  });
});
