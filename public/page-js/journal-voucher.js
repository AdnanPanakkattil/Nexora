$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    initAccountSelect($(".account-select"));

    $(".gst-select").each(function () {
        if ($(this).data("select2")) {
            $(this).select2("destroy");
        }
        if (!$(this).parent().hasClass("position-relative")) {
            $(this).wrap(
                '<div class="position-relative" style="width:100%;"></div>',
            );
        }
        $(this).select2({
            dropdownParent: $(this).parent(),
            minimumResultsForSearch: Infinity,
            width: "100%",
        });
    });

    bindCalculationEvents();

    function matchAttachmentsHeight() {
        const descHeight = $("#description").outerHeight();
        if (descHeight) {
            $("#attachments-drop-area").css("min-height", descHeight + "px");
        }
    }

    matchAttachmentsHeight();
    $(window).on("resize", matchAttachmentsHeight);

    $(document).on("click", "#attachments-drop-area", function (e) {
        if ($(e.target).closest(".dz-remove-btn").length) return;
        $("#dz-file-input").trigger("click");
    });

    $("#dz-file-input").on("change", function () {
        Array.from(this.files).forEach(function (file) {
            addFilePreview(file);
        });
        this.value = "";
    });

    const dropArea = document.getElementById("attachments-drop-area");

    if (dropArea) {
        dropArea.addEventListener("dragover", function (e) {
            e.preventDefault();
            this.style.borderColor = "#667eea";
            this.style.background = "#f0f4ff";
        });

        dropArea.addEventListener("dragleave", function () {
            this.style.borderColor = "#a0aec0";
            this.style.background = "#fafafa";
        });

        dropArea.addEventListener("drop", function (e) {
            e.preventDefault();
            this.style.borderColor = "#a0aec0";
            this.style.background = "#fafafa";

            Array.from(e.dataTransfer.files).forEach(function (file) {
                addFilePreview(file);
            });
        });
    }

    $("#saveBtn").click(function () {
        saveVoucher("posted");
    });

    $("#draftSaveAs").click(function () {
        saveVoucher("draft");
    });

    function saveVoucher(status) {
        const entries = [];

        $(".custom-table tbody tr").each(function () {
            const $row = $(this);
            const accountSelect = $row.find(".account-select")[0];

            const chartOfAccountsId = $(accountSelect).val();

            const narration = $row.find("textarea[name='narration']").val();

            const debit =
                parseFloat($row.find("input[name='debit']").val()) || 0;

            const credit =
                parseFloat($row.find("input[name='credit']").val()) || 0;

            if (chartOfAccountsId) {
                entries.push({
                    chartOfAccountsId,
                    narration,
                    debit,
                    credit,
                });
            }
        });

        // Check entries were collected
        if (entries.length === 0) {
            Swal.fire({
                icon: "warning",
                text: "Please add at least one account entry.",
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            return;
        }

        // Each entry must have either debit OR credit (not both zero)
        const invalidEntries = entries.filter(
            (e) => e.debit === 0 && e.credit === 0,
        );
        if (invalidEntries.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Entry",
                text: "Every entry must have either a Debit or Credit amount.",
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            return;
        }

        // Must have at least one debit AND one credit entry
        const hasDebit = entries.some((e) => e.debit > 0);
        const hasCredit = entries.some((e) => e.credit > 0);

        if (!hasDebit || !hasCredit) {
            Swal.fire({
                icon: "warning",
                title: "Missing Entry Type",
                text: "Voucher must have at least one Debit entry and one Credit entry.",
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            return;
        }

        // Must have equal number of debit and credit entries
        const debitCount = entries.filter((e) => e.debit > 0).length;
        const creditCount = entries.filter((e) => e.credit > 0).length;

        if (debitCount !== creditCount) {
            Swal.fire({
                icon: "warning",
                title: "Uneven Entries",
                text: `Each Debit entry needs a matching Credit entry. You have ${debitCount} Debit and ${creditCount} Credit entries.`,
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            return;
        }

        // Debit total must equal credit total
        const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
        const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.001) {
            Swal.fire({
                icon: "warning",
                title: "Unbalanced Voucher",
                text: `Total Debit (${totalDebit.toFixed(2)}) must equal Total Credit (${totalCredit.toFixed(2)}).`,
                customClass: {
                    confirmButton: "btn btn-warning waves-effect waves-light",
                },
            });
            return;
        }

        const metaData = {
            transactionAmount: $("#totalDebit").text(),
            dateOfPayment: $("#flatpickr-date").val(),
            clinicId: $("#clinicId").val(),
            voucherTypeId: $("#voucherId").val(),
            particulars: $("#description").val(),
            financialYearId: $("#financial_year").data("financial-year-id"),
            status: status,
            type: "bill_invoice",
        };

        Swal.fire({
            title: "Are you sure?",
            text: "You want to submit this voucher details?",
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
            if (result.isConfirmed) {
                $.ajax({
                    url: "/accounting/journal-voucher",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        entries: entries,
                        metaData: metaData,
                        _token: $('meta[name="csrf-token"]').attr("content"),
                    }),
                    beforeSend: function () {
                        $("#loader-overlay").show();
                    },
                    success: function (response) {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: "success",
                            text: response.message,
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(() => {
                            location.reload();
                        });
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: "error",
                            text:
                                xhr.responseJSON?.error ||
                                xhr.responseJSON?.message ||
                                "An error occurred.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    },
                });
            }
            // Cancel: Swal closes automatically, nothing happens
        });
    }
    $(document).on(
        "keypress",
        'input[name="debit"], input[name="credit"]',
        function (e) {
            const char = String.fromCharCode(e.which);
            if (!/[\d.]/.test(char)) return false;
            // Prevent multiple decimal points
            if (char === "." && $(this).val().includes(".")) return false;
        },
    );

    $(document).on(
        "paste",
        'input[name="debit"], input[name="credit"]',
        function (e) {
            const pasted = (
                e.originalEvent.clipboardData || window.clipboardData
            ).getData("text");
            if (!/^\d*\.?\d*$/.test(pasted)) e.preventDefault();
        },
    );
});

function addFilePreview(file) {
    const id =
        "file-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);

    const isImage = file.type.startsWith("image/");
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const card = $(`
        <div id="${id}" style="position:relative; width:80px; flex-shrink:0; cursor:default;">
            <div style="width:80px; height:80px; border-radius:12px; overflow:hidden;
                        background:#f0f0f0; display:flex; align-items:center;
                        justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.1);
                        position:relative;">
                ${
                    isImage
                        ? `<img src="${URL.createObjectURL(file)}"
                                style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
                        : `<i class="ti ti-file" style="font-size:28px;color:#667eea;"></i>`
                }
                <button type="button" class="dz-remove-btn"
                    style="position:absolute;top:4px;right:4px;width:22px;height:22px;
                           border-radius:50%;border:none;
                           background:rgba(255,255,255,0.92);
                           display:flex;align-items:center;justify-content:center;
                           cursor:pointer;font-size:12px;color:#e74c3c;padding:0;
                           box-shadow:0 1px 4px rgba(0,0,0,0.25);z-index:10;">
                    <i class="ti ti-x"></i>
                </button>
            </div>
            <div style="font-size:9px;text-align:center;margin-top:3px;
                        overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                        width:80px;color:#555;" title="${file.name}">
                ${file.name}
            </div>
            <div style="font-size:9px;text-align:center;color:#aaa;">${sizeMB}</div>
        </div>
    `);

    card.find(".dz-remove-btn").on("click", function (e) {
        e.stopPropagation();
        card.remove();
    });

    $("#dz-previews-container").append(card);
}

function initAccountSelect($element) {
    // Destroy only if already initialized
    if ($element.hasClass("select2-hidden-accessible")) {
        $element.select2("destroy");
    }

    // Only wrap if not already wrapped
    if (!$element.parent().hasClass("position-relative")) {
        $element.wrap(
            '<div class="position-relative" style="width:100%;"></div>',
        );
    }

    $element.select2({
        dropdownParent: $element.parent(),
        width: "100%",
        theme: "default",
        placeholder: "Search Account...",
        minimumInputLength: 1,
        allowClear: true,
        ajax: {
            url: "/search-chart-accounts",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return { q: params.term };
            },
            processResults: function (data) {
                // Flat list of Chart of Accounts leaf accounts: [{ id, text }].
                return { results: data };
            },
            cache: true,
        },
    });
}

function addRow() {
    const newRow = `
        <tr>
            <td><select class="account-select w-100"></select></td>
            <td>
                <textarea name="narration" class="form-control"
                    style="resize:none;text-align:center;"
                    placeholder="Enter Description"></textarea>
            </td>
            <td>
                <select class="gst-select w-100">
                    <option>No VAT</option>
                    <option>Added Value</option>
                </select>
            </td>
            <td><input type="text" name="debit" class="form-control" placeholder="Enter Debit"></td>
            <td><input type="text" name="credit" class="form-control" placeholder="Enter Credit"></td>
            <td>
                <button type="button"
                    class="btn rounded-pill btn-icon btn-label-danger"
                    onclick="removeRow(this)">
                    <i class="menu-icon tf-icons ti ti-circle-minus m-0"></i>
                </button>
            </td>
        </tr>`;

    $(".custom-table tbody").append(newRow);

    const $lastRow = $(".custom-table tbody tr:last");

    initAccountSelect($lastRow.find(".account-select"));

    $lastRow
        .find(".gst-select")
        .wrap('<div class="position-relative" style="width:100%;"></div>')
        .select2({
            dropdownParent: $lastRow.find(".gst-select").parent(),
            minimumResultsForSearch: Infinity,
            width: "100%",
        });

    calculateTotals();
}

function removeRow(button) {
    $(button).closest("tr").remove();
    calculateTotals();
}

function calculateTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    $('input[name="debit"]').each(function () {
        totalDebit += parseFloat($(this).val()) || 0;
    });

    $('input[name="credit"]').each(function () {
        totalCredit += parseFloat($(this).val()) || 0;
    });

    $("#totalDebit").text(totalDebit.toFixed(2));
    $("#totalCredit").text(totalCredit.toFixed(2));
}

function bindCalculationEvents() {
    $(document).on(
        "input",
        'input[name="debit"], input[name="credit"]',
        function () {
            const $row = $(this).closest("tr");

            const $debit = $row.find('input[name="debit"]');
            const $credit = $row.find('input[name="credit"]');

            const debitVal = parseFloat($debit.val());
            const creditVal = parseFloat($credit.val());

            $credit.prop("disabled", !isNaN(debitVal) && debitVal > 0);
            $debit.prop("disabled", !isNaN(creditVal) && creditVal > 0);

            calculateTotals();
        },
    );
}
