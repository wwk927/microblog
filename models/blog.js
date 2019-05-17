var mongodb = require('./db');

function Blog(userName,content,time) {
	this.userName = userName;
	this.content = content;
	if (time) {
		this.time = time;
	} else{
		this.time = new Date();
	}
}

Blog.prototype.save = function save(callback) {
	//存入Mongdb的文档
	var blog = {
		userName : this.userName,
		content : this.content,
		time : this.time,
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 blogs 集合
		db.collection('blogs',function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//为 userName 属性添加索引
			collection.ensureIndex('userName');
			//写入 user 文档
			collection.insert(blog, {safe: true}, function(err, blog){
				mongodb.close();
				callback(err,blog);
			})
		})
	})
};

Blog.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 blogs 集合
		db.collection('blogs',function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (username) {
				query.userName = username;
			}
			// 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
			collection.find(query).sort({time:-1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				} else {
					var blogs = [];
					docs.forEach(function(doc, index) {
						var blog = new Blog(doc.userName, doc.content, doc.time);
						blogs.push(blog);
					});
					callback(null, blogs);
				}
			})
		})	
	})
}

module.exports = Blog;
