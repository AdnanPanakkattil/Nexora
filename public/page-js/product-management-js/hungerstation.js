// GLOBAL

$(document).ready(function () {

    // Menu Active
    $("#product_management_main_menu").addClass("active open menu-item-animating");
    $("#hungerstation_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // DATATABLE

    var hungerTable = $("#hungerstation_table").DataTable({
        processing: true,
        serverSide: true,
        pageLength: 10,

        ajax: {
            url: BASE_URL + "/hungerstation_index",
            data: function (d) {
                d.product_name = $("#product_name").val();
                d.sku = $("#sku").val();
                d.status = $("#status").val(); // correct
            },
        },

        columns: [
            { data: "itemMasterId", name: "itemMasterId" },
            { data: "itemCode", name: "itemCode" },
            { data: "itemName_en", name: "itemName_en" },
            { data: "barcode", name: "barcode" },
            { data: "price", name: "price" },

            // STATUS COLUMN
            {
                data: "status",
                name: "status",
                render: function (data) {
                    if (data === "Active") {
                        return '<span class="badge bg-success">Active</span>';
                    } else {
                        return '<span class="badge bg-danger">Non Active</span>';
                    }
                }
            }, 

            { data: "last_sync", name: "last_sync" },

            {
                data: "itemMasterId",
                name: "itemMasterId",
                orderable: false,
                searchable: false,
                render: function (data) {
                    return '<button class="btn btn-sm btn-danger hs-unsync-btn" data-id="' + data + '">' +
                           '<i class="ti ti-trash"></i> Delete</button>';
                }
            }
        ],
    });

    // DELETE (UNSYNC) BUTTON

    $("#hungerstation_table").on("click", ".hs-unsync-btn", function () {
        var id = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "This will remove the item from HungerStation sync.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete!",
            cancelButtonText: "Cancel",
            customClass: { confirmButton: "btn btn-danger", cancelButton: "btn btn-secondary" },
            buttonsStyling: false
        }).then(function (result) {
            if (!result.isConfirmed) return;

            $.ajax({
                url: BASE_URL + "/hungerstation-unsync/" + id,
                type: "POST",
                data: { _token: $('meta[name="csrf-token"]').attr("content") },
                beforeSend: function () { $("#loader-overlay").show(); },
                success: function (res) {
                    if (res.status) {
                        Swal.fire({ icon: "success", title: "Deleted", text: res.message, customClass: { confirmButton: "btn btn-success" }, buttonsStyling: false });
                        hungerTable.ajax.reload(null, false);
                    } else {
                        Swal.fire({ icon: "error", title: "Error", text: res.message || "Failed.", customClass: { confirmButton: "btn btn-danger" }, buttonsStyling: false });
                    }
                },
                error: function () {
                    Swal.fire({ icon: "error", title: "Error", text: "Something went wrong.", customClass: { confirmButton: "btn btn-danger" }, buttonsStyling: false });
                },
                complete: function () { $("#loader-overlay").hide(); }
            });
        });
    });

    // SEARCH BUTTON

    $("#hunger_search_btn").on("click", function () {
        hungerTable.ajax.reload();
    });

    // ══════════════════════════════════════════════════════════════
    //  IMPORT WIZARD
    // ══════════════════════════════════════════════════════════════

    var CSRF = $('meta[name="csrf-token"]').attr("content");

    // ── helpers ──────────────────────────────────────────────────

    // flex rows (footers) need class swap so display:flex is preserved
    function hsShowFlex($el) { $el.removeClass("d-none").addClass("d-flex"); }
    function hsHideFlex($el) { $el.removeClass("d-flex").addClass("d-none"); }

    function hsGoStep(n) {
        // block panels — jQuery show/hide sets inline display:block / display:none
        // which overrides both inline styles and CSS-class-based hiding
        n === 1  ? $("#hs_step1_panel").show()   : $("#hs_step1_panel").hide();
        n === 2  ? $("#hs_step2_panel").show()   : $("#hs_step2_panel").hide();
        n === 31 ? $("#hs_step3_loading").show() : $("#hs_step3_loading").hide();
        n === 32 ? $("#hs_step3_success").show() : $("#hs_step3_success").hide();
        n === 33 ? $("#hs_step3_error").show()   : $("#hs_step3_error").hide();

        // flex footer rows
        n === 1  ? hsShowFlex($("#hs_footer1"))         : hsHideFlex($("#hs_footer1"));
        n === 2  ? hsShowFlex($("#hs_footer2"))         : hsHideFlex($("#hs_footer2"));
        n === 32 ? hsShowFlex($("#hs_footer3_success")) : hsHideFlex($("#hs_footer3_success"));
        n === 33 ? hsShowFlex($("#hs_footer3_error"))   : hsHideFlex($("#hs_footer3_error"));

        // close button hidden while loading
        n === 31 ? $("#import_modal_close_btn").hide() : $("#import_modal_close_btn").show();

        // wizard circles
        var stepNum = (n === 1) ? 1 : (n === 2) ? 2 : 3;
        [1, 2, 3].forEach(function (i) {
            var $s = $("#ws" + i);
            $s.removeClass("active done");
            if (i < stepNum)        $s.addClass("done");
            else if (i === stepNum) $s.addClass("active");
        });
        $("#wl1").toggleClass("done", stepNum > 1);
        $("#wl2").toggleClass("done", stepNum > 2);
    }

    function hsReset() {
        $("#hunger_excel_file").val("");
        $("#hs_upload_zone").removeClass("has-file");
        $("#hs_file_name").hide().text("");
        hsGoStep(1);
    }

    function hsBuildOptions(headers, addSkip) {
        var html = addSkip
            ? '<option value="">— Skip —</option>'
            : '<option value="">— Select column —</option>';
        headers.forEach(function (h) {
            var safe = $("<span>").text(h).html();
            html += '<option value="' + safe + '">' + safe + '</option>';
        });
        return html;
    }

    function hsAutoSelect(selector, candidates, headers) {
        headers.forEach(function (h) {
            var slug = h.toLowerCase().replace(/[\s_\-]+/g, "_");
            if (candidates.indexOf(slug) !== -1) $(selector).val(h);
        });
    }

    function hsExtractError(xhr) {
        if (!xhr.responseJSON) return "Something went wrong.";
        if (xhr.responseJSON.errors) {
            var errs = xhr.responseJSON.errors;
            if (typeof errs === "object") {
                var k = Object.keys(errs)[0];
                return Array.isArray(errs[k]) ? errs[k][0] : errs[k];
            }
        }
        return xhr.responseJSON.message || "Unknown error.";
    }

    // ── open modal ───────────────────────────────────────────────

    $("#hunger_import_btn").on("click", function () {
        hsReset();
        $("#hungerImportModal").modal("show");
    });

    // ── upload zone click / drag ─────────────────────────────────

    $("#hs_upload_zone").on("click", function (e) {
        if ($(e.target).is("input")) return;
        $("#hunger_excel_file").trigger("click");
    });

    $("#hs_upload_zone").on("dragover", function (e) {
        e.preventDefault();
        $(this).addClass("has-file");
    }).on("dragleave drop", function (e) {
        e.preventDefault();
        if (e.type === "drop") {
            var file = e.originalEvent.dataTransfer.files[0];
            if (file) {
                $("#hunger_excel_file")[0].files; // can't set programmatically
                // use DataTransfer to assign
                var dt = new DataTransfer();
                dt.items.add(file);
                $("#hunger_excel_file")[0].files = dt.files;
                hsShowFile(file.name);
            }
        } else {
            $(this).removeClass("has-file");
        }
    });

    $("#hunger_excel_file").on("change", function () {
        if (this.files[0]) hsShowFile(this.files[0].name);
    });

    function hsShowFile(name) {
        $("#hs_upload_zone").addClass("has-file");
        $("#hs_file_name").show().html('<i class="ti ti-file-spreadsheet me-1"></i>' + name);
    }

    // ── STEP 1 → STEP 2: read headers ───────────────────────────

    $("#hs_btn_load_columns").on("click", function () {
        var file = $("#hunger_excel_file")[0].files[0];
        if (!file) {
            Swal.fire({ icon: "warning", title: "No file selected", text: "Please choose an Excel file first.", customClass: { confirmButton: "btn btn-warning" }, buttonsStyling: false });
            return;
        }

        var fd = new FormData();
        fd.append("excel_file", file);
        fd.append("_token", CSRF);

        $("#loader-overlay").show();

        $.ajax({
            url: BASE_URL + "/hungerstation-read-headers",
            type: "POST", data: fd, processData: false, contentType: false,
            success: function (res) {
                $("#loader-overlay").hide();
                if (!res.status) {
                    Swal.fire({ icon: "error", title: "Error", text: res.message || "Could not read file.", customClass: { confirmButton: "btn btn-danger" }, buttonsStyling: false });
                    return;
                }
                var h = res.headers;
                $("#map_item_code"          ).html(hsBuildOptions(h, false));
                $("#map_sync_hunger_station").html(hsBuildOptions(h, true));
                $("#map_sku"                ).html(hsBuildOptions(h, true));
                hsAutoSelect("#map_item_code",           ["item_code","itemcode","code","sku_code"], h);
                hsAutoSelect("#map_sync_hunger_station", ["sync_hunger_station","synchungerstation","sync","hunger_sync"], h);
                hsAutoSelect("#map_sku",                 ["sku","sku_number","product_sku"], h);
                hsGoStep(2);
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                Swal.fire({ icon: "error", title: "Error", text: hsExtractError(xhr), customClass: { confirmButton: "btn btn-danger" }, buttonsStyling: false });
            }
        });
    });

    // ── STEP 2 back ──────────────────────────────────────────────

    $("#hs_btn_back").on("click", function () { hsGoStep(1); });

    // ── STEP 2 → STEP 3: import ──────────────────────────────────

    $("#hs_btn_import").on("click", function () {
        var itemCodeCol = $("#map_item_code").val();
        if (!itemCodeCol) {
            Swal.fire({ icon: "warning", title: "Mapping required", text: "Please map the Item Code column before importing.", customClass: { confirmButton: "btn btn-warning" }, buttonsStyling: false });
            return;
        }

        var file = $("#hunger_excel_file")[0].files[0];
        var fd   = new FormData();
        fd.append("excel_file", file);
        fd.append("_token", CSRF);
        fd.append("mapping[item_code]", itemCodeCol);
        var syncCol = $("#map_sync_hunger_station").val();
        var skuCol  = $("#map_sku").val();
        if (syncCol) fd.append("mapping[sync_hunger_station]", syncCol);
        if (skuCol)  fd.append("mapping[sku]", skuCol);

        hsGoStep(31); // show loader inside modal

        $.ajax({
            url: BASE_URL + "/hungerstation-import",
            type: "POST", data: fd, processData: false, contentType: false,
            success: function (res) {
                if (res.status) {
                    $("#hs_updated_count").text(res.updated);
                    $("#hs_skipped_count").text(res.skipped);
                    hsGoStep(32);
                    hungerTable.ajax.reload();
                } else {
                    $("#hs_error_msg").text(res.message || "An error occurred.");
                    hsGoStep(33);
                }
            },
            error: function (xhr) {
                $("#hs_error_msg").text(hsExtractError(xhr));
                hsGoStep(33);
            }
        });
    });

    // ── Step 3 retry / import another ────────────────────────────

    $("#hs_btn_retry"         ).on("click", function () { hsGoStep(2); });
    $("#hs_btn_import_another").on("click", function () { hsReset(); });

    // EXPORT BUTTON

    $("#hunger_export_btn").on("click", function () {
        var params = new URLSearchParams({
            product_name: $("#product_name").val() || '',
            sku: $("#sku").val() || '',
        });

        // Clear any leftover cookie before starting
        document.cookie = "fileDownload=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

        $("#loader-overlay").show();
        window.location.href = BASE_URL + "/hungerstation-export?" + params.toString();

        var pollTimer = setInterval(function () {
            if (document.cookie.split(';').some(function (c) {
                return c.trim().startsWith('fileDownload=');
            })) {
                clearInterval(pollTimer);
                // Clear the cookie
                document.cookie = "fileDownload=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                $("#loader-overlay").hide();
            }
        }, 400);

        // Safety fallback after 30 seconds
        setTimeout(function () {
            clearInterval(pollTimer);
            $("#loader-overlay").hide();
        }, 30000);
    });

});

