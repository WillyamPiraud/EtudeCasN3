const express = require("express");
const { create, update, remove } = require("./articles.controller");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;
