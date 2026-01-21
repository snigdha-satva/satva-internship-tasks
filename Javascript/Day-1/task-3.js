var currentTab = 0;
showTab(currentTab);

document.getElementById("previousButton").onclick = function () {
    nextPrev(-1);
}

document.getElementById("nextButton").onclick = function () {
    nextPrev(1);
}

function showTab(n) {
    var tabs = document.getElementsByClassName("tab");
    // This is for keeping the previous tabs' display none.
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    tabs[n].style.display = "block"; // Current tab will be displayed in block

    if (n === 0) {
        document.getElementById("previousButton").style.display = "none";
    } else {
        document.getElementById("previousButton").style.display = "inline-block";
    }

    if (n === tabs.length - 1) {
        document.getElementById("nextButton").innerHTML = "Submit";
    } else {
        document.getElementById("nextButton").innerHTML = "Next";
    }

    fixStepIndicator(n); 
}

function nextPrev(n) {
    var tabs = document.getElementsByClassName("tab");

    if (n === 1 && !validateForm()) return false; // This is important for validating the current tab and only then going to the next one.

    tabs[currentTab].style.display = "none"; // The current tab will disappear
    currentTab = currentTab + n; // 2 + -1 = 1 Previous tab will appear

    if (currentTab >= tabs.length) {
        alert("Form submitted successfully");
        location.reload();
        return false;
    }

    if (currentTab >= tabs.length - 1) {
        document.getElementById("userFirstNameValue").innerHTML = document.getElementById("firstName").value;
        document.getElementById("userLastNameValue").innerHTML = document.getElementById("lastName").value;
        document.getElementById("userGenderValue").innerHTML = document.getElementById("genderSelect").value;
        document.getElementById("userZipCodeValue").innerHTML = document.getElementById("zipCodeInput").value;
        document.getElementById("userEmailValue").innerHTML = document.getElementById("emailInput").value;
        document.getElementById("userUsernameValue").innerHTML = document.getElementById("usernameInput").value;
        document.getElementById("userPasswordValue").innerHTML = document.getElementById("passwordInput").value;
        document.getElementById("userBankNameValue").innerHTML = document.getElementById("bankSelect").value;
        document.getElementById("userBranchNameValue").innerHTML = document.getElementById("branchSelect").value;
        document.getElementById("userAccountTypeValue").innerHTML = document.getElementById("accountTypeSelect").value;
        document.getElementById("userAccountNumberValue").innerHTML = document.getElementById("accountNumberInput").value;
        document.getElementById("userCardTypeValue").innerHTML = document.getElementById("cardTypeSelect").value;
        document.getElementById("userCardHolderValue").innerHTML = document.getElementById("cardHolderName").value;
        document.getElementById("userCardNumberValue").innerHTML = document.getElementById("cardNumberInput").value;
        document.getElementById("userCvvValue").innerHTML = document.getElementById("cvvInput").value;
        document.getElementById("userValidityDateValue").innerHTML = document.getElementById("validityDateInput").value;
    }

    showTab(currentTab);
}

function validateForm() {
    var valid = true;
    var fields = document.getElementsByClassName("tab")[currentTab]
        .querySelectorAll("input, select");

    for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
            fields[i].classList.add("is-invalid");
            valid = false;
        } else {
            fields[i].classList.remove("is-invalid");
            fields[i].classList.add("is-valid");
        }
    }

    return valid;
}

function fixStepIndicator(n) {
    var dots = document.getElementsByClassName("stepDot");
    // This will fill the dot for current as well as previous indicators.
    for (var i = 0; i <= n; i++) {
        if (dots[i]) {
            dots[i].classList.add("active");
        }
    }
}

var formFields = document.querySelectorAll('input, select');
formFields.forEach(function(field) {
    field.addEventListener('input', function() {
        validateField(field);
    });

    field.addEventListener('change', function() {
        validateField(field);
    });
});

function validateField(field) {
    if (field.checkValidity()) {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
    } else {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
    }
}

