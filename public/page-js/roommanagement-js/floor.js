$(function () {
    $("#room_management_main_menu").addClass("active open menu-item-animating");
    $("#floor_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });
    $(function () {
        const treeDisplay = $("#display-floors");
        const floorListGroup = $("#floor-list-group");
        const roomList = $("#room-list");
        const nurseStationRoomDetails = $("#nurse-station-room-details");
        const roomDetailsView = $("#room-details-view");
        const floorRoomWrapper = $("#floor-room-wrapper");
        function expandTreeNode(nodeId) {
            if (treeDisplay.jstree(true)) {
                treeDisplay.jstree("open_node", nodeId);
                treeDisplay.jstree("select_node", nodeId);
                treeDisplay.jstree("_open_to", nodeId);
            }
        }
        loadFloorRoomManagement(7);
        $("#clinicId").val("7");
        $("#branchId").val("7");
        var floorTable = $("#floor_table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: BASE_URL + "/floor",
            },
            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    },
                },
                { data: "name_en", name: "name_en" },
                { data: "name_ar", name: "name_ar" },
                {
                    data: "actions",
                    name: "actions",
                    orderable: false,
                    searchable: false,
                },
            ],
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    searchable: false,
                },
            ],
        });

        $("#addNewFloorBtn").on("click", function () {
            $("#addFloorModal").modal("show");
            $("#addFloorForm")[0].reset();
        });

        $("#floorSaveBtn").click(function (e) {
            e.preventDefault();
            var floorId = $("#floorId").val();
            var formData = $("#addFloorForm").serialize();
            var ajaxUrl = "/roommanagement-floors-save";
            var ajaxType = "POST";
            if (floorId) {
                ajaxUrl = "/roommanagement-floors-update/" + floorId;
                ajaxType = "PUT";
            }
            $("#loader-overlay").show();
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: formData,
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: floorId
                                ? "Floor updated successfully!"
                                : "Floor added successfully!",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            $("#floor-modal").modal("hide");
                            var branchId = $("#branchId").val();
                            loadFloorRoomManagement(branchId);
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $("#loader-overlay").hide();
                    $(".error-text").text("");
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the floor.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
        });

        $("#roomTypeSaveBtn").click(function (e) {
            e.preventDefault();
            var nurseStationId = $("#stationId").val();
            var formData = $("#addRoomTypeNurseStationForm").serialize();
            ajaxUrl = "/add-new-room-in-nurse-station/" + nurseStationId;
            var ajaxType = "POST";
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: formData,
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: floorId
                                ? "Floor updated successfully!"
                                : "Floor added successfully!",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            $("#add-new-room-type").modal("hide");
                            let floorId = null;
                            const floorData =
                                $("#floor-list-group").data("floor-data");
                            if (floorData) {
                                for (const floor of floorData) {
                                    if (
                                        floor.nurse_station &&
                                        floor.nurse_station.length > 0
                                    ) {
                                        const station =
                                            floor.nurse_station.find(
                                                (s) =>
                                                    parseInt(
                                                        s.nurseStationId,
                                                    ) ===
                                                    parseInt(nurseStationId),
                                            );
                                        if (station) {
                                            floorId =
                                                floor.roomManagementFloorId;
                                            break;
                                        }
                                    }
                                }
                            }
                            refreshComponents({
                                floorTree: true,
                                specificFloorId: floorId,
                                specificNurseStationId: nurseStationId,
                            });
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $(".error-text").text("");
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the floor.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
        });

        function calculateRoomEnd() {
            const count = parseInt($("#roomCount").val());
            const start = parseInt($("#roomStart").val());
            if (!isNaN(count) && !isNaN(start)) {
                $("#roomEnd").val(start + count - 1);
                $("#roomEndDemo").val(start + count - 1);
            } else {
                $("#roomEnd").val("");
                $("#roomEndDemo").val(start + count - 1);
            }
        }

        $("#roomCount, #roomStart").on("input", calculateRoomEnd);

        $(document).on("click", ".jstree-anchor", function (e) {
            const node = $("#display-floors").jstree(true).get_node(this);
            if (node && node.children.length > 0) {
                $("#floor-room-wrapper").hide();
                $("#nurse-station-room-details").empty().hide();
                $("#room-details-view").hide();
                $("#floor-list-group").show();
                $("#floor-section").show();
            }
        });

        function loadFloorRoomManagement(clinicId) {
            $("#floor-room-wrapper").hide();
            $("#nurse-station-room-details").empty().hide();
            $("#room-details-view").hide();
            $("#floor-list-group").show();
            $("#floor-section").hide();
            $("#loader-overlay").show();
            $.ajax({
                url: "/get-floor-room-management",
                type: "GET",
                data: {
                    clinicId: clinicId,
                },
                success: function (response) {
                    $("#loader-overlay").hide();
                    console.log("new:", response.newroomManagementFloor);
                    $("#floor-section").show();
                    const providerSelect = $("#providerId");
                    providerSelect.empty();
                    $.each(response.providers, function (id, name) {
                        providerSelect.append(
                            `<option value="${id}">${name}</option>`,
                        );
                    });
                    providerSelect.select2({
                        placeholder: "Select providers",
                        allowClear: true,
                        dropdownParent: $("#nurse-station-modal"),
                    });
                    let treeHtml = "<ul>";
                    response.newroomManagementFloor.forEach((floor) => {
                        const floorName = floor.name_en || "Unnamed Floor";
                        const floorId = floor.roomManagementFloorId;
                        treeHtml += `<li id="floor-node-${floorId}" class="floor-item" data-jstree='{"icon" : "ti ti-building text-primary"}' data-floor-id="${floorId}">${floorName}<ul>`;
                        if (
                            floor.nurse_station &&
                            floor.nurse_station.length > 0
                        ) {
                            floor.nurse_station.forEach((station) => {
                                const stationName =
                                    station.name_en || "Unnamed Station";
                                const nurseStationId = station.nurseStationId;
                                treeHtml += `
                <li 
                  id="station-node-${nurseStationId}"
                  data-jstree='{"icon" : "ti ti-door text-warning"}'
                  class="nurse-station-item"
                  data-floor-id="${floorId}"
                  data-nurse-station-id="${nurseStationId}"
                >
                  ${stationName}
                  <ul>`;
                                if (
                                    station.nurse_station_details &&
                                    station.nurse_station_details.length > 0
                                ) {
                                    station.nurse_station_details.forEach(
                                        (detail) => {
                                            const roomTypeName =
                                                detail.room_management
                                                    ?.name_en ||
                                                "Unnamed Room Type";
                                            treeHtml += `
      <li 
        id="room-node-${detail.nurseStationRoomDetailsId}"
        data-jstree='{"icon" : "ti ti-bed text-info"}'
        class="room-type-detail"
        data-nurse-station-id="${nurseStationId}"
        data-room-type-id="${detail.roomManagementId}"
        data-room-details-id="${detail.nurseStationRoomDetailsId}"
      >
        ${roomTypeName}
      </li>`;
                                        },
                                    );
                                }
                                treeHtml += `</ul></li>`;
                            });
                        }
                        treeHtml += "</ul></li>";
                    });
                    treeHtml += "</ul>";
                    if ($("#display-floors").jstree(true)) {
                        $("#display-floors").jstree(true).destroy();
                    }
                    $("#display-floors").html(treeHtml);
                    $("#display-floors").jstree();
                    let html = "";
                    response.newroomManagementFloor.forEach((floor, index) => {
                        let floorName = floor.name_en || `Floor ${index + 1}`;
                        let floorId = floor.roomManagementFloorId;
                        html += `
              <a href="javascript:void(0);"
           class="list-group-item list-group-item-action d-flex justify-content-between floor-list-item"
            data-id="${floorId}" 
            data-name="${floorName}"
            data-floor-index="${index}">
          <div class="li-wrapper d-flex justify-content-start align-items-center">
            <div class="avatar avatar-sm me-4">
              <span class="avatar-initial rounded-circle bg-label-primary">
                <i class="ti ti-door"></i>
              </span>
            </div>
            <div class="list-content">
               <h6 class="mb-1">${floorName}</h6>
            </div>
          </div>
           <div class="d-flex align-items-center gap-2">
       <button type="button" class="avatar avatar-sm btn p-0 btn-edit-floor" aria-label="Edit Floor" data-action="edit" data-id="${floorId}">
                      <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
                          <i class="ti ti-edit"></i>
                      </span>
              </button>
              <button type="button" class="avatar avatar-sm btn p-0 btn-delete-floor" aria-label="Delete Floor" data-action="delete" data-id="${floorId}" id="delete-floor">
                <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
                    <i class="ti ti-trash"></i>
                </span>
              </button>
            </div>
        </a>
          `;
                    });
                    html += `
        <a href="javascript:void(0);" class="list-group-item list-group-item-action d-flex justify-content-between"
            id="addNewFloorBtn">
            <div class="li-wrapper d-flex justify-content-start align-items-center">
                <div class="avatar avatar-sm me-4">
                    <span class="avatar-initial rounded-circle bg-primary">
                        <i class="ti ti-circle-plus"></i>
                    </span>
                </div>
                <div class="list-content">
                    <h6 class="mb-1">Add New Floor</h6>
                </div>
            </div>
        </a>
        `;
                    $("#floor-list-group").html(html);
                    $("#floor-list-group").data(
                        "floor-data",
                        response.newroomManagementFloor,
                    );
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error("AJAX error:", xhr.responseText);
                },
            });
        }

        $("#nurseStationSaveBtn").click(function (e) {
            e.preventDefault();
            var nurseStationId = $("#nurseStationId").val();
            var formData = $("#addNurseStationForm").serialize();
            var ajaxUrl = "/roommanagement-nurse-station-save";
            var ajaxType = "POST";
            var formDataArray = $("#addNurseStationForm").serializeArray();
            var floorId = formDataArray.find(
                (obj) => obj.name === "roomManagementFloorId",
            );
            var floorId = floorId.value;
            if (nurseStationId) {
                ajaxUrl =
                    "/roommanagement-nurse-station-update/" + nurseStationId;
                ajaxType = "PUT";
            }
            $("#loader-overlay").show();
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: formData,
                success: function (response) {
                    console.log(response);
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: nurseStationId
                                ? "Nurse station updated successfully!"
                                : "Nurse station added successfully!",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            $("#nurse-station-modal").modal("hide");
                            refreshComponentsForNurseStation({
                                floorTree: true,
                                specificFloorId: floorId,
                                specificNurseStationId: nurseStationId,
                            });
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $(".error-text").text("");
                    $("#loader-overlay").hide();
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the floor.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
        });

        $(document).on("click", ".floor-list-item", function () {
            const floorId = $(this).data("id");
            if (treeDisplay.jstree(true)) {
                treeDisplay.find("li").each(function () {
                    if ($(this).data("floor-id") === floorId) {
                        expandTreeNode($(this).attr("id"));
                        return false;
                    }
                });
            }
            const floorIndex = $(this).data("floor-index");
            const floorData =
                $("#floor-list-group").data("floor-data")[floorIndex];
            console.log("Floor Data:", floorData);
            $("#floor-list-group").hide();
            $("#room-details-view").hide();
            $("#floor-room-wrapper").show();
            $("#floor-section").hide();
            $("#room-list").empty();
            $("#nurse-station-room-details").hide();
            let roomTypesHtml = `
    <div class="mt-3">
      <div class="list-group">
    `;
            if (floorData.nurse_station && floorData.nurse_station.length > 0) {
                floorData.nurse_station.forEach((station) => {
                    const stationName = station.name_en || "Unnamed Station";
                    const nurseStationId = station.nurseStationId;
                    roomTypesHtml += `
        <a href="javascript:void(0);"
           class="list-group-item list-group-item-action d-flex justify-content-between nurse-station-list-item"
           data-floor-id="${floorId}" 
           data-floor-index="${floorIndex}" 
           data-nurse-station-id="${nurseStationId}">
          <div class="li-wrapper d-flex justify-content-start align-items-center">
            <div class="avatar avatar-sm me-4">
              <span class="avatar-initial rounded-circle bg-label-warning">
                <i class="ti ti-door"></i>
              </span>
            </div>
            <div class="list-content">
              <h6 class=" mb-0">${stationName}</h6>
            </div>
          </div>
           <div class="d-flex align-items-center gap-2">
      <button type="button" class="avatar avatar-sm btn p-0 btn-edit-nurse-station" aria-label="Edit nurseStation" data-action="edit" data-id="${nurseStationId}"  data-floor-id="${floorId}">
   <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
      <i class="ti ti-edit"></i>
   </span>
</button>
      <button type="button" class="avatar avatar-sm btn p-0 btn-delete-nurse-station" aria-label="Delete nurseStation" data-action="delete" data-id="${nurseStationId}"  data-floor-id="${floorId}">
         <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
            <i class="ti ti-trash"></i>
         </span>
      </button>
   </div>
        </a>
        `;
                });
            } else {
                roomTypesHtml += `
      <div class="list-group-item">
        <p class="text-muted">No nurse stations found for this floor.</p>
      </div>
      `;
            }
            roomTypesHtml += `
    <a class="list-group-item list-group-item-action d-flex justify-content-between"
     id="nurse-station-modal-btn"
     data-floor-id="${floorId}">
     <div class="li-wrapper d-flex justify-content-start align-items-center">
         <div class="avatar avatar-sm me-4">
             <span class="avatar-initial rounded-circle bg-primary">
                 <i class="ti ti-circle-plus"></i>
             </span>
         </div>
         <div class="list-content">
             <h6 class="mb-1">Add New Nurse Station</h6>
         </div>
     </div>
    </a>
    </div>
    </div>
    `;
            $("#room-list").append(roomTypesHtml);
            $("#room-list").show();
        });

        $(document).on("click", ".btn-edit-floor", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#floor-modal").modal("show");
            $("#addFloorForm")[0].reset();
            $(".error-text").text("");
            const action = $(this).data("action");
            const floorId = $(this).data("id");
            var clinicId = $("#branchId").val();
            $("#floorId").val(floorId);
            $("#clinicId").val(clinicId);
            $("#loader-overlay").show();
            $.ajax({
                url: "/edit-floor/" + floorId,
                type: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        console.log(response.data.roomManagementIds);
                        $("#floorId").val(
                            response.data.roomManagementFloor
                                .roomManagementFloorId,
                        );
                        $("#floorNameEn").val(
                            response.data.roomManagementFloor.name_en,
                        );
                        $("#floorNameAr").val(
                            response.data.roomManagementFloor.name_ar,
                        );
                        $("#departmentDropdown").val(null).trigger("change");
                        $("#departmentDropdown")
                            .val(response.data.roomManagementIds)
                            .trigger("change");
                    }
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error(xhr.responseText);
                },
            });
        });

        $(document).on("click", ".btn-delete-floor", function (e) {
            e.stopPropagation();
            e.preventDefault();
            const action = $(this).data("action");
            const floorId = $(this).data("id");
            var clinicId = $("#branchId").val();
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this floor?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url: "/delete-floor/" + floorId,
                        type: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content",
                            ),
                        },
                        success: function (response) {
                            $("#loader-overlay").hide();
                            if (response.status === true) {
                                floorTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    text: "Floor deleted successfully!",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                }).then(function () {
                                    var branchId = $("#branchId").val();
                                    loadFloorRoomManagement(branchId);
                                });
                            }
                        },
                        error: function (xhr) {
                            $("#loader-overlay").hide();
                            console.error(xhr.responseText);
                            Swal.fire({
                                icon: "error",
                                text: "An error occurred while deleting the floor.",
                                customClass: {
                                    confirmButton:
                                        "btn btn-danger waves-effect waves-light",
                                },
                            });
                        },
                    });
                }
            });
        });

        $("#select-branch").on("change", function () {
            var clinicId = $(this).val();
            $("#clinicId").val(clinicId);
            $("#branchId").val(clinicId);
            console.log("Selected clinicId: " + clinicId);
            loadFloorRoomManagement(clinicId);
        });

        $(document).on("click", ".btn-edit-nurse-station", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#nurse-station-modal").modal("show");
            $(".error-text").text("");
            $("#providerId").val(null).trigger("change");
            $("#addNurseStationForm")[0].reset();
            const action = $(this).data("action");
            const nurseStationId = $(this).data("id");
            $("#nurseStationId").val(nurseStationId);
            $(".room-type-section").hide();
            const floorId = $(this).data("floor-id");
            $("#roomManagementFloorId").val(floorId);
            $("#loader-overlay").show();
            $.ajax({
                url: "/edit-nurse-station/" + nurseStationId,
                type: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    console.log(response.data);
                    $("#nurseStation_en").val(response.data.name_en);
                    $("#nurseStation_ar").val(response.data.name_ar);
                    let selectedIds = response.data.nurse_station_employees.map(
                        (item) => item.employeeId,
                    );
                    console.log(selectedIds);
                    $("#providerId").val(selectedIds).trigger("change");
                    let selectedRoomDetailsIds =
                        response.data.nurse_station_details.map(
                            (item) => item.roomManagementId,
                        );
                    console.log(selectedRoomDetailsIds);
                    $("#roomManagementId")
                        .val(selectedRoomDetailsIds)
                        .trigger("change");
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error(xhr.responseText);
                },
            });
        });

        $(document).on("click", ".btn-delete-nurse-station", function (e) {
            e.stopPropagation();
            e.preventDefault();
            const action = $(this).data("action");
            const nurseStationId = $(this).data("id");
            var clinicId = $("#branchId").val();
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this Nurse Station?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url: "/delete-nurse-station/" + nurseStationId,
                        type: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content",
                            ),
                        },
                        success: function (response) {
                            $("#loader-overlay").hide();
                            if (response.status === true) {
                                floorTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    text: "Nurse Station deleted successfully!",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                }).then(function () {
                                    var branchId = $("#branchId").val();
                                    loadFloorRoomManagement(branchId);
                                });
                            }
                        },
                        error: function (xhr) {
                            $("#loader-overlay").hide();
                            console.error(xhr.responseText);
                            Swal.fire({
                                icon: "error",
                                text: "An error occurred while deleting the floor.",
                                customClass: {
                                    confirmButton:
                                        "btn btn-danger waves-effect waves-light",
                                },
                            });
                        },
                    });
                }
            });
        });

        $(document).on("click", ".nurse-station-list-item", function () {
            const nurseStationId = parseInt($(this).data("nurse-station-id"));
            if (treeDisplay.jstree(true)) {
                expandTreeNode(`station-node-${nurseStationId}`);
            }
            const floorIndex = $(this).data("floor-index");
            const floorData =
                $("#floor-list-group").data("floor-data")[floorIndex];
            console.log("Clicked nurseStationId:", nurseStationId);
            console.log("Floor Data:", floorData);
            const selectedNurseStation = floorData.nurse_station.find(
                (station) =>
                    parseInt(station.nurseStationId) === nurseStationId,
            );
            console.log("Selected Station:", selectedNurseStation);
            $("#room-list").hide();
            $("#room-details-view").hide();
            $("#nurse-station-room-details").empty().show();
            if (
                selectedNurseStation &&
                selectedNurseStation.nurse_station_details &&
                selectedNurseStation.nurse_station_details.length > 0
            ) {
                let roomHtml = '<div class="list-group">';
                selectedNurseStation.nurse_station_details.forEach((detail) => {
                    const roomName =
                        detail.room_management?.name_en || "Unnamed Room";
                    const roomCount = detail.roomCount || 0;
                    const price = detail.price || 0;
                    const roomStart = detail.roomStart || "";
                    const roomEnd = detail.roomEnd || "";
                    const description = detail.description || "";
                    roomHtml += `
        <a href="javascript:void(0);"
   class="list-group-item list-group-item-action d-flex justify-content-between align-items-center view-room-details"
   data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
   data-room-management-id="${detail.roomManagementId}">
  <div class="d-flex align-items-center">
    <div class="avatar avatar-sm me-3">
      <span class="avatar-initial rounded-circle bg-label-info">
        <i class="ti ti-bed"></i>
      </span>
    </div>
    <div>
      <h6 class="mb-0">${roomName}</h6>
    </div>
  </div>
  <div class="d-flex align-items-center gap-2">
    <button type="button"
            class="avatar avatar-sm btn p-0 btn-edit-room"
            aria-label="Delete Room"
            title="Delete Room"
            data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
            data-room-management-id="${detail.roomManagementId}">
      <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
        <i class="ti ti-edit"></i>
      </span>
    </button>
    <button type="button"
            class="avatar avatar-sm btn p-0 btn-delete-room"
            aria-label="Delete Room"
            title="Delete Room"
            data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
            data-room-management-id="${detail.roomManagementId}">
      <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
        <i class="ti ti-trash"></i>
      </span>
    </button>
  </div>
</a>
        `;
                });
                roomHtml += "</div>";
                roomHtml += `
      <a class="list-group-item list-group-item-action d-flex justify-content-between add-new-roomType"
     data-nurse-station-id="${nurseStationId}">
     <div class="li-wrapper d-flex justify-content-start align-items-center">
         <div class="avatar avatar-sm me-4">
             <span class="avatar-initial rounded-circle bg-primary">
                 <i class="ti ti-circle-plus"></i>
             </span>
         </div>
         <div class="list-content">
             <h6 class="mb-1">Add New Room</h6>
         </div>
     </div>
    </a>
      `;
                $("#nurse-station-room-details").append(roomHtml);
            } else {
                $("#nurse-station-room-details").append(`
      <div class="alert alert-info">
        <div class="d-flex">
          <i class="ti ti-info-circle me-2 mt-1"></i>
          <div>No room details found for this nurse station.</div>
        </div>
      </div>
      <div class="mt-3">
        <button class="btn btn-primary add-room-details-btn" data-nurse-station-id="${nurseStationId}">
          <i class="ti ti-plus me-1"></i>Add Room Details
        </button>
      </div>
      `);
            }
        });

        $(document).on("click", "#roomDetails-btn", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#room-details-modal").modal("show");
            $("#addRoomDetailsForm")[0].reset();
            $(".error-text").text("");
            const detailsId = $(this).data("id");
            $("#nurseStationRoomDetailsId").val(detailsId);
            $("#loader-overlay").show();
            $.ajax({
                url: "/get-room-details/" + detailsId,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status) {
                        console.log(response.data.roomManagementFloorDetails);
                        $("#price").val(response.data.roomManagementFloorDetails.price ?? "");
                        $("#description").val(response.data.roomManagementFloorDetails.description ?? "");
                        $("#roomCount").val(response.data.roomManagementFloorDetails.roomCount ?? "");
                        $("#roomStart").val(response.data.roomManagementFloorDetails.roomStart ?? "");
                        $("#roomEnd").val(response.data.roomManagementFloorDetails.roomEnd ?? "");
                        $("#roomEndDemo").val(response.data.roomManagementFloorDetails.roomEnd ?? "");
                    }
                },
                error: function () {
                    $("#loader-overlay").hide();
                    console.log("Unable to fetch room details.");
                },
            });
        });

        $("#updateRoomDetails").click(function (e) {
            e.preventDefault();
            var formData = $("#editRoomDetailsForm").serialize();
            ajaxUrl = "/update-room-details";
            ajaxType = "PUT";
            $("#loader-overlay").show();
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: formData,
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: "Room details updated successfully",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            $("#room-edit-modal").modal("hide");
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $("#loader-overlay").hide();
                    $(".error-text").text("");
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the floor.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
        });

        $(document).on("click", ".btn-edit-room", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#room-edit-modal").modal("show");
            $("#editRoomDetailsForm")[0].reset();
            $(".error-text").text("");
            const action = $(this).data("action");
            const nurseStationRoomDetailsId = $(this).data(
                "nurse-station-details-id",
            );
            $("#nurseStationRoomDetailsIds").val(nurseStationRoomDetailsId);
            $("#loader-overlay").show();
            $.ajax({
                url: "/get-room-details/" + nurseStationRoomDetailsId,
                type: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    if (response.status === true) {
                        $("#price-edit").val(
                            response.data.roomManagementFloorDetails.price,
                        );
                        $("#description-edit").val(
                            response.data.roomManagementFloorDetails
                                .description,
                        );
                    }
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error(xhr.responseText);
                },
            });
        });

        $(document).on("click", ".add-new-roomType", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#add-new-room-type").modal("show");
            $("#addRoomTypeNurseStationForm")[0].reset();
            $(".error-text").text("");
            const nurseStationId = $(this).data("nurse-station-id");
            $("#stationId").val(nurseStationId);
            $("#loader-overlay").show();
            $.ajax({
                url: "/get-roomType/" + nurseStationId,
                type: "GET",
                success: function (response) {
                    $("#loader-overlay").hide();
                    console.log(response.data);
                    let rooms = response.data;
                    $("#availableRooms").empty();
                    rooms.forEach((room) => {
                        $("#availableRooms").append(
                            $("<option>", {
                                value: room.roomManagementId,
                                text: room.name_en,
                            }),
                        );
                    });
                    $("#availableRooms").select2({
                        dropdownParent: $("#add-new-room-type"),
                    });
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error(xhr.responseText);
                },
            });
        });

        $(document).on("click", ".btn-delete-room", function (e) {
            e.stopPropagation();
            e.preventDefault();
            const action = $(this).data("action");
            const nurseStationRoomDetailsId = $(this).data(
                "nurse-station-details-id",
            );
            const roomManagementId = $(this).data("room-management-id");
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this room?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    confirmButton:
                        "btn btn-primary me-3 waves-effect waves-light",
                    cancelButton:
                        "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    $("#loader-overlay").show();
                    $.ajax({
                        url:
                            "/delete-room-in-station/" +
                            nurseStationRoomDetailsId,
                        type: "DELETE",
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content",
                            ),
                        },
                        success: function (response) {
                            $("#loader-overlay").hide();
                            if (response.status === true) {
                                floorTable.ajax.reload(null, false);
                                Swal.fire({
                                    icon: "success",
                                    text: "Room deleted successfully!",
                                    customClass: {
                                        confirmButton:
                                            "btn btn-success waves-effect waves-light",
                                    },
                                }).then(function () {
                                    location.reload();
                                });
                            }
                        },
                        error: function (xhr) {
                            $("#loader-overlay").hide();
                            console.error(xhr.responseText);
                            Swal.fire({
                                icon: "error",
                                text: "An error occurred while deleting the floor.",
                                customClass: {
                                    confirmButton:
                                        "btn btn-danger waves-effect waves-light",
                                },
                            });
                        },
                    });
                }
            });
        });

        $(document).on("click", ".view-room-details", function () {
            const nurseStationDetailsId = $(this).data(
                "nurse-station-details-id",
            );
            const roomTypeId = $(this).data("room-management-id");
            if (treeDisplay.jstree(true)) {
                treeDisplay.find("li.room-type-detail").each(function () {
                    if (
                        $(this).data("room-details-id") ==
                            nurseStationDetailsId &&
                        $(this).data("room-type-id") == roomTypeId
                    ) {
                        expandTreeNode($(this).attr("id"));
                        return false;
                    }
                });
            }
            const roomManagementId = $(this).data("room-management-id");
            loadRoomDetails(nurseStationDetailsId, roomManagementId);
        });

        $(document).on("click", ".add-room-details-btn", function () {
            const nurseStationId = $(this).data("nurse-station-id");
            $("#nurseStationId").val(nurseStationId);
            $("#add-room-details-modal").modal("show");
        });

        $(document).on("click", "#nurse-station-modal-btn", function () {
            const floorId = $(this).data("floor-id");
            $(".room-type-section").show();
            $("#nurse-station-modal").modal("show");
            $("#nurseStationId").val("");
            $(".error-text").text("");
            $("#providerId").val(null).trigger("change");
            $("#roomManagementId").val(null).trigger("change");
            $("#addNurseStationForm")[0].reset();
            $("#roomManagementFloorId").val(floorId);
        });

        $(document).on("click", "#addNewFloorBtn", function () {
            $("#floor-modal").modal("show");
            $("#addFloorForm")[0].reset();
            $("#floorId").val("");
            $(".error-text").text("");
            var clinicId = $("#branchId").val();
            $("#clinicId").val(clinicId);
        });

        $(document).on(
            "select_node.jstree",
            "#display-floors",
            function (e, data) {
                const node = data.node;
                if (
                    $(node.li_attr).hasClass("jstree-leaf") === false &&
                    !$(node.li_attr).hasClass("nurse-station-item") &&
                    !$(node.li_attr).hasClass("room-type-detail")
                ) {
                    floorListGroup.show();
                    floorRoomWrapper.hide();
                    roomDetailsView.hide();
                    nurseStationRoomDetails.hide();
                    const floorId = $(node.li_attr).data("floor-id");
                    if (floorId) {
                        $(".floor-list-item").removeClass("active");
                        $(`.floor-list-item[data-id="${floorId}"]`).addClass(
                            "active",
                        );
                    }
                } else if ($(node.li_attr).hasClass("nurse-station-item")) {
                    const floorId = $(node.li_attr).data("floor-id");
                    const nurseStationId = $(node.li_attr).data(
                        "nurse-station-id",
                    );
                    if (floorId) {
                        const floorItem = $(
                            `.floor-list-item[data-id="${floorId}"]`,
                        );
                        if (floorItem.length) {
                            floorItem.trigger("click");
                            setTimeout(() => {
                                const nurseStationItem = $(
                                    `.nurse-station-list-item[data-nurse-station-id="${nurseStationId}"]`,
                                );
                                nurseStationItem.addClass("active");
                                if (nurseStationId) {
                                    nurseStationItem.trigger("click");
                                }
                            }, 100);
                        }
                    }
                } else if ($(node.li_attr).hasClass("room-type-detail")) {
                    const nurseStationId = $(node.li_attr).data(
                        "nurse-station-id",
                    );
                    const roomTypeId = $(node.li_attr).data("room-type-id");
                    const roomDetailsId = $(node.li_attr).data(
                        "room-details-id",
                    );
                    const parentNode = treeDisplay
                        .jstree(true)
                        .get_node(node.parent);
                    const floorId = $(parentNode.li_attr).data("floor-id");
                    if (floorId) {
                        const floorItem = $(
                            `.floor-list-item[data-id="${floorId}"]`,
                        );
                        floorItem.trigger("click");
                        setTimeout(() => {
                            const nurseStationItem = $(
                                `.nurse-station-list-item[data-nurse-station-id="${nurseStationId}"]`,
                            );
                            nurseStationItem.trigger("click");
                            if (roomDetailsId && roomTypeId) {
                                setTimeout(() => {
                                    $(
                                        `.view-room-details[data-nurse-station-details-id="${roomDetailsId}"][data-room-management-id="${roomTypeId}"]`,
                                    ).trigger("click");
                                }, 100);
                            }
                        }, 100);
                    }
                }
            },
        );

        function loadRoomDetails(nurseStationDetailsId, roomManagementId) {
            $("#loader-overlay").show();
            $.ajax({
                url: "/room-detail-clicked",
                method: "GET",
                data: {
                    nurseStationRoomDetailsId: nurseStationDetailsId,
                    roomManagementId: roomManagementId,
                },
                success: function (response) {
                    $("#loader-overlay").hide();
                    $("#floor-list-group").hide();
                    $("#room-list").hide();
                    $("#nurse-station-room-details").hide();
                    $("#room-details-view").empty().show();
                    $("#floor-room-wrapper").show();
                    $("#floor-section").hide();
                    const detail = response.nurseStationRoomDetails;
                    const roomList = response.roomList;
                    const roomManagement = response.roomManagement;
                    console.log(roomManagement);
                    if (!detail) {
                        $("#room-details-view").html(`
        <div class="alert alert-warning">
          <i class="ti ti-alert-triangle me-2"></i>
          Room details not found or could not be loaded.
        </div>
        <button class="btn btn-outline-secondary back-to-nurse-stations">
          <i class="ti ti-arrow-left me-1"></i>Back
        </button>
        `);
                        return;
                    }
                    let header = `
      <div class="list-group-item list-group-item-action">
        <div class="list-group-item d-flex justify-content-between">
          <div class="li-wrapper d-flex justify-content-start align-items-center">
            <div class="avatar avatar-sm me-4">
              <span class="avatar-initial rounded-circle bg-label-warning"><i class="ti ti-door"></i></span>
            </div>
            <div class="list-content">
              <h6 class="mb-1">${roomManagement.name_en || "Room Details"}</h6>
              <small class="text-muted">#${roomManagement.roomManagementId}</small>
            </div>
          </div>
<button type="button" class="btn p-0 d-flex justify-content-start align-items-center" id="roomDetails-btn"  data-id="${detail.nurseStationRoomDetailsId}">
  <div class="list-content d-flex flex-column text-start">
    <small class="mb-1">Add Room Details</small>
  </div>
  <div class="avatar avatar-sm ms-4">
    <span class="avatar-initial rounded-circle bg-label-primary">
      <i class="ti ti-circle-plus"></i>
    </span>
  </div>
</button>
        </div>
        <div class="accordion-body d-flex align-items-baseline flex-wrap">
          <table class="w-50 table table-sm table-borderless text-nowrap small">
            <tr><td>Room count :</td><td class="fw-medium text-heading">${detail.roomCount}</td></tr>
            <tr><td>Description :</td><td class="fw-medium text-heading">${detail.description}</td></tr>
          </table>
          <table class="w-50 table table-sm table-borderless text-nowrap small">
            <tr><td>Perhour Charge :</td><td class="fw-medium text-heading">${detail.price}</td></tr>
          </table>
        </div>
      `;
                    let roomsGrid = `
      <div class="mt-5 mb-5" style="zoom: 60%;">
        <div class="row g-6">
        ${
            roomList.some((room) => room.room_number)
                ? `<h4 class="card-title">${detail.room_management?.name_en || "Room"}</h4>`
                : ""
        }
          ${roomList
              .map(
                  (room) => `
            <div class="col-3">
           <div class="card h-100 ${room.is_active == 1 ? "bg-label-danger" : ""}">
                <div class="card-body p-4">
                 <div style="display: flex;justify-content: space-between;align-items: center;">
                   <p class="m-0">
           <span class="badge 
            ${
                room.is_booked == 1
                    ? "bg-warning"
                    : room.is_active == 0
                      ? "bg-success"
                      : "bg-danger"
            }">
            ${
                room.is_booked == 1
                    ? "Booked"
                    : room.is_active == 0
                      ? "Available"
                      : "Not available"
            }
          </span>
          </p>
                        <button type="button" class="btn rounded-pill btn-icon btn-label-dark settings-btn" data-room-id="${room.nurseStationRoomListId}">
                             <i class="ti ti-settings" style="font-size: 30px;"></i></button>
                              </div>
                  <div class="badge rounded ti-censub">
                    <img width="200" src="../../assets/img/Logo/Vipicu1.png" alt="Room Image">
                  </div>
                  <h6 class="card-subtitle mb-1">Room No:
                    <span class="text-heading">${room.room_number}</span>
                  </h6>
                  <h6 class="card-subtitle mb-1">Type of Room:
                    <span class="text-heading">${detail.room_management?.name_en || "Room"}</span>
                  </h6>
                  <h6 class="card-subtitle mb-1">Max Occupancy:
                    <span class="text-heading">${room.occupancy || 1} Patient</span>
                  </h6>
                  <h6 class="card-subtitle">Price:
                    <span class="text-heading">$${room.price}/day</span>
                  </h6>
                 <div class="d-grid gap-2 mt-3">
                  ${
                      room.is_booked == 0 && room.is_active == 0
                          ? `
                        <button class="btn btn-label-success w-100" type="button" data-bs-toggle="modal" data-bs-target="#addNewCCModal" data-room-id="${room.nurseStationRoomListId}">Book Now</button>
                        <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="modal" data-bs-target="#backDropModal" data-room-id="${room.nurseStationRoomListId}">View Details</button>
                        `
                          : `
                        <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="modal" data-bs-target="#backDropModal" data-room-id="${room.nurseStationRoomListId}">View Details</button>
                        `
                  }
                </div>
                </div>
              </div>
            </div>
          `,
              )
              .join("")}
        </div>
      </div>
       </div>
      `;
                    $("#room-details-view").html(header + roomsGrid);
                },
                error: function (xhr) {
                    $("#loader-overlay").hide();
                    console.error("Error on detail click:", xhr.responseText);
                    $("#room-details-view").html(`
      <div class="alert alert-danger">
        <i class="ti ti-alert-circle me-2"></i>
        Error loading room details: ${xhr.status} ${xhr.statusText}
      </div>
      <button class="btn btn-outline-secondary back-to-nurse-stations">
        <i class="ti ti-arrow-left me-1"></i>Back
      </button>
      `);
                },
            });
        }

        $("#settingsSaveBtn").click(function (e) {
            e.preventDefault();
            const nurseStationRoomListId = $("#nurseStationRoomListId").val();
            const isActive = $("input[name='customRadioTemp']:checked").val(); // 1 or 0
            const reason = $("#reason").val();
            const nurseStationRoomDetailsId = $(
                "#nurseStationRoomDetailsId-in-room",
            ).val();
            const roomManagementId = $("#roomManagementId-in-room").val();
            const payload = {
                nurseStationRoomListId: nurseStationRoomListId,
                is_active: isActive,
                reason: reason,
            };
            $.ajax({
                url: "/save-room-info",
                method: "POST",
                data: payload,
                success: function (response) {
                    Swal.fire({
                        icon: "success",
                        text: "Room status saved successfully!",
                        customClass: {
                            confirmButton:
                                "btn btn-success waves-effect waves-light",
                        },
                    }).then(function () {
                        $("#settings-modal").modal("hide");
                        loadRoomDetails(
                            nurseStationRoomDetailsId,
                            roomManagementId,
                        );
                    });
                },
                error: function (xhr, status, error) {
                    $(".error-text").text("");
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the room status.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
        });

        $(document).on("click", ".settings-btn", function (e) {
            $("#settingsForm")[0].reset();
            const roomListId = $(this).data("room-id");
            $("#nurseStationRoomListId").val(roomListId);
            $("#settings-modal").modal("show");
            $.ajax({
                url: "/get-room-info/" + roomListId,
                type: "GET",
                success: function (response) {
                    const room = response.data;
                    console.log(room);
                    const nurseStationRoomDetailsId =
                        room.room_details.nurseStationRoomDetailsId;
                    const roomManagementId =
                        room.room_details.room_management.roomManagementId;
                    $("#nurseStationRoomDetailsId-in-room").val(
                        nurseStationRoomDetailsId,
                    );
                    $("#roomManagementId-in-room").val(roomManagementId);
                    $("#reason").val(room.reason);
                    if (room.is_active == 0) {
                        $("#active").prop("checked", true);
                    } else {
                        $("#inactive").prop("checked", true);
                    }
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                },
            });
        });

        $(document).on("click", ".room-type-detail", function () {
            const roomManagementId = $(this).data("room-type-id");
            const nurseStationRoomDetailsId = $(this).data("room-details-id");
            loadRoomDetails(nurseStationRoomDetailsId, roomManagementId);
        });

        $("#saveRoomDetails").click(function (e) {
            e.preventDefault();
            var nurseStationDetailsId = $("#nurseStationRoomDetailsId").val();
            var formData = $("#addRoomDetailsForm").serialize();
            ajaxUrl = "/save-room-details/" + nurseStationDetailsId;
            ajaxType = "PUT";
            $.ajax({
                url: ajaxUrl,
                type: ajaxType,
                data: formData,
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            icon: "success",
                            text: floorId
                                ? "Floor updated successfully!"
                                : "Floor added successfully!",
                            customClass: {
                                confirmButton:
                                    "btn btn-success waves-effect waves-light",
                            },
                        }).then(function () {
                            $("#room-details-modal").modal("hide");
                            loadRoomDetails(
                                nurseStationDetailsId,
                                response.roomManagementId,
                            );
                        });
                    }
                },
                error: function (xhr, status, error) {
                    $(".error-text").text("");
                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        $.each(errors, function (key, value) {
                            $("." + key + "_error").text(value[0]);
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: "An error occurred while saving the floor.",
                            customClass: {
                                confirmButton:
                                    "btn btn-danger waves-effect waves-light",
                            },
                        });
                    }
                },
            });
            refreshComponents(nurseStationDetailsId);
        });

        $("#room-details-modal").on("hide.bs.modal", function () {
            document.activeElement.blur();
        });

        $(document).on("ready.jstree", "#display-floors", function () {
            if (floorRoomWrapper.is(":visible")) {
                if (roomDetailsView.is(":visible")) {
                } else if (nurseStationRoomDetails.is(":visible")) {
                } else if (roomList.is(":visible")) {
                }
            }
        });

        $(document).on("click", ".back-to-nurse-stations", function () {
            const nurseStationId = nurseStationRoomDetails
                .find(".nurse-station-list-item")
                .first()
                .data("nurse-station-id");
            if (nurseStationId) {
                expandTreeNode(`station-node-${nurseStationId}`);
            }
        });

        $(document).on(
            "click",
            ".btn-edit-floor, .btn-delete-floor",
            function (e) {
                e.stopPropagation();
            },
        );
    });
});

