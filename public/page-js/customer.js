$(document).ready(function () {
    // Activate the Customer menu
    $("#customer_main_menu").addClass("active open menu-item-animating");
    $("#customer_sub_menu").addClass("active");

    // Set up CSRF token for AJAX requests
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Open the modal for adding a new Customer
    // $("#addNewCustomerBtn").click(function () {
    //     $("#customerModal").modal("show");
    //     $("#customerModal input").prop('disabled', false);
    //     $("#customerModal textarea").prop('disabled', false);
    //     $("#customer_b2b_group_form_button").show();
    //     $("#customer_b2c_group_form_button").show();
    //     $("#common_customer_group_header").text("Add B2B Customer");
    //     $("#customertype").text("B2B");
    //     $("#customer_b2b_btn").text("Save");
    //     $("#customer_b2c_btn").text("Save");
    //     $("#b2b_customer_group_form")[0].reset();
    //     $("#b2c_customer_group_form")[0].reset();
    //     clearErrors();
    //     $("#customer_id").val('');
    //     $("#b2bcustomer").show();
    //     $("#b2ccustomer").hide();
    //     $(".switch-input").prop("checked", false);
    //     $('#customertype_checkbox').prop('disabled', true);
    // });
    $("#addNewCustomerBtn").click(function () {
        $("#customerModal").modal("show");
        $("#customerModal input").prop("disabled", false);
        $("#customerModal textarea").prop("disabled", false);
        $("#customer_b2b_group_form_button").show();
        $("#customer_b2c_group_form_button").show();
        $("#common_customer_group_header").text("Add B2C Customer");
        $("#customertype").text("B2B");
        $("#customer_b2b_btn").text("Save");
        $("#customer_b2c_btn").text("Save");
        $("#b2b_customer_group_form")[0].reset();
        $("#b2c_customer_group_form")[0].reset();
        clearErrors();
        $("#customer_id").val("");
        $("#b2bcustomer").show();
        $("#b2ccustomer").hide();
        $(".switch-input").prop("checked", false);

        // Ensure the checkbox is checked and disabled
        $("#customertype_checkbox").prop("checked", true);
        $("#b2bcustomer").hide();
        $("#b2ccustomer").show();
        $("#customertype").text("B2C");
    });

    // Handle switching between B2B and B2C customer types when the checkbox is clicked
    $(".switch-input").change(function () {
        if ($(this).prop("checked")) {
            $("#b2bcustomer").hide();
            $("#b2ccustomer").show();
            $("#common_customer_group_header").text("Add B2C Customer");
            $("#customertype").text("B2C");
        } else {
            $("#b2bcustomer").show();
            $("#b2ccustomer").hide();
            $("#common_customer_group_header").text("Add B2B Customer");
            $("#customertype").text("B2B");
        }
    });

    let checkedCustomers = [];
    // Initialize DataTable
    var customerTable = $("#customer_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: BASE_URL + "/customer",
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_customer" value="' +
                        full.regularCustomerId +
                        '">'
                    );
                },
            },
            {
                data: "customerName",
                name: "customerName",
            },
            {
                data: "address",
                name: "address",
            },
            {
                data: "customerNo",
                name: "customerNo",
            },
            {
                data: "mobileNumber",
                name: "mobileNumber",
            },
            {
                data: "phone",
                name: "phone",
            },
            {
                data: "vatNumber",
                name: "vatNumber",
            },
            {
                data: "dueDate",
                name: "dueDate",
            },
            {
                data: "customerType",
                name: "customerType",
            },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var detailsUrl =
                        BASE_URL +
                        "/details-customer/" +
                        full.regularCustomerId;
                    var editUrl =
                        BASE_URL + "/edit-customer/" + full.regularCustomerId;
                    var deleteUrl =
                        BASE_URL + "/delete-customer/" + full.regularCustomerId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="javascript:;" class="dropdown-item text-primary customer-details" data-id="' +
                        detailsUrl +
                        '">Details</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item customer-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger customer-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
        drawCallback: function () {
            var rows = customerTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedCustomers.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
    });

    // Handle "Select All" checkbox
    $("#select_all_customer").on("click", function () {
        var rows = customerTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;
        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var regularCustomerId = this.value;
            if (isChecked) {
                if (!checkedCustomers.includes(regularCustomerId)) {
                    checkedCustomers.push(regularCustomerId);
                }
            } else {
                checkedCustomers = checkedCustomers.filter(
                    (id) => id !== regularCustomerId,
                );
            }
        });
        updateFooter();
    });

    // Handle individual checkbox change
    $("#customer_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var regularCustomerId = this.value;

            if (this.checked) {
                if (!checkedCustomers.includes(regularCustomerId)) {
                    checkedCustomers.push(regularCustomerId);
                }
            } else {
                checkedCustomers = checkedCustomers.filter(
                    (id) => id !== regularCustomerId,
                );
            }
            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                customerTable.rows({ page: "current" }).nodes(),
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_customer").get(0);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate =
                    !allChecked && allCheckboxes.filter(":checked").length > 0;
            }
            updateFooter();
        },
    );

    // Function to update footer content
    function updateFooter() {
        var footer = $(".footer");
        var customerCount = checkedCustomers.length;
        if (customerCount > 0) {
            footer.show();
            $(".itemz h4").text(customerCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedCustomers").on("click", function (e) {
        e.preventDefault();
        if (checkedCustomers.length === 0) {
            Swal.fire(
                "No Customers selected",
                "Please select at least one Customer to delete.",
                "warning",
            );
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected Customers as deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: BASE_URL + "/delete-selected-customer",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        regularCustomerIds: checkedCustomers,
                    },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                            customerTable.ajax.reload();
                            checkedCustomers = [];
                            updateFooter();
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: function (xhr) {
                        Swal.fire(
                            "Error!",
                            "Something went wrong. Please try again.",
                            "error",
                        );
                    },
                });
            }
        });
    });

    function showError(field, message) {
        $("." + field + "_error").text(message);
    }

    // Save or update customer b2b with front-end validation
    $("#customer_b2b_btn").click(function () {
        clearErrors();
        var regularCustomerId = $("#b2b_customer_id").val();
        var customerCode = $("#b2b_customer_code").val().trim();
        var customerNameEn = $("#b2b_customer_name_en").val().trim();
        var customerNameAr = $("#b2b_customer_name_ar").val().trim();
        var customerMobile = $("#b2b_customer_mobile").val();
        var customerPhone = $("#b2b_customer_phone").val();
        var customeridNational = $("#b2b_idNational").val().trim();
        var customeridNationalType = $("#b2b_idNationalType").val().trim();
        var customerDueDate = $("#b2b_customer_due_date").val().trim();
        var customerAddress = $("#b2b_customer_address").val().trim();
        var customerAddressAr = $("#b2b_customer_address_ar").val().trim();

        var errors = {};

        var hasError = false;

        if (!customerNameEn) {
            showError(
                "b2b_customer_name_en",
                "Customer Name (English) is required.",
            );
            hasError = true;
        }

        if (!customerNameAr) {
            showError(
                "b2b_customer_name_ar",
                "Customer Name (Arabic) is required.",
            );
            hasError = true;
        }

        // if (!customerCode) {
        //     showError("b2b_customer_code", "Customer Code is required.");
        //     hasError = true;
        // }

        if (!customerMobile) {
            showError("b2b_customer_mobile", "Customer Mobile is required.");
            hasError = true;
        }

        if (!customerPhone) {
            showError("b2b_customer_phone", "Customer Phone is required.");
            hasError = true;
        }

        if (!customeridNational) {
            showError("b2b_idNational", "National ID is required.");
            hasError = true;
        }

        if (!customeridNationalType) {
            showError("b2b_idNationalType", "National ID Type is required.");
            hasError = true;
        }

        if (!customerDueDate) {
            showError(
                "b2b_customer_due_date",
                "Customer Due Date is required.",
            );
            hasError = true;
        }

        if (!customerAddress) {
            showError("b2b_customer_address", "Customer Address is required.");
            hasError = true;
        }

        if (!customerAddressAr) {
            showError(
                "b2b_customer_address_ar",
                "Customer Address (Arabic) is required.",
            );
            hasError = true;
        }

        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        if (hasError) return;

        var formData = $("#b2b_customer_group_form").serialize();
        var ajaxUrl = regularCustomerId
            ? BASE_URL + "/b2b-update-customer/" + regularCustomerId
            : BASE_URL + "/b2b-customer";
        var method = regularCustomerId ? "PUT" : "POST";
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                if (response.status === true) {
                    customerTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#customerModal").modal("hide");
                    customerTable.ajax.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    displayErrors(xhr.responseJSON.errors);
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "An unexpected error occurred.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
        });
    });

    // Save or update customer b2c with front-end validation
    $("#customer_b2c_btn").click(function () {
        clearErrors();
        var regularCustomerId = $("#b2c_customer_id").val();
        var customerCode = $("#b2c_customer_code").val().trim();
        var customerNameEn = $("#b2c_customer_name_en").val().trim();
        var customerNameAr = $("#b2c_customer_name_ar").val().trim();
        var customerMobile = $("#b2c_customer_mobile").val();
        var customerPhone = $("#b2c_customer_phone").val().trim();
        var customerDueDate = $("#b2c_customer_due_date").val().trim();
        var customeridNational = $("#b2c_idNational").val().trim();
        var customeridNationalType = $("#b2c_idNationalType").val().trim();
        var customerAddress = $("#b2c_customer_address").val().trim();
        var customerAddressAr = $("#b2c_customer_address_ar").val().trim();
        var errors = {};

        hasError = false;

        if (!customerNameEn) {
            showError(
                "b2c_customer_name_en",
                "Customer Name (English) is required.",
            );
            hasError = true;
        }

        if (!customerNameAr) {
            showError(
                "b2c_customer_name_ar",
                "Customer Name (Arabic) is required.",
            );
            hasError = true;
        }

        if (!customerMobile) {
            showError("b2c_customer_mobile", "Customer Mobile is required.");
            hasError = true;
        }

        if (!customerPhone) {
            showError("b2c_customer_phone", "Customer Phone is required.");
            hasError = true;
        }

        if (!customeridNational) {
            showError("b2c_idNational", "National ID is required.");
            hasError = true;
        }

        if (!customeridNationalType) {
            showError("b2c_idNationalType", "National ID Type is required.");
            hasError = true;
        }

        // Display validation errors if any
        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        if (hasError) return;

        var formData = $("#b2c_customer_group_form").serialize();
        var ajaxUrl = regularCustomerId
            ? BASE_URL + "/b2c-update-customer/" + regularCustomerId
            : BASE_URL + "/b2c-customer";
        var method = regularCustomerId ? "PUT" : "POST";
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,
            success: function (response) {
                if (response.status === true) {
                    customerTable.ajax.reload(null, false);
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    });
                    $("#customerModal").modal("hide");
                    customerTable.ajax.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
                if (xhr.status === 422) {
                    displayErrors(xhr.responseJSON.errors);
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "An unexpected error occurred.",
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
        });
    });

    // details Customer
    $("#customer_table").on("click", ".customer-details", function () {
        var detailsUrl = $(this).data("id");
        $.ajax({
            url: detailsUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#customerModal").modal("show");
                    $("#customerModal input").prop("disabled", true);
                    $("#customerModal textarea").prop("disabled", true);
                    $("#customer_b2b_group_form_button").hide();
                    $("#customer_b2c_group_form_button").hide();
                    if (response.data.customerType == "b2b") {
                        $("#b2ccustomer").hide();
                        $("#b2bcustomer").show();
                        $("#common_customer_group_header").text(
                            "View B2B Customer",
                        );
                        $("#customertype").text("B2B");

                        $("#customertype_checkbox")
                            .prop("disabled", true)
                            .prop("checked", false);
                        $("#customerb2c").addClass("active");
                        $("#customerb2b").removeClass("active");
                        $("#b2c_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");

                        $("#b2b_customer_id").val(
                            response.data.regularCustomerId,
                        );
                        $("#b2b_customer_code").val(
                            response.data.customerNo || "",
                        );
                        $("#b2b_idNational").val(
                            response.data.idNational || "",
                        );
                        $("#b2b_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");
                        $("#b2b_customer_name_en").val(
                            response.data.customerName || "",
                        );
                        $("#b2b_customer_name_ar").val(
                            response.data.customerNameArabic || "",
                        );
                        $("#b2b_customer_addl_no").val(
                            response.data.addlNo || "",
                        );
                        $("#b2b_customer_addl_no_ar").val(
                            response.data.addlNoArabic || "",
                        );
                        $("#b2b_customer_building_no").val(
                            response.data.buildingNo || "",
                        );
                        $("#b2b_customer_building_no_ar").val(
                            response.data.buildingArabic || "",
                        );
                        $("#b2b_customer_street").val(
                            response.data.streetName || "",
                        );
                        $("#b2b_customer_street_ar").val(
                            response.data.streetArabic || "",
                        );
                        $("#b2b_customer_city").val(response.data.city || "");
                        $("#b2b_customer_city_ar").val(
                            response.data.cityArabic || "",
                        );
                        $("#b2b_customer_district").val(
                            response.data.district || "",
                        );
                        $("#b2b_customer_district_ar").val(
                            response.data.districtArabic || "",
                        );
                        $("#b2b_customer_country").val(
                            response.data.country || "",
                        );
                        $("#b2b_customer_country_ar").val(
                            response.data.countryArabic || "",
                        );
                        $("#b2b_customer_postal_code").val(
                            response.data.postalCode || "",
                        );
                        $("#b2b_customer_postal_code_ar").val(
                            response.data.postalArabic || "",
                        );
                        $("#b2b_customer_vat").val(
                            response.data.vatNumber || "",
                        );
                        $("#b2b_customer_vat_ar").val(
                            response.data.vatNoArabic || "",
                        );
                        $("#b2b_customer_mobile").val(
                            response.data.mobileNumber || "",
                        );
                        $("#b2b_customer_phone").val(response.data.phone || "");
                        $("#b2b_customer_due_date").val(
                            response.data.dueDate || "",
                        );
                        $("#b2b_customer_address").val(
                            response.data.address || "",
                        );
                        $("#b2b_customer_address_ar").val(
                            response.data.addressArabic || "",
                        );
                    } else if (response.data.customerType == "b2c") {
                        $("#b2bcustomer").hide();
                        $("#b2ccustomer").show();
                        $("#common_customer_group_header").text(
                            "View B2C Customer",
                        );
                        $("#customertype").text("B2C");

                        $("#customertype_checkbox")
                            .prop("disabled", true)
                            .prop("checked", true);
                        $("#customerb2c").addClass("active");
                        $("#customerb2b").removeClass("active");

                        $("#b2c_customer_id").val(
                            response.data.regularCustomerId,
                        );
                        $("#b2c_customer_code").val(
                            response.data.customerNo || "",
                        );
                        $("#b2c_idNational").val(
                            response.data.idNational || "",
                        );
                        $("#b2c_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");
                        $("#b2c_customer_name_en").val(
                            response.data.customerName || "",
                        );
                        $("#b2c_customer_name_ar").val(
                            response.data.customerNameArabic || "",
                        );
                        $("#b2c_customer_mobile").val(
                            response.data.mobileNumber || "",
                        );
                        $("#b2c_customer_phone").val(response.data.phone || "");
                        $("#b2c_customer_due_date").val(
                            response.data.dueDate || "",
                        );
                        $("#b2c_customer_address").val(
                            response.data.address || "",
                        );
                        $("#b2c_customer_address_ar").val(
                            response.data.addressArabic || "",
                        );
                    }
                    clearErrors();
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (err) {
                Swal.fire({
                    icon: "error",
                    text: "Failed to fetch Customer data.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    });

    // Edit Customer
    $("#customer_table").on("click", ".customer-edit", function () {
        var editUrl = $(this).data("id");
        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    $("#customerModal").modal("show");
                    $("#customerModal input").prop("disabled", false);
                    $("#customerModal textarea").prop("disabled", false);
                    $("#customer_b2b_group_form_button").show();
                    $("#customer_b2c_group_form_button").show();
                    if (response.data.customerType == "b2b") {
                        $("#b2ccustomer").hide();
                        $("#b2bcustomer").show();
                        $("#common_customer_group_header").text(
                            "Update B2B Customer",
                        );
                        $("#customer_b2b_btn").text("Update");
                        $("#customertype").text("B2B");
                        $("#customertype_checkbox")
                            .prop("disabled", true)
                            .prop("checked", false);
                        $("#customerb2c").addClass("active");
                        $("#customerb2b").removeClass("active");
                        $("#b2c_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");

                        $("#b2b_customer_id").val(
                            response.data.regularCustomerId,
                        );
                        $("#b2b_customer_code").val(
                            response.data.customerNo || "",
                        );
                        $("#b2b_idNational").val(
                            response.data.idNational || "",
                        );
                        $("#b2b_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");
                        $("#b2b_customer_name_en").val(
                            response.data.customerName || "",
                        );
                        $("#b2b_customer_name_ar").val(
                            response.data.customerNameArabic || "",
                        );
                        $("#b2b_customer_addl_no").val(
                            response.data.addlNo || "",
                        );
                        $("#b2b_customer_addl_no_ar").val(
                            response.data.addlNoArabic || "",
                        );
                        $("#b2b_customer_building_no").val(
                            response.data.buildingNo || "",
                        );
                        $("#b2b_customer_building_no_ar").val(
                            response.data.buildingArabic || "",
                        );
                        $("#b2b_customer_street").val(
                            response.data.streetName || "",
                        );
                        $("#b2b_customer_street_ar").val(
                            response.data.streetArabic || "",
                        );
                        $("#b2b_customer_city").val(response.data.city || "");
                        $("#b2b_customer_city_ar").val(
                            response.data.cityArabic || "",
                        );
                        $("#b2b_customer_district").val(
                            response.data.district || "",
                        );
                        $("#b2b_customer_district_ar").val(
                            response.data.districtArabic || "",
                        );
                        $("#b2b_customer_country").val(
                            response.data.country || "",
                        );
                        $("#b2b_customer_country_ar").val(
                            response.data.countryArabic || "",
                        );
                        $("#b2b_customer_postal_code").val(
                            response.data.postalCode || "",
                        );
                        $("#b2b_customer_postal_code_ar").val(
                            response.data.postalArabic || "",
                        );
                        $("#b2b_customer_vat").val(
                            response.data.vatNumber || "",
                        );
                        $("#b2b_customer_vat_ar").val(
                            response.data.vatNoArabic || "",
                        );
                        $("#b2b_customer_mobile").val(
                            response.data.mobileNumber || "",
                        );
                        $("#b2b_customer_phone").val(response.data.phone || "");
                        $("#b2b_customer_due_date").val(
                            response.data.dueDate || "",
                        );
                        $("#b2b_customer_address").val(
                            response.data.address || "",
                        );
                        $("#b2b_customer_address_ar").val(
                            response.data.addressArabic || "",
                        );
                        clearErrors();
                    } else if (response.data.customerType == "b2c") {
                        $("#b2bcustomer").hide();
                        $("#b2ccustomer").show();
                        $("#common_customer_group_header").text(
                            "Update B2C Customer",
                        );
                        $("#customer_b2c_btn").text("Update");
                        $("#customertype").text("B2C");
                        $("#customertype_checkbox")
                            .prop("disabled", true)
                            .prop("checked", true);
                        $("#customerb2c").addClass("active");
                        $("#customerb2b").removeClass("active");

                        $("#b2c_customer_id").val(
                            response.data.regularCustomerId,
                        );
                        $("#b2c_customer_code").val(
                            response.data.customerNo || "",
                        );
                        $("#b2c_idNational").val(
                            response.data.idNational || "",
                        );
                        $("#b2c_idNationalType")
                            .val(response.data.idNationalType || "")
                            .trigger("change");
                        $("#b2c_customer_name_en").val(
                            response.data.customerName || "",
                        );
                        $("#b2c_customer_name_ar").val(
                            response.data.customerNameArabic || "",
                        );
                        $("#b2c_customer_mobile").val(
                            response.data.mobileNumber || "",
                        );
                        $("#b2c_customer_phone").val(response.data.phone || "");
                        $("#b2c_customer_due_date").val(
                            response.data.dueDate || "",
                        );
                        $("#b2c_customer_address").val(
                            response.data.address || "",
                        );
                        $("#b2c_customer_address_ar").val(
                            response.data.addressArabic || "",
                        );
                        clearErrors();
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (err) {
                Swal.fire({
                    icon: "error",
                    text: "Failed to fetch Customer data.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    });

    // flatpickr("#b2b_customer_due_date", {
    //     dateFormat: "Y-m-d",
    //     allowInput: true,
    //     placeholder: "YYYY-MM-DD",
    // });

    // Initialize flatpickr for B2B due date
    flatpickr("#b2b_customer_due_date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        placeholder: "YYYY-MM-DD",
    });

    // Initialize flatpickr for B2C due date
    flatpickr("#b2c_customer_due_date", {
        dateFormat: "Y-m-d",
        allowInput: true,
        placeholder: "YYYY-MM-DD",
    });

    // Delete customer
    $("#customer_table").on("click", ".customer-delete", function () {
        var deleteUrl = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light",
            },
            buttonsStyling: false,
        }).then(function (result) {
            if (result.isConfirmed) {
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        if (response.status === true) {
                            customerTable.ajax.reload(null, false);
                            Swal.fire({
                                icon: "success",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-success",
                                },
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: response.message,
                                customClass: {
                                    confirmButton: "btn btn-danger",
                                },
                            });
                        }
                    },
                    error: function (err) {
                        Swal.fire({
                            icon: "error",
                            text: "Failed to delete customer.",
                            customClass: { confirmButton: "btn btn-danger" },
                        });
                    },
                });
            }
        });
    });

    // Function to clear backend error messages
    function clearErrors() {
        $(".error-text").text("");
        $(".form-control").removeClass("is-invalid");
    }

    // Function to display backend validation errors
    function displayErrors(errors) {
        if (errors.b2b_customer_name_ar) {
            $(".b2b_customer_name_en_error").text(
                errors.b2b_customer_name_en[0],
            );
            $("#b2b_customer_name_en").addClass("is-invalid");
        }
        if (errors.b2b_customer_name_ar) {
            $(".b2b_customer_name_ar_error").text(errors.b2b_customer_name_ar);
            $("#b2b_customer_name_ar").addClass("is-invalid");
        }
        if (errors.b2b_customer_mobile) {
            $(".b2b_customer_mobile_error").text(errors.b2b_customer_mobile);
            $("#b2b_customer_mobile").addClass("is-invalid");
        }
        if (errors.b2b_customer_phone) {
            $(".b2b_customer_phone_error").text(errors.b2b_customer_phone);
            $("#b2b_customer_phone").addClass("is-invalid");
        }
        if (errors.b2b_customer_due_date) {
            $(".b2b_customer_due_date_error").text(
                errors.b2b_customer_due_date,
            );
            $("#b2b_customer_due_date").addClass("is-invalid");
        }

        if (errors.b2b_idNational) {
            $(".b2b_idNational_error").text(errors.b2b_idNational);
            $("#b2b_idNational").addClass("is-invalid");
        }

        if (errors.b2b_idNationalType) {
            $(".b2b_idNationalType_error").text(errors.b2b_idNationalType);
            $("#b2b_idNationalType").addClass("is-invalid");
        }

        if (errors.b2b_customer_code) {
            $(".b2b_customer_code").text(errors.b2b_customer_code);
            $("#b2b_customer_code").addClass("is-invalid");
        }

        if (errors.b2b_customer_address) {
            $(".b2b_customer_address_error").text(errors.b2b_customer_address);
            $("#b2b_customer_address").addClass("is-invalid");
        }
        if (errors.b2b_customer_address_ar) {
            $(".b2b_customer_address_ar_error").text(
                errors.b2b_customer_address_ar,
            );
            $("#b2b_customer_address_ar").addClass("is-invalid");
        }

        if (errors.b2c_customer_name_ar) {
            $(".b2c_customer_name_en_error").text(
                errors.b2c_customer_name_ar[0],
            );
            $("#b2c_customer_name_ar").addClass("is-invalid");
        }
        if (errors.b2c_customer_name_ar) {
            $(".b2c_customer_name_ar_error").text(errors.b2c_customer_name_ar);
            $("#b2c_customer_name_ar").addClass("is-invalid");
        }
        if (errors.b2c_customer_mobile) {
            $(".b2c_customer_mobile_error").text(errors.b2c_customer_mobile);
            $("#b2c_customer_mobile").addClass("is-invalid");
        }
        if (errors.b2c_customer_phone) {
            $(".b2c_customer_phone_error").text(errors.b2c_customer_phone);
            $("#b2c_customer_phone").addClass("is-invalid");
        }
        if (errors.b2c_customer_due_date) {
            $(".b2c_customer_due_date_error").text(
                errors.b2c_customer_due_date,
            );
            $("#b2c_customer_due_date").addClass("is-invalid");
        }

        if (errors.b2c_idNational) {
            $(".b2c_idNational_error").text(errors.b2c_idNational);
            $("#b2c_idNational").addClass("is-invalid");
        }

        if (errors.b2c_idNationalType) {
            $(".b2c_idNationalType_error").text(errors.b2c_idNationalType);
            $("#b2c_idNationalType").addClass("is-invalid");
        }

        if (errors.b2c_customer_code) {
            $(".b2c_customer_code").text(errors.b2c_customer_code);
            $("#b2c_customer_code").addClass("is-invalid");
        }

        if (errors.b2c_customer_address) {
            $(".b2c_customer_address_error").text(errors.b2c_customer_address);
            $("#b2c_customer_address").addClass("is-invalid");
        }
        if (errors.b2c_customer_address_ar) {
            $(".b2c_customer_address_ar_error").text(
                errors.b2c_customer_address_ar,
            );
            $("#b2c_customer_address_ar").addClass("is-invalid");
        }
    }

    // Function to display front-end validation errors
    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];
                let inputField = $("#" + field);

                inputField.next(".invalid-feedback").remove();

                inputField.addClass("is-invalid");

                let errorDiv = $("<div>")
                    .addClass("invalid-feedback")
                    .text(errorMessage);
            }
        }
    }

    // Remove Validation Error After Entering The Input Values
    $("#b2b_customer_group_form input,#b2b_customer_group_form textarea").on(
        "input",
        function () {
            var inputField = $(this);
            inputField.removeClass("is-invalid");
            inputField.next(".invalid-feedback").remove();
        },
    );

    // Remove Validation Error After Selecting The Select Option Values
    $("#b2b_customer_group_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    // Remove Validation Error After Entering The Input Values
    $("#b2c_customer_group_form input,#b2c_customer_group_form textarea").on(
        "input",
        function () {
            var inputField = $(this);
            inputField.removeClass("is-invalid");
            inputField.next(".invalid-feedback").remove();
        },
    );

    // Remove Validation Error After Selecting The Select Option Values
    $("#b2c_customer_group_form select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });
});
$('#b2b_customer_name_en,#b2c_customer_name_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#b2b_customer_name_ar,#b2c_customer_name_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});