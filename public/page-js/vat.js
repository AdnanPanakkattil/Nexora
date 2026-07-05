$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#settings_vat_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var vatTable = $("#vat_table").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: BASE_URL + "/vat",
            type: "GET",
        },
        columns: [
            { data: "taxId", name: "taxId" },
            { data: "taxName_en", name: "taxName_en" },
            { data: "taxName_ar", name: "taxName_ar" },
            { data: "taxValueInPercentage", name: "taxValueInPercentage" },
            {
                data: "actions",
                name: "actions",
                orderable: false,
                searchable: false,
            },
        ],
    });

function resetModal() {
    $("#addVatForm")[0].reset();
    $("#vat_id").val("");
    $(".error-text").text("");
    $("#vatName_en, #vatName_ar, #vatPercentage").prop("disabled", false);
    $("#vatModalFooter").show();   // ← show entire footer
    $("#addVatModalLabel").text("Add VAT");
    $(".error-text").show();
}

    $("#addNewVatBtn").on("click", function () {
        resetModal();
        $("#addVatModal").modal("show");
    });

    $("#closebtn").on("click", function () {
        resetModal();
        $("#addVatModal").modal("hide");
    });

    // Also reset when modal is dismissed via backdrop / ESC
    $("#addVatModal").on("hidden.bs.modal", function () {
        resetModal();
    });

    $("#VatSaveBtn").on("click", function () {
        $(".error-text").text("");

        let vatId = $("#vat_id").val();

        let ajaxUrl = vatId
            ? BASE_URL + "/update-vat/" + vatId
            : BASE_URL + "/vat";

        let method = vatId ? "PUT" : "POST";

        let formData = {
            taxName_en: $("#vatName_en").val(),
            taxName_ar: $("#vatName_ar").val(),
            taxValueInPercentage: $("#vatPercentage").val(),
        };

        $("#VatSaveBtn").prop("disabled", true);

        $("#loader-overlay").show();
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: formData,

            success: function (response) {
                $("#loader-overlay").hide();
                if (response.status === true || response.success) {
                    vatTable.ajax.reload(null, false);

                    Swal.fire({
                        icon: "success",
                        text: response.message ?? response.success,
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    resetModal();
                    $("#addVatModal").modal("hide");
                }
            },

            error: function (xhr) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to save VAT. Please try again.",
                    });
                }
            },

            complete: function () {
                $("#VatSaveBtn").prop("disabled", false);
                $("#loader-overlay").hide();
            },
        });
    });

    $(document).on("click", ".item-edit", function () {
        let editUrl = $(this).data("id"); // full URL already built in repository

        resetModal();

        $("#loader-overlay").show();
        $.ajax({
            type: "GET",
            url: editUrl,
            success: function (data) {
                $("#loader-overlay").hide();
                $("#addVatModalLabel").text("Edit VAT");
                $("#vat_id").val(data.taxId);
                $("#vatName_en").val(data.taxName_en);
                $("#vatName_ar").val(data.taxName_ar);
                $("#vatPercentage").val(data.taxValueInPercentage);

                $("#addVatModal").modal("show");
            },
            error: function () {
                $("#loader-overlay").hide();
                Swal.fire("Error!", "Unable to fetch VAT details.", "error");
            },
        });
    });

   $(document).on("click", ".item-details", function () {
    let detailsUrl = $(this).data("id");

    resetModal();

    $("#loader-overlay").show();
    $.ajax({
        type: "GET",
        url: detailsUrl,
        success: function (data) {
            $("#loader-overlay").hide();
            $("#addVatModalLabel").text("VAT Details");
            $("#vat_id").val(data.taxId);
            $("#vatName_en").val(data.taxName_en);
            $("#vatName_ar").val(data.taxName_ar);
            $("#vatPercentage").val(data.taxValueInPercentage);

            $("#vatName_en, #vatName_ar, #vatPercentage").prop("disabled", true);
            $("#vatModalFooter").hide(); 
            $("#VatSaveBtn").hide();
            $("#closebtn").hide(); 

            $(".error-text").hide();

            $("#addVatModal").modal("show");
        },
        error: function () {
            $("#loader-overlay").hide();
            Swal.fire("Error!", "Unable to fetch VAT details.", "error");
        },
    });
});

    $(document).on("click", ".item-delete", function () {
        let deleteUrl = $(this).data("id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loader-overlay").show();
                $.ajax({
                    type: "DELETE",
                    url: deleteUrl,
                    success: function (response) {
                        $("#loader-overlay").hide();
                        Swal.fire({
                            icon: "success",
                            text: "VAT deleted successfully!",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        vatTable.ajax.reload(null, false);
                    },
                    error: function () {
                        $("#loader-overlay").hide();
                        Swal.fire("Error!", "Unable to delete the VAT.", "error");
                    },
                });
            }
        });
    });
    
    $("#vatName_en").on("input", function () {
        this.value = this.value.replace(/[^a-zA-Z/0-9\s/@&%-.]/g, "");
    });

    $("#vatName_ar").on("input", function () {
        this.value = this.value.replace(/[^\u0600-\u06FF\s/@&%-./0-9]/g, "");
    });
});