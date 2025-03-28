const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const mongoose = require("mongoose");

describe("Article API", () => {
  let token;
  let ARTICLE_ID = new mongoose.Types.ObjectId().toString();

  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Ceci est un test",
    user: new mongoose.Types.ObjectId().toString(),
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    token = jwt.sign(
      { userId: MOCK_ARTICLE.user, role: "admin" },
      config.secretJwtToken
    );

    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findById");
    mockingoose(Article).toReturn({}, "remove");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "create");
    //mockingoose(Article).toReturn(MOCK_ARTICLE, "findByIdAndUpdate");
    mockingoose(Article).toReturn(
      { ...MOCK_ARTICLE, title: "Updated Article", content: "Updated content" },
      "findByIdAndUpdate"
    );
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  test("should create a new article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("x-access-token", token)
      .send({
        title: "Test Article",
        content: "Ceci est un test",
        status: "draft",
        user: mongoose.Types.ObjectId("6752f21ea29486c0deab950c").toString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Article");
    expect(res.body.content).toBe("Ceci est un test");
    expect(res.body.status).toBe("draft");
    expect(res.body.user).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  test("should update an article", async () => {
    console.log("ID utilisé pour la mise à jour :", ARTICLE_ID);

    const article = await Article.findById(ARTICLE_ID);
    console.log("Article trouvé avant mise à jour:", article);

    expect(article).toBeDefined();
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token)
      .send({
        title: "Updated Article",
        content: "Updated content",
        status: "draft",
      });

    console.log("Response Body Update:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Article");
    expect(res.body.content).toBe("Updated content");
  });

  test("should delete an article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token)
      .send();

    expect(res.status).toBe(204);
  });
});
