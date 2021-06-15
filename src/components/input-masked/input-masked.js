import { a } from '../input/input.js';

let inputsMasked = document.querySelectorAll('.input-masked');
for (let input of inputsMasked) {
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "ДД.ММ.ГГГГ");
}





