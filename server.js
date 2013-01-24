var express = require('express'),
	path = require('path'),
	http = require('http'),
	wine = require('./routes/wines'),
	cup  = require('./routes/cups'),
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
var db = new Db('winedb', server, {safe: true});

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.static(path.join(__dirname, 'public')));
	
	//app.use(multipart(multipartoptions),"/imagefiles");
});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
		app.use(express.bodyParser());
		var multipartoptions = { db: db, mongo: mongo };
		app.use('/imagefiles',multipart(multipartoptions));
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
app.post('/imageposts', imagepost.addImagePost);
app.put('/imageposts/:id', imagepost.updateImagePost);
app.delete('/imageposts/:id', imagepost.deleteImagePost);

//ImageFiles
app.get('/imagefiles/:id/data', imagepost.findImageDataById);

// app.post('/imagefiles', function(req, res){
// 
// 	var form = multipart.gridform({db:db,mongo:mongo});
// 	
// 	console.log("form.gridfsStream: " + form.gridform);
// 	
// 	form.parse(req, function (err, fields, files) {
// 		console.log("form.err: " + err);
// 		console.log("form.fields: " + fields);
// 		console.log("form.files: " + files);
// 		
// 		if (err) {
// 		    console.log('Error Uploading: ' + err);
// 		    res.send({'Error':err});
// 		} 
// 		else{			
// 			var image = files.imagefile;
// 			console.log(image);
// 			readFile = new GridStore(db, image.id, "r");
// 			readFile.open(function(err, outfile){   
// 				var stream = readFile.stream();
// 				stream.pipe(res);
// 				res.send(image);
// 			});
// 		}	
// 	});
// });		

app.post('/imagefiles', imagepost.addImageFile);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
