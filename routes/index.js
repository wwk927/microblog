var express = require('express');
var router = express.Router();

router.post('/reg', function(req, res) {
	console.log(req.body.username,req.body['password-repeat'],req.body['password']);
	//检验用户两次输入的密码是否一致
	if (req.body['password-repeat'] != req.body['password']) {
	//	req.flash('error','两次输入的密码不一致');
		console.log('error','两次输入的密码不一致');
		return res.redirect('/reg');
	}
//
////生成密码的散列值
//var md5 = crypto.createHash('md5');
//var password = md5.update(req.body.password).digest('base64');
//
//	var newUser = new User({
//		name: req.body.username,
//		password:paswword
//	})
//	
//	User.get(newUser.name, function(err, user) {
//		if (user) {
//			err = '用户名已存在。'
//		}
//		if (err) {
//			req.flash('error', err);
//			return res.redirect('/reg');
//		}
//		//如果不存在则新增用户
//		newUser.save(function(err){
//			if (err) {
//				req.flash('error', err);
//				return res.redirect('/reg');
//			}			
//			req.session.user = newUser;
//			req.flash('success','注册成功');
//			res.redirect('/');
//		})
//	})
	
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res) {
  res.render('register', { title: '用户注册' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: '用户登录' });
});

router.get('/user/:username', function(req, res) {
  res.send('user:'+req.params.username);
});

module.exports = router;
