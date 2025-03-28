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

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const findArticle = await ArticleService.getOne(id);
    console.log("Article trouvé :", findArticle);

    if (!findArticle) {
      throw new NotFoundError();
    }

    const article = await ArticleService.update(id, data);
    console.log("Article après mise à jour :", article);

    if (!article) {
      return res.status(500).json({ error: "Échec de la mise à jour" });
    }

    console.log("Article après mise à jour :", article);
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
