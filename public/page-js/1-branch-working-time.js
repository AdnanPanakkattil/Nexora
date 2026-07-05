$(document).ready(function () {
    $("#branch_main_menu").addClass("active open menu-item-animating");
    $("#branch_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    initialPageload($("#clinic_id").val());

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    const clinicId = $("#clinic_id").val();

    // Handle the change event for first_period_start_All and first_period_end_All
    $('input[name="first_period_start_All_' + { clinicId } + '"]').on(
        "change",
        function () {
            var selectedTime = $(this).val();

            // Update all other timepickers in the first period start times
            [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ].forEach(function (day) {
                $('input[name="first_period_start_' + day + '"]').val(
                    selectedTime
                );
            });
        }
    );

    $('input[name="first_period_end_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="first_period_end_' + day + '"]').val(selectedTime);
        });
    });

    $('input[name="second_period_start_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="second_period_start_' + day + '"]').val(
                selectedTime
            );
        });
    });

    $('input[name="second_period_end_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="second_period_end_' + day + '"]').val(selectedTime);
        });
    });

    // $('input[name="third_period_start_All"]').on('change', function() {
    //   var selectedTime = $(this).val();

    //   // Update all other timepickers in the first period end times
    //   ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(function(day) {
    //     $('input[name="third_period_start_' + day + '"]').val(selectedTime);
    //   });
    // });

    // $('input[name="third_period_end_All"]').on('change', function() {
    //   var selectedTime = $(this).val();

    //   // Update all other timepickers in the first period end times
    //   ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(function(day) {
    //     $('input[name="third_period_end_' + day + '"]').val(selectedTime);
    //   });
    // });

    $('input[name="fourth_period_end_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="first_period_end_' + day + '"]').val(selectedTime);
        });
    });

    $('input[name="fifth_period_end_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="first_period_end_' + day + '"]').val(selectedTime);
        });
    });

    $('input[name="sixth_period_end_All"]').on("change", function () {
        var selectedTime = $(this).val();

        // Update all other timepickers in the first period end times
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ].forEach(function (day) {
            $('input[name="first_period_end_' + day + '"]').val(selectedTime);
        });
    });

    // Listen for changes on the "All" start checkbox
    $("#first_period_All_" + clinicId).on("change", function () {
        const clinicId = $("#clinic_id").val();

        syncPeriod("first_period", clinicId);
    });

    $("#second_period_All_" + clinicId).on("change", function () {
        const clinicId = $("#clinic_id").val();
        syncPeriod("second_period", clinicId);
    });

    $(".save-btn").on("click", function () {
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
            error: function(xhr) {
    // Clear all previous inline errors
    $('.invalid-feedback-err').text('');
    $('.form-control').removeClass('is-invalid');

    if (!xhr.responseJSON || !xhr.responseJSON.errors) return;

    let errors = xhr.responseJSON.errors;

    // Collect all error messages into a list
    let errorMessages = [];

    $.each(errors, function(key, value) {
        errorMessages.push(value[0]);

        // Highlight the input field with red border
        $('input[name="' + key + '"]').addClass('is-invalid');
    });

    // Remove duplicate messages
    let uniqueErrors = [...new Set(errorMessages)];

    // Show all errors in a single SweetAlert modal
    Swal.fire({
        title: 'Access Denied',
        icon: 'error',
        html: '<p style="text-align:left; padding-left: 20px;">' +
            uniqueErrors.map(function(msg) {
                return '<li>' + msg + '</li>';
            }).join('') +
            '</p>',
        customClass: {
            confirmButton: 'btn btn-danger waves-effect waves-light',
        },
    });
}
        });
    });
});

$(document).on("change", "input[name='third_period_start_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="third_period_start_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='third_period_end_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="third_period_end_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='fourth_period_start_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="fourth_period_start_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='fourth_period_end_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="fourth_period_end_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='fifth_period_start_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="fifth_period_start_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='fifth_period_end_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="fifth_period_end_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='sixth_period_start_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="sixth_period_start_' + day + '"]').val(selectedTime);
    });
});

