const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");

router.route("/").get(authControllers.home);
router.route("/key").post(authControllers.key);
router.route("/readkey").post(authControllers.readkey);
router.route("/user").post(authControllers.user);
module.exports = router;
