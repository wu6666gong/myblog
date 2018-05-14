var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
module.exports =function(app){
	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
			if(err){
				posts=[];
			}
			var error=req.flash('error').toString();
			var success = req.flash('success').toString();
			var user =req.session.user;
			res.render('index',{
				title:'主页',
				user:user,
				posts: posts,
				success:success,
				error:error
			});
		})
		
	});

	app.get('/reg',checkNotLogin);

	app.get('/reg',function(req,res){
		var error=req.flash('error').toString();
		var success = req.flash('success').toString();
		var user =req.session.user;
		res.render('reg',{
			title:'注册',
			user:user,
			success:success,
			error:error
		});
	})

	app.post('/reg',function(req,res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if(password != password_re){
			req.flash('error',"两次输入的密码不一致");
			return res.redirect('/reg'); //返回注册页
		}
		//生产密码的md5值
		var md5 = crypto.createHash('md5');
		password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			name:name,
			password:password,
			email:req.body.email
		});

		//检查用户名是否已经存在
		User.get(newUser.name,function(err,user){
			if(err){
				req.flash('err',err);
				return res.redirect('/');
			}
			if(user){
				req.flash('error','用户已存在');
				return res.redirect('/reg');//返回注册页
			}
			//如果不存在责新增用户
			newUser.save(function(err,user){
				if(err){
					req.flash("error",err);
					return res.redirect('/reg');//注册失败返回注册页
				}
				req.session.user = user.name;//用户信息存储session
				req.flash('success',"注册成功");
				res.redirect('/');//注册成功返回主页
			})
		})
	});

	app.get('/login',checkNotLogin);

	app.get('/login',function(req,res){
		var error=req.flash('error').toString();
		var success = req.flash('success').toString();
		var user =req.session.user;
		res.render('login',{
			title:'登录',
			user:user,
			success:success,
			error:error
		});
	});

	app.post('/login',function(req,res){
		//生成密码的mad5值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		//检验用户是否存在
		var userData = req.body.name;
		User.get(userData,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/login');//用户不存在跳转登录页
			}
			//检验密码是否一致
			if(user.password != password){
				req.flash('error','密码错误');
				return res.redirect('/login');//密码错误则跳转登录页
			}
			//用户密码都匹配后,将用户信息存入session
			req.session.user = user.name;
			req.flash('success','登录成功');
			res.redirect('/');//登录成功跳转到主页
		})
	})
	

	app.get('/post',function(req,res){
		var error=req.flash('error').toString();
		var success = req.flash('success').toString();
		var user =req.session.user;
		res.render('post',{
			title:'发表',
			user:user,
			success:success,
			error:error
		});
	});

	app.post('/post',checkLogin);

	app.post('/post',function(req,res){
		var currentUser = req.session.user,
			post = new Post(currentUser.name,req.body.title,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success'); //发布成功
			res.redirect('/');//发表成功跳转页面
		})
	})

	app.get('/logout',function(req,res){
		 req.session.user = null;
		 req.flash('success','退出成功');
		 res.redirect('/');//登出成功后跳转主页
	})
	//访问登录页面判断是否登录
	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登录');
			return res.redirect('/login');
		}
		next();
	}
	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','已登录');
			return res.redirect('/');//返回之前的页面
		}
		next();
	}
} ;
