document.addEventListener('DOMContentLoaded', function () {

    let calendarEl = document.getElementById('calendar')
    let selectedSlot = null
    let selectedEvent = null

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true, // To select whatever date we want
        allDaySlot: false, // To keep the slot within time range only
        selectMirror: true,
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: true,
        selectAllow: function(info) {
            var today = new Date()
            today.setHours(0, 0, 0, 0) // Normalize today's date to midnight for comparison
            return info.start >= today // Only allow selection starting from today or a future date
        },
        headerToolbar: {
            left: 'prev,next today', // For left side controls
            center: 'title', // To display the month & year
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // For monthwise, weekwise & daywise.
        },
        select(info) {
            selectedSlot = info // Put the selected info in the slot
            new bootstrap.Modal(document.getElementById('bookingModal')).show() // For modal pop up
        },
        eventClick: function(info) {

            selectedEvent = info.event

            Swal.fire({
                title: 'Choose Action',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Edit',
                denyButtonText: 'Delete'
            }).then(result => {
                if (result.isDenied) {
                    selectedEvent.remove()
                }
                if (result.isConfirmed) {
                    // This matches the event title and slices the whole Name+Phone and only returns Name,Phone
                    let [name, mobile] = selectedEvent.title.match(/^(.*)\s\((\d+)\)$/).slice(1)
                    $('#editPatientName').val(name)
                    $('#editMobileNumber').val(mobile)
                    new bootstrap.Modal(document.getElementById('EditModal')).show() // For modal pop up
                }
            })

        }
    })

    calendar.render() // Shows the calendar

    // Add custom regex method
    $.validator.addMethod("pattern", function (value, element, regex) {
        return new RegExp(regex).test(value)
    })

    $('#bookingForm').validate({
        rules: {
            patientName: {
                required: true,
                pattern: '^[a-zA-Z\\s]+$',
                minlength: 3
            },
            mobileNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            }
        },
        messages: {
            patientName: {
                pattern: "Only alphabets and spaces are allowed!",
            }
        },
        errorElement: "small",
        errorClass: "text-danger",
        onkeyup: el => $(el).valid(),
        onfocusout: el => $(el).valid(),
        highlight: el => $(el).addClass("is-invalid"),
        unhighlight: el => $(el).removeClass("is-invalid").addClass("is-valid"),
        // This is used so that the confirm button submits only valid input.
        submitHandler: function (form) {
            calendar.addEvent({
                title: `${patientName.value.trim()} (${mobileNumber.value.trim()})`,
                start: selectedSlot.start,
                end: selectedSlot.end
            })

            form.reset() // Resets the form
            $('#bookingForm').find('.is-valid, .is-invalid').removeClass('is-valid is-invalid') // Removes the validations

            bootstrap.Modal.getInstance(
                document.getElementById('bookingModal')
            ).hide() // Hides the modal pop up

            calendar.unselect()
        }
    })

    $('#editForm').validate({
        rules: {
            patientName: {
                required: true,
                pattern: '^[a-zA-Z\\s]+$',
                minlength: 3
            },
            mobileNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            }
        },
        submitHandler: function (form) {
            selectedEvent.setProp(
                'title',
                `${editPatientName.value.trim()} (${editMobileNumber.value.trim()})`
            )
            form.reset()
            bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide()
        }
    })

    // For closing the pop up using close button
    $('#bookingModal, #EditModal').on('hidden.bs.modal', function () {
        let $form = $('form', this)
        $form[0].reset()
        $form.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid')
        $form.validate().resetForm()
    })

})