// sales-invoice print design
if (typeof Swal === 'undefined') {
    console.error('SweetAlert is not loaded!');
}

// SALES INVOICE SAVE FUNCTION
$(document).on("click", "#sales_invoice_print_design_save_btn", function (e) {
    e.preventDefault();

    let formData = new FormData($("#sales_invoice_full_form")[0]);

    let applyAll = $("#sales_invoice_print_design_apply_all_switch").is(":checked") ? 1 : 0;
    formData.append("apply_all", applyAll);

    let saveBtn = $(this);
    let originalHtml = saveBtn.html();
    saveBtn.html('<i class="ti ti-loader me-1"></i> Saving...').prop('disabled', true);
    toggleLoader("invoice-save", true);

    $.ajax({
        url: BASE_URL + "/print-settings/sales-invoice-print-design",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },

    success: function (response) {
        toggleLoader("invoice-save", false, function() {
            saveBtn.html(originalHtml).prop('disabled', false);

            if (response.status) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message || response.msg,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(() => {
                    reloadSalesPrintDesignData();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.msg || 'Something went wrong',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
        },
        error: function (xhr) {
        toggleLoader("invoice-save", false, function() {
            saveBtn.html(originalHtml).prop('disabled', false);

            let errorMessage = "Something went wrong.";
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            });
        }
    });
});

// reload sales data after save
function reloadSalesPrintDesignData() {
    toggleLoader("invoice-reload", true);
    $.get("/invoice-print-design/all", function (response) {
    toggleLoader("invoice-reload", false, function() {
        if (response.status) {
            printSettingsData = response.data;

            let applyAll = $("#sales_invoice_print_design_apply_all_switch").is(":checked");
            if (applyAll) {
                if (printSettingsData?.global_sales_invoice) {
                    fillSalesForm(printSettingsData.global_sales_invoice);
                }
            } else {
                let branchId = $("#sales_branchSelect").val();
                if (branchId) {
                    let branchDesign = printSettingsData?.branch_sales_invoice?.find(x => x.clinicId == branchId);
                    if (branchDesign) {
                        fillSalesForm(branchDesign);
                    }
                    }
                }
            }
        });
    }).fail(function () {
        toggleLoader("invoice-reload", false);
    });
}

// sales live preview update
function liveUpdatePreviewSales() {
    let top = parseFloat($("#sales_margin_top").val()) || 0;
    let bottom = parseFloat($("#sales_margin_bottom").val()) || 0;
    let left = parseFloat($("#sales_margin_left").val()) || 0;
    let right = parseFloat($("#sales_margin_right").val()) || 0;
    let header = parseFloat($("#sales_margin_header").val()) || 0;
    let footer = parseFloat($("#sales_margin_footer").val()) || 0;

    // Calculate effective margins
    let effectiveTop = top + header;
    let effectiveBottom = bottom + footer;

    // Background image - fixed to full container
    $("#sales_invoicePreviewImage").css({
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "object-fit": "cover",
        "z-index": "0"
    });

    // Content overlay - respects all margins independently
    $("#salesInvoiceContentOverlay").css({
        "position": "absolute",
        "top": effectiveTop + "mm",
        "left": left + "mm",
        "right": right + "mm",
        "bottom": effectiveBottom + "mm",
        "padding": "0",
        "margin": "0",
        "box-sizing": "border-box",
        "overflow": "hidden",
        "background": "transparent",
        "z-index": "1",
        "width": "auto"  // Let right property handle width
    });
}

function fillSalesForm(settings) {
    if (!settings) {
        clearSalesForm();
        return;
    }

    let data = settings.design ?? settings;

    $("#sales_margin_header").val(data.margin_header ?? "");
    $("#sales_margin_footer").val(data.margin_footer ?? "");
    $("#sales_margin_left").val(data.margin_left ?? "");
    $("#sales_margin_right").val(data.margin_right ?? "");
    $("#sales_margin_top").val(data.margin_top ?? "");
    $("#sales_margin_bottom").val(data.margin_bottom ?? "");

    $("#sales_default_font").val(data.default_font ?? "");
    $("#sales_default_font_size").val(data.default_font_size ?? "");
    $("#sales_format").val(data.format ?? "");

    let bgUrl = data.background_image_url || null;
    if (bgUrl) {
        $("#sales_invoicePreviewImage").attr("src", bgUrl).show();
        if ($("#sales_existing_bg").length === 0) {
            $("#sales_invoice_full_form").append('<input type="hidden" name="existing_background_image_url" id="sales_existing_bg">');
        }
        $("#sales_existing_bg").val(bgUrl);

        let fileName = bgUrl.split('/').pop();
        $("#sales_bg_filename").text('Current Image: ' + fileName).show();
        $("#sales_remove_bg_btn").show();
    } else {
        $("#sales_invoicePreviewImage").hide();
        $("#sales_existing_bg").val("");
        $("#sales_bg_filename").hide();
        $("#sales_remove_bg_btn").hide();
    }
    // Reset file input to prevent re-uploading on subsequent saves
    $("#sales_invoice_full_form input[name='background_image']").val("");

    liveUpdatePreviewSales();
}

function clearSalesForm() {
    $("#sales_margin_top, #sales_margin_bottom, #sales_margin_left, #sales_margin_right, #sales_margin_header, #sales_margin_footer, #sales_default_font_size").val("");
    $("#sales_default_font").val("");
    $("#sales_format").val("");
    // Fully clear image: remove src, hide element, clear hidden field and filename label
    $("#sales_invoicePreviewImage").attr("src", "").hide();
    $("#sales_existing_bg").remove();
    $("#sales_bg_filename").hide();
    $("#sales_remove_bg_btn").hide();
    // Reset file input
    $("#sales_invoice_full_form input[name='background_image']").val("");
    liveUpdatePreviewSales();
}

// purchase-invoice print design
$(document).on("click", "#purchase_invoice_print_design_save_btn", function (e) {
    e.preventDefault();

    let formData = new FormData($("#purchase_invoice_full_form")[0]);

    let applyAll = $("#purchase_invoice_print_design_apply_all_switch").is(":checked") ? 1 : 0;
    formData.append("apply_all", applyAll);

    let saveBtn = $(this);
    let originalHtml = saveBtn.html();
    saveBtn.html('<i class="ti ti-loader me-1"></i> Saving...').prop('disabled', true);
    toggleLoader("invoice-save", true);

    $.ajax({
        url: BASE_URL + "/print-settings/purchase-invoice-design",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },

        success: function (response) {
        toggleLoader("invoice-save", false, function() {
            saveBtn.html(originalHtml).prop('disabled', false);

            if (response.status) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.message || response.msg,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(() => {
                    reloadPurchasePrintDesignData();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.msg || 'Something went wrong',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
        },
        error: function (xhr) {
        toggleLoader("invoice-save", false, function() {
            saveBtn.html(originalHtml).prop('disabled', false);

            let errorMessage = "Something went wrong.";
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            });
        }
    });
});

function reloadPurchasePrintDesignData() {
    toggleLoader("invoice-reload", true);
    $.get("/invoice-print-design/all", function (response) {
    toggleLoader("invoice-reload", false, function() {
        if (response.status) {
            printSettingsData = response.data;

            let applyAll = $("#purchase_invoice_print_design_apply_all_switch").is(":checked");
            if (applyAll) {
                if (printSettingsData?.global_purchase_invoice) {
                    fillPurchaseForm(printSettingsData.global_purchase_invoice);
                }
            } else {
                let branchId = $("#purchase_branchSelect").val();
                if (branchId) {
                    let branchDesign = printSettingsData?.branch_purchase_invoice?.find(x => x.clinicId == branchId);
                    if (branchDesign) {
                        fillPurchaseForm(branchDesign);
                    }
                    }
                }
            }
        });
    }).fail(function () {
        toggleLoader("invoice-reload", false);
    });
}

function liveUpdatePreviewPurchase() {
    let top = parseFloat($("#purchase_margin_top").val()) || 0;
    let bottom = parseFloat($("#purchase_margin_bottom").val()) || 0;
    let left = parseFloat($("#purchase_margin_left").val()) || 0;
    let right = parseFloat($("#purchase_margin_right").val()) || 0;

    let header = parseFloat($("#purchase_margin_header").val()) || 0;
    let footer = parseFloat($("#purchase_margin_footer").val()) || 0;

    // Calculate effective margins
    let effectiveTop = top + header;
    let effectiveBottom = bottom + footer;

    // Background image - fixed to full container
    $("#purchase_invoicePreviewImage").css({
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "object-fit": "cover",
        "z-index": "0"
    });

    // Content overlay - respects all margins independently
    $("#purchaseInvoiceContentOverlay").css({
        "position": "absolute",
        "top": effectiveTop + "mm",
        "left": left + "mm",
        "right": right + "mm",
        "bottom": effectiveBottom + "mm",
        "padding": "0",
        "margin": "0",
        "box-sizing": "border-box",
        "overflow": "hidden",
        "background": "transparent",
        "z-index": "1",
        "width": "auto"  // Let right property handle width
    });
}

function fillPurchaseForm(settings) {
    if (!settings) {
        clearPurchaseForm();
        return;
    }

    let data = settings.design ?? settings;

    $("#purchase_margin_header").val(data.margin_header ?? "");
    $("#purchase_margin_footer").val(data.margin_footer ?? "");
    $("#purchase_margin_left").val(data.margin_left ?? "");
    $("#purchase_margin_right").val(data.margin_right ?? "");
    $("#purchase_margin_top").val(data.margin_top ?? "");
    $("#purchase_margin_bottom").val(data.margin_bottom ?? "");

    $("#purchase_default_font").val(data.default_font ?? "");
    $("#purchase_default_font_size").val(data.default_font_size ?? "");
    $("#purchase_format").val(data.format ?? "");

    let bgUrl = data.background_image_url || null;
    if (bgUrl) {
        $("#purchase_invoicePreviewImage").attr("src", bgUrl).show();
        if ($("#purchase_existing_bg").length === 0) {
            $("#purchase_invoice_full_form").append('<input type="hidden" name="existing_background_image_url" id="purchase_existing_bg">');
        }
        $("#purchase_existing_bg").val(bgUrl);

        let fileName = bgUrl.split('/').pop();
        $("#purchase_bg_filename").text('Current Image: ' + fileName).show();
        $("#purchase_remove_bg_btn").show();
    } else {
        $("#purchase_invoicePreviewImage").hide();
        $("#purchase_existing_bg").val("");
        $("#purchase_bg_filename").hide();
        $("#purchase_remove_bg_btn").hide();
    }
    // Reset file input to prevent re-uploading on subsequent saves
    $("#purchase_invoice_full_form input[name='background_image']").val("");

    liveUpdatePreviewPurchase();
}

function clearPurchaseForm() {
    $("#purchase_margin_top, #purchase_margin_bottom, #purchase_margin_left, #purchase_margin_right, #purchase_margin_header, #purchase_margin_footer, #purchase_default_font_size").val("");
    $("#purchase_default_font").val("");
    $("#purchase_format").val("");
    // Fully clear image: remove src, hide element, clear hidden field and filename label
    $("#purchase_invoicePreviewImage").attr("src", "").hide();
    $("#purchase_existing_bg").remove();
    $("#purchase_bg_filename").hide();
    $("#purchase_remove_bg_btn").hide();
    // Reset file input
    $("#purchase_invoice_full_form input[name='background_image']").val("");
    liveUpdatePreviewPurchase();
}

let printSettingsData = null;

$(document).ready(function () {
    console.log("Document ready - Initializing invoice print designs");

    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#printer_setup_sub_menu").addClass("active");

    // Load all data
    toggleLoader("invoice-page", true);
    $.get("/invoice-print-design/all", function (response) {
    toggleLoader("invoice-page", false, function() {
        if (response.status) {
            console.log("Data Loaded:", response.data);
            printSettingsData = response.data;

            // Determine initial state of Apply All switches
            let isSalesApplyAll = printSettingsData?.global_sales_invoice &&
                (!printSettingsData?.branch_sales_invoice || printSettingsData.branch_sales_invoice.length === 0);

            if (isSalesApplyAll) {
                $("#sales_invoice_print_design_apply_all_switch").prop("checked", true);
                $("#sales_branchSelect").closest('div[id]').hide();
                fillSalesForm(printSettingsData?.global_sales_invoice);
            }

            let isPurchaseApplyAll = printSettingsData?.global_purchase_invoice &&
                (!printSettingsData?.branch_purchase_invoice || printSettingsData.branch_purchase_invoice.length === 0);

            if (isPurchaseApplyAll) {
                $("#purchase_invoice_print_design_apply_all_switch").prop("checked", true);
                $("#purchase_branchSelect").closest('div[id]').hide();
                $("#purchase_branchSelect").prop("disabled", true);
                fillPurchaseForm(printSettingsData?.global_purchase_invoice);
            }
        }
    });
    }).fail(function (xhr) {
        toggleLoader("invoice-page", false);
        console.error("AJAX Error loading data:", xhr);
    });

    //sales-invoice handlers

    $("#sales_invoice_print_design_apply_all_switch").change(function (e) {
        let switchElem = $(this);
        let applyAll = switchElem.is(":checked");

        let titleText = applyAll ? "Apply to All Branches?" : "Disable Apply All?";
        let warningText = applyAll
            ? "If you do this, existing branch-specific margins and layouts will be lost and overwritten by the global layout."
            : "If you do this, the global layout will be removed and you will lose existing margins, needing to set them for each branch individually.";

        Swal.fire({
            title: titleText,
            text: warningText,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, continue!",
            cancelButtonText: "No, cancel!",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light ms-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (applyAll) {
                    $("#sales_branchSelect").closest('div[id]').hide();
                    // Keep current form values intact to promote to global
                } else {
                    // DELETE global design from DB
                    toggleLoader("invoice-apply-all", true);
                    $.ajax({
                        url: BASE_URL + "/invoice-print-design/delete-global",
                        type: "DELETE",
                        data: { staticKey: "salesInvoicePrintDesign" },
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                        },
                        success: function (response) {
                        toggleLoader("invoice-apply-all", false, function() {
                            if (response.status) {
                                // Clear cached global data
                                if (printSettingsData) {
                                    printSettingsData.global_sales_invoice = null;
                                }
                            }
                        });
                    },
                    error: function () {
                        toggleLoader("invoice-apply-all", false);
                        }
                    });

                    $("#sales_branchSelect").closest('div[id]').show();
                    // Fully clear the form and image
                    clearSalesForm();
                }
            } else {
                // Revert switch state
                switchElem.prop("checked", !applyAll);
            }
        });
    });

    $("#sales_branchSelect").change(function () {
        let branchId = $(this).val();

        if ($("#sales_invoice_print_design_apply_all_switch").is(":checked")) {
            if (printSettingsData?.global_sales_invoice) {
                fillSalesForm(printSettingsData.global_sales_invoice);
            }
            return;
        }

        toggleLoader("invoice-branch", true);
        if (branchId) {
            let branchDesign = printSettingsData?.branch_sales_invoice?.find(x => x.clinicId == branchId);
            if (branchDesign) {
                fillSalesForm(branchDesign);
            } else {
                clearSalesForm();
            }
        } else {
            clearSalesForm();
        }
        toggleLoader("invoice-branch", false);
    });

    // Sales input events
    $(document).on("input change", "#sales_margin_top, #sales_margin_bottom, #sales_margin_left, #sales_margin_right, #sales_margin_header, #sales_margin_footer, #sales_default_font, #sales_default_font_size, #sales_format", function () {
        liveUpdatePreviewSales();
    });

    // Sales background image
    $(document).on("change", "#sales_invoice_full_form input[name='background_image']", function (e) {
        let file = e.target.files[0];
        if (!file) {
            if (!$("#sales_existing_bg").val()) {
                $("#sales_remove_bg_btn").hide();
            }
            return;
        }

        let url = URL.createObjectURL(file);
        $("#sales_invoicePreviewImage").attr("src", url).show();
        $("#sales_remove_bg_btn").show();
        liveUpdatePreviewSales();
    });

    // Sales remove background button
    $(document).on("click", "#sales_remove_bg_btn", function() {
        let existingBg = $("#sales_existing_bg").val();
        let fileInput = $("#sales_invoice_full_form input[name='background_image']").val();

            // No image at all
        if (!existingBg && !fileInput) {
            Swal.fire({
                icon: "info",
                title: "No Image",
                text: "There is no background image to remove.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
            });
            return;
        }
        // No server image, but local file exists → clear it
        if (!existingBg && fileInput) {
             $("#sales_invoicePreviewImage").attr("src", "").hide();
             $("#sales_invoice_full_form input[name='background_image']").val("");
             $("#sales_remove_bg_btn").hide();
             liveUpdatePreviewSales();
             return;
        }
        Swal.fire({
            title: "Remove Background Image?",
            text: "Are you sure you want to remove the current background image? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "No, cancel!",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
                cancelButton: "btn btn-secondary waves-effect waves-light ms-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let applyAll = $("#sales_invoice_print_design_apply_all_switch").is(":checked") ? 1 : 0;
                let clinicId = $("#sales_branchSelect").val();
                
                toggleLoader("invoice-remove-bg", true);
                $.ajax({
                    url: BASE_URL + "/invoice-print-design/remove-background",
                    type: "DELETE",
                    data: {
                        staticKey: "salesInvoicePrintDesign",
                        apply_all: applyAll,
                        clinicId: clinicId
                    },
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                    },
                    success: function (response) {
                    toggleLoader("invoice-remove-bg", false, function() {
                        if (response.status) {
                            Swal.fire({
                                icon: "success",
                                title: "Removed!",
                                text: response.msg,
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                            }).then(() => {
                            $("#sales_invoicePreviewImage").attr("src", "").hide();
                            $("#sales_existing_bg").remove();
                            $("#sales_bg_filename").hide();
                            $("#sales_remove_bg_btn").hide();
                            $("#sales_invoice_full_form input[name='background_image']").val("");
                            liveUpdatePreviewSales();
                            
                            reloadSalesPrintDesignData();
                         });
                        } else {
                            Swal.fire('Error!', response.error || 'Something went wrong', 'error');
                        }
                    });
                    },
                    error: function (xhr) {
                        toggleLoader("invoice-remove-bg", false, function() {
                        Swal.fire('Error!', 'Something went wrong while removing the image.', 'error');
                        });
                    }
                });
            }
        });
    });

    // Sales print button
    $(document).on("click", "#printSalesInvoiceBtn", function () {
        let printContents = document.getElementById('salesA4Wrapper').outerHTML;
        let printWindow = window.open('', '_blank', 'width=800,height=1000');

        printWindow.document.write(`
            <html>
            <head>
                <title>Sales Invoice Preview</title>
                <style>
                    @page { size: A4; margin: 0; }
                    body { margin: 0; }
                    #salesA4Wrapper { width: 210mm; height: 297mm; position: relative; }
                    img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; }
                    #salesInvoiceContentOverlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: auto; }
                </style>
            </head>
            <body>${printContents}</body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    });

    // purchase-invoice handlers

    $("#purchase_invoice_print_design_apply_all_switch").change(function (e) {
        let switchElem = $(this);
        let applyAll = switchElem.is(":checked");

        let titleText = applyAll ? "Apply to All Branches?" : "Disable Apply All?";
        let warningText = applyAll
            ? "If you do this, existing branch-specific margins and layouts will be lost and overwritten by the global layout."
            : "If you do this, the global layout will be removed and you will lose existing margins, needing to set them for each branch individually.";

        Swal.fire({
            title: titleText,
            text: warningText,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, continue!",
            cancelButtonText: "No, cancel!",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton: "btn btn-danger waves-effect waves-light ms-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (applyAll) {
                    $("#purchase_branchSelect").closest('div[id]').hide();
                    $("#purchase_branchSelect").prop("disabled", true);
                    // Keep current form values intact to promote to global
                } else {
                    // DELETE global design from DB
                    toggleLoader("invoice-apply-all", true);
                    $.ajax({
                        url: BASE_URL + "/invoice-print-design/delete-global",
                        type: "DELETE",
                        data: { staticKey: "purchaseInvoicePrintDesign" },
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                        },
                        success: function (response) {
                        toggleLoader("invoice-apply-all", false, function() {
                            if (response.status) {
                                // Clear cached global data
                                if (printSettingsData) {
                                    printSettingsData.global_purchase_invoice = null;
                                }
                            }
                            });
                        },
                        error: function () {
                            toggleLoader("invoice-apply-all", false);
                        }
                    });

                    $("#purchase_branchSelect").closest('div[id]').show();
                    $("#purchase_branchSelect").prop("disabled", false);
                    // Fully clear the form and image
                    clearPurchaseForm();
                }
            } else {
                // Revert switch state
                switchElem.prop("checked", !applyAll);
            }
        });
    });

    $("#purchase_branchSelect").change(function () {
        let branchId = $(this).val();

        if ($("#purchase_invoice_print_design_apply_all_switch").is(":checked")) {
            if (printSettingsData?.global_purchase_invoice) {
                fillPurchaseForm(printSettingsData.global_purchase_invoice);
            }
            return;
        }

        toggleLoader("invoice-branch", true);
        if (branchId) {
            let branchDesign = printSettingsData?.branch_purchase_invoice?.find(x => x.clinicId == branchId);
            if (branchDesign) {
                fillPurchaseForm(branchDesign);
            } else {
                clearPurchaseForm();
            }
        } else {
            clearPurchaseForm();
        }
        toggleLoader("invoice-branch", false);
    });

    // Purchase input events
    $(document).on("input change", "#purchase_margin_top, #purchase_margin_bottom, #purchase_margin_left, #purchase_margin_right, #purchase_margin_header, #purchase_margin_footer, #purchase_default_font, #purchase_default_font_size, #purchase_format", function () {
        liveUpdatePreviewPurchase();
    });

    // Purchase background image
    $(document).on("change", "#purchase_invoice_full_form input[name='background_image']", function (e) {
        let file = e.target.files[0];
        if (!file) {
            if (!$("#purchase_existing_bg").val()) {
                $("#purchase_remove_bg_btn").hide();
            }
            return;
        }

        let url = URL.createObjectURL(file);
        $("#purchase_invoicePreviewImage").attr("src", url).show();
        $("#purchase_remove_bg_btn").show();
        liveUpdatePreviewPurchase();
    });

    // Purchase remove background button
    $(document).on("click", "#purchase_remove_bg_btn", function() {
        let existingBg = $("#purchase_existing_bg").val();
        let fileInput = $("#purchase_invoice_full_form input[name='background_image']").val();
     // No image at all
        if (!existingBg && !fileInput) {
            Swal.fire({
                icon: "info",
                title: "No Image",
                text: "There is no background image to remove.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
            });
            return;
        }
        // No server image, but local file exists → clear it
        if (!existingBg && fileInput) {
             $("#purchase_invoicePreviewImage").attr("src", "").hide();
             $("#purchase_invoice_full_form input[name='background_image']").val("");
             $("#purchase_remove_bg_btn").hide();
             liveUpdatePreviewPurchase();
             return;
        }

        Swal.fire({
            title: "Remove Background Image?",
            text: "Are you sure you want to remove the current background image? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "No, cancel!",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light",
                cancelButton: "btn btn-secondary waves-effect waves-light ms-2"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let applyAll = $("#purchase_invoice_print_design_apply_all_switch").is(":checked") ? 1 : 0;
                let clinicId = $("#purchase_branchSelect").val();
                
                toggleLoader("invoice-remove-bg", true);
                $.ajax({
                    url: BASE_URL + "/invoice-print-design/remove-background",
                    type: "DELETE",
                    data: {
                        staticKey: "purchaseInvoicePrintDesign",
                        apply_all: applyAll,
                        clinicId: clinicId
                    },
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                    },
                    success: function (response) {
                    toggleLoader("invoice-remove-bg", false, function() {
                        if (response.status) {
                            Swal.fire({
                                icon: "success",
                                title: "Removed!",
                                text: response.msg,
                                customClass: {
                                    confirmButton: "btn btn-success waves-effect waves-light",
                                },
                        }).then(() => {
                            $("#purchase_invoicePreviewImage").attr("src", "").hide();
                            $("#purchase_existing_bg").remove();
                            $("#purchase_bg_filename").hide();
                            $("#purchase_remove_bg_btn").hide();
                            $("#purchase_invoice_full_form input[name='background_image']").val("");
                            liveUpdatePreviewPurchase();
                            
                            reloadPurchasePrintDesignData();
                        });
                        } else {
                            Swal.fire('Error!', response.error || 'Something went wrong', 'error');
                        }
                    });
                    },
                    error: function (xhr) {
                        toggleLoader("invoice-remove-bg", false, function() {
                        Swal.fire('Error!', 'Something went wrong while removing the image.', 'error');
                        });
                    }
                });
            }
        });
    });

    // Purchase print button
    $(document).on("click", "#printPurchaseInvoiceBtn", function () {
        let printContents = document.getElementById('purchaseA4Wrapper').outerHTML;
        let printWindow = window.open('', '_blank', 'width=800,height=1000');

        printWindow.document.write(`
            <html>
            <head>
                <title>Purchase Invoice Preview</title>
                <style>
                    @page { size: A4; margin: 0; }
                    body { margin: 0; }
                    #purchaseA4Wrapper { width: 210mm; height: 297mm; position: relative; }
                    img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; }
                    #purchaseInvoiceContentOverlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: auto; }
                </style>
            </head>
            <body>${printContents}</body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    });
});