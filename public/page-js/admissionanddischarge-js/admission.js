$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass("active open menu-item-animating");
    $("#admission_and_discharge_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr("#birthdayPicker", {
        dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
        allowInput: true,    // Allows manual input if desired
    });

    flatpickr("#flatpickr-datetime", {
        enableTime: true,
        dateFormat: 'Y-m-d H:i'
    });

    $("#IDNational").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    $("#searchmobile").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    $("#searchname").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    // $("#searchname").select2({
    $("#searchname").select2("destroy");
        $("#searchname")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#searchname").parent(),
        width: "100%",
        placeholder: "Search Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientName: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    $('#selected-unit').on('change', function () {
        var selectedUnit = $(this).val();
        $("#loader-overlay").show();
        console.log("Selected unit: " + selectedUnit);

        $.ajax({
            url: '/get-rooms',
            type: 'GET',
            data: {
                unit: selectedUnit
            },
            success: function (response) {
                $('#room-og').show();
                $('#room-demo').hide();
                console.log("AJAX response:", response);

                var $dropdown = $('#select-room');
                $dropdown.empty().append('<option value="">Select</option>');
                $.each(response, function (key, value) {
                    $dropdown.append('<option value="' + key + '">' + value + '</option>');
                });
                $dropdown.selectpicker('refresh');
            },
            error: function (xhr) {
                console.error("AJAX error:", xhr.responseText);
            },
            complete: function () {
               
                $("#loader-overlay").hide();
            }
        });
    });


    $('#select-room').on('change', function () {
        var selectedRoomId = $(this).val();
        var clinicId = $('#clinic').val();
        $("#loader-overlay").show();
        if (!clinicId) {
            Swal.fire({
                icon: "error",
                text: 'Please select a branch',
                customClass: {
                    confirmButton:
                        "btn btn-danger waves-effect waves-light",
                },
            })
        }
        console.log("Selected unit: " + selectedRoomId);

        $.ajax({
            url: '/get-floors',
            type: 'GET',
            data: {
                roomManagementId: selectedRoomId,
                clinicId: clinicId,
            },
            success: function (response) {
                $('#floor-og').show();
                $('#floor-demo').hide();
                console.log("AJAX response:", response);
                $('#select-floor').empty().append('<option selected disabled>Select Floor</option>');

                response.forEach(function (item) {
                    if (item.nurse_station && item.nurse_station.floor && item.nurse_station.floor.name_en) {
                        $('#select-floor').append(
                            $('<option>', {
                                value: item.nurse_station.floor.roomManagementFloorId, // Use ID as needed
                                text: item.nurse_station.floor.name_en
                            })
                        );
                    }
                });
            },

            error: function (xhr) {
                console.error("AJAX error:", xhr.responseText);
            },  
               complete: function () {
               
                $("#loader-overlay").hide();
            }
        });
    });




    $('#select-floor').on('change', function () {
        var selectedFloorId = $(this).val();
        var clinicId = $('#clinic').val();
        var roomManagementId = $('#select-room').val();
         $("#loader-overlay").show();
        if (!clinicId) {
            Swal.fire({
                icon: "error",
                text: 'Please select a branch',
                customClass: {
                    confirmButton:
                        "btn btn-danger waves-effect waves-light",
                },
            })
        }
        console.log("Selected unit: " + selectedFloorId);

        $.ajax({
            url: '/get-roomNo',
            type: 'GET',
            data: {
                roomManagementFloorId: selectedFloorId,
                clinicId: clinicId,
                roomManagementId: roomManagementId
            },
            success: function (response) {
                $('#roomNo-og').show();
                $('#roomNo-demo').hide();
                var $roomSelect = $('#room-number');
                $roomSelect.empty(); // clear existing options
                $roomSelect.append('<option selected disabled>Select Room</option>');

                response.rooms.forEach(room => {
                    console.log("Room number:", room.room_number);
                    console.log("nurseStationRoomListId:", room.nurseStationRoomListId);

                    $roomSelect.append(
                        `<option value="${room.nurseStationRoomListId}">${room.room_number}</option>`
                    );
                });

                // Reinitialize Select2 if used
                $roomSelect.trigger('change.select2');
            },



            error: function (xhr) {
                console.error("AJAX error:", xhr.responseText);
            },
            complete: function () {
               
                $("#loader-overlay").hide();
            }
        });
    });



    $("#searchmobile").select2("destroy");
        $("#searchmobile")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#searchmobile").parent(),
        width: "100%",
        placeholder: "Search Mobile",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientMobile: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    // $("#IDNational").select2({+
     $("#IDNational").select2("destroy");
        $("#IDNational")
        .wrap('<div class="position-relative"></div>')
        .select2({
        dropdownParent: $("#IDNational").parent(),
        width: "100%",
        placeholder: "Search ID National",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/search-patient-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    clientIdNational: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data,
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }


    $("#admission_save_btn").click(function () {
        // Serialize data from all forms
        var patientAdmissionFormData = $("#patient_admission_form").serialize();
        $("#loader-overlay").show();
        // AJAX request
        $.ajax({
            url: BASE_URL + "/admission-and-discharge/admission",
            type: "POST",
            data: patientAdmissionFormData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        location.reload();
                    });
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });






});


