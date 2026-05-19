const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventory");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.get("/summary", authorize(ROLE_GROUPS.STAFF), controller.getSummary);
router.get("/", authorize(ROLE_GROUPS.STAFF), controller.getInventory);

module.exports = router;
