const express = require("express");
const bodyparser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const config = require("./config");
const userRouter = require("./routes/userRouter");
const adminUserRouter = require("./routes/adminUserRouter");
const adminGoodRouter = require("./routes/adminGoodRouter");
const adminOrderRouter = require("./routes/adminOrderRouter");
const adminCommentRouter = require("./routes/adminCommentRouter");

var app = express();

// 应用session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "keyboard cat"
}));

app.use(express.static(path.join(__dirname, "views"),{index:"/"}));
app.use(express.static(path.join(__dirname, "public")));


//更换渲染模板
app.engine(".html", require("Express-art-template"));
app.set("view engine", "html");

//应用表单解析器
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// 应用日志
// app.use(morgan("dev"));

//启动服务器
app.listen(config.server.port, function () {
    console.log("server is running!")
});

app.use("/", userRouter);
app.use("/adminUser", adminUserRouter);
app.use("/adminGood", adminGoodRouter);
app.use("/adminOrder", adminOrderRouter);
app.use("/adminComment", adminCommentRouter);
