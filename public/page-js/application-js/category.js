$(document).ready(function () {
  $("#application_main_menu").addClass("active open menu-item-animating");
  $("#application_category_sub_menu").addClass("active");

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });

  var categoryTable = $('#category_table').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: BASE_URL + "/application/category",
        type: "GET"
    },
    order: [[4, 'asc']],
    columns: [
        {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
        { data: 'categoryName_en', name: 'categoryName_en' },
        { data: 'categoryName_ar', name: 'categoryName_ar' },
        { data: 'status', name: 'status', orderable: false, searchable: false },
        {
            data: 'OrderNo',
            name: 'OrderNo',
            orderable: true,
            searchable: false,
            render: function (data, type, row, meta) {
              var test = meta.row + meta.settings._iDisplayStart + 1;
                return `
                    <button type="button" class="btn btn-info increment-category" data-id="${row.categoryId}">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    ${meta.row + meta.settings._iDisplayStart + 1}
                    <button type="button" class="btn btn-info decrement-category" data-id="${row.categoryId}">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                `;
            }
        },
        { data: 'image', name: 'image', orderable: false, searchable: false },
        { data: 'actions', name: 'actions', orderable: false, searchable: false },
    ],
    columnDefs: [
        {
            targets: 0,
            orderable: false,
            searchable: false,
        }
    ]
});

$(document).on("click", ".increment-category", function () {
  var categoryId = $(this).attr("data-id");
  updateOrder(categoryId, "increment");
});

$(document).on("click", ".decrement-category", function () {
  var categoryId = $(this).attr("data-id");
  updateOrder(categoryId, "decrement");
});

function updateOrder(categoryId, action) {
  $.ajax({
      type: "POST",
      url: "/application/category/" + action,
      data: {
          categoryId: categoryId,
          _token: $('meta[name="csrf-token"]').attr("content"),
      },
      dataType: "json",
      success: function (response) {
          if (response.status) {
              var table = $('#category_table').DataTable();
              table.ajax.reload(null, false);
          } else {
              alert(response.message);
          }
      },
      error: function (xhr, status, error) {
          console.error('AJAX error:', error);
      }
  });
}


    


  $(document).on("change", ".toggle-status", function () {
    var categoryId = $(this).data("id");
    var isActive = $(this).prop("checked") ? 1 : 0;

    $.ajax({
        url: BASE_URL + "/application/category/status-update",
        type: "POST",
        data: {
            category_id: categoryId,
            is_active: isActive,
        },
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Status Updated!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false
            });
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Update Failed!",
                text: xhr.responseJSON.message || "Something went wrong.",
            });
        },
    });
});



  $('#category_table').on('click', '.item-delete', function (e) {
    e.preventDefault();
    var deleteUrl = $(this).data('id');

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        $("#loader-overlay").show();
        $.ajax({
          url: deleteUrl,
          type: 'DELETE',
          success: function (response) {
            $("#loader-overlay").hide();
            if (response.status) {
              Swal.fire({
                icon: "success",
                text: "Application category deleted successfully!",
                customClass: {
                  confirmButton: "btn btn-success waves-effect waves-light",
                },
              }).then(() => {
                categoryTable.ajax.reload();
              });
            }
          },
          error: function (err) {
            $("#loader-overlay").hide();
            console.error("Error deleting category:", err);
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Application category deletion cancelled.",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success waves-effect waves-light",
          },
        });
      }
    });
  });

  $('#addNewApplicationCategoryBtn').click(function () {
    $('.error-text').text('');
    $('#addCategoryForm')[0].reset();
    $('#category_id').val('');

$('#memberPhoto').val('');

$('#imagePreview').attr('src', '').addClass('d-none').hide();

    $('#addApplicationCategoryModal').modal('show');
  });

  $('#category_table').on('click', '.item-edit', function () {
    var categoryId = $(this).data('id');

    $.ajax({
      type: 'GET',
      url: BASE_URL + '/application/edit-category/' + categoryId,
      success: function (response) {
        if (response.status) {
          $('#category_id').val(response.category.id);
          $('#categoryName_en').val(response.category.name_en);
          $('#categoryName_ar').val(response.category.name_ar);
          $('#identification').val(response.category.identification);

          if (response.category.imagePath) {
            $('#imagePreview').attr('src', response.category.imagePath).removeClass('d-none').show();
          } else {
            $('#imagePreview').addClass('d-none').hide();
          }

          $('#addApplicationCategoryModal').modal('show');
        } else {
          Swal.fire('Error!', 'Category not found.', 'error');
        }
      },
      error: function (xhr) {
        Swal.fire('Error!', 'Unable to fetch application category details.', 'error');
      }
    });
  });


  $('#memberPhoto').change(function (event) {
    previewImage(event);
  });

  function previewImage(event) {
    var input = event.target;
    if (input.files && input.files[0]) {
        var fileType = input.files[0].type;
        var validTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!validTypes.includes(fileType)) {
            alert("Invalid image format. Allowed: JPG, JPEG, PNG, GIF.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function () {
            $('#imagePreview').attr('src', reader.result).removeClass('d-none').show();
        };
        reader.readAsDataURL(input.files[0]);
    }
}



  $('#CategorySaveBtn').on('click', function (e) {
    e.preventDefault();
    $('.error-text').text('');
  
    var formData = new FormData($('#addCategoryForm')[0]);
  
    var categoryId = $('#category_id').val();
    var url = categoryId ? BASE_URL + "/application/update-category/" + categoryId : BASE_URL + "/application/category";
  
    if (categoryId) {
      formData.append('_method', 'PUT');
    }
  
  
    var fileInput = $('#memberPhoto')[0].files[0];
    if (fileInput) {
      formData.append('memberPhoto', fileInput);
    }
  
    $("#loader-overlay").show();
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function (response) {
        $("#loader-overlay").hide();
        if (response.status === true) {
          Swal.fire({
            icon: "success",
            text: response.message,
            customClass: {
              confirmButton: "btn btn-success waves-effect waves-light",
            },
          }).then(() => {
            $('#addApplicationCategoryModal').modal('hide');
            categoryTable.ajax.reload();
  
            if (response.data.imagePath) {
              $('#imagePreview').attr('src', response.data.imagePath).removeClass('d-none').show();
            }
          });
  
        } else {
          Swal.fire({
            icon: "error",
            text: "Failed to save Application Category",
            customClass: {
              confirmButton: "btn btn-danger waves-effect waves-light",
            },
          });
        }
      },
      error: function (xhr) {
        $("#loader-overlay").hide();
        if (xhr.status === 422) {
          let errors = xhr.responseJSON.errors;
          if (errors.categoryName_en) {
            $('.categoryName_en_error').text(errors.categoryName_en[0]);
          }
          if (errors.categoryName_ar) {
            $('.categoryName_ar_error').text(errors.categoryName_ar[0]);
          }
        } else {
          Swal.fire("Error", "Something went wrong!", "error");
        }
        $("#loader-overlay").hide();
      }
    });
  });
  
  
  
  document.getElementById('closebtn').addEventListener('click', function () {
    $('#addApplicationCategoryModal').modal('hide');
    })
  });

$('#categoryName_en').on('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$('#categoryName_ar').on('input', function() {
    this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
});









