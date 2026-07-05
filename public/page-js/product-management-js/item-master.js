// ===============================
// GLOBAL DECLARATIONS
// ===============================
let itemDropzone = null;
var selectedUnitIdValues = [];
var otherUnitCounter = 0;

function getNextOtherUnitId() {
    return "otherunitId" + (otherUnitCounter++);
}

$(document).ready(function () {
    //TODO:need to implement SFDA later
    //  console.log("Page loadedddd");
    // initSfdaMedication();

    $("#product_management_main_menu").addClass(
        "active open menu-item-animating",
    );
    $("#item_master_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#edit_item_masterId").val()) {
        initialPageloadForEdit($("#edit_item_masterId").val());
    } else {
        if (window.location.pathname != "/item-master-view") {
            $("#itemType").val("product").trigger("change");
        }

        fetchNextItemMAsterCode();
    }

    var path = window.location.pathname;
    console.log(path);

    $("#single_rack").prop("checked", true);
    $("#single-input-box").show();
    $("#other_unit_enabled").val() == "0"
        ? $("#otherUnitFormsContainer").hide()
        : $("#otherUnitFormsContainer").show();
    $("#otherUnitFlag").change(function () {
        let isChecked = $(this).is(":checked") ? 1 : 0;

        $.ajax({
            url: "/enable-or-disable-other-units", // Replace with your actual route
            method: "PUT",
            data: {
                otherUnitFlag: isChecked,
            },
            success: function (response) {
                if (response.status) {
                    response.data == 1
                        ? $("#otherUnitFormsContainer").show()
                        : $("#otherUnitFormsContainer").hide();
                    $("#other_unit_enabled").val(response.data);

                    response.data == 1
                        ? $("#otherUnitFlag").prop("checked", true).val(1)
                        : $("#otherUnitFlag").prop("checked", false).val(0);
                    // Swal.fire({
                    //     icon: "success",
                    //     text: response.message,
                    //     customClass: {
                    //         confirmButton: "btn btn-success",
                    //     },
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         // Check if the URL contains "edit-item-master"
                    //         if (window.location.href.includes("/edit-item-master/")) {
                    //             location.reload();
                    //         }
                    //     }
                    // });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    });

    let checkedItems = [];

    // Initialize DataTable
    var itemMasterTable = $("#item_master_table").DataTable({
        processing: true,
        serverSide: true,
        order: [],
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"],
        ],
        pageLength: 10,
        // ajax: BASE_URL + "/item-master-view",
        ajax: {
            url: BASE_URL + "/item-master-view", // URL for the server-side processing
            data: function (d) {
                d.itemType = $("#itemType").val(); // send selected branch
                d.barcode_qr = $("#barcode_qr_search").val();
                d.gtin = $("#gtin").val(); // send selected branch
            },
        },
        columns: [
            {
                data: "checkbox",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<input type="checkbox" class="dt-checkboxes form-check-input custom-check1" name="select_all_item" value="' +
                        full.itemMasterId +
                        '">'
                    );
                },
            },
            { data: "itemMasterId", name: "itemMasterId" },
            { data: "itemCode", name: "itemCode" },
            { data: "itemName_en", name: "itemName_en" },
            { data: "itemName_ar", name: "itemName_ar" },
            { data: "category_name_en", name: "category_name_en" },
            { data: "type", name: "type" },
            { data: "costPrice", name: "costPrice" },
            { data: "sellingPrice", name: "sellingPrice" },
            // { data: "lastPurchasePrice", name: "lastPurchasePrice" },
            // { data: "lastSellingPrice", name: "lastSellingPrice" },
            { data: "lastPurchaseDate", name: "lastPurchaseDate" },
            { data: "lastSalesDate", name: "lastSalesDate" },
            {
                data: null,
                name: "actions",
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    var editUrl =
                        BASE_URL + "/edit-item-master/" + full.itemMasterId;
                    var deleteUrl =
                        BASE_URL + "/delete-item-master/" + full.itemMasterId;
                    var stockInventoryUrl =
                        BASE_URL + "/stock-inventory/" + full.itemMasterId;
                    return (
                        '<div class="d-inline-block">' +
                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                        '<li><a href="' +
                        stockInventoryUrl +
                        '" class="dropdown-item ">View Stock Inventory</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="' +
                        editUrl +
                        '" class="dropdown-item item-edit" data-id="' +
                        editUrl +
                        '">Edit</a></li>' +
                        '<div class="dropdown-divider"></div>' +
                        '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' +
                        deleteUrl +
                        '">Delete</a></li>' +
                        "</ul>" +
                        "</div>"
                    );
                },
            },
        ],
        drawCallback: function () {
            var rows = itemMasterTable.rows({ page: "current" }).nodes();
            $('input[type="checkbox"]', rows).each(function () {
                if (checkedItems.includes(this.value)) {
                    $(this).prop("checked", true);
                }
            });
            updateFooter();
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            // Helper: parse numbers safely
            var intVal = function (i) {
                if (i === null || i === undefined) return 0;
                if (typeof i === "string") {
                    i = i.replace(/[\$,]/g, "").trim();
                    return isNaN(i) || i === "" ? 0 : parseFloat(i);
                }
                if (typeof i === "number") return i;
                return 0;
            };

            // Total costPrice
            var costTotal = api
                .column(6, { page: "current" })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            // Total sellingPrice
            var sellingTotal = api
                .column(7, { page: "current" })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            // Update footer
            $(api.column(6).footer()).html(costTotal.toFixed(2));
            $(api.column(7).footer()).html(sellingTotal.toFixed(2));
        },
    });

    //barcode search
    $("#barcode_qr_search").select2({
        placeholder: " ",
        allowClear: true,
        tags: true,
    });

    // trigger search
    $("#barcode_qr_search").on("change", function () {
        itemMasterTable.ajax.reload();
    });

    // item type filter
    $("#itemType").on("change", function () {
        itemMasterTable.ajax.reload();
    });

    $("#item_search_btn").on("click", function () {
        itemMasterTable.ajax.reload();
    });

    $("#barCode").select2({
        placeholder: "Select a Client",
        allowClear: true,
        minimumInputLength: 0,
        ajax: {
            url: BASE_URL + "/product-management-get-bar-code",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    barCode: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.results.map((item) => ({
                        id: item.barcode || item.QRcode,
                        itemCode: item.itemCode,
                        itemName: item.itemName_en,
                        barCode: item.barcode,
                        QRcode: item.QRcode,
                    })),
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearch,
        templateSelection: formatSearchSelection,
    });

    function formatSearch(repo) {
        if (!repo.id) return repo.text;

        return $(`
        <div>
            <strong>${repo.itemName}</strong><br>
            <small>
                Code: ${repo.itemCode} <br>
                Barcode: ${repo.barCode ?? "-"} <br>
                QR: ${repo.QRcode ?? "-"}
            </small>
        </div>
    `);
    }

    function formatSearchSelection(repo) {
        return repo.barCode;
    }

    $("#gtin").select2({
        placeholder: "Select a Client",
        allowClear: true,
        minimumInputLength: 0,
        ajax: {
            url: BASE_URL + "/product-management-get-gtin",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    gtin: params.term,
                };
            },
            processResults: function (data) {
                return {
                    results: data.results.map((item) => ({
                        id: item.id, // MRN (File ID)
                        itemCode: item.itemCode, // Full name
                        itemName: item.itemName,
                        gtinSFDA: item.gtinSFDA,
                    })),
                };
            },
            cache: true,
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: formatSearchGtinSFDA,
        templateSelection: formatSearchSelectionGtinSFDA,
    });

    function formatSearchGtinSFDA(repo) {
        if (!repo.id) {
            return repo.gtinSFDA;
        }
        return $(`
            <div>
                <strong>${repo.itemName}</strong><br>
                <small>Item Code: ${repo.itemCode} | Gtin SFDA: ${repo.gtinSFDA}</small>
            </div>
        `);
    }

    function formatSearchSelectionGtinSFDA(repo) {
        return repo.gtinSFDA;
    }

    // Handle "Select All" checkbox
    $("#select_all_item").on("click", function () {
        var rows = itemMasterTable.rows({ page: "current" }).nodes();
        var isChecked = this.checked;

        $('input[type="checkbox"]', rows).each(function () {
            $(this).prop("checked", isChecked);
            var itemId = this.value;

            if (isChecked) {
                if (!checkedItems.includes(itemId)) {
                    checkedItems.push(itemId);
                }
            } else {
                checkedItems = checkedItems.filter((id) => id !== itemId);
            }
        });

        updateFooter();
    });

    // Handle individual checkbox change
    $("#item_master_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            var itemId = this.value;

            if (this.checked) {
                if (!checkedItems.includes(itemId)) {
                    checkedItems.push(itemId);
                }
            } else {
                checkedItems = checkedItems.filter((id) => id !== itemId);
            }

            // Update "Select All" checkbox state
            var allCheckboxes = $(
                'input[type="checkbox"]',
                itemMasterTable.rows({ page: "current" }).nodes(),
            );
            var allChecked =
                allCheckboxes.length ===
                allCheckboxes.filter(":checked").length;

            var selectAllCheckbox = $("#select_all_item").get(0);
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
        var itemCount = checkedItems.length;
        if (itemCount > 0) {
            footer.show();
            $(".itemz h4").text(itemCount);
        } else {
            footer.hide();
        }
    }
    $(".footer").hide();

    // Handle delete button click
    $("#deleteSelectedItems").on("click", function (e) {
        e.preventDefault();

        if (checkedItems.length === 0) {
            Swal.fire(
                "No items selected",
                "Please select at least one item to delete.",
                "warning",
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action will mark the selected items as deleted.",
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
                    url: BASE_URL + "/delete-selected-item-master",
                    method: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        itemMasterIds: checkedItems,
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
                            itemMasterTable.ajax.reload();
                            checkedItems = [];
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

    // add new brand
    $("#showBrandModal").on("click", function () {
        $("#itemBrandModal").modal("show");
    });

    $("#item_brand_btn").on("click", function () {
        const formData = {
            brand_code: $("#brand_code").val(),
            brand_name_en: $("#brand_name_en").val(),
            brand_name_ar: $("#brand_name_ar").val(),
            _token: $('meta[name="csrf-token"]').attr("content"),
        };

        $.ajax({
            url: "/item-brands",
            type: "POST",
            data: formData,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success" },
                }).then(() => {
                    location.reload();
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    text: "Unable to save Item Brand.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    });

    // add new unit
    $("#showUnitModal").on("click", function () {
        $("#UnitModal").modal("show");
    });

    $("#unit_btn").on("click", function () {
        const formData = {
            unit_name_en: $("#unit_name_en").val(),
            unit_name_ar: $("#unit_name_ar").val(),
            _token: $('meta[name="csrf-token"]').attr("content"),
        };

        $.ajax({
            url: "/units",
            type: "POST",
            data: formData,
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success" },
                }).then(() => {
                    location.reload();
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    text: "Unable to save Unit.",
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    });

    $(document).on("click", ".showOtherUnitForm", function () {
    var baseUnitValue = $("#baseunitId").val();
    var options = "";

    $("#baseunitId option").each(function () {
        var optionValue = $(this).val();
        var optionText = $(this).text();
        if (optionValue !== baseUnitValue) {
            options += `<option value="${optionValue}">${optionText}</option>`;
        }
    });

    const newId = getNextOtherUnitId();

    const newOtherUnitHtml = `
    <div class="repeater-item" data-repeater-item="">
    <div class="row">
        <div class="col-4">
            <div class="mb-6 select2-wrap" style="position: relative;">
                <label for="${newId}" class="form-label labe">Other Unit</label>
                <select id="${newId}" name="otherunitId[]" class="select2 form-select form-select-lg otherunitId" data-allow-clear="true">
                    ${options}
                </select>
            </div>
        </div>
            <div class="col-1">
                <div class="mb-6">
                    <label class="form-label labez" for="itemMultiple">Multiple</label>
                    <input type="text" name="itemMultiple[]" class="form-control" placeholder="">
                </div>
            </div>
            <div class="col-2">
                <div class="mb-6">
                    <label class="form-label labez" for="itemOtherCostPrice">Cost Price</label>
                    <input type="text" name="itemOtherCostPrice[]" class="form-control" placeholder="">
                </div>
            </div>
            <div class="col-2">
                <div class="mb-6">
                    <label class="form-label labez" for="itemOthersellingPrice">Selling Price</label>
                    <input type="text" name="itemOthersellingPrice[]" class="form-control" placeholder="">
                </div>
            </div>
            <div class="mb-6 col-1 d-flex align-items-end">
                <button type="button" class="btn btn-icon btn-primary waves-effect waves-light showOtherUnitForm" disabled>
    <i class="ti ti-plus ti-md"></i>
</button>
            </div>
            <div class="mb-6 col-2 d-flex align-items-end">
                <button type="button" class="btn btn-label-danger delete-row" name="0">
                    <i class="ti ti-x ti-xs me-1"></i>
                    <span class="align-middle">Delete</span>
                </button>
            </div>
        </div>
        <hr class="mt-0">
    </div>`;

                $("#otherUnitRepeater").append(newOtherUnitHtml);

                    $(`#${newId}`).select2({
                        // placeholder: "{{ __('productmanagement::item-master-index.value_selectUnits') }}",
                        allowClear: true,
                        width: "100%",
                        dropdownParent: $(`#${newId}`).closest(".repeater-item")
                    });
                });
    // delete other unit row
    $(document).on("click", ".delete-row", function () {
        $(this).closest(".repeater-item").remove();
    });

    $(document).on("change", ".baseunitId", function () {
        var selectedId = $(this).val();

        if (selectedUnitIdValues.includes(selectedId)) {
            alert("This unit has already been selected!");
            $(this).val(null).trigger("change");
        } else {
            selectedUnitIdValues = [selectedId];
            disableSelectedOptions();
        }
    });

    function disableSelectedOptions() {
        $(".otherunitId").each(function () {
            var currentSelect = $(this);
            currentSelect.find("option").prop("disabled", false);
            currentSelect.find("option").each(function () {
                var optionValue = $(this).val();
                if (selectedUnitIdValues.includes(optionValue)) {
                    $(this).prop("disabled", true);
                }
            });
        });
    }

    $(document).on("click", "#delete_initial_row", function () {
        $(this)
            .closest(".repeater-item")
            .find("input, select")
            .each(function () {
                if ($(this).is("select")) {
                    $(this).val("All").trigger("change");
                } else {
                    $(this).val("");
                }
            });
    });

    $(document).ready(function () {
        // Store medication options globally for dynamic row creation
        var medicationOptionsGlobal = "";

        function storeMedicationOptions() {
            if ($("#sfdaRows .medicationId").first().length > 0) {
                medicationOptionsGlobal = "";
                $("#sfdaRows .medicationId")
                    .first()
                    .find("option")
                    .each(function () {
                        const value = $(this).val();
                        const text = $(this).text();
                        const code = $(this).data("code") || "";
                        medicationOptionsGlobal += `<option value="${value}" data-code="${code}">${text}</option>`;
                    });
            }
        }

        function initSelect2(context = document) {
            $(context)
                .find(".medicationId")
                .each(function () {
                    if (!$(this).hasClass("select2-hidden-accessible")) {
                        $(this).select2({
                            placeholder: "Select Medication",
                            allowClear: true,
                            width: "100%",
                        });
                    }
                });
        }

        function toggleRemoveButton() {
            let rows = $(".sfda-row");
            let isEditWithData = false;

            // check if at least one row has medication selected
            rows.each(function () {
                if ($(this).find(".medicationId").val()) {
                    isEditWithData = true;
                }
            });

            // Hide all first
            rows.find(".removeRow").hide();

            if (rows.length > 1) {
                // more than one row → normal behavior
                rows.filter(":gt(0)").find(".removeRow").show();
            } else if (isEditWithData) {
                // ONLY ONE ROW but EDIT MODE
                rows.find(".removeRow").show();
            }
        }

        function createSfdaRow(sfda = null) {
            const rowHtml = `
    <div class="row g-3 mb-3 sfda-row"
               data-sfda-id="${sfda ? sfda.itemMastersfdId : ""}">

         
        <!-- Medication -->
        <div class="col-12 col-md-4">
            <label class="form-label labez">Medication</label>
            <select name="medicationId[]" class="select2 form-select medicationId">
                ${medicationOptionsGlobal}
            </select>
        <span class="text-danger medication_error error-text"></span>
        </div>

        <!-- GTIN -->
        <div class="col-12 col-md-3">
            <label class="form-label labez">GTIN</label>
            <input type="text" class="form-control gtinSFDA"
                   value="${sfda?.gtin ?? ""}" readonly />
        </div>

        <!-- Serial -->
        <div class="col-12 col-md-3">
            <label class="form-label labez">Serial No</label>
            <input type="text" name="serialNoSFDA[]" class="form-control"
                   value="${sfda?.serialNo ?? ""}" />
        </div>

        <!-- Actions -->
        <div class="col-12 col-md-2 d-flex align-items-end gap-2">
            <button type="button" class="btn btn-icon btn-primary addRow">
                <i class="ti ti-plus ti-md"></i>
            </button>
            <button type="button" class="btn btn-label-danger removeRow">
                <i class="ti ti-x ti-xs me-1"></i> Delete
            </button>
        </div>
    </div>`;

            const $row = $(rowHtml);

            if (sfda?.medicationId) {
                $row.find(".medicationId").val(sfda.medicationId);
            }

            return $row;
        }

        // Initialize on page load
        storeMedicationOptions();
        initSelect2();
        toggleRemoveButton();

        // Medication change - auto-fill GTIN with code
        $(document).on("change", ".medicationId", function () {
            let code = $(this).find("option:selected").data("code") || "";
            $(this).closest(".sfda-row").find(".gtinSFDA").val(code);
        });

        // Add Row
        $(document).on("click", ".addRow", function () {
            // Destroy Select2 before cloning
            $(".medicationId").select2("destroy");

            let row = $(".sfda-row:first").clone();

            // Clear values
            row.find("input").val("");
            row.find("select").val("");

            // Remove old select2 container
            row.find(".select2-container").remove();

            row.find(".addRow").remove();

            // Show Remove button for cloned rows
            row.find(".removeRow").show();

            $("#sfdaRows").append(row);

            initSelect2("#sfdaRows");
            toggleRemoveButton();
        });

        // Remove Row
        $(document).on("click", ".removeRow", function () {
            const $row = $(this).closest(".sfda-row");
            const sfdaId = $row.data("sfda-id"); // DB ID
            const totalRows = $(".sfda-row").length;

            // 🔴 If DB row exists → soft delete
            if (sfdaId) {
                $.ajax({
                    url: BASE_URL + "/item-master-sfda/soft-delete",
                    type: "POST",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        id: sfdaId,
                    },
                });
            }

            // UI behavior
            if (totalRows > 1) {
                $row.remove();
            } else {
                // Last row → clear inputs only
                $row.find("input").val("");
                $row.find("select").val("").trigger("change");
            }

            toggleRemoveButton();
        });

        window.loadSfdaDataForEdit = function (sfdaData) {
            storeMedicationOptions();

            // Destroy old select2
            $(".medicationId").each(function () {
                if ($(this).hasClass("select2-hidden-accessible")) {
                    $(this).select2("destroy");
                }
            });
            
            $("#sfdaRows").empty();

            if (sfdaData && sfdaData.length > 0) {
                sfdaData.forEach(function (sfda) {
                    const $row = createSfdaRow(sfda);
                    $("#sfdaRows").append($row);

                    // Init select2 AFTER append
                    const $select = $row.find(".medicationId");
                    $select.select2({
                        placeholder: "Select Medication",
                        allowClear: true,
                        width: "100%",
                    });

                    // SET VALUE (this is the magic line)
                    if (sfda.medication_id) {
                        $select
                            .val(String(sfda.medication_id))
                            .trigger("change");
                    }
                });
            } else {
                const emptyRow = createSfdaRow();
                $("#sfdaRows").append(emptyRow);
                initSelect2("#sfdaRows");
            }

            toggleRemoveButton();
        };
    });

    // save item master
    // $("#saveItemMasterButton").on("click", function (e) {
    //     e.preventDefault();
    //     clearErrors();

    //     var itemNameEn = $("#itemName_en").val();
    //     var itemNameAr = $("#itemName_ar").val();
    //     var itemMinimumQty = $("#itemMinimunQty").val();
    //     var itemReorderQty = $("#itemReorderQty").val();
    //     var itemVatId = $("#itemvatId").val();
    //     var baseUnitId = $("#baseunitId").val();

    //     var medicationId = $(".medicationId").map(function () {
    //         return $(this).val();
    //     }).get().filter(Boolean);

    //     var errors = {};

    //     if (!itemNameEn) {
    //         errors.itemName_en = "Item Name (EN) is required.";
    //     }

    //     if (!itemNameAr) {
    //         errors.itemName_ar = "Item Name (AR) is required.";
    //     }

    //     if (!itemMinimumQty) {
    //         errors.itemMinimunQty = "Minimum Quantity is required.";
    //     }

    //     if (!itemReorderQty) {
    //         errors.itemReorderQty = "Reorder Quantity is required.";
    //     }

    //     if (!itemVatId || itemVatId === "All") {
    //         errors.itemvatId = "VAT ID is required.";
    //     }

    //     // if (medicationId.length === 0) {
    //     //     errors.medicationId = "At least one Medication Unit is required.";
    //     // }

    //     if (!baseUnitId || baseUnitId === "All") {
    //         errors.baseunitId = "Base Unit is required.";
    //     }

    //     if (Object.keys(errors).length > 0) {
    //         displayValidationErrors(errors);
    //         return;
    //     }

    //     // Proceed with AJAX request if validation passes
    //     var formData = $("#item_master").serialize();
    //     var otherUnitFormData = $("#otherUnitForm").serialize();
    //     var multipleRackFornDate = $("#multipleRackForm").serialize();
    //     var combinedData =
    //         formData + "&" + otherUnitFormData + "&" + multipleRackFornDate;
    //     var itemMasterId = $("#edit_item_masterId").val();

    //     var ajaxUrl = itemMasterId
    //         ? BASE_URL + "/update-item-master/" + itemMasterId
    //         : BASE_URL + "/item-master-store";
    //     var method = itemMasterId ? "PUT" : "POST";

    //     $.ajax({
    //         url: ajaxUrl,
    //         type: method,
    //         data: combinedData,
    //         success: function (response) {

    //             if (response.status) {
    //                 Swal.fire({
    //                     icon: "success",
    //                     text: response.message,
    //                     customClass: { confirmButton: "btn btn-success" },
    //                 }).then(() => {
    //                     window.location.href = BASE_URL + "/item-master-view";
    //                 });
    //             }
    //         },
    //         error: function (xhr) {
    //             if (xhr.status === 422) {
    //                 displayErrors(xhr.responseJSON.errors);
    //             } else {
    //                 console.error("Error fetching edit data:", xhr.message);

    //                 // Extract error message from the response
    //                 var errorMessage =
    //                     xhr.responseJSON && xhr.responseJSON.message
    //                         ? xhr.responseJSON.message
    //                         : "An unexpected error occurred. Please try again.";
    //                 // Display the error message in SweetAlert
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Access denied",
    //                     text: errorMessage,
    //                     customClass: {
    //                         confirmButton:
    //                             "btn btn-danger waves-effect waves-light",
    //                     },
    //                 });
    //             }
    //         },
    //     });
    // });

    //     $(document).ready(function () {
    //     // ===============================
    //     // Dropzone Initialization
    //     // ===============================

    //     if (typeof Dropzone === "undefined") {
    //         console.error("Dropzone not loaded");
    //         return;
    //     }

    //     Dropzone.autoDiscover = false;

    //    new Dropzone("#dropzone-basic", {
    //             url: "/product/request",
    //             method: "post",
    //             autoProcessQueue: false,
    //             maxFiles: 1,
    //             acceptedFiles: "image/*",
    //             addRemoveLinks: true,
    //             headers: {
    //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    //             },
    //             init: function () {
    //             alert("Dropzone initialized!");
    //               this.on("addedfile", function(file) {
    //                     console.log("File added");
    //                 });

    //                 this.on("processing", function(file) {
    //                     console.log("Processing");
    //                 });

    //                 this.on("sending", function(file, xhr, formData) {
    //                     console.log("Sending");
    //                 });

    //                 this.on("success", function(file, response) {
    //                     console.log("Success:", response);
    //                 });

    //                 this.on("error", function(file, response) {
    //                     console.log("Error:", response);
    //                 });
    //             },
    //             success: function (file, response) {
    //                 alert("Dropzone initialized!");
    //                console.log("File uploaded successfully:", response);
    //             },
    //             error: function (file, response) {
    //                 alert("Dropzone initialized!");
    //                 console.error("File upload error:", response);
    //             }
    //         });
    //     document.querySelector("#uploadBtn").addEventListener("click", function(e) {
    //         window.itemDropzone.processQueue();
    //     });
    // });

    // -------------------------
    // Reusable SKU check (only when saving)
    // -------------------------
    function checkSku() {
        return new Promise(function (resolve) {
            let sku = $("#sku").val().trim();
            let itemMasterId = $("#edit_item_masterId").val(); // ✅ correct hidden id

            // SKU not mandatory
            if (sku === "") {
                resolve(true);
                return;
            }

            $.ajax({
                url: "/check-sku-exists",
                type: "POST",
                data: {
                    sku: sku,
                    itemMasterId: itemMasterId, // send current editing id
                },
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content",
                    ),
                },
                success: function (response) {
                    if (response.exists) {
                        Swal.fire({
                            icon: "error",
                            title: "Duplicate SKU",
                            html: `
                            This SKU already exists.<br><br>
                              <!-- <b>Current Item ID:</b> ${itemMasterId ? itemMasterId : "New Item"} <br> -->
                              <!-- <b>Duplicate SKU Item ID:</b> ${response.duplicate_id} -->
                        `,
                            customClass: {
                                confirmButton: "btn btn-danger",
                            },
                        });

                        resolve(false);
                    } else {
                        resolve(true);
                    }
                },
                error: function () {
                    resolve(false);
                },
            });
        });
    }

    // -------------------------
    // Save Item Master
    // -------------------------
    $("#saveItemMasterButton").on("click", async function (e) {
        e.preventDefault();
        clearErrors();

        // Validate SKU first
        // const skuValid = await checkSku(); //  only checked on save
        // if (!skuValid) return;

        var itemMasterId = $("#edit_item_masterId").val();
        var currentSku = $("#sku").val();

        var errors = {};

        // Other validations
        if (!$("#itemName_en").val())
            errors.itemName_en = "Item Name (English) is required.";
        if (!$("#itemName_ar").val())
            errors.itemName_ar = "Item Name (Arabic) is required.";
        if (!$("#itemMinimunQty").val())
            errors.itemMinimunQty = "Minimum Quantity is required.";
        if (!$("#itemReorderQty").val())
            errors.itemReorderQty = "Reorder Quantity is required.";
        if (!$("#itemvatId").val() || $("#itemvatId").val() === "All")
            errors.itemvatId = "VAT ID is required.";
        if (!$("#baseunitId").val() || $("#baseunitId").val() === "All")
            errors.baseunitId = "Base Unit is required.";
        if (!$("#itemBasicCostPrice").val())
            errors.itemBasicCostPrice = "Cost Price is required.";
        if (!$("#itemBasicSellingPrice").val())
            errors.itemBasicSellingPrice = "Selling Price is required.";

        if (Object.keys(errors).length > 0) {
            displayValidationErrors(errors);
            return;
        }

        // Build FormData
        var formData = new FormData();

        $("#item_master")
            .serializeArray()
            .forEach(function (item) {
                formData.append(item.name, item.value);
            });

        $("#otherUnitForm")
            .serializeArray()
            .forEach(function (item) {
                formData.append(item.name, item.value);
            });

        $("#multipleRackForm")
            .serializeArray()
            .forEach(function (item) {
                formData.append(item.name, item.value);
            });

        // Image
        let imageUploaded = false;
        if (itemDropzone && itemDropzone.files.length > 0) {
            formData.append("file", itemDropzone.files[0]);
            imageUploaded = true;
        }
        formData.append("image_uploaded", imageUploaded ? 1 : 0);

        // Create / Update URL
        var ajaxUrl = itemMasterId
            ? BASE_URL + "/update-item-master/" + itemMasterId
            : BASE_URL + "/item-master-store";

        if (itemMasterId) {
            formData.append("_method", "PUT");
        }
        $("#loader-overlay").show();

        // AJAX Save (Add & Update)
        $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === false) {
                    // Show error and stop update
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response.message || "Something went wrong!",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    });
                    return; // important: stop execution
                }

                // Success
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Item saved successfully!",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then(() => {
                    if (itemMasterId) {
                        window.location.href = BASE_URL + "/item-master-view";
                    } else {
                        window.location.reload();
                    }
                });
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Something went wrong!",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                });
            },
        });
    });

    function clearErrors() {
        $(".error-text").text("");
        $(".form-control, .form-select").removeClass("is-invalid");
        $(".invalid-feedback").remove(); // Add this line
    }

    function displayErrors(errors) {
        // Handle regular field
        $("#loader-overlay").hide();
        if (errors.itemName_en) {
            $(".itemName_en_error").text(errors.itemName_en[0]);
        }
        if (errors.itemName_ar) {
            $(".itemName_ar_error").text(errors.itemName_ar[0]);
            $("#itemName_ar").addClass("is-invalid");
        }
        if (errors.itemMinimunQty) {
            $(".itemMinimunQty_error").text(errors.itemMinimunQty[0]);
        }
        if (errors.itemReorderQty) {
            $(".itemReorderQty_error").text(errors.itemReorderQty[0]);
        }
        if (errors.itemvatId) {
            $(".itemVat_error").text(errors.itemvatId[0]);
        }
        if (errors.baseunitId) {
            $(".baseunitId_error").text(errors.baseunitId[0]);
        }
        if (errors.itemBasicCostPrice) {
            $(".itemBasicCostPrice_error").text(errors.itemBasicCostPrice[0]);
        }
        if (errors.itemBasicSellingPrice) {
            $(".itemBasicSellingPrice_error").text(
                errors.itemBasicSellingPrice[0],
            );
        }

        // Handle medication errors (medicationId.0, medicationId.1, etc.)
        let medicationErrors = [];
        Object.keys(errors).forEach(function (key) {
            if (key.startsWith("medicationId")) {
                // Extract error messages
                let errorMsg = Array.isArray(errors[key])
                    ? errors[key][0]
                    : errors[key];
                medicationErrors.push(errorMsg);
            }
        });

        // Display medication errors
        if (medicationErrors.length > 0) {
            // Remove duplicates
            let uniqueErrors = [...new Set(medicationErrors)];
            let errorHtml = uniqueErrors.join("<br>");

            $(".medication_error").html(errorHtml);
            $(".medicationId").addClass("is-invalid");

            // Scroll to medication error
            $("html, body").animate(
                {
                    scrollTop: $(".medication_error").offset().top - 100,
                },
                500,
            );
        }
    }

    function displayValidationErrors(errors) {
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                let errorMessage = errors[field];

                if (field === "medicationId") {
                    $(".medication_error").text(errorMessage);
                    continue;
                }
                var spanMap = {
                    itemName_en: ".itemName_en_error",
                    itemName_ar: ".itemName_ar_error",
                    itemMinimunQty: ".itemMinimunQty_error",
                    itemReorderQty: ".itemReorderQty_error",
                    itemvatId: ".itemVat_error",
                    baseunitId: ".baseunitId_error",
                    itemBasicCostPrice: ".itemBasicCostPrice_error",
                    itemBasicSellingPrice: ".itemBasicSellingPrice_error",
                };

                if (spanMap[field]) {
                    $(spanMap[field]).text(errorMessage);
                } else {
                    let inputField = $("#" + field);
                    if (inputField.length) {
                        inputField.next(".invalid-feedback").remove();
                        let errorDiv = $("<div>")
                            .addClass("invalid-feedback")
                            .css("display", "block")
                            .text(errorMessage);
                        inputField.closest("div").append(errorDiv);
                    }
                }
            }
        }
    }

    $(document).on("change", ".medicationId", function () {
        var hasSelection = false;
        $(".medicationId").each(function () {
            if ($(this).val()) {
                hasSelection = true;
                return false; // break the loop
            }
        });

        if (hasSelection) {
            $(".medication_error").text("");
            $(".medicationId").removeClass("is-invalid");
        }
    });

    $("#item_master input").on("input", function () {
        var inputField = $(this);
        inputField.removeClass("is-invalid");
        inputField.next(".invalid-feedback").remove();
    });

    $("#item_master select").on("change", function () {
        var selectField = $(this);
        selectField.removeClass("is-invalid");
        selectField.next(".invalid-feedback").remove();
    });

    // Delete item master
    $("#item_master_table").on("click", ".item-delete", function () {
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
                $("#loader-overlay").show();
                $.ajax({
                    url: deleteUrl,
                    method: "DELETE",
                    success: function (response) {
                        $("#loader-overlay").hide();
                        if (response.status === true) {
                            itemMasterTable.ajax.reload(null, false);
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
                        $("#loader-overlay").hide();
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
            }
        });
    });

    $(document).on("click", ".delete-row", function () {
        $.ajax({
            url: BASE_URL + "/delete-otherUnit/" + $(this).data("id"),
            type: "DELETE",
            success: function (response) {
                if (response.status) {
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: ", status, error);
            },
        });
    });

    // back to item master view
    $("#backToItemMasterView").on("click", function (e) {
        e.preventDefault();
        window.location.href = BASE_URL + "/item-master-view";
    });

    // fetch next itemmaster code
    function fetchNextItemMAsterCode() {
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/get-next-item-master-code",
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status && response.nextItemMAsterCode) {
                    $("#itemcodeId").val(response.nextItemMAsterCode);
                } else {
                    console.error("Failed to fetch next item code");
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                console.error("Error fetching next item code:", error);
            },
        });
    }

    $("#itemcodeId").prop("readonly", true);

    const singleCheckbox = document.getElementById("single_rack");
    const multipleCheckbox = document.getElementById("multiple_rack");
    const singleInputBox = document.getElementById("single-input-box");
    const multipleInputBox = document.getElementById("multiple-input-box");

    if (singleCheckbox) {
        singleCheckbox.addEventListener("change", function () {
            if (this.checked) {
                singleInputBox.style.display = "block";
                multipleInputBox.style.display = "none";
                multipleCheckbox.checked = false;
            } else {
                singleInputBox.style.display = "none";
            }
        });
    }

    if (multipleCheckbox) {
        multipleCheckbox.addEventListener("change", function () {
            if (this.checked) {
                multipleInputBox.style.display = "block";
                singleInputBox.style.display = "none";
                singleCheckbox.checked = false;
            } else {
                multipleInputBox.style.display = "none";
            }
        });
    }

    $(document).on("click", "#showitemMultipleRack", function () {
        let count = $(
            "#multipleRackRepeater .row[id^='multiple_input_box']",
        ).length;
        let options = "";
        // Generate options excluding the selected clinic
        $(".itemmultipleClinic-initial option").each(function () {
            var optionValue = $(this).val();
            var optionText = $(this).text();
            options += `<option value="${optionValue}">${optionText}</option>`;
            console.log(options);
        });
        console.log(options);
        // Dynamically create unique IDs
        const newMultipleRackHtml = `
            <div class="row" id="multiple_input_box${count}">
                <div class="col-12 mb-4 mt-2">
                    <label for="itemmultipleClinic${count}" class="form-label labez">Multiple Rack</label>
                    <div class="d-flex gap-2 mt-2">
                        <select id="itemmultipleClinic${count}" placeholder="Add Branch" name="itemmultipleClinic[]" class="selectpicker w-100" data-style="btn-default" data-live-search="true">
                            ${options}
                        </select>
                        <input
                            type="text"
                            id="itemmultipleRack${count}"
                            name="itemmultipleRack[]"
                            class="form-control"
                            placeholder="Add Rack" />
                        <button type="button" class="fw-medium btn btn-icon btn-danger ms-4 removeRack" data-target="${count}">
                            <i class="ti ti-minus ti-md"></i>
                        </button>
                    </div>
                </div>
            </div>`;

        // Append the new HTML
        $("#multipleRackRepeater").append(newMultipleRackHtml);

        // Reinitialize selectpicker for the new select element
        $(`#itemmultipleClinic${count}`).selectpicker("destroy").selectpicker();

        count++;
    });

    // Remove functionality for dynamically added rows
    $(document).on("click", ".removeRack", function () {
        let targetId = $(this).data("target");
        $(`#multiple_input_box${targetId}`).remove();
    });

    const tagifyColdChainInput = document.querySelector("#coldChainTags");
    const tagifyColdChainElement = new Tagify(tagifyColdChainInput, { userInput: false });

    tagifyColdChainElement.on("remove", function (e) {
        const removedIndex = e.detail.index;
        const hiddenInput = document.getElementById("selectedColdChainItemId");
        let currentIds = hiddenInput.value
            ? hiddenInput.value.split(",").map((id) => id.trim())
            : [];
        if (removedIndex >= 0 && removedIndex < currentIds.length) {
            currentIds.splice(removedIndex, 1);
        }
        hiddenInput.value = currentIds.join(",");
    });

    $("#searchColdChainItem").select2({
        placeholder: "Select an Item",
        dropdownParent: $("#itemMasterSettingsModal"),
        ajax: {
            url: BASE_URL + "/item-master-search",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { serviceCodeOrName: params.term };
            },
            processResults: function (data) {
                return { results: data.data };
            },
            cache: true,
        },
    });

    $("#searchColdChainItem").on("select2:select", function (e) {
        const selectedText = e.params.data.text;
        const selectedId = String(e.params.data.id);
        tagifyColdChainElement.addTags([selectedText]);
        let existingValue = $("#selectedColdChainItemId").val();
        let itemIds = existingValue ? existingValue.split(",").map(String) : [];
        if (!itemIds.includes(selectedId)) {
            itemIds.push(selectedId);
            $("#selectedColdChainItemId").val(itemIds.join(","));
        }
        $(this).val("").trigger("change");
    });

    $("#saveItemMasterSettingsBtn").click(function () {
        var formData = $("#item_master_settings_form").serialize();
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/create-or-update-item-master-settings",
            type: "POST",
            data: formData,
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-success" },
                    }).then(function () {
                        $("#itemMasterSettingsModal").modal("hide");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        customClass: { confirmButton: "btn btn-danger" },
                    });
                }
            },
            error: function (xhr) {
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

    $("#item_master_settings_btn").click(function (e) {
        $("#itemMasterSettingsModal").modal("show");
        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/get-item-master-settings",
            type: "GET",
            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status) {
                    response.data.otherUnits == "0"
                        ? $("#otherUnitFormsContainer").hide()
                        : $("#otherUnitFormsContainer").show();
                    response.data.otherUnits == "1"
                        ? $("#otherUnitFlag").prop("checked", true).val(1)
                        : $("#otherUnitFlag").prop("checked", false).val(0);

                    $.ajax({
                        url: BASE_URL + "/get-already-exist-item-master-settings",
                        method: "GET",
                        data: {
                            statickey: $("#statickey").val(),
                            group_key: $("#group_key").val(),
                        },
                        success: function (response) {
                            if (response.status === true) {
                                tagifyColdChainElement.removeAllTags();
                                $("#selectedColdChainItemId").val("");
                                $.each(response.data, function (index, item) {
                                    if (item.staticKey == "cold_chain_item") {
                                        $("#selectedColdChainItemId").val(item.value_en);
                                        if (item.item_names && item.item_names.length > 0) {
                                            tagifyColdChainElement.addTags(item.item_names);
                                        }
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            console.error("Error fetching item master settings:", err);
                        },
                    });
                }
            },
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                console.error("AJAX Error: ", status, error);
            },
        });
    });
});

