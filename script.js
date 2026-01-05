/**
 * Glassmorphism Calculator Logic
 * Handles mathematical operations and UI updates
 */

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    previousDisplay.innerText = previousInput;
}

function clearScreen() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === '0') return;
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        // Prevent multiple decimals
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null) calculate();
    previousInput = `${currentInput} ${getOpSymbol(op)}`;
    operator = op;
    shouldResetScreen = true;
    updateDisplay();
}

function getOpSymbol(op) {
    switch (op) {
        case '/': return '÷';
        case '*': return '×';
        case '-': return '−';
        case '+': return '+';
        default: return op;
    }
}

function calculate() {
    if (operator === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) {
                currentInput = "Error";
                operator = null;
                previousInput = "";
                updateDisplay();
                return;
            }
            result = prev / current; 
            break;
        default: return;
    }

    // Rounding to avoid floating point issues
    currentInput = parseFloat(result.toFixed(8)).toString();
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Add Keyboard Support
window.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') calculate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearScreen();
    if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
});

// Initial display update
updateDisplay();