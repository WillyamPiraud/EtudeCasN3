const Article = require("./articles.schema");
const mongoose = require("mongoose");
/*
async function createArticle(data) {
  try {
    const now = new Date();
    data.createdAt = now;
    const article = await Article.create(data);
    return article;
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'article:", error);
    throw error;
  }
}

async function updateArticle(id, data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID invalide");
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      throw new Error("Article non trouvé");
    }

    return updatedArticle;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error.message);
    throw error;
  }
}

async function deleteArticle(articleId) {
  return await Article.findByIdAndDelete(articleId);
}

async function getArticlesByUser(userId) {
  return await Article.find({ user: userId }).populate({
    path: "user",
    select: "-password",
  });
}

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByUser,
};
*/

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

  /* 
  async updateArticle(id, data) {
    console.log("🔄 Données avant update :", data);
    return await Article.findByIdAndUpdate(id, data, {
      new: true,
    });
  }*/
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  /*async updateArticle(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID invalide");
      }

      console.log("🔄 Mise à jour de l'article avec ID:", id);
      console.log("📜 Données envoyées pour mise à jour:", data);

      const updatedArticle = await Article.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedArticle) {
        console.error("❌ Mise à jour échouée, article introuvable.");
        return { error: "Article introuvable" }; // Retourner un message d'erreur plus précis
      }

      console.log("✅ Article après mise à jour:", updatedArticle);
      return updatedArticle;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la mise à jour de l'article:",
        error.message
      );
      throw error; // Vous pouvez ajouter un message d'erreur plus descriptif ici
    }
  }*/

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
