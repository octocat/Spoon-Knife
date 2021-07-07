var express    = require('express'),
    app        = express(),
    request    = require('request'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Comment = require('./models/comments'),
    Campground = require('./models/campground'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    seedDB = require('./seeds');

var indexRoute = require('./routers/index'),
    campgroundRoute = require('./routers/campground'),
    commentRoute = require('./routers/comment');

//database config
//
const uri = "mongodb://localhost:27017";
mongoose.connect(uri,{
  useNewUrlParser:true,
  useCreateIndex:true
}).then(()=>{
  console.log("connected");
}).catch((err)=>{
  console.log(err);
})

mongoose.set('useFindAndModify', false);

//Seeding the database
seedDB();

//PASSPORT CONFIGURATION===========
app.use(require('express-session')({
  secret: "Once Again!",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});
//=========================
//APP CONFIG
//=========================

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/campground',campgroundRoute);
app.use('/campground/:id/comments',commentRoute);
app.use(indexRoute);

//=============
//LISTEN
//=============
app.listen(8080,'0.0.0.0',function(){
  console.log("Server is running...");
})
