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
	//app.use(multipart(multipartoptions));
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
app.get('/imageposts/:id/data', imagepost.findImageById);
app.post('/imageposts', imagepost.addImagePost);
//app.put('/imageposts/:id', imagepost.updateImage);
//app.delete('/imageposts/:id', imagepost.deleteImagePost);

app.get('/uploads', function(req,res){
  db.collection('fs.files', {safe:true}, function(err, collection) {
      if (err) {
	      console.log("The 'fs' collection doesn't exist. Creating it with sample data...");
      }
		  collection.find().toArray(function(err, items) {
		      res.send(items);
		  });
  });
});

app.get('/uploads/:id', function(req,res){
	var filename = req.params.id;
	var fileId = new ObjectID(filename);	
	//mongodb.GridStore.exist(db, filename, callback)
	var gs = new mongo.GridStore(db, fileId);
	gs.open(function(err, gs){
			var stream = gs.stream();
			stream.pipe(res);  
	    console.log("this file was uploaded at "+gs.uploadDate);
	});
});

app.post('/file-upload', function(req, res){

	var form = multipart.gridform({db:db,mongo:mongo});
	
	console.log("form.gridfsStream: " + form.gridfsStream);
	
	form.parse(req, function (err, fields, files) {
		if (err) {
		    console.log('Error Uploading: ' + err);
		    res.send({'Error':err});
		} 
		else{			
			var thumb = files.thumbnail;
			console.log(thumb);
			readFile = new GridStore(db, thumb.id, "r");
			readFile.open(function(err, outfile){   
				var stream = readFile.stream();
				stream.pipe(res);
			});
		}	
	});
});		

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
