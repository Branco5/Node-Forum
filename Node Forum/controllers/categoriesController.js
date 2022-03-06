const Category = require('../models/category');
const Post = require('../models/post');

/**
 * Apresenta a página com as categorias criadas
 */
getAllCategories = async (req, res, next) => {
    try {
        let categories = await Category.getAll();
        res.render('categories', {
            categories:categories,
            title:"Categories",
            user: req.session.user, 
            currentPath: req.baseUrl,
            error:''
        });
    } catch (error) {
        if(err.errno===1062){
            res.render('categories', {error: "Category already exists"});                
        }
        else{console.log(err)}
    }
}

module.exports.getAllCategories = getAllCategories;

/**
 * Entrega o form para adicionar categoria ao utilizador
 */
getAddCategoryForm = async (req, res) => {
    res.render('addCategory');
}

module.exports.getAddCategoryForm = getAddCategoryForm;

/**
 * Adiciona categoria à base de dados
 */
addCategory = async (req, res) => {
    try {
        let cat = new Category(req.body.category, req.session.user.id);
        await cat.save();
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
    
}

module.exports.addCategory = addCategory;

/**
 * Apaga categoria da base de dados
 */
deleteCategory = async (req, res) => {
    try {
        await Category.delete(req.params.category);
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
    
}

module.exports.deleteCategory = deleteCategory;


/**
 * Apresenta a página com os posts pertencentes a uma categoria
 */
getCategoryPosts = async (req, res, next) => {
    try {
        let cat = new Category(req.params.category);
        if(await cat.nameExists()===false){
            next();
        }
        let posts = await cat.getPosts();
        if(posts.length>0){
            for(let p of posts){
                p.author = await Post.getPostAuthor(p.id);
                p.likes = await Post.getPostLikes(p.id)
            }
        }        
        res.render('posts',{
            category: cat.name,
            title:cat.name,
            user: req.session.user,
            posts: posts,            
            currentPath: req.baseUrl + req.url
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.getCategoryPosts = getCategoryPosts;

/**
 * Apresenta a página para adicionar um novo post
 */
getNewPostForm = async (req, res) => {   
    let usertype = req.session.user.usertype;
    if(usertype==="contentManager" || usertype==="admin"){
        res.render('newPost', {
            currentPath: req.baseUrl + req.url,
            category:req.params.category,
            error:''
        });
    }
    else{
        res.redirect('back');
    }    
}

module.exports.getNewPostForm = getNewPostForm;

/**
 * Adiciona um post à base de dados
 */
addPost = async (req, res, next) => {
    try {
        let userid = req.session.user.id;
        let game = req.body.game;
        let description = req.body.description;

        let imgFile = req.files.gameImg;
        let saveUrl = '/images/' + imgFile.name;
        let uploadPath = './public' + saveUrl;
    
        imgFile.mv(uploadPath, function(err) {
            if (err){
                return res.status(500).send(err);
            }
        });  

        let newPost = new Post(req.params.category, game, description, userid, saveUrl);

        await newPost.save();

        res.redirect('/categories/'+req.params.category);       

    } catch (error) {
        console.log(error)
    }
    
}

module.exports.addPost = addPost;




