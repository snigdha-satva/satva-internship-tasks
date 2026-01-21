const form = document.getElementById('form');
const submitBtn = document.getElementById('submitButton');
const inputs = form.querySelectorAll('input:not([disabled])');

function validateInput(input) {
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

function validateForm() {
    let isFormValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isFormValid = false;
        }
    });

    submitBtn.disabled = !isFormValid;
}

inputs.forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
        validateForm();
    });

    input.addEventListener('blur', () => {
        validateInput(input);
        validateForm();
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    
    const textBox1 = document.getElementById('textBox1');
    const textBox2 = document.getElementById('textBox2');
    const textBox3 = document.getElementById('textBox3');
    const textBox4 = document.getElementById('textBox4');
    
    const leftHalf = Number(textBox1.value) + Number(textBox2.value);
    let middleHalf = 0;
    const values = textBox3.value.split(/[\s,]+/);
    
    for (const value of values) {
        middleHalf += Number(value);
    }
    
    textBox4.value = leftHalf + '|' + middleHalf + '|' + (middleHalf + leftHalf);
});
