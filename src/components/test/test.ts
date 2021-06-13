import {
	watchObj
		as watchObj0, EmailParser
		as EmailParser0
} from './module-done';


let works = [
	{ wo: watchObj0, ep: EmailParser0 }
];

let email1 = 'info@ntschool.ru';
let email2 = 'support@@ntschool.ru';
let email3 = 'some1@nz';

window.addEventListener('load', function () {

	works.forEach((item, i) => {
		document.body.innerHTML += `<div>${i} -------------- </div>`;
		console.log(`start ${i} --------------`);

		try {
			let parser = new item.ep(email1);

			console.log(parser.isCorrect);
			console.log(parser.name);
			console.log(parser.domain);

			parser.email = email2;
			console.log(parser.isCorrect);
			console.log(parser.name);
			console.log(parser.domain);

			parser.email = email3;
			console.log(parser.isCorrect);
			console.log(parser.name);
			console.log(parser.domain);

			let div = document.createElement('div');
			document.body.appendChild(div);



			let cleverDiv = item.wo(div, function (prop: string, val: string) {
				console.log(prop, val);
			});

			cleverDiv.innerHTML = '<strong>HTML</strong><em>Changed</em>';
			/* 
				в консоли: 
				innerHTML <strong>HTML</strong><em>Changed</em
			*/

			cleverDiv.style.color = 'red';
			/*
				весь текст стал красным
				в консоли: 
				color red
			*/
			//console.log(cleverDiv.querySelector('em'));


			cleverDiv.querySelector('em').style.color = 'green';
			/*
				em стал зелёным
				в консоли ничего не добавилось

				// популярная ошибка Illegal invocation - из-за манипуляций у функции сломался this
			*/

			cleverDiv.classList.add('some');
		}
		catch (e) {
			console.log(e);
		}

		document.body.innerHTML += '<hr>';
		console.log(`---------------------------------`);
	});
});



