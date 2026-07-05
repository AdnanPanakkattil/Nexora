$(document).ready(function () {
    $("#administration_main_menu").addClass("active open menu-item-animating");
    $("#close_time_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    $("#add_new_close_time_btn").click(function () {
        $("#userClosTimeModal").modal("show");
        $("#close_time_header").text("Add Close Time");
        $("#close_time_form")
            .find("input, textarea, select, button")
            .prop("disabled", false);
        $("#close_time_form")[0].reset();
    });

    var employeCloseTimeTable = $("#employe_close_time_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/user-close-time",
        columns: [
            // {
            //     data: "checkbox",
            //     name: "checkbox",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
            //         return (
            //             '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
            //             full.serviceId +
            //             '">'
            //         );
            //     },
            // },

            { data: "reservationId", name: "reservationId" },
            { data: "employeeId", name: "employeeId" },
            { data: "name", name: "name" },
            { data: "role", name: "role" },
            { data: "startTime", name: "startTime" },
            { data: "endTime", name: "endTime" },
            { data: "totalDuration", name: "totalDuration" },

            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

   employeCloseTimeTable.on("click", ".item-details", function () {
    var editUrl = $(this).data("id");

    $.ajax({
        url: editUrl,
        method: "GET",
        success: function (response) {
            if (response.status === true) {
                var data = response.data;

                // Populate details modal fields
                $("#detail_appointmentDate").val(data.appointmentDate ?? '');
                $("#detail_endDate").val(data.endTime ?? '');
                $("#detail_start_time").val(data.start_time ?? '');
                $("#detail_end_time").val(data.end_time ?? '');

                // Get provider name from the select option text
                var providerName = $("#employeeId option[value='" + data.employeeId + "']").text().trim();
                var branchName   = $("#clinicId option[value='" + data.clinicId + "']").text().trim();

                $("#detail_provider").val(providerName || data.employeeId);
                $("#detail_branch").val(branchName || data.clinicId);

                // Show the details modal
                $("#closeTimeDetailsModal").modal("show");
            }
        },
        error: function (err) {
            var errorMessage = err.responseJSON && err.responseJSON.message
                ? err.responseJSON.message
                : "An unexpected error occurred. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Access denied",
                text: errorMessage,
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
        },
    });
});

    employeCloseTimeTable.on("click", ".item-delete", function () {
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
                            employeCloseTimeTable.ajax.reload(null, false);

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
    
    $("#select_all").on("click", function () {
        var rows = employeCloseTimeTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#employe_close_time_table tbody").on("change", 'input[type="checkbox"]', function () {
        if (!this.checked) {
            var el = $("#select_all").get(0);
            if (el && el.checked && "indeterminate" in el) {
                el.indeterminate = true;
            }
        }
        updateSelectedCount();
    });

    $("#delete_selected").on("click", function () {
        var selectedIds = $('input[name="select_service"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
        console.log(selectedIds);
        if (selectedIds.length > 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this service?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $.ajax({
                        url: BASE_URL + "/delete-selected-xray-services",
                        method: "DELETE",
                        data: {
                            ids: selectedIds,
                        },
                        success: function (response) {
                            if (response.status === true) {
                                employeCloseTimeTable.ajax.reload(null, false);

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
                            console.error("Error fetching edit data:", err);
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
        } else {
            alert("No services selected");
        }
    });
});

function updateSelectedCount() {
    var selectedCount = $('input[name="select_service"]:checked').length;
    $("#selected_count").text(selectedCount);
    // alert(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
        $("#selected_count").text(selectedCount);
    } else {
        $("#bulk_select").hide();
    }
}

$(document).on("click", "#close_working_time_btn", function () {
    var formData = $("#close_time_form").serialize();
    var xrayServiceId = $("#close_time_id").val();
    var ajaxUrl = xrayServiceId
        ? BASE_URL + "/update-user-close-time/" + xrayServiceId
        : BASE_URL + "/user-close-time";
    var method = xrayServiceId ? "PUT" : "POST";

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
            }
            $("#largeModal").modal("hide"); // Hide modal on success
        },
        error: function (xhr, status, error) {
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
