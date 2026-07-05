$(document).ready(function () {
    $("#branch_main_menu").addClass("active open menu-item-animating");
    $("#branch_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    // $('.timepicker').on('change', function () {
    //     let $this = $(this);
    //     let clinicId = $this.closest('form').find('input[name="clinic_id"]').val();
    //     let day = $this.closest('.time-period-section').attr('id').split('_')[3];
    //     let firstPeriodStart = $this.closest('.time-period-section').find(`input[name="first_period_start_${day}_${clinicId}"]`).val();
    //     let firstPeriodEnd = $this.closest('.time-period-section').find(`input[name="first_period_end_${day}_${clinicId}"]`).val();
    //     let secondPeriodStart = $this.closest('.time-period-section').find(`input[name="second_period_start_${day}_${clinicId}"]`).val();
    //     let secondPeriodEnd = $this.closest('.time-period-section').find(`input[name="second_period_end_${day}_${clinicId}"]`).val();

    //     if (secondPeriodStart && firstPeriodEnd && compareTime(secondPeriodStart, firstPeriodEnd)) {
    //         console.log('Second period start time cannot be earlier than first period end time.');
    //         $this.val('');
    //     }

    //     if (secondPeriodEnd && secondPeriodStart && compareTime(secondPeriodEnd, secondPeriodStart)) {
    //         console.log('Second period end time cannot be earlier than second period start time.');
    //         $this.val('');
    //     }
    // });
    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    var thirdTimepickerStart = $('input[name^="third_period_start_All_"]');

    if (thirdTimepickerStart.length) {
        thirdTimepickerStart.on("change", function () {
            // alert("third");
            updateFirstPeriodStartTimepickers(
                $(this).val(),
                "third_period_start_All_"
            );
        });
    }

    var thirdTimepickerEnd = $('input[name^="third_period_end_All_"]');
    if (thirdTimepickerEnd.length) {
        thirdTimepickerEnd.on("change", function () {
            console.log(thirdTimepickerEnd);
            updateFirstPeriodEndTimepickers(
                $(this).val(),
                "third_period_end_All_"
            );
        });
    }

    console.log($("#main_clinic_id").val());
    if ($("#main_clinic_id").val()) {
        initialPageload($("#main_clinic_id").val());
    }

    $(".save-btn").on("click", function () {
        // var branchId = $(this).attr('name');
        // console.log(branchId); // You can use this variable as needed
        var form = $(this).closest("form"); // Get the closest form
        var serializedData = form.serialize(); // Serialize form data
        var ajaxUrl = BASE_URL + "/branch-working-time";
        var method = "POST";
        $.ajax({
            url: ajaxUrl,
            type: method,
            data: serializedData,
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
                }
            },
            // error: function (xhr, status, error) {
            //     if (xhr.status === 422) {
            //         var errors = xhr.responseJSON.errors;
            //         $(".error-text").text("");
            //         $.each(errors, function (key, value) {
            //             $("." + key + "_error").text(value[0]);
            //         });
            //     } else {
            //         console.error("Error:", xhr);
            //     }
            // },
            error: function(xhr) {
                // Clear previous error messages
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');
    
                // Parse errors from the response
                let errors = xhr.responseJSON.errors;
                
                // Display errors
                $.each(errors, function(key, value) {
                    let errorField = $(`#${key}_error`);
                    if (errorField.length) {
                        errorField.text(value[0]);
                        $(`input[name="${key}"]`).addClass('is-invalid');
                    }
                });
            }
        });
    });

    $("#eligibility_check_form").on("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        let data = {};
        let formData = $(this).serializeArray();

        // Convert the serialized array into an object structure
        formData.forEach(function (item) {
            let name = item.name
                .split("[")
                .map((part) => part.replace("]", ""));
            let value = item.value;

            if (!data[name[1]]) data[name[1]] = {};
            if (!data[name[1]][name[2]]) data[name[1]][name[2]] = [];

            if (name[3] === "enabled1" || name[3] === "enabled2") {
                value = item.value === "on"; // Convert 'on' to true
            }

            data[name[1]][name[2]][name[3]] = value;
        });

        console.log(data); // Debugging: Check the collected data

        $.ajax({
            url: $(this).attr("action"),
            method: "POST",
            data: {
                _token: $('input[name="_token"]').val(), // Include CSRF token for security
                data: data,
            },
            success: function (response) {
                console.log(response);
                // Handle success (e.g., display a success message, redirect, etc.)
            },
            error: function (xhr, status, error) {
                console.error(error);
                // Handle error (e.g., display an error message)
            },
        });
    });
});