// function createSfdaRow(sfda = null) {
//     // Get medication options from the existing select dropdown
//     let medicationOptions = '<option value="">Select Medication</option>';

//     // If you have the medications available, build the options
//     // Otherwise, copy from an existing select if it exists
//     if ($('.medicationId').first().length > 0) {
//         $('.medicationId').first().find('option').each(function() {
//             const value = $(this).val();
//             const text = $(this).text();
//             const code = $(this).data('code') || '';
//             medicationOptions += `<option value="${value}" data-code="${code}">${text}</option>`;
//         });
//     }

//     const rowHtml = `
//         <div class="row g-3 mb-3 sfda-row">
//             <!-- Medication -->
//             <div class="col-12 col-md-4">
//                 <label class="form-label labe">Medication Unit</label>
//                 <select name="medicationId[]" class="select2 form-select medicationId" data-allow-clear="true">
//                     ${medicationOptions}
//                 </select>
//             </div>

//             <!-- GTIN -->
//             <div class="col-12 col-md-3">
//                 <label class="form-label labez">GTIN</label>
//                 <input type="text"
//                        name="gtinSFDA[]"
//                        class="form-control gtinSFDA"
//                        value="${sfda && sfda.gtin ? sfda.gtin : ''}" />
//             </div>

//             <!-- Serial No -->
//             <div class="col-12 col-md-3">
//                 <label class="form-label labez">Serial No</label>
//                 <input type="text"
//                        name="serialNoSFDA[]"
//                        class="form-control serialNoSFDA"
//                        value="${sfda && sfda.serialNo ? sfda.serialNo : ''}" />
//             </div>

