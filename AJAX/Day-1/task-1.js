$(document).ready(function () {

    // This is to show the loader for a small time
    function showLoader() {
        setTimeout(function () {
            $('.loader').fadeIn()
        }, 100)
    }

    // This hides the loader
    function hideLoader() {
        setTimeout(function () {
            $('.loader').fadeOut()
        }, 800)
    }

    showLoader() // Show loader as soon as the page loads

    $.ajax({
        url: 'https://countriesnow.space/api/v0.1/countries/', // URL for getting the country list
        method: 'GET',
        success: function (res) { // Works if the request is successful
            hideLoader() // Hides the loader on success
            $.each(res.data, function (i, v) {
                // Appends the option for countries.
                $('#country').append('<option value="' + v.country + '">' + v.country + '</option>')
            })
        }
    });

    // This works when the country value is changed.
    $('#country').on('change', function () {
        $('#state').html('<option value="">Select State</option>') // Adds the state option
        $('#city').html('<option value="">Select City</option>') // Adds the city option
        if (!this.value) return // Return if nothing is chosen
        showLoader()
        $.ajax({
            url: 'https://countriesnow.space/api/v0.1/countries/states', // Selecting the states
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ country: this.value }),
            success: function (res) {
                console.log(res)
                hideLoader()
                $.each(res.data.states, function (i, v) {
                    $('#state').append('<option value="' + v.name + '">' + v.name +' '+ v.state_code+ '</option>')
                })
            }
        })
    });

    $('#state').on('change', function () {
        $('#city').html('<option value="">Select City</option>')
        if (!this.value) return
        showLoader()
        $.ajax({
            url: 'https://countriesnow.space/api/v0.1/countries/state/cities',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                country: $('#country').val(),
                state: this.value
            }),
            success: function (res) {
                
                hideLoader()
                $.each(res.data, function (i, v) {
                    $('#city').append('<option value="' + v + '">' + v + '</option>')
                })
            }
        })
    });

})