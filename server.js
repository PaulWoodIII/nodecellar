var express = require('express'),
	path = require('path'),
	http = require('http'),
	wine = require('./routes/wines'),
	cup  = require('./routes/cups'),
	imagepost  = require('./routes/imageposts'),
	mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	GridStore = mongo.GridStore,
	ObjectID = mongo.ObjectID,
	fs = require('fs'),
	multipart = require('connect-multipart-gridform');
		
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('winedb', server, {safe: true});

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.static(path.join(__dirname, 'public')));
});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
				var multipartoptions = { db: db, mongo: mongo };
				app.use(multipart(multipartoptions));
    }
});

//Wine
app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

//Cups
app.get('/cups', cup.findAll);
app.get('/cups/:id', cup.findById);
app.post('/cups', cup.addCup);
app.put('/cups/:id', cup.updateCup);
app.delete('/cups/:id', cup.deleteCup);

//ImagePost
app.get('/imageposts', imagepost.findAll);
app.get('/imageposts/:id', imagepost.findById);
//app.get('/imageposts/:id/data', imagepost.findImageById);
app.post('/imageposts', imagepost.addImagePost);
app.put('/imageposts/:id', imagepost.updateImagePost);
app.delete('/imageposts/:id', imagepost.deleteImagePost);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
