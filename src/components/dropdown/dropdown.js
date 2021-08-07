import './dropdown.scss';
class DropDown {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
		this.clickInput();
		this.focusInput();
		this.changeCounter();
		this.clear();
		this.apply();
		this.collapseByClick();
		this.insideListClick();
		this.collapseByFocus();
		this.insideListFocus();
	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	getElems(selectors) {
		let sel = '';
		for (let selector of selectors) {
			sel += '.' + this.elemName + '__' + selector + ',';
		}
		sel = sel.substring(0, sel.length - 1);
		return this.wrapper.
			querySelectorAll(sel);
	}

	render() {
		this.clickOnList = false;
		this.focusOnList = false;
		this.mouseDown = false;

		this.input = this.getElem('input');
		this.listWrapper = this.getElem('list-wrapper');
		this.counts = this.getElems(['count-decrem', 'count-increm']);
		this.countVals = this.getElems(['count-val']);
		this.listElems = this.getElems(['cat-wrapper']);
		this.btnClear = this.getElem('button-clear');
		this.btnApply = this.getElem('button-apply');
		this.btnsMinus = this.getElems(['count-decrem']);
		this.tip = this.getElem('img');

		this.btnClear != null && this.btnApply != null ?
			this.clearApplyBtns = true :
			this.clearApplyBtns = false;
		this.getInitialCounterList(this.listElems);
	}


	/*Получение начального состояния счетчиков (текущее значение; является ли оно минимальным или максимальным; название и тип категории)*/
	getInitialCounterList(counterList) {
		this.counters = [];
		for (let i = 0; i < counterList.length; i++) {
			let elemObj = {};
			let catName = this.getElem('cat', counterList[i]);
			let catCnt = this.getElem('count-val', counterList[i]);
			let catIncrem = this.getElem('count-increm', counterList[i]);
			let catDecrem = this.getElem('count-decrem', counterList[i]);

			elemObj.text = catName.innerText.toLowerCase();
			elemObj.type = catName.getAttribute('data-type');
			elemObj.typeforms = catName.getAttribute('data-typeforms');
			elemObj.cnt = catCnt.innerText;
			elemObj.maxCnt = catIncrem.getAttribute('data-max');
			elemObj.minCnt = catDecrem.getAttribute('data-min');

			elemObj.cnt == elemObj.maxCnt ?
				elemObj.isMax = true :
				elemObj.isMax = false;

			elemObj.cnt == elemObj.minCnt ?
				elemObj.isMin = true :
				elemObj.isMin = false;

			this.counters.push(elemObj);
		}

		this.initializeButtons(this.counters);
		if (this.clearApplyBtns) {
			this.hideBtnClear(this.btnsMinus);
		}

	}

	/*определяем неактивные кнопки (если начальное значение счетчика - минимальное или максимальное)*/
	initializeButtons(counterList) {
		for (let i = 0; i < counterList.length; i++) {
			let elem = this.listElems[i];
			if (counterList[i].isMin) {
				let minus = this.getElem('count-decrem', elem);
				minus.disabled = true;
			}
			if (counterList[i].isMax) {
				let plus = this.getElem('count-increm', elem);
				plus.disabled = true;
			}
		}
	}


	//обработка клика по кнопкам Плюс / Минус
	changeCounter() {
		for (let elem of this.counts) {
			elem.addEventListener('click', (e) => {
				const text = e.target.parentElement.parentElement.
					firstElementChild.innerText.toLowerCase();
				let editedCounter;
				//Для кнопки "минус"
				if (elem.classList.
					contains(`${this.elemName}__count-decrem`)) {
					// Сделать активной кнопку "плюс" при клике на кнопку "минус"
					elem.parentElement.lastElementChild.disabled = false;
					//Уменьшить счетчик на единицу
					let currentCounter =
						parseInt(e.target.nextElementSibling.innerText);
					editedCounter = String(currentCounter - 1);
					e.target.nextElementSibling.innerText = editedCounter;
				}
				//Для кнопки "плюс"
				else {
					// Сделать активной кнопку "минус" при клике на кнопку "плюс"				
					elem.parentElement.firstElementChild.disabled = false;
					if (this.clearApplyBtns) {//Показать кнопку [Очистить]
						this.btnClear.
							classList.remove(`${this.elemName}__button_hidden`);
					}
					//Увеличить счетчик на единицу
					let currentCounter =
						parseInt(e.target.previousElementSibling.innerText);
					editedCounter = String(currentCounter + 1);
					e.target.previousElementSibling.innerText = editedCounter;
				}
				this.updateCounterList(text, editedCounter);
			});
		}
	}

