$(document).ready(function () {
    $("#admission_and_discharge_main_menu").addClass(
        "active open menu-item-animating",
    );
    $("#admission_n_discharge_preadmission_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#gender").selectpicker();

    $("#apointmentSchedulingModal").on("hidden.bs.modal", function () {
        $("#flexSwitchCheckDefault").prop("checked", false);
    });

    flatpickr("#birthDate", {
        dateFormat: "d-m-Y",
        allowInput: false,
        maxDate: "today"
    });

    flatpickr("#surgeryDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
        minDate: "today",
    });

    flatpickr(".timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
    });

    // Initialize the Flatpickr time picker
    flatpickr("#flatpickr-time-start", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false, // Set to true for 24-hour format
    });

    flatpickr("#flatpickr-time-end", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: false, // Set to true for 24-hour format
    });

    $("#pre_admission_save_btn").click(function () {
        // Serialize data from all forms
        var preAdmissionFormData = $("#preadmission_form").serialize();
        $("#loader-overlay").show();
        // AJAX request
        $.ajax({
            url: BASE_URL + "/admission-and-discharge/preadmission",
            type: "POST",
            data: preAdmissionFormData,
            success: function (response) {
                 $("#loader-overlay").hide();
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
            error: function (xhr, status, error) {
                $("#loader-overlay").hide();
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $(".error-text").text("");
                    $.each(errors, function (key, value) {
                        $("." + key + "_error").text(value[0]);
                    });
                } else {
                    console.error("Error:", xhr);
                }
            },
        });
    });

    $(".serviceName").select2({
        // placeholder: 'Select Service',
        // allowClear: true,
        ajax: {
            url: function () {
                return (
                    BASE_URL +
                    "/get-services-by-provider-with-individual/" +
                    $("#employeeId").val()
                );
            },
            dataType: "json",
            delay: 250,
            data: function (params) {
                var employee = $("#employeeId").val();
                if (!employee) {
                    $("#serviceName")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html(
                            '<span class="text-danger">Please select a provider</span>',
                        );
                    return {
                        search: params.term,
                    };
                } else {
                    $("#serviceName")
                        .next(".select2-container")
                        .find(".select2-selection__rendered")
                        .html("");
                    return {
                        search: params.term,
                    };
                }
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data, function (text, id) {
                        return {
                            id: id,
                            text: text,
                        };
                    }),
                };
            },
            cache: true,
        },
    });

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }

        var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" +
            repo.text +
            "</div>";

        markup += "</div></div>";

        return markup;
    }

    function formatRepoSelection(repo) {
        return repo.text || repo.id;
    }

    function formatSearch(repo) {
        if (!repo.id) {
            return repo.text;
        }
        return $(
            `<div>
                <strong>${repo.text}</strong><br>
                <small>Mobile: ${repo.clientMobile} | ID: ${repo.clientIdNational} | MRN: ${repo.id} </small>
            </div>`,
        );
    }

    function formatSearchSelection(repo) {
        return repo.text || repo.id;
    }

    // $("#IDNational").select2({
    $("#IDNational").select2("destroy");
    $("#IDNational")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#IDNational").parent(),
            width: "100%",
            placeholder: "Search ID National",
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url: BASE_URL + "/search-patient-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        clientIdNational: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatSearch,
            templateSelection: formatSearchSelection,
        });

    // $("#searchmobile").select2({
    $("#searchmobile").select2("destroy");
    $("#searchmobile")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#searchmobile").parent(),
            width: "100%",
            placeholder: "Search Mobile",
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url: BASE_URL + "/search-patient-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        clientMobile: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatSearch,
            templateSelection: formatSearchSelection,
        });

    $("#IDNational").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    $("#searchmobile").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    $("#searchname").on("select2:select", function (e) {
        $("#loader-overlay").show();
        getPatientById(e.params.data.id);
    });

    // $("#searchname").select2({
    $("#searchname").select2("destroy");
    $("#searchname")
        .wrap('<div class="position-relative"></div>')
        .select2({
            dropdownParent: $("#searchname").parent(),
            width: "100%",
            placeholder: "Search Name",
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url: BASE_URL + "/search-patient-by-query",
                dataType: "json",
                delay: 250,
                data: function (params) {
                    return {
                        clientName: params.term,
                    };
                },
                processResults: function (data) {
                    return {
                        results: data,
                    };
                },
                cache: true,
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: formatSearch,
            templateSelection: formatSearchSelection,
        });
});

function getPatientById(selectedId) {
    $.ajax({
        url: BASE_URL + "/get-patient-by-id",
        type: "GET",
        data: {
            clientId: selectedId,
        },
        success: function (response) {
            if (!response.status) {
                $("#loader-overlay").hide();
                return;
            }
            const client = response.data.client;
            console.log(client);
            $("#clientName_en").val(client.clientName_en);
            $("#secondName_en").val(client.secondName_en);
            $("#thirdName_en").val(client.thirdName_en);
            $("#fourthName_en").val(client.fourthName_en);
            $("#clientName").val(client.clientName);
            $("#secondName_ar").val(client.secondName_ar);
            $("#thirdName_ar").val(client.thirdName_ar);
            $("#fourthName_ar").val(client.fourthName_ar);
            $("#clientId").val(client.clientId);
            $("#mobile").val(
                client.mobile.startsWith("+")
                    ? client.mobile.substring(1)
                    : client.mobile,
            );
            console.log(client.birthDate);
            function to(dateStr) {
                if (!dateStr) return "";
                let parts = dateStr.split("-");
                if (parts[0].length === 4) {
                    return parts.reverse().join("-");
                }
                return dateStr; 
            }

            let formattedDate = to(client.birthDate);

            if ($("#birthDate")[0]._flatpickr) {
                $("#birthDate")[0]._flatpickr.setDate(formattedDate, true, "d-m-Y");
            } else {
                $("#birthDate").val(formattedDate);
            }

            $("#gender").val(client.gender).trigger("change");
            $("#idNational").val(client.idNational ?? "");
            $("#clientId").val(client.clientId);
            $("#loader-overlay").hide();
        },
        error: function (xhr, status, error) {
            $("#loader-overlay").hide();
            console.error(error);
        },
    });
}

// function normalizeGender(gender) {
//     if (!gender) return 'other';

//     gender = gender.toLowerCase().trim();

//     if (gender.includes("male")) return "male";
//     if (gender.includes("female")) return "female";

//     // All other cases mapped to 'other'
//     return "other";
// }