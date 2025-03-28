const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Le contenu est requis"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Un utilisateur est requis pour cet article"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: [true, "Le statut est requis"],
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