$("#sync_hunger").on("click", function () {

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to sync all products?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Sync!",
        cancelButtonText: "Cancel",
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-secondary"
        },
        buttonsStyling: false
    }).then((result) => {

        if (result.isConfirmed) {

            $.ajax({
                url: BASE_URL + "/hungerstation-sync",
                type: "POST",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                
                beforeSend: function () {
                    $("#loader-overlay").show();
                },

                success: function (res) {

                    if (res.status) {

                        let errorHtml = "";

                        
                        if (res.errors && res.errors.length > 0) {
                            errorHtml = "<br><br><b>Errors:</b><br>" + res.errors.join("<br>");
                        }

                        Swal.fire({
                            icon: "success",
                            title: "Sync Completed",
                            html:
                                "Success: <b>" + res.success_count + "</b><br>" +
                                "Failed: <b>" + res.fail_count + "</b>" +
                                errorHtml,
                            customClass: {
                                confirmButton: "btn btn-success"
                            },
                            buttonsStyling: false
                        });

                    } else {

                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res.message || "Sync failed",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            },
                            buttonsStyling: false
                        });
                    }

                
                    $("#hungerstation_table").DataTable().ajax.reload();
                },

                error: function (xhr) {

                    let message = "Something went wrong!";

                    if (xhr.responseJSON) {

                        if (typeof xhr.responseJSON.errors === 'string') {
                            message = xhr.responseJSON.errors;
                        } else if (typeof xhr.responseJSON.errors === 'object') {
                            let firstKey = Object.keys(xhr.responseJSON.errors)[0];
                            message = xhr.responseJSON.errors[firstKey][0];
                        } else if (xhr.responseJSON.message) {
                            message = xhr.responseJSON.message;
                        }
                    }

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: message,
                        customClass: {
                            confirmButton: "btn btn-danger"
                        },
                        buttonsStyling: false
                    });
                },

            
                complete: function () {
                    $("#loader-overlay").hide();
                }
            });

        }

    });

});