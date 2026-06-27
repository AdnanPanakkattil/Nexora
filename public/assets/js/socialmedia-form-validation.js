$(document).ready(function() {
    $('#addSocialmediaForm').on('submit', function(e) {
        e.preventDefault();

        // Clear previous error messages
        $('.invalid-feedback').remove();
        $('.form-control').removeClass('is-invalid');

        // Get form field values
        let tiktokName = $('#tiktok_name').val().trim();
        let tiktokImage = $('#tiktok_image').val();
        let snapchatName = $('#snapchat_name').val().trim();
        let snapchatImage = $('#snapchat_image').val();
        let instagramName = $('#instagram_name').val().trim();
        let instagramImage = $('#instagram_image').val();
        let facebookName = $('#facebook_name').val().trim();
        let facebookImage = $('#facebook_image').val();
        let youtubeName = $('#youtube_name').val().trim();
        let youtubeImage = $('#youtube_image').val();

        let errors = {};

        // Validate fields
        if (!tiktokName) errors.tiktok_name = 'TikTok Name is required.';
        if (!tiktokImage) errors.tiktok_image = 'TikTok Image is required.';
        if (!snapchatName) errors.snapchat_name = 'Snapchat Name is required.';
        if (!snapchatImage) errors.snapchat_image = 'Snapchat Image is required.';
        if (!instagramName) errors.instagram_name = 'Instagram Name is required.';
        if (!instagramImage) errors.instagram_image = 'Instagram Image is required.';
        if (!facebookName) errors.facebook_name = 'Facebook Name is required.';
        if (!facebookImage) errors.facebook_image = 'Facebook Image is required.';
        if (!youtubeName) errors.youtube_name = 'YouTube Name is required.';
        if (!youtubeImage) errors.youtube_image = 'YouTube Image is required.';

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
            url: socialmediaStoreUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Good job!',
                        text: 'Social Media created successfully!',
                        icon: 'success',
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    }).then(() => {
                        window.location.href = socialmediaIndexUrl;
                    });
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
                    console.log('Error saving social media: ' + (xhr.responseJSON.message || 'Unknown error'));
                }
            }
        });
    });

    // Clear validation on input
    $('#addSocialmediaForm input').on('input', function() {
        $(this).removeClass('is-invalid');
        $(this).next('.invalid-feedback').remove();
    });
});
