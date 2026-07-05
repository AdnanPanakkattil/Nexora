$(document).ready(function () {
    $("#claim_main_menu").addClass("active open menu-item-animating");
    $("#claims_management_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range");
    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates[0] != undefined) {
                    startDateEle.val(moment(selectedDates[0]).format("MM/DD/YYYY"));
                }
                if (selectedDates[1] != undefined) {
                    endDateEle.val(moment(selectedDates[1]).format("MM/DD/YYYY"));
                }
                rangePickr.trigger("change").trigger("keyup");
                // appointmentReportTable.ajax.reload();
            }
        });
    }


    $('#patientselect').select2({
        placeholder: 'Search Patient',
        allowClear: true,
        minimumInputLength: 2,
        ajax: {
            url: BASE_URL + "/search-patient",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    query: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        // console.log(item);
                        return {
                            id: item.id,
                            text: item.text
                        };
                    })
                };
            },
            cache: true
        }
    });


    let table = $("#pre_authorization_requests_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/batch-pool-pre-authorization",
            // type: "POST",
            data: function (d) {
                d.payerId = $("#insurancePayer").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.clientId = $("#patientselect").val();
                d.status = $("#status").val();
                d.batchId = $("#batchId").val();
            }
        },
        order: [[2, "desc"]],
        columns: [
            { data: "poolId", name: "poolId", visible: true },
            { data: "payerCode", name: "payerCode" },
            { data: "nameEn", name: "nameEn" },
            { data: "status", name: "status" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var viewUrl = BASE_URL + "/view-pool-batch-details/" + full.poolId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                        '<i class="ti ti-dots-vertical ti-md"></i>' +
                        '</a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li>' +
                        '<a href="javascript:;" class="dropdown-item edit-batch" data-id="' + full.poolId + '">Edit</a>' +
                        '</li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li>' +
                        '<a href="' + viewUrl + '" class="dropdown-item" data-id="' + full.poolId + '">View</a>' +
                        '</li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li>' +
                        '<a href="javascript:;" class="dropdown-item text-danger delete-batch" data-id="' + full.poolId + '">Delete</a>' +
                        '</li>' +
                        '</ul>' +
                        '</div>'
                    );
                },

            },

        ],
    });

    $("#pre_authorization_search_btn").click(function () {
        table.ajax.reload();
    });

    let checkedItems = [];

    $("#select_all_item").on("click", function () {
        var rows = table.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $("input.row-checkbox", rows).each(function () {
            $(this).prop("checked", isChecked);
            var itemId = this.value;
            var clientId = $(this).data("client-id");

            if (isChecked) {
                var existingItem = checkedItems.find(item => item.preAuthorizationRequestId === itemId);
                if (!existingItem) {
                    checkedItems.push({
                        preAuthorizationRequestId: itemId,
                        clientId: clientId
                    });
                }
            } else {
                checkedItems = checkedItems.filter((item) => item.preAuthorizationRequestId !== itemId);
            }
        });

        updateFooter();
    });

    $("#pre_authorization_requests_table tbody").on(
        "change",
        'input.row-checkbox',
        function () {
            var itemId = this.value;
            var clientId = $(this).data("client-id");

            if (this.checked) {
                var existingItem = checkedItems.find(item => item.preAuthorizationRequestId === itemId);
                if (!existingItem) {
                    checkedItems.push({
                        preAuthorizationRequestId: itemId,
                        clientId: clientId
                    });
                }
            } else {
                checkedItems = checkedItems.filter((item) => item.preAuthorizationRequestId !== itemId);
            }

            var allCheckboxes = $('input.row-checkbox', table.rows({ page: "current" }).nodes());
            var allChecked = allCheckboxes.length === allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_item").get(0);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = !allChecked && allCheckboxes.filter(":checked").length > 0;
            }

            updateFooter();
        }
    );

    function updateFooter() {
        var itemCount = checkedItems.length;
        if (itemCount > 0) {
            $(".footer").show();
            $(".itemz h4").text(itemCount);
        } else {
            $(".footer").hide();
            $(".itemz h4").text(0);
        }
    }



    $('#batch_btn').on('click', function () {

        $('.error-text').text('');
        $('#batch_form')[0].reset();
        $('#batchModal').modal('show');
    });

    $(document).on("click", ".edit-batch", function () {
        let poolId = $(this).data("id");
        $("#batchModal").modal("show");
        $('#batch_form')[0].reset();
        $.ajax({
            url: BASE_URL + "/get-pool-batch-details/" + poolId, // create this route
            method: "GET",
            success: function (response) {

                const pool = response.pool;

                $("#name_en").val(pool.nameEn);
                $("#name_ar").val(pool.nameAr);
                $("#poolId").val(pool.poolId);
            },
            error: function (xhr) {
                console.error("Error fetching data:", xhr);
                Swal.fire("Error", "Could not load data", "error");
            }
        });
    });




    $("#batch_update_btn").on("click", function (e) {
        e.preventDefault();
        var formData = $("#batch_form").serialize();
        var poolId = $("#poolId").val();

        $.ajax({
            url: BASE_URL + "/update-pool-batch/" + poolId,
            type: "PUT",
            data: formData,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: "Batch updated successfully.",
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                    buttonsStyling: false
                }).then(() => {
                    $('#batchModal').modal('hide');
                    table.ajax.reload();
                    checkedItems = [];
                    updateFooter();
                });
            },
            error: function (error) {
                console.error("Batch process error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to process batch.",
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                    buttonsStyling: false
                });
            }
        });
    });


    $(document).on("click", ".delete-batch", function () {
        const claimId = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: BASE_URL + "/delete-batch/" + claimId,
                    type: "DELETE",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content") // CSRF token
                    },
                    success: function (response) {
                        Swal.fire({
                            icon: "success",
                            text: "The request has been deleted.",
                            timer: 1500,
                            showConfirmButton: false
                        });

                        // Reload DataTable
                        $("#pre_authorization_requests_table").DataTable().ajax.reload();
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: "Something went wrong. Please try again.",
                        });
                    }
                });
            }
        });
    });



});


