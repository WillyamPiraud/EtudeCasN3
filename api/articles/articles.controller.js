/*
const {
  createArticle,
  updateArticle,
  deleteArticle,
} = require("./articles.services");
const mongoose = require("mongoose");
const Article = require("./articles.schema");

async function create(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Non autorisé" });

    const article = await createArticle({ ...req.body, user: req.user.userId });

    req.io.emit("article_created", article);
    res.status(201).json(article);
  } catch (error) {
    console.error("Erreur dans la création de l'article:", error);
    res.status(500).json({ error: error.message });
  }
}

/*
async function update(req, res) {
  try {
    const articleId = req.params.id;
    const data = req.body;

    console.log("📩 ID reçu pour mise à jour :", articleId);
    console.log("📜 Données reçues :", data);

    const updatedArticle = await updateArticle(articleId, data);

    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("❌ Erreur rencontrée :", error.message);
    return res.status(500).json({ error: error.message });
  }
}*/
/*
async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID d'article invalide" });
    }
    console.log("📩 ID reçu pour mise à jour :", id);
    console.log("📜 Données reçues :", data);
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    console.log("Article trouvé avant mise à jour:", article);
    const updatedArticle = await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    updatedArticle.user = undefined;

    res.json(updatedArticle);
  } catch (err) {
    console.error("Erreur dans la mise à jour de l'article:", err.message);
    next(err);
  }
}

async function remove(req, res) {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Accès refusé" });

    await deleteArticle(req.params.id);
    req.io.emit("article_deleted", req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, update, remove };
*/

const ArticleService = require("./articles.services");
const mongoose = require("mongoose");

async function create(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Non autorisé" });

    const article = await ArticleService.createArticle({
      ...req.body,
      user: req.user.userId,
    });

    req.io.emit("article_created", article);
    res.status(201).json(article);
  } catch (error) {
    console.error("Erreur dans la création de l'article:", error);
    res.status(500).json({ error: error.message });
  }
}
/*
async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID d'article invalide" });
    }

    console.log("📩 ID reçu pour mise à jour :", id);
    console.log("📜 Données reçues :", data);

    const updatedArticle = await ArticleService.updateArticle(id, data);

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    updatedArticle.user = undefined;
    res.json(updatedArticle);
  } catch (err) {
    console.error("Erreur dans la mise à jour de l'article:", err.message);
    next(err);
  }
}
  */

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const findArticle = await ArticleService.getOne(id);
    console.log("🔍 Article trouvé :", findArticle);

    if (!findArticle) {
      throw new NotFoundError();
    }

    const article = await ArticleService.update(id, data);
    console.log("🔄 Article après mise à jour :", article);

    if (!article) {
      return res.status(500).json({ error: "Échec de la mise à jour" });
    }

    console.log("✅ Article après mise à jour :", article);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await ArticleService.deleteArticle(req.params.id);
    req.io.emit("article_deleted", req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, update, remove };