//             <!-- Actions -->
//             <div class="col-12 col-md-2 d-flex align-items-end gap-2">
//                 <button type="button" class="fw-medium btn btn-icon btn-primary waves-effect waves-light addRow">
//                     <i class="ti ti-plus ti-md"></i>
//                 </button>
//                 <button type="button" class="fw-medium btn btn-icon btn-primary waves-effect waves-light removeRow">
//                     <i class="ti ti-minus ti-md"></i>
//                 </button>
//             </div>
//         </div>
//     `;

//     const $row = $(rowHtml);

//     // Set the medication value if provided
//     if (sfda && sfda.medicationId) {
//         $row.find('.medicationId').val(sfda.medicationId);
//     }

//     return $row;
// }

// // Call selling price
// $(document).ready(function () {

//     let itemMasterId = $('#edit_item_masterId').val();

//     if (!itemMasterId) {
//         return;
//     }

//     $.ajax({
//         url: '/product-management/item-master/get-selling-price/' + itemMasterId,
//         type: 'GET',
//         dataType: 'json',

//         success: function (response) {

//             console.log("Response:", response);

//             if (response.status === true) {
//                 $('#sellingPrice').val(response.sellingPrice);
//             } else {
//                 $('#sellingPrice').val('');
//             }
//         },

//         error: function (xhr) {
//             console.log("Status:", xhr.status);
//             console.log("Response:", xhr.responseText);
//         }