function refreshComponents(refreshOptions = {}) {
    const options = {
        floorTable: false,
        floorTree: false,
        roomList: false,
        nurseStationDetails: false,
        roomDetails: false,
        specificFloorId: null,
        specificNurseStationId: null,
        specificRoomDetailsId: null,
    };
    Object.assign(options, refreshOptions);
    const branchId = $("#branchId").val();
    if (options.floorTable) {
        $("#floor_table").DataTable().ajax.reload(null, false);
    }
    if (options.floorTree) {
        $("#loader-overlay").show();
        $.ajax({
            url: "/get-floor-room-management",
            type: "GET",
            data: { clinicId: branchId },
            success: function (response) {
                $("#loader-overlay").hide();
                $("#floor-list-group").data(
                    "floor-data",
                    response.newroomManagementFloor,
                );
                let treeHtml = buildTreeHtml(response.newroomManagementFloor);
                if ($("#display-floors").jstree(true)) {
                    $("#display-floors").jstree(true).destroy();
                }
                $("#display-floors").html(treeHtml);
                $("#display-floors").jstree();
                let floorListHtml = buildFloorListHtml(
                    response.newroomManagementFloor,
                );
                $("#floor-list-group").html(floorListHtml);
                if (options.specificFloorId) {
                    setTimeout(() => {
                        const floorElement = $(
                            `.floor-list-item[data-id="${options.specificFloorId}"]`,
                        );
                        if (floorElement.length > 0) {
                            floorElement.trigger("click");
                            if (options.specificNurseStationId) {
                                setTimeout(() => {
                                    const stationElement = $(
                                        `.nurse-station-list-item[data-nurse-station-id="${options.specificNurseStationId}"]`,
                                    );
                                    if (stationElement.length > 0) {
                                        stationElement.trigger("click");
                                        if (options.specificRoomDetailsId) {
                                            setTimeout(() => {
                                                const roomElement = $(
                                                    `.view-room-details[data-nurse-station-details-id="${options.specificRoomDetailsId}"]`,
                                                );
                                                if (roomElement.length > 0) {
                                                    roomElement.trigger(
                                                        "click",
                                                    );
                                                }
                                            }, 300);
                                        }
                                    }
                                }, 300);
                            }
                        }
                    }, 300);
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                console.error("Error refreshing floor data:", xhr.responseText);
            },
        });
    }
    if (options.roomList && options.specificFloorId) {
        refreshRoomList(options.specificFloorId);
    }
    if (options.nurseStationDetails && options.specificNurseStationId) {
        refreshNurseStationDetails(options.specificNurseStationId);
    }
}

function refreshComponentsForNurseStation(refreshOptions = {}) {
    const options = {
        floorTable: false,
        floorTree: false,
        roomList: false,
        nurseStationDetails: false,
        roomDetails: false,
        specificFloorId: null,
        specificNurseStationId: null,
        specificRoomDetailsId: null,
    };
    Object.assign(options, refreshOptions);
    const branchId = $("#branchId").val();
    if (options.floorTable) {
        $("#floor_table").DataTable().ajax.reload(null, false);
    }
    if (options.floorTree) {
        $("#loader-overlay").show();
        $.ajax({
            url: "/get-floor-room-management",
            type: "GET",
            data: { clinicId: branchId },
            success: function (response) {
                $("#loader-overlay").hide();
                $("#floor-list-group").data(
                    "floor-data",
                    response.newroomManagementFloor,
                );
                let treeHtml = buildTreeHtml(response.newroomManagementFloor);
                if ($("#display-floors").jstree(true)) {
                    $("#display-floors").jstree(true).destroy();
                }
                $("#display-floors").html(treeHtml);
                $("#display-floors").jstree();
                let floorListHtml = buildFloorListHtml(
                    response.newroomManagementFloor,
                );
                $("#floor-list-group").html(floorListHtml);
                if (options.specificFloorId) {
                    setTimeout(() => {
                        const floorElement = $(
                            `.floor-list-item[data-id="${options.specificFloorId}"]`,
                        );
                        if (floorElement.length > 0) {
                            floorElement.trigger("click");
                        }
                    }, 300);
                }
            },
            error: function (xhr) {
                $("#loader-overlay").hide();
                console.error("Error refreshing floor data:", xhr.responseText);
            },
        });
    }
    if (options.roomList && options.specificFloorId) {
        refreshRoomList(options.specificFloorId);
    }
    if (options.nurseStationDetails && options.specificNurseStationId) {
        refreshNurseStationDetails(options.specificNurseStationId);
    }
}

function buildTreeHtml(floorData) {
    let treeHtml = "<ul>";
    floorData.forEach((floor) => {
        const floorName = floor.name_en || "Unnamed Floor";
        const floorId = floor.roomManagementFloorId;
        treeHtml += `<li id="floor-node-${floorId}" class="floor-item" data-jstree='{"icon" : "ti ti-building text-primary"}' data-floor-id="${floorId}">${floorName}<ul>`;
        if (floor.nurse_station && floor.nurse_station.length > 0) {
            floor.nurse_station.forEach((station) => {
                const stationName = station.name_en || "Unnamed Station";
                const nurseStationId = station.nurseStationId;
                treeHtml += `
        <li 
          id="station-node-${nurseStationId}"
          data-jstree='{"icon" : "ti ti-door text-warning"}'
          class="nurse-station-item"
          data-floor-id="${floorId}"
          data-nurse-station-id="${nurseStationId}"
        >
          ${stationName}
          <ul>`;
                if (
                    station.nurse_station_details &&
                    station.nurse_station_details.length > 0
                ) {
                    station.nurse_station_details.forEach((detail) => {
                        const roomTypeName =
                            detail.room_management?.name_en ||
                            "Unnamed Room Type";
                        treeHtml += `
<li 
  id="room-node-${detail.nurseStationRoomDetailsId}"
  data-jstree='{"icon" : "ti ti-bed text-info"}'
  class="room-type-detail"
  data-nurse-station-id="${nurseStationId}"
  data-room-type-id="${detail.roomManagementId}"
  data-room-details-id="${detail.nurseStationRoomDetailsId}"
>
  ${roomTypeName}
</li>`;
                    });
                }
                treeHtml += `</ul></li>`;
            });
        }
        treeHtml += "</ul></li>";
    });
    treeHtml += "</ul>";
    return treeHtml;
}

function buildFloorListHtml(floorData) {
    let html = "";
    floorData.forEach((floor, index) => {
        let floorName = floor.name_en || `Floor ${index + 1}`;
        let floorId = floor.roomManagementFloorId;
        html += `
      <a href="javascript:void(0);"
   class="list-group-item list-group-item-action d-flex justify-content-between floor-list-item"
    data-id="${floorId}" 
    data-name="${floorName}"
    data-floor-index="${index}">
  <div class="li-wrapper d-flex justify-content-start align-items-center">
    <div class="avatar avatar-sm me-4">
      <span class="avatar-initial rounded-circle bg-label-primary">
        <i class="ti ti-door"></i>
      </span>
    </div>
    <div class="list-content">
       <h6 class="mb-1">${floorName}</h6>
    </div>
  </div>
   <div class="d-flex align-items-center gap-2">
<button type="button" class="avatar avatar-sm btn p-0 btn-edit-floor" aria-label="Edit Floor" data-action="edit" data-id="${floorId}">
              <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
                  <i class="ti ti-edit"></i>
              </span>
      </button>
      <button type="button" class="avatar avatar-sm btn p-0 btn-delete-floor" aria-label="Delete Floor" data-action="delete" data-id="${floorId}" id="delete-floor">
        <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
            <i class="ti ti-trash"></i>
        </span>
      </button>
    </div>
</a>
  `;
    });
    html += `
<a href="javascript:void(0);" class="list-group-item list-group-item-action d-flex justify-content-between"
    id="addNewFloorBtn">
    <div class="li-wrapper d-flex justify-content-start align-items-center">
        <div class="avatar avatar-sm me-4">
            <span class="avatar-initial rounded-circle bg-primary">
                <i class="ti ti-circle-plus"></i>
            </span>
        </div>
        <div class="list-content">
            <h6 class="mb-1">Add New Floor</h6>
        </div>
    </div>
</a>
`;
    return html;
}

function refreshRoomList(floorId) {
    const floorData = $("#floor-list-group").data("floor-data");
    const floorItem = $(`.floor-list-item[data-id="${floorId}"]`);
    const floorIndex = floorItem.data("floor-index");
    if (floorData && floorData[floorIndex]) {
        const floor = floorData[floorIndex];
        $("#room-list").empty();
        let roomTypesHtml = `
    <div class="mt-3">
      <div class="list-group">
    `;
        if (floor.nurse_station && floor.nurse_station.length > 0) {
            floor.nurse_station.forEach((station) => {
                const stationName = station.name_en || "Unnamed Station";
                const nurseStationId = station.nurseStationId;
                roomTypesHtml += `
        <a href="javascript:void(0);"
           class="list-group-item list-group-item-action d-flex justify-content-between nurse-station-list-item"
           data-floor-id="${floorId}" 
           data-floor-index="${floorIndex}" 
           data-nurse-station-id="${nurseStationId}">
          <div class="li-wrapper d-flex justify-content-start align-items-center">
            <div class="avatar avatar-sm me-4">
              <span class="avatar-initial rounded-circle bg-label-warning">
                <i class="ti ti-door"></i>
              </span>
            </div>
            <div class="list-content">
              <h6 class=" mb-0">${stationName}</h6>
            </div>
          </div>
           <div class="d-flex align-items-center gap-2">
      <button type="button" class="avatar avatar-sm btn p-0 btn-edit-nurse-station" aria-label="Edit nurseStation" data-action="edit" data-id="${nurseStationId}"  data-floor-id="${floorId}">
   <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
      <i class="ti ti-edit"></i>
   </span>
</button>
      <button type="button" class="avatar avatar-sm btn p-0 btn-delete-nurse-station" aria-label="Delete nurseStation" data-action="delete" data-id="${nurseStationId}"  data-floor-id="${floorId}">
         <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
            <i class="ti ti-trash"></i>
         </span>
      </button>
   </div>
        </a>
        `;
            });
        } else {
            roomTypesHtml += `
      <div class="list-group-item">
        <p class="text-muted">No nurse stations found for this floor.</p>
      </div>
      `;
        }
        roomTypesHtml += `
    <a class="list-group-item list-group-item-action d-flex justify-content-between"
     id="nurse-station-modal-btn"
     data-floor-id="${floorId}">
     <div class="li-wrapper d-flex justify-content-start align-items-center">
         <div class="avatar avatar-sm me-4">
             <span class="avatar-initial rounded-circle bg-primary">
                 <i class="ti ti-circle-plus"></i>
             </span>
         </div>
         <div class="list-content">
             <h6 class="mb-1">Add New Nurse Station</h6>
         </div>
     </div>
    </a>
    </div>
    </div>
    `;
        $("#room-list").append(roomTypesHtml);
        $("#room-list").show();
    }
}

function refreshNurseStationDetails(nurseStationId) {
    const floorData = $("#floor-list-group").data("floor-data");
    let selectedNurseStation = null;
    for (const floor of floorData) {
        if (floor.nurse_station && floor.nurse_station.length > 0) {
            const station = floor.nurse_station.find(
                (s) => parseInt(s.nurseStationId) === parseInt(nurseStationId),
            );
            if (station) {
                selectedNurseStation = station;
                break;
            }
        }
    }
    if (selectedNurseStation) {
        $("#nurse-station-room-details").empty().show();
        if (
            selectedNurseStation.nurse_station_details &&
            selectedNurseStation.nurse_station_details.length > 0
        ) {
            let roomHtml = '<div class="list-group">';
            selectedNurseStation.nurse_station_details.forEach((detail) => {
                const roomName =
                    detail.room_management?.name_en || "Unnamed Room";
                const roomCount = detail.roomCount || 0;
                const price = detail.price || 0;
                const roomStart = detail.roomStart || "";
                const roomEnd = detail.roomEnd || "";
                const description = detail.description || "";
                roomHtml += `
      <a href="javascript:void(0);"
 class="list-group-item list-group-item-action d-flex justify-content-between align-items-center view-room-details"
 data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
 data-room-management-id="${detail.roomManagementId}">
<div class="d-flex align-items-center">
  <div class="avatar avatar-sm me-3">
    <span class="avatar-initial rounded-circle bg-label-info">
      <i class="ti ti-bed"></i>
    </span>
  </div>
  <div>
    <h6 class="mb-0">${roomName}</h6>
  </div>
</div>
<div class="d-flex align-items-center gap-2">
  <button type="button"
          class="avatar avatar-sm btn p-0 btn-edit-room"
          aria-label="Delete Room"
          title="Delete Room"
          data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
          data-room-management-id="${detail.roomManagementId}">
    <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
      <i class="ti ti-edit"></i>
    </span>
  </button>
  <button type="button"
          class="avatar avatar-sm btn p-0 btn-delete-room"
          aria-label="Delete Room"
          title="Delete Room"
          data-nurse-station-details-id="${detail.nurseStationRoomDetailsId}"
          data-room-management-id="${detail.roomManagementId}">
    <span class="avatar-initial rounded-circle bg-label-secondary d-flex justify-content-center align-items-center">
      <i class="ti ti-trash"></i>
    </span>
  </button>
</div>
</a>
      `;
            });
            roomHtml += "</div>";
            roomHtml += `
    <a class="list-group-item list-group-item-action d-flex justify-content-between add-new-roomType"
   data-nurse-station-id="${nurseStationId}">
   <div class="li-wrapper d-flex justify-content-start align-items-center">
       <div class="avatar avatar-sm me-4">
           <span class="avatar-initial rounded-circle bg-primary">
               <i class="ti ti-circle-plus"></i>
           </span>
       </div>
       <div class="list-content">
           <h6 class="mb-1">Add New Room</h6>
       </div>
   </div>
  </a>
    `;
            $("#nurse-station-room-details").append(roomHtml);
        } else {
            $("#nurse-station-room-details").append(`
    <div class="alert alert-info">
      <div class="d-flex">
        <i class="ti ti-info-circle me-2 mt-1"></i>
        <div>No room details found for this nurse station.</div>
      </div>
    </div>
    <div class="mt-3">
      <button class="btn btn-primary add-room-details-btn" data-nurse-station-id="${nurseStationId}">
        <i class="ti ti-plus me-1"></i>Add Room Details
      </button>
    </div>
    `);
        }
    }
}

$("#floorNameEn").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s-]/g, "");
});

$("#floorNameAr").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF0-9\u0660-\u0669\s-]/g, "");
});

$("#nurseStation_en").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z0-9\s-]/g, "");
});

$("#nurseStation_ar").on("input", function () {
    this.value = this.value.replace(/[^\u0600-\u06FF0-9\u0660-\u0669\s-]/g, "");
});
