$(function () {
    $("#zatca_main_menu").addClass("active open menu-item-animating");
    $("#device-registration_sub_menu").addClass("active");


    var zatcaTable = $('#zatca_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/zatca/data" // Ensure this matches your server-side endpoint
        },
        columns: [
            { data: 'zatcaId ', name: 'zatcaId ' },
            { data: 'deviceName', name: 'deviceName' },
            { data: 'expiryDate', name: 'expiryDate' },
            { data: 'clinicName', name: 'clinicName' },
            { data: 'vat', name: 'vat' },
            { data: 'CRN', name: 'CRN' },
            { data: 'location', name: 'location' },
            { data: 'buildingNo', name: 'buildingNo' },
            // { 
            //     data: 'actions', 
            //     name: 'actions', 
            //     orderable: false, 
            //     searchable: false,
            //     render: function(data, type, row) {
            //         return `
            //             <div class="btn-group" role="group">
            //                 <button type="button" class="btn btn-sm btn-info edit-device" data-id="${row.zatcaId}" data-clinic-id="${row.clinicId}">
            //                     <i class="ti ti-edit ti-xs"></i>
            //                 </button>
            //                 <button type="button" class="btn btn-sm btn-danger delete-device" data-id="${row.zatcaId}" data-clinic-id="${row.clinicId}">
            //                     <i class="ti ti-trash ti-xs"></i>
            //                 </button>
            //             </div>
            //         `;
            //     }
            // },


            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = full.zatcaId;
                    var deleteUrl = full.zatcaId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item edit-device" data-id="' + editUrl + '">Edit</a></li>'
                        +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-device" data-id="' + deleteUrl + '">Delete</a></li>' +
                        '</ul>' +
                        '</div>'
                    );
                },
            },
            // { data: 'address', name: 'address_en' },

        ]
    });


    $(document).on('click', '.edit-device', function () {
        var zatcaId = $(this).data('id');


        $.ajax({
            url: `/device-registration/${zatcaId}/edit`,
            method: 'GET',
            success: function (response) {
                if (response.success) {
                    $("#registerDeviceModal .modal-title").text("Edit Device");
                    $("#saveBtn").text("Update");
                    $("#zatcaId").val(zatcaId);
                    $("#deviceName").val(response.data.deviceName);

                    // Pre-select the clinic in the dropdown
                    $("#clinicName").val(response.data.clinicId).change();
                    // $('#employeeSelect').val(data.data.xrayReportEmployeeId).trigger('change');

                    $("#registerDeviceModal").modal("show");
                }
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to fetch device details',
                    customClass: {
                        confirmButton: 'btn btn-danger waves-effect waves-light',
                    },
                });
            }
        });
    });


    // Delete Device Event
    $(document).on('click', '.delete-device', function () {
        var zatcaId = $(this).data('id');
        var clinicId = $(this).data('clinic-id');

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this device?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/device-registration/delete/${zatcaId}`,
                    method: 'DELETE',
                    data: {
                        clinicId: clinicId,
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                text: 'Device deleted successfully',
                                customClass: {
                                    confirmButton: 'btn btn-success waves-effect waves-light',
                                },
                            });
                            zatcaTable.ajax.reload();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: response.message,
                                customClass: {
                                    confirmButton: 'btn btn-danger waves-effect waves-light',
                                },
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            text: 'Failed to delete device',
                            customClass: {
                                confirmButton: 'btn btn-danger waves-effect waves-light',
                            },
                        });
                    }
                });
            }
        });
    });


    $("#Registerbtn").on("click", function () {
        $('.error-text').text('');
        $("#registerDeviceModal").modal("show");
    });


    $("#saveBtn").on("click", function (e) {
        e.preventDefault();

        var deviceName = $("#deviceName").val();
         var production = $("#selectProduction").val();
        var clinicId = $("#clinicName").val();
        var otp = $("#otp").val();
        // let clinicName = $('#clinicName').val();
        $.ajax({
            url: '/device-registration',
            method: 'POST',
            data: {
                deviceName: deviceName,
                clinicId: clinicId,
                production: production,
                otp: otp,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Device registered successfully',
                        customClass: {
                            confirmButton: 'btn btn-success waves-effect waves-light',
                        },
                    }).then(function () {
                        $("#registerDeviceModal").modal("hide");
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: response.message,
                        customClass: {
                            confirmButton: 'btn btn-danger waves-effect waves-light',
                        },
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
                    console.error("Error:", xhr);
                }
            },
        });
    });



    let interval;

    function startOtpTimer(duration = 3600) {
        let timer = duration;
        const timerElement = document.getElementById("otpTimer");
    
        if (!timerElement) {
            console.error("Timer element not found!");
            return;
        }
    
        timerElement.classList.remove("d-none");
    
        const interval = setInterval(() => {
            if (timer <= 0) {
                clearInterval(interval);
                timerElement.textContent = "OTP expired.";
            } else {
                const minutes = Math.floor(timer / 60);
                const seconds = timer % 60;
                timerElement.textContent = `OTP expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                timer--;
            }
        }, 1000);
    }
    

    $("#clinicName").on("change", function () {
        const selectedClinic = $(this).val();
        const timerElement = $("#otpTimer");

        if (selectedClinic) {
            startOtpTimer();
        } else {
            clearInterval(interval);
            timerElement.addClass("d-none").text("");
        }
    });
});