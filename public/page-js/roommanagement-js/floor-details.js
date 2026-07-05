$(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#floor_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(document).on('click', '.view-btn', function () {
        var roomManagementId = $(this).data('id');
        $('#addFloorModal').modal('show');
        $('#addRoomDetailsForm')[0].reset();
        $('#roomManagementId').val(roomManagementId);
        editClick();
    });

    $('#save-btn').click(function (e) {
        e.preventDefault();

        var roomManagementId = $('#roomManagementId').val();
        var roomManagementFloorId = $('#roomManagementFloorId').val();
        var formData = $('#addRoomDetailsForm').serialize();
        console.log(formData);
        var ajaxUrl = '/save-room-services/' + roomManagementId + '/' + roomManagementFloorId;
        ajaxType = 'PUT';
        $.ajax({
            url: ajaxUrl,
            type: ajaxType,
            data: formData,
            success: function (response) {
                if (response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Floor updated successfully!',
                        customClass: {
                            confirmButton: 'btn btn-success waves-effect waves-light',
                        },
                    }).then(function () {
                        $('#addFloorModal').modal('hide');
                        $('#speciality_table').DataTable().ajax.reload(); // old table
                        floorTable.ajax.reload(null, false); // your custom reload
                    });
                }
            },
            error: function (xhr, status, error) {
                $(".error-text").text("");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'An error occurred while saving the floor.',
                        customClass: {
                            confirmButton: 'btn btn-danger waves-effect waves-light',
                        },
                    });
                }
            }
        });
    });

    $(document).on('click', '#delete-btn', function (e) {
        e.preventDefault();

        const roomManagementId = $(this).data('id');
        const roomManagementFloorId = $('#roomManagementFloorId').val();

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this floor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton: "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: '/delete-room-details/' + roomManagementId + '/' + roomManagementFloorId,
                    type: "PUT",
                    success: function (response) {
                        if (response.status === true) {
                            
                            Swal.fire({
                                icon: "success",
                                text: "Room deleted successfully!",
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            });
                        }
                    },
                    error: function (xhr) {
                        console.error(xhr.responseText);
                    }
                });
            }
        });
    });


});

$('#addFloorModal').on('hidden.bs.modal', function () {
    $('#addRoomDetailsForm')[0].reset(); 
    clearErrors();                       
    $('.error-text').text('');           
});
function editClick() {
    var roomManagementId = $('#roomManagementId').val();
    var roomManagementFloorId = $('#roomManagementFloorId').val();
    clearErrors(); 
    $.ajax({
        url: BASE_URL + '/get-room-details/' + roomManagementId + '/' + roomManagementFloorId,
        type: "GET",
        success: function (response) {

            $('#roomCount').val(response.data.roomManagementFloorDetails.roomCount);
            $('#price').val(response.data.roomManagementFloorDetails.price);
            $('#roomStart').val(response.data.roomManagementFloorDetails.roomStart);
            $('#roomEnd').val(response.data.roomManagementFloorDetails.roomEnd);
            $('#description').val(response.data.roomManagementFloorDetails.description);

            
        },
        
        error: function (xhr) {
            console.error("Failed to fetch room details", xhr);
        }
    });
}


function clearErrors() {
    $(".invalid-feedback").remove();
    $(".is-invalid").removeClass("is-invalid");
}