	/*обновление состояния счетчиков*/
	updateCounterList(text, editedCounter) {
		this.counters = this.counters.map(function test(counter) {
			if (counter.text === text) {
				let obj = {
					text: counter.text,
					type: counter.type,
					typeforms: counter.typeforms,
					cnt: editedCounter,
					minCnt: counter.minCnt,
					maxCnt: counter.maxCnt,
				};
				switch (editedCounter) {
					case counter.minCnt:
						obj.isMin = true;
						break;
					case counter.maxCnt:
						obj.isMax = true;
						break;
					default:
						obj.isMin = false;
						obj.isMax = false;
				}
				return obj;
			}
			else return counter;
		}
		);
		this.updateButtons(this.counters);
		this.updateCategoriesList(this.counters);
	}

	/*обновление кнопок Плюс/ Минус (делаем неактивными, если достигнуто минимальное/ максимальное значение)*/
	updateButtons(counters) {
		for (let i = 0; i < counters.length; i++) {
			let cnt = counters[i].cnt;
			let cntToChange = this.listElems[i]
				.querySelector(`.${this.elemName}__count-val`);
			cntToChange.innerText = cnt;
			//Если обновленное значение - минимальное разрешенное значение, то сделать кнопку "минус" неактивной
			if (counters[i].isMin) {
				cntToChange.previousElementSibling.disabled = true;
				//	console.log('ДЕАКТИВИРОВАТЬ МИНУС');
			}
			//Если обновленное значение - максимальное разрешенное значение, то сделать кнопку "плюс" неактивной
			if (counters[i].isMax) {
				cntToChange.nextElementSibling.disabled = true;
				//	console.log('ДЕАКТИВИРОВАТЬ ПЛЮС');
			}
		}
		if (this.clearApplyBtns) {
			this.hideBtnClear(this.btnsMinus);
		}
	}

	//Скрыть кнопку [очистить]
	hideBtnClear(btnsMinus) {
		let arr = [];
		for (let btn of btnsMinus) {
			arr.push(btn.disabled);
		}
		//есть ли среди кнопок "Минус" активные (disabled==false)
		let isCleared = arr.find(item => item ==
			false);
		//если активные кнопки не обнаружены - isCleared=true
		if (isCleared == undefined) {
			isCleared = true;
			//скрыть кнопку [Очистить]
			this.btnClear.classList.add(`${this.elemName}__button_hidden`);
		}
	}

	/*Обновление списка категорий, которые выводятся в инпуте*/
	updateCategoriesList(changedCounters) {
		this.countersToDisplay = [];
		for (let i = 0; i < changedCounters.length; i++) {
			// Если категории такого типа еще нет
			if (i == 0 || i > 0 &&
				changedCounters[i].type != changedCounters[i - 1].type) {
				//console.log('НЕРАВНЫ');
				let type = changedCounters[i].type;
				let typeforms = changedCounters[i].typeforms;
				let cnt = changedCounters[i].cnt;
				let elem = {};
				elem.type = type;
				elem.typeforms = typeforms.split(',');
				elem.cnt = cnt;
				// То добавить в массив, который в конце будет присвоен changedCountersToDisplay				
				this.countersToDisplay.push(elem);
			}
			// Если  категория такого типа уже есть
			if (i > 0 && changedCounters[i].type ==
				changedCounters[i - 1].type) {
				//console.log('РАВНЫ');
				let elem = this.countersToDisplay.find(item => item.type ==
					changedCounters[i].type);
				// То в массив не добавлять, а прибавить значение к значению счетчика этой категории				
				elem.cnt = String(parseInt(elem.cnt) +
					parseInt(changedCounters[i].cnt));
			}
		}
		this.updateInput(this.countersToDisplay);
	}

