$(document).ready(function () {
    $("#branch_stoke_transfer_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#branch_stoke_reciever_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    var startDateEle = $(".start_date");
    var endDateEle = $(".end_date");
    var dateErrorEle = $(".date_error");

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            maxDate: "today",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);
                if (startDate && endDate) {
                    var startMoment = moment(startDate);
                    var endMoment = moment(endDate);
                    var daysDifference = endMoment.diff(startMoment, "days");
                    if (daysDifference > 100) {
                        dateErrorEle.text(
                            "Date range shouldn’t exceed 100 days"
                        );
                    } else {
                        dateErrorEle.text("");
                    }
                }
            },
        });
    }

    $("#dateFilterType")
        .on("change", function () {
            let type = $(this).val();
            if (type === "between") {
                $("#dateFilterDiv").show();
                $("#lssthan_or_grtrthan_div").hide();
            } else if (type === "greaterthan") {
                $("#lssthan_or_grtrthan_div").show();
                $("#dateFilterDiv").hide();
            } else if (type === "lessthan") {
                $("#dateFilterDiv").hide();
                $("#lssthan_or_grtrthan_div").show();
            } else {
                $("#dateFilterDiv").hide();
                $("#lssthan_or_grtrthan_div").hide();
            }
        })
        .trigger("change"); // trigger to apply on page load
    const lssthanOrGrtrthanDate = $("#lssthan_or_grtrthan_date");
    if (lssthanOrGrtrthanDate.length) {
        lssthanOrGrtrthanDate.flatpickr({
            dateFormat: "m/d/Y",
            maxDate: "today"
        });
    }

    var branchStockTransferTable = $("#branch_stock_transfer_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/branchstocktransfer/branch-stock-receiver-lists", // URL for the server-side processing
            data: function (d) {
                d.sourceBranch = $("#sourceBranch").val();
                d.destinationBranch = $("#destinationBranch").val();
                d.status = $("#status").val();
                d.startDate = $("#startDate").val();
                d.endDate = $("#endDate").val();
                d.lssthanOrGrtrthanDate = $("#lssthan_or_grtrthan_date").val();
                d.dateFilterType = $("#dateFilterType").val();
            },
        },
        columns: [
            { data: "stockReceiverId", name: "stockReceiverId" },

            { data: "stockReceiverNo", name: "stockReceiverNo" },
            { data: "stockTransferNo", name: "stockTransferNo" },
            { data: "sourceBranchId", name: "sourceBranchId" },
            { data: "destinationBranchId", name: "destinationBranchId" },
            {
                data: null,
                name: "status",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    if (full.status == "on_processing") {
                        return "Stock transfer initiated";
                    } else if (full.status == "not_delivered") {
                        return "Not delivered";
                    } else if (full.status == "recieved") {
                        return "Stock received";
                    } else if (full.status == "rejected") {
                        return "Stock rejected";
                    }
                },
            },
            { data: "created_at", name: "created_at" },

            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL +
                        "/branchstocktransfer/edit-branch-stock-transfer/" +
                        full.stockTransferId;
                    var detailsUrl =
                        BASE_URL +
                        "/branchstocktransfer/detail-of-branch-stock-transfer/" +
                        full.stockTransferId;

                    var deleteUrl =
                        BASE_URL +
                        "/branchstocktransfer/delete-branch-stock-transfer/" +
                        full.stockTransferId;

                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        detailsUrl +
                        '" class="dropdown-item" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item  a4-pdf" data-stock-transfer-id="' +
                        full.stockTransferId +
                        '">A4 Pdf</a></li>' +
                        '<li><a href="javascript:;" class="dropdown-item  thermal-pdf" data-stock-transfer-id="' +
                        full.stockTransferId +
                        '">Thermal Pdf</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
    });

    $("#stockRecieverSearchBtn").on("click", function () {
        branchStockTransferTable.ajax.reload();
    });

    branchStockTransferTable.on("click", ".item-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#xrayServiceModal").modal("show");
                    $("#xray-service_form_footer").show();
                    $("#xray_service_header").text("Update Xray Service");

                    // $('#service_form').find('input, textarea, select, button').prop('disabled', true);
                    $("#xray_service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", false);
                    $("#xray_service_id").val(response.data.serviceId);
                    $(".xray-service-code").val(response.data.serviceCode);
                    // alert(response.data.categoryId);
                    $(".xray-service-name-en").val(
                        response.data.serviceName_en
                    );
                    $(".xray-service-name-ar").val(
                        response.data.serviceName_ar
                    );
                    $(".xray-category-id").val(response.data.categoryId);
                    $(".xray-tax-id").val(response.data.taxId);
                    $(".xray-cost").val(response.data.cost);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    branchStockTransferTable.on("click", ".item-delete", function () {
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
                            xrayTable.ajax.reload(null, false);

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
    });

    branchStockTransferTable.on("click", ".item-details", function () {
        var editUrl = $(this).data("id");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#xrayServiceModal").modal("show");
                    $("#xray-service_form_footer").hide();
                    $("#xray_service_header").text("Details Of Xray Service");

                    console.log(response.data.serviceName_en);
                    // $('#service_form').find('input, textarea, select, button').prop('disabled', true);
                    $("#xray_service_form")
                        .find("input, textarea, select, button")
                        .prop("disabled", true);
                    $("#xray_service_id").val(response.data.serviceId);
                    $(".xray-service-code").val(response.data.serviceCode);

                    $(".xray-service-name-en").val(
                        response.data.serviceName_en
                    );
                    $(".xray-service-name-ar").val(
                        response.data.serviceName_ar
                    );
                    $(".xray-category-id").val(response.data.categoryId);
                    $(".xray-tax-id").val(response.data.taxId);
                    $(".xray-cost").val(response.data.cost);

                    // $("#createServiceBtn").hide();
                }
            },
            error: function (err) {
                console.error("Error fetching edit data:", err);
            },
        });
    });

    $("#select_all").on("click", function () {
        var rows = xrayTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    $("#xray_table tbody").on("change", 'input[type="checkbox"]', function () {
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
                                branchStockTransferTable.ajax.reload(
                                    null,
                                    false
                                );

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
 $("#branch_stock_transfer_table").on("click", ".thermal-pdf", function () {
        var selectedValue = $(this).data("stock-transfer-id");
        const url =
            invoiceThermalPrintUrl +
            "?invoiceId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });
$("#branch_stock_transfer_table").on("click", ".a4-pdf", function () {
        var selectedValue = $(this).data("stock-transfer-id");
        const url =
            invoiceA4PrintUrl +
            "?invoiceId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });
