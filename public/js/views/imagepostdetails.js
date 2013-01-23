window.ImagePostView = Backbone.View.extend({

    initialize: function (imagepost,imagefile) {
		
		console.log('add image post imagepostdetails.js');

		_.bindAll(this, 'render');
		this.imagepost = imagepost;
		this.imagefile = imagefile;
	    this.imagepost.on('change', this.render);
	    this.imagefile.on('change', this.render);
		console.log(this.imagepost.toJSON());
		console.log(this.imagefile.toJSON());
		
		console.log(this.template);
		
		if (window.File && window.FileReader && window.FileList && window.Blob) {
		  // Great success! All the File APIs are supported.
		} else {
		  utils.addValidationError('The File APIs are not fully supported in this browser.');
		}
		
		this.render();
		
		
		
    },

    render: function () {
		console.log('render');
		// var template = _.template( $("#ImagePostView").html(), {} ); 
        $(this.el).html(this.template({imagepost:this.imagepost.toJSON(),imagefile:this.imagefile.toJSON()}));
		// this.$el.html( template );
        return this;
    },

    events: {
        "change .imagepost-form" : "changePost",
        "change .imagefile-form" : "changeFile",
        "click .upload"         : "beforePostImageFile",
        "click .remove"         : "removePostImageFile",
        "click .save"           : "beforeSaveImagePost",
        "click .delete"         : "deleteImagePost",
        "drop #picture"         : "dropHandler",
        "dragover #picture"     : "dragoverHandler"
    },
	

    changePost: function (event) {
		
		console.log('changepost');
		
        // Remove any existing alert message
        utils.hideAlert();
        // Apply the change to the model
        var target = event.target;
		console.log('target' + target);
        var change = {};
        change[target.name] = target.value;
		console.log('change' + change);
        this.imagepost.set(change);
		console.log(": " + JSON.stringify(this.imagepost));
        // Run validation rule (if any) on changed item
        var check = this.imagepost.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } 
		else {
            utils.removeValidationError(target.id);
        }
    },
	
    changeFile: function (event) {
		
		console.log('changefile');
		
        // Remove any existing alert message
        utils.hideAlert();
        // Apply the change to the model
		//         var target = event.target;
		// console.log('target' + target);
		//         var change = {};
		//         change[target.name] = target.value;
		// console.log('change' + change);
		//         this.imagefile.set(change);
		// console.log(": " + JSON.stringify(this.imagefile));
		//         // Run validation rule (if any) on changed item
		//         var check = this.imagefile.validateItem(target.id);
		//         if (check.isValid === false) {
		//             utils.addValidationError(target.id, check.message);
		//         } 
		// else {
		//             utils.removeValidationError(target.id);
		//         }
    },
	
	beforePostImageFile: function (){
		
		console.log('beforePostImageFile');
        // 		
        // var self = this;
        // var checkFile = this.imagefile.validateAll();
        // if (checkFile.isValid === false) {
        //     utils.displayValidationErrors(checkFile.messages);
        //     return false;
        // }		
        this.postImageFile();
        return false;
	},
	
	postImageFile: function (){
        		
		
		console.log('postImageFile');
		
		var self = this;
        this.imagefile.save(null, {
            success: function (imagefile) {
                self.render();
                utils.showAlert('Uploaded!', 'Now Lets get some more info', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
	},

    beforeSaveImagePost: function () {
		
		console.log('beforeSaveImagePost');
		
        var self = this;
        var checkPost = this.imagepost.validateAll();
        if (checkPost.isValid === false) {
            utils.displayValidationErrors(checkPost.messages);
            return false;
        }
        var checkFile = this.imagefile.validateAll();
        if (checkFile.isValid === false) {
            utils.displayValidationErrors(checkFile.messages);
            return false;
        }
		
        this.saveImagePost();
        return false;
    },


    saveImagePost: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('imageposts/' + model.id, false);
                utils.showAlert('Success!', 'ImagePost saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },
	
	removePostImageFile: function (){
		
	},

    deleteImagePost: function () {
        this.imagepost.destroy({
            success: function () {
                alert('ImagePost deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
	
    dropHandler: function (event) {
		
		console.log('drop');
		
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];
	
        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    },
	
	dragoverHandler: function(event) {
		event.preventDefault();
	}

});
