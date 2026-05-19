const express = require("express");
const router = express.Router();
const controller = require("../controllers/product");
const upload = require("../middlewares/upload");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.get("/template", authorize(ROLE_GROUPS.STAFF), controller.downloadTemplate);
router.post("/upload", authorize(ROLE_GROUPS.ADMIN_ONLY), upload.single("file"), controller.uploadExcel);
router.post("/", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.createProduct);
router.get("/", authorize(ROLE_GROUPS.STAFF), controller.getProducts);
router.get("/:id", authorize(ROLE_GROUPS.STAFF), controller.getProductById);
router.put("/:id", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.updateProduct);

module.exports = router;
