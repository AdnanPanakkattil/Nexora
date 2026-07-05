$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#financial_year_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#accounting_main_menu").addClass("active open menu-item-animating");
    $("#financial_year_sub_menu").addClass("active");

    $("#currentFinancialYearBtn").on("click", function () {
        $("#currentFinancialYearModal").modal("show");

        fetchFinancialYears();
    });
    $("#addFinancialYearBtn").on("click", function () {
        $("#addFinancialYearModal").modal("show");
    });

    flatpickr("#flatpickr-date", {
        dateFormat: "Y-m-d",
    });
    flatpickr("#flatpickr-disabled-range", {
        dateFormat: "Y-m-d",
    });

    $("#financial_year_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/fetch-financial-year",
            type: "GET",
        },
        columns: [
            { data: "financialYearId", name: "financialYearId" },
            { data: "financialYearName", name: "financialYearName" },
            { data: "startDate", name: "startDate" },
            { data: "endDate", name: "endDate" },
            {
                data: "is_current",
                name: "is_current",
                render: function (data) {
                    return data == 1 ? "Active" : "In Active";
                },
            },
            {
                data: "financialYearId",
                name: "financialYearId",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    return `
                        <a href="#" class="btn btn-icon btn-text-black waves-effect waves-light rounded-pill edit-financial-year" data-id="${data}">
                            <i class="ti ti-pencil ti-md"></i>
                        </a>
                    `;
                },
            },
        ],
        language: {
            emptyTable: "No financial years available",
        },
    });

    $("#addFinancialYearForm").on("submit", function (e) {
        e.preventDefault();
        $(".text-danger").remove();

        const financialYearId = $("#financialYearId").val();
        const startDate = $("#flatpickr-date").val();
        const endDate = $("#flatpickr-disabled-range").val();
        const financialYearName = $("#modalfinancialYearNameInput").val();

        const method = financialYearId ? "PUT" : "POST";
        const url = financialYearId
            ? `/accounting/financial-years/${financialYearId}`
            : financialYearStoreUrl;
        $("#loader-overlay").show();
        $.ajax({
            url: url,
            type: method,
            data: {
                _token: csrfToken,
                financialYearName: financialYearName,
                startDate: startDate,
                endDate: endDate,
                _method: method,
            },
            success: function (response) {
                $("#loader-overlay").hide();
                $("#addFinancialYearModal").modal("hide");
                $("#addFinancialYearForm")[0].reset();
                $("#financialYearId").val("");

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                });

                $("#financial_year_table").DataTable().ajax.reload();
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    if (errors.financialYearName) {
                        $("#modalfinancialYearNameInput").after(
                            '<div class="text-danger">' +
                                errors.financialYearName[0] +
                                "</div>",
                        );
                    }
                    if (errors.startDate) {
                        $("#flatpickr-date").after(
                            '<div class="text-danger">' +
                                errors.startDate[0] +
                                "</div>",
                        );
                    }
                    if (errors.endDate) {
                        $("#flatpickr-disabled-range").after(
                            '<div class="text-danger">' +
                                errors.endDate[0] +
                                "</div>",
                        );
                    }
                } else if (xhr.status === 409) {
                    Swal.fire({
                        icon: "warning",
                        title: "Conflict",
                        text: xhr.responseJSON.message,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Something went wrong. Please try again later.",
                    });
                }
            },
        });
    });

    $(document).on("click", ".edit-financial-year", function (e) {
        e.preventDefault();
        const financialYearId = $(this).data("id");

        $.ajax({
            url: `${baseFinancialYearUrl}/${financialYearId}`,
            type: "GET",
            success: function (data) {
                $("#financialYearId").val(data.financialYearId);
                $("#modalfinancialYearNameInput").val(data.financialYearName);
                $("#flatpickr-date").val(data.startDate);
                $("#flatpickr-disabled-range").val(data.endDate);

                $("#addFinancialYearModal").modal("show");
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch financial year details.",
                });
            },
        });
    });

    function fetchFinancialYears() {
        $.ajax({
            url: "/get-financial-year",
            type: "GET",
            success: function (response) {
                const selectBox = $("#select2Basic");
                selectBox.empty();
                selectBox.append(
                    '<option value="">--Select Financial Year--</option>',
                );
                response.data.forEach(function (item) {
                    const formattedDate = formatDateRange(
                        item.startDate,
                        item.endDate,
                    );
                    selectBox.append(
                        new Option(formattedDate, item.financialYearId),
                    );
                });

                const activeFinancialYear = response.data.find(
                    (item) => item.is_current === 1,
                );
                if (activeFinancialYear) {
                    selectBox
                        .val(activeFinancialYear.financialYearId)
                        .trigger("change");
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch financial years.",
                });
            },
        });
    }

    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startFormatted = `${start
            .getDate()
            .toString()
            .padStart(2, "0")}/${(start.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${start.getFullYear()}`;
        const endFormatted = `${end.getDate().toString().padStart(2, "0")}/${(
            end.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}/${end.getFullYear()}`;

        return `${startFormatted} to ${endFormatted}`;
    }

    $(document).on("click", "#activeBtn", function (e) {
        e.preventDefault();

        const selectedFinancialYearId = $("#select2Basic").val();

        if (!selectedFinancialYearId) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Please select a financial year first.",
            });
            return;
        }

        $("#loader-overlay").show();

        $.ajax({
            url: `/accounting/financial-years/activate/${selectedFinancialYearId}`,
            type: "PUT",
            success: function (response) {
                $("#loader-overlay").hide();
                $("#currentFinancialYearModal").modal("hide");

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    $("#financial_year_table")
                        .DataTable()
                        .ajax.reload(null, false); // <-- reloads table after Swal closes
                });

                fetchFinancialYears(); // refreshes the select2 dropdown
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 409) {
                    Swal.fire({
                        icon: "warning",
                        title: "Conflict",
                        text: xhr.responseJSON.message,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Something went wrong. Please try again later.",
                    });
                }
            },
        });
    });

    $("#deactivateFinancialYearBtn").on("click", function () {
        const selectBox = $("#deactivateSelect2");
        selectBox.empty().append('<option value="">-- Loading... --</option>');
        $("#confirmDeactivateBtn").data("id", null);
        $("#deactivateFinancialYearModal").modal("show");

        $.ajax({
            url: "/fetch-financial-year-current",
            type: "GET",
            success: function (response) {
                selectBox.empty();
                if (response.data) {
                    const item = response.data;
                    const formattedDate = formatDateRange(
                        item.startDate,
                        item.endDate,
                    );
                    selectBox.append(
                        new Option(
                            formattedDate,
                            item.financialYearId,
                            true,
                            true,
                        ),
                    );
                    $("#confirmDeactivateBtn").data("id", item.financialYearId);
                } else {
                    selectBox.append(
                        '<option value="">-- No Active Financial Year --</option>',
                    );
                }
            },
            error: function () {
                selectBox
                    .empty()
                    .append('<option value="">-- Failed to load --</option>');
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch current financial year.",
                });
            },
        });
    });

    $(document).on("click", "#confirmDeactivateBtn", function () {
        const id = $(this).data("id");

        if (!id) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "No active financial year found.",
            });
            return;
        }

        Swal.fire({
            icon: "question",
            title: "Are you sure?",
            text: "Do you want to deactivate the current financial year?",
            showCancelButton: true,
            confirmButtonColor: "#696cff",
            cancelButtonColor: "#d33",
            confirmButtonText: '<i class="ti ti-power"></i> Yes, Deactivate',
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "Processing...",
                //     text: "Deactivating financial year.",
                //     allowOutsideClick: false,
                //     allowEscapeKey: false,
                //     didOpen: () => {
                //         Swal.showLoading();
                //     },
                // });
                $("#loader-overlay").show();
                $.ajax({
                    url: `/accounting/financial-years/deactivate/${id}`,
                    type: "PUT",
                    data: { _token: csrfToken, _method: "PUT" },
                    success: function (response) {
                        $("#loader-overlay").hide();
                        $("#deactivateFinancialYearModal").modal("hide");
                        Swal.fire({
                            icon: "success",
                            title: "Deactivated",
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => {
                            $("#financial_year_table")
                                .DataTable()
                                .ajax.reload(null, false);
                        });
                    },
                    error: function (xhr) {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text:
                                xhr.responseJSON?.message ||
                                "Something went wrong.",
                        });
                    },
                });
            } else {
                $("#deactivateFinancialYearModal").modal("hide");
            }
        });
    });
});
