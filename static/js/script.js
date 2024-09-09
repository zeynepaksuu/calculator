document.addEventListener('DOMContentLoaded', () =>
{

    let currentDivId = null;

    const calculator = document.querySelector('.calculator');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const calculatorType = document.querySelector('.calculator-type');
    const calculatorSideBar = document.getElementById('calculatorSideBar');
    const themeToggle = document.getElementById('theme-toggle');
    const graphToggle = document.getElementById('graph-toggle');
    const calcSideBar = document.querySelector('.calculator-sidebar');
    const calcSideHeader = document.getElementById('calcSideBarHeader');
    const displayarea = document.querySelector('.display');
    const display = document.querySelector('.result');
    const history = document.querySelector('.history');
    const standardKeypad = document.querySelector('.standard-keypad');
    const moneyKeypad = document.querySelector('.money-keypad');
    const scientificKeypad = document.querySelector('.scientific-keypad');
    const volumeKeypad = document.querySelector('.volume-keypad');
    const lengthKeypad = document.querySelector('.length-keypad');
    const weightKeypad = document.querySelector('.weight-keypad');
    const temperatureKeypad = document.querySelector('.temperature-keypad');
    const energyKeypad = document.querySelector('.energy-keypad');
    const regionKeypad = document.querySelector('.region-keypad');
    const speedKeypad = document.querySelector('.speed-keypad');
    const timeKeypad = document.querySelector('.time-keypad');
    const powerKeypad = document.querySelector('.power-keypad');
    const dataKeypad = document.querySelector('.data-keypad');
    const pressureKeypad = document.querySelector('.pressure-keypad');
    const angleKeypad = document.querySelector('.angle-keypad');
    const historyToggle = document.getElementById('history-toggle');
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

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme)
    {
        document.body.classList.add(savedTheme);
    }
    document.body.appendChild(historyPanel);

    const historyList = historyPanel.querySelector('.history-list');
    const clearHistoryButton = historyPanel.querySelector('.clear-history');
    const closeHistoryButton = historyPanel.querySelector('.close-history');

    let calculationHistory = [];

    function addToHistory(firstValue, operation, secondValue, result)
    {
        const historyEntry = `${firstValue} ${operation} ${secondValue} = ${result}`;
        const historyElements = document.getElementsByClassName('history-list');
        if (historyElements.length > 0)
        {
            const historyElement = historyElements[0]; // İlk öğeyi seçiyoruz
            const newEntry = document.createElement('div');
            newEntry.className = 'history-entry'; // Sınıf adı ekliyoruz
            newEntry.textContent = historyEntry;
            historyElement.appendChild(newEntry);
        } else
        {
            console.error('History element not found');
        }
    }

    function clearHistory()
    {
        calculationHistory = [];
        historyList.innerHTML = '';
    }

    historyToggle.addEventListener('click', () =>
    {
        historyPanel.classList.toggle('open');
    });

    closeHistoryButton.addEventListener('click', () =>
    {
        historyPanel.classList.remove('open');
        historyBtn.classList.add('active');
    });

    const historyBtn = historyPanel.querySelector('.history-btn');
    historyBtn.classList.add('active');
    historyBtn.addEventListener('click', () =>
    {
        historyBtn.classList.add('active');
    });

    document.getElementById('graph-toggle').addEventListener('click', function ()
    {
        document.getElementById('settingsPanel').style.display = 'flex';
    });

    document.getElementById('closeModal').addEventListener('click', function ()
    {
        document.getElementById('settingsPanel').style.display = 'none';
    });

    window.addEventListener('click', function (event)
    {
        if (event.target == document.getElementById('settingsPanel'))
        {
            document.getElementById('settingsPanel').style.display = 'none';
        }
    });

    function displayKeyboardByName(name)
    {
        const keyboards = document.querySelectorAll('.keypad');
        keyboards.forEach(keyboard =>
        {
            keyboard.classList.remove('active');
        });
        const keyboard = document.querySelector(`.${name}-keypad`);
        if (keyboard)
        {
            console.log(keyboard);
            keyboard.classList.add('active');
        } else
        {
            console.error(`Klavyeyi bulamadım: ${name}`);
        }
    }


    clearHistoryButton.addEventListener('click', clearHistory);

    let currentInput = '0';
    let previousInput = '';
    let result = null;
    let currentOperator = null;
    let shouldResetScreen = false;
    let memory = 0;
    let isRadianMode = false;
    let currentMode = 'standard';

    function toggleMenu()
    {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    const divs = document.querySelectorAll('.resultconverters');
    divs.forEach(div =>
    {
        div.addEventListener('click', function ()
        {
            currentDivId = this.id;
            currentInput = document.getElementById(currentDivId).innerText;
            divs.forEach(d =>
            {
                d.style.fontWeight = '100';
            });
            this.style.fontWeight = '550';
        });
    });

    menuToggle.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    menuItems.forEach(item =>
    {
        item.addEventListener('click', () =>
        {
            const type = item.dataset.type;
            currentMode = type;

            const areas = document.querySelectorAll('[id$="Area"]');
            areas.forEach(area =>
            {
                area.style.display = 'none';
            });

            if (type === 'standard' || type === 'scientific')
            {
                calculatorSideBar.style.display = 'none';
                displayarea.style.display = 'block';
                historyToggle.style.display = 'block';
            }
            else {
                graphToggle.style.display = 'none';
                if (type === 'graphic')
                {
                    graphToggle.style.display = 'block';
                }
                calculatorSideBar.style.display = 'block';
                displayarea.style.display = 'none';
                historyToggle.style.display = 'none';
            }


            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            calculator.setAttribute('data-type', type);
            if (type === 'standard')
            {
                calculatorType.textContent = 'Standart';
                displayKeyboardByName(type);
                
            }
            else if (type === 'scientific')
            {
                calculatorType.textContent = 'Bilimsel';
                displayKeyboardByName(type);
                
                const scientificButtons = document.querySelectorAll('.scientific-keypad button');
                scientificButtons.forEach(button =>
                {
                    button.style.fontSize = '14px';
                    button.style.padding = '10px 5px';
                });
            }
            else if (type === 'money')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Para Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'volume')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Hacim Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'length')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Uzunluk Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'weight')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Ağırlık ve Kütle Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'temperature')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Sıcaklık Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'energy')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Enerji Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'region')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Bölge Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'speed')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Hız Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'time')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Zaman Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'power')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Güç Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'data')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Veri Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'pressure')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Basınç Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'angle')
            {
                displayKeyboardByName(type);
                calcSideHeader.textContent = 'Açı Birimi';
                
                calcSideBar.style.display = 'block';
                document.getElementById(type + 'Area').style.display = 'block';
                calculator.style.borderRadius = '0 6px 6px 0';
                displayarea.style.display = 'none';
            }
            else if (type === 'date')
            {
                displayKeyboardByName(type);
                calculatorType.textContent = 'Tarih Hesaplama';
                calcSideBar.style.display = 'none';
                displayarea.style.display = 'none';
            }
            else if (type === 'graphic')
            {
                displayKeyboardByName(type);
                calculatorType.textContent = 'Grafik Hesaplama';
                calcSideBar.style.display = 'none';
                displayarea.style.display = 'none';
            }
            else if (type === 'programmer') {
                displayKeyboardByName(type);
                calculatorType.textContent = 'Programcı';
                currentMode = 'programmer';
                calcSideBar.style.display = 'none';
                displayarea.style.display = 'none';
            }
            toggleMenu();
        });
    });

    themeToggle.addEventListener('click', () =>
    {
        document.body.classList.toggle('dark-theme');

        if (document.body.classList.contains('dark-theme'))
        {
            localStorage.setItem('theme', 'dark-theme');
        } else
        {
            localStorage.removeItem('theme');
        }
    });

    function updateDisplay()
    {
        display.textContent = currentInput;
    }

    function inputDigit(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    function inputDecimal()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplay();
    }

    function handleOperator(operator)
    {
        const inputValue = parseFloat(currentInput);

        if (result === null)
        {
            result = inputValue;
        } else if (currentOperator)
        {
            const newResult = performCalculation(result, inputValue, currentOperator);
            addToHistory(result, currentOperator, inputValue, newResult);
            result = newResult;
        }

        shouldResetScreen = true;
        currentOperator = operator;
        history.textContent = `${result} ${currentOperator}`;

        currentInput = result.toString();
        updateDisplay();
    }

    function performCalculation(a, b, operator) {
        let result;


        switch (operator) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '×':
                result = a * b;
                break;
            case '÷':
                result = b !== 0 ? a / b : 'Error';
                break;
            case 'mod':
                result = a % b;
                break;
            case 'xy':
                result = Math.pow(a, b);
                break;
            case 'logyx':
                result = Math.log(a) / Math.log(b);
                break;
            case 'y√x':
                result = Math.pow(b, 1 / a);
                break;
            default:
                result = b;
                break;
        }
        addToHistory(a, operator, b, result);
        return result;
    }
    function resetCalculator()
    {
        currentInput = '0';
        previousInput = '';
        result = null;
        currentOperator = null;
        shouldResetScreen = false;
        history.textContent = '';
        updateDisplay();
    }

    function backspace()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplay();
    }

    function negate()
    {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }

    function twond(twoNdActive)
    {
        if (twoNdActive)
        {
            document.getElementById('square').style.display = 'none';
            document.getElementById('2nd-square').style.display = 'block';

            document.getElementById('square-root').style.display = 'none';
            document.getElementById('2nd-square-root').style.display = 'block';

            document.getElementById('power').style.display = 'none';
            document.getElementById('2nd-power').style.display = 'block';

            document.getElementById('ten-power').style.display = 'none';
            document.getElementById('2nd-ten-power').style.display = 'block';

            document.getElementById('log').style.display = 'none';
            document.getElementById('2nd-log').style.display = 'block';

            document.getElementById('ln').style.display = 'none';
            document.getElementById('2nd-ln').style.display = 'block';
        }
        else {
            document.getElementById('square').style.display = 'block';
            document.getElementById('2nd-square').style.display = 'none';

            document.getElementById('square-root').style.display = 'block';
            document.getElementById('2nd-square-root').style.display = 'none';

            document.getElementById('power').style.display = 'block';
            document.getElementById('2nd-power').style.display = 'none';

            document.getElementById('ten-power').style.display = 'block';
            document.getElementById('2nd-ten-power').style.display = 'none';

            document.getElementById('log').style.display = 'block';
            document.getElementById('2nd-log').style.display = 'none';

            document.getElementById('ln').style.display = 'block';
            document.getElementById('2nd-ln').style.display = 'none';
        }
    }

    let twoNdActive = false;

    function scientificCalculate(action)
    {
        const currentValue = parseFloat(currentInput);
        let newResult;
        let secondValue = '';
        
        switch (action)
        {
            case 'second':
                twoNdActive = !twoNdActive;
                if (twoNdActive)
                {
                    document.getElementById('second').style.setProperty('background-color', '#47B1E8', 'important');
                    twond(twoNdActive);
                } else
                {
                    document.getElementById('second').style.setProperty('background-color', '#323232', 'important');
                    twond(twoNdActive);
                }
                return;
                break;
            case 'square':
                newResult = Math.pow(currentValue, 2);
                secondValue = '2';
                break;
            case '2nd-square':
                newResult = Math.pow(currentValue, 3);
                secondValue = '3';
                break;
            case 'square-root':
                newResult = Math.sqrt(currentValue);
                secondValue = '√';
                break;
            case '2nd-square-root':
                newResult = Math.cbrt(currentValue);
                secondValue = '³√';
                break;
            case 'cube-root':
                newResult = Math.cbrt(currentValue);
                secondValue = '∛';
                break;
            case 'factorial':
                newResult = factorial(currentValue);
                secondValue = '!';
                break;
            case 'sin':
                newResult = isRadianMode ? Math.sin(currentValue) : Math.sin(degToRad(currentValue));
                secondValue = 'sin';
                break;
            case 'cos':
                newResult = isRadianMode ? Math.cos(currentValue) : Math.cos(degToRad(currentValue));
                secondValue = 'cos';
                break;
            case 'tan':
                newResult = isRadianMode ? Math.tan(currentValue) : Math.tan(degToRad(currentValue));
                secondValue = 'tan';
                break;
            case 'log':
                newResult = Math.log10(currentValue);
                secondValue = 'log';
                break;
            case 'ln':
                newResult = Math.log(currentValue);
                secondValue = 'ln';
                break;
            case '2nd-ln':
                newResult = Math.exp(currentValue); // e^x işlemi
                secondValue = 'e^';
                break;
            case 'pow-e':
                newResult = Math.exp(currentValue);
                secondValue = 'e^';
                break;
            case 'abs':
                newResult = Math.abs(currentValue);
                secondValue = '| |'; // Mutlak değer işlemi için ikinci değer
                break;
            case 'inverse':
                newResult = 1 / currentValue;
                secondValue = '1/'; // Ters alma işlemi için ikinci değer
                break;
            case 'exp':
                newResult = Math.exp(currentValue);
                secondValue = 'exp'; // Üstel fonksiyon işlemi için ikinci değer
                break;
            case 'ten-power':
                newResult = Math.pow(10, currentValue);
                secondValue = '10^'; // 10 üzeri işlemi için ikinci değer
                break;
            case '2nd-ten-power':
                newResult = Math.pow(2, currentValue);
                secondValue = '2^';
                break;
            default:
                console.error('Geçersiz işlem');
                return;
        }
        addToHistory(currentValue, action, secondValue, newResult);
        currentInput = newResult.toString();
        shouldResetScreen = true;
        updateDisplay();
    }

    function factorial(n)
    {
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    }

    function degToRad(degrees)
    {
        return degrees * (Math.PI / 180);
    }

    function radToDeg(radians)
    {
        return radians * (180 / Math.PI);
    }

    function handleMemory(action)
    {
        let secondValue = '';
        switch (action)
        {
            case 'mc':
                memory = 0;
                secondValue = 'C';
                break;
            case 'mr':
                currentInput = memory.toString();
                secondValue = 'R';
                break;
            case 'm-plus':
                memory += parseFloat(currentInput);
                secondValue = '+';
                break;
            case 'm-minus':
                memory -= parseFloat(currentInput);
                secondValue = '-';
                break;
            case 'ms':
                memory = parseFloat(currentInput);
                secondValue = 'S';
                break;
        }
        addToHistory(currentInput, action, '', memory);
        shouldResetScreen = true;
        updateDisplay();
    }

    function toggleDegRad()
    {
        isRadianMode = !isRadianMode;
        const degRadButton = document.querySelector('[data-action="deg-rad"]');
        degRadButton.textContent = isRadianMode ? 'Rad' : 'Deg';
    }

    standardKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('operator'))
        {
            handleOperator(target.textContent);
        } else if (target.classList.contains('decimal'))
        {
            inputDecimal();
        } else if (target.classList.contains('clear'))
        {
            resetCalculator();
        } else if (target.classList.contains('clear-entry'))
        {
            currentInput = '0';
            updateDisplay();
        } else if (target.classList.contains('backspace'))
        {
            backspace();
        } else if (target.classList.contains('negate'))
        {
            negate();
        } else if (target.classList.contains('equals'))
        {
            if (currentOperator && result !== null)
            {
                const inputValue = parseFloat(currentInput);
                history.textContent = `${result} ${currentOperator} ${inputValue} =`;
                result = performCalculation(result, inputValue, currentOperator);
                currentInput = result.toString();
                currentOperator = null;
                shouldResetScreen = true;
                updateDisplay();
            }
        } else
        {
            inputDigit(target.textContent);
        }
    });

    moneyKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitMoney(target.textContent);
        } else if (target.classList.contains('decimal'))
        {
            inputDecimalMoney();
        } else if (target.classList.contains('clear'))
        {
            resetCalculatorMoney();
        } else if (target.classList.contains('backspace'))
        {
            backspaceMoney();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryMoney();
        }

        calculateCurrency();
    });

    volumeKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitVolume(target.textContent);
        } else if (target.classList.contains('decimal'))
        {
            inputDecimalVolume();
        } else if (target.classList.contains('clear'))
        {
            resetCalculatorVolume();
        } else if (target.classList.contains('backspace'))
        {
            backspaceVolume();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryVolume();
        }

    });

    lengthKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitLength(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalLength();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorLength();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceLength();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryLength();
        }

    });

    weightKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitWeight(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalWeight();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorWeight();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceWeight();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryWeight();
        }
    });

    temperatureKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitTemperature(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalTemperature();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorTemperature();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceTemperature();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryTemperature();
        }
    });

    energyKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitEnergy(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalEnergy();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorEnergy();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceEnergy();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryEnergy();
        }
    });

    regionKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitRegion(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalRegion();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorRegion();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceRegion();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryRegion();
        }
    });

    speedKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitSpeed(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalSpeed();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorSpeed();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceSpeed();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntrySpeed();
        }
    });

    timeKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitTime(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalTime();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorTime();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceTime();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryTime();
        }
    });

    powerKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitPower(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalPower();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorPower();
        }
        else if (target.classList.contains('backspace'))
        {
            backspacePower();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryPower();
        }
    });

    dataKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitData(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalData();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorData();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceData();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryData();
        }
    });

    pressureKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitPressure(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalPressure();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorPressure();
        }
        else if (target.classList.contains('backspace'))
        {
            backspacePressure();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryPressure();
        }
    });

    angleKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;

        if (!target.matches('button')) return;

        if (target.classList.contains('digit'))
        {
            inputDigitAngle(target.textContent);
        }
        else if (target.classList.contains('decimal'))
        {
            inputDecimalAngle();
        }
        else if (target.classList.contains('clear'))
        {
            resetCalculatorAngle();
        }
        else if (target.classList.contains('backspace'))
        {
            backspaceAngle();
        }
        else if (target.classList.contains('clear-entry'))
        {
            clearEntryAngle();
        }
    });

    
    scientificKeypad.addEventListener('click', (event) =>
    {
        const { target } = event;
        if (!target.matches('button')) return;
    
        const action = target.dataset.action;
        console.log(action);
        if (target.classList.contains('function'))
        {
            scientificCalculate(action);
        } else if (target.classList.contains('memory'))
        {
            handleMemory(action);
        } else if (action === 'deg-rad')
        {
            toggleDegRad();
        } else if (target.classList.contains('constant'))
        {
            if (action === 'pi')
            {
                currentInput = Math.PI.toString();
            } else if (action === 'e')
            {
                currentInput = Math.E.toString();
            }
            updateDisplay();
        } else if (target.classList.contains('digit'))
        {
            inputDigit(target.textContent);
        } else if (target.classList.contains('decimal'))
        {
            inputDecimal();
        } else if (target.classList.contains('operator'))
        {
            handleOperator(target.textContent);
        } else if (target.classList.contains('equals'))
        {
            if (currentOperator && result !== null)
            {
                const inputValue = parseFloat(currentInput);
                history.textContent = `${result} ${currentOperator} ${inputValue} =`;
                result = performCalculation(result, inputValue, currentOperator);
                currentInput = result.toString();
                currentOperator = null;
                shouldResetScreen = true;
                updateDisplay();
            }
        } else if (target.classList.contains('clear'))
        {
            resetCalculator();
        } else if (target.classList.contains('backspace'))
        {
            backspace();
        } else if (target.classList.contains('negate'))
        {
            negate();
        } 
    
    });


    // Tarih hesaplama fonksiyonları
    function calculateDateDifference(startDate, endDate)
    {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }



    function addDaysToDate(baseDate, days)
    {
        const result = new Date(baseDate);
        result.setDate(result.getDate() + parseInt(days));
        return result;
    }

    function formatDate(date)
    {
        return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    document.getElementById('calculate-date-diff')?.addEventListener('click', () =>
    {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        if (startDate && endDate)
        {
            const diffDays = calculateDateDifference(startDate, endDate);
            document.getElementById('date-diff-result').textContent = `İki tarih arasında ${diffDays} gün vardır.`;
        } else
        {
            document.getElementById('date-diff-result').textContent = 'Lütfen her iki tarihi de seçin.';
        }
    });

    document.getElementById('add-days')?.addEventListener('click', () =>
    {
        const baseDate = document.getElementById('base-date').value;
        const daysToAdd = document.getElementById('days-to-add').value;
        if (baseDate && daysToAdd)
        {
            const resultDate = addDaysToDate(baseDate, daysToAdd);
            document.getElementById('date-add-result').textContent = `Sonuç: ${formatDate(resultDate)}`;
        } else
        {
            document.getElementById('date-add-result').textContent = 'Lütfen tarih ve gün sayısını girin.';
        }
    });

    document.getElementById('subtract-days')?.addEventListener('click', () =>
    {
        const baseDate = document.getElementById('base-date').value;
        const daysToSubtract = document.getElementById('days-to-add').value;
        if (baseDate && daysToSubtract)
        {
            const resultDate = addDaysToDate(baseDate, -daysToSubtract);
            document.getElementById('date-add-result').textContent = `Sonuç: ${formatDate(resultDate)}`;
        } else
        {
            document.getElementById('date-add-result').textContent = 'Lütfen tarih ve gün sayısını girin.';
        }
    });

    // Klavye desteği
    document.addEventListener('keydown', (event) =>
    {
        if (event.key === 'F2')
        {
            toggleMenu();
            return;
        }
        else if (event.key === 'F8' && (currentMode === 'standard' || currentMode === 'scientific'))
        {
            historyPanel.classList.toggle('open');
            return;
        }
        else if (event.key === 'F9')
        {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme'))
            {
                localStorage.setItem('theme', 'dark-theme');
            } else
            {
                localStorage.removeItem('theme');
            }
            return;
        }
        else if (event.key.includes('F') || event.key.includes('Arrow') || event.key.includes('Shift') || event.key.includes('Control') || event.key.includes('Alt') || event.key.includes('Meta') || event.key.includes('CapsLock') || event.key.includes('Tab') || event.key.includes('Escape') || event.key.includes('Insert') || event.key.includes('Delete') || event.key.includes('Home') || event.key.includes('End') || event.key.includes('PageUp') || event.key.includes('PageDown') || event.key.includes('PrintScreen') || event.key.includes('ScrollLock') || event.key.includes('Pause') || event.key.includes('ContextMenu')
                  || event.key.includes('Shift') || event.key.includes('Tab') || event.key.includes('Escape') || event.key.includes('Insert') || event.key.includes('Delete'))
        {
            return;
        }


        if (currentMode === 'standard')
        {
            const key = event.key;

            if (/[0-9]/.test(key))
            {
                inputDigit(key);
            } else if (key === '.')
            {
                inputDecimal();
            } else if (['+', '-', '*', '/'].includes(key))
            {
                handleOperator(key === '*' ? '×' : key === '/' ? '÷' : key);
            } else if (key === 'Enter' || key === '=')
            {
                if (currentOperator && result !== null)
                {
                    const inputValue = parseFloat(currentInput);
                    history.textContent = `${result} ${currentOperator} ${inputValue} =`;
                    result = performCalculation(result, inputValue, currentOperator);
                    currentInput = result.toString();
                    currentOperator = null;
                    shouldResetScreen = true;
                    updateDisplay();
                }
            } else if (key === 'Backspace')
            {
                backspace();
            } else if (key === 'Escape')
            {
                resetCalculator();
            }
        }
        else if (currentMode === 'money')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitMoney(key);
            } else if (key === '.')
            {
                inputDecimalMoney();
            } else if (key === 'Backspace')
            {
                backspaceMoney();
            } else if (key === 'Escape')
            {
                resetCalculatorMoney();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'currenyConvert')
            {
                calculateCurrency();
            } else if (currentDivId === 'currencyConverted')
            {
                reverseCalculateCurrency();
            }

        }
        else if (currentMode === 'volume')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitVolume(key);
            } else if (key === '.')
            {
                inputDecimalVolume();
            } else if (key === 'Backspace')
            {
                backspaceVolume();
            } else if (key === 'Escape')
            {
                resetCalculatorVolume();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'volumeInput')
            {
                calculateVolume();
            }
            else if (currentDivId === 'volumeResult')
            {
                reverseCalculateVolume();
            }
        }
        else if (currentMode === 'length')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitLength(key);
            } else if (key === '.')
            {
                inputDecimalLength();
            } else if (key === 'Backspace')
            {
                backspaceLength();
            } else if (key === 'Escape')
            {
                resetCalculatorLength();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'lengthInput')
            {
                calculateLength();
            }
            else if (currentDivId === 'lengthResult')
            {
                reverseCalculateLength();
            }
        }
        else if (currentMode === 'weight')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitWeight(key);
            } else if (key === '.')
            {
                inputDecimalWeight();
            } else if (key === 'Backspace')
            {
                backspaceWeight();
            } else if (key === 'Escape')
            {
                resetCalculatorWeight();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'weightInput')
            {
                calculateWeight();
            }
            else if (currentDivId === 'weightResult')
            {
                reverseCalculateWeight();
            }
        }
        else if (currentMode === 'temperature')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitTemperature(key);
            } else if (key === '.')
            {
                inputDecimalTemperature();
            } else if (key === 'Backspace')
            {
                backspaceTemperature();
            } else if (key === 'Escape')
            {
                resetCalculatorTemperature();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'temperatureInput')
            {
                calculateTemperature();
            }
            else if (currentDivId === 'temperatureResult')
            {
                reverseCalculateTemperature();
            }
        }
        else if (currentMode === 'energy')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitEnergy(key);
            } else if (key === '.')
            {
                inputDecimalEnergy();
            } else if (key === 'Backspace')
            {
                backspaceEnergy();
            } else if (key === 'Escape')
            {
                resetCalculatorEnergy();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'energyInput')
            {
                calculateEnergy();
            }
            else if (currentDivId === 'energyResult')
            {
                reverseCalculateEnergy();
            }
        }
        else if (currentMode === 'region')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitRegion(key);
            } else if (key === '.')
            {
                inputDecimalRegion();
            } else if (key === 'Backspace')
            {
                backspaceRegion();
            } else if (key === 'Escape')
            {
                resetCalculatorRegion();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'regionInput')
            {
                calculateRegion();
            }
            else if (currentDivId === 'regionResult')
            {
                reverseCalculateRegion();
            }
        }
        else if (currentMode === 'speed')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitSpeed(key);
            } else if (key === '.')
            {
                inputDecimalSpeed();
            } else if (key === 'Backspace')
            {
                backspaceSpeed();
            } else if (key === 'Escape')
            {
                resetCalculatorSpeed();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'speedInput')
            {
                calculateSpeed();
            }
            else if (currentDivId === 'speedResult')
            {
                reverseCalculateSpeed();
            }
        }
        else if (currentMode === 'time')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitTime(key);
            } else if (key === '.')
            {
                inputDecimalTime();
            } else if (key === 'Backspace')
            {
                backspaceTime();
            } else if (key === 'Escape')
            {
                resetCalculatorTime();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'timeInput')
            {
                calculateTime();
            }
            else if (currentDivId === 'timeResult')
            {
                reverseCalculateTime();
            }
        }
        else if (currentMode === 'power')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitPower(key);
            } else if (key === '.')
            {
                inputDecimalPower();
            } else if (key === 'Backspace')
            {
                backspacePower();
            } else if (key === 'Escape')
            {
                resetCalculatorPower();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'powerInput')
            {
                calculatePower();
            }
            else if (currentDivId === 'powerResult')
            {
                reverseCalculatePower();
            }
        }
        else if (currentMode === 'data')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitData(key);
            } else if (key === '.')
            {
                inputDecimalData();
            } else if (key === 'Backspace')
            {
                backspaceData();
            } else if (key === 'Escape')
            {
                resetCalculatorData();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'dataInput')
            {
                calculateData();
            }
            else if (currentDivId === 'dataResult')
            {
                reverseCalculateData();
            }
        }
        else if (currentMode === 'pressure')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitPressure(key);
            } else if (key === '.')
            {
                inputDecimalPressure();
            } else if (key === 'Backspace')
            {
                backspacePressure();
            } else if (key === 'Escape')
            {
                resetCalculatorPressure();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'pressureInput')
            {
                calculatePressure();
            }
            else if (currentDivId === 'pressureResult')
            {
                reverseCalculatePressure();
            }
        }
        else if (currentMode === 'angle')
        {
            const key = event.key;
            if (/[0-9]/.test(key))
            {
                inputDigitAngle(key);
            } else if (key === '.')
            {
                inputDecimalAngle();
            } else if (key === 'Backspace')
            {
                backspaceAngle();
            } else if (key === 'Escape')
            {
                resetCalculatorAngle();
            }
            document.getElementById(currentDivId).innerText = currentInput;
            if (currentDivId === 'angleInput')
            {
                calculateAngle();
            }
            else if (currentDivId === 'angleResult')
            {
                reverseCalculateAngle();
            }
        }
        else if (currentMode === 'programmer')
        {
            const key = event.key;

            if (/[0-9]/.test(key))
            {
                appendNumber(key.toString()); 
            }  
        }

    });

    /* Money Calculator */
    function inputDigitMoney(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayMoney();
    }

    function updateDisplayMoney()
    {
        document.getElementById(currentDivId).innerText = currentInput;

        if (currentDivId === 'currenyConvert')
        {
            calculateCurrency();
        } else if (currentDivId === 'currencyConverted')
        {
            reverseCalculateCurrency();
        }
    }

    function inputDecimalMoney()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayMoney();
    }

    function backspaceMoney()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayMoney();
    }

    function resetCalculatorMoney()
    {
        currentInput = '0';
        previousInput = '';
        result = null;
        currentOperator = null;
        shouldResetScreen = false;
        history.textContent = '';
        updateDisplayMoney();
    }

    function clearEntryMoney()
    {
        document.getElementById("currenyConvert").innerText = '0';
        document.getElementById("currencyConverted").innerText = '0';
        currentInput = '0';

    }

    async function fetchExchangeRates(baseCurrency)
    {
        try
        {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            if (!response.ok)
            {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            return data.rates;
        } catch (error)
        {
            console.error('Fetch error:', error);
            return {};
        }
    }

    async function calculateCurrency()
    {
        const currencyConvertElement = document.getElementById("convertPrice");
        const currencyConvertedElement = document.getElementById("convertedPrice");
        const currencyConvert = currencyConvertElement.value;
        const currencyConverted = currencyConvertedElement.value;

        const currencyValue = parseFloat(document.getElementById(currentDivId).innerText);
        const rates = await fetchExchangeRates(currencyConvert);
        const conversionRate = rates[currencyConverted];

        if (!conversionRate)
        {
            console.error(`Conversion rate for ${currencyConverted} not found.`);
            return;
        }

        const result = currencyValue * conversionRate;
        document.getElementById("currencyConverted").innerText = result.toFixed(2);
    }

    async function reverseCalculateCurrency()
    {
        const currencyConvertElement = document.getElementById("convertPrice");
        const currencyConvertedElement = document.getElementById("convertedPrice");
        const currencyConvert = currencyConvertElement.value;
        const currencyConverted = currencyConvertedElement.value;

        const currencyValue = parseFloat(document.getElementById("currencyConverted").innerText);
        const rates = await fetchExchangeRates(currencyConvert);
        const conversionRate = rates[currencyConverted];

        if (!conversionRate)
        {
            console.error(`Conversion rate for ${currencyConverted} not found.`);
            return;
        }

        const result = currencyValue / conversionRate;
        document.getElementById("currenyConvert").innerText = result.toFixed(2);
    }

    function updateCalculateMoney()
    {
        if (currentDivId === 'currenyConvert')
        {
            calculateCurrency();
        }
        else if (currentDivId === 'currencyConverted')
        {
            reverseCalculateCurrency();
        }
    }

    const convertPrice = document.getElementById('convertPrice');
    const convertedPrice = document.getElementById('convertedPrice');

    convertPrice.addEventListener('change', updateCalculateMoney);
    convertedPrice.addEventListener('change', updateCalculateMoney);







    /* Volume Calculator */
    const volumeConversionRates = {
        liters: 1,
        milliliters: 0.001,
        cubic_meters: 0.001,
        cubic_centimeters: 0.001,
        gallons: 0.264172,
        quarts: 1.05669,
        pints: 2.11338,
        cups: 4.22675,
        fluid_ounces: 33.814,
        tablespoons: 67.628,
        teaspoons: 202.884
    };


    function inputDigitVolume(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayVolume();
    }

    function updateDisplayVolume()
    {
        document.getElementById(currentDivId).innerText = currentInput;

        if (currentDivId === 'volumeInput')
        {
            calculateVolume();
        }
        else if (currentDivId === 'volumeResult')
        {
            reverseCalculateVolume();
        }
    }

    function inputDecimalVolume()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayMoney();
    }

    function backspaceVolume()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayMoney();
    }

    function resetCalculatorVolume()
    {
        currentInput = '0';
        previousInput = '';
        result = null;
        currentOperator = null;
        shouldResetScreen = false;
        history.textContent = '';
        updateDisplayMoney();
    }

    function calculateVolume()
    {
        const volumeInput = parseFloat(document.getElementById('volumeInput').innerText);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        const fromRate = volumeConversionRates[fromUnit];
        const toRate = volumeConversionRates[toUnit];

        const result = (volumeInput * fromRate) / toRate;
        document.getElementById('volumeResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateVolume()
    {
        const volumeResult = parseFloat(document.getElementById('volumeResult').innerText);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        const fromRate = volumeConversionRates[fromUnit];
        const toRate = volumeConversionRates[toUnit];

        const result = (volumeResult * toRate) / fromRate;
        document.getElementById('volumeInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateVolume()
    {
        if (currentDivId === 'volumeInput')
        {
            calculateVolume();
        }
        else if (currentDivId === 'volumeResult')
        {
            reverseCalculateVolume();
        }
    }

    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    fromUnit.addEventListener('change', updateCalculateVolume);
    toUnit.addEventListener('change', updateCalculateVolume);

    /* Length Calculator */

    

    function inputDigitLength(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayLength();
    }

    function updateDisplayLength()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        console.log(currentDivId);
        if (currentDivId === 'lengthInput')
        {
            calculateLength();
        }
        else if (currentDivId === 'lengthResult')
        {
            reverseCalculateLength();
        }
    }

    function inputDecimalLength()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayLength();
    }

    function backspaceLength()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayLength();
    }

    function clearEntryLength()
    {
        document.getElementById("lengthInput").innerText = '0';
        document.getElementById("lengthResult").innerText = '0';
        currentInput = '0';
    }

    function resetCalculatorLength()
    {
        currentInput = '0';
        previousInput = '';
        result = null;
        currentOperator = null;
        shouldResetScreen = false;
        history.textContent = '';
        updateDisplayLength();
    }
    
    const lengthConversionRates = {
        meters: 1,
        centimeters: 100,
        millimeters: 1000,
        kilometers: 0.001,
        inches: 39.3701,
        feet: 3.28084,
        yards: 1.09361,
        miles: 0.000621371
    };

    function calculateLength()
    {
        const lengthInput = parseFloat(document.getElementById('lengthInput').innerText); // innerText yerine value kullandım
        const fromUnit = document.getElementById('fromUnitLength').value;
        const toUnit = document.getElementById('toUnitLength').value;

        // From birimini önce metreye dönüştür
        const meters = lengthInput / lengthConversionRates[fromUnit];

        // Daha sonra metreyi istenen birime çevir
        const result = meters * lengthConversionRates[toUnit];
        document.getElementById('lengthResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateLength()
    {
        const lengthResult = parseFloat(document.getElementById('lengthResult').innerText); // innerText yerine value kullandım
        const fromUnit = document.getElementById('fromUnitLength').value;
        const toUnit = document.getElementById('toUnitLength').value;

        // To biriminden önce metreye dönüştür
        const meters = lengthResult / lengthConversionRates[toUnit];

        // Daha sonra metreyi istenen birime çevir
        const result = meters * lengthConversionRates[fromUnit];
        document.getElementById('lengthInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateLength()
    {
        if (currentDivId === 'lengthInput')
        {
            calculateLength();
        }
        else if (currentDivId === 'lengthResult')
        {
            reverseCalculateLength();
        }
    }

    const fromUnitLength = document.getElementById('fromUnitLength');
    const toUnitLength = document.getElementById('toUnitLength');

    fromUnitLength.addEventListener('change', updateCalculateLength);
    toUnitLength.addEventListener('change', updateCalculateLength);




    /* Weight and Mass Calculator */

    function  inputDigitWeight(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayWeight();
    }

    function updateDisplayWeight()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'weightInput')
        {
            calculateWeight();
        }
        else if (currentDivId === 'weightResult')
        {
            reverseCalculateWeight();
        }
    }

    function inputDecimalWeight()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayWeight();
    }

    function backspaceWeight()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayWeight();
    }

    function clearEntryWeight()
    {
        document.getElementById("weightInput").innerText = '0';
        document.getElementById("weightResult").innerText = '0';
        currentInput = '0';
    }

    const weightConversionRates = {
        carats: 5000,
        milligrams: 1000000,
        centigrams: 100000,
        decigrams: 10000,
        grams: 1000,
        dekagrams: 100,
        hectograms: 10,
        kilograms: 1,
        metricTons: 0.001,
        ounces: 35.274,
        pounds: 2.20462,
        stones: 0.157473,
        shortTons: 0.00110231,
        longTons: 0.000984207
    };

    function calculateWeight()
    {
        const weightInput = parseFloat(document.getElementById('weightInput').innerText);
        const fromUnit = document.getElementById('fromUnitWeight').value;
        const toUnit = document.getElementById('toUnitWeight').value;

        const fromRate = weightConversionRates[fromUnit];
        const toRate = weightConversionRates[toUnit];

        const result = (weightInput * fromRate) / toRate;
        document.getElementById('weightResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateWeight()
    {
        const weightResult = parseFloat(document.getElementById('weightResult').innerText);
        const fromUnit = document.getElementById('fromUnitWeight').value;
        const toUnit = document.getElementById('toUnitWeight').value;

        const fromRate = weightConversionRates[fromUnit];
        const toRate = weightConversionRates[toUnit];

        const result = (weightResult * toRate) / fromRate;
        document.getElementById('weightInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateWeight()
    {
        if (currentDivId === 'weightInput')
        {
            calculateWeight();
        }
        else if (currentDivId === 'weightResult')
        {
            reverseCalculateWeight();
        }
    }

    const fromUnitWeight = document.getElementById('fromUnitWeight');
    const toUnitWeight = document.getElementById('toUnitWeight');

    fromUnitWeight.addEventListener('change', updateCalculateWeight);
    toUnitWeight.addEventListener('change', updateCalculateWeight);


    /* Temperature Calculator */


    function inputDigitTemperature(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayTemperature();
    }

    function updateDisplayTemperature()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'temperatureInput')
        {
            calculateTemperature();
        }
        else if (currentDivId === 'temperatureResult')
        {
            reverseCalculateTemperature();
        }
    }

    function inputDecimalTemperature()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayTemperature();
    }

    function backspaceTemperature()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayTemperature();
    }

    function clearEntryTemperature()
    {
        document.getElementById("temperatureInput").innerText = '0';
        document.getElementById("temperatureResult").innerText = '0';
        currentInput = '0';
    }

    const temperatureConversionRates = {
        celsius: {
            celsius: 1,
            fahrenheit: 33.8,
            kelvin: 274.15
        },
        fahrenheit: {
            celsius: -17.2222,
            fahrenheit: 1,
            kelvin: 255.928
        },
        kelvin: {
            celsius: -272.15,
            fahrenheit: -457.87,
            kelvin: 1
        }
    };

    function calculateTemperature() {
        const temperatureInput = parseFloat(document.getElementById('temperatureInput').innerText);
        const fromUnit = document.getElementById('fromUnitTemperature').value;
        const toUnit = document.getElementById('toUnitTemperature').value;
    
        let result;
    
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') {
                result = (temperatureInput * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                result = temperatureInput + 273.15;
            } else {
                result = temperatureInput;
            }
        } else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') {
                result = (temperatureInput - 32) * 5/9;
            } else if (toUnit === 'kelvin') {
                result = (temperatureInput - 32) * 5/9 + 273.15;
            } else {
                result = temperatureInput;
            }
        } else if (fromUnit === 'kelvin') {
            if (toUnit === 'celsius') {
                result = temperatureInput - 273.15;
            } else if (toUnit === 'fahrenheit') {
                result = (temperatureInput - 273.15) * 9/5 + 32;
            } else {
                result = temperatureInput;
            }
        }
    
        document.getElementById('temperatureResult').innerText = result.toFixed(5);
    }
    
    function reverseCalculateTemperature() {
        const temperatureResult = parseFloat(document.getElementById('temperatureResult').innerText);
        const fromUnit = document.getElementById('fromUnitTemperature').value;
        const toUnit = document.getElementById('toUnitTemperature').value;
    
        let result;
    
        if (fromUnit === 'celsius') {
            if (toUnit === 'fahrenheit') {
                result = (temperatureResult - 32) * 5/9;
            } else if (toUnit === 'kelvin') {
                result = temperatureResult - 273.15;
            } else {
                result = temperatureResult;
            }
        } else if (fromUnit === 'fahrenheit') {
            if (toUnit === 'celsius') {
                result = (temperatureResult * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                result = (temperatureResult - 273.15) * 9/5 + 32;
            } else {
                result = temperatureResult;
            }
        } else if (fromUnit === 'kelvin') {
            if (toUnit === 'celsius') {
                result = temperatureResult + 273.15;
            } else if (toUnit === 'fahrenheit') {
                result = (temperatureResult - 32) * 5/9 + 273.15;
            } else {
                result = temperatureResult;
            }
        }
    
        document.getElementById('temperatureInput').innerText = result.toFixed(5);
    }
    
    function updateCalculateTemperature() {
        if (currentDivId === 'temperatureInput') {
            calculateTemperature();
        } else if (currentDivId === 'temperatureResult') {
            reverseCalculateTemperature();
        }
    }

    const fromUnitTemperature = document.getElementById('fromUnitTemperature');
    const toUnitTemperature = document.getElementById('toUnitTemperature');

    fromUnitTemperature.addEventListener('change', updateCalculateTemperature);
    toUnitTemperature.addEventListener('change', updateCalculateTemperature);


    /* Energy Calculator */

    const energyConversionRates = {
        joules: 1,
        kilojoules: 1000,
        calories: 0.239006,
        kilocalories: 0.000239006,
        watt_hours: 0.000277778,
        kilowatt_hours: 0.000000277778,
        electronvolts: 6241506480000000000,
        britishThermalUnits: 0.000947817,
        usThermalUnits: 0.000947817,
        footPounds: 0.737562
    };

    function inputDigitEnergy(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayEnergy();
    }

    function updateDisplayEnergy()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'energyInput')
        {
            calculateEnergy();
        }
        else if (currentDivId === 'energyResult')
        {
            reverseCalculateEnergy();
        }
    }

    function inputDecimalEnergy()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayEnergy();
    }

    function backspaceEnergy()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayEnergy();
    }

    function clearEntryEnergy()
    {
        document.getElementById("energyInput").innerText = '0';
        document.getElementById("energyResult").innerText = '0';
        currentInput = '0';
    }

    function calculateEnergy()
    {
        const energyInput = parseFloat(document.getElementById('energyInput').innerText);
        const fromUnit = document.getElementById('fromUnitEnergy').value;
        const toUnit = document.getElementById('toUnitEnergy').value;

        const fromRate = energyConversionRates[fromUnit];
        const toRate = energyConversionRates[toUnit];

        const result = (energyInput * fromRate) / toRate;
        document.getElementById('energyResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateEnergy()
    {
        const energyResult = parseFloat(document.getElementById('energyResult').innerText);
        const fromUnit = document.getElementById('fromUnitEnergy').value;
        const toUnit = document.getElementById('toUnitEnergy').value;

        const fromRate = energyConversionRates[fromUnit];
        const toRate = energyConversionRates[toUnit];

        const result = (energyResult * toRate) / fromRate;
        document.getElementById('energyInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateEnergy()
    {
        if (currentDivId === 'energyInput')
        {
            calculateEnergy();
        }
        else if (currentDivId === 'energyResult')
        {
            reverseCalculateEnergy();
        }
    }

    const fromUnitEnergy = document.getElementById('fromUnitEnergy');
    const toUnitEnergy = document.getElementById('toUnitEnergy');

    fromUnitEnergy.addEventListener('change', updateCalculateEnergy);
    toUnitEnergy.addEventListener('change', updateCalculateEnergy);

    /* Region Calculator */

    const regionConversionRates = {
        square_millimeters: 0.000001,
        square_centimeters: 0.0001,
        square_meters: 1,
        hectares: 10000,
        square_kilometers: 1000000,
        square_inches: 0.00064516,
        square_feet: 0.092903,
        square_yards: 0.836127,
        acres: 4046.86,
        square_miles: 2589988.11
    };


    function inputDigitRegion(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayRegion();
    }

    function updateDisplayRegion()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'regionInput')
        {
            calculateRegion();
        }
        else if (currentDivId === 'regionResult')
        {
            reverseCalculateRegion();
        }
    }

    function inputDecimalRegion()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayRegion();
    }

    function backspaceRegion()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayRegion();
    }

    function clearEntryRegion()
    {
        document.getElementById("regionInput").innerText = '0';
        document.getElementById("regionResult").innerText = '0';
        currentInput = '0';
    }

    function calculateRegion()
    {
        const regionInput = parseFloat(document.getElementById('regionInput').innerText);
        const fromUnit = document.getElementById('fromUnitRegion').value;
        const toUnit = document.getElementById('toUnitRegion').value;

        const fromRate = regionConversionRates[fromUnit];
        const toRate = regionConversionRates[toUnit];

        const result = (regionInput * fromRate) / toRate;
        document.getElementById('regionResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateRegion()
    {
        const regionResult = parseFloat(document.getElementById('regionResult').innerText);
        const fromUnit = document.getElementById('fromUnitRegion').value;
        const toUnit = document.getElementById('toUnitRegion').value;

        const fromRate = regionConversionRates[fromUnit];
        const toRate = regionConversionRates[toUnit];

        const result = (regionResult * toRate) / fromRate;
        document.getElementById('regionInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateRegion()
    {
        if (currentDivId === 'regionInput')
        {
            calculateRegion();
        }
        else if (currentDivId === 'regionResult')
        {
            reverseCalculateRegion();
        }
    }

    const fromUnitRegion = document.getElementById('fromUnitRegion');
    const toUnitRegion = document.getElementById('toUnitRegion');

    fromUnitRegion.addEventListener('change', updateCalculateRegion);
    toUnitRegion.addEventListener('change', updateCalculateRegion);

    /* Speed Calculator */

    const speedConversionRates = {
        centimeters_per_second: 0.01,
        meters_per_second: 1,
        kilometers_per_hour: 3.6,
        kilometers_per_second: 0.001,
        feet_per_second: 3.28084,
        miles_per_hour: 2.23694,
        knots: 1.94384,
        mach: 0.00293858 // Mach 1 at sea level is approximately 343 meters per second
    };

    function inputDigitSpeed(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplaySpeed();
    }

    function updateDisplaySpeed()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'speedInput')
        {
            calculateSpeed();
        }
        else if (currentDivId === 'speedResult')
        {
            reverseCalculateSpeed();
        }
    }

    function inputDecimalSpeed()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplaySpeed();
    }

    function backspaceSpeed()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplaySpeed();
    }

    function clearEntrySpeed()
    {
        document.getElementById("speedInput").innerText = '0';
        document.getElementById("speedResult").innerText = '0';
        currentInput = '0';
    }
    
    function calculateSpeed() {
        const speedInput = parseFloat(document.getElementById('speedInput').innerText);
        const fromUnit = document.getElementById('fromUnitSpeed').value;
        const toUnit = document.getElementById('toUnitSpeed').value;
    
        const fromRate = speedConversionRates[fromUnit];
        const toRate = speedConversionRates[toUnit];
    
        const result = (speedInput * fromRate) / toRate;
        document.getElementById('speedResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }
    
    function reverseCalculateSpeed() {
        const speedResult = parseFloat(document.getElementById('speedResult').innerText);
        const fromUnit = document.getElementById('fromUnitSpeed').value;
        const toUnit = document.getElementById('toUnitSpeed').value;
    
        const fromRate = speedConversionRates[fromUnit];
        const toRate = speedConversionRates[toUnit];
    
        const result = (speedResult * toRate) / fromRate;
        document.getElementById('speedInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateSpeed() {
        if (currentDivId === 'speedInput') {
            calculateSpeed();
        } else if (currentDivId === 'speedResult') {
            reverseCalculateSpeed();
        }
    }

    const fromUnitSpeed = document.getElementById('fromUnitSpeed');
    const toUnitSpeed = document.getElementById('toUnitSpeed');

    fromUnitSpeed.addEventListener('change', updateCalculateSpeed);
    toUnitSpeed.addEventListener('change', updateCalculateSpeed);

    /* Time Calculator */

    const timeConversionRates = {
        microseconds: 1e-6, 
        milliseconds: 1e-3,
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400,
        weeks: 604800,
        years: 31536000
    };

    function inputDigitTime(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayTime();
    }

    function updateDisplayTime()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'timeInput')
        {
            calculateTime();
        }
        else if (currentDivId === 'timeResult')
        {
            reverseCalculateTime();
        }
    }

    function inputDecimalTime()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayTime();
    }

    function backspaceTime()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayTime();
    }

    function clearEntryTime()
    {
        document.getElementById("timeInput").innerText = '0';
        document.getElementById("timeResult").innerText = '0';
        currentInput = '0';
    }

    function calculateTime()
    {
        const timeInput = parseFloat(document.getElementById('timeInput').innerText);
        const fromUnit = document.getElementById('fromUnitTime').value;
        const toUnit = document.getElementById('toUnitTime').value;

        const fromRate = timeConversionRates[fromUnit];
        const toRate = timeConversionRates[toUnit];

        const result = (timeInput * fromRate) / toRate;
        document.getElementById('timeResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculateTime()
    {
        const timeResult = parseFloat(document.getElementById('timeResult').innerText);
        const fromUnit = document.getElementById('fromUnitTime').value;
        const toUnit = document.getElementById('toUnitTime').value;

        const fromRate = timeConversionRates[fromUnit];
        const toRate = timeConversionRates[toUnit];

        const result = (timeResult * toRate) / fromRate;
        document.getElementById('timeInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculateTime()
    {
        if (currentDivId === 'timeInput')
        {
            calculateTime();
        }
        else if (currentDivId === 'timeResult')
        {
            reverseCalculateTime();
        }
    }

    const fromUnitTime = document.getElementById('fromUnitTime');
    const toUnitTime = document.getElementById('toUnitTime');

    fromUnitTime.addEventListener('change', updateCalculateTime);
    toUnitTime.addEventListener('change', updateCalculateTime);

    /* Power Calculator */

    const powerConversionRates = {
        watts: 1,
        kilowatts: 1000,
        horsepower: 745.7,
        foot_pounds_per_minute: 0.022597,
        btu_per_minute: 17.5843
    };

    function inputDigitPower(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayPower();
    }

    function updateDisplayPower()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'powerInput')
        {
            calculatePower();
        }
        else if (currentDivId === 'powerResult')
        {
            reverseCalculatePower();
        }
    }

    function inputDecimalPower()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayPower();
    }

    function backspacePower()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayPower();
    }

    function clearEntryPower()
    {
        document.getElementById("powerInput").innerText = '0';
        document.getElementById("powerResult").innerText = '0';
        currentInput = '0';
    }

    function calculatePower()
    {
        const powerInput = parseFloat(document.getElementById('powerInput').innerText);
        const fromUnit = document.getElementById('fromUnitPower').value;
        const toUnit = document.getElementById('toUnitPower').value;

        const fromRate = powerConversionRates[fromUnit];
        const toRate = powerConversionRates[toUnit];

        const result = (powerInput * fromRate) / toRate;
        document.getElementById('powerResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculatePower()
    {
        const powerResult = parseFloat(document.getElementById('powerResult').innerText);
        const fromUnit = document.getElementById('fromUnitPower').value;
        const toUnit = document.getElementById('toUnitPower').value;

        const fromRate = powerConversionRates[fromUnit];
        const toRate = powerConversionRates[toUnit];

        const result = (powerResult * toRate) / fromRate;
        document.getElementById('powerInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculatePower()
    {
        if (currentDivId === 'powerInput')
        {
            calculatePower();
        }
        else if (currentDivId === 'powerResult')
        {
            reverseCalculatePower();
        }
    }

    const fromUnitPower = document.getElementById('fromUnitPower');
    const toUnitPower = document.getElementById('toUnitPower');

    fromUnitPower.addEventListener('change', updateCalculatePower);
    toUnitPower.addEventListener('change', updateCalculatePower);

    /* Data Calculator */

    const dataConversionRates = {
        bits: 1,
        nibbles: 4,
        bytes: 8,
        kilobits: 1000,
        kibibits: 1024,
        kilobytes: 8000,
        kibibytes: 8192,
        megabits: 1000000,
        mebibits: 1048576,
        megabytes: 8000000,
        mebibytes: 8388608,
        gigabits: 1000000000,
        gibibits: 1073741824,
        gigabytes: 8000000000,
        gibibytes: 8589934592,
        terabits: 1000000000000,
        tebibits: 1099511627776,
        terabytes: 8000000000000,
        tebibytes: 8796093022208,
        petabits: 1000000000000000,
        pebibits: 1125899906842624,
        petabytes: 8000000000000000,
        pebibytes: 9007199254740992,
        exabits: 1000000000000000000,
        exbibits: 1152921504606846976,
        exabytes: 8000000000000000000,
        exbibytes: 9223372036854775808,
        zettabits: 1000000000000000000000,
        zebibits: 1180591620717411303424,
        zettabytes: 8000000000000000000000,
        zebibytes: 9444732965739290427392,
        yottabits: 1000000000000000000000000,
        yobibits: 1208925819614629174706176,
        yottabytes: 8000000000000000000000000,
        yobibytes: 9671406556917033397649408
    };

    function inputDigitData(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayData();
    }

    function updateDisplayData()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'dataInput')
        {
            calculateData();
        }
        else if (currentDivId === 'dataResult')
        {
            reverseCalculateData();
        }
    }

    function inputDecimalData()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayData();
    }

    function backspaceData()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayData();
    }

    function clearEntryData()
    {
        document.getElementById("dataInput").innerText = '0';
        document.getElementById("dataResult").innerText = '0';
        currentInput = '0';
    }

    function calculateData()
    {
        const dataInput = parseFloat(document.getElementById('dataInput').innerText);
        const fromUnit = document.getElementById('fromUnitData').value;
        const toUnit = document.getElementById('toUnitData').value;

        const fromRate = dataConversionRates[fromUnit];
        const toRate = dataConversionRates[toUnit];

        const result = (dataInput * fromRate) / toRate;
        document.getElementById('dataResult').innerText = result.toFixed(10); // Daha hassas sonuçlar için
    }

    function reverseCalculateData()
    {
        const dataResult = parseFloat(document.getElementById('dataResult').innerText);
        const fromUnit = document.getElementById('fromUnitData').value;
        const toUnit = document.getElementById('toUnitData').value;

        const fromRate = dataConversionRates[fromUnit];
        const toRate = dataConversionRates[toUnit];

        const result = (dataResult * toRate) / fromRate;
        document.getElementById('dataInput').innerText = result.toFixed(10); // Daha hassas sonuçlar için
    }

    function updateCalculateData()
    {
        if (currentDivId === 'dataInput')
        {
            calculateData();
        }
        else if (currentDivId === 'dataResult')
        {
            reverseCalculateData();
        }
    }

    const fromUnitData = document.getElementById('fromUnitData');
    const toUnitData = document.getElementById('toUnitData');

    fromUnitData.addEventListener('change', updateCalculateData);
    toUnitData.addEventListener('change', updateCalculateData);

    /* Pressure Calculator */

    const pressureConversionRates = {
        pascals: 1,
        kilopascals: 1000,
        bars: 100000,
        millimeters_of_mercury: 133.322,
        atmospheres: 101325,
        pounds_per_square_inch: 6894.76
    };

    function inputDigitPressure(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayPressure();
    }

    function updateDisplayPressure()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'pressureInput')
        {
            calculatePressure();
        }
        else if (currentDivId === 'pressureResult')
        {
            reverseCalculatePressure();
        }
    }

    function inputDecimalPressure()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayPressure();
    }

    function backspacePressure()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayPressure();
    }

    function clearEntryPressure()
    {
        document.getElementById("pressureInput").innerText = '0';
        document.getElementById("pressureResult").innerText = '0';
        currentInput = '0';
    }

    function calculatePressure()
    {
        const pressureInput = parseFloat(document.getElementById('pressureInput').innerText);
        const fromUnit = document.getElementById('fromUnitPressure').value;
        const toUnit = document.getElementById('toUnitPressure').value;

        const fromRate = pressureConversionRates[fromUnit];
        const toRate = pressureConversionRates[toUnit];

        const result = (pressureInput * fromRate) / toRate;
        document.getElementById('pressureResult').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function reverseCalculatePressure()
    {
        const pressureResult = parseFloat(document.getElementById('pressureResult').innerText);
        const fromUnit = document.getElementById('fromUnitPressure').value;
        const toUnit = document.getElementById('toUnitPressure').value;

        const fromRate = pressureConversionRates[fromUnit];
        const toRate = pressureConversionRates[toUnit];

        const result = (pressureResult * toRate) / fromRate;
        document.getElementById('pressureInput').innerText = result.toFixed(5); // Daha hassas sonuçlar için
    }

    function updateCalculatePressure()
    {
        if (currentDivId === 'pressureInput')
        {
            calculatePressure();
        }
        else if (currentDivId === 'pressureResult')
        {
            reverseCalculatePressure();
        }
    }

    const fromUnitPressure = document.getElementById('fromUnitPressure');
    const toUnitPressure = document.getElementById('toUnitPressure');

    fromUnitPressure.addEventListener('change', updateCalculatePressure);
    toUnitPressure.addEventListener('change', updateCalculatePressure);

    /* Angle Calculator */

    const angleConversionRates = {
        degrees: 1,
        radians: 180 / Math.PI,
        gradians: 0.9
    };

    function inputDigitAngle(digit)
    {
        if (shouldResetScreen)
        {
            currentInput = digit;
            shouldResetScreen = false;
        } else
        {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplayAngle();
    }   

    function updateDisplayAngle()
    {
        document.getElementById(currentDivId).innerText = currentInput;
        if (currentDivId === 'angleInput')
        {
            calculateAngle();
        }
        else if (currentDivId === 'angleResult')
        {
            reverseCalculateAngle();
        }
    }

    function inputDecimalAngle()
    {
        if (shouldResetScreen)
        {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.'))
        {
            currentInput += '.';
        }
        updateDisplayAngle();
    }

    function backspaceAngle()
    {
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplayAngle();
    }

    function clearEntryAngle()
    {
        document.getElementById("angleInput").innerText = '0';
        document.getElementById("angleResult").innerText = '0';
        currentInput = '0';
    }

    function calculateAngle()
    {
        const angleInput = parseFloat(document.getElementById('angleInput').innerText);
        const fromUnit = document.getElementById('fromUnitAngle').value;
        const toUnit = document.getElementById('toUnitAngle').value;

        const fromRate = angleConversionRates[fromUnit];
        const toRate = angleConversionRates[toUnit];

        const result = (angleInput * fromRate) / toRate;
        document.getElementById('angleResult').innerText = result.toPrecision(6); // Daha hassas sonuçlar için
    }

    function reverseCalculateAngle()
    {
        const angleResult = parseFloat(document.getElementById('angleResult').innerText);
        const fromUnit = document.getElementById('fromUnitAngle').value;
        const toUnit = document.getElementById('toUnitAngle').value;

        const fromRate = angleConversionRates[fromUnit];
        const toRate = angleConversionRates[toUnit];

        const result = (angleResult * toRate) / fromRate;
        document.getElementById('angleInput').innerText = result.toPrecision(6); // Daha hassas sonuçlar için
    }

    function updateCalculateAngle()
    {
        if (currentDivId === 'angleInput')
        {
            calculateAngle();
        }
        else if (currentDivId === 'angleResult')
        {
            reverseCalculateAngle();
        }
    }

    const fromUnitAngle = document.getElementById('fromUnitAngle');
    const toUnitAngle = document.getElementById('toUnitAngle');

    fromUnitAngle.addEventListener('change', updateCalculateAngle);
    toUnitAngle.addEventListener('change', updateCalculateAngle);
});