$(document).on("change", "input[name='sixth_period_end_All']", function () {
    var selectedTime = $(this).val();

    // Update all other timepickers in the first period end times
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        $('input[name="sixth_period_end_' + day + '"]').val(selectedTime);
    });
});

// $('#second_period_All').on('change', function() {
//   syncPeriod('second_period');
// });
$(document).on(
    "change",
    "#third_period_All_" + $("#clinic_id").val(),
    function () {
        const clinicId = $("#clinic_id").val();
        syncPeriod("third_period", clinicId);
    }
);

$(document).on(
    "change",
    "#fourth_period_All_" + $("#clinic_id").val(),
    function () {
        const clinicId = $("#clinic_id").val();
        syncPeriod("fourth_period", clinicId);
    }
);

$(document).on(
    "change",
    "#fifth_period_All_" + $("#clinic_id").val(),
    function () {
        const clinicId = $("#clinic_id").val();
        syncPeriod("fifth_period", clinicId);
    }
);

$(document).on(
    "change",
    "#sixth_period_All_" + $("#clinic_id").val(),
    function () {
        const clinicId = $("#clinic_id").val();
        syncPeriod("sixth_period", clinicId);
    }
);

// Function to handle checking/unchecking all day checkboxes and syncing time pickers
function syncPeriod(periodName, clinincId) {
    // Get the state of the "All" checkbox
    var isChecked = $(`#${periodName}_All_${clinincId}`).prop("checked");

    // Get the time from the "All" time pickers
    var startTime = $(
        `input[name='${periodName}_start_All_${clinincId}']`
    ).val();
    var endTime = $(`input[name='${periodName}_end_All_${clinincId}']`).val();

    // Loop through each day and apply the changes
    [
        "All",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ].forEach(function (day) {
        // Check/uncheck all day checkboxes
        $(`#${periodName}_${day}_${clinincId}`).prop("checked", isChecked);
        $(`#${periodName}_${day}_${clinincId}`).prop("checked", isChecked);

        // Enable/disable the time pickers and sync the time
        if (isChecked) {
            $(`input[name='${periodName}_start_${day}_${clinincId}']`)
                .val(startTime)
                .prop("disabled", false);
            $(`input[name='${periodName}_end_${day}_${clinincId}']`)
                .val(endTime)
                .prop("disabled", false);
        } else {
            $(`input[name='${periodName}_start_${day}_${clinincId}']`).prop(
                "disabled",
                true
            );
            $(`input[name='${periodName}_end_${day}_${clinincId}']`).prop(
                "disabled",
                true
            );
        }
    });
}

$(document).on("change", ".switch-input", function () {
    const clinicId = $("#clinic_id").val();
    var checkboxId = $(this).attr("id"); // Get the ID of the checkbox

    // Since checkboxId is structured as "first_period_Monday", split it
    var parts = checkboxId.split("_"); // This will return an array like ['first', 'period', 'Monday']

    // Combine the first two parts to get the period name (e.g., 'first_period')
    var periodName = parts[0] + "_" + parts[1]; // Combine 'first' and 'period'

    // The day name is the third part of the split array
    var dayName = parts[2]; // 'Monday'

    // Build the selector for the start and end inputs
    var startInput = `input[name="${periodName}_start_${dayName}_${clinicId}"]`;
    var endInput = `input[name="${periodName}_end_${dayName}_${clinicId}"]`;
    // Enable or disable based on checkbox state
    if ($(this).is(":checked")) {
        $(startInput).prop("disabled", false); // Enable start time
        $(endInput).prop("disabled", false); // Enable end time
    } else {
        $(startInput).prop("disabled", true); // Disable start time
        $(endInput).prop("disabled", true); // Disable end time
    }
});

// function initialPageload(clinicId) {
//   $.ajax({
//       url: BASE_URL + "/branch-working-time-details/" + clinicId,
//       type: "GET",
//       success: function (response) {
//         // console.log(response.data[0].workingtimes);

