$(document).ready(function() {
    $('#socialmedia-form').on('submit', function(e) {
        e.preventDefault();
        let formData = new FormData(this);
        $('.invalid-feedback').remove();
        $('.form-control').removeClass('is-invalid');

        // Validation checks
        let tiktokName = $('#tiktok_name').val().trim();
        let snapchatName = $('#snapchat_name').val().trim();
        let instagramName = $('#instagram_name').val().trim();
        let facebookName = $('#facebook_name').val().trim();
        let youtubeName = $('#youtube_name').val().trim();
        let errors = {};

        if (!tiktokName) errors.tiktok_name = 'TikTok Name (English) is required.';
        if (!snapchatName) errors.snapchat_name = 'Snapchat Name (English) is required.';
        if (!instagramName) errors.instagram_name = 'Instagram Name (English) is required.';
        if (!facebookName) errors.facebook_name = 'Facebook Name (English) is required.';
        if (!youtubeName) errors.youtube_name = 'Youtube Name (English) is required.';

        // If there are validation errors
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
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Good job!',
                        text: 'Social Media updated successfully!',
                        icon: 'success',
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    }).then(() => {
                        window.location.href = socialmediaIndexUrl;
                    });
                } else {
                    console.log('Error updating social media: ' + response.message);
                }
            },
            error: function(xhr) {
                if (xhr.status === 422) {
                    Swal.fire({
                        title: 'Error!',
                        text: xhr.responseJSON.message,
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                } else {
                    console.log('Error updating social media: ' + (xhr.responseJSON.message || 'Unknown error'));
                }
            }
        });
    });

    // Remove validation error when input changes
    $('#socialmedia-form input').on('input change', function() {
        $(this).removeClass('is-invalid');
        $(this).next('.invalid-feedback').remove();
    });
});