// function getPatientById(selectedId) {
//     $.ajax({
//         url: BASE_URL + "/get-patient-by-id",
//         type: "GET",
//         data: {
//             clientId: selectedId,
//         },
//         success: function (response) {
//             if (response.status) {
//                 console.log(response.data.clientName_en);
//                 $("#first_name").val(response.data.clientName_en);
//                 $("#second_name").val(response.data.secondName_en);
//                 $("#third_name").val(response.data.thirdName_en);
//                 $("#fourth_name").val(response.data.fourthName_en);
//                 // $("#clientName").val(response.data.clientName);
//                 // $("#secondName_ar").val(response.data.secondName_ar);
//                 // $("#thirdName_ar").val(response.data.thirdName_ar);
//                 // $("#fourthName_ar").val(response.data.fourthName_ar);
//                 // $("#clientId").val(response.data.clientId);
//                 $("#mobile").val(
//                     response.data.mobile.startsWith("+")
//                         ? response.data.mobile.substring(1)
//                         : response.data.mobile
//                 );

//                 $('#birthdayPicker').val(response.data.birthDate);
//                 // alert(response.data.gender);
//                 $('#gender').val(response.data.gender).trigger('change');
//                 $('#id_national').val(response.data.idNational);
//                 // $('#clientId').val(response.data.clientId);
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error(error);
//         },
//     });
// }

function getPatientById(selectedId) {
    $.ajax({
        url: BASE_URL + "/get-patient-by-id",
        type: "GET",
        data: {
            clientId: selectedId,
        },
        success: function (response) {

            // If API returns status = false on failure
            if (!response.status) {
                $("#loader-overlay").hide();
                return;
            }

            const client = response.data.client;

            console.log(client.clientName_en);

            $("#first_name").val(client.clientName_en ?? '');
            $("#second_name").val(client.secondName_en ?? '');
            $("#third_name").val(client.thirdName_en ?? '');
            $("#fourth_name").val(client.fourthName_en ?? '');
            $("#clientName").val(response.data.clientName);
            // $("#secondName_ar").val(response.data.secondName_ar);
            // $("#thirdName_ar").val(response.data.thirdName_ar);
            // $("#fourthName_ar").val(response.data.fourthName_ar);
            // $("#clientId").val(response.data.clientId);

            $("#mobile").val(
                client.mobile
                    ? (client.mobile.startsWith("+")
                        ? client.mobile.substring(1)
                        : client.mobile)
                    : ''
            );

            $("#birthdayPicker").val(client.birthDate ?? '');
            // alert(response.data.gender);
            $("#gender").val(client.gender ?? '').trigger("change");
            $("#id_national").val(client.idNational ?? '');
            // $('#clientId').val(response.data.clientId);
             $("#loader-overlay").hide();
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error("AJAX Error:", error);
        }
    });
}



flatpickr(".booking-date", {
    dateFormat: "Y-m-d", // Set the format to YYYY-MM-DD
    allowInput: true, // Allows manual input if desired
});

flatpickr(".booking-time", {
    enableTime: true,
    noCalendar: true,          // Hides the calendar
    dateFormat: "H:i",         // 24-hour format, e.g., 14:30
    time_24hr: true,           // Use 24-hour clock
    allowInput: true,
});
