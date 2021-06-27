
class DropDown {
	constructor(elemName) {
		this.elemName = elemName;
		this.wrapper = document.querySelector(`.${this.elemName}`);
		this.render();
		this.changeCounter();
		this.clear();
		this.clickInput();
		this.apply();
		this.collapseByClick();
	}

	//проверка, клик был снаружи или внутри виджета
	insideClick(elem, parentElemSelector) {
		if (elem.closest(parentElemSelector)) {
			return true;
		}
		else {
			return false;
		}
	}

	//отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
	collapseByClick() {
		document.addEventListener("click", (e) => {
			if (this.insideClick(e.target, `.${this.elemName}`)) {
				//console.log('КЛИК ВНУТРИ');
				e.preventDefault();
			}
			else {
				//	console.log('КЛИК СНАРУЖИ');
				this.listWrapper.classList.
					add(`${this.elemName}__list-wrapper_hidden`);
				this.tip.classList.remove(`${this.elemName}__img-expanded`);
				this.tip.classList.add(`${this.elemName}__img_collapsed`);
				this.input.classList.remove(`${this.elemName}__input-expanded`);
				this.input.classList.add(`${this.elemName}__input_collapsed`);
			}
		});
	}



	render() {
		this.clicked = false;
		this.clickedInside = false;
		this.input = this.wrapper.querySelector(`.${this.elemName}__input`);
		this.listWrapper =
			this.wrapper.querySelector(`.${this.elemName}__list-wrapper`);
		this.counts = this.wrapper.
			querySelectorAll(`.${this.elemName}__count-decrem,
		 .${this.elemName}__count-increm`);
		this.countVals =
			this.wrapper.querySelectorAll(`.${this.elemName}__count-val`);
		this.listElems = this.wrapper.
			querySelectorAll(`.${this.elemName}__cat-wrapper`);
		this.btnClear =
			this.wrapper.querySelector(`.${this.elemName}__button-clear`);
		this.btnApply =
			this.wrapper.querySelector(`.${this.elemName}__button-apply`);
		this.counterList = this.wrapper.
			querySelectorAll(`.${this.elemName}__cat-wrapper`);
		this.btnsMinus =
			this.wrapper.querySelectorAll(`.${this.elemName}__count-decrem`);
		this.tip = this.wrapper.querySelector(`.${this.elemName}__img`);
		this.clearApplyBtns;
		if (this.btnClear != null && this.btnApply != null) {
			this.clearApplyBtns = true;
		}
		this.getInitialCounterList(this.counterList);
	}

	toggle() {
		this.listWrapper.classList.
			toggle(`${this.elemName}__list-wrapper_hidden`);
		this.tip.classList.toggle(`${this.elemName}__img-expanded`);
		this.tip.classList.toggle(`${this.elemName}__img_collapsed`);
		this.input.classList.toggle(`${this.elemName}__input-expanded`);
		this.input.classList.toggle(`${this.elemName}__input_collapsed`);
	}

	clickInput() {
		this.input.addEventListener("click", () => {
			this.toggle();
		});
	}

	apply() {
		if (this.clearApplyBtns) {
			this.btnApply.addEventListener("click", () => {
				this.toggle();
			});
		}
	}

	/*Получение начального состояния счетчиков (текущее значение; является ли оно минимальным или максимальным; название и тип категории)*/
	getInitialCounterList(counterList) {
		this.counters = [];
		for (let i = 0; i < counterList.length; i++) {
			let elemObj = {};
			let catName =
				counterList[i].querySelector(`.${this.elemName}__cat`);
			let catCnt = counterList[i].
				querySelector(`.${this.elemName}__count-val`);
			let catIncrem = counterList[i].
				querySelector(`.${this.elemName}__count-increm`);
			let catDecrem = counterList[i].
				querySelector(`.${this.elemName}__count-decrem`);
			elemObj.text = catName.innerText.toLowerCase();
			elemObj.type = catName.getAttribute('data-type');
			elemObj.typeforms = catName.getAttribute('data-typeforms');
			elemObj.cnt = catCnt.innerText;
			elemObj.maxCnt = catIncrem.getAttribute('data-max');
			elemObj.minCnt = catDecrem.getAttribute('data-min');
			if (elemObj.cnt == elemObj.maxCnt) {
				elemObj.isMax = true;
			} else {
				elemObj.isMax = false;
			}
			if (elemObj.cnt == elemObj.minCnt) {
				elemObj.isMin = true;
			} else {
				elemObj.isMin = false;
			}
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
				let minus = elem.
					querySelector(`.${this.elemName}__count-decrem`);
				minus.disabled = true;
			}
			if (counterList[i].isMax) {
				let plus = elem.
					querySelector(`.${this.elemName}__count-increm`);
				plus.disabled = true;
			}
		}
	}

	/*обработка клика по кнопкам Плюс / Минус*/
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
				if (editedCounter == counter.minCnt) {
					obj.isMin = true;
				}
				else if (editedCounter == counter.maxCnt) {
					obj.isMax = true;
				}
				else {
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
	// установить значения счетчиков равными минимальным значеням
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


	/*Обновление списка категорий, которые выводятся в инпуте*/
	updateCategoriesList(changedCounters) {
		//	console.log(changedCounters);

		//! Здесь еще нужно добавить склонение названий по падежам!
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

	numWord(value, words) {
		value = Math.abs(value) % 100;
		let num = value % 10;
		if (value > 10 && value < 20) return words[2];
		if (num > 1 && num < 5) return words[1];
		if (num == 1) return words[0];
		return words[2];
	}

	/*обновление значения в инпуте*/
	updateInput(countersToDisplay) {

		let value = '';
		countersToDisplay.forEach(counter => {
			//исключаем категории, у которых счетчик = 0
			if (parseInt(counter.cnt) != 0)
				value += counter.cnt + ' '
					+ this.numWord(parseInt(counter.cnt),
						counter.typeforms) + ', ';
		});
		this.input.value = value.substring(0, value.length - 2);
	}
}


new DropDown("dropDownGuests");
new DropDown("dropDownRooms");