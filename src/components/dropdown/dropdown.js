class DropDown {
	constructor(elemName) {
		this.elemName = elemName;
		this.wrapper = document.querySelector(`.${this.elemName}`);
		this.render();
		this.changeCounter();
	}

	render() {
		this.input = this.wrapper.querySelector(`.${this.elemName}__input`);
		let elemWidth = this.input.offsetWidth;
		this.wrapper.style.width = elemWidth;
		this.listWrapper =
			this.wrapper.querySelector(`.${this.elemName}__listWrapper`);
		this.counts = this.wrapper.querySelectorAll(`.${this.elemName}__count`);
		this.listElems = this.wrapper.
			querySelectorAll(`.${this.elemName}__catWrapper`);
		this.btnClear =
			this.wrapper.querySelector(`.${this.elemName}__button-clear`);
		this.btnApply =
			this.wrapper.querySelector(`.${this.elemName}__button-apply`);
		this.counterList = this.wrapper.
			querySelectorAll(`.${this.elemName}__catWrapper`);
		this.getInitialCounterList(this.counterList);
	}

	/*Получение начального состояния счетчиков (текущее значение; является ли оно минимальным или максимальным; название и тип категории)*/
	getInitialCounterList(counterList) {
		this.counters = [];
		for (let i = 0; i < counterList.length; i++) {
			let elemObj = {};
			let catName =
				counterList[i].querySelector(`.${this.elemName}__cat`);
			let catCnt = counterList[i].
				querySelector(`.${this.elemName}__countVal`);
			let catIncrem = counterList[i].
				querySelector(`.${this.elemName}__count-increm`);
			let catDecrem = counterList[i].
				querySelector(`.${this.elemName}__count-decrem`);
			elemObj.text = catName.innerText;
			elemObj.type = catName.getAttribute('data-type');
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
		this.updateCategoriesList(this.counters)
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
				.querySelector(`.${this.elemName}__countVal`);
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
	}


	/*Обновление списка категорий, которые выводятся в инпуте*/

	updateCategoriesList(changedCounters) {
		//! Здесь еще нужно добавить склонение названий по падежам!
		this.countersToDisplay = [];
		for (let i = 0; i < changedCounters.length; i++) {
			// Если категории такого типа еще нет
			if (i == 0 || i > 0 &&
				changedCounters[i].type != changedCounters[i - 1].type) {
				//console.log('НЕРАВНЫ');
				let type = changedCounters[i].type;
				let cnt = changedCounters[i].cnt;
				let elem = {};
				elem.type = type;
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
		let value = '';
		countersToDisplay.forEach(counter => {
			value += counter.cnt + ' ' + counter.type + ', ';
		});
		this.input.value = value;
	}
}


new DropDown("dropDownGuests");