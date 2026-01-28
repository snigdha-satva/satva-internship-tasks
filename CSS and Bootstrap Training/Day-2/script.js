// Task-1
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltipTriggerList.forEach(function (tooltipTrigger) {
    new bootstrap.Tooltip(tooltipTrigger);
});

// Task-2
const form = document.getElementById("myForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

function resetValidation() {
    const fields = form.querySelectorAll(".is-valid, .is-invalid");
    fields.forEach(field => {
        field.classList.remove("is-valid", "is-invalid");
        field.setCustomValidity("");
    });
}

function validateField(field) {
    if (!field.value.trim()) {
        field.classList.remove("is-valid", "is-invalid");
        return false;
    }

    if (field.checkValidity()) {
        field.classList.add("is-valid");
        field.classList.remove("is-invalid");
        return true;
    } else {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        return false;
    }
}

firstName.addEventListener("input", () => validateField(firstName));
lastName.addEventListener("input", () => validateField(lastName));
email.addEventListener("input", () => validateField(email));

password.addEventListener("input", () => {
    if (!password.value) {
        password.classList.remove("is-valid", "is-invalid");
        return;
    }

    if (passwordRegex.test(password.value)) {
        password.classList.add("is-valid");
        password.classList.remove("is-invalid");
    } else {
        password.classList.add("is-invalid");
        password.classList.remove("is-valid");
    }
});

confirmPassword.addEventListener("input", () => {
    if (!confirmPassword.value) {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.remove("is-valid", "is-invalid");
        return;
    }

    if (confirmPassword.value === password.value) {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.add("is-valid");
        confirmPassword.classList.remove("is-invalid");
    } else {
        confirmPassword.setCustomValidity("Passwords do not match");
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isFirstNameValid = validateField(firstName);
    const isLastNameValid = validateField(lastName);
    const isEmailValid = emailRegex.test(email.value);
    const isPasswordValid = passwordRegex.test(password.value);
    const isConfirmValid =
        confirmPassword.value === password.value && confirmPassword.value !== "";

    if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
        alert("Registration successful!");
        form.reset();
        resetValidation();
    } else {
        alert("Please fix the errors in the form.");
    }
});
