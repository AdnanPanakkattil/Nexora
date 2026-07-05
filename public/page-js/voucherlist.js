var currentPage    = 1;
var currentFilters = {};
var currentStart   = "";
var currentEnd     = "";
var currentPerPage = 10;
var totalVouchers  = 0;
var totalPages     = 1;

$(document).ready(function () {

    if (typeof VOUCHER_LIST_URL !== "undefined" && VOUCHER_LIST_URL) {

        $("#accounts_main_menu").addClass("active open menu-item-animating");
        $("#voucher_list_sub_menu").addClass("active");

        $("#toggleFilterBtn").on("click", function () {
            $("#filterPanel").slideToggle(200);
        });

        $("#filterVoucherType, #filterFinancialYear, #filterBranch").select2({
            width: "100%",
            allowClear: true,
            placeholder: function () {
                return $(this).find("option:first").text();
            }
        }).on("select2:select select2:unselect", function () {
            currentPage = 1;
            reloadWithFilters();
        });

        var inputTimer = null;
        $(document).on("input", ".filter-trigger-input", function () {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(function () {
                currentPage = 1;
                reloadWithFilters();
            }, 600);
        });

        $("#perPageSelect").on("change", function () {
            currentPerPage = parseInt($(this).val());
            currentPage    = 1;
            reloadWithFilters();
        });

        $("#clearFilterBtn").on("click", function () {
            $("#filterVoucherType").val("").trigger("change");
            $("#filterFinancialYear").val("").trigger("change");
            $("#filterBranch").val("").trigger("change");
            $("#filterDebit").val("");
            $("#filterCredit").val("");
            currentPage = 1;
            reloadWithFilters();
        });

        $("#prevBtn").on("click", function () {
            if (currentPage > 1) {
                currentPage--;
                loadJournalEntries(currentStart, currentEnd, currentPage, currentFilters, currentPerPage);
            }
        });
        $("#nextBtn").on("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                loadJournalEntries(currentStart, currentEnd, currentPage, currentFilters, currentPerPage);
            }
        });

        currentStart = moment().startOf("month").format("YYYY-MM-DD");
        currentEnd   = moment().endOf("month").format("YYYY-MM-DD");
        reloadWithFilters();
    }

    // ── Voucher Edit/View load ──
    if (typeof VOUCHER_LOAD_URL !== "undefined" && VOUCHER_LOAD_URL) {

        var params = new URLSearchParams(window.location.search);
        var txnId  = params.get("txn_id");
        var mode   = params.get("mode");

        if (txnId) {
            $("#loader-overlay").show();

            $.ajax({
                url:    VOUCHER_LOAD_URL.replace("__TXN__", txnId),
                method: "GET",
                success: function (data) {
                    $("#loader-overlay").hide();
                    setTimeout(function () {
                        populateVoucher(data, mode);
                    }, 300);
                },
                error: function () {
                    $("#loader-overlay").hide();
                    Swal.fire("Error", "Failed to load voucher data.", "error");
                }
            });
        }
    }
});

// ════════════════════════════════════════════════════════════════
//  VOUCHER LIST functions
// ════════════════════════════════════════════════════════════════

function getFilters() {
    return {
        voucher_type_id:   $("#filterVoucherType").val()   || "",
        financial_year_id: $("#filterFinancialYear").val() || "",
        branch_id:         $("#filterBranch").val()        || "",
        debit:             $("#filterDebit").val()         || "",
        credit:            $("#filterCredit").val()        || "",
    };
}

function reloadWithFilters() {
    currentStart   = moment().startOf("month").format("YYYY-MM-DD");
    currentEnd     = moment().endOf("month").format("YYYY-MM-DD");
    currentFilters = getFilters();
    loadJournalEntries(currentStart, currentEnd, currentPage, currentFilters, currentPerPage);
}

function showLoader() { $("#tableLoader").show(); $("#tableWrapper").hide(); }
function hideLoader() { $("#tableLoader").hide(); $("#tableWrapper").show(); }

