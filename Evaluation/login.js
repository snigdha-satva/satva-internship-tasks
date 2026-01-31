$(function () {

    $.validator.addMethod(
        "correctPassword",
        function (value) {
            return value === "Satva1213#";
        },
        "Invalid password"
    );

    $("#loginForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
                correctPassword: true
            }
        },
        messages: {
            email: {
                required: "Email is required",
                email: "Please enter a valid email address"
            },
            password: {
                required: "Password is required",
                minlength: "Password must be at least 6 characters long"
            }
        },
        errorElement: "small",
        errorClass: "error",
        highlight: function (el) {
            $(el).addClass("is-invalid");
        },
        unhighlight: function (el) {
            $(el).removeClass("is-invalid").addClass("is-valid");
        },
        submitHandler: function () {

            const email = $("#email").val();
            const password = $("#password").val();

            $.ajax({
                url: "http://trainingsampleapi.satva.solutions/api/auth/login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    Email: email,
                    Password: password
                }),
                success: function (response) {
                    localStorage.setItem("jwtToken", response.token);
                    alert("Login successful!");
                    window.location.href = "index.html";
                },
                error: function (xhr) {
                    alert("Login failed: " + (xhr.responseJSON?.message || "Invalid credentials"));
                }
            });
        }
    });

});
