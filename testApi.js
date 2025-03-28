const mongoose = require("mongoose");
const Article = require("./api/articles/articles.schema");

mongoose
  .connect("mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    try {
      const article = await Article.create({
        title: "Test Article",
        content: "Ceci est un test",
        user: new mongoose.Types.ObjectId(),
        status: "draft", // Remplace "invalid_status" par une valeur valide
      });
    } catch (error) {
      console.error("Erreur :", error.message);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error("Erreur de connexion à la base de données :", error.message);
  });
