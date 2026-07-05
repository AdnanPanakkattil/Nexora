$(document).ready(function () {
    // Menu Active State

    $("#cahser_setup_main_menu").addClass("active open menu-item-animating");
    $("#cahser_point_sub_menu").addClass("active");

    // Modal Close Handler

    $("#closebtn").on("click", function () {
        $("#exLargeModal").modal("hide");
    });
    $("#btnClose").on("click", function () {
        $("#transferToCashierModal").modal("hide");
        $("#fromdate").val("");
        $("#todate").val("");
    });

    // Get the current date in YYYY-MM-DD format

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    // Fetch Branches and Employees

// Destroy first if already initialized (safe re-init)
    if ($("#branch").data("select2")) {
        $("#branch").select2("destroy");
    }

    $("#branch")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#branch").parent(),
            width: "100%",
            placeholder: "Select Branch",
            allowClear: true,
        });

    if ($("#employee").data("select2")) {
        $("#employee").select2("destroy");
    }

    $("#employee")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#employee").parent(),
            width: "100%",
            placeholder: "Select Employee",
            allowClear: true,
        });

    $("#branch").on("change", function () {
        const clinicId = $(this).val();
        const employeeSelect = $("#employee");

        if (clinicId) {
            $.ajax({
                url: "/fetch-employees",
                method: "POST",
                data: {
                    clinicId: clinicId,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    employeeSelect.empty();
                    employeeSelect.append('<option value="">Select Employee</option>');

                    response.forEach((employee) => {
                        employeeSelect.append(
                            `<option value="${employee.employeeId}">${employee.fullName}</option>`
                        );
                    });
                    if (employeeSelect.data("select2")) {
                        employeeSelect.select2("destroy");
                    }
                    employeeSelect.select2({
                        dropdownParent: employeeSelect.parent(),
                        width: "100%",
                        placeholder: "Select Employee",
                        allowClear: true,
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching employees:", error);
                },
            });
        } else {
            employeeSelect.empty().append('<option value="">Select Employee</option>');
        }
    });

    // Update the customer avatar section with the selected employee's name and ID

    $("#employee").on("change", function () {
        const selectedOption = $(this).find(":selected");
        const fullName = selectedOption.text();
        const staffId = selectedOption.val();

        if (fullName && staffId) {
            $(".customer-avatar-section h5").text(fullName);
            $(".customer-avatar-section span").text(`Staff ID #${staffId}`);
        } else {
            $(".customer-avatar-section h5").text("No employee selected");
            $(".customer-avatar-section span").text("");
        }
    });

    flatpickr("#from-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });
    flatpickr("#to-date", {
        dateFormat: "Y-m-d",
        allowInput: true,
    });

    // Fetching Service Order

    $("#branch, #employee, #from-date, #to-date").on("change", function () {
        const employeeId = $("#employee").val();
        const fromDate = $("#from-date").val();
        const toDate = $("#to-date").val();

        if (employeeId && fromDate && toDate) {
            $.ajax({
                url: "/fetch-service-orders",
                method: "POST",
                data: {
                    employeeId: employeeId,
                    fromDate: fromDate,
                    toDate: toDate,
                    _token: $('meta[name="csrf-token"]').attr("content"),
                },
                success: function (response) {
                    const table = $(".dt-row-grouping").DataTable();
                    table.clear();

                    let totalReceiptAmount = 0;

                    response.forEach(function (record) {
                        const receiptAmount =
                            parseFloat(record.receiptAmount) || 0;
                        totalReceiptAmount += receiptAmount;

                        table.row.add([
                            "",
                            record.invoiceNo || "",
                            record.patient_name || "",
                            record.financialType || "",
                            record.receiptDate || "",
                            record.receiptAmount || "",
                            record.credit || "",
                            record.cash || "",
                            record.card || "",
                            record.paidFor || "",
                        ]);
                    });

                    table.draw();
                    $("#total-receipt-amount").text(
                        totalReceiptAmount.toFixed(2)
                    );
                },
                error: function (xhr, status, error) {
                    console.error(
                        "Error fetching service orders:",
                        xhr.responseText
                    );
                },
            });
        }
    });

    // Close Cashier

    $("#CloseCashier").click(function () {
        const employeeId = $("#employee").val();
        const fromDate = $("#from-date").val();
        const toDate = $("#to-date").val();
        if (!employeeId || !fromDate || !toDate) {
            Swal.fire({
                icon: "error",
                text: "Please select an employee and date range before proceeding.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        // To check pending transactions

        $.ajax({
            url: "/check-and-fetch-data",
            method: "POST",
            data: {
                employeeId: employeeId,
                fromDate: fromDate,
                toDate: toDate,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                if (response.hasPending) {
                    $("#basicModal .modal-body").html(
                        "<p>System Found that there were some transactions need to close before the selected date for cashier point: Cashier Admin</p>"
                    );
                    $("#basicModal .modal-footer").html(
                        '<button type="button" class="btn btn-success" id="ViewTransactions">View Transactions</button>'
                    );
                    $(document)
                        .off("click", "#ViewTransactions")
                        .on("click", "#ViewTransactions", function () {
                            $("#basicModal").modal("hide");

                            // Fetch Cashier Data

                            $.ajax({
                                url: "/fetch-cashier-data",
                                method: "POST",
                                data: {
                                    employeeId: employeeId,
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    _token: $('meta[name="csrf-token"]').attr(
                                        "content"
                                    ),
                                },
                                success: function (response) {
                                    $("#exLargeModal .table tbody").empty();
                                    response.forEach(function (cashier) {
                                        const statusClasses = {
                                            collected: "bg-label-success",
                                            transfer: "bg-label-info",
                                            rejected: "bg-label-danger",
                                            pending: "bg-label-warning",
                                        };

                                        const statusClass =
                                            statusClasses[cashier.status] || "";

                                        $("#exLargeModal .table tbody").append(`
                                        <tr>
                                            <td>${cashier.casherId}</td>
                                            <td>${cashier.fromDateTime}</td>
                                            <td>${cashier.toDateTime}</td>
                                            <td>${cashier.totalCash}</td>
                                            <td>${cashier.totalCredit}</td>
                                            <td>${cashier.totalCard}</td>
                                            <td><span class="badge ${statusClass}">${cashier.status}</span></td>
                                        </tr>
                                    `);
                                    });
                                    $("#exLargeModal").modal("show");
                                },
                                error: function (xhr, status, error) {
                                    Swal.fire({
                                        icon: "error",
                                        text: "Error fetching cashier data. Please try again.",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-danger waves-effect waves-light",
                                        },
                                    });
                                    console.error(
                                        "Error fetching cashier data:",
                                        error
                                    );
                                },
                            });
                        });
                } else {
                    $("#basicModal .modal-body").html(`
                        
                    <div class="row gap-invoice">
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">From Date:</span> <span style="font-weight: bold;"> ${fromDate}</span></p>
                        </div>
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">To Date:</span> <span style="font-weight: bold;"> ${toDate}</span></p>
                        </div>
                    </div>
                    <div class="row gap-invoice" >
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">Total Receipt Amount:</span> <span style="font-weight: bold;"> ${response.totalReceiptAmount}</span></p>
                        </div>
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">Total Cash:</span> <span style="font-weight: bold;"> ${response.totalCash}</span></p>
                        </div>
                    </div>
                    <div class="row gap-invoice" style="margin-bottom: 20px;">
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">Total Card:</span> <span style="font-weight: bold;"> ${response.totalCard}</span></p>
                        </div>
                        <div class="col-6">
                            <p class="text-placeholder"><span style="font-weight: normal;">Total Credit:</span> <span style="font-weight: bold;"> ${response.totalCredit}</span></p>
                        </div>
                    </div>
                    `);
                    $("#basicModal .modal-footer").html(
                        '<button type="button" class="btn btn-success" id="submitCashier">Submit</button>'
                    );

                    // Submit to Cahser Table

                    $(document)
                        .off("click", "#submitCashier")
                        .on("click", "#submitCashier", function () {
                            $.ajax({
                                url: "/submit-cashier",
                                method: "POST",
                                data: {
                                    employeeId: employeeId,
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    totalCash: response.totalCash,
                                    totalCard: response.totalCard,
                                    totalCredit: response.totalCredit,
                                    _token: $('meta[name="csrf-token"]').attr(
                                        "content"
                                    ),
                                },
                                success: function (submitResponse) {
                                    Swal.fire({
                                        icon: "success",
                                        text: "Cashier closed successfully.",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-success waves-effect waves-light",
                                        },
                                    });
                                    $("#basicModal").modal("hide");
                                },
                                error: function (error) {
                                    Swal.fire({
                                        icon: "error",
                                        text: "Failed to submit cashier data.",
                                        customClass: {
                                            confirmButton:
                                                "btn btn-danger waves-effect waves-light",
                                        },
                                    });
                                    console.error(
                                        "Error submitting cashier data:",
                                        error
                                    );
                                },
                            });
                        });
                }
                $("#basicModal").modal("show");
            },
            error: function (xhr) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    text: "Error checking transactions. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                console.error("Error checking transactions:", xhr.responseText);
            },
        });
    });

    // Transfer to Cashier

    $("#TransfertoCashier").click(function () {
        const selectedBranch = $("#branch").find(":selected").text();
        const selectedBranchId = $("#branch").val();
        const selectedEmployee = $("#employee").find(":selected").text();
        const selectedEmployeeId = $("#employee").val();
        const TotalCash = $("#total-receipt-amount").text();

        if (!selectedBranch || !selectedEmployee) {
            Swal.fire({
                icon: "error",
                text: "Please select a branch and employee before proceeding.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        } else $("#transferToCashierModal").modal("show");

        $("#modalBranchInput").val(selectedBranch).prop("readonly", true);
        $("#modalEmployeeInput").val(selectedEmployee).prop("readonly", true);
        $("#transferAmount").val(TotalCash).prop("readonly", true);
        $("#modalToCashPoint")
            .empty()
            .append(
                '<option value="select Employee" selected>Select Employee</option>'
            );
        $.ajax({
            url: "/fetch-employees",
            type: "POST",
            data: {
                clinicId: selectedBranchId,
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (data) {
                data.forEach(function (employee) {
                    $("#modalToCashPoint").append(
                        `<option value="${employee.employeeId}">${employee.fullName}</option>`
                    );
                });
            },
        });

        // Cashier Data By Date Range in Transfer Modal

        let allCashiersData = [];

        function renderCashiersTable(data) {
            const tableBody = $("#cashierDataTable tbody");
            tableBody.empty();

            if (data.length === 0) {
                tableBody.append(
                    '<tr><td colspan="6" class="text-center">No data available</td></tr>'
                );
                return;
            }

            const selectedEmployeeId = $("#employee").val();

            data.forEach(function (cashier) {
                const statusBadge =
                    {
                        collected: "bg-label-success",
                        transfer: "bg-label-info",
                        rejected: "bg-label-danger",
                        pending: "bg-label-warning",
                    }[cashier.status.toLowerCase()] || "bg-label-secondary";

                const actionButtons =
                    cashier.to_cash_point_id === parseInt(selectedEmployeeId) &&
                    cashier.status === "transfer"
                        ? `
                            <button class="btn btn-success btn-sm accept-btn" data-id="${cashier.casherId}" data-status="collected">
                                Accept
                            </button>
                            <button class="btn btn-danger btn-sm reject-btn" data-id="${cashier.casherId}" data-status="rejected">
                                Reject
                            </button>
                        `
                        : "";

                const row = `
                    <tr>
                        <td>${cashier.from_cash_point_name}</td>
                        <td>${cashier.to_cash_point_name}</td>
                        <td>${cashier.amount}</td>
                        <td>${cashier.created_at || "N/A"}</td>
                        <td><span class="badge ${statusBadge}">${
                    cashier.status || "Unknown"
                }</span></td>
                        <td>${actionButtons}</td>
                    </tr>
                `;
                tableBody.append(row);
            });
        }

        function fetchAllCashiers() {
            $.ajax({
                url: "/fetch-cashiers",
                method: "POST",
                data: {
                    _token: $('meta[name="csrf-token"]').attr("content"),
                    employeeId: selectedEmployeeId,
                },
                success: function (response) {
                    allCashiersData = response;
                    renderCashiersTable(allCashiersData);
                },
                error: function (xhr) {
                    console.error(
                        "Error fetching all cashier data:",
                        xhr.responseText
                    );
                },
            });
        }

        fetchAllCashiers();

        function filterCashiersByDateRange(fromDate, toDate) {
            let filteredData = allCashiersData;

            if (fromDate || toDate) {
                filteredData = allCashiersData.filter((cashier) => {
                    const createdAt = new Date(cashier.created_at);
                    let from = fromDate ? new Date(fromDate) : null;
                    let to = toDate ? new Date(toDate) : null;

                    if (from && to) {
                        return createdAt >= from && createdAt <= to;
                    } else if (from) {
                        return createdAt >= from;
                    } else if (to) {
                        return createdAt <= to;
                    }
                    return true;
                });
            }

            renderCashiersTable(filteredData);
        }

        $("#searchByDate").on("click", function () {
            const fromDate = $("#fromdate").val();
            const toDate = $("#todate").val();
            filterCashiersByDateRange(fromDate, toDate);
        });

        flatpickr("#fromdate", {
            dateFormat: "Y-m-d",
        });

        flatpickr("#todate", {
            dateFormat: "Y-m-d",
        });
    });

    // Transfer Amount

    $(document).on("click", "#Transfer", function () {
        const selectedCashPoint = $("#modalToCashPoint").val();
        const transferAmount = $("#transferAmount").val();

        if (!selectedCashPoint || selectedCashPoint === "select Employee") {
            Swal.fire({
                icon: "error",
                text: "Please select a valid cash point before sending.",
                customClass: {
                    confirmButton: "btn btn-danger waves-effect waves-light",
                },
            });
            return;
        }

        $.ajax({
            url: "/transfer-amount",
            type: "POST",
            data: {
                casherAdmin_employeeId: selectedCashPoint,
                transferAmount: transferAmount,
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                });
                $("#transferToCashierModal").modal("hide");
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    text: xhr.responseJSON.error || "An error occurred.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    $(document).on("click", ".accept-btn", function () {
        const casherId = $(this).data("id");

        $.ajax({
            url: "/accept-transfer",
            type: "POST",
            data: {
                casherId: casherId,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Transfer Accepted",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-success waves-effect waves-light",
                    },
                }).then(() => {
                    $("#transferToCashierModal").modal("hide");
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON.error || "An error occurred.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });

    $(document).on("click", ".reject-btn", function () {
        const casherId = $(this).data("id");

        $.ajax({
            url: "/reject-transfer",
            type: "POST",
            data: {
                casherId: casherId,
                _token: $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Transfer Rejected",
                    text: response.message,
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                }).then(() => {
                    $("#transferToCashierModal").modal("hide");
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON.error || "An error occurred.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
            },
        });
    });
});