//           if (response.status === true) {
//               var workingTimes = response.data[0].workingtimes;
//               var days = workingTimes.split("|");
//               // console.log(days);
//               var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//               var periodsession = ["start","end"];
//               var periods = ["first_period","second_period","third_period","fourth_period","fifth_period","sixth_period"];
//               days.forEach(function (item,index) {
//                 let itemArray = item.split("->");
//                 let timeRanges = itemArray[1].split("&");
//                 console.log(timeRanges.length);
//                 timeRanges.forEach(function (item1,index1) {
//                   periodRange = item1.split("-");
//                   console.log(periodRange);
//                   console.log(periodRange[0]);
//                   console.log(periodRange[1]);
//                   if (index1 > 1) {

//               $('.period-container').append(newSectionHtml);

//                   } else{
//                     $('.'+periods[index1]+'_'+periodsession[0]+'_'+daysOfWeek[index]+'_'+clinicId).val(periodRange[0]);
//                   $('.'+periods[index1]+'_'+periodsession[1]+'_'+daysOfWeek[index]+'_'+clinicId).val(periodRange[1]);
//                   }

//                   // console.log(periodRange);
//                 });

//               });

//           }
//       }
//   });
// }

// function initialPageload(clinicId) {
//   $.ajax({
//     url: BASE_URL + "/branch-working-time-details/" + clinicId,
//     type: "GET",
//     success: function(response) {
//       if (response.status === true) {
//         var workingTimes = response.data[0].workingtimes;
//         var days = workingTimes.split("|");
//         var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//         var periodsession = ["start", "end"];
//         var periods = ["first_period", "second_period", "third_period", "fourth_period", "fifth_period", "sixth_period"];

//         days.forEach(function(item, index) {
//           let itemArray = item.split("->");
//           let timeRanges = itemArray[1].split("&");

//           timeRanges.forEach(function(item1, index1) {
//             let periodRange = item1.split("-");

//             // Check if more than two periods exist, dynamically append additional periods
//             if (index1 > 1) {
//               if (index1 === 2) {
//                 appendNewPeriodSection('third_period', 'Third Period', clinicId, daysOfWeek[index]);
//               } else if (index1 === 3) {
//                 appendNewPeriodSection('fourth_period', 'Fourth Period', clinicId, daysOfWeek[index]);
//               } else if (index1 === 4) {
//                 appendNewPeriodSection('fifth_period', 'Fifth Period', clinicId, daysOfWeek[index]);
//               } else if (index1 === 5) {
//                 appendNewPeriodSection('sixth_period', 'Sixth Period', clinicId, daysOfWeek[index]);
//               }
//             }

//             // Populate the existing period input fields
//             $('.' + periods[index1] + '_' + periodsession[0] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[0]);
//             $('.' + periods[index1] + '_' + periodsession[1] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[1]);
//           });
//         });
//       }
//     }
//   });
// }

// // Helper function to append a new period section dynamically
// function appendNewPeriodSection(periodName, periodSectionName, clinicId, dayOfWeek) {
//   var newSectionHtml = `
//     <div class="col-md-4 col-sm-6 col-12 mb-6">
//       <div class="">
//         <h5 class="custom-timetitle">${periodSectionName}</h5>
//       </div>
//       ${['All', dayOfWeek].map(function(day) {
//         return `
//           <div style="display: flex; flex-direction: column; text-align: center; margin-bottom: 20px;">
//             <div class="custom-worktime">
//               <div class="col-2 form-control-label">
//                 <label for="0-day" class="custom-timetitle">${day}</label>
//               </div>
//               <div class="col">
//                 <div class="form-group">
//                   <div class="form-line focused">
//                     <input type="text" class="form-control timepicker" name="${periodName}_start_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time-start" disabled>
//                   </div>
//                 </div>
//               </div>
//               <div class="go-left to">
//                 <label class="custom-timetitle">To</label>
//               </div>
//               <div class="col">
//                 <div class="form-group">
//                   <div class="form-line focused">
//                     <input type="text" class="form-control timepicker" name="${periodName}_end_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time" disabled />
//                   </div>
//                 </div>
//               </div>
//               <div class="col">
//                 <label class="switch switch-primary">
//                   <input type="checkbox" class="switch-input" id="${periodName}_${day}_${clinicId}" />
//                   <span class="switch-toggle-slider">
//                     <span class="switch-on"></span>
//                     <span class="switch-off"></span>
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>`;
//       }).join('')}
//     </div>`;

