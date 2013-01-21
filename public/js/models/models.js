window.ImagePost = Backbone.Model.extend({
	urlRoot: "/imageposts",
	idAttribute: "_id",
  initialize: function () {
      this.validators = {};
  },

  validateItem: function (key) {
      return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
  },

  validateAll: function () {

  },

  defaults: {
      _id: null,
			image:null,
			filename:null
  }
});

window.ImagePostCollection = Backbone.Collection.extend({

    model: ImagePost,

    url: "/imageposts"

});

window.Cup = Backbone.Model.extend({

    urlRoot: "/cups",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.color = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a color"};
        };

        this.validators.designer = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a designer"};
        };

        this.validators.country = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "Countryside",
        color: "black",
        country: "USA",
        designer: "Gucci",
        description: "Gucci's first blue jeans with a hammer holder",
        picture: null
    }
});

window.CupCollection = Backbone.Collection.extend({

    model: Cup,

    url: "/cups"

});

window.Wine = Backbone.Model.extend({

    urlRoot: "/wines",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.grapes = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a grape variety"};
        };

        this.validators.country = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        grapes: "",
        country: "USA",
        region: "California",
        year: "",
        description: "",
        picture: null
    }
});

window.WineCollection = Backbone.Collection.extend({

    model: Wine,

    url: "/wines"

});