function initialPageload(clinicId) {
    $.ajax({
        url: BASE_URL + "/branch-working-time-details/" + clinicId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                var workingTimes = response.data[0].workingtimes;
                var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var AllSection = ["All"];

                workingTimes.split("|").forEach(function (item) {
                    var parts = item.split("->");
                    var dayIndex = parseInt(parts[0]);
                    var periods = parts[1].split("&");

                    if (dayIndex >= 0 && dayIndex < 7) { // Correctly handle indices 0 through 6
                        var day = AllSection[dayIndex];
                        
                        
                        
                        periods.forEach(function (period, index) {
                            var times = period.split("-");
                            var slotNames = ["first", "second", "third", "fourth", "fifth", "sixth"];
                            var periodHeader = ["First Period", "Second Period", "Third Period", "Fourth Period", "Fifth Period", "sixth"];
                            var periodStart = slotNames[index] + "_period_start_" + day + "_" + clinicId;
                            var periodEnd = slotNames[index] + "_period_end_" + day + "_" + clinicId;
                            // console.log(day + '=>' + times[0] + '->' + times[1]);

                            if (index < 2) {
                                $(`input[name="${periodStart}"]`).val(times[0]);
                                $(`input[name="${periodEnd}"]`).val(times[1]);
                            } else {
                                if (index === 3) {
                                    $(`#time_period_section_${day}_${clinicId}`).append(
                                        '<label for="flatpickr-time-all" class="col-sm-1 col-form-label"></label>'
                                    );
                                    
                                }

                                $(`#time_period_header_${day}_${clinicId}`).append(
                                    '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-4 text-center" id="time_period_header_{{$day}}_{{$clinic->clinicId}}">'+
                                          '<h5 class="custom-timetitle">'+periodHeader[index]+'</h5>'+
                                        '</div>'
                                );
                                $(`#time_period_section_${day}_${clinicId}`).append(
                                    `<div class="col-sm-1" style="width: 10%;">
                                        <input type="text" name="${periodStart}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[0]}" disabled/>
                                    <div class="invalid-feedback" id="${periodStart}_error"></div>
                                        </div>
                                    <label for="flatpickr-time-all" class="col-sm-1 col-form-label" style="width: auto;">To</label>
                                    <div class="col-sm-1" style="width: 10%;">
                                        <input type="text" name="${periodEnd}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[1]}" disabled/>
                                    </div>
                                    <div class="col-sm-1 form-check form-switch mb-2" style="width: auto;">
                                        <input class="form-check-input timepicker-toggle" type="checkbox" id="checkbox${index+1}_${day}_${clinicId}" />
                                    </div>`
                                );
                                $('.time_slot_count').val(index + 1);
                            }

                            // Initialize flatpickr
                            $(".timepicker").flatpickr({
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "h:i K",
                            });
                        });
                    }
                });


                workingTimes.split("|").forEach(function (item) {
                    var parts = item.split("->");
                    var dayIndex = parseInt(parts[0]);
                    var periods = parts[1].split("&");

                    if (dayIndex >= 0 && dayIndex < 7) { // Correctly handle indices 0 through 6
                        var day = daysOfWeek[dayIndex];
                        
                        
                        
                        periods.forEach(function (period, index) {
                            var times = period.split("-");
                            var slotNames = ["first", "second", "third", "fourth", "fifth", "sixth"];
                            var periodStart = slotNames[index] + "_period_start_" + day + "_" + clinicId;
                            var periodEnd = slotNames[index] + "_period_end_" + day + "_" + clinicId;
                            console.log(day + '=>' + times[0] + '->' + times[1]);
                            if (index < 2) {
                                $(`input[name="${periodStart}"]`).val(times[0]);
                                $(`input[name="${periodEnd}"]`).val(times[1]);
                            } else {
                                if (index === 3) {
                                    $(`#time_period_section_${day}_${clinicId}`).append(
                                        '<label for="flatpickr-time-all" class="col-sm-1 col-form-label"></label>'
                                    );
                                    
                                }
                                
                                $(`#time_period_section_${day}_${clinicId}`).append(
                                    `<div class="col-sm-1" style="width: 10%;">
                                        <input type="text" name="${periodStart}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[0]}" disabled/>
                                    <div class="invalid-feedback" id="${periodStart}_error"></div>
                                        </div>
                                    <label for="flatpickr-time-all" class="col-sm-1 col-form-label" style="width: auto;">To</label>
                                    <div class="col-sm-1" style="width: 10%;">
                                        <input type="text" name="${periodEnd}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[1]}" disabled/>
                                    </div>
                                    <div class="col-sm-1 form-check form-switch mb-2" style="width: auto;">
                                        <input class="form-check-input timepicker-toggle" type="checkbox" id="checkbox${index+1}_${day}_${clinicId}" />
                                    </div>`
                                );
                                $('.time_slot_count').val(index + 1);
                            }

                            // Initialize flatpickr
                            $(".timepicker").flatpickr({
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "h:i K",
                            });
                        });
                    }
                });
            }
        }
    });
}


