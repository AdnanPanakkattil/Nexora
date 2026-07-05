$(document).ready(function () {
    $("#administration_main_menu").addClass("active open menu-item-animating");
    $("#employee_reg_sub_menu").addClass("active");

  $.ajaxSetup({
      headers: {
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
  });
  flatpickr(".timepicker", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
  });

  checkTimePickers();

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

  
  

  console.log($("#doctor_id").val());
  if ($("#doctor_id").val()) {
      initialPageload($("#doctor_id").val());
  }

  $(".save-btn").on("click", function () {
    var form = $(this).closest("form"); 
    var clonedForm = form.clone();

    clonedForm.find(":disabled").prop("disabled", false);

    var serializedData = clonedForm.serialize();
    //   var form = $(this).closest("form"); // Get the closest form
    //   console.log(form);
    //   var serializedData = form.serialize(); // Serialize form data
      var ajaxUrl = BASE_URL + "/nurse-working-time";
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
        //   error: function (xhr, status, error) {
        //       if (xhr.status === 422) {
        //           var errors = xhr.responseJSON.errors;
        //           $(".error-text").text("");
        //           $.each(errors, function (key, value) {
        //               $("." + key + "_error").text(value[0]);
        //           });
        //       } else {
        //           console.error("Error:", xhr);
        //       }
        //   },
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
        url: BASE_URL + "/doctor-working-time-details/" + clinicId,
        type: "GET",
        success: function (response) {
            if (response.status === true) {
                response.data.forEach(function (clinicData) {
                    var workingTimes = clinicData.workingtimes;
                    var clinicId = clinicData.ClinicsId;
                    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    var allSection = ["All"];
                    
                    workingTimes.split("|").forEach(function (item) {
                        var parts = item.split("->");
                        var dayIndex = parseInt(parts[0]);
                        var periods = parts[1].split("&");

                        // If dayIndex is valid (0 for Sunday through 6 for Saturday)
                        if (dayIndex >= 0 && dayIndex < 7) {
                            var day = daysOfWeek[dayIndex];

                            periods.forEach(function (period, index) {
                                var times = period.split("-");
                                var slotNames = ["first", "second", "third", "fourth", "fifth", "sixth"];
                                var periodHeader = ["First Period", "Second Period", "Third Period", "Fourth Period", "Fifth Period", "sixth"];
                                var periodStart = slotNames[index] + "_period_start_" + day + "_" + clinicId;
                                var periodEnd = slotNames[index] + "_period_end_" + day + "_" + clinicId;

                                if (index < 2) {
                                    $(`input[name="${periodStart}"]`).val(times[0]);
                                    $(`input[name="${periodEnd}"]`).val(times[1]);
                                } else {
                                    $(`#time_period_header_${day}_${clinicId}`).append(
                                        '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-4 text-center" id="time_period_header_{{$day}}_{{$clinic->clinicId}}">'+
                                              '<h5 class="custom-timetitle">'+periodHeader[index]+'</h5>'+
                                            '</div>'
                                    );
                                    $(`#time_period_section_${day}_${clinicId}`).append(
                                        `<div class="col-sm-1" style="width: 9%;">
                                            <input type="text" name="${periodStart}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[0]}" disabled/>
                                            <div class="invalid-feedback" id="${periodStart}_error"></div>
                                        </div>
                                        <label for="flatpickr-time-all" class="col-sm-1 col-form-label" style="width: auto;">To</label>
                                        <div class="col-sm-1" style="width: 9%;">
                                            <input type="text" name="${periodEnd}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[1]}" disabled/>
                                        </div>
                                        <div class="col-sm-1 form-check form-switch mb-2">
                                            <input class="form-check-input timepicker-toggle" type="checkbox" id="checkbox${index + 1}_${day}_${clinicId}" />
                                        </div>`
                                    );
                                    $(`#time_slot_count_${clinicId}`).val(index + 1);
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

                    // Handle 'All' section
                    workingTimes.split("|").forEach(function (item) {
                        var parts = item.split("->");
                        var dayIndex = parseInt(parts[0]);
                        var periods = parts[1].split("&");

                        if (dayIndex >= 0 && dayIndex < 7) {
                            var day = allSection[dayIndex];

                            periods.forEach(function (period, index) {
                                var times = period.split("-");
                                var slotNames = ["first", "second", "third", "fourth", "fifth", "sixth"];
                                var periodHeader = ["First Period", "Second Period", "Third Period", "Fourth Period", "Fifth Period", "sixth"];
                                var periodStart = slotNames[index] + "_period_start_" + day + "_" + clinicId;
                                var periodEnd = slotNames[index] + "_period_end_" + day + "_" + clinicId;

                                if (index < 2) {
                                    $(`input[name="${periodStart}"]`).val(times[0]);
                                    $(`input[name="${periodEnd}"]`).val(times[1]);
                                } else {
                                    $(`#time_period_header_${day}_${clinicId}`).append(
                                        '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-4 text-center" id="time_period_header_{{$day}}_{{$clinic->clinicId}}">'+
                                              '<h5 class="custom-timetitle">'+periodHeader[index]+'</h5>'+
                                            '</div>'
                                    );

                                    $(`#time_period_section_${day}_${clinicId}`).append(
                                        `<div class="col-sm-1" style="width: 9%;">
                                            <input type="text" name="${periodStart}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[0]}" disabled/>
                                            <div class="invalid-feedback" id="${periodStart}_error"></div>
                                        </div>
                                        <label for="flatpickr-time-all" class="col-sm-1 col-form-label" style="width: auto;">To</label>
                                        <div class="col-sm-1" style="width: 9%;">
                                            <input type="text" name="${periodEnd}" class="form-control timepicker" placeholder="HH:MM AM/PM" value="${times[1]}" disabled/>
                                        </div>
                                        <div class="col-sm-1 form-check form-switch mb-2">
                                            <input class="form-check-input timepicker-toggle" type="checkbox" id="checkbox${index + 1}_${day}_${clinicId}" />
                                        </div>`
                                    );
                                    $(`#time_slot_count_${clinicId}`).val(index + 1);
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
                });
            }
        }
    });
}


function updateFirstPeriodStartTimepickers(time, timeSlot) {
  // Get the clinic ID from the hidden input
  var clinicId = $("#doctor_id").val();

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
  var clinicId = $("#doctor_id").val();
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

  // Define default time values if needed
  var defaultStartTime = '08:00 AM';
  var defaultEndTime = '05:00 PM';

  // Handle the first checkbox
  if ($currentCheckbox.attr('id').startsWith('checkbox_')) {
    // $row.find('input[name^="first_period_start_"]').prop('disabled', !isChecked).val(isChecked ? defaultStartTime : '');

      $row.find('input[name^="first_period_start_"]').prop('disabled', !isChecked).val();
      $row.find('input[name^="first_period_end_"]').prop('disabled', !isChecked).val();
  }

  // Handle the second checkbox
  if ($currentCheckbox.attr('id').startsWith('checkbox2_')) {
      $row.find('input[name^="second_period_start_"]').prop('disabled', !isChecked).val();
      $row.find('input[name^="second_period_end_"]').prop('disabled', !isChecked).val();
  }

  // Handle the third checkbox
  if ($currentCheckbox.attr('id').startsWith('checkbox3_')) {
      $row.find('input[name^="third_period_start_"]').prop('disabled', !isChecked).val();
      $row.find('input[name^="third_period_end_"]').prop('disabled', !isChecked).val();
  }

  // Handle the fourth checkbox
  if ($currentCheckbox.attr('id').startsWith('checkbox4_')) {
      $row.find('input[name^="fourth_period_start_"]').prop('disabled', !isChecked).val();
      $row.find('input[name^="fourth_period_end_"]').prop('disabled', !isChecked).val();
  }

  // Handle the fifth checkbox
  if ($currentCheckbox.attr('id').startsWith('checkbox5_')) {
      $row.find('input[name^="fifth_period_start_"]').prop('disabled', !isChecked).val();
      $row.find('input[name^="fifth_period_end_"]').prop('disabled', !isChecked).val();
  }
  } else {
      var clinicId = checkboxId.split("_").pop();
      // console.log(checkboxId);
      // console.log(checkboxId);

      updateOtherCheckboxes(clinicId, isChecked, periodCnt, checkboxId);
  }

  $(".save-btn").prop("disabled", false);
  checkTimePickers();
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
  var mainClinicId = $("#clinic_id_"+clinicId).val();
  if (parseInt($("#time_slot_count_"+clinicId).val()) === 2) {
      var periodStart = "third_period_start_";
      var periodEnd = "third_period_end_";
      var periodHeader = "Third Period";
  } else if (parseInt($("#time_slot_count_"+clinicId).val()) === 3) {
      var periodStart = "fourth_period_start_";
      var periodEnd = "fourth_period_end_";
      var periodHeader = "Fourth Period";
  } else if (parseInt($("#time_slot_count_"+clinicId).val()) === 4) {
      var periodStart = "fifth_period_start_";
      var periodEnd = "fifth_period_end_";
      var periodHeader = "Fifth Period";
  } else if (parseInt($("#time_slot_count_"+clinicId).val()) === 5) {
      var periodStart = "sixth_period_start_";
      var periodEnd = "sixth_period_end_";
      var periodHeader = "Sixth Period";
  }
  var periodCount = parseInt($("#time_slot_count_"+clinicId).val()) + 1;

  // var periodCount = parseInt($(".time_slot_count").val()) + 1;
  // $(".period_count").val(periodCount);
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
      if (parseInt($("#time_slot_count_"+clinicId).val()) === 3) {
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
          '<div class="col-sm-1" style="width: 9%;">' +
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
              '<div class="col-sm-1" style="width: 9%;">' +
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
  });

  // $(".time_slot_count").val(parseInt($(".time_slot_count").val()) + 1);
  $("#time_slot_count_"+clinicId).val(periodCount);

  // Reinitialize flatpickr or any other timepicker
  $(".timepicker").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
  });
});

function checkTimePickers() {
    // Array of names to exclude from the check
    const notthisNames = ['start_time', 'end_time', 'appointmentTime'];
    
    // Check if all time pickers are disabled
    let allDisabled = true;

    $(".timepicker").each(function () {
        const timePickerName = $(this).attr("name");

        // Check if the time picker's name is not in the exclusion array
        if (!notthisNames.includes(timePickerName)) {
            // Check if the time picker is not disabled
            if (!$(this).prop("disabled")) {
                allDisabled = false; // Found an enabled time picker, set flag to false
                return false; // Break the loop since we found an enabled time picker
            }
        }
    });

    // Enable or disable the save button based on the status of time pickers
    if (allDisabled) {
        $(".save-btn").prop("disabled", true);
    } else {
        $(".save-btn").prop("disabled", false);
    }
}