//     });

// });

// add to hs
$(document).on("click", "#addToHsButton", function (e) {
    e.preventDefault();

    let sku = $("#sku").val();
    let itemMasterId = $("#edit_item_masterId").val();

    if (!sku || sku.trim() === "") {
        $("#skuError").removeClass("d-none");
        $("#sku").focus();
        return;
    }
    $("#loader-overlay").show();

    $.ajax({
        url: "/product-management/item-master/sync-hunger",
        type: "POST",
        data: {
            _token: $('meta[name="csrf-token"]').attr("content"),
            itemMasterId: itemMasterId,
            sku: sku,
        },

        success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
                const addedLabel = $("#hsAction").data("added-label");

                $("#hsAction").html(`
                    <span class="text-success fw-semibold">
                        <i class="ti ti-check me-1"></i>
                        ${addedLabel}
                    </span>
                `);

                Swal.fire({
                    icon: "success",
                    text: addedLabel,
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                });
            } else {
                Swal.fire({
                    icon: "error",
                    text:
                        response.errors ||
                        response.message ||
                        "Something went wrong",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                });
            }
        },

        error: function (xhr) {
            let message = "Something went wrong";
            $("#loader-overlay").hide();
            if (xhr.responseJSON) {
                // Case 1: string error  →  {errors:"Item selling price must be greater than zero"}
                if (typeof xhr.responseJSON.errors === "string") {
                    message = xhr.responseJSON.errors;
                }
                // Case 2: validation errors → {errors:{sku:["The sku has already been taken."]}}
                else if (typeof xhr.responseJSON.errors === "object") {
                    let firstKey = Object.keys(xhr.responseJSON.errors)[0];
                    message = xhr.responseJSON.errors[firstKey][0];
                }
                // Case 3: message fallback
                else if (xhr.responseJSON.message) {
                    message = xhr.responseJSON.message;
                }
            }

            Swal.fire({
                icon: "error",
                text: message,
                customClass: {
                    confirmButton: "btn btn-danger",
                },
            });
        },
    });
});