function updateFirstPeriodStartTimepickers(time, timeSlot) {
    // Get the clinic ID from the hidden input
    var clinicId = $("#main_clinic_id").val();

    // Define the days of the week
    var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    var timeSlot = timeSlot.replace("All_", "");
    // Loop through each day and update the corresponding timepickers
    $.each(days, function (index, day) {
        // var $timepickerStart = $(
        //     'input[name="first_period_start_' + day + "_" + clinicId + '"]'
        // );

        var $timepickerStart = $(
            'input[name="' + timeSlot + day + "_" + clinicId + '"]'
        );
        // var $timepickerEnd = $('input[name="first_period_end_' + day + '_' + clinicId + '"]');

        if ($timepickerStart.length) {
            $timepickerStart.val(time);
        }
        // if ($timepickerEnd.length) {
        //     $timepickerEnd.val(time); // Adjust this if you need different logic for end time
        // }
    });
}

function updateFirstPeriodEndTimepickers(time, timeSlot) {
    // Get the clinic ID from the hidden input
    var clinicId = $("#main_clinic_id").val();
    // console.log(allTimepickerStart);
    // Define the days of the week
    var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    var timeSlot = timeSlot.replace("All_", "");

    // Loop through each day and update the corresponding timepickers
    $.each(days, function (index, day) {
        // var $timepickerStart = $('input[name="first_period_start_' + day + '_' + clinicId + '"]');
        // var $timepickerEnd = $(
        //     'input[name="first_period_end_' + day + "_" + clinicId + '"]'
        // );
        var $timepickerEnd = $(
            'input[name="' + timeSlot + day + "_" + clinicId + '"]'
        );

        // if ($timepickerStart.length) {
        //     $timepickerStart.val(time);
        // }
        if ($timepickerEnd.length) {
            $timepickerEnd.val(time); // Adjust this if you need different logic for end time
        }
    });
}

