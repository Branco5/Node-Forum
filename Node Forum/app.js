const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("./config/session")
const path = require("path");
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const options = require("./config/options.json");

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

app.use(session);

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

const userRouter = require('./routes/userRoutes');
app.use('/users', userRouter);

const categoriesRouter = require('./routes/categoriesRoutes');
app.use('/categories', categoriesRouter);

const postsRouter = require('./routes/postsRoutes');
app.use('/categories/:category/:post', postsRouter);

app.use(function(req, res) {
    res.status(404).render("404");
});

app.listen(options.server.port, function () {
    console.log("Server running at port:" +options.server.port);
});
