$(document).ready(function () {
    $("#service_main_menu").addClass("active open menu-item-animating");
    $("#insurance_medication_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var insuranceMedicationTable = $("#insurance_medication_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
    url: insuranceMedicationUrl,
    type: "GET",
},
        columns: [
    { data: "checkbox",       name: "checkbox",       orderable: false, searchable: false },
    { data: "serviceId",      name: "serviceId"       },
    { data: "serviceCode",    name: "serviceCode"     },
    { data: "medicalCode",    name: "medicalCode"     },
    { data: "serviceName_en", name: "serviceName_en"  },
    { data: "serviceName_ar", name: "serviceName_ar"  },
    { data: "cost",           name: "cost"            },
],
    });

    // Select All
    $("#select_all").on("click", function () {
        var rows = insuranceMedicationTable.rows({ search: "applied" }).nodes();
        $('input[type="checkbox"]', rows).prop("checked", this.checked);
        updateSelectedCount();
    });

    // Individual checkbox
    $("#insurance_medication_table tbody").on(
        "change",
        'input[type="checkbox"]',
        function () {
            if (!this.checked) {
                var el = $("#select_all").get(0);
                if (el && el.checked && "indeterminate" in el) {
                    el.indeterminate = true;
                }
            }
            updateSelectedCount();
        }
    );

    // Reset checkboxes on page reload
    insuranceMedicationTable.on("draw", function () {
        $("#select_all").prop("checked", false);
        updateSelectedCount();
    });

    // Excel import form submit
    $("#importMedicationForm").on("submit", function (e) {
        e.preventDefault();

        var file = $("#importMedicationFile")[0].files[0];
        if (!file) {
            alert("Please select an Excel file.");
            return;
        }

        var formData = new FormData();
        formData.append("file", file);
        formData.append("_token", $('meta[name="csrf-token"]').attr("content"));

        $("#importMedicationBtn").prop("disabled", true);
        $("#importMedicationSpinner").removeClass("d-none");

        $.ajax({
            url: insuranceMedicationImportUrl,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        }).done(function (res) {
            $("#importMedicationBtn").prop("disabled", false);
            $("#importMedicationSpinner").addClass("d-none");
            $("#importMedicationModal").modal("hide");
            $("#importMedicationFile").val("");
            if (typeof toastr !== "undefined") {
                toastr.success(res.message || "Import completed successfully.");
            } else {
                alert(res.message || "Import completed successfully.");
            }
            insuranceMedicationTable.ajax.reload(null, false);
        }).fail(function (xhr) {
            $("#importMedicationBtn").prop("disabled", false);
            $("#importMedicationSpinner").addClass("d-none");
            var msg = (xhr.responseJSON && xhr.responseJSON.message)
                ? xhr.responseJSON.message
                : "Import failed. Please check the file and try again.";
            if (typeof toastr !== "undefined") {
                toastr.error(msg);
            } else {
                alert(msg);
            }
        });
    });
});

function updateSelectedCount() {
    var selectedCount = $('input[name="select_medication"]:checked').length;
    $("#selected_count").text(selectedCount);
    if (selectedCount > 0) {
        $("#bulk_select").show();
    } else {
        $("#bulk_select").hide();
    }
}