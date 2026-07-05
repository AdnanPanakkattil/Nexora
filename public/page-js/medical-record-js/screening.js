$(document).ready(function () {
    $("#medical_record_main_menu1").addClass("active open menu-item-animating");
    $("#medical_record_lists_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // Initially hide the "specify" section
    $('input[name="functionalNeedsScreeningYestxt"]').closest('.specify-div').hide();

    // Function to ensure only one checkbox is checked and show/hide the "specify" section
    $('input[name="functionalNeedsScreening2"]').on('change', function() {
        // Uncheck the other checkbox if this one is checked
        $('input[name="functionalNeedsScreening2"]').not(this).prop('checked', false);

        if ($('#functionalNeedsScreeningYes').is(':checked')) {
            // Show the "specify" section if "Yes" is selected
            $('input[name="functionalNeedsScreeningYestxt"]').closest('.specify-div').show();
        } else {
            // Hide the "specify" section if "No" is selected
            $('input[name="functionalNeedsScreeningYestxt"]').closest('.specify-div').hide();
        }
    });


    // Initially hide the "PainScore" section
    $('input[name="PainScreeningYesTxt"]').closest('.painscore-div').hide();

    // Function to ensure only one checkbox is checked and show/hide the "PainScore" section
    $('input[name="painScreening"]').on('change', function() {
        // Uncheck the other checkbox if this one is checked
        $('input[name="painScreening"]').not(this).prop('checked', false);

        if ($('#PainScreeningYes').is(':checked')) {
            // Show the "PainScore" section if "Yes" is selected
            $('input[name="PainScreeningYesTxt"]').closest('.painscore-div').show();
        } else {
            // Hide the "PainScore" section if "No" is selected
            $('input[name="PainScreeningYesTxt"]').closest('.painscore-div').hide();
        }
    });


    // Initially hide the entire "dragUse" section (the additional checkboxes)
    $('#dragUse').hide();

    // Function to handle Yes/NA logic and show/hide the additional options
    $('input[name="socialNeedsScreeningUsed"]').on('change', function() {
        // Uncheck the other checkbox when one is selected
        $('input[name="socialNeedsScreeningUsed"]').not(this).prop('checked', false);

        if ($('#dragUseYes').is(':checked')) {
            // Show the additional fields if "Yes" is selected
            $('#dragUse').show();
        } else {
            // Hide the additional fields if "NA" is selected
            $('#dragUse').hide();
        }
    });

    // Logic to show/hide "other" text field when "Other" checkbox is selected
    $('#SocialNeedsScreeningOther').on('change', function() {
        if ($(this).is(':checked')) {
            $('#SocialNeedsScreeningOthertxt').show();
        } else {
            $('#SocialNeedsScreeningOthertxt').hide();
        }
    });

    // Ensure only one SocialNeedsScreening option can be checked at a time
    $('input[name="SocialNeedsScreening"]').on('change', function() {
        // Uncheck all checkboxes except the one that was clicked
        $('input[name="SocialNeedsScreening"]').not(this).prop('checked', false);

        // Show the "Other" text field if the "Other" checkbox is checked
        if ($('#SocialNeedsScreeningOther').is(':checked')) {
            $('#SocialNeedsScreeningOthertxt').show();
        } else {
            $('#SocialNeedsScreeningOthertxt').hide();
        }
    });


    // Initially hide the fall prevention options
    $('#fallPrevention').hide();
    $('#FallRiskScreeningYes3otherstxt').hide();

    // Function to handle Yes/NA logic and show/hide the additional options
    $('input[name="FallRiskScreening3"]').on('change', function() {
        // Uncheck the other checkbox when one is selected
        $('input[name="FallRiskScreening3"]').not(this).prop('checked', false);

        if ($('#FallRiskScreening3Yes').is(':checked')) {
            // Show the additional fields if "Yes" is selected
            $('#fallPrevention').show();
        } else {
            // Hide the additional fields if "NA" is selected
            $('#fallPrevention').hide();
            $('#FallRiskScreeningYes3otherstxt').hide(); // Also hide the "other text" input
            $('#FallRiskScreeningYes3others').prop('checked', false); // Uncheck "others" if it's checked
        }
    });

    // Logic to show/hide "other" text field when "Others" checkbox is selected
    $('#FallRiskScreeningYes3others').on('change', function() {
        if ($(this).is(':checked')) {
            $('#FallRiskScreeningYes3otherstxt').show();
        } else {
            $('#FallRiskScreeningYes3otherstxt').hide();
        }
    }); 

    // Function to ensure only one checkbox (Yes or No) is checked at a time
    $('input[name="FallRiskScreening2"]').on('change', function() {
        // Uncheck the other checkbox when one is selected
        $('input[name="FallRiskScreening2"]').not(this).prop('checked', false);
    });

    // Function to ensure only one checkbox (Yes or No) is checked at a time
    $('input[name="NutritionalNeedsScreening2"]').on('change', function() {
        // Uncheck the other checkbox when one is selected
        $('input[name="NutritionalNeedsScreening2"]').not(this).prop('checked', false);
    });

    // Function to ensure only one checkbox (Yes or NA) is checked at a time
    $('input[name="NutritionalNeedsScreening3"]').on('change', function() {
        // If this checkbox is checked, uncheck the other one
        if ($(this).is(':checked')) {
            $('input[name="NutritionalNeedsScreening3"]').not(this).prop('checked', false);
        }
    });

    // Function to ensure only one checkbox (Yes or NA) is checked at a time
    $('input[name="functionalNeedsScreening3"]').on('change', function() {
        // If this checkbox is checked, uncheck the other one
        if ($(this).is(':checked')) {
            $('input[name="functionalNeedsScreening3"]').not(this).prop('checked', false);
        }
    });

    // Function to ensure only one checkbox (Yes or NA) is checked at a time
    $('input[name="SocialNeedsScreening3"]').on('change', function() {
        // If this checkbox is checked, uncheck the other one
        if ($(this).is(':checked')) {
            $('input[name="SocialNeedsScreening3"]').not(this).prop('checked', false);
        }
    });

    // Function to ensure only one checkbox (Yes or No) is checked at a time
    $('input[name="physicianinformed"]').on('change', function() {
        // If this checkbox is checked, uncheck the other one
        if ($(this).is(':checked')) {
            $('input[name="physicianinformed"]').not(this).prop('checked', false);
        }
    });
    });
    


