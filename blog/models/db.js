var MongoClient = require("mongodb").MongoClient;
var assert = require('assert');
var settings = require("../setting");
function Db(){
	this.url = settings.url;
	this.dbName = settings.dbName;
}
module.exports = Db;
//插入数据
Db.prototype.insert = function(data,col,cb){
	var the = this;
	var insertData = function(db,callback){
		//连接到表
		var collection = db.collection(col);
			console.log(col);
		//插入数据
		collection.insertMany([data],function(err,result){
			if(err){
				console.log('Error'+err);
				return cb(err);
			}
			console.log(result);
			callback(null,result);
		});
	}
	MongoClient.connect(the.url,function(err,client){
		console.log('连接数据库成功');
		var db = client.db(the.dbName);
		insertData(db,function(newerr,result){
			client.close();
			cb(null,result);
		})
	})
}
//查找数据
Db.prototype.find = function(data,col,cb){
	var the = this;
	var findData = function(db,callback){
		//连接到表
		var collection = db.collection(col);
		collection.find(data).toArray(function(err,result){
			if(err){
				console.log('Error'+err);
				return cb(err);
			}
			callback(null,result);
		})
	}

	MongoClient.connect(the.url,function(err,client){
		console.log('数据连接成功');
		var db = client.db(the.dbName);
		findData(db,function(newerr,result){
			client.close();
			cb(null,result);
		})
	})

}