const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Welcome to Inventory API" }));

router.use("/auth", require("./auth"));
router.use("/users", require("./user"));
router.use("/customers", require("./customer")); 
router.use("/products", require("./product"));
router.use("/locations", require("./location"));
router.use("/inventory", require("./inventory"));
router.use("/transactions", require("./transaction"));

module.exports = router;
