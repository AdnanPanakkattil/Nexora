$(document).ready(function () {
    $("#purchase_main_menu").addClass("active open menu-item-animating");
    $("#purchase_return_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    

    var purchaseReturnTable = $("#purchase_return_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/purchase/purchase-return-lists",
        columns: [
            // {
            //     data: "checkbox",
            //     name: "checkbox",
            //     orderable: false,
            //     searchable: false,
            //     render: function (data, type, full, meta) {
            //         return (
            //             '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_service" value="' +
            //             full.purchase_order_id +
            //             '">'
            //         );
            //     },
            // },
            { data: "purchaseReturnId", name: "purchaseReturnId" },
            { data: "purchaseReturnNo", name: "purchaseReturnNo" },
            { data: "referenceNumber", name: "referenceNumber" },
            { data: "returnNumber", name: "returnNumber" },


            { data: "poNo", name: "poNo" },
            { data: "purchaseNumber", name: "purchaseNumber" },

            
            { data: "vendor_name_en", name: "vendor_name_en" },
            { data: "returnDate", name: "returnDate" },
            { data: "returnVatAmount", name: "returnVatAmount" },
            { data: "returnTotalDiscountAmount", name: "returnTotalDiscountAmount" },


            
            { data: "returnAmountWithVat", name: "returnAmountWithVat" },
            
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl = BASE_URL + "/purchase/edit-purchase-return/" + full.purchaseReturnId;
                    var detailsUrl = BASE_URL + "/purchase/detail-of-purchase-return/" + full.purchaseReturnId;
                    var deleteUrl = BASE_URL + "/purchase/delete-purchase-return/" + full.purchaseReturnId;


                    return ('<div class="d-inline-block">' +
                                '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>'+
                                '<ul class="dropdown-menu dropdown-menu-end m-0">'+
                                    '<li><a href="' + editUrl + '" class="dropdown-item" data-id="' + editUrl + '">Edit</a></li>'+
                                    '<div class="dropdown-divider"></div>'+
                                    '<li><a href="' + detailsUrl + '" class="dropdown-item" data-id="' + detailsUrl + '">Details</a></li>'+
                                    '<div class="dropdown-divider"></div>' +
                                    '<li><a href="javascript:;" class="dropdown-item text-danger delete-purchase-return" data-id="'+ deleteUrl +'">Delete</a></li>' +
                                    '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item a4-pdf" data-invoice-id="' + full.purchaseReturnId + '">A4 Pdf</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item thermal-pdf" data-invoice-id="' + full.purchaseReturnId + '">Thermal Pdf</a></li>' +
                                '</ul>'+
                            '</div>'
                    );
                },
            },
        ],
    });

    

    purchaseReturnTable.on("click", ".item-edit", function () {
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

    purchaseReturnTable.on("click", ".delete-purchase-return", function () {
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
                            purchaseReturnTable.ajax.reload(null, false);
                            
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

    purchaseReturnTable.on("click", ".item-details", function () {
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
                                purchaseReturnTable.ajax.reload(null, false);

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


    $("#purchase_return_table").on("click", ".thermal-pdf", function () {
        var selectedValue = $(this).data("invoice-id");


        const url =
            purchaseReturnThermalPrintUrl +
            "?purchaseReturnId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });

    $("#purchase_return_table").on("click", ".a4-pdf", function () {
        var selectedValue = $(this).data("invoice-id");

        const url =
            purchaseReturnA4PrintUrl +
            "?purchaseReturnId=" +
            encodeURIComponent(selectedValue);
        window.open(url, "_blank"); // Open URL in a new tab
    });
});

