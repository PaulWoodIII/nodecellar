var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
		GridStore = mongo.GridStore,
		ObjectID = mongo.ObjectID,
		fs = require('fs'),
		multipart = require('connect-multipart-gridform');
		
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('winedb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
    }
});

exports.findAll = function(req,res){
  db.collection('fs.files', {safe:true}, function(err, collection) {
      if (err) {
	      console.log("The 'fs' collection doesn't exist. Creating it with sample data...");
      }
		  collection.find().toArray(function(err, items) {
		      res.send(items);
		  });
  });
};

exports.findById = function(req,res){

  var id = req.params.id;
  console.log('Retrieving cup: ' + id);
  db.collection('fs.files', function(err, collection) {
      collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
          res.send(item);
      });
  });
};

exports.findImageById = function(req,res){
	var filename = req.params.id;
	var fileId = new ObjectID(filename);	
	//mongodb.GridStore.exist(db, filename, callback)
	var gs = new mongo.GridStore(db, fileId);
	gs.open(function(err, gs){
			var stream = gs.stream();
			stream.pipe(res);  
	    console.log("this file was uploaded at "+gs.uploadDate);
	});
};

exports.addImagePost = function(req, res){

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
};		