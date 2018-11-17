let Promise = require('./1.promise.js');
let p = new Promise(function(resolve, reject) {
	setTimeout(function () {
		resolve()
	})
})
// p.then(function (value) {
// 	console.log(value);
// }, function (reason) {
// 	console.log('reason', reason)
// })
// 循环引用，因为自己永远不会完成
let promise2 = p.then(function() {
	return promise2;
})
// 如果返回的结果和P1相等返回循环应用
promise2.then(function(value) {

}, function (err) {
	console.log(err)
})
