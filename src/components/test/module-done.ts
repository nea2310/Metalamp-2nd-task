

function watchObj(node: any, callback: any) {

	let trapObj = {

		apply(target: any, thisArg: any, args: any[]) {

			//console.log(thisArg);

			//target.bind(thisArg, ...args);


			//console.log(target.bind(thisArg, ...args));

			//return target.bind(thisArg, ...args);
			//return target.apply(thisArg, args);

			//console.log(thisArg.querySelector(args[0]));

			console.log(target);
			console.log(thisArg);
			console.log(...args);


			//return target.bind(document, args[0]);

			//return document.querySelector(args[0]);
		},


		get(target: any, key: string): any {

			if (typeof target[key] === 'object' && target[key] !== null) {
				return new Proxy(target[key], trapObj);
			} else {

				if (typeof target[key] === 'function') {
					//	temp = 

					return new Proxy(target[key], trapObj);
					//return new Proxy(Reflect.get(target, key, receiver), trapObj);
				}
				// else {
				// 	//temp = Reflect.get(target, key, receiver);
				// }
				//Reflect.get(target, key, receiver);
				return target[key];
			}
		},

		set(target: any, prop: string, val: any) {
			callback(prop, val);
			// Reflect.set(target, prop, val, receiver);
			return target.innerHTML = val;
		}
	};

	return new Proxy(node, trapObj);
}

class EmailParser {

	isCorrect: Boolean;
	domain: string;
	name: string;
	// eslint-disable-next-line no-unused-vars
	constructor(email: string) {
		this.email = email;
	}

	set email(val: string) {
		let RegX = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;
		this.isCorrect = RegX.test(val);

		if (this.isCorrect) {
			let hostReg = /([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;
			let nameReg = /[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*/;

			this.domain = val.match(hostReg)[0];
			this.name = val.match(nameReg)[0];
		}
		else {
			this.domain = this.name = null;
		}
	}
}



export { watchObj, EmailParser };