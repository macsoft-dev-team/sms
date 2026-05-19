const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const upload = require("../middlewares/upload");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.get("/template", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.downloadTemplate);
router.post("/upload", authorize(ROLE_GROUPS.ADMIN_ONLY), upload.single("file"), controller.uploadExcel);
router.post("/", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.createUser);
router.get("/", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.getUsers);
router.get("/:id", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.getUserById);
router.put("/:id", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.updateUser);

module.exports = router;
