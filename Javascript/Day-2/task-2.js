let display = document.getElementById('displayValue')
let expr = ''

document.querySelector('.tables').onclick = e => {
    const t = e.target

    // This id for the AC Button.
    if (t.id === 'clearButton') {
        expr = '' // Makes the expression null.
        display.textContent = '0' // Display '0' for the output field.
        return
    }

    // This is for clearing the value at the last position.
    else if (t.id === 'clearLastButton') {
        expr = expr.slice(0, -1) // It removes the last value.
        display.textContent = expr || '0' // If expression is empty, it shows 0
        return
    }

    // This is for when equal button is ckicked.
    else if (t.id === 'equalButton') {
        try {
            let result
            // For % calculation
            if (expr.includes('%')) {
                let parts = expr.split('%')
                if (parts.length === 2) {
                    let first = parseFloat(parts[0])
                    let second = parseFloat(parts[1])
                    // This is for 6% = 0.06
                    if (!second) {
                        result = (first) / 100;
                    }
                    // This is for 6 % 3 = 0.18
                    else {
                        result = (first * second) / 100
                    }
                }
                else {
                    result = parseFloat(parts[0]) / 100
                }
            }
            else if (expr.includes('/0')) {
                result = 'undefined'
            }

            // This actually does the mathematical calculations.
            else {
                // Function is a Js constructor used to create a new function.
                // It creates an anonymous function which essentially returns the mathematical evaluation.
                result = Function('return ' + expr)() // This returns 'return 2*3/5'
            }
            expr = result.toString() // Converts the final result to string.
            display.textContent = expr // Inserts the string into the display.
        }
        catch {
            // For all invalid mathematical expression
            display.textContent = expr || 'Invalid'
            expr = ''
        }
        return
    }

    // This is for operators 
    else if (t.dataset.value) 
    {
        const val = t.dataset.value
        const lastChar = expr.slice(-1)
        if (expr === '0' && !/[+\-*/%]/.test(val)) expr = ''

        // This is to prevent multiple consecutive same operators
        if (/[+\-*/%]/.test(val) && lastChar === val) return

        // This is for preventing operator immediately after another operator
        if (/[+\-*/%]/.test(val) && /[+\-*/%]/.test(lastChar)) return

        expr += val
        display.textContent = expr
    }
}
