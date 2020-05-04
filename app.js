	var express 		= require("express");
	var	app 			= express();
	var	bodyParser 		= require("body-parser");
	var	mongoose 		= require("mongoose");
	var flash			= require("connect-flash");
	var passport		= require("passport");
	var LocalStrategy	= require("passport-local");
	var methodOverride	= require("method-override");
	var	Campground 		= require("./models/campground");
	var Comment   		= require("./models/comment");
	var User			= require("./models/user");
	var seedDB			= require("./seeds");

//requiring routes
	var commentRoutes	  = require("./routes/comments");
	var campgroundRoutes  = require("./routes/campgrounds");
	var indexRoutes		  = require("./routes/index");
				
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb+srv://narendraSingh:Naval@2020@cluster0-wzdkl.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true,
useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// console.log(__dirname);
app.use(methodOverride("_method"));
// seedDB();	
//schema setup
app.use(flash());

app.use(require("express-session")({
	secret:" Once again Rusty wins cutes dogs",
	resave: false,
	saveUninitialized: false
}));

//PASSPORT CONFIRMATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.get("/", function(req, res){
	res.render("landing");
});

//DONT TOUCH THIS FOLLOWING CODE ITS A ROOT FOR THE SERVER 
// app.listen(3000, function(){ 
//   console.log('the Yelp camp Server has started'); 
// });

app.listen(process.env.PORT, process.env.IP);