function updateOtherCheckboxes(clinicId, isChecked, periodCnt, checkboxId) {
    // Define the days of the week
    var days = [
        "All",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    var match = checkboxId.match(/checkbox(\d*)_All_\d+/);
    // console.log(match);
    var periodCnt = match[1] !== undefined && match[1] !== "" ? match[1] : null;
    // alert(checkboxId);
    $.each(days, function (index, day) {
        // if ("All" != day) {
        if (typeof periodCnt === "undefined" || periodCnt === null) {
            var checkbox = $("#checkbox_" + day + "_" + clinicId);
            var timepickerStart = $(
                'input[name="first_period_start_' + day + "_" + clinicId + '"]'
            );
            var timepickerEnd = $(
                'input[name="first_period_end_' + day + "_" + clinicId + '"]'
            );
            console.log(timepickerStart);
        } else {
            var checkbox = $(
                "#checkbox" + periodCnt + "_" + day + "_" + clinicId
            );
            if (periodCnt == 2) {
                var timepickerStart = $(
                    'input[name="second_period_start_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
                var timepickerEnd = $(
                    'input[name="second_period_end_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
            } else if (periodCnt == 3) {
                var timepickerStart = $(
                    'input[name="third_period_start_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
                var timepickerEnd = $(
                    'input[name="third_period_end_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
            } else if (periodCnt == 4) {
                var timepickerStart = $(
                    'input[name="fourth_period_start_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
                var timepickerEnd = $(
                    'input[name="fourth_period_end_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
            } else if (periodCnt == 5) {
                var timepickerStart = $(
                    'input[name="fifth_period_start_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
                var timepickerEnd = $(
                    'input[name="fifth_period_end_' +
                        day +
                        "_" +
                        clinicId +
                        '"]'
                );
            }
        }

        if (checkbox.length) {
            checkbox.prop("checked", isChecked);
        }

        console.log(checkboxId);

        if (timepickerStart.length && timepickerEnd.length) {
            if (isChecked) {
                // console.log(periodCnt);
                // timepickerStart.prop("disabled", false);
                // timepickerEnd.prop("disabled", false);
                timepickerStart.prop("disabled", false).val("09:00 AM");
                timepickerEnd.prop("disabled", false).val("09:00 PM");
                console.log(timepickerStart);
            } else {
                timepickerStart.prop("disabled", true);
                timepickerEnd.prop("disabled", true);
            }
        }

        // }
    });
}



$(document).on("change", ".timepicker-toggle", function () {
    var isChecked = $(this).is(":checked");
    // $(this).closest(".row").find(".timepicker").prop("disabled", !isChecked);
    var checkboxId = $(this).attr("id");

    var periodCnt = "";
    if ($(".period_count").val()) {
        periodCnt = $(".period_count").val();
    }
    // alert(checkboxId.startsWith("checkbox" + periodCnt + "_All"));
    // console.log(isChecked);
    // allOtherIds = "checkbox"+periodCnt+_All
    if (checkboxId.startsWith("checkbox_All")) {
        // Extract the clinicId from the checkbox ID
        var clinicId = checkboxId.split("_").pop();
        // Call updateOtherCheckboxes with clinicId and isChecked
        updateOtherCheckboxes(
            clinicId,
            isChecked,
            (periodCnt = null),
            checkboxId
        );
    } else if (!checkboxId.includes("_All")) {
    
    var isChecked = $(this).is(':checked');
    var $currentCheckbox = $(this);
    var $row = $currentCheckbox.closest('.row');

    var defaultStartTime = '08:00 AM';
  var defaultEndTime = '05:00 PM';


    // Handle the first checkbox
    if ($currentCheckbox.attr('id').startsWith('checkbox_')) {
        // $row.find('input[name^="first_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');
        // $row.find('input[name^="first_period_end_"]').prop('disabled', !isChecked).val(isChecked ? defaultEndTime : '');
        $row.find('input[name^="first_period_start_"]').prop('disabled', !isChecked);
    $row.find('input[name^="first_period_end_"]').prop('disabled', !isChecked);
    
    if (isChecked) {
        // If checked, set default values
        $row.find('input[name^="first_period_start_"]').val(defaultStartTime);
        $row.find('input[name^="first_period_end_"]').val(defaultEndTime);
    }
    }

    // Handle the second checkbox
    if ($currentCheckbox.attr('id').startsWith('checkbox2_')) {
        // $row.find('input[name^="second_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');
        // $row.find('input[name^="second_period_end_"]').prop('disabled', !isChecked).val(isChecked ? defaultEndTime : '');

        $row.find('input[name^="second_period_start_"]').prop('disabled', !isChecked);
        $row.find('input[name^="second_period_end_"]').prop('disabled', !isChecked);
        
        if (isChecked) {
            // If checked, set default values
            $row.find('input[name^="second_period_start_"]').val(defaultStartTime);
            $row.find('input[name^="second_period_end_"]').val(defaultEndTime);
        }
    }

    // Handle the third checkbox
    if ($currentCheckbox.attr('id').startsWith('checkbox3_')) {
        // $row.find('input[name^="third_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');
        // $row.find('input[name^="third_period_end_"]').prop('disabled', !isChecked).val(isChecked ? defaultEndTime : '');

        $row.find('input[name^="third_period_start_"]').prop('disabled', !isChecked);
        $row.find('input[name^="third_period_end_"]').prop('disabled', !isChecked);
        
        if (isChecked) {
            // If checked, set default values
            $row.find('input[name^="third_period_start_"]').val(defaultStartTime);
            $row.find('input[name^="third_period_end_"]').val(defaultEndTime);
        }
    }

    // Handle the fourth checkbox
    if ($currentCheckbox.attr('id').startsWith('checkbox4_')) {
        // $row.find('input[name^="fourth_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');
        // $row.find('input[name^="fourth_period_end_"]').prop('disabled', !isChecked).val(isChecked ? defaultEndTime : '');

        $row.find('input[name^="fourth_period_start_"]').prop('disabled', !isChecked);
        $row.find('input[name^="fourth_period_end_"]').prop('disabled', !isChecked);
        
        if (isChecked) {
            // If checked, set default values
            $row.find('input[name^="fourth_period_start_"]').val(defaultStartTime);
            $row.find('input[name^="fourth_period_end_"]').val(defaultEndTime);
        }
    }

    // Handle the fifth checkbox
    if ($currentCheckbox.attr('id').startsWith('checkbox5_')) {
        // $row.find('input[name^="fifth_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');
        // $row.find('input[name^="fifth_period_end_"]').prop('disabled', !isChecked).val(isChecked ? defaultEndTime : '');

        $row.find('input[name^="fifth_period_start_"]').prop('disabled', !isChecked);
        $row.find('input[name^="fifth_period_end_"]').prop('disabled', !isChecked);
        
        if (isChecked) {
            // If checked, set default values
            $row.find('input[name^="fifth_period_start_"]').val(defaultStartTime);
            $row.find('input[name^="fifth_period_end_"]').val(defaultEndTime);
        }
    }
    } else {
        var clinicId = checkboxId.split("_").pop();
        // console.log(checkboxId);
        // console.log(checkboxId);

        updateOtherCheckboxes(clinicId, isChecked, periodCnt, checkboxId);
    }
});



$(document).on("change", 'input[name^="first_period_start_All_"]', function () {
    updateFirstPeriodStartTimepickers($(this).val(), "first_period_start_All_");
});

$(document).on("change", 'input[name^="first_period_end_All_"]', function () {
    updateFirstPeriodStartTimepickers($(this).val(), "first_period_end_All_");
});

$(document).on(
    "change",
    'input[name^="second_period_start_All_"]',
    function () {
        updateFirstPeriodStartTimepickers(
            $(this).val(),
            "second_period_start_All_"
        );
    }
);

$(document).on("change", 'input[name^="second_period_end_All_"]', function () {
    updateFirstPeriodStartTimepickers($(this).val(), "second_period_end_All_");
});

$(document).on("change", 'input[name^="third_period_start_All_"]', function () {
    updateFirstPeriodStartTimepickers($(this).val(), "third_period_start_All_");
});

$(document).on("change", 'input[name^="third_period_end_All_"]', function () {
    console.log($(this));
    updateFirstPeriodEndTimepickers($(this).val(), "third_period_end_All_");
});

$(document).on(
    "change",
    'input[name^="fourth_period_start_All_"]',
    function () {
        updateFirstPeriodStartTimepickers(
            $(this).val(),
            "fourth_period_start_All_"
        );
    }
);

$(document).on("change", 'input[name^="fourth_period_end_All_"]', function () {
    updateFirstPeriodEndTimepickers($(this).val(), "fourth_period_end_All_");
});

$(document).on("change", 'input[name^="fifth_period_start_All_"]', function () {
    updateFirstPeriodStartTimepickers($(this).val(), "fifth_period_start_All_");
});

$(document).on("change", 'input[name^="fifth_period_end_All_"]', function () {
    updateFirstPeriodEndTimepickers($(this).val(), "fifth_period_end_All_");
});

$(document).on("click", ".add-more-btn", function () {
    var clinicId = $(this).data("clinic-id");
    var mainClinicId = $("#main_clinic_id").val();
    if (parseInt($(".time_slot_count").val()) === 2) {
        var periodStart = "third_period_start_";
        var periodEnd = "third_period_end_";
        var periodHeader = "Third Period";
    } else if (parseInt($(".time_slot_count").val()) === 3) {
        var periodStart = "fourth_period_start_";
        var periodEnd = "fourth_period_end_";
        var periodHeader = "Fourth Period";
    } else if (parseInt($(".time_slot_count").val()) === 4) {
        var periodStart = "fifth_period_start_";
        var periodEnd = "fifth_period_end_";
        var periodHeader = "Fifth Period";
    } else if (parseInt($(".time_slot_count").val()) === 5) {
        var periodStart = "sixth_period_start_";
        var periodEnd = "sixth_period_end_";
        var periodHeader = "Sixth Period";
    }
    var periodCount = parseInt($(".time_slot_count").val()) + 1;
    $(".period_count").val(periodCount);
    // Retrieve the data attributes from the last period data
    var lastPeriodData = $(`#last_period_data_${clinicId}`);
    var day = lastPeriodData.data("day");
    var lastPeriodStart = lastPeriodData.data("start");
    var lastPeriodEnd = lastPeriodData.data("end");
    // Append the new period section to all days
    var days = [
        "All",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    days.forEach(function (day) {
        if (parseInt($(".time_slot_count").val()) === 3) {
            $(`#time_period_section_${day}_${clinicId}`).append(
                '<label for="flatpickr-time-all" class="col-sm-1 col-form-label"></label>'
            );
            
        }
        $(`#time_period_header_${day}_${clinicId}`).append(
            '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-4 text-center" id="time_period_header_{{$day}}_{{$clinic->clinicId}}">'+
                  '<h5 class="custom-timetitle">'+periodHeader+'</h5>'+
                '</div>'
        );
        
        $(`#time_period_section_${day}_${clinicId}`).append(
            '<div class="col-sm-1" style="width: 10%;">' +
                '<input type="text" name="' +
                periodStart +
                "" +
                day +
                "_" +
                mainClinicId +
                '" class="form-control timepicker" placeholder="HH:MM AM/PM" disabled/>' +
                '<div class="invalid-feedback" id="' +periodStart +"" +day +"_" +mainClinicId +'_error"></div>'+
                "</div>" +
                '<label for="flatpickr-time-all" class="col-sm-1 col-form-label" style="width: auto;">To</label>' +
                '<div class="col-sm-1" style="width: 10%;">' +
                '<input type="text" name="' +
                periodEnd +
                "" +
                day +
                "_" +
                mainClinicId +
                '" class="form-control timepicker" placeholder="HH:MM AM/PM" disabled />' +
                "</div>" +
                '<div class="col-sm-1 form-check form-switch mb-2">' +
                '<input class="form-check-input timepicker-toggle" type="checkbox" id="checkbox' +
                periodCount +
                "_" +
                day +
                "_" +
                mainClinicId +
                '" />'
        );
        $(`#time_period_section_${day}_${clinicId}`).append(
            '<div class="row"><br></div>'
        );
    });

    $(".time_slot_count").val(parseInt($(".time_slot_count").val()) + 1);

    // Reinitialize flatpickr or any other timepicker
    $(".timepicker").flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });
});
function compareTime(time1, time2) {
    let [hours1, minutes1] = time1.split(/[:\s]/);
    let [hours2, minutes2] = time2.split(/[:\s]/);
    let period1 = time1.includes('PM') ? 'PM' : 'AM';
    let period2 = time2.includes('PM') ? 'PM' : 'AM';

    if (period1 === 'PM' && hours1 !== '12') hours1 = (parseInt(hours1) + 12).toString();
    if (period2 === 'PM' && hours2 !== '12') hours2 = (parseInt(hours2) + 12).toString();
    if (period1 === 'AM' && hours1 === '12') hours1 = '00';
    if (period2 === 'AM' && hours2 === '12') hours2 = '00';

    let time1InMinutes = parseInt(hours1) * 60 + parseInt(minutes1);
    let time2InMinutes = parseInt(hours2) * 60 + parseInt(minutes2);

    return time1InMinutes < time2InMinutes;
}


// $(document).ready(function() {
    // Attach a change event listener to all time pickers
    // $(document).on('.timepicker').on('change', function() {
    //     // Extract the day and clinicId from the name attribute
    //     let timePickerName = $(this).attr('name');
    //     let nameParts = timePickerName.split('_');
    //     let period = nameParts[0] + '_' + nameParts[1]; // first_period or second_period
    //     let day = nameParts[2]; // Day (e.g., Sunday)
    //     let clinicId = nameParts[3]; // Clinic ID (e.g., 2)

    //     // Get the start and end time inputs
    //     let startTimeInput = $(`input[name='${period}_start_${day}_${clinicId}']`);
    //     let endTimeInput = $(`input[name='${period}_end_${day}_${clinicId}']`);

    //     // Parse the times
    //     let startTime = startTimeInput.val();
    //     let endTime = endTimeInput.val();

    //     // Debugging output
    //     console.log('Time Picker Name:', timePickerName);
    //     console.log('Start Time:', startTime);
    //     console.log('End Time:', endTime);

    //     if (startTime && endTime) {
    //         let start = new Date(`01/01/2000 ${startTime}`);
    //         let end = new Date(`01/01/2000 ${endTime}`);

    //         // Check if the end time is less than or equal to the start time
    //         if (end <= start) {
    //             // Show an error message
    //             if (endTimeInput.next('.error-message').length === 0) {
    //                 endTimeInput.after('<small class="error-message text-danger">End time must be greater than start time.</small>');
    //             }
    //             endTimeInput.val(''); // Optionally clear the end time input
    //         } else {
    //             // Remove any existing error message
    //             endTimeInput.next('.error-message').remove();
    //         }
    //     }
    // });
// });

