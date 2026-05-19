const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer");
const upload = require("../middlewares/upload");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.get("/template", authorize(ROLE_GROUPS.STAFF), controller.downloadTemplate);
router.post("/upload", authorize(ROLE_GROUPS.STAFF), upload.single("file"), controller.uploadExcel);
router.post("/", authorize(ROLE_GROUPS.STAFF), controller.createCustomer);
router.get("/", authorize(ROLE_GROUPS.STAFF), controller.getCustomers);
router.get("/:id", authorize(ROLE_GROUPS.STAFF), controller.getCustomerById);
router.put("/:id", authorize(ROLE_GROUPS.STAFF), controller.updateCustomer);

module.exports = router;
