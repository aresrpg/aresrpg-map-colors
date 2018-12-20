export default class {
	promise = new Promise((res, rej) => {
		this.resolve = res
		this.reject = rej
	})
}