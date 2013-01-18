var express = require('express'),
	path = require('path'),
	http = require('http');
	//wine = require('./routes/wines'),
	//cup  = require('./routes/cups');
	//gridform = require('gridform');
var multipart = require('connect-multipart-gridform');

var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db;	
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('winedb', server, {safe: true});
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('fs', {safe:true}, function(err, collection) {
            if (!err) {
                console.log("The 'fs' collection doesn't exist. Creating it with sample data...");
				var multipartoptions = { db: db, mongo: mongo };
				app.use(multipart(multipartoptions));
            }
        });
    }
});

var multipart = require('connect-multipart-gridform');
var formidable = require('formidable');


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.static(path.join(__dirname, 'public')));
	//app.use(multipart(multipartoptions));
});

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.get('/cups', cup.findAll);
app.get('/cups/:id', cup.findById);
app.post('/cups', cup.addCup);
app.put('/cups/:id', cup.updateCup);
app.delete('/cups/:id', cup.deleteCup);

app.get('/lastfile'), function(req,res){
	var readstream = gfs.createReadStream('crud.png');
	readstream.pipe(res);
	//res.send(files);
}

app.post('/file-upload', function(req, res){

	var form = multipart.gridform({db:db,mongo:mongo});
	
	console.log("form.gridfsStream: " + form.gridfsStream);
	
	form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error Uploading: ' + err);
            res.send({'Error':err});
        } 
		else {
			
			var thumb = files.thumbnail;
			res.send(thumb);
			
			console.log("form: " + form);
			//console.log("form.form: " + form.form);
			
			
			console.log("multipart: " + multipart);
			
			var form2 = multipart.form;
			console.log("form2: " + form2);
			
			var gridform = multipart.gridform;
			console.log("gridform: " + gridform);
			
			var Grid = gridform.gridfsStream;
			console.log("Grid:" + Grid);
			
			var connectMultipart = multipart.multipart;
			console.log("connectMultipart: " + connectMultipart);
			
			
			console.log("files.thumbnail: " + files.thumbnail);
			
			console.log("thumb.data: " + thumb.data);
			// new Buffer(thumb.data);
			//console.log(files);
			//var readstream = gridform.gridfsStream.createReadStream("crud.png");
			//console.log(readstream);
			// 		    db.collection('fs.files', function(err, collection) {
			// 		        collection.findOne({'_id':thumb.id}, function(err, item) {
			// var readstream = gfs.createReadStream(thumb.id);
			// readstream.pipe(res);
			// // res.send(files.thumbnail);
			// // 		            
			// // res.send(item);
			// 		        });
			// 		    });			
        }
	});

});


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});



