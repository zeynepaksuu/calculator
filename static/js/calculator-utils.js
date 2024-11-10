function inputDigit(currentInput, digit, shouldResetScreen) {
    return shouldResetScreen ? digit : (currentInput === '0' ? digit : currentInput + digit);
}

function inputDecimal(currentInput, shouldResetScreen) {
    if (shouldResetScreen) return '0.';
    return currentInput.includes('.') ? currentInput : currentInput + '.';
}

function handleOperator(operator, inputValue, result, currentOperator) {
    if (result === null || !currentOperator) {
        return { result: inputValue, shouldResetScreen: true, currentOperator: operator };
    }
    const newResult = performCalculation(result, inputValue, currentOperator);
    return { result: newResult, shouldResetScreen: true, currentOperator: operator };
}

function performCalculation(a, b, operator) {
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '×': (a, b) => a * b,
        '÷': (a, b) => b !== 0 ? a / b : 'Error',
        'mod': (a, b) => a % b,
        'xy': (a, b) => Math.pow(a, b),
        'logyx': (a, b) => Math.log(a) / Math.log(b),
        'y√x': (a, b) => Math.pow(b, 1 / a)
    };
    return operations[operator] ? operations[operator](a, b) : b;
}

function resetCalculator() {
    return {
        currentInput: '0',
        lastOperation: null,
        result: null,
        currentOperator: null,
        shouldResetScreen: false
    };
}

function backspace(currentInput) {
    return currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
}

function negate(currentInput) {
    return (-parseFloat(currentInput)).toString();
}

window.calculatorUtils = {
    inputDigit,
    inputDecimal,
    handleOperator,
    performCalculation,
    resetCalculator,
    backspace,
    negate
};