//   // Append the new section
//   $('.period-container').append(newSectionHtml);

//   // Reinitialize Flatpickr for the newly appended inputs
//   flatpickr(".timepicker", {
//     enableTime: true,
//     noCalendar: true,
//     dateFormat: "h:i K",
//   });
// }

// function initialPageload(clinicId) {
//   $.ajax({
//       url: BASE_URL + "/branch-working-time-details/" + clinicId,
//       type: "GET",
//       success: function (response) {
//           if (response.status === true) {
//               var workingTimes = response.data[0].workingtimes;
//               var days = workingTimes.split("|");

//               var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//               var periodsession = ["start", "end"];
//               var periods = ["first_period", "second_period", "third_period", "fourth_period", "fifth_period", "sixth_period"];

//               // Iterate over days
//               days.forEach(function (item, index) {
//                   let itemArray = item.split("->");
//                   let timeRanges = itemArray[1].split("&");

//                   // Assign the values for the first and second periods
//                   timeRanges.forEach(function (item1, index1) {
//                       let periodRange = item1.split("-");

//                       if (index1 < 2) {
//                           // Assign for first and second periods (existing fields)
//                           $('.' + periods[index1] + '_' + periodsession[0] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[0]);
//                           $('.' + periods[index1] + '_' + periodsession[1] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[1]);
//                       }
//                       else if (index1 === 2) {
//                           // Check for third period and append dynamically
//                           console.log(periods[index1]);
//                           console.log(periodRange);
//                           var periodName = 'third_period';
//                           var periodSectionName = 'Third Period';
//                           var newSectionHtml = `
//                           <div class="col-md-4 col-sm-6 col-12 mb-6">
//                               <div class="">
//                                   <h5 class="custom-timetitle">${periodSectionName}</h5>
//                               </div>
//                               ${['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(function(day) {
//                                   return `
//                                       <div style="display: flex;flex-direction: column;text-align: center; margin-bottom: 20px;">
//                                   <div class="custom-worktime ">
//                                       <div class="col">
//                                           <div class="form-group">
//                                               <div class="form-line focused">
//                                                   <input type="text" class="form-control timepicker" name="${periodName}_start_${day}_${clinicId}" value="${periodRange[0]}" placeholder="HH:MM" id="flatpickr-time-start" disabled>
//                                               </div>
//                                           </div>
//                                       </div>
//                                       <div class="go-left to">
//                                           <label class="custom-timetitle">To</label>
//                                       </div>
//                                       <div class="col">
//                                           <div class="form-group">
//                                               <div class="form-line focused">
//                                                   <input type="text" class="form-control timepicker" name="${periodName}_end_${day}_${clinicId}" value="${periodRange[1]}" placeholder="HH:MM" id="flatpickr-time" disabled/>
//                                               </div>
//                                           </div>
//                                       </div>
//                                       <div class="col">
//                                           <label class="switch switch-primary">
//                                               <input type="checkbox" class="switch-input" id="${periodName}_${day}_${clinicId}" />
//                                               <span class="switch-toggle-slider">
//                                                   <span class="switch-on"></span>
//                                                   <span class="switch-off"></span>
//                                               </span>
//                                           </label>
//                                       </div>
//                                   </div>
//                                   </div>`;
//                               }).join('')}
//                           </div>`;

//                           // Append the new section only once per day when third period exists
//                           if ($('.third_period_start_' + daysOfWeek[index] + '_' + clinicId).length === 0) {
//                               $('.period-container').append(newSectionHtml);
//                           }

//                           // Assign the third period values
//                           $('.third_period_start_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[0]);
//                           $('.third_period_end_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[1]);

