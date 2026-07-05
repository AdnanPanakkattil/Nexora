$(document).ready(function () {
  $("#third_party_main_menu").addClass("active open menu-item-animating");
  $("#loyalty_sub_menu").addClass("active");

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });



  const statusObj = {
    Active: { title: 'Active', class: 'bg-label-success' },
    Inactive: { title: 'Inactive', class: 'bg-label-secondary' }
  };

  const dt_loyalty_table = $('.datatables-loyalty');

  if (dt_loyalty_table.length) {
    var dt_loyalty = dt_loyalty_table.DataTable({
      ajax: {
        url: BASE_URL + "/thirdparty/loyalty-lists",
        // data: function (d) {
        //     d.clinicId = $("#clinicId").val();
        //     d.startDate = $(".start_date").val();
        //     d.endDate = $(".end_date").val();
        //     d.payment = $(".payment").val();
        // },
      },

      columns: [
        { data: null }, // control
        { data: null }, // checkbox
        { data: 'appLoyaltyId' },
        { data: 'appUserId' },
        { data: 'affectedId' },
        { data: 'amountPaid' },
        { data: 'points' },
        { data: 'type' },
        { data: null } // actions
      ],

      columnDefs: [
        {
          className: 'control',
          orderable: false,
          searchable: false,
          responsivePriority: 2,
          targets: 0,
          render: () => ''
        },
        {
          targets: 1,
          orderable: false,
          searchable: false,
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          },
          render: () => '<input type="checkbox" class="dt-checkboxes form-check-input">'
        },
        {
          targets: 2,
          title: 'appLoyaltyId',
          render: (data, type, full) => `<span class="fw-semibold">#${full.appLoyaltyId}</span>`
        },
        {
          targets: 3,
          title: 'appUserId',
          render: (data) => `<span>${data}</span>`
        },
        {
          targets: 4,
          title: 'affectedId',
          render: (data) => (data ? data : '<span class="text-muted">—</span>')
        },
        {
          targets: 5,
          title: 'amountPaid',
          render: (data) => {
            let amount = parseFloat(data.replace(/,/g, '')) || 0;
            return `<span class="fw-semibold text-success">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>`;
          }
        },
        {
          targets: 6,
          title: 'points',
          render: (data) => `<span class="fw-semibold text-warning">${data}</span>`
        },
        {
          targets: 7,
          title: 'type',
          render: (data) => `<span class="badge bg-label-primary">${data}</span>`
        },
        {
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (_, __, full) {
            return `
            <div class="d-flex justify-content-sm-start align-items-sm-center">
              <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow"
                      data-bs-toggle="dropdown">
                <i class="ti ti-dots-vertical"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end m-0">
                <a href="javascript:void(0);" class="dropdown-item view-record" data-id="${full.appLoyaltyId}">View</a>
                <a href="javascript:void(0);" class="dropdown-item delete-record text-danger" data-id="${full.appLoyaltyId}">Delete</a>
              </div>
            </div>`;
          }
        }
      ],

      order: [[2, 'asc']],
      lengthMenu: [
        [5, 10, 15, 25, 50],
        ['5 rows', '10 rows', '15 rows', '25 rows', '50 rows']
      ],
      pageLength: 5,
      dom:
        '<"card-header d-flex flex-wrap justify-content-between align-items-center"' +
        '<"dt-heading text-uppercase fw-bold fs-5 mb-2 mb-md-0">' +
        '<"d-flex align-items-center gap-2 flex-wrap dt-controls"f<"dt-settings-button">>>' +
        "t" +
        '<"row mx-2 mt-3"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      language: {
        search: '',
        searchPlaceholder: 'Search Loyalty...',
        lengthMenu: '_MENU_ entries per page',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        paginate: {
          next: '<i class="ti ti-chevron-right ti-sm"></i>',
          previous: '<i class="ti ti-chevron-left ti-sm"></i>'
        }
      },
      responsive: true
    });

    // Set heading text beside search box
    $('.dt-heading').text('user loyalty');

    // Settings button beside search
    $(".dt-settings-button").html(`
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#settingsModal" id="settings_btn">
      <i class="ti ti-settings me-1"></i>
    </button>
  `);

    // Adjust layout spacing
    $('.dataTables_length').addClass('ms-n2');
    $('.dataTables_filter').addClass('mt-0 mb-0 mb-md-0');

    // Adjust search input style
    setTimeout(() => {
      $('.dataTables_filter .form-control').removeClass('form-control-sm');
      $('.dataTables_length .form-select').removeClass('form-select-sm');
    }, 300);

    // ✅ View record click
    $('.datatables-loyalty tbody').on('click', '.view-record', function () {
      const rowData = dt_loyalty.row($(this).parents('tr')).data();
      window.location.href = `${BASE_URL}/thirdparty/loyalty/view/${rowData.appLoyaltyId}`;
    });
    // $('.datatables-loyalty tbody').on('click', '.delete-record', function () {
    //   const rowData = dt_loyalty.row($(this).parents('tr')).data();
    //   if (confirm(`Delete record #${rowData.appLoyaltyId}?`)) {
    //     // Optional AJAX delete (Laravel route)
    //     // $.ajax({
    //     //   url: `/loyalty/delete/${rowData.appLoyaltyId}`,
    //     //   method: 'DELETE',
    //     //   headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    //     //   success: () => dt_loyalty.ajax.reload(),
    //     //   error: () => alert('Failed to delete record')
    //     // });
    //   }
    // });
  }


  // loyalty delete 

  $('.datatables-loyalty tbody').on('click', '.delete-record', function () {
    const rowData = dt_loyalty.row($(this).parents('tr')).data();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: {
        confirmButton: "btn btn-primary waves-effect waves-light",
        cancelButton: "btn btn-danger waves-effect waves-light",
      },
      buttonsStyling: false,
    }).then(function (result) {

      if (result.isConfirmed) {

        $.ajax({
          url: BASE_URL + "/thirdparty/loyalty/delete/" + rowData.appLoyaltyId,
          type: "DELETE",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          success: function (response) {

            if (response.status === true) {

              dt_loyalty.ajax.reload(null, false);

              Swal.fire({
                icon: "success",
                text: response.message,
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });

            } else {
              Swal.fire({
                icon: "error",
                text: response.message,
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              });
            }
          }
        });
      }
    });
  });


  // const dt_mission_table = $(".datatables-missionz");

  // if (dt_mission_table.length) {
  //   var dt_mission = dt_mission_table.DataTable({
  //     ajax: assetsPath + "json/loyalty-mission.json",
  //     columns: [
  //       { data: "id" },
  //       { data: "mission_id" },
  //       { data: "title" },
  //       { data: "points" },
  //       { data: "type" },
  //       { data: "progress" },
  //       { data: "status" },
  //       { data: null },
  //     ],
  //     columnDefs: [
  //       {
  //         targets: 0,
  //         orderable: false,
  //         searchable: false,
  //         checkboxes: {
  //           selectAllRender:
  //             '<input type="checkbox" class="form-check-input">',
  //         },
  //         render: () =>
  //           '<input type="checkbox" class="dt-checkboxes form-check-input">',
  //       },
  //       {
  //         targets: 1,
  //         title: "Mission ID",
  //         render: (data) =>
  //           `<span class="fw-semibold">#${data}</span>`,
  //       },
  //       {
  //         targets: 3,
  //         title: "Points",
  //         render: (data) =>
  //           `<span class="fw-semibold text-warning">${data}</span>`,
  //       },
  //       {
  //         targets: 4,
  //         title: "Type",
  //         render: (data) => {
  //           const typeColors = {
  //             Appointment: "bg-label-info",
  //             Referral: "bg-label-primary",
  //             Default: "bg-label-secondary",
  //           };
  //           const typeClass =
  //             typeColors[data] || typeColors.Default;
  //           return `<span class="badge ${typeClass}">${data}</span>`;
  //         },
  //       },
  //       {
  //         targets: 6,
  //         title: "Status",
  //         render: (data) => {
  //           const status = statusObj[data] || {
  //             title: data,
  //             class: "bg-label-secondary",
  //           };
  //           return `<span class="badge px-2 ${status.class}">${status.title}</span>`;
  //         },
  //       },
  //       {
  //         targets: -1,
  //         title: "Actions",
  //         searchable: false,
  //         orderable: false,
  //         render: function () {
  //           return `
  //             <div class="d-flex justify-content-sm-start align-items-sm-center">
  //               <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow"
  //                       data-bs-toggle="dropdown">
  //                 <i class="ti ti-dots-vertical"></i>
  //               </button>
  //               <div class="dropdown-menu dropdown-menu-end m-0">
  //                 <a href="javascript:void(0);" class="dropdown-item edit-record">Edit</a>
  //                 <a href="javascript:void(0);" class="dropdown-item delete-record text-danger">Delete</a>
  //               </div>
  //             </div>`;
  //         },
  //       },
  //     ],
  //     order: [[1, "asc"]],
  //     lengthMenu: [
  //       [5, 10, 15, 25, 50],
  //       ["5 rows", "10 rows", "15 rows", "25 rows", "50 rows"],
  //     ],
  //     pageLength: 5,
  //     dom:
  //       '<"card-header d-flex flex-wrap justify-content-between align-items-center"' +
  //       '<"dt-heading text-uppercase fw-bold fs-5 mb-2 mb-md-0">' +
  //       '<"d-flex align-items-center gap-2 flex-wrap dt-controls"f<"dt-add-button">>>' +
  //       "t" +
  //       '<"row mx-2 mt-3"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
  //     language: {
  //       search: "",
  //       searchPlaceholder: "Search Mission...",
  //       lengthMenu: "_MENU_ entries per page",
  //       info: "Showing _START_ to _END_ of _TOTAL_ entries",
  //       paginate: {
  //         next: '<i class="ti ti-chevron-right ti-sm"></i>',
  //         previous: '<i class="ti ti-chevron-left ti-sm"></i>',
  //       },
  //     },
  //     responsive: true,
  //   });

  //   // $(".dt-heading").text("Mission Overview");
  //   $(".dt-add-button").html(`
  //     <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMissionModal">
  //       <i class="ti ti-plus me-1"></i>Add Mission
  //     </button>
  //   `);

  //   $(".dataTables_filter").addClass("d-flex align-items-center mb-0 mt-0");
  //   $(".dataTables_filter input")
  //     .addClass("form-control ms-2")
  //     .attr("placeholder", "Search Mission...");
  //   setTimeout(() => {
  //     $(".dataTables_filter .form-control").removeClass(
  //       "form-control-sm"
  //     );
  //     $(".dataTables_length .form-select").removeClass("form-select-sm");
  //   }, 300);

  //   // ✅ DELETE record
  //   $(".datatables-missionz tbody").on(
  //     "click",
  //     ".delete-record",
  //     function () {
  //       dt_mission.row($(this).parents("tr")).remove().draw();
  //     }
  //   );

  //   // ✅ ADD record
  //   $("#addMissionForm").on("submit", function (e) {
  //     e.preventDefault();
  //     const formData = {
  //       id: dt_mission.data().count() + 1,
  //       mission_id: $("#missionId").val(),
  //       title: $("#missionTitle").val(),
  //       points: $("#missionPoints").val(),
  //       type: $("#missionType").val(),
  //       progress: $("#missionProgress").val(),
  //       status: $("#missionStatus").val(),
  //     };
  //     dt_mission.row.add(formData).draw();
  //     $("#addMissionModal").modal("hide");
  //     this.reset();
  //   });

  //   // ✅ EDIT record (Open Modal + Populate Fields)
  //   let currentEditRow;
  //   $(".datatables-missionz tbody").on(
  //     "click",
  //     ".edit-record",
  //     function () {
  //       currentEditRow = dt_mission.row($(this).parents("tr"));
  //       const rowData = currentEditRow.data();

  //       // Populate modal form
  //       $("#editMissionId").val(rowData.mission_id);
  //       $("#editMissionTitle").val(rowData.title);
  //       $("#editMissionPoints").val(rowData.points);
  //       $("#editMissionType").val(rowData.type);
  //       $("#editMissionProgress").val(rowData.progress);
  //       $("#editMissionStatus").val(rowData.status);

  //       // Show modal
  //       $("#editMissionModal").modal("show");
  //     }
  //   );

  //   // ✅ Update row on edit submit
  //   $("#editMissionForm").on("submit", function (e) {
  //     e.preventDefault();
  //     const updatedData = {
  //       ...currentEditRow.data(),
  //       mission_id: $("#editMissionId").val(),
  //       title: $("#editMissionTitle").val(),
  //       points: $("#editMissionPoints").val(),
  //       type: $("#editMissionType").val(),
  //       progress: $("#editMissionProgress").val(),
  //       status: $("#editMissionStatus").val(),
  //     };

  //     currentEditRow.data(updatedData).draw();
  //     $("#editMissionModal").modal("hide");
  //   });
  // }




  // const $table = $section.find(".datatables-reward");

  // if ($table.length) {
  //   const dt_reward = $table.DataTable({
  //     ajax: assetsPath + "json/loyalty-voucher.json",
  //     columns: [
  //       { data: "id" },
  //       { data: "reward_id" },
  //       { data: "title" },
  //       { data: "points_required" },
  //       { data: "tier" },
  //       { data: "status" },
  //       { data: null },
  //     ],
  //     columnDefs: [
  //       {
  //         targets: 0,
  //         orderable: false,
  //         searchable: false,
  //         checkboxes: {
  //           selectAllRender:
  //             '<input type="checkbox" class="form-check-input">',
  //         },
  //         render: () =>
  //           '<input type="checkbox" class="dt-checkboxes form-check-input">',
  //       },
  //       {
  //         targets: 1,
  //         render: (data) =>
  //           `<span class="fw-semibold">#${data}</span>`,
  //       },
  //       {
  //         targets: 3,
  //         render: (data) =>
  //           `<span class="fw-semibold text-primary">${data}</span>`,
  //       },
  //       {
  //         targets: 4,
  //         render: (data) => {
  //           const color = tierColors[data] || tierColors.Default;
  //           return `<span class="badge ${color}">${data}</span>`;
  //         },
  //       },
  //       {
  //         targets: 5,
  //         render: (data) => {
  //           const status = statusObj[data] || {
  //             title: data,
  //             class: "bg-label-secondary",
  //           };
  //           return `<span class="badge px-2 ${status.class}">${status.title}</span>`;
  //         },
  //       },
  //       {
  //         targets: -1,
  //         title: "Actions",
  //         searchable: false,
  //         orderable: false,
  //         render: function () {
  //           return `
  //             <div class="d-flex justify-content-sm-start align-items-sm-center">
  //               <button class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow"
  //                       data-bs-toggle="dropdown">
  //                 <i class="ti ti-dots-vertical"></i>
  //               </button>
  //               <div class="dropdown-menu dropdown-menu-end m-0">
  //                 <a href="javascript:void(0);" class="dropdown-item edit-record">Edit</a>
  //                 <a href="javascript:void(0);" class="dropdown-item delete-record text-danger">Delete</a>
  //               </div>
  //             </div>`;
  //         },
  //       },
  //     ],
  //     order: [[1, "asc"]],
  //     lengthMenu: [
  //       [5, 10, 15, 25, 50],
  //       ["5 rows", "10 rows", "15 rows", "25 rows", "50 rows"],
  //     ],
  //     pageLength: 5,
  //     dom:
  //       '<"card-header d-flex flex-wrap justify-content-between align-items-center"' +
  //       '<"dt-heading text-uppercase fw-bold fs-5 mb-2 mb-md-0">' +
  //       '<"d-flex align-items-center gap-2 flex-wrap dt-controls"f<"dt-add-button">>>' +
  //       "t" +
  //       '<"row mx-2 mt-3"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
  //     language: {
  //       search: "",
  //       searchPlaceholder: "Search Reward...",
  //       lengthMenu: "_MENU_ entries per page",
  //       info: "Showing _START_ to _END_ of _TOTAL_ entries",
  //       paginate: {
  //         next: '<i class="ti ti-chevron-right ti-sm"></i>',
  //         previous: '<i class="ti ti-chevron-left ti-sm"></i>',
  //       },
  //     },
  //     responsive: true,
  //   });

  //   // Section Header + Add Button
  //   $section.find(".dt-heading").text("Reward Management");
  //   $section.find(".dt-add-button").html(`
  //     <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRewardModal">
  //       <i class="ti ti-plus me-1"></i>Add Reward
  //     </button>
  //   `);

  //   // Filter styling
  //   $section
  //     .find(".dataTables_filter")
  //     .addClass("d-flex align-items-center mb-0 mt-0");
  //   $section
  //     .find(".dataTables_filter input")
  //     .addClass("form-control ms-2")
  //     .attr("placeholder", "Search Reward...");
  //   setTimeout(() => {
  //     $section
  //       .find(".dataTables_filter .form-control")
  //       .removeClass("form-control-sm");
  //     $section
  //       .find(".dataTables_length .form-select")
  //       .removeClass("form-select-sm");
  //   }, 300);

  //   // DELETE record
  //   $table.on("click", ".delete-record", function () {
  //     dt_reward.row($(this).parents("tr")).remove().draw();
  //   });

  //   // ADD record
  //   $section.find("#addRewardForm").on("submit", function (e) {
  //     e.preventDefault();
  //     const formData = {
  //       id: dt_reward.data().count() + 1,
  //       reward_id: $("#rewardId").val(),
  //       title: $("#rewardTitle").val(),
  //       points_required: $("#rewardPoints").val(),
  //       tier: $("#rewardTier").val(),
  //       status: $("#rewardStatus").val(),
  //     };
  //     dt_reward.row.add(formData).draw();
  //     $("#addRewardModal").modal("hide");
  //     this.reset();
  //   });

  //   // EDIT record
  //   let currentEditRow;
  //   $table.on("click", ".edit-record", function () {
  //     currentEditRow = dt_reward.row($(this).parents("tr"));
  //     const rowData = currentEditRow.data();

  //     $("#editRewardId").val(rowData.reward_id);
  //     $("#editRewardTitle").val(rowData.title);
  //     $("#editRewardPoints").val(rowData.points_required);
  //     $("#editRewardTier").val(rowData.tier);
  //     $("#editRewardStatus").val(rowData.status);

  //     $("#editRewardModal").modal("show");
  //   });

  //   // UPDATE record
  //   $section.find("#editRewardForm").on("submit", function (e) {
  //     e.preventDefault();
  //     const updatedData = {
  //       ...currentEditRow.data(),
  //       reward_id: $("#editRewardId").val(),
  //       title: $("#editRewardTitle").val(),
  //       points_required: $("#editRewardPoints").val(),
  //       tier: $("#editRewardTier").val(),
  //       status: $("#editRewardStatus").val(),
  //     };
  //     currentEditRow.data(updatedData).draw();
  //     $("#editRewardModal").modal("hide");
  //   });
  // }


  $("#settings_btn").click(function (e) {
    e.preventDefault();

    $.ajax({
      url: BASE_URL + "/thirdparty/get-loyalty-settings",
      type: "GET",
      success: function (response) {

        if (response.status === true) {

          $('#gettingAmount').val(response.data.earning.loyaltyamount);
          $('#gettingPoints').val(response.data.earning.point);

          $('#redeemAmount').val(response.data.redeem.redeemamount);
          $('#redeemPoints').val(response.data.redeem.point);
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message || "Something went wrong!",
            icon: "error",
            customClass: { confirmButton: "btn btn-warning" },
          });
        }
      },

    });

  });

});

$("#save_settings").click(function (e) {
  e.preventDefault();

  let pointSettingsFormData = {
    gettingAmount: $("#gettingAmount").val(),
    gettingPoints: $("#gettingPoints").val(),
    redeemAmount: $("#redeemAmount").val(),
    redeemPoints: $("#redeemPoints").val(),
    _token: $('meta[name="csrf-token"]').attr("content")
  };
  $.ajax({
    url: BASE_URL + "/thirdparty/save-settings",
    type: "POST",
    data: pointSettingsFormData,
    success: function (response) {

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          text: response.message,
          icon: "success",
          customClass: { confirmButton: "btn btn-success" },
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || "Something went wrong!",
          icon: "error",
          customClass: { confirmButton: "btn btn-warning" },
        });
      }
    },

  });

});



