// let Promise = require('./1.promise.js');
let p = new Promise(function(resolve, reject) {
	throw new Error('失sss败')
})
p.then(function (value) {
	console.log(value);
}, function (reason) {
	console.log('reason', reason)
})