function loadJournalEntries(startDate, endDate, page, filters, perPage) {
    page    = page    || 1;
    filters = filters || {};
    perPage = perPage || 10;

    showLoader();

    var params = { start_date: startDate, end_date: endDate, page: page, per_page: perPage };
    $.each(filters, function (k, v) {
        if (v !== "" && v !== null && v !== undefined) params[k] = v;
    });

    $.ajax({
        url:    VOUCHER_LIST_URL,
        method: "GET",
        data:   params,

        success: function (response) {
            hideLoader();
            totalPages    = response.last_page;
            totalVouchers = response.total_vouchers;
            currentPage   = response.current_page;

            var html = "";

            if (!response.data || response.data.length === 0) {
                html = '<tr><td colspan="7" class="text-center py-3">' + LANG_NO_DATA + '</td></tr>';
                $("#journalBody").html(html);
                updateFooter(0, 0, 0);
                renderPagination(response);
                return;
            }

            response.data.forEach(function (group) {
                var entries       = group.entries;
                var voucherType   = group.voucher_type_name;
                var voucherTypeId = group.voucher_type_id;
                var financialYear = group.financial_year_name;
                var txnId         = group.transaction_id;

                var debitEntries  = entries.filter(function (e) { return parseFloat(e.debit)  > 0; });
                var creditEntries = entries.filter(function (e) { return parseFloat(e.credit) > 0; });
                var totalRows     = debitEntries.length + creditEntries.length;
                var firstRow      = true;

                debitEntries.forEach(function (entry, index) {
                    html += buildRow(
                        index === 0 ? entry.dateOfPayment : "",
                        getAccountName(entry),
                        parseFloat(entry.debit).toFixed(2), "",
                        firstRow, totalRows, voucherType, voucherTypeId, financialYear, txnId
                    );
                    firstRow = false;
                });

                creditEntries.forEach(function (entry) {
                    html += buildRow(
                        "", getAccountName(entry),
                        "", parseFloat(entry.credit).toFixed(2),
                        firstRow, totalRows, voucherType, voucherTypeId, financialYear, txnId
                    );
                    firstRow = false;
                });

                html += '<tr class="voucher-sep"><td colspan="7"></td></tr>';
            });

            $("#journalBody").html(html);
            bindActionMenus();

            var from = (currentPage - 1) * perPage + 1;
            var to   = from + response.data.length - 1;
            updateFooter(from, to, totalVouchers);
            renderPagination(response);
        },

        error: function () {
            hideLoader();
            alert("Failed to load journal entries.");
        },
    });
}

function getAccountName(entry) {
    if (entry.display_account_name && entry.display_account_name !== "-") {
        return entry.display_account_name;
    }
    if (entry.account_head && entry.account_head.accountHeadName) {
        return entry.account_head.accountHeadName;
    }
    if (entry.sub_account_head && entry.sub_account_head.subAccountHeadName) {
        return entry.sub_account_head.subAccountHeadName;
    }
    return "N/A";
}

function buildRow(date, account, debit, credit, isFirst, totalRows, voucherType, voucherTypeId, financialYear, txnId) {
    if (isFirst) {
        var baseUrl  = (typeof VOUCHER_ROUTES !== "undefined" && VOUCHER_ROUTES[voucherTypeId])
            ? VOUCHER_ROUTES[voucherTypeId]
            : "#";
        var editUrl  = baseUrl !== "#" ? baseUrl + "?txn_id=" + txnId + "&mode=edit" : "#";
        var viewUrl  = baseUrl !== "#" ? baseUrl + "?txn_id=" + txnId + "&mode=view" : "#";

        var menu = '<ul class="action-menu" id="menu-' + txnId + '">'
            + '<li><a class="dropdown-item" href="' + editUrl + '">Edit</a></li>'
            + '<li><a class="dropdown-item" href="' + viewUrl + '">View</a></li>'
            + '<li><a class="dropdown-item" href="' + VOUCHER_PRINT_URL + '/' + txnId + '" target="_blank">' + LANG_PRINT + '</a></li>'
            + '</ul>';

        var actionCell = '<td rowspan="' + totalRows + '" class="text-center align-middle" style="position:relative;">'
            + '<div class="dropdown" style="position:relative;display:inline-block;">'
            + '<button class="three-dots-btn dropdown-toggle-custom" data-txn="' + txnId + '">&#8942;</button>'
            + menu + '</div></td>';

        return '<tr>'
            + '<td>' + date + '</td>'
            + '<td>' + account + '</td>'
            + '<td>' + debit + '</td>'
            + '<td>' + credit + '</td>'
            + '<td rowspan="' + totalRows + '" class="align-middle text-center">' + voucherType + '</td>'
            + '<td rowspan="' + totalRows + '" class="align-middle text-center">' + financialYear + '</td>'
            + actionCell + '</tr>';
    }

    return '<tr>'
        + '<td>' + date + '</td>'
        + '<td>' + account + '</td>'
        + '<td>' + debit + '</td>'
        + '<td>' + credit + '</td>'
        + '</tr>';
}

