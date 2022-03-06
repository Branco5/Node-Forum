const express = require("express");
const router = express.Router({mergeParams:true});
const postsController = require("../controllers/postsController");
const {checkAuth, checkAuthAjax} = require('../controllers/usersController');

router.get('/', postsController.getPostPage);
router.post('/postComment', checkAuthAjax, postsController.addComment);
router.post('/like', checkAuth, postsController.updatePostLikes);
router.delete('/', postsController.deletePost);  


module.exports=router;