//pageload for edit

let originalSku = null;

function initialPageloadForEdit(item_masterId) {
    $("#loader-overlay").show();
    $.ajax({
        url: BASE_URL + "/edit-item-master/" + item_masterId,
        method: "GET",
        success: function (response) {
            $("#loader-overlay").hide();
            console.log("Full Response:", response);
            if (response.status === true) {
                //TODO:need to implement SFDA later
                // initSfdaMedication();
                const itemMaster = response.data.itemMaster;
                const allUnits = response.data.allUnits || {};
                const baseUnitId = response.data.baseUnitId || "";
                const baseUnit = response.data.baseUnit || null;
                const units = response.data.units || [];
                const basicUnit = response.data.baseUnit;
                const racks = response.data.itemMaster.racks || [];
                const sfda = response.data.sfda || [];
                const hungerStatus = itemMaster.hungerstation_status ?? 0;

                $("#saveItemMasterButton").text("Update");

                // Set values for main fields
                $("#item_master_id").val(itemMaster.itemMasterId || "");
                $("#itemcategoryId").val(itemMaster.categoryId || "");
                $("#brandId").val(itemMaster.brandId || "");
                $("#itemcodeId").val(itemMaster.itemCode || "");
                $("#sku").val(itemMaster.sku || "");
                originalSku = itemMaster.sku || "";
                $("#itemName_en").val(itemMaster.itemName_en || "");
                $("#itemName_ar").val(itemMaster.itemName_ar || "");

                $("#itemMinRetailPrice").val(itemMaster.minretailsPrice);
                $("#itemProfitLevel").val(itemMaster.profitLevel);
                $("#itemRack").val(itemMaster.rack || "");
                $("#itemMinimunQty").val(itemMaster.minimunQty);
                $("#itemReorderQty").val(itemMaster.reorderQty);
                $("#itemMaximunQty").val(itemMaster.maximunQty);
                $("#departmentId").val(itemMaster.masterDepartment || "");
                $("#itemDescription").val(itemMaster.description || "");
                $("#batch_mode").val(itemMaster.batch_mode).trigger("change");
                $("#itemNote").val(itemMaster.note || "");
                $("#itemQuantity").val(itemMaster.quantity);
                $("#itemWholesalePrice").val(itemMaster.wholsalePrice);
                $("#itemAgencyPrice").val(itemMaster.agencyPrice);
                $("#itemvatId").val(itemMaster.taxId || "");
                $("#itembarcode").val(itemMaster.barcode || "");
                $("#itemQRcode")
                    .val(itemMaster.QRcode || "")
                    .trigger("change");
                $("#itemType").val(itemMaster.type).trigger("change");
                $("#hungerstation_status").prop("checked", hungerStatus == 1);
                $("#baseunitId").val(baseUnitId).trigger("change");
                $("#itemBasicCostPrice").val(basicUnit?.costPrice || "");
                $("#itemBasicSellingPrice").val(basicUnit?.sellingPrice || "");
                $("#initial_repeater_item").empty();
                $("#single_rack").prop("checked", false);
                $("#multiple_rack").prop("checked", false);
                $("#itemsingleRack").val("");

                $(
                    "#departmentId,#brandId,#itemvatId,#itemcategoryId,#batch_mode,#itemType",
                ).selectpicker("destroy");
                $(
                    "#departmentId,#brandId,#itemvatId,#itemcategoryId,#batch_mode,#itemType",
                ).selectpicker();
                var clinicOptions = "";
                $(".itemmultipleClinic-initial option").each(function () {
                    var optionValue = $(this).val();
                    var optionText = $(this).text();
                    clinicOptions += `<option value="${optionValue}">${optionText}</option>`;
                });
                $("#multipleRackRepeater").empty();

                // ---------- RACK SECTION ----------
                if (racks.length === 1) {
                    $("#single_rack").prop("checked", true);
                    $("#single-input-box").show();
                    $("#multiple-input-box").hide();
                    const rack = racks[0];
                    $("#itemsingleRack").val(rack.rack_en);
                } else if (racks.length > 1) {
                    $("#multiple_rack").prop("checked", true);
                    $("#single-input-box").hide();
                    $("#multiple-input-box").show();

                    $("#multipleRackRepeater").empty();
                    racks.forEach((rack, index) => {
                        const addMultipleRackButtonDiv =
                            index === 0
                                ? `<button type="button" class="btn btn-icon btn-primary" id="showitemMultipleRack">
                                   <i class="ti ti-plus ti-md"></i>
                               </button>`
                                : `<button type="button" class="btn btn-icon btn-primary" id="showitemMultipleRack" disabled>
                                   <i class="ti ti-plus ti-md"></i>
                               </button>`;

                        const rackHtml = `
                            <div class="row" id="multiple_input_box${index}" style="position: relative;">
                                <div class="col-12 mb-4 mt-2">
                                    <label for="itemmultipleClinic${index}" class="form-label labez">Multiple Rack</label>
                                    <div class="d-flex gap-1 mt-2">
                                        <select id="itemmultipleClinic${index}" 
                                                name="itemmultipleClinic[]" 
                                                placeholder="Add Branch" 
                                                class="select2 form-select form-select-lg itemmultipleClinic-initial" 
                                                data-allow-clear="true">
                                            ${clinicOptions}
                                        </select>
                                        <input type="text"
                                               id="itemmultipleRack${index}"
                                               name="itemmultipleRack[]"
                                               class="form-control"
                                               placeholder="Add Rack"
                                               value="${rack.rack_en}" />
                                        ${addMultipleRackButtonDiv}
                                        <button type="button" 
                                                class="fw-medium btn btn-icon btn-danger removeRack" 
                                                data-target="multiple_input_box${index}">
                                            <i class="ti ti-minus ti-md"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                        $("#multipleRackRepeater").append(rackHtml);

                        $(`#itemmultipleClinic${index}`).select2({
                            width: "100%",
                            dropdownParent: $(`#multiple_input_box${index}`),
                        });
                        $(`#itemmultipleClinic${index}`)
                            .val(rack.clinicId)
                            .trigger("change");
                    });
                }

                $("#single_rack, #multiple_rack").on("change", function () {
                    if ($("#single_rack").is(":checked")) {
                        $("#single-input-box").show();
                        $("#multiple-input-box").hide();
                        $("#itemsingleRack").val("");
                    } else if ($("#multiple_rack").is(":checked")) {
                        $("#single-input-box").hide();
                        $("#multiple-input-box").show();

                        if (
                            $("#multipleRackRepeater").children().length === 0
                        ) {
                            const rackHtml = `
                                <div class="row" id="multiple_input_box0" style="position: relative;">
                                    <div class="col-12 mb-4 mt-2">
                                        <label for="itemmultipleClinic0" class="form-label labez">Multiple Rack</label>
                                        <div class="d-flex gap-1 mt-2">
                                            <select id="itemmultipleClinic0" 
                                                    name="itemmultipleClinic[]" 
                                                    placeholder="Add Branch" 
                                                    class="select2 form-select form-select-lg itemmultipleClinic-initial" 
                                                    data-allow-clear="true">
                                                ${clinicOptions} 
                                            </select>
                                            <input type="text"
                                                   id="itemmultipleRack0"
                                                   name="itemmultipleRack[]"
                                                   class="form-control"
                                                   placeholder="Add Rack"
                                                   value="" />
                                            <button type="button" class="btn btn-icon btn-primary" id="showitemMultipleRack">
                                                <i class="ti ti-plus ti-md"></i>
                                            </button>
                                            <button type="button" 
                                                    class="fw-medium btn btn-icon btn-danger removeRack" 
                                                    data-target="multiple_input_box0">
                                                <i class="ti ti-minus ti-md"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
                            $("#multipleRackRepeater").append(rackHtml);

                            $(`#itemmultipleClinic0`).select2({
                                width: "100%",
                                dropdownParent: $(`#multiple_input_box0`),
                            });
                        }
                    }
                });

                // ---------- UNITS SECTION ----------
                let hasOtherUnits = false;
                units.forEach((unit, index) => {
                    if (unit.status === "basicUnit") {
                        $("#baseunitId").val(unit.unitId);
                        $("#itemBasicCostPrice").val(unit.costPrice);
                        $("#itemBasicSellingPrice").val(unit.sellingPrice);
                    } else {
                        hasOtherUnits = true;

                    const newId = `otherunitId_${index}`;

                        const baseUnitValue = $("#baseunitId").val();
                        let options = "";

                        $("#baseunitId option").each(function () {
                            const optionValue = $(this).val();
                            const optionText = $(this).text();

                            if (optionValue !== baseUnitValue) {
                                options += `<option value="${optionValue}">${optionText}</option>`;
                            }
                        });

                        const addMoreUnitButtonDiv =
                    index === 1
                        ? `<div class="mb-6 col-1 d-flex align-items-end">
                        <button type="button" class="btn btn-icon btn-primary showOtherUnitForm">
                            <i class="ti ti-plus ti-md"></i>
                        </button>
                    </div>`
                        : `<div class="mb-6 col-1 d-flex align-items-end">
                        <button type="button" class="btn btn-icon btn-primary showOtherUnitForm" disabled>
                            <i class="ti ti-plus ti-md"></i>
                        </button>
                    </div>`;

                      const newUnitHtml = `
                            <div class="repeater-item" data-repeater-item>
                                <div class="row">
                                    <div class="col-4">
                                        <div class="mb-6">
                                            <label for="${newId}" class="form-label">Other Unit</label>
                                            <select id="${newId}" 
                                                    name="otherunitId[]" 
                                                    class="select2 form-select form-select-lg otherunitId" 
                                                    data-allow-clear="true">
                                                ${options}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-1">
                                        <div class="mb-6">
                                            <label class="form-label" for="multiple${index}">Multiple</label>
                                            <input type="text" 
                                                   id="multiple${index}" 
                                                   name="itemMultiple[]" 
                                                   class="form-control" 
                                                   value="${unit.multiple}" 
                                                   placeholder="">
                                        </div>
                                    </div>
                                    <div class="col-2">
                                        <div class="mb-6">
                                            <label class="form-label" for="costPrice${index}">Cost Price</label>
                                            <input type="text" 
                                                   id="costPrice${index}" 
                                                   name="itemOtherCostPrice[]" 
                                                   class="form-control" 
                                                   value="${unit.costPrice}" 
                                                   placeholder="">
                                        </div>
                                    </div>
                                    <div class="col-2">
                                        <div class="mb-6">
                                            <label class="form-label" for="sellingPrice${index}">Selling Price</label>
                                            <input type="text" 
                                                   id="sellingPrice${index}" 
                                                   name="itemOthersellingPrice[]" 
                                                   class="form-control" 
                                                   value="${unit.sellingPrice}" 
                                                   placeholder="">
                                        </div>
                                    </div>
                                    ${addMoreUnitButtonDiv}
                                    <div class="mb-6 col-2 d-flex align-items-end">
                                        <button type="button" class="btn btn-label-danger delete-row" data-id="${unit.itemUnitId}">
                                            <i class="ti ti-x ti-xs me-1"></i>
                                            <span class="align-middle">Delete</span>
                                        </button>
                                    </div>
                                </div>
                                <hr class="mt-0">
                            </div>`;
                $("#otherUnitRepeater").append(newUnitHtml);

                        $(`#${newId}`).select2({
                            // placeholder: "{{ __('productmanagement::item-master-index.value_selectUnits') }}",
                            allowClear: true,
                            width: "100%",
                            dropdownParent: $(`#${newId}`).closest(".repeater-item"),
                        });
                        $(`#${newId}`).val(unit.unitId).trigger("change");
                    }
                });
                if (!hasOtherUnits) {
                    const baseUnitValue = $("#baseunitId").val();
                    let options = "";
                    $("#baseunitId option").each(function () {
                        const optionValue = $(this).val();
                        const optionText = $(this).text();

                        if (optionValue !== baseUnitValue) {
                            options += `<option value="${optionValue}">${optionText}</option>`;
                        }
                    });

                    const newId = getNextOtherUnitId();

                    const defaultUnitHtml = `
                        <div class="repeater-item" data-repeater-item>
                            <div class="row">
                                <div class="col-4">
                                    <div class="mb-6">
                                        <label for="${newId}" class="form-label">Other Unit</label>
                                        <select id="${newId}" 
                                                name="otherunitId[]" 
                                                class="select2 form-select form-select-lg otherunitId" 
                                                data-allow-clear="true">
                                            ${options}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-1">
                                    <div class="mb-6">
                                        <label class="form-label" for="multiple0">Multiple</label>
                                        <input type="text" 
                                               id="multiple0" 
                                               name="itemMultiple[]" 
                                               class="form-control" 
                                               placeholder="">
                                    </div>
                                </div>
                                <div class="col-2">
                                    <div class="mb-6">
                                        <label class="form-label" for="costPrice0">Cost Price</label>
                                        <input type="text" 
                                               id="costPrice0" 
                                               name="itemOtherCostPrice[]" 
                                               class="form-control" 
                                               placeholder="">
                                    </div>
                                </div>
                                <div class="col-2">
                                    <div class="mb-6">
                                        <label class="form-label" for="sellingPrice0">Selling Price</label>
                                        <input type="text" 
                                               id="sellingPrice0" 
                                               name="itemOthersellingPrice[]" 
                                               class="form-control" 
                                               placeholder="">
                                    </div>
                                </div>
                               <div class="mb-6 col-1 d-flex align-items-end">
                                    <button type="button" class="btn btn-icon btn-primary showOtherUnitForm">
                                        <i class="ti ti-plus ti-md"></i>
                                    </button>
                                </div>
                                <div class="mb-6 col-2 d-flex align-items-end">
                                    <button type="button" class="btn btn-label-danger delete-row" disabled>
                                        <i class="ti ti-x ti-xs me-1"></i>
                                        <span class="align-middle">Delete</span>
                                    </button>
                                </div>
                            </div>
                            <hr class="mt-0">
                        </div>
                    `;
                   $("#otherUnitRepeater").append(defaultUnitHtml);

                    $(`#${newId}`).select2({
                        // placeholder: "{{ __('productmanagement::item-master-index.value_selectUnits') }}",
                        allowClear: true,
                        width: "100%",
                        dropdownParent: $(`#${newId}`).closest(".repeater-item"),
                    });
                }

                if (typeof window.loadSfdaDataForEdit === "function") {
                    window.loadSfdaDataForEdit(response.data.sfda || []);
                }
                
            }
        },
    });
}
$("#itemName_en").on("input", function () {
    this.value = this.value.replace(
        /[^a-zA-Z0-9\s\-_.,!@#$%^&*()+=<>?/\\|{}[\]:;"']/g,
        "",
    );
});

$("#itemName_ar,#itemDescription,#brand_name_ar").on("input", function () {
    this.value = this.value.replace(
        /[^\u0600-\u06FF0-9\s\-_.,!@#$%^&*()+=<>?/\\|{}[\]:;"']/g,
        "",
    );
});
//TODO:need to implement SFDA later

// function initSfdaMedication() {

//     console.log("SFDA Select2 initializing...");

//     $('#sfda_medication').select2({

//         ajax: {
//             url: BASE_URL + '/medications-search',
//             dataType: 'json',
//             delay: 250,

//             data: function (params) {

//                 console.log("Search term:", params.term);
//                 console.log("Page:", params.page);

//                 return {
//                     search: params.term || '',
//                     page: params.page || 1
//                 };
//             },

//             processResults: function (res) {
//                 console.log("API response:", res);
//                 console.log("Total items available:", res.pagination.total);

//                 // YOU MUST RETURN THE OBJECT
//                 return {
//                     results: res.data.map(function (item) {
//                         return {
//                             id: item.nphiesMedicationId,
//                             text: item.display,
//                             code: item.code
//                         };
//                     }),
//                     pagination: {

//                         more: res.pagination.more
//                     }
//                 };
//             },

//             error: function (xhr) {
//                 console.error("Select2 AJAX error:", xhr);
//             }
//         },

//         placeholder: "Search Medication",
//         minimumInputLength: 0,
//         width: '100%'

//     });

// }

// //selection gtin code auto
// $(document).on('select2:select', '#sfda_medication', function (e) {
//     console.log("Selected medication:", e.params.data);
//     let data = e.params.data;

// // UI display
//     $('#sfda_gtin').val(data.code);
//     $('#sfda_medication_code').val(data.id);

//     // Hidden fields for DB
//     $('#sfda_medication_id').val(data.id);
//     $('#sfda_gtin_hidden').val(data.code);

// });
//TODO:need to implemetrn SFDA edit later
// function loadMedicationForEdit(medicationId) {
//     if (!medicationId) return;

//     $.ajax({
//         url: BASE_URL + '/medications/get/' + medicationId,
//         type: 'GET',
//         success: function(response) {
//             if (response.status && response.data) {
//                 const medication = response.data;

//                 // Create option with the medication data
//                 const option = new Option(
//                     medication.display || medication.name,
//                     medication.nphiesMedicationId || medication.id,
//                     true,
//                     true
//                 );

//                 // Append to select and set value
//                 $('#sfda_medication')
//                     .append(option)
//                     .val(medication.nphiesMedicationId || medication.id)
//                     .trigger('change');

//                 // Update GTIN if available
//                 if (medication.code) {
//                     $('#sfda_gtin').val(medication.code);
//                     $('#sfda_gtin_hidden').val(medication.code);
//                 }
//             }
//         },
//         error: function(xhr) {
//             console.error('Error loading medication:', xhr);
//         }
//     });
// }

// // In your initialPageloadForEdit function
// if (sfda.length > 0) {
//     const sfdaItem = sfda[0];

//     $("#sfda_serial_no").val(sfdaItem.serialNo || '');
//     $("#sfda_gtin").val(sfdaItem.gtin || '');
//     $("#sfda_gtin_hidden").val(sfdaItem.gtin || '');
//     $("#sfda_medication_id").val(sfdaItem.medicationId || '');

//     // Initialize select2 first
//     initSfdaMedication();

//     // Then load the medication data
//     if (sfdaItem.medicationId) {
//         loadMedicationForEdit(sfdaItem.medicationId);
//     }
// }
