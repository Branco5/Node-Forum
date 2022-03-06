const User = require('../models/user')

/**
 * Apresenta utilizadores existentes na base de dados
 */
getAllUsers = async (req, res, next) => {
    try {
        let users = await User.getAll();
        res.send(users)
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports.getAllUsers = getAllUsers;

/**
 * Cria nvo utilizador
 */
createNewUser = async (req, res, next) => {
    try {
        let {username, password} = req.body;
        let user = new User(username, password);
        user = await user.save();
        res.redirect('/users/login');
    } catch (err) {
        if(err.errno===1062){
            res.render('register', {error: "Username already exists"});                
        }
        else{console.log(err)}
    } 
}
module.exports.createNewUser = createNewUser;

/**
 * Faz login de utilizador
 */
login = async (req, res, next) => {
    try {
        let {username, password} = req.body;
        let user = new User(username, password);
        let result = await user.getUserByLoginParams();
        if(result.length>0){
            req.session.user = result[0];            
            res.redirect('/categories');
        }
        else{
            res.render('login', {error: "Login parameters are wrong"});
        }
    } catch (err) {
        console.log(err)
    }        
}

module.exports.login = login;

/**
 * Apresenta utilizador por id
 */
getUserById = async (req, res, next) => {
    try {
        let user = await User.getById(req.params.id);
        res.send(user);
    } catch (error) {
        console.log(error)
    }
}

module.exports.getUserById = getUserById;

/**
 * Entrega form de registo de novo utilizador
 */
getRegisterForm = (req, res) => {    
    res.render('register',{error:''});
}

module.exports.getRegisterForm = getRegisterForm;

/**
 * Entrega form para login
 */
getLoginForm = (req, res) => {
    res.render('login',{error:''});
}

module.exports.getLoginForm = getLoginForm;

/**
 * Verifica se existe utilizador autenticado no objeto req.session
 */
checkAuth = (req, res, next) => {
    if(!req.session.user){
        res.status(401).redirect('/users/login');
    }
    else{       
        next();
    }    
}

module.exports.checkAuth = checkAuth;

/**
 * Verifica se existe utilizador autenticado no objeto req.session
 * Função adaptada a AJAX
 */
checkAuthAjax = (req, res, next) => {
    if(!req.session.user){
        res.status(401).json({"message": "error"});
    }
    else{       
        next();
    }    
}

module.exports.checkAuthAjax = checkAuthAjax;

/**
 * Logs out user
 */
logout = (req, res) => {
    if(req.session.user){
        delete req.session.user;
    }       
    res.redirect('/');
}

module.exports.logout = logout;

/**
 * Checks if user in session has permission to access the requested url
 */
checkRole = (role) =>{
    return (req, res, next) => {
        let user = req.session.user;        
        let userPermissionLevel = User.getPermissionLevel(user.usertype);
        let requiredPermissionLevel = User.getPermissionLevel(role);
        if(userPermissionLevel < requiredPermissionLevel){
            res.status(401).render("notAuthorized");
        }      
        else{
            next();
        }
    }
}

module.exports.checkRole = checkRole;
