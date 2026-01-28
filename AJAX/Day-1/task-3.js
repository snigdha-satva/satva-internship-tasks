$(function () {

    // Creates a custom validation for JSON string.
    $.validator.addMethod("validJson", function (value, element) {
        if (!value) return true // Checks if the value is empty
        try {
            JSON.parse(value) // Tries to parse the value
            return true // Return true if valid JSON
        } catch {
            return false // Otherwise return false
        }
    })

    // Checks if body & headers are required or not
    function isBodyMethod() {
        return ['POST', 'PUT', 'PATCH'].includes($("#requestMethod").val())
    }

    // Toggles the body & headers field if not required in the method type
    function toggleFields() {
        if (isBodyMethod()) {
            $("#headersGroup, #bodyGroup").removeClass("d-none") // Shows the fields
        } else {
            $("#headersGroup, #bodyGroup").addClass("d-none") // Hides the fields
            // This is for removing the validations in the fields
            $("#requestHeaders, #requestBody")
                .val("")
                .removeClass("is-invalid is-valid")
        }
    }

    // This handles the color grading for the status code
    function displayResponse(status, data) {
        let color = ""
        if (status >= 200 && status < 300) color = "green"
        else if (status >= 300 && status < 400) color = "orange"
        else if (status >= 400 && status < 500) color = "red"
        else if (status >= 500) color = "darkred"
        else color = "gray"

        $("#statusCode")
            .text(status)
            .css({ "color": color, "font-weight": "bold" })

        $("#responseOutput").text(JSON.stringify(data || {}, null, 2)) // 2 is for making the output pretty by putting 2 indentations
    }
    // This is necessary because we can't put d-none by default in html
    // Because that will lead to those fields not having proper validations
    toggleFields()

    // This works whenever we change the method type in the dropdown
    $("#requestMethod").on("change", function () {
        toggleFields()
        $("#apiForm").valid() // Checks for form validity again in case body & header fields are shown
    })

    // Validates the whole form
    $("#apiForm").validate({
        ignore: [],
        rules: {
            requestUrl: { required: true, url: true },
            // These two are only validated when method is PUT, PATCH OR POST
            requestHeaders: { required: isBodyMethod, validJson: true },
            requestBody: { required: isBodyMethod, validJson: true }
        },
        messages: {
            requestUrl: { required: "URL is required", url: "Enter a valid URL" },
            requestHeaders: { required: "Headers are required", validJson: "Invalid JSON format" },
            requestBody: { required: "Body is required", validJson: "Invalid JSON format" }
        },
        errorElement: "small",
        errorClass: "text-danger",
        highlight: el => $(el).addClass("is-invalid"),
        unhighlight: el => $(el).removeClass("is-invalid").addClass("is-valid"),
        onkeyup: el => $(el).valid(),
        onfocusout: el => $(el).valid(),

        // Handles the form submission
        submitHandler: function () {

            setTimeout(function () {
                let method = $("#requestMethod").val()
                let headers = {}
                let data = null

                // If method is PUT, PATCH OR POST
                if (isBodyMethod()) {
                    headers = JSON.parse($("#requestHeaders").val()) // Converts JSON header to object
                    data = JSON.stringify(JSON.parse($("#requestBody").val())) // Converts the data to JSON string
                }

                $.ajax({
                    url: $("#requestUrl").val(),
                    method: method,
                    headers: headers,
                    data: data,
                    contentType: isBodyMethod() ? "application/json" : undefined, // True if body & headers are present
                    // Here textStatus is rrequired to match the arity of the success function
                    success: function (res, textStatus, xhr) { // AJAX recognizes method types and does it's action by default, we don't need to specify it
                        let parsed = res
                        if (!res) parsed = { message: "No response body" }
                        displayResponse(xhr.status, parsed) // Display in the response section
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        let parsed
                        try {
                            parsed = xhr.responseJSON || JSON.parse(xhr.responseText)
                        } catch {
                            parsed = { message: xhr.responseText || "No response body" }
                        }
                        displayResponse(xhr.status, parsed)
                    }
                })

            }, 400)
        }
    })
})
