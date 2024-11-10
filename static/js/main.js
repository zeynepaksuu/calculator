document.addEventListener('DOMContentLoaded', () => {
	const elements = {
		calculator: document.querySelector('.calculator'),
		menuToggle: document.getElementById('menu-toggle'),
		closeMenu: document.getElementById('close-menu'),
		sideMenu: document.querySelector('.side-menu'),
		overlay: document.getElementById('overlay'),
		menuItems: document.querySelectorAll('.menu-item'),
		calculatorType: document.querySelector('.calculator-type'),
		calculatorSideBar: document.getElementById('calculatorSideBar'),
		themeToggle: document.getElementById('theme-toggle'),
		graphToggle: document.getElementById('graph-toggle'),
		calcSideBar: document.querySelector('.calculator-sidebar'),
		calcSideHeader: document.getElementById('calcSideBarHeader'),
		displayarea: document.querySelector('.display'),
		display: document.querySelector('.result'),
		history: document.querySelector('.history'),
		historyToggle: document.getElementById('history-toggle'),
		keypads: {
			standard: document.querySelector('.standard-keypad'),
			scientific: document.querySelector('.scientific-keypad'),
			money: document.querySelector('.money-keypad'),
			volume: document.querySelector('.volume-keypad'),
			length: document.querySelector('.length-keypad'),
			weight: document.querySelector('.weight-keypad'),
			temperature: document.querySelector('.temperature-keypad'),
			energy: document.querySelector('.energy-keypad'),
			region: document.querySelector('.region-keypad'),
			speed: document.querySelector('.speed-keypad'),
			time: document.querySelector('.time-keypad'),
			power: document.querySelector('.power-keypad'),
			data: document.querySelector('.data-keypad'),
			pressure: document.querySelector('.pressure-keypad'),
			angle: document.querySelector('.angle-keypad')
		}
	};

	// State variables
	let currentDivId = null;
	let currentInput = '0';
	let lastOperation = null; // Yeni eklenen değişken
	let result = null;
	let currentOperator = null;
	let shouldResetScreen = false;
	let memory = 0;
	let isRadianMode = false;
	let currentMode = 'standard';

	// History panel setup
	const historyPanel = document.createElement('div');
	historyPanel.className = 'history-panel';
	historyPanel.innerHTML = `
        <div class="history-panel-header">
            <div class="history-options">
                <button class="history-btn">Geçmiş</button>
            </div>
            <button class="close-history">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="history-list"></div>
        <button class="clear-history">
            <i class="fa fa-trash"></i>
        </button>
    `;
	document.body.appendChild(historyPanel);

	const historyList = historyPanel.querySelector('.history-list');
	const clearHistoryButton = historyPanel.querySelector('.clear-history');
	const closeHistoryButton = historyPanel.querySelector('.close-history');
	const historyBtn = historyPanel.querySelector('.history-btn');

	let calculationHistory = [];

	// Theme setup
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		document.body.classList.add(savedTheme);
	}

	// Utility functions
	function toggleMenu() {
		elements.sideMenu.classList.toggle('open');
		elements.overlay.classList.toggle('active');
	}

	function updateDisplay() {
		elements.display.textContent = currentInput;
	}

	function clearHistory() {
		calculationHistory = [];
		historyList.innerHTML = '';
	}

	function displayKeyboardByName(name) {
		Object.values(elements.keypads).forEach(keypad => keypad.classList.remove('active'));
		if (name == 'graphic' || name == 'programmer') {
			return;
		}
		const keyboard = elements.keypads[name];

		if (keyboard) {
			keyboard.classList.add('active');
		} else {
			console.error(`Klavyeyi bulamadım: ${name}`);
		}
	}

	function addToHistory(firstValue, operation, secondValue, result) {
		const historyEntry = `${firstValue} ${operation} ${secondValue} = ${result}`;
		calculationHistory.push(historyEntry);
		updateHistoryList();
	}
	
	function updateHistoryList() {
		historyList.innerHTML = '';
		calculationHistory.forEach(entry => {
			const newEntry = document.createElement('div');
			newEntry.className = 'history-entry';
			newEntry.textContent = entry;
			historyList.appendChild(newEntry);
		});
	}
	
	function clearHistory() {
		calculationHistory = [];
		updateHistoryList();
	}

	// Calculator functions
	function inputDigit(digit) {
		currentInput = window.calculatorUtils.inputDigit(currentInput, digit, shouldResetScreen);
		shouldResetScreen = false;
		updateDisplay();
	}
	
	function inputDecimal() {
		currentInput = window.calculatorUtils.inputDecimal(currentInput, shouldResetScreen);
		shouldResetScreen = false;
		updateDisplay();
	}
	
	function handleOperator(operator) {
		const inputValue = parseFloat(currentInput);

		if (result === null) {
			result = inputValue;
		} else if (currentOperator) {
			const newResult = window.calculatorUtils.performCalculation(result, inputValue, currentOperator);
			addToHistory(result, currentOperator, inputValue, newResult);
			result = newResult;
		}

		currentOperator = operator;
		lastOperation = { firstValue: result, operator: currentOperator }; // Son işlemi kaydet
		shouldResetScreen = true;
		elements.history.textContent = `${result} ${currentOperator}`;
		currentInput = result.toString();
		updateDisplay();
	}
	
	function resetCalculator() {
		const resetState = window.calculatorUtils.resetCalculator();
		currentInput = resetState.currentInput;
		lastOperation = resetState.lastOperation;
		result = resetState.result;
		currentOperator = resetState.currentOperator;
		shouldResetScreen = resetState.shouldResetScreen;
		elements.history.textContent = '';
		updateDisplay();
	}
	
	function backspace() {
		currentInput = window.calculatorUtils.backspace(currentInput);
		updateDisplay();
	}
	
	function negate() {
		currentInput = window.calculatorUtils.negate(currentInput);
		updateDisplay();
	}

	function scientificCalculate(action) {
		const result = globScientificCalculate(action, currentInput, isRadianMode);
		if (result) {
			const { newResult, secondValue, action } = result;
			currentInput = newResult.toString();
			addToHistory(currentInput, action, secondValue, newResult);
			shouldResetScreen = true;
			updateDisplay();
		}
	}

	function handleMemory(action) {
		const result = globHandleMemory(action, currentInput, memory);
		currentInput = result.currentInput;
		memory = result.memory;
		addToHistory(currentInput, result.action, '', memory);
		shouldResetScreen = true;
		updateDisplay();
	}

	function toggleDegRad() {
		isRadianMode = !isRadianMode;
		const degRadButton = document.querySelector('[data-action="deg-rad"]');
		degRadButton.textContent = isRadianMode ? 'Rad' : 'Deg';
	}

	// Converter functions

	async function calculateCurrency() {
		const { value: fromCurrency } = document.getElementById("convertPrice");
		const { value: toCurrency } = document.getElementById("convertedPrice");
		const amount = parseFloat(document.getElementById(currentDivId).innerText);
	
		const result = await globCalculateCurrency(fromCurrency, toCurrency, amount);
		if (result !== null) {
			document.getElementById("currencyConverted").innerText = result.toFixed(2);

		}
	}
	
	async function reverseCalculateCurrency() {
		const { value: fromCurrency } = document.getElementById("convertPrice");
		const { value: toCurrency } = document.getElementById("convertedPrice");
		const amount = parseFloat(document.getElementById("currencyConverted").innerText);
	
		const result = await globReverseCalculateCurrency(fromCurrency, toCurrency, amount);
		if (result !== null) {
			document.getElementById("currencyConvert").innerText = result.toFixed(2);

		}
	}
	
	function genericCalculate(type) {
		const input = parseFloat(document.getElementById(`${type}Input`).innerText);
		const fromUnit = document.getElementById(`fromUnit${type.charAt(0).toUpperCase() + type.slice(1)}`).value;
		const toUnit = document.getElementById(`toUnit${type.charAt(0).toUpperCase() + type.slice(1)}`).value;
	
		const result = globGenericCalculate(type, input, fromUnit, toUnit);
		document.getElementById(`${type}Result`).innerText = result.toFixed(5);
	}

	
	function genericReverseCalculate(type) {
		const result = parseFloat(document.getElementById(`${type}Result`).innerText);
		const fromUnit = document.getElementById(`fromUnit${type.charAt(0).toUpperCase() + type.slice(1)}`).value;
		const toUnit = document.getElementById(`toUnit${type.charAt(0).toUpperCase() + type.slice(1)}`).value;
	
		const input = globGenericReverseCalculate(type, result, fromUnit, toUnit);
		document.getElementById(`${type}Input`).innerText = input.toFixed(5);
	}

	
	function handleCurrencyChange(event) {
		const isConvertPrice = event.target.id === 'convertPrice';
		const symbolElement = document.getElementById(isConvertPrice ? 'currencySymbolConvert' : 'currencySymbolConverted');
		const selectedCurrency = event.target.value;
		symbolElement.textContent = globUpdateCurrencySymbol(selectedCurrency);
		isConvertPrice ? calculateCurrency() : reverseCalculateCurrency();
	}

	// Date calculator functions
	function calculateDateDifference(startDate, endDate) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	function addDaysToDate(baseDate, days) {
		const result = new Date(baseDate);
		result.setDate(result.getDate() + parseInt(days));
		return result;
	}

	function formatDate(date) {
		return date.toLocaleDateString('tr-TR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Event listeners
	elements.menuToggle.addEventListener('click', toggleMenu);
	elements.closeMenu.addEventListener('click', toggleMenu);
	elements.overlay.addEventListener('click', toggleMenu);

	elements.menuItems.forEach(item => {
		item.addEventListener('click', () => {
			const type = item.dataset.type;
			currentMode = type;

			document.querySelectorAll('[id$="Area"]').forEach(area => {
				area.style.display = 'none';
			});
			elements.graphToggle.style.display = type === 'graphic' ? 'block' : 'none';
			if (type === 'standard' || type === 'scientific') {
				elements.calculatorSideBar.style.display = 'none';
				elements.displayarea.style.display = 'block';
				elements.historyToggle.style.display = 'block';
			} else {
				elements.calculatorSideBar.style.display = 'block';
				elements.displayarea.style.display = 'none';
				elements.historyToggle.style.display = 'none';
			}

			elements.menuItems.forEach(i => i.classList.remove('active'));
			item.classList.add('active');
			elements.calculator.setAttribute('data-type', type);

			switch (type) {
				case 'standard':
					elements.calculatorType.textContent = 'Standart';
					displayKeyboardByName(type);
					break;
				case 'scientific':
					elements.calculatorType.textContent = 'Bilimsel';
					displayKeyboardByName(type);
					document.querySelectorAll('.scientific-keypad button').forEach(button => {
						button.style.fontSize = '14px';
						button.style.padding = '10px 5px';
					});
					break;
				case 'volume':
				case 'length':
				case 'weight':
				case 'temperature':
				case 'energy':
				case 'region':
				case 'speed':
				case 'time':
				case 'power':
				case 'data':
				case 'pressure':
				case 'angle':
				case 'money':
					displayKeyboardByName(type);
					elements.calculatorType.textContent = ' ';
					elements.calcSideHeader.textContent = type === 'money' ? item.textContent : `${item.textContent} Birimi`;
					elements.calcSideBar.style.display = 'block';
					document.getElementById(type + 'Area').style.display = 'block';
					elements.calculator.style.borderRadius = '0 6px 6px 0';
					elements.displayarea.style.display = 'none';
					break;
				case 'date':
					displayKeyboardByName(type);
					elements.calculatorType.textContent = 'Tarih Hesaplama';
					elements.calcSideBar.style.display = 'none';
					elements.displayarea.style.display = 'none';
					break;
				case 'graphic':
					displayKeyboardByName(type);
					elements.calculatorType.textContent = 'Grafik Oluşturma';
					elements.calcSideBar.style.display = 'none';
					elements.displayarea.style.display = 'none';
					break;
				case 'programmer':
					displayKeyboardByName(type);
					elements.calculatorType.textContent = 'Programlayıcı';
					currentMode = 'programmer';
					elements.calcSideBar.style.display = 'none';
					elements.displayarea.style.display = 'none';
					break;
			}
			toggleMenu();
		});
	});

	elements.themeToggle.addEventListener('click', () => {
		document.body.classList.toggle('dark-theme');
		localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : '');
	});

	elements.historyToggle.addEventListener('click', () => {
		historyPanel.classList.toggle('open');
	});

	closeHistoryButton.addEventListener('click', () => {
		historyPanel.classList.remove('open');
		historyBtn.classList.add('active');
	});

	historyBtn.addEventListener('click', () => {
		historyBtn.classList.add('active');
	});

	clearHistoryButton.addEventListener('click', clearHistory);

	document.getElementById('graph-toggle').addEventListener('click', () => {
		document.getElementById('settingsPanel').style.display = 'flex';
	});

	document.getElementById('closeModal').addEventListener('click', () => {
		document.getElementById('settingsPanel').style.display = 'none';
	});

	window.addEventListener('click', (event) => {
		if (event.target == document.getElementById('settingsPanel')) {
			document.getElementById('settingsPanel').style.display = 'none';
		}
	});

	document.querySelectorAll('.resultconverters').forEach(div => {
		div.addEventListener('click', function () {
			currentDivId = this.id;
			currentInput = this.innerText;
			document.querySelectorAll('.resultconverters').forEach(d => {
				d.style.fontWeight = '100';
			});
			this.style.fontWeight = '550';
		});
	});

	elements.keypads.standard.addEventListener('click', (event) => {
		const { target } = event;
		if (!target.matches('button')) return;
	
		if (target.classList.contains('operator')) {
			handleOperator(target.textContent);
		} else if (target.classList.contains('decimal')) {
			inputDecimal();
		} else if (target.classList.contains('clear')) {
			resetCalculator();
		} else if (target.classList.contains('clear-entry')) {
			currentInput = '0';
			updateDisplay();
		} else if (target.classList.contains('backspace')) {
			backspace();
		} else if (target.classList.contains('negate')) {
			negate();
		} else if (target.classList.contains('equals')) {
			if (currentOperator && result !== null) {
				const inputValue = parseFloat(currentInput);
				elements.history.textContent = `${result} ${currentOperator} ${inputValue} =`;
				result = window.calculatorUtils.performCalculation(result, inputValue, currentOperator);
				currentInput = result.toString();
				addToHistory(lastOperation.firstValue, lastOperation.operator, inputValue, result);
				lastOperation = null; // Son işlemi sıfırla
				currentOperator = null;
				shouldResetScreen = true;
				updateDisplay();
			}
		} else {
			inputDigit(target.textContent);
		}
	});

	elements.keypads.scientific.addEventListener('click', (event) => {
		const {
			target
		} = event;
		if (!target.matches('button')) return;

		const action = target.dataset.action;
		if (target.classList.contains('function')) {
			scientificCalculate(action);
		} else if (target.classList.contains('memory')) {
			handleMemory(action);
		} else if (action === 'deg-rad') {
			toggleDegRad();
		} else if (target.classList.contains('constant')) {
			if (action === 'pi') {
				currentInput = Math.PI.toString();
			} else if (action === 'e') {
				currentInput = Math.E.toString();
			}
			updateDisplay();
		} else if (target.classList.contains('digit')) {
			inputDigit(target.textContent);
		} else if (target.classList.contains('decimal')) {
			inputDecimal();
		} else if (target.classList.contains('operator')) {
			handleOperator(target.textContent);
		} else if (target.classList.contains('equals')) {
			if (currentOperator && result !== null) {
				const inputValue = parseFloat(currentInput);
				elements.history.textContent = `${result} ${currentOperator} ${inputValue} =`;
				result = window.calculatorUtils.performCalculation(result, inputValue, currentOperator);
				currentInput = result.toString();
				addToHistory(lastOperation.firstValue, lastOperation.operator, inputValue, result);
				lastOperation = null; // Son işlemi sıfırla
				currentOperator = null;
				shouldResetScreen = true;
				updateDisplay();
			}
		} else if (target.classList.contains('clear')) {
			resetCalculator();
		} else if (target.classList.contains('backspace')) {
			backspace();
		} else if (target.classList.contains('negate')) {
			negate();
		}
	});

	// Generic keypad event listener for converters
	['money', 'volume', 'length', 'weight', 'temperature', 'energy', 'region', 'speed', 'time', 'power', 'data', 'pressure', 'angle'].forEach(type => {
		elements.keypads[type].addEventListener('click', (event) => {
			const {
				target
			} = event;
			if (!target.matches('button')) return;

			if (target.classList.contains('digit')) {
				inputDigit(target.textContent);
			} else if (target.classList.contains('decimal')) {
				inputDecimal();
			} else if (target.classList.contains('clear')) {
				resetCalculator();
			} else if (target.classList.contains('backspace')) {
				backspace();
			} else if (target.classList.contains('clear-entry')) {
				if (type === 'money') {
					handleCurrencyClearEntry();
				} else {
					document.getElementById(`${type}Input`).innerText = '0';
					document.getElementById(`${type}Result`).innerText = '0';
					currentInput = '0';
				}
				currentInput = '0';
			}

			document.getElementById(currentDivId).innerText = currentInput;
			if (type === 'money') {
				calculateCurrency();
			}
			if (currentDivId === `${type}Input`) {
				genericCalculate(type);
			} else if (currentDivId === `${type}Result`) {
				genericReverseCalculate(type);
			}
		});
	});

	// Date calculator event listeners
	document.getElementById('calculate-date-diff')?.addEventListener('click', () => {
		const startDate = document.getElementById('start-date').value;
		const endDate = document.getElementById('end-date').value;
		if (startDate && endDate) {
			const diffDays = calculateDateDifference(startDate, endDate);
			document.getElementById('date-diff-result').textContent = `İki tarih arasında ${diffDays} gün vardır.`;
		} else {
			document.getElementById('date-diff-result').textContent = 'Lütfen her iki tarihi de seçin.';
		}
	});

	document.getElementById('add-days')?.addEventListener('click', () => {
		const baseDate = document.getElementById('base-date').value;
		const daysToAdd = document.getElementById('days-to-add').value;
		if (baseDate && daysToAdd) {
			const resultDate = addDaysToDate(baseDate, daysToAdd);
			document.getElementById('date-add-result').textContent = `Sonuç: ${formatDate(resultDate)}`;
		} else {
			document.getElementById('date-add-result').textContent = 'Lütfen tarih ve gün sayısını girin.';
		}
	});

	document.getElementById('subtract-days')?.addEventListener('click', () => {
		const baseDate = document.getElementById('base-date').value;
		const daysToSubtract = document.getElementById('days-to-add').value;
		if (baseDate && daysToSubtract) {
			const resultDate = addDaysToDate(baseDate, -daysToSubtract);
			document.getElementById('date-add-result').textContent = `Sonuç: ${formatDate(resultDate)}`;
		} else {
			document.getElementById('date-add-result').textContent = 'Lütfen tarih ve gün sayısını girin.';
		}
	});

	// Keyboard support
	document.addEventListener('keydown', (event) => {
		if (event.key === 'F2') {
			toggleMenu();
			return;
		} else if (event.key === 'F8' && (currentMode === 'standard' || currentMode === 'scientific')) {
			historyPanel.classList.toggle('open');
			return;
		} else if (event.key === 'F9') {
			document.body.classList.toggle('dark-theme');
			localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : '');
			return;
		} else if (event.key.includes('F') || event.key.includes('Arrow') || event.key.includes('Shift') || event.key.includes('Control') || event.key.includes('Alt') || event.key.includes('Meta') || event.key.includes('CapsLock') || event.key.includes('Tab') || event.key.includes('Escape') || event.key.includes('Insert') || event.key.includes('Delete') || event.key.includes('Home') || event.key.includes('End') || event.key.includes('PageUp') || event.key.includes('PageDown') || event.key.includes('PrintScreen') || event.key.includes('ScrollLock') || event.key.includes('Pause') || event.key.includes('ContextMenu')) {
			return;
		}

		const key = event.key;

		if (currentMode === 'standard' || currentMode === 'scientific') {
			if (/[0-9]/.test(key)) {
				inputDigit(key);
			} else if (key === '.') {
				inputDecimal();
			} else if (['+', '-', '*', '/'].includes(key)) {
				handleOperator(key === '*' ? '×' : key === '/' ? '÷' : key);
			} else if (key === 'Enter' || key === '=') {
				if (currentOperator && result !== null) {
					const inputValue = parseFloat(currentInput);
					elements.history.textContent = `${result} ${currentOperator} ${inputValue} =`;
					result = performCalculation(result, inputValue, currentOperator);
					currentInput = result.toString();
					currentOperator = null;
					shouldResetScreen = true;
					updateDisplay();
				}
			} else if (key === 'Backspace') {
				backspace();
			} else if (key === 'Escape') {
				resetCalculator();
			}
		} else {
			const converterTypes = ['money', 'volume', 'length', 'weight', 'temperature', 'energy', 'region', 'speed', 'time', 'power', 'data', 'pressure', 'angle'];
			if (converterTypes.includes(currentMode)) {
				if (/[0-9]/.test(key)) {
					inputDigit(key);
				} else if (key === '.') {
					inputDecimal();
				} else if (key === 'Backspace') {
					backspace();
				} else if (key === 'Escape') {
					document.getElementById(`${currentMode}Input`).innerText = '0';
					document.getElementById(`${currentMode}Result`).innerText = '0';
					currentInput = '0';
				}
				document.getElementById(currentDivId).innerText = currentInput;
				if (currentDivId === `${currentMode}Input`) {
					genericCalculate(currentMode);
				} else if (currentDivId === `${currentMode}Result`) {
					genericReverseCalculate(currentMode);
				}
			} else if (currentMode === 'programmer') {
				if (/[0-9A-Fa-f]/.test(key)) {
					appendNumber(key.toUpperCase());
				}
			}
		}
	});

	// Currency conversion specific logic
	const convertPrice = document.getElementById('convertPrice');
	const convertedPrice = document.getElementById('convertedPrice');

	convertPrice.addEventListener('change', calculateCurrency);
	convertedPrice.addEventListener('change', reverseCalculateCurrency);

	// Converter select elements event listeners
	['Volume', 'Length', 'Weight', 'Temperature', 'Energy', 'Region', 'Speed', 'Time', 'Power', 'Data', 'Pressure', 'Angle'].forEach(type => {
		const fromUnit = document.getElementById(`fromUnit${type}`);
		const toUnit = document.getElementById(`toUnit${type}`);

		fromUnit?.addEventListener('change', () => genericCalculate(type.toLowerCase()));
		toUnit?.addEventListener('change', () => genericCalculate(type.toLowerCase()));
	});

	// Programmer calculator functions
	function appendNumber(num) {
		const display = document.getElementById('display');
		if (display.innerText === '0') {
			display.innerText = num;
		} else {
			display.innerText += num;
		}
		updateBases();
	}

	function updateBases() {
		const decValue = parseInt(document.getElementById('display').innerText, 16);
		document.getElementById('hexValue').innerText = decValue.toString(16).toUpperCase();
		document.getElementById('decValue').innerText = decValue.toString(10);
		document.getElementById('octValue').innerText = decValue.toString(8);
		document.getElementById('binValue').innerText = decValue.toString(2).padStart(16, '0');
	}

	function handleCurrencyClearEntry() {
		const currencyConvert = document.getElementById('currencyConvert');
		currencyConvert.value = '0';

		const currencyConverted = document.getElementById('currencyConverted');
		currencyConverted.value = '0';
		calculateCurrency();
	}

	function handleCurrencyBackspace() {
		const convertPrice = document.getElementById('convertPrice');
		if (convertPrice.value.length > 0) {
			convertPrice.value = convertPrice.value.slice(0, -1);
			if (convertPrice.value === '') {
				convertPrice.value = '0';
			}
			calculateCurrency();
		}
	}

	const currencySymbols = {
		'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'TRY': '₺',
		'CAD': '$', 'AUD': '$', 'NZD': '$', 'CHF': '₣', 'CNY': '¥', 'INR': '₹'
	};

	function updateCurrencySymbol(elementId, symbolId) {
		const element = document.getElementById(elementId);
		const symbolElement = document.getElementById(symbolId);
		const selectedCurrency = element.value;
		symbolElement.textContent = currencySymbols[selectedCurrency] || selectedCurrency;
	}

	function handleCurrencyChange(event) {
		const isConvertPrice = event.target.id === 'convertPrice';
		updateCurrencySymbol(
			isConvertPrice ? 'convertPrice' : 'convertedPrice',
			isConvertPrice ? 'currencySymbolConvert' : 'currencySymbolConverted'
		);
		isConvertPrice ? calculateCurrency() : reverseCalculateCurrency();
	}

	document.getElementById('convertPrice').addEventListener('change', handleCurrencyChange);
	document.getElementById('convertedPrice').addEventListener('change', handleCurrencyChange);

	document.addEventListener('keydown', (event) => {
		if (currentMode === 'money' && event.key === 'Backspace') {
			handleCurrencyBackspace();
		}
	});

	// Initialize the calculator
	resetCalculator();
});