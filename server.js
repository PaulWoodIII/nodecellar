var express = require('express'),
	path = require('path'),
	http = require('http'),
	imagepost  = require('./routes/imageposts');
	mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	GridStore = mongo.GridStore,
	ObjectID = mongo.ObjectID,
	fs = require('fs'),
	formidable = require('formidable');
	multipart = require('connect-multipart-gridform');
		
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('imagepostdb', server, {safe: true});

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.static(path.join(__dirname, 'public')));
	
	//app.use(multipart(multipartoptions),"/imagefiles");
});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'imagepostdb' database");
		app.use('/imageposts', express.bodyParser());
		var multipartoptions = { db: db, mongo: mongo };
		app.use('/imagefiles',multipart(multipartoptions));
    }
});

//ImagePost
app.get('/imageposts', imagepost.findAll);
app.get('/imageposts/:id', imagepost.findById);
app.post('/imageposts', imagepost.addImagePost);
app.put('/imageposts/:id', imagepost.updateImagePost);
app.delete('/imageposts/:id', imagepost.deleteImagePost);

//ImageFiles
app.get('/imagefiles/:id/data', imagepost.findImageDataById);
app.post('/imagefiles', imagepost.addImageFile);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
