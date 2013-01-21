var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
	GridStore = mongo.GridStore,
	ObjectID = mongo.ObjectID,
	fs = require('fs'),
	formidable = require('formidable'),
	http = require('http'),
	util = require('util'),
	multipart = require('connect-multipart-gridform');
		
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('winedb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('imageposts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'imageposts' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
            console.log("The 'imageposts' collection does exist.");
			
        });
    }
});

exports.findAll = function(req,res){
  db.collection('imageposts', {safe:true}, function(err, collection) {
	  collection.find().toArray(function(err, items) {
	      res.send(items);
	  });
  });
};

exports.findById = function(req,res){

  var id = req.params.id;
  console.log('Retrieving imagepost: ' + id);
  db.collection('imageposts', function(err, collection) {
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

exports.addImagePost = function(req, res) {
	var form = new formidable.IncomingForm();
	// var form = multipart.gridform({db:db,mongo:mongo});
	
	console.log("form: " + form);
	
	form.parse(req, function (err, fields, files) {
	    db.collection('imagepost', function(err, collection) {
	        collection.insert(fields, {safe:true}, function(err, result) {
	            if (err) {
	                res.send({'error':'An error has occurred'});
	            } else {
	                console.log('Success: ' + JSON.stringify(result[0]));
	                res.send(result[0]);
	            }
	        });
	    });
	});
	
}

exports.addImageFile = function(req, res){

	var form = multipart.gridform({db:db,mongo:mongo});
	
	console.log("form.gridfsStream: " + form.gridfsStream);
	
	form.parse(req, function (err, fields, files) {
		if (err) {
		    console.log('Error Uploading: ' + err);
		    res.send({'Error':err});
		} 
		else{			
			var image = files.image;
			console.log(image);
			readFile = new GridStore(db, image.id, "r");
			readFile.open(function(err, outfile){   
				// var stream = readFile.stream();
				// stream.pipe(res);
				res.send(image);
			});
		}	
	});
};		

exports.updateImagePost = function(req, res) {
	
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	// var form = multipart.gridform({db:db,mongo:mongo});
	
	console.log("form: " + form);
	
    form
      .on('error', function(err) {
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
        console.error(err);
      })
      .on('field', function(field, value) {
        console.log(field, value);
        fields[field] = value;
      })
      .on('end', function() {
        console.log('-> post done');
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('received fields:\n\n '+util.inspect(fields));
      });
    form.parse(req);
	
	// form.parse(req, function (err, fields, files) {
	//     db.collection('imagepost', function(err, collection) {
	//         collection.insert(fields, {safe:true}, function(err, result) {
	//             if (err) {
	//                 res.send({'error':'An error has occurred'});
	//             } else {
	//                 console.log('Success: ' + JSON.stringify(result[0]));
	//                 res.send(result[0]);
	//             }
	//         });
	//     });
	// });
	
    // var id = req.params.id;
    // var imagepost = req.body;
    // delete imagepost._id;
    // console.log('Updating imagepost: ' + id);
    // console.log(JSON.stringify(imagepost));
    // db.collection('imageposts', function(err, collection) {
    //     collection.update({'_id':new BSON.ObjectID(id)}, imagepost, {safe:true}, function(err, result) {
    //         if (err) {
    //             console.log('Error updating ImagePost: ' + err);
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             console.log('' + result + ' document(s) updated');
    //             res.send(imagepost);
    //         }
    //     });
    // });
}

exports.deleteImagePost = function(req, res) {
    var id = req.params.id;
    console.log('Deleting imagepost: ' + id);
    db.collection('imageposts', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {

    var imageposts = [
    {
        filename: "CHATEAU DE SAINT COSME"
    }];
	
    db.collection('imageposts', function(err, collection) {
        collection.insert(imageposts, {safe:true}, function(err, result) {});
    });
}