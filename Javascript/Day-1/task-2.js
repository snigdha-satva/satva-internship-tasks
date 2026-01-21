const form = document.getElementById('taxSlabForm');
const modal = new bootstrap.Modal(document.getElementById('outputModal'));

form.addEventListener('input', function (event) {
    const field = event.target;
    if (field.validity.valid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        // alert("Enter all values without errors!)")
    }
    else {
    const gender = document.getElementById('userGender').value;
    const incomeBefore = parseFloat(document.getElementById('userIncome').value);
    const loan = parseFloat(document.getElementById('userLoan').value);
    const investment = parseFloat(document.getElementById('userInvestment').value);
    const loanExempt = Math.min(0.80 * loan, 0.20 * incomeBefore);
    const investmentExempt = Math.min(investment, 100000);
    
    let tax = 0;
    let income = incomeBefore - (loanExempt + investmentExempt);

    if (income < 0)
    {
        tax = 0;
    }
    else 
    {
    if (gender === 'male') {
        if (income > 240000 && income <= 600000) {
            tax = income * 0.10;
        } else if (income > 600000) {
            tax = income * 0.20;
        }
    } else if (gender === 'female') {
        if (income > 260000 && income <= 700000) {
            tax = income * 0.10;
        } else if (income > 700000) {
            tax = income * 0.20;
        }
    } else {
        if (income > 300000 && income <= 700000) {
            tax = income * 0.10;
        } else if (income > 700000) {
            tax = income * 0.20;
        }
    }
}
    document.getElementById('outputName').innerHTML = document.getElementById('userName').value;
    document.getElementById('outputPayableAmount').innerHTML = income.toFixed(2);
    document.getElementById('outputPayableTax').innerHTML = tax.toFixed(2);

    if (tax != 0)
    {
        document.getElementById('outputPayableAmount').style.backgroundColor = 'green';
        document.getElementById('outputPayableTax').style.backgroundColor = 'green';
    }
    else
    {
        document.getElementById('outputPayableAmount').style.backgroundColor = 'blue';
        document.getElementById('outputPayableTax').style.backgroundColor = 'blue';
    }

    form.classList.add('was-validated');
    modal.show();
}
});

form.addEventListener('reset', function () {
    location.reload();
});
