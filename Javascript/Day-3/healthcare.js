$(function () {

    const cityList = ['Ahmedabad','Surat','Vadodara','Rajkot','Mumbai','Pune','Nashik','Delhi','Bangalore'];

    // For lookahead city name
    $('#cityInput').autocomplete({
        source: cityList,
        minLength: 0
    }).focus(function () { // 
        $(this).autocomplete('search','');
    });

    $('#serviceDate').daterangepicker({
        autoApply: true,
        locale: { format: 'DD/MM/YYYY' }
    });

    const dropdown = $('#diseaseDropdown');
    const diseaseInput = $('#diseaseInput');

    diseaseInput.on('click', () => dropdown.toggleClass('open'));
    // This works on change and checks if any checkbox is checked or not
    dropdown.find('input').on('change', function () {
        diseaseInput.val(dropdown.find('input:checked').map(function () {
            return this.value;
        }).get().join(', '));
    });

    $(document).on('click', e => {
        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            dropdown.removeClass('open');
        }
    });

    // Add custom regex method
    $.validator.addMethod("pattern", function (value, element, regex) {
        return new RegExp(regex).test(value);
    });

    $('#bookingForm').validate({
        rules: {
            patientName: {
                required: true,
                pattern: '^[a-zA-Z\\s]+$',
                minlength: 3
            },
            mobileNumber: { required: true, digits: true, minlength: 10, maxlength: 10 },
            diseaseList: { required: true },
            serviceDate: { required: true },
            staffCount: { required: true, min: 1 },
            cityInput: { required: true, pattern: '^[a-zA-Z\\s]+$',},
            addressInput: { required: true }
        },
        messages: {
            patientName: {
                pattern: "Only alphabets and spaces are allowed!",
            },
            cityInput: {
                pattern: "Only alphabets and spaces are allowed!", 
            }
        },
        errorElement: 'small',
        errorClass: 'text-danger',
        onkeyup: el => $(el).valid(),
        onfocusout: el => $(el).valid(),
        highlight: el => $(el).addClass('is-invalid'),
        unhighlight: el => $(el).removeClass('is-invalid').addClass('is-valid'),
        submitHandler: function () {
            // This is used so that we don't need to write .val() for each field.
            const data = $('#bookingForm').serializeArray(); // Creates a Js array of objs so we can encode it as JSON string
            
            // For storing data in the local storage.
            const stored = JSON.parse(localStorage.getItem('bookingData')) || [];
            stored.push(data);
            localStorage.setItem('bookingData', JSON.stringify(stored));

            // This is for sweet Alert
            Swal.fire({
                icon: 'success',
                title: 'Booking Saved',
                text: 'Your request has been stored successfully'
            });

            $('#bookingForm')[0].reset();
            $('.is-valid').removeClass('is-valid');
        }
    });

    $('#clearBtn').on('click', function () {
        // This is to confirm if the user wants to delete all the data in the local storage.
        Swal.fire({
            icon: 'warning',
            title: 'Clear form?',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(res => {
            if (res.isConfirmed) {
                localStorage.removeItem('bookingData');
                $('#bookingForm')[0].reset();
                $('.is-valid').removeClass('is-valid');
            }
        });
    });

});
