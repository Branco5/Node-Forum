const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.get("/register", userController.getRegisterForm)
router.post("/register", userController.createNewUser)

router.get("/login", userController.getLoginForm);
router.post("/login", userController.login);

router.get("/logout", userController.checkAuth, userController.logout);

router.get('/', userController.checkAuth, userController.checkRole('admin'), userController.getAllUsers);
router.get("/:id", userController.checkAuth, userController.checkRole('admin'), userController.getUserById);

module.exports = router;