$(document).ready(function () {
    $("#product_management_main_menu").addClass(
        "active open menu-item-animating"
    );
    $("#stock_management_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    if ($("#stock_management_id").val()) {
        $("#selectBranch").prop("disabled", true);
    }

    $(document).ready(function () {
        const stockManagementId = $("#stock_management_id").val();

        $('button[data-bs-target="#navs-justified-profile"]').on(
            "shown.bs.tab",
            function () {
                // Only initialize once
                if (!$.fn.DataTable.isDataTable("#uncountedProductTable")) {
                    $("#uncountedProductTable").DataTable({
                        processing: true,
                        serverSide: false,
                        ajax:
                            BASE_URL +
                            `/stock-management/uncounted-products/${stockManagementId}`,
                        columns: [
                            { data: "itemMasterId", title: "Item Master Id" },

                            { data: "itemCode", title: "Item Code" },
                            { data: "itemName_en", title: "Item Name" },
                            { data: "realStock", title: "Stock" },

                            {
                                data: null,
                                name: "actions",
                                orderable: false,
                                searchable: false,
                                render: function (data, type, full, meta) {
                                    var stockInventoryUrl =
                                        BASE_URL +
                                        "/stock-inventory/" +
                                        full.itemMasterId;
                                    var deleteUrl =
                                        BASE_URL +
                                        "/delete-item-master/" +
                                        full.itemMasterId;

                                    // Check if realStock is 0
                                    var isDeletable =
                                        parseFloat(full.realStock) === 0;

                                    // Build dropdown menu
                                    var deleteButton = "";
                                    if (isDeletable) {
                                        // Active delete button
                                        deleteButton =
                                            '<li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' +
                                            deleteUrl +
                                            '">Delete</a></li>';
                                    } else {
                                        // Disabled delete button (non-clickable)
                                        deleteButton =
                                            '<li><a href="javascript:;" class="dropdown-item text-muted disabled" title="Cannot delete: Stock available">Delete (Stock exist)</a></li>';
                                    }

                                    return (
                                        '<div class="d-inline-block">' +
                                        '<input type="hidden" name="stock_management_item_id[]" value="' +
                                        full.stockManagementItemId +
                                        '">' +
                                        '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
                                        '<i class="ti ti-dots-vertical ti-md"></i></a>' +
                                        '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                                        '<li><a href="' +
                                        stockInventoryUrl +
                                        '" class="dropdown-item">View Stock Inventory</a></li>' +
                                        '<div class="dropdown-divider"></div>' +
                                        deleteButton +
                                        "</ul>" +
                                        "</div>"
                                    );
                                },
                            },
                        ],
                        // Optional: ensures column width recalculation
                        autoWidth: false,
                    });
                } else {
                    // Adjust columns if already initialized
                    $("#uncountedProductTable")
                        .DataTable()
                        .columns.adjust()
                        .draw();
                }
            }
        );
    });

    $("#uncountedProductTable").on("click", ".item-delete", function () {
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
                            //    $("#uncountedProductTable").ajax.reload(null, false);
                            $("#uncountedProductTable")
                                .DataTable()
                                .ajax.reload(null, false);
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

    // function toggleFooter() {
    //     if ($('.custom-check:checked').length > 0) {
    //         $('.footz').show();
    //     } else {
    //         $('.footz').hide();
    //     }
    // }

    // $(document).on('change', '.custom-check', toggleFooter);

    //     $(document).on("click", "#excelImportBtn", function (e) {
    //     e.preventDefault();

    //     let branchId = $("#selectBranch").val();

    //     if (!branchId) {
    //         alert("Please select a branch first!");
    //         return;
    //     }

    //     let baseUrl = $(this).attr("href");
    //     let url = baseUrl + "/" + branchId;

    //     window.location.href = url;
    // });

    let now = new Date();
    $(".stockDateAndTime ").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: now,
    });

    if ($("#edit_stock_management_id").val()) {
        initialPageLoad($("#edit_stock_management_id").val());
        var inventorySheetTable = $("#inventory_sheet_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url:
                    BASE_URL +
                    "/stock-management-item-lists-by-stock-number/" +
                    $("#edit_stock_management_id").val(), // URL for the server-side processing
            },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            columns: [
                { data: "itemMasterId", name: "itemMasterId" },
                { data: "itemCode", name: "itemCode" },
                { data: "itemName", name: "itemName" },
                { data: "sellingPrice", name: "sellingPrice" },
                { data: "costPrice", name: "costPrice" },


                { data: "systemStock", name: "systemStock" },
                { data: "actualStock", name: "actualStock" },

                { data: "stockDifference", name: "stockDifference" },
                { data: "realStock", name: "realStock" },
                {
                    data: "created_at",
                    name: "created_at",
                    render: function (data, type, row) {
                        if (!row.created_at) return "-";

                        // Format created_at as DD-MM-YYYY HH:mm:ss
                        let createdAt = new Date(row.created_at);
                        return createdAt.toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });
                    },
                },
                {
                    data: "updated_at",
                    name: "updated_at",
                    render: function (data, type, row) {
                        if (!row.updated_at) return "-";

                        // Compare timestamps
                        let createdAt = new Date(row.created_at);
                        let updatedAt = new Date(row.updated_at);

                        // If same (to the second), display '-'
                        if (
                            Math.abs(
                                createdAt.getTime() - updatedAt.getTime()
                            ) < 1000
                        ) {
                            return "-";
                        }

                        // Otherwise format updated_at
                        return updatedAt.toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });
                    },
                },
                {
                    data: null,
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        var stockInventoryUrl =
                            BASE_URL + "/stock-inventory/" + full.itemMasterId;
                        var editUrl =
                            BASE_URL +
                            "/edit-stock-management-item/" +
                            full.stockManagementItemId;
                        var detailsUrl =
                            BASE_URL +
                            "/detail-of-stock-management-item/" +
                            full.stockManagementItemId;

                        var deleteUrl =
                            BASE_URL +
                            "/delete-stock-management-item/" +
                            full.stockManagementItemId;
                        return (
                            '<div class="d-inline-block">' +
                            '<input type="hidden" name="stock_management_item_id[]"  value="' +
                            full.stockManagementItemId +
                            '"></input>' +
                            '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            '<li><a href="' +
                            stockInventoryUrl +
                            '" class="dropdown-item" >View Stock Inventory</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item  edit-stock-management" data-id="' +
                            editUrl +
                            '">Edit</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item detail-of-stock-management-item" data-id="' +
                            detailsUrl +
                            '">Details</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item text-danger delete-stock-management" data-id="' +
                            deleteUrl +
                            '">Delete</a></li>' +
                            "</ul>" +
                            "</div>"
                        );
                    },
                },
            ],
            dom:
                '<"row"' +
                '<"col-md-2"<"ms-n2"l>>' +
                '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
                ">rt" +
                '<"row"' +
                '<"col-sm-12 col-md-6"i>' +
                '<"col-sm-12 col-md-6"p>' +
                ">",
            buttons: [
                {
                    extend: "excelHtml5",
                    title: "Inventory Sheet",
                    text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                    className: "btn btn-primary waves-effect waves-light",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8], // exclude action column
                    },
                },
            ],
            // Custom loader
            // 👇 Highlight each duplicate item group with its own color
            // drawCallback: function (settings) {
            //     var api = this.api();
            //     var itemGroups = {};
            //     var colorPalette = [
            //         '#ffeaea', '#eaffea', '#eaf4ff', '#fff4e6', '#f3e6ff',
            //         '#e0f7fa', '#fff9c4', '#f8bbd0', '#d1c4e9', '#c8e6c9'
            //     ];
            //     var colorIndex = 0;

            //     // Reset colors before re-applying
            //     api.rows({ page: 'current' }).every(function () {
            //         $(this.node()).css('background-color', '');
            //     });

            //     // Group rows by itemName
            //     api.rows({ page: 'current' }).every(function () {
            //         var data = this.data();
            //         var name = data.itemName;
            //         if (!itemGroups[name]) itemGroups[name] = [];
            //         itemGroups[name].push(this.node());
            //     });

            //     // Assign a unique color to each duplicate group
            //     $.each(itemGroups, function (name, rows) {
            //         if (rows.length > 1) {
            //             var color = colorPalette[colorIndex % colorPalette.length];
            //             $(rows).each(function () {
            //                 $(this).css({
            //                     backgroundColor: color,
            //                 });
            //             });
            //             colorIndex++;
            //         }
            //     });
            // },

            // Show the loader in the center
            processing: true,
        });
    } else if ($("#stock_management_id").val()) {
        var inventorySheetTable = $("#inventory_sheet_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url:
                    BASE_URL +
                    "/stock-management-item-lists/" +
                    $("#stock_management_id").val(), // URL for the server-side processing
            },
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "All"],
            ],
            columns: [
                { data: "itemMasterId", name: "itemMasterId" },
                { data: "itemCode", name: "itemCode" },

                { data: "itemName", name: "itemName" },
                { data: "sellingPrice", name: "sellingPrice" },
                { data: "costPrice", name: "costPrice" },
                { data: "systemStock", name: "systemStock" },
                { data: "actualStock", name: "actualStock" },

                { data: "stockDifference", name: "stockDifference" },
                { data: "realStock", name: "realStock" },
                {
                    data: "created_at",
                    name: "created_at",
                    render: function (data, type, row) {
                        if (!row.created_at) return "-";

                        // Format created_at as DD-MM-YYYY HH:mm:ss
                        let createdAt = new Date(row.created_at);
                        return createdAt.toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });
                    },
                },
                {
                    data: "updated_at",
                    name: "updated_at",
                    render: function (data, type, row) {
                        if (!row.updated_at) return "-";

                        // Compare timestamps
                        let createdAt = new Date(row.created_at);
                        let updatedAt = new Date(row.updated_at);

                        // If same (to the second), display '-'
                        if (
                            Math.abs(
                                createdAt.getTime() - updatedAt.getTime()
                            ) < 1000
                        ) {
                            return "-";
                        }

                        // Otherwise format updated_at
                        return updatedAt.toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });
                    },
                },

                {
                    data: null,
                    name: "actions",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        var stockInventoryUrl =
                            BASE_URL + "/stock-inventory/" + full.itemMasterId;
                        var editUrl =
                            BASE_URL +
                            "/edit-stock-management-item/" +
                            full.stockManagementItemId;
                        var detailsUrl =
                            BASE_URL +
                            "/detail-of-stock-management-item/" +
                            full.stockManagementItemId;

                        var deleteUrl =
                            BASE_URL +
                            "/delete-stock-management-item/" +
                            full.stockManagementItemId;
                        return (
                            '<div class="d-inline-block">' +
                            '<input type="hidden" name="stock_management_item_id[]"  value="' +
                            full.stockManagementItemId +
                            '"></input>' +
                            '<a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>' +
                            '<ul class="dropdown-menu dropdown-menu-end m-0">' +
                            '<li><a href="' +
                            stockInventoryUrl +
                            '" class="dropdown-item" >View Stock Inventory</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item  edit-stock-management" data-id="' +
                            editUrl +
                            '">Edit</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item detail-of-stock-management-item" data-id="' +
                            detailsUrl +
                            '">Details</a></li>' +
                            '<div class="dropdown-divider"></div>' +
                            '<li><a href="javascript:;" class="dropdown-item text-danger delete-stock-management" data-id="' +
                            deleteUrl +
                            '">Delete</a></li>' +
                            "</ul>" +
                            "</div>"
                        );
                    },
                },
            ],
            dom:
                '<"row"' +
                '<"col-md-2"<"ms-n2"l>>' +
                '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
                ">rt" +
                '<"row"' +
                '<"col-sm-12 col-md-6"i>' +
                '<"col-sm-12 col-md-6"p>' +
                ">",
            buttons: [
                {
                    extend: "excelHtml5",
                    title: "Inventory Sheet",
                    text: '<i class="fa fa-file-excel-o me-0 me-sm-1 ti-xs"></i> <span class="d-none d-sm-inline-block">Export to Excel</span>',
                    className: "btn btn-primary waves-effect waves-light",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8], // exclude action column
                    },
                },
            ],
            // Custom loader

            // Show the loader in the center
            processing: true,
        });
    }

    inventorySheetTable.on("click", ".edit-stock-management", function () {
        var editUrl = $(this).data("id");
        $('#add_item_to_stock_btn').prop("disabled", false).text("Save");

        $.ajax({
            url: editUrl,
            method: "GET",
            success: function (response) {
                if (response.status === true) {
                    console.log(response.data.item_master);
                    $("#edit_stock_management_item_id").val(
                        response.data.stockManagementItemId
                    );
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $("#edit_stock_management_id").val(
                        response.data.stockManagementId
                    );
                    $("#selectBranch")
                        .val(response.data.branchId)
                        .trigger("change");
                    let dateTime = response.data.stockDateAndTime;
                    let formattedDateTime = dateTime
                        ? dateTime.slice(0, 16)
                        : "";
                    $(".stockDateAndTime").val(formattedDateTime);
                    $("#notes").val(response.data.notes);
                    $("#addItemStockModal").modal("show");
                    $("#systemStock").val(response.data.systemStock);
                    $("#actualStock").val(response.data.actualStock);
                    $("#stockDifference").val(response.data.stockDifference);
                    initializeProductSearchSelect2();

                    console.log(response.data.item_master.itemMasterId);

                    if (
                        response.data.item_master.itemMasterId &&
                        response.data.item_master.itemName_en
                    ) {
                        console.log(response.data.item_master.itemName_en);

                        var newOption = new Option(
                            response.data.item_master.itemName_en, // text
                            response.data.item_master.itemMasterId, // value
                            true, // selected
                            true // defaultSelected
                        );
                        $("#selectItem").append(newOption).trigger("change");
                        console.log(
                            response.data.item_master.base_unit.unit
                                .unit_name_en
                        );
                    }
                    if (
                        response.data.item_master.base_unit.itemUnitId &&
                        response.data.item_master.base_unit.unit.unit_name_en
                    ) {
                        // console.log(response.data.item_master.itemName_en);

                        var newUnitOption = new Option(
                            response.data.item_master.base_unit.unit.unit_name_en, // text
                            response.data.item_master.base_unit.itemUnitId, // value
                            true, // selected
                            true // defaultSelected
                        );
                        $("#selectItemUnit")
                            .append(newUnitOption)
                            .trigger("change");
                    }
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

    inventorySheetTable.on(
        "click",
        ".detail-of-stock-management-item",
        function () {
            var editUrl = $(this).data("id");
            $.ajax({
                url: editUrl,
                method: "GET",
                success: function (response) {
                    if (response.status === true) {
                        console.log(response.data.item_master);
                        $("#edit_stock_management_item_id").val(
                            response.data.stockManagementItemId
                        );
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                        $("#edit_stock_management_id").val(
                            response.data.stockManagementId
                        );
                        $("#selectBranch")
                            .val(response.data.branchId)
                            .trigger("change");
                        let dateTime = response.data.stockDateAndTime;
                        let formattedDateTime = dateTime
                            ? dateTime.slice(0, 16)
                            : "";
                        $(".stockDateAndTime").val(formattedDateTime);
                        $("#notes").val(response.data.notes);
                        $("#addItemStockModal").modal("show");
                        $("#systemStock").val(response.data.systemStock);
                        $("#actualStock").val(response.data.actualStock);
                        $("#stockDifference").val(
                            response.data.stockDifference
                        );
                        initializeProductSearchSelect2();

                        console.log(response.data.item_master.itemMasterId);

                        if (
                            response.data.item_master.itemMasterId &&
                            response.data.item_master.itemName_en
                        ) {
                            console.log(response.data.item_master.itemName_en);

                            var newOption = new Option(
                                response.data.item_master.itemName_en, // text
                                response.data.item_master.itemMasterId, // value
                                true, // selected
                                true // defaultSelected
                            );
                            $("#selectItem")
                                .append(newOption)
                                .trigger("change");
                        }
                        if (
                            response.data.item_master.base_unit.itemUnitId &&
                            response.data.item_master.base_unit.unit
                                .unit_name_en
                        ) {
                            // console.log(response.data.item_master.itemName_en);

                            var newUnitOption = new Option(
                                response.data.item_master.base_unit.unit.unit_name_en, // text
                                response.data.item_master.base_unit.itemUnitId, // value
                                true, // selected
                                true // defaultSelected
                            );
                            $("#selectItemUnit")
                                .append(newUnitOption)
                                .trigger("change");
                        }

                        $("#add_item_to_stock_div").hide();
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
        }
    );

    inventorySheetTable.on("click", ".delete-stock-management", function () {
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
                    text: "Deleting item.",
                    icon: "error",
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
            }
        });
    });

    $("#addItemStockModalBtn").on("click", function () {
        $('#add_item_to_stock_btn').prop("disabled", false).text("Save");

        $("#addItemStockModal").modal("show");

        $("#selectItem").select2({
            dropdownParent: $("#addItemStockModal"),
            placeholder: "Search Item Name",
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url: BASE_URL + "/stock-management/search-item-name-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    var selectBranch = $("#selectBranch").val();
                    return {
                        itemName: params.term,
                        selectBranch: selectBranch,
                    };
                },
                processResults: function (data) {
                    console.log("cccc");

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
    });

    $("#selectItem").on("select2:select", function (e) {
        console.log(e.params.data);

        var stockText = e.params.data.itemStock; // "- stock(0)"
        // var stockMatch = stockText.match(/\((\d+)\)/);
        var stockMatch = stockText.match(/\((-?\d+)\)/); // <-- updated regex

        if (stockMatch) {
            var stockValue = stockMatch[1]; // "0"
            console.log("Stock:", stockValue);
            $("#systemStock").val(stockValue);
        } else {
            console.log("No stock value found=>" + stockMatch);
        }

        getItemDetailForStockManagement(e.params.data.id);

        checkItemAlreadyExist(e.params.data.id);
    });

    $("#addItemStockModal").on("hidden.bs.modal", function () {
        $("#actual_stock_form")[0].reset(); // Clear form inputs
        $("#selectItem").val(null).trigger("change"); // Reset select2
    });
});

$(document).on("input", "#actualStock", function () {
    let systemStock = parseFloat($("#systemStock").val()) || 0;
    let actualStock = parseFloat($(this).val()) || 0;
    let difference = actualStock - systemStock;
    //let difference = Math.abs(actualStock) - Math.abs(systemStock);

    $("#stockDifference").val(difference);
});

$(document).on("click", "#add_item_to_stock_btn", function (e) {
    e.preventDefault();
    $('#add_item_to_stock_btn').prop('disabled', true);
    $('#add_item_to_stock_btn').text('Product Adding...');

    if (!validateActualStockForm()) {
        $('#add_item_to_stock_btn').prop("disabled", false).text("Save");
        return false;
    }

    var stockFormData = $("#stock_form").serialize();
    var actualStockFormData = $("#actual_stock_form").serialize();
    var combinedData = stockFormData + "&" + actualStockFormData;
    var stockManagementItemId = $("#edit_stock_management_item_id").val();

    var ajaxUrl = stockManagementItemId
        ? BASE_URL + "/update-stock-management-item/" + stockManagementItemId
        : BASE_URL + "/stock-management-item";
    var method = stockManagementItemId ? "PUT" : "POST";
    $.ajax({
        url: ajaxUrl,
        type: method,
        data: combinedData,
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
                    // location.reload();
                    $('#inventory_sheet_table').DataTable().ajax.reload(null, false);

                    // Optional: reset the form after success
                    $("#stock_form")[0].reset();
                    $("#actual_stock_form")[0].reset();
                    $('#selectItem').val(null).trigger('change');
                    // $('#selectItemUnit').val(null).trigger('change');
                    $('#selectItemUnit').empty().trigger('change');

                    // Optional: close modal if using one
                    $("#addItemStockModal").modal('hide');
                });
            } else {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    // location.reload();
                    $('#inventory_sheet_table').DataTable().ajax.reload(null, false);

                    // Optional: reset the form after success
                    $("#stock_form")[0].reset();
                    $("#actual_stock_form")[0].reset();
                    $('#selectItem').val(null).trigger('change');
                    // $('#selectItemUnit').val(null).trigger('change');
                    $('#selectItemUnit').empty().trigger('change');


                    // Optional: close modal if using one
                    $("#addItemStockModal").modal('hide');

                });
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 422) {
                $('#add_item_to_stock_btn').prop("disabled", false).text("Save");
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

$(document).on("click", "#save_inventory_btn", function (e) {
    e.preventDefault(); // prevent default form submission
    let table = $("#inventory_sheet_table").DataTable();
    let itemCount = table.rows().count();

    if (itemCount > 0) {
        var stockFormData = $("#stock_form").serialize();
        var actualStockFormData = $("#actual_stock_form").serialize();

        // Manually collect dynamic inputs from the inventory table
        var extraInputs = "";
        $("#inventory_sheet_table")
            .find(
                'input[name="stock_management_item_id[]"], input[name="selectItem[]"], input[name="systemStock[]"], input[name="actualStock[]"], input[name="stockDifference[]"]'
            )
            .each(function () {
                var inputName = $(this).attr("name");
                var inputValue = $(this).val();
                extraInputs +=
                    "&" +
                    encodeURIComponent(inputName) +
                    "=" +
                    encodeURIComponent(inputValue);
            });

        var combinedData =
            stockFormData + "&" + actualStockFormData + extraInputs;

        $.ajax({
            url:
                BASE_URL +
                "/stock-management/" +
                $("#stock_management_id").val(),
            type: "PUT",
            data: combinedData,
            success: function (response) {
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
    } else {
        Swal.fire({
            icon: "error", // Change this to "error" for error messages
            text: "You must have items in table to save this page.",
            customClass: {
                confirmButton: "btn btn-danger waves-effect waves-light", // Optional: Change button styling for error
            },
        }).then(function () {
            location.reload();
        });
    }
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
        repo.itemStock;
    ("</div>");

    markup += "</div></div>";

    return markup;
}

function formatRepoSelection(repo) {
    return repo.text || repo.id;
}

function initializeProductSearchSelect2() {
    $("#selectItem").select2({
        dropdownParent: $("#addItemStockModal"),
        placeholder: "Search Item Name",
        allowClear: true,
        minimumInputLength: 3,
        ajax: {
            url: BASE_URL + "/stock-management/search-item-name-by-query",
            dataType: "json",
            delay: 250,
            data: function (params) {
                var selectBranch = $("#selectBranch").val();
                return {
                    itemName: params.term,
                    selectBranch: selectBranch,
                };
            },
            processResults: function (data) {
                console.log("cccc");

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
}

function initialPageLoad(editStockManagementId) {
    $.ajax({
        url: BASE_URL + "/edit-stock-management/" + editStockManagementId,
        type: "GET",
        success: function (response) {
            if (response.status) {
                console.log(response.data.purchase_order);
                $("#selectBranch")
                    .val(response.data.branchId)
                    .trigger("change");
                let dateTime = response.data.stockDateAndTime;
                let formattedDateTime = dateTime ? dateTime.slice(0, 16) : "";
                $(".stockDateAndTime").val(formattedDateTime);
                $("#notes").val(response.datanotes);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", status, error);
        },
    });
}

function getItemDetailForStockManagement(itemId) {
    $.ajax({
        url: BASE_URL + "/purchase/purchase-order-get-item-details/" + itemId,
        type: "get",
        success: function (response) {
            if (response.status === true) {
                // Prepare the dropdown options based on `units`
                let options = `<option value="" >Select</option>`;
                if (response.data.units) {
                    response.data.units.forEach(function (unit) {
                        options += `<option value="${unit.itemUnitId}" data-unit-price="${unit.sellingPrice}">${unit.unit.unit_name_en}</option>`;
                    });
                }
                console.log(options);
                $("#selectItemUnit").html(options).trigger("change");
                $(`#selectItemUnit`)
                    .val(response.data.base_unit.itemUnitId)
                    .trigger("change");

                // $(".item-unit").select2({
                //     placeholder: "Selection", // Match the placeholder in the select
                //     allowClear: true,
                // });

                // toggleDiscountColumns();
                // updateSlColumn();
            } else {
                console.error("Service details not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
    });
}

function checkItemAlreadyExist(itemMasterId) {
    $.ajax({
        url: BASE_URL + "/stock-management-item-already-exists/" + itemMasterId,
        type: "get",
        data: {
            stockManagementId:
                $("#stock_management_id").val() ||
                $("#edit_stock_management_id").val() ||
                null,
        },
        success: function (response) {
            if (response.status === true) {
                if (
                    "Item already exists in the inventory." === response.message
                ) {
                    Swal.fire({
                        title: "Warning!",
                        text: response.message,
                        icon: "warning",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton:
                                "btn btn-warning waves-effect waves-light",
                        },
                    });
                }
            } else {
                console.error("Service details not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        },
    });
}

// ✅ Validation Function
function validateActualStockForm() {
    // Clear previous errors
    $(".error-text").remove();

    let isValid = true;

    let selectItem = $("#selectItem").val();
    let selectItemUnit = $("#selectItemUnit").val();
    let systemStock = $("#systemStock").val().trim();
    let actualStock = $("#actualStock").val().trim();
    let stockDifference = $("#stockDifference").val().trim();

    // Product validation
    if (!selectItem) {
        $("#selectItem")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Please select a product.</small>'
            );
        isValid = false;
    }

    // Unit validation
    if (!selectItemUnit) {
        $("#selectItemUnit")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Please select a unit.</small>'
            );
        isValid = false;
    }

    // System Stock validation
    if (!systemStock) {
        $("#systemStock")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">System stock is required.</small>'
            );
        isValid = false;
    } else if (isNaN(systemStock)) {
        $("#systemStock")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">System stock must be a number.</small>'
            );
        isValid = false;
    }

    // Actual Stock validation
    if (!actualStock) {
        $("#actualStock")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Actual stock is required.</small>'
            );
        isValid = false;
    } else if (isNaN(actualStock)) {
        $("#actualStock")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Actual stock must be a number.</small>'
            );
        isValid = false;
    }

    // Stock Difference validation
    if (!stockDifference) {
        $("#stockDifference")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Stock difference is required.</small>'
            );
        isValid = false;
    } else if (isNaN(stockDifference)) {
        $("#stockDifference")
            .closest(".col-md-12")
            .append(
                '<small class="text-danger error-text">Stock difference must be a number.</small>'
            );
        isValid = false;
    }

    return isValid;
}



$(document).on("click", "#zeroUncountedBtn", function () {
    let stockManagementId = $("#stock_management_id").val();
    if (!stockManagementId) return;

    Swal.fire({
        title: "Are you sure?",
        text: "This will set all uncounted items to zero.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-primary me-2",
            cancelButton: "btn btn-secondary"
        }
    }).then(function (result) {
        if (!result.isConfirmed) return;

        $("#loader-overlay").show();
        $.ajax({
            url: BASE_URL + "/stock-management/" + stockManagementId + "/zero-uncounted",
            type: "POST",
            success: function (response) {
                $("#loader-overlay").hide();
               if (response.status === true) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!", 
                        text: response.message,
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        showCancelButton: false,
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: "btn btn-success" 
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(function () {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.message,
                        showConfirmButton: true,
                        showCancelButton: false
                    });
                }
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire({
                    icon: "error",
                    text: "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    showCancelButton: false
                });
            }
        });
    });
});

    $(document).ready(function () {

        $("#excelImportBtn").on("click", function () {
            const id = $(this).data("stock-id");
            const stockId = $('#stock_management_id').val();
            // Disable UI immediately
            $('#upload_excel_btn, #addItemStockModalBtn').prop('disabled', true);
            $('#excelImportBtn')
                .addClass('disabled')
                .css('pointer-events', 'none')
                .css('opacity', '0.6')
                // .text('Processing...');

            window.location.href = BASE_URL + "/stock-management-item-lists-excel-import/" + id;
             
        });

    });

    window.ExcelImportProgress = function(stockManagementId) {
    window.Echo.channel("excel-import-progress")
        .listen(".excel.import.progress", (event) => {
            if (event.stockManagementId == stockManagementId) {
                $('#excelImportBtn')
                    .addClass('disabled')
                    .css('pointer-events', 'none')
                    .css('opacity', '0.6')
                    // .text('Processing ' + event.processed + '...');
                    // $('#excelImportBtn').text('Processing ' + event.processed + '%...');
                    $('#excelImportBtn').html(
                        '<span class="spinner-border spinner-border-sm me-1"></span> Processing ' 
                        + event.processed + '%'
                     );

            }
        });
    };