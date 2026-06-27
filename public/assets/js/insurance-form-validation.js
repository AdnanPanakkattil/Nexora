$(document).ready(function() {
    $('#addInsuranceForm').on('submit', function(e) {
        e.preventDefault();

        // Clear previous error messages
        $('.invalid-feedback').remove();
        $('.form-control').removeClass('is-invalid');

        // Get form field values
        let insuranceEn = $('#insurance_en').val().trim();
        let insuranceAr = $('#insurance_ar').val().trim();
        let insuranceImage = $('#image').val();

        let errors = {};

        // Validate fields
        if (!insuranceEn) errors.insurance_en = 'Insurance Name (English) is required.';
        if (!insuranceAr) errors.insurance_ar = 'Insurance Name (Arabic) is required.';
        if (!insuranceImage) errors.image = 'Insurance Image is required.';

        // Display error messages if any
        if (Object.keys(errors).length > 0) {
            for (let field in errors) {
                let errorMessage = errors[field];
                let inputField = $('#' + field);
                let errorDiv = $('<div>').addClass('invalid-feedback').text(errorMessage);
                inputField.addClass('is-invalid').after(errorDiv);
            }

            let errorMessages = Object.values(errors).join('\n');

            Swal.fire({
                title: 'Error!',
                text: errorMessages,
                icon: 'error',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
            return;
        }

        // Submit the form via AJAX
        let formData = new FormData(this);
        $.ajax({
            url: insuranceStoreUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Good job!',
                        text: 'Insurance created successfully!',
                        icon: 'success',
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    }).then(() => {
                        window.location.href = insuranceIndexUrl;
                    });
                } else {
                    console.log('Error saving insurance: ' + response.message);
                }
            },
            error: function(xhr) {
                if (xhr.status === 422) {
                    $('.invalid-feedback').remove();
                    let errors = xhr.responseJSON.errors;
                    for (let field in errors) {
                        let errorMessage = errors[field][0];
                        let inputField = $('#' + field);
                        let errorDiv = $('<div>').addClass('invalid-feedback').text(errorMessage);
                        inputField.after(errorDiv);
                        inputField.addClass('is-invalid');
                    }
                } else {
                    console.log('Error saving insurance: ' + (xhr.responseJSON.message || 'Unknown error'));
                }
            }
        });
    });

    // Clear validation on input
    $('#addInsuranceForm input').on('input', function() {
        $(this).removeClass('is-invalid');
        $(this).next('.invalid-feedback').remove();
    });
});
