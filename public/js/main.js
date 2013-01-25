var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about",
				
        "imageposts"	          : "imagePostList",
        "imageposts/page/:page"	  : "imagePostList",
        "imageposts/add"          : "addImagePost",
        "imageposts/:id"          : "imagePostDetails"
		
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	imagePostList: function(page) {
			
	    var p = page ? parseInt(page, 10) : 1;
	    var imagePostList = new ImagePostCollection();
	    imagePostList.fetch({success: function(){
	        $("#content").html(new ImagePostListView({model: imagePostList, page: p}).el);
	    }});
	    this.headerView.selectMenuItem('browse-menu');
	},
			
    imagePostDetails: function (id) {
		
        var imagepost = new ImagePost({_id: id});

		this.imagepostview = new ImagePostView(imagepost);
        $('#content').html(this.imagepostview.el);
	
		
        this.headerView.selectMenuItem();
    },

	addImagePost: function() {
		console.log('add image post main.js');
        var imagepost = new ImagePost();		
		this.imagepostview = new ImagePostView(imagepost);
        $('#content').html(this.imagepostview.el);
		
		
		
        this.headerView.selectMenuItem('add-menu');
		utils.addupload();
	},
	
    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }
});

utils.loadTemplate(['HomeView', 'HeaderView', 'ImagePostListItemView', 'ImagePostView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});