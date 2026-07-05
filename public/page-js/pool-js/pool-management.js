$(document).ready(function () {
    $("#pool_main_menu").addClass("active open menu-item-animating");
    $("#pool_management_sub_menu").addClass("active");

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
            url: "/pre-authorization-lists-pool-management",
            // type: "POST",
            data: function (d) {
                d.payerId = $("#insurancePayer").val();
                d.startDate = $(".start_date").val();
                d.endDate = $(".end_date").val();
                d.clientId = $("#patientselect").val();
                d.status = $("#status").val();
            }
        },
        order: [[2, "desc"]],
        columns: [
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    if (row.status !== 'Pending') {
                        return '';
                    }
                    return '<input type="checkbox" class="dt-checkboxes form-check-input row-checkbox" name="select_service" value="' + row.preAuthorizationRequestId + '" data-client-id="' + row.clientId + '">';

                }
            },

            { data: "preAuthorizationRequestId", name: "preAuthorizationRequestId", visible: true },
            { data: "payerCode", name: "payerCode" },
            { data: "providerName", name: "providerName" },
            { data: "patientName", name: "patientName" },
            { data: "clientId", name: "clientId" },
            { data: "status", name: "status" },
            { data: "created_at", name: "created_at" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/edit-pre-authorization-request/" +
                        full.preAuthorizationRequestId;
                    var detailsUrl =
                        BASE_URL +
                        "/detail-of-pre-authorization-request/" +
                        full.preAuthorizationRequestId;

                    var deleteUrl =
                        BASE_URL +
                        "/delete-pre-authorization-request/" +
                        full.preAuthorizationRequestId;

                    var communicationUrl = BASE_URL + "/communication-batch/" + full.preAuthorizationRequestId;
                    var viewUrl = BASE_URL + "/view-claim-request/" + full.preAuthorizationRequestId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li>' +
                        '<a href="' + viewUrl + '" class="dropdown-item" data-id="' + full.preAuthorizationRequestId + '">View</a>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        detailsUrl +
                        '" class="dropdown-item" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger delete-purchase" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li>' +
                        '<a href="' + communicationUrl + '" class="dropdown-item" data-id="' + full.preAuthorizationRequestId + '">Communication</a>' +
                        "</ul>" +
                        "</div>"
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


    $("#batch_save_btn").on("click", function (e) {
        e.preventDefault();
        const formElement = document.getElementById("batch_form");
        const formData = new FormData(formElement);
        const selectedItems = checkedItems;
        const insurancePayerId = $("#insurancePayer").val();
        const selectedIds = selectedItems.map(item => item.preAuthorizationRequestId);
        const clientIds = selectedItems.map(item => item.clientId);
        formData.append("insurancePayerId", insurancePayerId);
        selectedItems.forEach((item, index) => {
            formData.append(`items[${index}][preAuthorizationRequestId]`, item.preAuthorizationRequestId);
            formData.append(`items[${index}][clientId]`, item.clientId);
        });

        selectedIds.forEach(id => formData.append("ids[]", id));
        clientIds.forEach(id => formData.append("clientIds[]", id));

        $.ajax({
            url: BASE_URL + "/set-batch-pool",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: "Batch processed successfully.",
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
            error: function (xhr) {
                $(".error-text").text("");
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            }
        });
    });


    $('#batch_btn').on('click', function () {
        $('.error-text').text('');
        $('#batch_form')[0].reset();
        $('#batchModal').modal('show');
    });

});


