let map;
let marker;
$(document).ready(function () {
    $("#branch_main_menu").addClass("active open menu-item-animating");
    $("#branch_sub_menu").addClass("active");
    initMap();

    // let map;
    // let marker;

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addNewBranchBtn").click(function () {
        // initMap();
        $("#branchModel").modal("show");
        $("#branch_modal_footer").show();
        $("#branch_modal_header").text("Create New Branch");

        $("#branch_form")
            .find("input, textarea, select, button")
            .prop("disabled", false);
        $("#branch_id").val('');
        $("#clinicName_en").val('');
        $("#clinicName_ar").val('');

        $("#clinicMobile").val('');
        $("#clinicEmail").val('');
        $("#identifiedName_en").val('');
        $("#identifiedName_ar").val('');
        $("#locked_period").val('');
        // $("#systemStatus").val('');
        $("#address_en").val('');
        $("#address_ar").val('');
        $("#country").val('');
        $("#providerType").val('');
        $("#providerLicense").val('');
        $("#organizationType").val('');
        $('#active_toggle').prop('checked', true);
        $('#active_value').val(1);

    });

    var dt_service_common_table = $(".service-common-table");
    var dataTableInstance = null;

    var table = $("#branch_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/branch",
        columns: [
            {
                data: null,
                name: "clinicId",
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "identifiedName_en", name: "identifiedName_en" },
            { data: "clinicName_en", name: "clinicName_en" },
            { data: "address_en", name: "address_en" },
            {
                data: "active",
                name: "active",
                render: function (data, type, row) {
                    if (data == 1) {
                        return '<span class="badge bg-success">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactive</span>';
                    }
                }
            },


            // {data: 'serviceName_ar', name: 'serviceName_ar'},
            // {data: 'categoryName', name: 'categoryName'},
            // {data: 'categoryId', name: 'categoryId'},

            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

    // if (dt_service_common_table.length) {
    //     dt_service_common_table.DataTable({
    //         dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
    //         ajax: {
    //             url: BASE_URL + "/common",
    //             type: 'GET'
    //         },
    //         processing: true,
    //         serverSide: true,
    //         columns: [
    //             { data: 'clinicServicesGroupId' },
    //             { data: 'groupName_en' },
    //             { data: 'groupName_ar' },
    //             {
    //                 data: null, // Add this to handle the actions column
    //                 orderable: false,
    //                 searchable: false,
    //                 render: function (data, type, full, meta) {
    //                     var editUrl = BASE_URL + "/edit-service-common-group/" + full.clinicServicesGroupId;
    //                     var detailsUrl = BASE_URL + "/detail-of-common-service-group/" + full.clinicServicesGroupId;
    //                     var deleteUrl = BASE_URL + "/delete-common-service-group/" + full.clinicServicesGroupId;
    //                     var assignedCommonServicesUrl = BASE_URL + "/assigned-common-services/" + full.clinicServicesGroupId;

    //                     return (
    //                         '<div class="d-inline-block">' +
    //                         '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
    //                         '<ul class="dropdown-menu dropdown-menu-end m-0">' +
    //                         '<li><a href="javascript:;" class="dropdown-item item-details" data-id="'+detailsUrl+'">Details</a></li>' +
    //                         '<div class="dropdown-divider"></div>' +
    //                         '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' + deleteUrl + '">Delete</a></li>' +
    //                         "</ul>" +
    //                         "</div>" +
    //                         // '<a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" item-details" data-id="'+detailsUrl+'"><i class="ti ti-eye ti-md"></i></a>'+
    //                         '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon item-edit" data-id="' + editUrl + '"><i class="ti ti-pencil ti-md"></i></a>'+
    //                         '<a href="' + assignedCommonServicesUrl + '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" ><i class="ti ti-eye ti-md"></i></a>'
    //                     );
    //                 }
    //             }
    //         ],
    //         language: {
    //             paginate: {
    //                 next: '<i class="ti ti-chevron-right ti-sm"></i>',
    //                 previous: '<i class="ti ti-chevron-left ti-sm"></i>'
    //             }
    //         },
    //         orderCellsTop: true,
    //         responsive: true
    //     });
    // }

    $(".createBranchBtn").click(function () {
        var formData = $("#branch_form").serialize();
        var branchId = $("#branch_id").val();
        var ajaxUrl = branchId
            ? BASE_URL + "/update-branch/" + branchId
            : BASE_URL + "/branch";
        var method = branchId ? "PUT" : "POST";

        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
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
                } else {
                    Swal.fire({
                        icon: "error", // Change this to "error" for error messages
                        text: response.message,
                        customClass: {
                            confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
                        },
                    }).then(function () {
                        location.reload();
                    });

                }
                $("#largeModal").modal("hide"); // Hide modal on success
            },
            error: function (xhr, status, err) {
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error fetching edit data:", xhr.message);
                    $("#branchModel").modal("hide");

                    // Extract error message from the response
                    var errorMessage =
                        xhr.responseJSON && xhr.responseJSON.message
                            ? xhr.responseJSON.message
                            : "An unexpected error occurred. Please try again.";
                    // Display the error message in SweetAlert
                    Swal.fire({
                        icon: "error",
                        title: "Access denied",
                        text: errorMessage,
                        customClass: {
                            confirmButton:
                                "btn btn-danger waves-effect waves-light",
                        },
                    });
                }
            },
        });
    });

    table.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#branchModel").modal("show");
                    $("#branch_modal_footer").show();
                    $("#branch_modal_header").text("Update Branch");

                    $("#branch_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#branch_id").val(response.data.clinicId);
                    $("#clinicName_en").val(response.data.clinicName_en);
                    $("#clinicName_ar").val(response.data.clinicName_ar);

                    $("#clinicMobile").val(response.data.clinicMobile);
                    $("#phone").val(response.data.phone);
                    $("#clinicEmail").val(response.data.clinicEmail);
                    $("#identifiedName_en").val(
                        response.data.identifiedName_en
                    );
                    $("#identifiedName_ar").val(
                        response.data.identifiedName_ar
                    );
                    $("#vat").val(response.data.vat);
                    $("#registrationName").val(response.data.registrationName);
                    $("#CRN").val(response.data.CRN);
                    $("#streetName").val(response.data.streetName);
                    $("#buildingNo").val(response.data.buildingNo);
                    $("#plotIdentification").val(response.data.plotIdentification);
                    $("#cityName").val(response.data.cityName);
                    $("#postalZone").val(response.data.postalZone);

                    $("#locked_period").val(response.data.locked_period);
                    // $("#systemStatus").val(response.data.systemStatus);
                    $("#address_en").val(response.data.address_en);
                    $("#address_ar").val(response.data.address_ar);
                    $("#country").val(response.data.country).trigger('change');
                    $("#providerType").val(response.data.providerType).trigger('change');
                    $("#providerLicense").val(response.data.providerLicense);
                    $("#organizationType").val(response.data.organizationType).trigger('change');

                    $("#model").val(response.data.model);
                    $("#vatName").val(response.data.vatName);
                    $("#businessCategory").val(response.data.businessCategory);

                    if (response.data.active == 1) {
                        $('#active_toggle').prop('checked', true);
                        $('#active_value').val(1);
                    } else {
                        $('#active_toggle').prop('checked', false);
                        $('#active_value').val(0);
                    }
                    var lat = response.data.lat || 51.505;
                    var lng = response.data.lng || -0.09;

                    if (map && marker) {
                        map.setView([lat, lng], 13);
                        marker.setLatLng([lat, lng]);
                    } else {
                        console.error("Map or marker is not defined.");
                    }

                    // Update hidden input fields
                    document.getElementById('latitude').value = lat;
                    document.getElementById('longitude').value = lng;
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err.message);
                // Extract error message from the response
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    $(document).on('change', '#active_toggle', function () {
        var val = $(this).is(':checked') ? 1 : 0;
        $('#active_value').val(val);
        console.log('Active value set to:', val);
    });

    dt_service_common_table.on("click", ".item-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this service?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            customClass: {
                confirmButton: "btn btn-primary me-3 waves-effect waves-light",
                cancelButton:
                    "btn btn-label-secondary waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
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
                    error: function (err) {
                        console.error("Error fetching edit data:", err.message);
                        // Extract error message from the response
                        var errorMessage =
                            err.responseJSON && err.responseJSON.message
                                ? err.responseJSON.message
                                : "An unexpected error occurred. Please try again.";
                        // Display the error message in SweetAlert
                        Swal.fire({
                            icon: "error",
                            title: "Access denied",
                            text: errorMessage,
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Please verify the service common group.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    dt_service_common_table.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#branchModel").modal("show");
                    $("#branch_modal_footer").hide();
                    $("#branch_modal_header").text("Branch Details");

                    $("#branch_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#branch_id").val(response.data.clinicId);
                    $("#clinicName_en").val(response.data.clinicName_en);
                    $("#clinicName_ar").val(response.data.clinicName_ar);

                    $("#clinicMobile").val(response.data.clinicMobile);
                    $("#clinicEmail").val(response.data.clinicEmail);
                    $("#identifiedName_en").val(
                        response.data.identifiedName_en
                    );
                    $("#identifiedName_ar").val(
                        response.data.identifiedName_ar
                    );
                    $("#locked_period").val(response.data.locked_period);
                    // $("#systemStatus").val(response.data.systemStatus);
                    $("#address_en").val(response.data.address_en);
                    $("#address_ar").val(response.data.address_ar);
                    $("#country").val(response.data.country).trigger('change');
                    $("#providerType").val(response.data.providerType).trigger('change');
                    $("#providerLicense").val(response.data.providerLicense);
                    $("#organizationType").val(response.data.organizationType).trigger('change');
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err.message);
                // Extract error message from the response
                var errorMessage =
                    err.responseJSON && err.responseJSON.message
                        ? err.responseJSON.message
                        : "An unexpected error occurred. Please try again.";
                // Display the error message in SweetAlert
                Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text: errorMessage,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
});


function searchLocation(query) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                let location = data[0];
                let lat = location.lat;
                let lon = location.lon;

                // Set the map view and marker to the searched location
                map.setView([lat, lon], 13);
                marker.setLatLng([lat, lon]);

                // Update hidden input fields
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lon;
            } else {
                alert("Location not found");
            }
        })
        .catch(error => console.error('Error:', error));
}


function initMap() {
    // Initialize the map and set its view to a specific place and zoom level
    map = L.map('map').setView([51.505, -0.09], 13);

    // Set up the OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to the map at the same coordinates
    marker = L.marker([51.505, -0.09], { draggable: true }).addTo(map);

    // Update the latitude and longitude fields when the marker is dragged
    marker.on('dragend', function () {
        let lat = marker.getLatLng().lat;
        let lng = marker.getLatLng().lng;
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
    });

    // Add search functionality
    let searchBox = document.getElementById('place_search');
    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let query = searchBox.value;
            searchLocation(query);
        }
    });


    function updateBranchCounts() {
        $.ajax({
            url: BASE_URL + '/branch-counts',
            method: 'GET',
            success: function (response) {
                if (response.status) {
                    $('#active').text(response.data.active);
                    $('#inactive').text(response.data.inactive);
                }
            },
            error: function (err) {
                console.error('Error fetching branch counts:', err);
            }
        });
    }


    $(document).ready(function () {
        updateBranchCounts();

        setInterval(updateBranchCounts, 30000);
    });

}

$('#clinicName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#clinicName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});