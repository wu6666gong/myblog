var Db = require('./db');
var mongodb = new Db();
function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};
 module.exports = User;

 //存储用户信息
 User.prototype.save = function(callback){
 	var user = {
 		name:this.name,
 		password:this.password,
 		email:this.email
 	};
 	mongodb.insert(user,'users',function(err,result){
 		if(err){
 			return callback(err);
 		}
 		callback(null,user);
 	})
 }
 //读取用户信息
 User.get = function(name,callback){
 	mongodb.find({name:name},'users',function(err,result){
 		if(err){
 			return callback(err);
 		}
 		callback(null,result[0]);
 	})
 }