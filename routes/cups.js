var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
	
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server, {safe: true});

var multipart = require('connect-multipart-gridform');
var gridform = multipart.gridform;
var connectMultipart = multipart.multipart;

exports.fileGridUpload = function(req, res){
	
	console.log("Start: " + req.file);
	var form = gridform();
	form.on('fileBegin', function (name, file) {
	    file.metadata = 'so meta'
	 });
	res.send(req.body);
	
}

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('cups', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'cups' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
			else{
                console.log("The 'cups' collection does exist.");
			}
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving cup: ' + id);
    db.collection('cups', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('cups', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCup = function(req, res) {
    var cup = req.body;
    console.log('Adding cup: ' + JSON.stringify(cup));
    db.collection('cups', function(err, collection) {
        collection.insert(cup, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateCup = function(req, res) {
    var id = req.params.id;
    var cup = req.body;
    delete cup._id;
    console.log('Updating cup: ' + id);
    console.log(JSON.stringify(cup));
    db.collection('cups', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, cup, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating cup: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(cup);
            }
        });
    });
}

exports.deleteCup = function(req, res) {
    var id = req.params.id;
    console.log('Deleting cup: ' + id);
    db.collection('cups', function(err, collection) {
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



exports.fileUpload = function(req, res) {
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
	
	var thumb = req.files.thumbnail;
	
	var target_path = './public/uploads/' + thumb.name;
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
	    if (err) throw err;
	    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	    fs.unlink(tmp_path, function() {
	        if (err) throw err;
	        res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
	    });
	});
	
	var buff = new Buffer(4);
	
	var base64Data = thumb.replace(/^data:image\/png;base64,/,"");
	var dataBuffer = new Buffer(base64Data, 'base64');
	
    db.collection('cups', function(err, collection) {
        collection.insert({magic: 123,img: dataBuffer.toString()}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
	
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var cups = [
    {
        name: "Countryside",
        color: "black",
        country: "USA",
        designer: "Gucci",
        description: "Gucci's first blue jeans with a hammer holder",
        picture: "countryside.jpg"
    }];

    db.collection('cups', function(err, collection) {
        collection.insert(cups, {safe:true}, function(err, result) {});
    });

};