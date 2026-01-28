const form = document.getElementById("myForm");

const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const url = document.getElementById("url");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
const urlRegex = /^(https?:\/\/)?[\\da-z\\.-]+\.([a-z\.]{2,6})([\\/\w\.-]*)*\/?$/;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (email.checkValidity()) {
        email.classList.add("is-valid");
        email.classList.remove("is-invalid");
    } else {
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
    }

    if (passwordRegex.test(password.value)) {
        password.classList.add("is-valid");
        password.classList.remove("is-invalid");
    } else {
        password.classList.add("is-invalid");
        password.classList.remove("is-valid");
    }

    if (
        confirmPassword.value !== "" &&
        confirmPassword.value === password.value
    ) {
        confirmPassword.classList.add("is-valid");
        confirmPassword.classList.remove("is-invalid");
    } else {
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
    }

    if (urlRegex.test(url.value)) {
        url.classList.add("is-valid");
        url.classList.remove("is-invalid");
    } else {
        url.classList.add("is-invalid");
        url.classList.remove("is-valid");
    }

});