	/*обновление значения в инпуте*/
	updateInput(countersToDisplay) {
		//Определение падежа категории в зависимости от значения счетчика
		function getWordForm(value, words) {
			value = Math.abs(value) % 100;
			let num = value % 10;
			if (value > 10 && value < 20) return words[2];
			if (num > 1 && num < 5) return words[1];
			if (num == 1) return words[0];
			return words[2];
		}
		let value = '';
		countersToDisplay.forEach(counter => {
			//исключаем категории, у которых счетчик = 0
			if (parseInt(counter.cnt) != 0)
				value += counter.cnt + ' '
					+ getWordForm(parseInt(counter.cnt),
						counter.typeforms) + ', ';
		});
		this.input.value = value.substring(0, value.length - 2);
	}

	// Открывание/ закрывание дропдауна
	toggle(flag) {
		let wrap = this.elemName + '__';
		if (flag) {
			this.listWrapper.classList.
				toggle(wrap + 'list-wrapper_hidden');
			this.tip.classList.toggle(wrap + 'img-expanded');
			this.tip.classList.toggle(wrap + 'img_collapsed');
			this.input.classList.toggle(wrap + 'input-expanded');
			this.input.classList.toggle(wrap + 'input_collapsed');
		} else {
			this.listWrapper.classList.
				add(wrap + 'list-wrapper_hidden');
			this.tip.classList.remove(wrap + 'img-expanded');
			this.tip.classList.add(wrap + 'img_collapsed');
			this.input.classList.remove(wrap + 'input-expanded');
			this.input.classList.add(wrap + 'input_collapsed');
		}
	}
	// клик по инпуту
	clickInput() {

		this.input.addEventListener("mousedown", () => {
			this.mouseDown = true;
		});


		this.input.addEventListener("mouseup", () => {
			this.toggle(true);
			this.mouseDown = false;
		});
	}

	// фокус на инпут
	focusInput() {
		this.input.addEventListener("focus", (e) => {
			if (this.listWrapper.classList.
				contains(this.elemName + '__list-wrapper_hidden') &&
				this.mouseDown == false) {
				this.toggle(true);
			}
		});
	}

	//проверка, клик был снаружи или внутри виджета
	insideListClick() {
		this.wrapper.addEventListener('click', (e) => {
			console.log('CLICK INSIDE');
			this.clickOnList = true;
		});
	}

	//отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
	collapseByClick() {
		document.addEventListener("click", (e) => {
			if (this.clickOnList == false) {
				//	console.log('КЛИК СНАРУЖИ');
				this.toggle(false);
			} else {
				console.log('КЛИК ВНУТРИ');
				this.clickOnList = false;
			}
		});
	}

	//проверка, фокус был снаружи или внутри виджета
	insideListFocus() {
		this.wrapper.addEventListener('focusin', (e) => {
			//	console.log('FOCUS INSIDE');
			this.focusOnList = true;
		});
	}

	//отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
	collapseByFocus() {
		document.addEventListener("focusin", (e) => {
			if (this.focusOnList == false) {
				//	console.log('ФОКУС СНАРУЖИ');
				this.toggle(false);
			} else {
				//	console.log('ФОКУС ВНУТРИ');
				this.focusOnList = false;
			}
		});
	}

	//клик по кнопке [Применить]
	apply() {
		if (this.clearApplyBtns) {
			this.btnApply.addEventListener("click", () => {
				this.toggle(true);
			});
		}
	}

	// клик по кнопке [очистить]
	clear() {
		if (this.clearApplyBtns) {
			this.btnClear.addEventListener("click", () => {
				for (let i = 0; i < this.countVals.length; i++) {
					this.countVals[i].innerText = this.counters[i].minCnt;
					this.updateCounterList(this.counters[i].text,
						this.countVals[i].innerText
					);
				}
				this.input.value = "";
			});
		}
	}
}

function renderDropDowns(selector) {
	let dropDowns = document.querySelectorAll(selector);
	for (let dropDown of dropDowns) {
		new DropDown(selector, dropDown);
	}
}
renderDropDowns('.dropdown');

