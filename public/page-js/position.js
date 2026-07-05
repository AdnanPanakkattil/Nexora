$(function () {
  $("#settings_main_menu").addClass("active open menu-item-animating");
  $("#position_sub_menu").addClass("active");

  // CSRF token setup for AJAX requests
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  var positionTable = $('#position_table').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      url: BASE_URL + "/position",
      data: function(d) {
        d.type = 'position';  // Filter by type
      }
    },
    columns: [
      { data: 'employeesFeatureId', name: 'employeesFeatureId' },
      { data: 'name_en', name: 'name_en' },
      { data: 'name_ar', name: 'name_ar' },
      { data: 'actions', name: 'actions', orderable: false, searchable: false },
    ],
    columnDefs: [
      { 
        targets: 0,
        orderable: false,
        searchable: true
      }
    ]
  });

$('#addNewPositionBtn').on('click', function () {
    $('.error-text').text('');
    $('#addPositionForm')[0].reset();
    $('#addPositionForm').find('input, textarea, select').prop('disabled', false);
    $('#position_modal_header').text('Add Position');
    $('#position_modal_footer').show();
    $('#position_id').val('');
    $('input[name="type"]').val('position');
    $('#addPositionModal').modal('show');
});

  $('#addPositionForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      url: positionStoreUrl,
      type: "POST",
      data: $(this).serialize(),
      success: function (response) {
        $('#addPositionModal').modal('hide');
        positionTable.ajax.reload();
        Swal.fire({
          icon: 'success',
          text: 'Position added successfully!',
          customClass: {
            confirmButton: 'btn btn-success waves-effect waves-light',
          },
        });
        $('#addPositionForm')[0].reset();
      },
      error: function (xhr, status, error) {
        console.log("Error during submission: ", xhr.responseText);
        $(".error-text").text("");
        if (xhr.status === 422) {
          var errors = xhr.responseJSON.errors;
          $.each(errors, function (key, value) {
            $("." + key + "_error").text(value[0]);
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'An error occurred while adding position.',
            customClass: {
              confirmButton: 'btn btn-danger waves-effect waves-light',
            },
          });
        }
      }
    });
  });

  // Reset form on modal hide
  $('#addPositionModal').on('hidden.bs.modal', function () {
    $('#addPositionForm')[0].reset();
  });

positionTable.on("click", ".item-edit", function () {
    var editUrl = $(this).data("id");
    $(".error-text").text("");

    $("#loader-overlay").show(); 
    $.ajax({
        url: editUrl,
        method: "GET",
        success: function (response) {
            $("#loader-overlay").hide(); 
            if (response.status === true && response.data.type === "position") {
                $("#addPositionForm").find("input, textarea, select").prop("disabled", false);
                $("#position_modal_header").text("Edit Position");
                $("#position_modal_footer").show();
                $("#addPositionModal").modal("show");
                $("#position_id").val(response.data.employeesFeatureId);
                $("#positionNameEn").val(response.data.name_en);
                $("#positionNameAr").val(response.data.name_ar);
                $("input[name='type']").val("position");
            }
        },
        error: function (err) {
            $("#loader-overlay").hide();  
            console.error("Error fetching edit data:", err);
        },
    });
});

  positionTable.on("click", ".item-details", function () {
    var detailsUrl = $(this).data("id");

    $("#loader-overlay").show();  
    $.ajax({
        url: detailsUrl,
        method: "GET",
        success: function (response) {
            $("#loader-overlay").hide();  
            if (response.status === true) {
                $("#addPositionForm").find("input, textarea, select").prop("disabled", true);
                $("#position_modal_header").text("Position Details");
                $("#position_modal_footer").hide();
                $("#addPositionModal").modal("show");
                $("#position_id").val(response.data.employeesFeatureId);
                $("#positionNameEn").val(response.data.name_en);
                $("#positionNameAr").val(response.data.name_ar);
            }
        },
        error: function (err) {
            $("#loader-overlay").hide();  
            console.error("Error fetching details:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.responseJSON?.message ?? "An unexpected error occurred.",
                customClass: { confirmButton: "btn btn-danger waves-effect waves-light" },
            });
        },
    });
});

 $("#positionSaveBtn").click(function () {
    var formData = $("#addPositionForm").serialize();
    var employeesFeatureId = $("#position_id").val();
    var ajaxUrl = employeesFeatureId
        ? BASE_URL + "/update-position/" + employeesFeatureId
        : BASE_URL + "/position";
    var method = employeesFeatureId ? "PUT" : "POST";

    $("#loader-overlay").show(); 
    $.ajax({
        url: ajaxUrl,
        type: method,
        data: formData,
        success: function (response) {
            $("#loader-overlay").hide(); 
            if (response.status === true) {
                positionTable.ajax.reload(null, false);
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
                }).then(function () { location.reload(); });
            }
            $("#addPositionModal").modal("hide");
        },
        error: function (xhr) {
            $("#loader-overlay").hide(); 
            $(".error-text").text("");
            if (xhr.status === 422) {
                var errors = xhr.responseJSON.errors;
                $.each(errors, function (key, value) {
                    $("." + key + "_error").text(value[0]);
                });
            } else {
                console.error("Error:", xhr);
            }
        },
    });
});

  positionTable.on("click", ".item-delete", function () {
    var deleteUrl = $(this).data("id");
    Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this position?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
        customClass: {
            confirmButton: "btn btn-primary me-3 waves-effect waves-light",
            cancelButton: "btn btn-label-secondary waves-effect waves-light",
        },
        buttonsStyling: false,
    }).then(function (result) {
        if (result.value) {
            $("#loader-overlay").show(); 
            $.ajax({
                url: deleteUrl,
                method: "DELETE",
                success: function (response) {
                    $("#loader-overlay").hide(); 
                    if (response.status === true) {
                        positionTable.ajax.reload(null, false);
                        Swal.fire({
                            icon: "success",
                            text: "Position deleted successfully!",
                            customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
                        });
                    }
                },
                error: function (err) {
                    $("#loader-overlay").hide();
                    console.error("Error deleting position:", err);
                },
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: "Cancelled",
                text: "Position deletion cancelled.",
                icon: "error",
                customClass: { confirmButton: "btn btn-success waves-effect waves-light" },
            });
        }
    });
});

  document.getElementById('closebtn').addEventListener('click', function() {
    $('#addPositionModal').modal('hide');
});
});

$('#positionNameEn').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s&]/g, '');
});

$('#positionNameAr').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});