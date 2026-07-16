@extends('layouts.backendlayouts')
@section('content')
<link rel="stylesheet" href="{{ asset('assets/vendor/libs/flatpickr/flatpickr.css') }}" />
<link rel="stylesheet" href="{{ asset('assets/vendor/libs/select2/select2.css') }}" />
<link rel="stylesheet" href="{{ asset('assets/vendor/libs/bootstrap-select/bootstrap-select.css') }}" />
<div class="row">
    <div class="col-xl">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Super Admin</h5>
                <div>
                    <a href="{{ route('authuser.index') }}" class="btn btn-primary">Back</a>
                    <a href="" class="btn btn-primary">Submit</a>
                </div>
            </div>
            <div class="card-body">
                <form id="superAdminForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="first_name_en">First Name (EN)</label>
                            <input type="text" class="form-control" id="first_name_en" name="first_name_en" placeholder="First Name" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label labe" for="last_name_en">Last Name (EN)</label>
                            <input type="text" class="form-control" id="last_name_en" name="last_name_en" placeholder="Last Name" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="first_name_ar">First Name (AR)</label>
                            <input type="text" class="form-control" id="first_name_ar" name="first_name_ar" placeholder="First Name Arabic" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="last_name_ar">Last Name (AR)</label>
                            <input type="text" class="form-control" id="last_name_ar" name="last_name_ar" placeholder="Last Name Arabic" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="username">Username</label>
                            <input type="text" class="form-control" id="username" name="username" placeholder="Username" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="mobile_number">Mobile Number</label>
                            <input type="text" class="form-control" id="mobile_number" name="mobile_number" placeholder="Mobile Number" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="email">Email Address</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="Email Address" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="nationality">Nationality</label>
                            <input type="text" class="form-control" id="nationality" name="nationality" placeholder="Nationality" />
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="gender">Gender</label>
                            <select id="gender" name="gender" class="form-select selectpicker" data-allow-clear="true" data-container="body" data-style="btn-default" data-width="100%">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label" for="join_date">Join Date</label>
                            <input type="text" class="form-control" id="join_date" name="join_date" placeholder="dd-mm-yyyy" />
                        </div>
                    </div>
                   
                </form>
            </div>
        </div>
    </div>
</div>


@endsection

@section('page-script')
<script src="{{ asset('assets/vendor/libs/flatpickr/flatpickr.js') }}"></script>
<script src="{{ asset('assets/vendor/libs/bootstrap-select/bootstrap-select.js') }}"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        flatpickr("#join_date", {
            dateFormat: "d-m-Y"
        });
        $('.selectpicker').selectpicker();
    });
</script>
<script src="{{ asset('modules/backend/js/Product Management/category.js') }}"></script>
<script src="../../assets/vendor/libs/apex-charts/apexcharts.js"></script>
<script src="../../assets/js/main.js"></script>
<script src="../../assets/js/cards-statistics.js"></script>
@endsection