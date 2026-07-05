$(document).ready(function () {
    $("#insurance_main_menu").addClass("active open menu-item-animating");
    $("#insurance_report_mds_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    flatpickr(".flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d", // format for hidden inputs
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                let start = instance.formatDate(selectedDates[0], "Y-m-d");
                let end = instance.formatDate(selectedDates[1], "Y-m-d");

                document.getElementById("startDate").value = start;
                document.getElementById("endDate").value = end;
            } else {
                // clear if not fully selected
                document.getElementById("startDate").value = "";
                document.getElementById("endDate").value = "";
            }
        },
    });

    $("#filterInsuranceCompanyIdDiv").hide();

    $("#filterBranchId").on("change", function () {
        let clinicId = $(this).val();

        $("#filterPayerId").empty();

        $("#filterInsuranceCompanyId").empty();

        $("#filterInsuranceCompanyIdDiv").hide();

        $("#filterPayerId").append(
            `<option value="">Select Payer / TPA</option>`,
        );

        $("#filterInsuranceCompanyId").append(
            `<option value="">Select Insurance Payer</option>`,
        );

        $("#filterPayerId").selectpicker("destroy");
        $("#filterPayerId").selectpicker();

        $("#filterInsuranceCompanyId").selectpicker("destroy");
        $("#filterInsuranceCompanyId").selectpicker();

        if (!clinicId) {
            return;
        }

        $("#loader-overlay").show();

        $.get(BASE_URL + "/get-payers-by-clinic/" + clinicId, function (res) {
            $("#loader-overlay").hide();

            if (res.status) {
                $.each(res.data, function (i, payer) {
                    $("#filterPayerId").append(
                        `<option value="${payer.id}" data-type="${payer.type}">
                            ${payer.name}
                        </option>`,
                    );
                });

                $("#filterPayerId").selectpicker("destroy");
                $("#filterPayerId").selectpicker();
            }
        });
    });

    $("#filterPayerId").on("change", function () {
        let type = $(this).find("option:selected").data("type");

        let companyId = $(this).val();

        $("#filterInsuranceCompanyId").empty();

        $("#filterInsuranceCompanyId").append(
            `<option value="">Select Insurance Payer</option>`,
        );

        $("#filterInsuranceCompanyId").selectpicker("destroy");
        $("#filterInsuranceCompanyId").selectpicker();

        $("#filterInsuranceCompanyIdDiv").hide();

        if (!companyId) {
            return;
        }

        if (type === "TPA_company") {
            $("#loader-overlay").show();

            $.get(
                BASE_URL + "/get-tpa-companies-by-company/" + companyId,
                function (res) {
                    $("#loader-overlay").hide();

                    if (res.status) {
                        $.each(res.data, function (id, name) {
                            $("#filterInsuranceCompanyId").append(
                                `<option value="${id}">
                                    ${name}
                                </option>`,
                            );
                        });

                        $("#filterInsuranceCompanyId").selectpicker("destroy");
                        $("#filterInsuranceCompanyId").selectpicker();

                        $("#filterInsuranceCompanyIdDiv").show();
                    }
                },
            );
        }
    });

    $("#resetFilterBtn").on("click", function () {
        $("#filterBranchId").val("");
        $("#filterPayerId").empty();
        $("#filterInsuranceCompanyId").empty();

        $("#filterInsuranceCompanyIdDiv").hide();

        $("#filterBranchId").selectpicker("refresh");
        $("#filterPayerId").selectpicker("refresh");
        $("#filterInsuranceCompanyId").selectpicker("refresh");
    });

    $("#applyFilterBtn").on("click", function () {
        let branchId = $("#filterBranchId").val();
        let payerId = $("#filterPayerId").val();
        let insuranceCompanyIdVisible = $("#filterInsuranceCompanyIdDiv").is(
            ":visible",
        );
        let insuranceCompanyId = $("#filterInsuranceCompanyId").val();
        let startDate = $("#startDate").val();
        let endDate = $("#endDate").val();
        if (!branchId) {
            Swal.fire({
                icon: "warning",
                title: "Branch Required",
                text: "Please select a Branch before downloading.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            });
            return;
        }

        if (!payerId) {
            Swal.fire({
                icon: "warning",
                title: "Payer / TPA Required",
                text: "Please select a Payer / TPA before downloading.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            });
            return;
        }

        if (insuranceCompanyIdVisible && !insuranceCompanyId) {
            Swal.fire({
                icon: "warning",
                title: "Insurance Payer Required",
                text: "Please select an Insurance Payer before downloading.",
                customClass: {
                    confirmButton: "btn btn-primary waves-effect waves-light",
                },
                buttonsStyling: false,
            });
            return;
        }

        let params = new URLSearchParams({
            branchId: branchId,
            payerId: payerId,
            insuranceCompanyId: insuranceCompanyId || "",
            startDate: startDate,
            endDate: endDate,
        });

        window.location.href =
            BASE_URL + "/insurance/report-mds/download?" + params.toString();
    });
});
