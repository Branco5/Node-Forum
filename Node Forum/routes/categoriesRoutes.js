const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const {checkAuth, checkRole} = require('../controllers/usersController');

router.get('/', categoriesController.getAllCategories);    

router.get('/addCategory', checkAuth, checkRole('admin'), categoriesController.getAddCategoryForm);
router.post('/addCategory', categoriesController.addCategory);

router.get('/:category', categoriesController.getCategoryPosts);

router.delete('/:category', categoriesController.deleteCategory);

router.get('/:category/newPost', checkAuth, checkRole('contentManager'), categoriesController.getNewPostForm);

router.post('/:category/newPost', categoriesController.addPost);

module.exports=router;