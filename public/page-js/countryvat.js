$(document).ready(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#country_sub_menu").addClass("active");

    $('.vat-checkbox').on('change', function() {
        var nationalityId = $(this).data('nationality-id');
        var isEnabled = $(this).prop('checked') ? 1 : 0;

        $.ajax({
            url: '/update-country-vat-status',
            method: 'POST',
            data: {
                nationality_id: nationalityId,
                is_enabled: isEnabled,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'VAT status updated successfully',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update VAT status',
                    });
                }
            },
            error: function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while updating VAT status',
                });
            }
        });
    });
});