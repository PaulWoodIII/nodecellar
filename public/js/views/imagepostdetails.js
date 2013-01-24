window.ImagePostView = Backbone.View.extend({

    initialize: function (imagepost) {
		
		console.log('add image post imagepostdetails.js');
		this.imagepost = imagepost;
		
		if (window.File && window.FileReader && window.FileList && window.Blob) {
		  // Great success! All the File APIs are supported.
		} else {
		  utils.addValidationError('The File APIs are not fully supported in this browser.');
		}		
		this.render();
		
    },

    render: function () {
		console.log('render');	
				
        $(this.el).html(this.template({imagepost:this.imagepost.toJSON()}));
		
        return this;
    },

    events: {
        "change .imagepost-form" : "changePost",
        "click .save"            : "beforeSaveImagePost",
        "click .delete"          : "deleteImagePost"
    },
	
	changeFileId: function(newid){
		console.log('afun!');
		this.imagepost.set({imagefileid: newid})
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
            utils.showAlert(target.id, check.message);
        } 
		else {
            utils.removeValidationError(target.id);
        }
    },
    beforeSaveImagePost: function () {
		
		console.log('beforeSaveImagePost');
		
        var self = this;
        var checkPost = this.imagepost.validateAll();
        if (checkPost.isValid === false) {
            utils.displayValidationErrors(checkPost.messages);
            return false;
        }		
        this.saveImagePost();
        return false;
    },


    saveImagePost: function () {
        var self = this;
        console.log('before save');
        this.imagepost.save(null, {
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
	

});
