import express from "express";
import mongoose from "mongoose";
import initRouter from "./routes/web";
import bodyParser from "body-parser";
import session from "express-session";
import connectMongo from "connect-mongo";
import connectFlash from "connect-flash"; // gui thong bao loi tn 1 lan
import passport from "passport"; // dung lam cn dang nhap
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import passportSocketIo from "passport.socketio";// io socket lay thong tin user
import cookieParser from "cookie-parser"; //passportSocketIo yeu cau cookieParser
let app = express();
//server socket io & express app
let server = http.createServer(app);
let io =socketio(server);
//connectDB
mongoose.connect('mongodb://localhost:27017/web_chat', { useUnifiedTopology: true, useNewUrlParser: true  } );

// session
let MongoStore = connectMongo(session);
let sessionStore = new MongoStore({ 
    url : "mongodb://localhost:27017/web_chat"
    //autoReconnect:true,
    //autoRemove:"native"
});
app.use(session({
    key:"express.sid",
    secret:"mySecret",
    store: sessionStore,
    resave : true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24 // 86400000 seconds = 1 day
    }
}));

//cau hinh views
app.use(express.static("./src/public"));
app.set("view engine","ejs");
app.set("views","./src/views");
app.use(bodyParser.urlencoded({extended:true}));// post
//thong bao
app.use(connectFlash());// de chay, flash yeu cau session 
// User cookie Parser
app.use(cookieParser());
//passport
app.use(passport.initialize());
app.use(passport.session());// goi du lieu tu session (deserializeUser)
// route
initRouter(app);
//passport socket.io
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:"express.sid",
    secret:"mySecret",
    store: sessionStore,        // we NEED to use a sessionstore. no memorystore please
    //success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
    //fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));

initSockets(io);
let hostname="localhost";
let port= 8888;

server.listen(port,hostname,()=>{
    console.log(`hello phat, ${hostname}:${port}`);
})