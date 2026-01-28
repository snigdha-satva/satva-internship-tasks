const form = document.getElementById("appointmentForm");
const modalEl = document.getElementById("appointmentModal");
const modal = new bootstrap.Modal(modalEl);

const inputs = form.querySelectorAll("input, select");

inputs.forEach(el => {
    el.addEventListener("input", () => {
        if (el.checkValidity()) {
            el.classList.remove("is-invalid");
            el.classList.add("is-valid");
        } else {
            el.classList.remove("is-valid");
            el.classList.add("is-invalid");
        }
    });

    if (el.type === "date" || el.type === "time") {
        el.addEventListener("focus", () => el.showPicker());
        el.addEventListener("click", () => el.showPicker());
    }
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
        alert("Appointment Scheduled Successfully!");
        modal.hide();
    } else {
        form.classList.add("was-validated");
    }
});

modalEl.addEventListener("hidden.bs.modal", () => {
    form.reset();
    form.classList.remove("was-validated");
    inputs.forEach(el => el.classList.remove("is-valid", "is-invalid"));
});