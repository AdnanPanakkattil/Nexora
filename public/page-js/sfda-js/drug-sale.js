$(document).ready(function () {
    $("#sfda_main_menu").addClass("active open menu-item-animating");
    $("#drug_sale_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#addDrugsBtn").on("click", function () {
        // Clear all previous error texts
        $(".error-text").text("");

        // Get field values
        let gtin = $("#gtin").val().trim();
        let sn = $("#sn").val().trim();
        let bn = $("#bn").val().trim();
        let expiryDate = $("#expiryDate").val().trim();

        let isValid = true;

        if (!gtin) {
            $(".gtin_error").text("The GTIN field is required.");
            isValid = false;
        }

        if (!sn) {
            $(".sn_error").text("The SN field is required.");
            isValid = false;
        }

        if (!bn) {
            $(".bn_error").text("The BN field is required.");
            isValid = false;
        }

        if (!expiryDate) {
            $(".expiryDate_error").text("The Expiry Date field is required.");
            isValid = false;
        }

        // Check GTIN uniqueness
        $("#addedDrugsTableTbody tr").each(function () {
            let existingGtin = $(this).find('input[name="gtin[]"]').val();
            if (existingGtin === gtin) {
                $(".gtin_error").text("The GTIN must be unique.");
                isValid = false;
                return false; // exit loop early
            }
        });

        if (!isValid) return;

        // Add valid row to table
        let newRow = `
        <tr>
            <td>${gtin}<input type="text" name="gtin[]" value="${gtin}" hidden></td>
            <td>${sn}<input type="text" name="sn[]" value="${sn}" hidden></td>
            <td>${bn}<input type="text" name="bn[]" value="${bn}" hidden></td>
            <td>${expiryDate}<input type="text" name="expiryDate[]" value="${expiryDate}" hidden></td>
            <td><button type="button" class="btn btn-sm btn-danger remove-drug-btn">Remove</button></td>
        </tr>
    `;

        $("#addedDrugsTableTbody").append(newRow);

        // Clear inputs
        $("#gtin, #sn, #bn, #expiryDate").val("");
    });

    // Handle removal of drug rows
    $("#addedDrugsTableTbody").on("click", ".remove-drug-btn", function () {
        $(this).closest("tr").remove();
    });

    // let table = $("#pre_authorization_requests_table").DataTable({
    //     processing: true,
    //     serverSide: true,
    //     ajax: {
    //         url: "/sfda/stake-holders-list-service",
    //         type: "POST",
    //         data: function (d) {
    //             d.type = $("#type").val(); // Corrected ID
    //             d.gln = $("#gln").val();
    //             d.stakeHolderName = $("#stakeHolderName").val();
    //             d.city = $("#city").val();
    //         }
    //     },
    //     order: [[2, "desc"]],
    //     columns: [

    //         { data: "type", name: "type", visible: true },

    //         { data: "GLN", name: "GLN", visible: true },
    //         { data: "STAKEHOLDERNAME", name: "STAKEHOLDERNAME" },
    //         { data: "CITYNAME", name: "CITYNAME" },
    //         { data: "ADDRESS", name: "ADDRESS" },
    //         { data: "ISACTIVE", name: "ISACTIVE" },
    //     ],
    // });

    // $("#pre_authorization_search_btn").click(function () {
    //     table.ajax.reload();
    // });
});

$(document).on("click", "#drugSaleBtn", function (e) {
    var drugsaleFormData = $("#drugsaleForm").serialize();
    $.ajax({
        url: BASE_URL + "/sfda/drug-sale",
        type: "POST",
        data: drugsaleFormData,
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
            } else {
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
});
