// State & City Cascading Autocomplete
const stateCity = {
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    "Uttar Pradesh": ['Ayodhya', 'Lucknow', 'Banaras', 'Kanpur'],
    Maharashtra: ['Mumbai', 'Thane', 'Pune', 'Nashik']
};

$(function () 
{
    // For  checking the regex
    $.validator.addMethod("pattern", function (value, element, regex) {
        return new RegExp(regex).test(value);
    });

    // Autocomplete for state input
    $('#stateInput').autocomplete({
        source: Object.keys(stateCity),
        minLength: 0,
        select: function (e, ui) {
            $('#stateInput').val(ui.item.value).trigger('blur');
            $('#cityInput').val('').trigger('blur');
            $('#cityInput').autocomplete('option', 'source', stateCity[ui.item.value]);
        }
    }).focus(function () {
        $(this).autocomplete('search', '');
    });

    // City autocomplete
    $('#cityInput').autocomplete({
        minLength: 0, // For showing the options onclick
        select: function (e, ui) {
            $(this).val(ui.item.value).trigger('blur');
        }
    }).focus(function () {
        const state = $('#stateInput').val();
        if (stateCity[state]) {
            $(this).autocomplete('option', stateCity[state]).autocomplete('search', '');
        }
    });

    // For picking a date range.
    $('input[name="dateRange"]').daterangepicker({
        drops: 'up'
    });

    // This is for validating the form
    $('#registerForm').validate({
        rules: {
            nameInput: {
                required: true,
                pattern: '^[a-zA-Z\\s]+$',
                minlength: 10
            },
            mobileInput: {
                required: true,
                digits: true,
                min: 1000000000,
                max: 9999999999
            },
            emailInput: {
                required: true,
                email: true
            },
            collegeNameInput: {
                required: true,
                pattern: '^[a-zA-Z\\s]+$',
                minlength: 3
            },
            cgpaInput: {
                required: true,
                number: true,
                min: 0,
                max: 10,
                step: 0.01
            },
            branchSelectInput: {
                required: true
            },
            stateInput: {
                required: true
            },
            cityInput: {
                required: true
            },
            zipInput: {
                required: true,
                digits: true,
                min: 100000,
                max: 999999
            },
            dateRange: {
                required: true
            },
        },
        messages: {
            nameInput: {
                pattern: "Only alphabets and spaces are allowed!",
            },
            collegeNameInput: {
                pattern: "Only alphabets and spaces are allowed!", 
            },
            mobileInput: {
                min: "Enter 10 digit number",
                max: "Enter 10 digit number"
            },
            zipInput: {
                min: "Enter 6 digit pincode",
                max: "Enter 6 digit pincode"
            }
        },
        errorElement: "small",
        errorClass: "text-danger",
        highlight: el => $(el).addClass("is-invalid"),
        // This is for as soon as user stops typing.
        onkeyup: function (element) {
            $(element).valid();
        },
        // This is for when the focus is out of the input field.
        onfocusout: function (element) {
            $(element).valid();
        },
        unhighlight: el => $(el).removeClass("is-invalid").addClass("is-valid")

    });

    // Function to get the form data using JQuery
    function getFormData() {
        return {
            name: $('#nameInput').val(),
            mobile: $('#mobileInput').val(),
            email: $('#emailInput').val(),
            college: $('#collegeNameInput').val(),
            cgpa: $('#cgpaInput').val(),
            branch: $('#branchSelect').val(),
            state: $('#stateInput').val(),
            city: $('#cityInput').val(),
            zip: $('#zipInput').val(),
            duration: $('#durationInput').val()
        };
    }

    // This is to get the stored data in the browser
    function getStoredData() {
        return JSON.parse(localStorage.getItem('studentData')) || []; // .parse() converts the JSON string to object.
    }

    // This is to save the data in local storage
    function saveData(data) {
        let oldData = getStoredData();
        oldData.push(data);
        localStorage.setItem('studentData', JSON.stringify(oldData)); // .stringify() converts the Js value to JSON String.
    }

    function renderTable(data) {
        $('#dataTableBody').html('');
        data.forEach(d => {
            $('#dataTableBody').append(`
                <tr>
                    <td>${d.name}</td>
                    <td>${d.mobile}</td>
                    <td>${d.email}</td>
                    <td>${d.college}</td>
                    <td>${d.cgpa}</td>
                    <td>${d.branch}</td>
                    <td>${d.state}</td>
                    <td>${d.city}</td>
                    <td>${d.zip}</td>
                    <td>${d.duration}</td>
                </tr>
            `);
        });
    }

    // This is using JQuery
    $('#addNewBtn').click(function () {
        if (!$('#registerForm').valid()) return; // Form validation on click.
        saveData(getFormData()); // Saving the data.
        $('#registerForm')[0].reset(); // This resets the form
        alert("Data Submitted Successfully!");
        $('.is-valid').removeClass('is-valid'); // This removes the validations.
    });

    $('#exportBtn').click(function () {
        renderTable(getStoredData()); // This shows the output in the table.
    });

    $('#clearStorageBtn').click(function () {
        localStorage.removeItem('studentData'); // This removes the data from local storage.
        $('#dataTableBody').html('');
    });

});