//                           // Reinitialize flatpickr for the new fields
//                           flatpickr(".timepicker", {
//                               enableTime: true,
//                               noCalendar: true,
//                               dateFormat: "h:i K",
//                           });
//                       }
//                   });
//               });
//           }
//       }
//   });
// }

// function initialPageload(clinicId) {
//   $.ajax({
//       url: BASE_URL + "/branch-working-time-details/" + clinicId,
//       type: "GET",
//       success: function (response) {
//           if (response.status === true) {
//               var workingTimes = response.data[0].workingtimes;
//               var days = workingTimes.split("|");

//               var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//               var periodsession = ["start", "end"];
//               var periods = ["first_period", "second_period", "third_period", "fourth_period", "fifth_period", "sixth_period"];

//               // Iterate over days
//               days.forEach(function (item, index) {
//                   let itemArray = item.split("->");
//                   let timeRanges = itemArray[1].split("&");

//                   // Assign the values for the first and second periods
//                   timeRanges.forEach(function (item1, index1) {
//                       let periodRange = item1.split("-");

//                       if (index1 < 2) {
//                           // Assign for first and second periods (existing fields)
//                           $('.' + periods[index1] + '_' + periodsession[0] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[0]);
//                           $('.' + periods[index1] + '_' + periodsession[1] + '_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[1]);
//                       }
//                       else if (index1 === 2 && $('.third_period_start_' + daysOfWeek[index] + '_' + clinicId).length === 0) {
//                           // Check for third period and append dynamically (Only once per day)
//                           var periodName = 'third_period';
//                           var periodSectionName = 'Third Period';
//                           var newSectionHtml = `
//                           <div class="col-md-4 col-sm-6 col-12 mb-6">
//                               <div class="">
//                                   <h5 class="custom-timetitle">${periodSectionName}</h5>
//                               </div>
//                               ${['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(function(day) {
//                                   return `
//                                       <div style="display: flex;flex-direction: column;text-align: center; margin-bottom: 20px;">
//                                   <div class="custom-worktime ">
//                                       <div class="col">
//                                           <div class="form-group">
//                                               <div class="form-line focused">
//                                                   <input type="text" class="form-control timepicker third_period_start_${day}_${clinicId}" name="${periodName}_start_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time-start" disabled>
//                                               </div>
//                                           </div>
//                                       </div>
//                                       <div class="go-left to">
//                                           <label class="custom-timetitle">To</label>
//                                       </div>
//                                       <div class="col">
//                                           <div class="form-group">
//                                               <div class="form-line focused">
//                                                   <input type="text" class="form-control timepicker third_period_end_${day}_${clinicId}" name="${periodName}_end_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time" disabled/>
//                                               </div>
//                                           </div>
//                                       </div>
//                                       <div class="col">
//                                           <label class="switch switch-primary">
//                                               <input type="checkbox" class="switch-input" id="${periodName}_${day}_${clinicId}" />
//                                               <span class="switch-toggle-slider">
//                                                   <span class="switch-on"></span>
//                                                   <span class="switch-off"></span>
//                                               </span>
//                                           </label>
//                                       </div>
//                                   </div>
//                                   </div>`;
//                               }).join('')}
//                           </div>`;

//                           // Append the new section only once per day when third period exists
//                           if ($('.third_period_start_' + daysOfWeek[index] + '_' + clinicId).length === 0) {
//                               $('.period-container').append(newSectionHtml);
//                           }

//                           // Assign the third period values
//                           $('.third_period_start_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[0]);
//                           $('.third_period_end_' + daysOfWeek[index] + '_' + clinicId).val(periodRange[1]);

//                           // Reinitialize flatpickr for the new fields
//                           flatpickr(".timepicker", {
//                               enableTime: true,
//                               noCalendar: true,
//                               dateFormat: "h:i K",
//                           });
//                       }
//                   });
//               });
//           }
//       }
//   });
// }

