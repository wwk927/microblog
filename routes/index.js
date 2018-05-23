var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res, next) {
  res.render('register', { title: '用户注册' });
});

router.get('/user/:username', function(req, res) {
  res.send('user:'+req.params.username);
});

module.exports = router;
