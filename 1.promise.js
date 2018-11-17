function Promise(executor) {
	let self = this;
	// 保存失败的值和原因
	self.value = undefined;
	self.reason = undefined;
	//当调用.then.then的时候存resolve的函数和reject的函数，发布订阅
	self.onResolvedCallbacks = [];
	self.onRejectedCallbacks = [];
	// 保存一下当前Promise的状态(promise有三个状态 pending resolved rejected)
	self.status = 'pending';
	
	// executor直接执行
	function resolve (value) {
		if (self.status == 'pending') {
			self.value = value;
			self.status = 'resolved';
			self.onResolvedCallbacks.forEach(function(fn) {
				fn();
			});
		}
	}
	function reject (reason) {
		if (self.status == 'pending') {
			self.reason = reason;
			self.status = 'rejected';
			self.onRejectedCallbacks.forEach(function(fn) {
				fn();
			});
		}
	}
	try {
		executor(resolve, reject);
	} catch (e) {
		// 如果执行执行器的时候发生异常那就走到then的失败函数里
		reject(e);
	}
}
// 解析链式调用，他还要和其他的promise进行结合
function resolvePromise (x, promise, resolve, reject) {
	console.log(x === promise)
	if (x === promise) {
		// 自己不能等待自家完成
		return reject(new TypeError('循环引用 死循环'));
	}
}
// then方法中需要传递两个参数， 一个是成功回调onFulfilled，失败回调onRejected
Promise.prototype.then = function (onFulfilled, onRejected) {
	let self = this;
	// 调用then后返回新的promise可以一直调用.then
	let promise2 = new Promise(function (resolve, reject) {
		console.log('sssssssss')
		if (self.status == 'resolved') {
			// 我们现在需要把then中成功或失败后的结果获取到 看一看是不是promise 如果是promise，执行promise取代最终promise的值
			// 如果x是普通值就让这个返回的pomise变成成功态
			let x = onFulfilled(self.value);
			resolvePromise(x, promise2, resolve, reject)
		}
		if (self.status == 'rejected') {
			let x = onRejected(self.reason);
			resolvePromise(x, promise2, resolve, reject)
		}
		// executor中有异步操作，此时调用then时 处于等待态
		if (self.status == 'pending') {
			self.onResolvedCallbacks.push(function() {
				let x = onFulfilled(self.value);
				resolvePromise(x, promise2, resolve, reject)
			})
			self.onRejectedCallbacks.push(function() {
				let x = onRejected(self.reason);
				resolvePromise(x, promise2, resolve, reject)
			})
		}
	})
	return promise2;
}
module.exports = Promise;