// This is for authenticating the user with corrext password
// Any email will work but only 1 password is valid

$(function() {
    $.validator.addMethod(
        "correctPassword",
        value => value === "Satva1213#",
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
        highlight: el => $(el).addClass("is-invalid"),
        unhighlight: el => $(el).removeClass("is-invalid").addClass("is-valid"),
        onkeyup: el => $(el).valid(),
        onfocusout: el => $(el).valid(),
        submitHandler: function(form) {
            if ($("#password").val() !== "Satva1213#") {
                $("#password").addClass("is-invalid");
                return;
            }
            
            const email = $('#email').val();
            const password = $('#password').val();
            $.ajax({
                url: "http://trainingsampleapi.satva.solutions/api/auth/login",
                method: "POST",
                data: JSON.stringify({
                    Email: email,
                    Password: 'Satva1213#'
                }),
                contentType: 'application/json',
                success: function(response)
                {
                    localStorage.setItem('jwtToken', response.token);
                    alert('Login successful!');
                    window.location.href = "reconcile.html";
                },
                error: function(xhr, status, errorThrown)
                {
                    alert('Login failed: ' + xhr.responseJSON.message);
                }
            })
        }
    });
});
