$(document).ready(function () {
    
    // Hide the input field initially
    $('#estimated_amount_of_blood').hide();
 // Hide the tourniquet fields initially
    $('.tourniquet-fields').hide();

    // When the 'Yes' radio button is clicked, show the input field
    $('#bloodLoss_Yes').on('change', function() {
        if ($(this).is(':checked')) {
            $('#estimated_amount_of_blood').show();
        }
    });

    // When the 'No' radio button is clicked, hide the input field
    $('#bloodLoss_No').on('change', function() {
        if ($(this).is(':checked')) {
            $('#estimated_amount_of_blood').hide();
        }
    });


    // Hide the input field initially
    $('#Unit_Transfused').hide();

    // When the 'Yes' radio button is clicked, show the input field
    $('#bloodLoss_products_Yes').on('change', function() {
        if ($(this).is(':checked')) {
            $('#Unit_Transfused').show();
        }
    });

    // When the 'No' radio button is clicked, hide the input field
    $('#bloodLoss_products_No').on('change', function() {
        if ($(this).is(':checked')) {
            $('#Unit_Transfused').hide();
        }
    });


    // Hide the input fields initially
    $('.tourniquet-fields').hide();

    // When the 'Yes' radio button is clicked, show the input fields
    $('#tourniquet_Yes').on('change', function() {
        if ($(this).is(':checked')) {
            $('.tourniquet-fields').show();
        }
    });

    // When the 'No' radio button is clicked, hide the input fields
    $('#tourniquet_No').on('change', function() {
        if ($(this).is(':checked')) {
            $('.tourniquet-fields').hide();
        }
    });
});
