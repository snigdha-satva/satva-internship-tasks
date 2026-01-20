'use strict';
document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');

        inputs.forEach(input => {

            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });

        });
        form.addEventListener('submit', e => {
            e.preventDefault()
        
            inputs.forEach(input => {
                if (input.checkValidity()) {
                    input.classList.add('is-valid')
                    input.classList.remove('is-invalid')
                } else {
                    input.classList.add('is-invalid')
                    input.classList.remove('is-valid')
                }
            })
        
            if (form.checkValidity()) {
                form.reset()
                inputs.forEach(i => i.classList.remove('is-valid','is-invalid'))
            }
        })
    });
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";

            togglePassword.classList.toggle("bi-eye");
            togglePassword.classList.toggle("bi-eye-slash");
        });
    }

});
