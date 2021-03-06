var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var Blog = require('../models/blog');

router.post('/register', function(req, res) {
	//检验用户两次输入的密码是否一致
	if (req.body['password_repeat'] != req.body['password']) {
		res.json({error:'两次输入的密码不一致'})
	}else{
		//生成密码的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
	
		var newUser = new User({
			name: req.body.username,
			password:password
		})
		
		User.get(newUser.name, function(err, user) {
			if (user) {
				err = '用户名已存在。'
			}
			if (err) {
				res.json({error:err});
				return false;
			}
			//如果不存在则新增用户
			newUser.save(function(err){		
				req.session.user = newUser;
				res.json({success:'注册成功'})
			})
		})
	}
});

router.post('/login', function(req, res) {
	//生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	User.get(req.body.username, function(err, user) {
		if(!user) {
			res.json({returnCode:'1',returnInfo:'用户不存在'});
			return false;
		}
		else if(user.password != password) {
			res.json({returnCode:'2',returnInfo:'密码错误'});
			return false;
		}else {		
			req.session.user = user;
			res.json({returnCode:'0',returnInfo:'登入成功'});
		}
	});
});

router.post('/publish', function(req, res) {
	var currentUser = req.session.user;
	var newBlog = new Blog(currentUser.name,req.body.content)
	newBlog.save(function(err){	
		if (!err){
			res.json({returnCode:'0',returnInfo:'发表成功'});
		}else{
			res.json({returnCode:'-1',returnInfo:'发表失败'});
		}	
	})
});

router.get('/blogList', function(req, res) {
	if (!req.session.user) {
		res.json({returnCode:'-1',returnInfo:"未登录"});
	}else{
		Blog.get(req.session.user.name, function(err, blogList) {
			if (!err){
				res.json({returnCode:'0',returnInfo:blogList});
			}else{
				res.json({returnCode:'-1',returnInfo:err});
			}
		})
	}
});

router.get('/userInfo', function(req, res) {
	if (!req.session.user) {
		res.json({returnCode:'-1',returnInfo:"未登录"});
	}else{
		res.json({returnCode:'0',returnInfo:{name:req.session.user.name}});
	}
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res) {
  res.render('register.html', { title: '用户注册' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: '用户登录' });
});

router.get('/user/:username', function(req, res) {
  res.send('user:'+req.params.username);
});

function checkLogin(req, res, next) {
	if(!req.session.user) {
//		req.flash('error', '未登入');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if(req.session.user) {
//		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}

module.exports = router;
