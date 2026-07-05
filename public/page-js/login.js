$(document).ready(function () {
    $('form').on('submit', function (event) {
        event.preventDefault();
        var emailOrUsername = $('#email_or_username').val();
        var password = $('#password').val();
        showLoader();
        // if (emailOrUsername.trim() !== '' && password.trim() !== '') {
        //     $('.loader-wrapper').show();
        // }
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            data: $(this).serialize(),
            success: function (response) {
                hideLoader();
                if (response.status === 'success') {
                    window.location.href = response.redirect;
                } else {
                    if (response.errors) {
                        for (var key in response.errors) {
                            if (key === 'password') {
                                $('#' + key).closest('.textbox-1').find('.text-danger').text(response.errors[key][0]);
                            } else {
                                $('#' + key).next('.text-danger').text(response.errors[key][0]);
                            }
                        }
                    }
                }
            },
            error: function (xhr) {
                hideLoader();
                var errors = xhr.responseJSON.errors;
                console.log(xhr.status);

                if (xhr.status === 401) {
                    $('#password').closest('.textbox-1').find('.text-danger')
                        .text('Invalid Credentials, Please try again.');
                }
                else if (xhr.status === 403) { 
                    $('#email_or_username').next('.text-danger')
                        .text(errors.error_msg[0]);
                }
                else {
                    if (errors) {
                        for (var key in errors) {
                            if (key === 'password') {
                                $('#' + key).closest('.textbox-1')
                                    .find('.text-danger')
                                    .text(errors[key][0]);
                            } else {
                                $('#' + key).next('.text-danger').text(errors[key][0]);
                            }
                        }
                    }
                }
            }
        });
    });

    setTimeout(function () {
        $('.alert').fadeOut('slow');
    }, 5000);
});
