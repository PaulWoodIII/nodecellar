var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about",
				
        "imageposts"	          : "imagePostList",
        "imageposts/page/:page"	  : "imagePostList",
        "imageposts/add"          : "addImagePost",
        "imageposts/:id"          : "imagePostDetails",
        
		"wines"	            : "wineslist",
        "wines/page/:page"	: "wineslist",
        "wines/add"         : "addWine",
        "wines/:id"         : "wineDetails",

		"cups"	            : "list",
        "cups/page/:page"	: "list",
        "cups/add"          : "addCup",
        "cups/:id"          : "cupDetails"

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
        var imagefile = new ImageFile({_id: id});

        $("#content").html(new ImagePostView(imagepost, imagefile).el);
		
        this.headerView.selectMenuItem();
    },

	addImagePost: function() {
		console.log('add image post main.js');
        var imagepost = new ImagePost();
        var imagefile = new ImageFile();
        $('#content').html(new ImagePostView(imagepost,imagefile).el);
        this.headerView.selectMenuItem('add-menu');
	},

	wineslist: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({success: function(){
            $("#content").html(new WineListView({model: wineList, page: p}).el);
        }});
        this.headerView.selectMenuItem('browse-menu');
    },
	
	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var cupList = new CupCollection();
        cupList.fetch({success: function(){
            $("#content").html(new CupListView({model: cupList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    cupDetails: function (id) {
        var cup = new Cup({_id: id});
        cup.fetch({success: function(){
            $("#content").html(new CupView({model: cup}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addCup: function() {
        var cup = new Cup();
        $('#content').html(new CupView({model: cup}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    wineDetails: function (id) {
        var wine = new Wine({_id: id});
        wine.fetch({success: function(){
            $("#content").html(new WineView({model: wine}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addWine: function() {
        var wine = new Wine();
        $('#content').html(new WineView({model: wine}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ImagePostListItemView', 'ImagePostView', 'WineView', 'CupView', 'WineListItemView','CupListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});