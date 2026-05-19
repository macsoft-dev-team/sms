const express = require("express");
const router = express.Router();
const controller = require("../controllers/location");
const { authenticate, authorize } = require("../middlewares/auth");
const { ROLE_GROUPS } = require("../utils/roles");

router.use(authenticate);
router.post("/", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.createLocation);
router.get("/", authorize(ROLE_GROUPS.STAFF), controller.getLocations);
router.get("/:id", authorize(ROLE_GROUPS.STAFF), controller.getLocationById);
router.put("/:id", authorize(ROLE_GROUPS.ADMIN_ONLY), controller.updateLocation);

module.exports = router;
