$(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#nurse_station_sub_menu").addClass("active");
  
    // CSRF token setup for AJAX requests
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });
  
    var roomTable = $('#room_table').DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: BASE_URL + "/room",
      },
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        { data: 'name_en', name: 'name_en' },
        { data: 'name_ar', name: 'name_ar' },
        { data: 'type', name: 'type' },
        { data: 'actions', name: 'actions', orderable: false, searchable: false },
      ],
      columnDefs: [
        {
          targets: 0,
          orderable: false,
          searchable: false
        }
      ]
    });
  
    // Add New Room Button
    $('#addNewRoomBtn').on('click', function () {
      $('.error-text').text('');
      $('#addRoomModal').modal('show');
      $('#department_id').val(''); // Reset hidden id
      $('#addNurseStationForm')[0].reset();
    });
  
    // Save or Update Room
    $('#addNurseStationForm').on('submit', function (e) {
      e.preventDefault();
  
      var formData = $(this).serialize();
      var roomId = $('#department_id').val();
      var ajaxUrl = roomId ? BASE_URL + "/update-room/" + roomId : BASE_URL + "/store-room"; // You will create these routes
      var method = roomId ? "PUT" : "POST";
  
      $.ajax({
        url: ajaxUrl,
        type: method,
        data: formData,
        success: function (response) {
          $('#addRoomModal').modal('hide');
          roomTable.ajax.reload(null, false);
          Swal.fire({
            icon: 'success',
            text: response.message,
            customClass: {
              confirmButton: 'btn btn-success waves-effect waves-light',
            },
          });
        },
        error: function (xhr) {
          $(".error-text").text('');
          if (xhr.status === 422) {
            var errors = xhr.responseJSON.errors;
            $.each(errors, function (key, value) {
              $("." + key + "_error").text(value[0]);
            });
          } else {
            console.error(xhr.responseText);
          }
        }
      });
    });
  
    // Edit Room
    roomTable.on('click', '.item-edit', function () {
      var editUrl = $(this).data('id');
  
      $.ajax({
        url: editUrl,
        type: "GET",
        success: function (response) {
          if (response.status === true) {
            $('#addRoomModal').modal('show');
            $('#department_id').val(response.data.roomId);
            $('#roomNameEn').val(response.data.name_en);
            $('#roomNameAr').val(response.data.name_ar);
            $('#type').val(response.data.type).trigger('change');
          }
        },
        error: function (xhr) {
          console.error(xhr.responseText);
        }
      });
    });

    $('#addRoomModal').on('hidden.bs.modal', function () {
      $('#addNurseStationForm')[0].reset(); 
      clearErrors();                       
      $('.error-text').text('');           
  });
  
    // Delete Room
    roomTable.on('click', '.item-delete', function () {
      var deleteUrl = $(this).data('id');
  
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this room?",
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
          $.ajax({
            url: deleteUrl,
            type: "DELETE",
            success: function (response) {
              if (response.status === true) {
                roomTable.ajax.reload(null, false);
                Swal.fire({
                  icon: "success",
                  text: "Room deleted successfully!",
                  customClass: {
                    confirmButton: "btn btn-success waves-effect waves-light",
                  },
                });
              }
            },
            error: function (xhr) {
              console.error(xhr.responseText);
            }
          });
        }
      });
    });
  
  });
  

  function clearErrors() {
    $(".invalid-feedback").remove();
    $(".is-invalid").removeClass("is-invalid");
}