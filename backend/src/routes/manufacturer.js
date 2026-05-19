const express = require("express");
const router = express.Router();
const controller = require("../controllers/manufacturer");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.post("/", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.createManufacturer);
router.get("/", authorize(ROLE_GROUPS.STAFF), controller.getManufacturers);
router.get("/:id", authorize(ROLE_GROUPS.STAFF), controller.getManufacturerById);
router.put("/:id", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.updateManufacturer);

module.exports = router;
