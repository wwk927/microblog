var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('monodb').Server;

module.exports = new Db(settings.db,new Server(settings.host, Connection.DEFAULT_PORT,{}));