function bindActionMenus() {
    $(document).off("click.actionMenu").on("click.actionMenu", function (e) {
        if (!$(e.target).closest(".dropdown").length) $(".action-menu").hide();
    });
    $(".dropdown-toggle-custom").off("click").on("click", function (e) {
        e.stopPropagation();
        var txnId = $(this).data("txn");
        var $menu = $("#menu-" + txnId);
        $(".action-menu").not($menu).hide();
        $menu.toggle();
    });
}

function updateFooter(from, to, total) {
    if (total === 0) {
        $("#showingInfo").text("Showing 0 to 0 of 0 entries");
    } else {
        $("#showingInfo").text("Showing " + from + " to " + to + " of " + total + " entries");
    }
    $("#prevBtn").prop("disabled", currentPage <= 1);
    $("#nextBtn").prop("disabled", currentPage >= totalPages);
}

function renderPagination(response) {
    if (response.last_page <= 1) { $("#pagination").empty(); return; }
    var html = "";
    for (var i = 1; i <= response.last_page; i++) {
        html += '<li class="page-item ' + (i == response.current_page ? "active" : "") + '">'
            + '<a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>';
    }
    $("#pagination").html('<ul class="pagination mb-0">' + html + '</ul>');
    $("#pagination .page-link").off("click").on("click", function (e) {
        e.preventDefault();
        currentPage = parseInt($(this).data("page"));
        loadJournalEntries(currentStart, currentEnd, currentPage, currentFilters, currentPerPage);
    });
}

// ════════════════════════════════════════════════════════════════
//  VOUCHER EDIT / VIEW functions
// ════════════════════════════════════════════════════════════════

function populateVoucher(data, mode) {
    var fpEl = document.querySelector("#flatpickr-date");
    if (fpEl && fpEl._flatpickr) {
        fpEl._flatpickr.setDate(data.date);
    } else {
        $("#flatpickr-date").val(data.date);
    }

    var $clinic = $("#clinicId");
    if (typeof $.fn.selectpicker !== "undefined") {
        try { $clinic.selectpicker("destroy"); } catch(e) {}
    }
    $clinic.find("option").prop("selected", false);
    $clinic.find("option[value='" + data.clinic_id + "']").prop("selected", true);
    if (typeof $.fn.selectpicker !== "undefined") {
        $clinic.selectpicker();
    }

    
    var $voucher = $("#voucherId");
    if (typeof $.fn.selectpicker !== "undefined") {
        try { $voucher.selectpicker("destroy"); } catch(e) {}
        $voucher.selectpicker();
    }

    $("#description").val(data.narration || "");

    $(".custom-table tbody").empty();

    if (data.entries && data.entries.length > 0) {
        data.entries.forEach(function (entry) {
            if (typeof addRow === "function") addRow();

            var $lastRow    = $(".custom-table tbody tr:last");
            var $accSel     = $lastRow.find(".account-select");

            var val, displayText;
            if (entry.chart_of_accounts_id) {
                val         = entry.chart_of_accounts_id;
                displayText = entry.account_name || "Account";
            } else {
                displayText = entry.sub_account_name || entry.account_name || "Account";
                val = entry.sub_account_head_id
                    ? entry.sub_account_head_id
                    : (entry.account_head_id ? "head-" + entry.account_head_id : "");
            }

            if (val) {
                if ($accSel.find("option[value='" + val + "']").length === 0) {
                    $accSel.append(new Option(displayText, val, true, true));
                } else {
                    $accSel.find("option[value='" + val + "']").text(displayText);
                }
                $accSel.val(val).trigger("change");
            }

            $lastRow.find("textarea").val(entry.particulars || "");
            $lastRow.find("input[name='debit']").val(parseFloat(entry.debit)   > 0 ? entry.debit   : "");
            $lastRow.find("input[name='credit']").val(parseFloat(entry.credit) > 0 ? entry.credit  : "");
        });
    }

    if (typeof updateTotals === "function") updateTotals();

    if (mode === "edit") {
        applyEditMode(data);
    } else if (mode === "view") {
        applyViewMode();
    }
}

