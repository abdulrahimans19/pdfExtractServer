const express = require("express");
const router = express.Router();
const { userSignup, userSignIn } = require("../controller/auth");

router.post("/signUp", userSignup);
router.post("/signIn", userSignIn);

module.exports = router;
