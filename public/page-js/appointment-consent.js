$(function () {
    $("#appointment_main_menu").addClass("active open menu-item-animating");
    $("#appointmrent_report_sub_menu").addClass("active");
    
    
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });


    $(".in-Patient-card").click(function () {
        var formData = new FormData($("#yourFormId")[0]);
    
        var reservationId = $("#reservationId").val();
        var consentId = $(this).find("input").val();
        // alert(consentId);
        // var name = $(this).text().trim(); 
    
        formData.append("consentId", consentId);
        formData.append("reservationId", reservationId);
    
        $.ajax({
            url: BASE_URL + "/fetch-card-details",  
            type: "POST",  
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            success: function (response) {
                if (response.status === true) {
                    // alert(response.designflag);
                   if(response.designflag === 'true') {
                    window.location.href = BASE_URL + '/form-viewer/' + response.consentId +'/' + response.reservationId;
                   }
                   else{
                    Swal.fire({
                        icon: 'error',
                        text: 'Clicked form is not created yet.',
                        customClass: {
                            confirmButton: 'btn btn-danger waves-effect waves-light',
                        },
                    });
                   }
                } else {
                    
                    Swal.fire('Error', 'There was an issue fetching the Word file.', 'error');
                }
            },
            error: function (xhr) {
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
    
    

    
    $('#save-form').click(function(event) {
        event.preventDefault();
    
        var formData = $('#formcontent').serializeArray(); // Serialize form fields
        var data = {};
    
        var consentId = $("#consentId").val();
        var reservationId = $("#reservationId").val();
    
       
        var canvas = document.getElementById("signatureCanvas");
        var signatureData = "";
    
        if (canvas) { 
            signatureData = canvas.toDataURL("image/png");
        }
    
        data['consentId'] = consentId;
        data['reservationId'] = reservationId;
        data['signature'] = signatureData; 
    
        $.each(formData, function(i, field) {
            var title = $('#' + field.name).attr('title');
            if (title) {
                data[title] = field.value;  
            } else {
                data[field.name] = field.value;  
            }
        });
    
        $.ajax({
            url: BASE_URL + '/form-submit', 
            type: 'POST',
            data: data,  
            success: function(response) {
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                }).then(function () {
                    submitConsent(data);
                    
                });
            },
            error: function(xhr, status, error) {
                console.error('Form submission failed!', error);
            }
        });
    });
    
    
    
    
    function submitConsent(data) {
        showLoader()
        $.ajax({
            url: '/form-to-powerautomate',
            method: 'POST',
            data: { data: data },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            success: function(response) {
                hideLoader()
                Swal.fire({
                    icon: "success",
                    text: response.message,
                    customClass: {
                        confirmButton: "btn btn-success waves-effect waves-light",
                    },
                    
                }).then(function () {
                window.location.href = BASE_URL + '/word-display/' + encodeURIComponent(response.filename);

                });
            },
            error: function(xhr, status, error) {
                hideLoader()
                Swal.fire({
                    icon: "error",
                    text: 'There is no Power Automate flow, Please create one.',
                    customClass: {
                        confirmButton: "btn btn-danger waves-effect waves-light",
                    },
                })
            }
        });
    }
    
    
   
    
   
    
    
    
    // $('#consentsaveBtn1').click(function (e) {
    //     e.preventDefault();
    
    //     let name = $('#name').val();
    //     let number = $('#number').val();
    //     let token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IjNzc0xLcEd1UmRNYVJLV2x2N3ExOUhYeFUyUnVOWDRjWWV1cHJsZnB3RnMiLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zNzcyMjA5OC1jMDRlLTQ2NmItYTA5MS04NmU5YzljNDNiZDYvIiwiaWF0IjoxNzM5MTY4MzcyLCJuYmYiOjE3MzkxNjgzNzIsImV4cCI6MTczOTE3MjI3MiwiYWlvIjoiazJSZ1lHQ1VOSDY1dEtZOWRxcUErVnYrZTArL0FRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJ3b3JkMyIsImFwcGlkIjoiNGRmMmJiNTItZTk0NC00YjRjLWE2ZjUtMmEzZTVjODMxNzFlIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMzc3MjIwOTgtYzA0ZS00NjZiLWEwOTEtODZlOWM5YzQzYmQ2LyIsImlkdHlwIjoiYXBwIiwib2lkIjoiNTZmY2I2NDUtNjhjYi00MDkyLWI0MjYtNmZkNGRlNDZkMzgxIiwicmgiOiIxLkFVOEFtQ0J5TjA3QWEwYWdrWWJweWNRNzFnTUFBQUFBQUFBQXdBQUFBQUFBQUFCUEFBQlBBQS4iLCJyb2xlcyI6WyJTaXRlcy5SZWFkLkFsbCIsIlNpdGVzLlJlYWRXcml0ZS5BbGwiLCJGaWxlcy5SZWFkV3JpdGUuQWxsIiwiVXNlci5SZWFkLkFsbCIsIkZpbGVzLlJlYWQuQWxsIl0sInN1YiI6IjU2ZmNiNjQ1LTY4Y2ItNDA5Mi1iNDI2LTZmZDRkZTQ2ZDM4MSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjM3NzIyMDk4LWMwNGUtNDY2Yi1hMDkxLTg2ZTljOWM0M2JkNiIsInV0aSI6IjVyb3NqSTdZQ1VPRW9TOVF1eTg1QVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfaWRyZWwiOiI3IDE0IiwieG1zX3RjZHQiOjE2NDYxNTY1Mjl9.BTq6r0dqzuCKzzf1L1X9mjneIeTxux-J17t3cfTtKv2s6uj_Ur59JZvPhhPh_HXE7Tw-cod8BOP6u_-tauni_bWAVs7QTb2lFbFTMD2XuIVDl79EBZ7E9CIQtJdrCJeFDInn9WJvXt21N05DpuAZCTkJIs9xBnx787ZE9Rso4MD_MziP2MLHv8NIlQ_HODXNaVDlJoq44GpRb17D8wKvQQwLg4mtKjs3jJdFRyJLfE34cla7HTQEEsQarwb0q3kL0oPlVJe3H3uXk7AykmXy7BczcXI48u2PwbQn8YRZ-RG90gL2K4AqrUT5BuqNat63UzsNKPtSQClBZsTDmjcI9Q'; // Ensure this is the correct file ID
    //     let fileid = "01JQXJSXHYWGWWS62MERH33YQJZKQFGGJR";
    //     $.ajax({
    //         url: 'https://prod-38.westeurope.logic.azure.com:443/workflows/d88f44edc9a14949aa92ff184261134c/triggers/manual/paths/invoke?api-version=2016-06-01', 
    //         method: 'POST',
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //             name: name,
    //             number: number,
    //             fileid: fileid,
    //             token: token ,
    //         }),
    //         success: function(response) {
    //             console.log(response);
    //             alert(response.message); // Show success message
    //         },
    //         error: function(xhr, status, error) {
    //             alert('Error: ' + error);
    //         }
    //     });
    // });
    
    
    // $('#consentsaveBtn1').click(function (e) {
    //     e.preventDefault();
        
        
    
    //     Swal.fire({
    //         icon: 'success',
    //         text: "Form saved successfully",
    //         customClass: {
    //             confirmButton: 'btn btn-success waves-effect waves-light',
    //         }
    //     }).then(() => {
    //         showLoader()
    //     });
    
    //     let name = $('#name').val();
    //     let number = $('#number').val();
    //     let filename = $('#filename').val();
   
    //     let canvas = document.getElementById("signatureCanvas");
    //     let signatureImage = canvas.toDataURL("image/png");
    
    //     let base64Signature = signatureImage.replace(/^data:image\/(png);base64,/, "");
    
    //     $.ajax({
    //         url: '/submit-consent',
    //         method: 'POST',
    //         data: {
    //             name: name,
    //             number: number,
    //             filename: filename,
    //             signature: base64Signature 
    //         },
    //         headers: {
    //             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    //         },
            
    //         success: function(response) {
    //             window.location.href = BASE_URL + '/word-display/' + encodeURIComponent(response.filename);
    //         },
            
    //         error: function(xhr, status, error) {
    //             alert('Error: ' + error);
    //         }
    //     });
    // });
    
    
    
    
    function showLoader() {
        document.querySelector('.loader-wrapper').style.display = 'flex';
      }
    
      function hideLoader() {
        document.querySelector('.loader-wrapper').style.display = 'none';
      }
    
    
    // $('#consentsaveBtn1').click(function (e) {
    //     e.preventDefault();
    
    //     let name = $('#name').val();
    //     let number = $('#number').val();
    //     let filename = $('#filename').val();
    
    //     console.log("Submitting Consent - Name:", name);
    //     console.log("Submitting Consent - Filename:", filename);
    
    //     $.ajax({
    //         url: '/submit-consent',
    //         method: 'POST',
    //         data: {
    //             name: name,
    //             number: number,
    //             filename: filename,
    //         },
    //         headers: {
    //             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    //         },
    //         success: function(response) {
    //             console.log("Consent Submitted - Response:", response);
    
    //             // alert(response.message);
    
    //             if (response.fileName && response.name) {
    //                 uploadFileToMicrosoft(response.fileName, response.name);
    //             } else {
    //                 alert("Error: Missing fileName or name in response.");
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             alert('Error: ' + error);
    //         }
    //     });
    // });
    
    // function uploadFileToMicrosoft(fileName, name) {
    //     console.log("Uploading to Microsoft - FileName:", fileName, "Name:", name);
    
    //     $.ajax({
    //         url: '/upload-to-microsoft',
    //         method: 'POST',
    //         data: { 
    //             fileName: fileName,
    //             name: name
    //         },
    //         headers: {
    //             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    //         },
    //         success: function(response) {
                
    
    //             window.location.href = BASE_URL + '/view-word/' + response.fileName;
    //         },
    //         error: function(xhr, status, error) {
    //             alert('Error uploading to Microsoft: ' + error);
    //         }
    //     });
    // }


// sign clearing
    document.getElementById("clearBtn").setAttribute("type", "button");
  


});

// $(document).ready(function () {
//     $("#appointment_consent").click(function () {
        
//     });
// });