function applyEditMode(data) {
    var $saveBtn = $("#saveBtn");
    $saveBtn.html('<i class="menu-icon tf-icons ti ti-refresh"></i> Update');
    $saveBtn.removeClass("btn-success").addClass("btn-primary");

    $saveBtn.off("click").on("click", function () {
        Swal.fire({
            title:             "Update Voucher?",
            text:              "Are you sure you want to update this voucher?",
            icon:              "question",
            showCancelButton:  true,
            confirmButtonText: "Yes, Update",
            cancelButtonText:  "Cancel",
            customClass: {
                confirmButton: "btn btn-primary waves-effect waves-light",
                cancelButton:  "btn btn-label-secondary waves-effect waves-light",
            },
        }).then(function (result) {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                submitUpdate(data.txn_id);
            }
        });
    });
}

function applyViewMode() {
    $(".custom-table input, .custom-table textarea, .custom-table select").prop("disabled", true);
    $("#flatpickr-date, #description").prop("disabled", true);

    var $clinic  = $("#clinicId");
    var $voucher = $("#voucherId");

    if (typeof $.fn.selectpicker !== "undefined") {
        try { $clinic.selectpicker("destroy"); } catch(e) {}
        try { $voucher.selectpicker("destroy"); } catch(e) {}
    }
    $clinic.prop("disabled", true);
    $voucher.prop("disabled", true);
    if (typeof $.fn.selectpicker !== "undefined") {
        $clinic.selectpicker();
        $voucher.selectpicker();
    }

    $("#saveBtn, #draftSaveAs").hide().prop("disabled", true);
    $(".custom-table .btn-label-danger").hide();
    $(".text-end .btn-primary").hide().prop("disabled", true);

    $("#attachments-drop-area").css({ "pointer-events": "none", "opacity": "0.6" });
    $("#dz-file-input").prop("disabled", true);

    // if ($("#viewModeBanner").length === 0) {
    //     $(".card-header").append(
    //         '<span id="viewModeBanner" class="badge bg-label-info ms-2" style="font-size:13px;">View Only</span>'
    //     );
    // }
}

function submitUpdate(txnId) {
    var entries = [];
    var isValid = true;

    $(".custom-table tbody tr").each(function () {
        var $row      = $(this);
        var accVal    = $row.find(".account-select").val();
        var debit     = parseFloat($row.find("input[name='debit']").val())  || 0;
        var credit    = parseFloat($row.find("input[name='credit']").val()) || 0;
        var narration = $row.find("textarea").val();

        if (!accVal) { isValid = false; return; }

        var accStr = accVal.toString();
        var isHead = accStr.startsWith("head-");
        entries.push({
            chartOfAccountsId: isHead ? null : parseInt(accVal),
            subAccountHeadId:  null,
            accountHeadId:     isHead ? parseInt(accStr.replace("head-", "")) : null,
            debit:             debit,
            credit:            credit,
            narration:         narration,
        });
    });

    if (!isValid || entries.length === 0) {
        $("#loader-overlay").hide();
        Swal.fire("Validation Error", "Please fill all account fields.", "warning");
        return;
    }

    $.ajax({
        url:         "/voucher-list/update-transaction/" + txnId,
        method:      "POST",
        contentType: "application/json",
        data: JSON.stringify({
            _token:    $('meta[name="csrf-token"]').attr("content"),
            entries:   entries,
            date:      $("#flatpickr-date").val(),
            clinic_id: $("#clinicId").val(),
            narration: $("#description").val(),
        }),
        success: function () {
            $("#loader-overlay").hide();
            Swal.fire({
                icon:  "success",
                title: "Updated!",
                text:  "Voucher updated successfully.",
                customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
            }).then(function () { window.history.back(); });
        },
        error: function () {
            $("#loader-overlay").hide();
            Swal.fire("Error", "Failed to update voucher.", "error");
        }
    });
}