function initialPageload(clinicId) {
    $.ajax({
        url: BASE_URL + "/branch-working-time-details/" + clinicId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                var workingTimes = response.data[0].workingtimes;
                var days = workingTimes.split("|");

                var daysOfWeek = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ];
                var periodsession = ["start", "end"];
                var periods = [
                    "first_period",
                    "second_period",
                    "third_period",
                    "fourth_period",
                    "fifth_period",
                    "sixth_period",
                ];

                // Iterate over days
                days.forEach(function (item, index) {
                    let itemArray = item.split("->");
                    let timeRanges = itemArray[1].split("&");

                    // Assign the values for all periods dynamically
                    timeRanges.forEach(function (item1, index1) {
                        let periodRange = item1.split("-");
                        // console.log(daysOfWeek[index]);
                        if (index1 < 2) {
                            // Assign for first and second periods (existing fields)
                            $(
                                "." +
                                    periods[index1] +
                                    "_" +
                                    periodsession[0] +
                                    "_" +
                                    daysOfWeek[index] +
                                    "_" +
                                    clinicId
                            ).val(periodRange[0]);
                            $(
                                "." +
                                    periods[index1] +
                                    "_" +
                                    periodsession[1] +
                                    "_" +
                                    daysOfWeek[index] +
                                    "_" +
                                    clinicId
                            ).val(periodRange[1]);
                            // console.log(index1);
                        } else {
                            // For third and beyond, dynamically append periods if they exist
                            if (
                                $(
                                    "." +
                                        periods[index1] +
                                        "_start_" +
                                        daysOfWeek[index] +
                                        "_" +
                                        clinicId
                                ).length === 0
                            ) {
                                var periodName = periods[index1];
                                var periodSectionName = capitalizeFirstLetter(
                                    periodName.replace("_", " ")
                                );
                                var periodIndex = index1;
                                // console.log(index1);
                                var newSectionHtml = `
                              <div class="col-md-4 col-sm-6 col-12 mb-6">
                                  <div class="">
                                      <h5 class="custom-timetitle">${periodSectionName}</h5>
                                  </div>
                                  ${[
                                      "All",
                                      "Sunday",
                                      "Monday",
                                      "Tuesday",
                                      "Wednesday",
                                      "Thursday",
                                      "Friday",
                                      "Saturday",
                                  ]
                                      .map(function (day) {
                                          return `
                                          <div style="display: flex;flex-direction: column;text-align: center; margin-bottom: 20px;">
                                      <div class="custom-worktime ">
                                          <div class="col">
                                              <div class="form-group">
                                                  <div class="form-line focused">
                                                      <input type="text" class="form-control timepicker ${periodName}_start_${day}_${clinicId}" name="${periodName}_start_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time-start" disabled>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="go-left to">
                                              <label class="custom-timetitle">To</label>
                                          </div>
                                          <div class="col">
                                              <div class="form-group">
                                                  <div class="form-line focused">
                                                      <input type="text" class="form-control timepicker ${periodName}_end_${day}_${clinicId}" name="${periodName}_end_${day}_${clinicId}" placeholder="HH:MM" id="flatpickr-time" disabled/>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col">
                                              <label class="switch switch-primary">
                                                  <input type="checkbox" class="switch-input" name="" id="${periodName}_${day}_${clinicId}" />
                                                  <span class="switch-toggle-slider">
                                                      <span class="switch-on"></span>
                                                      <span class="switch-off"></span>
                                                  </span>
                                              </label>
                                          </div>
                                      </div>
                                      </div>`;
                                      })
                                      .join("")}
                              </div>`;

                                // Append the new section for each period beyond the second
                                $(".period-container").append(newSectionHtml);
                            }

                            // Assign values for each period dynamically
                            $(
                                "." +
                                    periods[index1] +
                                    "_start_" +
                                    daysOfWeek[index] +
                                    "_" +
                                    clinicId
                            ).val(periodRange[0]);
                            $(
                                "." +
                                    periods[index1] +
                                    "_end_" +
                                    daysOfWeek[index] +
                                    "_" +
                                    clinicId
                            ).val(periodRange[1]);

                            // Reinitialize flatpickr for the new fields
                            flatpickr(".timepicker", {
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "h:i K",
                            });
                        }
                    });
                });
            }
        },
    });
}

// Utility function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}
