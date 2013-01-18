var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "wines"	            : "wineslist",
        "cups"	            : "list",
        "wines/page/:page"	: "wineslist",
        "cups/page/:page"	: "list",
        "cups/add"          : "addCup",
        "wines/add"         : "addWine",
        "cups/:id"          : "cupDetails",
        "wines/:id"         : "wineDetails",
        "about"             : "about"
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

	wineslist: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({success: function(){
            $("#content").html(new WineListView({model: wineList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
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

utils.loadTemplate(['HomeView', 'HeaderView', 'WineView', 'CupView', 'WineListItemView','CupListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});