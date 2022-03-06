const Post = require('../models/post');
const Comment = require('../models/comment');

/**
 * Renders a single post page
 */
getPostPage = async (req, res, next) => {   
    try {        
        let postid=req.params.post;        
        let post = await Post.getPostById(postid);
        let comments = await Post.getPostComments(postid);
        let postAuthor = await Post.getPostAuthor(postid);
        for(let c of comments){
            c.author = await c.getCommentAuthor();
        }
        let postLikes = await Post.getPostLikes(postid);
        let userid;
        let userLikedPost;
        if(req.session.user){
            userid = req.session.user.id;
            userLikedPost = await Post.getUserPostLike(postid, userid); 
        }         
        res.render('post', {
            post: post,
            title:req.params.category,
            user: req.session.user,
            comments: comments,
            currentPath: req.baseUrl+req.url,
            userLikedPost: userLikedPost,
            postLikes:postLikes,
            postAuthor:postAuthor
        });  
        
    } catch (error) {
        console.log(error);
        next();
    } 
} 

module.exports.getPostPage = getPostPage;

/**
 * Deletes post from db and redirects
 */
deletePost = async (req, res) => {
    try {
        await Post.delete(req.params.post);
        res.redirect('back');
    } catch (error) {
        console.log(error);
    }
}

module.exports.deletePost = deletePost;

/**
 * Adds comment associated with post to database
 */
addComment = async (req, res, next) =>{  
    try {
        if(req.body.newCommentContent){
            let comment = new Comment(req.session.user.id, req.params.post, req.body.newCommentContent);
            await comment.save();
            res.json({"message":"success"})
        }
    } catch (error) {
        console.log(error);
        res.json({"message": "error"});
    }  
}

module.exports.addComment = addComment;

/**
 * Updates likes on post
 */
updatePostLikes = async (req, res) => {
    try {
        let postId=req.params.post;
        let userid = req.session.user.id;
        await Post.updatePostLikes(userid, postId);
        res.json({"message": "success"});
    } catch (error) {
        console.log(error);
        res.json({"message": "error"});
    }
}

module.exports.updatePostLikes = updatePostLikes;


