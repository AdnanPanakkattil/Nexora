$(document).ready(function () {
    // Initialize validation for the form
    $("#purchase_order_form").validate({
        errorPlacement: function (error, element) {
            // Place the error message below the element
            error.addClass("error-text");
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        },
        rules: {
            "item_id[]": {
                required: true,
            },
            "item_quantity[]": {
                required: true,
                number: true,
                min: 1,
            },
            "item_unit[]": {
                required: true,
            },
            "item_unit_price[]": {
                required: true,
                number: true,
                min: 0,
            },
        },
        messages: {
            "item_id[]": {
                required: "Item is required",
            },
            "item_quantity[]": {
                required: "Quantity is required",
                number: "Must be a valid number",
                min: "Must be at least 1",
            },
            "item_unit[]": {
                required: "Unit is required",
            },
            "item_unit_price[]": {
                required: "Unit price is required",
                number: "Must be a valid number",
                min: "Price cannot be negative",
            },
        },
    });
});
