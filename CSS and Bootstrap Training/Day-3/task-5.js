const form = document.getElementById('shippingForm')
        const inputs = form.querySelectorAll('input,select')

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid')
                    input.classList.add('is-valid')
                } else {
                    input.classList.remove('is-valid')
                    input.classList.add('is-invalid')
                }
            })
        })

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