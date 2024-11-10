// Bilimsel hesap makinesi fonksiyonları
function globScientificCalculate(action, currentInput, isRadianMode) {
    const currentValue = parseFloat(currentInput);
    let newResult, secondValue = '';

    const actions = {
        'second': () => {
            twoNdActive = !twoNdActive;
            twond(twoNdActive);
            return [null, null];
        },
        'square': () => [Math.pow(currentValue, 2), '2'],
        '2nd-square': () => [Math.pow(currentValue, 3), '3'],
        'square-root': () => [Math.sqrt(currentValue), '√'],
        '2nd-square-root': () => [Math.cbrt(currentValue), '³√'],
        'factorial': () => [factorial(currentValue), '!'],
        'sin': () => [isRadianMode ? Math.sin(currentValue) : Math.sin(degToRad(currentValue)), 'sin'],
        'cos': () => [isRadianMode ? Math.cos(currentValue) : Math.cos(degToRad(currentValue)), 'cos'],
        'tan': () => [isRadianMode ? Math.tan(currentValue) : Math.tan(degToRad(currentValue)), 'tan'],
        'log': () => [Math.log10(currentValue), 'log'],
        'ln': () => [Math.log(currentValue), 'ln'],
        '2nd-ln': () => [Math.exp(currentValue), 'e^'],
        'pow-e': () => [Math.exp(currentValue), 'e^'],
        'abs': () => [Math.abs(currentValue), '| |'],
        'inverse': () => [1 / currentValue, '1/'],
        'exp': () => [Math.exp(currentValue), 'exp'],
        'ten-power': () => [Math.pow(10, currentValue), '10^'],
        '2nd-ten-power': () => [Math.pow(2, currentValue), '2^']
    };

    if (action in actions) {
        [newResult, secondValue] = actions[action]();
        return { newResult, secondValue, action };
    } else {
        console.error('Geçersiz işlem');
        return null;
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

function globHandleMemory(action, currentInput, memory) {
    let secondValue = '';
    switch (action) {
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
    return { currentInput, memory, action, secondValue };
}

function twond(twoNdActive) {
    const togglePairs = [
        ['square', '2nd-square'],
        ['square-root', '2nd-square-root'],
        ['power', '2nd-power'],
        ['ten-power', '2nd-ten-power'],
        ['log', '2nd-log'],
        ['ln', '2nd-ln']
    ];

    togglePairs.forEach(pair => {
        const [first, second] = pair;
        document.querySelector(`[data-action="${first}"]`).style.display = twoNdActive ? 'none' : 'block';
        document.querySelector(`[data-action="${second}"]`).style.display = twoNdActive ? 'block' : 'none';
    });

    const secondButton = document.getElementById('second');
    if (twoNdActive) {
        secondButton.style.setProperty('background-color', '#47B1E8', 'important');
    } else {
        secondButton.style.removeProperty('background-color');
    }
}