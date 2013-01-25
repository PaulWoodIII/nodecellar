#Post Images

A user Post an image. Those images stream straight to mongodb. The app resizes the images and creates a "post" on the DB with some other insteresting information. 


## To run the application on your own Computer

Actually you probabaly shouldn't... 

This application is not ready for a production use yet but you can do the regular `npm install` and `node server.js`


## To Do

* Create a Post Object

* Form for Posting Images

* Authentication

* OAuth

* Display Images

* Paging

#Going on behind the scenes

I'm using [connect-multipart-gridform](https://github.com/aheckmann/connect-multipart-gridform) to stream images straight into MongoDB. I wanted to do this instead of using nginx and the file system. In the future though I'll definately think about nginx for hosting images. 


#Forked From:

## Node Cellar Sample Application with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB #

"Node Cellar" is a sample CRUD application built with with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB.

The application allows you to browse through a list of wines, as well as add, update, and delete wines.

This application is further documented [here](http://coenraets.org/blog).

The application is also hosted online. You can test it [here](http://nodecellar.coenraets.org).
