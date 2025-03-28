const Article = require("./articles.schema");
const mongoose = require("mongoose");

class ArticleService {
  createArticle(data) {
    try {
      data.createdAt = new Date();
      return Article.create(data);
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'article:", error);
      throw error;
    }
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  deleteArticle(articleId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(articleId)) {
        throw new Error("ID invalide");
      }
      return Article.findByIdAndDelete(articleId);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'article:",
        error.message
      );
      throw error;
    }
  }

  getOne(id) {
    return Article.findById(id).populate({
      path: "user",
      select: "-password",
    });
  }

  getArticlesByUser(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("ID utilisateur invalide");
      }
      return Article.find({ user: userId }).populate({
        path: "user",
        select: "-password",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des articles de l'utilisateur:",
        error.message
      );
      throw error;
    }
  }
}

module.exports = new ArticleService();
