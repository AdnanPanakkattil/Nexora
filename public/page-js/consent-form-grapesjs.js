$(function () {
    $("#settings_main_menu").addClass("active open menu-item-animating");
    $("#consent_form_sub_menu").addClass("active");

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $("#powerAutomateFlowDownload").click(function () {
        window.location.href = BASE_URL + "/download-flow";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var existingDesign = document.getElementById("existing-design").value;
    var editor = grapesjs.init({
        container: "#gjs",
        height: "100vh",
        width: "auto",
        fromElement: true,
        storageManager: false,
        pluginsOpts: {
            "grapesjs-plugin-forms": {},
        },
    });

    const clientDetails = [
        { id: "{reservationClientId}", label: "Client ID" },
        { id: "{reservationMobile}", label: "Mobile" },
        { id: "{reservationStatus}", label: "Status" },
        { id: "{reservationAppointmentDate}", label: "Appointment Date" },
        { id: "{reservationTotalDuration}", label: "Total Duration" },
        { id: "{reservationTotalCost}", label: "Total Cost" },
        { id: "{reservationPaymentType}", label: "Payment Type" },
        { id: "{reservationSource}", label: "Source" },
        { id: "{reservationFeedbackId}", label: "Feedback ID" },
        { id: "{reservationRejectReason}", label: "Reject Reason" },
        { id: "{reservationCancelReason}", label: "Cancel Reason" },
        { id: "{reservationRateNotified}", label: "Rate Notified" },
        { id: "{reservationPaid}", label: "Paid" },
        { id: "{reservationModified}", label: "Modified" },
        { id: "{reservationDeleted}", label: "Deleted" },
        { id: "{reservationFixed}", label: "Fixed" },
        {
            id: "{reservationPartiallyPaidAmount}",
            label: "Partially Paid Amount",
        },
        { id: "{reservationIsCheckup}", label: "Is Checkup" },
        { id: "{reservationBalanceAmount}", label: "Balance Amount" },
        {
            id: "{reservationPartiallyPercentage}",
            label: "Partially Percentage",
        },
        { id: "{reservationVatNetCost}", label: "VAT Net Cost" },
        { id: "{reservationIsPartiallyRecord}", label: "Is Partially Record" },
        { id: "{reservationPartnerCommission}", label: "Partner Commission" },
        { id: "{reservationType}", label: "Reservation Type" },
        { id: "{reservationIsSession}", label: "Is Session" },
        { id: "{reservationIsOpenTicket}", label: "Is Open Ticket" },
        { id: "{reservationIsFirstRate}", label: "Is First Rate" },
        { id: "{reservationIsRefund}", label: "Is Refund" },
        {
            id: "{reservationWithAppointmentTime}",
            label: "With Appointment Time",
        },
        {
            id: "{reservationOfflinePaymentType}",
            label: "Offline Payment Type",
        },
        { id: "{reservationNote}", label: "Note" },
        { id: "{reservationIsMultiService}", label: "Is Multi Service" },
        { id: "{reservationClinicId}", label: "Clinic ID" },
        { id: "{reservationCreatedEmployeeId}", label: "Created Employee ID" },
        { id: "{reservationAbsentCount}", label: "Absent Count" },
        { id: "{reservationRemainingStatus}", label: "Remaining Status" },
        {
            id: "{reservationIsManualAppointment}",
            label: "Is Manual Appointment",
        },
        { id: "{reservationFromNatmcoApp}", label: "From Natmco App" },
        { id: "{reservationSendReminder}", label: "Send Reminder" },
        { id: "{reservationNatmcoAppResponse}", label: "Natmco App Response" },
        { id: "{reservationWithSession}", label: "With Session" },
        {
            id: "{reservationSessionBalanceCount}",
            label: "Session Balance Count",
        },
        { id: "{reservationIsNeedVat}", label: "Is Need VAT" },
        { id: "{reservationApprovalNumber}", label: "Approval Number" },
        { id: "{reservationSplCase}", label: "Special Case" },
        { id: "{reservationActionStatus}", label: "Action Status" },
        { id: "{reservationAffectedId}", label: "Affected ID" },
        { id: "{reservationFitOrUnfit}", label: "Fit or Unfit" },
        { id: "{reservationFinancialCategory}", label: "Financial Category" },
        { id: "{reservationVisitType}", label: "Visit Type" },
        { id: "{reservationPatientType}", label: "Patient Type" },
        {
            id: "{reservationInsuranceApprovalNumber}",
            label: "Insurance Approval Number",
        },
        { id: "{reservationInsuranceReason}", label: "Insurance Reason" },
        {
            id: "{reservationInsuranceCategoryId}",
            label: "Insurance Category ID",
        },
        { id: "{reservationSignatureImage}", label: "Signature Image" },
        { id: "{reservationEsign}", label: "E-Sign" },
        { id: "{reservationTypeOfConsent}", label: "Type of Consent" },
        { id: "{reservationEliteMode}", label: "Elite Mode" },
        { id: "{reservationEmployeeId}", label: "Employee ID" },
        { id: "{reservationPolicyId}", label: "Policy ID" },
        { id: "{reservationClaimType}", label: "Claim Type" },
        { id: "{reservationRemainingStatusId}", label: "Remaining Status ID" },
        { id: "{reservationGovtNo}", label: "Government Number" },
        { id: "{reservationClientNameAr}", label: "Client Name Ar" },
        { id: "{reservationInsurance}", label: "Insurance" },
        { id: "{reservationBirthDate}", label: "Birth Date" },
        { id: "{reservationOccupation}", label: "Occupation" },
        { id: "{reservationClientEmail}", label: "Client Email" },
        { id: "{reservationComments}", label: "Comments" },
        { id: "{reservationPassword}", label: "Password" },
        { id: "{reservationDistrictId}", label: "District ID" },
        { id: "{reservationLat}", label: "Latitude" },
        { id: "{reservationLng}", label: "Longitude" },
        { id: "{reservationLang}", label: "Language" },
        { id: "{reservationDeviceToken}", label: "Device Token" },
        { id: "{reservationVerifyCode}", label: "Verify Code" },
        { id: "{reservationVerified}", label: "Verified" },
        { id: "{reservationForgotCode}", label: "Forgot Code" },
        { id: "{reservationLastSms}", label: "Last SMS" },
        { id: "{reservationSmsTimes}", label: "SMS Times" },
        { id: "{reservationActive}", label: "Active" },
        { id: "{reservationDeleted}", label: "Deleted" },
        { id: "{reservationCreatedAt}", label: "Created At" },
        { id: "{reservationUpdatedAt}", label: "Updated At" },
        { id: "{reservationLastModify}", label: "Last Modify" },
        { id: "{reservationOs}", label: "OS" },
        { id: "{reservationApnsToken}", label: "APNS Token" },
        { id: "{reservationGender}", label: "Gender" },
        {
            id: "{reservationSecondMobileNumber}",
            label: "Second Mobile Number",
        },
        { id: "{reservationNationalityId}", label: "Nationality ID" },
        { id: "{reservationClientNameEn}", label: "Client Name EN" },
        { id: "{reservationReligion}", label: "Religion" },
        { id: "{reservationArea}", label: "Area" },
        { id: "{reservationIdNational}", label: "ID National" },
        { id: "{reservationCityId}", label: "City ID" },
    ];

    // Define the custom Input component
    editor.Components.addType("input", {
        isComponent: (el) => el.tagName === "INPUT",
        model: {
            defaults: {
                traits: [
                    "name",
                    "placeholder",
                    {
                        type: "select",
                        name: "value",
                        label: "Value",
                        options: clientDetails,
                    },

                    {
                        type: "select",
                        name: "value",
                        label: "Value",
                        options: "FDFG",
                    },
                    {
                        type: "select",
                        name: "type",
                        label: "Type",
                        options: [
                            { id: "text", label: "Text" },
                            { id: "email", label: "Email" },
                            { id: "password", label: "Password" },
                            { id: "number", label: "Number" },
                        ],
                    },
                    {
                        type: "checkbox",
                        name: "required",
                        label: "Required",
                    },
                ],
                attributes: { type: "text", required: false }, // Default attributes
            },
        },
    });

    editor.Components.addType("textarea", {
        isComponent: (el) => el.tagName === "TEXTAREA",
        model: {
            defaults: {
                traits: [
                    "name",
                    "placeholder",
                    // 'value',
                    {
                        type: "select",
                        name: "value",
                        label: "Value",
                        options: clientDetails,
                    },

                    {
                        type: "select",
                        name: "type",
                        label: "Type",
                        options: [
                            { id: "text", label: "Text" },
                            { id: "email", label: "Email" },
                            { id: "password", label: "Password" },
                            { id: "number", label: "Number" },
                            { id: "textarea", label: "Textarea" },
                        ],
                    },
                    {
                        type: "checkbox",
                        name: "required",
                        label: "Required",
                    },
                ],
                attributes: { type: "text", required: false }, // Default attributes
            },
        },
    });

    editor.Components.addType("canvas", {
        isComponent: (el) => el.tagName === "CANVAS",
        model: {
            defaults: {
                traits: [
                    "name",
                    "placeholder",
                    "value",
                    {
                        type: "select",
                        name: "type",
                        label: "Type",
                        options: [
                            { id: "text", label: "Text" },
                            { id: "email", label: "Email" },
                            { id: "password", label: "Password" },
                            { id: "number", label: "Number" },
                        ],
                    },
                    {
                        type: "checkbox",
                        name: "required",
                        label: "Required",
                    },
                ],
                attributes: { type: "text", required: false }, // Default attributes
            },
        },
    });

    // Load existing HTML into GrapesJS AFTER registering components
    if (existingDesign) {
        editor.setComponents(existingDesign);

        // Ensure component models update
        setTimeout(() => {
            editor.getComponents().each((comp) => {
                if (comp.get("tagName") === "input") {
                    comp.set({ type: "input" });
                }
            });
        }, 100);
    }

    // Add component to the Blocks Panel
    editor.BlockManager.add("custom-link-block", {
        label: "Custom Link",
        category: "Basic",
        content: { type: "custom-link" },
    });

    // Register the component in the Blocks Panel
    editor.BlockManager.add("custom-link-block", {
        label: "Custom Link",
        content: {
            type: "custom-link",
            attributes: {
                href: "https://example.com",
                title: "Click here",
                target: "_blank",
            },
            content: "Click Me",
        },
        category: "Links",
    });

    const commonStyles = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
`;

    editor.BlockManager.add("form-block", {
        label: "Form Container",
        category: "Forms",
        content: `
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" name="name" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email"  class="form-control">
                    </div>
                    <button type="submit" class="btn btn-success">Submit</button>
                  `,
    });

    editor.BlockManager.add("aligned-form", {
        label: "Aligned Form",
        category: "Forms",
        content: `
             ${commonStyles}
          
            <div class="m-4">
            <div class="d-flex justify-content-between mb-4" >
                <h4 class="primarycol  mb-3">Form</h4>
            <button id="save-form" class="btn btn-primary mt-3">Save Form</button>
            </div>
        <div class="row g-6 gap ">
            <div class="col-sm-3 mb-3">
                <label class="form-label " for="username" >First Name English <span style="color: red;">*</span></label>
                <input type="text" id="clientName_en" name="clientName_en" class="form-control  clientName_en"  />
                <span class="text-danger error-text clientName_en_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Second Name English</label>
                <input type="text" id="secondName_en" name="secondName_en" class="form-control  "  />
                <span class="text-danger error-text secondName_en_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Third Name English</label>
                <input type="text" id="thirdName_en" name="thirdName_en" class="form-control  thirdName_en"  />
                <span class="text-danger error-text thirdName_en_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Fourth Name English</label>
                <input type="text" id="fourthName_en" name="fourthName_en" class="form-control  fourthName_en"  />
                <span class="text-danger error-text fourthName_en_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >First Name Arabic</label>
                <input type="text" id="clientName" name="clientName" class="form-control  clientName"  />
                <span class="text-danger error-text clientName_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Second Name Arabic</label>
                <input type="text" id="secondName_ar" name="secondName_ar" class="form-control  secondName_ar"  />
                <span class="text-danger error-text secondName_ar_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Third Name Arabic</label>
                <input type="text" id="thirdName_ar" name="thirdName_ar" class="form-control  thirdName_ar"  />
                <span class="text-danger error-text thirdName_ar_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="username" >Fourth Name Arabic</label>
                <input type="text" id="fourthName_ar" name="fourthName_ar" class="form-control  fourthName_ar"  />
                <span class="text-danger error-text fourthName_ar_error"></span>
            </div>

            <div class="col-sm-3 mb-3">
                <label for="gender" class="form-label label-required" >Sex</label>
                <select class="form-select  gender" id="gender" name="gender">
                    <option selected> select </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Others</option>
                </select>
                <span class="text-danger error-text gender_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label label-required" for="mobile" >Mobile Number</label>
                <input type="text" id="mobile" name="mobile" class="form-control  mobile"  />
                <span class="text-danger error-text mobile_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label" for="username" >Home Telephone</label>
                <input type="text" id="home_telephone" name="home_telephone" class="form-control  home-telephone"  />
                <span class="text-danger error-text home_telephone_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label for="marital_status " class="form-label" >Marital
                    Status</label>
                <select class="form-select  status" name="status" id="status">
                    <option> Open this select menu</option>
                    <option value="married"> Married </option>
                    <option value="single"> Single </option>
                    <option value="divorced"> Divorced </option>
                    <option value="widow"> Widow </option>
                </select>
                <span class="text-danger error-text status_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label for="religion" class="form-label" >Religion</label>
                <select class="form-select  religion" name="religion" id="religion" aria-label="Default select example">
                    <option> Open this select menu </option>
                    <option value="islam"> Islam </option>
                    <option value="christianity"> Christian </option>
                    <option value="hinduism"> Hindu </option>
                    <option value="other"> Other </option>
                </select>
                <span class="text-danger error-text religion_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label for="email" class="form-label" >Email
                    address</label>
                <input type="email" class="form-control clientEmail" id="clientEmail" name="clientEmail"  />
                <span class="text-danger error-text clientEmail_error"></span>
            </div>
            
            
            </div>
    `,
    });

    editor.BlockManager.add("select-dropdown", {
        label: "Select Dropdown",
        content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
    
            <div class="col-sm-3 mb-3">
                <label class="form-label">Select</label>
                <select class="form-select">
                    <option selected>Open this select menu</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                </select>
            </div>
        `,
    });

    editor.BlockManager.add("Text", {
        label: "Text",
        category: "Forms",
        content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">

           
            
             

            <div class="m-4">
            <div class="d-flex justify-content-between align-items-center text-center mb-4" >
         <h4 class="primarycol  mb-3">Form</h4>
    <button id="save-form" class="btn btn-primary mt-3">Save Form</button>
    </div>
        <div class="row g-6 gap ">
            <div class="col-sm-3 mb-3">
                <label class="form-label labez" for="username" >First Name English <span style="color: red;">*</span></label>
                <input type="text" id="clientName_en" name="clientName_en" class="form-control  clientName_en" />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Second Name English</label>
                <input type="text" id="secondName_en" name="secondName_en" class="form-control  secondName_en"  />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Third Name English</label>
                <input type="text" id="thirdName_en" name="thirdName_en" class="form-control  thirdName_en" />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Fourth Name English</label>
                <input type="text" id="fourthName_en" name="fourthName_en" class="form-control  fourthName_en"  />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >First Name Arabic</label>
                <input type="text" id="clientName" name="clientName" class="form-control  clientName"  />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Second Name Arabic</label>
                <input type="text" id="secondName_ar" name="secondName_ar" class="form-control  secondName_ar"  />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Third Name Arabic</label>
                <input type="text" id="thirdName_ar" name="thirdName_ar" class="form-control  thirdName_ar"  />
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="username" >Fourth Name Arabic</label>
                <input type="text" id="fourthName_ar" name="fourthName_ar" class="form-control  fourthName_ar"  />
            </div>

            <div class="col-sm-3 mb-3">
                <label for="gender" class="form-label labez label-required" >Sex</label>
                <select class="form-select  gender" id="gender" name="gender">
                    <option selected> select </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Others</option>
                </select>
                <span class="text-danger error-text gender_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez label-required" for="mobile" >Mobile Number</label>
                <input type="text" id="mobile" name="mobile" class="form-control  mobile"  />
                <span class="text-danger error-text mobile_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label class="form-label labez" for="username" >Home Telephone</label>
                <input type="text" id="home_telephone" name="home_telephone" class="form-control  home-telephone"  />
                <span class="text-danger error-text home_telephone_error"></span>
            </div>
            <div class="col-sm-3 mb-3">
                <label for="marital_status labez " class="form-label" >Marital
                    Status</label>
                <select class="form-select  status" name="status" id="status">
                    <option> Open this select menu</option>
                    <option value="married"> Married </option>
                    <option value="single"> Single </option>
                    <option value="divorced"> Divorced </option>
                    <option value="widow"> Widow </option>
                </select>
                <span class="text-danger error-text status_error"></span>
            </div>
            <div class="col-6 mb-3">
                <label class="form-label labez label-required" for="thirdName_ar" >Third Name Arabic</label>
                <textarea id="thirdName_ar" name="thirdName_ar" class="form-control thirdName_ar"  rows="3"></textarea>
                <span class="text-danger error-text thirdName_ar_error"></span>
            </div>

            <div class="row text-center d-flex justify-content-center mt-12 mb-12">
                    <div class="col-6">
                        <label class="form-label labez" for="username">E-Sign:</label>
                        <div class="js-signature" data-width="700" data-height="100" data-border="1px solid black" data-auto-fit="true">
                            <canvas id="signatureCanvas" width="700" height="200"></canvas>
                        </div>
                    </div>

                    <p>
                        <button id="clearBtn" class="mt-2 btn btn-secondary" onclick="clearCanvas();">Clear Sign</button>
                    </p>
                </div>
            
            </div>
   `,
    });

    const fields = [
        {
            id: "input-text",
            label: "Text Input",
            content: `
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
               <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
 
                <div class="col-sm-3 m-3">
                <label class="form-label " for="" > Name  <span style="color: red;">*</span></label>
                <input type="text" id="" name="" class="form-control  "  />
          
            `,
        },

        {
            id: "input-email",
            label: "Email Input",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
           
             <div class="col-sm-3 m-3">
                <label class="form-label " for="" > email  <span style="color: red;">*</span></label>
                <input type="email" id="" name="" class="form-control  "  />
            </div>
        `,
        },

        {
            id: "textarea",
            label: "Textarea",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">

                <div class="col-6 m-3">
                <label class="form-label label-required"  >text </label>
                <textarea id=""  class="form-control "  rows="3"></textarea>
                <span class="text-danger error-text thirdName_ar_error"></span>
                </div>`,
        },

        {
            id: "checkbox",
            label: "Checkbox",
            content: `<div class="form-check">
                    <input type="checkbox" class="form-check-input" id="checkbox1">
                    <label class="form-check-label" for="checkbox1">Checkbox Option</label>
                  </div>`,
        },
        {
            id: "radio",
            label: "Radio Button",
            content: `<div class="form-check">
                    <input type="radio" class="form-check-input" name="radio-group" id="radio1">
                    <label class="form-check-label" for="radio1">Radio Option</label>
                  </div>`,
        },
        {
            id: "number",
            label: "Number Input",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
           
             <div class="col-sm-3 m-3">
                <label class="form-label " for="" > number  <span style="color: red;">*</span></label>
                <input type="number" id="" name="" class="form-control  "/>
            </div>
        `,
        },
        {
            id: "date",
            label: "Date Picker",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
           
             <div class="col-sm-3 m-3">
                <label class="form-label " for="" > date  <span style="color: red;">*</span></label>
                <input type="date" id="" name="" class="form-control" />
            </div>
        `,
        },

        {
            id: "Save-button",
            label: "Save-button",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">

          <button id="save-form" data-gjs-type="button" draggable="true" type="button" class="btn btn-primary mt-3 gjs-selected" autocomplete="off">Save Form</button>`,
        },

        {
            id: "signature",
            label: "Signature",
            content: `
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
        
                <div class="row text-center d-flex justify-content-center mt-3 mb-3">
                    <div class="col-6">
                        <label class="form-label">E-Sign:</label>
                        <div class="js-signature" style="border: 1px solid black; width: 100%; height: 200px; position: relative;">
                            <canvas id="signatureCanvas" style="width: 100%; height: 100%;"></canvas>
                        </div>
                    </div>
                    <p>
                        <button id="clearBtn" class="btn btn-secondary mt-2">Clear Sign</button>
                    </p>
                </div>
        
                <script>
                    document.addEventListener("DOMContentLoaded", function () {
                        let canvas = document.getElementById("signatureCanvas");
                        let ctx = canvas.getContext("2d");
                        let isDrawing = false;
        
                        // Resize canvas properly
                        function resizeCanvas() {
                            canvas.width = canvas.offsetWidth;
                            canvas.height = canvas.offsetHeight;
                            ctx.lineWidth = 2;
                            ctx.lineJoin = "round";
                            ctx.lineCap = "round";
                            ctx.strokeStyle = "black";
                        }
                        resizeCanvas();
                        window.addEventListener("resize", resizeCanvas);
        
                        function getMousePos(canvas, evt) {
                            let rect = canvas.getBoundingClientRect();
                            return {
                                x: evt.clientX - rect.left,
                                y: evt.clientY - rect.top
                            };
                        }
        
                        canvas.addEventListener("mousedown", function (e) {
                            isDrawing = true;
                            let pos = getMousePos(canvas, e);
                            ctx.beginPath();
                            ctx.moveTo(pos.x, pos.y);
                        });
        
                        canvas.addEventListener("mousemove", function (e) {
                            if (!isDrawing) return;
                            let pos = getMousePos(canvas, e);
                            ctx.lineTo(pos.x, pos.y);
                            ctx.stroke();
                        });
        
                        canvas.addEventListener("mouseup", function () {
                            isDrawing = false;
                        });
        
                        canvas.addEventListener("mouseleave", function () {
                            isDrawing = false;
                        });
        
                        // Touch events for mobile
                        canvas.addEventListener("touchstart", function (e) {
                            let touch = e.touches[0];
                            let pos = getMousePos(canvas, touch);
                            ctx.beginPath();
                            ctx.moveTo(pos.x, pos.y);
                        });
        
                        canvas.addEventListener("touchmove", function (e) {
                            let touch = e.touches[0];
                            let pos = getMousePos(canvas, touch);
                            ctx.lineTo(pos.x, pos.y);
                            ctx.stroke();
                            e.preventDefault(); // Prevent scrolling
                        });
        
                        canvas.addEventListener("touchend", function () {
                            isDrawing = false;
                        });
        
                        document.getElementById("clearBtn").addEventListener("click", function () {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        });
                    });
                </script>
            `,
        },
        {
            id: "heading",
            label: "Heading",
            content: `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">

                <div class="row text-center mb-4">
                    <div class="col-12">
                        <h4 class="mb-3">Heading</h4> 
                    </div>
                </div>
            `,
        },
        {
            id: "label",
            label: "Label",
            content: `
                <div class="form-label">
                    <label for="inputField">Your Label Here</label>
                </div>
            `,
        },
    ];

    fields.forEach((field) => {
        editor.BlockManager.add(field.id, {
            label: field.label,
            category: "Form Elements",
            content: field.content,
        });
    });

    // Grapesjs design saving
    document.getElementById("save-form").addEventListener("click", function () {
        var innerContent = editor.getHtml();
        var cssContent = editor.getCss();

        console.log("Generated HTML:", innerContent);
        console.log("Generated CSS:", cssContent);

        var consentId = document.getElementById("consentId").value;
        var powerAutomateUrl = $("#powerAutomateUrl").val();

        var cleanedContent = innerContent.replace(/<link[^>]*>/g, "");

        cleanedContent = cleanedContent.replace(/<\/?form[^>]*>/g, "");

        var formHtml = `
            <form id="formcontent" action="{{ route('consent.form') }}" method="POST">
                ${cleanedContent}
            </form>
        `;

        var fullContent = `
            <style>${cssContent}</style>
            ${formHtml}
        `;

        fetch("/settings/save-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({
                design: fullContent,
                consentId: consentId,
                powerAutomateUrl: powerAutomateUrl,
            }),
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error("Network response was not ok");
                return response.json();
            })
           .then((data) => {
    Swal.fire({
        icon: "success",
        text: data.message || "Form saved successfully!",
        customClass: {
            confirmButton: "btn btn-success waves-effect waves-light",
        },
    }).then(function () {
        window.history.back(); 
    });
})
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    text: "Failed to save the form. Please try again.",
                    customClass: {
                        confirmButton:
                            "btn btn-danger waves-effect waves-light",
                    },
                });
                console.error("Error:", error);
            });
    });
});
